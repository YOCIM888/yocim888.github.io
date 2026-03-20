// 全局变量
let currentFileId = null;
let isDirty = false;
let autoSaveInterval = null;
let fileList = [];
let selectedAlgorithm = 'xor';

// DOM元素
const editor = document.getElementById('editor');
const fileName = document.getElementById('fileName');
const fileStatus = document.getElementById('fileStatus');
const wordCount = document.getElementById('wordCount');
const charCount = document.getElementById('charCount');
const lineCount = document.getElementById('lineCount');
const cursorPosition = document.getElementById('cursorPosition');
const fileSize = document.getElementById('fileSize');
const fileCount = document.getElementById('fileCount');
const fileListContainer = document.getElementById('fileList');

// 按钮
const newFileBtn = document.getElementById('newFileBtn');
const saveBtn = document.getElementById('saveBtn');
const downloadBtn = document.getElementById('downloadBtn');
const clearBtn = document.getElementById('clearBtn');
const findBtn = document.getElementById('findBtn');
const replaceBtn = document.getElementById('replaceBtn');
const formatBtn = document.getElementById('formatBtn');
const timestampBtn = document.getElementById('timestampBtn');
const encryptBtn = document.getElementById('encryptBtn');
const decryptBtn = document.getElementById('decryptBtn');
const hashBtn = document.getElementById('hashBtn');
const fullscreenBtn = document.getElementById('fullscreenBtn');

// 设置相关
const fontSizeSlider = document.getElementById('fontSizeSlider');
const fontSizeValue = document.getElementById('fontSizeValue');
const autoSaveToggle = document.getElementById('autoSaveToggle');
const themeOptions = document.querySelectorAll('.theme-option');

// 模态框
const findModal = document.getElementById('findModal');
const encryptModal = document.getElementById('encryptModal');
const deleteConfirmModal = document.getElementById('deleteConfirmModal');

// 通知
const notification = document.getElementById('notification');
const notificationText = document.getElementById('notificationText');

// 初始化应用
function initApp() {
    // 加载保存的文件列表
    loadFileList();
    
    // 加载编辑器设置
    loadEditorSettings();
    
    // 设置事件监听器
    setupEventListeners();
    
    // 启动自动保存
    startAutoSave();
    
    // 初始化编辑器状态
    updateEditorStats();
    
    // 显示欢迎消息
    setTimeout(() => {
        showNotification('赛博记事本已就绪 | 系统在线');
    }, 1000);
}

// 加载文件列表
function loadFileList() {
    const savedFiles = localStorage.getItem('cyberNotepad_files');
    if (savedFiles) {
        fileList = JSON.parse(savedFiles);
        updateFileListUI();
    }
}

// 更新文件列表UI
function updateFileListUI() {
    fileListContainer.innerHTML = '';
    
    if (fileList.length === 0) {
        fileListContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-folder-open"></i>
                <p>暂无保存的文件</p>
            </div>
        `;
        fileCount.textContent = '0个文件';
        return;
    }
    
    fileList.forEach((file, index) => {
        const fileItem = document.createElement('div');
        fileItem.className = `file-item ${file.id === currentFileId ? 'active' : ''}`;
        fileItem.innerHTML = `
            <div class="file-info">
                <div class="file-name">${file.name}</div>
                <div class="file-meta">
                    <span>${formatDate(file.lastModified)}</span>
                    <span>${formatFileSize(file.size)}</span>
                </div>
            </div>
            <div class="file-actions">
                <button class="file-action-btn" data-action="load" data-index="${index}">
                    <i class="fas fa-folder-open"></i>
                </button>
                <button class="file-action-btn" data-action="delete" data-index="${index}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        fileListContainer.appendChild(fileItem);
    });
    
    fileCount.textContent = `${fileList.length}个文件`;
    
    // 添加事件监听器到文件操作按钮
    document.querySelectorAll('.file-action-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const action = btn.dataset.action;
            const index = parseInt(btn.dataset.index);
            
            if (action === 'load') {
                loadFile(index);
            } else if (action === 'delete') {
                confirmDeleteFile(index);
            }
        });
    });
}

// 加载文件
function loadFile(index) {
    if (index >= 0 && index < fileList.length) {
        const file = fileList[index];
        
        // 检查是否需要保存当前文件
        if (isDirty && currentFileId !== null) {
            if (!confirm('当前文件有未保存的更改，是否保存？')) {
                return;
            }
            saveCurrentFile();
        }
        
        // 加载文件内容
        editor.value = file.content;
        fileName.value = file.name;
        currentFileId = file.id;
        isDirty = false;
        
        // 更新UI
        updateEditorStats();
        updateFileListUI();
        fileStatus.textContent = '已加载';
        fileStatus.style.color = '#0f0';
        
        showNotification(`已加载文件: ${file.name}`);
    }
}

// 保存当前文件
function saveCurrentFile() {
    if (!editor.value.trim()) {
        showNotification('编辑器为空，无法保存');
        return;
    }
    
    const fileContent = editor.value;
    const fileNameValue = fileName.value || 'untitled.txt';
    
    // 创建或更新文件对象
    if (currentFileId) {
        // 更新现有文件
        const fileIndex = fileList.findIndex(f => f.id === currentFileId);
        if (fileIndex !== -1) {
            fileList[fileIndex] = {
                ...fileList[fileIndex],
                content: fileContent,
                name: fileNameValue,
                lastModified: new Date().toISOString(),
                size: new Blob([fileContent]).size
            };
        }
    } else {
        // 创建新文件
        const newFile = {
            id: Date.now().toString(),
            name: fileNameValue,
            content: fileContent,
            created: new Date().toISOString(),
            lastModified: new Date().toISOString(),
            size: new Blob([fileContent]).size
        };
        
        fileList.push(newFile);
        currentFileId = newFile.id;
    }
    
    // 保存到本地存储
    localStorage.setItem('cyberNotepad_files', JSON.stringify(fileList));
    
    // 更新UI
    isDirty = false;
    fileStatus.textContent = '已保存';
    fileStatus.style.color = '#0f0';
    updateFileListUI();
    
    showNotification(`文件已保存: ${fileNameValue}`);
}

// 创建新文件
function createNewFile() {
    // 检查是否需要保存当前文件
    if (isDirty && currentFileId !== null) {
        if (!confirm('当前文件有未保存的更改，是否保存？')) {
            return;
        }
        saveCurrentFile();
    }
    
    // 重置编辑器
    editor.value = '';
    fileName.value = `document_${Date.now()}.txt`;
    currentFileId = null;
    isDirty = false;
    
    // 更新UI
    updateEditorStats();
    fileStatus.textContent = '新建';
    fileStatus.style.color = '#00f3ff';
    
    showNotification('已创建新文件');
}

// 下载文件
function downloadFile() {
    const fileContent = editor.value;
    if (!fileContent.trim()) {
        showNotification('编辑器为空，无法下载');
        return;
    }
    
    const fileNameValue = fileName.value || 'untitled.txt';
    const blob = new Blob([fileContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileNameValue;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification(`文件已下载: ${fileNameValue}`);
}

// 清空编辑器
function clearEditor() {
    if (!editor.value.trim()) {
        return;
    }
    
    if (confirm('确定要清空编辑器内容吗？')) {
        editor.value = '';
        isDirty = true;
        updateEditorStats();
        fileStatus.textContent = '未保存';
        fileStatus.style.color = '#ff9900';
    }
}

// 查找功能
function findText() {
    findModal.style.display = 'flex';
    document.getElementById('findInput').focus();
}

// 替换功能
function replaceText() {
    findModal.style.display = 'flex';
    document.getElementById('findInput').focus();
}

// 格式化文本
function formatText() {
    const content = editor.value;
    
    // 简单的格式化：去除多余空格，确保换行一致
    const formatted = content
        .replace(/\r\n/g, '\n') // 统一换行符
        .replace(/\n{3,}/g, '\n\n') // 限制连续空行最多2行
        .replace(/[ \t]+/g, ' ') // 替换多个空格/制表符为单个空格
        .replace(/^\s+|\s+$/gm, ''); // 去除每行首尾空格
    
    editor.value = formatted;
    isDirty = true;
    updateEditorStats();
    showNotification('文本已格式化');
}

// 插入时间戳
function insertTimestamp() {
    const now = new Date();
    const timestamp = now.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
    
    const timestampText = `[${timestamp}] `;
    insertAtCursor(timestampText);
    showNotification('时间戳已插入');
}

// 在光标处插入文本
function insertAtCursor(text) {
    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    
    editor.value = editor.value.substring(0, start) + text + editor.value.substring(end);
    editor.selectionStart = editor.selectionEnd = start + text.length;
    editor.focus();
    
    isDirty = true;
    updateEditorStats();
}

// 加密文本
function encryptText() {
    encryptModal.style.display = 'flex';
    document.getElementById('encryptKey').focus();
}

// 解密文本
function decryptText() {
    encryptModal.style.display = 'flex';
    document.getElementById('encryptKey').focus();
}

// 计算哈希值
function calculateHash() {
    const content = editor.value;
    if (!content.trim()) {
        showNotification('编辑器为空，无法计算哈希值');
        return;
    }
    
    // 简单的哈希计算（实际应用中应使用更安全的算法）
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
        const char = content.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    
    const hashHex = Math.abs(hash).toString(16).toUpperCase();
    showNotification(`MD5哈希值: ${hashHex}`);
}

// XOR加密/解密
function xorEncrypt(text, key) {
    let result = '';
    for (let i = 0; i < text.length; i++) {
        const charCode = text.charCodeAt(i);
        const keyChar = key.charCodeAt(i % key.length);
        result += String.fromCharCode(charCode ^ keyChar);
    }
    return result;
}

// Base64编码/解码
function base64Encode(text) {
    return btoa(unescape(encodeURIComponent(text)));
}

function base64Decode(text) {
    try {
        return decodeURIComponent(escape(atob(text)));
    } catch (e) {
        return null;
    }
}

// 凯撒密码
function caesarCipher(text, shift) {
    let result = '';
    for (let i = 0; i < text.length; i++) {
        let char = text[i];
        if (char.match(/[a-z]/i)) {
            const code = text.charCodeAt(i);
            if (code >= 65 && code <= 90) {
                char = String.fromCharCode(((code - 65 + shift) % 26) + 65);
            } else if (code >= 97 && code <= 122) {
                char = String.fromCharCode(((code - 97 + shift) % 26) + 97);
            }
        }
        result += char;
    }
    return result;
}

// 执行加密
function performEncrypt() {
    const key = document.getElementById('encryptKey').value;
    if (!key) {
        showNotification('请输入加密密钥');
        return;
    }
    
    const text = editor.value;
    let encrypted;
    
    switch (selectedAlgorithm) {
        case 'xor':
            encrypted = xorEncrypt(text, key);
            encrypted = btoa(encrypted); // 转换为base64便于显示
            break;
        case 'base64':
            encrypted = base64Encode(text);
            break;
        case 'caesar':
            const shift = key.length % 26;
            encrypted = caesarCipher(text, shift);
            break;
        default:
            encrypted = text;
    }
    
    editor.value = encrypted;
    isDirty = true;
    updateEditorStats();
    encryptModal.style.display = 'none';
    document.getElementById('encryptKey').value = '';
    showNotification('文本已加密');
}

// 执行解密
function performDecrypt() {
    const key = document.getElementById('encryptKey').value;
    if (!key) {
        showNotification('请输入解密密钥');
        return;
    }
    
    const text = editor.value;
    let decrypted;
    
    try {
        switch (selectedAlgorithm) {
            case 'xor':
                const decoded = atob(text);
                decrypted = xorEncrypt(decoded, key);
                break;
            case 'base64':
                decrypted = base64Decode(text);
                if (decrypted === null) throw new Error('解码失败');
                break;
            case 'caesar':
                const shift = key.length % 26;
                decrypted = caesarCipher(text, 26 - shift); // 反向移位
                break;
            default:
                decrypted = text;
        }
    } catch (e) {
        showNotification('解密失败，请检查密钥和算法');
        return;
    }
    
    if (decrypted === null) {
        showNotification('解密失败，请检查密钥和算法');
        return;
    }
    
    editor.value = decrypted;
    isDirty = true;
    updateEditorStats();
    encryptModal.style.display = 'none';
    document.getElementById('encryptKey').value = '';
    showNotification('文本已解密');
}

// 确认删除文件
function confirmDeleteFile(index) {
    if (index >= 0 && index < fileList.length) {
        const file = fileList[index];
        document.getElementById('deleteFileName').textContent = file.name;
        deleteConfirmModal.style.display = 'flex';
        
        // 设置删除确认按钮的事件
        const confirmBtn = document.getElementById('confirmDeleteBtn');
        const cancelBtn = document.getElementById('cancelDeleteBtn');
        
        const onConfirm = () => {
            deleteFile(index);
            deleteConfirmModal.style.display = 'none';
            confirmBtn.removeEventListener('click', onConfirm);
            cancelBtn.removeEventListener('click', onCancel);
        };
        
        const onCancel = () => {
            deleteConfirmModal.style.display = 'none';
            confirmBtn.removeEventListener('click', onConfirm);
            cancelBtn.removeEventListener('click', onCancel);
        };
        
        confirmBtn.addEventListener('click', onConfirm);
        cancelBtn.addEventListener('click', onCancel);
    }
}

// 删除文件
function deleteFile(index) {
    if (index >= 0 && index < fileList.length) {
        const deletedFile = fileList.splice(index, 1)[0];
        
        // 如果删除的是当前文件，清空编辑器
        if (deletedFile.id === currentFileId) {
            editor.value = '';
            fileName.value = 'untitled.txt';
            currentFileId = null;
            isDirty = false;
            fileStatus.textContent = '新建';
        }
        
        // 保存更新后的文件列表
        localStorage.setItem('cyberNotepad_files', JSON.stringify(fileList));
        
        // 更新UI
        updateFileListUI();
        updateEditorStats();
        
        showNotification(`已删除文件: ${deletedFile.name}`);
    }
}

// 更新编辑器统计信息
function updateEditorStats() {
    const text = editor.value;
    
    // 字符数
    const chars = text.length;
    charCount.textContent = chars;
    
    // 单词数（简单的英文单词计数）
    const words = text.trim().split(/\s+/).filter(word => word.length > 0).length;
    wordCount.textContent = words;
    
    // 行数
    const lines = text.split('\n').length;
    lineCount.textContent = lines;
    
    // 文件大小
    const sizeInKB = (new Blob([text]).size / 1024).toFixed(2);
    fileSize.textContent = `${sizeInKB} KB`;
    
    // 更新行号
    updateLineNumbers(lines);
}

// 更新行号
function updateLineNumbers(lineCount) {
    const lineNumbers = document.getElementById('lineNumbers');
    lineNumbers.innerHTML = '';
    
    for (let i = 1; i <= lineCount; i++) {
        const lineDiv = document.createElement('div');
        lineDiv.textContent = i;
        lineNumbers.appendChild(lineDiv);
    }
}

// 更新光标位置
function updateCursorPosition() {
    const start = editor.selectionStart;
    const textBeforeCursor = editor.value.substring(0, start);
    const lines = textBeforeCursor.split('\n');
    const line = lines.length;
    const column = lines[lines.length - 1].length + 1;
    
    cursorPosition.textContent = `行:${line} 列:${column}`;
}

// 加载编辑器设置
function loadEditorSettings() {
    // 字体大小
    const savedFontSize = localStorage.getItem('cyberNotepad_fontSize') || '14';
    editor.style.fontSize = `${savedFontSize}px`;
    fontSizeSlider.value = savedFontSize;
    fontSizeValue.textContent = savedFontSize;
    
    // 主题
    const savedTheme = localStorage.getItem('cyberNotepad_theme') || 'cyber-blue';
    applyTheme(savedTheme);
    themeOptions.forEach(option => {
        if (option.dataset.theme === savedTheme) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
    
    // 自动保存
    const autoSaveEnabled = localStorage.getItem('cyberNotepad_autoSave') !== 'false';
    autoSaveToggle.checked = autoSaveEnabled;
    
    // 加密算法
    selectedAlgorithm = localStorage.getItem('cyberNotepad_algorithm') || 'xor';
    document.getElementById('encryptAlgorithm').value = selectedAlgorithm;
}

// 应用主题
function applyTheme(theme) {
    document.body.classList.remove('theme-cyber-blue', 'theme-matrix-green', 'theme-neon-purple');
    document.body.classList.add(`theme-${theme}`);
    
    // 更新CSS变量
    const root = document.documentElement;
    switch (theme) {
        case 'matrix-green':
            root.style.setProperty('--primary-color', '#00ff00');
            root.style.setProperty('--secondary-color', '#00aa00');
            break;
        case 'neon-purple':
            root.style.setProperty('--primary-color', '#ff00ff');
            root.style.setProperty('--secondary-color', '#aa00aa');
            break;
        default: // cyber-blue
            root.style.setProperty('--primary-color', '#00f3ff');
            root.style.setProperty('--secondary-color', '#0099aa');
    }
}

// 启动自动保存
function startAutoSave() {
    if (autoSaveInterval) {
        clearInterval(autoSaveInterval);
    }
    
    if (autoSaveToggle.checked) {
        autoSaveInterval = setInterval(() => {
            if (isDirty && editor.value.trim()) {
                saveCurrentFile();
            }
        }, 30000); // 每30秒自动保存一次
    }
}

// 显示通知
function showNotification(message, duration = 3000) {
    notificationText.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, duration);
}

// 工具函数：格式化日期
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
        month: '2-digit',
        day: '2-digit'
    });
}

// 工具函数：格式化文件大小
function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

// 设置事件监听器
function setupEventListeners() {
    // 编辑器事件
    editor.addEventListener('input', () => {
        isDirty = true;
        updateEditorStats();
        fileStatus.textContent = '未保存';
        fileStatus.style.color = '#ff9900';
    });
    
    editor.addEventListener('keyup', updateCursorPosition);
    editor.addEventListener('click', updateCursorPosition);
    editor.addEventListener('scroll', () => {
        const lineNumbers = document.getElementById('lineNumbers');
        lineNumbers.scrollTop = editor.scrollTop;
    });
    
    // 拖放文件
    editor.addEventListener('dragover', (e) => {
        e.preventDefault();
        editor.classList.add('drag-over');
    });
    
    editor.addEventListener('dragleave', () => {
        editor.classList.remove('drag-over');
    });
    
    editor.addEventListener('drop', (e) => {
        e.preventDefault();
        editor.classList.remove('drag-over');
        
        const file = e.dataTransfer.files[0];
        if (file && file.type === 'text/plain') {
            const reader = new FileReader();
            reader.onload = (e) => {
                editor.value = e.target.result;
                fileName.value = file.name;
                isDirty = true;
                updateEditorStats();
                showNotification(`已加载文件: ${file.name}`);
            };
            reader.readAsText(file);
        } else {
            showNotification('仅支持文本文件');
        }
    });
    
    // 主按钮事件
    newFileBtn.addEventListener('click', createNewFile);
    saveBtn.addEventListener('click', saveCurrentFile);
    downloadBtn.addEventListener('click', downloadFile);
    clearBtn.addEventListener('click', clearEditor);
    findBtn.addEventListener('click', findText);
    replaceBtn.addEventListener('click', replaceText);
    formatBtn.addEventListener('click', formatText);
    timestampBtn.addEventListener('click', insertTimestamp);
    encryptBtn.addEventListener('click', encryptText);
    decryptBtn.addEventListener('click', decryptText);
    hashBtn.addEventListener('click', calculateHash);
    fullscreenBtn.addEventListener('click', toggleFullscreen);
    
    // 设置事件
    fontSizeSlider.addEventListener('input', () => {
        const size = fontSizeSlider.value;
        editor.style.fontSize = `${size}px`;
        fontSizeValue.textContent = size;
        localStorage.setItem('cyberNotepad_fontSize', size);
    });
    
    autoSaveToggle.addEventListener('change', () => {
        localStorage.setItem('cyberNotepad_autoSave', autoSaveToggle.checked);
        startAutoSave();
        showNotification(autoSaveToggle.checked ? '自动保存已启用' : '自动保存已禁用');
    });
    
    themeOptions.forEach(option => {
        option.addEventListener('click', () => {
            const theme = option.dataset.theme;
            applyTheme(theme);
            localStorage.setItem('cyberNotepad_theme', theme);
            
            themeOptions.forEach(o => o.classList.remove('active'));
            option.classList.add('active');
            
            showNotification(`已切换到${option.querySelector('span:last-child').textContent}主题`);
        });
    });
    
    document.getElementById('encryptAlgorithm').addEventListener('change', (e) => {
        selectedAlgorithm = e.target.value;
        localStorage.setItem('cyberNotepad_algorithm', selectedAlgorithm);
    });
    
    // 模态框事件
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.modal').style.display = 'none';
        });
    });
    
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
    
    // 查找/替换功能
    document.getElementById('findNextBtn').addEventListener('click', findNext);
    document.getElementById('replaceBtnModal').addEventListener('click', replaceNext);
    document.getElementById('replaceAllBtn').addEventListener('click', replaceAll);
    
    // 加密/解密确认
    document.getElementById('encryptConfirmBtn').addEventListener('click', performEncrypt);
    document.getElementById('decryptConfirmBtn').addEventListener('click', performDecrypt);
    
    // 文件名输入
    fileName.addEventListener('change', () => {
        isDirty = true;
        fileStatus.textContent = '未保存';
        fileStatus.style.color = '#ff9900';
    });
}

// 查找下一个
function findNext() {
    const findInput = document.getElementById('findInput').value;
    const caseSensitive = document.getElementById('caseSensitive').checked;
    const wholeWord = document.getElementById('wholeWord').checked;
    
    if (!findInput) {
        showNotification('请输入要查找的内容');
        return;
    }
    
    const text = editor.value;
    let searchText = findInput;
    let searchIn = text;
    
    if (!caseSensitive) {
        searchText = searchText.toLowerCase();
        searchIn = text.toLowerCase();
    }
    
    const start = editor.selectionEnd;
    let index = searchIn.indexOf(searchText, start);
    
    if (index === -1) {
        // 从头开始搜索
        index = searchIn.indexOf(searchText, 0);
    }
    
    if (index !== -1) {
        // 检查是否全字匹配
        if (wholeWord) {
            const charBefore = index > 0 ? text[index - 1] : '';
            const charAfter = text[index + searchText.length];
            const isWordBoundary = (charBefore === '' || /\W/.test(charBefore)) && 
                                  (charAfter === undefined || /\W/.test(charAfter));
            
            if (!isWordBoundary) {
                showNotification('未找到匹配的完整单词');
                return;
            }
        }
        
        editor.focus();
        editor.setSelectionRange(index, index + searchText.length);
        editor.scrollTop = (index / text.length) * editor.scrollHeight;
        showNotification(`找到匹配项`);
    } else {
        showNotification('未找到匹配项');
    }
}

// 替换下一个
function replaceNext() {
    const findInput = document.getElementById('findInput').value;
    const replaceInput = document.getElementById('replaceInput').value;
    
    if (!findInput) {
        showNotification('请输入要查找的内容');
        return;
    }
    
    const selection = editor.selectionStart !== editor.selectionEnd;
    const selectedText = editor.value.substring(editor.selectionStart, editor.selectionEnd);
    
    if (selection && selectedText === findInput) {
        // 替换当前选中的文本
        const start = editor.selectionStart;
        const end = editor.selectionEnd;
        editor.value = editor.value.substring(0, start) + replaceInput + editor.value.substring(end);
        editor.selectionStart = editor.selectionEnd = start + replaceInput.length;
        isDirty = true;
        updateEditorStats();
        showNotification('已替换');
    } else {
        // 查找下一个并替换
        findNext();
    }
}

// 全部替换
function replaceAll() {
    const findInput = document.getElementById('findInput').value;
    const replaceInput = document.getElementById('replaceInput').value;
    const caseSensitive = document.getElementById('caseSensitive').checked;
    
    if (!findInput) {
        showNotification('请输入要查找的内容');
        return;
    }
    
    let newText = editor.value;
    let count = 0;
    
    if (caseSensitive) {
        const regex = new RegExp(findInput.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
        newText = editor.value.replace(regex, replaceInput);
        count = (editor.value.match(regex) || []).length;
    } else {
        const regex = new RegExp(findInput.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
        newText = editor.value.replace(regex, replaceInput);
        count = (editor.value.match(regex) || []).length;
    }
    
    editor.value = newText;
    isDirty = true;
    updateEditorStats();
    findModal.style.display = 'none';
    showNotification(`已替换 ${count} 处`);
}

// 切换全屏
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.error(`全屏请求失败: ${err.message}`);
        });
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

// 添加CSS变量
document.documentElement.style.setProperty('--primary-color', '#00f3ff');
document.documentElement.style.setProperty('--secondary-color', '#0099aa');

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', initApp);

// 处理全屏变化
document.addEventListener('fullscreenchange', () => {
    const icon = fullscreenBtn.querySelector('i');
    if (document.fullscreenElement) {
        icon.className = 'fas fa-compress';
    } else {
        icon.className = 'fas fa-expand';
    }
});

// 处理键盘快捷键
document.addEventListener('keydown', (e) => {
    // Ctrl+S 保存
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        saveCurrentFile();
    }
    
    // Ctrl+N 新建
    if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        createNewFile();
    }
    
    // Ctrl+F 查找
    if (e.ctrlKey && e.key === 'f') {
        e.preventDefault();
        findText();
    }
    
    // Ctrl+H 替换
    if (e.ctrlKey && e.key === 'h') {
        e.preventDefault();
        replaceText();
    }
    
    // Ctrl+D 下载
    if (e.ctrlKey && e.key === 'd') {
        e.preventDefault();
        downloadFile();
    }
    
    // Ctrl+E 加密
    if (e.ctrlKey && e.key === 'e') {
        e.preventDefault();
        encryptText();
    }
});

// 防抖函数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
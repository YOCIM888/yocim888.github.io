// 文件数据 - 30个虚拟文件
const fileData = [
    { id: 1, name: "neural_network_backup.zip", originalLocation: "C:/System/Backups", deleteDate: "2025-10-28", size: "2.4 GB", type: "archive" },
    { id: 2, name: "quantum_algorithm_v3.py", originalLocation: "D:/Projects/AI", deleteDate: "2025-10-27", size: "15.7 MB", type: "code" },
    { id: 3, name: "cybercity_schematic.dwg", originalLocation: "E:/Designs/Blueprints", deleteDate: "2025-10-27", size: "345 MB", type: "document" },
    { id: 4, name: "hologram_interface_ui.psd", originalLocation: "F:/Assets/UI", deleteDate: "2025-10-26", size: "1.2 GB", type: "image" },
    { id: 5, name: "zero_day_exploit.exe", originalLocation: "C:/Tools/Security", deleteDate: "2025-10-26", size: "8.5 MB", type: "executable" },
    { id: 6, name: "nanotech_research.pdf", originalLocation: "D:/Research/Documents", deleteDate: "2025-10-25", size: "47 MB", type: "document" },
    { id: 7, name: "laser_grid_simulation.mp4", originalLocation: "E:/Simulations", deleteDate: "2025-10-25", size: "4.3 GB", type: "video" },
    { id: 8, name: "data_core_fragment.bin", originalLocation: "C:/System/Cache", deleteDate: "2025-10-24", size: "12.6 GB", type: "executable" },
    { id: 9, name: "cyberdeck_interface.js", originalLocation: "D:/Projects/Web", deleteDate: "2025-10-24", size: "5.2 MB", type: "code" },
    { id: 10, name: "neon_advertisement.png", originalLocation: "F:/Marketing/Assets", deleteDate: "2025-10-23", size: "83 MB", type: "image" },
    { id: 11, name: "ai_personality_matrix.dat", originalLocation: "C:/AI/Core", deleteDate: "2025-10-22", size: "3.7 GB", type: "document" },
    { id: 12, name: "drone_footage_archive.rar", originalLocation: "E:/Surveillance/Footage", deleteDate: "2025-10-21", size: "8.9 GB", type: "archive" },
    { id: 13, name: "quantum_crypto_key.key", originalLocation: "C:/Security/Keys", deleteDate: "2025-10-20", size: "512 KB", type: "document" },
    { id: 14, name: "cyberware_driver.sys", originalLocation: "C:/System/Drivers", deleteDate: "2025-10-19", size: "42 MB", type: "executable" },
    { id: 15, name: "hacking_tutorial.mkv", originalLocation: "D:/Tutorials", deleteDate: "2025-10-18", size: "2.1 GB", type: "video" },
    { id: 16, name: "neural_implant_logs.db", originalLocation: "C:/System/Logs", deleteDate: "2025-10-17", size: "876 MB", type: "document" },
    { id: 17, name: "cyberpunk_artwork.jpg", originalLocation: "F:/Art/Personal", deleteDate: "2025-10-16", size: "24 MB", type: "image" },
    { id: 18, name: "security_breach_report.docx", originalLocation: "D:/Reports", deleteDate: "2025-10-15", size: "8.3 MB", type: "document" },
    { id: 19, name: "memory_dump_analysis.zip", originalLocation: "C:/Debug", deleteDate: "2025-10-14", size: "5.6 GB", type: "archive" },
    { id: 20, name: "augmentation_specs.xlsx", originalLocation: "E:/Specifications", deleteDate: "2025-10-13", size: "19 MB", type: "document" },
    { id: 21, name: "cyberattack_simulation.exe", originalLocation: "C:/Tools/Penetration", deleteDate: "2025-10-12", size: "156 MB", type: "executable" },
    { id: 22, name: "virtual_reality_environment.unity", originalLocation: "D:/Projects/VR", deleteDate: "2025-10-11", size: "3.4 GB", type: "code" },
    { id: 23, name: "cybernetic_enhancement.mp4", originalLocation: "F:/Presentations", deleteDate: "2025-10-10", size: "1.8 GB", type: "video" },
    { id: 24, name: "network_topology_map.svg", originalLocation: "C:/Network/Diagrams", deleteDate: "2025-10-09", size: "7.2 MB", type: "image" },
    { id: 25, name: "encrypted_messages.tar.gz", originalLocation: "E:/Communications", deleteDate: "2025-10-08", size: "634 MB", type: "archive" },
    { id: 26, name: "cyberdeck_firmware.bin", originalLocation: "C:/Firmware/Updates", deleteDate: "2025-10-07", size: "98 MB", type: "executable" },
    { id: 27, name: "data_mining_script.rb", originalLocation: "D:/Scripts/Automation", deleteDate: "2025-10-06", size: "3.1 MB", type: "code" },
    { id: 28, name: "corporate_espionage_data.db", originalLocation: "C:/Data/Acquired", deleteDate: "2025-10-05", size: "12.4 GB", type: "document" },
    { id: 29, name: "cyber_security_certificate.p12", originalLocation: "C:/Security/Certificates", deleteDate: "2025-10-04", size: "2.8 MB", type: "document" },
    { id: 30, name: "hologram_projection_sequence.gif", originalLocation: "F:/Assets/Animations", deleteDate: "2025-10-03", size: "456 MB", type: "image" }
];

// 图标映射
const typeIcons = {
    document: "fas fa-file-alt",
    image: "fas fa-image",
    video: "fas fa-video",
    archive: "fas fa-file-archive",
    code: "fas fa-code",
    executable: "fas fa-cogs"
};

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    // 显示当前时间
    updateTime();
    setInterval(updateTime, 1000);
    
    // 生成文件列表
    renderFileList();
    
    // 设置事件监听器
    setupEventListeners();
    
    // 更新选中文件数量
    updateSelectedCount();
});

// 更新时间显示
function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    document.getElementById('current-time').textContent = timeString;
}

// 渲染文件列表
function renderFileList(filteredData = fileData) {
    const fileListBody = document.getElementById('file-list-body');
    fileListBody.innerHTML = '';
    
    filteredData.forEach(file => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.dataset.id = file.id;
        
        fileItem.innerHTML = `
            <div class="file-name">
                <input type="checkbox" class="file-checkbox" data-id="${file.id}">
                <i class="${typeIcons[file.type]} file-icon"></i>
                <span class="file-name-text">${file.name}</span>
            </div>
            <div>${file.originalLocation}</div>
            <div>${file.deleteDate}</div>
            <div>${file.size}</div>
            <div><span class="file-type ${file.type}">${file.type.toUpperCase()}</span></div>
            <div class="action-buttons">
                <button class="btn-restore" data-id="${file.id}">
                    <i class="fas fa-undo-alt"></i>
                    <span>恢复</span>
                </button>
                <button class="btn-delete" data-id="${file.id}">
                    <i class="fas fa-times"></i>
                    <span>删除</span>
                </button>
            </div>
        `;
        
        fileListBody.appendChild(fileItem);
    });
    
    // 重新绑定事件监听器
    bindFileEvents();
}

// 绑定文件相关事件
function bindFileEvents() {
    // 文件复选框
    document.querySelectorAll('.file-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const fileItem = this.closest('.file-item');
            if (this.checked) {
                fileItem.classList.add('selected');
            } else {
                fileItem.classList.remove('selected');
            }
            updateSelectedCount();
        });
    });
    
    // 恢复按钮
    document.querySelectorAll('.btn-restore').forEach(button => {
        button.addEventListener('click', function() {
            const fileId = this.dataset.id;
            showPermissionDialog();
        });
    });
    
    // 删除按钮
    document.querySelectorAll('.btn-delete').forEach(button => {
        button.addEventListener('click', function() {
            const fileId = this.dataset.id;
            const fileName = fileData.find(f => f.id == fileId).name;
            if (confirm(`确定要永久删除 "${fileName}" 吗？此操作不可撤销。`)) {
                // 模拟删除
                const fileItem = document.querySelector(`.file-item[data-id="${fileId}"]`);
                fileItem.style.opacity = '0.5';
                fileItem.style.textDecoration = 'line-through';
                setTimeout(() => {
                    fileItem.style.display = 'none';
                    updateFileCount();
                    updateSelectedCount();
                }, 500);
                
                // 显示删除反馈
                showNotification(`已删除: ${fileName}`);
            }
        });
    });
}

// 设置全局事件监听器
function setupEventListeners() {
    // 全选复选框
    const selectAllCheckbox = document.getElementById('select-all');
    selectAllCheckbox.addEventListener('change', function() {
        const isChecked = this.checked;
        document.querySelectorAll('.file-checkbox').forEach(checkbox => {
            checkbox.checked = isChecked;
            const fileItem = checkbox.closest('.file-item');
            if (isChecked) {
                fileItem.classList.add('selected');
            } else {
                fileItem.classList.remove('selected');
            }
        });
        updateSelectedCount();
    });
    
    // 清空回收站按钮
    document.getElementById('empty-trash').addEventListener('click', function() {
        if (confirm('确定要清空回收站吗？所有文件将被永久删除。')) {
            const fileListBody = document.getElementById('file-list-body');
            fileListBody.innerHTML = '<div class="empty-message">回收站已清空</div>';
            document.getElementById('file-count').textContent = '0';
            document.getElementById('used-space').textContent = '0 GB';
            document.getElementById('selected-count').textContent = '0';
            showNotification('回收站已清空');
        }
    });
    
    // 刷新按钮
    document.getElementById('refresh').addEventListener('click', function() {
        renderFileList();
        showNotification('已刷新回收站内容');
    });
    
    // 属性按钮
    document.getElementById('properties').addEventListener('click', function() {
        showNotification('系统属性: 回收站容量 100GB | 已使用 47.3GB | 版本 2.1.7');
    });
    
    // 搜索框
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        if (searchTerm === '') {
            renderFileList();
        } else {
            const filteredData = fileData.filter(file => 
                file.name.toLowerCase().includes(searchTerm) ||
                file.originalLocation.toLowerCase().includes(searchTerm) ||
                file.type.toLowerCase().includes(searchTerm)
            );
            renderFileList(filteredData);
            document.getElementById('file-count').textContent = filteredData.length;
        }
    });
    
    // 对话框关闭按钮
    document.getElementById('close-dialog').addEventListener('click', hidePermissionDialog);
    document.getElementById('confirm-dialog').addEventListener('click', hidePermissionDialog);
    
    // 点击对话框外部关闭
    document.getElementById('dialog-overlay').addEventListener('click', function(e) {
        if (e.target === this) {
            hidePermissionDialog();
        }
    });
    
    // ESC键关闭对话框
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            hidePermissionDialog();
        }
    });
}

// 显示权限不足对话框
function showPermissionDialog() {
    const dialogOverlay = document.getElementById('dialog-overlay');
    dialogOverlay.style.display = 'flex';
    
    // 添加一些随机错误代码
    const errorCode = document.querySelector('.error-code');
    const randomHex = Math.floor(Math.random() * 0xFFFFFF).toString(16).toUpperCase().padStart(6, '0');
    errorCode.textContent = `错误代码: 0x${randomHex}`;
    
    // 轻微抖动效果
    const dialog = document.getElementById('permission-dialog');
    dialog.style.animation = 'none';
    setTimeout(() => {
        dialog.style.animation = 'shake 0.5s';
    }, 10);
    
    // 添加CSS抖动动画
    if (!document.querySelector('#shake-animation')) {
        const style = document.createElement('style');
        style.id = 'shake-animation';
        style.textContent = `
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                20%, 40%, 60%, 80% { transform: translateX(5px); }
            }
        `;
        document.head.appendChild(style);
    }
}

// 隐藏权限不足对话框
function hidePermissionDialog() {
    document.getElementById('dialog-overlay').style.display = 'none';
}

// 更新选中文件数量
function updateSelectedCount() {
    const selectedCount = document.querySelectorAll('.file-checkbox:checked').length;
    document.getElementById('selected-count').textContent = selectedCount;
}

// 更新文件数量
function updateFileCount() {
    const remainingFiles = document.querySelectorAll('.file-item').length;
    document.getElementById('file-count').textContent = remainingFiles;
    
    // 模拟更新使用空间（随机减少一点）
    const currentSpace = parseFloat(document.getElementById('used-space').textContent);
    const newSpace = Math.max(0, currentSpace - (Math.random() * 2)).toFixed(1);
    document.getElementById('used-space').textContent = `${newSpace} GB`;
}

// 显示通知
function showNotification(message) {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = 'cyber-notification';
    notification.innerHTML = `
        <i class="fas fa-info-circle"></i>
        <span>${message}</span>
    `;
    
    // 添加样式
    notification.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: rgba(0, 20, 40, 0.9);
        border: 1px solid #00f3ff;
        color: #00f3ff;
        padding: 15px 20px;
        border-radius: 3px;
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 1000;
        box-shadow: 0 0 20px rgba(0, 243, 255, 0.5);
        animation: slideIn 0.3s ease-out;
    `;
    
    // 添加动画
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // 3秒后移除通知
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
            document.head.removeChild(style);
        }, 300);
    }, 3000);
}
// link-station.js
document.addEventListener('DOMContentLoaded', function() {
    // 系统时间更新
    const systemTime = document.getElementById('systemTime');
    function updateTime() {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('zh-CN', { hour12: false });
        systemTime.textContent = timeStr;
    }
    setInterval(updateTime, 1000);
    updateTime();
    
    // 聊天功能
    const chatMessages = document.getElementById('chatMessages');
    const userInput = document.getElementById('userInput');
    const sendMessageBtn = document.getElementById('sendMessage');
    const clearChatBtn = document.getElementById('clearChat');
    const voiceToggleBtn = document.getElementById('voiceToggle');
    const toolOutput = document.getElementById('toolOutput');
    const clearOutputBtn = document.getElementById('clearOutput');
    const statusMessage = document.getElementById('statusMessage');
    const modal = document.getElementById('toolModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const closeModal = document.querySelector('.close-modal');
    
    let isVoiceActive = false;
    let recognition = null;
    
    // 初始化语音识别
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.lang = 'zh-CN';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        
        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            userInput.value = transcript;
            sendMessage();
            updateStatus('语音输入完成');
        };
        
        recognition.onerror = function(event) {
            console.error('语音识别错误:', event.error);
            updateStatus('语音识别错误: ' + event.error);
        };
        
        recognition.onend = function() {
            if (isVoiceActive) {
                recognition.start();
            }
        };
    } else {
        voiceToggleBtn.disabled = true;
        voiceToggleBtn.title = "浏览器不支持语音识别";
    }
    
    // 发送消息函数
    function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;
        
        // 添加用户消息到聊天
        addMessageToChat(message, 'user');
        
        // 清空输入框
        userInput.value = '';
        
        // 更新状态
        updateStatus('正在处理您的请求...');
        
        // 模拟AI思考时间
        setTimeout(() => {
            // 获取AI回复
            const aiResponse = getAIResponse(message);
            
            // 添加AI回复到聊天
            addMessageToChat(aiResponse, 'ai');
            
            // 更新状态
            updateStatus('请求处理完成');
        }, 600 + Math.random() * 900);
    }
    
    // 添加消息到聊天
    function addMessageToChat(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const now = new Date();
        const timeStr = now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
        
        let avatarIcon = 'fas fa-user';
        let senderName = '用户';
        
        if (sender === 'ai') {
            avatarIcon = 'fas fa-robot';
            senderName = 'YOCIM助手';
        }
        
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="${avatarIcon}"></i>
            </div>
            <div class="message-content">
                <div class="message-sender">${senderName}</div>
                <div class="message-text">${text}</div>
                <div class="message-time">${timeStr}</div>
            </div>
        `;
        
        chatMessages.appendChild(messageDiv);
        
        // 滚动到底部
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // 获取AI回复
    function getAIResponse(message) {
        const lowerMsg = message.toLowerCase();
        
        // 问候类
        if (lowerMsg.includes('你好') || lowerMsg.includes('您好') || lowerMsg.includes('hi') || lowerMsg.includes('hello')) {
            return '您好！我是YOCIM助手，一个赛博风格的AI助手。我可以回答您的问题，也可以使用右侧的工具为您提供帮助。';
        }
        
        // 时间查询
        if (lowerMsg.includes('时间') || lowerMsg.includes('几点')) {
            const now = new Date();
            const timeStr = now.toLocaleTimeString('zh-CN', { hour12: false });
            const dateStr = now.toLocaleDateString('zh-CN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            return `当前时间是：${timeStr}<br>今天是：${dateStr}`;
        }
        
        // 日期查询
        if (lowerMsg.includes('日期') || lowerMsg.includes('今天几号')) {
            const now = new Date();
            const dateStr = now.toLocaleDateString('zh-CN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            return `今天是：${dateStr}`;
        }
        
        // 天气查询
        if (lowerMsg.includes('天气')) {
            return '目前我可以提供天气查询功能，您可以使用右侧的天气查询工具，或告诉我具体城市名称。';
        }
        
        // 计算相关
        if (lowerMsg.includes('计算') || lowerMsg.includes('算一下') || /[\d+\-*/().]/.test(lowerMsg)) {
            try {
                // 尝试提取数学表达式
                const expr = message.replace(/[^0-9+\-*/().]/g, '');
                if (expr) {
                    // 安全评估表达式
                    const result = evaluateMathExpression(expr);
                    if (result !== null) {
                        return `计算 ${expr} 的结果是：${result}`;
                    }
                }
                return '我可以帮您进行数学计算，请使用右侧的计算器工具，或者直接告诉我您要计算的表达式。';
            } catch (e) {
                return '我可以帮您进行数学计算，请使用右侧的计算器工具，或者直接告诉我您要计算的表达式。';
            }
        }
        
        // 翻译
        if (lowerMsg.includes('翻译')) {
            return '我可以帮您翻译文本，请使用右侧的翻译工具，或者告诉我您要翻译的内容和目标语言。';
        }
        
        // 定义YOCIM助手
        if (lowerMsg.includes('yocim') || lowerMsg.includes('助手') || lowerMsg.includes('你是什么')) {
            return '我是YOCIM助手，一个专为科幻赛博风格设计的AI助手。我专注于提供实用工具和快速信息查询，帮助您高效完成任务。';
        }
        
        // 工具相关
        if (lowerMsg.includes('工具') || lowerMsg.includes('功能')) {
            return '我提供了多种实用工具：计算器、单位转换、世界时钟、便签、代码格式化和密码生成。请点击右侧的工具卡片使用。';
        }
        
        // 默认回复
        const defaultResponses = [
            '我已收到您的消息。如需使用具体功能，请尝试右侧的工具集。',
            '这是一个有趣的问题。我可以使用我的工具来帮助您解决相关问题。',
            '我主要专注于实用工具和快速查询，您可以使用右侧的工具集来获得更精确的帮助。',
            '作为YOCIM助手，我能够处理多种任务，但更复杂的请求可能需要使用专门的工具。'
        ];
        
        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }
    
    // 安全的数学表达式评估
    function evaluateMathExpression(expr) {
        try {
            // 简单验证表达式只包含数字和基本运算符
            if (!/^[0-9+\-*/().\s]+$/.test(expr)) {
                return null;
            }
            
            // 使用Function构造函数安全评估
            const result = Function(`"use strict"; return (${expr})`)();
            
            // 检查结果是否为有效数字
            if (typeof result === 'number' && !isNaN(result) && isFinite(result)) {
                return result;
            }
            return null;
        } catch (e) {
            return null;
        }
    }
    
    // 更新状态消息
    function updateStatus(message) {
        statusMessage.textContent = message;
        
        // 3秒后恢复默认状态
        setTimeout(() => {
            statusMessage.textContent = '系统已就绪 - 等待用户输入';
        }, 3000);
    }
    
    // 事件监听器
    sendMessageBtn.addEventListener('click', sendMessage);
    
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    clearChatBtn.addEventListener('click', function() {
        chatMessages.innerHTML = '';
        // 添加初始AI消息
        addMessageToChat('您好！我是YOCIM助手，一个赛博风格的AI助手。我可以回答您的问题，也可以使用右侧的工具为您提供帮助。请告诉我您需要什么？', 'ai');
        updateStatus('聊天记录已清空');
    });
    
    voiceToggleBtn.addEventListener('click', function() {
        if (!recognition) return;
        
        if (!isVoiceActive) {
            recognition.start();
            isVoiceActive = true;
            voiceToggleBtn.innerHTML = '<i class="fas fa-microphone-slash"></i> 语音';
            voiceToggleBtn.style.backgroundColor = 'rgba(220, 53, 69, 0.2)';
            voiceToggleBtn.style.borderColor = 'rgba(220, 53, 69, 0.5)';
            updateStatus('语音输入已激活，请开始说话...');
        } else {
            recognition.stop();
            isVoiceActive = false;
            voiceToggleBtn.innerHTML = '<i class="fas fa-microphone"></i> 语音';
            voiceToggleBtn.style.backgroundColor = '';
            voiceToggleBtn.style.borderColor = '';
            updateStatus('语音输入已关闭');
        }
    });
    
    clearOutputBtn.addEventListener('click', function() {
        toolOutput.innerHTML = `
            <div class="output-message">
                <div class="output-icon">
                    <i class="fas fa-info-circle"></i>
                </div>
                <div class="output-text">
                    <strong>输出已清空</strong><br>
                    点击上方工具卡片以使用对应功能
                </div>
            </div>
        `;
        updateStatus('工具输出已清空');
    });
    
    // 快速操作按钮
    document.querySelectorAll('.quick-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.dataset.action;
            let question = '';
            
            switch(action) {
                case 'time':
                    question = '现在几点了？';
                    break;
                case 'calc':
                    question = '计算 15 * 3 + 7';
                    break;
                case 'weather':
                    question = '今天天气怎么样？';
                    break;
                case 'translate':
                    question = '帮我翻译一段文字';
                    break;
            }
            
            userInput.value = question;
            sendMessage();
        });
    });
    
    // 工具卡片点击事件
    const toolCards = document.querySelectorAll('.tool-card');
    
    toolCards.forEach(card => {
        card.addEventListener('click', function() {
            const toolId = this.id;
            openToolModal(toolId);
        });
    });
    
    // 打开工具模态框
    function openToolModal(toolId) {
        let title = '';
        let content = '';
        
        switch(toolId) {
            case 'calculatorTool':
                title = '计算器';
                content = `
                    <div class="calculator">
                        <div class="calculator-display">
                            <input type="text" id="calcDisplay" readonly value="0">
                        </div>
                        <div class="calculator-buttons">
                            <button class="calc-btn" data-action="clear">C</button>
                            <button class="calc-btn" data-action="backspace">←</button>
                            <button class="calc-btn" data-action="percent">%</button>
                            <button class="calc-btn" data-action="divide">/</button>
                            
                            <button class="calc-btn" data-action="7">7</button>
                            <button class="calc-btn" data-action="8">8</button>
                            <button class="calc-btn" data-action="9">9</button>
                            <button class="calc-btn" data-action="multiply">×</button>
                            
                            <button class="calc-btn" data-action="4">4</button>
                            <button class="calc-btn" data-action="5">5</button>
                            <button class="calc-btn" data-action="6">6</button>
                            <button class="calc-btn" data-action="subtract">-</button>
                            
                            <button class="calc-btn" data-action="1">1</button>
                            <button class="calc-btn" data-action="2">2</button>
                            <button class="calc-btn" data-action="3">3</button>
                            <button class="calc-btn" data-action="add">+</button>
                            
                            <button class="calc-btn" data-action="0" style="grid-column: span 2;">0</button>
                            <button class="calc-btn" data-action="decimal">.</button>
                            <button class="calc-btn" data-action="equals">=</button>
                        </div>
                    </div>
                    <style>
                        .calculator {
                            background: rgba(20, 25, 60, 0.8);
                            border-radius: 10px;
                            padding: 20px;
                            border: 1px solid rgba(0, 183, 255, 0.3);
                        }
                        .calculator-display input {
                            width: 100%;
                            padding: 15px;
                            font-size: 24px;
                            text-align: right;
                            background: rgba(10, 15, 35, 0.9);
                            border: 1px solid rgba(0, 183, 255, 0.5);
                            border-radius: 8px;
                            color: #00b7ff;
                            margin-bottom: 20px;
                            font-family: 'Courier New', monospace;
                        }
                        .calculator-buttons {
                            display: grid;
                            grid-template-columns: repeat(4, 1fr);
                            gap: 10px;
                        }
                        .calc-btn {
                            padding: 15px;
                            font-size: 18px;
                            background: rgba(30, 35, 80, 0.8);
                            border: 1px solid rgba(0, 183, 255, 0.3);
                            border-radius: 8px;
                            color: #e0e0ff;
                            cursor: pointer;
                            transition: all 0.2s;
                        }
                        .calc-btn:hover {
                            background: rgba(0, 183, 255, 0.2);
                            border-color: #00b7ff;
                        }
                        .calc-btn[data-action="equals"] {
                            background: linear-gradient(135deg, #00b7ff, #0088cc);
                            color: white;
                        }
                        .calc-btn[data-action="clear"],
                        .calc-btn[data-action="backspace"] {
                            background: rgba(168, 85, 247, 0.2);
                            border-color: rgba(168, 85, 247, 0.5);
                        }
                    </style>
                `;
                break;
                
            case 'converterTool':
                title = '单位转换器';
                content = `
                    <div class="converter">
                        <div class="converter-row">
                            <input type="number" id="convertValue" value="1" step="any">
                            <select id="convertFrom">
                                <option value="meter">米</option>
                                <option value="kilometer">千米</option>
                                <option value="centimeter">厘米</option>
                                <option value="millimeter">毫米</option>
                                <option value="inch">英寸</option>
                                <option value="foot">英尺</option>
                                <option value="mile">英里</option>
                                <option value="celsius">摄氏度</option>
                                <option value="fahrenheit">华氏度</option>
                                <option value="kelvin">开尔文</option>
                                <option value="kilogram">千克</option>
                                <option value="gram">克</option>
                                <option value="pound">磅</option>
                                <option value="ounce">盎司</option>
                            </select>
                        </div>
                        <div class="converter-row" style="justify-content: center; margin: 15px 0;">
                            <button id="swapUnits" class="btn-small"><i class="fas fa-exchange-alt"></i> 交换</button>
                        </div>
                        <div class="converter-row">
                            <input type="number" id="convertResult" readonly>
                            <select id="convertTo">
                                <option value="meter">米</option>
                                <option value="kilometer">千米</option>
                                <option value="centimeter">厘米</option>
                                <option value="millimeter">毫米</option>
                                <option value="inch">英寸</option>
                                <option value="foot">英尺</option>
                                <option value="mile" selected>英里</option>
                                <option value="celsius">摄氏度</option>
                                <option value="fahrenheit" selected>华氏度</option>
                                <option value="kelvin">开尔文</option>
                                <option value="kilogram">千克</option>
                                <option value="gram">克</option>
                                <option value="pound" selected>磅</option>
                                <option value="ounce">盎司</option>
                            </select>
                        </div>
                        <button id="performConversion" class="btn-small" style="margin-top: 20px; width: 100%;">
                            <i class="fas fa-calculator"></i> 转换
                        </button>
                        <div id="conversionResult" style="margin-top: 20px; padding: 15px; background: rgba(0, 183, 255, 0.1); border-radius: 8px; display: none;"></div>
                    </div>
                    <style>
                        .converter-row {
                            display: flex;
                            gap: 10px;
                            margin-bottom: 10px;
                        }
                        .converter-row input, .converter-row select {
                            flex: 1;
                            padding: 12px;
                            background: rgba(20, 25, 60, 0.9);
                            border: 1px solid rgba(0, 183, 255, 0.5);
                            border-radius: 8px;
                            color: #e0e0ff;
                            font-size: 16px;
                        }
                        .converter-row input:focus, .converter-row select:focus {
                            outline: none;
                            border-color: #00b7ff;
                        }
                        #convertResult {
                            background: rgba(10, 15, 35, 0.9);
                        }
                    </style>
                `;
                break;
                
            case 'timeTool':
                title = '世界时钟';
                content = `
                    <div class="world-clock">
                        <div class="clock-container">
                            <div class="clock-city">本地时间</div>
                            <div class="clock-time" id="localTime">--:--:--</div>
                            <div class="clock-date" id="localDate">----年--月--日</div>
                        </div>
                        
                        <div class="clocks-grid">
                            <div class="clock-item">
                                <div class="clock-city">伦敦</div>
                                <div class="clock-time" id="londonTime">--:--</div>
                                <div class="clock-diff" id="londonDiff">-7小时</div>
                            </div>
                            <div class="clock-item">
                                <div class="clock-city">纽约</div>
                                <div class="clock-time" id="newyorkTime">--:--</div>
                                <div class="clock-diff" id="newyorkDiff">-12小时</div>
                            </div>
                            <div class="clock-item">
                                <div class="clock-city">东京</div>
                                <div class="clock-time" id="tokyoTime">--:--</div>
                                <div class="clock-diff" id="tokyoDiff">+1小时</div>
                            </div>
                            <div class="clock-item">
                                <div class="clock-city">悉尼</div>
                                <div class="clock-time" id="sydneyTime">--:--</div>
                                <div class="clock-diff" id="sydneyDiff">+2小时</div>
                            </div>
                        </div>
                    </div>
                    <style>
                        .clock-container {
                            text-align: center;
                            padding: 20px;
                            background: rgba(20, 25, 60, 0.8);
                            border-radius: 10px;
                            margin-bottom: 20px;
                            border: 1px solid rgba(0, 183, 255, 0.3);
                        }
                        .clock-city {
                            font-size: 18px;
                            color: #00b7ff;
                            margin-bottom: 10px;
                        }
                        .clock-time {
                            font-size: 32px;
                            font-family: 'Courier New', monospace;
                            color: #e0e0ff;
                            margin-bottom: 5px;
                        }
                        .clock-date {
                            font-size: 16px;
                            color: rgba(224, 224, 255, 0.7);
                        }
                        .clocks-grid {
                            display: grid;
                            grid-template-columns: repeat(2, 1fr);
                            gap: 15px;
                        }
                        .clock-item {
                            padding: 15px;
                            background: rgba(20, 25, 60, 0.6);
                            border-radius: 8px;
                            text-align: center;
                            border: 1px solid rgba(0, 183, 255, 0.2);
                        }
                        .clock-diff {
                            font-size: 14px;
                            color: #4ade80;
                            margin-top: 5px;
                        }
                    </style>
                `;
                break;
                
            case 'noteTool':
                title = '便签工具';
                content = `
                    <div class="notes-tool">
                        <div class="notes-controls">
                            <button id="newNote" class="btn-small"><i class="fas fa-plus"></i> 新建</button>
                            <button id="saveNote" class="btn-small"><i class="fas fa-save"></i> 保存</button>
                            <button id="clearNote" class="btn-small"><i class="fas fa-trash"></i> 清空</button>
                        </div>
                        <div class="notes-area">
                            <textarea id="noteContent" placeholder="在这里输入您的便签内容..." rows="10"></textarea>
                        </div>
                        <div class="notes-list">
                            <h4>已保存的便签</h4>
                            <div id="savedNotes"></div>
                        </div>
                    </div>
                    <style>
                        .notes-controls {
                            display: flex;
                            gap: 10px;
                            margin-bottom: 15px;
                        }
                        .notes-area textarea {
                            width: 100%;
                            padding: 15px;
                            background: rgba(20, 25, 60, 0.9);
                            border: 1px solid rgba(0, 183, 255, 0.5);
                            border-radius: 8px;
                            color: #e0e0ff;
                            font-size: 16px;
                            resize: vertical;
                            min-height: 150px;
                        }
                        .notes-list {
                            margin-top: 20px;
                        }
                        .notes-list h4 {
                            color: #00b7ff;
                            margin-bottom: 10px;
                        }
                        .note-item {
                            padding: 10px;
                            background: rgba(30, 35, 80, 0.6);
                            border-radius: 6px;
                            margin-bottom: 8px;
                            border: 1px solid rgba(0, 183, 255, 0.2);
                            cursor: pointer;
                            transition: all 0.2s;
                        }
                        .note-item:hover {
                            background: rgba(40, 45, 100, 0.8);
                        }
                        .note-item .note-date {
                            font-size: 12px;
                            color: rgba(224, 224, 255, 0.5);
                            margin-top: 5px;
                        }
                    </style>
                `;
                break;
                
            case 'codeTool':
                title = '代码格式化';
                content = `
                    <div class="code-formatter">
                        <div class="formatter-controls">
                            <select id="codeLanguage">
                                <option value="javascript">JavaScript</option>
                                <option value="html">HTML</option>
                                <option value="css">CSS</option>
                                <option value="python">Python</option>
                                <option value="java">Java</option>
                                <option value="cpp">C++</option>
                            </select>
                            <button id="formatCode" class="btn-small"><i class="fas fa-code"></i> 格式化</button>
                            <button id="copyCode" class="btn-small"><i class="fas fa-copy"></i> 复制</button>
                        </div>
                        <div class="code-input">
                            <textarea id="codeInput" placeholder="粘贴您的代码到这里..." rows="12"></textarea>
                        </div>
                        <div class="code-output">
                            <h4>格式化结果</h4>
                            <pre id="formattedCode"></pre>
                        </div>
                    </div>
                    <style>
                        .formatter-controls {
                            display: flex;
                            gap: 10px;
                            margin-bottom: 15px;
                        }
                        .formatter-controls select {
                            flex: 1;
                            padding: 10px;
                            background: rgba(20, 25, 60, 0.9);
                            border: 1px solid rgba(0, 183, 255, 0.5);
                            border-radius: 8px;
                            color: #e0e0ff;
                        }
                        .code-input textarea {
                            width: 100%;
                            padding: 15px;
                            background: rgba(10, 15, 35, 0.9);
                            border: 1px solid rgba(0, 183, 255, 0.5);
                            border-radius: 8px;
                            color: #e0e0ff;
                            font-family: 'Courier New', monospace;
                            font-size: 14px;
                            resize: vertical;
                            min-height: 150px;
                        }
                        .code-output {
                            margin-top: 20px;
                        }
                        .code-output h4 {
                            color: #00b7ff;
                            margin-bottom: 10px;
                        }
                        #formattedCode {
                            padding: 15px;
                            background: rgba(10, 15, 35, 0.9);
                            border: 1px solid rgba(0, 183, 255, 0.5);
                            border-radius: 8px;
                            color: #e0e0ff;
                            font-family: 'Courier New', monospace;
                            font-size: 14px;
                            min-height: 100px;
                            max-height: 300px;
                            overflow: auto;
                            white-space: pre-wrap;
                        }
                    </style>
                `;
                break;
                
            case 'passwordTool':
                title = '密码生成器';
                content = `
                    <div class="password-generator">
                        <div class="password-display">
                            <input type="text" id="generatedPassword" readonly value="">
                            <button id="copyPassword" class="btn-small"><i class="fas fa-copy"></i></button>
                        </div>
                        
                        <div class="password-options">
                            <div class="option">
                                <label for="pwLength">密码长度: <span id="lengthValue">12</span></label>
                                <input type="range" id="pwLength" min="6" max="32" value="12">
                            </div>
                            
                            <div class="option">
                                <input type="checkbox" id="includeUppercase" checked>
                                <label for="includeUppercase">包含大写字母 (A-Z)</label>
                            </div>
                            
                            <div class="option">
                                <input type="checkbox" id="includeLowercase" checked>
                                <label for="includeLowercase">包含小写字母 (a-z)</label>
                            </div>
                            
                            <div class="option">
                                <input type="checkbox" id="includeNumbers" checked>
                                <label for="includeNumbers">包含数字 (0-9)</label>
                            </div>
                            
                            <div class="option">
                                <input type="checkbox" id="includeSymbols" checked>
                                <label for="includeSymbols">包含符号 (!@#$%^&*)</label>
                            </div>
                        </div>
                        
                        <button id="generatePassword" class="btn-small" style="width: 100%; margin-top: 20px;">
                            <i class="fas fa-key"></i> 生成密码
                        </button>
                        
                        <div class="password-strength" style="margin-top: 20px;">
                            <h4>密码强度: <span id="strengthText">中等</span></h4>
                            <div class="strength-bar">
                                <div class="strength-fill" id="strengthFill" style="width: 60%;"></div>
                            </div>
                        </div>
                    </div>
                    <style>
                        .password-display {
                            display: flex;
                            gap: 10px;
                            margin-bottom: 20px;
                        }
                        .password-display input {
                            flex: 1;
                            padding: 15px;
                            background: rgba(10, 15, 35, 0.9);
                            border: 1px solid rgba(0, 183, 255, 0.5);
                            border-radius: 8px;
                            color: #00b7ff;
                            font-size: 18px;
                            font-family: 'Courier New', monospace;
                            text-align: center;
                            letter-spacing: 1px;
                        }
                        .password-options {
                            background: rgba(20, 25, 60, 0.6);
                            padding: 15px;
                            border-radius: 8px;
                            border: 1px solid rgba(0, 183, 255, 0.2);
                        }
                        .option {
                            margin-bottom: 12px;
                            display: flex;
                            align-items: center;
                        }
                        .option:last-child {
                            margin-bottom: 0;
                        }
                        .option label {
                            flex: 1;
                            margin-left: 10px;
                        }
                        .option input[type="range"] {
                            flex: 1;
                            margin-left: 10px;
                        }
                        .strength-bar {
                            height: 8px;
                            background: rgba(20, 25, 60, 0.8);
                            border-radius: 4px;
                            margin-top: 10px;
                            overflow: hidden;
                        }
                        .strength-fill {
                            height: 100%;
                            background: linear-gradient(90deg, #f87171, #fbbf24, #4ade80);
                            border-radius: 4px;
                            transition: width 0.3s;
                        }
                    </style>
                `;
                break;
        }
        
        modalTitle.textContent = title;
        modalBody.innerHTML = content;
        modal.classList.add('active');
        
        // 根据工具ID初始化对应的工具功能
        initToolFunction(toolId);
    }
    
    // 初始化工具功能
    function initToolFunction(toolId) {
        switch(toolId) {
            case 'calculatorTool':
                initCalculator();
                break;
            case 'converterTool':
                initConverter();
                break;
            case 'timeTool':
                initWorldClock();
                break;
            case 'noteTool':
                initNotes();
                break;
            case 'codeTool':
                initCodeFormatter();
                break;
            case 'passwordTool':
                initPasswordGenerator();
                break;
        }
    }
    
    // 初始化计算器
    function initCalculator() {
        const display = document.getElementById('calcDisplay');
        const buttons = document.querySelectorAll('.calc-btn');
        
        let currentInput = '0';
        let previousInput = '';
        let operation = null;
        let resetScreen = false;
        
        function updateDisplay() {
            display.value = currentInput;
        }
        
        function appendNumber(number) {
            if (currentInput === '0' || resetScreen) {
                currentInput = number;
                resetScreen = false;
            } else {
                currentInput += number;
            }
        }
        
        function chooseOperation(op) {
            if (currentInput === '') return;
            
            if (previousInput !== '') {
                calculate();
            }
            
            operation = op;
            previousInput = currentInput;
            currentInput = '';
        }
        
        function calculate() {
            let computation;
            const prev = parseFloat(previousInput);
            const current = parseFloat(currentInput);
            
            if (isNaN(prev) || isNaN(current)) return;
            
            switch(operation) {
                case '+':
                    computation = prev + current;
                    break;
                case '-':
                    computation = prev - current;
                    break;
                case '×':
                    computation = prev * current;
                    break;
                case '/':
                    computation = prev / current;
                    break;
                case '%':
                    computation = prev % current;
                    break;
                default:
                    return;
            }
            
            currentInput = computation.toString();
            operation = undefined;
            previousInput = '';
            resetScreen = true;
        }
        
        function clear() {
            currentInput = '0';
            previousInput = '';
            operation = null;
        }
        
        function backspace() {
            if (currentInput.length === 1) {
                currentInput = '0';
            } else {
                currentInput = currentInput.slice(0, -1);
            }
        }
        
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const action = button.dataset.action;
                
                if (!isNaN(action)) {
                    appendNumber(action);
                } else {
                    switch(action) {
                        case '+':
                        case '-':
                        case '×':
                        case '/':
                        case '%':
                            chooseOperation(action);
                            break;
                        case 'equals':
                            calculate();
                            break;
                        case 'decimal':
                            if (!currentInput.includes('.')) {
                                appendNumber('.');
                            }
                            break;
                        case 'clear':
                            clear();
                            break;
                        case 'backspace':
                            backspace();
                            break;
                    }
                }
                
                updateDisplay();
            });
        });
        
        updateDisplay();
    }
    
    // 初始化单位转换器
    function initConverter() {
        const convertValue = document.getElementById('convertValue');
        const convertFrom = document.getElementById('convertFrom');
        const convertTo = document.getElementById('convertTo');
        const convertResult = document.getElementById('convertResult');
        const swapUnitsBtn = document.getElementById('swapUnits');
        const performConversionBtn = document.getElementById('performConversion');
        const conversionResult = document.getElementById('conversionResult');
        
        // 转换因子（以基本单位为准）
        const conversionFactors = {
            // 长度
            meter: 1,
            kilometer: 1000,
            centimeter: 0.01,
            millimeter: 0.001,
            inch: 0.0254,
            foot: 0.3048,
            mile: 1609.34,
            
            // 温度（特殊处理）
            celsius: 'celsius',
            fahrenheit: 'fahrenheit',
            kelvin: 'kelvin',
            
            // 重量
            kilogram: 1,
            gram: 0.001,
            pound: 0.453592,
            ounce: 0.0283495
        };
        
        // 温度转换函数
        function convertTemperature(value, fromUnit, toUnit) {
            let celsius;
            
            // 转换为摄氏度
            switch(fromUnit) {
                case 'celsius':
                    celsius = value;
                    break;
                case 'fahrenheit':
                    celsius = (value - 32) * 5/9;
                    break;
                case 'kelvin':
                    celsius = value - 273.15;
                    break;
            }
            
            // 从摄氏度转换为目标单位
            switch(toUnit) {
                case 'celsius':
                    return celsius;
                case 'fahrenheit':
                    return (celsius * 9/5) + 32;
                case 'kelvin':
                    return celsius + 273.15;
            }
        }
        
        function performConversion() {
            const value = parseFloat(convertValue.value);
            const fromUnit = convertFrom.value;
            const toUnit = convertTo.value;
            
            if (isNaN(value)) {
                conversionResult.innerHTML = '<strong>错误:</strong> 请输入有效的数值';
                conversionResult.style.display = 'block';
                return;
            }
            
            let result;
            
            // 检查是否是温度转换
            if (['celsius', 'fahrenheit', 'kelvin'].includes(fromUnit) && 
                ['celsius', 'fahrenheit', 'kelvin'].includes(toUnit)) {
                result = convertTemperature(value, fromUnit, toUnit);
            } else {
                // 普通单位转换
                const fromFactor = conversionFactors[fromUnit];
                const toFactor = conversionFactors[toUnit];
                
                if (typeof fromFactor === 'number' && typeof toFactor === 'number') {
                    // 先将输入值转换为基本单位，再转换为目标单位
                    const baseValue = value * fromFactor;
                    result = baseValue / toFactor;
                } else {
                    conversionResult.innerHTML = '<strong>错误:</strong> 无法转换这些单位类型';
                    conversionResult.style.display = 'block';
                    return;
                }
            }
            
            // 更新结果输入框
            convertResult.value = result.toFixed(6);
            
            // 显示详细结果
            const fromText = convertFrom.options[convertFrom.selectedIndex].text;
            const toText = convertTo.options[convertTo.selectedIndex].text;
            
            conversionResult.innerHTML = `
                <strong>转换结果:</strong><br>
                ${value} ${fromText} = ${result.toFixed(4)} ${toText}
            `;
            conversionResult.style.display = 'block';
            
            // 添加到工具输出区
            addToolOutput(`${value} ${fromText} = ${result.toFixed(4)} ${toText}`, '单位转换');
        }
        
        // 交换单位
        swapUnitsBtn.addEventListener('click', function() {
            const fromIndex = convertFrom.selectedIndex;
            const toIndex = convertTo.selectedIndex;
            
            convertFrom.selectedIndex = toIndex;
            convertTo.selectedIndex = fromIndex;
            
            // 交换输入值和结果值
            const tempValue = convertValue.value;
            convertValue.value = convertResult.value;
            convertResult.value = tempValue;
        });
        
        performConversionBtn.addEventListener('click', performConversion);
        
        // 初始转换
        setTimeout(() => {
            convertValue.value = "1";
            performConversion();
        }, 100);
    }
    
    // 初始化世界时钟
    function initWorldClock() {
        function updateClocks() {
            const now = new Date();
            
            // 本地时间
            const localTime = document.getElementById('localTime');
            const localDate = document.getElementById('localDate');
            
            localTime.textContent = now.toLocaleTimeString('zh-CN', { hour12: false });
            localDate.textContent = now.toLocaleDateString('zh-CN', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                weekday: 'long'
            });
            
            // 伦敦时间 (UTC+0)
            const londonTime = new Date(now.getTime());
            document.getElementById('londonTime').textContent = londonTime.toLocaleTimeString('zh-CN', { 
                hour12: false,
                timeZone: 'Europe/London'
            }).slice(0, 5);
            
            // 纽约时间 (UTC-5)
            const newyorkTime = new Date(now.getTime());
            document.getElementById('newyorkTime').textContent = newyorkTime.toLocaleTimeString('zh-CN', { 
                hour12: false,
                timeZone: 'America/New_York'
            }).slice(0, 5);
            
            // 东京时间 (UTC+9)
            const tokyoTime = new Date(now.getTime());
            document.getElementById('tokyoTime').textContent = tokyoTime.toLocaleTimeString('zh-CN', { 
                hour12: false,
                timeZone: 'Asia/Tokyo'
            }).slice(0, 5);
            
            // 悉尼时间 (UTC+10)
            const sydneyTime = new Date(now.getTime());
            document.getElementById('sydneyTime').textContent = sydneyTime.toLocaleTimeString('zh-CN', { 
                hour12: false,
                timeZone: 'Australia/Sydney'
            }).slice(0, 5);
        }
        
        updateClocks();
        setInterval(updateClocks, 1000);
    }
    
    // 初始化便签工具
    function initNotes() {
        const noteContent = document.getElementById('noteContent');
        const newNoteBtn = document.getElementById('newNote');
        const saveNoteBtn = document.getElementById('saveNote');
        const clearNoteBtn = document.getElementById('clearNote');
        const savedNotes = document.getElementById('savedNotes');
        
        // 从本地存储加载便签
        function loadNotes() {
            const notes = JSON.parse(localStorage.getItem('yocim_notes') || '[]');
            savedNotes.innerHTML = '';
            
            if (notes.length === 0) {
                savedNotes.innerHTML = '<p style="color: rgba(224, 224, 255, 0.5); text-align: center;">暂无保存的便签</p>';
                return;
            }
            
            notes.forEach((note, index) => {
                const noteElement = document.createElement('div');
                noteElement.className = 'note-item';
                noteElement.innerHTML = `
                    <div>${note.content.substring(0, 50)}${note.content.length > 50 ? '...' : ''}</div>
                    <div class="note-date">${note.date}</div>
                `;
                
                noteElement.addEventListener('click', function() {
                    noteContent.value = note.content;
                });
                
                savedNotes.appendChild(noteElement);
            });
        }
        
        // 新建便签
        newNoteBtn.addEventListener('click', function() {
            noteContent.value = '';
            noteContent.focus();
        });
        
        // 保存便签
        saveNoteBtn.addEventListener('click', function() {
            const content = noteContent.value.trim();
            
            if (!content) {
                addToolOutput('便签内容不能为空', '便签工具');
                return;
            }
            
            const notes = JSON.parse(localStorage.getItem('yocim_notes') || '[]');
            const now = new Date();
            const dateStr = now.toLocaleString('zh-CN');
            
            notes.push({
                content: content,
                date: dateStr
            });
            
            // 保存到本地存储
            localStorage.setItem('yocim_notes', JSON.stringify(notes));
            
            // 重新加载便签列表
            loadNotes();
            
            // 添加到工具输出区
            addToolOutput('便签已保存: ' + content.substring(0, 30) + (content.length > 30 ? '...' : ''), '便签工具');
        });
        
        // 清空便签
        clearNoteBtn.addEventListener('click', function() {
            noteContent.value = '';
        });
        
        // 初始加载
        loadNotes();
    }
    
    // 初始化代码格式化器
    function initCodeFormatter() {
        const codeInput = document.getElementById('codeInput');
        const formattedCode = document.getElementById('formattedCode');
        const formatCodeBtn = document.getElementById('formatCode');
        const copyCodeBtn = document.getElementById('copyCode');
        const codeLanguage = document.getElementById('codeLanguage');
        
        // 简单格式化函数（实际应用中应使用更复杂的格式化库）
        function formatCode(code, language) {
            // 这里只是简单的缩进处理，实际应使用专业库
            let formatted = code;
            
            // 基本缩进处理
            formatted = formatted.replace(/\{/g, ' {\n');
            formatted = formatted.replace(/\}/g, '\n}\n');
            formatted = formatted.replace(/;/g, ';\n');
            
            // 添加缩进
            let indentLevel = 0;
            const lines = formatted.split('\n');
            const result = [];
            
            for (let line of lines) {
                line = line.trim();
                if (!line) continue;
                
                // 减少缩进级别
                if (line.startsWith('}')) indentLevel = Math.max(0, indentLevel - 1);
                
                // 添加缩进
                result.push('  '.repeat(indentLevel) + line);
                
                // 增加缩进级别
                if (line.endsWith('{')) indentLevel++;
            }
            
            return result.join('\n');
        }
        
        formatCodeBtn.addEventListener('click', function() {
            const code = codeInput.value;
            const language = codeLanguage.value;
            
            if (!code.trim()) {
                formattedCode.textContent = '请输入要格式化的代码';
                return;
            }
            
            const formatted = formatCode(code, language);
            formattedCode.textContent = formatted;
            
            // 添加到工具输出区
            addToolOutput(`已格式化${language.toUpperCase()}代码 (${code.length} 字符)`, '代码格式化');
        });
        
        copyCodeBtn.addEventListener('click', function() {
            const code = formattedCode.textContent;
            
            if (!code.trim()) {
                addToolOutput('没有可复制的代码', '代码格式化');
                return;
            }
            
            navigator.clipboard.writeText(code).then(() => {
                addToolOutput('代码已复制到剪贴板', '代码格式化');
            }).catch(err => {
                addToolOutput('复制失败: ' + err, '代码格式化');
            });
        });
        
        // 示例代码
        codeInput.value = `function helloWorld() {
console.log("Hello, World!");
for(let i=0;i<5;i++){console.log(i);}
}`;
        
        // 初始格式化
        setTimeout(() => {
            formatCodeBtn.click();
        }, 100);
    }
    
    // 初始化密码生成器
    function initPasswordGenerator() {
        const generatedPassword = document.getElementById('generatedPassword');
        const copyPasswordBtn = document.getElementById('copyPassword');
        const pwLength = document.getElementById('pwLength');
        const lengthValue = document.getElementById('lengthValue');
        const includeUppercase = document.getElementById('includeUppercase');
        const includeLowercase = document.getElementById('includeLowercase');
        const includeNumbers = document.getElementById('includeNumbers');
        const includeSymbols = document.getElementById('includeSymbols');
        const generatePasswordBtn = document.getElementById('generatePassword');
        const strengthText = document.getElementById('strengthText');
        const strengthFill = document.getElementById('strengthFill');
        
        // 字符集
        const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
        const numberChars = '0123456789';
        const symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
        
        // 更新长度显示
        pwLength.addEventListener('input', function() {
            lengthValue.textContent = this.value;
        });
        
        // 生成密码
        function generatePassword() {
            let charset = '';
            let password = '';
            
            // 构建字符集
            if (includeUppercase.checked) charset += uppercaseChars;
            if (includeLowercase.checked) charset += lowercaseChars;
            if (includeNumbers.checked) charset += numberChars;
            if (includeSymbols.checked) charset += symbolChars;
            
            // 如果没有选择任何字符类型，使用默认
            if (charset === '') {
                charset = lowercaseChars + numberChars;
                includeLowercase.checked = true;
                includeNumbers.checked = true;
            }
            
            // 生成密码
            const length = parseInt(pwLength.value);
            for (let i = 0; i < length; i++) {
                const randomIndex = Math.floor(Math.random() * charset.length);
                password += charset[randomIndex];
            }
            
            // 更新密码显示
            generatedPassword.value = password;
            
            // 评估密码强度
            evaluatePasswordStrength(password);
            
            // 添加到工具输出区
            addToolOutput(`已生成新密码: ${password}`, '密码生成器');
        }
        
        // 评估密码强度
        function evaluatePasswordStrength(password) {
            let strength = 0;
            let width = 0;
            let text = '极弱';
            
            // 长度评分
            if (password.length >= 8) strength += 20;
            if (password.length >= 12) strength += 20;
            if (password.length >= 16) strength += 20;
            
            // 字符种类评分
            if (/[A-Z]/.test(password)) strength += 15;
            if (/[a-z]/.test(password)) strength += 15;
            if (/[0-9]/.test(password)) strength += 15;
            if (/[^A-Za-z0-9]/.test(password)) strength += 15;
            
            // 确定强度和显示
            if (strength >= 80) {
                text = '极强';
                width = 100;
            } else if (strength >= 60) {
                text = '强';
                width = 75;
            } else if (strength >= 40) {
                text = '中等';
                width = 50;
            } else if (strength >= 20) {
                text = '弱';
                width = 25;
            } else {
                width = 10;
            }
            
            strengthText.textContent = text;
            strengthFill.style.width = width + '%';
            
            // 设置颜色
            if (width <= 25) {
                strengthFill.style.background = '#f87171';
            } else if (width <= 50) {
                strengthFill.style.background = '#fbbf24';
            } else if (width <= 75) {
                strengthFill.style.background = '#4ade80';
            } else {
                strengthFill.style.background = 'linear-gradient(90deg, #4ade80, #22d3ee)';
            }
        }
        
        // 复制密码
        copyPasswordBtn.addEventListener('click', function() {
            const password = generatedPassword.value;
            
            if (!password) {
                addToolOutput('没有可复制的密码', '密码生成器');
                return;
            }
            
            navigator.clipboard.writeText(password).then(() => {
                addToolOutput('密码已复制到剪贴板', '密码生成器');
            }).catch(err => {
                addToolOutput('复制失败: ' + err, '密码生成器');
            });
        });
        
        generatePasswordBtn.addEventListener('click', generatePassword);
        
        // 初始生成密码
        setTimeout(generatePassword, 100);
    }
    
    // 添加工具输出
    function addToolOutput(text, toolName) {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('zh-CN', { hour12: false, hour: '2-digit', minute: '2-digit' });
        
        const outputDiv = document.createElement('div');
        outputDiv.className = 'output-message';
        outputDiv.innerHTML = `
            <div class="output-icon">
                <i class="fas fa-tools"></i>
            </div>
            <div class="output-text">
                <strong>[${toolName}] ${timeStr}</strong><br>
                ${text}
            </div>
        `;
        
        toolOutput.appendChild(outputDiv);
        
        // 滚动到底部
        toolOutput.scrollTop = toolOutput.scrollHeight;
    }
    
    // 关闭模态框
    closeModal.addEventListener('click', function() {
        modal.classList.remove('active');
    });
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
    
    // 添加初始欢迎消息
    setTimeout(() => {
        updateStatus('YOCIM助手已启动，所有系统正常');
    }, 1000);
});
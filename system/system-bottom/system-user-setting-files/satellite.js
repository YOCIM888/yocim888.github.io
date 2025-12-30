// trash-can.js
document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const controlButtons = document.querySelectorAll('.control-btn');
    const authModal = document.getElementById('auth-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    const keyInput = document.getElementById('key-input');
    const submitKeyBtn = document.getElementById('submit-key');
    const alertText = document.getElementById('alert-text');
    const queueInfo = document.getElementById('queue-info');
    const clearLogBtn = document.getElementById('clear-log');
    const logContent = document.getElementById('log-content');
    
    // 当前操作信息
    let currentAction = {
        satellite: '',
        action: '',
        description: ''
    };
    
    // 操作描述映射
    const actionDescriptions = {
        'diagnostic': '执行系统诊断',
        'adjust': '进行轨道调整',
        'imaging': '启动高分辨率成像',
        'calibrate': '校准瞄准系统',
        'test': '执行测试射击',
        'engage': '启动作战部署',
        'scan': '执行深度扫描',
        'intercept': '启动拦截协议',
        'evasive': '执行规避机动'
    };
    
    // 卫星名称映射
    const satelliteNames = {
        'leo': '近地轨道卫星',
        'laser': '激光打击卫星',
        'intercept': '陨石拦截卫星'
    };
    
    // 添加日志条目
    function addLogEntry(message) {
        const now = new Date();
        const timeString = `[${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}]`;
        
        const logEntry = document.createElement('div');
        logEntry.className = 'log-entry';
        logEntry.innerHTML = `<span class="log-time">${timeString}</span> ${message}`;
        
        logContent.appendChild(logEntry);
        logContent.scrollTop = logContent.scrollHeight;
    }
    
    // 显示权限验证模态框
    function showAuthModal(satellite, action) {
        currentAction.satellite = satellite;
        currentAction.action = action;
        currentAction.description = actionDescriptions[action] || '执行操作';
        
        alertText.textContent = `您的权限不足，无法${currentAction.description}`;
        keyInput.value = '';
        queueInfo.classList.add('hidden');
        authModal.classList.add('active');
        
        // 添加日志
        addLogEntry(`尝试${currentAction.description} - ${satelliteNames[satellite]} - 权限被拒绝`);
    }
    
    // 隐藏权限验证模态框
    function hideAuthModal() {
        authModal.classList.remove('active');
    }
    
    // 验证密钥
    function validateKey() {
        const key = keyInput.value.trim();
        
        if (key === '') {
            alertText.textContent = '请输入访问密钥';
            keyInput.focus();
            return;
        }
        
        if (key !== 'YOCIM666') {
            alertText.textContent = '密钥错误，访问被拒绝';
            keyInput.value = '';
            keyInput.focus();
            
            // 添加日志
            addLogEntry(`尝试使用无效密钥访问系统: "${key.substring(0, 3)}..."`);
            return;
        }
        
        // 密钥正确，显示排队信息
        alertText.textContent = '密钥验证成功，正在处理请求...';
        queueInfo.classList.remove('hidden');
        
        // 添加日志
        addLogEntry(`密钥验证成功 - ${currentAction.description} - ${satelliteNames[currentAction.satellite]}`);
        addLogEntry(`请求已加入队列，位置: #9,472,185，预计等待时间: 3367年`);
        
        // 3秒后重置模态框
        setTimeout(() => {
            hideAuthModal();
            
            // 5秒后显示另一个随机操作被拒绝
            setTimeout(() => {
                const actions = Object.keys(actionDescriptions);
                const randomAction = actions[Math.floor(Math.random() * actions.length)];
                const satellites = Object.keys(satelliteNames);
                const randomSatellite = satellites[Math.floor(Math.random() * satellites.length)];
                
                showAuthModal(randomSatellite, randomAction);
            }, 5000);
        }, 5000);
    }
    
    // 为所有控制按钮添加点击事件
    controlButtons.forEach(button => {
        button.addEventListener('click', function() {
            const satellite = this.getAttribute('data-satellite');
            const action = this.getAttribute('data-action');
            
            // 显示权限验证模态框
            showAuthModal(satellite, action);
        });
    });
    
    // 关闭模态框
    closeModalBtn.addEventListener('click', hideAuthModal);
    
    // 点击模态框背景关闭
    authModal.addEventListener('click', function(e) {
        if (e.target === authModal) {
            hideAuthModal();
        }
    });
    
    // 提交密钥
    submitKeyBtn.addEventListener('click', validateKey);
    
    // 按回车键提交密钥
    keyInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            validateKey();
        }
    });
    
    // 清空日志
    clearLogBtn.addEventListener('click', function() {
        // 先添加一条清空日志的记录
        addLogEntry('系统日志已被清空');
        
        // 等待片刻后清空
        setTimeout(() => {
            logContent.innerHTML = '';
            addLogEntry('系统日志初始化完成');
        }, 300);
    });
    
    // 添加一些初始动态效果
    function initEffects() {
        // 随机更新一些指标
        setInterval(() => {
            const metrics = document.querySelectorAll('.metric-value');
            if (metrics.length > 0) {
                const randomMetric = metrics[Math.floor(Math.random() * metrics.length)];
                const parent = randomMetric.closest('.metric');
                const progressFill = parent.querySelector('.progress-fill');
                
                // 轻微改变数值和进度条
                if (randomMetric.textContent.includes('%')) {
                    const currentValue = parseInt(randomMetric.textContent);
                    const newValue = Math.min(100, Math.max(0, currentValue + (Math.random() > 0.5 ? 1 : -1)));
                    randomMetric.textContent = newValue + '%';
                    
                    if (progressFill) {
                        progressFill.style.width = newValue + '%';
                    }
                } else if (randomMetric.textContent.includes('Gbps')) {
                    const currentValue = parseFloat(randomMetric.textContent);
                    const newValue = Math.max(0.5, currentValue + (Math.random() > 0.5 ? 0.1 : -0.1));
                    randomMetric.textContent = newValue.toFixed(1) + ' Gbps';
                    
                    if (progressFill) {
                        const percent = Math.min(100, (newValue / 3) * 100);
                        progressFill.style.width = percent + '%';
                    }
                }
            }
        }, 3000);
        
        // 随机添加日志条目
        const logMessages = [
            '系统自检完成，所有模块运行正常',
            '更新轨道参数数据库',
            '检测到太阳风活动增强',
            '同步所有卫星时间戳',
            '清理临时数据缓存',
            '检查通信链路稳定性',
            '监控空间碎片轨迹',
            '更新星历数据'
        ];
        
        setInterval(() => {
            if (Math.random() > 0.7) {
                const randomMessage = logMessages[Math.floor(Math.random() * logMessages.length)];
                addLogEntry(randomMessage);
            }
        }, 8000);
    }
    
    // 初始化
    initEffects();
    addLogEntry('卫星控制台初始化完成');
    addLogEntry('所有系统运行正常，等待指令...');
});
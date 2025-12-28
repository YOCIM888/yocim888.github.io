// setting.js

document.addEventListener('DOMContentLoaded', function() {
    // 更新当前时间
    function updateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('zh-CN', { 
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        document.getElementById('current-time').textContent = timeString;
    }
    
    // 初始更新时间
    updateTime();
    // 每秒更新时间
    setInterval(updateTime, 1000);
    
    // 获取所有设置卡片
    const settingCards = document.querySelectorAll('.setting-card');
    
    // 为每个设置卡片添加点击事件
    settingCards.forEach(card => {
        card.addEventListener('click', function() {
            // 获取设置名称
            const settingName = this.querySelector('h3').textContent;
            
            // 显示访问拒绝提示
            showAccessDenied(settingName);
            
            // 添加点击效果
            this.style.borderColor = 'rgba(255, 0, 85, 0.8)';
            this.style.boxShadow = '0 0 25px rgba(255, 0, 85, 0.5)';
            
            // 恢复原样
            setTimeout(() => {
                this.style.borderColor = '';
                this.style.boxShadow = '';
            }, 500);
        });
    });
    
    // 显示访问拒绝提示
    function showAccessDenied(settingName) {
        const banner = document.getElementById('access-banner');
        const originalText = banner.querySelector('span').textContent;
        
        // 更新横幅文本
        banner.querySelector('span').textContent = `非管理员，权限不足！无法访问：${settingName}`;
        
        // 增强警告效果
        banner.style.background = 'linear-gradient(90deg, rgba(255, 0, 85, 0.3), rgba(255, 0, 85, 0.4), rgba(255, 0, 85, 0.3))';
        banner.style.color = '#ff0055';
        banner.style.textShadow = '0 0 8px rgba(255, 0, 85, 0.9)';
        banner.style.animation = 'banner-alert 0.5s infinite alternate';
        
        // 创建闪烁的故障效果
        createGlitchEffect();
        
        // 播放警告音效（模拟）
        playWarningSound();
        
        // 3秒后恢复原始横幅
        setTimeout(() => {
            banner.querySelector('span').textContent = originalText;
            banner.style.background = '';
            banner.style.animation = '';
        }, 3000);
    }
    
    // 创建故障效果
    function createGlitchEffect() {
        const glitch = document.querySelector('.cyber-glitch');
        
        // 随机闪烁几次
        let flashes = 0;
        const maxFlashes = 5;
        
        const flashInterval = setInterval(() => {
            glitch.style.opacity = Math.random() > 0.5 ? '0.2' : '0';
            flashes++;
            
            if (flashes >= maxFlashes) {
                clearInterval(flashInterval);
                glitch.style.opacity = '0';
            }
        }, 50);
    }
    
    // 模拟警告音效
    function playWarningSound() {
        // 创建音频上下文（如果没有）
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        
        const audioContext = new AudioContext();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.3);
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.3);
    }
    
    // 添加随机系统状态更新
    function updateSystemStatus() {
        const statusItems = document.querySelectorAll('.status-item .status-value');
        
        statusItems.forEach(item => {
            if (item.textContent.includes('°C')) {
                // 更新温度
                const temp = 40 + Math.floor(Math.random() * 5);
                item.innerHTML = `${temp}°C <i class="fas fa-thermometer-half"></i>`;
            } else if (item.textContent.includes('%')) {
                // 更新内存使用
                const usage = 60 + Math.floor(Math.random() * 15);
                item.innerHTML = `${usage}% <i class="fas fa-microchip"></i>`;
            } else if (item.textContent.includes('ms')) {
                // 更新网络延迟
                const latency = 10 + Math.floor(Math.random() * 10);
                item.innerHTML = `${latency}ms <i class="fas fa-bolt"></i>`;
            }
        });
    }
    
    // 每10秒更新一次系统状态
    setInterval(updateSystemStatus, 10000);
    
    // 初始化扫描线效果
    initScanLine();
    
    // 初始化扫描线
    function initScanLine() {
        const scanLine = document.querySelector('.scan-line');
        
        // 随机改变扫描线速度
        setInterval(() => {
            const duration = 2 + Math.random() * 4;
            scanLine.style.animationDuration = `${duration}s`;
        }, 5000);
    }
    
    // 添加控制台欢迎信息
    console.log('%c=== 赛博控制中心已启动 ===', 'color: #00f3ff; font-size: 16px; font-weight: bold;');
    console.log('%c系统状态：在线', 'color: #00ff9d;');
    console.log('%c警告：访客权限限制中', 'color: #ff0055;');
});
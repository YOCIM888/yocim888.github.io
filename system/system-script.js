// system-script.js
document.addEventListener('DOMContentLoaded', function() {
    // 更新时间日期
    function updateDateTime() {
        const now = new Date();
        
        // 格式化时间
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const timeString = `${hours}:${minutes}:${seconds}`;
        
        // 格式化日期
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        
        // 中文星期
        const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
        const weekday = weekdays[now.getDay()];
        
        const dateString = `${year}年${month}月${day}日 ${weekday}`;
        
        // 更新DOM
        document.querySelector('.time').textContent = timeString;
        document.querySelector('.date').textContent = dateString;
        
        // 每秒更新一次
        setTimeout(updateDateTime, 1000);
    }
    
    // 更新星痕能量指示器
    function updateEnergyIndicator() {
        const energyLevel = document.querySelector('.energy-level');
        const energyFill = document.querySelector('.energy-fill');
        
        // 模拟能量波动
        const baseLevel = 87;
        const fluctuation = Math.sin(Date.now() / 5000) * 3; // 5秒周期
        const currentLevel = Math.min(100, Math.max(0, Math.round(baseLevel + fluctuation)));
        
        // 更新显示
        energyLevel.textContent = `${currentLevel}%`;
        energyFill.style.width = `${currentLevel}%`;
        
        // 根据能量级别改变颜色
        if (currentLevel > 70) {
            energyFill.style.background = 'linear-gradient(90deg, #0066ff, #00ffaa)';
            energyLevel.style.color = '#00ffaa';
        } else if (currentLevel > 40) {
            energyFill.style.background = 'linear-gradient(90deg, #0066ff, #ffff00)';
            energyLevel.style.color = '#ffff00';
        } else {
            energyFill.style.background = 'linear-gradient(90deg, #ff3300, #ff9900)';
            energyLevel.style.color = '#ff3300';
        }
        
        // 更新统计信息
        const outputPower = (4.2 + Math.random() * 0.2).toFixed(1);
        const stability = Math.min(99, Math.max(90, 94 + Math.random() * 4 - 2)).toFixed(0);
        const temperature = Math.min(300, Math.max(200, 240 + Math.random() * 20 - 10)).toFixed(0);
        
        document.querySelectorAll('.energy-stats strong')[0].textContent = `${outputPower} GW`;
        document.querySelectorAll('.energy-stats strong')[1].textContent = `${stability}%`;
        document.querySelectorAll('.energy-stats strong')[2].textContent = `${temperature}°C`;
        
        // 每2秒更新一次
        setTimeout(updateEnergyIndicator, 2000);
    }
    
    // 更新系统监视器
    function updateSystemMonitor() {
        // 模拟数据变化
        const bandwidth = Math.min(100, Math.max(50, 75 + Math.random() * 10 - 5)).toFixed(0);
        const latency = Math.min(10, Math.max(1, 3 + Math.random() * 4 - 2)).toFixed(0);
        
        // 更新DOM
        const bandwidthBar = document.querySelectorAll('.data-bar')[0];
        const bandwidthValue = document.querySelectorAll('.data-value span')[0];
        bandwidthBar.style.width = `${bandwidth}%`;
        bandwidthValue.textContent = `${bandwidth}%`;
        
        const latencyBar = document.querySelectorAll('.data-bar')[1];
        const latencyValue = document.querySelectorAll('.data-value span')[1];
        latencyBar.style.width = `${100 - latency * 10}%`;
        latencyValue.textContent = `${latency}ms`;
        
        // 每3秒更新一次
        setTimeout(updateSystemMonitor, 3000);
    }
    
    // 电源菜单功能
    const powerBtn = document.getElementById('powerBtn');
    const powerOptions = document.getElementById('powerOptions');
    
    powerBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        powerOptions.classList.toggle('show');
    });
    
    // 点击页面其他区域关闭电源菜单
    document.addEventListener('click', function() {
        powerOptions.classList.remove('show');
    });
    
    // 防止电源菜单点击事件冒泡
    powerOptions.addEventListener('click', function(e) {
        e.stopPropagation();
    });
    
    // 电源选项功能
    const powerOptionItems = document.querySelectorAll('.power-option');
    powerOptionItems.forEach(item => {
        item.addEventListener('click', function() {
            const action = this.querySelector('i').className;
            alert(`非管理员，无法执行操作: ${this.textContent.trim()}`);
            powerOptions.classList.remove('show');
        });
    });

    // 任务栏项目交互
    const taskbarItems = document.querySelectorAll('.taskbar-item');
    taskbarItems.forEach(item => {
        item.addEventListener('click', function() {
            // 移除所有活动状态
            taskbarItems.forEach(i => i.classList.remove('active'));
            // 添加当前活动状态
            this.classList.add('active');
            
            // 这里可以添加打开相应应用的功能
            console.log(`打开: ${this.querySelector('span').textContent}`);
        });
    });
  // 开始按钮交互
const startBtn = document.querySelector('.start-btn');
startBtn.addEventListener('click', function() {
    // 跳转到系统用户设置页面
    window.location.href = 'system/system-bottom/system-user-setting.html';
});

    // 初始化函数
    function init() {
        // 启动时间更新
        updateDateTime();
        
        // 启动能量指示器
        updateEnergyIndicator();
        
        // 启动系统监视器
        updateSystemMonitor();
        
        
        
        // 创建图标
        icons.forEach(iconData => {
            const iconElement = document.createElement('div');
            iconElement.className = 'desktop-icon';
            iconElement.innerHTML = `
                <div class="icon-img" style="color: ${iconData.color}">
                    <i class="${iconData.icon}"></i>
                </div>
                <div class="icon-name">${iconData.name}</div>
            `;
            
            // 点击图标事件
            iconElement.addEventListener('click', function() {
                // 移除所有图标的选中状态
                document.querySelectorAll('.desktop-icon').forEach(icon => {
                    icon.classList.remove('selected');
                });
                // 添加当前图标的选中状态
                this.classList.add('selected');
                
                // 这里可以添加打开应用程序的功能
                console.log(`打开: ${iconData.name}`);
            });
            
            // 双击图标事件
            iconElement.addEventListener('dblclick', function() {
                alert(`启动应用程序: ${iconData.name}`);
            });
            
            iconArea.appendChild(iconElement);
        });
        
        // 添加图标样式
        const style = document.createElement('style');
        style.textContent = `
            .desktop-icon {
                width: 100px;
                height: 100px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                border-radius: 8px;
                padding: 10px;
                transition: all 0.3s;
            }
            
            .desktop-icon:hover {
                background: rgba(0, 100, 255, 0.2);
                transform: translateY(-5px);
            }
            
            .desktop-icon.selected {
                background: rgba(0, 100, 255, 0.3);
                border: 1px solid rgba(0, 200, 255, 0.5);
            }
            
            .icon-img {
                width: 50px;
                height: 50px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 30px;
                margin-bottom: 10px;
                text-shadow: 0 0 10px currentColor;
            }
            
            .icon-name {
                font-size: 12px;
                text-align: center;
                color: #a0a0ff;
                text-shadow: 0 0 5px rgba(160, 160, 255, 0.5);
                word-break: break-word;
                max-width: 100%;
            }
        `;
        document.head.appendChild(style);
    }
    
    // 初始化桌面系统
    init();
});

// 卫星控制盘按钮交互效果
document.addEventListener('DOMContentLoaded', function() {
    const satelliteBtn = document.getElementById('satelliteControlBtn');
    
    if (satelliteBtn) {
        // 添加点击效果
        satelliteBtn.addEventListener('click', function(e) {
            // 阻止默认行为，我们将自定义跳转
            e.preventDefault();
            
            // 获取目标URL
            const targetUrl = this.getAttribute('href');
            
            // 添加火箭发射动画
            const rocketIcon = this.querySelector('.rocket-icon');
            rocketIcon.classList.add('rocket-launch');
            
            // 添加按钮点击效果
            this.style.transform = 'scale(0.95)';
            this.style.boxShadow = '0 0 5px rgba(0, 212, 255, 0.9), inset 0 0 15px rgba(255, 255, 255, 0.5)';
            
            // 延迟跳转以显示动画效果
            setTimeout(() => {
                window.location.href = targetUrl;
            }, 800);
        });
        
        // 添加键盘快捷键支持（例如，按'S'键可以激活按钮）
        document.addEventListener('keydown', function(e) {
            // 检查是否按下了'S'键（卫星控制盘的"S"）
            if (e.key === 's' || e.key === 'S') {
                // 检查没有聚焦在输入元素上
                if (document.activeElement.tagName !== 'INPUT' && 
                    document.activeElement.tagName !== 'TEXTAREA') {
                    satelliteBtn.focus();
                    satelliteBtn.style.outline = '2px solid #00f3ff';
                    satelliteBtn.style.outlineOffset = '2px';
                    
                    // 2秒后移除焦点样式
                    setTimeout(() => {
                        satelliteBtn.style.outline = 'none';
                    }, 2000);
                }
            }
        });
        
        // 添加鼠标悬停音效模拟
        satelliteBtn.addEventListener('mouseenter', function() {
            // 模拟悬停音效（实际网站中您可以添加真实音效）
            this.style.animation = 'none';
            setTimeout(() => {
                this.style.animation = '';
            }, 10);
        });
    }
    
    // 添加随机脉冲动画变化，增强未来感
    function randomizePulse() {
        const pulseRing = document.querySelector('.pulse-ring');
        if (pulseRing) {
            // 随机改变脉冲动画的持续时间和大小
            const duration = 2 + Math.random() * 2; // 2-4秒
            pulseRing.style.animationDuration = `${duration}s`;
            
            // 随机改变颜色
            const hue = 180 + Math.random() * 40; // 180-220度，蓝绿色调
            pulseRing.style.borderColor = `hsla(${hue}, 100%, 60%, 0.6)`;
        }
    }
    
    // 每10秒随机改变一次脉冲效果
    setInterval(randomizePulse, 10000);
    
    // 初始随机化
    setTimeout(randomizePulse, 100);
});
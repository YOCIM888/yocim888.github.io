// 移动端虚拟控制器
class VirtualControls {
    constructor() {
        this.joystickContainer = document.getElementById('joystickContainer');
        this.joystickThumb = document.getElementById('joystickThumb');
        this.jumpButton = document.getElementById('jumpButton');
        this.pauseButton = document.getElementById('pauseButton');
        this.virtualControls = document.getElementById('virtualControls');
        
        this.joystick = {
            x: 0,
            y: 0,
            active: false,
            baseX: 0,
            baseY: 0,
            maxRadius: 50
        };
        
        this.virtualJump = false;
        this.isMobile = false;
        
        this.init();
    }
    
    init() {
        // 检测移动设备
        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (this.isMobile) {
            this.setupEventListeners();
        } else {
            this.virtualControls.style.display = 'none';
        }
    }
    
    setupEventListeners() {
        // 触摸摇杆事件
        this.joystickContainer.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const rect = this.joystickContainer.getBoundingClientRect();
            
            this.joystick.baseX = rect.left + rect.width / 2;
            this.joystick.baseY = rect.top + rect.height / 2;
            this.joystick.active = true;
            
            this.updateJoystick(touch.clientX, touch.clientY);
        });
        
        document.addEventListener('touchmove', (e) => {
            if (!this.joystick.active) return;
            
            e.preventDefault();
            const touch = e.touches[0];
            this.updateJoystick(touch.clientX, touch.clientY);
        });
        
        document.addEventListener('touchend', (e) => {
            if (!this.joystick.active) return;
            
            this.joystick.active = false;
            this.resetJoystick();
        });
        
        // 触摸取消事件
        document.addEventListener('touchcancel', (e) => {
            this.joystick.active = false;
            this.resetJoystick();
        });
        
        // 跳跃按钮事件
        this.jumpButton.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.virtualJump = true;
            this.jumpButton.style.transform = 'scale(0.9)';
            this.jumpButton.style.backgroundColor = 'rgba(0, 255, 136, 0.4)';
        });
        
        this.jumpButton.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.virtualJump = false;
            this.jumpButton.style.transform = 'scale(1)';
            this.jumpButton.style.backgroundColor = 'rgba(0, 255, 136, 0.2)';
        });
        
        // 暂停按钮事件
        this.pauseButton.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (game.running && !game.gameOver) {
                game.paused = !game.paused;
                this.pauseButton.style.transform = 'scale(0.9)';
                this.pauseButton.style.backgroundColor = 'rgba(255, 0, 136, 0.4)';
                
                setTimeout(() => {
                    this.pauseButton.style.transform = 'scale(1)';
                    this.pauseButton.style.backgroundColor = 'rgba(255, 0, 136, 0.2)';
                }, 150);
            }
        });
    }
    
    updateJoystick(clientX, clientY) {
        if (!this.joystick.active) return;
        
        let deltaX = clientX - this.joystick.baseX;
        let deltaY = clientY - this.joystick.baseY;
        
        // 限制摇杆移动范围
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        if (distance > this.joystick.maxRadius) {
            deltaX = (deltaX / distance) * this.joystick.maxRadius;
            deltaY = (deltaY / distance) * this.joystick.maxRadius;
        }
        
        // 更新摇杆位置
        this.joystickThumb.style.transform = `translate(calc(-50% + ${deltaX}px), calc(-50% + ${deltaY}px))`;
        
        // 更新虚拟摇杆值
        this.joystick.x = deltaX / this.joystick.maxRadius;
        this.joystick.y = deltaY / this.joystick.maxRadius;
        
        // 将摇杆值暴露给游戏
        window.virtualJoystick = this.joystick;
    }
    
    resetJoystick() {
        this.joystickThumb.style.transform = 'translate(-50%, -50%)';
        this.joystick.x = 0;
        this.joystick.y = 0;
        window.virtualJoystick = this.joystick;
    }
}

// 初始化虚拟控制器
document.addEventListener('DOMContentLoaded', () => {
    const virtualControls = new VirtualControls();
    
    // 暴露虚拟跳跃状态给游戏
    Object.defineProperty(window, 'virtualJump', {
        get: function() {
            return virtualControls.virtualJump;
        },
        set: function(value) {
            virtualControls.virtualJump = value;
        }
    });
    
    // 暴露虚拟摇杆给游戏
    window.virtualJoystick = virtualControls.joystick;
    
    console.log("虚拟控制器已初始化");
});

// 移动端全屏处理
function requestFullscreen() {
    const elem = document.documentElement;
    
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
    }
}

// 退出全屏
function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
}

// 添加全屏按钮（可选）
function addFullscreenButton() {
    if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        return;
    }
    
    const fullscreenBtn = document.createElement('div');
    fullscreenBtn.className = 'action-button fullscreen-button';
    fullscreenBtn.innerHTML = '<span>全屏</span>';
    fullscreenBtn.style.position = 'fixed';
    fullscreenBtn.style.top = '20px';
    fullscreenBtn.style.right = '20px';
    fullscreenBtn.style.zIndex = '1000';
    
    fullscreenBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (!document.fullscreenElement) {
            requestFullscreen();
            fullscreenBtn.innerHTML = '<span>退出</span>';
        } else {
            exitFullscreen();
            fullscreenBtn.innerHTML = '<span>全屏</span>';
        }
    });
    
    document.body.appendChild(fullscreenBtn);
}

// 页面加载完成后添加全屏按钮
window.addEventListener('load', addFullscreenButton);

// 处理全屏变化
document.addEventListener('fullscreenchange', handleFullscreenChange);
document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
document.addEventListener('msfullscreenchange', handleFullscreenChange);

function handleFullscreenChange() {
    if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
        // 退出全屏
        console.log("已退出全屏模式");
    } else {
        // 进入全屏
        console.log("已进入全屏模式");
    }
}
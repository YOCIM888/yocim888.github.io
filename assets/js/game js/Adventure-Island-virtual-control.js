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
        
        this.init();
    }
    
    init() {
        // 检测是否为触摸设备（包括手机、平板、触摸屏笔记本）
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        // 检测移动端 UserAgent
        const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        // 如果既是触摸设备又是移动 UA，则显示虚拟控制器；否则隐藏
        if (isTouchDevice && isMobileUA) {
            this.virtualControls.style.display = 'flex';   // 显示摇杆
            this.setupEventListeners();                     // 绑定触摸事件
        } else {
            this.virtualControls.style.display = 'none';    // 隐藏摇杆
        }
    }
    
    setupEventListeners() {
        // 摇杆触摸开始（使用 passive: false 确保 preventDefault 生效）
        this.joystickContainer.addEventListener('touchstart', this.onTouchStart.bind(this), { passive: false });
        
        // 触摸移动（绑定到 document，确保手指移出摇杆后仍能跟踪）
        document.addEventListener('touchmove', this.onTouchMove.bind(this), { passive: false });
        
        // 触摸结束
        document.addEventListener('touchend', this.onTouchEnd.bind(this), { passive: false });
        document.addEventListener('touchcancel', this.onTouchEnd.bind(this), { passive: false });
        
        // 跳跃按钮
        this.jumpButton.addEventListener('touchstart', this.onJumpStart.bind(this), { passive: false });
        this.jumpButton.addEventListener('touchend', this.onJumpEnd.bind(this), { passive: false });
        
        // 暂停按钮
        this.pauseButton.addEventListener('touchstart', this.onPauseStart.bind(this), { passive: false });
    }
    
    onTouchStart(e) {
        e.preventDefault();  // 阻止滚动
        console.log('[摇杆] touchstart');  // 调试用
        const touch = e.touches[0];
        const rect = this.joystickContainer.getBoundingClientRect();
        
        this.joystick.baseX = rect.left + rect.width / 2;
        this.joystick.baseY = rect.top + rect.height / 2;
        this.joystick.active = true;
        
        this.updateJoystick(touch.clientX, touch.clientY);
    }
    
    onTouchMove(e) {
        if (!this.joystick.active) return;
        e.preventDefault();
        console.log('[摇杆] touchmove');
        const touch = e.touches[0];
        this.updateJoystick(touch.clientX, touch.clientY);
    }
    
    onTouchEnd(e) {
        if (!this.joystick.active) return;
        e.preventDefault();
        console.log('[摇杆] touchend');
        this.joystick.active = false;
        this.resetJoystick();
    }
    
    updateJoystick(clientX, clientY) {
        let deltaX = clientX - this.joystick.baseX;
        let deltaY = clientY - this.joystick.baseY;
        
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        if (distance > this.joystick.maxRadius) {
            deltaX = (deltaX / distance) * this.joystick.maxRadius;
            deltaY = (deltaY / distance) * this.joystick.maxRadius;
        }
        
        // 移动 thumb（视觉反馈）
        this.joystickThumb.style.transform = `translate(calc(-50% + ${deltaX}px), calc(-50% + ${deltaY}px))`;
        
        // 更新摇杆值
        this.joystick.x = deltaX / this.joystick.maxRadius;
        this.joystick.y = deltaY / this.joystick.maxRadius;
        window.virtualJoystick = this.joystick;
    }
    
    resetJoystick() {
        this.joystickThumb.style.transform = 'translate(-50%, -50%)';
        this.joystick.x = 0;
        this.joystick.y = 0;
        window.virtualJoystick = this.joystick;
    }
    
    onJumpStart(e) {
        e.preventDefault();
        console.log('[跳跃] touchstart');
        this.virtualJump = true;
        this.jumpButton.style.transform = 'scale(0.9)';
        this.jumpButton.style.backgroundColor = 'rgba(0, 255, 136, 0.4)';
    }
    
    onJumpEnd(e) {
        e.preventDefault();
        console.log('[跳跃] touchend');
        this.virtualJump = false;
        this.jumpButton.style.transform = 'scale(1)';
        this.jumpButton.style.backgroundColor = 'rgba(0, 255, 136, 0.2)';
    }
    
    onPauseStart(e) {
        e.preventDefault();
        console.log('[暂停] touchstart');
        if (game.running && !game.gameOver) {
            game.paused = !game.paused;
            this.pauseButton.style.transform = 'scale(0.9)';
            this.pauseButton.style.backgroundColor = 'rgba(255, 0, 136, 0.4)';
            
            setTimeout(() => {
                this.pauseButton.style.transform = 'scale(1)';
                this.pauseButton.style.backgroundColor = 'rgba(255, 0, 136, 0.2)';
            }, 150);
        }
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    const virtualControls = new VirtualControls();
    
    Object.defineProperty(window, 'virtualJump', {
        get: () => virtualControls.virtualJump,
        set: (value) => { virtualControls.virtualJump = value; }
    });
    
    window.virtualJoystick = virtualControls.joystick;
    console.log("虚拟控制器已初始化");
});

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

function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
}

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

window.addEventListener('load', addFullscreenButton);

document.addEventListener('fullscreenchange', handleFullscreenChange);
document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
document.addEventListener('msfullscreenchange', handleFullscreenChange);

function handleFullscreenChange() {
    if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
        console.log("已退出全屏模式");
    } else {
        console.log("已进入全屏模式");
    }
}
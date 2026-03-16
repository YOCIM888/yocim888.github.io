// 虚拟控制模块
class VirtualControls {
    constructor() {
        this.isMobile = this.checkMobile();
        this.virtualControls = document.getElementById('virtualControls');
        this.joystick = null;
        this.joystickCenter = { x: 0, y: 0 };
        this.joystickPosition = { x: 0, y: 0 };
        this.isTouching = false;
        
        if (this.isMobile) {
            this.init();
        }
    }
    
    // 检查是否为移动设备
    checkMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    
    // 初始化虚拟控制
    init() {
        this.createVirtualControls();
        this.setupEventListeners();
        
        // 隐藏键盘控制提示
        if (game.instructions) {
            game.instructions.style.display = 'none';
        }
    }
    
    // 创建虚拟控制界面
    createVirtualControls() {
        // 创建虚拟控制容器
        this.virtualControls.innerHTML = '';
        this.virtualControls.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 150;
            pointer-events: none;
        `;
        
        // 创建虚拟摇杆区域（左下角）
        const joystickArea = document.createElement('div');
        joystickArea.id = 'joystickArea';
        joystickArea.style.cssText = `
            position: absolute;
            bottom: 120px;
            left: 40px;
            width: 150px;
            height: 150px;
            pointer-events: auto;
        `;
        this.virtualControls.appendChild(joystickArea);
        
        // 创建虚拟摇杆底座
        const joystickBase = document.createElement('div');
        joystickBase.id = 'joystickBase';
        joystickBase.style.cssText = `
            position: absolute;
            width: 120px;
            height: 120px;
            background: rgba(0, 20, 40, 0.7);
            border: 2px solid #00eeff;
            border-radius: 50%;
            left: 15px;
            top: 15px;
            box-shadow: 0 0 20px rgba(0, 238, 255, 0.5);
        `;
        joystickArea.appendChild(joystickBase);
        
        // 创建虚拟摇杆手柄
        this.joystick = document.createElement('div');
        this.joystick.id = 'joystick';
        this.joystick.style.cssText = `
            position: absolute;
            width: 80px;
            height: 80px;
            background: rgba(0, 238, 255, 0.8);
            border: 2px solid #00eeff;
            border-radius: 50%;
            left: 35px;
            top: 35px;
            box-shadow: 0 0 15px rgba(0, 238, 255, 0.7);
            transition: transform 0.1s;
        `;
        joystickArea.appendChild(this.joystick);
        
        // 创建攻击按钮区域（右下角）
        const buttonsArea = document.createElement('div');
        buttonsArea.id = 'buttonsArea';
        buttonsArea.style.cssText = `
            position: absolute;
            bottom: 100px;
            right: 40px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 30px;
            pointer-events: auto;
        `;
        this.virtualControls.appendChild(buttonsArea);
        
        // 创建剑攻击按钮
        const swordBtn = this.createButton('swordBtn', 'fas fa-skull-crossbones', '#ff00ff');
        swordBtn.style.marginBottom = '20px';
        buttonsArea.appendChild(swordBtn);
        
        // 创建枪攻击按钮
        const gunBtn = this.createButton('gunBtn', 'fas fa-crosshairs', '#00eeff');
        buttonsArea.appendChild(gunBtn);
        
        // 创建显示/隐藏控制提示按钮
        const helpBtn = this.createButton('helpBtn', 'fas fa-question', '#ffaa00');
        helpBtn.style.position = 'absolute';
        helpBtn.style.top = '20px';
        helpBtn.style.right = '20px';
        helpBtn.style.width = '60px';
        helpBtn.style.height = '60px';
        helpBtn.style.fontSize = '1.5rem';
        this.virtualControls.appendChild(helpBtn);
        
        // 初始化摇杆中心位置
        const rect = joystickArea.getBoundingClientRect();
        this.joystickCenter.x = rect.left + 75;
        this.joystickCenter.y = rect.top + 75;
    }
    
    // 创建按钮
    createButton(id, icon, color) {
        const button = document.createElement('div');
        button.id = id;
        button.innerHTML = `<i class="${icon}"></i>`;
        button.style.cssText = `
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background: rgba(0, 20, 40, 0.9);
            border: 3px solid ${color};
            color: ${color};
            font-size: 2rem;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 0 20px ${color + '70'};
            transition: all 0.2s;
            user-select: none;
            -webkit-tap-highlight-color: transparent;
        `;
        
        // 按钮触摸效果
        button.addEventListener('touchstart', (e) => {
            e.preventDefault();
            button.style.transform = 'scale(0.95)';
            button.style.boxShadow = `0 0 10px ${color + '90'}`;
            button.style.background = color + '20';
        });
        
        button.addEventListener('touchend', (e) => {
            e.preventDefault();
            button.style.transform = '';
            button.style.boxShadow = `0 0 20px ${color + '70'}`;
            button.style.background = 'rgba(0, 20, 40, 0.9)';
        });
        
        return button;
    }
    
    // 设置事件监听器
    setupEventListeners() {
        // 摇杆触摸事件
        const joystickArea = document.getElementById('joystickArea');
        
        joystickArea.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.isTouching = true;
            this.updateJoystickPosition(e.touches[0]);
        });
        
        joystickArea.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (this.isTouching) {
                this.updateJoystickPosition(e.touches[0]);
            }
        });
        
        joystickArea.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.isTouching = false;
            this.resetJoystick();
        });
        
        // 按钮事件
        document.getElementById('swordBtn').addEventListener('touchstart', (e) => {
            e.preventDefault();
            swordAttack();
        });
        
        document.getElementById('gunBtn').addEventListener('touchstart', (e) => {
            e.preventDefault();
            gunAttack();
        });
        
        // 帮助按钮事件
        document.getElementById('helpBtn').addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (game.instructions.style.display === 'none') {
                game.instructions.style.display = 'block';
                game.instructions.style.opacity = '1';
            } else {
                game.instructions.style.opacity = '0';
                setTimeout(() => {
                    game.instructions.style.display = 'none';
                }, 300);
            }
        });
        
        // 防止页面滚动
        document.addEventListener('touchmove', (e) => {
            if (e.target.closest('#virtualControls')) {
                e.preventDefault();
            }
        }, { passive: false });
    }
    
    // 更新摇杆位置
    updateJoystickPosition(touch) {
        const touchX = touch.clientX;
        const touchY = touch.clientY;
        
        // 计算相对于摇杆中心的偏移
        let deltaX = touchX - this.joystickCenter.x;
        let deltaY = touchY - this.joystickCenter.y;
        
        // 限制摇杆移动范围（半径50px）
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const maxDistance = 50;
        
        if (distance > maxDistance) {
            deltaX = (deltaX / distance) * maxDistance;
            deltaY = (deltaY / distance) * maxDistance;
        }
        
        // 更新摇杆视觉位置
        this.joystick.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        
        // 更新游戏控制
        this.updateGameControls(deltaX, deltaY);
    }
    
    // 更新游戏控制
    updateGameControls(deltaX, deltaY) {
        // 根据摇杆位置设置移动方向
        const threshold = 20; // 灵敏度阈值
        
        if (deltaX < -threshold) {
            game.keys.left = true;
            game.keys.right = false;
        } else if (deltaX > threshold) {
            game.keys.left = false;
            game.keys.right = true;
        } else {
            game.keys.left = false;
            game.keys.right = false;
        }
    }
    
    // 重置摇杆
    resetJoystick() {
        this.joystick.style.transform = 'translate(0, 0)';
        game.keys.left = false;
        game.keys.right = false;
    }
}

// 初始化虚拟控制
let virtualControls;
window.addEventListener('load', () => {
    virtualControls = new VirtualControls();
});
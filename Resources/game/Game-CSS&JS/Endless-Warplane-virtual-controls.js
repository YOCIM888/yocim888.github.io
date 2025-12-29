/**
 * 无尽战机 - 移动端虚拟控制系统
 * 为移动设备提供触摸控制支持
 */

(function() {
    'use strict';

    // ==================== 虚拟控制状态 ====================
    const virtualControls = {
        joystick: {
            active: false,
            startX: 0,
            startY: 0,
            currentX: 0,
            currentY: 0,
            touchId: null,
            deltaX: 0,
            deltaY: 0,
            sensitivity: 2.5  // 摇杆灵敏度
        },
        buttons: {
            fire: { active: false, touchId: null },
            missile: { active: false, touchId: null },
            shield: { active: false, touchId: null },
            lightning: { active: false, touchId: null },
            bomb: { active: false, touchId: null },
            pause: { active: false, touchId: null }
        },
        firePressed: false  // 记录开火按钮是否按下
    };

    // ==================== 获取DOM元素 ====================
    const joystickBase = document.getElementById('joystickBase');
    const joystickKnob = document.getElementById('joystickKnob');
    const fireBtn = document.getElementById('fireBtn');
    const missileBtn = document.getElementById('missileBtn');
    const shieldBtn = document.getElementById('shieldBtn');
    const lightningBtn = document.getElementById('lightningBtn');
    const bombBtn = document.getElementById('bombBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const gameContainer = document.getElementById('gameContainer');

    // ==================== 摇杆控制 ====================

    /**
     * 初始化摇杆控制
     */
    function initJoystick() {
        if (!joystickBase || !joystickKnob) {
            console.warn('摇杆元素未找到，跳过摇杆初始化');
            return;
        }

        // 触摸开始
        joystickBase.addEventListener('touchstart', handleJoystickStart, { passive: false });
        
        // 触摸移动
        joystickBase.addEventListener('touchmove', handleJoystickMove, { passive: false });
        
        // 触摸结束
        joystickBase.addEventListener('touchend', handleJoystickEnd, { passive: false });
        joystickBase.addEventListener('touchcancel', handleJoystickEnd, { passive: false });

        // 鼠标事件支持（测试用）
        if (joystickBase) {
            joystickBase.addEventListener('mousedown', handleJoystickStart);
            document.addEventListener('mousemove', handleJoystickMove);
            document.addEventListener('mouseup', handleJoystickEnd);
        }
    }

    /**
     * 处理摇杆触摸开始
     */
    function handleJoystickStart(e) {
        e.preventDefault();
        e.stopPropagation();

        const touch = getTouchById(e, virtualControls.joystick.touchId);
        if (touch) return; // 已有触摸点

        const point = e.changedTouches ? e.changedTouches[0] : e;
        virtualControls.joystick.touchId = point.identifier || 999;
        virtualControls.joystick.active = true;

        // 获取摇杆中心位置
        const rect = joystickBase.getBoundingClientRect();
        virtualControls.joystick.startX = rect.left + rect.width / 2;
        virtualControls.joystick.startY = rect.top + rect.height / 2;
        virtualControls.joystick.currentX = point.clientX;
        virtualControls.joystick.currentY = point.clientY;

        // 更新摇杆视觉效果
        updateJoystickVisuals();
    }

    /**
     * 处理摇杆触摸移动
     */
    function handleJoystickMove(e) {
        if (!virtualControls.joystick.active) return;
        e.preventDefault();
        e.stopPropagation();

        const touch = getTouchById(e, virtualControls.joystick.touchId);
        if (!touch) return;

        const rect = joystickBase.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const maxRadius = rect.width / 2 - 20; // 最大移动半径

        // 计算移动距离和方向
        let deltaX = touch.clientX - centerX;
        let deltaY = touch.clientY - centerY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        // 限制在摇杆范围内
        if (distance > maxRadius) {
            const ratio = maxRadius / distance;
            deltaX *= ratio;
            deltaY *= ratio;
        }

        // 更新摇杆状态
        virtualControls.joystick.deltaX = deltaX;
        virtualControls.joystick.deltaY = deltaY;
        virtualControls.joystick.currentX = centerX + deltaX;
        virtualControls.joystick.currentY = centerY + deltaY;

        // 更新视觉效果
        updateJoystickVisuals();

        // 应用移动到玩家
        applyJoystickMovement();
    }

    /**
     * 处理摇杆触摸结束
     */
    function handleJoystickEnd(e) {
        if (!virtualControls.joystick.active) return;

        const touch = getTouchById(e, virtualControls.joystick.touchId);
        if (!touch && !e.changedTouches) {
            // 鼠标事件
            if (e.type === 'mouseup') {
                resetJoystick();
            }
            return;
        }

        if (touch) {
            resetJoystick();
        }
    }

    /**
     * 重置摇杆状态
     */
    function resetJoystick() {
        virtualControls.joystick.active = false;
        virtualControls.joystick.touchId = null;
        virtualControls.joystick.deltaX = 0;
        virtualControls.joystick.deltaY = 0;

        // 重置视觉效果
        if (joystickKnob) {
            joystickKnob.style.transform = 'translate(-50%, -50%)';
        }

        // 重置键盘状态
        keys.ArrowLeft = false;
        keys.ArrowRight = false;
        keys.ArrowUp = false;
        keys.ArrowDown = false;
    }

    /**
     * 更新摇杆视觉效果
     */
    function updateJoystickVisuals() {
        if (!joystickKnob) return;

        const maxOffset = 35; // 摇杆最大偏移量
        const offsetX = Math.max(-maxOffset, Math.min(maxOffset, virtualControls.joystick.deltaX));
        const offsetY = Math.max(-maxOffset, Math.min(maxOffset, virtualControls.joystick.deltaY));

        joystickKnob.style.transform = `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))`;
    }

    /**
     * 应用摇杆移动到游戏
     */
    function applyJoystickMovement() {
        const deltaX = virtualControls.joystick.deltaX;
        const deltaY = virtualControls.joystick.deltaY;
        const threshold = 5; // 移动阈值

        // 重置所有方向键
        keys.ArrowLeft = false;
        keys.ArrowRight = false;
        keys.ArrowUp = false;
        keys.ArrowDown = false;

        // 根据摇杆方向设置按键状态
        if (deltaX < -threshold) {
            keys.ArrowLeft = true;
        } else if (deltaX > threshold) {
            keys.ArrowRight = true;
        }

        if (deltaY < -threshold) {
            keys.ArrowUp = true;
        } else if (deltaY > threshold) {
            keys.ArrowDown = true;
        }
    }

    // ==================== 按钮控制 ====================

    /**
     * 初始化所有虚拟按钮
     */
    function initButtons() {
        // 开火按钮
        initButton(fireBtn, 'fire', () => {
            keys[' '] = true;
            virtualControls.firePressed = true;
        }, () => {
            keys[' '] = false;
            virtualControls.firePressed = false;
        });

        // 导弹按钮 - 一次性触发
        initButton(missileBtn, 'missile', () => {
            if (!virtualControls.buttons.missile.active) {
                keys['q'] = true;
                keys['Q'] = true;
                setTimeout(() => {
                    keys['q'] = false;
                    keys['Q'] = false;
                }, 100);
            }
        });

        // 护盾按钮 - 一次性触发
        initButton(shieldBtn, 'shield', () => {
            if (!virtualControls.buttons.shield.active) {
                keys['e'] = true;
                keys['E'] = true;
                setTimeout(() => {
                    keys['e'] = false;
                    keys['E'] = false;
                }, 100);
            }
        });

        // 闪电按钮 - 一次性触发
        initButton(lightningBtn, 'lightning', () => {
            if (!virtualControls.buttons.lightning.active) {
                keys['r'] = true;
                keys['R'] = true;
                setTimeout(() => {
                    keys['r'] = false;
                    keys['R'] = false;
                }, 100);
            }
        });

        // 炸弹按钮 - 一次性触发
        initButton(bombBtn, 'bomb', () => {
            if (!virtualControls.buttons.bomb.active) {
                keys['b'] = true;
                keys['B'] = true;
                setTimeout(() => {
                    keys['b'] = false;
                    keys['B'] = false;
                }, 100);
            }
        });

        // 暂停按钮
        if (pauseBtn) {
            initButton(pauseBtn, 'pause', () => {
                if (gameState.running && !gameState.gameOver) {
                    gameState.paused = !gameState.paused;
                    pauseOverlay.classList.toggle('active', gameState.paused);
                }
            });
        }
    }

    /**
     * 初始化单个按钮
     */
    function initButton(element, buttonName, onStart, onEnd) {
        if (!element) {
            console.warn(`按钮元素 ${buttonName} 未找到`);
            return;
        }

        // 触摸事件
        element.addEventListener('touchstart', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (virtualControls.buttons[buttonName].active) return;

            const touch = e.changedTouches[0];
            virtualControls.buttons[buttonName].touchId = touch.identifier;
            virtualControls.buttons[buttonName].active = true;

            element.style.transform = 'scale(0.95)';
            onStart();
        }, { passive: false });

        element.addEventListener('touchend', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const touch = getTouchById(e, virtualControls.buttons[buttonName].touchId);
            if (touch) {
                virtualControls.buttons[buttonName].active = false;
                virtualControls.buttons[buttonName].touchId = null;

                element.style.transform = 'scale(1)';
                if (onEnd) onEnd();
            }
        }, { passive: false });

        element.addEventListener('touchcancel', (e) => {
            virtualControls.buttons[buttonName].active = false;
            virtualControls.buttons[buttonName].touchId = null;
            element.style.transform = 'scale(1)';
            if (onEnd) onEnd();
        });

        // 鼠标事件（测试用）
        element.addEventListener('mousedown', (e) => {
            if (virtualControls.buttons[buttonName].active) return;
            virtualControls.buttons[buttonName].active = true;
            element.style.transform = 'scale(0.95)';
            onStart();
        });

        element.addEventListener('mouseup', () => {
            virtualControls.buttons[buttonName].active = false;
            element.style.transform = 'scale(1)';
            if (onEnd) onEnd();
        });

        element.addEventListener('mouseleave', () => {
            if (virtualControls.buttons[buttonName].active) {
                virtualControls.buttons[buttonName].active = false;
                element.style.transform = 'scale(1)';
                if (onEnd) onEnd();
            }
        });
    }

    // ==================== 辅助函数 ====================

    /**
     * 从事件中获取指定ID的触摸点
     */
    function getTouchById(event, touchId) {
        if (!event.changedTouches) return null;

        for (let i = 0; i < event.changedTouches.length; i++) {
            if (event.changedTouches[i].identifier === touchId) {
                return event.changedTouches[i];
            }
        }
        return null;
    }

    /**
     * 防止默认触摸行为
     */
    function preventDefaultTouch(e) {
        if (e.target.closest('.virtual-joystick') || 
            e.target.closest('.virtual-controls') ||
            e.target.closest('.virtual-btn')) {
            e.preventDefault();
        }
    }

    /**
     * 检测是否为移动设备
     */
    function isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               ('ontouchstart' in window) ||
               (navigator.maxTouchPoints > 0);
    }

    /**
     * 显示/隐藏移动端控制提示
     */
    function updateControlHints() {
        const isMobile = isMobileDevice();
        const joystick = document.getElementById('virtualJoystick');
        const controls = document.getElementById('virtualControls');
        const instructions = document.getElementById('instructions');

        if (isMobile) {
            if (joystick) joystick.style.display = 'block';
            if (controls) controls.style.display = 'flex';
            if (instructions) instructions.style.display = 'none';
        } else {
            if (joystick) joystick.style.display = 'none';
            if (controls) controls.style.display = 'none';
        }
    }

    /**
     * 初始化游戏开始按钮（移动端）
     */
    function initStartButton() {
        let startButton = document.getElementById('mobileStartBtn');

        // 如果不存在，创建开始按钮
        if (!startButton && isMobileDevice()) {
            startButton = document.createElement('button');
            startButton.id = 'mobileStartBtn';
            startButton.className = 'mobile-start-btn';
            startButton.textContent = '开始游戏';
            startButton.style.cssText = `
                position: absolute;
                bottom: 50%;
                left: 50%;
                transform: translate(-50%, 50%);
                padding: 20px 60px;
                font-size: 1.5rem;
                background: linear-gradient(135deg, #00d4ff 0%, #0066ff 100%);
                border: none;
                border-radius: 50px;
                color: white;
                cursor: pointer;
                z-index: 1000;
                box-shadow: 0 5px 20px rgba(0, 212, 255, 0.5);
                transition: all 0.3s ease;
            `;

            const gameTitle = document.getElementById('gameTitle');
            if (gameTitle) {
                gameTitle.appendChild(startButton);
            } else {
                const container = document.getElementById('gameContainer');
                if (container) container.appendChild(startButton);
            }
        }

        if (startButton) {
            startButton.addEventListener('touchstart', (e) => {
                e.preventDefault();
                e.stopPropagation();

                if (!gameState.running) {
                    gameState.running = true;
                    restartGame();

                    // 隐藏开始按钮
                    startButton.style.opacity = '0';
                    startButton.style.pointerEvents = 'none';

                    const gameTitle = document.getElementById('gameTitle');
                    if (gameTitle) {
                        gameTitle.classList.add('hidden');
                    }
                }
            }, { passive: false });

            startButton.addEventListener('click', (e) => {
                e.preventDefault();

                if (!gameState.running) {
                    gameState.running = true;
                    restartGame();

                    startButton.style.opacity = '0';
                    startButton.style.pointerEvents = 'none';

                    const gameTitle = document.getElementById('gameTitle');
                    if (gameTitle) {
                        gameTitle.classList.add('hidden');
                    }
                }
            });
        }
    }

    /**
     * 更新移动端UI布局
     */
    function updateMobileLayout() {
        if (!isMobileDevice()) return;

        // 根据屏幕方向调整UI
        const isPortrait = window.innerHeight > window.innerWidth;
        const joystick = document.getElementById('virtualJoystick');
        const controls = document.getElementById('virtualControls');

        if (joystick) {
            if (isPortrait) {
                joystick.style.bottom = '100px';
                joystick.style.left = '20px';
            } else {
                joystick.style.bottom = '120px';
                joystick.style.left = '20px';
            }
        }

        if (controls) {
            if (isPortrait) {
                controls.style.bottom = '10px';
                controls.style.right = '10px';
            } else {
                controls.style.bottom = '20px';
                controls.style.right = '20px';
            }
        }
    }

    /**
     * 处理窗口大小变化
     */
    function handleResize() {
        setupCanvas();
        initStars();
        updateMobileLayout();
    }

    // ==================== 初始化 ====================

    /**
     * 初始化所有虚拟控制
     */
    function init() {
        console.log('正在初始化移动端虚拟控制...');

        // 防止默认触摸行为
        document.addEventListener('touchmove', preventDefaultTouch, { passive: false });

        // 初始化摇杆
        initJoystick();

        // 初始化按钮
        initButtons();

        // 更新控制提示显示
        updateControlHints();

        // 初始化开始按钮
        initStartButton();

        // 更新布局
        updateMobileLayout();

        // 监听窗口变化
        window.addEventListener('resize', handleResize);

        // 监听屏幕方向变化
        window.addEventListener('orientationchange', () => {
            setTimeout(updateMobileLayout, 100);
        });

        console.log('移动端虚拟控制初始化完成');
    }

    // ==================== 键盘事件扩展 ====================

    /**
     * 增强键盘事件处理
     */
    function enhanceKeyboardEvents() {
        // 增强键盘按下处理
        const originalKeydown = window.onkeydown;
        window.addEventListener('keydown', (e) => {
            if (e.key in keys) {
                keys[e.key] = true;
            }

            // 暂停
            if ((e.key === 'p' || e.key === 'P') && gameState.running && !gameState.gameOver) {
                gameState.paused = !gameState.paused;
                pauseOverlay.classList.toggle('active', gameState.paused);
            }

            // 防止空格滚动
            if (e.key === ' ') {
                e.preventDefault();
            }
        });

        // 增强键盘释放处理
        window.addEventListener('keyup', (e) => {
            if (e.key in keys) {
                keys[e.key] = false;
            }
        });

        // 开始游戏
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !gameState.running) {
                gameState.running = true;
                restartGame();
            }
        });
    }

    // ==================== 生命周期 ====================

    // 确保DOM加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            init();
            enhanceKeyboardEvents();
        });
    } else {
        // DOM已加载
        init();
        enhanceKeyboardEvents();
    }

    // 页面可见性改变时处理
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && gameState.running && !gameState.gameOver) {
            gameState.paused = true;
            if (pauseOverlay) {
                pauseOverlay.classList.add('active');
            }
        }
    });

    // 全局错误处理
    window.addEventListener('error', (e) => {
        console.error('虚拟控制错误:', e.error);
    });

    // 导出到全局作用域（供调试）
    window.virtualControls = virtualControls;

})();
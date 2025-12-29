/**
 * CONTRA - 魂斗罗 Web复刻版
 * 移动端虚拟控制脚本
 * contra-visual-control.js
 * 
 * 功能：
 * - 触摸事件处理
 * - 虚拟方向键（D-Pad）
 * - 虚拟操作按钮（A跳跃、B射击）
 * - 多点触控支持
 * - 视觉反馈效果
 */

(function() {
    'use strict';

    // 触摸控制配置
    const TOUCH_CONFIG = {
        dpadCenterX: 0,
        dpadCenterY: 0,
        dpadRadius: 75,
        buttonRadius: 35,
        longPressThreshold: 500,
        preventDefault: true
    };

    // 触摸状态
    const touchState = {
        active: false,
        touches: {},
        dpad: {
            up: false,
            down: false,
            left: false,
            right: false,
            centerX: 0,
            centerY: 0
        },
        buttons: {
            jump: false,
            shoot: false
        }
    };

    // 按钮元素引用
    let btnUp, btnDown, btnLeft, btnRight, btnJump, btnShoot;

    /**
     * 初始化触摸控制
     */
    function initTouchControls() {
        // 检测是否为触摸设备
        if (!isTouchDevice()) {
            console.log('非触摸设备，跳过虚拟控制初始化');
            return;
        }

        // 获取按钮元素
        btnUp = document.getElementById('btn-up');
        btnDown = document.getElementById('btn-down');
        btnLeft = document.getElementById('btn-left');
        btnRight = document.getElementById('btn-right');
        btnJump = document.getElementById('btn-jump');
        btnShoot = document.getElementById('btn-shoot');

        if (!btnUp || !btnJump || !btnShoot) {
            console.warn('虚拟控制按钮元素未找到');
            return;
        }

        // 初始化方向键位置
        initDPadPosition();

        // 绑定触摸事件
        bindTouchEvents();

        // 显示虚拟控制
        document.getElementById('mobile-controls').classList.add('active');
        touchState.active = true;

        console.log('触摸控制初始化完成');
    }

    /**
     * 检测是否为触摸设备
     */
    function isTouchDevice() {
        return (
            'ontouchstart' in window ||
            navigator.maxTouchPoints > 0 ||
            navigator.msMaxTouchPoints > 0
        );
    }

    /**
     * 初始化方向键位置
     */
    function initDPadPosition() {
        const dpad = document.querySelector('.d-pad');
        if (dpad) {
            const rect = dpad.getBoundingClientRect();
            touchState.dpad.centerX = rect.left + rect.width / 2;
            touchState.dpad.centerY = rect.top + rect.height / 2;
        }
    }

    /**
     * 绑定触摸事件
     */
    function bindTouchEvents() {
        // 方向键触摸事件
        bindDPadTouchEvents();

        // 操作按钮触摸事件
        bindButtonTouchEvents();

        // 窗口大小改变时更新位置
        window.addEventListener('resize', () => {
            initDPadPosition();
        });

        // 设备方向改变时更新位置
        window.addEventListener('orientationchange', () => {
            setTimeout(initDPadPosition, 100);
        });
    }

    /**
     * 绑定方向键触摸事件
     */
    function bindDPadTouchEvents() {
        const dpadArea = document.querySelector('.d-pad');
        if (!dpadArea) return;

        // 使用触摸区域绑定事件
        dpadArea.addEventListener('touchstart', handleDPadTouchStart, { passive: false });
        dpadArea.addEventListener('touchmove', handleDPadTouchMove, { passive: false });
        dpadArea.addEventListener('touchend', handleDPadTouchEnd, { passive: false });
        dpadArea.addEventListener('touchcancel', handleDPadTouchEnd, { passive: false });

        // 鼠标事件（用于测试）
        dpadArea.addEventListener('mousedown', handleDPadMouseDown);
        document.addEventListener('mousemove', handleDPadMouseMove);
        document.addEventListener('mouseup', handleDPadMouseUp);
    }

    /**
     * 处理方向键触摸开始
     */
    function handleDPadTouchStart(e) {
        e.preventDefault();
        const touch = e.changedTouches[0];
        handleDPadInput(touch.clientX, touch.clientY, true);
    }

    /**
     * 处理方向键触摸移动
     */
    function handleDPadTouchMove(e) {
        e.preventDefault();
        const touch = e.changedTouches[0];
        handleDPadInput(touch.clientX, touch.clientY, true);
    }

    /**
     * 处理方向键触摸结束
     */
    function handleDPadTouchEnd(e) {
        e.preventDefault();
        resetDPadState();
    }

    /**
     * 处理鼠标按下（测试用）
     */
    function handleDPadMouseDown(e) {
        handleDPadInput(e.clientX, e.clientY, true);
        document.addEventListener('mousemove', handleDPadMouseMove);
        document.addEventListener('mouseup', handleDPadMouseUp);
    }

    /**
     * 处理鼠标移动（测试用）
     */
    function handleDPadMouseMove(e) {
        if (touchState.dpad.up || touchState.dpad.down || 
            touchState.dpad.left || touchState.dpad.right) {
            handleDPadInput(e.clientX, e.clientY, true);
        }
    }

    /**
     * 处理鼠标释放（测试用）
     */
    function handleDPadMouseUp(e) {
        resetDPadState();
        document.removeEventListener('mousemove', handleDPadMouseMove);
        document.removeEventListener('mouseup', handleDPadMouseUp);
    }

    /**
     * 处理方向键输入
     */
    function handleDPadInput(x, y, isPressed) {
        const centerX = touchState.dpad.centerX;
        const centerY = touchState.dpad.centerY;
        const radius = TOUCH_CONFIG.dpadRadius;

        // 计算触摸点相对于方向键中心的位置
        const dx = x - centerX;
        const dy = y - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // 重置方向状态
        touchState.dpad.up = false;
        touchState.dpad.down = false;
        touchState.dpad.left = false;
        touchState.dpad.right = false;

        // 如果触摸点在方向键范围内
        if (distance < radius * 1.5 && isPressed) {
            // 计算方向角度
            const angle = Math.atan2(dy, dx);
            const threshold = 0.5; // 阈值弧度

            // 判断主要方向（可以同时触发水平和垂直方向）
            if (dy < -radius * 0.3) {
                touchState.dpad.up = true;
                updateVisualState(btnUp, true);
            } else {
                updateVisualState(btnUp, false);
            }

            if (dy > radius * 0.3) {
                touchState.dpad.down = true;
                updateVisualState(btnDown, true);
            } else {
                updateVisualState(btnDown, false);
            }

            if (dx < -radius * 0.3) {
                touchState.dpad.left = true;
                updateVisualState(btnLeft, true);
            } else {
                updateVisualState(btnLeft, false);
            }

            if (dx > radius * 0.3) {
                touchState.dpad.right = true;
                updateVisualState(btnRight, true);
            } else {
                updateVisualState(btnRight, false);
            }
        } else {
            // 触摸点在外面，重置所有方向键状态
            resetDPadState();
        }
    }

    /**
     * 重置方向键状态
     */
    function resetDPadState() {
        touchState.dpad.up = false;
        touchState.dpad.down = false;
        touchState.dpad.left = false;
        touchState.dpad.right = false;
        
        updateVisualState(btnUp, false);
        updateVisualState(btnDown, false);
        updateVisualState(btnLeft, false);
        updateVisualState(btnRight, false);
    }

    /**
     * 绑定操作按钮触摸事件
     */
    function bindButtonTouchEvents() {
        // 跳跃按钮
        bindButtonTouch(btnJump, 'jump');
        // 射击按钮
        bindButtonTouch(btnShoot, 'shoot');
    }

    /**
     * 绑定单个按钮的触摸事件
     */
    function bindButtonTouch(button, stateName) {
        if (!button) return;

        button.addEventListener('touchstart', (e) => {
            e.preventDefault();
            touchState.buttons[stateName] = true;
            button.classList.add('active');
        }, { passive: false });

        button.addEventListener('touchend', (e) => {
            e.preventDefault();
            touchState.buttons[stateName] = false;
            button.classList.remove('active');
        }, { passive: false });

        button.addEventListener('touchcancel', (e) => {
            e.preventDefault();
            touchState.buttons[stateName] = false;
            button.classList.remove('active');
        }, { passive: false });

        // 鼠标事件（测试用）
        button.addEventListener('mousedown', () => {
            touchState.buttons[stateName] = true;
            button.classList.add('active');
        });

        button.addEventListener('mouseup', () => {
            touchState.buttons[stateName] = false;
            button.classList.remove('active');
        });

        button.addEventListener('mouseleave', () => {
            touchState.buttons[stateName] = false;
            button.classList.remove('active');
        });
    }

    /**
     * 更新按钮视觉状态
     */
    function updateVisualState(button, isActive) {
        if (button) {
            if (isActive) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        }
    }

    /**
     * 获取当前触摸输入状态
     * 返回格式兼容键盘输入格式
     */
    function getInputState() {
        return {
            // 方向键
            left: touchState.dpad.left,
            right: touchState.dpad.right,
            up: touchState.dpad.up,
            down: touchState.dpad.down,
            // 动作键
            jump: touchState.buttons.jump,
            shoot: touchState.buttons.shoot,
            // 特殊键
            enter: false,
            // 触摸设备标记
            isTouch: touchState.active
        };
    }

    /**
     * 获取触摸状态（用于调试）
     */
    function getTouchState() {
        return {
            ...touchState
        };
    }

    /**
     * 检查是否支持触摸
     */
    function isTouchActive() {
        return touchState.active;
    }

    /**
     * 震动反馈（支持的设备）
     */
    function vibrate(pattern) {
        if (navigator.vibrate) {
            navigator.vibrate(pattern);
        }
    }

    /**
     * 触摸时震动
     */
    function vibrateOnTouch() {
        vibrate(15);
    }

    /**
     * 销毁触摸控制
     */
    function destroyTouchControls() {
        touchState.active = false;
        document.getElementById('mobile-controls').classList.remove('active');
        
        // 移除事件监听
        const dpadArea = document.querySelector('.d-pad');
        if (dpadArea) {
            dpadArea.removeEventListener('touchstart', handleDPadTouchStart);
            dpadArea.removeEventListener('touchmove', handleDPadTouchMove);
            dpadArea.removeEventListener('touchend', handleDPadTouchEnd);
        }
    }

    // 暴露API到全局
    window.TouchControls = {
        init: initTouchControls,
        getState: getInputState,
        getTouchState: getTouchState,
        isActive: isTouchActive,
        vibrate: vibrateOnTouch,
        destroy: destroyTouchControls
    };

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTouchControls);
    } else {
        initTouchControls();
    }

    // 监听窗口加载完成，确保所有元素都准备好
    window.addEventListener('load', () => {
        // 重新初始化位置
        initDPadPosition();
    });

})();

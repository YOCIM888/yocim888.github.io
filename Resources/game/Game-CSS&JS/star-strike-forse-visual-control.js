// 移动端虚拟按键控制
(function() {
    // 控制按钮
    const upBtn = document.getElementById('upBtn');
    const downBtn = document.getElementById('downBtn');
    const leftBtn = document.getElementById('leftBtn');
    const rightBtn = document.getElementById('rightBtn');
    const actionBtn = document.getElementById('actionBtn');
    const jumpBtn = document.getElementById('jumpBtn');
    const specialBtn = document.getElementById('specialBtn');
    
    // 控制状态
    const controls = {
        left: false,
        right: false,
        up: false,
        down: false,
        jump: false,
        action: false,
        special: false
    };
    
    // 触摸状态
    const touchState = {
        left: false,
        right: false,
        up: false,
        down: false,
        jump: false,
        action: false,
        special: false
    };
    
    // 初始化触摸控制
    function initTouchControls() {
        // 按钮触摸事件 - 开始触摸
        leftBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            touchState.left = true;
            controls.left = true;
            leftBtn.classList.add('active');
        });
        
        rightBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            touchState.right = true;
            controls.right = true;
            rightBtn.classList.add('active');
        });
        
        upBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            touchState.up = true;
            controls.up = true;
            upBtn.classList.add('active');
        });
        
        downBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            touchState.down = true;
            controls.down = true;
            downBtn.classList.add('active');
        });
        
        jumpBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            touchState.jump = true;
            controls.jump = true;
            jumpBtn.classList.add('active');
        });
        
        actionBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            touchState.action = true;
            controls.action = true;
            actionBtn.classList.add('active');
        });
        
        specialBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            touchState.special = true;
            controls.special = true;
            specialBtn.classList.add('active');
        });
        
        // 按钮触摸事件 - 结束触摸
        leftBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            touchState.left = false;
            controls.left = false;
            leftBtn.classList.remove('active');
        });
        
        rightBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            touchState.right = false;
            controls.right = false;
            rightBtn.classList.remove('active');
        });
        
        upBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            touchState.up = false;
            controls.up = false;
            upBtn.classList.remove('active');
        });
        
        downBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            touchState.down = false;
            controls.down = false;
            downBtn.classList.remove('active');
        });
        
        jumpBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            touchState.jump = false;
            controls.jump = false;
            jumpBtn.classList.remove('active');
        });
        
        actionBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            touchState.action = false;
            controls.action = false;
            actionBtn.classList.remove('active');
        });
        
        specialBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            touchState.special = false;
            controls.special = false;
            specialBtn.classList.remove('active');
        });
        
        // 按钮触摸事件 - 触摸离开按钮区域
        leftBtn.addEventListener('touchcancel', (e) => {
            e.preventDefault();
            touchState.left = false;
            controls.left = false;
            leftBtn.classList.remove('active');
        });
        
        rightBtn.addEventListener('touchcancel', (e) => {
            e.preventDefault();
            touchState.right = false;
            controls.right = false;
            rightBtn.classList.remove('active');
        });
        
        upBtn.addEventListener('touchcancel', (e) => {
            e.preventDefault();
            touchState.up = false;
            controls.up = false;
            upBtn.classList.remove('active');
        });
        
        downBtn.addEventListener('touchcancel', (e) => {
            e.preventDefault();
            touchState.down = false;
            controls.down = false;
            downBtn.classList.remove('active');
        });
        
        jumpBtn.addEventListener('touchcancel', (e) => {
            e.preventDefault();
            touchState.jump = false;
            controls.jump = false;
            jumpBtn.classList.remove('active');
        });
        
        actionBtn.addEventListener('touchcancel', (e) => {
            e.preventDefault();
            touchState.action = false;
            controls.action = false;
            actionBtn.classList.remove('active');
        });
        
        specialBtn.addEventListener('touchcancel', (e) => {
            e.preventDefault();
            touchState.special = false;
            controls.special = false;
            specialBtn.classList.remove('active');
        });
        
        // 鼠标事件支持（用于桌面测试）
        leftBtn.addEventListener('mousedown', (e) => {
            e.preventDefault();
            controls.left = true;
            leftBtn.classList.add('active');
        });
        
        rightBtn.addEventListener('mousedown', (e) => {
            e.preventDefault();
            controls.right = true;
            rightBtn.classList.add('active');
        });
        
        upBtn.addEventListener('mousedown', (e) => {
            e.preventDefault();
            controls.up = true;
            upBtn.classList.add('active');
        });
        
        downBtn.addEventListener('mousedown', (e) => {
            e.preventDefault();
            controls.down = true;
            downBtn.classList.add('active');
        });
        
        jumpBtn.addEventListener('mousedown', (e) => {
            e.preventDefault();
            controls.jump = true;
            jumpBtn.classList.add('active');
        });
        
        actionBtn.addEventListener('mousedown', (e) => {
            e.preventDefault();
            controls.action = true;
            actionBtn.classList.add('active');
        });
        
        specialBtn.addEventListener('mousedown', (e) => {
            e.preventDefault();
            controls.special = true;
            specialBtn.classList.add('active');
        });
        
        leftBtn.addEventListener('mouseup', (e) => {
            e.preventDefault();
            controls.left = false;
            leftBtn.classList.remove('active');
        });
        
        rightBtn.addEventListener('mouseup', (e) => {
            e.preventDefault();
            controls.right = false;
            rightBtn.classList.remove('active');
        });
        
        upBtn.addEventListener('mouseup', (e) => {
            e.preventDefault();
            controls.up = false;
            upBtn.classList.remove('active');
        });
        
        downBtn.addEventListener('mouseup', (e) => {
            e.preventDefault();
            controls.down = false;
            downBtn.classList.remove('active');
        });
        
        jumpBtn.addEventListener('mouseup', (e) => {
            e.preventDefault();
            controls.jump = false;
            jumpBtn.classList.remove('active');
        });
        
        actionBtn.addEventListener('mouseup', (e) => {
            e.preventDefault();
            controls.action = false;
            actionBtn.classList.remove('active');
        });
        
        specialBtn.addEventListener('mouseup', (e) => {
            e.preventDefault();
            controls.special = false;
            specialBtn.classList.remove('active');
        });
        
        // 鼠标离开按钮时释放控制
        leftBtn.addEventListener('mouseleave', (e) => {
            if (controls.left) {
                controls.left = false;
                leftBtn.classList.remove('active');
            }
        });
        
        rightBtn.addEventListener('mouseleave', (e) => {
            if (controls.right) {
                controls.right = false;
                rightBtn.classList.remove('active');
            }
        });
        
        upBtn.addEventListener('mouseleave', (e) => {
            if (controls.up) {
                controls.up = false;
                upBtn.classList.remove('active');
            }
        });
        
        downBtn.addEventListener('mouseleave', (e) => {
            if (controls.down) {
                controls.down = false;
                downBtn.classList.remove('active');
            }
        });
        
        jumpBtn.addEventListener('mouseleave', (e) => {
            if (controls.jump) {
                controls.jump = false;
                jumpBtn.classList.remove('active');
            }
        });
        
        actionBtn.addEventListener('mouseleave', (e) => {
            if (controls.action) {
                controls.action = false;
                actionBtn.classList.remove('active');
            }
        });
        
        specialBtn.addEventListener('mouseleave', (e) => {
            if (controls.special) {
                controls.special = false;
                specialBtn.classList.remove('active');
            }
        });
        
        // 添加触觉反馈支持（如果可用）
        if ('vibrate' in navigator) {
            // 为按钮添加振动反馈
            const buttons = document.querySelectorAll('.control-btn');
            buttons.forEach(btn => {
                btn.addEventListener('touchstart', () => {
                    navigator.vibrate(10); // 振动10毫秒
                });
            });
        }
        
        // 防止移动端页面滚动
        document.addEventListener('touchmove', (e) => {
            if (e.target.classList.contains('control-btn') || 
                e.target.closest('.controls-container')) {
                e.preventDefault();
            }
        }, { passive: false });
        
        // 添加手势控制支持
        initGestureControls();
    }
    
    // 初始化手势控制
    function initGestureControls() {
        const canvas = document.getElementById('gameCanvas');
        let touchStartX = 0;
        let touchStartY = 0;
        let touchStartTime = 0;
        let isTouchActive = false;
        
        // 画布上的触摸事件
        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            touchStartX = touch.clientX;
            touchStartY = touch.clientY;
            touchStartTime = Date.now();
            isTouchActive = true;
        });
        
        canvas.addEventListener('touchmove', (e) => {
            if (!isTouchActive) return;
            e.preventDefault();
            
            const touch = e.touches[0];
            const deltaX = touch.clientX - touchStartX;
            const deltaY = touch.clientY - touchStartY;
            
            // 如果水平移动超过阈值，则控制左右移动
            if (Math.abs(deltaX) > 20) {
                if (deltaX > 0) {
                    // 向右滑动
                    controls.left = false;
                    controls.right = true;
                } else {
                    // 向左滑动
                    controls.left = true;
                    controls.right = false;
                }
            }
            
            // 如果垂直移动超过阈值，则控制上下移动
            if (Math.abs(deltaY) > 20) {
                if (deltaY > 0) {
                    // 向下滑动
                    controls.up = false;
                    controls.down = true;
                } else {
                    // 向上滑动
                    controls.up = true;
                    controls.down = false;
                }
            }
        });
        
        canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            
            const touchTime = Date.now() - touchStartTime;
            
            // 快速轻击执行跳跃
            if (touchTime < 200 && isTouchActive) {
                controls.jump = true;
                
                // 短暂延迟后重置跳跃状态
                setTimeout(() => {
                    controls.jump = false;
                }, 100);
            }
            
            // 重置控制状态
            controls.left = false;
            controls.right = false;
            controls.up = false;
            controls.down = false;
            
            isTouchActive = false;
        });
        
        canvas.addEventListener('touchcancel', (e) => {
            e.preventDefault();
            
            // 重置控制状态
            controls.left = false;
            controls.right = false;
            controls.up = false;
            controls.down = false;
            
            isTouchActive = false;
        });
        
        // 双指点击触发特殊技能
        let lastTouchEnd = 0;
        canvas.addEventListener('touchend', (e) => {
            const now = Date.now();
            if (now - lastTouchEnd < 300 && e.touches.length === 0) {
                // 双指点击，触发特殊技能
                controls.special = true;
                
                // 短暂延迟后重置特殊技能状态
                setTimeout(() => {
                    controls.special = false;
                }, 100);
            }
            lastTouchEnd = now;
        });
    }
    
    // 初始化函数
    function init() {
        initTouchControls();
        
        // 在控制台显示初始化完成消息
        console.log('星际突击队 - 视觉控制已初始化');
        console.log('支持移动端虚拟按键控制和手势控制');
    }
    
    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // 导出控制状态（供游戏主逻辑使用）
    window.getControls = function() {
        return controls;
    };
})();
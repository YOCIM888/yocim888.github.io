/**
 * 深渊吞噬者 · 赛博朋克球球大作战
 * 核心机制：吞噬敌人/食物，不断变大，避免被更大的敌人吞噬
 * 响应式：逻辑画布1000x1000，CSS自适应，事件坐标精确映射
 */

(function() {
    // --- 画布与上下文 ---
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    // 固定逻辑分辨率 1000x1000 (用于绘图和碰撞)
    const LOGIC_WIDTH = 1000;
    const LOGIC_HEIGHT = 1000;
    canvas.width = LOGIC_WIDTH;
    canvas.height = LOGIC_HEIGHT;

    // --- 世界参数 (无限感, 但有物理边界) ---
    const WORLD_SIZE = 2400;          // 世界范围 0~2400
    const WORLD_MIN = 0;
    const WORLD_MAX = WORLD_SIZE;

    // --- 玩家对象 ---
    let player = {
        x: WORLD_SIZE / 2,
        y: WORLD_SIZE / 2,
        r: 18          // 初始半径
    };

    // --- 动态实体 ---
    let foods = [];                // 食物球 (小光点)
    let enemies = [];              // 敌人球 (霓虹色，会移动)
    const FOOD_COUNT = 150;
    const ENEMY_COUNT = 20;

    // --- 鼠标/触摸控制 (逻辑坐标 0~1000) ---
    let targetDX = 0, targetDY = 0;    // 方向向量(归一化后)
    let moveActive = false;            // 是否有有效输入
    let mouseInCanvas = false;

    // --- 速度参数 ---
    const MAX_SPEED = 6.5;
    const DEAD_ZONE = 5;               // 中心死区

    // --- UI 元素 ---
    const scoreSpan = document.getElementById('scoreDisplay');

    // --- 辅助随机函数 ---
    const rand = (min, max) => Math.random() * (max - min) + min;
    const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    // --- 初始化所有实体 (重置游戏) ---
    function initGame() {
        // 玩家重置
        player = {
            x: WORLD_SIZE / 2,
            y: WORLD_SIZE / 2,
            r: 18
        };

        // 食物初始化
        foods = [];
        for (let i = 0; i < FOOD_COUNT; i++) {
            foods.push({
                x: rand(50, WORLD_SIZE - 50),
                y: rand(50, WORLD_SIZE - 50),
                r: rand(4, 9),
                // 颜色在绘制时动态生成 (霓虹色)
            });
        }

        // 敌人初始化 (带随机速度)
        enemies = [];
        for (let i = 0; i < ENEMY_COUNT; i++) {
            let radius = Math.random() < 0.3 ? rand(40, 220) : rand(12, 40); // 30%大敌人，70%小敌人
            // 确保不直接生成在玩家身上
            let posX, posY;
            let attempts = 0;
            do {
                posX = rand(radius, WORLD_SIZE - radius);
                posY = rand(radius, WORLD_SIZE - radius);
                attempts++;
            } while (Math.hypot(posX - player.x, posY - player.y) < player.r + radius + 40 && attempts < 100);

            enemies.push({
                x: posX,
                y: posY,
                r: radius,
                vx: rand(-1.5, 1.5),
                vy: rand(-1.5, 1.5),
                color: `hsl(${randInt(260, 320)}, 100%, 60%)` // 紫/洋红色系
            });
        }
    }

    // --- 重置单个食物 (被吃后调用) ---
    function relocateFood(index) {
        let f = foods[index];
        let newR = rand(4, 9);
        let attempts = 0;
        let posX, posY;
        do {
            posX = rand(newR, WORLD_SIZE - newR);
            posY = rand(newR, WORLD_SIZE - newR);
            attempts++;
        } while (Math.hypot(posX - player.x, posY - player.y) < player.r + newR + 30 && attempts < 80);
        f.x = posX;
        f.y = posY;
        f.r = newR;
    }

    // --- 重置单个敌人 (被吃后调用, 或用于初始化) ---
    function relocateEnemy(index) {
        let e = enemies[index];
        let newR = rand(14, Math.min(45, player.r * 1.2 + 8)); // 动态难度，略比玩家大或小
        let attempts = 0;
        let posX, posY;
        do {
            posX = rand(newR, WORLD_SIZE - newR);
            posY = rand(newR, WORLD_SIZE - newR);
            attempts++;
        } while (Math.hypot(posX - player.x, posY - player.y) < player.r + newR + 50 && attempts < 100);

        e.x = posX;
        e.y = posY;
        e.r = newR;
        e.vx = rand(-1.8, 1.8);
        e.vy = rand(-1.8, 1.8);
        // 更新颜色 (保持赛博色调)
        e.color = `hsl(${randInt(270, 330)}, 100%, 65%)`;
    }

    // --- 玩家移动 (基于鼠标/触摸方向) ---
    function updatePlayer() {
        if (!moveActive || !mouseInCanvas) return;

        // 从鼠标位置获取方向向量 (逻辑坐标中心为(500,500))
        // targetDX, targetDY 已由事件计算为归一化向量和力度
        let len = Math.hypot(targetDX, targetDY);
        if (len < DEAD_ZONE) return;

        let normX = targetDX / len;
        let normY = targetDY / len;
        // 速度与距离成正比 (最大速度MAX_SPEED)
        let speed = Math.min(len / 15, MAX_SPEED);  // len最大约700, 除15后最大约46, 限幅到6.5

        let newX = player.x + normX * speed;
        let newY = player.y + normY * speed;

        // 边界限制 (不能越界, 且考虑半径)
        player.x = Math.min(Math.max(newX, player.r), WORLD_SIZE - player.r);
        player.y = Math.min(Math.max(newY, player.r), WORLD_SIZE - player.r);
    }

    // --- 敌人AI移动 & 边界碰撞 ---
    function updateEnemies() {
        for (let e of enemies) {
            e.x += e.vx;
            e.y += e.vy;

            // 边界反弹 (并稍微改变方向)
            if (e.x < e.r) {
                e.x = e.r;
                e.vx *= -0.8;
                e.vy += rand(-0.3, 0.3);
            } else if (e.x > WORLD_SIZE - e.r) {
                e.x = WORLD_SIZE - e.r;
                e.vx *= -0.8;
                e.vy += rand(-0.3, 0.3);
            }
            if (e.y < e.r) {
                e.y = e.r;
                e.vy *= -0.8;
                e.vx += rand(-0.3, 0.3);
            } else if (e.y > WORLD_SIZE - e.r) {
                e.y = WORLD_SIZE - e.r;
                e.vy *= -0.8;
                e.vx += rand(-0.3, 0.3);
            }

            // 随机微调方向，更有生气
            if (Math.random() < 0.02) {
                e.vx += rand(-0.4, 0.4);
                e.vy += rand(-0.4, 0.4);
            }
            // 限制最大速度避免飞出去
            let sp = Math.hypot(e.vx, e.vy);
            let maxSp = 2.8;
            if (sp > maxSp) {
                e.vx = (e.vx / sp) * maxSp;
                e.vy = (e.vy / sp) * maxSp;
            }
        }
    }

    // --- 碰撞处理: 吞噬逻辑 (核心) ---
    function handleCollisions() {
        // 1. 玩家吃食物
        for (let i = foods.length - 1; i >= 0; i--) {
            let f = foods[i];
            const dx = player.x - f.x;
            const dy = player.y - f.y;
            const dist = Math.hypot(dx, dy);
            if (player.r > f.r * 1.1 && dist < player.r + f.r - 2) {
                // 吞噬食物
                player.r += 0.9;  // 成长
                relocateFood(i);
            }
        }

        // 2. 敌人吃食物
        for (let e of enemies) {
            for (let i = foods.length - 1; i >= 0; i--) {
                let f = foods[i];
                const dx = e.x - f.x;
                const dy = e.y - f.y;
                const dist = Math.hypot(dx, dy);
                if (e.r > f.r * 1.2 && dist < e.r + f.r - 2) {
                    e.r += 0.6;        // 敌人成长
                    relocateFood(i);
                }
            }
        }

        // 3. 玩家吃敌人 (玩家大于敌人才可吃)
        for (let i = enemies.length - 1; i >= 0; i--) {
            let e = enemies[i];
            const dx = player.x - e.x;
            const dy = player.y - e.y;
            const dist = Math.hypot(dx, dy);
            if (player.r > e.r * 1.1 && dist < player.r + e.r - 3) {
                player.r += e.r * 0.25;
                relocateEnemy(i);
            }
        }

        // 4. 敌人吃玩家 (游戏结束条件)
        for (let e of enemies) {
            const dx = player.x - e.x;
            const dy = player.y - e.y;
            const dist = Math.hypot(dx, dy);
            if (e.r > player.r * 1.1 && dist < e.r + player.r - 3) {
                // 玩家被吞噬 —— 重置世界
                initGame();
                return; // 重置后直接跳出，避免后续错误
            }
        }

        // 限制玩家最大半径 (防止溢出边界感)
        if (player.r > 300) player.r = 300;  // 世界边界内保持可玩
    }

    // --- 绘制赛博朋克风格画面 (带网格, 发光, 故障线) ---
    function draw() {
        ctx.clearRect(0, 0, LOGIC_WIDTH, LOGIC_HEIGHT);

        // 绘制背景网格 (动态扭曲，赛博感)
        ctx.strokeStyle = '#00f7ff';
        ctx.lineWidth = 0.8;
        ctx.globalAlpha = 0.2;
        // 主网格
        const step = 50;
        const offsetX = (player.x % step) - step;
        const offsetY = (player.y % step) - step;
        ctx.beginPath();
        for (let i = -5; i <= 25; i++) {
            let x = i * step - offsetX;
            ctx.moveTo(x, 0);
            ctx.lineTo(x, LOGIC_HEIGHT);
        }
        for (let i = -5; i <= 25; i++) {
            let y = i * step - offsetY;
            ctx.moveTo(0, y);
            ctx.lineTo(LOGIC_WIDTH, y);
        }
        ctx.strokeStyle = '#00ffff';
        ctx.stroke();

        // 额外霓虹故障线
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.strokeStyle = '#ff00aa';
        ctx.lineWidth = 2;
        for (let k = 0; k < 4; k++) {
            let y = (Math.random() * LOGIC_HEIGHT);
            ctx.moveTo(0, y);
            ctx.lineTo(LOGIC_WIDTH, y + (Math.random() - 0.5) * 20);
        }
        ctx.stroke();

        ctx.globalAlpha = 1.0;

        // 转换函数: 世界坐标 -> 屏幕坐标 (玩家居中)
        function worldToScreen(wx, wy) {
            const sx = LOGIC_WIDTH / 2 + (wx - player.x);
            const sy = LOGIC_HEIGHT / 2 + (wy - player.y);
            return { x: sx, y: sy };
        }

        // --- 绘制食物 (小光点) ---
        for (let f of foods) {
            const pos = worldToScreen(f.x, f.y);
            // 只绘制在视野内 (带边距)
            if (pos.x < -20 || pos.x > LOGIC_WIDTH + 20 || pos.y < -20 || pos.y > LOGIC_HEIGHT + 20) continue;

            ctx.beginPath();
            ctx.arc(pos.x, pos.y, f.r, 0, Math.PI * 2);
            ctx.fillStyle = `hsl(${160 + Math.random() * 40}, 100%, 70%)`;  // 青绿/黄
            ctx.shadowColor = '#0ff';
            ctx.shadowBlur = 15;
            ctx.fill();
        }

        // --- 绘制敌人 (霓虹紫/洋红, 有瞳孔效果) ---
        for (let e of enemies) {
            const pos = worldToScreen(e.x, e.y);
            if (pos.x < -40 || pos.x > LOGIC_WIDTH + 40 || pos.y < -40 || pos.y > LOGIC_HEIGHT + 40) continue;

            ctx.shadowColor = e.color || '#ff44ee';
            ctx.shadowBlur = 25;
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, e.r, 0, 2 * Math.PI);
            ctx.fillStyle = e.color || '#b300ff';
            ctx.fill();

            // 内圈高光
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.arc(pos.x-2, pos.y-2, e.r*0.3, 0, 2*Math.PI);
            ctx.fillStyle = '#ffffff';
            ctx.globalAlpha = 0.6;
            ctx.fill();
            ctx.globalAlpha = 1.0;
        }

        // --- 绘制玩家 (深渊吞噬者) ---
        const playerScreenX = LOGIC_WIDTH / 2;
        const playerScreenY = LOGIC_HEIGHT / 2;
        ctx.shadowColor = '#00f7ff';
        ctx.shadowBlur = 40;
        // 外发光
        ctx.beginPath();
        ctx.arc(playerScreenX, playerScreenY, player.r, 0, 2 * Math.PI);
        ctx.fillStyle = '#1100aa';
        ctx.globalAlpha = 0.3;
        ctx.fill();
        ctx.globalAlpha = 1;
        // 主球体
        ctx.shadowBlur = 40;
        const gradient = ctx.createRadialGradient(playerScreenX-8, playerScreenY-8, 5, playerScreenX, playerScreenY, player.r);
        gradient.addColorStop(0, '#aa00ff');
        gradient.addColorStop(0.7, '#220066');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(playerScreenX, playerScreenY, player.r, 0, 2*Math.PI);
        ctx.fill();

        // 眼睛 / 深渊标记
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(playerScreenX-5, playerScreenY-8, player.r*0.2, 0, 2*Math.PI);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(playerScreenX+8, playerScreenY-5, player.r*0.15, 0, 2*Math.PI);
        ctx.fillStyle = '#ff66cc';
        ctx.fill();

        // 玩家名称
        ctx.shadowBlur = 20;
        ctx.font = 'bold 24px "Share Tech Mono", monospace';
        ctx.fillStyle = '#00ffff';
        ctx.textAlign = 'center';
        ctx.fillText('⏣ 深渊 ⏣', playerScreenX, playerScreenY - player.r - 12);

        // 更新HUD分数
        scoreSpan.innerText = `⚡质量: ${Math.floor(player.r)}`;

        // 重置阴影
        ctx.shadowBlur = 0;
        ctx.shadowColor = 'transparent';
    }

    // --- 动画循环 ---
    function gameLoop() {
        updatePlayer();
        updateEnemies();
        handleCollisions();
        draw();
        requestAnimationFrame(gameLoop);
    }

    // --- 事件监听: 鼠标 / 触摸 (转换为逻辑坐标及方向) ---
    function handleMove(clientX, clientY) {
        const rect = canvas.getBoundingClientRect();
        // 将屏幕坐标映射到canvas逻辑坐标 (0~1000)
        const scaleX = LOGIC_WIDTH / rect.width;
        const scaleY = LOGIC_HEIGHT / rect.height;

        // 鼠标相对于canvas左上角(逻辑像素)
        let canvasX = (clientX - rect.left) * scaleX;
        let canvasY = (clientY - rect.top) * scaleY;

        // 边界裁剪
        canvasX = Math.min(LOGIC_WIDTH, Math.max(0, canvasX));
        canvasY = Math.min(LOGIC_HEIGHT, Math.max(0, canvasY));

        // 计算相对于中心(500,500)的偏移
        targetDX = canvasX - LOGIC_WIDTH / 2;
        targetDY = canvasY - LOGIC_HEIGHT / 2;

        mouseInCanvas = true;
        moveActive = true;
    }

    function handleMoveEnd() {
        moveActive = false;
        targetDX = 0;
        targetDY = 0;
        mouseInCanvas = false;
    }

    // 鼠标事件
    canvas.addEventListener('mousemove', (e) => {
        e.preventDefault();
        handleMove(e.clientX, e.clientY);
    });
    canvas.addEventListener('mouseenter', () => {
        mouseInCanvas = true;
    });
    canvas.addEventListener('mouseleave', () => {
        handleMoveEnd();
    });

    // 触摸事件
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (e.touches.length > 0) {
            handleMove(e.touches[0].clientX, e.touches[0].clientY);
        }
    }, { passive: false });
    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        if (e.touches.length > 0) {
            handleMove(e.touches[0].clientX, e.touches[0].clientY);
        }
    }, { passive: false });
    canvas.addEventListener('touchend', (e) => {
        e.preventDefault();
        handleMoveEnd();
    });
    canvas.addEventListener('touchcancel', (e) => {
        e.preventDefault();
        handleMoveEnd();
    });

    // 禁止右键菜单
    canvas.addEventListener('contextmenu', (e) => e.preventDefault());

    // 启动游戏
    initGame();
    gameLoop();

    // 响应窗口resize (无需调整逻辑画布，仅CSS处理)
    window.addEventListener('resize', () => {});
})();
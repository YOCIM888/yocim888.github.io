// 游戏主逻辑
(function() {
    // 游戏元素
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const startScreen = document.getElementById('startScreen');
    const gameOverScreen = document.getElementById('gameOverScreen');
    const levelCompleteScreen = document.getElementById('levelCompleteScreen');
    const startBtn = document.getElementById('startBtn');
    const restartBtn = document.getElementById('restartBtn');
    const nextLevelBtn = document.getElementById('nextLevelBtn');
    const scoreElement = document.getElementById('score');
    const livesElement = document.getElementById('lives');
    const levelElement = document.getElementById('level');
    const distanceElement = document.getElementById('distance');
    const finalScoreElement = document.getElementById('finalScore');
    const finalDistanceElement = document.getElementById('finalDistance');
    const completedLevelElement = document.getElementById('completedLevel');
    const levelBonusElement = document.getElementById('levelBonus');
    
    // 控制按钮
    const upBtn = document.getElementById('upBtn');
    const downBtn = document.getElementById('downBtn');
    const leftBtn = document.getElementById('leftBtn');
    const rightBtn = document.getElementById('rightBtn');
    const actionBtn = document.getElementById('actionBtn');
    const jumpBtn = document.getElementById('jumpBtn');
    const specialBtn = document.getElementById('specialBtn');
    
    // 游戏状态
    let game = {
        running: false,
        score: 0,
        lives: 3,
        level: 1,
        gameOver: false,
        levelComplete: false,
        distance: 0,
        maxDistance: 3000, // 最大距离，到达后完成关卡
        cameraY: 0,
        cameraSpeed: 2
    };
    
    // 调整画布大小
    function resizeCanvas() {
        const container = document.querySelector('.game-canvas-container');
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
    }
    
    // 玩家属性
    const player = {
        x: canvas.width / 2 - 20,
        y: canvas.height / 2,
        width: 40,
        height: 60,
        speed: 6,
        jumpPower: 16,
        velX: 0,
        velY: 0,
        isJumping: false,
        color: '#4d79ff',
        facing: 'right',
        lastShot: 0,
        shotDelay: 300, // 射击延迟(毫秒)
        specialCharge: 100, // 特殊技能充能
        maxSpecialCharge: 100,
        specialActive: false,
        specialDuration: 0
    };
    
    // 平台 - 重新设计，适合向上卷轴
    const platforms = [];
    const platformWidth = 200;
    const platformHeight = 20;
    const platformGap = 150; // 平台之间的垂直间隔
    
    // 生成平台
    function generatePlatforms() {
        platforms.length = 0;
        
        // 起始平台
        platforms.push({
            x: canvas.width / 2 - platformWidth / 2,
            y: canvas.height - 100,
            width: platformWidth,
            height: platformHeight,
            type: 'start'
        });
        
        // 生成更多平台，直到最大距离
        let currentY = canvas.height - 100 - platformGap;
        const minX = 50;
        const maxX = canvas.width - platformWidth - 50;
        
        while (currentY > -game.maxDistance) {
            // 随机水平位置
            const x = minX + Math.random() * (maxX - minX);
            
            // 随机平台宽度
            const width = platformWidth * (0.7 + Math.random() * 0.6);
            
            // 随机平台类型
            let type = 'normal';
            if (Math.random() > 0.7) type = 'moving';
            if (Math.random() > 0.9 && currentY < -500) type = 'breakable';
            
            platforms.push({
                x: x,
                y: currentY,
                width: width,
                height: platformHeight,
                type: type,
                moveDir: Math.random() > 0.5 ? 1 : -1,
                moveSpeed: 1 + Math.random() * 2,
                moveRange: 50 + Math.random() * 100,
                originalX: x,
                broken: false
            });
            
            // 随机添加额外的小平台
            if (Math.random() > 0.5 && currentY < -200) {
                const smallX = minX + Math.random() * (maxX - minX);
                platforms.push({
                    x: smallX,
                    y: currentY + 50,
                    width: platformWidth * 0.4,
                    height: platformHeight,
                    type: 'small',
                    broken: false
                });
            }
            
            currentY -= platformGap * (0.8 + Math.random() * 0.4);
        }
        
        // 终点平台
        platforms.push({
            x: canvas.width / 2 - platformWidth / 2,
            y: -game.maxDistance + 100,
            width: platformWidth * 1.5,
            height: platformHeight * 2,
            type: 'finish',
            color: '#4dff88'
        });
    }
    
    // 子弹数组
    let bullets = [];
    
    // 敌人数组
    let enemies = [];
    
    // 粒子效果数组
    let particles = [];
    
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
    
    // 初始化游戏
    function initGame() {
        game.running = true;
        game.score = 0;
        game.lives = 3;
        game.level = 1;
        game.gameOver = false;
        game.levelComplete = false;
        game.distance = 0;
        game.cameraY = 0;
        
        player.x = canvas.width / 2 - 20;
        player.y = canvas.height / 2;
        player.velX = 0;
        player.velY = 0;
        player.isJumping = false;
        player.specialCharge = 100;
        player.specialActive = false;
        player.specialDuration = 0;
        
        bullets = [];
        enemies = [];
        particles = [];
        
        // 调整画布大小
        resizeCanvas();
        
        // 生成平台
        generatePlatforms();
        
        // 创建敌人
        createEnemiesForLevel();
        
        // 隐藏开始和结束屏幕
        startScreen.classList.add('hidden');
        gameOverScreen.classList.add('hidden');
        levelCompleteScreen.classList.add('hidden');
        
        // 更新UI
        updateUI();
        
        // 开始游戏循环
        gameLoop();
    }
    
    // 进入下一关
    function nextLevel() {
        game.level++;
        game.distance = 0;
        game.cameraY = 0;
        game.maxDistance = 3000 + (game.level - 1) * 500;
        
        player.x = canvas.width / 2 - 20;
        player.y = canvas.height / 2;
        player.velX = 0;
        player.velY = 0;
        player.isJumping = false;
        player.specialCharge = 100;
        player.specialActive = false;
        player.specialDuration = 0;
        
        bullets = [];
        enemies = [];
        particles = [];
        
        // 生成新平台
        generatePlatforms();
        
        // 创建敌人
        createEnemiesForLevel();
        
        // 隐藏关卡完成屏幕
        levelCompleteScreen.classList.add('hidden');
        
        // 更新UI
        updateUI();
        
        // 继续游戏循环
        game.running = true;
        game.levelComplete = false;
    }
    
    // 为当前关卡创建敌人
    function createEnemiesForLevel() {
        enemies = [];
        
        // 根据关卡增加敌人数量和类型
        const enemyCount = 3 + game.level;
        
        for (let i = 0; i < enemyCount; i++) {
            // 在可见平台范围内选择平台
            const visiblePlatforms = platforms.filter(p => 
                p.y > -game.distance - canvas.height && 
                p.y < -game.distance + canvas.height * 2 &&
                p.type !== 'finish'
            );
            
            if (visiblePlatforms.length === 0) continue;
            
            const platformIndex = Math.floor(Math.random() * visiblePlatforms.length);
            const platform = visiblePlatforms[platformIndex];
            
            let enemyType = 'basic';
            if (game.level >= 3 && Math.random() > 0.6) enemyType = 'fast';
            if (game.level >= 5 && Math.random() > 0.7) enemyType = 'tank';
            if (game.level >= 7 && Math.random() > 0.8) enemyType = 'flyer';
            
            enemies.push({
                x: platform.x + Math.random() * (platform.width - 40),
                y: platform.y - 40,
                width: 40,
                height: 40,
                speed: enemyType === 'fast' ? 3 : enemyType === 'flyer' ? 2 : enemyType === 'tank' ? 1 : 2,
                color: enemyType === 'fast' ? '#ff4d4d' : 
                       enemyType === 'tank' ? '#ff9900' : 
                       enemyType === 'flyer' ? '#cc33ff' : '#cc33ff',
                type: enemyType,
                health: enemyType === 'tank' ? 3 : enemyType === 'flyer' ? 2 : 1,
                direction: Math.random() > 0.5 ? 1 : -1,
                lastDirectionChange: 0,
                platformId: platformIndex,
                flyOffset: enemyType === 'flyer' ? Math.random() * Math.PI * 2 : 0,
                flySpeed: enemyType === 'flyer' ? 0.05 : 0
            });
        }
    }
    
    // 游戏主循环
    function gameLoop() {
        if (!game.running) return;
        
        // 清除画布
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 保存画布状态
        ctx.save();
        
        // 应用摄像机偏移（竖向卷轴）
        ctx.translate(0, game.cameraY);
        
        // 绘制背景
        drawBackground();
        
        // 更新和绘制平台
        updatePlatforms();
        drawPlatforms();
        
        // 处理玩家输入
        handleControls();
        
        // 应用重力
        player.velY += 0.8;
        
        // 更新玩家位置
        player.x += player.velX;
        player.y += player.velY;
        
        // 更新摄像机位置（跟随玩家向上移动）
        updateCamera();
        
        // 玩家边界检查（水平方向）
        if (player.x < 20) player.x = 20;
        if (player.x + player.width > canvas.width - 20) player.x = canvas.width - player.width - 20;
        
        // 玩家掉落检查
        if (player.y > canvas.height + 100) {
            playerHit();
            // 将玩家重置到当前摄像机位置附近的平台
            resetPlayerPosition();
        }
        
        // 玩家与平台碰撞检测
        handlePlayerPlatformCollision();
        
        // 更新子弹
        updateBullets();
        
        // 更新敌人
        updateEnemies();
        
        // 更新粒子效果
        updateParticles();
        
        // 更新特殊技能
        updateSpecialAbility();
        
        // 绘制玩家
        drawPlayer();
        
        // 绘制子弹
        drawBullets();
        
        // 绘制敌人
        drawEnemies();
        
        // 绘制粒子效果
        drawParticles();
        
        // 绘制终点
        drawFinishLine();
        
        // 恢复画布状态
        ctx.restore();
        
        // 绘制UI元素（不受摄像机影响）
        drawUIOverlay();
        
        // 检查是否到达终点
        checkFinish();
        
        // 继续游戏循环
        requestAnimationFrame(gameLoop);
    }
    
    // 更新摄像机位置
    function updateCamera() {
        // 当玩家向上移动时，摄像机跟随
        if (player.y < canvas.height / 3) {
            const targetY = canvas.height / 3 - player.y;
            game.cameraY += targetY * 0.05;
            
            // 更新距离
            game.distance = Math.max(game.distance, Math.abs(game.cameraY));
            updateUI();
        }
        
        // 限制摄像机移动范围
        if (game.cameraY > 0) game.cameraY = 0;
        if (game.cameraY < -game.maxDistance + canvas.height) {
            game.cameraY = -game.maxDistance + canvas.height;
        }
    }
    
    // 绘制背景
    function drawBackground() {
        // 渐变背景
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 3);
        gradient.addColorStop(0, '#0a0a2a');
        gradient.addColorStop(0.5, '#1a1a40');
        gradient.addColorStop(1, '#0a0a1a');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, -canvas.height * 2, canvas.width, canvas.height * 4);
        
        // 绘制远处行星
        ctx.fillStyle = 'rgba(100, 100, 200, 0.2)';
        ctx.beginPath();
        ctx.arc(600, -game.distance * 0.2 + 100, 80, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = 'rgba(150, 100, 200, 0.15)';
        ctx.beginPath();
        ctx.arc(200, -game.distance * 0.3 + 300, 60, 0, Math.PI * 2);
        ctx.fill();
        
        // 绘制星星
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        for (let i = 0; i < 200; i++) {
            const x = (i * 17) % canvas.width;
            const y = -game.distance * 0.1 + (i * 11) % (canvas.height * 3);
            const size = Math.random() * 2.5;
            const brightness = 0.5 + Math.random() * 0.5;
            ctx.fillStyle = `rgba(255, 255, 255, ${brightness})`;
            ctx.fillRect(x, y, size, size);
        }
        
        // 绘制远处星云
        ctx.fillStyle = 'rgba(77, 238, 234, 0.05)';
        ctx.beginPath();
        ctx.ellipse(150, -game.distance * 0.15, 200, 80, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = 'rgba(255, 77, 77, 0.05)';
        ctx.beginPath();
        ctx.ellipse(canvas.width - 150, -game.distance * 0.25, 150, 60, 0, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // 更新平台
    function updatePlatforms() {
        platforms.forEach(platform => {
            if (platform.type === 'moving') {
                platform.x += platform.moveSpeed * platform.moveDir;
                
                // 检查是否超出移动范围
                if (platform.x > platform.originalX + platform.moveRange) {
                    platform.moveDir = -1;
                } else if (platform.x < platform.originalX - platform.moveRange) {
                    platform.moveDir = 1;
                }
            }
        });
    }
    
    // 绘制平台
    function drawPlatforms() {
        platforms.forEach(platform => {
            // 只绘制在摄像机视野内的平台
            if (platform.y > -game.cameraY + canvas.height || 
                platform.y + platform.height < -game.cameraY) {
                return;
            }
            
            // 可破坏平台
            if (platform.type === 'breakable' && platform.broken) {
                return;
            }
            
            // 平台阴影
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(platform.x + 4, platform.y + 4, platform.width, platform.height);
            
            // 平台主体
            let gradient;
            if (platform.type === 'finish') {
                gradient = ctx.createLinearGradient(platform.x, platform.y, platform.x, platform.y + platform.height);
                gradient.addColorStop(0, '#4dff88');
                gradient.addColorStop(1, '#00cc44');
            } else if (platform.type === 'breakable') {
                gradient = ctx.createLinearGradient(platform.x, platform.y, platform.x, platform.y + platform.height);
                gradient.addColorStop(0, '#ff9966');
                gradient.addColorStop(1, '#cc6600');
            } else if (platform.type === 'moving') {
                gradient = ctx.createLinearGradient(platform.x, platform.y, platform.x, platform.y + platform.height);
                gradient.addColorStop(0, '#6666ff');
                gradient.addColorStop(1, '#3333cc');
            } else {
                gradient = ctx.createLinearGradient(platform.x, platform.y, platform.x, platform.y + platform.height);
                gradient.addColorStop(0, '#888');
                gradient.addColorStop(1, '#555');
            }
            
            ctx.fillStyle = gradient;
            ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
            
            // 平台顶部高光
            if (platform.type === 'finish') {
                ctx.fillStyle = '#aaffaa';
            } else {
                ctx.fillStyle = '#aaa';
            }
            ctx.fillRect(platform.x, platform.y, platform.width, 5);
            
            // 终点平台标记
            if (platform.type === 'finish') {
                ctx.fillStyle = '#ffea00';
                ctx.font = 'bold 24px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('终 点', platform.x + platform.width/2, platform.y + platform.height/2 + 8);
                ctx.textAlign = 'left';
            }
        });
    }
    
    // 绘制终点线
    function drawFinishLine() {
        const finishPlatform = platforms.find(p => p.type === 'finish');
        if (!finishPlatform) return;
        
        // 终点旗帜
        ctx.fillStyle = '#ff3333';
        ctx.beginPath();
        ctx.moveTo(finishPlatform.x + finishPlatform.width, finishPlatform.y);
        ctx.lineTo(finishPlatform.x + finishPlatform.width, finishPlatform.y - 100);
        ctx.lineTo(finishPlatform.x + finishPlatform.width + 50, finishPlatform.y - 50);
        ctx.lineTo(finishPlatform.x + finishPlatform.width, finishPlatform.y);
        ctx.fill();
        
        // 旗帜杆
        ctx.fillStyle = '#996633';
        ctx.fillRect(finishPlatform.x + finishPlatform.width - 5, finishPlatform.y - 100, 10, 100);
    }
    
    // 处理控制输入
    function handleControls() {
        // 水平移动
        if (controls.left) {
            player.velX = -player.speed;
            player.facing = 'left';
        } else if (controls.right) {
            player.velX = player.speed;
            player.facing = 'right';
        } else {
            player.velX *= 0.8; // 摩擦力
            if (Math.abs(player.velX) < 0.5) player.velX = 0;
        }
        
        // 垂直移动（在移动端上下按钮用于调整摄像机或特殊动作）
        if (controls.up) {
            // 向上移动时，玩家可以跳得更高
            if (!player.isJumping && player.velY < 0) {
                player.velY *= 0.95;
            }
        }
        
        if (controls.down) {
            // 向下快速下降
            if (player.isJumping) {
                player.velY += 2;
            }
        }
        
        // 跳跃
        if (controls.jump && !player.isJumping) {
            player.velY = -player.jumpPower;
            player.isJumping = true;
            
            // 跳跃粒子效果
            createParticles(player.x + player.width/2, player.y + player.height, 8, '#4dff88');
        }
        
        // 射击
        if (controls.action) {
            const currentTime = Date.now();
            if (currentTime - player.lastShot > player.shotDelay) {
                shootBullet();
                player.lastShot = currentTime;
            }
        }
        
        // 特殊技能
        if (controls.special && player.specialCharge >= 100 && !player.specialActive) {
            activateSpecialAbility();
        }
    }
    
    // 更新特殊技能
    function updateSpecialAbility() {
        // 充能
        if (!player.specialActive && player.specialCharge < 100) {
            player.specialCharge += 0.5;
            if (player.specialCharge > 100) player.specialCharge = 100;
        }
        
        // 特殊技能激活状态
        if (player.specialActive) {
            player.specialDuration--;
            
            // 特殊技能效果：无敌和快速射击
            player.shotDelay = 100;
            
            // 生成保护粒子
            if (player.specialDuration % 5 === 0) {
                createParticles(
                    player.x + player.width/2, 
                    player.y + player.height/2, 
                    3, 
                    '#ffcc00'
                );
            }
            
            // 技能结束
            if (player.specialDuration <= 0) {
                player.specialActive = false;
                player.shotDelay = 300;
                player.specialCharge = 0;
            }
        }
    }
    
    // 激活特殊技能
    function activateSpecialAbility() {
        player.specialActive = true;
        player.specialDuration = 180; // 3秒（60fps）
        
        // 技能激活特效
        for (let i = 0; i < 50; i++) {
            createParticles(
                player.x + player.width/2, 
                player.y + player.height/2, 
                1, 
                '#ffcc00'
            );
        }
    }
    
    // 玩家与平台碰撞检测
    function handlePlayerPlatformCollision() {
        player.isJumping = true;
        
        platforms.forEach(platform => {
            // 跳过已破坏的平台
            if (platform.type === 'breakable' && platform.broken) {
                return;
            }
            
            // 碰撞检测
            if (player.x < platform.x + platform.width &&
                player.x + player.width > platform.x &&
                player.y < platform.y + platform.height &&
                player.y + player.height > platform.y) {
                
                // 确定从哪个方向碰撞
                const bottomCollision = player.y + player.height - player.velY <= platform.y;
                const topCollision = player.y - player.velY >= platform.y + platform.height;
                const leftCollision = player.x + player.width - player.velX <= platform.x;
                const rightCollision = player.x - player.velX >= platform.x + platform.width;
                
                // 从顶部碰撞（站在平台上）
                if (bottomCollision && player.velY > 0) {
                    player.y = platform.y - player.height;
                    player.velY = 0;
                    player.isJumping = false;
                    
                    // 如果是可破坏平台，有几率破坏
                    if (platform.type === 'breakable' && Math.random() > 0.7) {
                        platform.broken = true;
                        createParticles(
                            platform.x + platform.width/2, 
                            platform.y + platform.height/2, 
                            20, 
                            '#ff9966'
                        );
                    }
                }
                // 从底部碰撞
                else if (topCollision && player.velY < 0) {
                    player.y = platform.y + platform.height;
                    player.velY = 0;
                }
                // 从左侧碰撞
                else if (rightCollision && player.velX < 0) {
                    player.x = platform.x + platform.width;
                    player.velX = 0;
                }
                // 从右侧碰撞
                else if (leftCollision && player.velX > 0) {
                    player.x = platform.x - player.width;
                    player.velX = 0;
                }
            }
        });
    }
    
    // 绘制玩家
    function drawPlayer() {
        // 玩家阴影
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.fillRect(player.x + 5, player.y + 8, player.width, player.height);
        
        // 特殊技能激活时的发光效果
        if (player.specialActive) {
            ctx.shadowColor = '#ffcc00';
            ctx.shadowBlur = 20;
        }
        
        // 玩家身体
        const gradient = ctx.createLinearGradient(
            player.x, player.y, 
            player.x, player.y + player.height
        );
        gradient.addColorStop(0, player.color);
        gradient.addColorStop(0.6, '#1a53ff');
        gradient.addColorStop(1, '#0a2a99');
        ctx.fillStyle = gradient;
        ctx.fillRect(player.x, player.y, player.width, player.height);
        
        // 玩家细节 - 机甲外观
        ctx.fillStyle = '#333';
        // 胸部装甲
        ctx.fillRect(player.x + 5, player.y + 15, player.width - 10, 25);
        // 肩部装甲
        ctx.fillStyle = '#4d4dff';
        ctx.fillRect(player.x - 5, player.y + 10, 5, 20);
        ctx.fillRect(player.x + player.width, player.y + 10, 5, 20);
        
        // 头盔
        ctx.fillStyle = '#2a2a99';
        ctx.fillRect(player.x + 8, player.y + 5, player.width - 16, 10);
        
        // 面部（根据方向显示）
        ctx.fillStyle = '#4deeea';
        if (player.facing === 'right') {
            // 右侧面罩
            ctx.fillRect(player.x + player.width - 12, player.y + 8, 3, 4);
            // 右侧眼睛
            ctx.fillStyle = '#00ffff';
            ctx.fillRect(player.x + player.width - 18, player.y + 8, 4, 4);
        } else {
            // 左侧面罩
            ctx.fillRect(player.x + 9, player.y + 8, 3, 4);
            // 左侧眼睛
            ctx.fillStyle = '#00ffff';
            ctx.fillRect(player.x + 14, player.y + 8, 4, 4);
        }
        
        // 武器
        ctx.fillStyle = '#666';
        if (player.facing === 'right') {
            ctx.fillRect(player.x + player.width - 5, player.y + 28, 20, 6);
            // 武器发光
            ctx.fillStyle = '#ff9900';
            ctx.fillRect(player.x + player.width + 15, player.y + 29, 5, 4);
        } else {
            ctx.fillRect(player.x - 15, player.y + 28, 20, 6);
            // 武器发光
            ctx.fillStyle = '#ff9900';
            ctx.fillRect(player.x - 20, player.y + 29, 5, 4);
        }
        
        // 腿部细节
        ctx.fillStyle = '#2a2a99';
        ctx.fillRect(player.x + 10, player.y + player.height - 15, 8, 15);
        ctx.fillRect(player.x + player.width - 18, player.y + player.height - 15, 8, 15);
        
        // 重置阴影
        ctx.shadowBlur = 0;
        
        // 特殊技能充能条
        if (player.specialCharge < 100) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(player.x, player.y - 15, player.width, 8);
            
            ctx.fillStyle = '#ffcc00';
            ctx.fillRect(player.x + 2, player.y - 13, (player.width - 4) * (player.specialCharge / 100), 4);
        }
    }
    
    // 重置玩家位置
    function resetPlayerPosition() {
        // 找到最近的平台
        let nearestPlatform = null;
        let minDistance = Infinity;
        
        platforms.forEach(platform => {
            if (platform.type === 'breakable' && platform.broken) return;
            
            const distance = Math.abs(platform.y - (-game.cameraY + canvas.height - 100));
            if (distance < minDistance) {
                minDistance = distance;
                nearestPlatform = platform;
            }
        });
        
        if (nearestPlatform) {
            player.x = nearestPlatform.x + nearestPlatform.width/2 - player.width/2;
            player.y = nearestPlatform.y - player.height;
            player.velY = 0;
            player.isJumping = false;
            
            // 重置摄像机位置
            game.cameraY = -nearestPlatform.y + canvas.height/2;
        } else {
            // 如果没有找到平台，重置到起始位置
            player.x = canvas.width / 2 - 20;
            player.y = canvas.height / 2;
            game.cameraY = 0;
        }
    }
    
    // 发射子弹
    function shootBullet() {
        const bulletX = player.facing === 'right' ? 
            player.x + player.width : player.x - 10;
        const bulletY = player.y + 30;
        
        const bulletSpeed = player.specialActive ? 15 : 10;
        
        bullets.push({
            x: bulletX,
            y: bulletY,
            width: player.specialActive ? 15 : 10,
            height: player.specialActive ? 8 : 5,
            speed: player.facing === 'right' ? bulletSpeed : -bulletSpeed,
            color: player.specialActive ? '#ffcc00' : '#ffea00',
            power: player.specialActive ? 2 : 1
        });
        
        // 射击粒子效果
        createParticles(bulletX, bulletY, 5, player.specialActive ? '#ffcc00' : '#ffea00');
    }
    
    // 更新子弹
    function updateBullets() {
        for (let i = bullets.length - 1; i >= 0; i--) {
            const bullet = bullets[i];
            bullet.x += bullet.speed;
            
            // 移除屏幕外的子弹
            if (bullet.x < -100 || bullet.x > canvas.width + 100) {
                bullets.splice(i, 1);
                continue;
            }
            
            // 检查子弹与敌人的碰撞
            for (let j = enemies.length - 1; j >= 0; j--) {
                const enemy = enemies[j];
                
                if (bullet.x < enemy.x + enemy.width &&
                    bullet.x + bullet.width > enemy.x &&
                    bullet.y < enemy.y + enemy.height &&
                    bullet.y + bullet.height > enemy.y) {
                    
                    // 击中敌人
                    enemy.health -= bullet.power;
                    
                    // 击中粒子效果
                    createParticles(enemy.x + enemy.width/2, enemy.y + enemy.height/2, 10, enemy.color);
                    
                    // 移除子弹
                    bullets.splice(i, 1);
                    
                    // 如果敌人生命值为0，移除敌人并增加分数
                    if (enemy.health <= 0) {
                        game.score += 100 * game.level;
                        enemies.splice(j, 1);
                        
                        // 爆炸粒子效果
                        createParticles(enemy.x + enemy.width/2, enemy.y + enemy.height/2, 25, '#ff3333');
                    }
                    
                    updateUI();
                    break;
                }
            }
        }
    }
    
    // 绘制子弹
    function drawBullets() {
        bullets.forEach(bullet => {
            // 子弹发光效果
            ctx.shadowColor = bullet.color;
            ctx.shadowBlur = 15;
            ctx.fillStyle = bullet.color;
            ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
            ctx.shadowBlur = 0;
            
            // 子弹轨迹
            ctx.strokeStyle = bullet.color;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(bullet.x + (bullet.speed > 0 ? 0 : bullet.width), bullet.y + bullet.height/2);
            ctx.lineTo(bullet.x + (bullet.speed > 0 ? -20 : bullet.width + 20), bullet.y + bullet.height/2);
            ctx.stroke();
        });
    }
    
    // 更新敌人
    function updateEnemies() {
        const currentTime = Date.now();
        
        enemies.forEach(enemy => {
            // 飞行敌人特殊移动
            if (enemy.type === 'flyer') {
                enemy.flyOffset += enemy.flySpeed;
                enemy.y += Math.sin(enemy.flyOffset) * 2;
                
                // 飞行敌人水平移动
                enemy.x += enemy.speed * enemy.direction;
                
                // 边界检查
                if (enemy.x < 50) {
                    enemy.direction = 1;
                } else if (enemy.x + enemy.width > canvas.width - 50) {
                    enemy.direction = -1;
                }
            } 
            // 地面敌人移动
            else {
                // 敌人移动
                enemy.x += enemy.speed * enemy.direction;
                
                // 敌人平台边界检查
                let onPlatform = false;
                platforms.forEach(platform => {
                    if (platform.type === 'breakable' && platform.broken) return;
                    
                    if (enemy.x >= platform.x - 10 && 
                        enemy.x + enemy.width <= platform.x + platform.width + 10 &&
                        enemy.y + enemy.height >= platform.y - 5 &&
                        enemy.y + enemy.height <= platform.y + 5) {
                        
                        onPlatform = true;
                        
                        // 到达平台边缘时改变方向
                        if (enemy.x <= platform.x || enemy.x + enemy.width >= platform.x + platform.width) {
                            if (currentTime - enemy.lastDirectionChange > 1000) {
                                enemy.direction *= -1;
                                enemy.lastDirectionChange = currentTime;
                            }
                        }
                    }
                });
                
                // 如果不在平台上，尝试寻找平台
                if (!onPlatform) {
                    // 简单AI：改变方向并希望找到平台
                    if (currentTime - enemy.lastDirectionChange > 500) {
                        enemy.direction *= -1;
                        enemy.lastDirectionChange = currentTime;
                    }
                }
            }
            
            // 敌人与玩家碰撞检测
            if (player.x < enemy.x + enemy.width &&
                player.x + player.width > enemy.x &&
                player.y < enemy.y + enemy.height &&
                player.y + player.height > enemy.y) {
                
                // 特殊技能激活时，玩家无敌
                if (!player.specialActive) {
                    playerHit();
                } else {
                    // 特殊技能激活时，接触敌人会消灭敌人
                    enemy.health = 0;
                    game.score += 50 * game.level;
                    createParticles(enemy.x + enemy.width/2, enemy.y + enemy.height/2, 25, '#ff3333');
                }
            }
        });
        
        // 移除视野外的敌人（节省性能）
        for (let i = enemies.length - 1; i >= 0; i--) {
            const enemy = enemies[i];
            if (enemy.y > -game.cameraY + canvas.height + 200) {
                enemies.splice(i, 1);
            }
        }
    }
    
    // 绘制敌人
    function drawEnemies() {
        enemies.forEach(enemy => {
            // 敌人阴影
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(enemy.x + 4, enemy.y + 6, enemy.width, enemy.height);
            
            // 敌人身体
            ctx.fillStyle = enemy.color;
            ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
            
            // 敌人眼睛
            ctx.fillStyle = 'white';
            if (enemy.direction > 0 || enemy.type === 'flyer') {
                // 向右看
                ctx.fillRect(enemy.x + enemy.width - 15, enemy.y + 10, 8, 8);
            } else {
                // 向左看
                ctx.fillRect(enemy.x + 7, enemy.y + 10, 8, 8);
            }
            
            // 坦克型敌人有额外装甲
            if (enemy.type === 'tank') {
                ctx.fillStyle = '#996600';
                ctx.fillRect(enemy.x + 5, enemy.y - 5, enemy.width - 10, 5);
                ctx.fillRect(enemy.x + 5, enemy.y + enemy.height, enemy.width - 10, 5);
                ctx.fillRect(enemy.x - 5, enemy.y + 5, 5, enemy.height - 10);
                ctx.fillRect(enemy.x + enemy.width, enemy.y + 5, 5, enemy.height - 10);
                
                // 显示生命值
                ctx.fillStyle = '#ff0000';
                ctx.fillRect(enemy.x, enemy.y - 10, enemy.width * (enemy.health / 3), 3);
            }
            
            // 飞行敌人翅膀
            if (enemy.type === 'flyer') {
                ctx.fillStyle = '#9900ff';
                ctx.beginPath();
                ctx.ellipse(enemy.x - 10, enemy.y + enemy.height/2, 15, 8, 0, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.beginPath();
                ctx.ellipse(enemy.x + enemy.width + 10, enemy.y + enemy.height/2, 15, 8, 0, 0, Math.PI * 2);
                ctx.fill();
            }
        });
    }
    
    // 玩家被击中
    function playerHit() {
        game.lives--;
        updateUI();
        
        // 击中粒子效果
        createParticles(player.x + player.width/2, player.y + player.height/2, 25, '#ff3333');
        
        if (game.lives <= 0) {
            gameOver();
        }
    }
    
    // 检查是否到达终点
    function checkFinish() {
        const finishPlatform = platforms.find(p => p.type === 'finish');
        if (!finishPlatform) return;
        
        // 检查玩家是否在终点平台上
        if (player.x < finishPlatform.x + finishPlatform.width &&
            player.x + player.width > finishPlatform.x &&
            player.y + player.height >= finishPlatform.y &&
            player.y + player.height <= finishPlatform.y + 20) {
            
            levelComplete();
        }
    }
    
    // 关卡完成
    function levelComplete() {
        game.running = false;
        game.levelComplete = true;
        
        // 计算奖励
        const distanceBonus = Math.floor(game.distance / 10);
        const levelBonus = 500 * game.level;
        const totalBonus = distanceBonus + levelBonus;
        game.score += totalBonus;
        
        // 更新UI
        completedLevelElement.textContent = game.level;
        levelBonusElement.textContent = totalBonus;
        
        // 显示关卡完成屏幕
        levelCompleteScreen.classList.remove('hidden');
    }
    
    // 游戏结束
    function gameOver() {
        game.running = false;
        game.gameOver = true;
        
        finalScoreElement.textContent = game.score;
        finalDistanceElement.textContent = Math.floor(game.distance) + 'm';
        gameOverScreen.classList.remove('hidden');
    }
    
    // 创建粒子效果
    function createParticles(x, y, count, color) {
        for (let i = 0; i < count; i++) {
            particles.push({
                x: x,
                y: y,
                size: Math.random() * 6 + 2,
                speedX: (Math.random() - 0.5) * 12,
                speedY: (Math.random() - 0.5) * 12,
                color: color,
                life: 30 + Math.random() * 40,
                fade: 0.03 + Math.random() * 0.04
            });
        }
    }
    
    // 更新粒子效果
    function updateParticles() {
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            
            p.x += p.speedX;
            p.y += p.speedY;
            p.life -= 1;
            p.speedX *= 0.92;
            p.speedY *= 0.92;
            p.size *= 0.97;
            
            if (p.life <= 0 || p.size < 0.5) {
                particles.splice(i, 1);
            }
        }
    }
    
    // 绘制粒子效果
    function drawParticles() {
        particles.forEach(p => {
            ctx.globalAlpha = p.life / 70;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.globalAlpha = 1.0;
    }
    
    // 绘制UI覆盖层（不受摄像机影响）
    function drawUIOverlay() {
        // 绘制距离指示器
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(20, 20, 200, 30);
        
        ctx.fillStyle = '#4deeea';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`距离: ${Math.floor(game.distance)}m / ${game.maxDistance}m`, 30, 42);
        
        // 进度条
        const progressWidth = 180;
        const progress = game.distance / game.maxDistance;
        ctx.fillStyle = '#333';
        ctx.fillRect(25, 50, progressWidth, 10);
        ctx.fillStyle = '#4dff88';
        ctx.fillRect(25, 50, progressWidth * progress, 10);
        
        // 特殊技能指示器
        if (player.specialCharge < 100) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(canvas.width - 120, 20, 100, 20);
            
            ctx.fillStyle = '#ffcc00';
            ctx.fillRect(canvas.width - 118, 22, 96 * (player.specialCharge / 100), 16);
            
            ctx.fillStyle = '#fff';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('特殊技能', canvas.width - 70, 35);
        } else if (!player.specialActive) {
            ctx.fillStyle = 'rgba(255, 204, 0, 0.8)';
            ctx.fillRect(canvas.width - 120, 20, 100, 20);
            
            ctx.fillStyle = '#000';
            ctx.font = 'bold 12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('特殊技能就绪', canvas.width - 70, 35);
        }
        
        // 当前关卡显示
        ctx.fillStyle = 'rgba(77, 238, 234, 0.8)';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`关卡 ${game.level}`, canvas.width / 2, 40);
        
        ctx.textAlign = 'left';
    }
    
    // 更新UI
    function updateUI() {
        scoreElement.textContent = game.score;
        livesElement.textContent = game.lives;
        levelElement.textContent = game.level;
        distanceElement.textContent = Math.floor(game.distance) + 'm';
    }
    
    // 事件监听器
    startBtn.addEventListener('click', initGame);
    restartBtn.addEventListener('click', initGame);
    nextLevelBtn.addEventListener('click', nextLevel);
    
    // 窗口大小调整
    window.addEventListener('resize', resizeCanvas);
    
    // 键盘控制支持
    document.addEventListener('keydown', (e) => {
        switch(e.key) {
            case 'ArrowLeft':
            case 'a':
            case 'A':
                controls.left = true;
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                controls.right = true;
                break;
            case 'ArrowUp':
            case 'w':
            case 'W':
                controls.up = true;
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                controls.down = true;
                break;
            case ' ':
                controls.jump = true;
                break;
            case 'Enter':
                controls.action = true;
                break;
            case 'Shift':
            case 'Control':
                controls.special = true;
                break;
        }
    });
    
    document.addEventListener('keyup', (e) => {
        switch(e.key) {
            case 'ArrowLeft':
            case 'a':
            case 'A':
                controls.left = false;
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                controls.right = false;
                break;
            case 'ArrowUp':
            case 'w':
            case 'W':
                controls.up = false;
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                controls.down = false;
                break;
            case ' ':
                controls.jump = false;
                break;
            case 'Enter':
                controls.action = false;
                break;
            case 'Shift':
            case 'Control':
                controls.special = false;
                break;
        }
    });
    
    // 初始UI更新和画布调整
    resizeCanvas();
    updateUI();
})();
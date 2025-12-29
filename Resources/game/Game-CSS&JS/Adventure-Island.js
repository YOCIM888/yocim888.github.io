// 获取Canvas元素和上下文
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 调整Canvas大小以适应屏幕
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    game.groundHeight = canvas.height * 0.1;
    player.y = canvas.height - game.groundHeight - player.height;
}

// 游戏状态变量
let game = {
    running: false,
    paused: false,
    score: 0,
    coins: 0,
    distance: 0,
    speed: 8,
    baseSpeed: 8,
    maxSpeed: 20,
    gameOver: false,
    lastTime: 0,
    obstacles: [],
    collectibles: [],
    enemies: [],
    powerUps: [],
    backgroundX: 0,
    groundHeight: 100,
    gravity: 0.6,
    jumpStrength: 16,
    scrollSpeed: 3,
    spawnTimer: 0,
    enemySpawnTimer: 0,
    powerUpSpawnTimer: 0,
    invincibleTimer: 0,
    speedBoostTimer: 0,
    difficulty: 1,
    difficultyTimer: 0,
    particles: []
};

// 玩家角色
const player = {
    x: 150,
    y: 0,
    width: 50,
    height: 70,
    velocityY: 0,
    velocityX: 0,
    isJumping: false,
    health: 100,
    maxHealth: 100,
    color: '#00ffea',
    trailColor: '#ff00ff',
    invincible: false,
    invincibleFlash: 0,
    trail: []
};

// 游戏控制按键状态
const keys = {
    ArrowLeft: false,
    ArrowRight: false,
    ArrowUp: false,
    KeyA: false,
    KeyD: false,
    KeyW: false,
    Space: false
};

// 获取UI元素
const scoreElement = document.getElementById('scoreValue');
const coinElement = document.getElementById('coinCount');
const distanceElement = document.getElementById('distanceValue');
const healthElement = document.getElementById('healthValue');
const healthBar = document.getElementById('healthBar');
const speedElement = document.getElementById('speedValue');
const gameStatusElement = document.getElementById('gameStatus');
const startButton = document.getElementById('startButton');
const desktopPauseButton = document.getElementById('desktopPauseButton');
const restartButton = document.getElementById('restartButton');
const gameOverScreen = document.getElementById('gameOverScreen');
const finalScoreElement = document.getElementById('finalScore');
const finalCoinsElement = document.getElementById('finalCoins');
const finalDistanceElement = document.getElementById('finalDistance');
const tutorial = document.getElementById('tutorial');

// 粒子系统
class Particle {
    constructor(x, y, color, velocity) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.velocity = velocity;
        this.size = Math.random() * 3 + 1;
        this.life = 1;
        this.decay = Math.random() * 0.02 + 0.01;
    }
    
    update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.life -= this.decay;
    }
    
    draw() {
        ctx.save();
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// 创建粒子效果
function createParticles(x, y, color, count) {
    for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 2 + 1;
        game.particles.push(new Particle(
            x, y,
            color,
            {
                x: Math.cos(angle) * speed,
                y: Math.sin(angle) * speed
            }
        ));
    }
}

// 初始化游戏
function initGame() {
    game.running = true;
    game.paused = false;
    game.gameOver = false;
    game.score = 0;
    game.coins = 0;
    game.distance = 0;
    game.speed = game.baseSpeed;
    game.obstacles = [];
    game.collectibles = [];
    game.enemies = [];
    game.powerUps = [];
    game.backgroundX = 0;
    game.spawnTimer = 0;
    game.enemySpawnTimer = 0;
    game.powerUpSpawnTimer = 0;
    game.invincibleTimer = 0;
    game.speedBoostTimer = 0;
    game.difficulty = 1;
    game.difficultyTimer = 0;
    game.particles = [];
    
    player.x = 150;
    player.y = canvas.height - game.groundHeight - player.height;
    player.velocityY = 0;
    player.velocityX = 0;
    player.isJumping = false;
    player.health = 100;
    player.invincible = false;
    player.invincibleFlash = 0;
    player.trail = [];
    
    updateUI();
    gameOverScreen.style.display = 'none';
    
    // 生成初始收集品
    for (let i = 0; i < 8; i++) {
        spawnCollectible();
    }
    
    // 显示教程3秒后消失
    tutorial.style.opacity = '1';
    tutorial.style.visibility = 'visible';
    setTimeout(() => {
        tutorial.style.opacity = '0';
        tutorial.style.visibility = 'hidden';
    }, 3000);
    
    // 开始游戏循环
    if (game.lastTime === 0) {
        game.lastTime = Date.now();
        requestAnimationFrame(gameLoop);
    }
}

// 生成赛博障碍物
function spawnObstacle() {
    const types = ['server', 'firewall', 'virus'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    const obstacle = {
        x: canvas.width + Math.random() * 200,
        y: canvas.height - game.groundHeight - (type === 'virus' ? 60 : 40),
        width: 60 + Math.random() * 60,
        height: type === 'virus' ? 40 : 50 + Math.random() * 30,
        type: type,
        color: type === 'server' ? '#0088ff' : type === 'firewall' ? '#ff0088' : '#00ff88',
        flash: 0
    };
    
    game.obstacles.push(obstacle);
}

// 生成数据核心（收集品）
function spawnCollectible() {
    const collectible = {
        x: canvas.width + Math.random() * 400,
        y: canvas.height - game.groundHeight - 80 - Math.random() * 300,
        radius: 15,
        collected: false,
        bounce: 0,
        bounceDirection: 1,
        rotation: 0
    };
    
    game.collectibles.push(collectible);
}

// 生成敌人（病毒/攻击程序）
function spawnEnemy() {
    const enemy = {
        x: canvas.width + Math.random() * 200,
        y: canvas.height - game.groundHeight - 50,
        width: 45,
        height: 45,
        speed: 3 + Math.random() * 3,
        type: Math.random() > 0.6 ? 'drone' : 'bot',
        color: '#ff0066',
        phase: Math.random() * Math.PI * 2
    };
    
    if (enemy.type === 'drone') {
        enemy.y = canvas.height - game.groundHeight - 120 - Math.random() * 200;
    }
    
    game.enemies.push(enemy);
}

// 生成增益物品
function spawnPowerUp() {
    const types = ['shield', 'boost', 'health'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    const powerUp = {
        x: canvas.width + Math.random() * 500,
        y: canvas.height - game.groundHeight - 80 - Math.random() * 250,
        width: 35,
        height: 35,
        type: type,
        color: type === 'shield' ? '#00ffea' : type === 'boost' ? '#ffaa00' : '#00ff88',
        rotation: 0
    };
    
    game.powerUps.push(powerUp);
}

// 绘制赛博背景
function drawBackground() {
    // 深空背景
    const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    bgGradient.addColorStop(0, '#000428');
    bgGradient.addColorStop(0.5, '#0a0a1a');
    bgGradient.addColorStop(1, '#1a0033');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 星空
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    for (let i = 0; i < 100; i++) {
        const x = (i * 50 + game.backgroundX * 0.3) % (canvas.width + 50);
        const y = (i * 37) % canvas.height;
        const size = Math.random() * 2;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // 数据流效果
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 20; i++) {
        const x = (i * 100 + game.backgroundX * 0.5) % (canvas.width + 100);
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    
    // 地面网格
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.2)';
    ctx.lineWidth = 2;
    const groundY = canvas.height - game.groundHeight;
    for (let x = 0; x < canvas.width; x += 50) {
        const offsetX = (x - game.backgroundX) % 50;
        ctx.beginPath();
        ctx.moveTo(offsetX, groundY);
        ctx.lineTo(offsetX, canvas.height);
        ctx.stroke();
    }
    
    // 地面
    const groundGradient = ctx.createLinearGradient(0, groundY, 0, canvas.height);
    groundGradient.addColorStop(0, 'rgba(0, 255, 255, 0.3)');
    groundGradient.addColorStop(1, 'rgba(0, 100, 255, 0.1)');
    ctx.fillStyle = groundGradient;
    ctx.fillRect(0, groundY, canvas.width, game.groundHeight);
    
    // 地面辉光
    ctx.fillStyle = 'rgba(0, 255, 255, 0.1)';
    ctx.fillRect(0, groundY - 5, canvas.width, 10);
}

// 绘制玩家轨迹
function drawTrail() {
    for (let i = 0; i < player.trail.length; i++) {
        const point = player.trail[i];
        const alpha = i / player.trail.length * 0.3;
        
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = player.trailColor;
        ctx.beginPath();
        ctx.arc(point.x, point.y, player.width / 2 * (i / player.trail.length), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// 更新玩家轨迹
function updateTrail() {
    player.trail.unshift({
        x: player.x + player.width / 2,
        y: player.y + player.height / 2
    });
    
    if (player.trail.length > 20) {
        player.trail.pop();
    }
}

// 绘制赛博玩家角色
function drawPlayer() {
    // 绘制轨迹
    drawTrail();
    
    // 无敌闪烁效果
    if (player.invincible && player.invincibleFlash % 8 < 4) {
        ctx.globalAlpha = 0.5;
    }
    
    const centerX = player.x + player.width / 2;
    const centerY = player.y + player.height / 2;
    
    // 身体
    const bodyGradient = ctx.createLinearGradient(player.x, player.y, player.x, player.y + player.height);
    bodyGradient.addColorStop(0, '#00ffea');
    bodyGradient.addColorStop(1, '#0088ff');
    ctx.fillStyle = bodyGradient;
    ctx.fillRect(player.x, player.y, player.width, player.height);
    
    // 身体边框
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(player.x, player.y, player.width, player.height);
    
    // 头部
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(player.x + 10, player.y + 5, player.width - 20, 20);
    
    // 显示器（眼睛）
    ctx.fillStyle = '#00ffea';
    ctx.fillRect(player.x + 15, player.y + 10, 8, 8);
    ctx.fillRect(player.x + player.width - 23, player.y + 10, 8, 8);
    
    // 能量核心
    ctx.fillStyle = '#ff00ff';
    ctx.beginPath();
    ctx.arc(centerX, player.y + 40, 10, 0, Math.PI * 2);
    ctx.fill();
    
    // 能量核心辉光
    ctx.shadowColor = '#ff00ff';
    ctx.shadowBlur = 20;
    ctx.fill();
    ctx.shadowBlur = 0;
    
    // 腿部能量
    ctx.fillStyle = '#00ffea';
    ctx.fillRect(player.x + 5, player.y + player.height, 12, 10);
    ctx.fillRect(player.x + player.width - 17, player.y + player.height, 12, 10);
    
    ctx.globalAlpha = 1.0;
    
    // 无敌护盾效果
    if (player.invincible) {
        ctx.strokeStyle = 'rgba(0, 255, 255, 0.5)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(centerX, centerY, Math.max(player.width, player.height) / 2 + 10, 0, Math.PI * 2);
        ctx.stroke();
        
        // 护盾能量点
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2 + Date.now() / 500;
            const shieldX = centerX + Math.cos(angle) * (Math.max(player.width, player.height) / 2 + 15);
            const shieldY = centerY + Math.sin(angle) * (Math.max(player.width, player.height) / 2 + 15);
            
            ctx.fillStyle = '#00ffea';
            ctx.beginPath();
            ctx.arc(shieldX, shieldY, 4, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

// 绘制赛博障碍物
function drawObstacles() {
    game.obstacles.forEach(obstacle => {
        obstacle.flash += 0.1;
        
        // 障碍物主体
        ctx.fillStyle = obstacle.color;
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        
        // 边框和辉光
        ctx.strokeStyle = obstacle.color;
        ctx.lineWidth = 2;
        ctx.strokeRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        
        // 闪烁效果
        if (Math.sin(obstacle.flash) > 0) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.fillRect(obstacle.x + 5, obstacle.y + 5, obstacle.width - 10, obstacle.height - 10);
        }
        
        // 文字标识
        ctx.fillStyle = 'white';
        ctx.font = 'bold 12px Courier New';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(
            obstacle.type.toUpperCase(),
            obstacle.x + obstacle.width / 2,
            obstacle.y + obstacle.height / 2
        );
        
        // 阴影
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(obstacle.x + 5, obstacle.y + obstacle.height, obstacle.width, 10);
    });
}

// 绘制数据核心
function drawCollectibles() {
    game.collectibles.forEach(collectible => {
        if (collectible.collected) return;
        
        collectible.bounce += 0.1 * collectible.bounceDirection;
        collectible.rotation += 0.05;
        
        if (collectible.bounce > 1 || collectible.bounce < -1) {
            collectible.bounceDirection *= -1;
        }
        
        const bounceOffset = Math.sin(collectible.bounce) * 10;
        
        ctx.save();
        ctx.translate(collectible.x, collectible.y + bounceOffset);
        ctx.rotate(collectible.rotation);
        
        // 数据核心
        const gradient = ctx.createRadialGradient(0, 0, 5, 0, 0, collectible.radius);
        gradient.addColorStop(0, '#FFEB3B');
        gradient.addColorStop(0.5, '#FFC107');
        gradient.addColorStop(1, '#FF9800');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, collectible.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // 数据核心细节
        ctx.fillStyle = '#FF9800';
        ctx.font = 'bold 14px Courier New';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('01', 0, 0);
        
        // 辉光
        ctx.shadowColor = '#FFC107';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(0, 0, collectible.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        
        ctx.restore();
    });
}

// 绘制赛博敌人
function drawEnemies() {
    game.enemies.forEach(enemy => {
        enemy.phase += 0.05;
        
        // 敌人主体
        const enemyGradient = ctx.createRadialGradient(
            enemy.x + enemy.width / 2,
            enemy.y + enemy.height / 2,
            0,
            enemy.x + enemy.width / 2,
            enemy.y + enemy.height / 2,
            enemy.width / 2
        );
        enemyGradient.addColorStop(0, '#ff0066');
        enemyGradient.addColorStop(1, '#cc0000');
        
        ctx.fillStyle = enemyGradient;
        ctx.beginPath();
        ctx.arc(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, enemy.width / 2, 0, Math.PI * 2);
        ctx.fill();
        
        // 敌人眼睛
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(enemy.x + enemy.width * 0.3, enemy.y + enemy.height * 0.4, 4, 0, Math.PI * 2);
        ctx.arc(enemy.x + enemy.width * 0.7, enemy.y + enemy.height * 0.4, 4, 0, Math.PI * 2);
        ctx.fill();
        
        // 眼睛发光
        ctx.fillStyle = '#ff0066';
        ctx.beginPath();
        ctx.arc(enemy.x + enemy.width * 0.3, enemy.y + enemy.height * 0.4, 2, 0, Math.PI * 2);
        ctx.arc(enemy.x + enemy.width * 0.7, enemy.y + enemy.height * 0.4, 2, 0, Math.PI * 2);
        ctx.fill();
        
        // 移动效果
        if (enemy.type === 'drone') {
            enemy.y += Math.sin(enemy.phase) * 2;
            
            // 无人机翼
            ctx.strokeStyle = '#ff0066';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(enemy.x - 10, enemy.y + enemy.height / 2);
            ctx.lineTo(enemy.x, enemy.y + enemy.height / 2);
            ctx.moveTo(enemy.x + enemy.width, enemy.y + enemy.height / 2);
            ctx.lineTo(enemy.x + enemy.width + 10, enemy.y + enemy.height / 2);
            ctx.stroke();
        }
        
        // 辉光
        ctx.shadowColor = '#ff0066';
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, enemy.width / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    });
}

// 绘制增益物品
function drawPowerUps() {
    game.powerUps.forEach(powerUp => {
        powerUp.rotation += 0.03;
        
        ctx.save();
        ctx.translate(powerUp.x + powerUp.width / 2, powerUp.y + powerUp.height / 2);
        ctx.rotate(powerUp.rotation);
        
        // 增益物品主体
        ctx.fillStyle = powerUp.color;
        ctx.fillRect(-powerUp.width / 2, -powerUp.height / 2, powerUp.width, powerUp.height);
        
        // 边框
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.strokeRect(-powerUp.width / 2, -powerUp.height / 2, powerUp.width, powerUp.height);
        
        // 图标
        ctx.fillStyle = 'white';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        if (powerUp.type === 'shield') {
            ctx.fillText('🛡️', 0, 0);
        } else if (powerUp.type === 'boost') {
            ctx.fillText('⚡', 0, 0);
        } else if (powerUp.type === 'health') {
            ctx.fillText('❤️', 0, 0);
        }
        
        // 辉光
        ctx.shadowColor = powerUp.color;
        ctx.shadowBlur = 20;
        ctx.fillRect(-powerUp.width / 2, -powerUp.height / 2, powerUp.width, powerUp.height);
        ctx.shadowBlur = 0;
        
        ctx.restore();
    });
}

// 绘制粒子效果
function drawParticles() {
    for (let i = game.particles.length - 1; i >= 0; i--) {
        const particle = game.particles[i];
        particle.update();
        particle.draw();
        
        if (particle.life <= 0) {
            game.particles.splice(i, 1);
        }
    }
}

// 更新UI
function updateUI() {
    scoreElement.textContent = game.score;
    coinElement.textContent = game.coins;
    distanceElement.textContent = Math.floor(game.distance);
    healthElement.textContent = `${Math.max(0, player.health)}%`;
    healthBar.style.width = `${player.health}%`;
    
    // 更新速度显示
    if (game.speedBoostTimer > 0) {
        speedElement.textContent = `超频 (${Math.ceil(game.speedBoostTimer/60)}秒)`;
        speedElement.style.color = '#ffaa00';
    } else {
        speedElement.textContent = '正常';
        speedElement.style.color = '#00ffea';
    }
    
    // 更新游戏状态显示
    if (game.gameOver) {
        gameStatusElement.textContent = '系统崩溃';
        gameStatusElement.style.color = '#ff0066';
    } else if (game.paused) {
        gameStatusElement.textContent = '已暂停';
        gameStatusElement.style.color = '#ffaa00';
    } else if (game.running) {
        gameStatusElement.textContent = '入侵中';
        gameStatusElement.style.color = '#00ff88';
    } else {
        gameStatusElement.textContent = '待机中';
        gameStatusElement.style.color = '#00ffea';
    }
}

// 碰撞检测
function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

// 处理碰撞
function handleCollisions() {
    // 检查与障碍物的碰撞
    game.obstacles.forEach(obstacle => {
        if (checkCollision(player, obstacle)) {
            if (!player.invincible) {
                // 增加伤害：从5增加到12
                player.health -= 12;
                player.invincible = true;
                player.invincibleFlash = 0;
                game.invincibleTimer = 45; // 0.75秒无敌时间
                
                // 创建碰撞粒子
                createParticles(
                    player.x + player.width / 2,
                    player.y + player.height / 2,
                    '#ff0000',
                    20
                );
                
                // 被击退
                player.velocityX = -8;
                player.velocityY = -8;
            }
        }
    });
    
    // 检查与敌人的碰撞
    game.enemies.forEach((enemy, index) => {
        if (checkCollision(player, enemy)) {
            if (!player.invincible) {
                // 增加伤害：从10增加到18
                player.health -= 18;
                player.invincible = true;
                player.invincibleFlash = 0;
                game.invincibleTimer = 45; // 0.75秒无敌时间
                
                // 创建碰撞粒子
                createParticles(
                    player.x + player.width / 2,
                    player.y + player.height / 2,
                    '#ff0066',
                    25
                );
                
                // 被击退
                player.velocityX = -10;
                player.velocityY = -10;
                
                // 移除敌人
                game.enemies.splice(index, 1);
                game.score += 75;
            }
        }
    });
    
    // 检查与数据核心的碰撞
    game.collectibles.forEach((collectible, index) => {
        if (!collectible.collected) {
            const playerCenterX = player.x + player.width / 2;
            const playerCenterY = player.y + player.height / 2;
            const distance = Math.sqrt(
                Math.pow(playerCenterX - collectible.x, 2) + 
                Math.pow(playerCenterY - collectible.y, 2)
            );
            
            if (distance < player.width / 2 + collectible.radius) {
                collectible.collected = true;
                game.coins++;
                game.score += 150;
                player.health = Math.min(player.maxHealth, player.health + 5);
                
                // 创建收集粒子
                createParticles(
                    collectible.x,
                    collectible.y,
                    '#FFC107',
                    15
                );
                
                setTimeout(() => {
                    const idx = game.collectibles.indexOf(collectible);
                    if (idx > -1) {
                        game.collectibles.splice(idx, 1);
                    }
                }, 100);
            }
        }
    });
    
    // 检查与增益物品的碰撞
    game.powerUps.forEach((powerUp, index) => {
        if (checkCollision(player, powerUp)) {
            // 创建收集粒子
            createParticles(
                powerUp.x + powerUp.width / 2,
                powerUp.y + powerUp.height / 2,
                powerUp.color,
                20
            );
            
            if (powerUp.type === 'health') {
                player.health = Math.min(player.maxHealth, player.health + 35);
                game.score += 75;
            } else if (powerUp.type === 'boost') {
                game.speedBoostTimer = 300; // 5秒加速
                game.speed = game.baseSpeed * 1.8;
                game.score += 150;
            } else if (powerUp.type === 'shield') {
                player.invincible = true;
                game.invincibleTimer = 180; // 3秒无敌
                game.score += 100;
            }
            
            game.powerUps.splice(index, 1);
        }
    });
    
    // 检查玩家是否掉出屏幕
    if (player.y > canvas.height) {
        player.health = 0;
    }
    
    // 检查游戏结束条件
    if (player.health <= 0) {
        player.health = 0;
        game.running = false;
        game.gameOver = true;
        showGameOver();
    }
}

// 显示游戏结束画面
function showGameOver() {
    finalScoreElement.textContent = game.score;
    finalCoinsElement.textContent = game.coins;
    finalDistanceElement.textContent = Math.floor(game.distance);
    gameOverScreen.style.display = 'block';
}

// 更新游戏对象位置
function updateGameObjects(deltaTime) {
    // 更新背景滚动
    game.backgroundX += game.scrollSpeed * game.difficulty;
    
    // 更新玩家位置
    player.y += player.velocityY;
    player.x += player.velocityX;
    
    // 重力
    player.velocityY += game.gravity;
    
    // 玩家水平移动（由虚拟摇杆或键盘控制）
    if (window.virtualJoystick && window.virtualJoystick.active) {
        player.velocityX = window.virtualJoystick.x * 10;
    } else {
        let moveSpeed = 8;
        if (keys.ArrowLeft || keys.KeyA) {
            player.velocityX = -moveSpeed;
        } else if (keys.ArrowRight || keys.KeyD) {
            player.velocityX = moveSpeed;
        } else {
            player.velocityX *= 0.7; // 减速
        }
    }
    
    // 跳跃（由虚拟按钮或键盘控制）
    if ((keys.ArrowUp || keys.KeyW || keys.Space || window.virtualJump) && 
        !player.isJumping && 
        player.y >= canvas.height - game.groundHeight - player.height) {
        player.velocityY = -game.jumpStrength;
        player.isJumping = true;
        
        // 创建跳跃粒子
        createParticles(
            player.x + player.width / 2,
            player.y + player.height,
            '#00ffea',
            10
        );
    }
    
    // 限制玩家在屏幕内
    player.x = Math.max(10, Math.min(canvas.width - player.width - 10, player.x));
    
    // 地面碰撞
    if (player.y > canvas.height - game.groundHeight - player.height) {
        player.y = canvas.height - game.groundHeight - player.height;
        player.velocityY = 0;
        player.isJumping = false;
    }
    
    // 更新轨迹
    updateTrail();
    
    // 更新障碍物位置
    game.obstacles.forEach((obstacle, index) => {
        obstacle.x -= game.speed * game.difficulty;
        
        if (obstacle.x < -obstacle.width) {
            game.obstacles.splice(index, 1);
        }
    });
    
    // 更新收集品位置
    game.collectibles.forEach((collectible, index) => {
        collectible.x -= game.speed * game.difficulty;
        
        if (collectible.x < -collectible.radius * 2) {
            game.collectibles.splice(index, 1);
        }
    });
    
    // 更新敌人位置
    game.enemies.forEach((enemy, index) => {
        enemy.x -= game.speed * game.difficulty;
        
        if (enemy.type === 'bot') {
            enemy.x -= enemy.speed;
        }
        
        if (enemy.x < -enemy.width) {
            game.enemies.splice(index, 1);
        }
    });
    
    // 更新增益物品位置
    game.powerUps.forEach((powerUp, index) => {
        powerUp.x -= game.speed * game.difficulty;
        
        if (powerUp.x < -powerUp.width) {
            game.powerUps.splice(index, 1);
        }
    });
    
    // 生成新对象
    game.spawnTimer += deltaTime;
    if (game.spawnTimer > 50) {
        if (Math.random() < 0.8) {
            spawnObstacle();
        }
        game.spawnTimer = 0;
    }
    
    game.enemySpawnTimer += deltaTime;
    if (game.enemySpawnTimer > 100) {
        if (Math.random() < 0.6) {
            spawnEnemy();
        }
        game.enemySpawnTimer = 0;
    }
    
    game.powerUpSpawnTimer += deltaTime;
    if (game.powerUpSpawnTimer > 250) {
        if (Math.random() < 0.4) {
            spawnPowerUp();
        }
        game.powerUpSpawnTimer = 0;
    }
    
    // 生成新收集品
    if (game.collectibles.length < 15) {
        spawnCollectible();
    }
    
    // 更新无敌状态
    if (player.invincible) {
        game.invincibleTimer -= deltaTime;
        player.invincibleFlash++;
        
        if (game.invincibleTimer <= 0) {
            player.invincible = false;
        }
    }
    
    // 更新加速状态
    if (game.speedBoostTimer > 0) {
        game.speedBoostTimer -= deltaTime;
        
        if (game.speedBoostTimer <= 0) {
            game.speed = game.baseSpeed;
        }
    }
    
    // 更新距离和难度
    game.distance += game.speed * game.difficulty * deltaTime / 80;
    
    // 每50米增加难度
    game.difficultyTimer += deltaTime;
    if (game.difficultyTimer > 500) {
        game.difficulty = Math.min(2.5, game.difficulty + 0.15);
        game.difficultyTimer = 0;
    }
}

// 游戏主循环
function gameLoop() {
    const currentTime = Date.now();
    const deltaTime = currentTime - game.lastTime;
    game.lastTime = currentTime;
    
    if (!game.paused && game.running && !game.gameOver) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        updateGameObjects(deltaTime / 16.67);
        handleCollisions();
        
        drawBackground();
        drawObstacles();
        drawCollectibles();
        drawEnemies();
        drawPowerUps();
        drawParticles();
        drawPlayer();
        
        updateUI();
    } else if (game.gameOver) {
        drawBackground();
        drawObstacles();
        drawCollectibles();
        drawEnemies();
        drawPowerUps();
        drawParticles();
        drawPlayer();
    }
    
    requestAnimationFrame(gameLoop);
}

// 事件监听器
window.addEventListener('keydown', (e) => {
    if (e.code in keys) {
        keys[e.code] = true;
    }
    
    if (e.code === 'KeyP') {
        togglePause();
    }
    
    if (e.code === 'KeyR') {
        initGame();
    }
});

window.addEventListener('keyup', (e) => {
    if (e.code in keys) {
        keys[e.code] = false;
    }
});

// 开始游戏按钮
startButton.addEventListener('click', () => {
    if (!game.running || game.gameOver) {
        initGame();
    }
});

// 桌面暂停按钮
desktopPauseButton.addEventListener('click', togglePause);

// 重新开始按钮
restartButton.addEventListener('click', initGame);

// 切换暂停状态
function togglePause() {
    if (game.running && !game.gameOver) {
        game.paused = !game.paused;
        desktopPauseButton.innerHTML = game.paused ? 
            '<span>继续</span>' : 
            '<span>暂停</span>';
    }
}

// 窗口大小调整
window.addEventListener('resize', resizeCanvas);

// 防止移动端页面滚动
document.addEventListener('touchmove', (e) => {
    if (game.running && !game.gameOver) {
        e.preventDefault();
    }
}, { passive: false });

// 初始化
resizeCanvas();
updateUI();

// 绘制初始静态画面
drawBackground();
drawPlayer();

// 添加一些初始元素用于展示
for (let i = 0; i < 5; i++) {
    const collectible = {
        x: 300 + i * 120,
        y: canvas.height - game.groundHeight - 150,
        radius: 15,
        collected: false,
        bounce: i * 0.5,
        bounceDirection: 1,
        rotation: 0
    };
    game.collectibles.push(collectible);
}

drawCollectibles();

console.log("赛博跑酷2077已加载！");
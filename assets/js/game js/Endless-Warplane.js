// ==================== 游戏配置 ====================
const CONFIG = {
    PLAYER_SPEED: 8,
    PLAYER_FIRE_RATE: 8,
    BULLET_SPEED: 15,
    ENEMY_SPAWN_RATE: 0.025,
    MAX_ENEMIES: 15,
    BOSS_LEVEL_INTERVAL: 5,
    
    // 技能冷却时间（帧数，60帧=1秒）
    MISSILE_COOLDOWN: 180,      // 3秒
    SHIELD_COOLDOWN: 300,       // 5秒
    LIGHTNING_COOLDOWN: 240,    // 4秒
    BOMB_COOLDOWN: 600,         // 10秒
    
    // 技能持续时间
    SHIELD_DURATION: 180,       // 3秒
    LIGHTNING_DURATION: 60,     // 1秒
    
    // 道具持续时间
    POWERUP_DURATION: 600,      // 10秒
    
    // 连击设置
    COMBO_TIMEOUT: 120,         // 2秒
    COMBO_MULTIPLIER: 1.5       // 连击分数加成
};

// ==================== 游戏状态 ====================
const gameState = {
    running: false,
    paused: false,
    gameOver: false,
    score: 0,
    lives: 5,
    level: 1,
    enemiesDestroyed: 0,
    maxCombo: 0,
    currentCombo: 0,
    comboTimer: 0,
    bossActive: false,
    bossLevel: 0,
    
    // 技能状态
    missileReady: true,
    missileCooldownTimer: 0,
    shieldActive: false,
    shieldCooldownTimer: 0,
    shieldDurationTimer: 0,
    lightningActive: false,
    lightningCooldownTimer: 0,
    lightningTargets: [],
    bombCount: 3,
    bombCooldownTimer: 0
};

// ==================== 获取DOM元素 ====================
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d', { alpha: false });

// 显示元素
const scoreElement = document.getElementById('score');
const livesElement = document.getElementById('lives');
const levelElement = document.getElementById('level');
const gameTitle = document.getElementById('gameTitle');
const gameOverScreen = document.getElementById('gameOverScreen');
const finalScoreElement = document.getElementById('finalScore');
const finalLevelElement = document.getElementById('finalLevel');
const enemiesDestroyedElement = document.getElementById('enemiesDestroyed');
const maxComboElement = document.getElementById('maxCombo');
const gradeDisplay = document.getElementById('gradeDisplay');
const restartBtn = document.getElementById('restartBtn');
const continueBtn = document.getElementById('continueBtn');
const pauseOverlay = document.getElementById('pauseOverlay');
const comboDisplay = document.getElementById('comboDisplay');
const comboCountElement = document.getElementById('comboCount');
const notification = document.getElementById('notification');
const bombsElement = document.getElementById('bombs');

// 技能冷却条
const missileCooldownBar = document.getElementById('missileCooldown');
const shieldCooldownBar = document.getElementById('shieldCooldown');
const lightningCooldownBar = document.getElementById('lightningCooldown');
const bombCooldownBar = document.getElementById('bombCooldown');

// 道具指示器
const powerupIndicator = document.getElementById('powerupIndicator');
const powerupIcon = document.getElementById('powerupIcon');
const powerupName = document.getElementById('powerupName');
const powerupTimerBar = document.getElementById('powerupTimerBar');

// Boss血条
const bossHealthContainer = document.getElementById('bossHealthContainer');
const bossNameElement = document.getElementById('bossName');
const bossHealthFill = document.getElementById('bossHealthFill');
const bossPhaseElement = document.getElementById('bossPhase');

// ==================== 游戏对象 ====================
const player = {
    x: 0,
    y: 0,
    width: 50,
    height: 70,
    speed: CONFIG.PLAYER_SPEED,
    color: '#00d4ff',
    fireRate: CONFIG.PLAYER_FIRE_RATE,
    fireCounter: 0,
    powerupType: null,
    powerupTime: 0,
    angle: 0,
    engineFlicker: 0,
    invincible: 0
};

// 游戏数组
const bullets = [];
const enemyBullets = [];
const enemies = [];
const powerups = [];
const explosions = [];
const particles = [];
const missiles = [];
const stars = [];
const floatingTexts = [];

// 按键状态
const keys = {
    ArrowLeft: false,
    ArrowRight: false,
    ArrowUp: false,
    ArrowDown: false,
    ' ': false,
    'p': false, 'P': false,
    'q': false, 'Q': false,
    'e': false, 'E': false,
    'r': false, 'R': false,
    'b': false, 'B': false
};

// 敌人类型配置
const ENEMY_TYPES = {
    normal: {
        width: 45, height: 55, speed: 2, health: 2, score: 50, color: '#9b59b6',
        fireRate: 120, bulletSpeed: 4, bulletColor: '#e74c3c'
    },
    fast: {
        width: 35, height: 40, speed: 4, health: 1, score: 100, color: '#f39c12',
        fireRate: 100, bulletSpeed: 6, bulletColor: '#e67e22'
    },
    heavy: {
        width: 60, height: 70, speed: 1, health: 8, score: 200, color: '#27ae60',
        fireRate: 150, bulletSpeed: 3, bulletColor: '#2ecc71', spread: 3
    },
    shooter: {
        width: 40, height: 50, speed: 1.5, health: 3, score: 150, color: '#e91e63',
        fireRate: 80, bulletSpeed: 7, bulletColor: '#f44336', pattern: 'aimed'
    },
    boss: {
        width: 180, height: 120, speed: 1, health: 100, score: 1000, color: '#1a1a2e',
        fireRate: 60, bulletSpeed: 5, bulletColor: '#ff0000', phases: 3
    }
};

// Boss配置
const BOSS_CONFIGS = {
    5: { name: '火焰领主', color: '#ff4444', phaseColors: ['#ff0000', '#ff6600', '#ffff00'] },
    10: { name: '雷霆之王', color: '#4444ff', phaseColors: ['#0000ff', '#00ffff', '#ffffff'] },
    15: { name: '虚空霸主', color: '#8800ff', phaseColors: ['#8800ff', '#ff00ff', '#00ff88'] },
    20: { name: '终焉之星', color: '#ffffff', phaseColors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00'] }
};

// ==================== 初始化函数 ====================

// 设置Canvas大小为全屏
function setupCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // 更新玩家位置
    player.x = canvas.width / 2 - player.width / 2;
    player.y = canvas.height - 120;
}

// 初始化星星背景
function initStars() {
    stars.length = 0;
    const starCount = Math.floor((canvas.width * canvas.height) / 8000);
    for (let i = 0; i < starCount; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2.5 + 0.5,
            speed: Math.random() * 2 + 0.5,
            brightness: Math.random() * 0.6 + 0.4,
            twinkle: Math.random() * Math.PI * 2,
            twinkleSpeed: Math.random() * 0.05 + 0.02
        });
    }
}

// 创建粒子效果
function createParticles(x, y, color, count, speedMultiplier = 1) {
    for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 / count) * i + Math.random() * 0.5;
        const speed = (Math.random() * 6 + 3) * speedMultiplier;
        particles.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: Math.random() * 5 + 2,
            color: color,
            life: 40 + Math.random() * 20,
            maxLife: 60
        });
    }
}

// 创建爆炸效果
function createExplosion(x, y, size, color1 = '#ff6600', color2 = '#ffff00') {
    explosions.push({
        x: x,
        y: y,
        size: size,
        maxSize: size * 2.5,
        life: 25,
        color1: color1,
        color2: color2
    });
    createParticles(x, y, color1, Math.floor(size / 2), 1.5);
    createParticles(x, y, color2, Math.floor(size / 3), 2);
}

// 创建浮动文字
function createFloatingText(x, y, text, color) {
    floatingTexts.push({
        x: x,
        y: y,
        text: text,
        color: color,
        life: 40,
        vy: -2
    });
}

// 显示通知
function showNotification(message, type = '') {
    notification.textContent = message;
    notification.className = 'notification active ' + type;
    setTimeout(() => {
        notification.classList.remove('active');
    }, 2000);
}

// 更新连击显示
function updateCombo() {
    gameState.currentCombo++;
    gameState.comboTimer = CONFIG.COMBO_TIMEOUT;
    
    if (gameState.currentCombo > gameState.maxCombo) {
        gameState.maxCombo = gameState.currentCombo;
    }
    
    comboCountElement.textContent = gameState.currentCombo;
    comboDisplay.classList.remove('active', 'high', 'max');
    
    void comboDisplay.offsetWidth; // 触发重绘
    
    if (gameState.currentCombo >= 20) {
        comboDisplay.classList.add('active', 'max');
    } else if (gameState.currentCombo >= 10) {
        comboDisplay.classList.add('active', 'high');
    } else {
        comboDisplay.classList.add('active');
    }
    
    setTimeout(() => {
        comboDisplay.classList.remove('active');
    }, 800);
}

// ==================== 绘制函数 ====================

// 绘制玩家战机
function drawPlayer() {
    ctx.save();
    ctx.translate(player.x + player.width / 2, player.y + player.height / 2);
    
    // 引擎喷射效果
    player.engineFlicker = (player.engineFlicker + 0.3) % (Math.PI * 2);
    const engineSize = 15 + Math.sin(player.engineFlicker) * 5;
    
    // 引擎火焰
    const gradient = ctx.createLinearGradient(0, player.height / 2, 0, player.height / 2 + engineSize * 2);
    gradient.addColorStop(0, '#00d4ff');
    gradient.addColorStop(0.5, '#00ff88');
    gradient.addColorStop(1, 'transparent');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(-8, player.height / 2 - 5);
    ctx.lineTo(0, player.height / 2 + engineSize * 2);
    ctx.lineTo(8, player.height / 2 - 5);
    ctx.closePath();
    ctx.fill();
    
    // 护盾效果
    if (gameState.shieldActive) {
        ctx.beginPath();
        ctx.arc(0, 0, Math.max(player.width, player.height) * 0.8, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 212, 255, ${0.5 + Math.sin(Date.now() / 100) * 0.3})`;
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.fillStyle = 'rgba(0, 212, 255, 0.1)';
        ctx.fill();
    }
    
    // 战机主体发光
    ctx.shadowColor = player.color;
    ctx.shadowBlur = 25;
    
    // 绘制战机机身
    ctx.fillStyle = player.color;
    ctx.beginPath();
    ctx.moveTo(0, -player.height / 2);
    ctx.lineTo(-player.width / 2, player.height / 3);
    ctx.lineTo(-player.width / 3, player.height / 2);
    ctx.lineTo(player.width / 3, player.height / 2);
    ctx.lineTo(player.width / 2, player.height / 3);
    ctx.closePath();
    ctx.fill();
    
    // 战机驾驶舱
    ctx.fillStyle = '#00ff88';
    ctx.shadowColor = '#00ff88';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.ellipse(0, -player.height / 6, player.width / 5, player.height / 10, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // 战机机翼线条
    ctx.strokeStyle = '#00aaff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-player.width / 3, player.height / 4);
    ctx.lineTo(-player.width / 2, player.height / 3);
    ctx.moveTo(player.width / 3, player.height / 4);
    ctx.lineTo(player.width / 2, player.height / 3);
    ctx.stroke();
    
    // 火力增强时的额外炮管
    if (player.powerupType === 'firepower') {
        ctx.shadowColor = '#ff6600';
        ctx.shadowBlur = 20;
        ctx.fillStyle = '#ff6600';
        ctx.fillRect(-player.width / 2 - 8, -player.height / 4, 8, 15);
        ctx.fillRect(player.width / 2, -player.height / 4, 8, 15);
    }
    
    ctx.restore();
}

// 绘制子弹
function drawBullets() {
    // 玩家子弹
    bullets.forEach(bullet => {
        ctx.save();
        ctx.translate(bullet.x + bullet.width / 2, bullet.y + bullet.height / 2);
        
        if (bullet.type === 'spread') {
            ctx.rotate(bullet.angle);
        }
        
        // 子弹发光
        ctx.shadowColor = bullet.color;
        ctx.shadowBlur = 20;
        
        // 子弹主体
        const gradient = ctx.createLinearGradient(0, 0, 0, bullet.height);
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(0.3, bullet.color);
        gradient.addColorStop(1, bullet.color);
        
        ctx.fillStyle = gradient;
        ctx.fillRect(-bullet.width / 2, -bullet.height / 2, bullet.width, bullet.height);
        
        // 子弹拖尾
        ctx.fillStyle = bullet.color;
        ctx.globalAlpha = 0.3;
        ctx.fillRect(-bullet.width / 2, bullet.height / 2, bullet.width, 15);
        
        ctx.restore();
    });
    
    // 敌人子弹
    enemyBullets.forEach(bullet => {
        ctx.save();
        ctx.translate(bullet.x, bullet.y);
        
        ctx.shadowColor = bullet.color;
        ctx.shadowBlur = 15;
        ctx.fillStyle = bullet.color;
        
        if (bullet.type === 'laser') {
            // 激光束
            ctx.fillRect(-3, -bullet.height / 2, 6, bullet.height);
            ctx.fillStyle = '#ffffff';
            ctx.globalAlpha = 0.8;
            ctx.fillRect(-1, -bullet.height / 2, 2, bullet.height);
        } else if (bullet.type === 'aimed') {
            // 追踪弹
            ctx.beginPath();
            ctx.arc(0, 0, bullet.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(0, 0, bullet.radius * 0.5, 0, Math.PI * 2);
            ctx.fill();
        } else if (bullet.type === 'spread') {
            // 扇形弹
            ctx.beginPath();
            ctx.arc(0, 0, bullet.radius, 0, Math.PI * 2);
            ctx.fill();
        } else {
            // 普通子弹
            ctx.beginPath();
            ctx.arc(0, 0, bullet.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(0, 0, bullet.radius * 0.4, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
    });
}

// 绘制敌机
function drawEnemies() {
    enemies.forEach(enemy => {
        ctx.save();
        ctx.translate(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2);
        
        const typeConfig = ENEMY_TYPES[enemy.type] || ENEMY_TYPES.normal;
        
        if (enemy.type === 'boss') {
            // Boss绘制
            const bossConfig = BOSS_CONFIGS[gameState.bossLevel] || BOSS_CONFIGS[5];
            const phase = Math.floor((1 - enemy.health / enemy.maxHealth) * bossConfig.phases);
            const phaseColor = bossConfig.phaseColors[Math.min(phase, bossConfig.phaseColors.length - 1)];
            
            ctx.shadowColor = phaseColor;
            ctx.shadowBlur = 40 + Math.sin(Date.now() / 200) * 20;
            
            // Boss主体
            ctx.fillStyle = bossConfig.color;
            ctx.fillRect(-enemy.width / 2, -enemy.height / 2, enemy.width, enemy.height);
            
            // Boss护甲
            ctx.fillStyle = phaseColor;
            ctx.fillRect(-enemy.width / 2 + 10, -enemy.height / 2 + 10, enemy.width - 20, enemy.height - 20);
            
            // Boss核心
            const coreGlow = 0.5 + Math.sin(Date.now() / 300) * 0.5;
            ctx.fillStyle = `rgba(255, 255, 255, ${coreGlow})`;
            ctx.beginPath();
            ctx.arc(0, 0, 20 + Math.sin(Date.now() / 200) * 10, 0, Math.PI * 2);
            ctx.fill();
            
        } else {
            // 普通敌机
            ctx.shadowColor = typeConfig.color;
            ctx.shadowBlur = 20;
            
            // 敌机主体
            ctx.fillStyle = typeConfig.color;
            ctx.fillRect(-enemy.width / 2, -enemy.height / 2, enemy.width, enemy.height);
            
            // 敌机细节
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(-enemy.width / 4, -enemy.height / 4, enemy.width / 2, enemy.height / 2);
        }
        
        // 受伤闪烁效果
        if (enemy.hitFlash > 0) {
            ctx.globalAlpha = Math.max(0.3, enemy.hitFlash / 10);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(-enemy.width / 2, -enemy.height / 2, enemy.width, enemy.height);
        }
        
        ctx.restore();
    });
}

// 绘制道具
function drawPowerups() {
    powerups.forEach(powerup => {
        ctx.save();
        ctx.translate(powerup.x, powerup.y);
        
        const icons = { firepower: '🔥', spread: '✨', life: '❤️', bomb: '💣', speed: '⚡', shield: '🛡️' };
        const colors = { firepower: '#ff6600', spread: '#00ff88', life: '#ff6b6b', bomb: '#ff00ff', speed: '#ffd93d', shield: '#00d4ff' };
        
        ctx.shadowColor = colors[powerup.type] || '#ffd93d';
        ctx.shadowBlur = 25;
        
        // 道具光晕
        ctx.fillStyle = `${colors[powerup.type]}40`;
        ctx.beginPath();
        ctx.arc(0, 0, powerup.radius * 2, 0, Math.PI * 2);
        ctx.fill();
        
        // 道具图标
        ctx.font = `${powerup.radius}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(icons[powerup.type] || '⭐', 0, 0);
        
        // 旋转效果
        ctx.rotate(powerup.angleOffset);
        
        ctx.restore();
    });
}

// 绘制爆炸效果
function drawExplosions() {
    explosions.forEach(explosion => {
        ctx.save();
        ctx.translate(explosion.x, explosion.y);
        
        const progress = 1 - (explosion.life / 25);
        const currentSize = explosion.size + (explosion.maxSize - explosion.size) * progress;
        
        // 外层火焰
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, currentSize);
        gradient.addColorStop(0, explosion.color2);
        gradient.addColorStop(0.5, explosion.color1);
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.globalAlpha = 1 - progress;
        ctx.beginPath();
        ctx.arc(0, 0, currentSize, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    });
}

// 绘制粒子效果
function drawParticles() {
    particles.forEach(particle => {
        ctx.save();
        ctx.translate(particle.x, particle.y);
        
        const alpha = particle.life / particle.maxLife;
        ctx.globalAlpha = alpha;
        
        ctx.shadowColor = particle.color;
        ctx.shadowBlur = 15;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(0, 0, particle.size * alpha, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    });
}

// 绘制浮动文字
function drawFloatingTexts() {
    floatingTexts.forEach(text => {
        ctx.save();
        ctx.translate(text.x, text.y);
        
        const alpha = text.life / 40;
        ctx.globalAlpha = alpha;
        
        ctx.font = 'bold 20px Arial';
        ctx.fillStyle = text.color;
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.textAlign = 'center';
        
        ctx.strokeText(text.text, 0, 0);
        ctx.fillText(text.text, 0, 0);
        
        ctx.restore();
    });
}

// 绘制星星
function drawStars() {
    stars.forEach(star => {
        ctx.save();
        ctx.translate(star.x, star.y);
        
        const twinkleAlpha = star.brightness * (0.7 + 0.3 * Math.sin(star.twinkle));
        ctx.globalAlpha = twinkleAlpha;
        
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = star.size > 1.5 ? 10 : 5;
        ctx.beginPath();
        ctx.arc(0, 0, star.size * 0.5, 0, Math.PI * 2);
        ctx.fill();
        
        // 星星光芒
        if (star.size > 1.5) {
            ctx.shadowColor = '#ffffff';
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size * 0.5, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
    });
}

// 绘制闪电效果
function drawLightning() {
    if (gameState.lightningActive && gameState.lightningTargets.length > 0) {
        ctx.save();
        ctx.strokeStyle = '#00d4ff';
        ctx.lineWidth = 4;
        ctx.shadowColor = '#00d4ff';
        ctx.shadowBlur = 30;
        ctx.globalAlpha = 0.8;
        
        gameState.lightningTargets.forEach(target => {
            // 绘制从天空到目标的闪电
            ctx.beginPath();
            ctx.moveTo(player.x + player.width / 2, 0);
            
            let currentY = 0;
            let currentX = player.x + player.width / 2;
            const targetY = target.y + target.height / 2;
            
            while (currentY < targetY) {
                currentY += 30;
                currentX += (Math.random() - 0.5) * 60;
                currentX = Math.max(0, Math.min(canvas.width, currentX));
                ctx.lineTo(currentX, currentY);
            }
            
            ctx.lineTo(target.x + target.width / 2, targetY);
            ctx.stroke();
            
            // 闪电分叉
            ctx.globalAlpha = 0.4;
            for (let i = 0; i < 3; i++) {
                const branchY = Math.random() * targetY;
                const branchX = player.x + player.width / 2 + (Math.random() - 0.5) * 100;
                
                ctx.beginPath();
                ctx.moveTo(branchX, branchY);
                ctx.lineTo(branchX + (Math.random() - 0.5) * 40, branchY + 50);
                ctx.stroke();
            }
        });
        
        ctx.restore();
    }
}

// ==================== 更新函数 ====================

// 更新星星
function updateStars() {
    stars.forEach(star => {
        star.y += star.speed * (1 + gameState.level * 0.1);
        star.twinkle += star.twinkleSpeed;
        
        if (star.y > canvas.height) {
            star.y = 0;
            star.x = Math.random() * canvas.width;
        }
    });
}

// 发射子弹
function shoot() {
    if (player.fireCounter <= 0) {
        const bulletSpeed = CONFIG.BULLET_SPEED;
        
        if (player.powerupType === 'firepower') {
            // 强化子弹 - 三发散射
            for (let i = -1; i <= 1; i++) {
                const angle = i * 0.15;
                bullets.push({
                    x: player.x + player.width / 2 - 4,
                    y: player.y - 10,
                    width: 12,
                    height: 25,
                    speed: bulletSpeed,
                    color: '#ff6600',
                    type: 'spread',
                    angle: angle,
                    vx: Math.sin(angle) * bulletSpeed * 0.3
                });
            }
        } else if (player.powerupType === 'spread') {
            // 扇形子弹
            for (let i = -2; i <= 2; i++) {
                const angle = i * 0.2;
                bullets.push({
                    x: player.x + player.width / 2 - 3,
                    y: player.y,
                    width: 8,
                    height: 20,
                    speed: bulletSpeed,
                    color: '#00ff88',
                    type: 'spread',
                    angle: angle,
                    vx: Math.sin(angle) * bulletSpeed * 0.4
                });
            }
        } else {
            // 普通子弹
            bullets.push({
                x: player.x + player.width / 2 - 5,
                y: player.y,
                width: 10,
                height: 20,
                speed: bulletSpeed,
                color: '#00d4ff',
                type: 'normal'
            });
        }
        
        player.fireCounter = player.fireRate;
        
        // 射击粒子效果
        createParticles(player.x + player.width / 2 - 5, player.y + 20, '#00d4ff', 5);
    }
}

// 使用追踪导弹
function useMissile() {
    if (gameState.missileCooldownTimer > 0) return;
    
    gameState.missileCooldownTimer = CONFIG.MISSILE_COOLDOWN;
    
    // 发射两枚追踪导弹
    for (let i = -1; i <= 1; i += 2) {
        missiles.push({
            x: player.x + player.width / 2 + i * 15,
            y: player.y,
            width: 20,
            height: 10,
            speed: 12,
            angle: -Math.PI / 2,
            target: null,
            damage: 5
        });
    }
    
    createParticles(player.x + player.width / 2, player.y, '#ff6600', 15);
    showNotification('追踪导弹发射！', 'success');
}

// 使用护盾
function useShield() {
    if (gameState.shieldCooldownTimer > 0 || gameState.shieldActive) return;
    
    gameState.shieldActive = true;
    gameState.shieldDurationTimer = CONFIG.SHIELD_DURATION;
    gameState.shieldCooldownTimer = CONFIG.SHIELD_COOLDOWN;
    
    showNotification('护盾激活！', 'success');
}

// 使用闪电技能
function useLightning() {
    if (gameState.lightningCooldownTimer > 0) return;
    
    gameState.lightningActive = true;
    gameState.lightningCooldownTimer = CONFIG.LIGHTNING_COOLDOWN;
    gameState.lightningTargets = [];
    
    // 选取多个目标
    const targets = enemies.slice(0, 5);
    targets.forEach(enemy => {
        enemy.health -= 3;
        enemy.hitFlash = 10;
        gameState.lightningTargets.push(enemy);
    });
    
    if (targets.length > 0) {
        showNotification('闪电风暴！', 'success');
        createParticles(player.x + player.width / 2, 0, '#00d4ff', 30);
        
        // 闪电结束后造成伤害并清除
        setTimeout(() => {
            gameState.lightningTargets.forEach(enemy => {
                if (enemies.includes(enemy)) {
                    if (enemy.health <= 0) {
                        destroyEnemy(enemy, true);
                    } else {
                        createFloatingText(enemy.x + enemy.width / 2, enemy.y, '-3', '#00d4ff');
                    }
                }
            });
            gameState.lightningActive = false;
            gameState.lightningTargets = [];
        }, CONFIG.LIGHTNING_DURATION * 16.67);
    }
}

// 使用炸弹
function useBomb() {
    if (gameState.bombCount <= 0) {
        showNotification('炸弹不足！', 'warning');
        return;
    }
    
    gameState.bombCount--;
    bombsElement.textContent = gameState.bombCount;
    
    // 清除所有敌机和子弹
    enemies.forEach(enemy => {
        createExplosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, enemy.width / 2);
        gameState.score += (enemy.type === 'boss' ? 500 : (enemy.type === 'heavy' ? 100 : 50));
        gameState.enemiesDestroyed++;
    });
    
    enemyBullets.length = 0;
    enemies.length = 0;
    
    // 大爆炸效果
    createExplosion(canvas.width / 2, canvas.height / 2, 150, '#ffff00', '#ff6600');
    createParticles(canvas.width / 2, canvas.height / 2, '#ffff00', 100, 2);
    createParticles(canvas.width / 2, canvas.height / 2, '#ff6600', 100, 2);
    
    // 屏幕震动效果
    canvas.style.transform = 'translateX(10px)';
    setTimeout(() => canvas.style.transform = 'translateX(-10px)', 50);
    setTimeout(() => canvas.style.transform = 'translateX(5px)', 100);
    setTimeout(() => canvas.style.transform = 'none', 150);
    
    gameState.bombCooldownTimer = CONFIG.BOMB_COOLDOWN;
    
    showNotification('全屏轰炸！', 'danger');
}

// 生成敌机
function spawnEnemy() {
    const level = gameState.level;
    let type;
    
    // 根据关卡和随机数选择敌机类型
    const rand = Math.random();
    if (level >= 3 && rand < 0.15) {
        type = 'heavy';
    } else if (level >= 2 && rand < 0.35) {
        type = 'shooter';
    } else if (rand < 0.5) {
        type = 'fast';
    } else {
        type = 'normal';
    }
    
    const config = ENEMY_TYPES[type];
    const healthMultiplier = 1 + (level - 1) * 0.1;
    
    enemies.push({
        x: Math.random() * (canvas.width - config.width),
        y: -config.height,
        width: config.width,
        height: config.height,
        speed: config.speed * (1 + level * 0.05),
        health: Math.ceil(config.health * healthMultiplier),
        maxHealth: Math.ceil(config.health * healthMultiplier),
        type: type,
        shootCounter: Math.floor(Math.random() * config.fireRate) + 50,
        fireRate: Math.max(30, config.fireRate - level * 5),
        hitFlash: 0,
        angle: Math.random() * Math.PI * 2
    });
}

// 生成Boss
function spawnBoss() {
    const bossLevel = Math.floor(gameState.level / 5);
    gameState.bossLevel = bossLevel * 5;
    const bossConfig = BOSS_CONFIGS[gameState.bossLevel] || BOSS_CONFIGS[5];
    const config = ENEMY_TYPES.boss;
    
    const healthMultiplier = 1 + (bossLevel - 1) * 0.5;
    
    enemies.push({
        x: canvas.width / 2 - config.width / 2,
        y: -config.height,
        width: config.width,
        height: config.height,
        speed: config.speed,
        health: Math.ceil(config.health * healthMultiplier),
        maxHealth: Math.ceil(config.health * healthMultiplier),
        type: 'boss',
        shootCounter: 30,
        fireRate: config.fireRate,
        name: bossConfig.name,
        phase: 0
    });
    
    gameState.bossActive = true;
    bossHealthContainer.classList.add('active');
    bossNameElement.textContent = bossConfig.name;
    
    showNotification(`警告：${bossConfig.name} 出现！`, 'danger');
}

// 生成道具
function spawnPowerup(x, y) {
    const powerupTypes = ['firepower', 'life', 'bomb', 'speed', 'shield'];
    const weights = [0.3, 0.2, 0.15, 0.2, 0.15];
    
    let random = Math.random();
    let type = 'firepower';
    let cumulative = 0;
    
    for (let i = 0; i < powerupTypes.length; i++) {
        cumulative += weights[i];
        if (random < cumulative) {
            type = powerupTypes[i];
            break;
        }
    }
    
    powerups.push({
        x: x,
        y: y,
        radius: 18,
        type: type,
        speed: 2,
        angleOffset: Math.random() * Math.PI * 2
    });
}

// 收集道具
function collectPowerup(powerup) {
    const type = powerup.type;
    let message = '';
    
    switch (type) {
        case 'firepower':
            player.powerupType = 'firepower';
            player.powerupTime = CONFIG.POWERUP_DURATION;
            message = '火力增强！';
            break;
        case 'spread':
            player.powerupType = 'spread';
            player.powerupTime = CONFIG.POWERUP_DURATION;
            message = '扇形攻击！';
            break;
        case 'life':
            gameState.lives = Math.min(gameState.lives + 1, 10);
            message = '生命+1';
            break;
        case 'bomb':
            gameState.bombCount = Math.min(gameState.bombCount + 1, 5);
            message = '炸弹+1';
            break;
        case 'speed':
            player.speed = CONFIG.PLAYER_SPEED * 1.5;
            player.powerupType = 'speed';
            player.powerupTime = CONFIG.POWERUP_DURATION;
            message = '速度提升！';
            break;
        case 'shield':
            gameState.shieldActive = true;
            gameState.shieldDurationTimer = CONFIG.SHIELD_DURATION;
            message = '护盾获得！';
            break;
    }
    
    // 更新显示
    updateLivesDisplay();
    updateBombsDisplay();
    
    // 更新道具指示器
    if (player.powerupType && (player.powerupType === 'firepower' || player.powerupType === 'spread' || player.powerupType === 'speed')) {
        const iconMap = { firepower: '🔥', spread: '✨', speed: '⚡' };
        const nameMap = { firepower: '火力增强', spread: '扇形攻击', speed: '速度提升' };
        powerupIcon.textContent = iconMap[player.powerupType];
        powerupName.textContent = nameMap[player.powerupType];
        powerupIndicator.classList.add('active');
    }
    
    createParticles(powerup.x, powerup.y, '#ffd93d', 20);
    createFloatingText(powerup.x, powerup.y - 20, message, '#00ff88');
    showNotification(message, 'success');
}

// 销毁敌机
function destroyEnemy(enemy, ignoreShield = false) {
    let points = 0;
    const typeConfig = ENEMY_TYPES[enemy.type] || ENEMY_TYPES.normal;
    
    // 计算连击加成
    const comboMultiplier = 1 + (gameState.currentCombo - 1) * 0.1;
    
    if (enemy.type === 'boss') {
        points = Math.floor(1000 * comboMultiplier);
        gameState.bossActive = false;
        bossHealthContainer.classList.remove('active');
        gameState.level++;
        levelElement.textContent = gameState.level;
        createExplosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 100, '#ff0000', '#ffff00');
        createFloatingText(canvas.width / 2, canvas.height / 2 - 50, 'BOSS击败!', '#ff0000');
    } else {
        points = Math.floor(typeConfig.score * comboMultiplier);
        createExplosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, enemy.width / 2);
        
        // 随机掉落道具
        if (Math.random() < 0.25 + gameState.level * 0.02) {
            spawnPowerup(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2);
        }
    }
    
    gameState.score += points;
    gameState.enemiesDestroyed++;
    scoreElement.textContent = gameState.score;
    updateCombo();
    
    createFloatingText(enemy.x + enemy.width / 2, enemy.y, '+' + points, '#ffd93d');
    
    const index = enemies.indexOf(enemy);
    if (index > -1) {
        enemies.splice(index, 1);
    }
}

// 玩家被击中
function playerHit() {
    if (gameState.shieldActive) {
        gameState.shieldActive = false;
        createParticles(player.x + player.width / 2, player.y + player.height / 2, '#00d4ff', 20);
        showNotification('护盾抵消伤害！', 'success');
        return;
    }
    
    gameState.lives--;
    updateLivesDisplay();
    
    createExplosion(player.x + player.width / 2, player.y + player.height / 2, 40, '#ff0000', '#ff6600');
    createParticles(player.x + player.width / 2, player.y + player.height / 2, '#ff0000', 30);
    
    // 重置连击
    gameState.currentCombo = 0;
    
    // 重置玩家位置
    player.x = canvas.width / 2 - player.width / 2;
    player.y = canvas.height - 120;
    
    if (gameState.lives <= 0) {
        gameOver();
    } else {
        // 无敌时间
        player.invincible = 120;
        showNotification('警告：生命值降低！', 'danger');
    }
}

// 更新显示
function updateLivesDisplay() {
    let hearts = '';
    for (let i = 0; i < gameState.lives; i++) {
        hearts += '❤';
    }
    livesElement.textContent = hearts;
}

function updateBombsDisplay() {
    bombsElement.textContent = gameState.bombCount;
}

// 更新游戏 - 优化版本，防止卡死
function update() {
    try {
        // 更新射击计数器
        if (player.fireCounter > 0) player.fireCounter--;
        
        // 更新玩家位置
        if (keys.ArrowLeft && player.x > 0) player.x -= player.speed;
        if (keys.ArrowRight && player.x < canvas.width - player.width) player.x += player.speed;
        if (keys.ArrowUp && player.y > 0) player.y -= player.speed;
        if (keys.ArrowDown && player.y < canvas.height - player.height) player.y += player.speed;
        
        // 处理射击
        if (keys[' '] && !gameState.paused) shoot();
        
        // 处理技能
        if ((keys['q'] || keys['Q']) && !gameState.paused) {
            useMissile();
            keys['q'] = false;
            keys['Q'] = false;
        }
        if ((keys['e'] || keys['E']) && !gameState.paused) {
            useShield();
            keys['e'] = false;
            keys['E'] = false;
        }
        if ((keys['r'] || keys['R']) && !gameState.paused) {
            useLightning();
            keys['r'] = false;
            keys['R'] = false;
        }
        if ((keys['b'] || keys['B']) && !gameState.paused) {
            useBomb();
            keys['b'] = false;
            keys['B'] = false;
        }
        
        // 更新技能冷却
        if (gameState.missileCooldownTimer > 0) {
            gameState.missileCooldownTimer--;
            missileCooldownBar.style.width = (gameState.missileCooldownTimer / CONFIG.MISSILE_COOLDOWN * 100) + '%';
            missileCooldownBar.classList.add('cooling');
        } else {
            missileCooldownBar.style.width = '100%';
            missileCooldownBar.classList.remove('cooling');
        }
        
        if (gameState.shieldCooldownTimer > 0) {
            gameState.shieldCooldownTimer--;
            shieldCooldownBar.style.width = (gameState.shieldCooldownTimer / CONFIG.SHIELD_COOLDOWN * 100) + '%';
            shieldCooldownBar.classList.add('cooling');
        } else {
            shieldCooldownBar.style.width = '100%';
            shieldCooldownBar.classList.remove('cooling');
        }
        
        if (gameState.lightningCooldownTimer > 0) {
            gameState.lightningCooldownTimer--;
            lightningCooldownBar.style.width = (gameState.lightningCooldownTimer / CONFIG.LIGHTNING_COOLDOWN * 100) + '%';
            lightningCooldownBar.classList.add('cooling');
        } else {
            lightningCooldownBar.style.width = '100%';
            lightningCooldownBar.classList.remove('cooling');
        }
        
        if (gameState.bombCooldownTimer > 0) {
            gameState.bombCooldownTimer--;
            bombCooldownBar.style.width = (gameState.bombCooldownTimer / CONFIG.BOMB_COOLDOWN * 100) + '%';
            bombCooldownBar.classList.add('cooling');
        } else {
            bombCooldownBar.style.width = '100%';
            bombCooldownBar.classList.remove('cooling');
        }
        
        // 更新护盾持续时间
        if (gameState.shieldActive) {
            gameState.shieldDurationTimer--;
            if (gameState.shieldDurationTimer <= 0) {
                gameState.shieldActive = false;
                showNotification('护盾消失', 'warning');
            }
        }
        
        // 更新连击计时器
        if (gameState.comboTimer > 0) {
            gameState.comboTimer--;
            if (gameState.comboTimer <= 0) {
                gameState.currentCombo = 0;
            }
        }
        
        // 更新道具时间
        if (player.powerupType === 'firepower' || player.powerupType === 'spread' || player.powerupType === 'speed') {
            player.powerupTime--;
            const percent = (player.powerupTime / CONFIG.POWERUP_DURATION) * 100;
            powerupTimerBar.style.width = percent + '%';
            
            if (player.powerupTime <= 0) {
                player.powerupType = null;
                player.speed = CONFIG.PLAYER_SPEED;
                powerupIndicator.classList.remove('active');
                showNotification('火力增强结束', 'warning');
            }
        }
        
        // 限制数组大小，防止内存泄漏
        if (bullets.length > 100) bullets.splice(0, bullets.length - 100);
        if (enemyBullets.length > 100) enemyBullets.splice(0, enemyBullets.length - 100);
        if (particles.length > 200) particles.splice(0, particles.length - 200);
        if (explosions.length > 20) explosions.splice(0, explosions.length - 20);
        if (floatingTexts.length > 20) floatingTexts.splice(0, floatingTexts.length - 20);
        
        // 更新子弹位置
        for (let i = bullets.length - 1; i >= 0; i--) {
            const bullet = bullets[i];
            bullet.y -= bullet.speed;
            if (bullet.type === 'spread') {
                bullet.x += bullet.vx || 0;
            }
            if (bullet.y < -bullet.height || bullet.x < 0 || bullet.x > canvas.width) {
                bullets.splice(i, 1);
            }
        }
        
        // 更新追踪导弹
        for (let i = missiles.length - 1; i >= 0; i--) {
            const missile = missiles[i];
            
            // 寻找最近的目标
            let closestEnemy = null;
            let closestDist = Infinity;
            
            enemies.forEach(enemy => {
                const dx = enemy.x + enemy.width / 2 - missile.x;
                const dy = enemy.y + enemy.height / 2 - missile.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < closestDist) {
                    closestDist = dist;
                    closestEnemy = enemy;
                }
            });
            
            // 计算角度并移动
            if (closestEnemy) {
                const targetX = closestEnemy.x + closestEnemy.width / 2;
                const targetY = closestEnemy.y + closestEnemy.height / 2;
                const targetAngle = Math.atan2(targetY - missile.y, targetX - missile.x);
                
                // 平滑转向
                let angleDiff = targetAngle - missile.angle;
                while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
                while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
                missile.angle += angleDiff * 0.1;
            } else {
                missile.angle = -Math.PI / 2;
            }
            
            missile.x += Math.cos(missile.angle) * missile.speed;
            missile.y += Math.sin(missile.angle) * missile.speed;
            
            // 检查是否超出屏幕
            if (missile.y < -50 || missile.x < -50 || missile.x > canvas.width + 50) {
                missiles.splice(i, 1);
            }
        }
        
        // 更新敌人子弹
        for (let i = enemyBullets.length - 1; i >= 0; i--) {
            const bullet = enemyBullets[i];
            
            if (bullet.type === 'aimed' && bullet.targetPlayer) {
                // 追踪玩家
                const angle = Math.atan2((player.y + player.height / 2) - bullet.y, (player.x + player.width / 2) - bullet.x);
                bullet.vx = Math.cos(angle) * bullet.speed;
                bullet.vy = Math.sin(angle) * bullet.speed;
            }
            
            bullet.x += bullet.vx || 0;
            bullet.y += bullet.vy || 0;
            
            if (bullet.y > canvas.height + 20 || bullet.y < -20 || bullet.x < -20 || bullet.x > canvas.width + 20) {
                enemyBullets.splice(i, 1);
            }
        }
        
        // 更新敌机
        for (let i = enemies.length - 1; i >= 0; i--) {
            const enemy = enemies[i];
            
            // 移动
            if (enemy.type === 'boss') {
                // Boss移动模式
                enemy.y += Math.sin(Date.now() / 1000) * 0.5;
                enemy.x += Math.cos(Date.now() / 800) * 1.5;
                
                // Boss血量阶段变化
                const healthPercent = enemy.health / enemy.maxHealth;
                if (healthPercent < 0.33 && enemy.phase < 2) {
                    enemy.phase = 2;
                    enemy.fireRate = 30;
                    showNotification('警告：Boss进入狂暴模式！', 'danger');
                } else if (healthPercent < 0.66 && enemy.phase < 1) {
                    enemy.phase = 1;
                    enemy.fireRate = 45;
                    showNotification('警告：Boss进入第二阶段！', 'warning');
                }
                
                bossHealthFill.style.width = (healthPercent * 100) + '%';
                bossPhaseElement.textContent = `Phase ${enemy.phase + 1}/3`;
                
            } else if (enemy.type === 'shooter') {
                // 射击敌机追踪玩家
                const dx = (player.x + player.width / 2) - (enemy.x + enemy.width / 2);
                enemy.x += dx * 0.01;
                enemy.y += enemy.speed * 0.5;
            } else {
                enemy.y += enemy.speed;
            }
            
            // 边界限制
            if (enemy.x < 0) enemy.x = 0;
            if (enemy.x > canvas.width - enemy.width) enemy.x = canvas.width - enemy.width;
            if (enemy.y < 50) enemy.y = 50;
            if (enemy.y > canvas.height) {
                enemies.splice(i, 1);
                continue;
            }
            
            // 敌机射击
            enemy.shootCounter--;
            if (enemy.shootCounter <= 0) {
                const config = ENEMY_TYPES[enemy.type] || ENEMY_TYPES.normal;
                
                if (enemy.type === 'boss') {
                    // Boss发射多种子弹
                    const patterns = ['spread', 'aimed', 'ring'];
                    const pattern = patterns[enemy.phase] || 'spread';
                    
                    if (pattern === 'spread') {
                        // 扇形弹
                        for (let angle = 0; angle < Math.PI; angle += Math.PI / 6) {
                            enemyBullets.push({
                                x: enemy.x + enemy.width / 2,
                                y: enemy.y + enemy.height / 2,
                                vx: Math.cos(angle) * config.bulletSpeed,
                                vy: Math.sin(angle) * config.bulletSpeed,
                                radius: 6,
                                color: config.bulletColor,
                                type: 'spread'
                            });
                        }
                    } else if (pattern === 'aimed') {
                        // 追踪弹
                        enemyBullets.push({
                            x: enemy.x + enemy.width / 2,
                            y: enemy.y + enemy.height / 2,
                            vx: 0,
                            vy: config.bulletSpeed,
                            radius: 10,
                            color: '#ff0000',
                            type: 'aimed',
                            targetPlayer: true
                        });
                    } else {
                        // 环形弹
                        for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 4) {
                            enemyBullets.push({
                                x: enemy.x + enemy.width / 2,
                                y: enemy.y + enemy.height / 2,
                                vx: Math.cos(angle) * config.bulletSpeed,
                                vy: Math.sin(angle) * config.bulletSpeed,
                                radius: 5,
                                color: config.bulletColor,
                                type: 'spread'
                            });
                        }
                    }
                    
                } else {
                    // 普通敌机射击
                    if (config.pattern === 'aimed') {
                        const angle = Math.atan2((player.y + player.height / 2) - (enemy.y + enemy.height), (player.x + player.width / 2) - (enemy.x + enemy.width / 2));
                        enemyBullets.push({
                            x: enemy.x + enemy.width / 2,
                            y: enemy.y + enemy.height,
                            vx: Math.cos(angle) * config.bulletSpeed,
                            vy: Math.sin(angle) * config.bulletSpeed,
                            radius: 6,
                            color: config.bulletColor,
                            type: 'aimed',
                            targetPlayer: true
                        });
                    } else {
                        enemyBullets.push({
                            x: enemy.x + enemy.width / 2,
                            y: enemy.y + enemy.height,
                            vx: 0,
                            vy: config.bulletSpeed,
                            radius: config.bulletSpeed > 5 ? 5 : 4,
                            color: config.bulletColor,
                            type: 'normal'
                        });
                        
                        // 重型敌机发射散射弹
                        if (config.spread > 1) {
                            for (let j = 1; j < config.spread; j++) {
                                enemyBullets.push({
                                    x: enemy.x + enemy.width / 2,
                                    y: enemy.y + enemy.height,
                                    vx: (Math.random() - 0.5) * 4,
                                    vy: config.bulletSpeed * 0.8,
                                    radius: 5,
                                    color: config.bulletColor,
                                    type: 'normal'
                                });
                            }
                        }
                    }
                }
                
                enemy.shootCounter = enemy.fireRate;
            }
            
            // 受伤闪烁减少
            if (enemy.hitFlash > 0) enemy.hitFlash--;
            
            // 检查被子弹击中
            for (let j = bullets.length - 1; j >= 0; j--) {
                const bullet = bullets[j];
                
                if (bullet.x < enemy.x + enemy.width &&
                    bullet.x + bullet.width > enemy.x &&
                    bullet.y < enemy.y + enemy.height &&
                    bullet.y + bullet.height > enemy.y) {
                    
                    enemy.health -= 1;
                    enemy.hitFlash = 10;
                    bullets.splice(j, 1);
                    createParticles(bullet.x, bullet.y, enemy.type === 'boss' ? '#ff0000' : '#ff6600', 5);
                    
                    if (enemy.health <= 0) {
                        destroyEnemy(enemy);
                    }
                    break;
                }
            }
            
            // 检查被导弹击中
            for (let j = missiles.length - 1; j >= 0; j--) {
                const missile = missiles[j];
                
                if (missile.x > enemy.x && missile.x < enemy.x + enemy.width &&
                    missile.y > enemy.y && missile.y < enemy.y + enemy.height) {
                    
                    enemy.health -= missile.damage;
                    enemy.hitFlash = 15;
                    missiles.splice(j, 1);
                    createExplosion(missile.x, missile.y, 30, '#ff6600', '#ffff00');
                    
                    if (enemy.health <= 0) {
                        destroyEnemy(enemy);
                    }
                    break;
                }
            }
        }
        
        // 更新道具
        for (let i = powerups.length - 1; i >= 0; i--) {
            const powerup = powerups[i];
            powerup.y += powerup.speed;
            powerup.angleOffset += 0.05;
            
            // 检测碰撞
            if (powerup.x < player.x + player.width &&
                powerup.x + powerup.radius * 2 > player.x &&
                powerup.y < player.y + player.height &&
                powerup.y + powerup.radius * 2 > player.y) {
                
                collectPowerup(powerup);
                powerups.splice(i, 1);
                continue;
            }
            
            if (powerup.y > canvas.height) {
                powerups.splice(i, 1);
            }
        }
        
        // 更新爆炸
        for (let i = explosions.length - 1; i >= 0; i--) {
            explosions[i].life--;
            if (explosions[i].life <= 0) explosions.splice(i, 1);
        }
        
        // 更新粒子
        for (let i = particles.length - 1; i >= 0; i--) {
            const particle = particles[i];
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vx *= 0.95;
            particle.vy *= 0.95;
            particle.life--;
            if (particle.life <= 0) particles.splice(i, 1);
        }
        
        // 更新浮动文字
        for (let i = floatingTexts.length - 1; i >= 0; i--) {
            floatingTexts[i].y += floatingTexts[i].vy;
            floatingTexts[i].life--;
            if (floatingTexts[i].life <= 0) floatingTexts.splice(i, 1);
        }
        
        // 检测玩家被子弹击中
        if (!player.invincible || player.invincible <= 0) {
            for (let i = enemyBullets.length - 1; i >= 0; i--) {
                const bullet = enemyBullets[i];
                const dx = bullet.x - (player.x + player.width / 2);
                const dy = bullet.y - (player.y + player.height / 2);
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < bullet.radius + Math.min(player.width, player.height) / 3) {
                    enemyBullets.splice(i, 1);
                    playerHit();
                    break;
                }
            }
            
            // 检测与敌机碰撞
            for (let i = enemies.length - 1; i >= 0; i--) {
                const enemy = enemies[i];
                
                if (player.x < enemy.x + enemy.width &&
                    player.x + player.width > enemy.x &&
                    player.y < enemy.y + enemy.height &&
                    player.y + player.height > enemy.y) {
                    
                    createExplosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, enemy.width / 2);
                    enemies.splice(i, 1);
                    playerHit();
                    break;
                }
            }
        }
        
        // 无敌时间减少
        if (player.invincible > 0) player.invincible--;
        
        // 更新星星
        updateStars();
        
        // 生成新敌机
        if (!gameState.paused && !gameState.gameOver) {
            const spawnRate = CONFIG.ENEMY_SPAWN_RATE + gameState.level * 0.002;
            if (Math.random() < spawnRate && enemies.length < CONFIG.MAX_ENEMIES + gameState.level) {
                spawnEnemy();
            }
            
            // Boss生成
            if (gameState.level % CONFIG.BOSS_LEVEL_INTERVAL === 0 && !gameState.bossActive && enemies.length === 0) {
                spawnBoss();
            }
        }
        
    } catch (error) {
        console.error('Game update error:', error);
        // 发生错误时暂停游戏
        gameState.paused = true;
        showNotification('游戏遇到错误，已暂停', 'danger');
    }
}

// 绘制游戏
function draw() {
    try {
        // 清除画布
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 绘制背景
        drawStars();
        
        // 绘制游戏对象
        drawBullets();
        drawLightning();
        drawEnemies();
        drawPowerups();
        drawMissiles();
        drawExplosions();
        drawParticles();
        drawFloatingTexts();
        
        // 玩家无敌闪烁
        if (!player.invincible || player.invincible % 10 < 5) {
            drawPlayer();
        }
        
    } catch (error) {
        console.error('Game draw error:', error);
    }
}

// 绘制导弹（辅助函数）
function drawMissiles() {
    missiles.forEach(missile => {
        ctx.save();
        ctx.translate(missile.x, missile.y);
        ctx.rotate(missile.angle);
        
        ctx.shadowColor = '#ff6600';
        ctx.shadowBlur = 25;
        
        ctx.fillStyle = '#ff6600';
        ctx.beginPath();
        ctx.moveTo(15, 0);
        ctx.lineTo(-10, -6);
        ctx.lineTo(-5, 0);
        ctx.lineTo(-10, 6);
        ctx.closePath();
        ctx.fill();
        
        ctx.fillStyle = '#ffff00';
        ctx.beginPath();
        ctx.moveTo(-5, 0);
        ctx.lineTo(-15, -3);
        ctx.lineTo(-20, 0);
        ctx.lineTo(-15, 3);
        ctx.closePath();
        ctx.fill();
        
        ctx.restore();
    });
}

// 游戏结束
function gameOver() {
    gameState.gameOver = true;
    gameState.running = false;
    
    // 计算评分
    let grade, gradeClass;
    const scorePerEnemy = gameState.score / Math.max(gameState.enemiesDestroyed, 1);
    
    if (gameState.score >= 50000 && gameState.enemiesDestroyed >= 500) {
        grade = 'S'; gradeClass = 'grade-s';
    } else if (gameState.score >= 20000 && gameState.enemiesDestroyed >= 200) {
        grade = 'A'; gradeClass = 'grade-a';
    } else if (gameState.score >= 10000 && gameState.enemiesDestroyed >= 100) {
        grade = 'B'; gradeClass = 'grade-b';
    } else {
        grade = 'C'; gradeClass = 'grade-c';
    }
    
    finalScoreElement.textContent = gameState.score;
    finalLevelElement.textContent = gameState.level;
    enemiesDestroyedElement.textContent = gameState.enemiesDestroyed;
    maxComboElement.textContent = gameState.maxCombo;
    
    gradeDisplay.textContent = grade;
    gradeDisplay.className = 'grade-display ' + gradeClass;
    
    gameOverScreen.classList.add('active');
}

// 重新开始
function restartGame() {
    // 重置游戏状态
    gameState.running = true;
    gameState.paused = false;
    gameState.gameOver = false;
    gameState.score = 0;
    gameState.lives = 5;
    gameState.level = 1;
    gameState.enemiesDestroyed = 0;
    gameState.maxCombo = 0;
    gameState.currentCombo = 0;
    gameState.comboTimer = 0;
    gameState.bossActive = false;
    gameState.bossLevel = 0;
    
    // 技能状态
    gameState.missileCooldownTimer = 0;
    gameState.shieldActive = false;
    gameState.shieldCooldownTimer = 0;
    gameState.shieldDurationTimer = 0;
    gameState.lightningActive = false;
    gameState.lightningCooldownTimer = 0;
    gameState.bombCount = 3;
    gameState.bombCooldownTimer = 0;
    
    // 重置玩家
    player.x = canvas.width / 2 - player.width / 2;
    player.y = canvas.height - 120;
    player.powerupType = null;
    player.powerupTime = 0;
    player.speed = CONFIG.PLAYER_SPEED;
    player.invincible = 0;
    
    // 清空数组
    bullets.length = 0;
    enemyBullets.length = 0;
    enemies.length = 0;
    powerups.length = 0;
    explosions.length = 0;
    particles.length = 0;
    missiles.length = 0;
    floatingTexts.length = 0;
    
    // 更新UI
    scoreElement.textContent = '0';
    updateLivesDisplay();
    levelElement.textContent = '1';
    updateBombsDisplay();
    
    gameOverScreen.classList.remove('active');
    powerupIndicator.classList.remove('active');
    bossHealthContainer.classList.remove('active');
    gameTitle.classList.add('hidden');
    pauseOverlay.classList.remove('active');
    
    // 初始化星星
    initStars();
}

// 游戏循环 - 优化版本，防止卡死
function gameLoop() {
    try {
        if (!gameState.paused && !gameState.gameOver && gameState.running) {
            update();
        }
        
        draw();
        
        // 使用requestAnimationFrame并添加错误处理
        requestAnimationFrame(gameLoop);
    } catch (error) {
        console.error('Game loop error:', error);
        // 发生错误时重新启动循环
        setTimeout(gameLoop, 100);
    }
}

// ==================== 事件监听 ====================

// 键盘按下
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

// 键盘释放
window.addEventListener('keyup', (e) => {
    if (e.key in keys) {
        keys[e.key] = false;
    }
});

// 开始游戏
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !gameState.running) {
        gameState.running = true;
        restartGame();
    }
});

// 重新开始按钮
restartBtn.addEventListener('click', restartGame);

// 窗口大小改变时重新设置Canvas
window.addEventListener('resize', () => {
    setupCanvas();
    initStars();
});

// 页面加载完成后初始化
window.addEventListener('load', () => {
    setupCanvas();
    initStars();
    gameLoop();
    gameTitle.classList.remove('hidden');
});

// 页面可见性改变时暂停/恢复游戏
document.addEventListener('visibilitychange', () => {
    if (document.hidden && gameState.running && !gameState.gameOver) {
        gameState.paused = true;
        pauseOverlay.classList.add('active');
    }
});

// 全局错误处理
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
    showNotification('游戏发生错误，请刷新页面', 'danger');
});

// 未处理的Promise错误
window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    showNotification('游戏发生错误，请刷新页面', 'danger');
});

// ==================== 操作说明自动隐藏 ====================

// 显示操作说明并自动隐藏
function showInstructions() {
    const instructions = document.getElementById('instructions');
    if (!instructions) return;
    
    // 移除之前的类
    instructions.classList.remove('show', 'hiding');
    
    // 强制重绘
    void instructions.offsetWidth;
    
    // 显示操作说明
    instructions.classList.add('show');
    
    // 2秒后开始淡出
    setTimeout(() => {
        instructions.classList.add('hiding');
        
        // 淡出动画结束后完全隐藏
        setTimeout(() => {
            instructions.classList.remove('show', 'hiding');
        }, 500); // 匹配CSS中的过渡时间
    }, 2000);
}

// 修改游戏开始函数，添加操作说明显示
function startGame() {
    gameState.running = true;
    restartGame();
    showInstructions();
}

// 修改重新开始函数中的显示逻辑
function restartGame() {
    // ... 现有的重新开始代码 ...
    
    // 不要在这里自动显示操作说明
    // 2秒后显示一次操作说明
    setTimeout(showInstructions, 500);
}

// 修改按键开始游戏的处理
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !gameState.running) {
        startGame();
    }
});

// 修改移动端开始按钮的处理（如果有的话）
// 在虚拟控制JS中，修改开始游戏的逻辑
function initStartButton() {
    let startButton = document.getElementById('mobileStartBtn');
    
    if (startButton) {
        startButton.addEventListener('touchstart', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            if (!gameState.running) {
                startGame();
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
                startGame();
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

// 在游戏初始化时显示一次操作说明
window.addEventListener('load', () => {
    setupCanvas();
    initStars();
    gameLoop();
    gameTitle.classList.remove('hidden');
    
    // 页面加载后显示一次操作说明
    setTimeout(showInstructions, 1000);
});

// 暂停/恢复游戏时，如果游戏在进行中，重新显示操作说明
function togglePause() {
    gameState.paused = !gameState.paused;
    pauseOverlay.classList.toggle('active', gameState.paused);
    
    // 如果从暂停状态恢复，显示操作说明
    if (!gameState.paused && gameState.running) {
        showInstructions();
    }
}

// 修改暂停按键处理
window.addEventListener('keydown', (e) => {
    if ((e.key === 'p' || e.key === 'P') && gameState.running && !gameState.gameOver) {
        togglePause();
    }
});

// 页面可见性变化时也显示操作说明
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && gameState.running && !gameState.gameOver && !gameState.paused) {
        setTimeout(showInstructions, 300);
    }
});
/**
 * CONTRA - 魂斗罗 Web复刻版
 * 游戏主逻辑脚本
 * contra.js
 * 
 * 功能：
 * - 游戏引擎核心
 * - 8个关卡系统
 * - 玩家、敌人、BOSS管理
 * - 物理引擎和碰撞检测
 * - 输入系统（键盘+触摸）
 */

// ============================================================================
// 游戏常量定义
// ============================================================================

const GAME_CONFIG = {
    // 逻辑分辨率（放大后的分辨率，提供更宽广的视野）
    LOGICAL_WIDTH: 480,
    LOGICAL_HEIGHT: 360,
    
    // 物理常量
    GRAVITY: 0.5,
    PLAYER_SPEED: 5,
    PLAYER_JUMP_FORCE: -13,
    PLAYER_MAX_JUMPS: 2,
    BULLET_SPEED: 14,
    
    // 游戏设置
    START_LIVES: 3,
    CONTINUE_CHANCE: 5,
    INVINCIBLE_TIME: 120, // 帧数（约2秒）
    
    // 缩放比例
    SCALE: 2
};

// 关卡配置
const LEVEL_CONFIG = [
    {
        id: 1,
        name: 'JUNGLE BASE',
        nameCN: '丛林基地',
        length: 3200,
        bgColor: '#000',
        groundColor: '#2e8b57',
        platformColor: '#6b8e23',
        enemyTypes: ['soldier', 'runner'],
        bossType: 'wallFortress',
        scrollType: 'horizontal'
    },
    {
        id: 2,
        name: 'BASE INSIDE',
        nameCN: '基地内部',
        length: 2800,
        bgColor: '#0a0a20',
        groundColor: '#4a4a6a',
        platformColor: '#6a6a8a',
        enemyTypes: ['soldier', 'sniper'],
        bossType: 'reactorCore',
        scrollType: 'horizontal'
    },
    {
        id: 3,
        name: 'WATERFALL',
        nameCN: '瀑布',
        length: 3000,
        bgColor: '#001a33',
        groundColor: '#1a4a6a',
        platformColor: '#2a6a8a',
        enemyTypes: ['swimmer', 'rock'],
        bossType: 'alienBeast',
        scrollType: 'vertical'
    },
    {
        id: 4,
        name: 'BASE INSIDE 2',
        nameCN: '基地内部2',
        length: 3000,
        bgColor: '#1a1a00',
        groundColor: '#6a5a3a',
        platformColor: '#8a7a5a',
        enemyTypes: ['soldier', 'grenadier'],
        bossType: 'hologramSystem',
        scrollType: 'horizontal'
    },
    {
        id: 5,
        name: 'SNOW FIELD',
        nameCN: '雪地',
        length: 3400,
        bgColor: '#1a2a3a',
        groundColor: '#e8e8f0',
        platformColor: '#a0b0c0',
        enemyTypes: ['snowSoldier', 'tank'],
        bossType: 'hoverCraft',
        scrollType: 'horizontal'
    },
    {
        id: 6,
        name: 'ENERGY ZONE',
        nameCN: '能源区',
        length: 3000,
        bgColor: '#2a0a0a',
        groundColor: '#4a2a2a',
        platformColor: '#6a4a4a',
        enemyTypes: ['laserSoldier', 'flameGuard'],
        bossType: 'giantSoldier',
        scrollType: 'horizontal'
    },
    {
        id: 7,
        name: 'ALIEN NEST',
        nameCN: '外星巢穴',
        length: 3200,
        bgColor: '#0a1a0a',
        groundColor: '#2a4a2a',
        platformColor: '#4a6a4a',
        enemyTypes: ['alienBug', 'egg'],
        bossType: 'gateKeeper',
        scrollType: 'horizontal'
    },
    {
        id: 8,
        name: 'ALIEN HEART',
        nameCN: '异形心脏',
        length: 2000,
        bgColor: '#1a0a1a',
        groundColor: '#4a2a4a',
        platformColor: '#6a4a6a',
        enemyTypes: ['faceHugger', 'alienQueen'],
        bossType: 'alienHeart',
        scrollType: 'horizontal'
    }
];

// 武器配置
const WEAPON_CONFIG = {
    normal: { name: 'RIFLE', fireRate: 12, bulletCount: 1, spread: 0, speed: GAME_CONFIG.BULLET_SPEED },
    machine: { name: 'MACHINE', fireRate: 5, bulletCount: 1, spread: 0, speed: GAME_CONFIG.BULLET_SPEED * 1.2 },
    spread: { name: 'SPREAD', fireRate: 15, bulletCount: 5, spread: Math.PI / 6, speed: GAME_CONFIG.BULLET_SPEED },
    laser: { name: 'LASER', fireRate: 10, bulletCount: 1, spread: 0, speed: GAME_CONFIG.BULLET_SPEED * 1.5 }
};

// ============================================================================
// 游戏引擎类
// ============================================================================

class ContraGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // 游戏状态
        this.gameState = 'start'; // start, playing, levelClear, gameOver, continue
        this.currentLevel = 0;
        this.score = 0;
        this.highScore = parseInt(localStorage.getItem('contraHighScore')) || 0;
        this.lives = GAME_CONFIG.START_LIVES;
        
        // 游戏对象
        this.player = null;
        this.bullets = [];
        this.enemies = [];
        this.powerups = [];
        this.explosions = [];
        this.platforms = [];
        this.boss = null;
        
        // 摄像机
        this.camera = { x: 0, y: 0 };
        this.targetCamera = { x: 0, y: 0 };
        
        // 关卡数据
        this.levelData = null;
        this.levelProgress = 0;
        this.spawnTimer = 0;
        
        // 输入状态
        this.keys = { left: false, right: false, up: false, down: false, jump: false, shoot: false, enter: false };
        this.keysPressed = {};
        
        // 音效状态
        this.soundEnabled = true;
        
        // 调试模式
        this.debugMode = false;
        
        // 初始化
        this.init();
    }

    /**
     * 初始化游戏
     */
    init() {
        this.setupCanvas();
        this.bindEvents();
        this.resizeCanvas();
        
        // 启动游戏循环
        this.lastTime = performance.now();
        this.gameLoop();
        
        console.log('Contra游戏引擎初始化完成');
    }

    /**
     * 设置Canvas
     */
    setupCanvas() {
        this.canvas.width = GAME_CONFIG.LOGICAL_WIDTH;
        this.canvas.height = GAME_CONFIG.LOGICAL_HEIGHT;
        
        // 启用图像平滑（像素风格）
        this.ctx.imageSmoothingEnabled = false;
    }

    /**
     * 调整Canvas大小（响应式）
     */
    resizeCanvas() {
        const container = document.getElementById('game-container');
        const containerWidth = window.innerWidth;
        const containerHeight = window.innerHeight;
        
        // 计算最佳缩放比例
        const scaleX = containerWidth / GAME_CONFIG.LOGICAL_WIDTH;
        const scaleY = containerHeight / GAME_CONFIG.LOGICAL_HEIGHT;
        const scale = Math.min(scaleX, scaleY);
        
        // 应用缩放
        this.canvas.style.width = `${GAME_CONFIG.LOGICAL_WIDTH * scale}px`;
        this.canvas.style.height = `${GAME_CONFIG.LOGICAL_HEIGHT * scale}px`;
        
        this.scale = scale;
    }

    /**
     * 绑定事件监听
     */
    bindEvents() {
        // 键盘事件
        window.addEventListener('keydown', (e) => this.handleKeyDown(e));
        window.addEventListener('keyup', (e) => this.handleKeyUp(e));
        
        // 窗口大小改变
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    /**
     * 处理键盘按下
     */
    handleKeyDown(e) {
        switch(e.code) {
            case 'ArrowLeft': this.keys.left = true; break;
            case 'ArrowRight': this.keys.right = true; break;
            case 'ArrowUp': this.keys.up = true; break;
            case 'ArrowDown': this.keys.down = true; break;
            case 'KeyZ': 
                if (!this.keysPressed['jump']) {
                    this.keys.jump = true;
                    this.keysPressed['jump'] = true;
                }
                break;
            case 'KeyX': 
                if (!this.keysPressed['shoot']) {
                    this.keys.shoot = true;
                    this.keysPressed['shoot'] = true;
                }
                break;
            case 'Enter':
                if (!this.keysPressed['enter']) {
                    this.keys.enter = true;
                    this.keysPressed['enter'] = true;
                    this.handleEnter();
                }
                break;
        }
        
        // 阻止默认行为
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
            e.preventDefault();
        }
    }

    /**
     * 处理键盘释放
     */
    handleKeyUp(e) {
        switch(e.code) {
            case 'ArrowLeft': this.keys.left = false; break;
            case 'ArrowRight': this.keys.right = false; break;
            case 'ArrowUp': this.keys.up = false; break;
            case 'ArrowDown': this.keys.down = false; break;
            case 'KeyZ': 
                this.keys.jump = false; 
                this.keysPressed['jump'] = false;
                break;
            case 'KeyX': 
                this.keys.shoot = false; 
                this.keysPressed['shoot'] = false;
                break;
            case 'Enter': 
                this.keys.enter = false;
                this.keysPressed['enter'] = false;
                break;
        }
    }

    /**
     * 处理回车键
     */
    handleEnter() {
        switch(this.gameState) {
            case 'start':
                this.startGame();
                break;
            case 'gameOver':
                this.restartGame();
                break;
            case 'levelClear':
                this.nextLevel();
                break;
            case 'continue':
                this.continueGame();
                break;
        }
    }

    /**
     * 开始游戏
     */
    startGame() {
        this.score = 0;
        this.lives = GAME_CONFIG.START_LIVES;
        this.currentLevel = 0;
        
        this.hideAllOverlays();
        document.getElementById('game-hud').classList.remove('hidden');
        
        this.loadLevel(0);
        this.gameState = 'playing';
    }

    /**
     * 重新开始游戏
     */
    restartGame() {
        this.startGame();
    }

    /**
     * 继续游戏
     */
    continueGame() {
        this.lives = 2;
        this.gameState = 'playing';
        this.hideAllOverlays();
        
        // 重置玩家位置
        this.player.x = this.camera.x + 50;
        this.player.y = 100;
        this.player.vy = 0;
        this.player.isInvincible = true;
        this.player.invincibleTimer = GAME_CONFIG.INVINCIBLE_TIME;
    }

    /**
     * 下一关
     */
    nextLevel() {
        this.currentLevel++;
        
        if (this.currentLevel >= LEVEL_CONFIG.length) {
            // 游戏通关
            this.showVictory();
            return;
        }
        
        this.hideAllOverlays();
        this.loadLevel(this.currentLevel);
        this.gameState = 'playing';
    }

    /**
     * 加载关卡
     */
    loadLevel(levelIndex) {
        this.levelData = LEVEL_CONFIG[levelIndex];
        this.levelProgress = 0;
        this.spawnTimer = 0;
        
        // 重置游戏对象
        this.bullets = [];
        this.enemies = [];
        this.powerups = [];
        this.explosions = [];
        
        // 创建玩家
        this.player = new Player(50, 150);
        
        // 创建平台
        this.generatePlatforms();
        
        // 创建BOSS
        this.createBoss();
        
        // 重置摄像机
        this.camera.x = 0;
        this.camera.y = 0;
        this.targetCamera.x = 0;
        this.targetCamera.y = 0;
        
        // 更新UI
        this.updateHUD();
        
        console.log(`关卡 ${levelIndex + 1}: ${this.levelData.name} 已加载`);
    }

    /**
     * 生成平台
     */
    generatePlatforms() {
        this.platforms = [];
        const level = this.levelData;
        const groundY = GAME_CONFIG.LOGICAL_HEIGHT - 32;
        
        // 根据关卡类型生成不同平台
        if (level.scrollType === 'horizontal') {
            // 水平卷轴关卡
            let x = 200;
            while (x < level.length - 400) {
                const platformWidth = 80 + Math.random() * 100;
                const platformY = groundY - 50 - Math.random() * 120;
                
                this.platforms.push({
                    x: x,
                    y: platformY,
                    width: platformWidth,
                    height: 16,
                    type: 'normal'
                });
                
                x += platformWidth + 100 + Math.random() * 150;
            }
            
            // 继续生成普通平台（避开BOSS区域）
            while (x < level.length - 800) {
                const platformWidth = 80 + Math.random() * 100;
                const platformY = groundY - 50 - Math.random() * 120;
                
                this.platforms.push({
                    x: x,
                    y: platformY,
                    width: platformWidth,
                    height: 16,
                    type: 'normal'
                });
                
                x += platformWidth + 100 + Math.random() * 150;
            }
        } else if (level.scrollType === 'vertical') {
            // 垂直卷轴关卡（瀑布）
            let y = GAME_CONFIG.LOGICAL_HEIGHT - 200;
            while (y > -level.length + 500) {
                const platformWidth = 60 + Math.random() * 80;
                const platformX = 30 + Math.random() * (GAME_CONFIG.LOGICAL_WIDTH - platformWidth - 60);
                
                this.platforms.push({
                    x: platformX,
                    y: y,
                    width: platformWidth,
                    height: 16,
                    type: 'waterfall'
                });
                
                y -= 80 + Math.random() * 60;
            }
        }
    }

    /**
     * 创建BOSS
     */
    createBoss() {
        const level = this.levelData;
        const bossX = level.length - 350;
        const groundY = GAME_CONFIG.LOGICAL_HEIGHT - 32;
        const bossPlatformY = groundY - 80; // BOSS平台高度
        
        // 在BOSS区域创建一个固定平台
        this.platforms.push({
            x: level.length - 500,
            y: bossPlatformY,
            width: 300,
            height: 20,
            type: 'boss'
        });
        
        switch(level.bossType) {
            case 'wallFortress':
                this.boss = new WallFortress(bossX, bossPlatformY - 120);
                break;
            case 'reactorCore':
                this.boss = new ReactorCore(bossX, bossPlatformY - 100);
                break;
            case 'alienBeast':
                this.boss = new AlienBeast(bossX, bossPlatformY - 80);
                break;
            case 'hologramSystem':
                this.boss = new HologramSystem(bossX, bossPlatformY - 140);
                break;
            case 'hoverCraft':
                this.boss = new HoverCraft(bossX, bossPlatformY - 60);
                break;
            case 'giantSoldier':
                this.boss = new GiantSoldier(bossX, bossPlatformY - 160);
                break;
            case 'gateKeeper':
                this.boss = new GateKeeper(bossX, bossPlatformY - 120);
                break;
            case 'alienHeart':
                this.boss = new AlienHeart(bossX, bossPlatformY - 140);
                break;
            default:
                this.boss = new WallFortress(bossX, bossPlatformY - 120);
        }
    }

    /**
     * 获取合并后的输入状态
     */
    getCombinedInput() {
        // 获取触摸控制输入
        let touchInput = { left: false, right: false, up: false, down: false, jump: false, shoot: false };
        
        if (window.TouchControls && window.TouchControls.isActive()) {
            touchInput = window.TouchControls.getState();
        }
        
        return {
            left: this.keys.left || touchInput.left,
            right: this.keys.right || touchInput.right,
            up: this.keys.up || touchInput.up,
            down: this.keys.down || touchInput.down,
            jump: this.keys.jump || touchInput.jump,
            shoot: this.keys.shoot || touchInput.shoot,
            enter: this.keys.enter
        };
    }

    /**
     * 游戏循环
     */
    gameLoop(currentTime) {
        // 计算时间增量
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        // 清空画布
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, GAME_CONFIG.LOGICAL_WIDTH, GAME_CONFIG.LOGICAL_HEIGHT);
        
        // 根据游戏状态更新
        switch(this.gameState) {
            case 'start':
                this.updateStartScreen();
                break;
            case 'playing':
                this.updateGame();
                break;
            case 'levelClear':
                this.updateLevelClear();
                break;
            case 'gameOver':
                this.updateGameOver();
                break;
            case 'continue':
                this.updateContinue();
                break;
        }
        
        // 继续循环
        requestAnimationFrame((time) => this.gameLoop(time));
    }

    /**
     * 更新开始界面
     */
    updateStartScreen() {
        // 动画效果由CSS处理
    }

    /**
     * 更新游戏逻辑
     */
    updateGame() {
        const input = this.getCombinedInput();
        
        // 更新玩家
        if (this.player) {
            this.player.update(input, this);
        }
        
        // 更新摄像机
        this.updateCamera();
        
        // 生成敌人
        this.spawnEnemy();
        
        // 更新所有对象
        this.bullets.forEach(b => b.update(this));
        this.enemies.forEach(e => e.update(this));
        this.powerups.forEach(p => p.update(this));
        this.explosions.forEach(e => e.update());
        
        // 更新BOSS
        if (this.boss && this.boss.active) {
            this.boss.update(this);
        }
        
        // 清理无效对象
        this.cleanupObjects();
        
        // 检查关卡完成
        this.checkLevelComplete();
        
        // 绘制游戏
        this.drawGame();
    }

    /**
     * 更新摄像机
     */
    updateCamera() {
        const level = this.levelData;
        
        if (level.scrollType === 'horizontal') {
            // 水平卷轴
            const targetX = this.player.x - GAME_CONFIG.LOGICAL_WIDTH / 3;
            this.targetCamera.x += (targetX - this.targetCamera.x) * 0.1;
            
            // 限制摄像机范围
            if (this.targetCamera.x < 0) this.targetCamera.x = 0;
            if (this.targetCamera.x > level.length - GAME_CONFIG.LOGICAL_WIDTH) {
                this.targetCamera.x = level.length - GAME_CONFIG.LOGICAL_WIDTH;
            }
            
            this.camera.x = Math.floor(this.targetCamera.x);
        } else if (level.scrollType === 'vertical') {
            // 垂直卷轴（瀑布）
            const targetY = this.player.y - GAME_CONFIG.LOGICAL_HEIGHT / 2;
            this.targetCamera.y += (targetY - this.targetCamera.y) * 0.1;
            
            // 限制摄像机范围
            if (this.targetCamera.y < -this.levelData.length + GAME_CONFIG.LOGICAL_HEIGHT) {
                this.targetCamera.y = -this.levelData.length + GAME_CONFIG.LOGICAL_HEIGHT;
            }
            if (this.targetCamera.y > 0) this.targetCamera.y = 0;
            
            this.camera.y = Math.floor(this.targetCamera.y);
        }
    }

    /**
     * 生成敌人
     */
    spawnEnemy() {
        this.spawnTimer++;
        
        // 根据关卡和进度生成敌人
        const spawnRate = this.levelData.id === 1 ? 120 : 90;
        
        if (this.spawnTimer > spawnRate && this.enemies.length < 5) {
            this.spawnTimer = 0;
            
            // 随机生成敌人类型
            const enemyTypes = this.levelData.enemyTypes;
            const type = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
            
            // 生成位置（在玩家右侧屏幕外）
            const spawnX = this.camera.x + GAME_CONFIG.LOGICAL_WIDTH + 50;
            const spawnY = GAME_CONFIG.LOGICAL_HEIGHT - 80 - Math.random() * 100;
            
            this.enemies.push(Enemy.create(type, spawnX, spawnY));
        }
    }

    /**
     * 清理无效对象
     */
    cleanupObjects() {
        this.bullets = this.bullets.filter(b => b.active);
        this.enemies = this.enemies.filter(e => e.active);
        this.powerups = this.powerups.filter(p => p.active);
        this.explosions = this.explosions.filter(e => e.active);
    }

    /**
     * 检查关卡完成
     */
    checkLevelComplete() {
        // 检查BOSS是否被击败
        if (this.boss && !this.boss.active && this.boss.defeated) {
            this.boss.defeated = false;
            this.levelComplete();
        }
    }

    /**
     * 关卡完成
     */
    levelComplete() {
        this.gameState = 'levelClear';
        
        // 计算奖励分
        const bonus = this.lives * 5000;
        this.score += bonus;
        
        // 更新最高分
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('contraHighScore', this.highScore);
        }
        
        // 显示关卡完成界面
        document.getElementById('life-bonus').textContent = this.lives;
        document.getElementById('stage-bonus-value').textContent = bonus;
        document.getElementById('level-clear-screen').classList.remove('hidden');
    }

    /**
     * 玩家死亡
     */
    playerDied() {
        this.lives--;
        
        if (this.lives <= 0) {
            this.gameOver();
        } else {
            // 继续倒计时
            this.startContinueCountdown();
        }
    }

    /**
     * 开始继续倒计时
     */
    startContinueCountdown() {
        this.gameState = 'continue';
        let count = 9;
        
        const countdownEl = document.getElementById('countdown');
        document.getElementById('continue-screen').classList.remove('hidden');
        
        const countdownInterval = setInterval(() => {
            count--;
            countdownEl.textContent = count;
            
            if (count <= 0) {
                clearInterval(countdownInterval);
                document.getElementById('continue-screen').classList.add('hidden');
                this.gameOver();
            }
        }, 1000);
    }

    /**
     * 游戏结束
     */
    gameOver() {
        this.gameState = 'gameOver';
        
        // 更新最高分
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('contraHighScore', this.highScore);
        }
        
        // 更新显示
        document.getElementById('final-score-value').textContent = this.score;
        document.getElementById('hi-score-value').textContent = this.highScore;
        
        // 显示游戏结束界面
        document.getElementById('game-over-screen').classList.remove('hidden');
        document.getElementById('game-hud').classList.add('hidden');
    }

    /**
     * 显示胜利画面
     */
    showVictory() {
        this.gameState = 'victory';
        
        // 可以添加胜利画面
        alert('恭喜通关！最终得分：' + this.score);
        this.startGame();
    }

    /**
     * 绘制游戏
     */
    drawGame() {
        const ctx = this.ctx;
        const level = this.levelData;
        
        // 绘制背景
        this.drawBackground();
        
        // 绘制远景
        this.drawParallaxBackground();
        
        // 绘制平台
        this.drawPlatforms();
        
        // 绘制地面
        this.drawGround();
        
        // 绘制道具
        this.powerups.forEach(p => p.draw(ctx, this.camera));
        
        // 绘制敌人
        this.enemies.forEach(e => e.draw(ctx, this.camera));
        
        // 绘制BOSS
        if (this.boss && this.boss.active) {
            this.boss.draw(ctx, this.camera);
        }
        
        // 绘制玩家
        if (this.player) {
            this.player.draw(ctx, this.camera);
        }
        
        // 绘制子弹
        this.bullets.forEach(b => b.draw(ctx, this.camera));
        
        // 绘制爆炸效果
        this.explosions.forEach(e => e.draw(ctx, this.camera));
        
        // 绘制UI
        this.drawLevelProgress();
    }

    /**
     * 绘制背景
     */
    drawBackground() {
        const ctx = this.ctx;
        const level = this.levelData;
        
        // 天空/背景色
        ctx.fillStyle = level.bgColor;
        ctx.fillRect(0, 0, GAME_CONFIG.LOGICAL_WIDTH, GAME_CONFIG.LOGICAL_HEIGHT);
    }

    /**
     * 绘制视差背景
     */
    drawParallaxBackground() {
        const ctx = this.ctx;
        const camera = this.camera;
        const level = this.levelData;
        
        if (level.scrollType === 'horizontal') {
            // 远景山脉
            ctx.fillStyle = '#1a2a1a';
            for (let i = 0; i < 15; i++) {
                const x = (i * 180 - camera.x * 0.2) % (GAME_CONFIG.LOGICAL_WIDTH + 180) - 180;
                const height = 60 + Math.sin(i * 1.2) * 30;
                
                ctx.beginPath();
                ctx.moveTo(x, GAME_CONFIG.LOGICAL_HEIGHT);
                ctx.lineTo(x + 90, GAME_CONFIG.LOGICAL_HEIGHT - height);
                ctx.lineTo(x + 180, GAME_CONFIG.LOGICAL_HEIGHT);
                ctx.fill();
            }
            
            // 近景装饰
            ctx.fillStyle = level.platformColor;
            for (let i = 0; i < 25; i++) {
                const x = (i * 120 - camera.x * 0.5) % (GAME_CONFIG.LOGICAL_WIDTH + 120) - 120;
                const height = 100 + Math.sin(i * 2) * 20;
                
                ctx.fillRect(x, GAME_CONFIG.LOGICAL_HEIGHT - height, 40, height);
            }
        } else if (level.scrollType === 'vertical') {
            // 瀑布背景
            ctx.fillStyle = '#0a2a4a';
            for (let i = 0; i < 10; i++) {
                const y = (i * 200 - camera.y * 0.3) % (GAME_CONFIG.LOGICAL_HEIGHT + 200) - 200;
                const x = 20 + Math.sin(i * 1.5) * 15;
                
                ctx.fillRect(x, y, 30, 100);
            }
            
            // 水流
            ctx.fillStyle = '#1a4a7a';
            for (let i = 0; i < 20; i++) {
                const y = (i * 80 - camera.y * 0.6) % (GAME_CONFIG.LOGICAL_HEIGHT + 80) - 80;
                
                ctx.fillRect(0, y, GAME_CONFIG.LOGICAL_WIDTH, 5);
            }
        }
    }

    /**
     * 绘制平台
     */
    drawPlatforms() {
        const ctx = this.ctx;
        const camera = this.camera;
        const level = this.levelData;
        
        this.platforms.forEach(platform => {
            const screenX = platform.x - camera.x;
            const screenY = platform.y - (camera.y || 0);
            
            // 跳过屏幕外的平台
            if (screenX + platform.width < 0 || screenX > GAME_CONFIG.LOGICAL_WIDTH) return;
            
            // 绘制平台
            ctx.fillStyle = level.platformColor;
            ctx.fillRect(screenX, screenY, platform.width, platform.height);
            
            // 平台高光
            ctx.fillStyle = 'rgba(255,255,255,0.2)';
            ctx.fillRect(screenX, screenY, platform.width, 3);
            
            // 平台阴影
            ctx.fillStyle = 'rgba(0,0,0,0.3)';
            ctx.fillRect(screenX, screenY + platform.height - 3, platform.width, 3);
        });
    }

    /**
     * 绘制地面
     */
    drawGround() {
        const ctx = this.ctx;
        const camera = this.camera;
        const level = this.levelData;
        const groundY = GAME_CONFIG.LOGICAL_HEIGHT - 32;
        
        // 地面主体
        ctx.fillStyle = level.groundColor;
        ctx.fillRect(0, groundY, GAME_CONFIG.LOGICAL_WIDTH, 32);
        
        // 地面细节
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        for (let i = 0; i < GAME_CONFIG.LOGICAL_WIDTH; i += 20) {
            const x = (i - camera.x) % GAME_CONFIG.LOGICAL_WIDTH;
            ctx.fillRect(x, groundY, 15, 2);
        }
        
        // 草丛/装饰
        if (level.id === 1 || level.id === 3) {
            ctx.fillStyle = '#3cb371';
            for (let i = 0; i < GAME_CONFIG.LOGICAL_WIDTH; i += 30) {
                const x = (i - camera.x) % GAME_CONFIG.LOGICAL_WIDTH;
                ctx.beginPath();
                ctx.moveTo(x, groundY);
                ctx.lineTo(x + 5, groundY - 10);
                ctx.lineTo(x + 10, groundY);
                ctx.fill();
            }
        }
    }

    /**
     * 绘制关卡进度
     */
    drawLevelProgress() {
        const ctx = this.ctx;
        
        // 绘制关卡名称
        if (this.levelData) {
            ctx.fillStyle = '#fff';
            ctx.font = '10px "Press Start 2P"';
            ctx.textAlign = 'center';
            
            // 只在关卡开始时显示
            if (this.camera.x < 100) {
                ctx.globalAlpha = 1 - this.camera.x / 100;
                ctx.fillText(this.levelData.name, GAME_CONFIG.LOGICAL_WIDTH / 2, 80);
                ctx.globalAlpha = 1;
            }
        }
    }

    /**
     * 更新UI显示
     */
    updateHUD() {
        document.getElementById('score-display').textContent = 
            this.score.toString().padStart(6, '0');
        document.getElementById('high-score-display').textContent = 
            this.highScore.toString().padStart(6, '0');
        
        // 更新生命图标
        const livesContainer = document.getElementById('lives-display');
        livesContainer.innerHTML = '';
        for (let i = 0; i < this.lives; i++) {
            const lifeIcon = document.createElement('div');
            lifeIcon.className = 'life-icon';
            livesContainer.appendChild(lifeIcon);
        }
        
        // 更新关卡名称
        if (this.levelData) {
            document.getElementById('stage-name').textContent = 
                `STAGE ${this.levelData.id}`;
            document.getElementById('weapon-display').textContent = 
                this.player ? WEAPON_CONFIG[this.player.weapon].name : 'RIFLE';
        }
    }

    /**
     * 隐藏所有覆盖层
     */
    hideAllOverlays() {
        document.getElementById('start-screen').classList.add('hidden');
        document.getElementById('game-over-screen').classList.add('hidden');
        document.getElementById('level-clear-screen').classList.add('hidden');
        document.getElementById('continue-screen').classList.add('hidden');
    }

    /**
     * 更新开始界面
     */
    updateStartScreen() {
        // CSS动画处理
    }

    /**
     * 更新关卡完成界面
     */
    updateLevelClear() {
        // 动画由CSS处理
    }

    /**
     * 更新游戏结束界面
     */
    updateGameOver() {
        // 动画由CSS处理
    }

    /**
     * 更新继续界面
     */
    updateContinue() {
        // 倒计时由JavaScript处理
    }
}

// ============================================================================
// 玩家类
// ============================================================================

class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 24;
        this.height = 48;
        this.vx = 0;
        this.vy = 0;
        this.direction = 1;
        this.weapon = 'normal';
        this.weaponLevel = 0;
        this.jumpCount = 0;
        this.isCrouching = false;
        this.isInvincible = false;
        this.invincibleTimer = 0;
        this.shootCooldown = 0;
        this.animFrame = 0;
        this.animTimer = 0;
        this.isOnGround = false;
        this.facingUp = false;
    }

    update(input, game) {
        // 移动速度
        this.vx = 0;
        if (input.left) {
            this.vx = -GAME_CONFIG.PLAYER_SPEED;
            this.direction = -1;
        }
        if (input.right) {
            this.vx = GAME_CONFIG.PLAYER_SPEED;
            this.direction = 1;
        }

        // 瞄准方向
        if (input.up) {
            input.aimDirection = { x: 0, y: -1 };
            this.facingUp = true;
        } else if (input.down) {
            input.aimDirection = { x: 0, y: 1 };
            this.facingUp = false;
        } else {
            input.aimDirection = { x: this.direction, y: 0 };
            this.facingUp = false;
        }

        // 蹲下
        if (input.down && this.isOnGround) {
            this.isCrouching = true;
            this.height = 32;
        } else {
            this.isCrouching = false;
            this.height = 48;
        }

        // 跳跃
        if (input.jump && !input.jumpPressed) {
            input.jumpPressed = true;
            if (this.jumpCount < GAME_CONFIG.PLAYER_MAX_JUMPS) {
                this.vy = GAME_CONFIG.PLAYER_JUMP_FORCE;
                this.jumpCount++;
                this.isOnGround = false;
            }
        }

        if (!input.jump) {
            input.jumpPressed = false;
        }

        // 重置跳跃计数
        if (this.isOnGround && !input.jump) {
            this.jumpCount = 0;
        }

        // 重力和物理
        this.vy += GAME_CONFIG.GRAVITY;
        this.x += this.vx;
        this.y += this.vy;

        // 射击
        if (this.shootCooldown > 0) {
            this.shootCooldown--;
        }

        if (input.shoot && this.shootCooldown === 0) {
            this.shoot(input, game);
            const weaponConfig = WEAPON_CONFIG[this.weapon];
            this.shootCooldown = weaponConfig.fireRate;
        }

        // 无敌时间
        if (this.isInvincible) {
            this.invincibleTimer--;
            if (this.invincibleTimer <= 0) {
                this.isInvincible = false;
            }
        }

        // 动画
        this.animTimer++;
        if (this.animTimer > 8) {
            this.animTimer = 0;
            this.animFrame = (this.animFrame + 1) % 4;
        }

        // 状态更新
        this.updateState();

        // 碰撞检测
        this.checkCollisions(game);

        // 边界检测
        this.checkBounds(game);
    }

    updateState() {
        if (!this.isOnGround) {
            this.state = 'jump';
        } else if (this.isCrouching) {
            this.state = 'crouch';
        } else if (Math.abs(this.vx) > 0) {
            this.state = 'run';
        } else {
            this.state = 'idle';
        }
    }

    shoot(input, game) {
        const weaponConfig = WEAPON_CONFIG[this.weapon];
        const bulletCount = weaponConfig.bulletCount;
        const spreadAngle = weaponConfig.spread;
        const baseAngle = Math.atan2(input.aimDirection.y, input.aimDirection.x);

        for (let i = 0; i < bulletCount; i++) {
            let angle;
            if (bulletCount > 1) {
                angle = baseAngle - spreadAngle + (spreadAngle * 2 / (bulletCount - 1)) * i;
            } else {
                angle = baseAngle;
            }

            const bulletX = this.x + this.width / 2 + Math.cos(angle) * 20;
            const bulletY = this.y + this.height / 2 + Math.sin(angle) * 20;

            game.bullets.push(new Bullet(
                bulletX, bulletY,
                Math.cos(angle) * weaponConfig.speed,
                Math.sin(angle) * weaponConfig.speed,
                this.weapon,
                true
            ));
        }
    }

    checkCollisions(game) {
        this.isOnGround = false;
        const groundY = GAME_CONFIG.LOGICAL_HEIGHT - 32;

        // 平台碰撞
        for (let platform of game.platforms) {
            if (this.vy >= 0 &&
                this.x + this.width > platform.x &&
                this.x < platform.x + platform.width &&
                this.y + this.height >= platform.y &&
                this.y + this.height <= platform.y + platform.height + this.vy + 1) {
                
                this.y = platform.y - this.height;
                this.vy = 0;
                this.isOnGround = true;
            }
        }

        // 地面碰撞
        if (this.y + this.height >= groundY && this.vy >= 0) {
            this.y = groundY - this.height;
            this.vy = 0;
            this.isOnGround = true;
        }
    }

    checkBounds(game) {
        const camera = game.camera;
        
        if (this.x < camera.x) this.x = camera.x;
        if (this.x > camera.x + GAME_CONFIG.LOGICAL_WIDTH - this.width) {
            this.x = camera.x + GAME_CONFIG.LOGICAL_WIDTH - this.width;
        }
        if (this.y > GAME_CONFIG.LOGICAL_HEIGHT + 100) {
            this.die(game);
        }
    }

    takeDamage(game) {
        if (this.isInvincible) return;

        this.isInvincible = true;
        this.invincibleTimer = GAME_CONFIG.INVINCIBLE_TIME;
        
        // 降级武器
        if (this.weaponLevel > 0) {
            this.weaponLevel--;
            const weapons = ['normal', 'machine', 'spread', 'laser'];
            this.weapon = weapons[this.weaponLevel];
        }
        
        game.updateHUD();
        game.playerDied();
    }

    die(game) {
        game.playerDied();
    }

    collectPowerup(type, game) {
        const weapons = ['normal', 'machine', 'spread', 'laser'];
        if (type === 'R' && this.weaponLevel < 3) {
            this.weaponLevel++;
            this.weapon = weapons[this.weaponLevel];
        } else if (type === '1UP') {
            game.lives = Math.min(game.lives + 1, 9);
        } else if (type === 'S') {
            game.score += 2000;
        } else if (type === 'B') {
            game.score += 5000;
        }
        
        game.updateHUD();
    }

    draw(ctx, camera) {
        ctx.save();
        
        // 无敌闪烁
        if (this.isInvincible && Math.floor(this.invincibleTimer / 4) % 2 === 0) {
            ctx.globalAlpha = 0.5;
        }

        const screenX = this.x - camera.x;
        const screenY = this.y - (camera.y || 0);

        // 根据状态绘制
        if (this.state === 'jump' && this.facingUp) {
            this.drawJumpUp(ctx, screenX, screenY);
        } else if (this.state === 'jump') {
            this.drawJump(ctx, screenX, screenY);
        } else if (this.state === 'crouch') {
            this.drawCrouch(ctx, screenX, screenY);
        } else if (this.state === 'run') {
            this.drawRun(ctx, screenX, screenY);
        } else {
            this.drawIdle(ctx, screenX, screenY);
        }

        ctx.restore();
    }

    drawIdle(ctx, x, y) {
        // 头部
        ctx.fillStyle = '#e8c39e';
        ctx.fillRect(x + 6, y, 12, 12);
        
        // 红色头带
        ctx.fillStyle = '#d42d27';
        ctx.fillRect(x + 4, y + 2, 16, 4);
        ctx.fillRect(x + 4, y + 4, 4, 6);
        
        // 眼睛
        ctx.fillStyle = '#000';
        ctx.fillRect(x + 8, y + 6, 2, 2);
        ctx.fillRect(x + 14, y + 6, 2, 2);
        
        // 身体
        ctx.fillStyle = '#fff';
        ctx.fillRect(x + 4, y + 12, 16, 16);
        
        // 蓝色裤子
        ctx.fillStyle = '#2b5c96';
        ctx.fillRect(x + 4, y + 28, 16, 20);
        
        // 枪
        ctx.fillStyle = '#555';
        ctx.fillRect(x + (this.direction > 0 ? 18 : -4), y + 16, 10, 4);
        
        // 手臂
        ctx.fillStyle = '#e8c39e';
        ctx.fillRect(x + (this.direction > 0 ? 14 : -2), y + 14, 6, 8);
    }

    drawRun(ctx, x, y) {
        const frame = this.animFrame;
        const bodyOffset = frame % 2 === 0 ? 0 : 2;
        
        // 头部
        ctx.fillStyle = '#e8c39e';
        ctx.fillRect(x + 6, y, 12, 12);
        
        // 红色头带
        ctx.fillStyle = '#d42d27';
        ctx.fillRect(x + 4, y + 2, 16, 4);
        
        // 身体
        ctx.fillStyle = '#fff';
        ctx.fillRect(x + 4, y + 12 - bodyOffset, 16, 16);
        
        // 蓝色裤子
        ctx.fillStyle = '#2b5c96';
        ctx.fillRect(x + 4, y + 28 + bodyOffset, 16, 20);
        
        // 手臂
        ctx.fillStyle = '#e8c39e';
        const armSwing = frame % 2 === 0 ? -4 : 4;
        ctx.fillRect(x + (this.direction > 0 ? 14 : -6), y + 14 + armSwing, 6, 8);
        
        // 枪
        ctx.fillStyle = '#555';
        ctx.fillRect(x + (this.direction > 0 ? 20 : -6), y + 16, 10, 4);
        
        // 腿
        ctx.fillStyle = '#2b5c96';
        if (frame % 2 === 0) {
            ctx.fillRect(x + 4, y + 44, 6, 4);
            ctx.fillRect(x + 14, y + 40, 6, 4);
        } else {
            ctx.fillRect(x + 4, y + 40, 6, 4);
            ctx.fillRect(x + 14, y + 44, 6, 4);
        }
    }

    drawJump(ctx, x, y) {
        // 蜷缩
        ctx.fillStyle = '#e8c39e';
        ctx.fillRect(x + 6, y + 8, 12, 12);
        
        ctx.fillStyle = '#d42d27';
        ctx.fillRect(x + 4, y + 10, 16, 4);
        
        ctx.fillStyle = '#fff';
        ctx.fillRect(x + 4, y + 16, 16, 16);
        
        ctx.fillStyle = '#2b5c96';
        ctx.fillRect(x + 2, y + 24, 20, 16);
        
        ctx.fillStyle = '#e8c39e';
        ctx.fillRect(x, y + 12, 8, 6);
        ctx.fillRect(x + 16, y + 12, 8, 6);
        
        ctx.fillStyle = '#555';
        ctx.fillRect(x + 10, y + 4, 4, 12);
    }

    drawJumpUp(ctx, x, y) {
        ctx.fillStyle = '#e8c39e';
        ctx.fillRect(x + 6, y, 12, 12);
        
        ctx.fillStyle = '#d42d27';
        ctx.fillRect(x + 4, y + 2, 16, 4);
        
        ctx.fillStyle = '#fff';
        ctx.fillRect(x + 4, y + 12, 16, 16);
        
        ctx.fillStyle = '#2b5c96';
        ctx.fillRect(x + 4, y + 28, 16, 20);
        
        ctx.fillStyle = '#e8c39e';
        ctx.fillRect(x + 2, y + 8, 6, 10);
        ctx.fillRect(x + 16, y + 8, 6, 10);
        
        ctx.fillStyle = '#555';
        ctx.fillRect(x + 10, y - 4, 4, 16);
    }

    drawCrouch(ctx, x, y) {
        ctx.fillStyle = '#e8c39e';
        ctx.fillRect(x + 6, y + 8, 12, 10);
        
        ctx.fillStyle = '#d42d27';
        ctx.fillRect(x + 4, y + 10, 16, 4);
        
        ctx.fillStyle = '#fff';
        ctx.fillRect(x + 4, y + 16, 16, 10);
        
        ctx.fillStyle = '#2b5c96';
        ctx.fillRect(x + 2, y + 24, 20, 8);
        
        ctx.fillStyle = '#555';
        ctx.fillRect(x + 14, y + 20, 4, 12);
    }
}

// ============================================================================
// 子弹类
// ============================================================================

class Bullet {
    constructor(x, y, vx, vy, type, isPlayerBullet) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.type = type;
        this.isPlayerBullet = isPlayerBullet;
        this.width = type === 'laser' ? 20 : 8;
        this.height = type === 'laser' ? 4 : 4;
        this.damage = type === 'laser' ? 3 : 1;
        this.active = true;
    }

    update(game) {
        this.x += this.vx;
        this.y += this.vy;

        // 出界检测
        const camera = game.camera;
        if (this.x < camera.x - 50 || this.x > camera.x + GAME_CONFIG.LOGICAL_WIDTH + 50 ||
            this.y < -50 || this.y > GAME_CONFIG.LOGICAL_HEIGHT + 50) {
            this.active = false;
        }

        // 碰撞检测
        if (this.isPlayerBullet) {
            this.checkEnemyCollision(game);
        } else {
            this.checkPlayerCollision(game);
        }
    }

    checkEnemyCollision(game) {
        for (let enemy of game.enemies) {
            if (!enemy.active) continue;
            
            if (this.x < enemy.x + enemy.width &&
                this.x + this.width > enemy.x &&
                this.y < enemy.y + enemy.height &&
                this.y + this.height > enemy.y) {
                
                enemy.takeDamage(this.damage);
                this.active = false;
                game.explosions.push(new Explosion(this.x, this.y, 'small'));
                return;
            }
        }

        // BOSS碰撞
        if (game.boss && game.boss.active) {
            if (this.x < game.boss.x + game.boss.width &&
                this.x + this.width > game.boss.x &&
                this.y < game.boss.y + game.boss.height &&
                this.y + this.height > game.boss.y) {
                
                game.boss.takeDamage(this.damage);
                this.active = false;
                game.explosions.push(new Explosion(this.x, this.y, 'small'));
            }
        }
    }

    checkPlayerCollision(game) {
        if (game.player.isInvincible) return;
        
        if (this.x < game.player.x + game.player.width &&
            this.x + this.width > game.player.x &&
            this.y < game.player.y + game.player.height &&
            this.y + this.height > game.player.y) {
            
            game.player.takeDamage(game);
            this.active = false;
        }
    }

    draw(ctx, camera) {
        const screenX = this.x - camera.x;
        const screenY = this.y - (camera.y || 0);
        
        if (this.type === 'laser') {
            ctx.fillStyle = '#00ffff';
            ctx.fillRect(screenX, screenY, this.width, this.height);
            ctx.fillStyle = '#fff';
            ctx.fillRect(screenX, screenY + 1, this.width, 2);
        } else if (this.type === 'spread') {
            ctx.fillStyle = '#ff0';
            ctx.beginPath();
            ctx.arc(screenX + 4, screenY + 2, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#f00';
            ctx.beginPath();
            ctx.arc(screenX + 4, screenY + 2, 2, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(screenX + 4, screenY + 2, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#ff0';
            ctx.beginPath();
            ctx.arc(screenX + 4, screenY + 2, 1.5, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

// ============================================================================
// 敌人类
// ============================================================================

class Enemy {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.active = true;
        this.animFrame = 0;
        this.animTimer = 0;
        this.direction = -1;
        this.vy = 0;
        this.isOnGround = false;
        
        this.initStats();
    }

    static create(type, x, y) {
        return new Enemy(x, y, type);
    }

    initStats() {
        switch(this.type) {
            case 'soldier':
                this.width = 24;
                this.height = 44;
                this.hp = 2;
                this.speed = 2;
                this.score = 200;
                break;
            case 'runner':
                this.width = 20;
                this.height = 36;
                this.hp = 1;
                this.speed = 4;
                this.score = 100;
                break;
            case 'sniper':
                this.width = 24;
                this.height = 44;
                this.hp = 3;
                this.speed = 1;
                this.score = 400;
                this.shootTimer = 60;
                break;
            case 'snowSoldier':
                this.width = 24;
                this.height = 44;
                this.hp = 2;
                this.speed = 2;
                this.score = 250;
                break;
            case 'grenadier':
                this.width = 24;
                this.height = 44;
                this.hp = 2;
                this.speed = 2;
                this.score = 300;
                this.shootTimer = 90;
                break;
            case 'flameGuard':
                this.width = 28;
                this.height = 48;
                this.hp = 4;
                this.speed = 1;
                this.score = 500;
                break;
            case 'alienBug':
                this.width = 20;
                this.height = 20;
                this.hp = 1;
                this.speed = 3;
                this.score = 150;
                break;
            case 'faceHugger':
                this.width = 16;
                this.height = 16;
                this.hp = 1;
                this.speed = 5;
                this.score = 100;
                break;
            default:
                this.width = 24;
                this.height = 44;
                this.hp = 2;
                this.speed = 2;
                this.score = 200;
        }
    }

    update(game) {
        if (!this.active) return;

        this.animTimer++;
        if (this.animTimer > 10) {
            this.animTimer = 0;
            this.animFrame = (this.animFrame + 1) % 2;
        }

        // 移动
        this.x += this.speed * this.direction;

        // 随机改变方向
        if (Math.random() < 0.01) {
            this.direction *= -1;
        }

        // 跳跃
        if (this.isOnGround && Math.random() < 0.02) {
            this.vy = GAME_CONFIG.PLAYER_JUMP_FORCE * 0.8;
            this.isOnGround = false;
        }

        // 射击（特定类型）
        if (this.shootTimer !== undefined) {
            this.shootTimer--;
            if (this.shootTimer <= 0 && Math.abs(game.player.x - this.x) < 400) {
                this.shoot(game);
                this.shootTimer = 90;
            }
        }

        // 重力
        this.vy += GAME_CONFIG.GRAVITY;
        this.y += this.vy;

        // 地面碰撞
        const groundY = GAME_CONFIG.LOGICAL_HEIGHT - 32;
        if (this.y + this.height >= groundY) {
            this.y = groundY - this.height;
            this.vy = 0;
            this.isOnGround = true;
        }

        // 平台碰撞
        for (let platform of game.platforms) {
            if (this.vy >= 0 &&
                this.x + this.width > platform.x &&
                this.x < platform.x + platform.width &&
                this.y + this.height >= platform.y &&
                this.y + this.height <= platform.y + platform.height + this.vy + 1) {
                
                this.y = platform.y - this.height;
                this.vy = 0;
                this.isOnGround = true;
            }
        }

        // 玩家碰撞
        if (!game.player.isInvincible &&
            this.x < game.player.x + game.player.width &&
            this.x + this.width > game.player.x &&
            this.y < game.player.y + game.player.height &&
            this.y + this.height > game.player.y) {
            
            game.player.takeDamage(game);
        }

        // 边界
        if (this.x < game.camera.x - 50) this.active = false;
        if (this.x > game.camera.x + GAME_CONFIG.LOGICAL_WIDTH + 100) this.active = false;
    }

    shoot(game) {
        const bulletX = this.x + this.width / 2;
        const bulletY = this.y + this.height / 2;
        
        const dx = game.player.x - this.x;
        const dy = game.player.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        game.bullets.push(new Bullet(
            bulletX, bulletY,
            (dx / dist) * 6,
            (dy / dist) * 6,
            'normal',
            false
        ));
    }

    takeDamage(damage) {
        this.hp -= damage;
        if (this.hp <= 0) {
            this.die();
        }
    }

    die() {
        this.active = false;
        
        // 掉落道具
        if (Math.random() < 0.15) {
            const types = ['R', 'R', 'S', '1UP'];
            const type = types[Math.floor(Math.random() * types.length)];
            return new Powerup(this.x, this.y, type);
        }
        return null;
    }

    draw(ctx, camera) {
        const screenX = this.x - camera.x;
        const screenY = this.y - (camera.y || 0);
        
        const color1 = '#8b4513';
        const color2 = '#333';
        
        // 头部
        ctx.fillStyle = '#e8c39e';
        ctx.fillRect(screenX + 6, screenY, 12, 10);
        
        // 军帽
        ctx.fillStyle = color1;
        ctx.fillRect(screenX + 4, screenY - 4, 16, 6);
        
        // 身体
        ctx.fillStyle = color2;
        ctx.fillRect(screenX + 4, screenY + 10, 16, 14);
        
        // 裤子
        ctx.fillStyle = color1;
        ctx.fillRect(screenX + 4, screenY + 24, 16, 20);
        
        // 枪
        ctx.fillStyle = '#555';
        ctx.fillRect(screenX + (this.direction > 0 ? 16 : -4), screenY + 12, 8, 3);

        // 腿部
        ctx.fillStyle = color1;
        if (this.animFrame === 0) {
            ctx.fillRect(screenX + 4, screenY + 40, 6, 4);
            ctx.fillRect(screenX + 14, screenY + 42, 6, 4);
        } else {
            ctx.fillRect(screenX + 4, screenY + 42, 6, 4);
            ctx.fillRect(screenX + 14, screenY + 40, 6, 4);
        }
    }
}

// ============================================================================
// 道具类
// ============================================================================

class Powerup {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.width = 24;
        this.height = 24;
        this.vy = -3;
        this.active = true;
        this.floatOffset = 0;
    }

    update(game) {
        this.vy += 0.2;
        if (this.vy > 4) this.vy = 4;
        this.y += this.vy;

        const groundY = GAME_CONFIG.LOGICAL_HEIGHT - 32;
        if (this.y + this.height >= groundY) {
            this.y = groundY - this.height;
            this.vy = 0;
        }

        this.floatOffset = Math.sin(Date.now() / 200) * 3;

        if (this.x < game.player.x + game.player.width &&
            this.x + this.width > game.player.x &&
            this.y < game.player.y + game.player.height &&
            this.y + this.height > game.player.y) {
            
            game.player.collectPowerup(this.type, game);
            this.active = false;
        }

        if (this.x < game.camera.x - 50 || this.x > game.camera.x + GAME_CONFIG.LOGICAL_WIDTH + 50) {
            this.active = false;
        }
    }

    draw(ctx, camera) {
        const screenX = this.x - camera.x;
        const drawY = this.y + this.floatOffset - (camera.y || 0);

        ctx.fillStyle = '#ff6b35';
        ctx.fillRect(screenX, drawY, this.width, this.height);
        
        ctx.fillStyle = '#fff';
        ctx.fillRect(screenX + 2, drawY + 2, this.width - 4, 4);
        
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 14px "Press Start 2P"';
        ctx.fillText(this.type, screenX + 4, drawY + 18);
    }
}

// ============================================================================
// 爆炸效果类
// ============================================================================

class Explosion {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.frame = 0;
        this.maxFrames = size === 'huge' ? 30 : size === 'large' ? 20 : 15;
        this.active = true;
    }

    update() {
        this.frame++;
        if (this.frame >= this.maxFrames) {
            this.active = false;
        }
    }

    draw(ctx, camera) {
        const screenX = this.x - camera.x;
        const screenY = this.y - (camera.y || 0);
        const progress = this.frame / this.maxFrames;
        const size = this.size === 'huge' ? 80 : this.size === 'large' ? 50 : 30;
        const currentSize = size * (1 - progress * 0.5);
        
        let color;
        if (progress < 0.3) {
            color = '#fff';
        } else if (progress < 0.6) {
            color = '#ff0';
        } else if (progress < 0.8) {
            color = '#f80';
        } else {
            color = '#f00';
        }

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(screenX, screenY, currentSize / 2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(screenX, screenY, currentSize / 4, 0, Math.PI * 2);
        ctx.fill();
    }
}

// ============================================================================
// BOSS类
// ============================================================================

class Boss {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 120;
        this.height = 100;
        this.hp = 100;
        this.maxHp = 100;
        this.active = true;
        this.defeated = false;
        this.attackTimer = 0;
        this.moveDirection = 1;
    }

    update(game) {
        if (!this.active) return;

        this.attackTimer++;

        // 移动
        this.x += this.moveDirection * 1.5;
        if (this.x > 3200) this.moveDirection = -1;
        if (this.x < 2800) this.moveDirection = 1;

        // 攻击
        if (this.attackTimer > 60) {
            this.attack(game);
            this.attackTimer = 0;
        }

        // 玩家碰撞
        if (!game.player.isInvincible &&
            this.x < game.player.x + game.player.width &&
            this.x + this.width > game.player.x &&
            this.y < game.player.y + game.player.height &&
            this.y + this.height > game.player.y) {
            
            game.player.takeDamage(game);
        }
    }

    attack(game) {
        // 默认攻击（由子类重写）
    }

    takeDamage(damage) {
        this.hp -= damage;
        if (this.hp <= 0) {
            this.die();
        }
    }

    die() {
        this.active = false;
        this.defeated = true;
    }

    draw(ctx, camera) {
        const screenX = this.x - camera.x;
        
        ctx.fillStyle = '#4a4a4a';
        ctx.fillRect(screenX, this.y, this.width, this.height);
        
        // 血条
        const hpPercent = this.hp / this.maxHp;
        ctx.fillStyle = '#f00';
        ctx.fillRect(screenX, this.y - 15, this.width, 8);
        ctx.fillStyle = '#0f0';
        ctx.fillRect(screenX, this.y - 15, this.width * hpPercent, 8);
    }
}

// 各关卡BOSS
class WallFortress extends Boss {
    constructor(x, y) {
        super(x, y);
        this.width = 150;
        this.height = 120;
        this.hp = 150;
        this.maxHp = 150;
    }

    attack(game) {
        for (let i = 0; i < 5; i++) {
            const angle = (Math.PI / 8) * (i - 2);
            game.bullets.push(new Bullet(
                this.x + this.width / 2,
                this.y + 20,
                Math.cos(angle) * 6,
                Math.sin(angle) * 6,
                'normal',
                false
            ));
        }
    }
}

class ReactorCore extends Boss {
    constructor(x, y) {
        super(x, y);
        this.width = 100;
        this.height = 100;
        this.hp = 120;
        this.maxHp = 120;
    }

    attack(game) {
        // 激光攻击
        game.bullets.push(new Bullet(this.x, this.y + 50, -8, 0, 'laser', false));
        game.bullets.push(new Bullet(this.x + this.width, this.y + 50, 8, 0, 'laser', false));
    }
}

class AlienBeast extends Boss {
    constructor(x, y) {
        super(x, y);
        this.width = 140;
        this.height = 80;
        this.hp = 180;
        this.maxHp = 180;
    }

    attack(game) {
        // 跳跃攻击
        const dx = game.player.x - this.x;
        game.bullets.push(new Bullet(
            this.x + this.width / 2,
            this.y + this.height / 2,
            dx > 0 ? 8 : -8,
            0,
            'spread',
            false
        ));
    }
}

class HologramSystem extends Boss {
    constructor(x, y) {
        super(x, y);
        this.width = 120;
        this.height = 140;
        this.hp = 200;
        this.maxHp = 200;
    }

    attack(game) {
        // 幻影攻击
        for (let i = 0; i < 3; i++) {
            game.bullets.push(new Bullet(
                this.x + this.width / 2 + (Math.random() - 0.5) * 100,
                this.y + Math.random() * this.height,
                -6,
                (Math.random() - 0.5) * 4,
                'normal',
                false
            ));
        }
    }
}

class HoverCraft extends Boss {
    constructor(x, y) {
        super(x, y);
        this.width = 160;
        this.height = 60;
        this.hp = 220;
        this.maxHp = 220;
    }

    attack(game) {
        // 导弹攻击
        game.bullets.push(new Bullet(this.x + this.width / 2, this.y, -6, -3, 'spread', false));
        game.bullets.push(new Bullet(this.x + this.width / 2, this.y, -6, 0, 'spread', false));
        game.bullets.push(new Bullet(this.x + this.width / 2, this.y, -6, 3, 'spread', false));
    }
}

class GiantSoldier extends Boss {
    constructor(x, y) {
        super(x, y);
        this.width = 80;
        this.height = 160;
        this.hp = 250;
        this.maxHp = 250;
    }

    attack(game) {
        // 快速射击
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const dx = game.player.x - this.x;
                const dy = game.player.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                game.bullets.push(new Bullet(
                    this.x + this.width / 2,
                    this.y + 40,
                    (dx / dist) * 10,
                    (dy / dist) * 10,
                    'machine',
                    false
                ));
            }, i * 100);
        }
    }
}

class GateKeeper extends Boss {
    constructor(x, y) {
        super(x, y);
        this.width = 140;
        this.height = 120;
        this.hp = 300;
        this.maxHp = 300;
    }

    attack(game) {
        // 外星生物攻击
        for (let i = 0; i < 5; i++) {
            game.enemies.push(Enemy.create('alienBug', 
                this.x + Math.random() * this.width, 
                this.y + Math.random() * this.height
            ));
        }
    }
}

class AlienHeart extends Boss {
    constructor(x, y) {
        super(x, y);
        this.width = 180;
        this.height = 140;
        this.hp = 500;
        this.maxHp = 500;
    }

    attack(game) {
        // 最终BOSS：全屏攻击
        const patterns = ['spread', 'wave', 'target'];
        const pattern = patterns[Math.floor(Math.random() * patterns.length)];
        
        switch(pattern) {
            case 'spread':
                for (let i = 0; i < 7; i++) {
                    const angle = (Math.PI / 4) * (i - 3);
                    game.bullets.push(new Bullet(
                        this.x + this.width / 2,
                        this.y + this.height / 2,
                        Math.cos(angle) * 7,
                        Math.sin(angle) * 7,
                        'spread',
                        false
                    ));
                }
                break;
            case 'wave':
                for (let i = 0; i < 10; i++) {
                    game.bullets.push(new Bullet(
                        this.x + this.width / 2 + (i - 5) * 20,
                        this.y,
                        0,
                        6,
                        'laser',
                        false
                    ));
                }
                break;
            case 'target':
                const dx = game.player.x - this.x;
                const dy = game.player.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                game.bullets.push(new Bullet(
                    this.x + this.width / 2,
                    this.y + this.height / 2,
                    (dx / dist) * 12,
                    (dy / dist) * 12,
                    'normal',
                    false
                ));
                break;
        }
    }
}

// ============================================================================
// 启动游戏
// ============================================================================

window.addEventListener('load', () => {
    window.game = new ContraGame();
});

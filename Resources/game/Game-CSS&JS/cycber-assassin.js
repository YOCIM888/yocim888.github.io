// 游戏变量
let game = {
    scene: document.getElementById('gameScene'),
    player: document.getElementById('player'),
    sword: document.getElementById('sword'),
    gun: document.getElementById('gun'),
    healthFill: document.getElementById('healthFill'),
    healthText: document.getElementById('healthText'),
    scoreElement: document.getElementById('score'),
    gameMessage: document.getElementById('gameMessage'),
    messageTitle: document.getElementById('messageTitle'),
    messageText: document.getElementById('messageText'),
    finalScore: document.getElementById('finalScore'),
    restartBtn: document.getElementById('restartBtn'),
    instructions: document.getElementById('instructions'),
    closeInstructionsBtn: document.getElementById('closeInstructions'),
    
    // 游戏状态
    isRunning: true,
    score: 0,
    playerHealth: 10,
    playerMaxHealth: 10,
    playerDirection: 'right',
    playerSpeed: 8,
    scenePosition: 0,
    maxScenePosition: 3200, // 4000px - 800px (游戏容器宽度)
    
    // 攻击状态
    isAttacking: false,
    attackCooldown: false,
    
    // 游戏难度
    difficulty: 1,
    enemySpawnRate: 1500, // 毫秒
    lastEnemySpawn: 0,
    
    // 游戏元素数组
    enemies: [],
    bullets: [],
    effects: [],
    
    // 按键状态
    keys: {
        left: false,
        right: false,
        sword: false,
        gun: false
    }
};

// 初始化游戏
function initGame() {
    game.isRunning = true;
    game.score = 0;
    game.playerHealth = game.playerMaxHealth;
    game.difficulty = 1;
    game.enemySpawnRate = 1500;
    game.scenePosition = 0;
    game.enemies = [];
    game.bullets = [];
    game.effects = [];
    
    // 重置UI
    game.scoreElement.textContent = '0';
    updateHealth();
    game.gameMessage.style.display = 'none';
    
    // 重置玩家位置
    game.player.style.left = '500px';
    game.playerDirection = 'right';
    game.player.style.transform = 'scaleX(1)';
    
    // 清除所有敌人和子弹
    document.querySelectorAll('.enemy, .bullet, .hit-effect, .death-effect').forEach(el => el.remove());
    
    // 重置场景位置
    game.scene.style.transform = 'translateX(0px)';
    
    // 开始游戏循环
    lastTime = 0;
    requestAnimationFrame(gameLoop);
}

// 游戏主循环
let lastTime = 0;
function gameLoop(timestamp = 0) {
    if (!game.isRunning) return;
    
    const deltaTime = timestamp - lastTime || 0;
    lastTime = timestamp;
    
    // 更新游戏状态
    updatePlayer(deltaTime);
    updateEnemies(deltaTime);
    updateBullets(deltaTime);
    updateEffects(deltaTime);
    spawnEnemies(timestamp);
    updateDifficulty(timestamp);
    
    // 继续循环
    requestAnimationFrame(gameLoop);
}

// 更新玩家
function updatePlayer(deltaTime) {
    // 处理移动
    let moveX = 0;
    if (game.keys.left) moveX = -1;
    if (game.keys.right) moveX = 1;
    
    // 获取玩家在场景中的绝对位置
    let playerX = parseInt(game.player.style.left) || 500;
    
    // 移动玩家（玩家可以在整个4000px地图中移动）
    playerX += moveX * game.playerSpeed;
    
    // 限制玩家在地图边界内（留出边距）
    const mapWidth = 4000;
    const minX = 50;
    const maxX = mapWidth - 130; // 80px玩家宽度 + 50px边距
    
    playerX = Math.max(minX, Math.min(maxX, playerX));
    
    // 更新玩家在场景中的位置
    game.player.style.left = playerX + 'px';
    
    // 更新玩家方向
    if (moveX > 0) {
        game.playerDirection = 'right';
        game.player.style.transform = 'scaleX(1)';
    } else if (moveX < 0) {
        game.playerDirection = 'left';
        game.player.style.transform = 'scaleX(-1)';
    }
    
    // 更新摄像机（场景移动）以跟随玩家 - 像魂斗罗那样丝滑
    // 玩家始终保持在屏幕中心，场景根据玩家位置移动
    const screenWidth = window.innerWidth;
    const screenCenter = screenWidth / 2;
    
    // 计算玩家在屏幕上的位置
    const playerScreenX = playerX - game.scenePosition;
    
    // 像魂斗罗那样，让玩家始终保持在屏幕中心，场景平滑移动
    const targetScenePosition = playerX - screenCenter;
    
    // 限制场景移动范围
    const maxScenePos = mapWidth - screenWidth;
    const clampedTarget = Math.max(0, Math.min(maxScenePos, targetScenePosition));
    
    // 平滑插值，使摄像机移动更丝滑
    const smoothing = 0.1;
    game.scenePosition += (clampedTarget - game.scenePosition) * smoothing;
    
    // 应用场景移动
    game.scene.style.transform = `translateX(-${game.scenePosition}px)`;
    
    // 更新武器位置
    updateWeaponPosition();
}

// 更新武器位置
function updateWeaponPosition() {
    // 根据玩家方向调整武器位置
    if (game.playerDirection === 'right') {
        game.sword.style.transform = 'rotate(0deg)';
        game.sword.style.left = '55px';
        game.sword.style.top = '45px';
        
        game.gun.style.transform = 'rotate(0deg)';
        game.gun.style.left = '55px';
        game.gun.style.top = '45px';
    } else {
        game.sword.style.transform = 'rotate(180deg)';
        game.sword.style.left = '-35px';
        game.sword.style.top = '45px';
        
        game.gun.style.transform = 'rotate(180deg)';
        game.gun.style.left = '-35px';
        game.gun.style.top = '45px';
    }
}

// 更新敌人
function updateEnemies(deltaTime) {
    for (let i = game.enemies.length - 1; i >= 0; i--) {
        const enemy = game.enemies[i];
        const enemyRect = enemy.element.getBoundingClientRect();
        const playerRect = game.player.getBoundingClientRect();
        
        // 计算敌人与玩家的距离（绝对距离）
        const playerX = parseInt(game.player.style.left) || 500;
        const distance = Math.abs(enemy.x - playerX);
        
        // 根据敌人类型执行不同行为
        switch(enemy.type) {
            case 'sword':
                // 刀兵：靠近玩家时攻击
                if (distance < 100 && !enemy.isAttacking) {
                    attackPlayer(enemy);
                    enemy.isAttacking = true;
                    setTimeout(() => {
                        enemy.isAttacking = false;
                    }, 1000);
                }
                
                // 刀兵向玩家移动
                if (enemy.x < playerX) {
                    enemy.x += 2;
                } else {
                    enemy.x -= 2;
                }
                break;
                
            case 'gun':
                // 枪兵：在一定距离外向玩家射击
                if (distance < 400 && distance > 100 && !enemy.isShooting) {
                    shootAtPlayer(enemy);
                    enemy.isShooting = true;
                    setTimeout(() => {
                        enemy.isShooting = false;
                    }, 1500);
                }
                
                // 枪兵保持距离
                if (enemy.x < playerX - 200) {
                    enemy.x += 1;
                } else if (enemy.x > playerX + 200) {
                    enemy.x -= 1;
                }
                break;
                
            case 'shield':
                // 盾兵：缓慢向玩家移动
                if (enemy.x < playerX) {
                    enemy.x += 1;
                } else {
                    enemy.x -= 1;
                }
                break;
        }
        
        // 更新敌人位置
        enemy.element.style.left = enemy.x + 'px';
        
        // 检查敌人是否被击中
        checkEnemyHit(enemy, i);
        
        // 如果敌人移出屏幕，移除
        if (enemy.x < -100 || enemy.x > 4100) {
            enemy.element.remove();
            game.enemies.splice(i, 1);
        }
    }
}

// 更新子弹
function updateBullets(deltaTime) {
    for (let i = game.bullets.length - 1; i >= 0; i--) {
        const bullet = game.bullets[i];
        
        // 移动子弹
        bullet.x += bullet.speed * (bullet.direction === 'right' ? 1 : -1);
        bullet.element.style.left = bullet.x + 'px';
        
        // 检查子弹碰撞
        checkBulletCollision(bullet, i);
        
        // 如果子弹移出屏幕，移除
        if (bullet.x < -100 || bullet.x > 4100) {
            bullet.element.remove();
            game.bullets.splice(i, 1);
        }
    }
}

// 更新特效
function updateEffects(deltaTime) {
    for (let i = game.effects.length - 1; i >= 0; i--) {
        const effect = game.effects[i];
        effect.duration -= deltaTime;
        
        if (effect.duration <= 0) {
            effect.element.remove();
            game.effects.splice(i, 1);
        }
    }
}

// 生成敌人
function spawnEnemies(timestamp) {
    if (timestamp - game.lastEnemySpawn > game.enemySpawnRate) {
        game.lastEnemySpawn = timestamp;
        
        // 根据难度调整生成数量
        const spawnCount = Math.min(3, Math.floor(game.difficulty / 5) + 1);
        
        for (let i = 0; i < spawnCount; i++) {
            // 随机选择敌人类型
            const enemyTypes = ['sword', 'gun', 'shield'];
            const type = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
            
            // 随机生成位置（左右两侧）
            const side = Math.random() > 0.5 ? 'left' : 'right';
            let x;
            
            if (side === 'left') {
                x = -100;
            } else {
                x = 4100;
            }
            
            // 创建敌人
            createEnemy(type, x);
        }
    }
}

// 创建敌人
function createEnemy(type, x) {
    const enemy = document.createElement('div');
    enemy.className = `enemy ${type}-enemy`;
    
    // 敌人身体部件
    enemy.innerHTML = `
        <div class="enemy-head"></div>
        <div class="enemy-body"></div>
        <div class="enemy-arm left"></div>
        <div class="enemy-arm right"></div>
        <div class="enemy-leg left"></div>
        <div class="enemy-leg right"></div>
        ${type === 'shield' ? '<div class="shield"></div>' : ''}
        ${type === 'sword' ? '<div class="enemy-weapon sword"></div>' : ''}
        ${type === 'gun' ? '<div class="enemy-weapon gun"></div>' : ''}
    `;
    
    // 设置位置
    enemy.style.left = x + 'px';
    game.scene.appendChild(enemy);
    
    // 添加到敌人数组
    game.enemies.push({
        element: enemy,
        type: type,
        x: x,
        isAttacking: false,
        isShooting: false
    });
}

// 检查敌人是否被击中
function checkEnemyHit(enemy, index) {
    const enemyRect = enemy.element.getBoundingClientRect();
    
    // 检查是否被剑击中
    if (game.isAttacking && game.sword.style.display === 'block') {
        const swordRect = game.sword.getBoundingClientRect();
        
        // 简单的矩形碰撞检测
        if (rectsOverlap(swordRect, enemyRect)) {
            // 盾兵只能被剑击中
            if (enemy.type === 'shield' || enemy.type === 'sword') {
                killEnemy(enemy, index);
                createHitEffect(enemyRect.left + 35, enemyRect.top + 70);
                game.score += 10;
                game.scoreElement.textContent = game.score;
            }
        }
    }
    
    // 检查是否被子弹击中
    for (let i = game.bullets.length - 1; i >= 0; i--) {
        const bullet = game.bullets[i];
        
        // 只有玩家子弹能击中敌人
        if (!bullet.isPlayerBullet) continue;
        
        const bulletRect = bullet.element.getBoundingClientRect();
        
        if (rectsOverlap(bulletRect, enemyRect)) {
            // 盾兵不能被子弹击中
            if (enemy.type !== 'shield') {
                killEnemy(enemy, index);
                createHitEffect(enemyRect.left + 35, enemyRect.top + 70);
                game.score += 10;
                game.scoreElement.textContent = game.score;
            }
            
            // 移除子弹
            bullet.element.remove();
            game.bullets.splice(i, 1);
            break;
        }
    }
}

// 检查子弹碰撞
function checkBulletCollision(bullet, bulletIndex) {
    const bulletRect = bullet.element.getBoundingClientRect();
    const playerRect = game.player.getBoundingClientRect();
    
    // 敌人子弹检查是否击中玩家
    if (!bullet.isPlayerBullet) {
        // 检查是否被剑挡开
        if (game.isAttacking && game.sword.style.display === 'block') {
            const swordRect = game.sword.getBoundingClientRect();
            
            if (rectsOverlap(bulletRect, swordRect)) {
                // 挡开子弹
                createHitEffect(bulletRect.left, bulletRect.top);
                bullet.element.remove();
                game.bullets.splice(bulletIndex, 1);
                return;
            }
        }
        
        // 检查是否击中玩家
        if (rectsOverlap(bulletRect, playerRect)) {
            // 玩家受伤
            takeDamage(1);
            createHitEffect(playerRect.left + 40, playerRect.top + 80);
            bullet.element.remove();
            game.bullets.splice(bulletIndex, 1);
        }
    }
    
    // 玩家子弹检查是否击中敌人子弹
    if (bullet.isPlayerBullet) {
        for (let i = 0; i < game.bullets.length; i++) {
            const otherBullet = game.bullets[i];
            
            if (otherBullet === bullet || otherBullet.isPlayerBullet) continue;
            
            const otherBulletRect = otherBullet.element.getBoundingClientRect();
            
            if (rectsOverlap(bulletRect, otherBulletRect)) {
                // 子弹相撞，都消失
                createHitEffect(bulletRect.left, bulletRect.top);
                bullet.element.remove();
                game.bullets.splice(bulletIndex, 1);
                
                otherBullet.element.remove();
                game.bullets.splice(i, 1);
                break;
            }
        }
    }
}

// 敌人攻击玩家
function attackPlayer(enemy) {
    const enemyRect = enemy.element.getBoundingClientRect();
    const playerRect = game.player.getBoundingClientRect();
    
    // 检查距离
    const distance = Math.abs(enemyRect.left - playerRect.left);
    
    if (distance < 100) {
        takeDamage(1);
        createHitEffect(playerRect.left + 40, playerRect.top + 80);
    }
}

// 敌人向玩家射击 - 修复子弹位置
function shootAtPlayer(enemy) {
    const enemyX = enemy.x;
    const playerX = parseInt(game.player.style.left) || 500;
    
    // 确定射击方向
    const direction = enemyX < playerX ? 'right' : 'left';
    
    // 计算子弹生成位置（相对于场景）
    let bulletX;
    if (direction === 'right') {
        bulletX = enemyX + 70; // 从敌人右侧发射
    } else {
        bulletX = enemyX; // 从敌人左侧发射
    }
    
    // 创建子弹（Y位置固定为玩家高度附近）
    createBullet(
        bulletX,
        150, // 地面高度 + 玩家高度
        direction,
        false // 敌人子弹
    );
}

// 创建子弹 - 修复子弹位置问题
function createBullet(x, y, direction, isPlayerBullet = true) {
    const bullet = document.createElement('div');
    bullet.className = `bullet ${isPlayerBullet ? 'player-bullet' : 'enemy-bullet'}`;
    bullet.style.left = x + 'px';
    bullet.style.top = (600 - y) + 'px'; // 转换为场景内的Y坐标
    game.scene.appendChild(bullet);
    
    game.bullets.push({
        element: bullet,
        x: x,
        y: (600 - y),
        speed: isPlayerBullet ? 15 : 10,
        direction: direction,
        isPlayerBullet: isPlayerBullet
    });
}

// 创建命中特效
function createHitEffect(x, y) {
    const effect = document.createElement('div');
    effect.className = 'hit-effect';
    effect.style.left = x + 'px';
    effect.style.top = y + 'px';
    game.scene.appendChild(effect);
    
    game.effects.push({
        element: effect,
        duration: 500
    });
}

// 创建死亡特效
function createDeathEffect(x, y) {
    const effect = document.createElement('div');
    effect.className = 'death-effect';
    effect.style.left = x + 'px';
    effect.style.top = y + 'px';
    game.scene.appendChild(effect);
    
    game.effects.push({
        element: effect,
        duration: 800
    });
}

// 杀死敌人
function killEnemy(enemy, index) {
    const enemyRect = enemy.element.getBoundingClientRect();
    createDeathEffect(enemyRect.left + 35, enemyRect.top + 70);
    enemy.element.remove();
    game.enemies.splice(index, 1);
}

// 玩家受到伤害
function takeDamage(amount) {
    game.playerHealth -= amount;
    updateHealth();
    
    // 屏幕闪烁效果
    game.scene.style.backgroundColor = '#ff0000';
    setTimeout(() => {
        game.scene.style.backgroundColor = '';
    }, 100);
    
    // 检查游戏结束
    if (game.playerHealth <= 0) {
        gameOver();
    }
}

// 更新生命值显示
function updateHealth() {
    const healthPercent = (game.playerHealth / game.playerMaxHealth) * 100;
    game.healthFill.style.width = healthPercent + '%';
    game.healthText.textContent = game.playerHealth;
}

// 更新游戏难度
function updateDifficulty(timestamp) {
    // 每30秒增加一次难度
    game.difficulty = 1 + Math.floor(timestamp / 30000);
    
    // 增加敌人生成频率
    game.enemySpawnRate = Math.max(500, 1500 - game.difficulty * 100);
}

// 玩家攻击（剑） - 修复双向攻击
function swordAttack() {
    if (game.isAttacking || game.attackCooldown) return;
    
    game.isAttacking = true;
    game.sword.style.display = 'block';
    
    // 攻击动画 - 根据方向调整
    const swordArm = document.querySelector('.player-arm.right');
    if (game.playerDirection === 'right') {
        swordArm.style.transform = 'rotate(-60deg)';
    } else {
        swordArm.style.transform = 'rotate(60deg)';
    }
    
    // 攻击结束后重置
    setTimeout(() => {
        game.isAttacking = false;
        game.sword.style.display = 'none';
        swordArm.style.transform = '';
        game.attackCooldown = true;
        
        // 攻击冷却
        setTimeout(() => {
            game.attackCooldown = false;
        }, 300);
    }, 200);
}

// 玩家攻击（枪） - 修复双向攻击
function gunAttack() {
    if (game.attackCooldown) return;
    
    const playerX = parseInt(game.player.style.left) || 500;
    
    // 根据玩家方向计算子弹生成位置
    let bulletX;
    if (game.playerDirection === 'right') {
        bulletX = playerX + 80; // 从玩家右侧发射
    } else {
        bulletX = playerX; // 从玩家左侧发射
    }
    
    createBullet(bulletX, 150, game.playerDirection, true);
    
    // 显示枪
    game.gun.style.display = 'block';
    
    // 攻击动画 - 根据方向调整
    const gunArm = document.querySelector('.player-arm.right');
    if (game.playerDirection === 'right') {
        gunArm.style.transform = 'translateY(-5px)';
    } else {
        gunArm.style.transform = 'translateY(-5px) rotate(180deg)';
    }
    
    // 攻击结束后重置
    setTimeout(() => {
        game.gun.style.display = 'none';
        gunArm.style.transform = '';
        game.attackCooldown = true;
        
        // 攻击冷却
        setTimeout(() => {
            game.attackCooldown = false;
        }, 500);
    }, 100);
}

// 游戏结束
function gameOver() {
    game.isRunning = false;
    game.messageTitle.textContent = '游戏结束';
    game.messageText.textContent = '你的得分:';
    game.finalScore.textContent = game.score;
    game.gameMessage.style.display = 'block';
}

// 矩形碰撞检测
function rectsOverlap(rect1, rect2) {
    return !(rect1.right < rect2.left || 
             rect1.left > rect2.right || 
             rect1.bottom < rect2.top || 
             rect1.top > rect2.bottom);
}

// 事件监听器
function setupEventListeners() {
    // 键盘控制
    document.addEventListener('keydown', (e) => {
        switch(e.key) {
            case 'ArrowLeft':
            case 'a':
            case 'A':
                game.keys.left = true;
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                game.keys.right = true;
                break;
            case 'j':
            case 'J':
                swordAttack();
                break;
            case 'k':
            case 'K':
                gunAttack();
                break;
        }
    });
    
    document.addEventListener('keyup', (e) => {
        switch(e.key) {
            case 'ArrowLeft':
            case 'a':
            case 'A':
                game.keys.left = false;
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                game.keys.right = false;
                break;
        }
    });
    
    // 重新开始按钮
    game.restartBtn.addEventListener('click', initGame);
    
    // 关闭操作提示
    if (game.closeInstructionsBtn) {
        game.closeInstructionsBtn.addEventListener('click', () => {
            game.instructions.style.opacity = '0';
            setTimeout(() => {
                game.instructions.style.display = 'none';
            }, 300);
        });
    }
    
    // 窗口大小调整时更新游戏尺寸
    window.addEventListener('resize', () => {
        // 重新计算最大场景位置
        const screenWidth = window.innerWidth;
        game.maxScenePosition = 4000 - screenWidth;
    });
}

// 初始化游戏
window.onload = function() {
    setupEventListeners();
    initGame();
    
    // 初始武器位置
    updateWeaponPosition();
    
    // 初始化窗口大小
    const screenWidth = window.innerWidth;
    game.maxScenePosition = 4000 - screenWidth;
};
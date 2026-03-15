// 游戏状态
const gameState = {
    gold: 100,
    lives: 20,
    currentWave: 0,
    totalWaves: 10,
    isPaused: false,
    isGameOver: false,
    selectedTower: null,
    currentLevel: 1,
    towers: [],
    monsters: [],
    bullets: [],
    towerSpots: [],
    path: [],
    gameInterval: null,
    waveInterval: null,
    waveTimer: 0,
    isRemoveMode: false,
    towerToRemove: null,
    waveCompleted: false
};

// 防御塔数据
const towersData = [
    { id: 1, name: "胡萝卜炮", icon: "🥕", cost: 0, damage: 5, range: 120, speed: 1000, color: "#FF8A65", description: "免费但攻击力低" },
    { id: 2, name: "西瓜投手", icon: "🍉", cost: 30, damage: 15, range: 140, speed: 1500, color: "#4CAF50", description: "中等伤害，范围攻击" },
    { id: 3, name: "冰冻草莓", icon: "🍓", cost: 50, damage: 10, range: 130, speed: 2000, color: "#E91E63", description: "减缓敌人速度" },
    { id: 4, name: "菠萝炸弹", icon: "🍍", cost: 80, damage: 40, range: 100, speed: 3000, color: "#FFC107", description: "高伤害，爆炸范围" }
];

// 怪物数据
const monstersData = [
    { id: 1, name: "小蘑菇", icon: "🍄", health: 20, speed: 1.5, gold: 5, color: "#FF6B6B" },
    { id: 2, name: "南瓜怪", icon: "🎃", health: 40, speed: 1.0, gold: 10, color: "#FFA726" },
    { id: 3, name: "幽灵糖", icon: "👻", health: 30, speed: 2.0, gold: 8, color: "#AB47BC" },
    { id: 4, name: "蛋糕巨人", icon: "🍰", health: 100, speed: 0.5, gold: 25, color: "#FF4081" }
];

// 关卡地图数据
const levelsData = {
    1: {
        name: "森林关卡",
        backgroundColor: "#b8e6d0",
        pathColor: "#8BC34A",
        path: [
            { x: 0, y: 150 },
            { x: 200, y: 150 },
            { x: 200, y: 300 },
            { x: 400, y: 300 },
            { x: 400, y: 100 },
            { x: 600, y: 100 },
            { x: 600, y: 250 },
            { x: 800, y: 250 }
        ],
        towerSpots: [
            { x: 100, y: 50 },
            { x: 300, y: 200 },
            { x: 150, y: 250 },
            { x: 350, y: 50 },
            { x: 500, y: 200 },
            { x: 500, y: 50 },
            { x: 650, y: 200 },
            { x: 700, y: 100 }
        ]
    },
    2: {
        name: "沙漠关卡",
        backgroundColor: "#FFE082",
        pathColor: "#FFB74D",
        path: [
            { x: 0, y: 100 },
            { x: 150, y: 100 },
            { x: 150, y: 250 },
            { x: 350, y: 250 },
            { x: 350, y: 100 },
            { x: 550, y: 100 },
            { x: 550, y: 300 },
            { x: 750, y: 300 }
        ],
        towerSpots: [
            { x: 50, y: 200 },
            { x: 250, y: 50 },
            { x: 250, y: 200 },
            { x: 450, y: 200 },
            { x: 400, y: 50 },
            { x: 600, y: 200 },
            { x: 700, y: 100 },
            { x: 700, y: 250 }
        ]
    },
    3: {
        name: "雪地关卡",
        backgroundColor: "#B3E5FC",
        pathColor: "#4FC3F7",
        path: [
            { x: 0, y: 200 },
            { x: 100, y: 200 },
            { x: 100, y: 100 },
            { x: 300, y: 100 },
            { x: 300, y: 250 },
            { x: 500, y: 250 },
            { x: 500, y: 150 },
            { x: 700, y: 150 },
            { x: 700, y: 300 },
            { x: 800, y: 300 }
        ],
        towerSpots: [
            { x: 200, y: 50 },
            { x: 200, y: 200 },
            { x: 400, y: 50 },
            { x: 400, y: 200 },
            { x: 600, y: 50 },
            { x: 600, y: 200 },
            { x: 750, y: 50 },
            { x: 750, y: 250 }
        ]
    }
};

// 初始化游戏
function initGame() {
    // 重置游戏状态
    gameState.gold = 100;
    gameState.lives = 20;
    gameState.currentWave = 0;
    gameState.isPaused = false;
    gameState.isGameOver = false;
    gameState.selectedTower = null;
    gameState.towers = [];
    gameState.monsters = [];
    gameState.bullets = [];
    gameState.towerSpots = [];
    gameState.path = [];
    gameState.isRemoveMode = false;
    gameState.towerToRemove = null;
    gameState.waveCompleted = false;
    
    // 清除任何现有的游戏间隔
    if (gameState.gameInterval) clearInterval(gameState.gameInterval);
    if (gameState.waveInterval) clearInterval(gameState.waveInterval);
    
    // 更新UI
    updateUI();
    
    // 初始化当前关卡
    loadLevel(gameState.currentLevel);
    
    // 初始化防御塔商店
    initTowerShop();
    
    // 初始化怪物图鉴
    initMonsterInfo();
    
    // 设置事件监听器
    setupEventListeners();
    
    // 显示开始消息
    showMessage("欢迎来到梦幻塔防", `选择防御塔放置在空位上，然后点击"开始波次"按钮。第一座胡萝卜炮是免费的!`);
}

// 加载关卡
function loadLevel(level) {
    gameState.currentLevel = level;
    const levelData = levelsData[level];
    const gameMap = document.getElementById('game-map');
    
    // 更新地图背景
    gameMap.style.backgroundColor = levelData.backgroundColor;
    
    // 清除地图内容
    gameMap.innerHTML = '';
    
    // 绘制路径
    drawPath(levelData.path, levelData.pathColor);
    
    // 保存路径到游戏状态
    gameState.path = levelData.path;
    
    // 创建防御塔放置点
    createTowerSpots(levelData.towerSpots);
    
    // 更新关卡按钮状态
    document.querySelectorAll('.level-btn').forEach(btn => {
        if (parseInt(btn.dataset.level) === level) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // 更新波次信息
    updateWaveInfo();
    
    // 重置移除模式
    exitRemoveMode();
}

// 绘制路径
function drawPath(pathPoints, color) {
    const gameMap = document.getElementById('game-map');
    
    // 绘制路径线
    for (let i = 0; i < pathPoints.length - 1; i++) {
        const start = pathPoints[i];
        const end = pathPoints[i + 1];
        
        const pathSegment = document.createElement('div');
        pathSegment.className = 'path';
        
        // 计算线段的长度和角度
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;
        
        // 设置线段样式
        pathSegment.style.width = `${length}px`;
        pathSegment.style.height = '30px';
        pathSegment.style.left = `${start.x}px`;
        pathSegment.style.top = `${start.y - 15}px`;
        pathSegment.style.transform = `rotate(${angle}deg)`;
        pathSegment.style.transformOrigin = '0 0';
        pathSegment.style.backgroundColor = color;
        
        gameMap.appendChild(pathSegment);
    }
    
    // 绘制起点和终点
    const startPoint = pathPoints[0];
    const endPoint = pathPoints[pathPoints.length - 1];
    
    const startMarker = document.createElement('div');
    startMarker.style.position = 'absolute';
    startMarker.style.left = `${startPoint.x - 15}px`;
    startMarker.style.top = `${startPoint.y - 15}px`;
    startMarker.style.width = '30px';
    startMarker.style.height = '30px';
    startMarker.style.borderRadius = '50%';
    startMarker.style.backgroundColor = '#4CAF50';
    startMarker.style.display = 'flex';
    startMarker.style.justifyContent = 'center';
    startMarker.style.alignItems = 'center';
    startMarker.style.color = 'white';
    startMarker.innerHTML = '<i class="fas fa-flag-checkered"></i>';
    gameMap.appendChild(startMarker);
    
    const endMarker = document.createElement('div');
    endMarker.style.position = 'absolute';
    endMarker.style.left = `${endPoint.x - 15}px`;
    endMarker.style.top = `${endPoint.y - 15}px`;
    endMarker.style.width = '30px';
    endMarker.style.height = '30px';
    endMarker.style.borderRadius = '50%';
    endMarker.style.backgroundColor = '#FF5252';
    endMarker.style.display = 'flex';
    endMarker.style.justifyContent = 'center';
    endMarker.style.alignItems = 'center';
    endMarker.style.color = 'white';
    endMarker.innerHTML = '<i class="fas fa-home"></i>';
    gameMap.appendChild(endMarker);
}

// 创建防御塔放置点
function createTowerSpots(spots) {
    const gameMap = document.getElementById('game-map');
    gameState.towerSpots = [];
    
    spots.forEach(spot => {
        const towerSpot = document.createElement('div');
        towerSpot.className = 'tower-spot';
        towerSpot.style.left = `${spot.x - 25}px`;
        towerSpot.style.top = `${spot.y - 25}px`;
        
        // 添加点击事件
        towerSpot.addEventListener('click', () => placeTower(spot));
        
        gameMap.appendChild(towerSpot);
        gameState.towerSpots.push({ element: towerSpot, x: spot.x, y: spot.y, occupied: false });
    });
}

// 初始化防御塔商店
function initTowerShop() {
    const towerList = document.getElementById('tower-list');
    towerList.innerHTML = '';
    
    towersData.forEach(tower => {
        const towerItem = document.createElement('div');
        towerItem.className = 'tower-item';
        towerItem.dataset.towerId = tower.id;
        
        const costClass = tower.cost === 0 ? 'free' : '';
        
        towerItem.innerHTML = `
            <div class="tower-icon">${tower.icon}</div>
            <div class="tower-name">${tower.name}</div>
            <div class="tower-cost ${costClass}">${tower.cost === 0 ? '免费' : tower.cost + '金币'}</div>
            <div class="tower-stats">伤害: ${tower.damage} | 范围: ${tower.range}px</div>
            <div class="tower-stats">${tower.description}</div>
        `;
        
        // 添加点击事件
        towerItem.addEventListener('click', () => selectTower(tower.id));
        
        towerList.appendChild(towerItem);
    });
}

// 初始化怪物图鉴
function initMonsterInfo() {
    const monsterList = document.getElementById('monster-list');
    monsterList.innerHTML = '';
    
    monstersData.forEach(monster => {
        const monsterItem = document.createElement('div');
        monsterItem.className = 'monster-item';
        
        monsterItem.innerHTML = `
            <div class="monster-icon">${monster.icon}</div>
            <div class="monster-name">${monster.name}</div>
            <div class="tower-stats">生命: ${monster.health}</div>
            <div class="tower-stats">金币: ${monster.gold}</div>
        `;
        
        monsterList.appendChild(monsterItem);
    });
}

// 选择防御塔
function selectTower(towerId) {
    // 如果已经选择了这个防御塔，取消选择
    if (gameState.selectedTower === towerId) {
        gameState.selectedTower = null;
        document.querySelectorAll('.tower-item').forEach(item => {
            item.classList.remove('selected');
        });
        return;
    }
    
    // 退出移除模式
    exitRemoveMode();
    
    // 选择新的防御塔
    gameState.selectedTower = towerId;
    
    // 更新UI
    document.querySelectorAll('.tower-item').forEach(item => {
        if (parseInt(item.dataset.towerId) === towerId) {
            item.classList.add('selected');
        } else {
            item.classList.remove('selected');
        }
    });
}

// 进入移除模式
function enterRemoveMode() {
    gameState.isRemoveMode = true;
    gameState.selectedTower = null;
    
    // 更新UI
    document.querySelectorAll('.tower-item').forEach(item => {
        item.classList.remove('selected');
    });
    
    // 显示移除模式指示器
    const indicator = document.createElement('div');
    indicator.className = 'remove-mode-indicator';
    indicator.id = 'remove-mode-indicator';
    indicator.innerHTML = '<i class="fas fa-trash"></i> 拆除模式：点击炮台进行拆除';
    document.body.appendChild(indicator);
    document.getElementById('remove-mode-indicator').style.display = 'block';
    
    // 为所有炮台添加移除模式样式
    gameState.towers.forEach(tower => {
        const towerElement = document.getElementById(`tower-${tower.id}`);
        if (towerElement) {
            towerElement.classList.add('selected-for-removal');
        }
    });
}

// 退出移除模式
function exitRemoveMode() {
    gameState.isRemoveMode = false;
    gameState.towerToRemove = null;
    
    // 隐藏移除模式指示器
    const indicator = document.getElementById('remove-mode-indicator');
    if (indicator) {
        indicator.remove();
    }
    
    // 移除所有炮台的移除模式样式
    gameState.towers.forEach(tower => {
        const towerElement = document.getElementById(`tower-${tower.id}`);
        if (towerElement) {
            towerElement.classList.remove('selected-for-removal');
        }
    });
    
    // 隐藏拆除按钮
    document.getElementById('remove-tower-btn').style.display = 'none';
    document.getElementById('cancel-remove-btn').style.display = 'none';
}

// 放置防御塔
function placeTower(spot) {
    if (gameState.isRemoveMode) {
        return; // 在移除模式下不能放置炮台
    }
    
    if (!gameState.selectedTower) {
        showMessage("请选择防御塔", "请先从右侧商店选择一种防御塔。");
        return;
    }
    
    // 检查这个位置是否已经被占用
    const towerSpot = gameState.towerSpots.find(s => 
        Math.abs(s.x - spot.x) < 5 && Math.abs(s.y - spot.y) < 5
    );
    
    if (towerSpot && towerSpot.occupied) {
        showMessage("位置已被占用", "这个位置已经有一座防御塔了，请选择其他位置。");
        return;
    }
    
    // 获取防御塔数据
    const towerData = towersData.find(t => t.id === gameState.selectedTower);
    
    // 检查金币是否足够
    if (gameState.gold < towerData.cost) {
        showMessage("金币不足", `你需要${towerData.cost}金币来建造${towerData.name}，但你现在只有${gameState.gold}金币。`);
        return;
    }
    
    // 扣除金币
    if (towerData.cost > 0) {
        gameState.gold -= towerData.cost;
        updateUI();
    }
    
    // 创建防御塔
    const tower = {
        id: gameState.towers.length + 1,
        type: towerData.id,
        x: spot.x,
        y: spot.y,
        damage: towerData.damage,
        range: towerData.range,
        speed: towerData.speed,
        color: towerData.color,
        icon: towerData.icon,
        cost: towerData.cost,
        lastShot: Date.now()
    };
    
    // 添加到游戏状态
    gameState.towers.push(tower);
    
    // 标记位置为已占用
    if (towerSpot) {
        towerSpot.occupied = true;
        towerSpot.element.style.display = 'none';
    }
    
    // 在页面上显示防御塔
    const gameMap = document.getElementById('game-map');
    const towerElement = document.createElement('div');
    towerElement.className = 'tower';
    towerElement.id = `tower-${tower.id}`;
    towerElement.style.left = `${spot.x - 20}px`;
    towerElement.style.top = `${spot.y - 20}px`;
    towerElement.style.backgroundColor = tower.color;
    towerElement.innerHTML = tower.icon;
    
    // 添加点击事件（用于拆除）
    towerElement.addEventListener('click', (e) => {
        e.stopPropagation();
        if (gameState.isRemoveMode) {
            selectTowerForRemoval(tower.id);
        }
    });
    
    gameMap.appendChild(towerElement);
    
    // 取消选择防御塔
    gameState.selectedTower = null;
    document.querySelectorAll('.tower-item').forEach(item => {
        item.classList.remove('selected');
    });
}

// 选择要拆除的炮台
function selectTowerForRemoval(towerId) {
    const tower = gameState.towers.find(t => t.id === towerId);
    if (!tower) return;
    
    gameState.towerToRemove = tower;
    
    // 高亮选中的炮台
    gameState.towers.forEach(t => {
        const towerElement = document.getElementById(`tower-${t.id}`);
        if (towerElement) {
            if (t.id === towerId) {
                towerElement.classList.add('selected-for-removal');
            } else {
                towerElement.classList.remove('selected-for-removal');
            }
        }
    });
    
    // 显示拆除确认
    showMessage(
        "拆除炮台", 
        `确定要拆除 ${towersData.find(t => t.id === tower.type).name} 吗？<br>拆除将返还 ${Math.floor(tower.cost * 0.5)} 金币。`,
        true
    );
}

// 拆除炮台
function removeTower() {
    if (!gameState.towerToRemove) return;
    
    const tower = gameState.towerToRemove;
    
    // 返还金币（50%）
    const refund = Math.floor(tower.cost * 0.5);
    gameState.gold += refund;
    
    // 从游戏状态中移除
    gameState.towers = gameState.towers.filter(t => t.id !== tower.id);
    
    // 释放塔位
    const towerSpot = gameState.towerSpots.find(s => 
        Math.abs(s.x - tower.x) < 5 && Math.abs(s.y - tower.y) < 5
    );
    if (towerSpot) {
        towerSpot.occupied = false;
        towerSpot.element.style.display = 'flex';
    }
    
    // 从页面移除
    const towerElement = document.getElementById(`tower-${tower.id}`);
    if (towerElement) {
        towerElement.remove();
    }
    
    // 更新UI
    updateUI();
    
    // 退出移除模式
    exitRemoveMode();
    hideMessage();
}

// 开始波次
function startWave() {
    if (gameState.currentWave >= gameState.totalWaves) {
        showMessage("游戏胜利!", "恭喜你成功防御了所有怪物!");
        return;
    }
    
    // 如果波次已完成，重新开始波次
    if (gameState.waveCompleted) {
        gameState.waveCompleted = false;
        document.getElementById('start-wave').innerHTML = '<i class="fas fa-forward"></i> 下一波';
    }
    
    // 隐藏任何可能的消息
    hideMessage();
    
    // 更新波次
    gameState.currentWave++;
    updateWaveInfo();
    
    // 生成怪物
    generateMonstersForWave();
    
    // 开始游戏循环
    if (!gameState.gameInterval) {
        gameState.gameInterval = setInterval(gameLoop, 50);
    }
    
    // 更新按钮文本
    document.getElementById('start-wave').innerHTML = '<i class="fas fa-forward"></i> 下一波';
    
    // 禁用开始按钮直到当前波次结束
    document.getElementById('start-wave').disabled = true;
    gameState.waveCompleted = false;
}

// 为当前波次生成怪物
function generateMonstersForWave() {
    // 根据波次决定怪物数量和类型
    const baseCount = 5;
    const waveMultiplier = Math.floor(gameState.currentWave / 3) + 1;
    const monsterCount = baseCount + waveMultiplier * 2;
    
    // 确定怪物类型（随着波次增加，出现更强的怪物）
    let monsterTypes = [1]; // 第一波只有小蘑菇
    
    if (gameState.currentWave >= 3) monsterTypes.push(2); // 第三波加入南瓜怪
    if (gameState.currentWave >= 5) monsterTypes.push(3); // 第五波加入幽灵糖
    if (gameState.currentWave >= 8) monsterTypes.push(4); // 第八波加入蛋糕巨人
    
    // 生成怪物
    for (let i = 0; i < monsterCount; i++) {
        // 随机选择怪物类型
        const monsterType = monsterTypes[Math.floor(Math.random() * monsterTypes.length)];
        const monsterData = monstersData.find(m => m.id === monsterType);
        
        // 增加后期波次的怪物血量
        const healthMultiplier = 1 + (gameState.currentWave - 1) * 0.2;
        const monsterHealth = Math.floor(monsterData.health * healthMultiplier);
        
        const monster = {
            id: gameState.monsters.length + 1,
            type: monsterType,
            health: monsterHealth,
            maxHealth: monsterHealth,
            speed: monsterData.speed,
            gold: monsterData.gold,
            color: monsterData.color,
            icon: monsterData.icon,
            pathIndex: 0,
            x: gameState.path[0].x,
            y: gameState.path[0].y,
            progress: 0
        };
        
        gameState.monsters.push(monster);
        
        // 在页面上显示怪物
        const gameMap = document.getElementById('game-map');
        const monsterElement = document.createElement('div');
        monsterElement.className = 'monster';
        monsterElement.id = `monster-${monster.id}`;
        monsterElement.style.left = `${monster.x - 20}px`;
        monsterElement.style.top = `${monster.y - 20}px`;
        monsterElement.style.backgroundColor = monster.color;
        monsterElement.innerHTML = monster.icon;
        gameMap.appendChild(monsterElement);
        
        // 添加血条
        const healthBar = document.createElement('div');
        healthBar.style.position = 'absolute';
        healthBar.style.width = '40px';
        healthBar.style.height = '5px';
        healthBar.style.backgroundColor = '#FF5252';
        healthBar.style.bottom = '-8px';
        healthBar.style.left = '0';
        healthBar.style.borderRadius = '2px';
        healthBar.style.overflow = 'hidden';
        
        const healthFill = document.createElement('div');
        healthFill.id = `monster-health-${monster.id}`;
        healthFill.style.width = '100%';
        healthFill.style.height = '100%';
        healthFill.style.backgroundColor = '#4CAF50';
        healthFill.style.transition = 'width 0.3s';
        
        healthBar.appendChild(healthFill);
        monsterElement.appendChild(healthBar);
    }
}

// 游戏主循环
function gameLoop() {
    if (gameState.isPaused || gameState.isGameOver) return;
    
    // 移动怪物
    moveMonsters();
    
    // 防御塔攻击
    towersAttack();
    
    // 移动子弹
    moveBullets();
    
    // 检查游戏是否结束
    if (gameState.lives <= 0) {
        gameOver();
        return;
    }
    
    // 检查波次是否结束
    if (gameState.monsters.length === 0 && gameState.currentWave > 0 && !gameState.waveCompleted) {
        waveComplete();
    }
}

// 移动怪物
function moveMonsters() {
    gameState.monsters.forEach(monster => {
        // 获取当前路径段
        if (monster.pathIndex >= gameState.path.length - 1) {
            // 怪物到达终点
            gameState.lives--;
            updateUI();
            removeMonster(monster.id);
            return;
        }
        
        const startPoint = gameState.path[monster.pathIndex];
        const endPoint = gameState.path[monster.pathIndex + 1];
        
        // 计算移动方向
        const dx = endPoint.x - startPoint.x;
        const dy = endPoint.y - startPoint.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // 更新进度
        monster.progress += monster.speed / distance;
        
        // 如果到达当前路径段的终点，切换到下一段
        if (monster.progress >= 1) {
            monster.pathIndex++;
            monster.progress = 0;
            
            // 如果到达终点
            if (monster.pathIndex >= gameState.path.length - 1) {
                monster.x = endPoint.x;
                monster.y = endPoint.y;
            }
        } else {
            // 计算当前位置
            monster.x = startPoint.x + dx * monster.progress;
            monster.y = startPoint.y + dy * monster.progress;
        }
        
        // 更新怪物位置
        const monsterElement = document.getElementById(`monster-${monster.id}`);
        if (monsterElement) {
            monsterElement.style.left = `${monster.x - 20}px`;
            monsterElement.style.top = `${monster.y - 20}px`;
        }
    });
}

// 防御塔攻击
function towersAttack() {
    const now = Date.now();
    
    gameState.towers.forEach(tower => {
        // 检查冷却时间
        if (now - tower.lastShot < tower.speed) return;
        
        // 寻找目标
        const target = findTarget(tower);
        
        if (target) {
            // 发射子弹
            shootBullet(tower, target);
            tower.lastShot = now;
        }
    });
}

// 寻找目标
function findTarget(tower) {
    let target = null;
    let closestDistance = tower.range;
    
    gameState.monsters.forEach(monster => {
        const dx = monster.x - tower.x;
        const dy = monster.y - tower.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < closestDistance) {
            closestDistance = distance;
            target = monster;
        }
    });
    
    return target;
}

// 发射子弹 - BUG修复：修正子弹碰撞检测
function shootBullet(tower, target) {
    const bullet = {
        id: gameState.bullets.length + 1,
        towerId: tower.id,
        targetId: target.id,
        x: tower.x,
        y: tower.y,
        damage: tower.damage,
        color: tower.color,
        speed: 8,
        targetX: target.x,
        targetY: target.y
    };
    
    gameState.bullets.push(bullet);
    
    // 创建子弹元素
    const gameMap = document.getElementById('game-map');
    const bulletElement = document.createElement('div');
    bulletElement.className = 'bullet';
    bulletElement.id = `bullet-${bullet.id}`;
    bulletElement.style.left = `${bullet.x - 5}px`;
    bulletElement.style.top = `${bullet.y - 5}px`;
    bulletElement.style.backgroundColor = bullet.color;
    gameMap.appendChild(bulletElement);
}

// 移动子弹 - BUG修复：改进子弹碰撞检测
function moveBullets() {
    for (let i = gameState.bullets.length - 1; i >= 0; i--) {
        const bullet = gameState.bullets[i];
        
        // 获取目标
        const target = gameState.monsters.find(m => m.id === bullet.targetId);
        
        if (!target) {
            // 目标已不存在，移除子弹
            removeBullet(bullet.id);
            continue;
        }
        
        // 更新目标位置（因为怪物在移动）
        bullet.targetX = target.x;
        bullet.targetY = target.y;
        
        // 计算子弹方向
        const dx = bullet.targetX - bullet.x;
        const dy = bullet.targetY - bullet.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // 如果子弹到达目标 - BUG修复：增加碰撞检测距离
        if (distance < 20) {
            // 造成伤害
            dealDamage(target.id, bullet.damage);
            // 移除子弹
            removeBullet(bullet.id);
            continue;
        }
        
        // 移动子弹
        bullet.x += (dx / distance) * bullet.speed;
        bullet.y += (dy / distance) * bullet.speed;
        
        // 更新子弹位置
        const bulletElement = document.getElementById(`bullet-${bullet.id}`);
        if (bulletElement) {
            bulletElement.style.left = `${bullet.x - 5}px`;
            bulletElement.style.top = `${bullet.y - 5}px`;
        }
    }
}

// 造成伤害
function dealDamage(monsterId, damage) {
    const monster = gameState.monsters.find(m => m.id === monsterId);
    if (!monster) return;
    
    monster.health -= damage;
    
    // 更新血条
    const healthFill = document.getElementById(`monster-health-${monsterId}`);
    if (healthFill) {
        const healthPercent = (monster.health / monster.maxHealth) * 100;
        healthFill.style.width = `${healthPercent}%`;
    }
    
    // 如果怪物死亡
    if (monster.health <= 0) {
        // 奖励金币
        gameState.gold += monster.gold;
        updateUI();
        // 移除怪物
        removeMonster(monsterId);
    }
}

// 移除怪物
function removeMonster(monsterId) {
    // 从页面移除
    const monsterElement = document.getElementById(`monster-${monsterId}`);
    if (monsterElement) {
        monsterElement.remove();
    }
    
    // 从游戏状态移除
    gameState.monsters = gameState.monsters.filter(m => m.id !== monsterId);
}

// 移除子弹
function removeBullet(bulletId) {
    // 从页面移除
    const bulletElement = document.getElementById(`bullet-${bulletId}`);
    if (bulletElement) {
        bulletElement.remove();
    }
    
    // 从游戏状态移除
    gameState.bullets = gameState.bullets.filter(b => b.id !== bulletId);
}

// 波次完成 - BUG修复：避免重复触发
function waveComplete() {
    gameState.waveCompleted = true;
    
    // 启用开始按钮
    document.getElementById('start-wave').disabled = false;
    
    // 显示消息 - BUG修复：确保消息可以关闭
    if (gameState.currentWave >= gameState.totalWaves) {
        showMessage("游戏胜利!", "恭喜你成功防御了所有怪物!");
        gameState.isGameOver = true;
        clearInterval(gameState.gameInterval);
        gameState.gameInterval = null;
    } else {
        showMessage(`波次 ${gameState.currentWave} 完成!`, `你成功防御了第 ${gameState.currentWave} 波怪物。准备迎接下一波!`);
    }
    
    // 更新波次信息
    updateWaveInfo();
}

// 游戏结束
function gameOver() {
    gameState.isGameOver = true;
    clearInterval(gameState.gameInterval);
    gameState.gameInterval = null;
    
    showMessage("游戏结束", `你成功防御了 ${gameState.currentWave} 波怪物。点击重新开始按钮再试一次!`);
}

// 更新UI
function updateUI() {
    document.getElementById('gold').textContent = gameState.gold;
    document.getElementById('lives').textContent = gameState.lives;
    document.getElementById('wave').textContent = `${gameState.currentWave}/${gameState.totalWaves}`;
    
    // 更新波次进度条
    const progressPercent = (gameState.currentWave / gameState.totalWaves) * 100;
    document.getElementById('wave-progress').style.width = `${progressPercent}%`;
    
    // 更新波次文本
    const waveText = document.getElementById('wave-text');
    if (gameState.currentWave === 0) {
        waveText.textContent = "准备开始游戏";
    } else if (gameState.currentWave < gameState.totalWaves) {
        waveText.textContent = `波次 ${gameState.currentWave}/${gameState.totalWaves}`;
    } else {
        waveText.textContent = "最终波次!";
    }
}

// 更新波次信息
function updateWaveInfo() {
    const nextWaveInfo = document.getElementById('next-wave-info');
    
    if (gameState.currentWave === 0) {
        nextWaveInfo.textContent = "点击开始波次按钮开始游戏";
    } else if (gameState.currentWave < gameState.totalWaves) {
        nextWaveInfo.textContent = `下一波: 怪物更强更多`;
    } else {
        nextWaveInfo.textContent = "这是最后一波了!";
    }
}

// 显示消息
function showMessage(title, text, isRemoval = false) {
    document.getElementById('message-title').textContent = title;
    document.getElementById('message-text').innerHTML = text;
    document.getElementById('game-message').style.display = 'block';
    
    // 如果是拆除确认，显示额外的按钮
    if (isRemoval) {
        document.getElementById('remove-tower-btn').style.display = 'inline-block';
        document.getElementById('cancel-remove-btn').style.display = 'inline-block';
        document.getElementById('close-message').style.display = 'none';
    } else {
        document.getElementById('remove-tower-btn').style.display = 'none';
        document.getElementById('cancel-remove-btn').style.display = 'none';
        document.getElementById('close-message').style.display = 'inline-block';
    }
}

// 隐藏消息
function hideMessage() {
    document.getElementById('game-message').style.display = 'none';
    document.getElementById('remove-tower-btn').style.display = 'none';
    document.getElementById('cancel-remove-btn').style.display = 'none';
    document.getElementById('close-message').style.display = 'inline-block';
}

// 暂停游戏
function togglePause() {
    gameState.isPaused = !gameState.isPaused;
    const pauseBtn = document.getElementById('pause-game');
    
    if (gameState.isPaused) {
        pauseBtn.innerHTML = '<i class="fas fa-play"></i> 继续游戏';
        pauseBtn.classList.remove('btn-pause');
        pauseBtn.classList.add('btn-start');
    } else {
        pauseBtn.innerHTML = '<i class="fas fa-pause"></i> 暂停游戏';
        pauseBtn.classList.remove('btn-start');
        pauseBtn.classList.add('btn-pause');
    }
}

// 设置事件监听器
function setupEventListeners() {
    // 开始波次按钮
    document.getElementById('start-wave').addEventListener('click', startWave);
    
    // 暂停游戏按钮
    document.getElementById('pause-game').addEventListener('click', togglePause);
    
    // 重新开始按钮
    document.getElementById('restart-game').addEventListener('click', initGame);
    
    // 关闭消息按钮
    document.getElementById('close-message').addEventListener('click', hideMessage);
    
    // 拆除炮台按钮
    document.getElementById('remove-tower-btn').addEventListener('click', removeTower);
    
    // 取消拆除按钮
    document.getElementById('cancel-remove-btn').addEventListener('click', () => {
        exitRemoveMode();
        hideMessage();
    });
    
    // 关卡选择按钮
    document.querySelectorAll('.level-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const level = parseInt(btn.dataset.level);
            loadLevel(level);
        });
    });
    
    // 添加右键菜单事件（用于进入移除模式）
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        if (!gameState.isGameOver && !gameState.isPaused) {
            enterRemoveMode();
        }
    });
    
    // 添加ESC键退出移除模式
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && gameState.isRemoveMode) {
            exitRemoveMode();
            hideMessage();
        }
    });
    
    // 添加点击地图其他地方退出移除模式
    document.getElementById('game-map').addEventListener('click', (e) => {
        if (gameState.isRemoveMode && e.target.className !== 'tower') {
            exitRemoveMode();
            hideMessage();
        }
    });
}

// 初始化游戏
window.onload = initGame;

// 调整地图大小以适应屏幕
window.addEventListener('resize', () => {
    // 如果需要，可以在这里添加响应式调整代码
});
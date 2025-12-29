// 游戏状态变量
let gameState = {
    sun: 300,
    currentLevel: 1,
    wave: 1,
    totalWaves: 5,
    zombiesRemaining: 10,
    gameActive: false,
    selectedPlant: 'sunflower',
    shovelMode: false,
    plants: [],
    zombies: [],
    projectiles: [],
    suns: [],
    cells: [],
    zombieSpawnInterval: null,
    sunSpawnInterval: null,
    gameLoop: null
};

// 植物数据
const plantsData = {
    sunflower: {
        name: '能量花',
        cost: 25,
        emoji: '☀️',
        icon: '<i class="fas fa-sun"></i>',
        color: 'radial-gradient(circle at 30% 30%, #ffff00, #ffaa00)',
        hp: 100,
        ability: 'sunProducer',
        cooldown: 8000
    },
    peashooter: {
        name: '激光射手',
        cost: 50,
        emoji: '⚡',
        icon: '<i class="fas fa-bullseye"></i>',
        color: 'radial-gradient(circle at 30% 30%, #00ff00, #008800)',
        hp: 200,
        ability: 'shooter',
        damage: 35,
        cooldown: 1200
    },
    wallnut: {
        name: '能量盾',
        cost: 25,
        emoji: '🛡️',
        icon: '<i class="fas fa-shield-alt"></i>',
        color: 'radial-gradient(circle at 30% 30%, #ff6600, #cc4400)',
        hp: 1000,
        ability: 'blocker'
    },
    cherrybomb: {
        name: '电磁脉冲',
        cost: 75,
        emoji: '💥',
        icon: '<i class="fas fa-bomb"></i>',
        color: 'radial-gradient(circle at 30% 30%, #ff0000, #880000)',
        hp: 100,
        ability: 'explosive',
        damage: 400,
        cooldown: 0
    }
};

// 僵尸数据
const zombieData = {
    normal: {
        name: '普通僵尸',
        emoji: '🧟',
        icon: '<i class="fas fa-skull"></i>',
        color: 'linear-gradient(to bottom, #00ff00, #008800)',
        speed: 0.3 + Math.random() * 0.2,
        hp: 150,
        damage: 15,
        attackSpeed: 1200
    },
    conehead: {
        name: '路障僵尸',
        emoji: '🧟',
        icon: '<i class="fas fa-hard-hat"></i>',
        color: 'linear-gradient(to bottom, #ff9900, #cc6600)',
        speed: 0.25 + Math.random() * 0.15,
        hp: 350,
        damage: 20,
        attackSpeed: 1200
    },
    fast: {
        name: '快速僵尸',
        emoji: '🏃',
        icon: '<i class="fas fa-running"></i>',
        color: 'linear-gradient(to bottom, #ff00ff, #880088)',
        speed: 0.6 + Math.random() * 0.2,
        hp: 80,
        damage: 10,
        attackSpeed: 800
    }
};

// DOM元素
const sunCountEl = document.getElementById('sunCount');
const currentLevelEl = document.getElementById('currentLevel');
const waveProgressEl = document.getElementById('waveProgress');
const waveCountEl = document.getElementById('waveCount');
const zombiesLeftEl = document.getElementById('zombiesLeft');
const lawnGridEl = document.getElementById('lawnGrid');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const plantOptions = document.querySelectorAll('.plant-option');
const shovelBtn = document.getElementById('shovelBtn');
const gameOverMessage = document.getElementById('gameOverMessage');
const levelCompleteMessage = document.getElementById('levelCompleteMessage');
const tryAgainBtn = document.getElementById('tryAgainBtn');
const nextLevelBtn = document.getElementById('nextLevelBtn');
const finalLevelEl = document.getElementById('finalLevel');

// 初始化游戏网格 - 修复BUG1：确保网格正确生成
function initLawnGrid() {
    lawnGridEl.innerHTML = '';
    gameState.cells = [];
    
    const rows = 5;
    const cols = 9;
    
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const cell = document.createElement('div');
            cell.className = 'lawn-cell';
            cell.dataset.row = row;
            cell.dataset.col = col;
            
            // 修复：使用闭包确保事件监听器获取正确的行和列
            cell.addEventListener('click', (function(r, c) {
                return function() {
                    handleCellClick(r, c);
                };
            })(row, col));
            
            cell.addEventListener('mouseover', (function(r, c) {
                return function() {
                    highlightCell(r, c, true);
                };
            })(row, col));
            
            cell.addEventListener('mouseout', (function(r, c) {
                return function() {
                    highlightCell(r, c, false);
                };
            })(row, col));
            
            lawnGridEl.appendChild(cell);
            gameState.cells.push({
                element: cell,
                row: row,
                col: col,
                plant: null,
                zombie: null,
                rect: null
            });
        }
    }
    
    // 存储单元格位置信息
    updateCellPositions();
}

// 更新单元格位置信息
function updateCellPositions() {
    const lawnRect = document.getElementById('lawn').getBoundingClientRect();
    gameState.cells.forEach(cell => {
        const cellRect = cell.element.getBoundingClientRect();
        cell.rect = {
            left: cellRect.left - lawnRect.left,
            top: cellRect.top - lawnRect.top,
            width: cellRect.width,
            height: cellRect.height
        };
    });
}

// 处理单元格点击
function handleCellClick(row, col) {
    if (!gameState.gameActive) return;
    
    if (gameState.shovelMode) {
        useShovel(row);
        return;
    }
    
    placePlant(row, col);
}

// 高亮显示单元格
function highlightCell(row, col, highlight) {
    const cell = gameState.cells.find(c => c.row === row && c.col === col);
    if (cell) {
        if (highlight && !cell.plant && !gameState.shovelMode) {
            cell.element.classList.add('highlight');
        } else if (gameState.shovelMode && highlight) {
            // 铲车模式下高亮整行
            highlightShovelRow(row);
        } else {
            cell.element.classList.remove('highlight');
            // 移除所有行高亮
            removeShovelHighlights();
        }
    }
}

// 高亮铲车行
function highlightShovelRow(row) {
    removeShovelHighlights();
    gameState.cells.forEach(cell => {
        if (cell.row === row) {
            cell.element.classList.add('highlight');
        }
    });
}

// 移除铲车高亮
function removeShovelHighlights() {
    gameState.cells.forEach(cell => {
        cell.element.classList.remove('highlight');
    });
}

// 选择植物
plantOptions.forEach(option => {
    option.addEventListener('click', () => {
        plantOptions.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
        gameState.selectedPlant = option.dataset.plant;
        gameState.shovelMode = false;
        shovelBtn.classList.remove('active');
        removeShovelHighlights();
    });
});

// 铲车功能 - 优化二
shovelBtn.addEventListener('click', () => {
    if (!gameState.gameActive) return;
    
    gameState.shovelMode = !gameState.shovelMode;
    if (gameState.shovelMode) {
        shovelBtn.classList.add('active');
        // 取消选择所有植物
        plantOptions.forEach(opt => opt.classList.remove('selected'));
    } else {
        shovelBtn.classList.remove('active');
        removeShovelHighlights();
        // 重新选择默认植物
        document.querySelector('.plant-sunflower').classList.add('selected');
        gameState.selectedPlant = 'sunflower';
    }
});

// 使用铲车
function useShovel(row) {
    if (gameState.sun < 75) {
        showMessage('能量不足！需要75能量');
        return;
    }
    
    updateSun(-75);
    
    // 清除该行的所有植物
    const plantsInRow = gameState.plants.filter(p => p.row === row);
    plantsInRow.forEach(plant => {
        // 爆炸效果
        plant.element.innerHTML = '💥';
        plant.element.style.background = 'radial-gradient(circle, #ff6600, #ff0000)';
        plant.element.style.transform = 'scale(1.5)';
        plant.element.style.zIndex = 20;
        
        setTimeout(() => {
            removePlant(plant);
        }, 300);
    });
    
    // 显示铲车动画
    showShovelAnimation(row);
    
    // 退出铲车模式
    gameState.shovelMode = false;
    shovelBtn.classList.remove('active');
    removeShovelHighlights();
    document.querySelector('.plant-sunflower').classList.add('selected');
    gameState.selectedPlant = 'sunflower';
}

// 显示铲车动画
function showShovelAnimation(row) {
    const shovelAnim = document.createElement('div');
    shovelAnim.className = 'shovel-animation';
    shovelAnim.innerHTML = '<i class="fas fa-truck-pickup"></i>';
    shovelAnim.style.position = 'absolute';
    shovelAnim.style.left = '0px';
    shovelAnim.style.top = `${row * 100 + 35}px`;
    shovelAnim.style.fontSize = '2rem';
    shovelAnim.style.color = '#ff6600';
    shovelAnim.style.zIndex = '25';
    shovelAnim.style.textShadow = '0 0 10px #ff6600';
    
    document.getElementById('lawn').appendChild(shovelAnim);
    
    // 动画
    let pos = 0;
    const anim = setInterval(() => {
        pos += 15;
        shovelAnim.style.left = `${pos}px`;
        
        if (pos > 800) {
            clearInterval(anim);
            shovelAnim.remove();
        }
    }, 20);
}

// 放置植物 - 修复BUG1：确保正确放置到点击的行
function placePlant(row, col) {
    if (!gameState.gameActive) return;
    
    const cell = gameState.cells.find(c => c.row === row && c.col === col);
    if (!cell || cell.plant) return;
    
    const plantType = gameState.selectedPlant;
    const plantInfo = plantsData[plantType];
    
    if (gameState.sun < plantInfo.cost) {
        showMessage('能量不足！');
        return;
    }
    
    // 扣除阳光
    updateSun(-plantInfo.cost);
    
    // 创建植物元素
    const plantEl = document.createElement('div');
    plantEl.className = 'plant';
    plantEl.dataset.type = plantType;
    plantEl.dataset.row = row;
    plantEl.dataset.col = col;
    plantEl.innerHTML = plantInfo.icon;
    plantEl.style.background = plantInfo.color;
    
    // 修复：使用存储的单元格位置信息
    if (cell.rect) {
        plantEl.style.left = `${cell.rect.left + cell.rect.width/2 - 35}px`;
        plantEl.style.top = `${cell.rect.top + cell.rect.height/2 - 35}px`;
    } else {
        // 备用计算方式
        const cellWidth = 100;
        const cellHeight = 100;
        plantEl.style.left = `${col * cellWidth + 15}px`;
        plantEl.style.top = `${row * cellHeight + 15}px`;
    }
    
    document.getElementById('lawn').appendChild(plantEl);
    
    // 保存植物数据
    const plant = {
        element: plantEl,
        type: plantType,
        row: row,
        col: col,
        hp: plantInfo.hp,
        maxHp: plantInfo.hp,
        lastActionTime: Date.now(),
        ability: plantInfo.ability,
        damage: plantInfo.damage || 0,
        cooldown: plantInfo.cooldown || 0,
        cell: cell
    };
    
    gameState.plants.push(plant);
    cell.plant = plant;
    
    // 如果是樱桃炸弹，立即爆炸
    if (plantType === 'cherrybomb') {
        setTimeout(() => {
            explodeCherryBomb(plant);
        }, 500);
    }
    
    // 显示放置效果
    plantEl.style.transform = 'scale(1.2)';
    setTimeout(() => {
        plantEl.style.transform = 'scale(1)';
    }, 200);
    
    // 更新单元格高亮
    highlightCell(row, col, false);
}

// 樱桃炸弹爆炸
function explodeCherryBomb(plant) {
    const bombDamage = plantsData.cherrybomb.damage;
    const bombRange = 150;
    
    // 爆炸效果
    plant.element.innerHTML = '💥';
    plant.element.style.background = 'radial-gradient(circle, #ff3838, #ff0000)';
    plant.element.style.transform = 'scale(2)';
    plant.element.style.zIndex = 20;
    
    // 对范围内的僵尸造成伤害
    gameState.zombies.forEach(zombie => {
        const zombieRect = zombie.element.getBoundingClientRect();
        const plantRect = plant.element.getBoundingClientRect();
        
        const distance = Math.sqrt(
            Math.pow(zombieRect.left - plantRect.left, 2) + 
            Math.pow(zombieRect.top - plantRect.top, 2)
        );
        
        if (distance <= bombRange) {
            zombie.hp -= bombDamage;
            if (zombie.hp <= 0) {
                removeZombie(zombie);
            } else {
                // 显示伤害效果
                zombie.element.style.filter = 'brightness(1.5)';
                setTimeout(() => {
                    zombie.element.style.filter = 'brightness(1)';
                }, 200);
            }
        }
    });
    
    // 移除植物
    setTimeout(() => {
        removePlant(plant);
    }, 300);
}

// 移除植物
function removePlant(plant) {
    // 从数组和单元格中移除
    gameState.plants = gameState.plants.filter(p => p !== plant);
    if (plant.cell) {
        plant.cell.plant = null;
    }
    
    // 移除DOM元素
    if (plant.element && plant.element.parentNode) {
        plant.element.remove();
    }
}

// 生成僵尸
function spawnZombie() {
    if (!gameState.gameActive || gameState.zombiesRemaining <= 0) return;
    
    const row = Math.floor(Math.random() * 5);
    let zombieType;
    const rand = Math.random();
    
    if (rand < 0.5) zombieType = 'normal';
    else if (rand < 0.8) zombieType = 'conehead';
    else zombieType = 'fast';
    
    const zombieInfo = zombieData[zombieType];
    
    // 创建僵尸元素
    const zombieEl = document.createElement('div');
    zombieEl.className = 'zombie';
    zombieEl.dataset.type = zombieType;
    zombieEl.dataset.row = row;
    zombieEl.innerHTML = zombieInfo.icon;
    zombieEl.style.background = zombieInfo.color;
    zombieEl.style.left = '800px';
    
    // 使用存储的单元格位置信息
    const cell = gameState.cells.find(c => c.row === row && c.col === 8);
    if (cell && cell.rect) {
        zombieEl.style.top = `${cell.rect.top + cell.rect.height/2 - 42}px`;
    } else {
        zombieEl.style.top = `${row * 100 + 20}px`;
    }
    
    document.getElementById('lawn').appendChild(zombieEl);
    
    // 保存僵尸数据
    const zombie = {
        element: zombieEl,
        type: zombieType,
        row: row,
        hp: zombieInfo.hp,
        maxHp: zombieInfo.hp,
        speed: zombieInfo.speed,
        damage: zombieInfo.damage,
        attackSpeed: zombieInfo.attackSpeed,
        lastAttackTime: 0,
        targetPlant: null
    };
    
    gameState.zombies.push(zombie);
    
    // 更新剩余僵尸数量
    gameState.zombiesRemaining--;
    updateZombiesLeft();
    
    // 如果僵尸数量为0，进入下一波
    if (gameState.zombiesRemaining <= 0) {
        nextWave();
    }
}

// 移除僵尸
function removeZombie(zombie) {
    // 从数组中移除
    gameState.zombies = gameState.zombies.filter(z => z !== zombie);
    
    // 如果僵尸有目标植物，清除目标
    if (zombie.targetPlant) {
        const plantCell = gameState.cells.find(c => 
            c.row === zombie.targetPlant.row && 
            c.col === zombie.targetPlant.col
        );
        if (plantCell) plantCell.zombie = null;
    }
    
    // 移除DOM元素
    if (zombie.element && zombie.element.parentNode) {
        // 死亡动画
        zombie.element.innerHTML = '💀';
        zombie.element.style.transform = 'rotate(90deg)';
        zombie.element.style.transition = 'transform 0.5s, opacity 0.5s';
        zombie.element.style.opacity = '0.5';
        
        setTimeout(() => {
            if (zombie.element && zombie.element.parentNode) {
                zombie.element.remove();
            }
        }, 500);
    }
}

// 生成阳光 - 修复BUG3：确保阳光可点击收集
function spawnSun() {
    if (!gameState.gameActive) return;
    
    const sunEl = document.createElement('div');
    sunEl.className = 'sun';
    
    // 随机位置
    const left = Math.random() * 70 + 15;
    const top = Math.random() * 70 + 15;
    sunEl.style.left = `${left}%`;
    sunEl.style.top = `${top}%`;
    
    // 修复：使用事件委托，确保点击事件正常工作
    sunEl.addEventListener('click', function(event) {
        event.stopPropagation();
        collectSun(sunEl);
    });
    
    document.getElementById('lawn').appendChild(sunEl);
    
    const sun = {
        element: sunEl,
        value: 25,
        createdAt: Date.now()
    };
    
    gameState.suns.push(sun);
    
    // 阳光自动消失
    setTimeout(() => {
        if (sunEl.parentNode) {
            sunEl.style.opacity = '0';
            sunEl.style.transform = 'scale(0.5)';
            setTimeout(() => {
                if (sunEl.parentNode) {
                    sunEl.remove();
                }
                gameState.suns = gameState.suns.filter(s => s.element !== sunEl);
            }, 300);
        }
    }, 8000);
}

// 收集阳光 - 修复BUG3
function collectSun(sunEl) {
    const sun = gameState.suns.find(s => s.element === sunEl);
    if (!sun) return;
    
    updateSun(sun.value);
    
    // 收集动画
    sunEl.style.transform = 'scale(1.5)';
    sunEl.style.opacity = '0';
    sunEl.style.transition = 'transform 0.3s, opacity 0.3s';
    
    setTimeout(() => {
        if (sunEl.parentNode) {
            sunEl.remove();
            gameState.suns = gameState.suns.filter(s => s.element !== sunEl);
        }
    }, 300);
}

// 更新阳光数量
function updateSun(amount) {
    gameState.sun += amount;
    sunCountEl.textContent = gameState.sun;
    
    // 动画效果
    if (amount > 0) {
        sunCountEl.style.transform = 'scale(1.3)';
        sunCountEl.style.color = '#ffff00';
        setTimeout(() => {
            sunCountEl.style.transform = 'scale(1)';
            setTimeout(() => {
                sunCountEl.style.color = '#ffff00';
            }, 100);
        }, 200);
    } else {
        sunCountEl.style.transform = 'scale(0.9)';
        sunCountEl.style.color = '#ff5555';
        setTimeout(() => {
            sunCountEl.style.transform = 'scale(1)';
            setTimeout(() => {
                sunCountEl.style.color = '#ffff00';
            }, 100);
        }, 200);
    }
}

// 更新剩余僵尸数量
function updateZombiesLeft() {
    zombiesLeftEl.textContent = gameState.zombiesRemaining;
    const progress = ((gameState.wave - 1) / gameState.totalWaves + 
                     (gameState.totalWaves - gameState.zombiesRemaining / 2) / gameState.totalWaves) * 100;
    waveProgressEl.style.width = `${Math.min(progress, 100)}%`;
    waveCountEl.textContent = `${gameState.wave}/${gameState.totalWaves}`;
}

// 下一波僵尸
function nextWave() {
    if (gameState.wave >= gameState.totalWaves) {
        completeLevel();
        return;
    }
    
    gameState.wave++;
    gameState.zombiesRemaining = 8 + gameState.wave * 3;
    updateZombiesLeft();
    
    showMessage(`第 ${gameState.wave} 波入侵即将到来！`);
}

// 完成关卡
function completeLevel() {
    pauseGame();
    levelCompleteMessage.style.display = 'flex';
}

// 游戏结束
function gameOver() {
    pauseGame();
    finalLevelEl.textContent = gameState.currentLevel;
    gameOverMessage.style.display = 'flex';
}

// 开始下一关
function nextLevel() {
    gameState.currentLevel++;
    gameState.wave = 1;
    gameState.zombiesRemaining = 10;
    
    currentLevelEl.textContent = gameState.currentLevel;
    updateZombiesLeft();
    
    levelCompleteMessage.style.display = 'none';
    
    // 清理游戏区域 - 修复BUG2：确保完全清理
    clearGameObjects();
    
    // 重新初始化网格
    initLawnGrid();
    
    // 开始新关卡
    setTimeout(() => {
        startGame();
    }, 1000);
}

// 清理游戏对象 - 修复BUG2：确保完全清理
function clearGameObjects() {
    // 清理植物
    gameState.plants.forEach(plant => {
        if (plant.element && plant.element.parentNode) {
            plant.element.remove();
        }
    });
    
    // 清理僵尸
    gameState.zombies.forEach(zombie => {
        if (zombie.element && zombie.element.parentNode) {
            zombie.element.remove();
        }
    });
    
    // 清理阳光
    gameState.suns.forEach(sun => {
        if (sun.element && sun.element.parentNode) {
            sun.element.remove();
        }
    });
    
    // 清理子弹
    gameState.projectiles.forEach(projectile => {
        if (projectile.element && projectile.element.parentNode) {
            projectile.element.remove();
        }
    });
    
    // 清理所有其他动画元素
    const lawn = document.getElementById('lawn');
    const children = lawn.querySelectorAll('.plant, .zombie, .projectile, .sun, .shovel-animation');
    children.forEach(child => {
        if (child.parentNode === lawn) {
            child.remove();
        }
    });
    
    // 重置数组
    gameState.plants = [];
    gameState.zombies = [];
    gameState.suns = [];
    gameState.projectiles = [];
    
    // 重置单元格
    gameState.cells.forEach(cell => {
        cell.plant = null;
        cell.zombie = null;
    });
}

// 显示消息
function showMessage(text) {
    const messageEl = document.createElement('div');
    messageEl.className = 'message';
    messageEl.style.position = 'absolute';
    messageEl.style.top = '50%';
    messageEl.style.left = '50%';
    messageEl.style.transform = 'translate(-50%, -50%)';
    messageEl.style.background = 'rgba(0,0,0,0.8)';
    messageEl.style.color = '#00ffff';
    messageEl.style.padding = '20px';
    messageEl.style.borderRadius = '10px';
    messageEl.style.zIndex = '1000';
    messageEl.style.fontSize = '1.5rem';
    messageEl.style.fontWeight = 'bold';
    messageEl.style.textAlign = 'center';
    messageEl.style.border = '2px solid #00ffff';
    messageEl.style.boxShadow = '0 0 20px #00ffff';
    messageEl.textContent = text;
    
    document.getElementById('lawn').appendChild(messageEl);
    
    setTimeout(() => {
        if (messageEl.parentNode) {
            messageEl.remove();
        }
    }, 1500);
}

// 暂停游戏
function pauseGame() {
    gameState.gameActive = false;
    
    if (gameState.zombieSpawnInterval) {
        clearInterval(gameState.zombieSpawnInterval);
        gameState.zombieSpawnInterval = null;
    }
    
    if (gameState.sunSpawnInterval) {
        clearInterval(gameState.sunSpawnInterval);
        gameState.sunSpawnInterval = null;
    }
    
    if (gameState.gameLoop) {
        cancelAnimationFrame(gameState.gameLoop);
        gameState.gameLoop = null;
    }
    
    startBtn.innerHTML = '<i class="fas fa-play"></i> 开始游戏';
    startBtn.disabled = false;
}

// 开始游戏
function startGame() {
    if (gameState.gameActive) return;
    
    gameState.gameActive = true;
    
    // 初始阳光
    gameState.sun = 300;
    sunCountEl.textContent = gameState.sun;
    
    // 开始生成僵尸
    const spawnDelay = Math.max(1500, 3000 - gameState.currentLevel * 200);
    gameState.zombieSpawnInterval = setInterval(() => {
        if (gameState.gameActive && gameState.zombiesRemaining > 0) {
            spawnZombie();
        }
    }, spawnDelay);
    
    // 开始生成阳光
    gameState.sunSpawnInterval = setInterval(() => {
        if (gameState.gameActive) {
            spawnSun();
        }
    }, 6000);
    
    // 开始游戏循环
    gameLoop();
    
    // 更新按钮文本
    startBtn.innerHTML = '<i class="fas fa-pause"></i> 游戏进行中...';
    startBtn.disabled = true;
}

// 重新开始游戏 - 修复BUG2：确保完全重置
function restartGame() {
    pauseGame();
    
    // 重置游戏状态
    gameState = {
        sun: 300,
        currentLevel: 1,
        wave: 1,
        totalWaves: 5,
        zombiesRemaining: 10,
        gameActive: false,
        selectedPlant: 'sunflower',
        shovelMode: false,
        plants: [],
        zombies: [],
        projectiles: [],
        suns: [],
        cells: [],
        zombieSpawnInterval: null,
        sunSpawnInterval: null,
        gameLoop: null
    };
    
    // 更新显示
    sunCountEl.textContent = gameState.sun;
    currentLevelEl.textContent = gameState.currentLevel;
    updateZombiesLeft();
    
    // 清理游戏区域
    clearGameObjects();
    
    // 重置按钮
    startBtn.innerHTML = '<i class="fas fa-play"></i> 开始游戏';
    startBtn.disabled = false;
    
    // 重置铲车
    shovelBtn.classList.remove('active');
    
    // 隐藏消息框
    gameOverMessage.style.display = 'none';
    levelCompleteMessage.style.display = 'none';
    
    // 重新初始化网格
    initLawnGrid();
    
    // 默认选择向日葵
    plantOptions.forEach(opt => opt.classList.remove('selected'));
    document.querySelector('.plant-sunflower').classList.add('selected');
}

// 游戏主循环
function gameLoop() {
    if (!gameState.gameActive) return;
    
    const currentTime = Date.now();
    
    // 更新所有植物
    gameState.plants.forEach(plant => {
        // 检查植物是否存活
        if (plant.hp <= 0) {
            removePlant(plant);
            return;
        }
        
        // 植物能力
        if (plant.ability === 'sunProducer') {
            if (currentTime - plant.lastActionTime > plant.cooldown) {
                // 产生阳光
                updateSun(25);
                plant.lastActionTime = currentTime;
                
                // 显示阳光产生效果
                const sunEffect = document.createElement('div');
                sunEffect.className = 'sun';
                sunEffect.style.width = '20px';
                sunEffect.style.height = '20px';
                sunEffect.style.position = 'absolute';
                
                // 使用植物位置
                if (plant.cell && plant.cell.rect) {
                    sunEffect.style.left = `${plant.cell.rect.left + plant.cell.rect.width/2 - 10}px`;
                    sunEffect.style.top = `${plant.cell.rect.top + plant.cell.rect.height/2 - 10}px`;
                } else {
                    sunEffect.style.left = `${plant.col * 100 + 40}px`;
                    sunEffect.style.top = `${plant.row * 100 + 40}px`;
                }
                
                sunEffect.style.zIndex = '10';
                
                document.getElementById('lawn').appendChild(sunEffect);
                
                // 阳光上升动画
                let top = parseInt(sunEffect.style.top);
                const animateSun = () => {
                    top -= 2;
                    sunEffect.style.top = `${top}px`;
                    
                    if (top > plant.row * 100 - 20) {
                        requestAnimationFrame(animateSun);
                    } else {
                        sunEffect.remove();
                    }
                };
                
                animateSun();
            }
        } else if (plant.ability === 'shooter') {
            // 检查前方是否有僵尸
            const zombieInRow = gameState.zombies.find(z => 
                z.row === plant.row && 
                z.element.offsetLeft < 800
            );
            
            if (zombieInRow && currentTime - plant.lastActionTime > plant.cooldown) {
                // 发射豌豆
                shootPea(plant);
                plant.lastActionTime = currentTime;
            }
        }
    });
    
    // 更新所有僵尸
    gameState.zombies.forEach(zombie => {
        // 检查僵尸是否存活
        if (zombie.hp <= 0) {
            removeZombie(zombie);
            return;
        }
        
        // 获取僵尸当前位置
        const currentLeft = parseInt(zombie.element.style.left) || 800;
        
        // 检查前方是否有植物
        const cellCol = Math.max(0, Math.min(8, Math.floor((currentLeft - 10) / 100)));
        const cell = gameState.cells.find(c => c.row === zombie.row && c.col === cellCol);
        
        if (cell && cell.plant) {
            // 攻击植物
            if (!zombie.targetPlant) {
                zombie.targetPlant = cell.plant;
                cell.zombie = zombie;
            }
            
            // 攻击冷却
            if (currentTime - zombie.lastAttackTime > zombie.attackSpeed) {
                cell.plant.hp -= zombie.damage;
                zombie.lastAttackTime = currentTime;
                
                // 显示植物受伤效果
                cell.plant.element.style.filter = 'brightness(1.5)';
                setTimeout(() => {
                    if (cell.plant && cell.plant.element) {
                        cell.plant.element.style.filter = 'brightness(1)';
                    }
                }, 200);
                
                // 检查植物是否被摧毁
                if (cell.plant.hp <= 0) {
                    zombie.targetPlant = null;
                    cell.zombie = null;
                }
            }
        } else {
            // 清除目标植物
            zombie.targetPlant = null;
            if (cell) cell.zombie = null;
            
            // 向前移动
            const newLeft = currentLeft - zombie.speed;
            zombie.element.style.left = `${newLeft}px`;
            
            // 检查是否到达左侧（游戏失败）
            if (newLeft <= 10) {
                gameOver();
            }
        }
    });
    
    // 更新所有子弹
    gameState.projectiles.forEach((projectile, index) => {
        const currentLeft = parseInt(projectile.element.style.left) || projectile.startX;
        const newLeft = currentLeft + 8;
        
        if (newLeft > 900) {
            // 移除超出边界的子弹
            projectile.element.remove();
            gameState.projectiles.splice(index, 1);
        } else {
            projectile.element.style.left = `${newLeft}px`;
            
            // 检查子弹是否击中僵尸
            gameState.zombies.forEach(zombie => {
                const zombieRect = zombie.element.getBoundingClientRect();
                const projectileRect = projectile.element.getBoundingClientRect();
                
                // 简单碰撞检测
                if (zombieRect.left < projectileRect.left + 10 && 
                    zombieRect.left + zombieRect.width > projectileRect.left &&
                    zombieRect.top < projectileRect.top + 10 &&
                    zombieRect.top + zombieRect.height > projectileRect.top) {
                    
                    // 击中僵尸
                    zombie.hp -= projectile.damage;
                    
                    // 显示击中效果
                    projectile.element.style.background = '#ff0000';
                    projectile.element.style.transform = 'scale(1.5)';
                    
                    setTimeout(() => {
                        if (projectile.element.parentNode) {
                            projectile.element.remove();
                        }
                    }, 100);
                    
                    gameState.projectiles.splice(index, 1);
                    
                    // 检查僵尸是否死亡
                    if (zombie.hp <= 0) {
                        removeZombie(zombie);
                    }
                }
            });
        }
    });
    
    // 继续游戏循环
    gameState.gameLoop = requestAnimationFrame(gameLoop);
}

// 发射豌豆
function shootPea(plant) {
    const projectileEl = document.createElement('div');
    projectileEl.className = 'projectile';
    projectileEl.style.background = '#00ff00';
    
    // 使用植物位置
    if (plant.cell && plant.cell.rect) {
        projectileEl.style.left = `${plant.cell.rect.left + plant.cell.rect.width/2 - 7}px`;
        projectileEl.style.top = `${plant.cell.rect.top + plant.cell.rect.height/2 - 7}px`;
    } else {
        projectileEl.style.left = `${plant.col * 100 + 60}px`;
        projectileEl.style.top = `${plant.row * 100 + 40}px`;
    }
    
    document.getElementById('lawn').appendChild(projectileEl);
    
    gameState.projectiles.push({
        element: projectileEl,
        damage: plant.damage,
        startX: parseInt(projectileEl.style.left)
    });
}

// 事件监听器
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', restartGame);
tryAgainBtn.addEventListener('click', () => {
    gameOverMessage.style.display = 'none';
    restartGame();
});
nextLevelBtn.addEventListener('click', nextLevel);

// 窗口大小变化时更新单元格位置
window.addEventListener('resize', () => {
    updateCellPositions();
    // 更新现有植物的位置
    gameState.plants.forEach(plant => {
        if (plant.cell && plant.cell.rect) {
            plant.element.style.left = `${plant.cell.rect.left + plant.cell.rect.width/2 - 35}px`;
            plant.element.style.top = `${plant.cell.rect.top + plant.cell.rect.height/2 - 35}px`;
        }
    });
});

// 初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    initLawnGrid();
    
    // 默认选择向日葵
    plantOptions.forEach(opt => opt.classList.remove('selected'));
    document.querySelector('.plant-sunflower').classList.add('selected');
    
    // 添加一些初始样式
    document.body.style.overflow = 'hidden';
});
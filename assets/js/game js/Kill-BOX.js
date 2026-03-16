// 游戏配置
const config = {
    rows: 8,
    cols: 8,
    colors: 6,
    moves: 99,
    time: 300,
    hintCount: 3,
    winScore: 5000
};

// 游戏状态
let gameState = {
    score: 0,
    movesLeft: config.moves,
    timeLeft: config.time,
    combo: 0,
    hintCount: config.hintCount,
    selectedTile: null,
    gameOver: false,
    gameStarted: false,
    timer: null,
    soundEnabled: true
};

// 游戏网格数据
let grid = [];

// DOM 元素
const gameGrid = document.getElementById('game-grid');
const scoreElement = document.getElementById('score');
const movesElement = document.getElementById('moves');
const timeElement = document.getElementById('time');
const comboElement = document.getElementById('combo');
const gameStatusElement = document.getElementById('game-status');
const restartBtn = document.getElementById('restart-btn');
const hintBtn = document.getElementById('hint-btn');
const soundBtn = document.getElementById('sound-btn');
const hintCountElement = document.getElementById('hint-count');
const comboDisplay = document.getElementById('combo-display');
const comboValueElement = document.getElementById('combo-value');

// 声音效果
const sounds = {
    click: new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEAQB8AAEAfAAABAAgAZGF0YQ'),
    match: new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEAQB8AAEAfAAABAAgAZGF0YQ'),
    combo: new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEAQB8AAEAfAAABAAgAZGF0YQ'),
    win: new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEAQB8AAEAfAAABAAgAZGF0YQ')
};

// 预加载声音（简单的beep音效）
function initSounds() {
    // 这里可以使用更复杂的声音，这里简化处理
    sounds.click.volume = 0.3;
    sounds.match.volume = 0.5;
    sounds.combo.volume = 0.7;
    sounds.win.volume = 0.5;
}

// 播放声音
function playSound(soundName) {
    if (gameState.soundEnabled && sounds[soundName]) {
        sounds[soundName].currentTime = 0;
        sounds[soundName].play().catch(e => console.log("音频播放失败:", e));
    }
}

// 初始化游戏
function initGame() {
    // 重置游戏状态
    gameState = {
        score: 0,
        movesLeft: config.moves,
        timeLeft: config.time,
        combo: 0,
        hintCount: config.hintCount,
        selectedTile: null,
        gameOver: false,
        gameStarted: false,
        timer: null,
        soundEnabled: true
    };
    
    // 清除定时器
    if (gameState.timer) {
        clearInterval(gameState.timer);
    }
    
    // 隐藏连击显示
    comboDisplay.classList.remove('active');
    
    // 更新UI
    updateUI();
    
    // 生成游戏网格
    generateGrid();
    
    // 确保初始状态没有匹配
    let attempts = 0;
    while (findMatches().length > 0 && attempts < 100) {
        generateGrid();
        attempts++;
    }
    
    if (attempts >= 100) {
        console.warn("无法生成无初始匹配的网格");
    }
    
    // 设置游戏状态
    gameStatusElement.textContent = "点击方块开始游戏";
    gameStatusElement.style.color = "#00ffff";
    
    // 开始计时器
    startTimer();
    
    // 初始化声音
    initSounds();
}

// 生成游戏网格
function generateGrid() {
    grid = [];
    gameGrid.innerHTML = '';
    
    // 设置网格样式
    gameGrid.style.gridTemplateColumns = `repeat(${config.cols}, 1fr)`;
    
    // 创建方块
    for (let row = 0; row < config.rows; row++) {
        grid[row] = [];
        for (let col = 0; col < config.cols; col++) {
            // 随机颜色 (1-6)
            const color = Math.floor(Math.random() * config.colors) + 1;
            grid[row][col] = color;
            
            // 创建方块元素
            createTileElement(row, col, color);
        }
    }
}

// 创建方块元素
function createTileElement(row, col, color) {
    const tile = document.createElement('div');
    tile.className = `tile color${color}`;
    tile.dataset.row = row;
    tile.dataset.col = col;
    tile.dataset.color = color;
    
    // 添加内部颜色块
    const inner = document.createElement('div');
    inner.className = 'inner';
    tile.appendChild(inner);
    
    // 添加点击事件
    tile.addEventListener('click', () => handleTileClick(row, col));
    
    gameGrid.appendChild(tile);
    return tile;
}

// 处理方块点击
function handleTileClick(row, col) {
    if (gameState.gameOver) return;
    
    playSound('click');
    
    const tileIndex = row * config.cols + col;
    const tileElement = gameGrid.children[tileIndex];
    
    // 如果游戏未开始，现在开始
    if (!gameState.gameStarted) {
        gameState.gameStarted = true;
        gameStatusElement.textContent = "游戏进行中";
        gameStatusElement.style.color = "#00ff00";
    }
    
    // 如果没有选中任何方块，选中当前方块
    if (gameState.selectedTile === null) {
        gameState.selectedTile = { row, col };
        tileElement.classList.add('selected');
        gameStatusElement.textContent = `已选择方块，请选择相邻方块交换`;
        gameStatusElement.style.color = "#ffcc00";
        return;
    }
    
    // 如果点击了已选中的方块，取消选择
    if (gameState.selectedTile.row === row && gameState.selectedTile.col === col) {
        gameState.selectedTile = null;
        tileElement.classList.remove('selected');
        gameStatusElement.textContent = "已取消选择";
        gameStatusElement.style.color = "#ff3366";
        return;
    }
    
    // 获取之前选中的方块
    const prevRow = gameState.selectedTile.row;
    const prevCol = gameState.selectedTile.col;
    const prevTileIndex = prevRow * config.cols + prevCol;
    const prevTileElement = gameGrid.children[prevTileIndex];
    
    // 检查是否相邻
    const rowDiff = Math.abs(prevRow - row);
    const colDiff = Math.abs(prevCol - col);
    const isAdjacent = (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
    
    if (!isAdjacent) {
        // 如果不是相邻方块，取消之前的选择，选择新的方块
        prevTileElement.classList.remove('selected');
        gameState.selectedTile = { row, col };
        tileElement.classList.add('selected');
        gameStatusElement.textContent = `已选择方块，请选择相邻方块交换`;
        gameStatusElement.style.color = "#ffcc00";
        return;
    }
    
    // 清除选择状态
    prevTileElement.classList.remove('selected');
    tileElement.classList.remove('selected');
    
    // 交换方块
    swapTiles(prevRow, prevCol, row, col);
    
    // 检查是否有匹配
    const matches = findMatches();
    
    if (matches.length > 0) {
        // 有匹配，消耗步数并处理匹配
        gameState.movesLeft--;
        
        // 处理匹配
        processMatches(matches);
        
        // 增加连击
        gameState.combo++;
        
        // 显示连击效果
        showComboEffect();
        
        gameStatusElement.textContent = `消除成功！连击 x${gameState.combo}`;
        gameStatusElement.style.color = "#ff00ff";
        
        // 检查游戏是否获胜
        if (gameState.score >= config.winScore) {
            setTimeout(() => endGame(true), 800);
        }
    } else {
        // 没有匹配，交换回来
        setTimeout(() => {
            swapTiles(prevRow, prevCol, row, col);
            gameStatusElement.textContent = "没有形成匹配";
            gameStatusElement.style.color = "#ff3366";
            
            // 消耗步数
            gameState.movesLeft--;
            updateUI();
            
            // 重置连击
            gameState.combo = 0;
            comboDisplay.classList.remove('active');
            
            // 检查步数是否用完
            if (gameState.movesLeft <= 0) {
                endGame(false);
            }
        }, 300);
    }
    
    // 清除选择
    gameState.selectedTile = null;
    
    // 更新UI
    updateUI();
}

// 交换两个方块
function swapTiles(row1, col1, row2, col2) {
    // 交换数据
    const temp = grid[row1][col1];
    grid[row1][col1] = grid[row2][col2];
    grid[row2][col2] = temp;
    
    // 更新UI
    updateTile(row1, col1);
    updateTile(row2, col2);
}

// 更新单个方块的显示
function updateTile(row, col) {
    const tileIndex = row * config.cols + col;
    const tileElement = gameGrid.children[tileIndex];
    const color = grid[row][col];
    
    // 更新类名
    tileElement.className = `tile color${color}`;
    tileElement.dataset.color = color;
    
    // 添加内部颜色块
    const inner = document.createElement('div');
    inner.className = 'inner';
    tileElement.innerHTML = '';
    tileElement.appendChild(inner);
    
    // 重新添加事件监听器
    tileElement.addEventListener('click', () => handleTileClick(row, col));
    
    // 更新数据属性
    tileElement.dataset.row = row;
    tileElement.dataset.col = col;
}

// 查找所有匹配（修复版，支持4个及以上匹配）
function findMatches() {
    const matches = new Set();
    
    // 检查水平匹配
    for (let row = 0; row < config.rows; row++) {
        for (let col = 0; col < config.cols - 2; col++) {
            const color = grid[row][col];
            if (color === 0) continue;
            
            if (color === grid[row][col + 1] && color === grid[row][col + 2]) {
                // 找到至少3个匹配
                let matchLength = 3;
                
                // 向右检查
                while (col + matchLength < config.cols && grid[row][col + matchLength] === color) {
                    matchLength++;
                }
                
                // 添加到匹配集合
                for (let i = 0; i < matchLength; i++) {
                    matches.add(`${row},${col + i}`);
                }
                
                col += matchLength - 1; // 跳过已检查的部分
            }
        }
    }
    
    // 检查垂直匹配
    for (let col = 0; col < config.cols; col++) {
        for (let row = 0; row < config.rows - 2; row++) {
            const color = grid[row][col];
            if (color === 0) continue;
            
            if (color === grid[row + 1][col] && color === grid[row + 2][col]) {
                // 找到至少3个匹配
                let matchLength = 3;
                
                // 向下检查
                while (row + matchLength < config.rows && grid[row + matchLength][col] === color) {
                    matchLength++;
                }
                
                // 添加到匹配集合
                for (let i = 0; i < matchLength; i++) {
                    matches.add(`${row + i},${col}`);
                }
                
                row += matchLength - 1; // 跳过已检查的部分
            }
        }
    }
    
    // 转换回数组格式
    return Array.from(matches).map(str => {
        const [row, col] = str.split(',').map(Number);
        return { row, col };
    });
}

// 处理匹配
function processMatches(matches) {
    playSound('match');
    
    // 标记匹配的方块
    for (const match of matches) {
        const tileIndex = match.row * config.cols + match.col;
        const tileElement = gameGrid.children[tileIndex];
        tileElement.classList.add('matched');
    }
    
    // 计算得分
    const baseScore = 100;
    const comboBonus = gameState.combo * 50;
    const matchScore = baseScore * matches.length + comboBonus;
    gameState.score += matchScore;
    
    // 短暂延迟后移除匹配的方块并填充新方块
    setTimeout(() => {
        // 移除匹配的方块
        for (const match of matches) {
            grid[match.row][match.col] = 0;
        }
        
        // 更新网格显示
        updateGridAfterMatch();
        
        // 检查是否有新的匹配
        setTimeout(() => {
            const newMatches = findMatches();
            if (newMatches.length > 0) {
                // 如果有新匹配，继续处理
                playSound('combo');
                processMatches(newMatches);
            } else {
                // 如果没有新匹配，检查游戏状态
                checkGameState();
            }
            
            updateUI();
        }, 800);
    }, 600);
}

// 匹配后更新网格
function updateGridAfterMatch() {
    // 让方块下落
    for (let col = 0; col < config.cols; col++) {
        const emptySpaces = [];
        
        // 从底部向上检查
        for (let row = config.rows - 1; row >= 0; row--) {
            if (grid[row][col] === 0) {
                emptySpaces.unshift(row);
            } else if (emptySpaces.length > 0) {
                // 将方块下移到最下面的空位
                const targetRow = emptySpaces.shift();
                grid[targetRow][col] = grid[row][col];
                grid[row][col] = 0;
                emptySpaces.unshift(row);
                
                // 更新UI动画
                const tileIndex = targetRow * config.cols + col;
                const tileElement = gameGrid.children[tileIndex];
                tileElement.classList.add('falling');
                
                // 更新方块数据
                updateTile(targetRow, col);
            }
        }
        
        // 在顶部填充新方块
        for (let i = 0; i < emptySpaces.length; i++) {
            const row = emptySpaces[i];
            const color = Math.floor(Math.random() * config.colors) + 1;
            grid[row][col] = color;
            
            // 创建新方块（从上方落下）
            const tileElement = createTileElement(row, col, color);
            tileElement.classList.add('falling');
        }
    }
    
    // 清除falling类
    setTimeout(() => {
        const fallingTiles = document.querySelectorAll('.tile.falling');
        fallingTiles.forEach(tile => {
            tile.classList.remove('falling');
        });
    }, 400);
}

// 检查游戏状态
function checkGameState() {
    // 重置连击（如果没有新的匹配）
    setTimeout(() => {
        if (gameState.combo > 1) {
            playSound('combo');
        }
        gameState.combo = 0;
        comboDisplay.classList.remove('active');
        updateUI();
        
        // 检查步数是否用完
        if (gameState.movesLeft <= 0) {
            endGame(false);
        }
    }, 1000);
}

// 显示连击效果
function showComboEffect() {
    if (gameState.combo > 1) {
        comboValueElement.textContent = gameState.combo;
        comboDisplay.classList.add('active');
        
        // 3秒后隐藏
        setTimeout(() => {
            comboDisplay.classList.remove('active');
        }, 3000);
    }
}

// 更新UI
function updateUI() {
    scoreElement.textContent = gameState.score;
    movesElement.textContent = gameState.movesLeft;
    timeElement.textContent = `${gameState.timeLeft}s`;
    comboElement.textContent = gameState.combo;
    hintCountElement.textContent = gameState.hintCount;
    
    // 更新时间颜色
    if (gameState.timeLeft <= 60) {
        timeElement.style.color = "#ff3366";
    } else if (gameState.timeLeft <= 120) {
        timeElement.style.color = "#ffcc00";
    } else {
        timeElement.style.color = "#00ffff";
    }
    
    // 更新步数颜色
    if (gameState.movesLeft <= 20) {
        movesElement.style.color = "#ff3366";
    } else if (gameState.movesLeft <= 50) {
        movesElement.style.color = "#ffcc00";
    } else {
        movesElement.style.color = "#ff3366";
    }
}

// 开始计时器
function startTimer() {
    gameState.timer = setInterval(() => {
        gameState.timeLeft--;
        updateUI();
        
        if (gameState.timeLeft <= 0) {
            endGame(false);
        }
    }, 1000);
}

// 结束游戏
function endGame(isWin) {
    gameState.gameOver = true;
    clearInterval(gameState.timer);
    
    if (isWin) {
        playSound('win');
        gameStatusElement.textContent = `恭喜获胜！最终得分：${gameState.score}`;
        gameStatusElement.style.color = "#00ff00";
        
        // 获胜特效
        document.body.style.animation = "none";
        setTimeout(() => {
            document.body.style.background = "linear-gradient(135deg, #00ff00, #00cc00, #009900)";
            setTimeout(() => {
                document.body.style.background = "linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)";
            }, 1000);
        }, 100);
    } else {
        gameStatusElement.textContent = `游戏结束！最终得分：${gameState.score}`;
        gameStatusElement.style.color = "#ff3366";
    }
}

// 提示功能
function showHint() {
    if (gameState.hintCount <= 0 || gameState.gameOver) {
        gameStatusElement.textContent = "提示次数已用完";
        gameStatusElement.style.color = "#ff3366";
        return;
    }
    
    // 查找可能的匹配
    for (let row = 0; row < config.rows; row++) {
        for (let col = 0; col < config.cols; col++) {
            // 检查与右侧方块交换
            if (col < config.cols - 1) {
                swapTiles(row, col, row, col + 1);
                const matches = findMatches();
                swapTiles(row, col, row, col + 1); // 换回来
                
                if (matches.length > 0) {
                    highlightHint(row, col, row, col + 1);
                    gameState.hintCount--;
                    updateUI();
                    return;
                }
            }
            
            // 检查与下方方块交换
            if (row < config.rows - 1) {
                swapTiles(row, col, row + 1, col);
                const matches = findMatches();
                swapTiles(row, col, row + 1, col); // 换回来
                
                if (matches.length > 0) {
                    highlightHint(row, col, row + 1, col);
                    gameState.hintCount--;
                    updateUI();
                    return;
                }
            }
        }
    }
    
    gameStatusElement.textContent = "未找到可匹配的交换";
    gameStatusElement.style.color = "#ffcc00";
}

// 高亮提示
function highlightHint(row1, col1, row2, col2) {
    const tile1Index = row1 * config.cols + col1;
    const tile2Index = row2 * config.cols + col2;
    
    const tile1 = gameGrid.children[tile1Index];
    const tile2 = gameGrid.children[tile2Index];
    
    // 保存原始样式
    const originalBoxShadow1 = tile1.style.boxShadow;
    const originalBoxShadow2 = tile2.style.boxShadow;
    
    // 高亮显示
    tile1.style.boxShadow = "0 0 0 4px #000, 0 0 0 6px #ffcc00, 0 0 30px #ffcc00";
    tile2.style.boxShadow = "0 0 0 4px #000, 0 0 0 6px #ffcc00, 0 0 30px #ffcc00";
    
    gameStatusElement.textContent = "提示：尝试交换高亮的两个方块";
    gameStatusElement.style.color = "#ffcc00";
    
    // 3秒后取消高亮
    setTimeout(() => {
        tile1.style.boxShadow = originalBoxShadow1;
        tile2.style.boxShadow = originalBoxShadow2;
    }, 3000);
}

// 切换音效
function toggleSound() {
    gameState.soundEnabled = !gameState.soundEnabled;
    soundBtn.innerHTML = gameState.soundEnabled ? 
        '<i class="fas fa-volume-up"></i> 音效开' : 
        '<i class="fas fa-volume-mute"></i> 音效关';
    
    soundBtn.style.background = gameState.soundEnabled ? 
        "linear-gradient(45deg, #009933, #00cc66)" : 
        "linear-gradient(45deg, #666666, #999999)";
}

// 事件监听器
restartBtn.addEventListener('click', initGame);
hintBtn.addEventListener('click', showHint);
soundBtn.addEventListener('click', toggleSound);

// 初始化游戏
initGame();

// 添加键盘快捷键
document.addEventListener('keydown', (e) => {
    if (e.key === 'r' || e.key === 'R') {
        initGame();
    } else if (e.key === 'h' || e.key === 'H') {
        showHint();
    } else if (e.key === 'm' || e.key === 'M') {
        toggleSound();
    } else if (e.key === 'Escape') {
        if (gameState.selectedTile) {
            const tileIndex = gameState.selectedTile.row * config.cols + gameState.selectedTile.col;
            const tileElement = gameGrid.children[tileIndex];
            tileElement.classList.remove('selected');
            gameState.selectedTile = null;
            gameStatusElement.textContent = "已取消选择";
        }
    }
});

// 添加触摸设备优化
let touchStartX, touchStartY;
document.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
}, { passive: true });

// 窗口调整大小时重新计算布局
window.addEventListener('resize', () => {
    // 可以在这里添加响应式调整
    console.log("窗口大小改变，游戏已适配");
});
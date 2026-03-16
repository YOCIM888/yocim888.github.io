// 游戏变量
let grid = [];
let score = 0;
let bestScore = localStorage.getItem('bestScore2048') || 0;
let gameOver = false;
let gameWon = false;
const gridSize = 4;

// DOM元素
const scoreElement = document.getElementById('current-score');
const bestElement = document.getElementById('best-score');
const tileContainer = document.getElementById('tile-container');
const gameMessage = document.getElementById('game-message');
const messageTitle = document.getElementById('message-title');
const messageSubtitle = document.getElementById('message-subtitle');
const messageButton = document.getElementById('message-button');
const newGameBtn = document.getElementById('new-game-btn');
const gridElement = document.getElementById('grid');

// 方向按钮
const upBtn = document.getElementById('up-btn');
const downBtn = document.getElementById('down-btn');
const leftBtn = document.getElementById('left-btn');
const rightBtn = document.getElementById('right-btn');

// 初始化游戏
function initGame() {
    // 初始化网格
    grid = Array(gridSize).fill().map(() => Array(gridSize).fill(0));
    
    // 显示最高分
    bestElement.textContent = bestScore;
    
    // 创建网格单元格
    createGridCells();
    
    // 添加初始方块
    addRandomTile();
    addRandomTile();
    
    // 渲染网格
    updateGrid();
    
    // 重置游戏状态
    gameOver = false;
    gameWon = false;
    hideGameMessage();
}

// 创建网格单元格
function createGridCells() {
    gridElement.innerHTML = '';
    
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            cell.dataset.row = row;
            cell.dataset.col = col;
            gridElement.appendChild(cell);
        }
    }
}

// 开始新游戏
function newGame() {
    score = 0;
    scoreElement.textContent = score;
    initGame();
}

// 添加随机方块
function addRandomTile() {
    // 查找所有空位置
    const emptyCells = [];
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            if (grid[row][col] === 0) {
                emptyCells.push({row, col});
            }
        }
    }
    
    // 如果有空位置，随机选择一个并放置2或4（90%的概率为2）
    if (emptyCells.length > 0) {
        const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        grid[randomCell.row][randomCell.col] = Math.random() < 0.9 ? 2 : 4;
    }
}

// 更新网格显示
function updateGrid() {
    // 清除所有现有方块
    tileContainer.innerHTML = '';
    
    // 计算每个单元格的大小
    const containerWidth = document.querySelector('.grid-background').offsetWidth;
    const cellSize = (containerWidth - 10 * (gridSize + 1)) / gridSize;
    
    // 创建并放置方块
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const value = grid[row][col];
            if (value !== 0) {
                const tile = document.createElement('div');
                tile.className = `tile tile-${value}`;
                
                const tileValue = document.createElement('div');
                tileValue.className = 'tile-value';
                tileValue.textContent = value;
                tile.appendChild(tileValue);
                
                // 设置位置和大小
                const x = col * (cellSize + 10);
                const y = row * (cellSize + 10);
                
                tile.style.width = `${cellSize}px`;
                tile.style.height = `${cellSize}px`;
                tile.style.left = `${x}px`;
                tile.style.top = `${y}px`;
                
                // 如果方块是新生成的，添加动画
                if (tileContainer.children.length < 2) {
                    tile.style.opacity = '0';
                    tile.style.transform = 'scale(0)';
                    setTimeout(() => {
                        tile.style.opacity = '1';
                        tile.style.transform = 'scale(1)';
                    }, 50);
                }
                
                tileContainer.appendChild(tile);
            }
        }
    }
}

// 移动方块
function move(direction) {
    if (gameOver) return;
    
    // 保存移动前的网格状态，用于检查是否有变化
    const oldGrid = JSON.parse(JSON.stringify(grid));
    let moved = false;
    
    // 根据方向移动
    switch(direction) {
        case 'left':
            moved = moveLeft();
            break;
        case 'right':
            moved = moveRight();
            break;
        case 'up':
            moved = moveUp();
            break;
        case 'down':
            moved = moveDown();
            break;
    }
    
    // 如果网格有变化，添加新方块并更新显示
    if (moved) {
        addRandomTile();
        updateGrid();
        updateScore();
        
        // 检查游戏是否胜利
        if (!gameWon) {
            checkWin();
        }
        
        // 检查游戏是否结束
        if (!gameOver) {
            checkGameOver();
        }
    }
}

// 向左移动
function moveLeft() {
    let moved = false;
    
    for (let row = 0; row < gridSize; row++) {
        // 移除空格子
        const filteredRow = grid[row].filter(val => val !== 0);
        
        // 合并相同数字
        for (let col = 0; col < filteredRow.length - 1; col++) {
            if (filteredRow[col] === filteredRow[col + 1]) {
                filteredRow[col] *= 2;
                filteredRow[col + 1] = 0;
                score += filteredRow[col];
                moved = true;
                
                // 添加合并动画效果
                const tile = document.querySelector(`.tile[data-row="${row}"][data-col="${col}"]`);
                if (tile) {
                    tile.classList.add('merge-animation');
                    setTimeout(() => tile.classList.remove('merge-animation'), 300);
                }
            }
        }
        
        // 再次移除空格子（由合并产生的）
        const newRow = filteredRow.filter(val => val !== 0);
        
        // 用0填充剩余位置
        while (newRow.length < gridSize) {
            newRow.push(0);
        }
        
        // 检查行是否发生变化
        if (!arraysEqual(grid[row], newRow)) {
            moved = true;
        }
        
        grid[row] = newRow;
    }
    
    return moved;
}

// 向右移动
function moveRight() {
    let moved = false;
    
    for (let row = 0; row < gridSize; row++) {
        // 移除空格子
        const filteredRow = grid[row].filter(val => val !== 0);
        
        // 合并相同数字
        for (let col = filteredRow.length - 1; col > 0; col--) {
            if (filteredRow[col] === filteredRow[col - 1]) {
                filteredRow[col] *= 2;
                filteredRow[col - 1] = 0;
                score += filteredRow[col];
                moved = true;
            }
        }
        
        // 再次移除空格子（由合并产生的）
        const newRow = filteredRow.filter(val => val !== 0);
        
        // 用0填充剩余位置（在前面填充）
        while (newRow.length < gridSize) {
            newRow.unshift(0);
        }
        
        // 检查行是否发生变化
        if (!arraysEqual(grid[row], newRow)) {
            moved = true;
        }
        
        grid[row] = newRow;
    }
    
    return moved;
}

// 向上移动
function moveUp() {
    let moved = false;
    
    for (let col = 0; col < gridSize; col++) {
        // 获取列数据
        let column = [];
        for (let row = 0; row < gridSize; row++) {
            column.push(grid[row][col]);
        }
        
        // 移除空格子
        const filteredCol = column.filter(val => val !== 0);
        
        // 合并相同数字
        for (let row = 0; row < filteredCol.length - 1; row++) {
            if (filteredCol[row] === filteredCol[row + 1]) {
                filteredCol[row] *= 2;
                filteredCol[row + 1] = 0;
                score += filteredCol[row];
                moved = true;
            }
        }
        
        // 再次移除空格子（由合并产生的）
        const newCol = filteredCol.filter(val => val !== 0);
        
        // 用0填充剩余位置
        while (newCol.length < gridSize) {
            newCol.push(0);
        }
        
        // 检查列是否发生变化并更新网格
        for (let row = 0; row < gridSize; row++) {
            if (grid[row][col] !== newCol[row]) {
                moved = true;
            }
            grid[row][col] = newCol[row];
        }
    }
    
    return moved;
}

// 向下移动
function moveDown() {
    let moved = false;
    
    for (let col = 0; col < gridSize; col++) {
        // 获取列数据
        let column = [];
        for (let row = 0; row < gridSize; row++) {
            column.push(grid[row][col]);
        }
        
        // 移除空格子
        const filteredCol = column.filter(val => val !== 0);
        
        // 合并相同数字
        for (let row = filteredCol.length - 1; row > 0; row--) {
            if (filteredCol[row] === filteredCol[row - 1]) {
                filteredCol[row] *= 2;
                filteredCol[row - 1] = 0;
                score += filteredCol[row];
                moved = true;
            }
        }
        
        // 再次移除空格子（由合并产生的）
        const newCol = filteredCol.filter(val => val !== 0);
        
        // 用0填充剩余位置（在前面填充）
        while (newCol.length < gridSize) {
            newCol.unshift(0);
        }
        
        // 检查列是否发生变化并更新网格
        for (let row = 0; row < gridSize; row++) {
            if (grid[row][col] !== newCol[row]) {
                moved = true;
            }
            grid[row][col] = newCol[row];
        }
    }
    
    return moved;
}

// 检查是否获胜
function checkWin() {
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            if (grid[row][col] === 2048) {
                gameWon = true;
                showGameMessage('任务完成!', '成功合成2048方块!', false);
                return;
            }
        }
    }
}

// 检查游戏是否结束
function checkGameOver() {
    // 检查是否有空位置
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            if (grid[row][col] === 0) {
                return; // 还有空位置，游戏继续
            }
        }
    }
    
    // 检查是否还有可能的移动
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const value = grid[row][col];
            
            // 检查右侧是否有相同值
            if (col < gridSize - 1 && grid[row][col + 1] === value) {
                return; // 有可合并的方块，游戏继续
            }
            
            // 检查下方是否有相同值
            if (row < gridSize - 1 && grid[row + 1][col] === value) {
                return; // 有可合并的方块，游戏继续
            }
        }
    }
    
    // 没有空位且没有可合并的方块，游戏结束
    gameOver = true;
    showGameMessage('游戏结束!', '没有可移动的方块了!', true);
}

// 显示游戏消息
function showGameMessage(title, subtitle, isGameOver) {
    messageTitle.textContent = title;
    messageSubtitle.textContent = subtitle;
    messageButton.innerHTML = isGameOver ? '<i class="fas fa-redo"></i><span>再试一次</span>' : '<i class="fas fa-play"></i><span>继续游戏</span>';
    gameMessage.style.display = 'flex';
}

// 隐藏游戏消息
function hideGameMessage() {
    gameMessage.style.display = 'none';
}

// 更新分数
function updateScore() {
    scoreElement.textContent = score;
    
    // 更新最高分
    if (score > bestScore) {
        bestScore = score;
        bestElement.textContent = bestScore;
        localStorage.setItem('bestScore2048', bestScore);
        
        // 添加分数更新动画
        bestElement.classList.add('score-update');
        setTimeout(() => bestElement.classList.remove('score-update'), 1000);
    }
}

// 辅助函数：比较两个数组是否相等
function arraysEqual(a, b) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

// 事件监听器
function setupEventListeners() {
    // 新游戏按钮
    newGameBtn.addEventListener('click', newGame);
    
    // 消息按钮
    messageButton.addEventListener('click', () => {
        if (gameOver) {
            newGame();
        } else {
            hideGameMessage();
        }
    });
    
    // 方向按钮
    upBtn.addEventListener('click', () => move('up'));
    downBtn.addEventListener('click', () => move('down'));
    leftBtn.addEventListener('click', () => move('left'));
    rightBtn.addEventListener('click', () => move('right'));
    
    // 键盘控制
    document.addEventListener('keydown', function(event) {
        // 如果游戏结束，只有回车键可以开始新游戏
        if (gameOver && event.key === 'Enter') {
            newGame();
            return;
        }
        
        // 游戏进行中的键盘控制
        switch(event.key) {
            case 'ArrowLeft':
            case 'a':
            case 'A':
                event.preventDefault();
                move('left');
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                event.preventDefault();
                move('right');
                break;
            case 'ArrowUp':
            case 'w':
            case 'W':
                event.preventDefault();
                move('up');
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                event.preventDefault();
                move('down');
                break;
            case 'Enter':
                if (!gameOver) {
                    newGame();
                }
                break;
            case 'Escape':
                hideGameMessage();
                break;
        }
    });
    
    // 触摸滑动控制（移动设备）
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;
    
    document.addEventListener('touchstart', function(event) {
        touchStartX = event.touches[0].clientX;
        touchStartY = event.touches[0].clientY;
        event.preventDefault();
    }, { passive: false });
    
    document.addEventListener('touchmove', function(event) {
        event.preventDefault();
    }, { passive: false });
    
    document.addEventListener('touchend', function(event) {
        if (!touchStartX || !touchStartY) return;
        
        touchEndX = event.changedTouches[0].clientX;
        touchEndY = event.changedTouches[0].clientY;
        
        const dx = touchEndX - touchStartX;
        const dy = touchEndY - touchStartY;
        
        // 确定滑动方向（需要最小滑动距离）
        const minSwipeDistance = 30;
        
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > minSwipeDistance) {
            // 水平滑动
            if (dx > 0) {
                move('right');
            } else {
                move('left');
            }
        } else if (Math.abs(dy) > minSwipeDistance) {
            // 垂直滑动
            if (dy > 0) {
                move('down');
            } else {
                move('up');
            }
        }
        
        // 重置触摸起点
        touchStartX = 0;
        touchStartY = 0;
    });
}

// 窗口调整大小时重新计算网格
window.addEventListener('resize', updateGrid);

// 初始化游戏
window.onload = function() {
    initGame();
    setupEventListeners();
};
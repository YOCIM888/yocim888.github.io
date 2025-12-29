// 游戏状态变量
let gameState = {
    board: [],
    currentPlayer: 'red', // 'red' 或 'black'
    selectedPiece: null,
    validMoves: [],
    gameMode: 'two-player', // 'two-player' 或 'ai'
    aiDifficulty: 3, // 1, 2, 3
    moveHistory: [],
    capturedPieces: { red: [], black: [] },
    gameActive: true
};

// 修正后的棋子初始布局 - 正确的中国象棋布局
const initialBoard = [
    // 黑方 (上方)
    ['车', '马', '象', '士', '将', '士', '象', '马', '车'], // 第0行
    ['', '', '', '', '', '', '', '', ''], // 第1行
    ['', '炮', '', '', '', '', '', '炮', ''], // 第2行
    ['卒', '', '卒', '', '卒', '', '卒', '', '卒'], // 第3行
    ['', '', '', '', '', '', '', '', ''], // 第4行
    // 红方 (下方)
    ['', '', '', '', '', '', '', '', ''], // 第5行
    ['兵', '', '兵', '', '兵', '', '兵', '', '兵'], // 第6行
    ['', '炮', '', '', '', '', '', '炮', ''], // 第7行
    ['', '', '', '', '', '', '', '', ''], // 第8行
    ['车', '马', '相', '仕', '帅', '仕', '相', '马', '车']  // 第9行
];

// 棋子颜色映射 (红方用红色字，黑方用黑色字) - 修正版本
const pieceColors = [
    // 黑方 (上方)
    ['black', 'black', 'black', 'black', 'black', 'black', 'black', 'black', 'black'], // 第0行
    ['', '', '', '', '', '', '', '', ''], // 第1行
    ['', 'black', '', '', '', '', '', 'black', ''], // 第2行
    ['black', '', 'black', '', 'black', '', 'black', '', 'black'], // 第3行
    ['', '', '', '', '', '', '', '', ''], // 第4行
    // 红方 (下方)
    ['', '', '', '', '', '', '', '', ''], // 第5行
    ['red', '', 'red', '', 'red', '', 'red', '', 'red'], // 第6行
    ['', 'red', '', '', '', '', '', 'red', ''], // 第7行
    ['', '', '', '', '', '', '', '', ''], // 第8行
    ['red', 'red', 'red', 'red', 'red', 'red', 'red', 'red', 'red']  // 第9行
];

// 初始化游戏
function initGame() {
    // 创建棋盘状态数组
    gameState.board = [];
    for (let row = 0; row < 10; row++) {
        gameState.board[row] = [];
        for (let col = 0; col < 9; col++) {
            // 存储棋子信息：{type: 棋子类型, color: 颜色}
            if (initialBoard[row][col]) {
                gameState.board[row][col] = {
                    type: initialBoard[row][col],
                    color: pieceColors[row][col]
                };
            } else {
                gameState.board[row][col] = null;
            }
        }
    }
    
    gameState.currentPlayer = 'red';
    gameState.selectedPiece = null;
    gameState.validMoves = [];
    gameState.moveHistory = [];
    gameState.capturedPieces = { red: [], black: [] };
    gameState.gameActive = true;
    
    updateCurrentPlayerDisplay();
    updateStatusMessage('游戏开始！红方先行。');
    updateMoveHistory();
    updateCapturedPiecesDisplay();
    renderBoard();
}

// 渲染棋盘
function renderBoard() {
    const board = document.getElementById('chessboard');
    board.innerHTML = '';
    
    // 添加棋盘装饰线
    const centerLine = document.createElement('div');
    centerLine.className = 'center-line';
    board.appendChild(centerLine);
    
    const palaceTop = document.createElement('div');
    palaceTop.className = 'palace top';
    board.appendChild(palaceTop);
    
    const palaceBottom = document.createElement('div');
    palaceBottom.className = 'palace bottom';
    board.appendChild(palaceBottom);
    
    // 创建棋盘格子和棋子
    for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 9; col++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = row;
            cell.dataset.col = col;
            
            // 添加棋子
            const pieceInfo = gameState.board[row][col];
            if (pieceInfo) {
                const pieceElement = document.createElement('div');
                pieceElement.className = `piece ${pieceInfo.color}`;
                pieceElement.innerText = pieceInfo.type;
                cell.appendChild(pieceElement);
            }
            
            // 高亮显示可移动位置
            if (gameState.validMoves.some(move => move.row === row && move.col === col)) {
                const targetPiece = gameState.board[row][col];
                if (targetPiece) {
                    cell.classList.add('valid-capture');
                } else {
                    cell.classList.add('valid-move');
                }
            }
            
            // 高亮显示选中的棋子
            if (gameState.selectedPiece && 
                gameState.selectedPiece.row === row && 
                gameState.selectedPiece.col === col) {
                cell.classList.add('selected');
            }
            
            cell.addEventListener('click', () => handleCellClick(row, col));
            board.appendChild(cell);
        }
    }
}

// 处理格子点击事件
function handleCellClick(row, col) {
    if (!gameState.gameActive) return;
    
    const pieceInfo = gameState.board[row][col];
    
    // 如果已经有选中的棋子
    if (gameState.selectedPiece) {
        const { row: selectedRow, col: selectedCol } = gameState.selectedPiece;
        const selectedPiece = gameState.board[selectedRow][selectedCol];
        
        // 检查点击的是否是有效移动位置
        const isValidMove = gameState.validMoves.some(move => move.row === row && move.col === col);
        
        if (isValidMove) {
            // 移动棋子
            movePiece(selectedRow, selectedCol, row, col);
            
            // 如果是AI模式且轮到AI走棋
            if (gameState.gameMode === 'ai' && gameState.currentPlayer === 'black' && gameState.gameActive) {
                setTimeout(makeAIMove, 500);
            }
        } else {
            // 如果点击的是自己的另一个棋子，则选中该棋子
            if (pieceInfo && pieceInfo.color === gameState.currentPlayer) {
                selectPiece(row, col);
            } else {
                // 否则取消选择
                clearSelection();
            }
        }
    } else {
        // 如果没有选中的棋子，且点击的是当前玩家的棋子，则选中它
        if (pieceInfo && pieceInfo.color === gameState.currentPlayer) {
            selectPiece(row, col);
        }
    }
}

// 选中棋子
function selectPiece(row, col) {
    gameState.selectedPiece = { row, col };
    gameState.validMoves = calculateValidMoves(row, col);
    renderBoard();
    
    const piece = gameState.board[row][col];
    updateStatusMessage(`选中${piece.color === 'red' ? '红' : '黑'}方${piece.type}，请选择目标位置`);
}

// 清除选择
function clearSelection() {
    gameState.selectedPiece = null;
    gameState.validMoves = [];
    renderBoard();
}

// 计算有效移动位置
function calculateValidMoves(row, col) {
    const piece = gameState.board[row][col];
    if (!piece) return [];
    
    const moves = [];
    const color = piece.color; // 'red' 或 'black'
    const type = piece.type;
    
    // 根据棋子类型计算有效移动
    switch (type) {
        case '帅':
        case '将':
            moves.push(...calculateKingMoves(row, col, color));
            break;
        case '仕':
        case '士':
            moves.push(...calculateAdvisorMoves(row, col, color));
            break;
        case '相':
        case '象':
            moves.push(...calculateBishopMoves(row, col, color));
            break;
        case '马':
            moves.push(...calculateKnightMoves(row, col, color));
            break;
        case '车':
            moves.push(...calculateRookMoves(row, col, color));
            break;
        case '炮':
            moves.push(...calculateCannonMoves(row, col, color));
            break;
        case '兵':
        case '卒':
            moves.push(...calculatePawnMoves(row, col, color));
            break;
    }
    
    // 过滤掉不合法的移动（不能移动到己方棋子的位置）
    return moves.filter(move => {
        const targetPiece = gameState.board[move.row][move.col];
        return !targetPiece || targetPiece.color !== color;
    });
}

// 帅/将的移动规则
function calculateKingMoves(row, col, color) {
    const moves = [];
    
    // 红帅在下方，黑将在上方
    const palaceBounds = color === 'red' ? 
        { rowMin: 7, rowMax: 9, colMin: 3, colMax: 5 } : 
        { rowMin: 0, rowMax: 2, colMin: 3, colMax: 5 };
    
    // 上下左右移动
    const directions = [
        { dr: -1, dc: 0 }, // 上
        { dr: 1, dc: 0 },  // 下
        { dr: 0, dc: -1 }, // 左
        { dr: 0, dc: 1 }   // 右
    ];
    
    for (const dir of directions) {
        const newRow = row + dir.dr;
        const newCol = col + dir.dc;
        
        if (newRow >= palaceBounds.rowMin && newRow <= palaceBounds.rowMax &&
            newCol >= palaceBounds.colMin && newCol <= palaceBounds.colMax) {
            moves.push({ row: newRow, col: newCol });
        }
    }
    
    return moves;
}

// 仕/士的移动规则
function calculateAdvisorMoves(row, col, color) {
    const moves = [];
    
    // 红仕在下方，黑士在上方
    const palaceBounds = color === 'red' ? 
        { rowMin: 7, rowMax: 9, colMin: 3, colMax: 5 } : 
        { rowMin: 0, rowMax: 2, colMin: 3, colMax: 5 };
    
    // 斜向移动
    const directions = [
        { dr: -1, dc: -1 }, // 左上
        { dr: -1, dc: 1 },  // 右上
        { dr: 1, dc: -1 },  // 左下
        { dr: 1, dc: 1 }    // 右下
    ];
    
    for (const dir of directions) {
        const newRow = row + dir.dr;
        const newCol = col + dir.dc;
        
        if (newRow >= palaceBounds.rowMin && newRow <= palaceBounds.rowMax &&
            newCol >= palaceBounds.colMin && newCol <= palaceBounds.colMax) {
            moves.push({ row: newRow, col: newCol });
        }
    }
    
    return moves;
}

// 相/象的移动规则
function calculateBishopMoves(row, col, color) {
    const moves = [];
    
    // 相/象不能过河
    const riverBoundary = color === 'red' ? 5 : 4;
    
    // 田字移动
    const directions = [
        { dr: -2, dc: -2, blockRow: row - 1, blockCol: col - 1 }, // 左上
        { dr: -2, dc: 2, blockRow: row - 1, blockCol: col + 1 },  // 右上
        { dr: 2, dc: -2, blockRow: row + 1, blockCol: col - 1 },  // 左下
        { dr: 2, dc: 2, blockRow: row + 1, blockCol: col + 1 }    // 右下
    ];
    
    for (const dir of directions) {
        const newRow = row + dir.dr;
        const newCol = col + dir.dc;
        
        // 检查是否在棋盘内
        if (newRow >= 0 && newRow < 10 && newCol >= 0 && newCol < 9) {
            // 检查是否过河
            if ((color === 'red' && newRow >= riverBoundary) || 
                (color === 'black' && newRow <= riverBoundary)) {
                // 检查象眼是否被堵
                if (!gameState.board[dir.blockRow] || !gameState.board[dir.blockRow][dir.blockCol]) {
                    moves.push({ row: newRow, col: newCol });
                }
            }
        }
    }
    
    return moves;
}

// 马的移动规则
function calculateKnightMoves(row, col, color) {
    const moves = [];
    
    // 马走日，8个可能的方向
    const directions = [
        { dr: -2, dc: -1, blockRow: row - 1, blockCol: col }, // 左上竖
        { dr: -2, dc: 1, blockRow: row - 1, blockCol: col },  // 右上竖
        { dr: -1, dc: -2, blockRow: row, blockCol: col - 1 }, // 左上横
        { dr: -1, dc: 2, blockRow: row, blockCol: col + 1 },  // 右上横
        { dr: 1, dc: -2, blockRow: row, blockCol: col - 1 },  // 左下横
        { dr: 1, dc: 2, blockRow: row, blockCol: col + 1 },   // 右下横
        { dr: 2, dc: -1, blockRow: row + 1, blockCol: col },  // 左下竖
        { dr: 2, dc: 1, blockRow: row + 1, blockCol: col }    // 右下竖
    ];
    
    for (const dir of directions) {
        const newRow = row + dir.dr;
        const newCol = col + dir.dc;
        
        // 检查是否在棋盘内
        if (newRow >= 0 && newRow < 10 && newCol >= 0 && newCol < 9) {
            // 检查马腿是否被堵
            if (!gameState.board[dir.blockRow] || !gameState.board[dir.blockRow][dir.blockCol]) {
                moves.push({ row: newRow, col: newCol });
            }
        }
    }
    
    return moves;
}

// 车的移动规则
function calculateRookMoves(row, col, color) {
    const moves = [];
    
    // 四个方向：上、下、左、右
    const directions = [
        { dr: -1, dc: 0 }, // 上
        { dr: 1, dc: 0 },  // 下
        { dr: 0, dc: -1 }, // 左
        { dr: 0, dc: 1 }   // 右
    ];
    
    for (const dir of directions) {
        let newRow = row + dir.dr;
        let newCol = col + dir.dc;
        
        while (newRow >= 0 && newRow < 10 && newCol >= 0 && newCol < 9) {
            const targetPiece = gameState.board[newRow][newCol];
            
            if (targetPiece) {
                // 如果遇到棋子，可以吃掉对方棋子，但不能继续前进
                moves.push({ row: newRow, col: newCol });
                break;
            } else {
                // 空白位置，可以移动
                moves.push({ row: newRow, col: newCol });
            }
            
            newRow += dir.dr;
            newCol += dir.dc;
        }
    }
    
    return moves;
}

// 炮的移动规则
function calculateCannonMoves(row, col, color) {
    const moves = [];
    
    // 四个方向：上、下、左、右
    const directions = [
        { dr: -1, dc: 0 }, // 上
        { dr: 1, dc: 0 },  // 下
        { dr: 0, dc: -1 }, // 左
        { dr: 0, dc: 1 }   // 右
    ];
    
    for (const dir of directions) {
        let newRow = row + dir.dr;
        let newCol = col + dir.dc;
        let foundPiece = false;
        
        while (newRow >= 0 && newRow < 10 && newCol >= 0 && newCol < 9) {
            const targetPiece = gameState.board[newRow][newCol];
            
            if (!foundPiece) {
                // 在遇到第一个棋子之前，只能移动到空白位置
                if (!targetPiece) {
                    moves.push({ row: newRow, col: newCol });
                } else {
                    // 遇到第一个棋子，标记已找到
                    foundPiece = true;
                }
            } else {
                // 在遇到第一个棋子之后，只能移动到有棋子的位置（吃子）
                if (targetPiece) {
                    // 可以吃掉对方棋子
                    moves.push({ row: newRow, col: newCol });
                    break;
                }
            }
            
            newRow += dir.dr;
            newCol += dir.dc;
        }
    }
    
    return moves;
}

// 兵/卒的移动规则
function calculatePawnMoves(row, col, color) {
    const moves = [];
    
    // 判断是否过河
    const crossedRiver = (color === 'red' && row <= 4) || (color === 'black' && row >= 5);
    
    // 红兵向前是减少行号，黑卒向前是增加行号
    const forwardDir = color === 'red' ? -1 : 1;
    
    // 向前移动
    const newRow = row + forwardDir;
    if (newRow >= 0 && newRow < 10) {
        moves.push({ row: newRow, col });
    }
    
    // 过河后可以左右移动
    if (crossedRiver) {
        // 向左移动
        if (col > 0) {
            moves.push({ row, col: col - 1 });
        }
        
        // 向右移动
        if (col < 8) {
            moves.push({ row, col: col + 1 });
        }
    }
    
    return moves;
}

// 移动棋子
function movePiece(fromRow, fromCol, toRow, toCol) {
    const piece = gameState.board[fromRow][fromCol];
    const targetPiece = gameState.board[toRow][toCol];
    
    // 记录移动
    const moveRecord = {
        piece: piece,
        from: { row: fromRow, col: fromCol },
        to: { row: toRow, col: toCol },
        captured: targetPiece
    };
    
    gameState.moveHistory.push(moveRecord);
    
    // 如果有吃子，记录
    if (targetPiece) {
        const capturedColor = targetPiece.color;
        gameState.capturedPieces[capturedColor].push(targetPiece);
        updateCapturedPiecesDisplay();
    }
    
    // 移动棋子
    gameState.board[toRow][toCol] = piece;
    gameState.board[fromRow][fromCol] = null;
    
    // 切换玩家
    gameState.currentPlayer = gameState.currentPlayer === 'red' ? 'black' : 'red';
    
    // 清除选择
    clearSelection();
    
    // 更新显示
    updateCurrentPlayerDisplay();
    updateMoveHistory();
    
    // 检查游戏是否结束
    if (checkGameEnd()) {
        return;
    }
    
    // 更新状态消息
    const capturedText = targetPiece ? `吃掉了${targetPiece.color === 'red' ? '红' : '黑'}方${targetPiece.type}` : '';
    updateStatusMessage(`${piece.color === 'red' ? '红' : '黑'}方${piece.type}从${convertToChessNotation(fromRow, fromCol)}移动到${convertToChessNotation(toRow, toCol)}${capturedText}`);
}

// 检查游戏是否结束
function checkGameEnd() {
    // 检查红帅是否被将死
    let redKingFound = false;
    let blackKingFound = false;
    
    for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 9; col++) {
            const piece = gameState.board[row][col];
            if (piece && piece.type === '帅' && piece.color === 'red') redKingFound = true;
            if (piece && piece.type === '将' && piece.color === 'black') blackKingFound = true;
        }
    }
    
    if (!redKingFound) {
        endGame('black', '黑方获胜！红帅被将死！');
        return true;
    }
    
    if (!blackKingFound) {
        endGame('red', '红方获胜！黑将被将死！');
        return true;
    }
    
    return false;
}

// 结束游戏
function endGame(winner, message) {
    gameState.gameActive = false;
    updateStatusMessage(`游戏结束！${message}`);
    
    // 高亮显示获胜方
    const playerDisplay = document.getElementById('current-player');
    playerDisplay.innerHTML = winner === 'red' ? 
        '<span style="color:#e63946;">红方获胜！</span>' : 
        '<span style="color:#2d3748;">黑方获胜！</span>';
}

// 转换为象棋坐标表示法
function convertToChessNotation(row, col) {
    const colNames = ['九', '八', '七', '六', '五', '四', '三', '二', '一'];
    const rowNames = ['〇', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
    return `${colNames[col]}${rowNames[9-row]}`;
}

// AI走棋
function makeAIMove() {
    if (!gameState.gameActive || gameState.currentPlayer !== 'black') return;
    
    // 根据难度选择AI策略
    let move;
    switch (gameState.aiDifficulty) {
        case 1:
            move = getRandomAIMove();
            break;
        case 2:
            move = getIntermediateAIMove();
            break;
        case 3:
            move = getAdvancedAIMove();
            break;
        default:
            move = getRandomAIMove();
    }
    
    if (move) {
        // 模拟点击选择棋子
        selectPiece(move.from.row, move.from.col);
        
        // 短暂延迟后移动棋子，让玩家看到AI的选择
        setTimeout(() => {
            movePiece(move.from.row, move.from.col, move.to.row, move.to.col);
        }, 300);
    }
}

// 随机AI走棋
function getRandomAIMove() {
    const blackPieces = [];
    
    // 收集所有黑方棋子
    for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 9; col++) {
            const piece = gameState.board[row][col];
            if (piece && piece.color === 'black') {
                blackPieces.push({ row, col });
            }
        }
    }
    
    // 随机打乱棋子顺序
    shuffleArray(blackPieces);
    
    // 查找第一个有有效移动的棋子
    for (const piece of blackPieces) {
        const validMoves = calculateValidMoves(piece.row, piece.col);
        if (validMoves.length > 0) {
            const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
            return {
                from: { row: piece.row, col: piece.col },
                to: { row: randomMove.row, col: randomMove.col }
            };
        }
    }
    
    return null;
}

// 评估移动的价值
function evaluateMove(piece, toRow, toCol, targetPiece) {
    let score = 0;
    
    // 棋子基础价值
    const pieceValues = {
        '帅': 10000, '将': 10000,
        '车': 500,
        '炮': 300,
        '马': 300,
        '相': 120, '象': 120,
        '仕': 120, '士': 120,
        '兵': 50, '卒': 50
    };
    
    // 如果有吃子，增加分数
    if (targetPiece) {
        const targetValue = pieceValues[targetPiece.type] || 100;
        const attackerValue = pieceValues[piece.type] || 100;
        score += targetValue * 2 - attackerValue; // 吃高价值棋子得高分
    }
    
    // 移动到中心区域得分
    const centerCol = 4;
    const centerRow = piece.color === 'black' ? 1 : 8;
    const distanceFromCenter = Math.abs(toCol - centerCol) + Math.abs(toRow - centerRow);
    score += (8 - distanceFromCenter) * 0.1;
    
    // 进攻性移动：靠近对方将/帅
    let targetKingRow = -1, targetKingCol = -1;
    for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 9; col++) {
            const p = gameState.board[row][col];
            if (p && p.type === (piece.color === 'black' ? '帅' : '将')) {
                targetKingRow = row;
                targetKingCol = col;
                break;
            }
        }
        if (targetKingRow !== -1) break;
    }
    
    if (targetKingRow !== -1) {
        const distanceToKing = Math.abs(toRow - targetKingRow) + Math.abs(toCol - targetKingCol);
        score += (10 - distanceToKing) * 2;
    }
    
    return score;
}

// 中级AI走棋
function getIntermediateAIMove() {
    const moves = [];
    
    // 收集所有可能的走法
    for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 9; col++) {
            const piece = gameState.board[row][col];
            if (piece && piece.color === 'black') {
                const validMoves = calculateValidMoves(row, col);
                for (const move of validMoves) {
                    const targetPiece = gameState.board[move.row][move.col];
                    const score = evaluateMove(piece, move.row, move.col, targetPiece);
                    moves.push({
                        from: { row, col },
                        to: { row: move.row, col: move.col },
                        score: score
                    });
                }
            }
        }
    }
    
    // 按分数排序，选择分数高的走法
    if (moves.length > 0) {
        moves.sort((a, b) => b.score - a.score);
        
        // 有一定概率选择不是最好的走法（增加随机性）
        const randomFactor = Math.random();
        if (randomFactor < 0.95 && moves.length > 0) {
            return moves[0];
        } else if (moves.length > 1) {
            return moves[Math.floor(Math.random() * Math.min(3, moves.length))];
        }
    }
    
    return getRandomAIMove();
}

// 高级AI走棋 - 使用MiniMax算法
function getAdvancedAIMove() {
    const depth = 5; // 搜索深度，增加到越高会更难但更慢
    
    // 获取所有可能的走法
    const allMoves = getAllPossibleMoves('black');
    
    let bestMove = null;
    let bestValue = -Infinity;
    
    // 尝试每个可能的走法
    for (const move of allMoves) {
        // 执行走法
        const capturedPiece = gameState.board[move.to.row][move.to.col];
        const originalPiece = gameState.board[move.from.row][move.from.col];
        
        // 移动棋子
        gameState.board[move.to.row][move.to.col] = originalPiece;
        gameState.board[move.from.row][move.from.col] = null;
        
        // 计算这个走法的值（使用MiniMax搜索）
        const moveValue = miniMax(depth - 1, -Infinity, Infinity, false);
        
        // 撤销走法
        gameState.board[move.from.row][move.from.col] = originalPiece;
        gameState.board[move.to.row][move.to.col] = capturedPiece;
        
        if (moveValue > bestValue) {
            bestValue = moveValue;
            bestMove = move;
        }
    }
    
    // 如果没有找到最佳走法，回退到中级AI
    if (!bestMove) {
        return getIntermediateAIMove();
    }
    
    return bestMove;
}

// MiniMax算法（带Alpha-Beta剪枝）
function miniMax(depth, alpha, beta, isMaximizingPlayer) {
    // 达到最大深度或游戏结束，返回当前棋盘评估值
    if (depth === 0 || checkGameEndSimulation()) {
        return evaluateBoard();
    }
    
    const player = isMaximizingPlayer ? 'black' : 'red';
    const allMoves = getAllPossibleMoves(player);
    
    if (isMaximizingPlayer) {
        let maxEval = -Infinity;
        for (const move of allMoves) {
            // 执行走法
            const capturedPiece = gameState.board[move.to.row][move.to.col];
            const originalPiece = gameState.board[move.from.row][move.from.col];
            
            gameState.board[move.to.row][move.to.col] = originalPiece;
            gameState.board[move.from.row][move.from.col] = null;
            
            const evalValue = miniMax(depth - 1, alpha, beta, false);
            
            // 撤销走法
            gameState.board[move.from.row][move.from.col] = originalPiece;
            gameState.board[move.to.row][move.to.col] = capturedPiece;
            
            maxEval = Math.max(maxEval, evalValue);
            alpha = Math.max(alpha, evalValue);
            if (beta <= alpha) break; // Alpha-Beta剪枝
        }
        return maxEval;
    } else {
        let minEval = Infinity;
        for (const move of allMoves) {
            // 执行走法
            const capturedPiece = gameState.board[move.to.row][move.to.col];
            const originalPiece = gameState.board[move.from.row][move.from.col];
            
            gameState.board[move.to.row][move.to.col] = originalPiece;
            gameState.board[move.from.row][move.from.col] = null;
            
            const evalValue = miniMax(depth - 1, alpha, beta, true);
            
            // 撤销走法
            gameState.board[move.from.row][move.from.col] = originalPiece;
            gameState.board[move.to.row][move.to.col] = capturedPiece;
            
            minEval = Math.min(minEval, evalValue);
            beta = Math.min(beta, evalValue);
            if (beta <= alpha) break; // Alpha-Beta剪枝
        }
        return minEval;
    }
}

// 获取所有可能的走法
function getAllPossibleMoves(color) {
    const moves = [];
    
    for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 9; col++) {
            const piece = gameState.board[row][col];
            if (piece && piece.color === color) {
                const validMoves = calculateValidMoves(row, col);
                for (const move of validMoves) {
                    moves.push({
                        from: { row, col },
                        to: { row: move.row, col: move.col }
                    });
                }
            }
        }
    }
    
    // 对走法进行排序（先考虑吃子走法）
    moves.sort((a, b) => {
        const pieceA = gameState.board[a.to.row][a.to.col];
        const pieceB = gameState.board[b.to.row][b.to.col];
        
        if (pieceA && !pieceB) return -1; // 吃子优先
        if (!pieceA && pieceB) return 1;
        
        // 吃高价值棋子优先
        const pieceValues = {
            '帅': 10000, '将': 10000,
            '车': 500,
            '炮': 300,
            '马': 300,
            '相': 120, '象': 120,
            '仕': 120, '士': 120,
            '兵': 50, '卒': 50
        };
        
        const valueA = pieceA ? (pieceValues[pieceA.type] || 100) : 0;
        const valueB = pieceB ? (pieceValues[pieceB.type] || 100) : 0;
        
        return valueB - valueA;
    });
    
    return moves;
}

// 模拟检查游戏是否结束（不更新游戏状态）
function checkGameEndSimulation() {
    let redKingFound = false;
    let blackKingFound = false;
    
    for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 9; col++) {
            const piece = gameState.board[row][col];
            if (piece) {
                if (piece.type === '帅' && piece.color === 'red') redKingFound = true;
                if (piece.type === '将' && piece.color === 'black') blackKingFound = true;
            }
        }
    }
    
    return !redKingFound || !blackKingFound;
}

// 评估棋盘状态
function evaluateBoard() {
    let redScore = 0;
    let blackScore = 0;
    
    // 棋子基础价值
    const pieceValues = {
        '帅': 10000, '将': 10000,
        '车': 500,
        '炮': 300,
        '马': 300,
        '相': 120, '象': 120,
        '仕': 120, '士': 120,
        '兵': 50, '卒': 50
    };
    
    // 棋子位置价值表（黑方视角，行0-9，列0-8）
    const positionValues = {
        '车': [
            [6, 4, 5, 6, 6, 6, 5, 4, 6],
            [6, 6, 6, 8, 10, 8, 6, 6, 6],
            [8, 8, 10, 12, 14, 12, 10, 8, 8],
            [8, 10, 12, 14, 16, 14, 12, 10, 8],
            [8, 10, 12, 14, 16, 14, 12, 10, 8],
            [8, 8, 10, 12, 14, 12, 10, 8, 8],
            [6, 6, 6, 8, 10, 8, 6, 6, 6],
            [4, 4, 4, 6, 8, 6, 4, 4, 4],
            [0, 2, 2, 4, 6, 4, 2, 2, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0]
        ],
        '马': [
            [4, 6, 8, 8, 8, 8, 8, 6, 4],
            [6, 8, 10, 12, 14, 12, 10, 8, 6],
            [8, 10, 14, 16, 18, 16, 14, 10, 8],
            [10, 12, 16, 20, 22, 20, 16, 12, 10],
            [10, 12, 16, 20, 22, 20, 16, 12, 10],
            [8, 10, 14, 16, 18, 16, 14, 10, 8],
            [6, 8, 10, 12, 14, 12, 10, 8, 6],
            [4, 6, 8, 8, 8, 8, 8, 6, 4],
            [2, 4, 6, 6, 6, 6, 6, 4, 2],
            [0, 2, 4, 4, 4, 4, 4, 2, 0]
        ],
        '炮': [
            [6, 6, 6, 8, 8, 8, 6, 6, 6],
            [8, 8, 10, 12, 12, 12, 10, 8, 8],
            [8, 10, 12, 14, 14, 14, 12, 10, 8],
            [10, 12, 14, 16, 16, 16, 14, 12, 10],
            [10, 12, 14, 16, 16, 16, 14, 12, 10],
            [8, 10, 12, 14, 14, 14, 12, 10, 8],
            [6, 8, 10, 12, 12, 12, 10, 8, 6],
            [4, 6, 8, 10, 10, 10, 8, 6, 4],
            [2, 4, 6, 8, 8, 8, 6, 4, 2],
            [0, 2, 4, 6, 6, 6, 4, 2, 0]
        ]
    };
    
    // 遍历棋盘
    for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 9; col++) {
            const piece = gameState.board[row][col];
            if (piece) {
                let value = pieceValues[piece.type] || 100;
                
                // 添加位置价值
                if (positionValues[piece.type]) {
                    const posRow = piece.color === 'black' ? row : 9 - row; // 黑方视角
                    const posValue = positionValues[piece.type][posRow] ? 
                        (positionValues[piece.type][posRow][col] || 0) : 0;
                    value += posValue;
                }
                
                // 棋子灵活性加分
                const validMoves = calculateValidMoves(row, col);
                value += validMoves.length * 2; // 每有一个合法移动加2分
                
                if (piece.color === 'red') {
                    redScore += value;
                } else {
                    blackScore += value;
                }
            }
        }
    }
    
    // 黑方AI想要最大化黑方分数，最小化红方分数
    return blackScore - redScore;
}

// 洗牌数组
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// 更新当前玩家显示
function updateCurrentPlayerDisplay() {
    const playerDisplay = document.getElementById('current-player');
    playerDisplay.innerHTML = gameState.currentPlayer === 'red' ? 
        '当前回合: <span style="color:#e63946;">红方</span>' : 
        '当前回合: <span style="color:#2d3748;">黑方</span>';
}

// 更新状态消息
function updateStatusMessage(message) {
    const statusElement = document.getElementById('status-message');
    statusElement.textContent = message;
}

// 更新走棋记录
function updateMoveHistory() {
    const historyElement = document.getElementById('move-history');
    historyElement.innerHTML = '';
    
    if (gameState.moveHistory.length === 0) {
        historyElement.innerHTML = '<div>走棋记录将显示在这里...</div>';
        return;
    }
    
    // 只显示最近15步
    const startIndex = Math.max(0, gameState.moveHistory.length - 15);
    for (let i = startIndex; i < gameState.moveHistory.length; i++) {
        const move = gameState.moveHistory[i];
        const moveNumber = i + 1;
        const piece = move.piece;
        const fromNotation = convertToChessNotation(move.from.row, move.from.col);
        const toNotation = convertToChessNotation(move.to.row, move.to.col);
        const capturedText = move.captured ? `吃${move.captured.type}` : '';
        
        const moveElement = document.createElement('div');
        moveElement.innerHTML = `${moveNumber}. ${piece.color === 'red' ? '红' : '黑'}${piece.type} ${fromNotation}→${toNotation} ${capturedText}`;
        historyElement.appendChild(moveElement);
    }
    
    // 滚动到底部
    historyElement.scrollTop = historyElement.scrollHeight;
}

// 更新吃子显示
function updateCapturedPiecesDisplay() {
    const redCapturedElement = document.getElementById('red-captured');
    const blackCapturedElement = document.getElementById('black-captured');
    
    redCapturedElement.innerHTML = '红方吃子: ';
    blackCapturedElement.innerHTML = '黑方吃子: ';
    
    gameState.capturedPieces.red.forEach(piece => {
        const span = document.createElement('span');
        span.className = 'black';
        span.textContent = piece.type;
        redCapturedElement.appendChild(span);
    });
    
    gameState.capturedPieces.black.forEach(piece => {
        const span = document.createElement('span');
        span.className = 'red';
        span.textContent = piece.type;
        blackCapturedElement.appendChild(span);
    });
}

// 悔棋功能
function undoMove() {
    if (gameState.moveHistory.length === 0 || !gameState.gameActive) return;
    
    const lastMove = gameState.moveHistory.pop();
    
    // 恢复棋子位置
    gameState.board[lastMove.from.row][lastMove.from.col] = lastMove.piece;
    gameState.board[lastMove.to.row][lastMove.to.col] = lastMove.captured || null;
    
    // 如果有吃子，从吃子记录中移除
    if (lastMove.captured) {
        const capturedColor = lastMove.captured.color;
        gameState.capturedPieces[capturedColor].pop();
        updateCapturedPiecesDisplay();
    }
    
    // 切换回上一个玩家
    gameState.currentPlayer = gameState.currentPlayer === 'red' ? 'black' : 'red';
    
    // 更新显示
    updateCurrentPlayerDisplay();
    updateMoveHistory();
    renderBoard();
    
    updateStatusMessage('悔棋一步，恢复到上一步状态');
}

// 初始化事件监听器
function initEventListeners() {
    // 模式选择
    document.getElementById('two-player-mode').addEventListener('click', () => {
        setGameMode('two-player');
    });
    
    document.getElementById('ai-mode').addEventListener('click', () => {
        setGameMode('ai');
    });
    
    // 难度选择
    document.getElementById('difficulty-1').addEventListener('click', () => {
        setDifficulty(1);
    });
    
    document.getElementById('difficulty-2').addEventListener('click', () => {
        setDifficulty(2);
    });
    
    document.getElementById('difficulty-3').addEventListener('click', () => {
        setDifficulty(3);
    });
    
    // 游戏控制按钮
    document.getElementById('new-game').addEventListener('click', () => {
        initGame();
    });
    
    document.getElementById('reset-game').addEventListener('click', () => {
        initGame();
    });
    
    document.getElementById('undo-move').addEventListener('click', () => {
        undoMove();
    });
}

// 设置游戏模式
function setGameMode(mode) {
    gameState.gameMode = mode;
    
    // 更新按钮状态
    document.getElementById('two-player-mode').classList.toggle('active', mode === 'two-player');
    document.getElementById('ai-mode').classList.toggle('active', mode === 'ai');
    
    // 更新难度选择器的可见性
    const difficultySelector = document.querySelector('.difficulty-selector');
    difficultySelector.style.display = mode === 'ai' ? 'flex' : 'none';
    
    updateStatusMessage(`切换到${mode === 'two-player' ? '双人对战' : '人机对战'}模式`);
    
    // 如果切换到AI模式且当前是黑方回合，让AI走棋
    if (mode === 'ai' && gameState.currentPlayer === 'black' && gameState.gameActive) {
        setTimeout(makeAIMove, 500);
    }
}

// 设置难度
function setDifficulty(level) {
    gameState.aiDifficulty = level;
    
    // 更新按钮状态
    document.getElementById('difficulty-1').classList.toggle('active', level === 1);
    document.getElementById('difficulty-2').classList.toggle('active', level === 2);
    document.getElementById('difficulty-3').classList.toggle('active', level === 3);
    
    const difficultyNames = { 1: '简单', 2: '中等', 3: '困难' };
    updateStatusMessage(`AI难度设置为${difficultyNames[level]}`);
}

// 页面加载完成后初始化
window.addEventListener('DOMContentLoaded', () => {
    initGame();
    initEventListeners();
    
    // 设置默认模式
    setGameMode('two-player');
    setDifficulty(3);
});
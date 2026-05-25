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

// ========== 新增：将军检测相关函数 ==========

/**
 * 获取指定颜色的将/帅位置
 */
function getKingPosition(color) {
    for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 9; col++) {
            const piece = gameState.board[row][col];
            if (piece && piece.color === color && (piece.type === '帅' || piece.type === '将')) {
                return { row, col };
            }
        }
    }
    return null; // 游戏结束时可能找不到
}

/**
 * 检查某格子是否被指定颜色的棋子攻击（静态规则，不考虑移动后是否导致自己将军）
 */
function isSquareAttacked(row, col, attackerColor) {
    for (let r = 0; r < 10; r++) {
        for (let c = 0; c < 9; c++) {
            const piece = gameState.board[r][c];
            if (piece && piece.color === attackerColor) {
                // 根据棋子类型调用对应的底层移动规则函数（不考虑送将）
                let attacks = [];
                switch (piece.type) {
                    case '帅':
                    case '将':
                        attacks = calculateKingMoves(r, c, piece.color);
                        break;
                    case '仕':
                    case '士':
                        attacks = calculateAdvisorMoves(r, c, piece.color);
                        break;
                    case '相':
                    case '象':
                        attacks = calculateBishopMoves(r, c, piece.color);
                        break;
                    case '马':
                        attacks = calculateKnightMoves(r, c, piece.color);
                        break;
                    case '车':
                        attacks = calculateRookMoves(r, c, piece.color);
                        break;
                    case '炮':
                        attacks = calculateCannonMoves(r, c, piece.color);
                        break;
                    case '兵':
                    case '卒':
                        attacks = calculatePawnMoves(r, c, piece.color);
                        break;
                }
                // 如果目标位置在攻击范围内，说明被攻击
                if (attacks.some(move => move.row === row && move.col === col)) {
                    return true;
                }
            }
        }
    }
    return false;
}

/**
 * 检查指定颜色的将/帅是否被将军（包括对面笑规则）
 */
function isKingInCheck(color) {
    const kingPos = getKingPosition(color);
    if (!kingPos) return false; // 王不存在，游戏已结束，但此处返回false避免干扰

    // 1. 检查是否被对方棋子攻击
    const opponentColor = color === 'red' ? 'black' : 'red';
    if (isSquareAttacked(kingPos.row, kingPos.col, opponentColor)) {
        return true;
    }

    // 2. 检查将帅照面（对面笑）
    const opponentKingPos = getKingPosition(opponentColor);
    if (opponentKingPos && kingPos.col === opponentKingPos.col) {
        // 同一列，检查中间是否有棋子
        let minRow = Math.min(kingPos.row, opponentKingPos.row);
        let maxRow = Math.max(kingPos.row, opponentKingPos.row);
        let hasPieceBetween = false;
        for (let r = minRow + 1; r < maxRow; r++) {
            if (gameState.board[r][kingPos.col] !== null) {
                hasPieceBetween = true;
                break;
            }
        }
        if (!hasPieceBetween) {
            // 中间无棋子，构成对面笑
            return true;
        }
    }

    return false;
}

/**
 * 检查指定颜色是否存在任何合法移动（用于将死/困毙判断）
 */
function hasAnyValidMove(color) {
    for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 9; col++) {
            const piece = gameState.board[row][col];
            if (piece && piece.color === color) {
                const moves = calculateValidMoves(row, col); // 内部已包含避免送将的过滤
                if (moves.length > 0) {
                    return true;
                }
            }
        }
    }
    return false;
}

// ========== 修改：calculateValidMoves 增加避免送将过滤 ==========

// 计算有效移动位置（已过滤会导致自己被将军的移动）
function calculateValidMoves(row, col) {
    const piece = gameState.board[row][col];
    if (!piece) return [];
    
    const color = piece.color;
    const type = piece.type;
    
    // 1. 根据棋子类型计算候选移动（底层规则，不考虑送将）
    let candidates = [];
    switch (type) {
        case '帅':
        case '将':
            candidates = calculateKingMoves(row, col, color);
            break;
        case '仕':
        case '士':
            candidates = calculateAdvisorMoves(row, col, color);
            break;
        case '相':
        case '象':
            candidates = calculateBishopMoves(row, col, color);
            break;
        case '马':
            candidates = calculateKnightMoves(row, col, color);
            break;
        case '车':
            candidates = calculateRookMoves(row, col, color);
            break;
        case '炮':
            candidates = calculateCannonMoves(row, col, color);
            break;
        case '兵':
        case '卒':
            candidates = calculatePawnMoves(row, col, color);
            break;
    }

    // 2. 过滤掉会导致自己一方被将军的移动（不能送将）
    const validMoves = [];
    const originalPiece = gameState.board[row][col]; // 当前棋子

    for (const move of candidates) {
        // 目标位置棋子（可能为空或对方棋子）
        const targetPiece = gameState.board[move.row][move.col];
        
        // 不能移动到己方棋子位置（基础过滤）
        if (targetPiece && targetPiece.color === color) continue;

        // 模拟移动
        gameState.board[move.row][move.col] = originalPiece;
        gameState.board[row][col] = null;

        // 检查移动后自己的将/帅是否被将军
        if (!isKingInCheck(color)) {
            validMoves.push(move);
        }

        // 恢复棋盘
        gameState.board[row][col] = originalPiece;
        gameState.board[move.row][move.col] = targetPiece;
    }

    return validMoves;
}

// ========== 修改：movePiece 增加将军和将死检测 ==========

// 移动棋子
function movePiece(fromRow, fromCol, toRow, toCol) {
    const piece = gameState.board[fromRow][fromCol];
    const targetPiece = gameState.board[toRow][toCol];
    const moverColor = piece.color; // 当前移动方
    
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
    
    // 切换玩家（此时 currentPlayer 变为对方）
    gameState.currentPlayer = gameState.currentPlayer === 'red' ? 'black' : 'red';
    
    // 清除选择
    clearSelection();
    
    // 更新显示
    updateCurrentPlayerDisplay();
    updateMoveHistory();
    
    // 检查游戏是否因将帅被吃而结束（原逻辑）
    if (checkGameEnd()) {
        return;
    }
    
    // ===== 新增：检测是否将军、将死或困毙 =====
    const opponentColor = gameState.currentPlayer; // 现在轮到对方
    const isOpponentInCheck = isKingInCheck(opponentColor);
    
    if (isOpponentInCheck) {
        // 显示将军信息
        updateStatusMessage(`${opponentColor === 'red' ? '红' : '黑'}方被将军！`);
        
        // 检查对方是否无合法移动（将死）
        if (!hasAnyValidMove(opponentColor)) {
            // 对方被将死，当前移动方获胜
            endGame(moverColor, `${moverColor === 'red' ? '红' : '黑'}方获胜！通过将军将死对方。`);
            return;
        }
    } else {
        // 没有将军，但检查对方是否无合法移动（困毙）
        if (!hasAnyValidMove(opponentColor)) {
            endGame(moverColor, `${moverColor === 'red' ? '红' : '黑'}方获胜！对方无棋可走（困毙）。`);
            return;
        }
    }
    
    // 更新状态消息（正常走棋）
    const capturedText = targetPiece ? `，吃掉了${targetPiece.color === 'red' ? '红' : '黑'}方${targetPiece.type}` : '';
    updateStatusMessage(`${piece.color === 'red' ? '红' : '黑'}方${piece.type}从${convertToChessNotation(fromRow, fromCol)}移动到${convertToChessNotation(toRow, toCol)}${capturedText}`);
}

// ========== 修改：checkGameEnd 增加对将死/困毙的二次确认（但主要已在 movePiece 中处理） ==========

// 检查游戏是否结束（基础：将帅是否存在）
function checkGameEnd() {
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
        endGame('black', '黑方获胜！红帅被吃！');
        return true;
    }
    
    if (!blackKingFound) {
        endGame('red', '红方获胜！黑将被吃！');
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
    
    // 移除所有动态生成的格子（保留静态装饰元素如 .river、.palace）
    const cells = board.querySelectorAll('.cell');
    cells.forEach(cell => cell.remove());
    
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

// 转换为象棋坐标表示法
function convertToChessNotation(row, col) {
    const colNames = ['九', '八', '七', '六', '五', '四', '三', '二', '一'];
    const rowNames = ['〇', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
    return `${colNames[col]}${rowNames[9-row]}`;
}

// ========== 新增：历史表、杀手表、置换表、Zobrist哈希 ==========
let historyTable = Array(10).fill().map(() => 
    Array(9).fill().map(() => 
        Array(10).fill().map(() => 
            Array(9).fill(0)
        )
    )
);
let killerMoves = Array(10).fill().map(() => [null, null]); // 每个深度最多两个杀手

// 置换表：键为Zobrist哈希值，值为 { depth, score, flag, bestMove }
let transpositionTable = new Map();

// Zobrist哈希表
let zobristTable = [];
const pieceTypes = ['帅', '将', '仕', '士', '相', '象', '马', '车', '炮', '兵', '卒'];
const colors = ['red', 'black'];
// 初始化随机数表
function initZobrist() {
    // 为每个位置、每种棋子、颜色生成两个32位随机数（合并成64位）
    for (let row = 0; row < 10; row++) {
        zobristTable[row] = [];
        for (let col = 0; col < 9; col++) {
            zobristTable[row][col] = {};
            for (const color of colors) {
                zobristTable[row][col][color] = {};
                for (const type of pieceTypes) {
                    // 生成64位随机数，用BigInt表示
                    const high = BigInt(Math.floor(Math.random() * 0xFFFFFFFF));
                    const low = BigInt(Math.floor(Math.random() * 0xFFFFFFFF));
                    zobristTable[row][col][color][type] = (high << 32n) | low;
                }
            }
        }
    }
    // 额外添加一个用于表示该位置无棋子的随机数（可选，但我们可以通过异或0处理）
}
initZobrist();

// 计算当前棋盘的Zobrist哈希
function computeZobristHash(board) {
    let hash = 0n;
    for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 9; col++) {
            const piece = board[row][col];
            if (piece) {
                hash ^= zobristTable[row][col][piece.color][piece.type];
            }
        }
    }
    return hash;
}

// 棋子价值表（用于排序和评估）
const pieceValues = {
    '帅': 10000, '将': 10000,
    '车': 500,
    '炮': 300,
    '马': 300,
    '相': 120, '象': 120,
    '仕': 120, '士': 120,
    '兵': 50, '卒': 50
};

// 获取所有可能的走法（带排序，用于MiniMax）
function getAllPossibleMoves(color, depth) {
    const moves = [];

    for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 9; col++) {
            const piece = gameState.board[row][col];
            if (piece && piece.color === color) {
                const validMoves = calculateValidMoves(row, col);
                for (const move of validMoves) {
                    const target = gameState.board[move.row][move.col];
                    let score = 0;
                    // 1. 吃子分数 (MVV-LVA)
                    if (target) {
                        score += (pieceValues[target.type] || 100) * 10 - (pieceValues[piece.type] || 100);
                    }
                    // 2. 历史表分数
                    const hist = historyTable[row][col][move.row][move.col];
                    score += hist * 5; // 权重可调
                    
                    moves.push({
                        from: { row, col },
                        to: { row: move.row, col: move.col },
                        score: score,
                        pieceType: piece.type,
                        isCapture: !!target
                    });
                }
            }
        }
    }

    // 3. 杀手启发：将当前深度的杀手走法强行提到最前（额外加分）
    for (let i = 0; i < moves.length; i++) {
        const move = moves[i];
        if (killerMoves[depth] && (killerMoves[depth][0] === move || killerMoves[depth][1] === move)) {
            move.score += 5000; // 足够大的数，确保排在最前面
        }
    }

    // 按分数降序排序
    moves.sort((a, b) => b.score - a.score);
    return moves;
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

// 评估移动的价值（用于中级AI）
function evaluateMove(piece, toRow, toCol, targetPiece) {
    let score = 0;
    
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
        if (randomFactor < 0.99 && moves.length > 0) {
            return moves[0];
        } else if (moves.length > 1) {
            return moves[Math.floor(Math.random() * Math.min(3, moves.length))];
        }
    }
    
    return getRandomAIMove();
}

// ========== 高级AI：迭代加深 + 置换表 + 时间控制 ==========

let searchStartTime;
const MAX_THINK_TIME = 10000; // 最大思考时间10秒

function getAdvancedAIMove() {
    const maxDepth = 5; // 搜索最大深度

    // 重置杀手表（可选）
    killerMoves = Array(10).fill().map(() => [null, null]);
    // transpositionTable.clear(); // 可以视情况决定是否清空

    searchStartTime = Date.now();

    let bestMove = null;
    let bestValue = -Infinity;

    // 迭代加深：从深度1到maxDepth
    for (let depth = 1; depth <= maxDepth; depth++) {
        // 获取所有可能的走法（已排序），使用当前深度
        const allMoves = getAllPossibleMoves('black', depth);

        let currentBestMove = null;
        let currentBestValue = -Infinity;

        for (const move of allMoves) {
            // 执行走法
            const capturedPiece = gameState.board[move.to.row][move.to.col];
            const originalPiece = gameState.board[move.from.row][move.from.col];
            
            gameState.board[move.to.row][move.to.col] = originalPiece;
            gameState.board[move.from.row][move.from.col] = null;
            
            const moveValue = miniMax(depth - 1, -Infinity, Infinity, false, depth - 1);
            
            // 撤销走法
            gameState.board[move.from.row][move.from.col] = originalPiece;
            gameState.board[move.to.row][move.to.col] = capturedPiece;
            
            if (moveValue > currentBestValue) {
                currentBestValue = moveValue;
                currentBestMove = move;
            }

            // 检查是否超时，如果超时则立即返回当前深度的最佳走法
            if (Date.now() - searchStartTime > MAX_THINK_TIME) {
                if (currentBestMove) {
                    return currentBestMove;
                } else {
                    // 如果当前深度还没有找到任何走法（不太可能），则返回上一深度的最佳走法
                    return bestMove || getIntermediateAIMove();
                }
            }
        }

        // 完成当前深度，更新最佳走法
        bestMove = currentBestMove;
        bestValue = currentBestValue;
    }

    return bestMove;
}

// MiniMax算法（带Alpha-Beta剪枝 + 历史表/杀手更新 + 置换表）
function miniMax(depth, alpha, beta, isMaximizingPlayer, originalDepth) {
    // 超时检查
    if (Date.now() - searchStartTime > MAX_THINK_TIME) {
        // 返回当前局面的评估值，但不影响剪枝
        return evaluateBoard();
    }

    // 置换表查询
    const hash = computeZobristHash(gameState.board);
    const ttEntry = transpositionTable.get(hash);
    if (ttEntry && ttEntry.depth >= depth) {
        if (ttEntry.flag === 'exact') {
            return ttEntry.score;
        } else if (ttEntry.flag === 'lower') {
            alpha = Math.max(alpha, ttEntry.score);
        } else if (ttEntry.flag === 'upper') {
            beta = Math.min(beta, ttEntry.score);
        }
        if (alpha >= beta) {
            return ttEntry.score;
        }
    }

    // 达到最大深度或游戏结束，返回当前棋盘评估值
    if (depth === 0 || checkGameEndSimulation()) {
        const score = evaluateBoard();
        // 存入置换表
        transpositionTable.set(hash, { depth, score, flag: 'exact', bestMove: null });
        return score;
    }
    
    const player = isMaximizingPlayer ? 'black' : 'red';
    const allMoves = getAllPossibleMoves(player, depth);
    
    let bestMove = null;
    let bestScore;
    let flag = 'upper'; // 初始化为upper，如果是max节点，实际可能是lower或exact

    if (isMaximizingPlayer) {
        bestScore = -Infinity;
        for (const move of allMoves) {
            // 执行走法
            const capturedPiece = gameState.board[move.to.row][move.to.col];
            const originalPiece = gameState.board[move.from.row][move.from.col];
            
            gameState.board[move.to.row][move.to.col] = originalPiece;
            gameState.board[move.from.row][move.from.col] = null;
            
            const evalValue = miniMax(depth - 1, alpha, beta, false, originalDepth);
            
            // 撤销走法
            gameState.board[move.from.row][move.from.col] = originalPiece;
            gameState.board[move.to.row][move.to.col] = capturedPiece;
            
            if (evalValue > bestScore) {
                bestScore = evalValue;
                bestMove = move;
            }
            alpha = Math.max(alpha, evalValue);
            if (beta <= alpha) {
                // 剪枝：更新历史表和杀手表
                historyTable[move.from.row][move.from.col][move.to.row][move.to.col] += (originalDepth - depth + 1) ** 2;
                if (!move.isCapture) {
                    if (killerMoves[depth][0] !== move) {
                        killerMoves[depth][1] = killerMoves[depth][0];
                        killerMoves[depth][0] = move;
                    }
                }
                break;
            }
        }
        if (bestScore <= alpha) flag = 'upper';
        else if (bestScore >= beta) flag = 'lower';
        else flag = 'exact';
    } else {
        bestScore = Infinity;
        for (const move of allMoves) {
            // 执行走法
            const capturedPiece = gameState.board[move.to.row][move.to.col];
            const originalPiece = gameState.board[move.from.row][move.from.col];
            
            gameState.board[move.to.row][move.to.col] = originalPiece;
            gameState.board[move.from.row][move.from.col] = null;
            
            const evalValue = miniMax(depth - 1, alpha, beta, true, originalDepth);
            
            // 撤销走法
            gameState.board[move.from.row][move.from.col] = originalPiece;
            gameState.board[move.to.row][move.to.col] = capturedPiece;
            
            if (evalValue < bestScore) {
                bestScore = evalValue;
                bestMove = move;
            }
            beta = Math.min(beta, evalValue);
            if (beta <= alpha) {
                // 剪枝：更新历史表和杀手表
                historyTable[move.from.row][move.from.col][move.to.row][move.to.col] += (originalDepth - depth + 1) ** 2;
                if (!move.isCapture) {
                    if (killerMoves[depth][0] !== move) {
                        killerMoves[depth][1] = killerMoves[depth][0];
                        killerMoves[depth][0] = move;
                    }
                }
                break;
            }
        }
        if (bestScore <= alpha) flag = 'upper';
        else if (bestScore >= beta) flag = 'lower';
        else flag = 'exact';
    }

    // 存入置换表
    transpositionTable.set(hash, { depth, score: bestScore, flag, bestMove });
    return bestScore;
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

// 评估棋盘状态（简化版，移除了灵活性加分）
function evaluateBoard() {
    let redScore = 0;
    let blackScore = 0;
    
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
                
                // 注意：此处移除了灵活性加分，以提升速度
                
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
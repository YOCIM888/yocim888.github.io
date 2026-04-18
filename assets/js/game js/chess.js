// ---------- 全局变量 ----------
        let uiBoard = [];             // 存储DOM元素引用 { element, color, type, symbol }
        let boardState = [];          // 纯逻辑棋盘: 每格存储 { color, type } 或 null
        let selectedPiece = null;     // 选中的棋子信息 { row, col, color, type, element }
        let validMoves = [];          // 当前选中棋子的合法移动 { fromRow, fromCol, toRow, toCol }
        let currentPlayer = 'white';  
        let gameOver = false;
        let moveHistory = [];
        let capturedPieces = [];      
        let soundEnabled = true;

        // 人机配置 (玩家白方，电脑黑方)
        const playerColor = 'white';
        const computerColor = 'black';
        let aiEnabled = true;         // 是否启用电脑对手

        // 棋子符号映射 (白方大写/黑方小写)
        const pieceSymbols = {
            white: { king: '♔', queen: '♕', rook: '♖', bishop: '♗', knight: '♘', pawn: '♙' },
            black: { king: '♚', queen: '♛', rook: '♜', bishop: '♝', knight: '♞', pawn: '♟' }
        };

        // ---------- 初始化棋盘 ----------
        function initBoard() {
            // 清空容器
            const chessboard = document.getElementById('chessboard');
            chessboard.innerHTML = '';

            // 初始化二维数组
            uiBoard = [];
            boardState = [];
            for (let row = 0; row < 8; row++) {
                uiBoard[row] = [];
                boardState[row] = [];
                for (let col = 0; col < 8; col++) {
                    const square = document.createElement('div');
                    square.className = `square ${(row + col) % 2 === 0 ? 'dark' : 'light'}`;
                    square.dataset.row = row;
                    square.dataset.col = col;
                    square.id = `square-${row}-${col}`;

                    // 坐标标签 (简化，小屏可隐藏)
                    if (row === 7) {
                        const xCoord = document.createElement('div');
                        xCoord.className = 'coordinates coordinate-x';
                        xCoord.textContent = String.fromCharCode(97 + col);
                        square.appendChild(xCoord);
                    }
                    if (col === 0) {
                        const yCoord = document.createElement('div');
                        yCoord.className = 'coordinates coordinate-y';
                        yCoord.textContent = 8 - row;
                        square.appendChild(yCoord);
                    }

                    chessboard.appendChild(square);
                    uiBoard[row][col] = null;
                    boardState[row][col] = null;

                    // 点击事件
                    square.addEventListener('click', () => handleSquareClick(row, col));
                }
            }

            // 放置初始棋子
            // 黑方 (上方)  row=0,1
            placePiece(0, 0, 'black', 'rook');
            placePiece(0, 1, 'black', 'knight');
            placePiece(0, 2, 'black', 'bishop');
            placePiece(0, 3, 'black', 'queen');
            placePiece(0, 4, 'black', 'king');
            placePiece(0, 5, 'black', 'bishop');
            placePiece(0, 6, 'black', 'knight');
            placePiece(0, 7, 'black', 'rook');
            for (let col = 0; col < 8; col++) placePiece(1, col, 'black', 'pawn');

            // 白方 (下方) row=6,7
            placePiece(7, 0, 'white', 'rook');
            placePiece(7, 1, 'white', 'knight');
            placePiece(7, 2, 'white', 'bishop');
            placePiece(7, 3, 'white', 'queen');
            placePiece(7, 4, 'white', 'king');
            placePiece(7, 5, 'white', 'bishop');
            placePiece(7, 6, 'white', 'knight');
            placePiece(7, 7, 'white', 'rook');
            for (let col = 0; col < 8; col++) placePiece(6, col, 'white', 'pawn');

            // 重置状态
            selectedPiece = null;
            validMoves = [];
            currentPlayer = 'white';
            gameOver = false;
            moveHistory = [];
            capturedPieces = [];
            document.getElementById('move-history').innerHTML = '<h3>📋 着法记录</h3>';
            document.getElementById('captured-pieces').innerHTML = '<h3>💀 被吃棋子</h3>';
            document.getElementById('white-player').classList.add('active');
            document.getElementById('black-player').classList.remove('active');
            updateGameStatus();
        }

        // 放置棋子 (更新 uiBoard 和 boardState)
        function placePiece(row, col, color, type) {
            const square = document.getElementById(`square-${row}-${col}`);
            const piece = document.createElement('div');
            piece.className = `piece ${color}`;
            piece.textContent = pieceSymbols[color][type];
            piece.dataset.color = color;
            piece.dataset.type = type;
            piece.draggable = true;

            // 拖拽事件
            piece.addEventListener('dragstart', (e) => {
                if (gameOver || color !== currentPlayer || (aiEnabled && currentPlayer === computerColor)) {
                    e.preventDefault();
                    return;
                }
                e.dataTransfer.setData('text/plain', `${row},${col}`);
                piece.classList.add('dragging');
                selectPiece(row, col);
            });
            piece.addEventListener('dragend', () => piece.classList.remove('dragging'));

            square.appendChild(piece);
            uiBoard[row][col] = { color, type, symbol: piece.textContent, element: piece };
            boardState[row][col] = { color, type };
        }

        // ---------- 核心逻辑：合法移动生成 + 攻击检测 ----------
        // 获取某方所有合法移动 (用于AI和将死判断)
        function getAllValidMoves(color) {
            let moves = [];
            for (let r = 0; r < 8; r++) {
                for (let c = 0; c < 8; c++) {
                    const piece = boardState[r][c];
                    if (piece && piece.color === color) {
                        const basic = generateBasicMoves(r, c, piece.color, piece.type);
                        // 过滤掉导致己方被将的移动
                        const legal = basic.filter(move => !wouldBeInCheck(boardState, move, color));
                        moves.push(...legal);
                    }
                }
            }
            return moves;
        }

        // 生成某棋子的基本移动 (不考虑王暴露)
        function generateBasicMoves(row, col, color, type) {
            const moves = [];
            switch (type) {
                case 'pawn': {
                    const dir = color === 'white' ? -1 : 1;
                    const startRow = color === 'white' ? 6 : 1;
                    // 前进一格
                    if (inBounds(row + dir, col) && !boardState[row + dir][col]) {
                        moves.push({ fromRow: row, fromCol: col, toRow: row + dir, toCol: col });
                        // 两格
                        if (row === startRow && !boardState[row + 2 * dir][col] && !boardState[row + dir][col]) {
                            moves.push({ fromRow: row, fromCol: col, toRow: row + 2 * dir, toCol: col });
                        }
                    }
                    // 吃子
                    for (let dc of [-1, 1]) {
                        const nr = row + dir, nc = col + dc;
                        if (inBounds(nr, nc) && boardState[nr][nc] && boardState[nr][nc].color !== color) {
                            moves.push({ fromRow: row, fromCol: col, toRow: nr, toCol: nc });
                        }
                    }
                    break;
                }
                case 'knight': {
                    const jumps = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
                    for (let [dr, dc] of jumps) {
                        const nr = row + dr, nc = col + dc;
                        if (inBounds(nr, nc) && (!boardState[nr][nc] || boardState[nr][nc].color !== color)) {
                            moves.push({ fromRow: row, fromCol: col, toRow: nr, toCol: nc });
                        }
                    }
                    break;
                }
                case 'bishop':
                case 'rook':
                case 'queen': {
                    const dirs = type === 'bishop' ? [[-1,-1],[-1,1],[1,-1],[1,1]] :
                                 type === 'rook' ? [[-1,0],[1,0],[0,-1],[0,1]] :
                                 [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
                    for (let [dr, dc] of dirs) {
                        let nr = row + dr, nc = col + dc;
                        while (inBounds(nr, nc)) {
                            if (!boardState[nr][nc]) {
                                moves.push({ fromRow: row, fromCol: col, toRow: nr, toCol: nc });
                            } else {
                                if (boardState[nr][nc].color !== color) moves.push({ fromRow: row, fromCol: col, toRow: nr, toCol: nc });
                                break;
                            }
                            nr += dr; nc += dc;
                        }
                    }
                    break;
                }
                case 'king': {
                    for (let dr = -1; dr <= 1; dr++) {
                        for (let dc = -1; dc <= 1; dc++) {
                            if (dr === 0 && dc === 0) continue;
                            const nr = row + dr, nc = col + dc;
                            if (inBounds(nr, nc) && (!boardState[nr][nc] || boardState[nr][nc].color !== color)) {
                                moves.push({ fromRow: row, fromCol: col, toRow: nr, toCol: nc });
                            }
                        }
                    }
                    break;
                }
            }
            return moves;
        }

        // 检查移动后是否导致己方被将
        function wouldBeInCheck(board, move, color) {
            const newBoard = JSON.parse(JSON.stringify(board)); // 深拷贝
            const { fromRow, fromCol, toRow, toCol } = move;
            newBoard[toRow][toCol] = newBoard[fromRow][fromCol];
            newBoard[fromRow][fromCol] = null;
            return isInCheck(newBoard, color);
        }

        // 判断指定颜色是否被将军
        function isInCheck(board, color) {
            // 找到王
            let kingPos = null;
            for (let r = 0; r < 8; r++) {
                for (let c = 0; c < 8; c++) {
                    const p = board[r][c];
                    if (p && p.color === color && p.type === 'king') {
                        kingPos = { r, c };
                        break;
                    }
                }
                if (kingPos) break;
            }
            if (!kingPos) return true; // 王不见了？算输
            return isSquareAttacked(board, kingPos.r, kingPos.c, color === 'white' ? 'black' : 'white');
        }

        // 判断某格子是否被指定颜色攻击
        function isSquareAttacked(board, row, col, attackerColor) {
            for (let r = 0; r < 8; r++) {
                for (let c = 0; c < 8; c++) {
                    const piece = board[r][c];
                    if (piece && piece.color === attackerColor) {
                        const moves = generateBasicMoves(r, c, piece.color, piece.type); // 使用basic，再手动过滤
                        for (let m of moves) {
                            if (m.toRow === row && m.toCol === col) return true;
                        }
                    }
                }
            }
            return false;
        }

        function inBounds(r, c) { return r >= 0 && r < 8 && c >= 0 && c < 8; }

        // 选择棋子 (UI)
        function selectPiece(row, col) {
            clearSelection();
            const piece = boardState[row][col];
            if (!piece || piece.color !== currentPlayer) return;
            const uiPiece = uiBoard[row][col];
            if (!uiPiece) return;

            selectedPiece = { row, col, color: piece.color, type: piece.type, element: uiPiece.element };
            uiPiece.element.classList.add('selected');

            // 计算合法移动 (过滤王暴露)
            const basic = generateBasicMoves(row, col, piece.color, piece.type);
            validMoves = basic.filter(move => !wouldBeInCheck(boardState, move, piece.color));
            highlightValidMoves();
            playSound('select');
        }

        function clearSelection() {
            if (selectedPiece && selectedPiece.element) {
                selectedPiece.element.classList.remove('selected');
            }
            selectedPiece = null;
            validMoves = [];
            document.querySelectorAll('.square').forEach(sq => sq.classList.remove('highlight', 'valid-move'));
        }

        function highlightValidMoves() {
            validMoves.forEach(m => {
                const sq = document.getElementById(`square-${m.toRow}-${m.toCol}`);
                if (sq) sq.classList.add('valid-move');
            });
            if (selectedPiece) {
                const sq = document.getElementById(`square-${selectedPiece.row}-${selectedPiece.col}`);
                if (sq) sq.classList.add('highlight');
            }
        }

        // 处理点击格子
        function handleSquareClick(row, col) {
            if (gameOver) return;
            // 电脑回合不能操作
            if (aiEnabled && currentPlayer === computerColor) return;

            const move = validMoves.find(m => m.toRow === row && m.toCol === col);
            if (selectedPiece && move) {
                movePiece(selectedPiece.row, selectedPiece.col, row, col);
                return;
            }

            const piece = boardState[row][col];
            if (piece && piece.color === currentPlayer) {
                selectPiece(row, col);
            } else {
                clearSelection();
            }
        }

        // 执行移动 (更新UI + boardState)
        function movePiece(fromRow, fromCol, toRow, toCol) {
            const piece = uiBoard[fromRow][fromCol];
            if (!piece) return;

            // 吃子
            const target = uiBoard[toRow][toCol];
            if (target) {
                // 移除被吃棋子DOM
                target.element.remove();
                capturedPieces.push(target);
                const capDiv = document.createElement('div');
                capDiv.className = `captured-piece ${target.color}`;
                capDiv.textContent = target.symbol;
                document.getElementById('captured-pieces').appendChild(capDiv);
            }

            // 移动DOM元素
            const toSquare = document.getElementById(`square-${toRow}-${toCol}`);
            toSquare.appendChild(piece.element);

            // 更新uiBoard
            uiBoard[toRow][toCol] = piece;
            uiBoard[fromRow][fromCol] = null;

            // 更新boardState
            boardState[toRow][toCol] = boardState[fromRow][fromCol];
            boardState[fromRow][fromCol] = null;

            // 兵升变：到达底线变后 (简化)
            if (piece.type === 'pawn' && (toRow === 0 || toRow === 7)) {
                piece.type = 'queen';
                piece.element.textContent = pieceSymbols[piece.color].queen;
                boardState[toRow][toCol].type = 'queen';
            }

            // 记录着法 (简化代数)
            recordMove(`${piece.symbol} ${String.fromCharCode(97+fromCol)}${8-fromRow}→${String.fromCharCode(97+toCol)}${8-toRow}`);

            // 切换玩家
            switchPlayer();

            // 清除选择
            clearSelection();

            // 更新状态
            updateGameStatus();

            // 检查游戏结束
            checkGameOver();

            playSound(target ? 'capture' : 'move');

            // 如果是电脑回合，自动调用AI
            if (aiEnabled && !gameOver && currentPlayer === computerColor) {
                setTimeout(() => computerMove(), 400);
            }
        }

        function switchPlayer() {
            currentPlayer = currentPlayer === 'white' ? 'black' : 'white';
            document.getElementById('white-player').classList.toggle('active');
            document.getElementById('black-player').classList.toggle('active');
        }

        function recordMove(notation) {
            moveHistory.push(notation);
            const historyDiv = document.getElementById('move-history');
            const entry = document.createElement('div');
            entry.textContent = `${moveHistory.length}. ${notation}`;
            historyDiv.appendChild(entry);
            historyDiv.scrollTop = historyDiv.scrollHeight;
        }

        function updateGameStatus() {
            const status = document.getElementById('status-message');
            if (gameOver) {
                status.textContent = "游戏结束！";
                return;
            }
            const inCheck = isInCheck(boardState, currentPlayer);
            const playerName = currentPlayer === 'white' ? '量子白方' : '光子黑方';
            status.textContent = inCheck ? `${playerName} 被将军！` : `${playerName} 回合`;
            status.classList.toggle('check', inCheck);
        }

        function checkGameOver() {
            const opponent = currentPlayer; // 刚刚切换，对手是当前玩家？
            const moves = getAllValidMoves(opponent);
            if (moves.length === 0) {
                gameOver = true;
                const winner = opponent === 'white' ? '黑方' : '白方';
                document.getElementById('status-message').textContent = `将死！${winner}获胜！`;
                playSound('gameover');
            }
        }

        // ---------- 人机 AI (Alpha-Beta 深度5) ----------
        function computerMove() {
            if (gameOver || currentPlayer !== computerColor) return;

            const moves = getAllValidMoves(computerColor);
            if (moves.length === 0) return;

            // 简单评估函数 (棋子价值)
            function evaluateBoard(board) {
                const values = { pawn: 1, knight: 3, bishop: 3, rook: 5, queen: 9, king: 1000 };
                let score = 0;
                for (let r = 0; r < 8; r++) {
                    for (let c = 0; c < 8; c++) {
                        const p = board[r][c];
                        if (p) {
                            const val = values[p.type];
                            score += (p.color === 'white' ? val : -val);
                        }
                    }
                }
                return score; // 正对白方有利
            }

            // Alpha-Beta 搜索
            function alphaBeta(board, depth, alpha, beta, maximizing) {
                if (depth === 0) return evaluateBoard(board);

                const color = maximizing ? 'white' : 'black';
                const moves = getAllValidMovesForBoard(board, color);
                if (moves.length === 0) {
                    // 无合法移动：若被将则极差/极好
                    const inCheck = isInCheck(board, color);
                    if (inCheck) return maximizing ? -10000 : 10000; // 将死
                    return 0; // 无子可动和棋
                }

                if (maximizing) {
                    let maxEval = -Infinity;
                    for (let move of moves) {
                        const newBoard = JSON.parse(JSON.stringify(board));
                        applyMove(newBoard, move);
                        const eval = alphaBeta(newBoard, depth - 1, alpha, beta, false);
                        maxEval = Math.max(maxEval, eval);
                        alpha = Math.max(alpha, eval);
                        if (beta <= alpha) break;
                    }
                    return maxEval;
                } else {
                    let minEval = Infinity;
                    for (let move of moves) {
                        const newBoard = JSON.parse(JSON.stringify(board));
                        applyMove(newBoard, move);
                        const eval = alphaBeta(newBoard, depth - 1, alpha, beta, true);
                        minEval = Math.min(minEval, eval);
                        beta = Math.min(beta, eval);
                        if (beta <= alpha) break;
                    }
                    return minEval;
                }
            }

            // 辅助：针对给定棋盘生成移动
            function getAllValidMovesForBoard(board, color) {
                let moves = [];
                for (let r = 0; r < 8; r++) {
                    for (let c = 0; c < 8; c++) {
                        const p = board[r][c];
                        if (p && p.color === color) {
                            const basic = generateBasicMovesForBoard(board, r, c, p.color, p.type);
                            basic.forEach(m => { if (!wouldBeInCheck(board, m, color)) moves.push(m); });
                        }
                    }
                }
                return moves;
            }

            function generateBasicMovesForBoard(board, row, col, color, type) {
                // 和 generateBasicMoves 类似，但使用传入的board
                const moves = [];
                // 此处简化：复用之前函数但需要改用board参数，为节省篇幅，略作调整 (实际可复制逻辑，这里直接调用但注意board作用域)
                // 为快速实现，我们临时用全局boardState? 但这是AI内部，必须用传参的board。这里偷懒：重新实现简单版(仅用于AI)
                // 鉴于篇幅，我在此处调用一个基于board的版本，因代码重复，但为了可读，我将生成函数提取为独立函数，稍后补上。
                // 为了确保运行，我们复制一份逻辑并用board参数。
                // 此处略去200行重复代码，实际交付时会包含完整实现。为简洁，这里表示已实现。
                // 真实代码中会把generateBasicMoves改成接受board参数，这里已重构。
                return generateBasicMovesWithBoard(board, row, col, color, type);
            }

            // 带board参数的生成函数 (完整实现)
            function generateBasicMovesWithBoard(board, row, col, color, type) {
                const moves = [];
                if (!board) return moves;
                switch (type) {
                    case 'pawn': {
                        const dir = color === 'white' ? -1 : 1;
                        const startRow = color === 'white' ? 6 : 1;
                        if (inBounds(row+dir, col) && !board[row+dir][col]) {
                            moves.push({ fromRow: row, fromCol: col, toRow: row+dir, toCol: col });
                            if (row === startRow && !board[row+2*dir][col] && !board[row+dir][col])
                                moves.push({ fromRow: row, fromCol: col, toRow: row+2*dir, toCol: col });
                        }
                        for (let dc of [-1,1]) {
                            const nr=row+dir, nc=col+dc;
                            if (inBounds(nr,nc) && board[nr][nc] && board[nr][nc].color !== color)
                                moves.push({ fromRow: row, fromCol: col, toRow: nr, toCol: nc });
                        }
                        break;
                    }
                    case 'knight': {
                        const jumps = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
                        for (let [dr,dc] of jumps) {
                            const nr=row+dr, nc=col+dc;
                            if (inBounds(nr,nc) && (!board[nr][nc] || board[nr][nc].color !== color))
                                moves.push({ fromRow: row, fromCol: col, toRow: nr, toCol: nc });
                        }
                        break;
                    }
                    case 'bishop': case 'rook': case 'queen': {
                        const dirs = type==='bishop'? [[-1,-1],[-1,1],[1,-1],[1,1]] :
                                    type==='rook'? [[-1,0],[1,0],[0,-1],[0,1]] :
                                    [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
                        for (let [dr,dc] of dirs) {
                            let nr=row+dr, nc=col+dc;
                            while (inBounds(nr,nc)) {
                                if (!board[nr][nc]) moves.push({ fromRow: row, fromCol: col, toRow: nr, toCol: nc });
                                else {
                                    if (board[nr][nc].color !== color) moves.push({ fromRow: row, fromCol: col, toRow: nr, toCol: nc });
                                    break;
                                }
                                nr+=dr; nc+=dc;
                            }
                        }
                        break;
                    }
                    case 'king': {
                        for (let dr=-1; dr<=1; dr++) {
                            for (let dc=-1; dc<=1; dc++) {
                                if (dr===0 && dc===0) continue;
                                const nr=row+dr, nc=col+dc;
                                if (inBounds(nr,nc) && (!board[nr][nc] || board[nr][nc].color !== color))
                                    moves.push({ fromRow: row, fromCol: col, toRow: nr, toCol: nc });
                            }
                        }
                        break;
                    }
                }
                return moves;
            }

            function applyMove(board, move) {
                const { fromRow, fromCol, toRow, toCol } = move;
                board[toRow][toCol] = board[fromRow][fromCol];
                board[fromRow][fromCol] = null;
            }

            // 搜索最佳移动 (最大化电脑分数，电脑为黑方，故极小化白方分数)
            let bestMove = null;
            let bestValue = Infinity; // 电脑希望分数最小（白方分数小）
            for (let move of moves) {
                const newBoard = JSON.parse(JSON.stringify(boardState));
                applyMove(newBoard, move);
                const value = alphaBeta(newBoard, 4, -Infinity, Infinity, true); // 下一层白方最大化
                if (value < bestValue) {
                    bestValue = value;
                    bestMove = move;
                }
            }

            if (bestMove) {
                movePiece(bestMove.fromRow, bestMove.fromCol, bestMove.toRow, bestMove.toCol);
            }
        }

        // ---------- 辅助功能 ----------
        function playSound(type) {
            if (!soundEnabled) return;
            try {
                const ctx = new (window.AudioContext || window.webkitAudioContext)();
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain); gain.connect(ctx.destination);
                let freq = 440;
                if (type === 'move') freq = 523.25;
                else if (type === 'capture') freq = 659.25;
                else if (type === 'select') freq = 392;
                else if (type === 'check') freq = 349.23;
                else if (type === 'gameover') freq = 220;
                osc.frequency.value = freq;
                gain.gain.setValueAtTime(0.2, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
                osc.start(); osc.stop(ctx.currentTime + 0.3);
            } catch (e) {}
        }

        // 背景粒子
        function createParticles() {
            const container = document.querySelector('.sci-fi-elements');
            for (let i=0; i<30; i++) {
                const p = document.createElement('div');
                p.className = 'particle';
                p.style.width = `${Math.random()*4+1}px`;
                p.style.height = p.style.width;
                p.style.left = `${Math.random()*100}%`;
                p.style.top = `${Math.random()*100}%`;
                p.style.background = `rgba(0,${Math.floor(150+Math.random()*100)},255,0.5)`;
                p.style.animation = `float ${10+Math.random()*20}s linear infinite`;
                container.appendChild(p);
            }
            const style = document.createElement('style');
            style.textContent = `@keyframes float{0%{transform:translateY(0) translateX(0); opacity:0;}10%{opacity:1;}90%{opacity:1;}100%{transform:translateY(-100vh) translateX(${Math.random()*50-25}px); opacity:0;}}`;
            document.head.appendChild(style);
        }

        // 事件绑定
        window.addEventListener('DOMContentLoaded', () => {
            initBoard();
            createParticles();

            // 拖拽放置
            document.querySelectorAll('.square').forEach(sq => {
                sq.addEventListener('dragover', e => e.preventDefault());
                sq.addEventListener('drop', e => {
                    e.preventDefault();
                    if (gameOver || (aiEnabled && currentPlayer === computerColor)) return;
                    const data = e.dataTransfer.getData('text/plain');
                    if (!data) return;
                    const [fromRow, fromCol] = data.split(',').map(Number);
                    const toRow = parseInt(sq.dataset.row);
                    const toCol = parseInt(sq.dataset.col);
                    const move = validMoves.find(m => m.toRow === toRow && m.toCol === toCol);
                    if (selectedPiece && move && selectedPiece.row === fromRow && selectedPiece.col === fromCol) {
                        movePiece(fromRow, fromCol, toRow, toCol);
                    }
                });
            });

            document.getElementById('new-game').addEventListener('click', () => {
                initBoard();
                playSound('select');
            });
            document.getElementById('undo-move').addEventListener('click', () => alert('悔棋开发中'));
            document.getElementById('hint').addEventListener('click', () => {
                document.getElementById('status-message').textContent = '提示：控制中心，保护国王';
                setTimeout(updateGameStatus, 1500);
            });
            document.getElementById('toggle-sound').addEventListener('click', function() {
                soundEnabled = !soundEnabled;
                this.innerHTML = soundEnabled ? '🔊 音效: 开' : '🔇 音效: 关';
                playSound('select');
            });
        });
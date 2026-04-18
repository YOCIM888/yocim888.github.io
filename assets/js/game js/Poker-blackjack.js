// 游戏状态变量
let deck = [];
let playerHand = [];
let computer1Hand = [];
let computer2Hand = [];
let gameOver = false;
let playerTurn = true;
let wins = { 
    player: 0, 
    computer1: 0, 
    computer2: 0,
    draws: 0,
    totalRounds: 0
};

// 扑克牌花色和点数
const suits = ['heart', 'diamond', 'spade', 'club'];
const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

// DOM元素
const playerCardsEl = document.getElementById('player-cards');
const computer1CardsEl = document.getElementById('computer1-cards');
const computer2CardsEl = document.getElementById('computer2-cards');
const playerPointsEl = document.getElementById('player-points');
const computer1PointsEl = document.getElementById('computer1-points');
const computer2PointsEl = document.getElementById('computer2-points');
const gameStatusIndicator = document.getElementById('game-status-indicator');
const gameStatusEl = document.getElementById('game-status');
const remainingCardsEl = document.getElementById('remaining-cards');
const deckProgress = document.getElementById('deck-progress');
const messageEl = document.getElementById('message');
const gameResultEl = document.getElementById('game-result');

// 统计元素
const playerWinsEl = document.getElementById('player-wins');
const aiWinsEl = document.getElementById('ai-wins');
const drawsEl = document.getElementById('draws');
const totalRoundsEl = document.getElementById('total-rounds');
const playerStatusEl = document.getElementById('player-status');
const computer1StatusEl = document.getElementById('computer1-status');
const computer2StatusEl = document.getElementById('computer2-status');

// 按钮
const hitBtn = document.getElementById('hit-btn');
const standBtn = document.getElementById('stand-btn');
const dealBtn = document.getElementById('deal-btn');
const newGameBtn = document.getElementById('new-game-btn');

// 初始化游戏
function initGame() {
    createDeck();
    shuffleDeck();
    playerHand = [];
    computer1Hand = [];
    computer2Hand = [];
    gameOver = false;
    playerTurn = true;
    
    // 清空牌桌
    playerCardsEl.innerHTML = '';
    computer1CardsEl.innerHTML = '';
    computer2CardsEl.innerHTML = '';
    
    // 更新界面
    updatePoints();
    updateGameInfo();
    updateStats();
    gameResultEl.textContent = '';
    
    // 更新状态文本
    playerStatusEl.textContent = '准备中';
    computer1StatusEl.textContent = '待机';
    computer2StatusEl.textContent = '待机';
    
    // 设置消息
    setMessage('系统就绪，点击"发牌"开始游戏...', 'info');
    
    // 启用/禁用按钮
    hitBtn.disabled = true;
    standBtn.disabled = true;
    dealBtn.disabled = false;
    newGameBtn.disabled = false;
    
    // 更新牌库进度条
    updateDeckProgress();
}

// 创建一副牌
function createDeck() {
    deck = [];
    for (let suit of suits) {
        for (let value of values) {
            deck.push({ suit, value });
        }
    }
}

// 洗牌
function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    console.log('牌库已洗牌');
}

// 发牌
function dealCards() {
    setMessage('正在发牌...', 'processing');
    
    // 每个玩家发两张牌
    playerHand.push(drawCard());
    playerHand.push(drawCard());
    
    computer1Hand.push(drawCard());
    computer1Hand.push(drawCard());
    
    computer2Hand.push(drawCard());
    computer2Hand.push(drawCard());
    
    // 显示玩家的牌和电脑的第一张牌
    displayCards();
    updatePoints();
    updateDeckProgress();
    
    // 检查玩家是否直接得到21点
    const playerPoints = calculatePoints(playerHand);
    if (playerPoints === 21) {
        setMessage('21点！完美开局！', 'success');
        playerTurn = false;
        playerStatusEl.textContent = '21点';
        setTimeout(computerTurns, 1500);
    } else {
        setMessage('您的回合，请选择"要牌"或"停牌"', 'player-turn');
        playerStatusEl.textContent = '行动中';
    }
    
    // 更新游戏状态
    gameStatusEl.textContent = '游戏中';
    gameStatusIndicator.classList.add('active');
    
    // 启用/禁用按钮
    hitBtn.disabled = false;
    standBtn.disabled = false;
    dealBtn.disabled = true;
}

// 从牌堆中抽一张牌
function drawCard() {
    if (deck.length === 0) {
        setMessage('牌库已空，重新洗牌！', 'warning');
        createDeck();
        shuffleDeck();
    }
    const card = deck.pop();
    updateDeckProgress();
    return card;
}

// 更新牌库进度条
function updateDeckProgress() {
    const percentage = (deck.length / 52) * 100;
    deckProgress.style.width = `${percentage}%`;
    remainingCardsEl.textContent = deck.length;
    
    // 根据剩余牌数改变进度条颜色
    if (percentage < 20) {
        deckProgress.style.background = 'linear-gradient(90deg, #ff3860, #ff0066)';
    } else if (percentage < 50) {
        deckProgress.style.background = 'linear-gradient(90deg, #ffb347, #ffcc33)';
    }
}

// 显示所有玩家的牌
function displayCards() {
    // 显示玩家的牌
    playerCardsEl.innerHTML = '';
    playerHand.forEach(card => {
        playerCardsEl.appendChild(createCardElement(card));
    });
    
    // 显示电脑的牌（第一张隐藏）
    computer1CardsEl.innerHTML = '';
    computer1Hand.forEach((card, index) => {
        if (index === 0 && playerTurn) {
            computer1CardsEl.appendChild(createCardBackElement());
        } else {
            computer1CardsEl.appendChild(createCardElement(card));
        }
    });
    
    computer2CardsEl.innerHTML = '';
    computer2Hand.forEach((card, index) => {
        if (index === 0 && playerTurn) {
            computer2CardsEl.appendChild(createCardBackElement());
        } else {
            computer2CardsEl.appendChild(createCardElement(card));
        }
    });
}

// 创建牌正面元素
function createCardElement(card) {
    const cardEl = document.createElement('div');
    cardEl.className = 'card';
    
    // 确定花色对应的图标和颜色
    let suitIcon, suitClass;
    switch(card.suit) {
        case 'heart':
            suitIcon = '♥';
            suitClass = 'heart';
            break;
        case 'diamond':
            suitIcon = '♦';
            suitClass = 'diamond';
            break;
        case 'spade':
            suitIcon = '♠';
            suitClass = 'spade';
            break;
        case 'club':
            suitIcon = '♣';
            suitClass = 'club';
            break;
    }
    
    const frontHTML = `
        <div class="card-front">
            <div class="card-top ${suitClass}">${card.value} ${suitIcon}</div>
            <div class="card-center ${suitClass}">${suitIcon}</div>
            <div class="card-bottom ${suitClass}">${card.value} ${suitIcon}</div>
        </div>
        <div class="card-back">
            <i class="fas fa-question"></i>
        </div>
    `;
    
    cardEl.innerHTML = frontHTML;
    
    // 添加翻转动画
    setTimeout(() => {
        cardEl.classList.add('flipped');
    }, 100);
    
    return cardEl;
}

// 创建牌背面元素
function createCardBackElement() {
    const cardEl = document.createElement('div');
    cardEl.className = 'card';
    
    const backHTML = `
        <div class="card-front">
            <div class="card-top">?</div>
            <div class="card-center">?</div>
            <div class="card-bottom">?</div>
        </div>
        <div class="card-back">
            <i class="fas fa-question"></i>
        </div>
    `;
    
    cardEl.innerHTML = backHTML;
    
    setTimeout(() => {
        cardEl.classList.add('flipped');
    }, 100);
    
    return cardEl;
}

// 计算手牌点数
function calculatePoints(hand) {
    let points = 0;
    let aceCount = 0;
    
    for (let card of hand) {
        if (card.value === 'A') {
            aceCount++;
            points += 11;
        } else if (['K', 'Q', 'J'].includes(card.value)) {
            points += 10;
        } else {
            points += parseInt(card.value);
        }
    }
    
    // 处理Ace可以当作1点的情况
    while (points > 21 && aceCount > 0) {
        points -= 10;
        aceCount--;
    }
    
    return points;
}

// 更新点数显示
function updatePoints() {
    const playerPoints = calculatePoints(playerHand);
    const computer1Points = calculatePoints(computer1Hand);
    const computer2Points = calculatePoints(computer2Hand);
    
    playerPointsEl.textContent = playerPoints;
    computer1PointsEl.textContent = playerTurn ? '?' : computer1Points;
    computer2PointsEl.textContent = playerTurn ? '?' : computer2Points;
}

// 更新游戏信息
function updateGameInfo() {
    gameStatusEl.textContent = gameOver ? '游戏结束' : '进行中';
    if (gameOver) {
        gameStatusIndicator.classList.remove('active');
    }
}

// 更新统计数据
function updateStats() {
    playerWinsEl.textContent = wins.player;
    aiWinsEl.textContent = wins.computer1 + wins.computer2;
    drawsEl.textContent = wins.draws;
    totalRoundsEl.textContent = wins.totalRounds;
}

// 设置消息
function setMessage(text, type = 'info') {
    messageEl.textContent = text;
    
    // 根据消息类型添加样式
    messageEl.className = 'message-content';
    if (type === 'error') {
        messageEl.style.color = '#ff3860';
        messageEl.style.borderColor = 'rgba(255, 56, 96, 0.3)';
    } else if (type === 'success') {
        messageEl.style.color = '#00ff9d';
        messageEl.style.borderColor = 'rgba(0, 255, 157, 0.3)';
    } else if (type === 'warning') {
        messageEl.style.color = '#ffb347';
        messageEl.style.borderColor = 'rgba(255, 179, 71, 0.3)';
    } else if (type === 'player-turn') {
        messageEl.style.color = '#00ffea';
        messageEl.style.borderColor = 'rgba(0, 255, 234, 0.3)';
    } else if (type === 'processing') {
        messageEl.style.color = '#8a8aff';
        messageEl.style.borderColor = 'rgba(138, 138, 255, 0.3)';
    }
    
    // 重置样式
    setTimeout(() => {
        messageEl.style.color = '';
        messageEl.style.borderColor = '';
    }, 3000);
}

// 玩家要牌
function playerHit() {
    if (!playerTurn || gameOver) return;
    
    setMessage('要牌中...', 'processing');
    
    playerHand.push(drawCard());
    displayCards();
    updatePoints();
    
    const playerPoints = calculatePoints(playerHand);
    
    if (playerPoints > 21) {
        setMessage('爆牌！点数超过21点', 'error');
        playerTurn = false;
        gameOver = true;
        playerStatusEl.textContent = '爆牌';
        setTimeout(computerTurns, 1500);
    } else if (playerPoints === 21) {
        setMessage('21点！完美！', 'success');
        playerTurn = false;
        playerStatusEl.textContent = '21点';
        setTimeout(computerTurns, 1500);
    } else {
        setMessage('当前点数: ' + playerPoints + '，继续要牌还是停牌？', 'player-turn');
    }
    
    updateGameInfo();
}

// 玩家停牌
function playerStand() {
    if (!playerTurn || gameOver) return;
    
    setMessage('停牌，等待AI行动...', 'processing');
    playerTurn = false;
    playerStatusEl.textContent = '停牌';
    updateGameInfo();
    
    setTimeout(computerTurns, 1500);
}

// 电脑回合
function computerTurns() {
    // 显示所有电脑的牌
    displayCards();
    updatePoints();
    
    // 电脑1行动
    setMessage('AI-01 正在分析...', 'processing');
    computer1StatusEl.textContent = '分析中';
    
    setTimeout(() => {
        computerAction('computer1', computer1Hand);
        computer1StatusEl.textContent = '行动中';
        
        // 电脑2行动
        setMessage('AI-02 正在计算...', 'processing');
        computer2StatusEl.textContent = '计算中';
        
        setTimeout(() => {
            computerAction('computer2', computer2Hand);
            computer2StatusEl.textContent = '行动中';
            
            // 所有玩家行动结束，判断胜负
            setTimeout(() => {
                determineWinner();
                computer1StatusEl.textContent = '完成';
                computer2StatusEl.textContent = '完成';
            }, 1000);
        }, 1500);
    }, 1500);
}

// 电脑行动逻辑
function computerAction(computerName, hand) {
    let points = calculatePoints(hand);
    const computerNum = computerName === 'computer1' ? 1 : 2;
    
    // 增强的电脑策略：根据当前点数智能决策
    const riskLevel = Math.random(); // 随机风险系数
    
    // 基础策略：点数小于16通常要牌
    let targetPoints = 17;
    
    // 增加随机性：有时会更冒险或更保守
    if (riskLevel > 0.7) {
        targetPoints = 18; // 更冒险
    } else if (riskLevel < 0.3) {
        targetPoints = 16; // 更保守
    }
    
    // 如果已有A且点数为软17，也继续要牌
    const hasAce = hand.some(card => card.value === 'A');
    if (hasAce && points === 17) {
        targetPoints = 18;
    }
    
    while (points < targetPoints) {
        hand.push(drawCard());
        points = calculatePoints(hand);
        
        // 如果爆牌则停止要牌
        if (points > 21) {
            setMessage(`AI-0${computerNum} 爆牌了！`, 'warning');
            break;
        }
    }
    
    // 更新显示
    displayCards();
    updatePoints();
    updateDeckProgress();
    
    const message = `AI-0${computerNum} ${points > 21 ? '爆牌' : `停牌，点数 ${points}`}`;
    console.log(message);
}

// 判断获胜者
function determineWinner() {
    wins.totalRounds++;
    
    const playerPoints = calculatePoints(playerHand);
    const computer1Points = calculatePoints(computer1Hand);
    const computer2Points = calculatePoints(computer2Hand);
    
    let result = '';
    let winnerKey = '';
    let winnerName = '';
    
    // 收集所有玩家的点数和状态
    const players = [
        { name: '玩家', key: 'player', points: playerPoints },
        { name: 'AI-01', key: 'computer1', points: computer1Points },
        { name: 'AI-02', key: 'computer2', points: computer2Points }
    ];
    
    // 过滤掉爆牌的玩家
    const validPlayers = players.filter(p => p.points <= 21);
    
    if (validPlayers.length === 0) {
        // 所有玩家都爆牌
        result = '所有玩家都爆牌！平局';
        wins.draws++;
    } else {
        // 找出点数最高的玩家
        let maxPoints = -1;
        let winners = [];
        
        for (let player of validPlayers) {
            if (player.points > maxPoints) {
                maxPoints = player.points;
                winners = [player];
            } else if (player.points === maxPoints) {
                winners.push(player);
            }
        }
        
        if (winners.length > 1) {
            // 平局
            const winnerNames = winners.map(w => w.name).join(' 和 ');
            result = `${winnerNames} 平局，点数均为 ${maxPoints} 点！`;
            wins.draws++;
        } else {
            // 单一获胜者
            winnerKey = winners[0].key;
            winnerName = winners[0].name;
            wins[winnerKey]++;
            result = `🎉 ${winnerName} 获胜！点数：${maxPoints}`;
            
            // 高亮显示获胜者
            if (winnerKey === 'player') {
                playerStatusEl.textContent = '胜利！';
                playerStatusEl.style.color = '#00ff9d';
            }
        }
    }
    
    // 显示结果
    gameResultEl.textContent = result;
    setMessage('游戏结束！点击"新游戏"开始新的一局', 'info');
    
    // 更新获胜计数
    updateStats();
    
    // 游戏结束
    gameOver = true;
    updateGameInfo();
    
    // 禁用行动按钮
    hitBtn.disabled = true;
    standBtn.disabled = true;
    dealBtn.disabled = true;
}

// 事件监听
hitBtn.addEventListener('click', playerHit);

standBtn.addEventListener('click', playerStand);

dealBtn.addEventListener('click', () => {
    dealCards();
});

newGameBtn.addEventListener('click', initGame);

// 添加键盘快捷键
document.addEventListener('keydown', (e) => {
    if (gameOver) return;
    
    switch(e.key.toLowerCase()) {
        case 'h':
            if (!hitBtn.disabled) playerHit();
            break;
        case 's':
            if (!standBtn.disabled) playerStand();
            break;
        case 'd':
            if (!dealBtn.disabled) dealCards();
            break;
        case 'n':
            if (!newGameBtn.disabled) initGame();
            break;
    }
});

// 添加按钮点击效果
document.querySelectorAll('.cyber-btn').forEach(btn => {
    btn.addEventListener('mousedown', function() {
        this.style.transform = 'scale(0.95)';
    });
    
    btn.addEventListener('mouseup', function() {
        this.style.transform = '';
    });
    
    btn.addEventListener('mouseleave', function() {
        this.style.transform = '';
    });
});

// 初始化游戏
initGame();
console.log('赛博霓虹21点游戏已加载完毕！');
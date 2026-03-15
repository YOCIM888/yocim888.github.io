// 游戏数据
const game = {
    phase: 'profession', // profession, auction, finished
    currentItemIndex: 0,
    currentBid: 0,
    currentBidder: null,
    auctionActive: false,
    items: [],
    players: [
        {
            id: 1,
            name: '1号选手',
            isPlayer: true,
            gold: 500,
            health: 1000,
            maxHealth: 1000,
            attack: 50,
            defense: 10,
            penetration: 0,
            profession: null,
            items: [],
            enemyId: 2,
            canBid: true,
            hasProfession: false,
            blessings: [], // 新增：祝福效果
            curses: [] // 新增：诅咒效果
        },
        {
            id: 2,
            name: '2号选手',
            isPlayer: false,
            gold: 500,
            health: 1000,
            maxHealth: 1000,
            attack: 50,
            defense: 10,
            penetration: 0,
            profession: null,
            items: [],
            enemyId: 3,
            canBid: true,
            hasProfession: false,
            blessings: [],
            curses: []
        },
        {
            id: 3,
            name: '3号选手',
            isPlayer: false,
            gold: 500,
            health: 1000,
            maxHealth: 1000,
            attack: 50,
            defense: 10,
            penetration: 0,
            profession: null,
            items: [],
            enemyId: 1,
            canBid: true,
            hasProfession: false,
            blessings: [],
            curses: []
        }
    ],
    // 物品数据库
    itemDB: {
        // 职业卡
        professions: [
            {
                id: 'knight',
                name: '骑士职业卡',
                type: 'profession',
                startPrice: 50,
                description: '从装备中获取的防御额外+100％，且初始增加100点生命值。',
                effect: (player) => {
                    player.defense += player.defense * 1.0;
                    player.health += 100;
                    player.maxHealth += 100;
                }
            },
            {
                id: 'ranger',
                name: '游侠职业卡',
                type: 'profession',
                startPrice: 50,
                description: '造成伤害时，总攻击力的20％视为真伤，并且从【嗜血长弓】中可额外获得50点攻击力。',
                effect: (player) => {
                    // 效果在攻击时计算
                }
            },
            {
                id: 'holywarrior',
                name: '圣战职业卡',
                type: 'profession',
                startPrice: 50,
                description: '基础攻击力+50，无视对手50％防御。',
                effect: (player) => {
                    player.attack += 50;
                }
            },
            // 新增职业卡
            {
                id: 'necromancer',
                name: '亡灵法师职业卡',
                type: 'profession',
                startPrice: 55,
                description: '每次攻击时，造成伤害的15%转化为自身生命值，但自身防御降低20%。',
                effect: (player) => {
                    player.defense *= 0.8;
                }
            },
            {
                id: 'berserker',
                name: '狂战士职业卡',
                type: 'profession',
                startPrice: 60,
                description: '攻击力+80，血量每降低10%，攻击力额外增加5%。',
                effect: (player) => {
                    player.attack += 80;
                }
            }
        ],
        // 武器卡
        weapons: [
            {
                id: 'phoenix_spear',
                name: '凤凰长枪',
                type: 'weapon',
                startPrice: 60,
                description: '攻击+200，攻击时额外造成自身防御50％的伤害（200+自身防御值50％）。',
                effect: (player) => {
                    player.attack += 200;
                }
            },
            {
                id: 'lowmagic_staff',
                name: '低语法杖',
                type: 'weapon',
                startPrice: 60,
                description: '攻击+200，如果自身攻击力低于对手防御，则直接计算为造成100点真伤（固定）。',
                effect: (player) => {
                    player.attack += 200;
                }
            },
            {
                id: 'bloodthirsty_bow',
                name: '嗜血长弓',
                type: 'weapon',
                startPrice: 60,
                description: '攻击+200，装备后，每次攻击都可以恢复20点血量，可以超出上限。',
                effect: (player) => {
                    player.attack += 200;
                }
            },
            // 新增武器卡
            {
                id: 'dragonslayer',
                name: '屠龙巨剑',
                type: 'weapon',
                startPrice: 70,
                description: '攻击+250，对血量高于70%的敌人造成额外30%伤害。',
                effect: (player) => {
                    player.attack += 250;
                }
            },
            {
                id: 'shadow_dagger',
                name: '暗影匕首',
                type: 'weapon',
                startPrice: 65,
                description: '攻击+180，有30%概率造成双倍伤害。',
                effect: (player) => {
                    player.attack += 180;
                }
            }
        ],
        // 装备卡
        equipments: [
            {
                id: 'blessing_ring',
                name: '祝福戒指',
                type: 'equipment',
                startPrice: 40,
                description: '获得一次金身，下一回合不会被攻击，仅一次。',
                effect: (player) => {
                    player.blessings.push('invincible');
                }
            },
            {
                id: 'dragon_armor',
                name: '真龙铠甲',
                type: 'equipment',
                startPrice: 70,
                description: '防御+100，装备后，当前防御的50％转化为额外的基础攻击力（只计算拍下后，此时此刻的防御）。',
                effect: (player) => {
                    player.defense += 100;
                    player.attack += player.defense * 0.5;
                }
            },
            {
                id: 'hunter_coat',
                name: '猎手风衣',
                type: 'equipment',
                startPrice: 40,
                description: '防御+10，装备后，总攻击力的20％视为真伤（可和其他真伤叠加，作加减法）',
                effect: (player) => {
                    player.defense += 10;
                }
            },
            // 新增装备卡
            {
                id: 'titan_gauntlet',
                name: '泰坦护手',
                type: 'equipment',
                startPrice: 45,
                description: '防御+30，攻击+30，攻击时无视敌人15%防御。',
                effect: (player) => {
                    player.defense += 30;
                    player.attack += 30;
                }
            },
            {
                id: 'phantom_cloak',
                name: '幻影斗篷',
                type: 'equipment',
                startPrice: 50,
                description: '防御+20，受到攻击时有25%概率完全闪避。',
                effect: (player) => {
                    player.defense += 20;
                }
            },
            {
                id: 'elemental_amulet',
                name: '元素护符',
                type: 'equipment',
                startPrice: 55,
                description: '所有属性+5%，攻击时附加元素伤害（攻击力×10%）。',
                effect: (player) => {
                    player.attack *= 1.05;
                    player.defense *= 1.05;
                }
            }
        ],
        // 道具卡
        items: [
            {
                id: 'health_potion',
                name: '血药水',
                type: 'item',
                startPrice: 30,
                description: '恢复300点血量，仅一次。',
                effect: (player) => {
                    player.health = Math.min(player.health + 300, player.maxHealth);
                    addLog(`${player.name} 使用了血药水，恢复了300点生命值！`, 'heal');
                }
            },
            {
                id: 'curse_stone',
                name: '诅咒石',
                type: 'item',
                startPrice: 40,
                description: '指定任意一名选手，降低其50％防御，持续2回合。',
                effect: (player) => {
                    // 简化处理：随机选择敌人
                    const enemies = game.players.filter(p => p.id !== player.id);
                    if (enemies.length > 0) {
                        const target = enemies[Math.floor(Math.random() * enemies.length)];
                        target.curses.push({
                            type: 'defense_reduction',
                            value: 0.5,
                            duration: 2
                        });
                        addLog(`${player.name} 对 ${target.name} 使用了诅咒石，降低其50%防御！`, 'system');
                    }
                }
            },
            {
                id: 'saint_robe',
                name: '圣者战袍',
                type: 'item',
                startPrice: 50,
                description: '防御+50，装备后，基础攻击力（只算基础）的部分视为真伤。',
                effect: (player) => {
                    player.defense += 50;
                }
            },
            {
                id: 'evil_stone',
                name: '邪神石',
                type: 'item',
                startPrice: 45,
                description: '使用后，指定一名选手清空基础攻击力，基础部分视为0，持续1回合。',
                effect: (player) => {
                    const enemies = game.players.filter(p => p.id !== player.id);
                    if (enemies.length > 0) {
                        const target = enemies[Math.floor(Math.random() * enemies.length)];
                        target.curses.push({
                            type: 'attack_reset',
                            duration: 1
                        });
                        addLog(`${player.name} 对 ${target.name} 使用了邪神石，清空其基础攻击力！`, 'system');
                    }
                }
            },
            {
                id: 'gold_to_blood',
                name: '化金成血',
                type: 'item',
                startPrice: 10,
                description: '拍下此件物品后，扣除对应的竞拍金币，剩余金币数量转化为血量。（金币不足10的部分，按10计算）',
                effect: (player, bidAmount) => {
                    const remainingGold = player.gold;
                    const healthGain = Math.ceil(remainingGold / 10) * 10;
                    player.health += healthGain;
                    player.gold = 0;
                    addLog(`${player.name} 使用化金成血，将剩余金币转化为 ${healthGain} 点生命值！`, 'heal');
                }
            },
            // 新增道具卡
            {
                id: 'mana_crystal',
                name: '魔力水晶',
                type: 'item',
                startPrice: 35,
                description: '立即获得100金币，并且下一件拍卖品价格降低20%。',
                effect: (player) => {
                    player.gold += 100;
                    player.blessings.push('discount_next');
                    addLog(`${player.name} 使用魔力水晶，获得100金币！`, 'system');
                }
            },
            {
                id: 'time_sandglass',
                name: '时光沙漏',
                type: 'item',
                startPrice: 60,
                description: '立即获得额外一次攻击机会。',
                effect: (player) => {
                    setTimeout(() => {
                        performAttack(player);
                        addLog(`${player.name} 使用时光沙漏，获得额外攻击！`, 'system');
                    }, 1000);
                }
            },
            {
                id: 'berserk_potion',
                name: '狂暴药剂',
                type: 'item',
                startPrice: 40,
                description: '攻击力+100，防御力-20，持续3回合。',
                effect: (player) => {
                    player.attack += 100;
                    player.defense -= 20;
                    player.blessings.push({
                        type: 'berserk',
                        duration: 3,
                        originalAttack: 100,
                        originalDefense: 20
                    });
                    addLog(`${player.name} 使用狂暴药剂，攻击力+100，防御力-20！`, 'system');
                }
            },
            {
                id: 'guardian_totem',
                name: '守护图腾',
                type: 'item',
                startPrice: 55,
                description: '防御+80，受到的所有伤害降低20%，持续2回合。',
                effect: (player) => {
                    player.defense += 80;
                    player.blessings.push({
                        type: 'damage_reduction',
                        value: 0.2,
                        duration: 2
                    });
                }
            },
            {
                id: 'golden_apple',
                name: '金苹果',
                type: 'item',
                startPrice: 25,
                description: '立即恢复500点生命值，且生命上限+50。',
                effect: (player) => {
                    player.health = Math.min(player.health + 500, player.maxHealth);
                    player.maxHealth += 50;
                    addLog(`${player.name} 食用金苹果，恢复500点生命值，生命上限+50！`, 'heal');
                }
            }
        ]
    },
    log: []
};

// DOM元素
const elements = {
    // 游戏状态
    currentItemName: document.getElementById('current-item-name'),
    gamePhase: document.getElementById('game-phase'),
    itemsLeft: document.getElementById('items-left'),
    
    // 拍卖物品
    itemName: document.getElementById('item-name'),
    itemType: document.getElementById('item-type'),
    itemDesc: document.getElementById('item-desc'),
    startPrice: document.getElementById('start-price'),
    minBid: document.getElementById('min-bid'),
    
    // 出价信息
    currentBidAmount: document.getElementById('current-bid-amount'),
    currentBidder: document.getElementById('current-bidder'),
    
    // 出价控制
    bidInput: document.getElementById('bid-input'),
    bidButton: document.getElementById('bid-button'),
    passButton: document.getElementById('pass-button'),
    
    // 日志
    logContainer: document.getElementById('log-container'),
    
    // 玩家状态
    player1Gold: document.getElementById('player1-gold'),
    player1Health: document.getElementById('player1-health'),
    player1HealthBar: document.getElementById('player1-health-bar'),
    player1Attack: document.getElementById('player1-attack'),
    player1Defense: document.getElementById('player1-defense'),
    player1Penetration: document.getElementById('player1-penetration'),
    player1Class: document.getElementById('player1-class'),
    player1Enemy: document.getElementById('player1-enemy'),
    player1Items: document.getElementById('player1-items'),
    
    player2Gold: document.getElementById('player2-gold'),
    player2Health: document.getElementById('player2-health'),
    player2HealthBar: document.getElementById('player2-health-bar'),
    player2Attack: document.getElementById('player2-attack'),
    player2Defense: document.getElementById('player2-defense'),
    player2Penetration: document.getElementById('player2-penetration'),
    player2Class: document.getElementById('player2-class'),
    player2Enemy: document.getElementById('player2-enemy'),
    player2Items: document.getElementById('player2-items'),
    
    player3Gold: document.getElementById('player3-gold'),
    player3Health: document.getElementById('player3-health'),
    player3HealthBar: document.getElementById('player3-health-bar'),
    player3Attack: document.getElementById('player3-attack'),
    player3Defense: document.getElementById('player3-defense'),
    player3Penetration: document.getElementById('player3-penetration'),
    player3Class: document.getElementById('player3-class'),
    player3Enemy: document.getElementById('player3-enemy'),
    player3Items: document.getElementById('player3-items'),
    
    // 胜利界面
    winnerSection: document.getElementById('winner-section'),
    winnerName: document.getElementById('winner-name'),
    restartButton: document.getElementById('restart-button')
};

// 初始化游戏
function initGame() {
    // 生成拍卖物品列表
    generateAuctionItems();
    
    // 重置玩家状态
    game.players.forEach(player => {
        player.gold = 500;
        player.health = 1000;
        player.maxHealth = 1000;
        player.attack = 50;
        player.defense = 10;
        player.penetration = 0;
        player.profession = null;
        player.items = [];
        player.canBid = true;
        player.hasProfession = false;
        player.blessings = [];
        player.curses = [];
    });
    
    // 重置游戏状态
    game.phase = 'profession';
    game.currentItemIndex = 0;
    game.currentBid = 0;
    game.currentBidder = null;
    game.auctionActive = false;
    game.log = [];
    
    // 更新UI
    updateUI();
    updateLog();
    
    // 开始第一件物品拍卖
    startAuction();
    
    addLog("游戏开始！每人有500金币，前5件是职业卡，每人只能获得一张职业卡。", "system");
    addLog("第1件拍卖品即将开始！", "system");
}

// 生成拍卖物品列表
function generateAuctionItems() {
    game.items = [];
    
    // 前5件是职业卡（增加了新职业）
    const professions = [...game.itemDB.professions];
    shuffleArray(professions);
    for (let i = 0; i < 5; i++) {
        game.items.push({...professions[i]});
    }
    
    // 接下来5件是武器卡（增加了新武器）
    const weapons = [...game.itemDB.weapons];
    shuffleArray(weapons);
    for (let i = 0; i < 5; i++) {
        game.items.push({...weapons[i]});
    }
    
    // 接下来6件是装备卡（增加了新装备）
    const equipments = [...game.itemDB.equipments];
    shuffleArray(equipments);
    for (let i = 0; i < 6; i++) {
        game.items.push({...equipments[i]});
    }
    
    // 最后9件是道具卡（增加了新道具）
    const itemCards = [...game.itemDB.items];
    shuffleArray(itemCards);
    for (let i = 0; i < 9; i++) {
        game.items.push({...itemCards[i]});
    }
    
    // 打乱后20件物品的顺序（从第6件开始）
    const remainingItems = game.items.slice(5);
    shuffleArray(remainingItems);
    for (let i = 5; i < game.items.length; i++) {
        game.items[i] = remainingItems[i - 5];
    }
}

// 数组随机排序
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// 开始拍卖当前物品
function startAuction() {
    if (game.currentItemIndex >= game.items.length) {
        endGame();
        return;
    }
    
    const currentItem = game.items[game.currentItemIndex];
    game.auctionActive = true;
    game.currentBid = currentItem.startPrice;
    game.currentBidder = null;
    
    // 更新拍卖品信息
    elements.itemName.textContent = currentItem.name;
    elements.itemType.textContent = getTypeName(currentItem.type);
    elements.itemType.className = 'item-type ' + getTypeClass(currentItem.type);
    elements.itemDesc.textContent = currentItem.description;
    elements.startPrice.textContent = currentItem.startPrice;
    
    // 设置最小加价
    const minBid = Math.max(5, Math.floor(currentItem.startPrice * 0.1));
    elements.minBid.textContent = minBid;
    
    // 更新游戏状态显示
    elements.currentItemName.textContent = currentItem.name;
    elements.gamePhase.textContent = getPhaseName(game.phase);
    elements.itemsLeft.textContent = game.items.length - game.currentItemIndex;
    
    // 重置出价输入
    elements.bidInput.value = Math.max(currentItem.startPrice, game.currentBid + minBid);
    elements.bidInput.min = game.currentBid + minBid;
    elements.bidInput.max = 500;
    
    // 更新当前出价显示
    updateBidDisplay();
    
    // 检查玩家是否可以出价
    const player = game.players[0];
    if (game.phase === 'profession' && player.hasProfession) {
        elements.bidButton.disabled = true;
        elements.passButton.disabled = true;
        addLog("你已经拥有职业卡，不能竞拍其他职业卡。", "system");
    } else if (player.gold < game.currentBid + minBid) {
        elements.bidButton.disabled = true;
        elements.passButton.disabled = true;
        addLog("你的金币不足，无法出价。", "system");
    } else {
        elements.bidButton.disabled = false;
        elements.passButton.disabled = false;
    }
    
    // 添加日志
    addLog(`第${game.currentItemIndex + 1}件拍卖品：${currentItem.name}，起拍价${currentItem.startPrice}金币。`, "system");
    
    // 如果是职业卡阶段第五件，且还有选手没有职业，自动分配
    if (game.phase === 'profession' && game.currentItemIndex === 4) {
        const playersWithoutProfession = game.players.filter(p => !p.hasProfession);
        if (playersWithoutProfession.length > 0) {
            setTimeout(() => {
                autoAssignProfession(playersWithoutProfession[0], currentItem);
            }, 1000);
            return;
        }
    }
    
    // 电脑出价
    setTimeout(computerBid, 500);
}

// 获取类型名称
function getTypeName(type) {
    switch(type) {
        case 'profession': return '职业卡';
        case 'weapon': return '武器卡';
        case 'equipment': return '装备卡';
        case 'item': return '道具卡';
        default: return '未知';
    }
}

// 获取类型CSS类
function getTypeClass(type) {
    switch(type) {
        case 'profession': return 'type-profession';
        case 'weapon': return 'type-weapon';
        case 'equipment': return 'type-equipment';
        case 'item': return 'type-item';
        default: return '';
    }
}

// 获取阶段名称
function getPhaseName(phase) {
    switch(phase) {
        case 'profession': return '职业选择阶段';
        case 'auction': return '拍卖阶段';
        case 'finished': return '游戏结束';
        default: return '未知';
    }
}

// 更新出价显示
function updateBidDisplay() {
    elements.currentBidAmount.textContent = game.currentBid;
    elements.currentBidder.textContent = game.currentBidder ? game.currentBidder.name : '无';
    
    // 更新出价输入最小值
    const minBid = parseInt(elements.minBid.textContent);
    elements.bidInput.min = game.currentBid + minBid;
    elements.bidInput.value = Math.max(game.currentBid + minBid, elements.bidInput.min);
}

// 玩家出价
function playerBid() {
    if (!game.auctionActive) return;
    
    const player = game.players[0];
    const bidAmount = parseInt(elements.bidInput.value);
    const minBid = parseInt(elements.minBid.textContent);
    const currentItem = game.items[game.currentItemIndex];
    
    // 检查出价是否有效
    if (bidAmount < game.currentBid + minBid) {
        addLog(`出价必须至少比当前出价高${minBid}金币。`, "system");
        return;
    }
    
    if (bidAmount > player.gold) {
        addLog("你的金币不足。", "system");
        return;
    }
    
    if (game.phase === 'profession' && player.hasProfession) {
        addLog("你已经拥有职业卡，不能竞拍其他职业卡。", "system");
        return;
    }
    
    // 更新出价
    game.currentBid = bidAmount;
    game.currentBidder = player;
    
    // 更新显示
    updateBidDisplay();
    addLog(`${player.name} 出价 ${bidAmount} 金币！`, "player");
    
    // 检查是否有人跟价
    setTimeout(checkComputerBids, 800);
}

// 玩家放弃
function playerPass() {
    if (!game.auctionActive) return;
    
    const player = game.players[0];
    player.canBid = false;
    elements.bidButton.disabled = true;
    elements.passButton.disabled = true;
    
    addLog(`${player.name} 放弃竞拍。`, "player");
    
    // 检查是否还有人可以出价
    setTimeout(checkAuctionEnd, 500);
}

// 电脑出价
function computerBid() {
    if (!game.auctionActive) return;
    
    // 获取可以出价的电脑玩家
    const computerPlayers = game.players.filter(p => !p.isPlayer && p.canBid && p.gold > 0);
    
    // 如果没有电脑玩家可以出价，检查拍卖是否结束
    if (computerPlayers.length === 0) {
        setTimeout(checkAuctionEnd, 500);
        return;
    }
    
    // 随机选择一个电脑玩家出价
    const computer = computerPlayers[Math.floor(Math.random() * computerPlayers.length)];
    const currentItem = game.items[game.currentItemIndex];
    const minBid = parseInt(elements.minBid.textContent);
    
    // 检查电脑是否可以出价
    if (game.phase === 'profession' && computer.hasProfession) {
        computer.canBid = false;
        setTimeout(computerBid, 500);
        return;
    }
    
    // 电脑出价逻辑（增强版）
    let bidAmount;
    const maxBid = Math.min(computer.gold, game.currentBid + minBid * 4);
    
    if (computer.gold < game.currentBid + minBid) {
        // 金币不足，放弃
        computer.canBid = false;
        addLog(`${computer.name} 金币不足，放弃竞拍。`, "computer");
        setTimeout(computerBid, 500);
        return;
    }
    
    // 根据物品类型和电脑当前状态决定出价意愿
    let bidChance = 0.6; // 基础出价概率
    
    // 职业卡阶段，没有职业的电脑更想获得职业卡
    if (game.phase === 'profession' && !computer.hasProfession) {
        bidChance = 0.85;
    }
    
    // 根据电脑健康状况调整出价意愿
    const healthRatio = computer.health / computer.maxHealth;
    if (healthRatio < 0.3) {
        // 血量低时更想买恢复物品
        if (currentItem.id.includes('potion') || currentItem.id === 'golden_apple') {
            bidChance = 0.95;
        }
    } else if (healthRatio > 0.8) {
        // 血量高时更想买攻击物品
        if (currentItem.type === 'weapon' || currentItem.id === 'berserk_potion') {
            bidChance = 0.8;
        }
    }
    
    // 根据金币数量调整出价意愿
    const goldRatio = computer.gold / 500;
    if (goldRatio < 0.3) {
        bidChance *= 0.7; // 金币少时更谨慎
    } else if (goldRatio > 0.7) {
        bidChance *= 1.2; // 金币多时更激进
    }
    
    // 随机决定是否出价
    if (Math.random() > bidChance) {
        computer.canBid = false;
        addLog(`${computer.name} 放弃竞拍。`, "computer");
        setTimeout(computerBid, 500);
        return;
    }
    
    // 决定出价金额
    bidAmount = game.currentBid + minBid + Math.floor(Math.random() * minBid * 3);
    bidAmount = Math.min(bidAmount, maxBid);
    
    // 更新出价
    game.currentBid = bidAmount;
    game.currentBidder = computer;
    
    // 更新显示
    updateBidDisplay();
    addLog(`${computer.name} 出价 ${bidAmount} 金币！`, "computer");
    
    // 短暂延迟后检查是否有人跟价
    setTimeout(checkComputerBids, 800);
}

// 检查电脑是否跟价
function checkComputerBids() {
    if (!game.auctionActive) return;
    
    // 检查是否还有电脑可以出价
    const otherPlayers = game.players.filter(p => 
        p !== game.currentBidder && 
        p.canBid && 
        p.gold >= game.currentBid + parseInt(elements.minBid.textContent)
    );
    
    // 如果有玩家可以出价，继续拍卖
    if (otherPlayers.length > 0) {
        // 检查玩家是否可以出价
        const player = game.players[0];
        if (player.canBid && player !== game.currentBidder && player.gold >= game.currentBid + parseInt(elements.minBid.textContent)) {
            // 玩家可以出价，等待玩家操作
            elements.bidButton.disabled = false;
            elements.passButton.disabled = false;
            return;
        }
        
        // 否则电脑继续出价
        setTimeout(computerBid, 800);
    } else {
        // 没有人可以出价了，结束拍卖
        setTimeout(checkAuctionEnd, 500);
    }
}

// 检查拍卖是否结束
function checkAuctionEnd() {
    if (!game.auctionActive) return;
    
    // 检查是否还有玩家可以出价
    const canBidPlayers = game.players.filter(p => 
        p.canBid && 
        p.gold >= game.currentBid + parseInt(elements.minBid.textContent)
    );
    
    // 如果有出价者，且当前出价者不是null，拍卖结束
    if (canBidPlayers.length === 0 || (canBidPlayers.length === 1 && canBidPlayers[0] === game.currentBidder)) {
        endAuction();
    } else {
        // 还有人可以出价，继续拍卖
        setTimeout(computerBid, 500);
    }
}

// 结束当前拍卖
function endAuction() {
    if (!game.auctionActive) return;
    
    game.auctionActive = false;
    const currentItem = game.items[game.currentItemIndex];
    
    // 如果有出价者，物品归出价者所有
    if (game.currentBidder) {
        const winner = game.currentBidder;
        winner.gold -= game.currentBid;
        
        // 应用物品效果
        applyItemEffect(winner, currentItem, game.currentBid);
        
        // 添加到玩家物品列表
        winner.items.push(currentItem.name);
        
        // 如果是职业卡，标记已获得职业
        if (currentItem.type === 'profession') {
            winner.profession = currentItem.name;
            winner.hasProfession = true;
        }
        
        addLog(`${winner.name} 以 ${game.currentBid} 金币拍得 ${currentItem.name}！`, "system");
        
        // 执行攻击（职业卡阶段后）
        if (game.phase === 'auction') {
            performAttack(winner);
        }
    } else {
        addLog(`${currentItem.name} 流拍！`, "system");
    }
    
    // 职业卡阶段结束后进入拍卖阶段
    if (game.phase === 'profession' && game.currentItemIndex === 4) {
        game.phase = 'auction';
        addLog("职业选择阶段结束，现在进入正式拍卖阶段！", "system");
        addLog("从现在开始，每次拍得物品后都会对敌人发动攻击！", "system");
    }
    
    // 重置所有玩家的出价权限
    game.players.forEach(player => {
        player.canBid = true;
    });
    
    // 更新效果持续时间
    updateEffectsDuration();
    
    // 更新UI
    updateUI();
    
    // 延迟后开始下一件物品拍卖
    game.currentItemIndex++;
    if (game.currentItemIndex < game.items.length) {
        setTimeout(() => {
            startAuction();
            // 重新启用玩家出价按钮
            elements.bidButton.disabled = false;
            elements.passButton.disabled = false;
        }, 1500);
    } else {
        endGame();
    }
}

// 更新效果持续时间
function updateEffectsDuration() {
    game.players.forEach(player => {
        // 更新祝福效果持续时间
        player.blessings = player.blessings.filter(blessing => {
            if (typeof blessing === 'string') return true; // 永久效果
            if (blessing.duration) {
                blessing.duration--;
                return blessing.duration > 0;
            }
            return true;
        });
        
        // 更新诅咒效果持续时间
        player.curses = player.curses.filter(curse => {
            if (curse.duration) {
                curse.duration--;
                return curse.duration > 0;
            }
            return true;
        });
    });
}

// 自动分配职业卡（用于第五张职业卡）
function autoAssignProfession(player, item) {
    if (player.gold < item.startPrice) return;
    
    game.auctionActive = false;
    player.gold -= item.startPrice;
    player.profession = item.name;
    player.hasProfession = true;
    player.items.push(item.name);
    
    // 应用职业效果
    applyItemEffect(player, item, item.startPrice);
    
    addLog(`${player.name} 自动获得 ${item.name}（花费${item.startPrice}金币）！`, "system");
    
    // 更新UI
    updateUI();
    
    // 职业卡阶段结束
    game.phase = 'auction';
    game.currentItemIndex++;
    
    if (game.currentItemIndex < game.items.length) {
        setTimeout(() => {
            startAuction();
        }, 1500);
    }
}

// 应用物品效果
function applyItemEffect(player, item, bidAmount) {
    // 执行物品效果
    if (item.effect) {
        item.effect(player, bidAmount);
    }
    
    // 特殊处理化金成血
    if (item.id === 'gold_to_blood') {
        // 效果已经在effect函数中应用
    }
    
    // 更新玩家属性显示
    updatePlayerUI(player);
}

// 执行攻击（增强版）
function performAttack(attacker) {
    const defender = game.players.find(p => p.id === attacker.enemyId);
    if (!defender) return;
    
    // 检查防御者是否有无敌效果
    if (defender.blessings.includes('invincible')) {
        defender.blessings = defender.blessings.filter(b => b !== 'invincible');
        addLog(`${defender.name} 的祝福戒指生效，完全抵挡了本次攻击！`, "system");
        return;
    }
    
    // 检查防御者是否有闪避效果
    if (defender.items.includes('幻影斗篷') && Math.random() < 0.25) {
        addLog(`${defender.name} 的幻影斗篷生效，闪避了本次攻击！`, "system");
        return;
    }
    
    // 计算攻击伤害
    let baseDamage = attacker.attack;
    let penetrationDamage = 0;
    let trueDamage = 0;
    let criticalMultiplier = 1;
    
    // 职业效果
    if (attacker.profession === '游侠职业卡') {
        // 总攻击力的20%视为真伤
        trueDamage += baseDamage * 0.2;
    }
    
    if (attacker.profession === '圣战职业卡') {
        // 无视对手50%防御
        penetrationDamage += defender.defense * 0.5;
    }
    
    if (attacker.profession === '亡灵法师职业卡') {
        // 伤害的15%转化为生命
        // 在计算完伤害后处理
    }
    
    if (attacker.profession === '狂战士职业卡') {
        // 根据血量计算额外攻击力
        const healthRatio = attacker.health / attacker.maxHealth;
        const missingHealth = 1 - healthRatio;
        baseDamage *= (1 + missingHealth * 0.5);
    }
    
    // 武器效果
    if (attacker.items.includes('屠龙巨剑') && defender.health / defender.maxHealth > 0.7) {
        criticalMultiplier = 1.3;
    }
    
    if (attacker.items.includes('暗影匕首') && Math.random() < 0.3) {
        criticalMultiplier = 2;
    }
    
    // 装备效果
    if (attacker.items.includes('泰坦护手')) {
        penetrationDamage += defender.defense * 0.15;
    }
    
    // 诅咒效果
    defender.curses.forEach(curse => {
        if (curse.type === 'defense_reduction') {
            penetrationDamage += defender.defense * curse.value;
        }
        if (curse.type === 'attack_reset') {
            // 在攻击者身上没有效果，已处理
        }
    });
    
    // 祝福效果
    attacker.blessings.forEach(blessing => {
        if (blessing.type === 'damage_reduction') {
            // 这是防御效果，在防御者身上
        }
        if (blessing.type === 'berserk') {
            // 已在攻击力中体现
        }
    });
    
    defender.blessings.forEach(blessing => {
        if (blessing.type === 'damage_reduction') {
            // 将在最终伤害中处理
        }
    });
    
    // 计算最终伤害
    let finalDamage = baseDamage * criticalMultiplier;
    
    // 减去防御（考虑穿透）
    const effectiveDefense = Math.max(0, defender.defense - penetrationDamage);
    finalDamage = Math.max(1, finalDamage - effectiveDefense);
    
    // 加上真伤
    finalDamage += trueDamage;
    
    // 应用伤害减免
    defender.blessings.forEach(blessing => {
        if (blessing.type === 'damage_reduction') {
            finalDamage *= (1 - blessing.value);
        }
    });
    
    finalDamage = Math.round(finalDamage);
    
    // 应用伤害
    defender.health = Math.max(0, defender.health - finalDamage);
    
    // 嗜血长弓效果
    const hasBloodthirstyBow = attacker.items.includes('嗜血长弓');
    if (hasBloodthirstyBow) {
        attacker.health = Math.min(attacker.maxHealth, attacker.health + 20);
    }
    
    // 亡灵法师效果
    if (attacker.profession === '亡灵法师职业卡') {
        const lifesteal = finalDamage * 0.15;
        attacker.health = Math.min(attacker.maxHealth, attacker.health + lifesteal);
        addLog(`${attacker.name} 的亡灵法师效果吸收了 ${Math.round(lifesteal)} 点生命值！`, "heal");
    }
    
    // 元素护符效果
    if (attacker.items.includes('元素护符')) {
        const elementalDamage = baseDamage * 0.1;
        defender.health = Math.max(0, defender.health - elementalDamage);
        finalDamage += elementalDamage;
        addLog(`${attacker.name} 的元素护符造成额外 ${Math.round(elementalDamage)} 点元素伤害！`, "attack");
    }
    
    // 添加日志
    let logMessage = `${attacker.name} 攻击 ${defender.name}，造成 ${finalDamage} 点伤害！`;
    if (criticalMultiplier > 1) {
        if (criticalMultiplier === 2) {
            logMessage += "（暗影匕首触发暴击！）";
        } else if (criticalMultiplier === 1.3) {
            logMessage += "（屠龙巨剑触发特效！）";
        }
    }
    addLog(logMessage, "attack");
    
    // 如果嗜血长弓生效
    if (hasBloodthirstyBow) {
        addLog(`${attacker.name} 的嗜血长弓恢复了20点生命值！`, "heal");
    }
    
    // 更新UI
    updatePlayerUI(attacker);
    updatePlayerUI(defender);
    
    // 检查是否有玩家死亡
    checkPlayerDeath();
}

// 检查玩家死亡
function checkPlayerDeath() {
    // 本游戏中玩家不会死亡，只会血量降低
    // 这里只检查血量是否低于0
    game.players.forEach(player => {
        if (player.health <= 0) {
            player.health = 0;
            addLog(`${player.name} 血量归零！`, "system");
        }
    });
}

// 结束游戏
function endGame() {
    game.phase = 'finished';
    elements.gamePhase.textContent = '游戏结束';
    
    // 确定胜利者（血量最高）
    let winner = game.players[0];
    for (let i = 1; i < game.players.length; i++) {
        if (game.players[i].health > winner.health) {
            winner = game.players[i];
        }
    }
    
    // 显示胜利界面
    elements.winnerName.textContent = `${winner.name} 获胜！`;
    elements.winnerName.style.color = winner.isPlayer ? '#4a9eff' : '#ff6b6b';
    elements.winnerSection.style.display = 'flex';
    
    addLog(`游戏结束！${winner.name} 以 ${Math.round(winner.health)} 点生命值获胜！`, "system");
}

// 更新UI
function updateUI() {
    // 更新玩家信息
    game.players.forEach(player => {
        updatePlayerUI(player);
    });
    
    // 更新拍卖品信息
    if (game.currentItemIndex < game.items.length) {
        const currentItem = game.items[game.currentItemIndex];
        elements.currentItemName.textContent = currentItem.name;
    }
    
    elements.gamePhase.textContent = getPhaseName(game.phase);
    elements.itemsLeft.textContent = game.items.length - game.currentItemIndex;
}

// 更新玩家UI
function updatePlayerUI(player) {
    const prefix = `player${player.id}`;
    
    // 更新金币
    document.getElementById(`${prefix}-gold`).textContent = player.gold;
    
    // 更新血量
    document.getElementById(`${prefix}-health`).textContent = Math.round(player.health);
    const healthBar = document.getElementById(`${prefix}-health-bar`);
    const healthPercent = (player.health / player.maxHealth) * 100;
    healthBar.style.width = `${healthPercent}%`;
    
    // 更新血量条颜色
    healthBar.className = 'health-fill';
    if (healthPercent < 30) {
        healthBar.className += ' low';
    } else if (healthPercent < 70) {
        healthBar.className += ' medium';
    } else {
        healthBar.className += ' high';
    }
    
    // 更新属性
    document.getElementById(`${prefix}-attack`).textContent = Math.round(player.attack);
    document.getElementById(`${prefix}-defense`).textContent = Math.round(player.defense);
    document.getElementById(`${prefix}-penetration`).textContent = `${player.penetration}%`;
    
    // 更新职业
    document.getElementById(`${prefix}-class`).textContent = player.profession || '无';
    
    // 更新敌人
    const enemyId = player.enemyId;
    document.getElementById(`${prefix}-enemy`).textContent = `${enemyId}号`;
    
    // 更新物品列表
    const itemsText = player.items.length > 0 ? player.items.slice(-3).join(', ') : '无';
    document.getElementById(`${prefix}-items`).textContent = itemsText;
    
    // 添加效果提示
    if (player.blessings.length > 0 || player.curses.length > 0) {
        let effects = [];
        if (player.blessings.length > 0) effects.push(`祝福:${player.blessings.length}`);
        if (player.curses.length > 0) effects.push(`诅咒:${player.curses.length}`);
        document.getElementById(`${prefix}-items`).textContent += ` [${effects.join('/')}]`;
    }
}

// 添加日志
function addLog(message, type) {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = {
        time: timestamp,
        message: message,
        type: type
    };
    
    game.log.push(logEntry);
    
    // 限制日志数量
    if (game.log.length > 50) {
        game.log.shift();
    }
    
    updateLog();
}

// 更新日志显示
function updateLog() {
    elements.logContainer.innerHTML = '';
    
    game.log.forEach(entry => {
        const logElement = document.createElement('div');
        logElement.className = `log-entry ${entry.type}`;
        logElement.innerHTML = `<span style="color: #777">[${entry.time}]</span> ${entry.message}`;
        elements.logContainer.appendChild(logElement);
    });
    
    // 滚动到底部
    elements.logContainer.scrollTop = elements.logContainer.scrollHeight;
}

// 事件监听
elements.bidButton.addEventListener('click', playerBid);
elements.passButton.addEventListener('click', playerPass);
elements.bidInput.addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        playerBid();
    }
});
elements.restartButton.addEventListener('click', function() {
    elements.winnerSection.style.display = 'none';
    initGame();
});

// 窗口调整大小处理
window.addEventListener('resize', function() {
    // 可以添加响应式调整逻辑
});

// 初始化游戏
initGame();
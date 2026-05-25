// ==================== 游戏数据 ====================
const game = {
    phase: 'profession',
    currentItemIndex: 0,
    currentBid: 0,
    currentBidder: null,
    auctionActive: false,
    items: [],
    players: [
        { id: 1, name: '1号选手', isPlayer: true, gold: 1200, health: 1000, maxHealth: 1000, attack: 50, defense: 10, penetration: 0, profession: null, items: [], enemyId: 2, canBid: true, hasProfession: false, blessings: [], curses: [] },
        { id: 2, name: '2号选手', isPlayer: false, gold: 1200, health: 1000, maxHealth: 1000, attack: 50, defense: 10, penetration: 0, profession: null, items: [], enemyId: 3, canBid: true, hasProfession: false, blessings: [], curses: [] },
        { id: 3, name: '3号选手', isPlayer: false, gold: 1200, health: 1000, maxHealth: 1000, attack: 50, defense: 10, penetration: 0, profession: null, items: [], enemyId: 1, canBid: true, hasProfession: false, blessings: [], curses: [] }
    ],
    itemDB: {
        professions: [
            { id: 'knight', name: '骑士职业卡', type: 'profession', startPrice: 50, description: '从装备中获取的防御额外+100％，且初始增加100点生命值。', effect: (player) => { player.defense += player.defense * 1.0; player.health += 100; player.maxHealth += 100; } },
            { id: 'ranger', name: '游侠职业卡', type: 'profession', startPrice: 50, description: '造成伤害时，总攻击力的20％视为真伤，并且从【嗜血长弓】中可额外获得50点攻击力。', effect: (player) => {} },
            { id: 'holywarrior', name: '圣战职业卡', type: 'profession', startPrice: 50, description: '基础攻击力+50，无视对手50％防御。', effect: (player) => { player.attack += 50; } },
            { id: 'necromancer', name: '亡灵法师职业卡', type: 'profession', startPrice: 55, description: '每次攻击时，造成伤害的15%转化为自身生命值，但自身防御降低20%。', effect: (player) => { player.defense *= 0.8; } },
            { id: 'berserker', name: '狂战士职业卡', type: 'profession', startPrice: 60, description: '攻击力+80，血量每降低10%，攻击力额外增加5%。', effect: (player) => { player.attack += 80; } },
            // 新增5张职业卡
            { id: 'swordsman', name: '剑圣职业卡', type: 'profession', startPrice: 60, description: '攻击+30，每次攻击有20%几率造成双倍伤害。', effect: (player) => { player.attack += 30; player.blessings.push({ type: 'double_damage_chance', value: 0.2 }); } },
            { id: 'shield_guardian', name: '盾卫职业卡', type: 'profession', startPrice: 60, description: '防御+50，受到攻击时减免20%伤害。', effect: (player) => { player.defense += 50; player.blessings.push({ type: 'damage_reduction', value: 0.2 }); } },
            { id: 'assassin', name: '刺客职业卡', type: 'profession', startPrice: 65, description: '攻击+40，无视敌人30%防御。', effect: (player) => { player.attack += 40; player.penetration += 30; } },
            { id: 'mage', name: '法师职业卡', type: 'profession', startPrice: 60, description: '攻击+20，每次攻击造成额外30点魔法伤害（真实伤害）。', effect: (player) => { player.attack += 20; player.blessings.push({ type: 'bonus_true_damage', value: 30 }); } },
            { id: 'priest', name: '牧师职业卡', type: 'profession', startPrice: 55, description: '每回合开始时恢复50点生命值。', effect: (player) => { player.blessings.push({ type: 'regen', value: 50 }); } }
        ],
        weapons: [
            { id: 'phoenix_spear', name: '凤凰长枪', type: 'weapon', startPrice: 60, description: '攻击+200，攻击时额外造成自身防御50％的伤害。', effect: (player) => { player.attack += 200; } },
            { id: 'lowmagic_staff', name: '低语法杖', type: 'weapon', startPrice: 60, description: '攻击+200，如果自身攻击力低于对手防御，则直接计算为造成100点真伤。', effect: (player) => { player.attack += 200; } },
            { id: 'bloodthirsty_bow', name: '嗜血长弓', type: 'weapon', startPrice: 60, description: '攻击+200，每次攻击恢复20点血量。', effect: (player) => { player.attack += 200; } },
            { id: 'dragonslayer', name: '屠龙巨剑', type: 'weapon', startPrice: 70, description: '攻击+250，对血量高于70%的敌人造成额外30%伤害。', effect: (player) => { player.attack += 250; } },
            { id: 'shadow_dagger', name: '暗影匕首', type: 'weapon', startPrice: 65, description: '攻击+180，有30%概率造成双倍伤害。', effect: (player) => { player.attack += 180; } }
        ],
        equipments: [
            { id: 'blessing_ring', name: '祝福戒指', type: 'equipment', startPrice: 40, description: '获得一次金身，下一回合不会被攻击。', effect: (player) => { player.blessings.push('invincible'); } },
            { id: 'dragon_armor', name: '真龙铠甲', type: 'equipment', startPrice: 70, description: '防御+100，当前防御的50％转化为额外基础攻击力。', effect: (player) => { player.defense += 100; player.attack += player.defense * 0.5; } },
            { id: 'hunter_coat', name: '猎手风衣', type: 'equipment', startPrice: 40, description: '防御+10，总攻击力的20％视为真伤。', effect: (player) => { player.defense += 10; } },
            { id: 'titan_gauntlet', name: '泰坦护手', type: 'equipment', startPrice: 45, description: '防御+30，攻击+30，无视敌人15%防御。', effect: (player) => { player.defense += 30; player.attack += 30; } },
            { id: 'phantom_cloak', name: '幻影斗篷', type: 'equipment', startPrice: 50, description: '防御+20，受到攻击时有25%概率完全闪避。', effect: (player) => { player.defense += 20; } },
            { id: 'elemental_amulet', name: '元素护符', type: 'equipment', startPrice: 55, description: '所有属性+5%，攻击附加元素伤害。', effect: (player) => { player.attack *= 1.05; player.defense *= 1.05; } }
        ],
        items: [
            { id: 'health_potion', name: '血药水', type: 'item', startPrice: 30, description: '恢复300点血量。', effect: (player) => { player.health = Math.min(player.health + 300, player.maxHealth); addLog(`${player.name} 使用了血药水，恢复了300点生命值！`, 'heal'); } },
            { id: 'curse_stone', name: '诅咒石', type: 'item', startPrice: 40, description: '指定任意一名选手，降低其50％防御，持续2回合。', effect: (player) => { const enemies = game.players.filter(p => p.id !== player.id); if (enemies.length > 0) { const target = enemies[Math.floor(Math.random() * enemies.length)]; target.curses.push({ type: 'defense_reduction', value: 0.5, duration: 2 }); addLog(`${player.name} 对 ${target.name} 使用了诅咒石，降低其50%防御！`, 'system'); } } },
            { id: 'saint_robe', name: '圣者战袍', type: 'item', startPrice: 50, description: '防御+50，基础攻击力部分视为真伤。', effect: (player) => { player.defense += 50; } },
            { id: 'evil_stone', name: '邪神石', type: 'item', startPrice: 45, description: '清空一名选手基础攻击力1回合。', effect: (player) => { const enemies = game.players.filter(p => p.id !== player.id); if (enemies.length > 0) { const target = enemies[Math.floor(Math.random() * enemies.length)]; target.curses.push({ type: 'attack_reset', duration: 1 }); addLog(`${player.name} 对 ${target.name} 使用了邪神石，清空其基础攻击力！`, 'system'); } } },
            // [修改] 化金成血：最多消耗500金币，回复等量生命值（1:1）
            { id: 'gold_to_blood', name: '化金成血', type: 'item', startPrice: 10, description: '最多消耗500金币，每1金币转化为1点生命值。', effect: (player, bidAmount) => { 
                const amount = Math.min(player.gold, 500); 
                if (amount <= 0) { addLog(`${player.name} 没有金币，无法使用化金成血。`, 'system'); return; }
                player.gold -= amount; 
                player.health += amount; 
                addLog(`${player.name} 使用化金成血，消耗 ${amount} 金币，恢复了 ${amount} 点生命值！`, 'heal'); 
            } },
            { id: 'mana_crystal', name: '魔力水晶', type: 'item', startPrice: 35, description: '立即获得100金币，下一件拍卖品价格降低20%。', effect: (player) => { player.gold += 100; player.blessings.push('discount_next'); addLog(`${player.name} 使用魔力水晶，获得100金币！`, 'system'); } },
            { id: 'time_sandglass', name: '时光沙漏', type: 'item', startPrice: 60, description: '立即获得额外一次攻击机会。', effect: (player) => { setTimeout(() => { performAttack(player); addLog(`${player.name} 使用时光沙漏，获得额外攻击！`, 'system'); }, 1000); } },
            { id: 'berserk_potion', name: '狂暴药剂', type: 'item', startPrice: 40, description: '攻击力+100，防御力-20，持续3回合。', effect: (player) => { player.attack += 100; player.defense -= 20; player.blessings.push({ type: 'berserk', duration: 3, originalAttack: 100, originalDefense: 20 }); addLog(`${player.name} 使用狂暴药剂，攻击力+100，防御力-20！`, 'system'); } },
            { id: 'guardian_totem', name: '守护图腾', type: 'item', startPrice: 55, description: '防御+80，受到的所有伤害降低20%，持续2回合。', effect: (player) => { player.defense += 80; player.blessings.push({ type: 'damage_reduction', value: 0.2, duration: 2 }); } },
            { id: 'golden_apple', name: '金苹果', type: 'item', startPrice: 25, description: '立即恢复500点生命值，生命上限+50。', effect: (player) => { player.health = Math.min(player.health + 500, player.maxHealth); player.maxHealth += 50; addLog(`${player.name} 食用金苹果，恢复500点生命值，生命上限+50！`, 'heal'); } },
            // 新增10张道具卡
            { id: 'strength_potion', name: '力量药剂', type: 'item', startPrice: 40, description: '攻击+50，持续3回合。', effect: (player) => { player.attack += 50; player.blessings.push({ type: 'attack_boost', value: 50, duration: 3 }); addLog(`${player.name} 使用力量药剂，攻击力+50！`, 'system'); } },
            { id: 'defense_scroll', name: '防御卷轴', type: 'item', startPrice: 40, description: '防御+40，持续3回合。', effect: (player) => { player.defense += 40; player.blessings.push({ type: 'defense_boost', value: 40, duration: 3 }); addLog(`${player.name} 使用防御卷轴，防御力+40！`, 'system'); } },
            { id: 'speed_potion', name: '速度药水', type: 'item', startPrice: 50, description: '立即获得额外一次攻击机会。', effect: (player) => { setTimeout(() => { performAttack(player); addLog(`${player.name} 使用速度药水，获得额外攻击！`, 'system'); }, 1000); } },
            { id: 'gold_pouch', name: '金币袋', type: 'item', startPrice: 30, description: '立即获得150金币。', effect: (player) => { player.gold += 150; addLog(`${player.name} 使用金币袋，获得150金币！`, 'system'); } },
            { id: 'life_spring', name: '生命之泉', type: 'item', startPrice: 35, description: '恢复300点生命值。', effect: (player) => { player.health = Math.min(player.health + 300, player.maxHealth); addLog(`${player.name} 使用生命之泉，恢复300点生命值！`, 'heal'); } },
            { id: 'armor_piercing_arrow', name: '破甲箭', type: 'item', startPrice: 45, description: '降低目标敌人30%防御，持续2回合。', effect: (player) => { const enemies = game.players.filter(p => p.id !== player.id); if (enemies.length > 0) { const target = enemies[Math.floor(Math.random() * enemies.length)]; target.curses.push({ type: 'defense_reduction', value: 0.3, duration: 2 }); addLog(`${player.name} 对 ${target.name} 使用破甲箭，降低其30%防御！`, 'system'); } } },
            { id: 'guardian_amulet', name: '守护符', type: 'item', startPrice: 50, description: '获得一次伤害免疫。', effect: (player) => { player.blessings.push({ type: 'damage_immunity', duration: 1 }); addLog(`${player.name} 使用守护符，获得一次伤害免疫！`, 'system'); } },
            { id: 'lucky_coin', name: '幸运币', type: 'item', startPrice: 40, description: '下次拍卖出价降低20%。', effect: (player) => { player.blessings.push({ type: 'discount_next', value: 0.2 }); addLog(`${player.name} 使用幸运币，下次拍卖出价降低20%！`, 'system'); } },
            { id: 'cursed_doll', name: '诅咒娃娃', type: 'item', startPrice: 45, description: '使目标敌人攻击力降低20%，持续2回合。', effect: (player) => { const enemies = game.players.filter(p => p.id !== player.id); if (enemies.length > 0) { const target = enemies[Math.floor(Math.random() * enemies.length)]; target.curses.push({ type: 'attack_reduction', value: 0.2, duration: 2 }); addLog(`${player.name} 对 ${target.name} 使用诅咒娃娃，降低其20%攻击力！`, 'system'); } } },
            { id: 'revival_cross', name: '重生十字章', type: 'item', startPrice: 60, description: '如果生命值低于0，则恢复至50%生命值（一次）。', effect: (player) => { player.blessings.push({ type: 'revive', threshold: 0, reviveHealth: 0.5 }); addLog(`${player.name} 使用重生十字章，获得一次重生机会！`, 'system'); } }
        ]
    },
    log: []
};

// ========== DOM 元素绑定 (与原相同) ==========
const elements = {
    currentItemName: document.getElementById('current-item-name'),
    gamePhase: document.getElementById('game-phase'),
    itemsLeft: document.getElementById('items-left'),
    itemName: document.getElementById('item-name'),
    itemType: document.getElementById('item-type'),
    itemDesc: document.getElementById('item-desc'),
    startPrice: document.getElementById('start-price'),
    minBid: document.getElementById('min-bid'),
    currentBidAmount: document.getElementById('current-bid-amount'),
    currentBidder: document.getElementById('current-bidder'),
    bidInput: document.getElementById('bid-input'),
    bidButton: document.getElementById('bid-button'),
    passButton: document.getElementById('pass-button'),
    logContainer: document.getElementById('log-container'),
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
    winnerSection: document.getElementById('winner-section'),
    winnerName: document.getElementById('winner-name'),
    restartButton: document.getElementById('restart-button')
};

// ========== 工具函数 ==========
function shuffleArray(arr) { for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; } return arr; }
function getTypeName(type) { switch(type) { case 'profession': return '职业卡'; case 'weapon': return '武器卡'; case 'equipment': return '装备卡'; case 'item': return '道具卡'; default: return '未知'; } }
function getTypeClass(type) { switch(type) { case 'profession': return 'type-profession'; case 'weapon': return 'type-weapon'; case 'equipment': return 'type-equipment'; case 'item': return 'type-item'; default: return ''; } }
function getPhaseName(phase) { switch(phase) { case 'profession': return '职业选择阶段'; case 'auction': return '拍卖阶段'; case 'finished': return '游戏结束'; default: return '未知'; } }

// ========== 物品估值函数 (AI策略核心) - [优化] 动态估值 ==========
function getItemValue(item, player) {
    if (!player) return item.startPrice * 1.2;
    let baseValue = item.startPrice * 1.5; // 基础估值

    // 职业卡
    if (item.type === 'profession') {
        if (player.hasProfession) return 0;
        // 根据职业特性调整估值
        if (item.id === 'knight') return 150; // 骑士泛用性高
        if (item.id === 'berserker') return 160; // 狂战士输出高
        if (item.id === 'swordsman') return 140;
        if (item.id === 'shield_guardian') return 130;
        if (item.id === 'assassin') return 150;
        if (item.id === 'mage') return 140;
        if (item.id === 'priest') return 120;
        return 130;
    }

    // 武器卡 - 根据玩家当前攻击力调整
    if (item.type === 'weapon') {
        let value = 160;
        if (item.id === 'dragonslayer') value = 220;
        else if (item.id === 'shadow_dagger') value = 200;
        else if (item.id === 'phoenix_spear' || item.id === 'lowmagic_staff' || item.id === 'bloodthirsty_bow') value = 180;
        // 如果玩家攻击力偏低，武器价值更高
        if (player.attack < 80) value *= 1.2;
        return value;
    }

    // 装备卡
    if (item.type === 'equipment') {
        let value = 120;
        if (item.id === 'dragon_armor') value = 250;
        else if (item.id === 'elemental_amulet') value = 180;
        else if (item.id === 'titan_gauntlet') value = 150;
        else if (item.id === 'phantom_cloak') value = 140;
        else if (item.id === 'blessing_ring') value = 100;
        else if (item.id === 'hunter_coat') value = 60;

        // 与职业协同：骑士对防御装备更看重
        if (player.profession && player.profession.includes('骑士')) {
            if (item.id === 'dragon_armor' || item.id === 'titan_gauntlet') value *= 1.3;
        }
        // 如果玩家防御低，防御装备价值更高
        if (player.defense < 50 && (item.id.includes('armor') || item.id.includes('defense'))) value *= 1.2;
        return value;
    }

    // 道具卡 - 动态估值
    if (item.type === 'item') {
        if (item.id === 'health_potion') {
            const missing = player.maxHealth - player.health;
            return 50 + missing * 0.8;
        }
        if (item.id === 'golden_apple') return 120 + (player.maxHealth - player.health) * 0.5;
        if (item.id === 'time_sandglass') return 200; // 额外攻击机会价值高
        if (item.id === 'mana_crystal') return 150;
        if (item.id === 'berserk_potion') return 150;
        if (item.id === 'guardian_totem') return 140;
        if (item.id === 'curse_stone') return 80;
        if (item.id === 'evil_stone') return 130;
        if (item.id === 'saint_robe') return 120;
        if (item.id === 'gold_to_blood') {
            // 根据剩余金币估值，最多500
            return Math.min(player.gold, 500) * 0.9; // 略低于实际收益，避免过度出价
        }
        // 新增道具估值
        if (item.id === 'strength_potion') return 120;
        if (item.id === 'defense_scroll') return 110;
        if (item.id === 'speed_potion') return 180;
        if (item.id === 'gold_pouch') return 150;
        if (item.id === 'life_spring') return 100;
        if (item.id === 'armor_piercing_arrow') return 90;
        if (item.id === 'guardian_amulet') return 130;
        if (item.id === 'lucky_coin') return 140;
        if (item.id === 'cursed_doll') return 100;
        if (item.id === 'revival_cross') return 200;
        return 100;
    }
    return baseValue;
}

// ========== 初始化、拍卖逻辑 ==========
function generateAuctionItems() {
    game.items = [];
    // 职业卡：从10张中随机取3张作为前3件
    let professions = [...game.itemDB.professions];
    shuffleArray(professions);
    for (let i = 0; i < 3; i++) {
        game.items.push({ ...professions[i] });
    }
    // 其他卡：武器、装备、道具全部混合随机
    let others = [];
    let weapons = [...game.itemDB.weapons];
    shuffleArray(weapons);
    others.push(...weapons);
    let equipments = [...game.itemDB.equipments];
    shuffleArray(equipments);
    others.push(...equipments);
    let items = [...game.itemDB.items];
    shuffleArray(items);
    others.push(...items);
    shuffleArray(others);
    game.items.push(...others);
}

function addLog(msg, type) {
    let time = new Date().toLocaleTimeString();
    game.log.push({time, message: msg, type});
    if (game.log.length > 50) game.log.shift();
    updateLog();
}
function updateLog() {
    elements.logContainer.innerHTML = '';
    game.log.forEach(e => {
        let d = document.createElement('div');
        d.className = `log-entry ${e.type}`;
        d.innerHTML = `<span style="color:#777">[${e.time}]</span> ${e.message}`;
        elements.logContainer.appendChild(d);
    });
    elements.logContainer.scrollTop = elements.logContainer.scrollHeight;
}

function updatePlayerUI(player) {
    let pre = `player${player.id}`;
    document.getElementById(`${pre}-gold`).textContent = player.gold;
    document.getElementById(`${pre}-health`).textContent = Math.round(player.health);
    let bar = document.getElementById(`${pre}-health-bar`);
    if (bar) {
        let percent = (player.health/player.maxHealth)*100;
        bar.style.width = percent+'%';
        bar.className = 'health-fill ' + (percent<30?'low':percent<70?'medium':'high');
    }
    document.getElementById(`${pre}-attack`).textContent = Math.round(player.attack);
    document.getElementById(`${pre}-defense`).textContent = Math.round(player.defense);
    document.getElementById(`${pre}-penetration`).textContent = player.penetration+'%';
    document.getElementById(`${pre}-class`).textContent = player.profession||'无';
    let enemyId = player.enemyId;
    document.getElementById(`${pre}-enemy`).textContent = enemyId+'号';
    let itemsText = player.items.length>0 ? player.items.slice(-3).join(', ') : '无';
    if (player.blessings.length||player.curses.length) itemsText += ` [祝福:${player.blessings.length} 诅咒:${player.curses.length}]`;
    document.getElementById(`${pre}-items`).textContent = itemsText;
}

function updateUI() {
    game.players.forEach(p => updatePlayerUI(p));
    if (game.currentItemIndex < game.items.length) elements.currentItemName.textContent = game.items[game.currentItemIndex].name;
    elements.gamePhase.textContent = getPhaseName(game.phase);
    elements.itemsLeft.textContent = game.items.length - game.currentItemIndex;
}

function startAuction() {
    if (game.currentItemIndex >= game.items.length) { endGame(); return; }
    let item = game.items[game.currentItemIndex];
    game.auctionActive = true;
    game.currentBid = item.startPrice;
    game.currentBidder = null;
    elements.itemName.textContent = item.name;
    elements.itemType.textContent = getTypeName(item.type);
    elements.itemType.className = 'item-type ' + getTypeClass(item.type);
    elements.itemDesc.textContent = item.description;
    elements.startPrice.textContent = item.startPrice;
    let minBid = Math.max(5, Math.floor(item.startPrice * 0.1));
    elements.minBid.textContent = minBid;
    elements.currentItemName.textContent = item.name;
    elements.gamePhase.textContent = getPhaseName(game.phase);
    elements.itemsLeft.textContent = game.items.length - game.currentItemIndex;
    elements.bidInput.value = Math.max(item.startPrice, game.currentBid + minBid);
    elements.bidInput.min = game.currentBid + minBid;
    elements.bidInput.max = 500;
    updateBidDisplay();
    let player = game.players[0];
    if (game.phase === 'profession' && player.hasProfession) { elements.bidButton.disabled = true; elements.passButton.disabled = true; addLog("你已经拥有职业卡，不能竞拍其他职业卡。","system"); }
    else if (player.gold < game.currentBid + minBid) { elements.bidButton.disabled = true; elements.passButton.disabled = true; addLog("你的金币不足，无法出价。","system"); }
    else { elements.bidButton.disabled = false; elements.passButton.disabled = false; }
    addLog(`第${game.currentItemIndex+1}件：${item.name}，起拍价${item.startPrice}金币。`,"system");
    // 职业阶段最后一件（索引2）自动分配给未获得职业的玩家
    if (game.phase === 'profession' && game.currentItemIndex === 2) {
        let without = game.players.filter(p => !p.hasProfession);
        if (without.length > 0) { setTimeout(() => autoAssignProfession(without[0], item), 1000); return; }
    }
    setTimeout(computerBid, 500);
}

function autoAssignProfession(player, item) {
    if (player.gold < item.startPrice) return;
    game.auctionActive = false;
    player.gold -= item.startPrice;
    player.profession = item.name;
    player.hasProfession = true;
    player.items.push(item.name);
    if (item.effect) item.effect(player);
    addLog(`${player.name} 自动获得 ${item.name}（花费${item.startPrice}金币）！`, "system");
    updateUI();
    game.phase = 'auction';
    game.currentItemIndex++;
    if (game.currentItemIndex < game.items.length) setTimeout(startAuction, 1500);
}

function updateBidDisplay() {
    elements.currentBidAmount.textContent = game.currentBid;
    elements.currentBidder.textContent = game.currentBidder ? game.currentBidder.name : '无';
    let minBid = parseInt(elements.minBid.textContent);
    elements.bidInput.min = game.currentBid + minBid;
    elements.bidInput.value = Math.max(game.currentBid + minBid, elements.bidInput.min);
}

function playerBid() {
    if (!game.auctionActive) return;
    let player = game.players[0];
    let bid = parseInt(elements.bidInput.value);
    let minBid = parseInt(elements.minBid.textContent);
    if (bid < game.currentBid + minBid) { addLog(`出价必须至少比当前高${minBid}金币。`,"system"); return; }
    if (bid > player.gold) { addLog("金币不足。","system"); return; }
    if (game.phase === 'profession' && player.hasProfession) { addLog("已有职业卡，不能竞拍。","system"); return; }
    game.currentBid = bid;
    game.currentBidder = player;
    updateBidDisplay();
    addLog(`${player.name} 出价 ${bid} 金币！`,"player");
    setTimeout(checkComputerBids, 800);
}

function playerPass() {
    if (!game.auctionActive) return;
    game.players[0].canBid = false;
    elements.bidButton.disabled = true; elements.passButton.disabled = true;
    addLog(`${game.players[0].name} 放弃竞拍。`,"player");
    setTimeout(checkAuctionEnd, 500);
}

// ========== [优化] 电脑出价逻辑 ==========
function computerBid() {
    if (!game.auctionActive) return;
    let minBid = parseInt(elements.minBid.textContent);
    let candidates = game.players.filter(p => !p.isPlayer && p.canBid && p.id !== (game.currentBidder?.id) && p.gold >= game.currentBid + minBid);
    if (candidates.length === 0) {
        setTimeout(checkAuctionEnd, 600);
        return;
    }
    // 按金币排序，让更富有的电脑优先考虑（可提高竞争性）
    candidates.sort((a, b) => b.gold - a.gold);
    let computer = candidates[0]; // 选最有钱的电脑先考虑，但也可随机
    // 但为了增加随机性，仍从候选池中随机选一个，但给富人更高权重？这里简单随机
    computer = candidates[Math.floor(Math.random() * candidates.length)];

    let currentItem = game.items[game.currentItemIndex];

    if (game.phase === 'profession' && computer.hasProfession) {
        computer.canBid = false;
        addLog(`${computer.name} 已有职业，放弃竞拍。`, "computer");
        setTimeout(computerBid, 500);
        return;
    }

    let value = getItemValue(currentItem, computer);
    if (value <= 0) {
        computer.canBid = false;
        addLog(`${computer.name} 认为物品无价值，放弃。`, "computer");
        setTimeout(computerBid, 500);
        return;
    }

    // 考虑当前出价人数（竞争激烈程度）调整估值上限
    let activeBidders = game.players.filter(p => p.canBid && p.gold >= game.currentBid + minBid).length;
    let competitionFactor = 1.0;
    if (activeBidders > 2) competitionFactor = 0.9;  // 人多时更谨慎
    else if (activeBidders === 1) competitionFactor = 1.1; // 独家竞争可稍激进

    let maxBid = Math.min(computer.gold, Math.floor(value * 1.2 * competitionFactor));
    if (maxBid < game.currentBid + minBid) {
        computer.canBid = false;
        addLog(`${computer.name} 资金或估值不足，放弃。`, "computer");
        setTimeout(computerBid, 500);
        return;
    }

    // 动态概率：估值差、金币比例、竞争程度
    let diff = value - game.currentBid;
    let probability = 0.3;
    if (diff > 30) probability = 0.8;
    else if (diff > 10) probability = 0.6;
    else if (diff > 0) probability = 0.4;
    else probability = 0.1;

    // 金币充裕度影响
    let goldRatio = computer.gold / 500;
    if (goldRatio > 0.7) probability *= 1.2;
    else if (goldRatio < 0.3) probability *= 0.7;

    // 竞争激烈程度影响概率
    if (activeBidders > 2) probability *= 0.8;  // 人多时降低出价意愿
    else if (activeBidders === 1) probability *= 1.2; // 只剩一人时更积极

    // 如果当前出价者是玩家，电脑可以更积极（或更消极？这里设为稍微积极）
    if (game.currentBidder && game.currentBidder.isPlayer) {
        probability *= 1.1;
    }

    if (Math.random() > probability) {
        computer.canBid = false;
        addLog(`${computer.name} 权衡后放弃竞拍。`, "computer");
        setTimeout(computerBid, 500);
        return;
    }

    // 出价金额：在最低加价和maxBid之间随机，但更倾向于中等偏上
    let newBid = game.currentBid + minBid + Math.floor(Math.random() * (maxBid - game.currentBid - minBid + 1) * 0.7);
    newBid = Math.min(newBid, maxBid);
    newBid = Math.max(newBid, game.currentBid + minBid);

    game.currentBid = newBid;
    game.currentBidder = computer;
    updateBidDisplay();
    addLog(`${computer.name} 出价 ${newBid} 金币！`, "computer");
    setTimeout(checkComputerBids, 800);
}

function checkComputerBids() {
    if (!game.auctionActive) return;
    let minBid = parseInt(elements.minBid.textContent);
    let otherPlayers = game.players.filter(p => p !== game.currentBidder && p.canBid && p.gold >= game.currentBid + minBid);
    let player = game.players[0];
    if (otherPlayers.length > 0) {
        if (player.canBid && player !== game.currentBidder && player.gold >= game.currentBid + minBid) {
            elements.bidButton.disabled = false; elements.passButton.disabled = false;
            return;
        } else {
            setTimeout(computerBid, 700);
        }
    } else {
        setTimeout(checkAuctionEnd, 500);
    }
}

function checkAuctionEnd() {
    if (!game.auctionActive) return;
    let minBid = parseInt(elements.minBid.textContent);
    let canBidPlayers = game.players.filter(p => p.canBid && p.gold >= game.currentBid + minBid);
    if (canBidPlayers.length === 0 || (canBidPlayers.length === 1 && canBidPlayers[0] === game.currentBidder)) {
        endAuction();
    } else {
        setTimeout(computerBid, 500);
    }
}

function endAuction() {
    if (!game.auctionActive) return;
    game.auctionActive = false;
    let item = game.items[game.currentItemIndex];
    if (game.currentBidder) {
        let winner = game.currentBidder;
        winner.gold -= game.currentBid;
        if (item.effect) item.effect(winner, game.currentBid);
        winner.items.push(item.name);
        if (item.type === 'profession') { winner.profession = item.name; winner.hasProfession = true; }
        addLog(`${winner.name} 以 ${game.currentBid} 金币拍得 ${item.name}！`, "system");
        if (game.phase === 'auction') performAttack(winner);
    } else {
        addLog(`${item.name} 流拍！`, "system");
    }
    if (game.phase === 'profession' && game.currentItemIndex === 2) {
        game.phase = 'auction';
        addLog("职业选择阶段结束，进入正式拍卖阶段！", "system");
    }
    game.players.forEach(p => p.canBid = true);
    // 更新效果持续时间 (略)
    updateUI();
    game.currentItemIndex++;
    if (game.currentItemIndex < game.items.length) setTimeout(() => { startAuction(); elements.bidButton.disabled = false; elements.passButton.disabled = false; }, 1500);
    else endGame();
}

function performAttack(attacker) {
    // 获取目标（攻击者的 enemyId 指定）
    let target = game.players.find(p => p.id === attacker.enemyId);
    if (!target) {
        addLog(`攻击者 ${attacker.name} 没有目标！`, 'system');
        return;
    }

    // 基础攻击力
    let baseAttack = attacker.attack;
    // 目标基础防御
    let targetDefense = target.defense;
    
    // 伤害倍率（默认1）
    let damageMultiplier = 1.0;
    // 额外真实伤害
    let bonusTrueDamage = 0;
    // 是否免疫伤害（目标）
    let isImmune = false;
    // 目标减伤比例
    let targetDamageReduction = 0;

    // ----- 处理攻击者的祝福（增益）-----
    attacker.blessings.forEach(b => {
        if (b.type === 'double_damage_chance' && Math.random() < b.value) {
            damageMultiplier *= 2;
            addLog(`${attacker.name} 触发双倍伤害！`, 'system');
        }
        if (b.type === 'bonus_true_damage') {
            bonusTrueDamage += b.value;
        }
        // 其他攻击相关祝福可在此扩展
    });

    // ----- 处理攻击者的诅咒（减益）-----
    attacker.curses.forEach(c => {
        if (c.type === 'attack_reduction') {
            baseAttack *= (1 - c.value);
        }
        // 其他诅咒效果...
    });

    // ----- 处理目标的祝福（防御性）-----
    target.blessings.forEach(b => {
        if (b.type === 'damage_reduction') {
            targetDamageReduction += b.value;
        }
        if (b.type === 'damage_immunity') {
            isImmune = true;
            addLog(`${target.name} 免疫了这次攻击！`, 'system');
        }
    });

    // 如果目标免疫伤害，直接结束
    if (isImmune) {
        // 消耗免疫效果（如果需要）
        target.blessings = target.blessings.filter(b => b.type !== 'damage_immunity');
        updatePlayerUI(attacker);
        updatePlayerUI(target);
        return;
    }

    // ----- 处理目标的诅咒（防御降低等）-----
    let effectiveDefense = targetDefense;
    target.curses.forEach(c => {
        if (c.type === 'defense_reduction') {
            effectiveDefense *= (1 - c.value);
        }
    });

    // 计算穿透后的防御（穿透百分比）
    let penetration = attacker.penetration / 100; // 转换为小数
    effectiveDefense = effectiveDefense * (1 - penetration);

    // 基础伤害公式：攻击 - 防御，最低保底5点
    let damage = baseAttack - effectiveDefense;
    if (damage < 5) damage = 5;

    // 应用伤害倍率
    damage *= damageMultiplier;

    // 加上额外真实伤害
    damage += bonusTrueDamage;

    // 应用目标减伤
    damage *= (1 - targetDamageReduction);

    // 确保伤害为整数且不小于0
    damage = Math.max(0, Math.floor(damage));

    // 扣除目标生命值
    target.health -= damage;
    if (target.health < 0) target.health = 0;

    // 记录攻击日志
    addLog(`${attacker.name} 攻击 ${target.name}，造成 ${damage} 点伤害！`, 'system');

    // 处理攻击者的吸血效果（例如嗜血长弓，需要先确认物品效果中已添加相应祝福）
    // 假设存在 'lifesteal' 类型祝福，值为每次攻击恢复的血量
    attacker.blessings.forEach(b => {
        if (b.type === 'lifesteal') {
            let heal = Math.min(b.value, attacker.maxHealth - attacker.health);
            attacker.health += heal;
            addLog(`${attacker.name} 通过吸血恢复了 ${heal} 点生命值。`, 'heal');
        }
    });

    // 更新双方UI
    updatePlayerUI(attacker);
    updatePlayerUI(target);

    // 检查目标是否死亡（可选，目前不结束游戏，仅记录）
    if (target.health <= 0) {
        addLog(`${target.name} 生命值归零！`, 'system');
    }

    // 可选：减少祝福/诅咒的持续时间（需要统一在回合结束时处理，此处略）
}

function endGame() {
    game.phase = 'finished';
    elements.gamePhase.textContent = '游戏结束';
    let winner = game.players.reduce((a,b) => a.health > b.health ? a : b);
    elements.winnerName.textContent = `${winner.name} 获胜！`;
    elements.winnerName.style.color = winner.isPlayer ? '#4a9eff' : '#ff6b6b';
    elements.winnerSection.style.display = 'flex';
    addLog(`游戏结束！${winner.name} 以 ${Math.round(winner.health)} 点生命值获胜！`, "system");
}

function initGame() {
    generateAuctionItems();
    game.players.forEach(p => { 
        p.gold = 1200;               // 初始金币1200
        p.health = 1000; 
        p.maxHealth = 1000; 
        p.attack = 50; 
        p.defense = 10; 
        p.penetration = 0; 
        p.profession = null; 
        p.items = []; 
        p.canBid = true; 
        p.hasProfession = false; 
        p.blessings = []; 
        p.curses = []; 
    });
    game.phase = 'profession'; 
    game.currentItemIndex = 0; 
    game.currentBid = 0; 
    game.currentBidder = null; 
    game.auctionActive = false; 
    game.log = [];
    updateUI(); 
    updateLog();
    addLog("游戏开始！每人1200金币，前3件是职业卡，每人只能获得一张。","system");
    startAuction();
}

elements.bidButton.addEventListener('click', playerBid);
elements.passButton.addEventListener('click', playerPass);
elements.bidInput.addEventListener('keyup', e => e.key === 'Enter' && playerBid());
elements.restartButton.addEventListener('click', ()=>{ elements.winnerSection.style.display='none'; initGame(); });

initGame();
(function() {
    // ---------- 16个游戏文件 (保持原始文件名) ----------
    const GAME_FILES = [
        "Resources/game/2048.html",
        "Resources/game/abyss-devourer.html",
        "Resources/game/Adventure-Island.html",
        "Resources/game/Auction-chaos.html",
        "Resources/game/chess.html",
        "Resources/game/chinese-chess.html",
        "Resources/game/contra.html",
        "Resources/game/cyber-assassin.html",
        "Resources/game/Dream-TowerDefence.html",
        "Resources/game/Endless-Warplane.html",
        "Resources/game/Hunter-shooting.html",
        "Resources/game/Kill-BOX.html",
        "Resources/game/piano-tiles.html",
        "Resources/game/Poker-blackjack.html",
        "Resources/game/star-strike-forse.html",
        "Resources/game/Zombie-TowerDefence.html"
    ];

    // 装饰卡片数量 (增加4个梦幻装饰格子)
    const DECOR_COUNT = 4;
    const TOTAL_CARDS = GAME_FILES.length + DECOR_COUNT; // 20

    // 中文名称映射表 (键为基本文件名)
    const CHINESE_NAMES = {
        "2048.html": "2048",
        "abyss-devourer.html": "深渊吞噬者",
        "Adventure-Island.html": "冒险岛",
        "Auction-chaos.html": "拍卖大混乱",
        "chess.html": "国际象棋",
        "chinese-chess.html": "中国象棋",
        "contra.html": "魂斗罗",
        "cyber-assassin.html": "赛博刺客",
        "Dream-TowerDefence.html": "梦幻塔防",
        "Endless-Warplane.html": "无尽战机",
        "Hunter-shooting.html": "猎手射击",
        "Kill-BOX.html": "杀戮盒子",
        "piano-tiles.html": "钢琴块",
        "Poker-blackjack.html": "扑克21点",
        "star-strike-forse.html": "星际打击部队",
        "Zombie-TowerDefence.html": "僵尸塔防"
    };

    // 格式化游戏名: 返回中文名称 (优先使用映射表)
    function formatGameName(filename) {
        if (!filename) return "装饰卡片"; // 如果文件名为空，可能是装饰卡片

        // 提取基本文件名 (去掉路径)
        const baseName = filename.split('/').pop();

        // 查找中文映射，若存在则返回
        if (CHINESE_NAMES.hasOwnProperty(baseName)) {
            return CHINESE_NAMES[baseName];
        }

        // 如果找不到映射，回退到旧的格式化逻辑 (但理论上不会发生)
        let name = baseName.replace(/\.html$/i, '');          // 去掉.html
        name = name.replace(/-/g, ' ');                       // 连字符变空格
        name = name.replace(/\b\w/g, (char) => char.toUpperCase()); // 单词首字母大写
        return name;
    }

    // 图标风格: 前16个统一用可爱的游戏手柄 (也可根据个性微调，这里统一次元风)
    // 装饰卡片使用星星/魔法/糖果等图标
    const DECOR_ICONS = ['fa-star', 'fa-candy-cane', 'fa-wand-sparkles', 'fa-heart'];
    const DECOR_TEXTS = ['✨ 神秘', '🌸 预约', '🎀 coming', '💫 未来'];

    // 获取网格容器
    const grid = document.getElementById('gamesGrid');
    if (!grid) return;

    // 清空 (保证每次重新渲染)
    grid.innerHTML = '';

    // 循环生成20个卡片 (i从0到19)
    for (let i = 0; i < TOTAL_CARDS; i++) {
        if (i < GAME_FILES.length) {
            // ---------- 可点击卡片 (前16个) ----------
            const gameFile = GAME_FILES[i];
            const displayName = formatGameName(gameFile);
            
            // 创建可点击的<a>标签
            const linkCard = document.createElement('a');
            linkCard.href = `./${gameFile}`;        // 相对路径跳转
            linkCard.className = 'card';             // 基础卡片样式
            // 加入内嵌内容：图标 + 游戏名
            // 图标统一用 fa-gamepad, 但为了稍多变化，可加点随机? 保留优雅简洁全部手柄 (也可根据文件名第一个字母使用不同，但二次元简约)
            linkCard.innerHTML = `
                <i class="fas fa-gamepad"></i>
                <span>${displayName}</span>
            `;
            // 可选：增加微小aria标签
            linkCard.setAttribute('aria-label', `启动游戏：${displayName}`);
            grid.appendChild(linkCard);
        } else {
            // ---------- 装饰卡片 (后4个) ----------
            const decorIndex = i - GAME_FILES.length; // 0 ~ 3
            const decorDiv = document.createElement('div');
            decorDiv.className = 'card decorative';    // 额外decorative类
            // 循环使用装饰图标和文字 (如果不够就循环)
            const icon = DECOR_ICONS[decorIndex % DECOR_ICONS.length];
            const text = DECOR_TEXTS[decorIndex % DECOR_TEXTS.length];
            decorDiv.innerHTML = `
                <i class="fas ${icon}"></i>
                <span>${text}</span>
            `;
            grid.appendChild(decorDiv);
        }
    }

    // 二次元彩蛋：轻轻晃动装饰卡片（可选纯视觉，不加事件）
    // 确保所有卡片不可点击的装饰无href，不会有跳转
    // 另外针对移动端，所有卡片保留样式，点击a正常跳转，装饰无点击。
})();
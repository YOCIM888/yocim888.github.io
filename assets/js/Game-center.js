// script.js
// 保留用户提供的原始数据，并增加一行轻提示，完全不影响卡片静态渲染。
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

    // 中文名称映射表 (键为基本文件名)
    const CHINESE_NAMES = {
        "2048.html": "2048",
        "abyss-devourer.html": "深渊吞噬者",
        "Adventure-Island.html": "冒险岛",
        "Auction-chaos.html": "拍卖大乱斗",
        "chess.html": "国际象棋",
        "chinese-chess.html": "中国象棋",
        "contra.html": "魂斗罗",
        "cyber-assassin.html": "赛博刺客",
        "Dream-TowerDefence.html": "梦幻塔防",
        "Endless-Warplane.html": "无尽战机",
        "Hunter-shooting.html": "猎手射击",
        "Kill-BOX.html": "消灭方块",
        "piano-tiles.html": "钢琴块",
        "Poker-blackjack.html": "扑克21点",
        "star-strike-forse.html": "星际打击部队",
        "Zombie-TowerDefence.html": "僵尸塔防"
    };

    // 温柔的二次元问候 (不干扰任何功能)
    console.log('🌸 游戏库载入完毕！目前有 ' + GAME_FILES.length + ' 款二次元游戏等待探索～');
})();
// 游戏库配置 - 更新为小型浮窗
const gameLibraryConfig = {
  // 游戏列表 - 根据你的实际游戏文件修改
  games: [
    { id: 1, name: "赛博刺客", icon: "🎮", file: "cycber-assassin.html", category: "动作" },
    { id: 2, name: "无尽战机", icon: "🕹️", file: "Endless-Warplane.html", category: "动作" },
    { id: 3, name: "经典象棋", icon: "👾", file: "chess.html", category: "策略" },
    { id: 4, name: "梦幻塔防", icon: "🎯", file: "war.html", category: "策略" },
    { id: 5, name: "冒险岛", icon: "⚔️", file: "maoxiandao.html", category: "冒险" },
    { id: 6, name: "2048游戏", icon: "🧩", file: "2048.html", category: "益智" },
    { id: 7, name: "绝望防线", icon: "🎲", file: "juewangfangxian.html", category: "益智" },
    { id: 8, name: "圣职乱斗", icon: "♟️", file: "SZLD.html", category: "策略" },
    { id: 9, name: "经典扑克", icon: "🃏", file: "dapai.html", category: "卡牌" },
    { id: 10, name: "趣味消除", icon: "🎪", file: "XXL.html", category: "休闲" },
    { id: 11, name: "星际突击", icon: "🚀", file: "XJTJD.html", category: "动作" },
    { id: 12, name: "未来射击", icon: "🔫", file: "SJYX.html", category: "射击" },
    { id: 13, name: "魂斗罗", icon: "🏹", file: "HDL.html", category: "冒险" },
    { id: 14, name: "科幻象棋", icon: "🛸", file: "KHXQ.html", category: "科幻" },
    { id: 15, name: "深渊吞噬", icon: "🤖", file: "SYTS.html", category: "科幻" },
    { id: 16, name: "外星格斗", icon: "👽", file: "WXGD.html", category: "科幻" }
  ],
  itemsPerPage: 16,
  currentPage: 0,
  currentCategory: "全部"
};

// DOM元素
let gameLibraryBtn, gameLibraryPanel, overlay, floatingGamesGrid;
let gameTabs, pageIndicator, prevPageBtn, nextPageBtn;

// 获取所有游戏分类
function getGameCategories() {
  const categories = ["全部"];
  gameLibraryConfig.games.forEach(game => {
    if (game.category && !categories.includes(game.category)) {
      categories.push(game.category);
    }
  });
  return categories;
}

// 初始化游戏库
function initGameLibrary() {
  // 获取DOM元素
  gameLibraryBtn = document.getElementById('gameLibraryBtn');
  gameLibraryPanel = document.getElementById('gameLibraryPanel');
  overlay = document.getElementById('gameLibraryOverlay');
  floatingGamesGrid = document.getElementById('floatingGamesGrid');
  gameTabs = document.getElementById('gameTabs');
  pageIndicator = document.getElementById('pageIndicator');
  prevPageBtn = document.querySelector('.prev-page');
  nextPageBtn = document.querySelector('.next-page');
  
  // 生成游戏标签
  generateGameTabs();
  
  // 生成游戏网格
  generateFloatingGamesGrid();
  
  // 更新分页指示器
  updatePageIndicator();
  
  // 添加事件监听器
  setupEventListeners();
}

// 生成游戏标签
function generateGameTabs() {
  const categories = getGameCategories();
  
  gameTabs.innerHTML = '';
  
  categories.forEach(category => {
    const tab = document.createElement('div');
    tab.className = `game-tab ${category === gameLibraryConfig.currentCategory ? 'active' : ''}`;
    tab.textContent = category;
    tab.dataset.category = category;
    gameTabs.appendChild(tab);
  });
}

// 生成游戏网格
function generateFloatingGamesGrid() {
  floatingGamesGrid.innerHTML = '';
  
  // 筛选当前分类的游戏
  let filteredGames = gameLibraryConfig.games;
  if (gameLibraryConfig.currentCategory !== "全部") {
    filteredGames = gameLibraryConfig.games.filter(
      game => game.category === gameLibraryConfig.currentCategory
    );
  }
  
  // 计算当前页的游戏
  const startIndex = gameLibraryConfig.currentPage * gameLibraryConfig.itemsPerPage;
  const endIndex = startIndex + gameLibraryConfig.itemsPerPage;
  const pageGames = filteredGames.slice(startIndex, endIndex);
  
  // 计算总页数
  const totalPages = Math.ceil(filteredGames.length / gameLibraryConfig.itemsPerPage);
  
  // 更新分页按钮状态
  prevPageBtn.disabled = gameLibraryConfig.currentPage === 0;
  nextPageBtn.disabled = gameLibraryConfig.currentPage >= totalPages - 1;
  
  // 添加游戏项
  pageGames.forEach(game => {
    const gameElement = document.createElement('div');
    gameElement.className = 'floating-game-item';
    gameElement.dataset.gameId = game.id;
    gameElement.title = `点击进入 ${game.name}`;
    
    // 创建游戏图标
    const iconElement = document.createElement('div');
    iconElement.className = 'floating-game-icon';
    iconElement.textContent = game.icon;
    
    // 创建游戏标题
    const titleElement = document.createElement('div');
    titleElement.className = 'floating-game-title';
    titleElement.textContent = game.name;
    
    // 组合元素
    gameElement.appendChild(iconElement);
    gameElement.appendChild(titleElement);
    
    // 添加到网格
    floatingGamesGrid.appendChild(gameElement);
  });
  
  // 如果当前页游戏不足16个，用空项填充
  const emptySlots = gameLibraryConfig.itemsPerPage - pageGames.length;
  for (let i = 0; i < emptySlots; i++) {
    const emptyElement = document.createElement('div');
    emptyElement.className = 'floating-game-item empty';
    emptyElement.style.visibility = 'hidden';
    floatingGamesGrid.appendChild(emptyElement);
  }
  
  // 更新分页指示器
  updatePageIndicator();
}

// 更新分页指示器
function updatePageIndicator() {
  let filteredGames = gameLibraryConfig.games;
  if (gameLibraryConfig.currentCategory !== "全部") {
    filteredGames = gameLibraryConfig.games.filter(
      game => game.category === gameLibraryConfig.currentCategory
    );
  }
  
  const totalPages = Math.ceil(filteredGames.length / gameLibraryConfig.itemsPerPage);
  const currentPage = gameLibraryConfig.currentPage + 1;
  
  if (totalPages > 0) {
    pageIndicator.textContent = `${currentPage}/${totalPages}`;
  } else {
    pageIndicator.textContent = "0/0";
  }
}

// 跳转到游戏
function goToGame(gameId) {
  const game = gameLibraryConfig.games.find(g => g.id === gameId);
  if (game) {
    // 关闭浮窗
    closePanel();
    
    // 跳转到游戏页面
    window.location.href = `Resources/game/${game.file}`;
  }
}

// 切换到分类
function switchCategory(category) {
  gameLibraryConfig.currentCategory = category;
  gameLibraryConfig.currentPage = 0; // 重置到第一页
  
  // 更新标签状态
  document.querySelectorAll('.game-tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.category === category);
  });
  
  // 重新生成游戏网格
  generateFloatingGamesGrid();
}

// 切换页面
function switchPage(direction) {
  let filteredGames = gameLibraryConfig.games;
  if (gameLibraryConfig.currentCategory !== "全部") {
    filteredGames = gameLibraryConfig.games.filter(
      game => game.category === gameLibraryConfig.currentCategory
    );
  }
  
  const totalPages = Math.ceil(filteredGames.length / gameLibraryConfig.itemsPerPage);
  
  if (direction === 'prev' && gameLibraryConfig.currentPage > 0) {
    gameLibraryConfig.currentPage--;
  } else if (direction === 'next' && gameLibraryConfig.currentPage < totalPages - 1) {
    gameLibraryConfig.currentPage++;
  }
  
  generateFloatingGamesGrid();
}

// 打开浮窗
function openPanel() {
  gameLibraryPanel.style.display = 'block';
  overlay.style.display = 'block';
  document.body.style.overflow = 'hidden';
}

// 关闭浮窗
function closePanel() {
  gameLibraryPanel.style.display = 'none';
  overlay.style.display = 'none';
  document.body.style.overflow = '';
}

// 设置事件监听器
function setupEventListeners() {
  // 打开浮窗
  gameLibraryBtn.addEventListener('click', openPanel);
  
  // 关闭浮窗
  document.querySelector('.floating-close').addEventListener('click', closePanel);
  overlay.addEventListener('click', closePanel);
  
  // 游戏项点击事件
  floatingGamesGrid.addEventListener('click', (e) => {
    const gameItem = e.target.closest('.floating-game-item');
    if (gameItem && !gameItem.classList.contains('empty')) {
      const gameId = parseInt(gameItem.dataset.gameId);
      goToGame(gameId);
    }
  });
  
  // 标签点击事件
  gameTabs.addEventListener('click', (e) => {
    if (e.target.classList.contains('game-tab')) {
      const category = e.target.dataset.category;
      switchCategory(category);
    }
  });
  
  // 分页按钮事件
  prevPageBtn.addEventListener('click', () => switchPage('prev'));
  nextPageBtn.addEventListener('click', () => switchPage('next'));
  
  // 键盘导航
  document.addEventListener('keydown', (e) => {
    if (gameLibraryPanel.style.display === 'block') {
      // ESC键关闭浮窗
      if (e.key === 'Escape') {
        closePanel();
      }
      
      // 左右箭头切换页面
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        switchPage('prev');
      }
      
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        switchPage('next');
      }
    }
  });
  
  // 点击浮窗外部关闭
  gameLibraryPanel.addEventListener('click', (e) => {
    e.stopPropagation();
  });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initGameLibrary);
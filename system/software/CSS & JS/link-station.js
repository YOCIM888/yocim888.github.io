// 网站数据
const sitesData = [
    {
        id: 1,
        name: "哔哩哔哩",
        url: "https://www.bilibili.com",
        category: "media",
        icon: "fab fa-bilibili",
        description: "中国领先的年轻人文化社区和视频平台"
    },
    {
        id: 2,
        name: "YouTube",
        url: "https://www.youtube.com",
        category: "media",
        icon: "fab fa-youtube",
        description: "全球最大的视频分享平台"
    },
    {
        id: 3,
        name: "Google",
        url: "https://www.google.com",
        category: "tools",
        icon: "fab fa-google",
        description: "全球最流行的搜索引擎"
    },
    {
        id: 4,
        name: "GitHub",
        url: "https://github.com",
        category: "tools",
        icon: "fab fa-github",
        description: "全球最大的代码托管平台"
    },
    {
        id: 5,
        name: "Twitter",
        url: "https://twitter.com",
        category: "social",
        icon: "fab fa-twitter",
        description: "社交媒体和微博客服务"
    },
    {
        id: 6,
        name: "Reddit",
        url: "https://www.reddit.com",
        category: "social",
        icon: "fab fa-reddit",
        description: "社交新闻聚合、网络内容评级和讨论网站"
    },
    {
        id: 7,
        name: "Amazon",
        url: "https://www.amazon.com",
        category: "shopping",
        icon: "fab fa-amazon",
        description: "全球最大的电子商务平台"
    },
    {
        id: 8,
        name: "Stack Overflow",
        url: "https://stackoverflow.com",
        category: "tools",
        icon: "fab fa-stack-overflow",
        description: "程序员问答社区"
    },
    {
        id: 9,
        name: "Wikipedia",
        url: "https://www.wikipedia.org",
        category: "news",
        icon: "fab fa-wikipedia-w",
        description: "多语言、内容自由、公开编辑的网络百科全书"
    },
    {
        id: 10,
        name: "Netflix",
        url: "https://www.netflix.com",
        category: "media",
        icon: "fab fa-netflix",
        description: "全球领先的流媒体娱乐服务"
    },
    {
        id: 11,
        name: "Spotify",
        url: "https://open.spotify.com",
        category: "media",
        icon: "fab fa-spotify",
        description: "音乐流媒体服务平台"
    },
    {
        id: 12,
        name: "Discord",
        url: "https://discord.com",
        category: "social",
        icon: "fab fa-discord",
        description: "专为社群设计的免费网络实时通话软件与数字发行平台"
    },
    {
        id: 13,
        name: "Figma",
        url: "https://www.figma.com",
        category: "tools",
        icon: "fab fa-figma",
        description: "基于浏览器的界面设计协作工具"
    },
    {
        id: 14,
        name: "Steam",
        url: "https://store.steampowered.com",
        category: "shopping",
        icon: "fab fa-steam",
        description: "电子游戏数字发行平台"
    },
    {
        id: 15,
        name: "Notion",
        url: "https://www.notion.so",
        category: "productivity",
        icon: "fas fa-sticky-note",
        description: "一体化工作空间，用于笔记、任务、维基和数据库"
    },
    {
        id: 16,
        name: "ChatGPT",
        url: "https://chat.openai.com",
        category: "tools",
        icon: "fas fa-robot",
        description: "OpenAI开发的对话式人工智能助手"
    },
    {
        id: 17,
        name: "MDN Web Docs",
        url: "https://developer.mozilla.org",
        category: "tools",
        icon: "fab fa-mdn",
        description: "Mozilla开发者网络，Web技术文档"
    },
    {
        id: 18,
        name: "Medium",
        url: "https://medium.com",
        category: "news",
        icon: "fab fa-medium",
        description: "在线出版平台，包含各种主题的文章"
    },
    {
        id: 19,
        name: "LinkedIn",
        url: "https://www.linkedin.com",
        category: "social",
        icon: "fab fa-linkedin",
        description: "职场社交平台"
    },
    {
        id: 20,
        name: "Twitch",
        url: "https://www.twitch.tv",
        category: "media",
        icon: "fab fa-twitch",
        description: "面向视频游戏的实时流媒体视频平台"
    },
    {
        id: 21,
        name: "Apple",
        url: "https://www.apple.com",
        category: "shopping",
        icon: "fab fa-apple",
        description: "苹果公司官方网站"
    },
    {
        id: 22,
        name: "Microsoft",
        url: "https://www.microsoft.com",
        category: "tools",
        icon: "fab fa-microsoft",
        description: "微软公司官方网站"
    },
    {
        id: 23,
        name: "Dropbox",
        url: "https://www.dropbox.com",
        category: "productivity",
        icon: "fab fa-dropbox",
        description: "文件托管服务"
    },
    {
        id: 24,
        name: "BBC News",
        url: "https://www.bbc.com/news",
        category: "news",
        icon: "fas fa-newspaper",
        description: "英国广播公司新闻网站"
    }
];

// 应用状态
let currentCategory = 'all';
let sites = [...sitesData];
let isMatrixMode = false;
let soundEnabled = true;

// DOM元素
const linksContainer = document.getElementById('links-container');
const categories = document.querySelectorAll('.category');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const themeToggle = document.getElementById('theme-toggle');
const layoutToggle = document.getElementById('layout-toggle');
const addSiteBtn = document.getElementById('add-site');
const addModal = document.getElementById('add-modal');
const closeModal = document.querySelector('.close-modal');
const cancelAdd = document.getElementById('cancel-add');
const saveSite = document.getElementById('save-site');
const refreshBtn = document.getElementById('refresh-btn');
const matrixBtn = document.getElementById('matrix-btn');
const soundToggle = document.getElementById('sound-toggle');
const currentTime = document.getElementById('current-time');
const currentDate = document.getElementById('current-date');
const nodeCount = document.getElementById('node-count');
const clickSound = document.getElementById('click-sound');
const hoverSound = document.getElementById('hover-sound');

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    init();
});

function init() {
    // 渲染初始网站卡片
    renderSites();
    
    // 设置事件监听器
    setupEventListeners();
    
    // 更新时间显示
    updateTime();
    setInterval(updateTime, 1000);
    
    // 初始化音效
    clickSound.volume = 0.3;
    hoverSound.volume = 0.2;
    
    // 播放启动音效
    if (soundEnabled) {
        playSound('click');
    }
}

// 渲染网站卡片
function renderSites() {
    linksContainer.innerHTML = '';
    
    // 过滤网站
    let filteredSites = sites;
    if (currentCategory !== 'all') {
        filteredSites = sites.filter(site => site.category === currentCategory);
    }
    
    // 更新节点计数
    nodeCount.textContent = filteredSites.length;
    
    // 渲染卡片
    filteredSites.forEach(site => {
        const card = createSiteCard(site);
        linksContainer.appendChild(card);
    });
    
    // 如果没有结果
    if (filteredSites.length === 0) {
        linksContainer.innerHTML = `
            <div class="no-results" style="grid-column: 1 / -1; text-align: center; padding: 50px; color: #a0a0ff;">
                <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 20px; opacity: 0.5;"></i>
                <h3 style="margin-bottom: 10px;">未找到匹配的节点</h3>
                <p>尝试使用不同的搜索词或选择其他分类</p>
            </div>
        `;
    }
}

// 创建网站卡片
function createSiteCard(site) {
    const card = document.createElement('div');
    card.className = 'site-card';
    card.dataset.category = site.category;
    
    // 分类映射到中文
    const categoryMap = {
        'social': '社交网络',
        'media': '影音媒体',
        'tools': '开发工具',
        'shopping': '数字购物',
        'news': '资讯新闻',
        'productivity': '生产力'
    };
    
    card.innerHTML = `
        <div class="card-header">
            <div class="card-icon">
                <i class="${site.icon}"></i>
            </div>
            <div>
                <div class="card-title">${site.name}</div>
                <div class="card-category">${categoryMap[site.category] || site.category}</div>
            </div>
        </div>
        <div class="card-description">${site.description}</div>
        <div class="card-footer">
            <button class="visit-btn" data-url="${site.url}">
                <i class="fas fa-external-link-alt"></i> 访问节点
            </button>
            <button class="delete-btn" data-id="${site.id}">
                <i class="fas fa-trash-alt"></i> 删除
            </button>
        </div>
    `;
    
    // 添加点击事件
    const visitBtn = card.querySelector('.visit-btn');
    const deleteBtn = card.querySelector('.delete-btn');
    
    visitBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        if (soundEnabled) playSound('click');
        window.open(this.dataset.url, '_blank');
    });
    
    deleteBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        if (soundEnabled) playSound('click');
        deleteSite(parseInt(this.dataset.id));
    });
    
    // 整个卡片也可点击访问
    card.addEventListener('click', function() {
        if (soundEnabled) playSound('click');
        window.open(site.url, '_blank');
    });
    
    // 添加悬停音效
    card.addEventListener('mouseenter', function() {
        if (soundEnabled) playSound('hover');
    });
    
    return card;
}

// 删除网站
function deleteSite(id) {
    if (confirm('确定要删除这个节点吗？')) {
        sites = sites.filter(site => site.id !== id);
        renderSites();
    }
}

// 添加新网站
function addSite(site) {
    // 生成新ID
    const newId = sites.length > 0 ? Math.max(...sites.map(s => s.id)) + 1 : 1;
    site.id = newId;
    sites.push(site);
    renderSites();
}

// 搜索功能
function searchSites() {
    const query = searchInput.value.toLowerCase().trim();
    
    if (query === '') {
        renderSites();
        return;
    }
    
    const filteredSites = sites.filter(site => 
        site.name.toLowerCase().includes(query) || 
        site.description.toLowerCase().includes(query) ||
        site.category.toLowerCase().includes(query)
    );
    
    // 临时渲染搜索结果
    linksContainer.innerHTML = '';
    filteredSites.forEach(site => {
        const card = createSiteCard(site);
        linksContainer.appendChild(card);
    });
    
    // 如果没有结果
    if (filteredSites.length === 0) {
        linksContainer.innerHTML = `
            <div class="no-results" style="grid-column: 1 / -1; text-align: center; padding: 50px; color: #a0a0ff;">
                <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 20px; opacity: 0.5;"></i>
                <h3 style="margin-bottom: 10px;">未找到匹配的节点</h3>
                <p>尝试使用不同的搜索词</p>
            </div>
        `;
    }
}

// 设置事件监听器
function setupEventListeners() {
    // 分类点击事件
    categories.forEach(category => {
        category.addEventListener('click', function() {
            if (soundEnabled) playSound('click');
            
            // 更新活动类
            categories.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            
            // 更新当前分类
            currentCategory = this.dataset.category;
            
            // 重新渲染
            renderSites();
        });
    });
    
    // 搜索按钮
    searchBtn.addEventListener('click', function() {
        if (soundEnabled) playSound('click');
        searchSites();
    });
    
    // 搜索输入回车键
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            if (soundEnabled) playSound('click');
            searchSites();
        }
    });
    
    // 主题切换
    themeToggle.addEventListener('click', function() {
        if (soundEnabled) playSound('click');
        toggleTheme();
    });
    
    // 布局切换
    layoutToggle.addEventListener('click', function() {
        if (soundEnabled) playSound('click');
        toggleLayout();
    });
    
    // 添加网站按钮
    addSiteBtn.addEventListener('click', function() {
        if (soundEnabled) playSound('click');
        addModal.classList.add('active');
    });
    
    // 关闭模态框
    closeModal.addEventListener('click', function() {
        if (soundEnabled) playSound('click');
        addModal.classList.remove('active');
        clearAddForm();
    });
    
    cancelAdd.addEventListener('click', function() {
        if (soundEnabled) playSound('click');
        addModal.classList.remove('active');
        clearAddForm();
    });
    
    // 保存网站
    saveSite.addEventListener('click', function() {
        if (soundEnabled) playSound('click');
        
        const name = document.getElementById('site-name').value.trim();
        const url = document.getElementById('site-url').value.trim();
        const category = document.getElementById('site-category').value;
        const icon = document.getElementById('site-icon').value.trim();
        const desc = document.getElementById('site-desc').value.trim();
        
        if (!name || !url) {
            alert('请至少填写节点名称和URL');
            return;
        }
        
        // 验证URL格式
        let validUrl = url;
        if (!validUrl.startsWith('http://') && !validUrl.startsWith('https://')) {
            validUrl = 'https://' + validUrl;
        }
        
        const newSite = {
            name,
            url: validUrl,
            category,
            icon: icon || 'fas fa-globe',
            description: desc || '用户添加的节点'
        };
        
        addSite(newSite);
        addModal.classList.remove('active');
        clearAddForm();
        
        // 自动切换到新分类
        categories.forEach(c => c.classList.remove('active'));
        document.querySelector(`.category[data-category="${category}"]`).classList.add('active');
        currentCategory = category;
        renderSites();
    });
    
    // 刷新按钮
    refreshBtn.addEventListener('click', function() {
        if (soundEnabled) playSound('click');
        sites = [...sitesData];
        searchInput.value = '';
        categories[0].click();
    });
    
    // 矩阵效果按钮
    matrixBtn.addEventListener('click', function() {
        if (soundEnabled) playSound('click');
        toggleMatrixEffect();
    });
    
    // 音效开关
    soundToggle.addEventListener('click', function() {
        soundEnabled = !soundEnabled;
        this.innerHTML = soundEnabled ? 
            '<i class="fas fa-volume-up"></i>' : 
            '<i class="fas fa-volume-mute"></i>';
        
        if (soundEnabled) playSound('click');
    });
    
    // 点击外部关闭模态框
    addModal.addEventListener('click', function(e) {
        if (e.target === this) {
            addModal.classList.remove('active');
            clearAddForm();
        }
    });
}

// 切换主题
function toggleTheme() {
    const body = document.body;
    const currentTheme = body.dataset.theme;
    
    if (currentTheme === 'dark-red') {
        body.dataset.theme = 'default';
        applyTheme('default');
        themeToggle.innerHTML = '<i class="fas fa-palette"></i> 主题切换';
    } else if (currentTheme === 'default' || !currentTheme) {
        body.dataset.theme = 'dark-red';
        applyTheme('dark-red');
        themeToggle.innerHTML = '<i class="fas fa-palette"></i> 恢复默认';
    }
}

// 应用主题
function applyTheme(theme) {
    const root = document.documentElement;
    
    if (theme === 'dark-red') {
        // 红黑主题
        document.body.style.backgroundColor = '#0a0005';
        document.body.style.color = '#ff0033';
        
        // 更新扫描线
        const scanLine = document.querySelector('.scan-line');
        if (scanLine) {
            scanLine.style.background = 'linear-gradient(to bottom, transparent, #ff0033, transparent)';
        }
        
        // 更新所有相关颜色
        const elementsToUpdate = document.querySelectorAll('.cyber-title, .cyber-subtitle, .status-item, .cyber-input, .action-btn, .category, .site-card, .card-title, .visit-btn, .control-btn');
        elementsToUpdate.forEach(el => {
            if (el.classList.contains('cyber-title')) {
                el.style.textShadow = '0 0 10px #ff0033, 0 0 20px #ff0033';
            }
            
            if (el.classList.contains('cyber-input')) {
                el.style.borderColor = '#ff0033';
                el.style.color = '#ff0033';
            }
            
            if (el.classList.contains('action-btn') || el.classList.contains('category') || el.classList.contains('visit-btn') || el.classList.contains('control-btn')) {
                el.style.borderColor = '#ff0033';
                el.style.color = '#ff0033';
            }
            
            if (el.classList.contains('site-card')) {
                el.style.borderColor = 'rgba(255, 0, 51, 0.3)';
            }
            
            if (el.classList.contains('card-title')) {
                el.style.color = '#ff0033';
            }
        });
        
        // 更新活动分类
        document.querySelectorAll('.category.active').forEach(el => {
            el.style.background = 'linear-gradient(45deg, #990000, #ff0033)';
            el.style.boxShadow = '0 0 15px #ff0033';
            el.style.borderColor = '#ff0033';
        });
        
        // 更新按钮
        document.querySelectorAll('.cyber-button').forEach(el => {
            el.style.background = 'linear-gradient(45deg, #990000, #ff0033)';
        });
    } else {
        // 默认蓝绿主题
        document.body.style.backgroundColor = '#0a0a16';
        document.body.style.color = '#00eeff';
        
        // 更新扫描线
        const scanLine = document.querySelector('.scan-line');
        if (scanLine) {
            scanLine.style.background = 'linear-gradient(to bottom, transparent, #00eeff, transparent)';
        }
        
        // 重置所有相关颜色
        const elementsToUpdate = document.querySelectorAll('.cyber-title, .cyber-subtitle, .status-item, .cyber-input, .action-btn, .category, .site-card, .card-title, .visit-btn, .control-btn');
        elementsToUpdate.forEach(el => {
            if (el.classList.contains('cyber-title')) {
                el.style.textShadow = '0 0 10px #00eeff, 0 0 20px #00eeff';
            }
            
            if (el.classList.contains('cyber-input')) {
                el.style.borderColor = '#00eeff';
                el.style.color = '#00eeff';
            }
            
            if (el.classList.contains('action-btn') || el.classList.contains('category') || el.classList.contains('visit-btn') || el.classList.contains('control-btn')) {
                el.style.borderColor = '#00aaff';
                el.style.color = '#00eeff';
            }
            
            if (el.classList.contains('site-card')) {
                el.style.borderColor = 'rgba(0, 238, 255, 0.3)';
            }
            
            if (el.classList.contains('card-title')) {
                el.style.color = '#00eeff';
            }
        });
        
        // 更新活动分类
        document.querySelectorAll('.category.active').forEach(el => {
            el.style.background = 'linear-gradient(45deg, #0066cc, #00aaff)';
            el.style.boxShadow = '0 0 15px #00aaff';
            el.style.borderColor = '#00eeff';
        });
        
        // 更新按钮
        document.querySelectorAll('.cyber-button').forEach(el => {
            el.style.background = 'linear-gradient(45deg, #0066cc, #00aaff)';
        });
    }
}

// 切换布局
function toggleLayout() {
    const grid = document.querySelector('.links-grid');
    
    if (grid.style.gridTemplateColumns === '1fr') {
        // 切换到网格布局
        grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(280px, 1fr))';
        layoutToggle.innerHTML = '<i class="fas fa-th-large"></i> 网格视图';
    } else {
        // 切换到列表布局
        grid.style.gridTemplateColumns = '1fr';
        layoutToggle.innerHTML = '<i class="fas fa-list"></i> 列表视图';
    }
    
    // 添加过渡效果
    grid.style.transition = 'grid-template-columns 0.5s ease';
}

// 矩阵效果
function toggleMatrixEffect() {
    const container = document.querySelector('.cyber-container');
    
    if (isMatrixMode) {
        // 关闭矩阵效果
        const matrixOverlay = document.querySelector('.matrix-overlay');
        if (matrixOverlay) {
            matrixOverlay.remove();
        }
        matrixBtn.innerHTML = '<i class="fas fa-code"></i> 矩阵效果';
        isMatrixMode = false;
    } else {
        // 创建矩阵效果
        const overlay = document.createElement('div');
        overlay.className = 'matrix-overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.background = 'rgba(0, 20, 0, 0.8)';
        overlay.style.zIndex = '998';
        overlay.style.pointerEvents = 'none';
        overlay.style.overflow = 'hidden';
        
        // 添加绿色字符雨
        for (let i = 0; i < 50; i++) {
            const char = document.createElement('div');
            char.textContent = '01';
            char.style.position = 'absolute';
            char.style.color = '#0f0';
            char.style.fontSize = Math.random() * 20 + 10 + 'px';
            char.style.fontFamily = 'monospace';
            char.style.top = Math.random() * -100 + 'px';
            char.style.left = Math.random() * 100 + 'vw';
            char.style.opacity = '0.7';
            char.style.animation = `fall ${Math.random() * 5 + 3}s linear infinite`;
            overlay.appendChild(char);
        }
        
        // 添加CSS动画
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fall {
                to { transform: translateY(100vh); }
            }
        `;
        document.head.appendChild(style);
        
        container.appendChild(overlay);
        matrixBtn.innerHTML = '<i class="fas fa-times"></i> 关闭矩阵';
        isMatrixMode = true;
        
        // 10秒后自动关闭
        setTimeout(() => {
            if (isMatrixMode) {
                toggleMatrixEffect();
            }
        }, 10000);
    }
}

// 更新时间显示
function updateTime() {
    const now = new Date();
    
    // 格式化时间
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    
    // 格式化日期 (赛博风格，使用未来年份)
    const year = now.getFullYear() + 57; // 未来年份
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    
    currentTime.textContent = `${hours}:${minutes}:${seconds}`;
    currentDate.textContent = `${year}-${month}-${day}`;
}

// 播放音效
function playSound(type) {
    if (!soundEnabled) return;
    
    if (type === 'click') {
        clickSound.currentTime = 0;
        clickSound.play().catch(e => console.log("音频播放失败:", e));
    } else if (type === 'hover') {
        hoverSound.currentTime = 0;
        hoverSound.play().catch(e => console.log("音频播放失败:", e));
    }
}

// 清空添加表单
function clearAddForm() {
    document.getElementById('site-name').value = '';
    document.getElementById('site-url').value = '';
    document.getElementById('site-category').value = 'social';
    document.getElementById('site-icon').value = '';
    document.getElementById('site-desc').value = '';
}

// 为按钮添加悬停音效
document.querySelectorAll('button, .site-card, .category').forEach(element => {
    element.addEventListener('mouseenter', function() {
        if (soundEnabled && !this.classList.contains('site-card')) {
            playSound('hover');
        }
    });
});
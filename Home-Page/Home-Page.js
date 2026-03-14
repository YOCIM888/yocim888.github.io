// script.js - 二次元导航模板交互

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // ----- 1. 设置底部当前年份 (自动更新) -----
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        const currentYear = new Date().getFullYear();
        yearSpan.textContent = currentYear;
    }

    // ----- 2. 随机二次元语录 (两个位置统一) -----
    const quotes = [
        "“我可是要成为火影的男人！” — 鸣人",
        "“数据才是一切，不过情感也是数据的一种。” — 程序员",
        "“正因为没有翅膀，人们才会寻找飞翔的方法。” — 罪惡王冠",
        "“代表月亮消灭你！” — 水冰月",
        "“教练，我想打篮球...” — 三井寿",
        "“已经没什么好害怕的了。” — 巴麻美",
        "“今天的风儿好喧嚣啊。” — 男子高中生的日常",
        "“我们都是软弱的，所以我们才会互相扶持。” — 夏目友人帐",
        "“让我来告诉你，什么叫做天才！” — 樱木花道",
        "“此生无悔入二次元。” — 匿名",
        "“你所期盼的奇迹，是否只存在于二次元？” — 原创",
        "“就算是换电脑，我也要保存好D槽。” — 宅の箴言"
    ];

    const randomIndex = Math.floor(Math.random() * quotes.length);
    const selectedQuote = quotes[randomIndex];

    const quoteElement1 = document.getElementById('anime-quote');
    const quoteElement2 = document.getElementById('anime-quote-footer');

    if (quoteElement1) quoteElement1.textContent = selectedQuote;
    if (quoteElement2) quoteElement2.textContent = selectedQuote;

    // ----- 3. 控制台彩蛋 -----
    console.log('✨ YOCIM导航已加载 — 用二次元填满你的收藏夹！ ✨');
    console.log('🍥 今日语录: ' + selectedQuote);

    // ----- 4. 搜索功能 -----
    const searchBtn = document.querySelector('.search-btn');
    const searchInput = document.querySelector('.search-input');
    const resultsContainer = document.querySelector('.search-results');

    // 搜索索引数据
    const searchIndex = [
        { title: "首页", url: "/", content: "欢迎来到我的网站，这里有很多二次元内容。", keywords: "二次元 首页 欢迎" },
        { title: "动漫推荐", url: "/anime", content: "2025年最值得看的动漫榜单……", keywords: "动漫 推荐 新番" },
        { title: "游戏评测", url: "/games", content: "最近热门的二次元游戏评测……", keywords: "游戏 评测 二次元" }
    ];

    function performSearch(query) {
        if (!query) {
            resultsContainer.innerHTML = '<p>输入点二次元关键词试试 ~</p>';
            return;
        }
        const results = searchIndex.filter(item => 
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.content.toLowerCase().includes(query.toLowerCase()) ||
            item.keywords.toLowerCase().includes(query.toLowerCase())
        );
        if (results.length === 0) {
            resultsContainer.innerHTML = `<p>没有找到与“${query}”相关的内容</p>`;
        } else {
            let html = `<p>找到 ${results.length} 个相关结果：</p><ul>`;
            results.forEach(item => {
                html += `<li><a href="${item.url}">${item.title}</a><br><small>${item.content.substring(0,60)}…</small></li>`;
            });
            html += '</ul>';
            resultsContainer.innerHTML = html;
        }
    }

    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', (e) => {
            e.preventDefault();
            performSearch(searchInput.value.trim());
        });
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                searchBtn.click();
            }
        });
    }

    // 可选：导航链接演示拦截（仅当href为#时）
    const navLinks = document.querySelectorAll('.nav-links a, .header-right a, .footer-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (link.getAttribute('href') === '#') {
                e.preventDefault();
                console.log('导航链接(演示)被点击');
            }
        });
    });
});

// ===== 左侧侧边栏交互 =====
(function() {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('toggleSidebar');
    const body = document.body;

    function updateSidebarState(collapsed) {
        if (collapsed) {
            sidebar.classList.add('collapsed');
            body.style.paddingLeft = '70px';
            const icon = toggleBtn.querySelector('i');
            if (icon) icon.className = 'fas fa-angle-double-right';
        } else {
            sidebar.classList.remove('collapsed');
            body.style.paddingLeft = '200px';
            const icon = toggleBtn.querySelector('i');
            if (icon) icon.className = 'fas fa-angle-double-left';
        }
    }

    toggleBtn.addEventListener('click', function(e) {
        e.preventDefault();
        const isCollapsed = sidebar.classList.contains('collapsed');
        updateSidebarState(!isCollapsed);
    });

    function initSidebar() {
        const isMobile = window.innerWidth <= 768;
        updateSidebarState(isMobile);
    }

    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            const isMobile = window.innerWidth <= 768;
            const isCollapsed = sidebar.classList.contains('collapsed');
            if (isMobile && !isCollapsed) {
                updateSidebarState(true);
            } else if (!isMobile && isCollapsed) {
                // 桌面下保持用户选择，不做自动展开
            }
        }, 200);
    });

    initSidebar();

    // 侧边栏链接演示提示（可删除）
    const sidebarLinks = document.querySelectorAll('.sidebar-item a');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const text = link.querySelector('span')?.innerText || '选项';
            alert(`您点击了「${text}」\n请将链接替换为真实HTML地址。`);
        });
    });
})();

// ===== 音乐播放器模块 =====
(function() {
    // 配置：音乐文件列表（请确保文件存在）
    const playlist = [
        'Resources/audio/Call of Silence.mp3',
        'Resources/audio/I Really Want to stay at Your House.mp3',
        'Resources/audio/Stay with Me Lofi.mp3',
        'Resources/audio/Умри, если меня не любишь'
    ];

    // DOM 元素
    const playerIcon = document.getElementById('playerIcon');
    const playerPanel = document.getElementById('musicPlayer');
    const closeBtn = document.getElementById('closePlayer');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const progressBar = document.getElementById('progressBar');
    const currentTimeSpan = document.getElementById('currentTime');
    const durationSpan = document.getElementById('duration');
    const songNameSpan = document.getElementById('currentSong');

    // 状态
    let audio = new Audio();
    let currentIndex = 0;
    let isPlaying = false;
    let isPanelVisible = false;

    function loadSong(index) {
        if (playlist.length === 0) return;
        const songUrl = playlist[index];
        audio.src = songUrl;
        let displayName = songUrl.split('/').pop().replace(/\.[^/.]+$/, '');
        songNameSpan.textContent = displayName || '未知曲目';
        audio.load();
        if (isPlaying) {
            audio.play().catch(e => console.log('自动播放被阻止'));
        }
        updatePlayPauseIcon();
    }

    function updatePlayPauseIcon() {
        const icon = playPauseBtn.querySelector('i');
        icon.className = isPlaying ? 'fas fa-pause' : 'fas fa-play';
    }

    function formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    function updateProgress() {
        if (audio.duration) {
            const progress = (audio.currentTime / audio.duration) * 100;
            progressBar.value = progress || 0;
            currentTimeSpan.textContent = formatTime(audio.currentTime);
            durationSpan.textContent = formatTime(audio.duration);
        }
    }

    function showPanel(show) {
        if (show) {
            playerPanel.classList.remove('hidden');
            isPanelVisible = true;
        } else {
            playerPanel.classList.add('hidden');
            isPanelVisible = false;
        }
    }

    // 点击图标显示面板
    playerIcon.addEventListener('click', (e) => {
        e.stopPropagation();
        showPanel(true);
    });

    // 点击关闭按钮隐藏面板（音乐继续）
    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showPanel(false);
    });

    // 点击页面其他地方关闭面板
    document.addEventListener('click', (e) => {
        if (isPanelVisible && !playerPanel.contains(e.target) && e.target !== playerIcon && !playerIcon.contains(e.target)) {
            showPanel(false);
        }
    });

    // 播放/暂停
    playPauseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (playlist.length === 0) {
            alert('请先在 playlist 中添加音乐文件！');
            return;
        }
        if (audio.src === '') {
            loadSong(currentIndex);
        }
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play().catch(e => alert('无法播放，请检查音乐文件路径'));
        }
        isPlaying = !isPlaying;
        updatePlayPauseIcon();
    });

    // 上一首
    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (playlist.length === 0) return;
        currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
        loadSong(currentIndex);
    });

    // 下一首
    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (playlist.length === 0) return;
        currentIndex = (currentIndex + 1) % playlist.length;
        loadSong(currentIndex);
    });

    // 进度条拖动
    progressBar.addEventListener('input', (e) => {
        if (audio.duration) {
            const seekTime = (e.target.value / 100) * audio.duration;
            audio.currentTime = seekTime;
        }
    });

    audio.addEventListener('loadedmetadata', () => {
        durationSpan.textContent = formatTime(audio.duration);
        progressBar.value = 0;
    });

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', () => nextBtn.click());

    // 预加载第一首歌
    if (playlist.length > 0) {
        audio.src = playlist[0];
        songNameSpan.textContent = playlist[0].split('/').pop().replace(/\.[^/.]+$/, '');
    }

    // 默认隐藏播放器面板
    playerPanel.classList.add('hidden');

    // 点击面板内部不冒泡
    playerPanel.addEventListener('click', (e) => e.stopPropagation());
})();
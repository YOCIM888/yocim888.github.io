// script.js

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
    // 搜索功能的代码已移至 search.js，确保在 HTML 中正确引入 search.js 文件。

    // ----- 5. 暗色模式切换 -----
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// 检查本地存储或系统偏好
function setInitialTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark');
        updateThemeIcon(true);
    } else if (savedTheme === 'light') {
        body.classList.remove('dark');
        updateThemeIcon(false);
    } else {
        // 无保存值时跟随系统
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
            body.classList.add('dark');
            updateThemeIcon(true);
        } else {
            updateThemeIcon(false);
        }
    }
}

function updateThemeIcon(isDark) {
    const icon = themeToggle.querySelector('i');
    if (isDark) {
        icon.className = 'fas fa-sun';      // 深色模式显示太阳，表示可切回亮色
    } else {
        icon.className = 'fas fa-moon';     // 亮色模式显示月亮，表示可切到深色
    }
}

if (themeToggle) {
    // 初始设置
    setInitialTheme();

    themeToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        if (body.classList.contains('dark')) {
            body.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            updateThemeIcon(false);
        } else {
            body.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            updateThemeIcon(true);
        }
    });
}

// 监听系统主题变化（可选）
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem('theme')) {  // 仅当用户未手动设置时才跟随系统
        if (e.matches) {
            body.classList.add('dark');
            updateThemeIcon(true);
        } else {
            body.classList.remove('dark');
            updateThemeIcon(false);
        }
    }
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
        'public/audio/Call of Silence.mp3',
        'public/audio/I Really Want to stay at Your House.mp3',
        'public/audio/KOKIA (吉田亚纪子) - ありがとう… (谢谢…).mp3',
        'public/audio/Stay with Me Lofi.mp3'
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
            audio.play().catch(e => alert('歌曲加载失败'));
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

// ----- 登录（GitHub 公开 API）- 模态框版 -----
const mockLoginBtn = document.getElementById('mockLoginBtn');
const mockUserInfo = document.getElementById('mockUserInfo');
const mockAvatar = document.getElementById('mockUserAvatar');
const mockUserName = document.getElementById('mockUserName');

// 模态框元素
const loginModal = document.getElementById('loginModal');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const modalCancelBtn = document.getElementById('modalCancelBtn');
const modalConfirmBtn = document.getElementById('modalConfirmBtn');
const usernameInput = document.getElementById('githubUsernameInput');
const modalErrorMsg = document.getElementById('modalErrorMsg');

// 检查本地存储中是否有登录的用户信息
const savedMockUser = localStorage.getItem('mock_github_user');

if (savedMockUser) {
    try {
        const user = JSON.parse(savedMockUser);
        showMockUser(user);
    } catch (e) {
        localStorage.removeItem('mock_github_user');
    }
} else {
    // 显示登录按钮
    mockLoginBtn.style.display = 'flex';
    mockUserInfo.style.display = 'none';
}

// 显示模态框
function showModal() {
    loginModal.style.display = 'flex';
    usernameInput.value = '';
    modalErrorMsg.style.display = 'none';
    modalConfirmBtn.disabled = false;
    modalConfirmBtn.innerHTML = '登录';
    usernameInput.focus();
}

// 隐藏模态框
function hideModal() {
    loginModal.style.display = 'none';
}

// 登录按钮点击 -> 显示模态框
mockLoginBtn.addEventListener('click', showModal);

// 关闭模态框（点击×或取消）
modalCloseBtn.addEventListener('click', hideModal);
modalCancelBtn.addEventListener('click', hideModal);

// 点击模态框背景关闭（可选）
loginModal.addEventListener('click', (e) => {
    if (e.target === loginModal) {
        hideModal();
    }
});

// 回车键提交
usernameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        modalConfirmBtn.click();
    }
});

// 确认登录
modalConfirmBtn.addEventListener('click', async () => {
    const username = usernameInput.value.trim();
    if (!username) {
        showModalError('请输入用户名');
        return;
    }

    // 禁用按钮，显示加载状态
    modalConfirmBtn.disabled = true;
    modalConfirmBtn.innerHTML = '<i class="fas fa-spinner fa-pulse"></i> 验证中...';
    modalErrorMsg.style.display = 'none';

    try {
        const response = await fetch(`https://api.github.com/users/${username}`);
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('用户不存在');
            } else {
                throw new Error(`请求失败 (${response.status})`);
            }
        }
        const userData = await response.json();

        const mockUser = {
            login: userData.login,
            name: userData.name || userData.login,
            avatar_url: userData.avatar_url
        };

        // 保存到 localStorage
        localStorage.setItem('mock_github_user', JSON.stringify(mockUser));

        // 隐藏模态框
        hideModal();

        // 显示用户信息
        showMockUser(mockUser);
    } catch (error) {
        showModalError(error.message);
        // 恢复按钮
        modalConfirmBtn.disabled = false;
        modalConfirmBtn.innerHTML = '登录';
    }
});

function showModalError(msg) {
    modalErrorMsg.textContent = msg;
    modalErrorMsg.style.display = 'block';
}

// 显示已登录用户
function showMockUser(user) {
    mockLoginBtn.style.display = 'none';
    mockUserInfo.style.display = 'flex';
    mockAvatar.src = user.avatar_url;
    mockUserName.textContent = user.name || user.login;
}

// 点击已登录区域退出登录
mockUserInfo.addEventListener('click', () => {
    if (confirm('确定要退出登录吗？')) {
        localStorage.removeItem('mock_github_user');
        mockUserInfo.style.display = 'none';
        mockLoginBtn.style.display = 'flex';
        mockLoginBtn.innerHTML = '<i class="fab fa-github"></i> 登录';
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('mobile-menu');
    const mobileNav = document.getElementById('mobileNav');
    const navLinks = document.querySelector('.nav-links');
    const icon = menuToggle.querySelector('i');

    // 将原始导航链接克隆到移动浮窗中
    if (navLinks && mobileNav) {
        mobileNav.innerHTML = navLinks.innerHTML;
    }

    // 切换浮窗显示/隐藏
    function toggleMenu(show) {
        if (show === undefined) {
            mobileNav.classList.toggle('active');
        } else {
            mobileNav.classList.toggle('active', show);
        }
        // 更新图标
        if (mobileNav.classList.contains('active')) {
            icon.className = 'fas fa-times';
        } else {
            icon.className = 'fas fa-bars';
        }
    }

    menuToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleMenu();
    });

    // 点击浮窗内的链接时关闭浮窗
    mobileNav.addEventListener('click', function(e) {
        if (e.target.tagName === 'A') {
            toggleMenu(false);
        }
    });

    // 点击页面其他区域关闭浮窗
    document.addEventListener('click', function(e) {
        if (!menuToggle.contains(e.target) && !mobileNav.contains(e.target)) {
            toggleMenu(false);
        }
    });

    // 可选：窗口大小改变时，如果超过移动端断点，强制关闭浮窗
    window.addEventListener('resize', function() {
        if (window.innerWidth > 700) {
            toggleMenu(false);
        }
    });
});

//状态球
document.addEventListener('DOMContentLoaded', function() {
  // ---------- 计算运行天数（基于2026-01-01）----------
  const startUTC = Date.UTC(2026, 0, 1);               // 2026-01-01 UTC 00:00
  const today = new Date();
  const todayUTC = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  const diffDays = Math.floor((todayUTC - startUTC) / (24 * 60 * 60 * 1000));
  const runDays = diffDays + 1;                         // 使起始日显示为1天
  const visitCount = 117 * runDays;                     // 访问次数

  // 更新DOM
  document.getElementById('runDays').textContent = runDays;
  document.getElementById('visitCount').textContent = visitCount;

  // 初始化当前流量值（0.1 ~ 999.9 MB 之间的随机数）
let currentTraffic = parseFloat((Math.random() * 1000).toFixed(1));

// 获取显示元素
const trafficElement = document.getElementById('dataTraffic');
// 立即显示初始值
trafficElement.textContent = currentTraffic + ' MB';

// 每秒更新一次，每次变化幅度控制在 ±2 MB 以内
setInterval(() => {
  // 生成 -2 到 2 之间的随机变化量（保留一位小数精度）
  const delta = (Math.random() * 4 - 2); 
  let newVal = currentTraffic + delta;

  // 确保数值仍在合理范围 [0.1, 999.9] 内
  if (newVal < 0.1) newVal = 0.1;
  if (newVal > 999.9) newVal = 999.9;

  // 更新当前值并保留一位小数
  currentTraffic = parseFloat(newVal.toFixed(1));
  trafficElement.textContent = currentTraffic + ' MB';
}, 1000);

  // ---------- 关闭状态球 ----------
  const closeBtn = document.getElementById('closeStatusBall');
  const statusBall = document.getElementById('statusBall');
  if (closeBtn) {
    closeBtn.addEventListener('click', function() {
      statusBall.classList.add('hidden');               // 隐藏整个状态窗
    });
  }
});
// system-user-setting.js
document.addEventListener('DOMContentLoaded', function() {
    // 获取所有导航项
    const navItems = document.querySelectorAll('.nav-item');
    // 获取所有内容区域
    const contentSections = document.querySelectorAll('.content-section');
    // 获取内容标题
    const contentTitle = document.getElementById('content-title');
    
    // 设置默认活动项
    setActiveContent('bluetooth');
    
    var hamburgerBtn = document.getElementById('hamburgerBtn');
    var sidebar = document.getElementById('sidebar');
    var sidebarOverlay = document.getElementById('sidebarOverlay');
    var sidebarCloseBtn = document.getElementById('sidebarCloseBtn');

    function openSidebar() {
        if (sidebar) sidebar.classList.add('open');
        if (sidebarOverlay) sidebarOverlay.classList.add('active');
    }

    function closeSidebar() {
        if (sidebar) sidebar.classList.remove('open');
        if (sidebarOverlay) sidebarOverlay.classList.remove('active');
    }

    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', openSidebar);
    }
    if (sidebarCloseBtn) {
        sidebarCloseBtn.addEventListener('click', closeSidebar);
    }
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', closeSidebar);
    }

    // 为每个导航项添加点击事件
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const contentId = this.getAttribute('data-id');
            
            // 更新导航项活动状态
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // 显示对应的内容区域
            setActiveContent(contentId);
            
            // 更新内容标题
            updateContentTitle(this.textContent.trim());

            closeSidebar();
        });
    });
    
    // 设置活动内容函数
    function setActiveContent(contentId) {
        // 隐藏所有内容区域
        contentSections.forEach(section => {
            section.classList.remove('active');
        });
        
        // 显示对应的内容区域
        const activeSection = document.getElementById(`${contentId}-content`);
        if (activeSection) {
            activeSection.classList.add('active');
        }
        
        // 更新标题
        const activeNav = document.querySelector(`.nav-item[data-id="${contentId}"]`);
        if (activeNav) {
            updateContentTitle(activeNav.textContent.trim());
        }
    }
    
    // 更新内容标题函数
    function updateContentTitle(title) {
        if (contentTitle) {
            contentTitle.textContent = title;
        }
    }
    
    // 返回按钮功能
    const backBtn = document.getElementById('back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            history.back();
        });
    }
    
    // 实时更新时间
    function updateDateTime() {
        const now = new Date();
        
        // 格式化时间
        const timeOptions = { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' };
        const currentTime = now.toLocaleTimeString('zh-CN', timeOptions);
        
        // 格式化日期
        const dateOptions = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
        const currentDate = now.toLocaleDateString('zh-CN', dateOptions);
        
        // 更新显示
        const timeElement = document.getElementById('current-time');
        const dateElement = document.getElementById('current-date');
        
        if (timeElement) {
            timeElement.textContent = currentTime;
        }
        
        if (dateElement) {
            dateElement.textContent = currentDate;
        }
    }
    
    // 初始化时间
    updateDateTime();
    // 每秒更新时间
    setInterval(updateDateTime, 1000);
    
    // 切换开关交互
    const toggleSwitches = document.querySelectorAll('.toggle-switch input');
    toggleSwitches.forEach(toggle => {
        toggle.addEventListener('change', function() {
            const parent = this.closest('.setting-item');
            if (parent) {
                if (this.checked) {
                    parent.style.color = '#0ff';
                    parent.querySelector('span').style.textShadow = '0 0 5px #0ff';
                } else {
                    parent.style.color = '#e0e0ff';
                    parent.querySelector('span').style.textShadow = 'none';
                }
            }
        });
    });
    
    // 主题颜色选择
    const colorOptions = document.querySelectorAll('.color-option');
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            colorOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            
            // 获取颜色并应用到部分元素
            const bgColor = window.getComputedStyle(this).backgroundColor;
            document.documentElement.style.setProperty('--primary-color', bgColor);
        });
    });
    
    // 壁纸选择
    const wallpaperOptions = document.querySelectorAll('.wallpaper-option');
    const wallpaperConfigs = {
        'cyber-city': {
            bodyBg: 'linear-gradient(135deg, #0f0f1a, #3a0ca3)',
            sidebarBg: 'rgba(10, 10, 20, 0.95)',
            contentBg: 'rgba(15, 15, 30, 0.85)',
            cardBg: 'rgba(20, 20, 45, 0.7)',
            textColor: '#e0e0ff',
            headingColor: '#0ff',
            borderColor: 'rgba(0, 255, 255, 0.15)',
            isWhite: false
        },
        'neon-sunset': {
            bodyBg: 'linear-gradient(135deg, #1a0f0f, #ca6702)',
            sidebarBg: 'rgba(20, 10, 10, 0.95)',
            contentBg: 'rgba(30, 15, 15, 0.85)',
            cardBg: 'rgba(40, 20, 15, 0.7)',
            textColor: '#ffe0cc',
            headingColor: '#ff8c00',
            borderColor: 'rgba(255, 140, 0, 0.15)',
            isWhite: false
        },
        'matrix-green': {
            bodyBg: 'linear-gradient(135deg, #0f1a0f, #38b000)',
            sidebarBg: 'rgba(10, 20, 10, 0.95)',
            contentBg: 'rgba(15, 30, 15, 0.85)',
            cardBg: 'rgba(20, 40, 20, 0.7)',
            textColor: '#c0ffc0',
            headingColor: '#38b000',
            borderColor: 'rgba(56, 176, 0, 0.15)',
            isWhite: false
        },
        'purple-code': {
            bodyBg: 'linear-gradient(135deg, #1a0f1a, #9d4edd)',
            sidebarBg: 'rgba(20, 10, 20, 0.95)',
            contentBg: 'rgba(30, 15, 30, 0.85)',
            cardBg: 'rgba(40, 20, 40, 0.7)',
            textColor: '#e8d0ff',
            headingColor: '#c77dff',
            borderColor: 'rgba(157, 78, 221, 0.15)',
            isWhite: false
        },
        'pure-white': {
            bodyBg: 'linear-gradient(135deg, #ffffff, #f5f0f5)',
            sidebarBg: 'rgba(255, 255, 255, 0.95)',
            contentBg: 'rgba(248, 245, 250, 0.95)',
            cardBg: 'rgba(255, 240, 245, 0.8)',
            textColor: '#4a3a4a',
            headingColor: '#ff8fab',
            borderColor: 'rgba(255, 143, 171, 0.2)',
            isWhite: true
        }
    };

    function applyWallpaper(wallpaperId) {
        var config = wallpaperConfigs[wallpaperId];
        if (!config) return;

        document.body.style.background = config.bodyBg;
        document.body.style.color = config.textColor;

        var sidebar = document.querySelector('.sidebar');
        if (sidebar) {
            sidebar.style.background = config.sidebarBg;
            sidebar.style.borderColor = config.borderColor;
        }

        var content = document.querySelector('.content');
        if (content) {
            content.style.background = config.contentBg;
        }

        var contentHeader = document.querySelector('.content-header');
        if (contentHeader) {
            contentHeader.style.borderColor = config.borderColor;
        }

        var cards = document.querySelectorAll('.card');
        cards.forEach(function(card) {
            card.style.background = config.cardBg;
            card.style.borderColor = config.borderColor;
        });

        var headings = document.querySelectorAll('.content-section h3, .settings-panel h4');
        headings.forEach(function(h) {
            h.style.color = config.headingColor;
        });

        var settingItems = document.querySelectorAll('.setting-item span');
        settingItems.forEach(function(span) {
            span.style.color = config.textColor;
        });

        var panels = document.querySelectorAll('.settings-panel');
        panels.forEach(function(panel) {
            panel.style.background = config.cardBg;
            panel.style.borderColor = config.borderColor;
        });

        if (config.isWhite) {
            document.body.classList.add('white-theme');
        } else {
            document.body.classList.remove('white-theme');
        }

        try {
            localStorage.setItem('yocim_wallpaper', wallpaperId);
        } catch(e) {}
    }

    wallpaperOptions.forEach(function(option) {
        option.addEventListener('click', function() {
            wallpaperOptions.forEach(function(opt) {
                opt.classList.remove('active');
                var check = opt.querySelector('.fa-check');
                if (check) check.remove();
            });
            this.classList.add('active');
            var checkIcon = document.createElement('i');
            checkIcon.className = 'fas fa-check';
            this.insertBefore(checkIcon, this.firstChild);

            var wallpaperId = this.getAttribute('data-wallpaper');
            applyWallpaper(wallpaperId);
        });
    });

    var savedWallpaper = null;
    try {
        savedWallpaper = localStorage.getItem('yocim_wallpaper');
    } catch(e) {}
    if (savedWallpaper && wallpaperConfigs[savedWallpaper]) {
        wallpaperOptions.forEach(function(opt) {
            opt.classList.remove('active');
            var check = opt.querySelector('.fa-check');
            if (check) check.remove();
        });
        var savedOption = document.querySelector('.wallpaper-option[data-wallpaper="' + savedWallpaper + '"]');
        if (savedOption) {
            savedOption.classList.add('active');
            var checkIcon = document.createElement('i');
            checkIcon.className = 'fas fa-check';
            savedOption.insertBefore(checkIcon, savedOption.firstChild);
        }
        applyWallpaper(savedWallpaper);
    }
    
    // 语言选择
    const languageOptions = document.querySelectorAll('.language-option');
    languageOptions.forEach(option => {
        option.addEventListener('click', function() {
            languageOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // 游戏模式选择
    const modeButtons = document.querySelectorAll('.mode-btn');
    modeButtons.forEach(button => {
        button.addEventListener('click', function() {
            modeButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // 搜索框交互
    const searchInput = document.querySelector('.search-box input');
    if (searchInput) {
        searchInput.addEventListener('focus', function() {
            this.parentElement.style.boxShadow = '0 0 20px rgba(76, 201, 240, 0.5)';
        });
        
        searchInput.addEventListener('blur', function() {
            this.parentElement.style.boxShadow = 'none';
        });
    }
    
    // 添加一些赛博朋克风格的动态效果
    createFloatingElements();
    
    function createFloatingElements() {
        const container = document.querySelector('.container');
        
        for (let i = 0; i < 15; i++) {
            const element = document.createElement('div');
            element.className = 'floating-element';
            element.style.position = 'absolute';
            element.style.width = Math.random() * 4 + 1 + 'px';
            element.style.height = Math.random() * 4 + 1 + 'px';
            element.style.background = i % 3 === 0 ? '#0ff' : (i % 3 === 1 ? '#f0f' : '#ff0');
            element.style.borderRadius = '50%';
            element.style.left = Math.random() * 100 + '%';
            element.style.top = Math.random() * 100 + '%';
            element.style.opacity = Math.random() * 0.5 + 0.1;
            element.style.boxShadow = `0 0 ${Math.random() * 10 + 5}px ${element.style.background}`;
            element.style.zIndex = '1';
            
            container.appendChild(element);
            
            // 添加浮动动画
            animateFloatingElement(element);
        }
    }
    
    function animateFloatingElement(element) {
        let x = parseFloat(element.style.left);
        let y = parseFloat(element.style.top);
        let xSpeed = (Math.random() - 0.5) * 0.2;
        let ySpeed = (Math.random() - 0.5) * 0.2;
        
        function move() {
            x += xSpeed;
            y += ySpeed;
            
            // 边界检查
            if (x < 0 || x > 100) xSpeed *= -1;
            if (y < 0 || y > 100) ySpeed *= -1;
            
            element.style.left = x + '%';
            element.style.top = y + '%';
            
            requestAnimationFrame(move);
        }
        
        move();
    }
    
    // 添加键盘快捷键
    document.addEventListener('keydown', function(e) {
        // Alt + B 返回
        if (e.altKey && e.key === 'b') {
            history.back();
        }
        
        // Alt + S 聚焦搜索框
        if (e.altKey && e.key === 's') {
            if (searchInput) {
                searchInput.focus();
            }
        }
    });
    
    // 添加一些控制台日志（赛博朋克风格）
    console.log('%c=== 系统设置界面已加载 ===', 'color: #0ff; font-size: 16px; font-weight: bold;');
    console.log('%c> 安全协议: 激活', 'color: #0f0;');
    console.log('%c> 神经接口: 就绪', 'color: #0ff;');
    console.log('%c> 用户身份: 已验证', 'color: #f0f;');
    console.log('%c=== 欢迎回来，管理员 ===', 'color: #fff; font-size: 14px;');
});
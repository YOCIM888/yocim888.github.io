document.addEventListener('DOMContentLoaded', function() {
    // 元素引用
    const video = document.getElementById('mainVideo');
    const playPauseBtn = document.getElementById('playPause');
    const skipBackBtn = document.getElementById('skipBack');
    const skipForwardBtn = document.getElementById('skipForward');
    const volumeSlider = document.getElementById('volumeSlider');
    const muteToggleBtn = document.getElementById('muteToggle');
    const progressBar = document.getElementById('progressBar');
    const progressFill = document.querySelector('.progress-fill');
    const currentTimeEl = document.getElementById('currentTime');
    const totalTimeEl = document.getElementById('totalTime');
    const speedControlBtn = document.getElementById('speedControl');
    const pipButton = document.getElementById('pipButton');
    const fullscreenButton = document.getElementById('fullscreenButton');
    const settingsButton = document.getElementById('settingsButton');
    const closeSettingsBtn = document.getElementById('closeSettings');
    const settingsPanel = document.getElementById('settingsPanel');
    const folderBtn = document.getElementById('folderBtn');
    const localFileBtn = document.getElementById('localFileBtn');
    const fileInput = document.getElementById('fileInput');
    const playlist = document.getElementById('playlist');
    const clearPlaylistBtn = document.getElementById('clearPlaylist');
    const playlistCount = document.getElementById('playlistCount');
    const playerStatus = document.getElementById('playerStatus');
    const videoFormat = document.getElementById('videoFormat');
    const videoResolution = document.getElementById('videoResolution');
    const sampleItems = document.querySelectorAll('.sample-item');
    
    // 设置面板元素
    const themeSelect = document.getElementById('themeSelect');
    const autoplayToggle = document.getElementById('autoplayToggle');
    const defaultVolume = document.getElementById('defaultVolume');
    const volumeValue = document.getElementById('volumeValue');
    const playbackRate = document.getElementById('playbackRate');
    const rateValue = document.getElementById('rateValue');
    
    // 播放列表数组
    let playlistItems = [];
    let currentPlaylistIndex = -1;
    
    // 初始化
    function init() {
        // 设置视频事件监听
        video.addEventListener('loadedmetadata', updateVideoInfo);
        video.addEventListener('timeupdate', updateProgress);
        video.addEventListener('ended', handleVideoEnded);
        video.addEventListener('volumechange', updateVolumeUI);
        
        // 设置按钮事件监听
        playPauseBtn.addEventListener('click', togglePlayPause);
        skipBackBtn.addEventListener('click', skipBackward);
        skipForwardBtn.addEventListener('click', skipForward);
        volumeSlider.addEventListener('input', changeVolume);
        muteToggleBtn.addEventListener('click', toggleMute);
        progressBar.addEventListener('input', seekVideo);
        speedControlBtn.addEventListener('click', changePlaybackSpeed);
        pipButton.addEventListener('click', togglePIP);
        fullscreenButton.addEventListener('click', toggleFullscreen);
        settingsButton.addEventListener('click', () => settingsPanel.style.display = 'block');
        closeSettingsBtn.addEventListener('click', () => settingsPanel.style.display = 'none');
        
        // 文件夹和文件选择
        folderBtn.addEventListener('click', () => alert('注意：文件夹选择功能在部分浏览器中可能受限。请使用"选择视频文件"功能选择多个文件。'));
        localFileBtn.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', handleFileSelect);
        
        // 播放列表功能
        clearPlaylistBtn.addEventListener('click', clearPlaylist);
        
        // 样例视频点击事件
        sampleItems.forEach(item => {
            item.addEventListener('click', function() {
                const url = this.getAttribute('data-url');
                const title = this.getAttribute('data-title');
                addToPlaylist(url, title, true);
            });
        });
        
        // 设置面板事件
        defaultVolume.addEventListener('input', function() {
            volumeValue.textContent = this.value;
            video.volume = this.value / 100;
            volumeSlider.value = this.value;
        });
        
        playbackRate.addEventListener('input', function() {
            const rate = this.value / 10;
            rateValue.textContent = rate.toFixed(1) + 'x';
            video.playbackRate = rate;
            speedControlBtn.innerHTML = `<span>${rate.toFixed(1)}x</span>`;
        });
        
        themeSelect.addEventListener('change', changeTheme);
        
        // 初始化播放器状态
        updatePlayerStatus('就绪');
        updateVolumeUI();
        
        // 加载存储的设置
        loadSettings();
        
        // 隐藏设置面板（如果点击外部）
        window.addEventListener('click', (e) => {
            if (e.target === settingsPanel) {
                settingsPanel.style.display = 'none';
            }
        });
    }
    
    // 播放/暂停切换
    function togglePlayPause() {
        if (video.paused) {
            video.play();
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            updatePlayerStatus('播放中');
        } else {
            video.pause();
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            updatePlayerStatus('已暂停');
        }
    }
    
    // 快退
    function skipBackward() {
        video.currentTime = Math.max(0, video.currentTime - 10);
    }
    
    // 快进
    function skipForward() {
        video.currentTime = Math.min(video.duration, video.currentTime + 10);
    }
    
    // 调整音量
    function changeVolume() {
        video.volume = volumeSlider.value / 100;
        updateVolumeUI();
    }
    
    // 静音切换
    function toggleMute() {
        video.muted = !video.muted;
        updateVolumeUI();
    }
    
    // 更新音量UI
    function updateVolumeUI() {
        if (video.muted) {
            muteToggleBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
            volumeSlider.value = 0;
        } else {
            const volume = video.volume * 100;
            volumeSlider.value = volume;
            if (volume === 0) {
                muteToggleBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
            } else if (volume < 50) {
                muteToggleBtn.innerHTML = '<i class="fas fa-volume-down"></i>';
            } else {
                muteToggleBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
            }
        }
    }
    
    // 更新进度条
    function updateProgress() {
        if (!isNaN(video.duration)) {
            const progress = (video.currentTime / video.duration) * 100;
            progressBar.value = progress;
            progressFill.style.width = `${progress}%`;
            
            currentTimeEl.textContent = formatTime(video.currentTime);
            totalTimeEl.textContent = formatTime(video.duration);
        }
    }
    
    // 跳转到指定时间
    function seekVideo() {
        const time = (progressBar.value / 100) * video.duration;
        video.currentTime = time;
    }
    
    // 改变播放速度
    function changePlaybackSpeed() {
        const speeds = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];
        const currentSpeed = video.playbackRate;
        let nextIndex = speeds.indexOf(currentSpeed) + 1;
        
        if (nextIndex >= speeds.length) nextIndex = 0;
        
        video.playbackRate = speeds[nextIndex];
        speedControlBtn.innerHTML = `<span>${speeds[nextIndex]}x</span>`;
    }
    
    // 画中画模式
    function togglePIP() {
        if (document.pictureInPictureElement) {
            document.exitPictureInPicture();
        } else if (document.pictureInPictureEnabled) {
            video.requestPictureInPicture();
        }
    }
    
    // 全屏模式
    function toggleFullscreen() {
        const container = document.querySelector('.player-container');
        
        if (!document.fullscreenElement) {
            if (container.requestFullscreen) {
                container.requestFullscreen();
            } else if (container.webkitRequestFullscreen) {
                container.webkitRequestFullscreen();
            } else if (container.msRequestFullscreen) {
                container.msRequestFullscreen();
            }
            fullscreenButton.innerHTML = '<i class="fas fa-compress"></i>';
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
            fullscreenButton.innerHTML = '<i class="fas fa-expand"></i>';
        }
    }
    
    // 处理文件选择
    function handleFileSelect(e) {
        const files = Array.from(e.target.files);
        const videoFiles = files.filter(file => file.type.startsWith('video/'));
        
        if (videoFiles.length === 0) {
            alert('未选择视频文件。请选择至少一个视频文件。');
            return;
        }
        
        // 清空现有播放列表
        playlistItems = [];
        
        // 添加文件到播放列表
        videoFiles.forEach(file => {
            const url = URL.createObjectURL(file);
            addToPlaylist(url, file.name, false);
        });
        
        // 自动播放第一个视频
        if (playlistItems.length > 0) {
            playFromPlaylist(0);
        }
        
        // 重置文件输入，允许再次选择相同文件
        fileInput.value = '';
    }
    
    // 添加到播放列表
    function addToPlaylist(url, title, isSample) {
        const id = Date.now() + Math.random();
        const item = { id, url, title, isSample };
        playlistItems.push(item);
        
        updatePlaylistDisplay();
        
        // 如果是第一个项目，自动播放
        if (playlistItems.length === 1 && !isSample) {
            playFromPlaylist(0);
        }
    }
    
    // 更新播放列表显示
    function updatePlaylistDisplay() {
        playlist.innerHTML = '';
        playlistCount.textContent = `(${playlistItems.length})`;
        
        playlistItems.forEach((item, index) => {
            const playlistItem = document.createElement('div');
            playlistItem.className = `playlist-item ${index === currentPlaylistIndex ? 'active' : ''}`;
            playlistItem.dataset.index = index;
            
            playlistItem.innerHTML = `
                <div class="playlist-item-icon">
                    <i class="fas ${item.isSample ? 'fa-satellite' : 'fa-file-video'}"></i>
                </div>
                <div class="playlist-item-info">
                    <div class="playlist-item-title">${item.title}</div>
                    <div class="playlist-item-duration">${item.isSample ? '在线视频' : '本地文件'}</div>
                </div>
            `;
            
            playlistItem.addEventListener('click', () => playFromPlaylist(index));
            playlist.appendChild(playlistItem);
        });
    }
    
    // 从播放列表播放
    function playFromPlaylist(index) {
        if (index < 0 || index >= playlistItems.length) return;
        
        const item = playlistItems[index];
        video.src = item.url;
        video.play();
        
        currentPlaylistIndex = index;
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        updatePlayerStatus('播放中');
        updatePlaylistDisplay();
        
        // 更新视频信息
        setTimeout(updateVideoInfo, 500);
    }
    
    // 清空播放列表
    function clearPlaylist() {
        if (playlistItems.length === 0) return;
        
        if (confirm('确定要清空播放列表吗？')) {
            // 释放对象URL
            playlistItems.forEach(item => {
                if (!item.isSample) {
                    URL.revokeObjectURL(item.url);
                }
            });
            
            playlistItems = [];
            currentPlaylistIndex = -1;
            updatePlaylistDisplay();
            video.src = '';
            updatePlayerStatus('就绪');
        }
    }
    
    // 视频结束处理
    function handleVideoEnded() {
        if (autoplayToggle.checked && playlistItems.length > 0) {
            const nextIndex = (currentPlaylistIndex + 1) % playlistItems.length;
            playFromPlaylist(nextIndex);
        } else {
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            updatePlayerStatus('播放结束');
        }
    }
    
    // 更新视频信息
    function updateVideoInfo() {
        if (!isNaN(video.duration)) {
            totalTimeEl.textContent = formatTime(video.duration);
            
            // 获取视频格式
            const src = video.currentSrc || video.src;
            const format = src.split('.').pop().toUpperCase();
            videoFormat.textContent = format;
            
            // 获取视频分辨率
            videoResolution.textContent = `${video.videoWidth}×${video.videoHeight}`;
            
            // 更新数据读数
            document.querySelector('.data-value').textContent = '0%';
        }
    }
    
    // 更新播放器状态
    function updatePlayerStatus(status) {
        playerStatus.textContent = status;
        
        // 更新状态指示器颜色
        const statusIndicator = document.querySelector('.status-indicator');
        if (status === '播放中') {
            statusIndicator.style.backgroundColor = '#00ff9d';
            statusIndicator.style.boxShadow = '0 0 10px #00ff9d';
        } else if (status === '已暂停') {
            statusIndicator.style.backgroundColor = '#ffcc00';
            statusIndicator.style.boxShadow = '0 0 10px #ffcc00';
        } else if (status === '播放结束') {
            statusIndicator.style.backgroundColor = '#ff375f';
            statusIndicator.style.boxShadow = '0 0 10px #ff375f';
        } else {
            statusIndicator.style.backgroundColor = '#00f3ff';
            statusIndicator.style.boxShadow = '0 0 10px #00f3ff';
        }
    }
    
    // 改变主题
    function changeTheme() {
        const theme = themeSelect.value;
        const root = document.documentElement;
        
        // 移除现有主题类
        document.body.classList.remove('cyber-theme', 'matrix-theme', 'neon-theme');
        
        // 添加新主题类
        document.body.classList.add(`${theme}-theme`);
        
        // 根据主题更改颜色
        let primaryColor, secondaryColor;
        
        switch(theme) {
            case 'cyber':
                primaryColor = '#00f3ff';
                secondaryColor = '#00ff9d';
                break;
            case 'matrix':
                primaryColor = '#00ff41';
                secondaryColor = '#00ff9d';
                break;
            case 'neon':
                primaryColor = '#ff00ff';
                secondaryColor = '#00ffff';
                break;
            default:
                primaryColor = '#00f3ff';
                secondaryColor = '#00ff9d';
        }
        
        // 更新CSS变量
        document.documentElement.style.setProperty('--primary-color', primaryColor);
        document.documentElement.style.setProperty('--secondary-color', secondaryColor);
        
        // 保存主题选择
        saveSettings();
    }
    
    // 保存设置
    function saveSettings() {
        const settings = {
            theme: themeSelect.value,
            autoplay: autoplayToggle.checked,
            volume: defaultVolume.value,
            playbackRate: playbackRate.value
        };
        
        localStorage.setItem('cyberplayer_settings', JSON.stringify(settings));
    }
    
    // 加载设置
    function loadSettings() {
        const saved = localStorage.getItem('cyberplayer_settings');
        
        if (saved) {
            const settings = JSON.parse(saved);
            
            themeSelect.value = settings.theme || 'cyber';
            autoplayToggle.checked = settings.autoplay !== false;
            defaultVolume.value = settings.volume || 80;
            playbackRate.value = settings.playbackRate || 10;
            
            // 应用设置
            changeTheme();
            video.volume = defaultVolume.value / 100;
            volumeSlider.value = defaultVolume.value;
            volumeValue.textContent = defaultVolume.value;
            
            const rate = playbackRate.value / 10;
            video.playbackRate = rate;
            rateValue.textContent = rate.toFixed(1) + 'x';
            speedControlBtn.innerHTML = `<span>${rate.toFixed(1)}x</span>`;
        }
    }
    
    // 辅助函数：格式化时间
    function formatTime(seconds) {
        if (isNaN(seconds)) return '00:00';
        
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    
    // 键盘快捷键
    document.addEventListener('keydown', (e) => {
        // 忽略在输入框中的按键
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        
        switch(e.key) {
            case ' ':
            case 'k':
                e.preventDefault();
                togglePlayPause();
                break;
            case 'f':
                toggleFullscreen();
                break;
            case 'm':
                toggleMute();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                skipBackward();
                break;
            case 'ArrowRight':
                e.preventDefault();
                skipForward();
                break;
            case '>':
            case '.':
                e.preventDefault();
                changePlaybackSpeed();
                break;
            case 'Escape':
                if (document.fullscreenElement) {
                    toggleFullscreen();
                }
                break;
        }
    });
    
    // 初始化播放器
    init();
    
    // 添加主题样式
    const style = document.createElement('style');
    style.textContent = `
        .matrix-theme {
            --primary-color: #00ff41;
            --secondary-color: #00ff9d;
        }
        
        .matrix-theme .cyberpunk-glitch,
        .matrix-theme .hud-text,
        .matrix-theme .cyber-button,
        .matrix-theme .section-icon,
        .matrix-theme .status-text,
        .matrix-theme .info-value {
            color: #00ff41 !important;
            text-shadow: 0 0 10px #00ff41 !important;
        }
        
        .matrix-theme .scanline {
            background: linear-gradient(to right, transparent, #00ff41, transparent) !important;
        }
        
        .matrix-theme .grid-overlay {
            background-image: 
                linear-gradient(rgba(0, 255, 65, 0.05) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0, 255, 65, 0.05) 1px, transparent 1px) !important;
        }
        
        .neon-theme {
            --primary-color: #ff00ff;
            --secondary-color: #00ffff;
        }
        
        .neon-theme .cyberpunk-glitch,
        .neon-theme .hud-text,
        .neon-theme .cyber-button,
        .neon-theme .section-icon,
        .neon-theme .status-text,
        .neon-theme .info-value {
            color: #ff00ff !important;
            text-shadow: 0 0 10px #ff00ff !important;
        }
        
        .neon-theme .scanline {
            background: linear-gradient(to right, transparent, #ff00ff, transparent) !important;
        }
        
        .neon-theme .grid-overlay {
            background-image: 
                linear-gradient(rgba(255, 0, 255, 0.05) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 0, 255, 0.05) 1px, transparent 1px) !important;
        }
    `;
    document.head.appendChild(style);
});
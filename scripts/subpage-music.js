(function() {
    var playlist = [
        { title: 'Afterglow', src: '../public/audio/Afterglow – Chill Background Music ｜ Tokyo Music Walker.mp3' },
        { title: 'Purple Sleep', src: '../public/audio/Purple sleep.mp3' },
        { title: 'Vibrant Positivity', src: '../public/audio/Vibrant Positivity.mp3' },
        { title: '平淡的爱情', src: '../public/audio/平淡的爱情.mp3' },
        { title: '日常的孤独', src: '../public/audio/日常的孤独.mp3' }
    ];

    var playerIcon = document.getElementById('subpagePlayerIcon');
    var playerPanel = document.getElementById('subpageMusicPlayer');
    var closeBtn = document.getElementById('subpageClosePlayer');
    var playPauseBtn = document.getElementById('subpagePlayPauseBtn');
    var prevBtn = document.getElementById('subpagePrevBtn');
    var nextBtn = document.getElementById('subpageNextBtn');
    var progressBar = document.getElementById('subpageProgressBar');
    var currentTimeSpan = document.getElementById('subpageCurrentTime');
    var durationSpan = document.getElementById('subpageDuration');
    var songNameSpan = document.getElementById('subpageCurrentSong');

    if (!playerIcon || !playerPanel) return;

    var audio = new Audio();
    var currentIndex = 0;
    var isPlaying = false;
    var isPanelVisible = false;

    function loadSong(index) {
        if (playlist.length === 0) return;
        var song = playlist[index];
        audio.src = song.src;
        songNameSpan.textContent = song.title || '未知曲目';
        audio.load();
        if (isPlaying) {
            audio.play().catch(function(e) { console.log('自动播放被阻止'); });
        }
        updatePlayPauseIcon();
    }

    function updatePlayPauseIcon() {
        var icon = playPauseBtn.querySelector('i');
        icon.className = isPlaying ? 'fas fa-pause' : 'fas fa-play';
    }

    function formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        var mins = Math.floor(seconds / 60);
        var secs = Math.floor(seconds % 60);
        return mins + ':' + (secs < 10 ? '0' : '') + secs;
    }

    function updateProgress() {
        if (audio.duration) {
            var progress = (audio.currentTime / audio.duration) * 100;
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

    function saveState() {
        try {
            localStorage.setItem('yocim_music_state', JSON.stringify({
                currentIndex: currentIndex,
                isPlaying: isPlaying,
                currentTime: audio.currentTime || 0,
                timestamp: Date.now()
            }));
        } catch(e) {}
    }

    function restoreState() {
        try {
            var saved = localStorage.getItem('yocim_music_state');
            if (!saved) return false;
            var state = JSON.parse(saved);
            var elapsed = (Date.now() - state.timestamp) / 1000;
            currentIndex = state.currentIndex || 0;
            if (playlist.length > 0) {
                audio.src = playlist[currentIndex].src;
                songNameSpan.textContent = playlist[currentIndex].title || '未知曲目';
                audio.load();
                audio.addEventListener('loadedmetadata', function onMeta() {
                    audio.removeEventListener('loadedmetadata', onMeta);
                    if (state.currentTime && state.currentTime > 0) {
                        var targetTime = state.currentTime + elapsed;
                        if (targetTime < audio.duration) {
                            audio.currentTime = targetTime;
                        }
                    }
                    if (state.isPlaying) {
                        audio.play().catch(function(e) { console.log('自动播放被阻止'); });
                        isPlaying = true;
                        updatePlayPauseIcon();
                    }
                });
            }
            return true;
        } catch(e) {
            return false;
        }
    }

    playerIcon.addEventListener('click', function(e) {
        e.stopPropagation();
        showPanel(true);
    });

    closeBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        showPanel(false);
    });

    document.addEventListener('click', function(e) {
        if (isPanelVisible && !playerPanel.contains(e.target) && e.target !== playerIcon && !playerIcon.contains(e.target)) {
            showPanel(false);
        }
    });

    playPauseBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        if (playlist.length === 0) return;
        if (audio.src === '') {
            loadSong(currentIndex);
        }
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play().catch(function(e) { alert('歌曲加载失败'); });
        }
        isPlaying = !isPlaying;
        updatePlayPauseIcon();
        saveState();
    });

    prevBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        if (playlist.length === 0) return;
        currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
        loadSong(currentIndex);
        saveState();
    });

    nextBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        if (playlist.length === 0) return;
        currentIndex = (currentIndex + 1) % playlist.length;
        loadSong(currentIndex);
        saveState();
    });

    progressBar.addEventListener('input', function(e) {
        if (audio.duration) {
            var seekTime = (e.target.value / 100) * audio.duration;
            audio.currentTime = seekTime;
        }
    });

    audio.addEventListener('loadedmetadata', function() {
        durationSpan.textContent = formatTime(audio.duration);
        progressBar.value = 0;
    });

    audio.addEventListener('timeupdate', updateProgress);

    audio.addEventListener('ended', function() {
        nextBtn.click();
    });

    playerPanel.classList.add('hidden');

    playerPanel.addEventListener('click', function(e) { e.stopPropagation(); });

    window.addEventListener('beforeunload', saveState);

    if (!restoreState() && playlist.length > 0) {
        audio.src = playlist[0].src;
        songNameSpan.textContent = playlist[0].title || '未知曲目';
    }
})();

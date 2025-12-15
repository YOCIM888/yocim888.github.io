// 赛博朋克音乐播放器功能
document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const musicIcon = document.getElementById('music-icon');
    const playerPanel = document.getElementById('player-panel');
    const playerOverlay = document.getElementById('player-overlay');
    const playBtn = document.getElementById('play-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const volumeBtn = document.getElementById('volume-btn');
    const volumeSlider = document.getElementById('volume-slider');
    const progressFill = document.querySelector('.progress-fill');
    const progressHandle = document.querySelector('.progress-handle');
    const progressTrack = document.querySelector('.progress-track');
    const currentTimeEl = document.getElementById('current-time');
    const totalTimeEl = document.getElementById('total-time');
    const songTitle = document.getElementById('song-title');
    const songArtist = document.getElementById('song-artist');
    const trackNumber = document.getElementById('track-number');
    const playlistEl = document.getElementById('playlist');
    const neonDisc = document.querySelector('.neon-disc');
    
    // 音乐文件列表 - 请根据您的实际文件修改这些路径
    const songs = [
        { title: "Stay with Me Lofi", artist: "Momo Roth", src: "audio/Stay with Me Lofi.mp3" },
        { title: "Умри, если меня не любишь", artist: "Dakooka", src: "audio/Умри, если меня не любишь.mp3" },
        { title: "I Really Want to stay at Your House", artist: "任舒瞳", src: "audio/I Really Want to stay at Your House.mp3"}, 
        { title: "Call of Silence",artist:"星痴",src:"audio/Call of Silence.mp3"}
    ];
    
    // 当前播放状态
    let currentSongIndex = 0;
    let isPlaying = false;
    let currentVolume = 0.8;
    
    // 创建音频对象
    const audio = new Audio();
    audio.volume = currentVolume;
    audio.src = songs[currentSongIndex].src;
    
    // 初始化
    updateSongInfo();
    renderPlaylist();
    
    // 切换播放器显示/隐藏
    musicIcon.addEventListener('click', function(e) {
        e.stopPropagation();
        playerPanel.style.display = 'block';
        playerOverlay.style.display = 'block';
    });
    
    playerOverlay.addEventListener('click', function() {
        playerPanel.style.display = 'none';
        playerOverlay.style.display = 'none';
    });
    
    // 播放/暂停
    playBtn.addEventListener('click', function() {
        if (isPlaying) {
            pauseSong();
        } else {
            playSong();
        }
    });
    
    // 上一首
    prevBtn.addEventListener('click', function() {
        currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
        loadSong(currentSongIndex);
        playSong();
    });
    
    // 下一首
    nextBtn.addEventListener('click', function() {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
        loadSong(currentSongIndex);
        playSong();
    });
    
    // 音量控制
    volumeSlider.addEventListener('input', function() {
        currentVolume = this.value / 100;
        audio.volume = currentVolume;
        updateVolumeIcon();
    });
    
    volumeBtn.addEventListener('click', function() {
        if (currentVolume > 0) {
            audio.volume = 0;
            volumeSlider.value = 0;
            currentVolume = 0;
        } else {
            audio.volume = 0.8;
            volumeSlider.value = 80;
            currentVolume = 0.8;
        }
        updateVolumeIcon();
    });
    
    // 进度条控制
    progressTrack.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const percentage = (e.clientX - rect.left) / rect.width;
        audio.currentTime = percentage * audio.duration;
        updateProgressBar();
    });
    
    // 音频事件监听
    audio.addEventListener('timeupdate', updateProgressBar);
    audio.addEventListener('loadedmetadata', function() {
        totalTimeEl.textContent = formatTime(audio.duration);
    });
    audio.addEventListener('ended', function() {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
        loadSong(currentSongIndex);
        playSong();
    });
    
    // 播放歌曲
    function playSong() {
        audio.play();
        isPlaying = true;
        playBtn.classList.add('playing');
        neonDisc.classList.add('playing');
    }
    
    // 暂停歌曲
    function pauseSong() {
        audio.pause();
        isPlaying = false;
        playBtn.classList.remove('playing');
        neonDisc.classList.remove('playing');
    }
    
    // 加载歌曲
    function loadSong(index) {
        audio.src = songs[index].src;
        updateSongInfo();
        
        // 更新播放列表高亮
        const playlistItems = playlistEl.querySelectorAll('li');
        playlistItems.forEach((item, i) => {
            if (i === index) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
        
        if (isPlaying) {
            audio.play();
        }
    }
    
    // 更新歌曲信息
    function updateSongInfo() {
        const song = songs[currentSongIndex];
        songTitle.textContent = song.title;
        songArtist.textContent = song.artist;
        trackNumber.textContent = (currentSongIndex + 1).toString().padStart(2, '0');
    }
    
    // 更新进度条
    function updateProgressBar() {
        if (audio.duration) {
            const percentage = (audio.currentTime / audio.duration) * 100;
            progressFill.style.width = `${percentage}%`;
            progressHandle.style.left = `${percentage}%`;
            currentTimeEl.textContent = formatTime(audio.currentTime);
        }
    }
    
    // 更新音量图标
    function updateVolumeIcon() {
        const volumeIcon = volumeBtn.querySelector('svg');
        if (currentVolume === 0) {
            // 静音图标
            volumeIcon.innerHTML = '<path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>';
        } else if (currentVolume < 0.5) {
            // 低音量图标
            volumeIcon.innerHTML = '<path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z"/>';
        } else {
            // 高音量图标
            volumeIcon.innerHTML = '<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>';
        }
    }
    
    // 渲染播放列表
    function renderPlaylist() {
        playlistEl.innerHTML = '';
        songs.forEach((song, index) => {
            const li = document.createElement('li');
            li.textContent = `${(index + 1).toString().padStart(2, '0')}. ${song.title}`;
            if (index === currentSongIndex) {
                li.classList.add('active');
            }
            li.addEventListener('click', function() {
                currentSongIndex = index;
                loadSong(currentSongIndex);
                playSong();
            });
            playlistEl.appendChild(li);
        });
    }
    
    // 格式化时间显示
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    // 初始化音量图标
    updateVolumeIcon();
});
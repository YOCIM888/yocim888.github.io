document.addEventListener('DOMContentLoaded', function() {
    // 音乐数据 - 使用您提供的歌曲列表
    const songs = [
        {
            title: "call of silence",
            artist: "星痴",
            src: "system-music/Call of Silence.mp3",
        },
        {
            title: "I Really Want to stay at Your House",
            artist: "任舒瞳",
            src: "system-music/I Really Want to stay at Your House.mp3",
        },
        {
            title: "Stay with Me Lofi",
            artist: "Miki Matsubara",
            src: "system-music/Stay with Me Lofi.mp3",
        },
        {
            title: "Умри, если меня не любишь",
            artist: "Михаил Левицкий",
            src: "system-music/Умри, если меня не любишь.mp3",
        },
    ];

    // 音频播放器元素
    const audioPlayer = document.getElementById('audio-player');
    const playBtn = document.getElementById('play-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const shuffleBtn = document.getElementById('shuffle-btn');
    const repeatBtn = document.getElementById('repeat-btn');
    const progressSlider = document.getElementById('progress-slider');
    const progressFill = document.getElementById('progress-fill');
    const progressThumb = document.getElementById('progress-thumb');
    const volumeSlider = document.getElementById('volume-slider');
    const volumeFill = document.getElementById('volume-fill');
    const volumeThumb = document.getElementById('volume-thumb');
    const currentTimeEl = document.getElementById('current-time');
    const durationEl = document.getElementById('duration');
    const songTitleEl = document.getElementById('song-title');
    const songArtistEl = document.getElementById('song-artist');
    const playlistEl = document.getElementById('playlist');
    const songCountEl = document.getElementById('song-count');
    const modeTextEl = document.getElementById('mode-text');
    const albumArtContainer = document.querySelector('.album-art');
    const visualizer = document.getElementById('visualizer');

    // 播放状态
    let currentSongIndex = 0;
    let isPlaying = false;
    let isShuffled = false;
    let repeatMode = 'none'; // 'none', 'one', 'all'
    let shuffledPlaylist = [];

    // 初始化播放器
    function initPlayer() {
        loadSong(currentSongIndex);
        generatePlaylist();
        updatePlaylistUI();
        
        // 设置初始音量
        audioPlayer.volume = volumeSlider.value / 100;
        updateVolumeUI();
        
        // 设置初始播放模式文本
        updateModeText();
        
        // 设置音频源
        audioPlayer.src = songs[currentSongIndex].src;
    }

    // 加载歌曲
    function loadSong(index) {
        const song = isShuffled ? shuffledPlaylist[index] : songs[index];
        
        // 更新显示信息
        songTitleEl.textContent = song.title;
        songArtistEl.textContent = song.artist;
        
        // 更新活动播放列表项
        updateActivePlaylistItem();
        
        // 设置音频源
        audioPlayer.src = song.src;
        
        // 当元数据加载后更新时长
        audioPlayer.addEventListener('loadedmetadata', function() {
            if (!isNaN(audioPlayer.duration)) {
                durationEl.textContent = formatTime(audioPlayer.duration);
                progressSlider.max = Math.floor(audioPlayer.duration);
            }
        }, { once: true });
        
        // 加载后播放（如果当前正在播放）
        if (isPlaying) {
            audioPlayer.play().catch(e => {
                console.log("播放失败:", e);
                // 如果自动播放失败，更新UI状态
                isPlaying = false;
                playBtn.classList.remove('playing');
                albumArtContainer.classList.remove('playing');
            });
        }
    }

    // 生成播放列表HTML
    function generatePlaylist() {
        playlistEl.innerHTML = '';
        
        const songList = isShuffled ? shuffledPlaylist : songs;
        
        songList.forEach((song, index) => {
            const playlistItem = document.createElement('div');
            playlistItem.className = 'playlist-item';
            if (index === currentSongIndex) {
                playlistItem.classList.add('active');
            }
            playlistItem.dataset.index = index;
            
            // 创建播放图标
            const playIcon = document.createElement('div');
            playIcon.className = 'play-icon-small';
            if (index === currentSongIndex && isPlaying) {
                playIcon.innerHTML = '<i class="fas fa-pause"></i>';
            } else {
                playIcon.innerHTML = '<i class="fas fa-play"></i>';
            }
            
            playlistItem.appendChild(playIcon);
            
            // 创建歌曲详情
            const songDetails = document.createElement('div');
            songDetails.className = 'song-details';
            
            const songName = document.createElement('div');
            songName.className = 'song-name';
            songName.textContent = song.title;
            
            const songArtist = document.createElement('div');
            songArtist.className = 'song-artist';
            songArtist.textContent = song.artist;
            
            songDetails.appendChild(songName);
            songDetails.appendChild(songArtist);
            playlistItem.appendChild(songDetails);
            
            // 创建歌曲时长（模拟）
            const songDuration = document.createElement('div');
            songDuration.className = 'song-duration';
            songDuration.textContent = '3:45'; // 模拟时长，实际应用中应该从音频获取
            
            playlistItem.appendChild(songDuration);
            
            // 点击事件
            playlistItem.addEventListener('click', () => {
                playSongFromPlaylist(index);
            });
            
            playlistEl.appendChild(playlistItem);
        });
        
        songCountEl.textContent = `${songList.length} 首歌曲`;
    }

    // 从播放列表播放歌曲
    function playSongFromPlaylist(index) {
        currentSongIndex = index;
        loadSong(currentSongIndex);
        playSong();
        updatePlaylistUI();
    }

    // 更新播放列表UI
    function updatePlaylistUI() {
        const playlistItems = document.querySelectorAll('.playlist-item');
        const songList = isShuffled ? shuffledPlaylist : songs;
        
        playlistItems.forEach((item, index) => {
            const playIcon = item.querySelector('.play-icon-small i');
            
            if (index === currentSongIndex) {
                item.classList.add('active');
                playIcon.className = isPlaying ? 'fas fa-pause' : 'fas fa-play';
            } else {
                item.classList.remove('active');
                playIcon.className = 'fas fa-play';
            }
            
            // 更新索引
            item.dataset.index = index;
        });
    }

    // 更新活动播放列表项
    function updateActivePlaylistItem() {
        const playlistItems = document.querySelectorAll('.playlist-item');
        
        playlistItems.forEach((item, index) => {
            if (index === currentSongIndex) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    // 播放歌曲
    function playSong() {
        isPlaying = true;
        audioPlayer.play().then(() => {
            playBtn.classList.add('playing');
            playBtn.title = "暂停";
            albumArtContainer.classList.add('playing');
            
            // 显示可视化效果
            visualizer.style.display = 'flex';
            
            // 更新播放列表中的图标
            const activeItem = document.querySelector('.playlist-item.active');
            if (activeItem) {
                const playIcon = activeItem.querySelector('.play-icon-small i');
                playIcon.className = 'fas fa-pause';
            }
        }).catch(e => {
            console.log("播放失败:", e);
            isPlaying = false;
        });
    }

    // 暂停歌曲
    function pauseSong() {
        isPlaying = false;
        audioPlayer.pause();
        playBtn.classList.remove('playing');
        playBtn.title = "播放";
        albumArtContainer.classList.remove('playing');
        
        // 隐藏可视化效果
        visualizer.style.display = 'none';
        
        // 更新播放列表中的图标
        const activeItem = document.querySelector('.playlist-item.active');
        if (activeItem) {
            const playIcon = activeItem.querySelector('.play-icon-small i');
            playIcon.className = 'fas fa-play';
        }
    }

    // 切换播放/暂停
    function togglePlayPause() {
        if (isPlaying) {
            pauseSong();
        } else {
            playSong();
        }
    }

    // 播放下一首
    function playNextSong() {
        if (repeatMode === 'one') {
            audioPlayer.currentTime = 0;
            playSong();
            return;
        }
        
        const songList = isShuffled ? shuffledPlaylist : songs;
        
        if (currentSongIndex < songList.length - 1) {
            currentSongIndex++;
        } else {
            if (repeatMode === 'all') {
                currentSongIndex = 0;
            } else {
                pauseSong();
                return;
            }
        }
        
        loadSong(currentSongIndex);
        playSong();
        updatePlaylistUI();
    }

    // 播放上一首
    function playPrevSong() {
        if (repeatMode === 'one') {
            audioPlayer.currentTime = 0;
            playSong();
            return;
        }
        
        if (currentSongIndex > 0) {
            currentSongIndex--;
        } else {
            if (repeatMode === 'all') {
                currentSongIndex = (isShuffled ? shuffledPlaylist : songs).length - 1;
            } else {
                return;
            }
        }
        
        loadSong(currentSongIndex);
        playSong();
        updatePlaylistUI();
    }

    // 切换随机播放
    function toggleShuffle() {
        isShuffled = !isShuffled;
        
        if (isShuffled) {
            // 创建洗牌播放列表
            shuffledPlaylist = [...songs];
            shuffleArray(shuffledPlaylist);
            
            // 找到当前歌曲在新列表中的位置
            const currentSong = songs[currentSongIndex];
            const newIndex = shuffledPlaylist.findIndex(song => 
                song.title === currentSong.title && song.artist === currentSong.artist);
            
            if (newIndex !== -1) {
                currentSongIndex = newIndex;
            } else {
                currentSongIndex = 0;
            }
            
            shuffleBtn.style.color = '#b8860b';
            shuffleBtn.style.textShadow = '0 0 10px rgba(184, 134, 11, 0.7)';
        } else {
            // 找到当前歌曲在原列表中的位置
            const currentSong = shuffledPlaylist[currentSongIndex];
            const originalIndex = songs.findIndex(song => 
                song.title === currentSong.title && song.artist === currentSong.artist);
            
            if (originalIndex !== -1) {
                currentSongIndex = originalIndex;
            } else {
                currentSongIndex = 0;
            }
            
            shuffleBtn.style.color = '';
            shuffleBtn.style.textShadow = '';
        }
        
        generatePlaylist();
        updatePlaylistUI();
        updateModeText();
    }

    // 切换循环模式
    function toggleRepeat() {
        const modes = ['none', 'one', 'all'];
        const currentIndex = modes.indexOf(repeatMode);
        repeatMode = modes[(currentIndex + 1) % modes.length];
        
        // 更新按钮样式
        if (repeatMode === 'none') {
            repeatBtn.style.color = '';
            repeatBtn.style.textShadow = '';
        } else {
            repeatBtn.style.color = '#b8860b';
            repeatBtn.style.textShadow = '0 0 10px rgba(184, 134, 11, 0.7)';
        }
        
        updateModeText();
    }

    // 更新模式文本
    function updateModeText() {
        let modeText = '';
        
        if (isShuffled) {
            modeText += '随机播放';
        } else {
            modeText += '顺序播放';
        }
        
        if (repeatMode === 'one') {
            modeText += ' | 单曲循环';
        } else if (repeatMode === 'all') {
            modeText += ' | 列表循环';
        }
        
        modeTextEl.textContent = modeText;
    }

    // 更新音量UI
    function updateVolumeUI() {
        const volume = volumeSlider.value;
        volumeFill.style.width = `${volume}%`;
        volumeThumb.style.left = `${volume}%`;
    }

    // 更新进度UI
    function updateProgressUI() {
        if (!isNaN(audioPlayer.duration)) {
            const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
            progressFill.style.width = `${progress}%`;
            progressThumb.style.left = `${progress}%`;
            progressSlider.value = audioPlayer.currentTime;
            currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
        }
    }

    // 格式化时间（秒转换为 mm:ss）
    function formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    // 洗牌数组（Fisher-Yates算法）
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // 事件监听器
    playBtn.addEventListener('click', togglePlayPause);
    prevBtn.addEventListener('click', playPrevSong);
    nextBtn.addEventListener('click', playNextSong);
    shuffleBtn.addEventListener('click', toggleShuffle);
    repeatBtn.addEventListener('click', toggleRepeat);

    // 进度条事件
    progressSlider.addEventListener('input', function() {
        const seekTime = this.value;
        audioPlayer.currentTime = seekTime;
        updateProgressUI();
    });

    // 音量控制
    volumeSlider.addEventListener('input', function() {
        audioPlayer.volume = this.value / 100;
        updateVolumeUI();
    });

    // 音频播放器事件
    audioPlayer.addEventListener('timeupdate', function() {
        updateProgressUI();
    });

    audioPlayer.addEventListener('loadedmetadata', function() {
        if (!isNaN(this.duration)) {
            durationEl.textContent = formatTime(this.duration);
            progressSlider.max = Math.floor(this.duration);
        }
    });

    audioPlayer.addEventListener('ended', function() {
        if (repeatMode === 'one') {
            audioPlayer.currentTime = 0;
            playSong();
        } else {
            playNextSong();
        }
    });

    audioPlayer.addEventListener('error', function(e) {
        console.error('音频加载错误:', e);
        alert(`无法加载歌曲: ${songs[currentSongIndex].title}\n请检查文件路径是否正确。`);
    });

    // 初始化播放器
    initPlayer();

    // 控制台提示
    console.log("暗黑哥特音乐播放器已初始化");
    console.log("当前歌曲列表:", songs);
    console.log("注意：请确保歌曲文件位于正确的路径下");
});
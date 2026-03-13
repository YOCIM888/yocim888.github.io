document.addEventListener('DOMContentLoaded', function() {
    // 音乐数据
    const songs = [
        {
            title: "call of silence",
            artist: "星痴",
            album: "NEURAL WAVES Vol.1",
            src: "system-music/Call of Silence.mp3",
            duration: "4:39"
        },
        {
            title: "I Really Want to stay at Your House",
            artist: "任舒瞳",
            album: "CYBER CITY",
            src: "system-music/I Really Want to stay at Your House.mp3",
            duration: "1:34"
        },
        {
            title: "Stay with Me Lofi",
            artist: "Miki Matsubara",
            album: "TOKYO NIGHTS",
            src: "system-music/Stay with Me Lofi.mp3",
            duration: "2:48"
        },
        {
            title: "Умри, если меня не любишь",
            artist: "Михаил Левицкий",
            album: "EASTERN PULSE",
            src: "system-music/Умри, если меня не любишь.mp3",
            duration: "2:30"
        },
        {
            title: "Jerry _ 北鹤 - 安和桥 (纯音DJ版)",
            artist: "Jerry & 北鹤",
            album: "CITY LIGHTS",
            src: "system-music/Jerry _ 北鹤 - 安和桥 (纯音DJ版).mp3",
            duration: "4:46"
        },
        {
            title: "KOKIA (吉田亚纪子) - ありがとう… (谢谢…)",
            artist: "KOKIA (吉田亚纪子)",
            album: "THANK YOU",
            src: "system-music/KOKIA (吉田亚纪子) - ありがとう… (谢谢…).mp3",
            duration: "4:10"
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
    const timeProgress = document.getElementById('time-progress');
    const timeThumb = document.getElementById('time-thumb');
    const volumeSlider = document.getElementById('volume-slider');
    const volumeFill = document.getElementById('volume-fill');
    const volumeThumb = document.getElementById('volume-thumb');
    const currentTimeEl = document.getElementById('current-time');
    const durationEl = document.getElementById('duration');
    const songTitleEl = document.getElementById('song-title');
    const songArtistEl = document.getElementById('song-artist');
    const songAlbumEl = document.getElementById('song-album');
    const playlistEl = document.getElementById('playlist');
    const songCountEl = document.getElementById('song-count');
    const modeTextEl = document.getElementById('mode-text');
    const playIcon = document.getElementById('play-icon');
    const pauseIcon = document.getElementById('pause-icon');
    const waveform = document.getElementById('waveform');
    const clearBtn = document.getElementById('clear-btn');

    // 播放状态
    let currentSongIndex = 0;
    let isPlaying = false;
    let isShuffled = false;
    let repeatMode = 'none'; // 'none', 'one', 'all'
    let shuffledPlaylist = [];
    let totalTime = '15:32'; // 计算总时长

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
        
        // 初始化可视化效果
        initVisualizer();
        
        // 更新总时长显示
        document.getElementById('total-time').textContent = totalTime;
    }

    // 加载歌曲
    function loadSong(index) {
        const song = isShuffled ? shuffledPlaylist[index] : songs[index];
        
        // 更新显示信息
        songTitleEl.textContent = song.title;
        songArtistEl.textContent = song.artist;
        songAlbumEl.textContent = song.album;
        
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
                isPlaying = false;
                updatePlayButtonUI();
            });
        }
    }

    // 生成播放列表
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
            
            // 曲目编号
            const trackNumber = document.createElement('div');
            trackNumber.className = 'track-number';
            trackNumber.textContent = (index + 1).toString().padStart(2, '0');
            playlistItem.appendChild(trackNumber);
            
            // 歌曲信息
            const trackInfo = document.createElement('div');
            trackInfo.className = 'track-info-small';
            
            const trackTitle = document.createElement('div');
            trackTitle.className = 'track-title';
            trackTitle.textContent = song.title;
            
            const trackArtist = document.createElement('div');
            trackArtist.className = 'track-artist';
            trackArtist.textContent = song.artist;
            
            trackInfo.appendChild(trackTitle);
            trackInfo.appendChild(trackArtist);
            playlistItem.appendChild(trackInfo);
            
            // 时长
            const trackDuration = document.createElement('div');
            trackDuration.className = 'track-duration';
            trackDuration.textContent = song.duration;
            playlistItem.appendChild(trackDuration);
            
            // 点击事件
            playlistItem.addEventListener('click', () => {
                playSongFromPlaylist(index);
            });
            
            playlistEl.appendChild(playlistItem);
        });
        
        songCountEl.textContent = songList.length;
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
        
        playlistItems.forEach((item, index) => {
            if (index === currentSongIndex) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
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
            updatePlayButtonUI();
            startVisualizer();
        }).catch(e => {
            console.log("播放失败:", e);
            isPlaying = false;
            updatePlayButtonUI();
        });
    }

    // 暂停歌曲
    function pauseSong() {
        isPlaying = false;
        audioPlayer.pause();
        updatePlayButtonUI();
        stopVisualizer();
    }

    // 更新播放按钮UI
    function updatePlayButtonUI() {
        if (isPlaying) {
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
            playBtn.title = "暂停";
        } else {
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
            playBtn.title = "播放";
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
            
            shuffleBtn.style.color = '#ff00ff';
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
        repeatBtn.style.color = repeatMode === 'none' ? '' : '#00f3ff';
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
        if (!isNaN(audioPlayer.duration) && audioPlayer.duration > 0) {
            const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
            timeProgress.style.width = `${progress}%`;
            timeThumb.style.left = `${progress}%`;
            progressSlider.value = audioPlayer.currentTime;
            currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
        }
    }

    // 格式化时间
    function formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    // 洗牌数组
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // 初始化可视化效果
    function initVisualizer() {
        const waveBars = waveform.querySelectorAll('.wave-bar');
        waveBars.forEach(bar => {
            bar.style.height = '20px';
        });
    }

    // 开始可视化效果
    function startVisualizer() {
        const waveBars = waveform.querySelectorAll('.wave-bar');
        waveBars.forEach(bar => {
            bar.style.animationPlayState = 'running';
        });
    }

    // 停止可视化效果
    function stopVisualizer() {
        const waveBars = waveform.querySelectorAll('.wave-bar');
        waveBars.forEach(bar => {
            bar.style.animationPlayState = 'paused';
        });
    }

    // 事件监听器
    playBtn.addEventListener('click', togglePlayPause);
    prevBtn.addEventListener('click', playPrevSong);
    nextBtn.addEventListener('click', playNextSong);
    shuffleBtn.addEventListener('click', toggleShuffle);
    repeatBtn.addEventListener('click', toggleRepeat);
    clearBtn.addEventListener('click', () => {
        // 清空播放列表功能（示例）
        alert('清空播放列表功能');
    });

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
        if (!isNaN(this.duration) && this.duration > 0) {
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
    console.log("赛博朋克音乐播放器已初始化");
    console.log("当前歌曲列表:", songs);
});
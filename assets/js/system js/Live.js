document.addEventListener('DOMContentLoaded', function() {
    // 直播数据
    const streamsData = [
        {
            id: 1,
            title: "神经接口实战：黑客攻防",
            streamer: "CYBER_NINJA",
            category: "技术",
            tags: ["网络安全", "黑客", "编程"],
            viewers: 1247,
            thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            color: "#00f3ff"
        },
        {
            id: 2,
            title: "赛博城市夜行：2088霓虹街区",
            streamer: "NEON_WALKER",
            category: "娱乐",
            tags: ["探索", "城市", "未来"],
            viewers: 892,
            thumbnail: "https://imgs.699pic.com/images/601/452/981.jpg!detail.v1",
            color: "#ff00ff"
        },
        {
            id: 3,
            title: "电子音乐：合成器即兴创作",
            streamer: "SYNTH_MASTER",
            category: "音乐",
            tags: ["音乐", "合成器", "即兴"],
            viewers: 567,
            thumbnail: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            color: "#ffaa00"
        },
        {
            id: 4,
            title: "增强现实游戏：矩阵突围",
            streamer: "AR_GAMER",
            category: "游戏",
            tags: ["AR", "游戏", "竞技"],
            viewers: 2341,
            thumbnail: "https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            color: "#00ffaa"
        },
        {
            id: 5,
            title: "人工智能艺术：算法生成画作",
            streamer: "AI_ARTIST",
            category: "艺术",
            tags: ["AI", "艺术", "创作"],
            viewers: 432,
            thumbnail: "https://images.unsplash.com/photo-1555255707-c07966088b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            color: "#aa00ff"
        },
        {
            id: 6,
            title: "机械义肢DIY工作坊",
            streamer: "CYBER_TECH",
            category: "技术",
            tags: ["硬件", "DIY", "义肢"],
            viewers: 321,
            thumbnail: "https://images.unsplash.com/photo-1535378917042-10a22c95931a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            color: "#ff5555"
        },
        {
            id: 7,
            title: "虚拟现实社交：元宇宙派对",
            streamer: "VR_SOCIAL",
            category: "社交",
            tags: ["VR", "社交", "元宇宙"],
            viewers: 1567,
            thumbnail: "https://images.unsplash.com/photo-1542751110-97427bbecf20?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            color: "#00aaff"
        },
        {
            id: 8,
            title: "量子计算基础讲座",
            streamer: "QUANTUM_EXPERT",
            category: "教育",
            tags: ["量子", "计算", "科学"],
            viewers: 678,
            thumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            color: "#ffff00"
        },
        {
            id: 9,
            title: "暗影猎人：赛博朋克2088实况",
            streamer: "暗影猎人",
            category: "游戏",
            tags: ["赛博朋克2088", "RPG", "开放世界"],
            viewers: 3200,
            thumbnail: "https://picsum.photos/seed/shadowhunter/400/225",
            color: "#ff6b35"
        },
        {
            id: 10,
            title: "电子脉冲：Live DJ Set",
            streamer: "电子脉冲",
            category: "音乐",
            tags: ["电子音乐", "DJ", "现场"],
            viewers: 1800,
            thumbnail: "https://picsum.photos/seed/electricpulse/400/225",
            color: "#9b59b6"
        },
        {
            id: 11,
            title: "量子解码：最新科技评测",
            streamer: "量子解码",
            category: "科技",
            tags: ["评测", "硬件", "前沿"],
            viewers: 950,
            thumbnail: "https://picsum.photos/seed/quantumdecode/400/225",
            color: "#2ecc71"
        },
        {
            id: 12,
            title: "午夜信号：深夜聊天室",
            streamer: "午夜信号",
            category: "聊天",
            tags: ["互动", "深夜", "闲聊"],
            viewers: 2100,
            thumbnail: "https://picsum.photos/seed/midnightsignal/400/225",
            color: "#e74c3c"
        },
        {
            id: 13,
            title: "像素画师：数字艺术创作",
            streamer: "像素画师",
            category: "绘画",
            tags: ["数字艺术", "绘画", "创作"],
            viewers: 670,
            thumbnail: "https://picsum.photos/seed/pixelartist/400/225",
            color: "#f39c12"
        },
        {
            id: 14,
            title: "代码洪流：编程挑战赛",
            streamer: "代码洪流",
            category: "编程",
            tags: ["编程", "算法", "挑战"],
            viewers: 430,
            thumbnail: "https://picsum.photos/seed/codeflood/400/225",
            color: "#1abc9c"
        },
        {
            id: 15,
            title: "赛博厨房：未来美食制作",
            streamer: "赛博厨房",
            category: "生活",
            tags: ["美食", "烹饪", "生活"],
            viewers: 1500,
            thumbnail: "https://picsum.photos/seed/cyberkitchen/400/225",
            color: "#e67e22"
        },
        {
            id: 16,
            title: "全息影院：动画马拉松",
            streamer: "全息影院",
            category: "娱乐",
            tags: ["动画", "放映", "追番"],
            viewers: 2800,
            thumbnail: "https://picsum.photos/seed/holocinema/400/225",
            color: "#3498db"
        }
    ];

    // DOM元素
    const streamsContainer = document.querySelector('.streams-container');
    const permissionModal = document.getElementById('permissionModal');
    const closeModalBtn = document.getElementById('closeModal');
    const dismissBtn = document.getElementById('dismissBtn');
    const clickSound = document.getElementById('clickSound');

    // 生成直播卡片
    function generateStreamCards() {
        streamsContainer.innerHTML = '';
        
        streamsData.forEach(stream => {
            const streamCard = document.createElement('div');
            streamCard.className = 'stream-card';
            streamCard.setAttribute('data-id', stream.id);
            
            // 设置卡片边框颜色
            streamCard.style.borderColor = `rgba(${hexToRgb(stream.color)}, 0.3)`;
            
            streamCard.innerHTML = `
                <div class="stream-thumbnail">
                    <img src="${stream.thumbnail}" alt="${stream.title}">
                    <div class="live-badge">LIVE</div>
                    <div class="viewer-count">
                        <i class="fas fa-eye"></i> ${formatViewerCount(stream.viewers)}
                    </div>
                </div>
                <div class="stream-info">
                    <h3 class="stream-title">${stream.title}</h3>
                    <div class="streamer-info">
                        <div class="streamer-avatar" style="color: ${stream.color};">
                            <i class="fas fa-user"></i>
                        </div>
                        <div class="streamer-name">${stream.streamer}</div>
                    </div>
                    <div class="stream-tags">
                        <span class="tag" style="border-color: ${stream.color};">${stream.category}</span>
                        ${stream.tags.map(tag => `<span class="tag" style="border-color: ${stream.color};">${tag}</span>`).join('')}
                    </div>
                </div>
            `;
            
            streamsContainer.appendChild(streamCard);
        });
        
        // 为所有卡片添加点击事件
        document.querySelectorAll('.stream-card').forEach(card => {
            card.addEventListener('click', function() {
                const streamId = this.getAttribute('data-id');
                const streamData = streamsData.find(s => s.id == streamId);
                showPermissionModal(streamData);
                
                // 播放点击音效
                if (clickSound) {
                    clickSound.currentTime = 0;
                    clickSound.play().catch(e => console.log("音频播放失败:", e));
                }
            });
        });
    }

    // 显示权限提示弹窗
    function showPermissionModal(streamData) {
        // 更新弹窗内容
        document.querySelector('.modal-body h4').textContent = `无法访问: ${streamData.title}`;
        document.querySelector('.modal-body p').innerHTML = 
            `此频道需要<strong>高级神经接入权限</strong>或<strong>企业级订阅</strong>。<br>
            频道主播: <span style="color:${streamData.color}">${streamData.streamer}</span>`;
        
        // 显示弹窗
        permissionModal.classList.add('active');
        
        // 添加弹窗显示动画
        const modalContent = document.querySelector('.modal-content');
        modalContent.style.transform = 'scale(0.9)';
        setTimeout(() => {
            modalContent.style.transform = 'scale(1)';
            modalContent.style.transition = 'transform 0.3s ease';
        }, 10);
    }

    // 关闭权限提示弹窗
    function closePermissionModal() {
        const modalContent = document.querySelector('.modal-content');
        modalContent.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
            permissionModal.classList.remove('active');
            modalContent.style.transform = 'scale(1)';
        }, 300);
    }

    // 辅助函数：将十六进制颜色转换为RGB
    function hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? 
            `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` 
            : '0, 150, 255';
    }

    // 辅助函数：格式化观众数量
    function formatViewerCount(count) {
        if (count >= 1000) {
            return (count / 1000).toFixed(1) + 'K';
        }
        return count.toString();
    }

    // 初始化页面
    function initPage() {
        generateStreamCards();
        
        // 为关闭按钮添加事件
        closeModalBtn.addEventListener('click', closePermissionModal);
        dismissBtn.addEventListener('click', closePermissionModal);
        
        // 点击弹窗外部关闭弹窗
        permissionModal.addEventListener('click', function(e) {
            if (e.target === permissionModal) {
                closePermissionModal();
            }
        });
        
        // 添加键盘事件支持
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && permissionModal.classList.contains('active')) {
                closePermissionModal();
            }
        });
        
        // 添加系统状态动画
        const statusIndicator = document.querySelector('.status-indicator');
        setInterval(() => {
            if (statusIndicator.style.opacity === '0.5') {
                statusIndicator.style.opacity = '1';
            } else {
                statusIndicator.style.opacity = '0.5';
            }
        }, 1000);
        
        // 添加页面加载动画
        document.body.style.opacity = '0';
        setTimeout(() => {
            document.body.style.transition = 'opacity 0.5s ease';
            document.body.style.opacity = '1';
        }, 100);
    }

    // 启动页面
    initPage();
});
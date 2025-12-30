// 目的地数据
const destinations = [
    {
        id: 1,
        name: "东京涩谷",
        region: "asia",
        image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1194&q=80",
        description: "未来都市的缩影，霓虹灯与高科技的完美融合。涩谷十字路口是全球最繁忙的行人交叉口，展现了东京的极致都市化。",
        rating: 4.8,
        features: ["未来都市", "购物天堂", "夜生活", "高科技"],
        bestTime: "全年皆宜",
        travelTips: "体验涩谷十字路口的震撼，参观数字艺术博物馆，品尝地道拉面。",
        highlights: ["涩谷Sky观景台", "原宿时尚区", "忠犬八公像", "数码广告牌"]
    },
    {
        id: 2,
        name: "迪拜未来博物馆",
        region: "asia",
        image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        description: "阿拉伯世界的科技奇迹，展现未来生活的可能性。这座建筑本身就是一件艺术品，内部充满了互动式展览。",
        rating: 4.9,
        features: ["未来科技", "建筑奇迹", "互动展览", "创新设计"],
        bestTime: "10月-4月",
        travelTips: "提前在线购票避免排队，预留至少3小时参观时间。",
        highlights: ["未来生活展览", "太空探索区", "生态解决方案", "建筑外观"]
    },
    {
        id: 3,
        name: "纽约时代广场",
        region: "america",
        image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        description: "世界的十字路口，霓虹灯广告牌的海洋。这里是商业与娱乐的中心，24小时不停歇的活力之都。",
        rating: 4.7,
        features: ["霓虹灯海", "百老汇", "购物中心", "文化熔炉"],
        bestTime: "春季和秋季",
        travelTips: "晚上参观效果最佳，注意保管个人物品，尝试街头小吃。",
        highlights: ["跨年倒数", "百老汇演出", "巨型广告牌", "TKTS折扣票亭"]
    },
    {
        id: 4,
        name: "新加坡滨海湾",
        region: "asia",
        image: "https://images.unsplash.com/photo-1565967511849-76a60a516170?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80",
        description: "花园城市中的未来绿洲，结合自然与科技的典范。金沙酒店空中花园和超级树灯光秀不容错过。",
        rating: 4.8,
        features: ["花园城市", "未来建筑", "灯光秀", "空中花园"],
        bestTime: "全年皆宜",
        travelTips: "晚上观看灯光秀，提前预订金沙酒店观景台门票。",
        highlights: ["金沙酒店无边泳池", "超级树灯光秀", "艺术科学博物馆", "滨海湾花园"]
    },
    {
        id: 5,
        name: "冰岛极光",
        region: "europe",
        image: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        description: "自然界的终极光影秀，在冰川与火山之间舞动的绿色奇迹。",
        rating: 4.9,
        features: ["自然奇观", "极光", "冰川", "地热温泉"],
        bestTime: "9月-3月",
        travelTips: "选择无月光、晴朗的夜晚，远离城市光污染，穿着保暖衣物。",
        highlights: ["极光观测", "蓝湖温泉", "冰川徒步", "黑沙滩"]
    },
    {
        id: 6,
        name: "里约热内卢基督像",
        region: "america",
        image: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        description: "世界新七大奇迹之一，俯瞰里约全景的守护神。",
        rating: 4.7,
        features: ["世界奇迹", "全景视野", "文化象征", "历史地标"],
        bestTime: "4月-10月",
        travelTips: "早上前往避免人群，乘坐小火车上山体验更佳。",
        highlights: ["基督像全景", "科帕卡巴纳海滩", "甜面包山", "桑巴文化"]
    },
    {
        id: 7,
        name: "巴黎埃菲尔铁塔",
        region: "europe",
        image: "https://images.unsplash.com/photo-1543349689-9a4d426bee8e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1101&q=80",
        description: "钢铁巨人的浪漫，巴黎的标志性建筑，夜晚的灯光秀尤为迷人。",
        rating: 4.6,
        features: ["浪漫之都", "历史建筑", "城市全景", "灯光秀"],
        bestTime: "春季和秋季",
        travelTips: "夜晚整点有5分钟灯光秀，提前在线购票避免长时间排队。",
        highlights: ["顶层观景台", "塞纳河游船", "战神广场", "铁塔灯光秀"]
    },
    {
        id: 8,
        name: "悉尼歌剧院",
        region: "oceania",
        image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        description: "建筑史上的杰作，帆船造型与海港风景的完美结合。",
        rating: 4.7,
        features: ["建筑奇迹", "海港风景", "文化艺术", "世界遗产"],
        bestTime: "9月-11月",
        travelTips: "参加导览游了解建筑历史，晚上观看演出后欣赏夜景。",
        highlights: ["建筑导览", "海港大桥", "皇家植物园", "环形码头"]
    },
    {
        id: 9,
        name: "开普敦桌山",
        region: "africa",
        image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1153&q=80",
        description: "平顶山与海洋的壮观相遇，俯瞰开普敦全景的自然观景台。",
        rating: 4.8,
        features: ["自然奇观", "全景视野", "缆车体验", "生物多样性"],
        bestTime: "10月-3月",
        travelTips: "选择晴朗天气上山，注意缆车可能因大风停运。",
        highlights: ["山顶全景", "旋转缆车", "花卉王国", "信号山日落"]
    },
    {
        id: 10,
        name: "香港维多利亚港",
        region: "asia",
        image: "https://images.unsplash.com/photo-1536599018109-73a2d3cbb89e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        description: "东方之珠的璀璨夜景，摩天大楼与海港交相辉映的光影交响曲。",
        rating: 4.7,
        features: ["夜景", "天际线", "灯光秀", "海港游"],
        bestTime: "10月-12月",
        travelTips: "晚上8点有幻彩咏香江灯光秀，太平山顶观景最佳。",
        highlights: ["幻彩咏香江", "天星小轮", "太平山顶", "星光大道"]
    },
    {
        id: 11,
        name: "罗马斗兽场",
        region: "europe",
        image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1096&q=80",
        description: "古罗马帝国的永恒象征，角斗士历史的见证者。",
        rating: 4.8,
        features: ["历史遗迹", "古罗马", "世界遗产", "建筑奇迹"],
        bestTime: "春季和秋季",
        travelTips: "购买罗马通票可免排队，夜晚外部灯光下的斗兽场别具风情。",
        highlights: ["地下层参观", "古罗马广场", "君士坦丁凯旋门", "夜间照明"]
    },
    {
        id: 12,
        name: "马丘比丘",
        region: "america",
        image: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        description: "失落的印加城市，云雾中的古代奇迹，世界新七大奇迹之一。",
        rating: 4.9,
        features: ["古代遗迹", "世界奇迹", "高山景观", "印加文化"],
        bestTime: "5月-9月",
        travelTips: "提前数月预订门票，清晨前往避免人群和云雾。",
        highlights: ["太阳门", "印加桥", "华纳比丘", "太阳神庙"]
    }
];

// DOM元素
const destinationsGrid = document.getElementById('destinationsGrid');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const filterTags = document.querySelectorAll('.filter-tag');
const themeToggle = document.getElementById('themeToggle');
const audioToggle = document.getElementById('audioToggle');
const bgAudio = document.getElementById('bgAudio');
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const modalTitle = document.getElementById('modalTitle');
const modalContent = document.getElementById('modalContent');
const destinationCount = document.getElementById('destinationCount');
const aboutBtn = document.getElementById('aboutBtn');
const contactBtn = document.getElementById('contactBtn');
const dataBtn = document.getElementById('dataBtn');

// 当前筛选状态
let currentFilter = 'all';
let searchQuery = '';

// 初始化页面
function initPage() {
    renderDestinations(destinations);
    destinationCount.textContent = destinations.length;
    
    // 设置音频
    bgAudio.volume = 0.3;
    
    // 设置事件监听器
    setupEventListeners();
}

// 渲染目的地卡片
function renderDestinations(destinationsArray) {
    destinationsGrid.innerHTML = '';
    
    destinationsArray.forEach(destination => {
        const card = createDestinationCard(destination);
        destinationsGrid.appendChild(card);
    });
}

// 创建目的地卡片
function createDestinationCard(destination) {
    const card = document.createElement('div');
    card.className = 'destination-card';
    card.dataset.id = destination.id;
    card.dataset.region = destination.region;
    
    // 生成星级评价
    const stars = generateStars(destination.rating);
    
    card.innerHTML = `
        <div class="card-image" style="background-image: url('${destination.image}')"></div>
        <div class="card-content">
            <div class="card-header">
                <h3 class="card-title">${destination.name}</h3>
                <span class="card-region">${getRegionName(destination.region)}</span>
            </div>
            <p class="card-description">${destination.description}</p>
            <div class="card-features">
                ${destination.features.map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
            </div>
            <div class="card-footer">
                <div class="card-rating">
                    <i class="fas fa-star"></i>
                    <span>${destination.rating}</span>
                </div>
                <button class="card-button" data-id="${destination.id}">
                    <span>查看档案</span>
                </button>
            </div>
        </div>
    `;
    
    // 添加点击事件
    const viewBtn = card.querySelector('.card-button');
    viewBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showDestinationModal(destination);
    });
    
    card.addEventListener('click', () => {
        showDestinationModal(destination);
    });
    
    return card;
}

// 生成星级评价
function generateStars(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i === fullStars && hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    
    return stars;
}

// 获取区域名称
function getRegionName(regionCode) {
    const regionNames = {
        asia: '亚洲',
        europe: '欧洲',
        america: '美洲',
        africa: '非洲',
        oceania: '大洋洲'
    };
    
    return regionNames[regionCode] || regionCode;
}

// 显示目的地模态框
function showDestinationModal(destination) {
    modalTitle.textContent = destination.name;
    
    modalContent.innerHTML = `
        <div class="modal-image" style="background-image: url('${destination.image}')"></div>
        <div class="modal-details">
            <div class="modal-detail">
                <h4><i class="fas fa-map-marker-alt"></i> 地区</h4>
                <p>${getRegionName(destination.region)}</p>
            </div>
            <div class="modal-detail">
                <h4><i class="fas fa-star"></i> 评分</h4>
                <p>${destination.rating}/5.0</p>
            </div>
            <div class="modal-detail">
                <h4><i class="fas fa-calendar-alt"></i> 最佳时间</h4>
                <p>${destination.bestTime}</p>
            </div>
            <div class="modal-detail">
                <h4><i class="fas fa-tags"></i> 标签</h4>
                <p>${destination.features.join(', ')}</p>
            </div>
        </div>
        <div class="modal-detail">
            <h4><i class="fas fa-lightbulb"></i> 旅行建议</h4>
            <p>${destination.travelTips}</p>
        </div>
        <div class="modal-detail">
            <h4><i class="fas fa-gem"></i> 亮点</h4>
            <p>${destination.highlights.join(' · ')}</p>
        </div>
    `;
    
    modalOverlay.style.display = 'flex';
}

// 筛选目的地
function filterDestinations() {
    let filtered = destinations;
    
    // 应用区域筛选
    if (currentFilter !== 'all') {
        filtered = filtered.filter(destination => destination.region === currentFilter);
    }
    
    // 应用搜索筛选
    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(destination => 
            destination.name.toLowerCase().includes(query) || 
            destination.description.toLowerCase().includes(query) ||
            destination.features.some(feature => feature.toLowerCase().includes(query))
        );
    }
    
    renderDestinations(filtered);
    destinationCount.textContent = filtered.length;
}

// 设置事件监听器
function setupEventListeners() {
    // 筛选标签点击事件
    filterTags.forEach(tag => {
        tag.addEventListener('click', () => {
            // 移除所有标签的active类
            filterTags.forEach(t => t.classList.remove('active'));
            // 给当前点击的标签添加active类
            tag.classList.add('active');
            // 更新当前筛选器
            currentFilter = tag.dataset.filter;
            filterDestinations();
        });
    });
    
    // 搜索输入事件
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        filterDestinations();
    });
    
    // 搜索按钮点击事件
    searchBtn.addEventListener('click', () => {
        filterDestinations();
    });
    
    // 主题切换按钮
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        
        if (document.body.classList.contains('light-mode')) {
            document.body.style.backgroundColor = '#f0f0f5';
            document.body.style.color = '#333';
            themeToggle.querySelector('.btn-text').textContent = '夜间模式';
        } else {
            document.body.style.backgroundColor = '#0a0a16';
            document.body.style.color = '#e0e0ff';
            themeToggle.querySelector('.btn-text').textContent = '日间模式';
        }
    });
    
    // 音频切换按钮
    audioToggle.addEventListener('click', () => {
        if (bgAudio.paused) {
            bgAudio.play();
            audioToggle.querySelector('.btn-text').textContent = '静音';
        } else {
            bgAudio.pause();
            audioToggle.querySelector('.btn-text').textContent = '音频';
        }
    });
    
    // 模态框关闭按钮
    modalClose.addEventListener('click', () => {
        modalOverlay.style.display = 'none';
    });
    
    // 点击模态框外部关闭
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            modalOverlay.style.display = 'none';
        }
    });
    
    // 页脚按钮事件
    aboutBtn.addEventListener('click', () => {
        showSystemInfoModal();
    });
    
    contactBtn.addEventListener('click', () => {
        showContactModal();
    });
    
    dataBtn.addEventListener('click', () => {
        showDataModal();
    });
    
    // 初始化音频
    audioToggle.addEventListener('click', () => {
        if (bgAudio.paused) {
            bgAudio.play()
                .then(() => {
                    audioToggle.querySelector('.btn-text').textContent = '静音';
                })
                .catch(e => {
                    console.log("音频播放失败:", e);
                    alert("音频播放失败，请与页面交互后重试");
                });
        } else {
            bgAudio.pause();
            audioToggle.querySelector('.btn-text').textContent = '音频';
        }
    });
}

// 显示系统信息模态框
function showSystemInfoModal() {
    modalTitle.textContent = '关于赛博旅行者系统';
    modalContent.innerHTML = `
        <div class="modal-detail">
            <h4><i class="fas fa-info-circle"></i> 系统版本</h4>
            <p>赛博旅行者档案库 v3.2.1</p>
        </div>
        <div class="modal-detail">
            <h4><i class="fas fa-cogs"></i> 系统功能</h4>
            <p>本系统收录全球知名旅行目的地数据，采用赛博朋克风格界面，提供交互式浏览体验。所有数据定期更新，确保信息准确性。</p>
        </div>
        <div class="modal-detail">
            <h4><i class="fas fa-shield-alt"></i> 数据安全</h4>
            <p>所有数据传输均采用加密技术，用户隐私得到充分保护。系统运行于安全的云端服务器，保证7x24小时稳定运行。</p>
        </div>
        <div class="modal-detail">
            <h4><i class="fas fa-history"></i> 开发历史</h4>
            <p>2023年：系统概念提出<br>
            2024年：首版发布<br>
            2025年：全面升级至v3.0<br>
            当前版本：v3.2.1 (2025年10月)</p>
        </div>
    `;
    modalOverlay.style.display = 'flex';
}

// 显示联系模态框
function showContactModal() {
    modalTitle.textContent = '联系管理员';
    modalContent.innerHTML = `
        <div class="modal-detail">
            <h4><i class="fas fa-envelope"></i> 电子邮箱</h4>
            <p>yocim666@outlook.com</p>
        </div>
        <div class="modal-detail">
            <h4><i class="fas fa-phone"></i> 通讯频道</h4>
            <p>频率：133.7 MHz<br>
            加密协议：CT-2077</p>
        </div>
        <div class="modal-detail">
            <h4><i class="fas fa-map-marker-alt"></i> 物理地址</h4>
            <p>数字档案馆层 47<br>
            YOCIM网络中心<br>
            坐标：隐藏 N, 隐藏 E</p>
        </div>
        <div class="modal-detail">
            <h4><i class="fas fa-comments"></i> 在线支持</h4>
            <p>24/7 AI助手在线支持<br>
            响应时间：< 2秒<br>
            支持语言：全语系</p>
        </div>
    `;
    modalOverlay.style.display = 'flex';
}

// 显示数据模态框
function showDataModal() {
    modalTitle.textContent = '数据源与协议';
    modalContent.innerHTML = `
        <div class="modal-detail">
            <h4><i class="fas fa-database"></i> 数据来源</h4>
            <p>• 全球旅行者网络数据<br>
            • 文化遗产组织数据库<br>
            • 卫星遥感影像分析<br>
            • 人工智能实时收集</p>
        </div>
        <div class="modal-detail">
            <h4><i class="fas fa-sync-alt"></i> 更新频率</h4>
            <p>目的地数据：实时更新<br>
            用户评价：每10分钟同步<br>
            图像资料：每日刷新<br>
            系统日志：持续记录</p>
        </div>
        <div class="modal-detail">
            <h4><i class="fas fa-file-contract"></i> 使用协议</h4>
            <p>1. 数据仅限个人参考使用<br>
            2. 禁止商业性数据挖掘<br>
            3. 尊重目的地文化习俗<br>
            4. 旅行风险自行承担</p>
        </div>
        <div class="modal-detail">
            <h4><i class="fas fa-certificate"></i> 数据准确性</h4>
            <p>系统数据准确率：98.7%<br>
            最后全面校验：2025年9月<br>
            下一轮校验：2025年12月</p>
        </div>
    `;
    modalOverlay.style.display = 'flex';
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initPage);

// 添加键盘快捷键
document.addEventListener('keydown', (e) => {
    // ESC键关闭模态框
    if (e.key === 'Escape' && modalOverlay.style.display === 'flex') {
        modalOverlay.style.display = 'none';
    }
    
    // Ctrl+F聚焦搜索框
    if (e.ctrlKey && e.key === 'f') {
        e.preventDefault();
        searchInput.focus();
    }
    
    // 空格键切换音频
    if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault();
        audioToggle.click();
    }
});
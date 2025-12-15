// 创建动态粒子背景
function createParticles() {
    const container = document.getElementById('particles');
    const particleCount = 100;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // 随机大小和位置
        const size = Math.random() * 4 + 1;
        const posX = Math.random() * 100;
        const delay = Math.random() * 15;
        const duration = Math.random() * 10 + 10;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${posX}vw`;
        particle.style.animationDelay = `${delay}s`;
        particle.style.animationDuration = `${duration}s`;
        
        // 随机颜色
        const colors = ['#0ff', '#f0f', '#ff0', '#0f0'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        particle.style.backgroundColor = color;
        
        container.appendChild(particle);
    }
}

// 交互控制功能
document.addEventListener('DOMContentLoaded', function() {
    createParticles();
    
    // 切换网格可见性
    const toggleGridBtn = document.getElementById('toggleGrid');
    const cyberGrid = document.querySelector('.cyber-grid');
    toggleGridBtn.addEventListener('click', function() {
        cyberGrid.style.opacity = cyberGrid.style.opacity === '0' ? '0.3' : '0';
        this.classList.toggle('pulse');
    });
    
    // 切换主题颜色
    const changeThemeBtn = document.getElementById('changeTheme');
    let themeIndex = 0;
    const themes = [
        { primary: '#0ff', secondary: '#f0f', accent: '#ff0' },
        { primary: '#ff0', secondary: '#0ff', accent: '#f0f' },
        { primary: '#f0f', secondary: '#ff0', accent: '#0ff' },
        { primary: '#0f0', secondary: '#ff0', accent: '#0ff' }
    ];
    
    changeThemeBtn.addEventListener('click', function() {
        themeIndex = (themeIndex + 1) % themes.length;
        const theme = themes[themeIndex];
        
        document.documentElement.style.setProperty('--primary-color', theme.primary);
        document.documentElement.style.setProperty('--secondary-color', theme.secondary);
        document.documentElement.style.setProperty('--accent-color', theme.accent);
        
        // 更新粒子颜色
        const particles = document.querySelectorAll('.particle');
        particles.forEach(particle => {
            const colors = [theme.primary, theme.secondary, theme.accent];
            const color = colors[Math.floor(Math.random() * colors.length)];
            particle.style.backgroundColor = color;
        });
    });
    
    // 粒子风暴效果
    const particleStormBtn = document.getElementById('particleStorm');
    particleStormBtn.addEventListener('click', function() {
        const particlesContainer = document.getElementById('particles');
        particlesContainer.innerHTML = '';
        
        // 创建大量粒子
        for (let i = 0; i < 300; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            
            const size = Math.random() * 5 + 1;
            const posX = Math.random() * 100;
            const delay = Math.random() * 5;
            const duration = Math.random() * 3 + 2;
            
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${posX}vw`;
            particle.style.animationDelay = `${delay}s`;
            particle.style.animationDuration = `${duration}s`;
            
            const colors = ['#0ff', '#f0f', '#ff0', '#0f0'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            particle.style.backgroundColor = color;
            
            particlesContainer.appendChild(particle);
        }
        
        // 5秒后恢复
        setTimeout(() => {
            particlesContainer.innerHTML = '';
            createParticles();
        }, 5000);
    });
    
    // 故障效果
    const glitchEffectBtn = document.getElementById('glitchEffect');
    glitchEffectBtn.addEventListener('click', function() {
        const header = document.querySelector('h1');
        header.classList.add('glitch');
        
        // 随机改变数据值
        const visitorCount = document.getElementById('visitorCount');
        const originalCount = visitorCount.textContent;
        visitorCount.textContent = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        
        const connectionCount = document.getElementById('connectionCount');
        const originalConnection = connectionCount.textContent;
        connectionCount.textContent = Math.floor(Math.random() * 50);
        
        // 3秒后恢复
        setTimeout(() => {
            header.classList.remove('glitch');
            visitorCount.textContent = originalCount;
            connectionCount.textContent = originalConnection;
        }, 3000);
    });
    
    // 音频脉冲效果
    const audioToggleBtn = document.getElementById('audioToggle');
    let audioActive = false;
    audioToggleBtn.addEventListener('click', function() {
        audioActive = !audioActive;
        
        if (audioActive) {
            this.classList.add('pulse');
            document.querySelectorAll('.link-card').forEach(card => {
                card.classList.add('pulse');
            });
        } else {
            this.classList.remove('pulse');
            document.querySelectorAll('.link-card').forEach(card => {
                card.classList.remove('pulse');
            });
        }
    });
    
    // 动态更新数据
    function updateData() {
        const visitorCount = document.getElementById('visitorCount');
        let count = parseInt(visitorCount.textContent);
        count += Math.floor(Math.random() * 3);
        visitorCount.textContent = count.toString().padStart(4, '0');
        
        const connectionCount = document.getElementById('connectionCount');
        let connections = parseInt(connectionCount.textContent);
        connections = Math.max(10, Math.min(30, connections + Math.floor(Math.random() * 5) - 2));
        connectionCount.textContent = connections;
        
        const dataFlow = document.getElementById('dataFlow');
        const flow = (Math.random() * 2 + 2.5).toFixed(1);
        dataFlow.textContent = `${flow} GB/s`;
        
        const systemStatus = document.getElementById('systemStatus');
        const statuses = ['在线', '稳定', '加密', '活跃'];
        systemStatus.textContent = statuses[Math.floor(Math.random() * statuses.length)];
    }
    
    setInterval(updateData, 3000);
    
    // 链接卡片点击效果
    document.querySelectorAll('.link-card').forEach(card => {
        card.addEventListener('click', function(e) {
            if (!e.target.classList.contains('link-url')) {
                this.style.transform = 'scale(0.95)';
                this.style.boxShadow = '0 0 30px var(--primary-color)';
                
                setTimeout(() => {
                    this.style.transform = '';
                    this.style.boxShadow = '';
                }, 300);
            }
        });
    });
});
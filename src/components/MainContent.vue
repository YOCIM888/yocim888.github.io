<template>
  <main class="main-content">
    <!-- 顶部 Hex 网格装饰 -->
    <div class="hex-grid"></div>

    <!-- Hero 区域 -->
    <section class="hero">
      <div class="hero-badge">
        <span class="badge-dot"></span>
        v1.0.0 DEMO
      </div>

      <h2 class="hero-title">
        <span class="hero-title-line">WELCOME TO</span>
        <span class="hero-title-main" data-text="YOCIM NEXUS">YOCIM NEXUS</span>
      </h2>

      <p class="hero-desc">
        <span class="typing-text">{{ displayedText }}</span>
        <span class="typing-cursor">_</span>
      </p>

      <!-- 功能卡片网格 -->
      <div class="feature-grid">
        <div class="feature-card" v-for="card in featureCards" :key="card.title">
          <div class="feature-icon">{{ card.icon }}</div>
          <h3 class="feature-title">{{ card.title }}</h3>
          <p class="feature-desc">{{ card.desc }}</p>
          <div class="feature-bar"></div>
        </div>
      </div>
    </section>

    <!-- 信息面板 -->
    <section class="info-panels">
      <div class="info-panel system-status">
        <div class="panel-header">
          <span class="panel-icon">📡</span>
          <span class="panel-title">SYSTEM STATUS</span>
        </div>
        <div class="panel-body">
          <div class="stat-row">
            <span class="stat-label">NODE</span>
            <span class="stat-value online">ONLINE</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">LATENCY</span>
            <span class="stat-value">{{ latency }}ms</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">UPTIME</span>
            <span class="stat-value">{{ uptime }}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">CONNECTIONS</span>
            <span class="stat-value">4 ACTIVE</span>
          </div>
        </div>
      </div>

      <div class="info-panel news-feed">
        <div class="panel-header">
          <span class="panel-icon">📰</span>
          <span class="panel-title">TERMINAL LOG</span>
        </div>
        <div class="panel-body">
          <div class="log-entry" v-for="(log, i) in logs" :key="i" :style="{ animationDelay: i * 0.5 + 's' }">
            <span class="log-time">{{ log.time }}</span>
            <span class="log-msg">{{ log.msg }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 底部引用 -->
    <footer class="main-footer">
      <div class="footer-deco-line"></div>
      <p>「 连接万物，归于星枢 」</p>
      <p class="footer-sub">YOCIM NEXUS · CYBERPUNK EDITION · {{ currentYear }}</p>
    </footer>
  </main>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const currentYear = new Date().getFullYear()
const latency = ref(0)
const uptime = ref('')
const displayedText = ref('')
const startTime = Date.now()

const fullText = '欢迎来到 YOCIM星枢 —— 您的个人数字中枢。在这里，一切皆可连接，万物皆可掌控。'

const featureCards = [
  { icon: '🌐', title: 'Workbench', desc: '集成开发工作台，一站式项目管理与协作平台' },
  { icon: '🖥️', title: 'System', desc: '系统监控与控制中心，实时掌握各项服务运行状态' },
  { icon: '🛠️', title: 'Tools', desc: '实用工具集合，从代码生成到数据分析一应俱全' },
  { icon: '🔗', title: 'Links', desc: '精选导航链接，快速访问常用资源与外部服务' },
]

const logs = [
  { time: '12:34:56', msg: '系统初始化完成，所有服务正常运行' },
  { time: '12:35:02', msg: 'Nexus 核心模块加载成功' },
  { time: '12:35:18', msg: '安全协议验证通过，防火墙已激活' },
  { time: '12:35:30', msg: '外部连接就绪，等待用户交互' },
]

// 打字机效果
let typingTimer = null
onMounted(() => {
  let i = 0
  typingTimer = setInterval(() => {
    if (i <= fullText.length) {
      displayedText.value = fullText.slice(0, i)
      i++
    } else {
      clearInterval(typingTimer)
    }
  }, 60)

  // 延迟模拟
  setInterval(() => {
    latency.value = Math.floor(Math.random() * 30 + 5)
  }, 3000)
  latency.value = Math.floor(Math.random() * 30 + 5)

  // 运行时间
  setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000)
    const h = Math.floor(elapsed / 3600)
    const m = Math.floor((elapsed % 3600) / 60)
    const s = elapsed % 60
    uptime.value = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }, 1000)
})

onUnmounted(() => {
  if (typingTimer) clearInterval(typingTimer)
})
</script>

<style scoped>
/* ============================================================
   主内容区
   ============================================================ */
.main-content {
  margin-left: 260px;
  min-height: 100vh;
  padding: 40px 48px;
  position: relative;
  z-index: 1;
  overflow-y: auto;
  max-height: 100vh;
}

/* ---- Hex 网格背景 ---- */
.hex-grid {
  position: fixed;
  top: 0;
  right: 0;
  width: calc(100% - 260px);
  height: 100%;
  background-image:
    linear-gradient(rgba(0, 240, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 240, 255, 0.03) 1px, transparent 1px);
  background-size: 40px 40px;
  pointer-events: none;
  z-index: 0;
}

/* ---- Hero ---- */
.hero {
  position: relative;
  z-index: 1;
  margin-bottom: 48px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  border: 1px solid rgba(0, 240, 255, 0.3);
  border-radius: 20px;
  font-family: var(--font-display);
  font-size: 0.65rem;
  letter-spacing: 3px;
  color: var(--cyan);
  margin-bottom: 20px;
  animation: fade-in-up 0.8s ease-out;
}
.badge-dot {
  width: 6px;
  height: 6px;
  background: var(--cyan);
  border-radius: 50%;
  box-shadow: 0 0 6px var(--cyan);
}

.hero-title {
  margin-bottom: 16px;
  animation: fade-in-up 0.8s ease-out 0.1s both;
}
.hero-title-line {
  display: block;
  font-family: var(--font-display);
  font-size: 0.8rem;
  letter-spacing: 8px;
  color: var(--text-secondary);
  margin-bottom: 4px;
}
.hero-title-main {
  display: block;
  font-family: var(--font-display);
  font-size: 3.2rem;
  font-weight: 900;
  letter-spacing: 6px;
  color: var(--cyan);
  text-shadow: 0 0 15px var(--cyan), 0 0 40px rgba(0, 240, 255, 0.4), 0 0 80px rgba(0, 240, 255, 0.2);
  position: relative;
}
.hero-title-main::after {
  content: attr(data-text);
  position: absolute;
  left: 3px;
  top: 0;
  color: var(--magenta);
  opacity: 0.4;
  clip-path: inset(40% 0 0 0);
  animation: glitch-text 2s infinite reverse;
}

.hero-desc {
  font-size: 1rem;
  color: var(--text-secondary);
  max-width: 600px;
  line-height: 1.8;
  margin-bottom: 48px;
  animation: fade-in-up 0.8s ease-out 0.2s both;
  min-height: 1.5em;
}
.typing-cursor {
  color: var(--cyan);
  animation: blink-cursor 0.8s infinite;
  font-weight: 700;
}

/* ---- 功能卡片 ---- */
.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
}

.feature-card {
  background: var(--bg-panel);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 6px;
  padding: 28px 22px;
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  animation: fade-in-up 0.8s ease-out both;
  clip-path: polygon(
    0 8px, 8px 0, 100% 0, 100% calc(100% - 8px),
    calc(100% - 8px) 100%, 0 100%
  );
}
.feature-card:nth-child(1) { animation-delay: 0.25s; }
.feature-card:nth-child(2) { animation-delay: 0.35s; }
.feature-card:nth-child(3) { animation-delay: 0.45s; }
.feature-card:nth-child(4) { animation-delay: 0.55s; }

.feature-card:hover {
  transform: translateY(-6px);
  border-color: rgba(0, 240, 255, 0.3);
  box-shadow: 0 8px 32px rgba(0, 240, 255, 0.1);
}

.feature-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--cyan), transparent);
  opacity: 0;
  transition: opacity 0.4s;
}
.feature-card:hover::after { opacity: 1; }

.feature-icon {
  font-size: 2rem;
  margin-bottom: 14px;
  display: block;
}

.feature-title {
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 2px;
  color: var(--cyan);
  margin-bottom: 8px;
}

.feature-desc {
  font-size: 0.8rem;
  color: var(--text-secondary);
  line-height: 1.6;
}

.feature-bar {
  width: 30px;
  height: 2px;
  background: var(--cyan);
  margin-top: 16px;
  transition: width 0.4s;
  box-shadow: 0 0 8px var(--cyan);
}
.feature-card:hover .feature-bar { width: 60px; }

/* ---- 信息面板 ---- */
.info-panels {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 48px;
}

.info-panel {
  background: var(--bg-panel);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 6px;
  overflow: hidden;
  clip-path: polygon(
    0 8px, 8px 0, 100% 0, 100% calc(100% - 8px),
    calc(100% - 8px) 100%, 0 100%
  );
}

.panel-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 20px;
  background: rgba(0, 240, 255, 0.04);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}
.panel-icon { font-size: 1rem; }
.panel-title {
  font-family: var(--font-display);
  font-size: 0.7rem;
  letter-spacing: 3px;
  color: var(--cyan);
}

.panel-body {
  padding: 16px 20px;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
}
.stat-row:last-child { border-bottom: none; }
.stat-label {
  font-family: var(--font-display);
  font-size: 0.65rem;
  letter-spacing: 2px;
  color: var(--text-secondary);
}
.stat-value {
  font-family: var(--font-display);
  font-size: 0.75rem;
  letter-spacing: 1px;
  color: var(--text-primary);
}
.stat-value.online {
  color: #00ff88;
  text-shadow: 0 0 6px rgba(0, 255, 136, 0.4);
}

/* 日志 */
.log-entry {
  display: flex;
  gap: 12px;
  padding: 6px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.02);
  animation: fade-in-up 0.5s ease-out both;
  font-size: 0.75rem;
}
.log-entry:last-child { border-bottom: none; }
.log-time {
  font-family: var(--font-display);
  color: var(--cyan-dim);
  white-space: nowrap;
  font-size: 0.7rem;
}
.log-msg {
  color: var(--text-secondary);
}

/* ---- 底部 ---- */
.main-footer {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 32px 0 20px;
}
.footer-deco-line {
  width: 120px;
  height: 1px;
  margin: 0 auto 16px;
  background: linear-gradient(90deg, transparent, rgba(0, 240, 255, 0.4), transparent);
}
.main-footer p {
  font-family: var(--font-display);
  font-size: 0.75rem;
  letter-spacing: 4px;
  color: var(--cyan-dim);
}
.footer-sub {
  font-size: 0.6rem !important;
  letter-spacing: 3px !important;
  color: var(--text-secondary) !important;
  margin-top: 6px !important;
}

/* ---- 响应式 ---- */
@media (max-width: 768px) {
  .main-content {
    margin-left: 60px;
    padding: 24px 20px;
  }
  .hero-title-main { font-size: 1.8rem; letter-spacing: 3px; }
  .feature-grid { grid-template-columns: 1fr; }
  .info-panels { grid-template-columns: 1fr; }
  .hex-grid { width: calc(100% - 60px); }
}
</style>

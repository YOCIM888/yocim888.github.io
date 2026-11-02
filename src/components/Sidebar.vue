<template>
  <aside class="sidebar">
    <!-- 装饰角标 -->
    <div class="sidebar-corner top-left" />
    <div class="sidebar-corner top-right" />
    <div class="sidebar-corner bottom-left" />
    <div class="sidebar-corner bottom-right" />

    <!-- Logo 区域 -->
    <div class="sidebar-logo">
      <div class="logo-ring">
        <img
          src="/yocim.png"
          alt="YOCIM"
          class="logo-avatar"
        >
      </div>
      <h1
        class="logo-text"
        data-text="YOCIM星枢"
      >
        YOCIM星枢
      </h1>
      <p class="logo-sub">
        NEXUS TERMINAL
      </p>
      <div class="logo-line" />
    </div>

    <!-- 分类导航（点击筛选主内容，不再跳转外链） -->
    <nav class="sidebar-nav">
      <button
        v-for="btn in navItems"
        :key="btn.key"
        type="button"
        class="nav-btn"
        :class="[btn.variant, { active: btn.key === active }]"
        @click="emit('select', btn.key)"
      >
        <span class="nav-btn-icon">{{ btn.icon }}</span>
        <span class="nav-btn-label">{{ btn.label }}</span>
        <span class="nav-btn-sub">{{ btn.sub }}</span>
        <span class="nav-btn-count">{{ btn.count }}</span>
        <span class="nav-btn-glow" />
      </button>
    </nav>

    <!-- 底部状态 -->
    <div class="sidebar-footer">
      <div class="status-dot" />
      <span class="status-text">SYS ONLINE</span>
      <div class="footer-deco">
        ◆
      </div>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { categories, sites } from '../data/sites.js'

defineProps({
  active: { type: String, default: 'all' },
})
const emit = defineEmits(['select'])

// 各分类下的站点数量
const counts = computed(() => {
  const map = { all: sites.length }
  for (const site of sites) {
    map[site.category] = (map[site.category] || 0) + 1
  }
  return map
})

const navItems = computed(() =>
  categories.map((category) => ({
    ...category,
    count: counts.value[category.key] || 0,
  })),
)
</script>

<style scoped>
/* ============================================================
   侧边栏 — 赛博朋克面板
   ============================================================ */
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  height: 100%;
  width: 260px;
  background: linear-gradient(
    180deg,
    rgba(8, 8, 20, 0.95) 0%,
    rgba(12, 8, 28, 0.95) 50%,
    rgba(8, 8, 20, 0.95) 100%
  );
  border-right: 1px solid rgba(0, 240, 255, 0.2);
  box-shadow:
    3px 0 20px rgba(0, 240, 255, 0.08),
    inset -1px 0 0 rgba(0, 240, 255, 0.05);
  z-index: 100;
  display: flex;
  flex-direction: column;
  padding: 28px 0 20px 0;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  user-select: none;
}

/* ---- 装饰角 ---- */
.sidebar-corner {
  position: absolute;
  width: 20px;
  height: 20px;
  border-color: var(--cyan);
  border-style: solid;
  opacity: 0.7;
  transition: opacity 0.3s;
}
.sidebar:hover .sidebar-corner { opacity: 1; }
.top-left    { top: 8px;  left: 8px;  border-width: 2px 0 0 2px; }
.top-right   { top: 8px;  right: 8px; border-width: 2px 2px 0 0; }
.bottom-left { bottom: 8px; left: 8px;  border-width: 0 0 2px 2px; }
.bottom-right{ bottom: 8px; right: 8px; border-width: 0 2px 2px 0; }

/* ---- Logo ---- */
.sidebar-logo {
  text-align: center;
  padding: 10px 20px 20px;
  position: relative;
}
.logo-ring {
  width: 70px;
  height: 70px;
  margin: 0 auto 12px;
  border-radius: 50%;
  border: 2px solid rgba(0, 240, 255, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: neon-pulse 3s ease-in-out infinite;
  position: relative;
  overflow: hidden;
}
.logo-ring::before {
  content: '';
  position: absolute;
  inset: -6px;
  border-radius: 50%;
  border: 1px solid rgba(0, 240, 255, 0.15);
  animation: spin-glow 8s linear infinite;
}
.logo-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  position: relative;
  z-index: 1;
}
.logo-text {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 900;
  letter-spacing: 4px;
  color: var(--cyan);
  text-shadow: 0 0 10px var(--cyan), 0 0 30px rgba(0, 240, 255, 0.5);
  animation: glitch-text 5s infinite;
  position: relative;
}
.logo-text::after {
  content: attr(data-text);
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  color: var(--magenta);
  opacity: 0.5;
  clip-path: inset(40% 0 0 0);
  animation: glitch-text 3s infinite reverse;
  pointer-events: none;
}
.logo-sub {
  font-family: var(--font-display);
  font-size: 0.55rem;
  letter-spacing: 6px;
  color: var(--text-secondary);
  margin-top: 6px;
}
.logo-line {
  width: 60%;
  height: 1px;
  margin: 16px auto 0;
  background: linear-gradient(90deg, transparent, var(--cyan), transparent);
}

/* ---- 导航 ---- */
.sidebar-nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 20px 16px;
  overflow-y: auto;
}

.nav-btn {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 14px 16px;
  border-radius: 4px;
  text-decoration: none;
  color: var(--text-primary);
  font-family: var(--font-body);
  text-align: left;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  overflow: hidden;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  clip-path: polygon(
    0 0, 100% 0, 100% calc(100% - 6px),
    calc(100% - 6px) 100%, 0 100%
  );
}

.nav-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 0.35s;
  z-index: -1;
}

.nav-btn.cyan::before   { background: linear-gradient(135deg, rgba(0, 240, 255, 0.1), transparent); }
.nav-btn.magenta::before { background: linear-gradient(135deg, rgba(255, 0, 255, 0.1), transparent); }
.nav-btn.purple::before  { background: linear-gradient(135deg, rgba(139, 0, 255, 0.1), transparent); }
.nav-btn.gold::before    { background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), transparent); }

.nav-btn:hover {
  transform: translateX(4px);
  border-color: var(--hover-color, var(--cyan));
  box-shadow: 0 0 12px var(--hover-color, var(--cyan));
  background: rgba(255, 255, 255, 0.05);
}
.nav-btn:hover::before { opacity: 1; }

/* 当前选中的分类 */
.nav-btn.active {
  transform: translateX(4px);
  border-color: var(--hover-color, var(--cyan));
  background: rgba(255, 255, 255, 0.05);
  box-shadow:
    inset 0 0 18px rgba(255, 255, 255, 0.03),
    0 0 14px color-mix(in srgb, var(--hover-color, var(--cyan)) 25%, transparent);
}
.nav-btn.active::before { opacity: 1; }
.nav-btn.active .nav-btn-label { color: var(--hover-color, var(--cyan)); }
.nav-btn.active .nav-btn-glow {
  opacity: 1;
  box-shadow: 0 0 10px var(--hover-color, var(--cyan));
}

.nav-btn.cyan    { --hover-color: var(--cyan); }
.nav-btn.magenta { --hover-color: var(--magenta); }
.nav-btn.purple  { --hover-color: var(--purple); }
.nav-btn.gold    { --hover-color: var(--gold); }

.nav-btn-icon {
  font-size: 1.3rem;
  width: 32px;
  text-align: center;
  filter: grayscale(0.3);
  transition: filter 0.3s;
}
.nav-btn:hover .nav-btn-icon { filter: grayscale(0); }

.nav-btn-label {
  font-family: var(--font-display);
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 2px;
  transition: color 0.3s;
}
.nav-btn:hover .nav-btn-label { color: var(--hover-color, var(--cyan)); }

.nav-btn-sub {
  font-size: 0.62rem;
  color: var(--text-secondary);
  margin-left: auto;
  opacity: 0.55;
  transition: opacity 0.3s;
  white-space: nowrap;
}
.nav-btn:hover .nav-btn-sub,
.nav-btn.active .nav-btn-sub { opacity: 0.9; }

.nav-btn-count {
  font-family: var(--font-display);
  font-size: 0.58rem;
  line-height: 1;
  min-width: 20px;
  padding: 4px 5px;
  text-align: center;
  color: var(--text-secondary);
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 3px;
  transition: all 0.3s;
}
.nav-btn:hover .nav-btn-count,
.nav-btn.active .nav-btn-count {
  color: var(--hover-color, var(--cyan));
  border-color: color-mix(in srgb, var(--hover-color, var(--cyan)) 40%, transparent);
}

.nav-btn-glow {
  position: absolute;
  bottom: 0;
  left: 10%;
  width: 80%;
  height: 1px;
  background: var(--hover-color, var(--cyan));
  opacity: 0;
  transition: opacity 0.35s, box-shadow 0.35s;
}
.nav-btn:hover .nav-btn-glow {
  opacity: 1;
  box-shadow: 0 0 10px var(--hover-color, var(--cyan));
}

/* ---- 底部状态 ---- */
.sidebar-footer {
  padding: 16px 20px 0;
  display: flex;
  align-items: center;
  gap: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  margin: 0 16px;
}
.status-dot {
  width: 8px;
  height: 8px;
  background: #00ff88;
  border-radius: 50%;
  box-shadow: 0 0 8px #00ff88;
  animation: neon-pulse 2s ease-in-out infinite;
}
.status-text {
  font-family: var(--font-display);
  font-size: 0.6rem;
  letter-spacing: 3px;
  color: #00ff88;
  text-shadow: 0 0 6px rgba(0, 255, 136, 0.4);
}
.footer-deco {
  margin-left: auto;
  color: var(--cyan);
  font-size: 0.6rem;
  opacity: 0.5;
}

/* ---- 响应式 ---- */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    bottom: 0;
    left: 0;
    top: auto;
    width: 100%;
    height: 64px;
    flex-direction: row;
    padding: 0;
    border-right: none;
    border-top: 1px solid rgba(0, 240, 255, 0.2);
    box-shadow: 0 -3px 20px rgba(0, 240, 255, 0.08);
    background: rgba(8, 8, 20, 0.97);
    z-index: 1000;
  }
  .sidebar-logo { display: none; }
  .sidebar-nav {
    flex: 1;
    flex-direction: row;
    gap: 0;
    padding: 0;
    justify-content: space-around;
  }
  .nav-btn {
    flex-direction: column;
    gap: 4px;
    padding: 8px 6px;
    border-radius: 0;
    border: none;
    clip-path: none;
    min-width: 0;
    flex: 1;
    justify-content: center;
  }
  .nav-btn:hover { transform: none; box-shadow: none; background: rgba(0, 240, 255, 0.05); }
  .nav-btn.active {
    transform: none;
    border: none;
    background: rgba(0, 240, 255, 0.08);
    box-shadow: inset 0 2px 0 var(--hover-color, var(--cyan));
  }
  .nav-btn-label { font-size: 0.55rem; letter-spacing: 1px; }
  .nav-btn-sub { display: none; }
  .nav-btn-count { display: none; }
  .nav-btn-icon { font-size: 1.1rem; width: auto; }
  .nav-btn-glow { display: none; }
  .sidebar-footer { display: none; }
  .sidebar-corner { display: none; }
}
@media (max-width: 480px) {
  .sidebar { height: 56px; }
  .nav-btn { padding: 6px 4px; }
  .nav-btn-icon { font-size: 1rem; }
  .nav-btn-label { font-size: 0.5rem; letter-spacing: 0; }
}
</style>

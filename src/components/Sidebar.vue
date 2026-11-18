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

    <!-- 侧边栏入口：搜索 / GitHub / 邮箱 -->
    <nav class="sidebar-nav">
      <div class="nav-search">
        <button
          type="button"
          class="nav-btn cyan"
          :class="{ active: searchOpen }"
          :aria-expanded="searchOpen"
          @click="toggleSearch"
        >
          <span class="nav-btn-icon">🔍</span>
          <span class="nav-btn-label">SEARCH</span>
          <span class="nav-btn-sub">搜索</span>
          <span class="nav-btn-glow" />
        </button>

        <Transition name="panel-slide">
          <div
            v-if="searchOpen"
            class="search-panel"
          >
            <div class="search-field">
              <span class="search-prompt">&gt;</span>
              <input
                ref="searchInput"
                v-model="query"
                type="text"
                class="search-input"
                placeholder="站点名称 / 关键词"
                autocomplete="off"
                spellcheck="false"
                @input="feedback = ''"
                @keydown.enter.prevent="submitSearch"
                @keydown.esc.prevent="closeSearch"
              >
              <button
                type="button"
                class="search-go"
                aria-label="执行搜索"
                @click="submitSearch"
              >
                ↵
              </button>
            </div>
            <p
              v-if="feedback"
              class="search-feedback"
              :class="{ 'is-error': !feedbackOk }"
            >
              {{ feedback }}
            </p>
            <p
              v-else
              class="search-hint"
            >
              回车跳转并高亮卡片
            </p>
          </div>
        </Transition>
      </div>

      <a
        class="nav-btn purple"
        href="https://github.com/YOCIM888"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span class="nav-btn-icon">🐙</span>
        <span class="nav-btn-label">GITHUB</span>
        <span class="nav-btn-sub">主页</span>
        <span class="nav-btn-glow" />
      </a>

      <a
        class="nav-btn gold"
        href="mailto:yocim666@outlook.com"
      >
        <span class="nav-btn-icon">✉️</span>
        <span class="nav-btn-label">EMAIL</span>
        <span class="nav-btn-sub">邮件</span>
        <span class="nav-btn-glow" />
      </a>
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
import { ref, nextTick } from 'vue'
import { sites, categories } from '../data/sites.js'

const emit = defineEmits(['search'])

const searchOpen = ref(false)
const query = ref('')
const feedback = ref('')
const feedbackOk = ref(true)
const searchInput = ref(null)
let searchToken = 0

const toggleSearch = async () => {
  searchOpen.value = !searchOpen.value
  if (searchOpen.value) {
    await nextTick()
    searchInput.value?.focus()
  } else {
    feedback.value = ''
  }
}

const closeSearch = () => {
  searchOpen.value = false
  feedback.value = ''
}

// 在标题 / 代号 / 副标题 / 网址 / 描述 / 分类中匹配，标题与代号优先
const findSite = (raw) => {
  const q = raw.trim().toLowerCase()
  if (!q) return null

  let best = null
  for (const site of sites) {
    const primary = [site.title, site.sub, site.key].map((v) => String(v || '').toLowerCase())
    const category = categories.find((c) => c.key === site.category)?.sub ?? ''
    const fields = [
      ...primary,
      site.url,
      site.desc,
      category,
      categories.find((c) => c.key === site.category)?.label ?? '',
    ].map((v) => String(v || '').toLowerCase())

    let score = 0
    if (primary.some((v) => v === q)) score = 100
    else if (primary.some((v) => v.startsWith(q))) score = 70
    else if (fields.some((v) => v.includes(q))) score = 30

    if (score > 0 && (!best || score > best.score)) best = { site, score }
  }
  return best?.site ?? null
}

const submitSearch = () => {
  const keyword = query.value.trim()
  const hit = findSite(keyword)
  if (!hit) {
    feedbackOk.value = false
    feedback.value = keyword ? `未找到「${keyword}」` : '请输入关键词'
    return
  }

  feedbackOk.value = true
  feedback.value = `已定位 · ${hit.title}`
  emit('search', { key: hit.key, token: ++searchToken })
}
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
  overflow-x: visible;
}

.nav-search {
  position: relative;
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

.nav-btn.cyan::before    { background: linear-gradient(135deg, rgba(0, 240, 255, 0.1), transparent); }
.nav-btn.purple::before  { background: linear-gradient(135deg, rgba(139, 0, 255, 0.1), transparent); }
.nav-btn.gold::before    { background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), transparent); }

.nav-btn:hover {
  transform: translateX(4px);
  border-color: var(--hover-color, var(--cyan));
  box-shadow: 0 0 12px var(--hover-color, var(--cyan));
  background: rgba(255, 255, 255, 0.05);
}
.nav-btn:hover::before { opacity: 1; }

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

.nav-btn.cyan   { --hover-color: var(--cyan); }
.nav-btn.purple { --hover-color: var(--purple); }
.nav-btn.gold   { --hover-color: var(--gold); }

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

/* ---- 搜索面板 ---- */
.search-panel {
  margin: 6px 0 4px;
  padding: 10px;
  background: rgba(6, 10, 22, 0.95);
  border: 1px solid rgba(0, 240, 255, 0.25);
  box-shadow: 0 0 20px rgba(0, 240, 255, 0.1);
  clip-path: polygon(0 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%);
}

.search-field {
  display: flex;
  align-items: center;
  gap: 6px;
  border: 1px solid rgba(0, 240, 255, 0.18);
  background: rgba(0, 240, 255, 0.04);
  padding: 4px 6px;
}
.search-field:focus-within {
  border-color: rgba(0, 240, 255, 0.55);
  box-shadow: 0 0 10px rgba(0, 240, 255, 0.15);
}
.search-prompt {
  font-family: var(--font-display);
  color: var(--cyan);
  font-size: 0.8rem;
  flex: none;
}
.search-input {
  flex: 1;
  min-width: 0;
  background: transparent;
  border: none;
  outline: none;
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: 0.72rem;
  letter-spacing: 0.5px;
}
.search-input::placeholder { color: var(--text-secondary); opacity: 0.6; }
.search-input::-webkit-search-cancel-button { display: none; }

.search-go {
  flex: none;
  width: 24px;
  height: 22px;
  border: 1px solid rgba(0, 240, 255, 0.3);
  background: rgba(0, 240, 255, 0.08);
  color: var(--cyan);
  font-family: var(--font-display);
  font-size: 0.75rem;
  line-height: 1;
  cursor: pointer;
  transition: all 0.2s;
}
.search-go:hover {
  background: rgba(0, 240, 255, 0.2);
  box-shadow: 0 0 10px rgba(0, 240, 255, 0.35);
}

.search-hint,
.search-feedback {
  margin: 7px 2px 1px;
  font-size: 0.58rem;
  letter-spacing: 1px;
  color: var(--text-secondary);
  opacity: 0.75;
}
.search-feedback { color: var(--cyan); opacity: 1; }
.search-feedback.is-error { color: var(--magenta); }

.panel-slide-enter-active,
.panel-slide-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.panel-slide-enter-from,
.panel-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
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
    overflow: visible;
  }
  .nav-search { flex: 1; min-width: 0; }
  .sidebar-nav > .nav-btn { min-width: 0; flex: 1; }
  .nav-btn {
    flex-direction: column;
    gap: 4px;
    padding: 8px 6px;
    border-radius: 0;
    border: none;
    clip-path: none;
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
  .nav-btn-icon { font-size: 1.1rem; width: auto; }
  .nav-btn-glow { display: none; }
  .search-panel {
    position: fixed;
    left: 12px;
    right: 12px;
    bottom: 72px;
    margin: 0;
    z-index: 1001;
  }
  .sidebar-footer { display: none; }
  .sidebar-corner { display: none; }
}
@media (max-width: 480px) {
  .sidebar { height: 56px; }
  .nav-btn { padding: 6px 4px; }
  .nav-btn-icon { font-size: 1rem; }
  .nav-btn-label { font-size: 0.5rem; letter-spacing: 0; }
  .search-panel { bottom: 64px; }
}
</style>

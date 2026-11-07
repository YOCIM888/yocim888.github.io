<template>
  <!-- 加载动画 -->
  <LoadingScreen
    v-if="showLoading"
    @complete="onLoadingComplete"
  />

  <!-- 载入动画开关（层级高于载入层，动画播放期间也可操作） -->
  <button
    type="button"
    class="loading-toggle"
    :class="{ 'is-on': loadingEnabled }"
    role="switch"
    :aria-checked="loadingEnabled"
    aria-label="载入动画开关"
    @click="toggleLoading"
  >
    <span
      class="toggle-track"
      aria-hidden="true"
    >
      <span class="toggle-knob" />
    </span>
    <span class="toggle-label">载入动画</span>
    <span class="toggle-state">{{ loadingEnabled ? 'ON' : 'OFF' }}</span>
    <span class="toggle-tip">
      {{ loadingEnabled ? '关闭后下次进站直接进入内容' : '开启后下次进站播放载入动画' }}
    </span>
  </button>

  <!-- 主应用 (加载完成后显示) -->
  <div
    class="app-container"
    :class="{ 'app-ready': !loading }"
  >
    <!-- 增强粒子背景 -->
    <ParticleBackground />

    <!-- 自定义光标 -->
    <CyberCursor />

    <!-- 侧边栏（分类筛选） -->
    <Sidebar
      :active="activeCategory"
      @select="activeCategory = $event"
    />

    <!-- 主内容 -->
    <MainContent :active-category="activeCategory" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import LoadingScreen from './components/LoadingScreen.vue'
import ParticleBackground from './components/ParticleBackground.vue'
import CyberCursor from './components/CyberCursor.vue'
import Sidebar from './components/Sidebar.vue'
import MainContent from './components/MainContent.vue'

// 载入动画偏好：默认开启，'0' 表示用户已关闭
const LOADING_PREF_KEY = 'yocim-loading-animation'

const readLoadingPref = () => {
  try {
    return localStorage.getItem(LOADING_PREF_KEY) !== '0'
  } catch {
    return true
  }
}

const loadingEnabled = ref(readLoadingPref())
const loading = ref(loadingEnabled.value)
const showLoading = ref(loadingEnabled.value)
const activeCategory = ref('all')

const onLoadingComplete = () => {
  loading.value = false
}

const toggleLoading = () => {
  loadingEnabled.value = !loadingEnabled.value
  try {
    localStorage.setItem(LOADING_PREF_KEY, loadingEnabled.value ? '1' : '0')
  } catch {
    // 隐私模式等场景下写入失败时，仅本次会话生效
  }

  // 播放期间关闭：立即卸载载入层并进入内容
  if (!loadingEnabled.value) {
    showLoading.value = false
    loading.value = false
  }
}
</script>

<style scoped>
.app-container {
  width: 100%;
  height: 100vh;
  position: relative;
  opacity: 0;
  transition: opacity 0.6s ease-out;
}
.app-container.app-ready {
  opacity: 1;
}

/* ---- 载入动画开关 ---- */
.loading-toggle {
  position: fixed;
  left: 10px;
  bottom: 10px;
  z-index: 100001;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: rgba(8, 10, 20, 0.86);
  border: 1px solid rgba(0, 240, 255, 0.22);
  color: var(--text-secondary);
  font-family: var(--font-display);
  font-size: 0.6rem;
  letter-spacing: 1.5px;
  cursor: pointer;
  backdrop-filter: blur(6px);
  transition: color 0.3s, border-color 0.3s, box-shadow 0.3s;
  clip-path: polygon(0 5px, 5px 0, 100% 0, 100% calc(100% - 5px), calc(100% - 5px) 100%, 0 100%);
}

.loading-toggle:hover,
.loading-toggle:focus-visible {
  color: var(--text-primary);
  border-color: rgba(0, 240, 255, 0.5);
  box-shadow: 0 0 14px rgba(0, 240, 255, 0.18);
  outline: none;
}

.toggle-track {
  position: relative;
  width: 26px;
  height: 12px;
  flex: none;
  border: 1px solid rgba(0, 240, 255, 0.25);
  background: rgba(0, 240, 255, 0.04);
  transition: border-color 0.3s, background 0.3s;
}

.toggle-knob {
  position: absolute;
  top: 1px;
  left: 1px;
  width: 8px;
  height: 8px;
  background: var(--cyan-dim);
  transition: transform 0.25s ease, background 0.25s, box-shadow 0.25s;
}

.loading-toggle.is-on .toggle-track {
  border-color: rgba(0, 240, 255, 0.45);
  background: rgba(0, 240, 255, 0.1);
}

.loading-toggle.is-on .toggle-knob {
  transform: translateX(14px);
  background: var(--cyan);
  box-shadow: 0 0 8px var(--cyan);
}

.toggle-state {
  min-width: 22px;
  color: var(--cyan-dim);
  font-weight: 700;
}

.loading-toggle.is-on .toggle-state {
  color: var(--cyan);
  text-shadow: 0 0 8px rgba(0, 240, 255, 0.5);
}

.toggle-tip {
  position: absolute;
  left: 0;
  bottom: calc(100% + 8px);
  padding: 6px 10px;
  white-space: nowrap;
  background: rgba(8, 10, 20, 0.95);
  border: 1px solid rgba(0, 240, 255, 0.28);
  color: var(--text-secondary);
  font-size: 0.58rem;
  letter-spacing: 1px;
  opacity: 0;
  transform: translateY(4px);
  pointer-events: none;
  transition: opacity 0.2s, transform 0.2s;
}

.loading-toggle:hover .toggle-tip,
.loading-toggle:focus-visible .toggle-tip {
  opacity: 1;
  transform: translateY(0);
}

@media (max-width: 768px) {
  .loading-toggle {
    left: 12px;
    bottom: 76px;
    padding: 7px 10px;
  }
  .toggle-tip { display: none; }
}
</style>

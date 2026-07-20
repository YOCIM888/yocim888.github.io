<template>
  <Transition name="loading-fade">
    <div v-if="visible" class="loading-screen">
      <!-- 背景扫描线 -->
      <div class="loading-scanlines"></div>

      <!-- 角标装饰 -->
      <div class="loading-corner tl"></div>
      <div class="loading-corner tr"></div>
      <div class="loading-corner bl"></div>
      <div class="loading-corner br"></div>

      <!-- 中央内容 -->
      <div class="loading-center">
        <!-- Logo Glitch -->
        <div class="loading-logo">
          <span class="logo-glitch" data-text="YOCIM星枢">YOCIM星枢</span>
        </div>

        <p class="loading-sub">NEXUS TERMINAL // INITIALIZING</p>

        <!-- 进度条 -->
        <div class="loading-bar-track">
          <div class="loading-bar-fill" :style="{ width: progress + '%' }">
            <div class="loading-bar-glow"></div>
          </div>
          <div class="loading-bar-scan"></div>
        </div>

        <!-- 状态字符 -->
        <p class="loading-status">
          <span class="status-prefix">&gt;</span>
          {{ statusText }}
          <span class="status-cursor">_</span>
        </p>

        <!-- 随机 Hex 数据 -->
        <div class="loading-hex">
          <span v-for="i in 8" :key="i" class="hex-block">{{ randomHex() }}</span>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  duration: { type: Number, default: 2200 },
})

const emit = defineEmits(['complete'])
const visible = ref(true)
const progress = ref(0)
const statusText = ref('ESTABLISHING CONNECTION...')

const statusSequence = [
  { at: 10, text: 'ESTABLISHING CONNECTION...' },
  { at: 25, text: 'AUTHENTICATING NEXUS PROTOCOL...' },
  { at: 40, text: 'DECRYPTING DATA STREAMS...' },
  { at: 55, text: 'LOADING CORE MODULES...' },
  { at: 70, text: 'CALIBRATING NEURAL INTERFACE...' },
  { at: 85, text: 'RENDERING CYBERSPACE...' },
  { at: 95, text: 'ACCESS GRANTED // WELCOME' },
]

const randomHex = () => {
  return Math.random().toString(16).slice(2, 6).toUpperCase()
}

onMounted(() => {
  const startTime = Date.now()

  const tick = () => {
    const elapsed = Date.now() - startTime
    const pct = Math.min((elapsed / props.duration) * 100, 100)

    // 非线性进度（前快后慢）
    const eased = 100 - (100 - pct) * Math.pow(1 - pct / 100, 1.5)
    progress.value = Math.min(eased, 100)

    // 状态文本
    for (let i = statusSequence.length - 1; i >= 0; i--) {
      if (progress.value >= statusSequence[i].at) {
        statusText.value = statusSequence[i].text
        break
      }
    }

    if (progress.value >= 100) {
      setTimeout(() => {
        visible.value = false
        emit('complete')
      }, 300)
      return
    }
    requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
})
</script>

<style scoped>
.loading-screen {
  position: fixed;
  inset: 0;
  z-index: 100000;
  background: #020208;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display);
  overflow: hidden;
}

/* 扫描线 */
.loading-scanlines {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 0, 0, 0.08) 2px,
    rgba(0, 0, 0, 0.08) 4px
  );
  z-index: 2;
  pointer-events: none;
}

/* 四角装饰 */
.loading-corner {
  position: absolute;
  width: 40px;
  height: 40px;
  border-color: rgba(0, 240, 255, 0.5);
  border-style: solid;
  z-index: 1;
}
.tl { top: 20px; left: 20px; border-width: 2px 0 0 2px; }
.tr { top: 20px; right: 20px; border-width: 2px 2px 0 0; }
.bl { bottom: 20px; left: 20px; border-width: 0 0 2px 2px; }
.br { bottom: 20px; right: 20px; border-width: 0 2px 2px 0; }

/* 中央 */
.loading-center {
  position: relative;
  z-index: 3;
  text-align: center;
  width: 420px;
}

/* Logo Glitch */
.loading-logo {
  position: relative;
  margin-bottom: 12px;
}
.logo-glitch {
  font-size: 2.8rem;
  font-weight: 900;
  letter-spacing: 8px;
  color: #00f0ff;
  text-shadow: 0 0 20px #00f0ff, 0 0 60px rgba(0, 240, 255, 0.5);
  animation: loading-glitch 2s infinite;
  position: relative;
}
.logo-glitch::after {
  content: attr(data-text);
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  color: #ff00ff;
  opacity: 0.4;
  clip-path: inset(60% 0 0 0);
  animation: loading-glitch 2s infinite reverse;
  pointer-events: none;
}

.loading-sub {
  font-size: 0.6rem;
  letter-spacing: 6px;
  color: #556;
  margin-bottom: 28px;
}

/* 进度条 */
.loading-bar-track {
  width: 100%;
  height: 3px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 2px;
  position: relative;
  overflow: hidden;
  margin-bottom: 14px;
}
.loading-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #00f0ff, #8b00ff, #ff00ff);
  border-radius: 2px;
  transition: width 0.15s;
  position: relative;
}
.loading-bar-glow {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 300%;
  background: #fff;
  filter: blur(8px);
  opacity: 0.8;
}
.loading-bar-scan {
  position: absolute;
  top: 0;
  left: -100%;
  width: 30%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: bar-scan 1.5s linear infinite;
}

/* 状态文字 */
.loading-status {
  font-size: 0.7rem;
  letter-spacing: 3px;
  color: #0a0;
  margin-bottom: 18px;
  font-family: 'Courier New', monospace;
}
.status-prefix {
  color: #0f0;
  margin-right: 8px;
}
.status-cursor {
  color: #0f0;
  animation: blink 0.8s infinite;
}

/* Hex 数据块 */
.loading-hex {
  display: flex;
  justify-content: center;
  gap: 10px;
}
.hex-block {
  font-size: 0.55rem;
  font-family: 'Courier New', monospace;
  color: #1a3;
  padding: 4px 8px;
  border: 1px solid rgba(0, 255, 0, 0.15);
  border-radius: 2px;
}

/* 过渡 */
.loading-fade-leave-active {
  transition: opacity 0.5s ease-out, filter 0.5s ease-out;
}
.loading-fade-leave-to {
  opacity: 0;
  filter: blur(10px) brightness(2);
}

/* 动画 */
@keyframes loading-glitch {
  0%, 100% { text-shadow: 0 0 20px #00f0ff, 0 0 60px rgba(0, 240, 255, 0.5); }
  15% { text-shadow: 3px 0 0 #ff00ff, -3px 0 0 #00f0ff; }
  17% { text-shadow: -3px 0 0 #ff00ff, 3px 0 0 #00f0ff; }
  19% { text-shadow: 0 0 20px #00f0ff, 0 0 60px rgba(0, 240, 255, 0.5); }
}

@keyframes bar-scan {
  0% { left: -30%; }
  100% { left: 130%; }
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
</style>

<template>
  <Teleport to="body">
    <!-- 自定义光标 -->
    <div class="cyber-cursor" ref="cursor" :class="{ clicking: isClicking }">
      <div class="cursor-core"></div>
      <div class="cursor-ring"></div>
      <div class="cursor-cross cross-h"></div>
      <div class="cursor-cross cross-v"></div>
    </div>

    <!-- 点击涟漪 -->
    <div
      v-for="ripple in ripples"
      :key="ripple.id"
      class="cursor-ripple"
      :style="{
        left: ripple.x + 'px',
        top: ripple.y + 'px',
        '--ripple-color': ripple.color,
      }"
    ></div>

    <!-- hover 电磁脉冲 -->
    <div
      v-for="pulse in pulses"
      :key="pulse.id"
      class="cursor-pulse"
      :style="{
        left: pulse.x + 'px',
        top: pulse.y + 'px',
      }"
    ></div>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const cursor = ref(null)
const isClicking = ref(false)
const ripples = ref([])
const pulses = ref([])
let mouseX = 0, mouseY = 0
let cursorX = 0, cursorY = 0
let rafId = null
let rippleId = 0
let pulseId = 0

const neonColors = [
  '#00f0ff', '#ff00ff', '#8b00ff', '#00ff88', '#ffd700',
]

const lerp = (a, b, t) => a + (b - a) * t

const animate = () => {
  cursorX = lerp(cursorX, mouseX, 0.12)
  cursorY = lerp(cursorY, mouseY, 0.12)
  if (cursor.value) {
    cursor.value.style.left = cursorX + 'px'
    cursor.value.style.top = cursorY + 'px'
  }
  rafId = requestAnimationFrame(animate)
}

const onMouseMove = (e) => {
  mouseX = e.clientX
  mouseY = e.clientY

  // 检查是否 hover 在可交互元素上
  const el = document.elementFromPoint(e.clientX, e.clientY)
  if (el) {
    const interactive = el.closest('a, button, .feature-card, .nav-btn, [data-hover]')
    if (interactive) {
      document.body.classList.add('cursor-hover')
      // 偶尔的电磁脉冲
      if (Math.random() < 0.1) {
        pulseId++
        const rect = interactive.getBoundingClientRect()
        pulses.value.push({
          id: pulseId,
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        })
        setTimeout(() => {
          pulses.value = pulses.value.filter(p => p.id !== pulseId)
        }, 600)
      }
    } else {
      document.body.classList.remove('cursor-hover')
    }
  }
}

const onMouseDown = () => {
  isClicking.value = true
  // 涟漪
  rippleId++
  const color = neonColors[Math.floor(Math.random() * neonColors.length)]
  ripples.value.push({ id: rippleId, x: cursorX, y: cursorY, color })
  setTimeout(() => {
    ripples.value = ripples.value.filter(r => r.id !== rippleId)
    isClicking.value = false
  }, 700)
}

onMounted(() => {
  // 初始化光标位置
  cursorX = window.innerWidth / 2
  cursorY = window.innerHeight / 2

  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mousedown', onMouseDown)
  document.body.classList.add('cyber-mode')
  rafId = requestAnimationFrame(animate)
})

onUnmounted(() => {
  cancelAnimationFrame(rafId)
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mousedown', onMouseDown)
  document.body.classList.remove('cyber-mode', 'cursor-hover')
})
</script>

<style>
/* 全局：隐藏默认光标 */
body.cyber-mode,
body.cyber-mode * {
  cursor: none !important;
}
body.cyber-mode a,
body.cyber-mode button,
body.cyber-mode .feature-card,
body.cyber-mode .nav-btn {
  cursor: none !important;
}

/* 自定义光标 */
.cyber-cursor {
  position: fixed;
  z-index: 99999;
  pointer-events: none;
  transform: translate(-50%, -50%);
  transition: transform 0.05s;
}
.cyber-cursor.clicking {
  transform: translate(-50%, -50%) scale(0.7);
}

.cursor-core {
  width: 6px;
  height: 6px;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 0 8px #00f0ff, 0 0 20px #00f0ff, 0 0 40px rgba(0, 240, 255, 0.5);
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  transition: all 0.2s;
}

.cursor-ring {
  width: 24px;
  height: 24px;
  border: 1px solid rgba(0, 240, 255, 0.6);
  border-radius: 50%;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  animation: cursor-ring-spin 3s linear infinite;
  transition: all 0.3s;
}

/* hover 效果 */
body.cursor-hover .cursor-core {
  width: 10px;
  height: 10px;
  background: #ff00ff;
  box-shadow: 0 0 12px #ff00ff, 0 0 30px #ff00ff, 0 0 60px rgba(255, 0, 255, 0.6);
}
body.cursor-hover .cursor-ring {
  width: 40px;
  height: 40px;
  border-color: rgba(255, 0, 255, 0.8);
  animation-duration: 1.5s;
}

/* 十字准星 */
.cursor-cross {
  position: absolute;
  background: rgba(0, 240, 255, 0.3);
}
.cross-h {
  width: 30px;
  height: 1px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.cross-v {
  width: 1px;
  height: 30px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

/* 涟漪 */
.cursor-ripple {
  position: fixed;
  z-index: 99998;
  pointer-events: none;
  width: 0;
  height: 0;
  border: 2px solid var(--ripple-color, #00f0ff);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: ripple-expand 0.7s ease-out forwards;
}

/* 电磁脉冲 */
.cursor-pulse {
  position: fixed;
  z-index: 99997;
  pointer-events: none;
  width: 60px;
  height: 60px;
  border: 1px solid rgba(0, 240, 255, 0.5);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: pulse-expand 0.6s ease-out forwards;
}

@keyframes cursor-ring-spin {
  0% { transform: translate(-50%, -50%) rotate(0deg); }
  100% { transform: translate(-50%, -50%) rotate(360deg); }
}

@keyframes ripple-expand {
  0% { width: 0; height: 0; opacity: 1; border-width: 2px; }
  100% { width: 120px; height: 120px; opacity: 0; border-width: 0; }
}

@keyframes pulse-expand {
  0% { width: 10px; height: 10px; opacity: 1; border-width: 2px; }
  100% { width: 100px; height: 100px; opacity: 0; border-width: 0; }
}
</style>

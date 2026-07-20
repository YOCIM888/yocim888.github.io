<template>
  <div class="app-container">
    <!-- 星空粒子背景 -->
    <canvas ref="starCanvas" id="starfield"></canvas>

    <!-- 侧边栏 -->
    <Sidebar />

    <!-- 主内容 -->
    <MainContent />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Sidebar from './components/Sidebar.vue'
import MainContent from './components/MainContent.vue'

const starCanvas = ref(null)

// 星空粒子动画
let animationId = null
let stars = []
let mouseX = 0
let mouseY = 0

onMounted(() => {
  const canvas = starCanvas.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')

  const resize = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }
  resize()
  window.addEventListener('resize', resize)

  // 初始化星星
  const initStars = () => {
    stars = []
    const count = Math.floor((canvas.width * canvas.height) / 3000)
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.5,
        twinkle: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        opacity: Math.random() * 0.6 + 0.4,
        // 少量星有颜色
        hue: Math.random() < 0.15 ? (Math.random() < 0.5 ? 195 : 300) : 0,
      })
    }
  }
  initStars()
  window.addEventListener('resize', initStars)

  // 鼠标追踪
  const onMouseMove = (e) => {
    mouseX = e.clientX
    mouseY = e.clientY
  }
  window.addEventListener('mousemove', onMouseMove)

  // 流星
  let shootingStars = []

  // 动画循环
  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const cx = canvas.width / 2
    const cy = canvas.height / 2

    // 绘制星空
    for (const s of stars) {
      s.twinkle += s.twinkleSpeed
      const alpha = s.opacity * (0.7 + 0.3 * Math.sin(s.twinkle))

      // 鼠标微移视差
      const dx = (mouseX - cx) * 0.005 * s.r
      const dy = (mouseY - cy) * 0.005 * s.r

      ctx.beginPath()
      if (s.hue > 0) {
        ctx.fillStyle = `hsla(${s.hue}, 100%, 70%, ${alpha})`
        // 彩色星辉
        ctx.shadowColor = `hsla(${s.hue}, 100%, 70%, ${alpha * 0.8})`
        ctx.shadowBlur = s.r * 4
      } else {
        ctx.fillStyle = `rgba(200, 220, 255, ${alpha})`
        ctx.shadowColor = `rgba(200, 220, 255, ${alpha * 0.5})`
        ctx.shadowBlur = s.r * 2
      }
      ctx.arc(s.x + dx, s.y + dy, s.r, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.shadowBlur = 0

    // 流星
    if (Math.random() < 0.008 && shootingStars.length < 2) {
      shootingStars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * 0.5,
        len: Math.random() * 60 + 40,
        speed: Math.random() * 4 + 3,
        angle: Math.PI / 4 + (Math.random() - 0.5) * 0.3,
        life: 1,
        decay: Math.random() * 0.015 + 0.01,
      })
    }

    for (let i = shootingStars.length - 1; i >= 0; i--) {
      const m = shootingStars[i]
      m.x += Math.cos(m.angle) * m.speed
      m.y += Math.sin(m.angle) * m.speed
      m.life -= m.decay

      if (m.life <= 0) {
        shootingStars.splice(i, 1)
        continue
      }

      const grad = ctx.createLinearGradient(
        m.x, m.y,
        m.x - Math.cos(m.angle) * m.len,
        m.y - Math.sin(m.angle) * m.len
      )
      grad.addColorStop(0, `rgba(255, 255, 255, ${m.life})`)
      grad.addColorStop(1, `rgba(255, 255, 255, 0)`)

      ctx.beginPath()
      ctx.strokeStyle = grad
      ctx.lineWidth = 1.5
      ctx.moveTo(m.x, m.y)
      ctx.lineTo(
        m.x - Math.cos(m.angle) * m.len,
        m.y - Math.sin(m.angle) * m.len
      )
      ctx.stroke()
    }

    animationId = requestAnimationFrame(animate)
  }

  animate()

  onUnmounted(() => {
    cancelAnimationFrame(animationId)
    window.removeEventListener('resize', resize)
    window.removeEventListener('resize', initStars)
    window.removeEventListener('mousemove', onMouseMove)
  })
})
</script>

<style scoped>
.app-container {
  width: 100%;
  height: 100vh;
  position: relative;
}
</style>

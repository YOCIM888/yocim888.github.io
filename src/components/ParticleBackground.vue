<template>
  <canvas ref="canvas" class="particle-canvas"></canvas>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const canvas = ref(null)
let ctx = null
let animId = null
let mouseX = 0, mouseY = 0
let w = 0, h = 0
let time = 0

// ---- 星星 ----
let stars = []

// ---- 代码雨 ----
const matrixChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃナニヌネノハヒフヘホマミムメモ';
let rainDrops = []
const RAIN_FONT_SIZE = 13

// ---- 浮动几何体 ----
let geoShapes = []

// ---- 流星 ----
let shootingStars = []

// ---- 数据粒子流 ----
let dataParticles = []

const initStars = () => {
  stars = []
  const count = Math.floor((w * h) / 2500)
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 2 + 0.3,
      twinkle: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.02 + 0.005,
      opacity: Math.random() * 0.6 + 0.4,
      hue: Math.random() < 0.12 ? (Math.random() < 0.5 ? 195 : 300) : 0,
    })
  }
}

const initRain = () => {
  rainDrops = []
  const cols = Math.floor(w / RAIN_FONT_SIZE)
  for (let i = 0; i < cols; i++) {
    rainDrops.push({
      x: i * RAIN_FONT_SIZE + Math.random() * 4,
      y: Math.random() * -h,
      speed: Math.random() * 2.5 + 1.5,
      chars: [],
      len: Math.floor(Math.random() * 15 + 5),
      brightness: Math.random() < 0.02 ? 1 : Math.random() * 0.3 + 0.05, // 少数特别亮
    })
  }
}

const initGeo = () => {
  geoShapes = []
  const count = Math.floor(Math.min(w, h) / 200)
  for (let i = 0; i < count; i++) {
    geoShapes.push({
      x: Math.random() * w,
      y: Math.random() * h,
      size: Math.random() * 30 + 20,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.008,
      driftX: (Math.random() - 0.5) * 0.3,
      driftY: (Math.random() - 0.5) * 0.3,
      type: Math.floor(Math.random() * 3), // 0=diamond, 1=hex, 2=cube
      opacity: Math.random() * 0.08 + 0.03,
      hue: [195, 300, 270, 50][Math.floor(Math.random() * 4)],
    })
  }
}

const initDataParticles = () => {
  dataParticles = []
  const count = 40
  for (let i = 0; i < count; i++) {
    dataParticles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      r: Math.random() * 1.5 + 0.5,
      hue: [195, 300, 270, 50][Math.floor(Math.random() * 4)],
      alpha: Math.random() * 0.5 + 0.2,
      connections: [],
    })
  }
}

// ---- 绘制 ----

const drawStar = (s) => {
  const alpha = s.opacity * (0.6 + 0.4 * Math.sin(s.twinkle + time * 0.03))
  ctx.beginPath()
  if (s.hue > 0) {
    ctx.fillStyle = `hsla(${s.hue}, 100%, 75%, ${alpha})`
    ctx.shadowColor = `hsla(${s.hue}, 100%, 75%, ${alpha * 0.6})`
    ctx.shadowBlur = s.r * 3
  } else {
    ctx.fillStyle = `rgba(200, 220, 255, ${alpha})`
    ctx.shadowColor = `rgba(200, 220, 255, ${alpha * 0.4})`
    ctx.shadowBlur = s.r * 1.5
  }
  ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
  ctx.fill()
  ctx.shadowBlur = 0
}

const drawRain = () => {
  ctx.font = `bold ${RAIN_FONT_SIZE}px "Courier New", monospace`

  for (const drop of rainDrops) {
    // 生成新字符列
    if (drop.chars.length === 0) {
      for (let i = 0; i < drop.len; i++) {
        drop.chars.push(matrixChars[Math.floor(Math.random() * matrixChars.length)])
      }
    }

    for (let i = 0; i < drop.chars.length; i++) {
      const charY = drop.y - i * RAIN_FONT_SIZE
      if (charY < -RAIN_FONT_SIZE || charY > h + RAIN_FONT_SIZE) continue

      const alpha = 1 - i / drop.chars.length

      // 头部亮色
      if (i === 0) {
        ctx.fillStyle = `rgba(200, 255, 200, ${alpha * drop.brightness * 2})`
        ctx.shadowColor = `rgba(0, 255, 100, ${alpha * 0.5})`
        ctx.shadowBlur = 6
      } else if (i < 3) {
        ctx.fillStyle = `rgba(100, 255, 100, ${alpha * drop.brightness})`
        ctx.shadowColor = 'transparent'
        ctx.shadowBlur = 0
      } else {
        ctx.fillStyle = `rgba(0, 150, 30, ${alpha * drop.brightness * 0.6})`
        ctx.shadowColor = 'transparent'
        ctx.shadowBlur = 0
      }

      ctx.fillText(drop.chars[i], drop.x, charY)

      // 偶尔变换字符
      if (Math.random() < 0.03) {
        drop.chars[i] = matrixChars[Math.floor(Math.random() * matrixChars.length)]
      }
    }

    drop.y += drop.speed
    if (drop.y - drop.chars.length * RAIN_FONT_SIZE > h) {
      drop.y = Math.random() * -100
      drop.len = Math.floor(Math.random() * 15 + 5)
      drop.chars = []
      drop.brightness = Math.random() < 0.02 ? 1 : Math.random() * 0.3 + 0.05
    }
  }
  ctx.shadowBlur = 0
}

const drawGeo = () => {
  for (const g of geoShapes) {
    g.rotation += g.rotSpeed
    g.x += g.driftX
    g.y += g.driftY
    if (g.x < -50) g.x = w + 50
    if (g.x > w + 50) g.x = -50
    if (g.y < -50) g.y = h + 50
    if (g.y > h + 50) g.y = -50

    ctx.save()
    ctx.translate(g.x, g.y)
    ctx.rotate(g.rotation)
    ctx.strokeStyle = `hsla(${g.hue}, 100%, 70%, ${g.opacity})`
    ctx.lineWidth = 0.5
    ctx.shadowColor = `hsla(${g.hue}, 100%, 70%, ${g.opacity * 0.5})`
    ctx.shadowBlur = 4

    ctx.beginPath()
    const s = g.size
    if (g.type === 0) {
      // 菱形
      ctx.moveTo(0, -s)
      ctx.lineTo(s, 0)
      ctx.lineTo(0, s)
      ctx.lineTo(-s, 0)
    } else if (g.type === 1) {
      // 六边形
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 6
        const fx = Math.cos(angle) * s * 0.7
        const fy = Math.sin(angle) * s * 0.7
        i === 0 ? ctx.moveTo(fx, fy) : ctx.lineTo(fx, fy)
      }
    } else {
      // 十字/星形
      ctx.moveTo(0, -s)
      ctx.lineTo(s * 0.3, -s * 0.3)
      ctx.lineTo(s, 0)
      ctx.lineTo(s * 0.3, s * 0.3)
      ctx.lineTo(0, s)
      ctx.lineTo(-s * 0.3, s * 0.3)
      ctx.lineTo(-s, 0)
      ctx.lineTo(-s * 0.3, -s * 0.3)
    }
    ctx.closePath()
    ctx.stroke()
    ctx.shadowBlur = 0
    ctx.restore()
  }
}

const drawShootingStars = () => {
  if (Math.random() < 0.015 && shootingStars.length < 3) {
    shootingStars.push({
      x: Math.random() * w,
      y: Math.random() * h * 0.5,
      len: Math.random() * 80 + 50,
      speed: Math.random() * 5 + 3,
      angle: Math.PI / 4 + (Math.random() - 0.5) * 0.4,
      life: 1,
      decay: Math.random() * 0.012 + 0.006,
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

    const ex = m.x - Math.cos(m.angle) * m.len
    const ey = m.y - Math.sin(m.angle) * m.len
    const grad = ctx.createLinearGradient(m.x, m.y, ex, ey)
    grad.addColorStop(0, `rgba(255, 255, 255, ${m.life})`)
    grad.addColorStop(0.3, `rgba(200, 220, 255, ${m.life * 0.6})`)
    grad.addColorStop(1, 'rgba(200, 220, 255, 0)')

    ctx.beginPath()
    ctx.strokeStyle = grad
    ctx.lineWidth = 1.5
    ctx.moveTo(m.x, m.y)
    ctx.lineTo(ex, ey)
    ctx.stroke()
  }
}

const drawDataParticles = () => {
  // 连接线
  ctx.strokeStyle = 'rgba(0, 240, 255, 0.04)'
  ctx.lineWidth = 0.5
  for (let i = 0; i < dataParticles.length; i++) {
    const a = dataParticles[i]
    for (let j = i + 1; j < dataParticles.length; j++) {
      const b = dataParticles[j]
      const dx = a.x - b.x
      const dy = a.y - b.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < 120) {
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.stroke()
      }
    }
  }

  // 粒子
  for (const p of dataParticles) {
    p.x += p.vx
    p.y += p.vy
    if (p.x < 0) p.x = w
    if (p.x > w) p.x = 0
    if (p.y < 0) p.y = h
    if (p.y > h) p.y = 0

    ctx.beginPath()
    ctx.fillStyle = `hsla(${p.hue}, 100%, 70%, ${p.alpha})`
    ctx.shadowColor = `hsla(${p.hue}, 100%, 70%, ${p.alpha * 0.6})`
    ctx.shadowBlur = p.r * 3
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
    ctx.fill()
    ctx.shadowBlur = 0
  }
}

// ---- 主循环 ----
const animate = () => {
  time++
  ctx.clearRect(0, 0, w, h)

  drawDataParticles()
  drawGeo()
  drawRain()
  for (const s of stars) drawStar(s)
  drawShootingStars()

  animId = requestAnimationFrame(animate)
}

// ---- 生命周期 ----
onMounted(() => {
  const c = canvas.value
  ctx = c.getContext('2d')

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    w = window.innerWidth
    h = window.innerHeight
    c.width = w * dpr
    c.height = h * dpr
    c.style.width = w + 'px'
    c.style.height = h + 'px'
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    initStars()
    initRain()
    initGeo()
    initDataParticles()
  }
  resize()
  window.addEventListener('resize', resize)

  const onMouse = (e) => {
    mouseX = e.clientX
    mouseY = e.clientY
  }
  window.addEventListener('mousemove', onMouse)

  // 页面不可见时暂停
  const onVis = () => {
    if (document.hidden) {
      cancelAnimationFrame(animId)
    } else {
      animId = requestAnimationFrame(animate)
    }
  }
  document.addEventListener('visibilitychange', onVis)

  animId = requestAnimationFrame(animate)

  onUnmounted(() => {
    cancelAnimationFrame(animId)
    window.removeEventListener('resize', resize)
    window.removeEventListener('mousemove', onMouse)
    document.removeEventListener('visibilitychange', onVis)
  })
})
</script>

<style scoped>
.particle-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
}
</style>

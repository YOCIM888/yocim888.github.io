<template>
  <!-- 加载动画 -->
  <LoadingScreen @complete="onLoadingComplete" />

  <!-- 主应用 (加载完成后显示) -->
  <div class="app-container" :class="{ 'app-ready': !loading }">
    <!-- 增强粒子背景 -->
    <ParticleBackground />

    <!-- 自定义光标 -->
    <CyberCursor />

    <!-- 侧边栏 -->
    <Sidebar />

    <!-- 主内容 -->
    <MainContent />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import LoadingScreen from './components/LoadingScreen.vue'
import ParticleBackground from './components/ParticleBackground.vue'
import CyberCursor from './components/CyberCursor.vue'
import Sidebar from './components/Sidebar.vue'
import MainContent from './components/MainContent.vue'

const loading = ref(true)

const onLoadingComplete = () => {
  loading.value = false
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
</style>

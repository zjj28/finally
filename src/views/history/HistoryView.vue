<template>
  <div class="history-view" :class="{ 'dark-mode': isDark }">
    <!-- 顶部导航 -->
    <nav class="nav-bar">
      <router-link to="/" class="nav-logo">
        <i class="icon">🚄</i>
        <span>中国高铁</span>
      </router-link>
      <div class="nav-links">
        <router-link to="/" class="nav-link">首页</router-link>
        <router-link to="/history" class="nav-link active">发展历程</router-link>
        <router-link to="/knowledge" class="nav-link">知识图谱</router-link>
        <router-link to="/chat" class="nav-link">智能助手</router-link>
      </div>
      <button class="theme-toggle" @click="toggleTheme">
        {{ isDark ? '🌞' : '🌙' }}
      </button>
    </nav>

    <!-- 主要内容 -->
    <main class="main-content">
      <div class="page-header">
        <h1>
          <i class="icon">📅</i>
          高铁发展历程
        </h1>
        <p class="subtitle">见证中国高铁的辉煌发展历程</p>
      </div>

      <!-- 时间轴组件 -->
      <HistoryTimeline />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import HistoryTimeline from '@/components/HistoryTimeline.vue'

const isDark = ref(false)

const toggleTheme = () => {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark-mode')
}
</script>

<style scoped>
.history-view {
  min-height: 100vh;
  background: var(--bg-color);
  transition: all 0.3s;
}

.nav-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.nav-logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.2rem;
  font-weight: bold;
  color: var(--primary-color);
  text-decoration: none;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-link {
  color: var(--text-color);
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  transition: all 0.3s;
}

.nav-link:hover,
.nav-link.active {
  background: var(--primary-color);
  color: white;
}

.theme-toggle {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.3s;
}

.theme-toggle:hover {
  background: rgba(0, 0, 0, 0.1);
}

.main-content {
  padding: 100px 2rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 4rem;
  animation: fadeIn 1s ease-out;
}

.page-header h1 {
  font-size: 2.5rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.subtitle {
  font-size: 1.2rem;
  color: var(--text-color);
  opacity: 0.8;
}

.icon {
  font-size: 1.5em;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 深色模式 */
:deep(.dark-mode) .nav-bar {
  background: rgba(31, 31, 31, 0.9);
}

:deep(.dark-mode) .theme-toggle:hover {
  background: rgba(255, 255, 255, 0.1);
}
</style> 
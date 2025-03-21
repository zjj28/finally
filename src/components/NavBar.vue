<template>
  <nav class="nav-bar">
    <router-link to="/" class="nav-logo">
      <i class="icon">🚄</i>
      <span>中国高铁</span>
    </router-link>
    <div class="nav-links">
      <router-link to="/" class="nav-link" :class="{ active: currentPath === '/' }">首页</router-link>
      <router-link to="/history" class="nav-link" :class="{ active: currentPath === '/history' }">发展历程</router-link>
      <router-link to="/knowledge" class="nav-link" :class="{ active: currentPath === '/knowledge' }">知识图谱</router-link>
      <router-link to="/chat" class="nav-link" :class="{ active: currentPath === '/chat' }">智能助手</router-link>
    </div>
    <button class="theme-toggle" @click="toggleTheme">
      {{ isDark ? '🌞' : '🌙' }}
    </button>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useTheme } from '@/composables/useTheme'

const route = useRoute()
const currentPath = computed(() => route.path)
const { isDark, toggleTheme } = useTheme()
</script>

<style scoped>
.nav-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
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
  font-size: 1.1rem;
  color: var(--text-color);
  text-decoration: none;
  min-width: 120px;
}

.nav-links {
  display: flex;
  gap: 2rem;
  flex: 1;
  justify-content: center;
}

.nav-link {
  color: var(--text-color);
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  transition: all 0.3s;
  white-space: nowrap;
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
  min-width: 48px;
}

.theme-toggle:hover {
  background: rgba(0, 0, 0, 0.1);
}

/* 深色模式 */
:deep(.dark-mode) .nav-bar {
  background: rgba(31, 31, 31, 0.9);
}

:deep(.dark-mode) .nav-link {
  color: #fff;
}

:deep(.dark-mode) .nav-logo {
  color: #fff;
}

:deep(.dark-mode) .theme-toggle:hover {
  background: rgba(255, 255, 255, 0.1);
}
</style> 
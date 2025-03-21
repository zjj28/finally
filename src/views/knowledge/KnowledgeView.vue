<template>
  <div class="knowledge-view" :class="{ 'dark-mode': isDark }">
    <NavBar />
    <main class="main-content">
      <div class="page-header">
        <h1>
          <i class="icon">🗺️</i>
          高铁知识图谱
        </h1>
        <p class="subtitle">探索中国高铁技术体系</p>
      </div>
      <KnowledgeMap />
    </main>
  </div>
</template>

<script setup>
import NavBar from '@/components/NavBar.vue'
import KnowledgeMap from '@/components/KnowledgeMap.vue'
import { useTheme } from '@/composables/useTheme'

const { isDark } = useTheme()
</script>

<style scoped>
.knowledge-view {
  min-height: 100vh;
  background: var(--bg-color);
  transition: all 0.3s;
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
  font-size: 2rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.subtitle {
  font-size: 1.1rem;
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
</style> 
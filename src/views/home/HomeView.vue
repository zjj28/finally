<template>
  <div class="home-view" :class="{ 'dark-mode': isDark }">
    <NavBar />
    <main class="main-content">
      <!-- 新闻轮播区域 -->
      <section class="news-section">
        <h2 class="section-title">
          <i class="icon">📰</i>
          高铁要闻
        </h2>
        <NewsCarousel />
      </section>

      <!-- 主视觉区域 -->
      <section class="hero-section">
        <h1 class="hero-title">驰骋神州 连通天下</h1>
        <p class="hero-subtitle">见证中国高铁的辉煌发展历程</p>
      </section>

      <!-- 铁路先驱 -->
      <section id="people" class="people-section">
        <h2 class="section-title">
          <i class="icon">👥</i>
          铁路先驱
        </h2>
        <PeopleGrid />
      </section>

      <!-- 高铁网络展示 -->
      <section id="gallery" class="gallery-section">
        <h2 class="section-title">
          <i class="icon">🚄</i>
          中国高铁
        </h2>
        <GalleryView />
      </section>
    </main>
  </div>
</template>

<script setup>
import NavBar from '@/components/NavBar.vue'
import NewsCarousel from './components/NewsCarousel.vue'
import PeopleGrid from './components/PeopleGrid.vue'
import GalleryView from './components/GalleryView.vue'
import { useTheme } from '@/composables/useTheme'

const { isDark } = useTheme()
</script>

<style scoped>
.home-view {
  min-height: 100vh;
  background: var(--bg-color);
  transition: all 0.3s;
}

.main-content {
  padding: 80px 2rem 2rem;
  max-width: 1100px;
  margin: 0 auto;
}

.hero-section {
  text-align: center;
  padding: 3rem 0;
  animation: fadeIn 1s ease-out;
}

.hero-title {
  font-size: 2.2rem;
  color: var(--primary-color);
  margin-bottom: 0.8rem;
}

.hero-subtitle {
  font-size: 1.1rem;
  color: var(--text-color);
  opacity: 0.8;
}

.section-title {
  font-size: 1.6rem;
  color: var(--primary-color);
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.icon {
  font-size: 1.3em;
}

.people-section,
.gallery-section {
  padding: 3rem 0;
}

.news-section {
  padding: 2rem 0;
  margin-bottom: 2rem;
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
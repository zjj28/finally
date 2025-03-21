<template>
    <div class="gallery-view">
      <div class="gallery-carousel">
        <div class="carousel-container" 
             @mouseenter="pauseAutoPlay" 
             @mouseleave="startAutoPlay">
          <div class="carousel-track" :style="carouselStyle">
            <div v-for="(image, index) in images" 
                 :key="index"
                 class="carousel-item"
                 :class="{ active: currentIndex === index }"
                 @click="handleImageClick(image.link)">
              <img :src="image.url" :alt="image.title">
              <div class="image-info">
                <h3>{{ image.title }}</h3>
                <p>{{ image.description }}</p>
              </div>
            </div>
          </div>
          
          <!-- 导航按钮 -->
          <button class="nav-btn prev" @click="prevImage">❮</button>
          <button class="nav-btn next" @click="nextImage">❯</button>
          
          <!-- 指示器 -->
          <div class="carousel-indicators">
            <span v-for="(_, index) in images" 
                  :key="index"
                  class="indicator"
                  :class="{ active: currentIndex === index }"
                  @click="goToSlide(index)">
            </span>
          </div>
        </div>
      </div>
    </div>
  </template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'

const images = [
  {
    url: '/images/gallery/network-1.jpg',
    title: '京沪高铁',
    description: '连接北京与上海的高速铁路，全长1318公里',
    link: 'https://www.china-railway.com.cn/jinghu/'
  },
  {
    url: '/images/gallery/network-2.jpg',
    title: '复兴号动车组',
    description: '中国自主研发的新一代高速列车',
    link: 'https://www.china-railway.com.cn/fuxing/'
  },
  {
    url: '/images/gallery/network-3.jpg',
    title: '高铁站台',
    description: '现代化的高铁站台设施',
    link: 'https://www.12306.cn/'
  },
  {
    url: '/images/gallery/network-4.jpg',
    title: '高铁网络',
    description: '中国高铁网络示意图',
    link: 'https://www.12306.cn/mormhweb/kyfw/'
  }
]

const currentIndex = ref(0)
const autoPlayInterval = ref(null)
const autoPlayDelay = 3000 // 修改为3秒

const carouselStyle = computed(() => ({
  transform: `translateX(-${currentIndex.value * 100}%)`,
  transition: 'transform 0.5s ease-in-out'
}))

const nextImage = () => {
  currentIndex.value = (currentIndex.value + 1) % images.length
}

const prevImage = () => {
  currentIndex.value = (currentIndex.value - 1 + images.length) % images.length
}

const goToSlide = (index) => {
  currentIndex.value = index
}

const handleImageClick = (link) => {
  if (link) {
    window.open(link, '_blank')
  }
}

const startAutoPlay = () => {
  if (!autoPlayInterval.value) {
    autoPlayInterval.value = setInterval(nextImage, autoPlayDelay)
  }
}

const pauseAutoPlay = () => {
  if (autoPlayInterval.value) {
    clearInterval(autoPlayInterval.value)
    autoPlayInterval.value = null
  }
}

onMounted(() => {
  startAutoPlay()
})

onUnmounted(() => {
  if (autoPlayInterval.value) {
    clearInterval(autoPlayInterval.value)
  }
})
</script>

<style scoped>
.gallery-view {
  padding: 2rem 0;
}

.gallery-carousel {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
}

.carousel-container {
  width: 100%;
  height: 600px;
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.carousel-track {
  display: flex;
  width: 100%;
  height: 100%;
}

.carousel-item {
  min-width: 100%;
  height: 100%;
  position: relative;
  cursor: pointer;
  transition: transform 0.3s;
}

.carousel-item:hover {
  transform: scale(1.02);
}

.carousel-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 2rem;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  color: white;
  transform: translateY(0);
  transition: transform 0.3s;
}

.carousel-item:hover .image-info {
  transform: translateY(-10px);
}

.image-info h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.image-info p {
  font-size: 1rem;
  opacity: 0.9;
}

.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  opacity: 0;
}

.carousel-container:hover .nav-btn {
  opacity: 1;
}

.nav-btn:hover {
  background: rgba(0, 0, 0, 0.8);
}

.prev {
  left: 20px;
}

.next {
  right: 20px;
}

.carousel-indicators {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
}

.indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.3s;
}

.indicator.active {
  background: white;
  transform: scale(1.2);
}

/* 深色模式适配 */
:deep(.dark-mode) .nav-btn {
  background: rgba(255, 255, 255, 0.2);
}

:deep(.dark-mode) .nav-btn:hover {
  background: rgba(255, 255, 255, 0.4);
}
</style>
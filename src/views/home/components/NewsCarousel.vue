<template>
  <div class="news-carousel">
    <div class="news-cards">
      <div v-for="(news, index) in newsItems" 
           :key="index" 
           class="news-card"
           @click="showNewsDetail(news)">
        <div class="news-card-inner">
          <div class="news-card-front">
            <img :src="news.image" :alt="news.title">
            <div class="news-info">
              <h3>{{ news.title }}</h3>
              <p class="news-date">{{ news.date }}</p>
            </div>
          </div>
          <div class="news-card-back">
            <p class="news-summary">{{ news.summary }}</p>
            <button class="read-more">阅读全文</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 新闻详情弹窗 -->
    <div v-if="selectedNews" class="news-modal" @click.self="closeNewsDetail">
      <div class="modal-content">
        <button class="close-button" @click="closeNewsDetail">&times;</button>
        <h2>{{ selectedNews.title }}</h2>
        <p class="modal-date">{{ selectedNews.date }}</p>
        <img :src="selectedNews.image" :alt="selectedNews.title">
        <div class="modal-body">
          <p>{{ selectedNews.content }}</p>
        </div>
        <button class="back-button" @click="closeNewsDetail">返回首页</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const selectedNews = ref(null)

const newsItems = [
  {
    title: '京津城际铁路实现时速350公里运营',
    date: '2024-03-20',
    summary: '京津城际铁路提速改造完成，实现时速350公里运营，进一步缩短两地通勤时间。',
    content: '京津城际铁路经过全面提速改造后，已于今日正式实现时速350公里运营。这一提速不仅标志着我国高铁技术的又一重要突破，更为京津两地居民带来更便捷的出行体验。新的运营速度将京津间的通勤时间缩短至30分钟以内，对推动京津冀协同发展具有重要意义。',
    image: '/images/news/jing-jin.jpg'
  },
  {
    title: '中国高铁总里程突破4.5万公里',
    date: '2024-03-18',
    summary: '中国高铁建设再创新高，总运营里程突破4.5万公里，继续保持世界第一。',
    content: '据国家铁路局最新统计数据显示，截至2024年3月，中国高铁运营总里程已突破4.5万公里，约占全球高铁总里程的三分之二。这一成就不仅体现了中国在高铁建设领域的领先地位，也为推动区域经济发展、改善民生提供了重要支撑。',
    image: '/images/news/milestone.jpg'
  },
  {
    title: '智能高铁技术创新成果发布',
    date: '2024-03-15',
    summary: '多项智能高铁技术创新成果发布，包括自动驾驶系统升级和智能维护平台。',
    content: '在今日举行的全国铁路科技创新大会上，多项智能高铁技术创新成果集中发布。其中包括新一代高铁自动驾驶系统、基于人工智能的轨道维护平台等重要技术突破。这些创新成果将进一步提升中国高铁的智能化水平和运营效率。',
    image: '/images/news/smart-rail.jpg'
  }
]

const showNewsDetail = (news) => {
  selectedNews.value = news
  document.body.style.overflow = 'hidden'
}

const closeNewsDetail = () => {
  selectedNews.value = null
  document.body.style.overflow = 'auto'
}
</script>

<style scoped>
.news-carousel {
  width: 100%;
  overflow: hidden;
}

.news-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  padding: 1rem;
}

.news-card {
  perspective: 1500px;
  height: 300px;
}

.news-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.8s;
  transform-style: preserve-3d;
  cursor: pointer;
}

.news-card:hover .news-card-inner {
  transform: rotateY(180deg);
}

.news-card-front,
.news-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 12px;
  overflow: hidden;
}

.news-card-front {
  background: var(--card-bg);
}

.news-card-front img {
  width: 100%;
  height: 60%;
  object-fit: cover;
}

.news-info {
  padding: 1rem;
}

.news-info h3 {
  font-size: 1rem;
  margin-bottom: 0.5rem;
  color: var(--text-color);
}

.news-date {
  font-size: 0.9rem;
  color: var(--text-color);
  opacity: 0.8;
}

.news-card-back {
  background: var(--primary-color);
  color: white;
  transform: rotateY(180deg);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.news-summary {
  font-size: 1rem;
  line-height: 1.6;
}

.read-more {
  align-self: center;
  padding: 0.5rem 1.5rem;
  background: white;
  color: var(--primary-color);
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
}

.read-more:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

/* 弹窗样式 */
.news-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: var(--card-bg);
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  border-radius: 12px;
  padding: 2rem;
  position: relative;
  overflow-y: auto;
}

.close-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: var(--text-color);
}

.modal-content h2 {
  font-size: 1.6rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.modal-date {
  color: var(--text-color);
  opacity: 0.8;
  margin-bottom: 1.5rem;
}

.modal-content img {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.modal-body {
  line-height: 1.8;
  color: var(--text-color);
}

.back-button {
  display: block;
  margin: 2rem auto 0;
  padding: 0.8rem 2rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 1rem;
}

.back-button:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

/* 深色模式 */
:deep(.dark-mode) .news-card-front {
  background: #1f1f1f;
}

:deep(.dark-mode) .modal-content {
  background: #1f1f1f;
}

:deep(.dark-mode) .back-button {
  background: var(--primary-color);
  color: white;
}
</style> 
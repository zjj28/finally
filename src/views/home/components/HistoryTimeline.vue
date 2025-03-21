<template>
  <div class="timeline">
    <div v-for="(event, index) in events" :key="index" class="timeline-item">
      <div class="timeline-content" :class="{ 'right': index % 2 === 0 }">
        <div class="time-badge">{{ event.year }}</div>
        <div class="content-card">
          <h3>{{ event.title }}</h3>
          <p>{{ event.description }}</p>
          <img v-if="event.image" :src="event.image" :alt="event.title">
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const events = [
  {
    year: '2008',
    title: '京津城际铁路开通',
    description: '中国第一条高速铁路正式通车运营，最高时速350公里。',
    image: '/images/timeline/2008.jpg'
  },
  {
    year: '2011',
    title: '京沪高铁通车',
    description: '全长1318公里，连接中国两大直辖市，标志着中国高铁进入新时代。',
    image: '/images/timeline/2011.jpg'
  },
  {
    year: '2017',
    title: '复兴号投入运营',
    description: '中国标准动车组实现全面自主知识产权，最高时速达到350公里。',
    image: '/images/timeline/2017.jpg'
  },
  {
    year: '2022',
    title: '智能高铁新突破',
    description: '智能动车组研制成功，标志着中国高铁进入智能化时代。',
    image: '/images/timeline/2022.jpg'
  }
]
</script>

<style scoped>
.timeline {
  position: relative;
  padding: 2rem 0;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--primary-color);
  transform: translateX(-50%);
}

.timeline-item {
  margin-bottom: 3rem;
  position: relative;
}

.timeline-content {
  width: 45%;
  position: relative;
  padding: 1rem;
}

.timeline-content.right {
  margin-left: auto;
}

.time-badge {
  position: absolute;
  top: 0;
  width: 120px;
  padding: 0.5rem 1rem;
  background: var(--primary-color);
  color: white;
  text-align: center;
  border-radius: 4px;
  font-weight: bold;
}

.right .time-badge {
  left: -140px;
}

.timeline-content:not(.right) .time-badge {
  right: -140px;
}

.content-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.content-card:hover {
  transform: translateY(-5px);
}

.content-card h3 {
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.content-card p {
  margin-bottom: 1rem;
  line-height: 1.6;
}

.content-card img {
  width: 100%;
  border-radius: 4px;
  margin-top: 1rem;
}

/* 深色模式 */
:deep(.dark-mode) .content-card {
  background: #1f1f1f;
}
</style> 
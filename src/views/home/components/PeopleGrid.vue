<template>
  <div class="people-grid">
    <div v-for="(person, index) in pioneers" :key="index" class="person-card">
      <div class="person-image">
        <img :src="person.image" :alt="person.name">
      </div>
      <div class="person-info">
        <h3>{{ person.name }}</h3>
        <p class="person-title">{{ person.title }}</p>
        <p class="person-description">{{ person.description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
const pioneers = [
  {
    name: '詹天佑',
    title: '中国近代铁路之父',
    description: '中国近代著名铁路工程专家，京张铁路的总工程师。他成功建造了中国人自己的第一条铁路，为中国铁路事业的发展做出了巨大贡献。',
    image: '/images/pioneers/zhan-tianyou.jpg'
  },
  {
    name: '林同炎',
    title: '高铁技术先驱',
    description: '中国高速铁路技术的开拓者之一，为中国高铁技术的发展和创新做出了重要贡献。',
    image: '/images/pioneers/lin-tongyan.jpg'
  }
]
</script>

<style scoped>
.people-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  padding: 1rem;
}

.person-card {
  background: var(--card-bg);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.person-card:hover {
  transform: translateY(-5px);
}

.person-image {
  width: 100%;
  height: 300px;
  overflow: hidden;
}

.person-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.person-card:hover .person-image img {
  transform: scale(1.05);
}

.person-info {
  padding: 1.5rem;
}

.person-info h3 {
  font-size: 1.5rem;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.person-title {
  font-size: 1rem;
  color: var(--text-color);
  opacity: 0.8;
  margin-bottom: 1rem;
}

.person-description {
  font-size: 0.9rem;
  line-height: 1.6;
  color: var(--text-color);
}

/* 深色模式 */
:deep(.dark-mode) .person-card {
  background: #1f1f1f;
}
</style> 
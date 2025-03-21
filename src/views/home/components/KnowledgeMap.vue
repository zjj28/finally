<template>
  <div class="knowledge-map">
    <div class="knowledge-container">
      <!-- 中心节点 -->
      <div class="center-node">
        <div class="node-content">
          <i class="node-icon">🚄</i>
          <span>中国高铁</span>
        </div>
      </div>
      
      <!-- 知识分类卡片 -->
      <div class="knowledge-cards">
        <div v-for="(category, index) in categories" 
             :key="index"
             class="category-card"
             :class="{ 'expanded': expandedIndex === index }">
          <div class="card-header" @click="toggleExpand(index)">
            <i class="category-icon">{{ category.icon }}</i>
            <h3>{{ category.title }}</h3>
          </div>
          <transition name="expand">
            <div v-show="expandedIndex === index" class="card-content">
              <div v-for="(item, itemIndex) in category.items" 
                   :key="itemIndex"
                   class="knowledge-item"
                   @click="showDetail(item)">
                <i class="item-icon">{{ item.icon }}</i>
                <div class="item-info">
                  <h4>{{ item.name }}</h4>
                  <p>{{ item.description }}</p>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>

    <!-- 详情弹窗 -->
    <div v-if="selectedItem" 
         class="detail-modal"
         @click="closeDetail">
      <div class="modal-content" @click.stop>
        <button class="close-btn" @click="closeDetail">×</button>
        <h3>{{ selectedItem.name }}</h3>
        <div class="detail-content">
          <img v-if="selectedItem.image" :src="selectedItem.image" :alt="selectedItem.name">
          <div class="detail-text">
            <p class="detail-description">{{ selectedItem.description }}</p>
            <ul v-if="selectedItem.details">
              <li v-for="(detail, index) in selectedItem.details" 
                  :key="index">{{ detail }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const categories = [
  {
    title: '技术创新',
    icon: '🔧',
    items: [
      {
        name: '复兴号动车组',
        icon: '🚅',
        description: '中国自主研发的新一代高速列车',
        image: '/images/knowledge/fuxing.jpg',
        details: [
          '最高时速350公里/小时',
          '完全自主知识产权',
          '智能化运维系统',
          '优化的空气动力学设计'
        ]
      },
      {
        name: '智能动车组',
        icon: '🤖',
        description: '配备智能化系统的新型列车',
        details: [
          '自动驾驶技术',
          '智能故障诊断',
          '实时状态监测',
          '智能化客服系统'
        ]
      }
    ]
  },
  {
    title: '线路网络',
    icon: '🛤️',
    items: [
      {
        name: '八纵八横',
        icon: '🗺️',
        description: '中国高铁网络主骨架',
        details: [
          '总里程超2万公里',
          '连接全国主要城市',
          '构建快速交通网络',
          '促进区域经济发展'
        ]
      },
      {
        name: '高铁枢纽',
        icon: '🏗️',
        description: '重要的高铁交通节点',
        details: [
          '北京南站',
          '上海虹桥站',
          '广州南站',
          '武汉站'
        ]
      }
    ]
  },
  {
    title: '运营管理',
    icon: '⚙️',
    items: [
      {
        name: '智能调度',
        icon: '📊',
        description: '先进的列车运行控制系统',
        details: [
          '自动化调度系统',
          '实时监控平台',
          '应急处置机制',
          '智能化运维'
        ]
      },
      {
        name: '服务体系',
        icon: '👥',
        description: '全方位的旅客服务保障',
        details: [
          '智能购票系统',
          '无障碍服务',
          '餐饮服务',
          '商务设施'
        ]
      }
    ]
  },
  {
    title: '发展成就',
    icon: '🏆',
    items: [
      {
        name: '技术突破',
        icon: '💡',
        description: '高铁技术创新成果',
        details: [
          '自主知识产权体系',
          '核心技术突破',
          '国际标准制定',
          '创新专利数量'
        ]
      },
      {
        name: '经济效益',
        icon: '📈',
        description: '高铁发展带来的经济价值',
        details: [
          '促进区域发展',
          '带动相关产业',
          '创造就业机会',
          '提升经济效率'
        ]
      }
    ]
  }
]

const expandedIndex = ref(null)
const selectedItem = ref(null)

const toggleExpand = (index) => {
  expandedIndex.value = expandedIndex.value === index ? null : index
}

const showDetail = (item) => {
  selectedItem.value = item
}

const closeDetail = () => {
  selectedItem.value = null
}
</script>

<style scoped>
.knowledge-map {
  position: relative;
  padding: 2rem;
  min-height: 600px;
}

.knowledge-container {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
}

.center-node {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto 3rem;
  cursor: pointer;
  transition: transform 0.3s;
}

.center-node:hover {
  transform: scale(1.05);
}

.node-content {
  width: 100%;
  height: 100%;
  background: var(--primary-color);
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.node-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.knowledge-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.category-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s;
}

.card-header {
  padding: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.card-header:hover {
  background: rgba(0, 0, 0, 0.02);
}

.category-card.expanded .card-header {
  background: var(--primary-color);
  color: white;
}

.category-card.expanded .card-header h3 {
  color: white;
}

.card-content {
  overflow: hidden;
}

.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease-in-out;
  max-height: 500px;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}

.category-icon {
  font-size: 1.5rem;
}

.card-header h3 {
  margin: 0;
  color: var(--primary-color);
}

.knowledge-item {
  padding: 1rem 1.5rem;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.knowledge-item:hover {
  background: rgba(0, 0, 0, 0.02);
}

.item-icon {
  font-size: 1.2rem;
}

.item-info h4 {
  margin: 0 0 0.5rem;
  color: var(--text-color);
}

.item-info p {
  margin: 0;
  font-size: 0.9rem;
  color: rgba(0, 0, 0, 0.6);
}

.detail-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--text-color);
}

.detail-content {
  margin-top: 1.5rem;
}

.detail-content img {
  width: 100%;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.detail-description {
  margin-bottom: 1rem;
  line-height: 1.6;
}

.detail-content ul {
  list-style: none;
  padding: 0;
}

.detail-content li {
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.detail-content li:last-child {
  border-bottom: none;
}

/* 深色模式 */
:deep(.dark-mode) .category-card {
  background: #1f1f1f;
}

:deep(.dark-mode) .knowledge-item {
  background: rgba(255, 255, 255, 0.05);
}

:deep(.dark-mode) .knowledge-item:hover {
  background: rgba(255, 255, 255, 0.08);
}

:deep(.dark-mode) .modal-content {
  background: #1f1f1f;
}

:deep(.dark-mode) .detail-content li {
  border-bottom-color: rgba(255, 255, 255, 0.1);
}
</style> 
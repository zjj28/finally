<template>
  <div class="knowledge-map">
    <!-- 左侧导航栏 -->
    <div class="sidebar">
      <div v-for="(category, index) in categories" 
           :key="index"
           class="category-item"
           :class="{ 'active': expandedIndex === index }">
        <div class="category-header" @click="toggleExpand(index)">
          <i class="category-icon">{{ category.icon }}</i>
          <span>{{ category.title }}</span>
          <i class="arrow-icon">{{ expandedIndex === index ? '▼' : '▶' }}</i>
        </div>
        <transition name="expand">
          <div v-show="expandedIndex === index" class="subcategories">
            <div v-for="(item, itemIndex) in category.items" 
                 :key="itemIndex"
                 class="subcategory-item"
                 @click="showDetail(item)">
              <i class="item-icon">{{ item.icon }}</i>
              <span>{{ item.name }}</span>
            </div>
          </div>
        </transition>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="content-area">
      <div v-if="selectedItem" class="detail-panel">
        <div class="detail-header">
          <h2>
            <i class="item-icon">{{ selectedItem.icon }}</i>
            {{ selectedItem.name }}
          </h2>
          <button class="close-btn" @click="closeDetail">×</button>
        </div>
        <div class="detail-content">
          <p class="detail-description">{{ selectedItem.description }}</p>
          <div v-if="selectedItem.details" class="detail-list">
            <div v-for="(detail, index) in selectedItem.details" 
                 :key="index"
                 class="detail-item">
              {{ detail }}
            </div>
          </div>
        </div>
      </div>
      <div v-else class="empty-state">
        <i class="empty-icon">🔍</i>
        <p>请从左侧选择一个主题以查看详细信息</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const categories = [
  {
    icon: '🚄',
    title: '车辆技术',
    items: [
      {
        icon: '🔧',
        name: '转向架系统',
        description: '高铁列车的"腿脚"，决定了列车的稳定性和安全性。',
        details: [
          '采用转向架减振技术',
          '高速轴承设计',
          '空气弹簧系统'
        ]
      },
      {
        icon: '⚡',
        name: '牵引系统',
        description: '为列车提供动力的核心系统。',
        details: [
          '永磁同步电机',
          '变频控制技术',
          '能量回收系统'
        ]
      }
    ]
  },
  {
    icon: '🛤️',
    title: '轨道工程',
    items: [
      {
        icon: '🌉',
        name: '无砟轨道',
        description: '现代高铁的标配轨道结构。',
        details: [
          'CRTS型板式轨道',
          '精密施工工艺',
          '长寿命设计'
        ]
      },
      {
        icon: '🔌',
        name: '接触网系统',
        description: '为列车提供持续稳定的供电。',
        details: [
          '刚性悬挂系统',
          '复合导线技术',
          '防冰冻设计'
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
  display: flex;
  height: calc(100vh - 180px);
  gap: 2rem;
  margin-top: 2rem;
}

.sidebar {
  width: 280px;
  background: var(--card-bg);
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
}

.category-item {
  margin-bottom: 0.5rem;
}

.category-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s;
}

.category-header:hover {
  background: var(--primary-color);
  color: white;
}

.category-icon {
  font-size: 1.2rem;
}

.arrow-icon {
  margin-left: auto;
  font-size: 0.8rem;
}

.subcategories {
  margin-left: 1rem;
  padding: 0.5rem 0;
}

.subcategory-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.3s;
}

.subcategory-item:hover {
  background: rgba(var(--primary-rgb), 0.1);
}

.content-area {
  flex: 1;
  background: var(--card-bg);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
}

.detail-panel {
  animation: fadeIn 0.3s ease-out;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.detail-header h2 {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: var(--primary-color);
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.3s;
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.1);
}

.detail-description {
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.detail-list {
  display: grid;
  gap: 1rem;
}

.detail-item {
  padding: 1rem;
  background: rgba(var(--primary-rgb), 0.1);
  border-radius: 8px;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--text-color);
  opacity: 0.6;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s;
  max-height: 1000px;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}

/* 深色模式 */
:deep(.dark-mode) .sidebar,
:deep(.dark-mode) .content-area {
  background: #1f1f1f;
}

:deep(.dark-mode) .subcategory-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

:deep(.dark-mode) .detail-item {
  background: rgba(255, 255, 255, 0.1);
}

:deep(.dark-mode) .close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}
</style> 
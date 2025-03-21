import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/home/HomeView.vue')
    },
    {
      path: '/history',
      name: 'history',
      component: () => import('../views/history/HistoryView.vue')
    },
    {
      path: '/knowledge',
      name: 'knowledge',
      component: () => import('../views/knowledge/KnowledgeView.vue')
    },
    {
      path: '/chat',
      name: 'chat',
      component: () => import('../views/chat/ChatView.vue')
    }
  ]
})

export default router 
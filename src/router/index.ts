import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomePage.vue'),
    meta: { title: '首页' }
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('../views/ProfilePage.vue'),
    meta: { title: '信息录入' }
  },
  {
    path: '/questionnaire',
    name: 'questionnaire',
    component: () => import('../views/QuestionnaireFlow.vue'),
    meta: { title: '问卷测评' }
  },
  {
    path: '/games',
    name: 'games',
    component: () => import('../views/GameFlow.vue'),
    meta: { title: '互动测评' }
  },
  {
    path: '/report',
    name: 'report',
    component: () => import('../views/ReportPage.vue'),
    meta: { title: '评估报告' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫：更新页面标题
router.beforeEach((to, _from, next) => {
  document.title = `${to.meta.title} - 童智星探` || '童智星探'
  next()
})

export default router

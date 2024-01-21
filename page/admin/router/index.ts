import { createRouter, createWebHistory } from 'vue-router'

const routes: any = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/home',
    component: () => import('../views/home/index.vue'),
  },
]

const router = createRouter({
  history: createWebHistory('/admin'),
  routes: [...routes],
})

router.beforeEach((to, from, next) => {
  ;(document as any).title = to.meta.title || import.meta.env.VITE_SYS_NAME
  next()
})
export default router

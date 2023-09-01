import { createRouter, createWebHistory, createWebHashHistory } from "vue-router";


const routes: any = [
  { 
    path: '/',
    redirect: '/home'
  },
  { 
    path: '/home',
    component: () => import("../views/index.vue") 
  },
]

const router = createRouter({
  history: createWebHistory('${pagaPath}'),
  routes: [...routes],
});

router.beforeEach((to, from, next) => {
  (document as any).title = to.meta.title || "德工建设";
  next();
});
export default router;
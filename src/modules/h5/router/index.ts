import { createRouter, createWebHistory, createWebHashHistory } from "vue-router";


const routes: any = [
  { 
    path: '/',
    redirect: '/home'
  },
  { 
    path: '/home',
    component: () => import("@h5/views/home/index.vue") 
  },
  { 
    path: '/survey/:id',
    name: 'survey',
    meta: { title: '问卷调查' },
    component: () => import("@h5/views/survey/index.vue") 
  },
]

const router = createRouter({
  history: createWebHistory('/h5'),
  routes: [...routes],
});

router.beforeEach((to, from, next) => {
  (document as any).title = to.meta.title || "德工建设";
  next();
});
export default router;
  
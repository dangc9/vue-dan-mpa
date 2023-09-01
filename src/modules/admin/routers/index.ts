import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Layout from "@admin/layout/index.vue";
import { useUserStore } from "@admin/store/modules/user";
// 扩展继承属性
interface extendRoute {
  hidden?: boolean
}

import systemRouter from './modules/system'

// 异步组件
export const asyncRoutes = [
  ...systemRouter,
]

/**
 * path ==> 路由路径
 * name ==> 路由名称
 * component ==> 路由组件
 * redirect ==> 路由重定向
 * alwaysShow ==> 如果设置为true，将始终显示根菜单，无论其子路由长度如何
 * hidden ==> 如果“hidden:true”不会显示在侧边栏中（默认值为false）
 * keepAlive ==> 设为true 缓存
 * meta ==> 路由元信息
 * meta.title ==> 路由标题
 * meta.icon ==> 菜单icon
 * meta.affix ==> 如果设置为true将会出现在 标签栏中
 * meta.breadcrumb ==> 如果设置为false，该项将隐藏在breadcrumb中（默认值为true）
 */

export const constantRoutes: Array<RouteRecordRaw & extendRoute> = [
  {
    path: "/404",
    name: "404",
    component: () => import("@admin/views/system/error/404.vue"),
    hidden: true,
  },
  {
    path: "/403",
    name: "403",
    component: () => import("@admin/views/system/error/403.vue"),
    hidden: true,
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@admin/views/login/index.vue'),
    hidden: true,
    meta: { title: '登录', }
  },
  {
    path: '/',
    name: 'layout',
    component: Layout,
    redirect: '/home',
    meta: { title: '首页', icon: 'House', },
    children: [
      {
        path: '/home',
        component: () => import('@admin/views/home/index.vue'),
        name: 'home',
        meta: { title: '首页', icon: 'House', affix: true, role: ['other'] }
      },
    ]
  },
  {
    path: '/',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/profile',
        component: () => import('@admin/views/system/profile/index.vue'),
        name: 'profile',
        meta: { title: '个人中心' }
      },
    ]
  },
  {
    path: '/common',
    component: Layout,
    hidden: true,
    children: [
      {
        path: "/common/404",
        name: "layout_404",
        component: () => import("@admin/views/system/error/404.vue"),
        meta: { title: '404' }
      },
      {
        path: "/common/403",
        name: "layout_403",
        component: () => import("@admin/views/system/error/403.vue"),
        meta: { title: '403' }
      },
    ]
  },
  {
    path: '/flowable',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/flowable/editor/edit',
        component: () => import('@admin/views/tool/flowable/editor/edit/index.vue'),
        name: 'flowable_editor',
        meta: { title: '在线编辑', activeMenu: '/flowable/editor/edit' },
      },
    ]
  },
]

export const notFoundRouter = [
  {
    path: '/:pathMatch(.*)',
    name: "notFound",
    redirect: () => {
      const userStore = useUserStore()
      return { path: userStore.token ? '/common/404' : '/404' }
    },
  }
]


const router = createRouter({
  history: createWebHistory('/admin'),
  routes: constantRoutes
})

export default router

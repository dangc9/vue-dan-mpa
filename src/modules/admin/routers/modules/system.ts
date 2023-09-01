import Layout from '@admin/layout/index.vue'

const systemRouter = [
  {
    path: '/system',
    component: Layout,
    meta: { title: '系统管理',  icon: 'Setting', },
    children: [
      {
        path: '/system/dict/data/:dictId(\\d+)',
        component: () => import('@admin/views/system/dict/dictData/index.vue'),
        name: 'dictData',
        hidden: true,
        permissions: ['system:dict:list'],
        meta: { title: '字典数据', activeMenu: '/system/dict' },
      },
    ]
  },
  {
    path: '/monitor',
    component: Layout,
    meta: { title: '系统监控',  icon: 'Setting', },
    children: [
      {
        path: '/monitor/job/log/:jobId(\\d+)',
        component: () => import('@admin/views/monitor/job/log/index.vue'),
        permissions: ['monitor:job:list'],
        name: 'JobLog',
        meta: { title: '调度日志', activeMenu: '/monitor/job' }
      },
    ]
  },
]

export default systemRouter

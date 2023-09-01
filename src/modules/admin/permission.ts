import router from '@admin/routers/index'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { useUserStore } from "@admin/store/modules/user"
import { usePermissionStore } from "@admin/store/modules/permission"
import await_to from 'await-to-js'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/auth-redirect'] // 设置白名单

router.beforeEach(async (to, from, next) => {
  // 开启进度条
  NProgress.start()
  // 设置标题
  if (typeof (to.meta.title) === 'string') {
    document.title = to.meta.title || import.meta.env.VITE_SYS_NAME
  }

  const UserStore = useUserStore();
  // 确定用户是否已登录过，存在Token
  const hasToken = UserStore.token
  if (hasToken) {
    if (to.path === '/login') {
      // 如果已登录，请重定向到主页
      next({ path: '/' })
    } else {
      try {
        if (UserStore.roles.length !== 0) {
          next()
          return
        }
        const [err] = await await_to(UserStore.getInfo())
        if(err) {
          UserStore.logout().then(() => {  next({ path: '/' }) })
          return
        }
        const PermissionStore = usePermissionStore()
        if (!PermissionStore.routes.length) {
          const accessRoutes = await PermissionStore.generateRoutes(UserStore.roles)
          accessRoutes.forEach(item => {  
            // 动态添加访问路由表
            router.addRoute(item)
          })
          next({ ...to, replace: true })
        } else {
          next() 
        }
      } catch (error) {
         console.error(error)
        next(`/login?redirect=${to.path}`)
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
    }
  }
})

router.afterEach(() => {
  NProgress.done();
});



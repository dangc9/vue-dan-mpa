import { defineStore } from 'pinia'
import Layout from '@admin/layout/index.vue'
import { asyncRoutes, constantRoutes, notFoundRouter } from '@admin/routers/index'
import auth from '@admin/utils/common/auth'
import to from 'await-to-js'
import request from '@admin/api/login'
import { join } from 'path-browserify'
const viewModules = import.meta.glob('@admin/views/**/*.vue')

export const usePermissionStore = defineStore({
  // id: 必须的，在所有 Store 中唯一
  id: 'permissionState',
  // state: 返回对象的函数
  state: () => ({
    // 菜单路由
    routes: [],
    // 动态路由
    addRoutes: [],
    // 缓存路由
    cacheRoutes: {},
  }),
  getters: {
    permission_routes: state => {
      return state.routes
    },
  },
  // 可以同步 也可以异步
  actions: {
    // 生成路由
    generateRoutes(roles): Promise<any> {
      
      return new Promise(async (resolve) => {
        const [err, { data }] = await to(request.getRouters())
        if(err) return
        const fnc = function(arr, parentName?) {
          arr.forEach(item => {
            item.path = join(parentName || '', item.path || '')
            item.name = item.path?.slice(1)?.replaceAll('/','_')
            if(item.children?.length > 0 ) {
              fnc(item.children, item.path)
            }
          })
        }
        fnc(data)

        const siderdata = JSON.parse(JSON.stringify(data))
        const routerdata = JSON.parse(JSON.stringify(data))
        // 生成菜单路由
        const sidebarRoutes = filterAsyncRouter(siderdata, roles)
        // 重新为路由命名，对应组件名
        this.routes = [...constantRoutes, ...sidebarRoutes] 
        // 生成权限路由(异步路由和动态路由)
        let accessedRoutes = [ ...filterAsyncRouter(routerdata, false, true), ...filterDynamicRoutes(asyncRoutes), ...notFoundRouter ].filter(item => !item.meta?.link)
        resolve(accessedRoutes)
      })
    },
    // 清除路由
    clearRoutes() {
      this.routes = []
      this.addRoutes = []
      this.cacheRoutes = []
    },
  },

})

// / 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap, lastRouter = false, type = false) {
  return asyncRouterMap.filter(route => {
    if (type && route.children) {
      route.children = filterChildren(route.children)
    }
    if (route.component) {
      if (route.component === 'Layout') {
        route.component = Layout
      } else {
        route.component = dynamicImport(route.component)
      }
    }
    if (route.children != null && route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children, route, type)
    } else {
      delete route['children']
      delete route['redirect']
    }
    return true
  })
}

function filterChildren(childrenMap, lastRouter: any = false) {
  var children = []
  childrenMap.forEach((el, index) => {
    if (el.children && el.children.length) {
      if (el.component === 'ParentView') {
        el.children.forEach(c => {
          c.path = el.path + '/' + c.path
          if (c.children && c.children.length) {
            children = children.concat(filterChildren(c.children, c))
            return
          }
          children.push(c)
        })
        return
      }
    }
    if (lastRouter) {
      el.path = lastRouter.path + '/' + el.path
    }
    children = children.concat(el)
  })
  return children
}

function dynamicImport( component: string ) {
  const matchKey = `/src/modules/admin/views/${component}.vue`
  return viewModules[matchKey]
}


// 动态路由遍历，验证是否具备权限
export function filterDynamicRoutes(routes: any[]) {
  // 递归校验routes权限
  function checkRoute(list: any[]) {
    const res = []
    list.forEach(route => {
      if(route.children?.length) {
        route.children = checkRoute(route.children)
      }
      if(route.permissions = "admin" || route.children?.length ||  auth.hasPermiOr(route.permissions) ||  auth.hasRoleOr(route.roles) ) {
        res.push(route)
      }
    })
    return res
  }
  return checkRoute(routes)
}



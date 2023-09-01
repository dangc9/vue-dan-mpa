import { defineStore } from 'pinia'
import type { loginForm } from '@admin/types/login'
import request from '@admin/api/login'
import { getToken, setToken, removeToken } from '@admin/utils/auth'

interface UserInfo {
  userId: string | number,
  nickName: string,
  userName: string,
  deptId: string | number,
  avatar: string,
  sex: string,
  email: string,
  phonenumber: string,
  admin: boolean,
}

export const useUserStore = defineStore({
  id: 'userState',
  state: () => ({
    token: getToken(),
    userInfo: {} as UserInfo | null,
    roles: [],
    permissions: [],
  }),
  getters: {
    avatar: (state): string => `${import.meta.env.VITE_BASE_API}${state.userInfo.avatar}`
  },
  actions: {
    // 登录
    login(userInfo: loginForm) {
      return new Promise(async (resolve, reject) => {
        request.login(userInfo).then(res => {
          setToken(res.token)
          this.token = res.token
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取用户信息
    getInfo() {
      const _this = this
      return new Promise((resolve, reject) => {
        request.getInfo().then(res => {
          _this.userInfo = res.user
          _this.roles = res.roles
          _this.permissions = res.permissions
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 退出
    logout() {
      const _this = this
      return new Promise((resolve, reject) => {
        request.logout().then(res => {
          _this.token = null
          _this.roles = []
          _this.permissions = []
          _this.userInfo = {}
          removeToken()
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },
  },
  // 进行持久化存储
  // persist: {
  //   // 本地存储的名称
  //   key: "userState",
  //   //保存的位置
  //   storage: window.localStorage,//localstorage
  // },
})

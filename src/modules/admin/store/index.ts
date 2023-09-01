import { fa } from 'element-plus/es/locale';
import { defineStore, createPinia } from 'pinia'
// 引入持久化插件
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

export const Store = defineStore({
  id: 'globalState',
  state: () => ({
    isLoading: false,
  }),
  getters: {},
  actions: {},
  persist: {
    key: "globalState",
    storage: window.sessionStorage,
  },
})


const pinia = createPinia();
//pinia使用
pinia.use(piniaPluginPersistedstate);
export default pinia

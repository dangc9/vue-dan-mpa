import "@admin/styles/tailwind/index.scss" 
import { createApp } from "vue";
import App from "@h5/App.vue";
import router from './router'
// UI框架 element-plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 引入暗黑模式 element-plus 2.2 内置暗黑模式
import 'element-plus/theme-chalk/dark/css-vars.css'
// 自定义暗黑模式
import "@admin/styles/element-dark.scss";

import "@admin/styles/public/index.scss";
console.log(import.meta.env);
const app = createApp(App)

app.use(router)
app.use(ElementPlus)
app.mount('#app')
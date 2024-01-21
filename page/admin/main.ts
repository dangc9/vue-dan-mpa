import 'normalize.css'
import '@/styles/common/index.scss'
import '@/styles/tailwind/index.scss'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router)
app.mount('#app')

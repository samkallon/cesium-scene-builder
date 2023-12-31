import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import { createPinia } from 'pinia'
import eventBus from 'vue3-eventbus'

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.use(eventBus)
app.use(createPinia())
app.use(ElementPlus)
app.mount('#app')

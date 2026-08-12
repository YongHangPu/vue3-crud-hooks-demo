import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// element-plus 暗色模式 CSS 变量(html.dark 时生效)
import 'element-plus/theme-chalk/dark/css-vars.css'
// vue3-crud-hooks 组件样式(CustomTable 分页间距、操作列按钮间距等)
import 'vue3-crud-hooks/style.css'
import './style.css'
import App from './App.vue'
import { router } from './router'

createApp(App).use(ElementPlus).use(router).mount('#app')

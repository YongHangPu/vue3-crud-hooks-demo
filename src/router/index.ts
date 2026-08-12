import { createRouter, createWebHashHistory } from 'vue-router'

/**
 * 路由表:每个 demo 页面独立 chunk,使用动态 import 懒加载
 * —— 首次进入对应路由才加载该页面代码,避免一次性打包所有演示组件
 */
const routes = [
  { path: '/', redirect: '/dashboard' },
  { path: '/dashboard', name: 'dashboard', component: () => import('../demo/DashboardDemo.vue'), meta: { title: '概览' } },
  { path: '/crud', name: 'crud', component: () => import('../demo/CrudPageDemo.vue'), meta: { title: '完整 CRUD 页面' } },
  { path: '/table', name: 'table', component: () => import('../demo/TablePageDemo.vue'), meta: { title: 'useTablePage' } },
  { path: '/table-advanced', name: 'table-advanced', component: () => import('../demo/TableAdvancedDemo.vue'), meta: { title: '高级表格列' } },
  { path: '/form', name: 'form', component: () => import('../demo/FormDialogDemo.vue'), meta: { title: 'useFormDialog' } },
  { path: '/data-flow', name: 'data-flow', component: () => import('../demo/DataFlowDemo.vue'), meta: { title: '数据流转' } },
  { path: '/transform', name: 'transform', component: () => import('../demo/TransformDemo.vue'), meta: { title: '数据转换 / 消息' } },
  { path: '/height', name: 'height', component: () => import('../demo/TableHeightDemo.vue'), meta: { title: 'useTableHeight' } },
  { path: '/custom', name: 'custom', component: () => import('../demo/CustomTableDemo.vue'), meta: { title: 'CustomTable 独立' } },
  { path: '/pagination', name: 'pagination', component: () => import('../demo/PaginationDemo.vue'), meta: { title: 'Pagination 独立' } },
  { path: '/multi-table', name: 'multi-table', component: () => import('../demo/MultiTableDemo.vue'), meta: { title: '多表格' } },
  { path: '/subpath', name: 'subpath', component: () => import('../demo/SubpathDemo.vue'), meta: { title: '子路径导入' } },
]

export const router = createRouter({
  // hash 模式:部署到任意静态托管(如 GitHub Pages)无需服务端回退配置
  history: createWebHashHistory(),
  routes,
})
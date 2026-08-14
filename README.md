# vue3-crud-hooks-demo

基于 [vue3-crud-hooks](https://github.com/YongHangPu/vue3-crud-hooks) 的完整后台管理演示项目,覆盖 CRUD 全流程、服务端排序/筛选、多表格、表格自适应高度、暗色模式等库的全部能力。

> 🎮 在线预览:<https://YongHangPu.github.io/vue3-crud-hooks-demo/>

## ✨ 功能演示

后台管理布局(侧边栏 12 个菜单 + 顶栏面包屑 + 暗色模式切换),每个菜单对应一个库能力演示:

| 菜单 | 演示内容 |
|------|---------|
| 概览 | 项目信息与功能入口 |
| 完整 CRUD 页面 | `useCrudPage` 一站式:搜索 / 分页 / 新增 / 编辑回显 / 删除 / 批量删除 / 导出 / 业务码校验 |
| useTablePage | 独立列表管理:分页 / 搜索 / 删除 / 导出 + **服务端排序与列筛选**(`sortable` / `filterable`) |
| 高级表格列 | expand 展开、自定义插槽、按钮 `visible`/`disabled`、跨页多选 |
| useFormDialog | 独立弹窗表单:新增 / 编辑回显(`getApi`) / 校验(`formRules`) / 提交 |
| 数据流转 | 生命周期回调 + 自定义响应适配(`isSuccess` / `transformResponse`),回调日志实时记录 |
| 数据转换 / 消息 | `useDataTransform` 六种转换 + `useMessage` 消息解耦 |
| useTableHeight | 表格自适应高度:窗口缩放 / 搜索栏联动(`watchSources`) / 分页器换行自动重算 |
| CustomTable 独立 | 手动数据绑定 + el-table 原生属性/事件透传 |
| Pagination 独立 | `v-model` 双向绑定 + 页码重置行为 |
| 多表格 | 同页面多表格并存,各自独立分页 / 搜索 / 高度,互不影响 |
| 子路径导入 | `vue3-crud-hooks/xxx` 按需导入(tree-shaking)验证 |

## 🛠 技术栈

- [Vue 3.5](https://vuejs.org/) + [TypeScript](https://www.typescriptlang.org/)
- [Element Plus 2.14](https://element-plus.org/)(含暗色模式 CSS 变量)
- [Vite 8](https://vitejs.dev/) + [vue-router](https://router.vuejs.org/)(**路由懒加载**,每个演示页独立 chunk)
- [vue3-crud-hooks](https://github.com/YongHangPu/vue3-crud-hooks)(npm:`vue3-crud-hooks@^1.2.0`)

## 🚀 本地开发

```bash
# 安装依赖(vue3-crud-hooks 从 npm registry 拉取)
pnpm install

# 启动开发服务器(http://localhost:5173)
pnpm dev

# 生产构建
pnpm build

# 本地预览构建产物
pnpm preview
```

## 📦 依赖库

本演示依赖 [**vue3-crud-hooks**](https://github.com/YongHangPu/vue3-crud-hooks)(npm:`vue3-crud-hooks@^1.2.0`)——基于 Vue 3 + Element Plus 的 CRUD 业务逻辑复用库,通过组合式 API 快速搭建表格、搜索、表单弹窗等标准功能。

## 📁 目录结构

```
src/
├── App.vue              # 后台布局:侧边栏菜单 + 顶栏 + 暗色模式切换
├── main.ts              # 入口(注册 Element Plus 与 vue-router)
├── router/              # 路由配置(全部懒加载)
├── api/                 # mock 接口层(内存数据,模拟多种后端响应形态)
└── demo/                # 各功能演示页面
    ├── DashboardDemo.vue     # 概览
    ├── CrudPageDemo.vue      # 完整 CRUD 页面
    ├── TablePageDemo.vue     # useTablePage
    ├── TableAdvancedDemo.vue # 高级表格列
    ├── FormDialogDemo.vue    # useFormDialog
    ├── DataFlowDemo.vue      # 数据流转
    ├── TransformDemo.vue     # 数据转换 / 消息
    ├── TableHeightDemo.vue   # useTableHeight
    ├── CustomTableDemo.vue   # CustomTable 独立
    ├── PaginationDemo.vue    # Pagination 独立
    ├── MultiTableDemo.vue    # 多表格
    └── SubpathDemo.vue       # 子路径导入
```

## 📄 License

MIT
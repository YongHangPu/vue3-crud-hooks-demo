<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import {
  HomeFilled,
  List,
  Grid,
  Document,
  MagicStick,
  Monitor,
  DataBoard,
  Operation,
  Link,
  ArrowDown,
  Fold,
  Expand,
  Sunny,
  Moon,
  SwitchButton,
  Box,
} from '@element-plus/icons-vue'

const route = useRoute()

// 菜单配置:path 与路由表一一对应(组件由路由懒加载,不再在此静态导入)
const menuItems = [
  { path: '/dashboard', title: '概览', icon: HomeFilled },
  { path: '/crud', title: '完整 CRUD 页面', icon: List },
  { path: '/table', title: 'useTablePage', icon: Grid },
  { path: '/table-advanced', title: '高级表格列', icon: DataBoard },
  { path: '/form', title: 'useFormDialog', icon: Document },
  { path: '/data-flow', title: '数据流转', icon: MagicStick },
  { path: '/transform', title: '数据转换 / 消息', icon: SwitchButton },
  { path: '/height', title: 'useTableHeight', icon: Monitor },
  { path: '/custom', title: 'CustomTable 独立', icon: DataBoard },
  { path: '/pagination', title: 'Pagination 独立', icon: Operation },
  { path: '/multi-table', title: '多表格', icon: DataBoard },
  { path: '/subpath', title: '子路径导入', icon: Link },
]

// 菜单高亮与面包屑均跟随当前路由
const activePath = computed(() => route.path)
const currentTitle = computed(() => (route.meta.title as string) || '后台管理')

// 侧边栏折叠
const collapsed = ref(false)
const asideWidth = computed(() => (collapsed.value ? '64px' : '220px'))

// 项目地址(顶栏右上角跳转)
const DEMO_URL = 'https://github.com/YongHangPu/vue3-crud-hooks-demo'
const LIB_URL = 'https://github.com/YongHangPu/vue3-crud-hooks'

// 暗色模式切换
const dark = ref(false)
const toggleDark = () => {
  dark.value = !dark.value
  document.documentElement.classList.toggle('dark', dark.value)
}
</script>

<template>
  <el-container class="layout">
    <!-- 侧边栏 -->
    <el-aside :width="asideWidth" class="aside">
      <div class="logo">
        <template v-if="!collapsed">
          <div class="logo-title">vue3-crud-hooks</div>
          <div class="logo-sub">后台管理演示</div>
        </template>
        <div v-else class="logo-mini">VCH</div>
      </div>
      <el-menu
        class="menu"
        :default-active="activePath"
        :collapse="collapsed"
        :collapse-transition="false"
        background-color="#001529"
        text-color="rgba(255,255,255,0.68)"
        active-text-color="#ffffff"
        router
      >
        <el-menu-item v-for="m in menuItems" :key="m.path" :index="m.path">
          <el-icon><component :is="m.icon" /></el-icon>
          <span>{{ m.title }}</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <!-- 顶栏 -->
      <el-header class="header">
        <div class="header-left">
          <el-icon class="collapse-btn" @click="collapsed = !collapsed">
            <Expand v-if="collapsed" />
            <Fold v-else />
          </el-icon>
          <div class="breadcrumb">
            <span class="crumb-muted">后台管理</span>
            <span class="crumb-sep">/</span>
            <span>{{ currentTitle }}</span>
          </div>
        </div>
        <div class="header-right">
          <a :href="DEMO_URL" target="_blank" rel="noopener" class="repo-chip">
            <el-icon :size="13"><Link /></el-icon>
            <span>示例项目</span>
          </a>
          <a :href="LIB_URL" target="_blank" rel="noopener" class="repo-chip">
            <el-icon :size="13"><Box /></el-icon>
            <span>vue3-crud-hooks</span>
          </a>
          <el-icon class="dark-btn" @click="toggleDark">
            <Moon v-if="!dark" />
            <Sunny v-else />
          </el-icon>
          <div class="user">
            <el-avatar :size="30" class="avatar">A</el-avatar>
            <span class="user-name">admin</span>
            <el-icon><ArrowDown /></el-icon>
          </div>
        </div>
      </el-header>

      <!-- 内容区:由路由渲染(懒加载) -->
      <el-main class="main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<style>
html,
body,
#app {
  height: 100%;
  margin: 0;
  /* 背景随 Element Plus 变量切换:浅色 #fff / 暗色 html.dark 时自动变暗 */
  background: var(--el-bg-color);
}
</style>

<style scoped>
.layout {
  height: 100vh;
}
.aside {
  background: #001529;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  transition: width 0.2s;
}
.logo {
  padding: 16px 20px;
  color: #fff;
  flex-shrink: 0;
  white-space: nowrap;
  overflow: hidden;
}
.logo-title {
  font-size: 17px;
  font-weight: 600;
}
.logo-sub {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.45);
  margin-top: 2px;
}
.logo-mini {
  font-size: 16px;
  font-weight: 700;
  text-align: center;
  letter-spacing: 1px;
}
.menu {
  border-right: none;
  flex: 1;
}
.menu :deep(.el-menu-item.is-active) {
  background: #1677ff;
}
.header {
  background: var(--el-bg-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  z-index: 1;
}
.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}
.collapse-btn {
  font-size: 18px;
  cursor: pointer;
  color: #606266;
}
.breadcrumb {
  font-size: 14px;
}
.crumb-muted {
  color: #909399;
}
.crumb-sep {
  margin: 0 8px;
  color: #c0c4cc;
}
.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}
/* 项目地址胶囊链接 */
.repo-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 12px;
  color: var(--el-text-color-regular);
  background: var(--el-fill-color-light);
  border: 1px solid var(--el-border-color-lighter);
  text-decoration: none;
  transition: all 0.2s;
  white-space: nowrap;
}
.repo-chip:hover {
  color: var(--el-color-primary);
  border-color: var(--el-color-primary);
  background: var(--el-color-primary-light-9);
}
.dark-btn {
  font-size: 18px;
  cursor: pointer;
  color: #606266;
}
.user {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}
.avatar {
  background: #1677ff;
  font-size: 13px;
}
.user-name {
  font-size: 14px;
}
.main {
  padding: 16px;
  overflow-y: auto;
}
</style>
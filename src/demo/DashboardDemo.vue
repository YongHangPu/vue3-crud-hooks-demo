<script setup lang="ts">
// 概览页:点击功能卡片通过路由跳转(路由懒加载,进入时才加载对应页面)
import { useRouter } from 'vue-router'
import { Link } from '@element-plus/icons-vue'
const router = useRouter()

// 项目地址
const REPO_URL = 'https://github.com/YongHangPu/vue3-crud-hooks-demo'
const LIB_URL = 'https://github.com/YongHangPu/vue3-crud-hooks'

const stats = [
  { label: 'npm 包版本', value: '1.2.0' },
  { label: 'Composable Hooks', value: '6' },
  { label: '组件', value: '2' },
  { label: '冒烟测试', value: '11' },
]

const features = [
  { key: 'crud', title: '完整 CRUD 页面', desc: 'useCrudPage 一站式:搜索 / 分页 / 新增 / 编辑 / 删除 / 批量删除 / 导出 / 业务码校验', tag: '推荐' },
  { key: 'table', title: 'useTablePage', desc: '独立列表管理:分页 / 搜索 / 删除 / 导出,含请求竞态防护演示' },
  { key: 'form', title: 'useFormDialog', desc: '独立弹窗表单:新增 / 编辑回显(getApi) / 校验 / 提交' },
  { key: 'transform', title: '数据转换 / 消息', desc: 'useDataTransform 六种转换 + useMessage 四种消息提示' },
  { key: 'height', title: 'useTableHeight', desc: '表格自适应高度:窗口缩放 / 搜索栏联动 / 分页器换行自动适配' },
  { key: 'custom', title: 'CustomTable 独立', desc: '手动数据绑定 + transformResponse 自定义响应解析' },
  { key: 'pagination', title: 'Pagination 独立', desc: 'defineModel v-model 双向绑定 + 页码重置行为' },
  { key: 'subpath', title: '子路径导入', desc: 'vue3-crud-hooks/xxx 按需导入验证(tree-shaking)' },
  { key: 'dashboard', title: '概览', desc: '本页:项目信息与技术栈' },
]

const tech = ['Vue 3.5', 'Element Plus 2.14', 'Vite 8', 'TypeScript', 'Vitest', 'npm registry 包']
</script>

<template>
  <div>
    <!-- 统计卡片 -->
    <el-row :gutter="16" class="stat-row">
      <el-col v-for="s in stats" :key="s.label" :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-value">{{ s.value }}</div>
          <div class="stat-label">{{ s.label }}</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 功能入口 -->
    <el-card shadow="never">
      <template #header>
        <span>功能演示入口</span>
        <span class="tip">点击卡片进入对应模块</span>
      </template>
      <el-row :gutter="16">
        <el-col v-for="f in features" :key="f.key" :xs="24" :sm="12" :md="8" :lg="6" class="feat-col">
          <div class="feat-card" @click="router.push('/' + f.key)">
            <div class="feat-title">
              {{ f.title }}
              <el-tag v-if="f.tag" size="small" type="danger">{{ f.tag }}</el-tag>
            </div>
            <div class="feat-desc">{{ f.desc }}</div>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <!-- 技术栈 -->
    <el-card shadow="never" class="tech-card">
      <template #header>技术栈与包来源</template>
      <el-tag v-for="t in tech" :key="t" class="tech-tag" effect="plain">{{ t }}</el-tag>
      <p class="tip">
        本演示项目通过 <code>npm registry</code> 安装 <code>vue3-crud-hooks@1.2.0</code>(非本地 link),
        用于验证真实发布产物在后台管理系统中的完整可用性。
      </p>
    </el-card>

    <!-- 项目地址 -->
    <el-card shadow="never" class="links-card">
      <template #header>项目地址</template>
      <div class="link-row">
        <el-link type="primary" :href="REPO_URL" target="_blank" :icon="Link">示例项目仓库</el-link>
        <el-link type="primary" :href="LIB_URL" target="_blank" :icon="Link">vue3-crud-hooks 库</el-link>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.stat-row {
  margin-bottom: 16px;
}
.stat-card {
  text-align: center;
}
.stat-value {
  font-size: 26px;
  font-weight: 600;
  color: #1677ff;
}
.stat-label {
  color: #909399;
  font-size: 13px;
  margin-top: 4px;
}
.tip {
  color: #909399;
  font-size: 12px;
  margin-left: 8px;
}
.feat-col {
  margin-bottom: 16px;
}
.feat-card {
  border: 1px solid #ebeef5;
  border-radius: 6px;
  padding: 14px;
  cursor: pointer;
  transition: all 0.2s;
  height: 100%;
  box-sizing: border-box;
}
.feat-card:hover {
  border-color: #1677ff;
  box-shadow: 0 4px 12px rgba(22, 119, 255, 0.15);
  transform: translateY(-2px);
}
.feat-title {
  font-weight: 600;
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.feat-desc {
  color: #606266;
  font-size: 12px;
  line-height: 1.6;
}
.tech-card {
  margin-top: 16px;
}
.links-card {
  margin-top: 16px;
}
.link-row {
  display: flex;
  gap: 24px;
}
.tech-tag {
  margin-right: 8px;
  margin-bottom: 8px;
}
</style>

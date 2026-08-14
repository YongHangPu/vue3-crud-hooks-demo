<script setup lang="ts">
import { useTablePage as subTablePage } from 'vue3-crud-hooks/useTablePage'
import { useCrudPage as subCrudPage } from 'vue3-crud-hooks/useCrudPage'
import { useFormDialog as subFormDialog } from 'vue3-crud-hooks/useFormDialog'
import { useDataTransform as subTransform } from 'vue3-crud-hooks/useDataTransform'
import { useMessage as subMessage } from 'vue3-crud-hooks/useMessage'
import { useTableHeight as subTableHeight } from 'vue3-crud-hooks/useTableHeight'
import CustomTableSub from 'vue3-crud-hooks/CustomTable'
import PaginationSub from 'vue3-crud-hooks/Pagination'
import { fetchUserListPlain } from '../api/mockUser'

// 子路径导入的实际使用:用 useTablePage 子路径跑一个最小表格
const { tableBindings } = subTablePage(fetchUserListPlain, {}, {
  customTableConfig: {
    columns: [
      { prop: 'name', label: '名称', minWidth: 100 },
      { prop: 'role', label: '角色', width: 100 },
    ],
  },
})

const subpaths = [
  'vue3-crud-hooks/useTablePage',
  'vue3-crud-hooks/useCrudPage',
  'vue3-crud-hooks/useFormDialog',
  'vue3-crud-hooks/useDataTransform',
  'vue3-crud-hooks/useMessage',
  'vue3-crud-hooks/useTableHeight',
  'vue3-crud-hooks/CustomTable(default)',
  'vue3-crud-hooks/Pagination(default)',
]

const checks = [
  typeof subTablePage,
  typeof subCrudPage,
  typeof subFormDialog,
  typeof subTransform,
  typeof subMessage,
  typeof subTableHeight,
  typeof CustomTableSub,
  typeof PaginationSub,
]
</script>

<template>
  <div>
    <el-alert class="demo-tip" :closable="false" show-icon type="success" title="子路径导入验证" description="vue3-crud-hooks/xxx 按需导入(tree-shaking),验证子路径产物可用性" />
    <el-card shadow="never">
      <template #header>子路径导入验证(tree-shaking 子路径产物)</template>
      <el-table :data="subpaths.map((p, i) => ({ path: p, ok: checks[i] === 'function' || checks[i] === 'object' }))" border>
        <el-table-column prop="path" label="子路径" min-width="260" />
        <el-table-column label="导入结果" width="120">
          <template #default="{ row }">
            <el-tag :type="row.ok ? 'success' : 'danger'">{{ row.ok ? '成功' : '失败' }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <p class="hint">以下表格由子路径导入的 useTablePage 驱动:</p>
      <CustomTableSub v-bind="(tableBindings as any)" />
    </el-card>
  </div>
</template>

<style scoped>
.hint {
  color: #909399;
  font-size: 12px;
  margin: 12px 0 4px;
}
</style>

<style scoped>
.demo-tip {
  margin-bottom: 12px;
}
</style>


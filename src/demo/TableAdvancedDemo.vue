<script setup lang="ts">
import { useTablePage, CustomTable, useMessage } from 'vue3-crud-hooks'
import { fetchUserListPlain, batchDeleteUsers } from '../api/mockUser'

const message = useMessage()

// 高级表格列演示:
// - expand 展开行 / 自定义表头 / 自定义单元格插槽 / append 底部插槽
// - 操作列按钮动态显隐(visible)与禁用(disabled)
// - selection 跨页多选(reserveSelection + row-key)
const { tableBindings, selectedIds, handleBatchDelete, deleteLoading } = useTablePage(
  fetchUserListPlain,
  {},
  {
    customTableConfig: {
      // reserveSelection 跨页保留需要 row-key 标识行
      props: { 'row-key': 'id' },
      selection: { reserveSelection: true },
      index: true,
      columns: [
        { type: 'expand', label: '', width: 40, slotName: 'expand' },
        { prop: 'name', label: '名称', slotName: 'name', minWidth: 100 },
        { prop: 'email', label: '邮箱', minWidth: 180 },
        { prop: 'status', label: '状态', width: 90, slotName: 'status' },
        {
          type: 'action',
          label: '操作',
          width: 230,
          buttons: [
            {
              btnText: '启用',
              event: 'enable',
              btnType: 'link',
              type: 'success',
              visible: (row: any) => row.status === 0,
            },
            {
              btnText: '禁用',
              event: 'disable',
              btnType: 'link',
              type: 'warning',
              visible: (row: any) => row.status === 1,
            },
            {
              btnText: '编辑',
              event: 'edit',
              btnType: 'link',
              disabled: (row: any) => row.status === 0,
            },
            { btnText: '删除', event: 'delete', type: 'danger' },
          ],
        },
      ],
      // useTablePage 独立使用时自定义事件走此通道
      onCustomAction: (event: string, row: any) => {
        if (event === 'enable') message.success(`已启用:${row.name}(演示 visible 动态显隐)`)
        if (event === 'disable') message.warning(`已禁用:${row.name}(演示 visible 动态显隐)`)
        if (event === 'edit') message.warning(`编辑 ${row.name}(disabled 演示:禁用状态用户不可点)`)
      },
    },
  },
  { batchDeleteApi: batchDeleteUsers }
)


</script>

<template>
  <div class="demo-page">
    <el-alert
      class="demo-tip"
      :closable="false"
      show-icon
      type="success"
      title="高级表格列演示"
      description="expand 展开行 / 自定义表头(#name-header)与单元格插槽 / append 底部插槽 / 操作列按钮按行状态动态显隐(visible)与禁用(disabled) / selection 跨页多选(reserveSelection)"
    />
    <div class="toolbar">
      <el-tag type="info">跨页已选 {{ selectedIds.length }} 条(翻页后保留)</el-tag>
      <el-button type="danger" :loading="deleteLoading" @click="handleBatchDelete">批量删除选中</el-button>
      <span class="hint">提示:先在第 1 页勾选,再翻到第 2 页,选中保留</span>
    </div>
    <CustomTable v-bind="tableBindings">
      <template #expand="{ row }">
        <div class="expand-box">
          <el-descriptions :column="3" size="small" border>
            <el-descriptions-item label="邮箱">{{ row.email }}</el-descriptions-item>
            <el-descriptions-item label="角色">{{ row.role }}</el-descriptions-item>
            <el-descriptions-item label="创建时间">{{ row.createTime }}</el-descriptions-item>
            <el-descriptions-item label="标签">
              <el-tag v-for="t in row.tags" :key="t" size="small" class="tag">{{ t }}</el-tag>
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </template>
      <template #name="{ row }">
        <el-link type="primary" @click="message.success(`点击了 ${row.name}`)">{{ row.name }}</el-link>
      </template>
      <template #name-header="{ column }">
        <span>👤 {{ column.label }}</span>
      </template>
      <template #status="{ row }">
        <el-tag :type="row.status === 1 ? 'success' : 'danger'">
          {{ row.status === 1 ? '启用' : '禁用' }}
        </el-tag>
      </template>
      <template #append>
        <div class="append-tip">⬇ append 插槽:表格底部自定义区域(本行由插槽渲染)</div>
      </template>
    </CustomTable>
  </div>
</template>

<style scoped>
.demo-tip {
  margin-bottom: 12px;
}
.toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}
.hint {
  color: #909399;
  font-size: 12px;
}
.expand-box {
  padding: 8px 16px;
}
.tag {
  margin-right: 4px;
}
.append-tip {
  padding: 8px;
  color: #909399;
  font-size: 12px;
  background: #f5f7fa;
}
</style>

<style scoped>
.demo-page {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.demo-page :deep(.el-card) {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}
.demo-page :deep(.el-card__body) {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}
.demo-page :deep(.custom-table-container) {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}
.demo-page :deep(.custom-table-container .el-table) {
  flex: none;
}
</style>





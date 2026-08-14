<script setup lang="ts">
import { useTablePage, useFormDialog, CustomTable, useMessage } from 'vue3-crud-hooks'
import type { User } from '../api/mockUser'
import { fetchUserListPlain, batchDeleteUsers, deleteUser, updateUser, updateUserStatus } from '../api/mockUser'

const message = useMessage()

// 高级表格列演示:
// - expand 展开行 / 自定义表头 / 自定义单元格插槽 / append 底部插槽
// - 操作列按钮动态显隐(visible)与禁用(disabled)
// - selection 跨页多选(reserveSelection + row-key)
// - 操作列全交互:启用/禁用(改状态并刷新)、编辑(弹窗保存)、删除(确认后删除)
const { tableBindings, selectedIds, handleBatchDelete, deleteLoading, getTableData } = useTablePage(
  fetchUserListPlain,
  {},
  {
    customTableConfig: {
      // reserveSelection 跨页保留需要 row-key 标识行
      props: { 'row-key': 'id' },
      selection: { reserveSelection: true },
      index: { label: '序号', width: 60, align: 'center' },
      columns: [
        { type: 'expand', label: '', width: 40, slotName: 'expand' },
        { prop: 'name', label: '名称', slotName: 'name', minWidth: 100 },
        { prop: 'email', label: '邮箱', minWidth: 180 },
        { prop: 'status', label: '状态', width: 90, slotName: 'status' },
        {
          type: 'action',
          label: '操作',
          width: 220,
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
      onCustomAction: async (event: string, row: any) => {
        if (event === 'enable') {
          await updateUserStatus(row.id, 1)
          message.success(`已启用「${row.name}」`)
          getTableData()
        } else if (event === 'disable') {
          await updateUserStatus(row.id, 0)
          message.warning(`已禁用「${row.name}」`)
          getTableData()
        } else if (event === 'edit') {
          openDialog('edit', row)
        }
      },
    },
  },
  { deleteApi: deleteUser, batchDeleteApi: batchDeleteUsers }
)

// 编辑弹窗:编辑已有行数据,保存后刷新列表
const { dialogVisible, dialogMode, formData, formRef, openDialog, submitForm, handleDialogClose, submitLoading } = useFormDialog<User>({
  initialData: { id: 0, name: '', email: '', status: 1, role: 'user', createTime: '', tags: [] as string[] },
  idKey: 'id',
  // 本页仅编辑已有行;addApi 为必填,复用 updateUser
  addApi: (data: User) => updateUser(data),
  updateApi: (data: User) => updateUser(data),
  onAfterSubmit: () => {
    message.success('保存成功')
    getTableData()
  },
})

// formRef 通过模板 ref="formRef" 绑定到 el-form;此处显式引用以通过 noUnusedLocals 检查
void formRef
</script>

<template>
  <div class="demo-page">
    <el-alert
      class="demo-tip"
      :closable="false"
      show-icon
      type="success"
      title="高级表格列演示"
      description="expand 展开行 / 自定义表头(#name-header)与单元格插槽 / append 底部插槽 / 操作列按钮按行状态动态显隐(visible)与禁用(disabled) / selection 跨页多选(reserveSelection) / 启用·禁用·编辑·删除 全交互"
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

    <!-- 编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogMode === 'edit' ? '编辑用户' : '新增用户'" width="480px">
      <el-form ref="formRef" :model="formData" label-width="80px">
        <el-form-item label="名称">
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="formData.email" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="formData.status">
            <el-radio :value="1">启用</el-radio>
            <el-radio :value="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="formData.role">
            <el-option label="admin" value="admin" />
            <el-option label="user" value="user" />
            <el-option label="editor" value="editor" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleDialogClose">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="submitForm">保存</el-button>
      </template>
    </el-dialog>
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
  background: var(--el-fill-color-light);
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
/* 操作列按钮对齐:统一最小宽度并居中,避免因按钮文本宽度不同而参差 */
.demo-page :deep(.custom-table-container .el-table__cell .el-link),
.demo-page :deep(.custom-table-container .el-table__cell .el-button) {
  min-width: 36px;
  justify-content: center;
}
</style>
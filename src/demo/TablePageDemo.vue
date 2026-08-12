<script setup lang="ts">
import { useTablePage, CustomTable } from 'vue3-crud-hooks'
import {
  fetchUserListPlain,
  deleteUser,
  batchDeleteUsers,
  exportFunction,
} from '../api/mockUser'

// useTablePage 独立使用:仅列表管理(分页/搜索/删除/批量/导出),不涉及弹窗
const {
  tableBindings,
  searchParams,
  handleSearch,
  handleReset,
  handleBatchDelete,
  handleExport,
  deleteLoading,
  selectedIds,
  sortInfo,
  filterInfo,
} = useTablePage(
  fetchUserListPlain, // 普通响应 { rows, total }
  { keyword: '' },
  {
    customTableConfig: {
      selection: true,
      columns: [
        { prop: 'name', label: '名称', minWidth: 100, sortable: 'custom' },
        { prop: 'email', label: '邮箱', minWidth: 180 },
        {
          prop: 'status',
          label: '状态',
          width: 110,
          slotName: 'status',
          filters: [
            { text: '启用', value: 1 },
            { text: '禁用', value: 0 },
          ],
        },
        { prop: 'role', label: '角色', width: 100 },
        {
          type: 'action',
          label: '操作',
          width: 100,
          buttons: [{ btnText: '删除', event: 'delete', type: 'danger' }],
        },
      ],
    },
    sortable: true,
    filterable: true,
  },
  { deleteApi: deleteUser, batchDeleteApi: batchDeleteUsers },
  { exportFunction }
)


</script>

<template>
  <div class="demo-page">
    <el-alert class="demo-tip" :closable="false" show-icon type="info" title="useTablePage 独立列表管理" description="分页 / 搜索 / 删除 / 批量删除 / 导出 / 服务端排序(名称列)/ 列筛选(状态列);快速连续点搜索可感受请求竞态防护" />
    <p class="hint">独立使用 useTablePage 管理列表,切换每页条数表格保持自适应、分页器固定底部。</p>
    <el-card shadow="never">
      <div class="search-bar">
        <el-input v-model="searchParams.keyword" placeholder="搜索名称/邮箱" style="width: 240px" clearable />
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button @click="handleReset">重置</el-button>
        <el-button type="danger" :loading="deleteLoading" @click="handleBatchDelete">批量删除</el-button>
        <el-button @click="handleExport({ filename: 'table-users' })">导出</el-button>
        <el-tag v-if="selectedIds.length" type="info">已选 {{ selectedIds.length }} 条</el-tag>
        <el-tag v-if="sortInfo.order" type="warning">排序:{{ sortInfo.prop }} {{ sortInfo.order === 'ascending' ? '升序' : '降序' }}</el-tag>
        <el-tag v-if="Object.keys(filterInfo).length" type="success">筛选:{{ JSON.stringify(filterInfo) }}</el-tag>
      </div>

      <CustomTable v-bind="tableBindings">
        <template #status="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'danger'">
            {{ row.status === 1 ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </CustomTable>

    </el-card>
  </div>
</template>

<style scoped>
.search-bar {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  flex-wrap: wrap;
  align-items: center;
}
.hint {
  margin: 0 0 8px;
  color: #909399;
  font-size: 12px;
}
</style>

<style scoped>
.demo-tip {
  margin-bottom: 12px;
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




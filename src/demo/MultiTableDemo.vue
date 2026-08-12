<script setup lang="ts">
import { useTablePage, CustomTable } from 'vue3-crud-hooks'
import { fetchUserListPlain } from '../api/mockUser'

// 多表格演示:两个 CustomTable 并排,各自独立分页/搜索/高度自适应
// 关键点:autoHeight 已默认开启,无需传 :auto-height;两个实例的 tableRef/paginationRef/高度/事件完全独立
const orders = useTablePage(fetchUserListPlain, { keyword: '' }, {
  customTableConfig: {
    selection: true,
    columns: [
      { prop: 'name', label: '订单号', minWidth: 110, sortable: 'custom' },
      { prop: 'email', label: '客户', minWidth: 160 },
      { prop: 'role', label: '类型', width: 90 },
      { prop: 'status', label: '状态', width: 90, slotName: 'status' },
    ],
  },
  sortable: true,
})
// 顶层解构:模板中 v-bind 直接使用(ComputedRef 自动解包)
const ordersBindings = orders.tableBindings

const logs = useTablePage(fetchUserListPlain, { keyword: '' }, {
  customTableConfig: {
    columns: [
      { prop: 'name', label: '操作人', minWidth: 110 },
      { prop: 'email', label: '日志内容', minWidth: 190 },
      { prop: 'createTime', label: '时间', minWidth: 160 },
    ],
  },
})
const logsBindings = logs.tableBindings
</script>

<template>
  <div class="multi-table-page">
    <el-alert class="demo-tip" :closable="false" show-icon type="info" title="多表格互不影响" description="两个表格并排展示,autoHeight 默认开启(无需任何配置);各自独立分页/搜索/排序/高度,左侧切到 20 条或翻页不影响右侧" />
    <div class="table-grid">
      <el-card shadow="never" class="table-card">
        <template #header>
          <div class="card-header">
            <span>订单列表</span>
            <el-tag size="small" type="info">共 {{ orders.pageInfo.total }} 条</el-tag>
          </div>
        </template>
        <div class="search-bar">
          <el-input v-model="orders.searchParams.keyword" placeholder="搜索订单号/客户" style="width: 170px" clearable />
          <el-button size="small" type="primary" @click="orders.handleSearch">搜索</el-button>
        </div>
        <CustomTable v-bind="ordersBindings">
          <template #status="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">
              {{ row.status === 1 ? '完成' : '处理中' }}
            </el-tag>
          </template>
        </CustomTable>
      </el-card>

      <el-card shadow="never" class="table-card">
        <template #header>
          <div class="card-header">
            <span>操作日志</span>
            <el-tag size="small" type="info">共 {{ logs.pageInfo.total }} 条</el-tag>
          </div>
        </template>
        <div class="search-bar">
          <el-input v-model="logs.searchParams.keyword" placeholder="搜索操作人/内容" style="width: 170px" clearable />
          <el-button size="small" type="primary" @click="logs.handleSearch">搜索</el-button>
        </div>
        <CustomTable v-bind="logsBindings" />
      </el-card>
    </div>
  </div>
</template>

<style scoped>
.multi-table-page {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.demo-tip {
  margin-bottom: 12px;
}
.table-grid {
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.table-card {
  display: flex;
  flex-direction: column;
  min-height: 0;
}
.table-card :deep(.el-card__body) {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}
.table-card :deep(.custom-table-container) {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}
.search-bar {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}
.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
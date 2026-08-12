<script setup lang="ts">
import { ref } from 'vue'
import { useTableHeight, Pagination } from 'vue3-crud-hooks'
import type { User } from '../api/mockUser'
import { fetchUserListPlain } from '../api/mockUser'

// useTableHeight:表格自适应高度演示(配合原生 el-table + 独立 Pagination 组件)
const tableRef = ref()
const paginationRef = ref()
const wrapperRef = ref()
const rows = ref<User[]>([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(10)
const showSearch = ref(true)

const { tableMaxHeight } = useTableHeight(tableRef, paginationRef, {
  containerRef: wrapperRef,
  watchSources: [showSearch], // 搜索栏展开/收起时联动重算
  minHeight: 200,
  extraGap: 40, // 为分页器间距 + 内容区 padding 预留缓冲,避免外部滚动条
})

const load = async () => {
  const res = await fetchUserListPlain({ pageNum: page.value, pageSize: pageSize.value })
  rows.value = res.rows
  total.value = res.total
}
load()

const onPage = (p: { currentPage: number; pageSize: number }) => {
  page.value = p.currentPage
  pageSize.value = p.pageSize
  load()
}
</script>

<template>
  <div ref="wrapperRef" class="height-demo">
    <el-alert class="demo-tip" :closable="false" show-icon type="info" title="useTableHeight 表格自适应高度" description="缩放浏览器窗口 / 切换搜索栏 / 调整每页条数(分页器换行),表格高度实时自适应,内容区内部滚动、分页器固定底部" />
    <p class="hint top-hint">验证方式:缩放浏览器窗口、切换搜索栏、调整每页条数(分页器换行)时,表格高度实时自适应;表格内容区内部滚动,分页器固定底部。</p>
    <div class="toolbar">
      <el-button size="small" @click="showSearch = !showSearch">
        切换搜索栏({{ showSearch ? '收起' : '展开' }})
      </el-button>
      <span class="hint">当前表格高度:{{ tableMaxHeight }}px</span>
    </div>
    <div v-if="showSearch" class="fake-search">
      模拟高级搜索栏:展开/收起会改变页面布局,useTableHeight 通过 watchSources 自动重算
    </div>
    <el-table ref="tableRef" :data="rows" :height="tableMaxHeight" border>
      <el-table-column prop="name" label="名称" min-width="100" />
      <el-table-column prop="email" label="邮箱" min-width="180" />
      <el-table-column prop="role" label="角色" width="100" />
      <el-table-column prop="status" label="状态" width="90">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'danger'">
            {{ row.status === 1 ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      ref="paginationRef"
      :total="total"
      :current-page="page"
      :page-size="pageSize"
      @pagination="onPage"
    />
  </div>
</template>

<style scoped>
.top-hint {
  margin: 0 0 8px;
  color: #909399;
  font-size: 12px;
}
.toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}
.fake-search {
  height: 40px;
  line-height: 40px;
  padding: 0 12px;
  background: #f5f7fa;
  border-radius: 4px;
  margin-bottom: 8px;
  font-size: 13px;
  color: #606266;
}
.hint {
  color: #909399;
  font-size: 12px;
  margin: 8px 0 0;
}
</style>

<style scoped>
.demo-tip {
  margin-bottom: 12px;
}
</style>


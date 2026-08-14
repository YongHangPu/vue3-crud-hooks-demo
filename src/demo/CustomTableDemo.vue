<script setup lang="ts">
import { ref } from 'vue'
import { CustomTable, useTablePage, useMessage } from 'vue3-crud-hooks'
import type { CustomTableConfig } from 'vue3-crud-hooks'
import type { User } from '../api/mockUser'
import { fetchUserListNested } from '../api/mockUser'

const message = useMessage()

// ── 1. CustomTable 手动用法:data + config + 分页事件,对接嵌套响应并手动解析 ──
const data = ref<User[]>([])
const total = ref(0)
const page = ref(1)
const size = ref(10)
const loading = ref(false)

const config: CustomTableConfig = {
  selection: true,
  index: true,
  columns: [
    { prop: 'name', label: '名称', minWidth: 100 },
    { prop: 'email', label: '邮箱', minWidth: 180 },
    { prop: 'status', label: '状态', width: 90, slotName: 'status' },
    {
      type: 'action',
      label: '操作',
      width: 100,
      buttons: [{ btnText: '查看', event: 'view', btnType: 'link' }],
    },
  ],
  pagination: { currentPage: 1, pageSize: 10 },
}

const load = async () => {
  loading.value = true
  // 后端返回嵌套结构 { code, message, data: { records, total } },此处手动取数
  const res = await fetchUserListNested({ pageNum: page.value, pageSize: size.value })
  data.value = res.data.records
  total.value = res.data.total
  loading.value = false
}
load()

const onPagination = (p: { currentPage: number; pageSize: number }) => {
  page.value = p.currentPage
  size.value = p.pageSize
  load()
}
const onAction = (_event: string, row: User) => {
  message.success(`查看 ${row.name}`)
}

// ── 2. useTablePage + transformResponse:自定义响应解析 ──
// 模拟后端返回特殊结构 { payload: { records, total } },通过 transformResponse 适配
const specialApi = async (params: any) => {
  const res = await fetchUserListNested(params)
  return { payload: res.data }
}
const { tableBindings } = useTablePage(specialApi, {}, {
  transformResponse: (res: any) => ({ data: res.payload.records, total: res.payload.total }),
  customTableConfig: {
    columns: [
      { prop: 'name', label: '名称', minWidth: 100 },
      { prop: 'role', label: '角色', width: 100 },
    ],
  },
})
</script>

<template>
  <div>
    <el-alert class="demo-tip" :closable="false" show-icon type="info" title="CustomTable 独立使用 + transformResponse" description="上半:手动 data+config+分页事件对接嵌套响应;下半:useTablePage 配合 transformResponse 解析特殊结构" />
    <el-card shadow="never" class="mb">
      <template #header>CustomTable 手动用法(对接嵌套响应,手动解析 data.records)</template>
      <CustomTable
        :config="config"
        :data="data"
        :loading="loading"
        @pagination="onPagination"
        @action="onAction"
      >
        <template #status="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'danger'">
            {{ row.status === 1 ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </CustomTable>
    </el-card>

    <el-card shadow="never">
      <template #header>useTablePage + transformResponse(自定义特殊结构解析)</template>
      <CustomTable v-bind="(tableBindings as any)" />
      <p class="hint">后端返回 <code>{ payload: { records, total } }</code>,通过 transformResponse 转为标准 { data, total }。</p>
    </el-card>
  </div>
</template>

<style scoped>
.mb {
  margin-bottom: 16px;
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


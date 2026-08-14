<script setup lang="ts">
import { ref } from 'vue'
import { useCrudPage, CustomTable } from 'vue3-crud-hooks'
import type { User } from '../api/mockUser'
import {
  fetchUserListCode1,
  addUser,
  updateUser,
  deleteUser,
  batchDeleteUsers,
  getUser,
} from '../api/mockUser'

// 回调日志
const logs = ref<{ time: string; msg: string }[]>([])
const log = (msg: string) => {
  logs.value.unshift({ time: new Date().toLocaleTimeString(), msg })
  if (logs.value.length > 12) logs.value.pop()
}

// 本页模拟「code=1 表示成功」的后端形态:共享 mock 的增删改接口返回 code=200,
// 这里将成功响应(code=200)映射为 code=1,业务失败码(如 500)原样保留
const withCode1 = <A extends any[]>(fn: (...args: A) => Promise<any>) =>
  async (...args: A): Promise<any> => {
    const res = await fn(...args)
    return res?.code === 200 ? { ...res, code: 1 } : res
  }

const {
  searchParams,
  tableBindings,
  handleSearch,
  handleReset,
  dialogVisible,
  dialogMode,
  formData,
  formRef,
  openDialog,
  submitForm,
  handleDialogClose,
  handleBatchDelete,
  getTableData,
} = useCrudPage<User>({
  apis: {
    // code=1 表示成功的后端 + 特殊结构 data.list
    list: fetchUserListCode1,
    add: withCode1(addUser),
    update: withCode1(updateUser),
    delete: withCode1(deleteUser),
    batchDelete: withCode1(batchDeleteUsers),
    get: withCode1(getUser),
  },
  form: {
    initialData: { id: 0, name: '', email: '', status: 1, role: 'user', createTime: '', tags: [] },
    beforeSubmit: (data) => {
      log(`beforeSubmit 触发:name「${data.name}」→「${data.name}(转)」`)
      return { ...data, name: data.name + '(转)' }
    },
    afterGet: (data) => {
      log(`afterGet 触发:name「${data.name}」→「${data.name}(回显)」`)
      return { ...data, name: data.name + '(回显)' }
    },
  },
  table: {
    idKey: 'id',
    config: {
      selection: true,
      index: { label: '序号', width: 60, align: 'center' },
      columns: [
        { prop: 'name', label: '名称', minWidth: 100 },
        { prop: 'email', label: '邮箱', minWidth: 180 },
        { prop: 'status', label: '状态', width: 90, slotName: 'status' },
        {
          type: 'action',
          label: '操作',
          width: 100,
          buttons: [{ btnText: '删除', event: 'delete', type: 'danger' }],
        },
      ],
    },
    transformResponse: (res: any) => {
      log('transformResponse 触发:data.list → { data, total }')
      return { data: res.data.list, total: res.data.total }
    },
  },
  search: {
    initialData: { keyword: '' },
    beforeSearch: (params) => {
      log(`beforeSearch 触发:追加 fixed=true(原参数 ${JSON.stringify(params)})`)
      return { ...params, fixed: true }
    },
  },
  advanced: {
    arrayFields: ['tags'],
    // 自定义成功码:该后端 code=1 表示成功
    isSuccess: (res) => {
      const ok = res?.code === 1
      log(`isSuccess 触发:code=${res?.code} → ${ok ? '判定成功' : '判定失败'}(自定义 code=1)`)
      return ok
    },
    onDeleteSuccess: (row) => {
      log(`onDeleteSuccess 触发:已删除「${row.name}」`); getTableData()
    },
    onBatchDeleteSuccess: (rows) => {
      log(`onBatchDeleteSuccess 触发:批量删除 ${rows.length} 条`); getTableData()
    },
  },
})

// formRef 通过模板 ref="formRef" 绑定到 el-form;此处显式引用以通过 noUnusedLocals 检查
void formRef



</script>

<template>
  <div class="flow-page">
    <el-alert
      class="demo-tip"
      :closable="false"
      show-icon
      type="warning"
      title="数据流转演示:生命周期回调 + 自定义响应适配"
      description="beforeSearch(搜索参数转换) / beforeSubmit(提交前转换) / afterGet(回显转换) / onDeleteSuccess / onBatchDeleteSuccess 回调;自定义 isSuccess(code=1 为成功)与 transformResponse(解析 data.list 特殊结构)。所有回调触发记录在右侧日志。"
    />
    <el-row :gutter="16" class="flow-row">
      <el-col :span="16" class="flow-col">
        <el-card shadow="never" class="flow-card">
          <div class="search-bar">
            <el-input v-model="searchParams.keyword" placeholder="搜索名称/邮箱" style="width: 200px" clearable />
            <el-button type="primary" @click="handleSearch">搜索(beforeSearch)</el-button>
            <el-button @click="handleReset">重置</el-button>
            <el-button type="primary" @click="openDialog('add')">新增(beforeSubmit)</el-button>
            <el-button type="danger" @click="handleBatchDelete">批量删除(onBatchDeleteSuccess)</el-button>
          </div>
          <CustomTable v-bind="(tableBindings as any)">
            <template #status="{ row }">
              <el-tag :type="row.status === 1 ? 'success' : 'danger'">
                {{ row.status === 1 ? '启用' : '禁用' }}
              </el-tag>
            </template>
          </CustomTable>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="never">
          <template #header>回调日志</template>
          <el-timeline v-if="logs.length">
            <el-timeline-item v-for="(l, i) in logs" :key="i" :timestamp="l.time" placement="top">
              {{ l.msg }}
            </el-timeline-item>
          </el-timeline>
          <el-empty v-else description="操作上方表格/按钮,查看回调触发" :image-size="60" />
        </el-card>
      </el-col>
    </el-row>

    <el-dialog
      v-model="dialogVisible"
      :title="dialogMode === 'add' ? '新增(数据流转演示)' : '编辑(数据流转演示)'"
      width="480px"
    >
      <el-form ref="formRef" :model="formData" label-width="80px">
        <el-form-item label="名称"><el-input v-model="formData.name" /></el-form-item>
        <el-form-item label="邮箱"><el-input v-model="formData.email" /></el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="formData.status">
            <el-radio :value="1">启用</el-radio>
            <el-radio :value="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleDialogClose">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.demo-tip {
  margin-bottom: 12px;
}
.search-bar {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}
</style>

<style scoped>
.flow-page {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.flow-page :deep(.el-alert) {
  flex-shrink: 0;
}
.flow-row {
  flex: 1;
  min-height: 0;
}
.flow-col {
  height: 100%;
}
.flow-col :deep(.el-card) {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}
.flow-col :deep(.el-card__body) {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}
.flow-col :deep(.custom-table-container) {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}
.flow-col :deep(.custom-table-container .el-table) {
  flex: none;
}

/* 右侧回调日志列:与左侧等高,日志在卡片内部滚动,不随内容撑高页面 */
.flow-row :deep(.el-col:last-child) {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.flow-row :deep(.el-col:last-child .el-card) {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}
.flow-row :deep(.el-col:last-child .el-card__body) {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}
</style>




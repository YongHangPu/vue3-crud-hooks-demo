<script setup lang="ts">
import { useCrudPage, CustomTable } from 'vue3-crud-hooks'
import type { FormRules } from 'element-plus'
import type { User } from '../api/mockUser'
import {
  fetchUserListFail,
  addUser,
  updateUser,
  deleteUser,
  batchDeleteUsers,
  getUser,
  exportUsers,
} from '../api/mockUser'


// 表单校验规则
const rules: FormRules = {
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
}

const {
  searchParams,
  tableBindings,
  pageInfo,
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
  handleExport,
  deleteLoading,
  submitLoading,
} = useCrudPage<User>({
  apis: {
    list: fetchUserListFail, // 业务失败演示:搜索关键字输入 fail
    add: addUser,
    update: updateUser,
    delete: deleteUser,
    batchDelete: batchDeleteUsers,
    get: getUser,
    export: exportUsers,
  },
  form: {
    initialData: {
      id: 0,
      name: '',
      email: '',
      status: 1,
      role: 'user',
      createTime: '',
      tags: [],
    },
  },
  table: {
    idKey: 'id',
    config: {
      selection: true,
      index: true,
      columns: [
        { prop: 'name', label: '名称', minWidth: 100 },
        { prop: 'email', label: '邮箱', minWidth: 180 },
        { prop: 'status', label: '状态', width: 90, slotName: 'status' },
        { prop: 'role', label: '角色', width: 100 },
        { prop: 'createTime', label: '创建时间', minWidth: 160 },
        {
          type: 'action',
          label: '操作',
          width: 130,
          buttons: [
            { btnText: '编辑', event: 'edit', type: 'primary' },
            { btnText: '删除', event: 'delete', type: 'danger' },
          ],
        },
      ],
    },
  },
  search: {
    initialData: { keyword: '', status: undefined },
  },
  advanced: {
    // 提交时 tags 数组自动转逗号字符串、编辑回显自动转回数组(useDataTransform 联动)
    arrayFields: ['tags'],
  },
})

// formRef 通过模板 ref="formRef" 绑定到 el-form;此处显式引用以通过 noUnusedLocals 检查
void formRef
</script>

<template>
  <div class="crud-demo">
    <el-alert class="demo-tip" :closable="false" show-icon type="success" title="useCrudPage 完整 CRUD 页面" description="搜索(输入 fail 演示业务码校验) / 重置 / 分页 / 新增 / 编辑回显 / 删除 / 批量删除 / 导出;新增名称填 err 演示业务失败;切换每页条数表格保持自适应" />
    <el-card shadow="never" class="search-card">
      <div class="search-bar">
        <el-input
          v-model="searchParams.keyword"
          placeholder="搜索名称/邮箱(输入 fail 演示业务失败)"
          style="width: 260px"
          clearable
        />
        <el-select v-model="searchParams.status" placeholder="状态" clearable style="width: 120px">
          <el-option label="启用" :value="1" />
          <el-option label="禁用" :value="0" />
        </el-select>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button @click="handleReset">重置</el-button>
        <el-button type="primary" @click="openDialog('add')">新增</el-button>
        <el-button type="danger" :loading="deleteLoading" @click="handleBatchDelete">批量删除</el-button>
        <el-button @click="handleExport({ filename: 'users' })">导出</el-button>
        <el-tag v-if="pageInfo.total" type="info" effect="plain">第 {{ pageInfo.pageNum }} / {{ pageInfo.total }} 条</el-tag>
      </div>

      <CustomTable v-bind="(tableBindings as any)">
        <template #status="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'danger'">
            {{ row.status === 1 ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </CustomTable>

    </el-card>

    <el-dialog
      v-model="dialogVisible"
      :title="dialogMode === 'add' ? '新增用户' : '编辑用户'"
      width="520px"
    >
      <el-form ref="formRef" :model="formData" label-width="80px" :rules="rules">
        <el-form-item label="名称" prop="name">
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
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
        <el-form-item label="标签">
          <el-select v-model="formData.tags" multiple placeholder="选择标签">
            <el-option v-for="t in ['前端', '后端', '测试', '运维', '设计', '产品']" :key="t" :label="t" :value="t" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleDialogClose">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="submitForm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.crud-demo {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.search-card {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}
.search-card :deep(.el-card__body) {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}
.search-card :deep(.custom-table-container) {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}
.search-card :deep(.custom-table-container .el-table) {
  flex: none;
}
.search-bar {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  flex-wrap: wrap;
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






<script setup lang="ts">
import { useFormDialog } from 'vue3-crud-hooks'
import type { FormRules } from 'element-plus'
import type { User } from '../api/mockUser'
import { addUser, updateUser, getUser } from '../api/mockUser'

const rules: FormRules = {
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
}

// useFormDialog 独立使用:仅弹窗表单(新增/编辑回显/校验/提交),不依赖表格
const {
  dialogVisible,
  dialogMode,
  formData,
  formRef,
  openDialog,
  submitForm,
  handleDialogClose,
  submitLoading,
  formLoading,
} = useFormDialog<User>({
  initialFormData: { id: 0, name: '', email: '', status: 1, role: 'user', createTime: '', tags: [] },
  idKey: 'id',
  addApi: addUser,
  updateApi: updateUser,
  getApi: getUser,
})

// formRef 通过模板 ref="formRef" 绑定到 el-form;此处显式引用以通过 noUnusedLocals 检查
void formRef
</script>

<template>
  <div>
    <el-alert class="demo-tip" :closable="false" show-icon type="info" title="useFormDialog 独立弹窗表单" description="新增 / 编辑(getApi 回显) / 表单校验 / 提交,不依赖表格" />
    <el-card shadow="never">
      <p class="hint">useFormDialog 独立使用:弹窗表单的完整流程。编辑模式通过 getApi 回显详情。</p>
      <el-button type="primary" @click="openDialog('add')">打开新增弹窗</el-button>
      <el-button :loading="formLoading" @click="openDialog('edit', { id: 1 })">
        打开编辑弹窗(id=1,getApi 回显)
      </el-button>
    </el-card>

    <el-dialog
      v-model="dialogVisible"
      :title="dialogMode === 'add' ? '新增(独立弹窗)' : '编辑(独立弹窗)'"
      width="480px"
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
      </el-form>
      <template #footer>
        <el-button @click="handleDialogClose">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="submitForm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.hint {
  margin: 0 0 12px;
  color: #909399;
  font-size: 12px;
}
</style>

<style scoped>
.demo-tip {
  margin-bottom: 12px;
}
</style>


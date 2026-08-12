<script setup lang="ts">
import { ref } from 'vue'
import { Pagination } from 'vue3-crud-hooks'

// Pagination 组件独立使用:v-model 双向绑定 + @pagination 事件
const page = ref(1)
const size = ref(10)
const total = ref(100)
const log = ref('(操作分页器查看事件)')

const onPagination = (p: { currentPage: number; pageSize: number }) => {
  log.value = `分页事件 → 第 ${p.currentPage} 页,每页 ${p.pageSize} 条`
}
</script>

<template>
  <div>
    <el-alert class="demo-tip" :closable="false" show-icon type="info" title="Pagination 组件独立使用" description="defineModel 的 v-model 双向绑定;修改 total / 跳页观察页码重置与超范围行为" />
>
    <el-card shadow="never">
      <template #header>Pagination 组件独立使用(defineModel v-model 双向绑定)</template>
      <Pagination
        :total="total"
        v-model:current-page="page"
        v-model:page-size="size"
        :page-sizes="[10, 20, 50]"
        @pagination="onPagination"
      />
      <p class="hint">
        当前状态:第 {{ page }} 页 / 每页 {{ size }} 条(通过 v-model:current-page / v-model:page-size 双向绑定)
      </p>
      <p class="hint">事件:{{ log }}</p>
      <el-divider />
      <el-button size="small" @click="total = 300">改为 total=300(观察页码重置行为)</el-button>
      <el-button size="small" @click="page = 5">跳转到第 5 页</el-button>
    </el-card>
  </div>
</template>

<style scoped>
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


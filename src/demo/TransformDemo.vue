<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useDataTransform, useMessage, deepCleanEmptyFields } from 'vue3-crud-hooks'

const { arrayToString, stringToArray, processTimeRange, cleanEmptyFields, convertNumbers } =
  useDataTransform()
const message = useMessage()

const input = reactive({
  tags: ['前端', '后端', '测试'],
  range: ['2025-01-01', '2025-01-31'],
  empty: '',
  numStr: '123',
  num: 0,
})
const output = ref('(点击按钮查看转换结果)')

const runArrayToString = () => {
  output.value = JSON.stringify(arrayToString({ ...input }, ['tags']), null, 2)
}
const runStringToArray = () => {
  output.value = JSON.stringify(stringToArray({ tags: 'a,b,c' }, ['tags']), null, 2)
}
const runProcessTimeRange = () => {
  output.value = JSON.stringify(processTimeRange({ range: [...input.range] }, 'range'), null, 2)
}
const runClean = () => {
  output.value = JSON.stringify(cleanEmptyFields({ ...input }), null, 2)
}
const runConvert = () => {
  output.value = JSON.stringify(convertNumbers({ numStr: input.numStr, num: input.num }, ['numStr']), null, 2)
}
const runDeepClean = () => {
  output.value = JSON.stringify(
    deepCleanEmptyFields({ a: 1, b: '', c: null, d: { e: '', f: [0, '', null] } }),
    null,
    2
  )
}

// useMessage 演示
const success = () => message.success('这是 success 消息')
const error = () => message.error('这是 error 消息')
const warning = () => message.warning('这是 warning 消息')
const confirm = async () => {
  try {
    await message.confirm('确定要执行该操作吗?')
    message.success('已确认')
  } catch {
    message.warning('已取消')
  }
}
</script>

<template>
  <div>
    <el-alert class="demo-tip" :closable="false" show-icon type="warning" title="useDataTransform 数据转换 + useMessage 消息" description="六种转换:数组/字符串互转、时间范围拆分、空值清理、转数字、深度清理;四种消息:success/error/warning/confirm" />
    <el-card shadow="never" class="mb">
      <template #header>useDataTransform 数据转换</template>
      <div class="row">
        <el-button @click="runArrayToString">arrayToString(数组→逗号字符串)</el-button>
        <el-button @click="runStringToArray">stringToArray(字符串→数组)</el-button>
        <el-button @click="runProcessTimeRange">processTimeRange(时间范围拆分)</el-button>
        <el-button @click="runClean">cleanEmptyFields(清理空值)</el-button>
        <el-button @click="runConvert">convertNumbers(转数字)</el-button>
        <el-button @click="runDeepClean">deepCleanEmptyFields(深度清理)</el-button>
      </div>
      <p class="hint">输入数据:{{ JSON.stringify(input) }}</p>
      <pre class="output">{{ output }}</pre>
    </el-card>

    <el-card shadow="never">
      <template #header>useMessage 消息提示</template>
      <div class="row">
        <el-button type="success" @click="success">success</el-button>
        <el-button type="danger" @click="error">error</el-button>
        <el-button type="warning" @click="warning">warning</el-button>
        <el-button @click="confirm">confirm 确认框</el-button>
      </div>
      <p class="hint">消息由 element-plus 的 ElMessage/ElMessageBox 渲染(右上角)。</p>
    </el-card>
  </div>
</template>

<style scoped>
.mb {
  margin-bottom: 16px;
}
.row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}
.hint {
  color: #909399;
  font-size: 12px;
  margin: 0 0 8px;
}
.output {
  background: var(--el-fill-color-light);
  padding: 12px;
  border-radius: 4px;
  min-height: 80px;
  margin: 0;
  font-size: 12px;
  white-space: pre-wrap;
}
</style>

<style scoped>
.demo-tip {
  margin-bottom: 12px;
}
</style>


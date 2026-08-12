import { describe, it, expect, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import {
  useTablePage,
  useCrudPage,
  useFormDialog,
  useDataTransform,
  useMessage,
  calculateTableMaxHeight,
  extractListResult,
  isBusinessSuccess,
  getResponseMessage,
} from 'vue3-crud-hooks'

/** 挂载一个执行 factory 的组件并返回其结果 */
const mountHook = <T>(factory: () => T) => {
  const wrapper = mount(
    defineComponent({
      setup() {
        return { result: factory() }
      },
      template: '<div />',
    })
  )
  return { wrapper, hook: wrapper.vm.result as T }
}

describe('useDataTransform', () => {
  it('arrayToString / stringToArray 互转', () => {
    const { arrayToString, stringToArray } = useDataTransform()
    expect(arrayToString({ tags: ['a', 'b'] }, ['tags'])).toEqual({ tags: 'a,b' })
    expect(stringToArray({ tags: 'a,b' }, ['tags'])).toEqual({ tags: ['a', 'b'] })
  })

  it('processTimeRange / cleanEmptyFields / convertNumbers', () => {
    const { processTimeRange, cleanEmptyFields, convertNumbers } = useDataTransform()
    expect(processTimeRange({ range: ['2025-01-01', '2025-01-31'] }, 'range')).toEqual({
      beginrange: '2025-01-01',
      endrange: '2025-01-31',
    })
    expect(cleanEmptyFields({ a: 1, b: '', c: null, d: undefined })).toEqual({ a: 1 })
    expect(convertNumbers({ n: '123' }, ['n'])).toEqual({ n: 123 })
  })
})

describe('响应适配(嵌套解析 / 业务码 / 消息提取)', () => {
  it('extractListResult 解析嵌套包装', () => {
    expect(
      extractListResult({ code: 200, data: { records: [{ id: 1 }], total: 5 } })
    ).toEqual({ data: [{ id: 1 }], total: 5 })
  })

  it('isBusinessSuccess 识别成功/失败码', () => {
    expect(isBusinessSuccess({ code: 200 })).toBe(true)
    expect(isBusinessSuccess({ code: 1 })).toBe(true)
    expect(isBusinessSuccess({ code: 500 })).toBe(false)
    expect(isBusinessSuccess({ rows: [], total: 0 })).toBe(true) // 无 code 视为成功
  })

  it('getResponseMessage 兼容 message/msg', () => {
    expect(getResponseMessage({ message: 'a', msg: 'b' })).toBe('a')
    expect(getResponseMessage({ msg: 'b' })).toBe('b')
  })
})

describe('useTablePage(从 npm 安装的包)', () => {
  it('获取列表并更新 tableData/total', async () => {
    const fetchData = vi.fn().mockResolvedValue({ rows: [{ id: 1, name: 'Tom' }], total: 1 })
    const { hook } = mountHook(() => useTablePage(fetchData, {}))
    await flushPromises()
    expect(hook.tableData.value).toEqual([{ id: 1, name: 'Tom' }])
    expect(hook.pageInfo.total).toBe(1)
    expect(hook.tableBindings.value).toBeTruthy() // 未配置 customTableConfig 时 config 为 null,绑定对象本身存在
  })

  it('业务失败(code=500)不进入成功分支', async () => {
    const fetchData = vi.fn().mockResolvedValue({ code: 500, message: '服务繁忙' })
    const { hook } = mountHook(() =>
      useTablePage(fetchData, {}, { messageApi: { error: vi.fn(), success: vi.fn(), warning: vi.fn(), confirm: vi.fn() } })
    )
    await flushPromises()
    expect(hook.tableData.value).toEqual([])
    expect(hook.pageInfo.total).toBe(0)
  })
})

describe('useCrudPage', () => {
  it('完整 CRUD 配置下能获取列表', async () => {
    const list = vi.fn().mockResolvedValue({ code: 200, rows: [{ id: 1 }], total: 1 })
    const { hook } = mountHook(() =>
      useCrudPage({
        apis: { list, add: vi.fn(), update: vi.fn() },
        form: { initialData: { id: 0, name: '' } },
        table: { config: { columns: [{ prop: 'name', label: '名称' }] } },
      })
    )
    await flushPromises()
    expect(hook.tableData.value).toEqual([{ id: 1 }])
    expect(hook.pageInfo.total).toBe(1)
  })
})

describe('useFormDialog', () => {
  it('新增提交调用 addApi 并关闭弹窗', async () => {
    const addApi = vi.fn().mockResolvedValue({ code: 200, message: '保存成功' })
    const { hook } = mountHook(() =>
      useFormDialog({
        initialFormData: { name: '' },
        addApi,
        updateApi: vi.fn(),
        messageApi: { success: vi.fn(), error: vi.fn(), warning: vi.fn(), confirm: vi.fn() },
      })
    )
    hook.formRef.value = { validate: () => Promise.resolve(true), clearValidate: vi.fn(), resetFields: vi.fn() }
    hook.formData.value = { name: 'demo' }
    hook.dialogVisible.value = true
    await hook.submitForm()
    expect(addApi).toHaveBeenCalledWith({ name: 'demo' })
    expect(hook.dialogVisible.value).toBe(false)
  })
})

describe('useMessage', () => {
  it('优先使用自定义 messageApi', () => {
    const spy = vi.fn()
    const { success } = useMessage({ success: spy })
    success('hi')
    expect(spy).toHaveBeenCalledWith('hi')
  })
})

describe('useTableHeight 纯函数', () => {
  it('calculateTableMaxHeight 基本计算与最小高度兜底', () => {
    expect(
      calculateTableMaxHeight({ viewportHeight: 900, tableTop: 100, paginationHeight: 50, extraGap: 24, minHeight: 240 })
    ).toBe(726)
    expect(
      calculateTableMaxHeight({ viewportHeight: 200, tableTop: 100, paginationHeight: 50, extraGap: 24, minHeight: 240 })
    ).toBe(240)
  })
})



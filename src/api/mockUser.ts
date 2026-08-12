/**
 * 演示用内存 mock 接口层
 * 模拟真实后端:分页/搜索/增删改/批量/详情/导出,
 * 并刻意提供「普通响应 / 嵌套响应 / 业务失败」三种形态,用于演示 vue3-crud-hooks 的响应适配能力。
 */

export interface User {
  id: number
  name: string
  email: string
  status: 1 | 0
  role: 'admin' | 'user' | 'editor'
  createTime: string
  tags: string[]
}

export interface ListParams {
  pageNum?: number
  pageSize?: number
  keyword?: string
  status?: number
  [key: string]: any
}

const ROLES = ['admin', 'user', 'editor'] as const
const TAGS = ['前端', '后端', '测试', '运维', '设计', '产品']

/** 生成 50 条内存数据 */
const users: User[] = Array.from({ length: 50 }, (_, i) => {
  const id = i + 1
  return {
    id,
    name: `用户${String(id).padStart(2, '0')}`,
    email: `user${id}@demo.com`,
    status: id % 3 === 0 ? 0 : 1,
    role: ROLES[i % 3],
    createTime: `2025-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')} 10:00:00`,
    tags: TAGS.filter((_, t) => (i + t) % 3 === 0).slice(0, 2),
  }
})

let nextId = users.length + 1

/** 模拟网络延迟 */
const delay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms))

/** 按条件过滤列表 */
const filterUsers = (params: ListParams) => {
  const keyword = params.keyword?.trim()
  const status = params.status
  let list = users.filter((u) => {
    if (keyword && !u.name.includes(keyword) && !u.email.includes(keyword)) return false
    if (status !== undefined) {
      // 兼容列筛选(数组)与单值(status 为 1 | 0)
      const statusArr = Array.isArray(status) ? status.map(Number) : [Number(status)]
      if (!statusArr.includes(u.status)) return false
    }
    return true
  })
  // 服务端排序:orderByColumn / isAsc(RuoYi 风格,与 useTablePage 的 sortable 默认映射一致)
  if (params.orderByColumn && params.isAsc) {
    const key = params.orderByColumn as keyof User
    const dir = params.isAsc === 'asc' ? 1 : -1
    list = [...list].sort((a, b) => {
      const av = a[key]
      const bv = b[key]
      if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir
      return String(av).localeCompare(String(bv)) * dir
    })
  }
  return list
}

/** 分页切片 */
const pageSlice = (list: User[], params: ListParams) => {
  const pageNum = params.pageNum || 1
  const pageSize = params.pageSize || 10
  return { page: list.slice((pageNum - 1) * pageSize, pageNum * pageSize), total: list.length }
}

/**
 * 列表接口 —— 普通响应形态 { rows, total }
 */
export const fetchUserListPlain = async (params: ListParams) => {
  await delay()
  const matched = filterUsers(params)
  const { page, total } = pageSlice(matched, params)
  return { rows: page, total }
}

/**
 * 列表接口 —— 嵌套响应形态 { code, message, data: { records, total } }
 * 用于演示 useCrudPage/useTablePage 对嵌套包装的自动解析(isSuccess 识别 code=200)
 */
export const fetchUserListNested = async (params: ListParams) => {
  await delay()
  const matched = filterUsers(params)
  const { page, total } = pageSlice(matched, params)
  return { code: 200, message: 'ok', data: { records: page, total } }
}

/**
 * 列表接口 —— 业务失败形态(HTTP 层面 resolve,但业务 code=500)
 * 用于演示库的业务码校验:此时不会误报「成功」,而是展示后端 message
 */
export const fetchUserListFail = async (params: ListParams) => {
  await delay()
  if (params.keyword === 'fail') {
    return { code: 500, message: '查询失败:服务繁忙(业务码校验演示)' }
  }
  const matched = filterUsers(params)
  const { page, total } = pageSlice(matched, params)
  return { code: 200, message: 'ok', data: { records: page, total } }
}

/** 新增 */
export const addUser = async (data: Partial<User>) => {
  await delay(150)
  if (data.name === 'err') {
    return { code: 500, message: '新增失败:名称已存在(业务码校验演示)' }
  }
  users.unshift({
    id: nextId++,
    name: data.name || '未命名',
    email: data.email || '',
    status: data.status ?? 1,
    role: data.role || 'user',
    createTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
    tags: data.tags || [],
  })
  return { code: 200, message: '新增成功' }
}

/** 编辑 */
export const updateUser = async (data: Partial<User>) => {
  await delay(150)
  const idx = users.findIndex((u) => u.id === data.id)
  if (idx >= 0) {
    users[idx] = { ...users[idx], ...data } as User
  }
  return { code: 200, message: '更新成功' }
}

/** 删除 */
export const deleteUser = async (id: number) => {
  await delay(150)
  const idx = users.findIndex((u) => u.id === id)
  if (idx >= 0) users.splice(idx, 1)
  return { code: 200, message: '删除成功' }
}

/** 批量删除 */
export const batchDeleteUsers = async (ids: number[]) => {
  await delay(150)
  ids.forEach((id) => {
    const idx = users.findIndex((u) => u.id === id)
    if (idx >= 0) users.splice(idx, 1)
  })
  return { code: 200, message: `批量删除成功(共 ${ids.length} 条)` }
}

/** 详情(编辑回显) */
export const getUser = async (id: number) => {
  await delay(150)
  const user = users.find((u) => u.id === id)
  return { code: 200, data: user }
}

/** 导出(演示:仅打印参数,不真正下载) */
export const exportUsers = async (options: { params: any; filename: string }) => {
  await delay(150)
  console.log('[演示] 导出参数:', options.params, '文件名:', options.filename)
  return { code: 200, message: `导出成功:${options.filename}(演示)` }
}

/** 导出函数形式(供 useTablePage 的 exportFunction 使用) */
export const exportFunction = async (options: { params: any; filename: string }) => {
  await exportUsers(options)
}

/**
 * 列表接口 —— code=1 表示成功的后端 + 特殊结构 data.list
 * 用于演示自定义 isSuccess(自定义成功码)与 transformResponse(自定义解析)
 */
export const fetchUserListCode1 = async (params: ListParams) => {
  await delay()
  const matched = filterUsers(params)
  const { page, total } = pageSlice(matched, params)
  return { code: 1, message: 'ok', data: { list: page, total } }
}

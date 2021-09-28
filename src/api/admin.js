import axios from '@/libs/request'
import qs from 'qs'

// 获取用户列表
const getUserList = (params) => axios.get('/admin/users?' + qs.stringify(params))

// 更新用户信息
const updateUserById = (data) => axios.post('/admin/update-user', data)

// 批量更新用户
const updateUserBatchById = (data) => axios.post('/admin/update-user-settings', data)

// 删除用户信息
const deleteUserById = (ids) => axios.post('/admin/delete-user', { ids })

// 检查用户名是否重复
const checkUsername = (username) => axios.get('/admin/checkname?username=' + username)

// 检测昵称是否重复
const checkNickname = (nickname) => axios.get('/admin/check-nickname?nickname=' + nickname)

// 新增用户
const addUser = (data) => axios.post('/admin/add-user', data)

// 新增菜单
const addMenu = (data) => axios.post('/admin/add-menu', data)

// 获取菜单
const getMenu = () => axios.get('/admin/get-menu')

// 更新菜单
const updateMenu = (data) => axios.post('/admin/update-menu', data)

// 删除菜单
const deleteMenu = (data) => axios.post('/admin/delete-menu', data)

// 新增角色
const addRole = (data) => axios.post('/admin/add-role', data)

// 获取角色
const getRole = () => axios.get('/admin/get-role')

const getRoleNames = () => axios.get('/admin/get-roles-names')

// 更新角色
const updateRole = (data) => axios.post('/admin/update-role', data)

// 删除角色
const deleteRole = (data) => axios.post('/admin/delete-role', data)

const getStatData = () => axios.get('/admin/getstat')

// 获取评论信息
const getCommentsAll = (params) => axios.get('/admin/getComments', qs.stringify(params))

// 获取错误信息
const getErrorList = (params) => axios.get('/admin/get-error?' + qs.stringify(params))

// 删除错误信息
const deleteErrors = (data) => axios.post('/admin/delete-error', data)

export {
  getUserList,
  updateUserById,
  deleteUserById,
  checkUsername,
  addUser,
  checkNickname,
  updateUserBatchById,
  addMenu,
  getMenu,
  updateMenu,
  deleteMenu,
  addRole,
  getRole,
  updateRole,
  deleteRole,
  getRoleNames,
  getCommentsAll,
  getStatData,
  getErrorList,
  deleteErrors
}

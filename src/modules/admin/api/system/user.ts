import request from '@admin/utils/request'
import { Static } from 'vue'

class requests {
  static getUserList(params?) {
    return request({
      url: '/system/user/list',
      method: 'get',
      params
    })
  }
  // 根据字典类型查询字典数据信息
  static getDicts(type: string) {
    return request({
      url: '/system/dict/data/type/' + type,
      method: 'get'
    })
  }
  static getTreeData() {
    return request({
      url: '/system/user/deptTree',
      method: 'get'
    })
  }
  static getUserInfo(userId: string | number) {
    return request({
      url: '/system/user/' + userId,
      method: 'get'
    })
  }
  // 查询部门下拉树结构
  static treeselect() {
    return request({
      url: '/system/dept/treeselect',
      method: 'get'
    })
  }
  // 新增用户
  static add(data) {
    console.log(data);
    return request({
      url: '/system/user',
      method: 'post',
      data
    })
  }

  // 修改用户
  static edit(data) {
    return request({
      url: '/system/user',
      method: 'put',
      data: data
    })
  }

  // 删除用户
  static delUser(userId) {
    return request({
      url: '/system/user/' + userId,
      method: 'delete'
    })
  }

  // 用户密码重置
  static resetUserPwd(userId, password) {
    const data = { userId, password }
    return request({
      url: '/system/user/resetPwd',
      method: 'put',
      data: data
    })
  }

  // 用户状态修改
  static changeUserStatus(userId, status) {
    const data = { userId, status }
    return request({
      url: '/system/user/changeStatus',
      method: 'put',
      data: data
    })
  }
}

export default requests

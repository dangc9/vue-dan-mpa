import request from '@admin/utils/request'

class requests {
  // 查询菜单列表
  static listMenu(query?) {
    return request({
      url: '/system/menu/list',
      method: 'get',
      params: query
    })
  }

  // 查询菜单详细
  static getMenu(menuId) {
    return request({
      url: '/system/menu/' + menuId,
      method: 'get'
    })
  }

  // 查询菜单下拉树结构
  static treeselect() {
    return request({
      url: '/system/menu/treeselect',
      method: 'get'
    })
  }

  // 根据角色ID查询菜单下拉树结构
  static roleMenuTreeselect(roleId) {
    return request({
      url: '/system/menu/roleMenuTreeselect/' + roleId,
      method: 'get'
    })
  }

  // 新增菜单
  static addMenu(data) {
    return request({
      url: '/system/menu',
      method: 'post',
      data: data
    })
  }

  // 修改菜单
  static updateMenu(data) {
    return request({
      url: '/system/menu',
      method: 'put',
      data: data
    })
  }

  // 删除菜单
  static delMenu(menuId) {
    return request({
      url: '/system/menu/' + menuId,
      method: 'delete'
    })
  }
}

export default requests

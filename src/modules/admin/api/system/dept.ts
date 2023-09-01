import request from '@admin/utils/request'

class requests {
  // 查询部门列表
  static listDept(query?: object): Promise<any> {
    return request({
      url: '/system/dept/list',
      method: 'get',
      params: query
    })
  }

  // 查询部门列表（排除节点）
  static listDeptExcludeChild(deptId: number | string): Promise<any> {
    return request({
      url: '/system/dept/list/exclude/' + deptId,
      method: 'get'
    })
  }

  // 查询部门详细
  static getDept(deptId: number | string): Promise<any> {
    return request({
      url: '/system/dept/detail/' + deptId,
      method: 'get'
    })
  }

  // 新增部门
  static addDept(data: object): Promise<any> {
    return request({
      url: '/system/dept',
      method: 'post',
      data: data
    })
  }

  // 修改部门
  static updateDept(data: object): Promise<any> {
    return request({
      url: '/system/dept',
      method: 'put',
      data: data
    })
  }

  // 删除部门
  static delDept(deptId: number | string): Promise<any> {
    return request({
      url: '/system/dept/' + deptId,
      method: 'delete'
    })
  }
}

export default requests

import request from '@admin/utils/request'

class requests {
  // 查询操作日志列表
  static operlist(query) {
    return request({
      url: '/monitor/operlog/list',
      method: 'get',
      params: query
    })
  }

  // 删除操作日志
  static delOperlog(operId) {
    return request({
      url: '/monitor/operlog/' + operId,
      method: 'delete'
    })
  }

  // 清空操作日志
  static cleanOperlog() {
    return request({
      url: '/monitor/operlog/clean',
      method: 'delete'
    })
  }

  // 查询登录日志列表
  static loginlist(query) {
    return request({
      url: '/monitor/logininfor/list',
      method: 'get',
      params: query
    })
  }

  // 删除登录日志
  static delLogininfor(infoId) {
    return request({
      url: '/monitor/logininfor/' + infoId,
      method: 'delete'
    })
  }

  // 解锁用户登录状态
  static unlockLogininfor(userName) {
    return request({
      url: '/monitor/logininfor/unlock/' + userName,
      method: 'get'
    })
  }

  // 清空登录日志
  static cleanLogininfor() {
    return request({
      url: '/monitor/logininfor/clean',
      method: 'delete'
    })
  }

}

export default requests

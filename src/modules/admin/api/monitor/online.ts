import request from '@admin/utils/request'

class requests {
  // 查询在线用户列表
  static list(query?: object) {
    return request({
      url: '/monitor/online/list',
      method: 'get',
      params: query
    })
  }

  // 强退用户
  static forceLogout(tokenId?: string | number) {
    return request({
      url: '/monitor/online/' + tokenId,
      method: 'delete'
    })
  }

}

export default requests

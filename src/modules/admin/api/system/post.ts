import request from '@admin/utils/request'

class requests {
  // 查询岗位列表
  static listPost(query: object) {
    return request({
      url: '/system/post/list',
      method: 'get',
      params: query
    })
  }

  // 查询岗位详细
  static getPost(postId: number) {
    return request({
      url: '/system/post/' + postId,
      method: 'get'
    })
  }

  // 新增岗位
  static addPost(data: object) {
    return request({
      url: '/system/post',
      method: 'post',
      data: data
    })
  }

  // 修改岗位
  static updatePost(data: object) {
    return request({
      url: '/system/post',
      method: 'put',
      data: data
    })
  }

  // 删除岗位
  static delPost(postId: number) {
    return request({
      url: '/system/post/' + postId,
      method: 'delete'
    })
  }
}

export default requests

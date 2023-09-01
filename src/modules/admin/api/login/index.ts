import request from '@admin/utils/request'

class requests {
  static getCodeImg() {
    return request({
      url: '/captchaImage',
      method: 'get'
    })
  }
  static login(data) {
    return  request({
      url: '/login',
      method: 'post',
      data: data
    })
  }
  static getInfo(params?) {
    return request({
      url: `/getInfo`,
      method: 'get',
      params
    })
  }
  static logout() {
    return request({
      url: '/logout',
      method: 'post'
    })
  }
  static getRouters() {
    return request({
      url: `/getRouters`,
      method: 'get',
    })
  }
}

export default requests

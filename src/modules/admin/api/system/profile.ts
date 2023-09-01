import request from '@admin/utils/request'

class requests {
  // 查询用户个人信息
  static getUserProfile() {
    return request({
      url: '/system/user/profile',
      method: 'get'
    })
  }

  // 修改用户个人信息
  static updateUserProfile(data) {
    return request({
      url: '/system/user/profile',
      method: 'put',
      data: data
    })
  }

  // 用户密码重置
  static updateUserPwd(oldPassword, newPassword) {
    const data = {
      oldPassword,
      newPassword
    }
    return request({
      url: '/system/user/profile/updatePwd',
      method: 'put',
      params: data
    })
  }
  // 用户头像上传
  static uploadAvatar(data) {
    return request({
      url: '/system/user/profile/avatar',
      method: 'post',
      data: data
    })
  }
}

export default requests

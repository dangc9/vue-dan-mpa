import request from '@admin/utils/request'

class requests {
  static getList(params) {
    return request.request({
      url: `/flowable/node/user/list`,
      method: "GET",
      params
    });
  }
  static getFlowList(params) {
    return request.request({
      url: `/flowable/node/user/list/flow`,
      method: "GET",
      params
    });
  }
  static getFlowNodeList(id) {
    return request.request({
      url: `/flowable/node/user/list/node/${id}`,
      method: "GET"
    });
  }
  static getNodeUserDetail(id) {
    return request.request({
      url: `/flowable/node/user/detail/${id}`,
      method: "GET"
    });
  }
  static nodeUserDelete(id) {
    return request.request({
      url: `/flowable/node/user/delete/${id}`,
      method: "POST"
    });
  }
  static nodeUserUpdate(data) {
    return request.request({
      url: `/flowable/node/user/update`,
      method: "POST",
      data
    });
  }
  static nodeUserAdd(data) {
    return request.request({
      url: `/flowable/node/user/add`,
      method: "POST",
      data
    });
  }


  static setVersion(params) {
    return request.request({
      url: `/flowable/node/user/setVersion`,
      method: "POST",
      params
    });
  }
  static copyVersion(params) {
    return request.request({
      url: `/flowable/node/user/copyVersion`,
      method: "POST",
      params
    });
  }
}
export default requests;
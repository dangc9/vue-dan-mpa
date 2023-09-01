import request from '@admin/utils/request'

class requests {
  static getList(params) {
    return request.request({
      url: `/flowable/editor/list`,
      method: "GET",
      params
    });
  }
  static getFlowXML(id) {
    return request.request({
      url: `/flowable/editor/detail/${id}`,
      method: "GET"
    });
  }
  static editorAdd(data) {
    return request.request({
      url: `/flowable/editor/add`,
      method: "POST",
      data
    });
  }
  static editorUpdate(data) {
    return request.request({
      url: `/flowable/editor/update`,
      method: "POST",
      data
    });
  }
  static editorDeploy(id) {
    return request.request({
      url: `/flowable/editor/deploy/${id}`,
      method: "POST"
    });
  }
  static editorDelete(id) {
    return request.request({
      url: `/flowable/editor/delete/${id}`,
      method: "POST"
    });
  }
  static getRoleList(params) {
    return request.request({
      url: `/flowable/editor/roleList`,
      method: "GET",
      params
    });
  }
  static getUserList(params) {
    return request.request({
      url: `/flowable/editor/userList`,
      method: "GET",
      params
    });
  }
}
export default requests;
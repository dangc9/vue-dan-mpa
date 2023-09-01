import request from '@admin/utils/request'

class requests {
  static getList(params) {
    return request.request({
      url: `/flowable/definition/list`,
      method: "GET",
      params
    });
  }
  static flowDelete(id) {
    return request.request({
      url: `/flowable/definition/delete/${id}`,
      method: "POST"
    });
  }
  static flowUpdate(id) {
    return request.request({
      url: `/flowable/definition/update/${id}`,
      method: "POST"
    });
  }
  static flowReadImage(id) {
    return request.request({
      url: `/flowable/definition/readImage/${id}`,
      method: "GET"
    });
  }
  static(id) {
    return request.request({
      url: `/flowable/definition/readXml/${id}`,
      method: "GET"
    });
  }
}
export default requests;
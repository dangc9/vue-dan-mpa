import request from '@admin/utils/request'

class requests {
  /* 流程历史 */
  static getFlowHistory(id: string | number) {
    return request({
      url: `/flowable/task/flowRecord?procInsId=${id}`,
      method: 'get',
    })
  }
}


export default requests

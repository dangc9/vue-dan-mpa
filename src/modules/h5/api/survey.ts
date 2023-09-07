import request from '@admin/utils/request/common'

class requests {
  static getDetail(id: string | number) {
    return request({
      url: `/h5/survey/surveyDetail/${id}`,
      method: 'get',
    })
  }
  static answer(data: object) {
    return request({
      url: `/h5/survey/answerSurvey`,
      method: 'post',
      data
    })
  }
}


export default requests

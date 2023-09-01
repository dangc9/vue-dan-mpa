import request from '@admin/utils/request'

class requests {
  // 查询定时任务调度列表
  static listJob(query) {
    return request({
      url: '/monitor/job/list',
      method: 'get',
      params: query
    })
  }

  // 查询定时任务调度详细
  static getJob(jobId) {
    return request({
      url: '/monitor/job/' + jobId,
      method: 'get'
    })
  }

  // 新增定时任务调度
  static addJob(data) {
    return request({
      url: '/monitor/job',
      method: 'post',
      data: data
    })
  }

  // 修改定时任务调度
  static updateJob(data) {
    return request({
      url: '/monitor/job',
      method: 'put',
      data: data
    })
  }

  // 删除定时任务调度
  static delJob(jobId) {
    return request({
      url: '/monitor/job/' + jobId,
      method: 'delete'
    })
  }

  // 任务状态修改
  static changeJobStatus(jobId, status) {
    const data = {
      jobId,
      status
    }
    return request({
      url: '/monitor/job/changeStatus',
      method: 'put',
      data: data
    })
  }


  // 定时任务立即执行一次
  static runJob(jobId, jobGroup) {
    const data = {
      jobId,
      jobGroup
    }
    return request({
      url: '/monitor/job/run',
      method: 'put',
      data: data
    })
  }

  // 查询调度日志列表
  static listJobLog(query) {
    return request({
      url: '/monitor/jobLog/list',
      method: 'get',
      params: query
    })
  }

  // 删除调度日志
  static delJobLog(jobLogId) {
    return request({
      url: '/monitor/jobLog/' + jobLogId,
      method: 'delete'
    })
  }

  // 清空调度日志
  static cleanJobLog() {
    return request({
      url: '/monitor/jobLog/clean',
      method: 'delete'
    })
  }

}

export default requests

import request from '@admin/utils/request'

class requests {
  // 查询字典类型列表
  static listType(query) {
    return request({
      url: '/system/dict/type/list',
      method: 'get',
      params: query
    })
  }

  // 查询字典类型详细
  static getType(dictId) {
    return request({
      url: '/system/dict/type/' + dictId,
      method: 'get'
    })
  }

  // 新增字典类型
  static addType(data) {
    return request({
      url: '/system/dict/type',
      method: 'post',
      data: data
    })
  }

  // 修改字典类型
  static updateType(data) {
    return request({
      url: '/system/dict/type',
      method: 'put',
      data: data
    })
  }

  // 删除字典类型
  static delType(dictId) {
    return request({
      url: '/system/dict/type/' + dictId,
      method: 'delete'
    })
  }

  // 刷新字典缓存
  static refreshCache() {
    return request({
      url: '/system/dict/type/refreshCache',
      method: 'delete'
    })
  }

  // 获取字典选择框列表
  static optionselect() {
    return request({
      url: '/system/dict/type/optionselect',
      method: 'get'
    })
  }

  /* 字典数据 */
  // 查询字典数据列表
  static listData(query) {
    return request({
      url: '/system/dict/data/list',
      method: 'get',
      params: query
    })
  }

  // 查询字典数据详细
  static getData(dictCode) {
    return request({
      url: '/system/dict/data/' + dictCode,
      method: 'get'
    })
  }

  // 根据字典类型查询字典数据信息
  static getDicts(dictType) {
    return request({
      url: '/system/dict/data/type/' + dictType,
      method: 'get'
    })
  }

  // 新增字典数据
  static addData(data) {
    return request({
      url: '/system/dict/data',
      method: 'post',
      data: data
    })
  }

  // 修改字典数据
  static updateData(data) {
    return request({
      url: '/system/dict/data',
      method: 'put',
      data: data
    })
  }

  // 删除字典数据
  static delData(dictCode) {
    return request({
      url: '/system/dict/data/' + dictCode,
      method: 'delete'
    })
  }
}

export default requests

import axios, { AxiosError, AxiosRequestConfig } from 'axios'
import errorCode from '@admin/utils/request/errorCode'
import { ElMessage, ElNotification } from "element-plus";

declare module "axios" {
  interface AxiosInstance {
    (config: AxiosRequestConfig): Promise<any>;
  }
}

// 创建axios实例 进行基本参数配置
const service = axios.create({
  baseURL: import.meta.env.VITE_BASE_API,
  timeout: 3000000,
  withCredentials: true
})

//  request interceptor 接口请求拦截
service.interceptors.request.use((config: AxiosRequestConfig) => {
  if (config.method === 'get') {
    config.params = {
      timestamp: new Date().getTime(),
      ...config.params
    }
  }
  return config
}, (error: AxiosError) => {
  return Promise.reject(error);
})

//  response interceptor 接口响应拦截
service.interceptors.response.use((res) => {
  // 未设置状态码则默认成功状态
  const code = res.data.code || 200;

  // 获取错误信息
  const msg = errorCode[code] || res.data.msg || errorCode['default']
  // 二进制数据则直接返回
  if (res.request.responseType ===  'blob' || res.request.responseType ===  'arraybuffer') {
    return res.data
  }
  if (code === 401) {
    return Promise.reject('无效的会话，或者会话已过期，请重新登录。')
  } else if (code === 500) {
    ElMessage({ message: msg, type: 'error' })
    return Promise.reject(new Error(msg))
  } else if (code === 601) {
    ElMessage({ message: msg, type: 'warning' })
    return Promise.reject(new Error(msg))
  } else if (code !== 200) {
    ElNotification.error({ title: msg })
    return Promise.reject('error')
  } else {
    return  Promise.resolve(res.data)
  }
}, 
(error: AxiosError) => {
  let { message } = error;
  if (message == "Network Error") {
    message = "后端接口连接异常";
  }
  else if (message.includes("timeout")) {
    message = "系统接口请求超时";
  }
  else if (message.includes("Request failed with status code")) {
    message = "系统接口" + message.substr(message.length - 3) + "异常";
  }
  showErrMessage(message)
  return Promise.reject(error)
})


/**
 * @description 显示错误消息
 * message 错误信息
 * type 消息类型
 * duration 消息持续时间
 */
function showErrMessage(message: string, type: any = 'error', duration: number = 3000) {
  ElMessage({
    message,
    type: type,
    duration: duration
  })
}

export default service

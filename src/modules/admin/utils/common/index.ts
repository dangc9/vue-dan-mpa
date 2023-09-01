

import NProgress from 'nprogress'
import { setUrlQuery } from '@admin/utils'
import { getToken } from '@admin/utils/auth'
import router from '@admin/routers/index'
import request from '@admin/utils/request'
import { useTagsViewStore } from '@admin/store/modules/tagsView'
const baseURL = import.meta.env.VITE_BASE_API

// 处理上传附件的下载方法
export function downloadFile(val: any, name?: string, download?: Boolean)  {
  const id = val?.id || val
  const fileName = val?.name || name
  if(!id) return
  const url = `${baseURL}/system/file/download/${id}`
  console.log(url);
  const type = fileName?.split('.')?.pop()
  const previewType = ['jpg', 'jpeg', 'png', 'PNG']
  // if(!download && previewType.includes(type)) {
  //   const url = setUrlQuery(`/download/${id}`, { fileName })
  //   window.open(url)
  //   return
  // }
  const xhr = new XMLHttpRequest();
  xhr.open("get", url, true);
  xhr.responseType = "blob";
  xhr.setRequestHeader("Authorization", 'Bearer ' + getToken()); // token键值对
  xhr.onload = function() {
    if (this.status == 200) {
      console.log(this.response);
      var blob = this.response;
      var a = document.createElement("a")
      var url = window.URL.createObjectURL(blob)
      a.href = url
      a.download = fileName || "未命名"
    }
    a.click()
    window.URL.revokeObjectURL(url)
  }
  xhr.send();
}

// 导出excel
export function handleExport(url: string, params: object, type?: string) {
  console.log(url);
  const option: any = {
    url,
    method: type || "GET",
  }
  if(!type || type === 'GET') {
    option.params = params
  }else {
    option.data = params
  }
  NProgress.start()
  request.request(option).then(res => {

    // download(res.msg)
    downloadFile
    NProgress.done()
  }).catch(() => {
    NProgress.done()
  })
}

// 通用下载方法
export function download(fileName: string) {
  const url = baseURL + "/common/download?fileName=" + encodeURI(fileName) + "&delete=" + true;
  const xhr = new XMLHttpRequest();
  xhr.open("get", url, true);
  xhr.responseType = "blob";
  xhr.setRequestHeader("Authorization", 'Bearer ' + getToken()); // token键值对
  xhr.onload = function() {
    if (this.status == 200) {
      console.log(this.response);
      var blob = this.response;
      var a = document.createElement("a")
      var url = window.URL.createObjectURL(blob)
      a.href = url
      a.download = fileName || "未命名"
    }
    a.click()
    window.URL.revokeObjectURL(url)
  }
  xhr.send();
  // downloadFile(url)
	// window.location.href = baseURL + "/common/download?fileName=" + encodeURI(fileName) + "&delete=" + true;
}

// 跳转到指定router路径，没有就跳到首页
export function goPage(path: string, newPage?: boolean) {
  const {delView } = useTagsViewStore()
  const currentPath = router.currentRoute.value.path
  !newPage && delView(currentPath)
  const routes = router.getRoutes() || []
  router.push(routes.find(item => item.path === path) ? path :'/home')
}

// 复制文本到剪切板
export const copyToClipboard = (text: string) => {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
}
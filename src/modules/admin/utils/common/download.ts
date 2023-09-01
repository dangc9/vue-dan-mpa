import service from '@admin/utils/request'
import { ElLoading, ElMessage } from 'element-plus'
import { blobValidate, tansParams } from '@admin/utils/index'
import errorCode from '@admin/utils/request/errorCode'
import FileSaver from 'file-saver';

let downloadLoadingInstance;
// 通用下载方法
function download(url, params, filename, config?) {
  downloadLoadingInstance = ElLoading.service({ text: "正在下载数据，请稍候", background: "rgba(0, 0, 0, 0.7)", })
  return service.post(url, params, {
    transformRequest: [(params) => { return tansParams(params) }],
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    responseType: 'blob',
    ...config
  }).then(async (data: any) => {
    const isBlob = blobValidate(data);
    if (isBlob) {
      const blob = new Blob([data])
      FileSaver.saveAs(blob, filename)
    } else {
      const resText = await data.text();
      const rspObj = JSON.parse(resText);
      const errMsg = errorCode[rspObj.code] || rspObj.msg || errorCode['default']
      ElMessage.error(errMsg);
    }
    downloadLoadingInstance.close();
  }).catch((r) => {
    ElMessage.error('下载文件出现错误，请联系管理员！')
    downloadLoadingInstance.close();
  })
}
export default download
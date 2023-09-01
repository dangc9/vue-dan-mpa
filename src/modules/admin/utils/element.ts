import { ElLoading } from 'element-plus'
import {
  Loading
} from '@element-plus/icons-vue'
let loading = null

export const openLoading = (options: any = {}) => {
  const text = options.text || '加载中'
  loading = ElLoading.service({
    lock: true,
    text: text,
  })
}
export const closeLoading = () => {
  loading && loading.close()
}

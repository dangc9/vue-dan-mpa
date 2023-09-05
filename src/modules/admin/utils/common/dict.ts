import useDictStore from '@admin/store/modules/dict'
import request from '@admin/api/system/user'
import { ref, toRefs } from 'vue'
/**
 * 获取字典数据
 */
export function useDict(...args: string[]) {
  const res = ref({});
  return (() => {
    args.forEach(type => {
      res.value[type] = [];
      const dicts = useDictStore().getDict(type);
      if (dicts) {
        res.value[type] = dicts;
      } else {
        request.getDicts(type).then(resp => {
          res.value[type] = resp.data?.map(p => ({ 
            label: p.dictLabel, 
            value: p.dictValue === 'undefined' ? undefined : p.dictValue, 
            elTagType: p.listClass, 
            elTagClass: p.cssClass 
          }))
          useDictStore().setDict(type, res.value[type]);
        })
      }
    })
    return toRefs<any>(res.value);
  })()
}
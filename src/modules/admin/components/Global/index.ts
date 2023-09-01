import { App } from 'vue'
import dtable from './common/table/dTable.vue'
import dDatePicker from './common/datePicker/dDatePicker.vue'
import dIconSelect from './common/IconSelect/index.vue'
import dUpload from './common/upload/dUpload.vue'
import dSelectUser from './content/selectUser/dSelectUser.vue'
import flowHistory from './content/flowHistory/index.vue'
import dApprove from './content/approve/dApprove.vue'

export default (app: App ) => {
  app.component('dTable', dtable)
  app.component('dDatePicker', dDatePicker)
  app.component('dIconSelect', dIconSelect)
  app.component('dSelectUser', dSelectUser)
  app.component('flowHistory', flowHistory)
  app.component('dUpload', dUpload)
  app.component('dApprove', dApprove)
}
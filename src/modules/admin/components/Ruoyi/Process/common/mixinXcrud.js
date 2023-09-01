// import xcrud from 'xcrud'
// import golbalConfig from 'xcrud/package/common/config'



import xcrud from '../package/index.js'
import golbalConfig from '../package/common/config.js'
console.log(xcrud);
golbalConfig.set({
  input: {
    // size: 'mini'
  },
  select: {
    // size: 'mini'
  },
  colorPicker: {
    showAlpha: true
  },
  xform: {
    form: {
      labelWidth: 'auto'
      // size: 'mini'
    }
  }
})

export default {
  components: { xForm: xcrud.xForm }
  
}

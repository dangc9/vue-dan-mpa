// 表单验证文件

// 是否11位数字手机号
export function isvalidPhone(str) {
  const reg = /^1\d{10}$/
  return reg.test(str)
}


export /**
 * element form 手机号验证模板
 *
 * @param {*} rule
 * @param {*} value   表单value
 * @param {*} callback
 */
const validPhone = (rule, value,callback)=>{
  if (!value){
    callback(new Error('请输入联系电话！'))
  }else  if (!isvalidPhone(value)){
    callback(new Error('请输入正确的11位手机号码！'))
  }else {
    callback()
  }
}

export /**
 * element form 校验正数
 *
 * @param {*} rule
 * @param {*} value   表单value
 * @param {*} callback
 */
const validNumber = (rule, value,callback)=>{
  const val = +value
  if(!value) {
    callback()
  }else if(val !== +val) {
    callback(new Error('请填写数字！'))
  }
  else if (value < 0){
    callback(new Error('请填写大于0的数字！'))
  }else {
    callback()
  }
}

export const validNum = (rule, value,callback)=>{
  const val = +value
  if(!value) {
    callback()
  }else if(val !== +val) {
    callback(new Error('请填写数字！'))
  }else {
    callback()
  }
}

export /**
 * element form 校验非负整数
 *
 * @param {*} rule
 * @param {*} value   表单value
 * @param {*} callback
 */
const validNaturalNumber = (rule, value,callback)=>{
  if(!value) {
    callback()
  } else if( !/^(0|[1-9][0-9]*)$/.test(value)) {
    callback('请填写整数')
  }else {
    callback()
  }
}

export
/**
 * element form 校验字符串是否是JSON格式
 *
 * @param {*} rule
 * @param {*} value
 * @param {*} callback
 */
const validJSON = (rule, value, callback) => {
  console.log(value);
  console.log(isJSON(value));
  if(isJSON(value)) {
    callback()
  }else {
    callback(new Error('请填写正确的JSON格式！'))
  }
}
function isJSON(str) {
  if (typeof str === 'string') {
    try {
      const obj = JSON.parse(str)
      if( obj  && typeof obj == 'object'){
        return true;
      }else{
        return false;
      }
    } catch (e) {
      return false
    }
  }else {
    return false
  }
}

export /**
 * element form 校验输入最大字符500
 *
 * @param {*} rule
 * @param {*} value   表单value
 * @param {*} callback
 */
const validMax500 = (rule, value,callback)=>{
  if (value.length > 500){
    callback(new Error('输入长度不能超过500！'))
  }else {
    callback()
  }
}
export /**
 * element form 校验最大字符50
 *
 * @param {*} rule
 * @param {*} value   表单value
 * @param {*} callback
 */
const validMax50 = (rule, value,callback)=>{
  if (value.length > 50){
    callback(new Error('输入长度不能超过50！'))
  }else {
    callback()
  }
}

export /**
 * element form 校验最大字符50
 *
 * @param {*} rule
 * @param {*} value   表单value
 * @param {*} callback
 */
const validLength = (length) => {
  return {
    validator: (rule, value,callback)=>{
      if(!value) {
        callback()
      }else if (value.length > length){
        callback(new Error(` 超出限制！(${value.length}/${length})`))
      }else {
        callback()
      }
    }
  }
}

export /**
* element form 校验输入最大值
*
* @param {*} rule
* @param {*} value   表单value
* @param {*} callback
*/
const ValidMaxNumber = (max) => {
  return {
    validator: (rule, value,callback)=>{
      const val = parseFloat(value)
      if(!value) {
        callback()
      }else if (!isNaN(val) && val > max){
        callback(new Error(`输入最大值不超过${max}`))
      }else {
        callback()
      }
    }
  }
}

export /**
* element form 校验输入最大保留小数位decimalPlaces
* @param {*} rule
* @param {*} value   表单value
* @param {*} callback
*/
const validDecimal = (decimalPlaces) => {
  let pattern = new RegExp(`^\\d+(\\.\\d{0,${decimalPlaces}})?$`);
  return {
    validator: (rule, value,callback)=>{
      const val = parseFloat(value)
      if(!value) {
        callback()
      }else if (!isNaN(val) && !pattern.test(value)){
        const decimal = value?.split('.')[1]
        callback(new Error(`输入值最多保留${decimalPlaces}位小数! (${decimal?.length}/${decimalPlaces})`))
      }else {
        callback()
      }
    }
  }
}

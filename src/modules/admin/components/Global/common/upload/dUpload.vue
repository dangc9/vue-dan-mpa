<script setup lang="ts">
  import { getToken } from '@admin/utils/auth'
  import { computed, ref, watch, inject, reactive, toRefs } from 'vue'
  import type { UploadInstance, UploadRawFile, UploadProps, UploadUserFile } from 'element-plus'
  import { ElMessage, genFileId  } from 'element-plus'
  import { downloadFile } from '@admin/utils/common'

  const emit = defineEmits(['update:modelValue','change','input'])
  const elForm = inject('elForm') as any
  let props = defineProps({
    modelValue: [ Array, Object, String, Number],
    // 使v-model绑定一个对象,  仅在limit为1时有效
    object: {
      type: Boolean,
      default: () => false
    },
    // 附件列表初始化
    fileList: {
      type: Array,
      default: () => []
    },
    // 使v-model绑定一个字符串的(用户的id)
    string: {
      type: Boolean,
      default: false,
    },
    // v-model绑定字符串时, 对应的userNameList(为了在初始化时, 展示已选择的用户名称。 需要用.sync符)
    nameList: {
      type: String,
      default: '',
    },
    // v-model绑定字符串时, id和name的分隔符
    separator: {
      type: String,
      default: ','
    },
    // 附件上传个数限制
    limit: {
      type: Number,
      default: () =>  10000
    },
    // 上传地址
    action: {
      type: String,
      default: () => `${import.meta.env.VITE_BASE_API}/system/file/upload`
    },
    headers: {
      type: Object,
      default: () => {
        return { 'Authorization': 'Bearer ' + getToken() }
      }
    },
    // 上传返回response的附件名称的路径( 同urlTemplate参数：默认后端activity浏览框架附件接口)
    fileNamePath: {
      type: String,
      default: () =>  'data.name'
    },
    // 拼接附件下载url的字符串模板(如果附件对象有url属性，则不拼接)
    urlTemplate: {
      type: String,
      default: () =>  '/portal/synthesize/patentflow/attachment/preview/${id}?origin=${origin}&token=${token}'
    },
    // 附件大小限制(MB)
    size: {
      type: Number,
      default: () =>  20
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: () => false
    },
  })

  const dUploadRef = ref<UploadInstance>()
  const values = reactive<any>({
    valueList: [],
  })
  const { valueList } = toRefs(values)



  const isValueObject = computed(() => {
    return Object.prototype.toString.call(valueList.value) === "[object Object]"
  })
  const fileInfoPath = computed(() => {
    const array = props.fileNamePath.split(".")
    array.pop()
    return array
  })
  const fileNameKey = computed(() => {
    return props.fileNamePath.split(".").pop() || "name"
  })
  const isDisabled = computed(() => {
    return props.disabled || (elForm || {}).disabled;
  })
  watch(() => props.modelValue, (val) => {
    if(Array.isArray(val)) {
      valueList.value = val
    }
    if(Object.prototype.toString.call(val) === '[object Object]') {
      valueList.value = [val]
    }
  }, { immediate: true })

  watch(valueList, (val) => {
    if(isDisabled.value) return 
    const data = getModelValue(val)
    emit('update:modelValue', data );
    emit('change', data );
    emit('input', data );
    // this.$parent.$emit("el.form.change");
  }, { immediate: true , deep: true})

  // 根据类型生成组件绑定的值
  function getModelValue(val) {
    console.log(val);
    if(!val) return
    if(props.limit === 1 && props.object) {
      return val[0]
    }
    return val
  }

  const handleExceed: UploadProps['onExceed'] = (files) => {
    // dUploadRef.value!.clearFiles()
    // const file = files[0] as UploadRawFile
    // file.uid = genFileId()
    // dUploadRef.value!.handleStart(file)
    ElMessage.warning(`当前只能上传${props.limit}个文件，请删除后重新上传！`);
  }
  const handlePreview: UploadProps['onPreview'] = (uploadFile) => {
    downloadFile(uploadFile)
  }
  const handleRemove= (file, fileList: UploadUserFile[]) => {
    console.log(file);
    console.log(fileList);
    console.log(file.status);
    if (file.status==="success") {
      console.log(1);
      const index = fileList.findIndex(item => item.uid === file.uid)
      fileList.splice(index, 1)
      isValueObject.value && props.limit === 1 ? (valueList.value = {}) : valueList.value.splice(index, 1);
    }
  }
  function handleSuccess(res, file, fileList: UploadUserFile[]) {
    if(props.limit > 1 && isValueObject.value) {
      console.warn("如果上传多个附件,请绑定一个数组！")
      return
    }
    if (res.code === 200) {
      let data = res
      fileInfoPath.value.forEach(key => { data = data?.[key] || '' })
      if(!data) return
      isValueObject.value && props.limit === 1 ? (valueList.value = data) : valueList.value.push(data);
    } else {
      fileList.pop()
    }
  }
  function  handleUrlTemplate(item) {
    let hasResult = true
    let args = /\$\{(.+?)\}/g
    const result = this.urlTemplate.replace(args, function(){
      !item[arguments[1]] &&  (hasResult = false )
      return item[arguments[1]]
    })
    return hasResult && result
  }
</script>

<template>
  <el-upload
    ref="dUploadRef"
    class="d-upload"
    :action="action"
    :headers="headers"
    :limit="limit"
    :disabled="disabled"
    :file-list="valueList"
    :class="{'one-upload-disabled': isDisabled}"
    :on-exceed="handleExceed"
    :on-remove="handleRemove"
    :on-success="handleSuccess"
    :on-preview="handlePreview"
    v-bind="$attrs"
    v-on="$listeners">
    <el-button size="mini" type="primary" v-if="!$slots.default && !isDisabled" :disabled="isDisabled">点击上传</el-button>
    <slot/>
  </el-upload>
  <div class="d-none-file" v-if="isDisabled && valueList.length === 0">无附件</div>
</template>

<style lang="scss" scoped>
  .d-upload {
    width: 100%;
  }
  .d-none-file {
    font-size: 12px;
    line-height: 28px;
    color: var(--el-color-info);
  }
  .one-upload-disabled {
    :deep(.el-upload--text) {
      display: none;
    }
    :deep(.el-upload-list) {
      margin-top: 2px;
    }
  }
</style>
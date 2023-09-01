<script lang="ts" setup>
// 引入 wangEditor
import { DomEditor } from '@wangeditor/editor'
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { ElMessage } from "element-plus";
import { getToken } from '@admin/utils/auth'
import { onBeforeUnmount, onMounted, watch, shallowRef, ref, computed, nextTick } from 'vue'

type InsertFnType = (url: string, alt?: string, href?: string) => void

let editors = null
// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()
const toolbarConfig = {
  excludeKeys: ['todo', 'insertImage', "group-video", "codeBlock", "bgColor", "emotion", "bulletedList", "numberedList"]
}
const editorConfig: any = {
  placeholder: '请输入内容...',
  MENU_CONF: {
    uploadImage: {
      // 自定义上传
      async customUpload(file: File, insertFn: InsertFnType) { 
        var xhr = new XMLHttpRequest();
        xhr.open('POST', `${import.meta.env.VITE_BASE_API}/system/file/upload/url`, true);
        xhr.setRequestHeader('Authorization', 'Bearer ' + getToken());
        xhr.onload = function() {
          if (xhr.status === 200) {
            // 图片上传成功
            const res = JSON.parse(xhr.responseText);
            console.log(res.msg);
            const url = import.meta.env.VITE_BASE_API + res.msg
            insertFn(url)
          } else {
            ElMessage.error('上传失败');
          }
        };
        var formData = new FormData();
        formData.append('file', file);
        xhr.send(formData);
      }
    }
  }
}

// 内容 HTML
const mode = ref('default')
let emit = defineEmits(['update:modelValue'])
let props = defineProps({
  modelValue: String,
})

const getEditorData = () => {
  // 通过代码获取编辑器内容
  let data = editors.txt.html()
  alert(data)
}

const handleCreated = (editor) => {
  editorRef.value = editor // editor 实例
  // nextTick(() => {
  //   const toolbar = DomEditor.getToolbar(editor)
  //   const curToolbarConfig = toolbar.getConfig()
  //   console.log( curToolbarConfig.toolbarKeys ) // 当前菜单排序和分组
  // })
}

const valueHtml = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    // 防止富文本内容为空时，校验失败
    if (editorRef.value.isEmpty()) val = "";
    emit('update:modelValue', val)
  }
})

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  // 调用销毁 API 对当前编辑器实例进行销毁
  const editor = editorRef.value
  if (editor == null) {
    return
  }
  editor.destroy()
})
</script>

<template>
  <div class="m-wangEditor">
    <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig" :mode="mode" />
    <Editor style="min-height: 300px" v-model="valueHtml" :defaultConfig="editorConfig" :mode="mode" @onCreated="handleCreated" />
  </div>
</template>

<style lang="scss" scoped>
.m-wangEditor {
  z-index: 99;
  width: 100%;
  border: 1px solid #cccccc;
  :deep(.w-e-text-placeholder) {
    top: 8px
  }
}
</style>

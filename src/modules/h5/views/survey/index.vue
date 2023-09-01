<script lang="ts" setup>
import { ref, reactive, toRefs } from 'vue'
import to from 'await-to-js'
import { useRoute } from 'vue-router'
import request from '@h5/api/survey'

const isDark = ref(false)
localStorage.getItem('isDark') === 'true' && changeTheme()
const route = useRoute()
const currentId = route.params.id as string
const formRef = ref()
const isLoading = ref(true)
const isSubmitLoading = ref(false)
const isSuccess = ref(false)
const data = reactive({
  option: {
    questionList: [],
  },
})
const { option } = toRefs<any>(data);

const getModel = (type: string) => {
  const data = [
    { value: 'SINGLE', tip: '单选', key: 'optionAnswer', validateLabel: '请选择'},
    { value: 'MULTI', tip: '多选', key: 'optionAnswer', validateLabel: '请选择'},
    { value: 'FILLBLANK', key: 'fillblankAnswer', validateLabel: '请填写'},
  ]
  return data.find(item => item.value === type) || { key: '', validateLabel: '请操作', tip: '' }
}
getDetail()
async function getDetail() {
  if(!currentId) return
  isLoading.value = true
  const [err, res] = await to(request.getDetail(currentId))
  isLoading.value = false
  if(err) return
  option.value = res.data[0]
}
async function submit() {
  const isValidate = await to(formRef.value.validate())
  if(!isValidate[1]) return
  const data = { 
    surveyId: currentId,
    answerCreateList: option.value.questionList.map((item: any) => {
      return {
        questionId: item.id,
        fillblankAnswer: item.fillblankAnswer,
        optionAnswer: item.questionType === 'MULTI' ? item.optionAnswer.join(',') : item.optionAnswer,
      }
    })
  } 
  isSubmitLoading.value = true
  const [err, res] = await to(request.answer(data))
  isSubmitLoading.value = false
  if(err) return
  isSuccess.value = true
}
function changeTheme() {
  isDark.value = !isDark.value
  localStorage.setItem('isDark', isDark.value.toString())
  const body = document.documentElement as HTMLElement
  if(isDark.value) body.setAttribute('class', 'dark')
  else body.setAttribute('class', '')
}
</script>

<template>
  <div class="bg-white dark:bg-transparent relative max-md:w-full w-[700px] mx-auto py-8 px-4 rounded md:mt-10 md:border-[1px]" v-loading="isLoading">
    <div v-if="!isSuccess">
      <div class="float-right cursor-pointer max-md:cursor-auto">
        <div @click="changeTheme">
          <svg width="20px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path class="dark:fill-transparent fill-black" fill-rule="evenodd" d="M12 17.5a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zm0 1.5a7 7 0 1 0 0-14 7 7 0 0 0 0 14zm12-7a.8.8 0 0 1-.8.8h-2.4a.8.8 0 0 1 0-1.6h2.4a.8.8 0 0 1 .8.8zM4 12a.8.8 0 0 1-.8.8H.8a.8.8 0 0 1 0-1.6h2.5a.8.8 0 0 1 .8.8zm16.5-8.5a.8.8 0 0 1 0 1l-1.8 1.8a.8.8 0 0 1-1-1l1.7-1.8a.8.8 0 0 1 1 0zM6.3 17.7a.8.8 0 0 1 0 1l-1.7 1.8a.8.8 0 1 1-1-1l1.7-1.8a.8.8 0 0 1 1 0zM12 0a.8.8 0 0 1 .8.8v2.5a.8.8 0 0 1-1.6 0V.8A.8.8 0 0 1 12 0zm0 20a.8.8 0 0 1 .8.8v2.4a.8.8 0 0 1-1.6 0v-2.4a.8.8 0 0 1 .8-.8zM3.5 3.5a.8.8 0 0 1 1 0l1.8 1.8a.8.8 0 1 1-1 1L3.5 4.6a.8.8 0 0 1 0-1zm14.2 14.2a.8.8 0 0 1 1 0l1.8 1.7a.8.8 0 0 1-1 1l-1.8-1.7a.8.8 0 0 1 0-1z"></path>
            <path class="fill-transparent dark:fill-gray-300" fill-rule="evenodd" d="M16.5 6A10.5 10.5 0 0 1 4.7 16.4 8.5 8.5 0 1 0 16.4 4.7l.1 1.3zm-1.7-2a9 9 0 0 1 .2 2 9 9 0 0 1-11 8.8 9.4 9.4 0 0 1-.8-.3c-.4 0-.8.3-.7.7a10 10 0 0 0 .3.8 10 10 0 0 0 9.2 6 10 10 0 0 0 4-19.2 9.7 9.7 0 0 0-.9-.3c-.3-.1-.7.3-.6.7a9 9 0 0 1 .3.8z"></path></svg>
        </div>
      </div>
      <div class="text-3xl text-[#2B85E4] font-bold px-4">{{ option.title }}</div>
      <div class="text-lg text-gray-500 px-4 my-4">{{ option.description }}</div>
      <br>
      <el-form ref="formRef" :model="option" label-position='top' label-width="100px">
        <div v-for="(item, index) in option.questionList" class="mb-10 mx-2">
          <el-form-item :prop="`questionList.${index}.${getModel(item.questionType).key}`" :rules="[{ required: true, message: `${getModel(item.questionType).validateLabel}` }]">
            <template #label>
              <span class="font-bold text-base">{{ `${index + 1}. ${item.questionTitle}` }}</span>
              <span class="text-xs text-gray-400" v-if="getModel(item.questionType).tip">（{{ getModel(item.questionType).tip }}）</span>
            </template>
            <el-input v-if="item.questionType === 'FILLBLANK'" type="textarea" size="large" v-model="item[getModel(item.questionType).key]"/>
            <el-radio-group v-if="item.questionType === 'SINGLE'" v-model="item[getModel(item.questionType).key]" size="large">
              <el-radio v-for="option in item.optionList" :label="option.questionOption" class="w-full">{{ option.questionOption }}</el-radio>
            </el-radio-group>
            <el-checkbox-group v-if="item.questionType === 'MULTI'" v-model="item[getModel(item.questionType).key]">
              <el-checkbox  v-for="option in item.optionList" :label="option.questionOption" class="w-full">{{ option.questionOption }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </div>
      </el-form>
      <div class="mx-2 mt-20" v-if="!isLoading">
        <el-button type="primary" class="w-full" size="large" @click="submit" :loading="isSubmitLoading">提交</el-button>
      </div>
      <br>
      <br>
    </div>
    <el-result
      v-if="isSuccess"
      icon="success"
      title="提交成功"
      sub-title="你的答卷已提交, 感谢你的参与">
    </el-result>
  </div>
</template>

<style scoped lang="scss">
.el-select {
  @apply w-full;
}
:deep() {
  .el-form-item__content {
    @apply m-4 ml-3;
  }
  .el-textarea__inner {
    min-height: 80px !important;
  }
  .el-radio__label, .el-checkbox__label {
    font-size: 12px !important;
    @apply whitespace-normal text-lg;
  }
  .el-radio, .el-checkbox  {
    @apply h-auto mr-0 py-2 px-3 pr-3;
    &:not(:first-child) {
      border-top: 1px solid var(--el-border-color);
    }
  }
  .el-checkbox-group, .el-radio-group  {
    border: 1px solid var(--el-border-color);
    @apply rounded flex-1;
  }
  .is-error .el-checkbox-group, .is-error .el-radio-group {
    border-color: var(--el-color-danger);
  }
}
@media (max-width: 768px) {
  .el-checkbox, .el-radio {
    cursor: auto;
  }
}
</style>
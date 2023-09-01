<script setup lang="ts">
import { ref, computed, watch } from 'vue'
const props = defineProps({
  modelValue: {
    type: [Date, String, Number, Array],
  },
  beginDate: {
    type: [String, Number],
    default: ""
  },
  endDate: {
    type: [String, Number],
    default: ""
  },
  type: {
    type: String,
    default: () => "date"
  },
  // 是否开启特殊范围选择模式(两个日期选择器)
  oneRange: {
    type: Boolean,
    default() {
      return false
    }
  }
})
const emit = defineEmits(['update:modelValue','update:beginDate','update:endDate'])
const isRange = computed(() => {
  return ["datetimerange","daterange","monthrange"].includes(props.type)
})

const date = ref(props.modelValue || [])

// 监听modelValue的变化，实现双向绑定
watch(() => props.modelValue, (val) => {
  date.value = val
})
// 监听date的变化，实现双向绑定
watch(() => date.value, (val) => {
  emit('update:modelValue', val );
  if(isRange && Array.isArray(val) && val?.length == 2) {
    emit('update:beginDate', val[0])
    emit('update:endDate', val[1])
  }
  if(isRange && !val && props.beginDate && props.endDate) {
    date.value = [props.beginDate,props.endDate]
  }
})

// 监听beginDate的变化，实现双向绑定
watch(() => props.beginDate, (val) => {
  
  !val && (date.value = "")
  if(isRange && val) {
    !Array.isArray(date.value) && (date.value = [])
    date.value[0] = val || ""
  }
})
// 监听endDate的变化，实现双向绑定
watch(() => props.endDate, (val) => {
  !val && (date.value = "")
  if(isRange && val) {
    !Array.isArray(date.value) && (date.value = [])
    date.value[1] = val || ""
  }
})

</script>
<template>
  <el-date-picker
    v-model="date"
    :type="type"
    v-bind="$attrs">
  </el-date-picker>
</template>


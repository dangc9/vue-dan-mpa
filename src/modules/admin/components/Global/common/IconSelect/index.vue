<script setup lang="ts">
import { ref, watch } from 'vue'
import IconList from './iconList.vue'
const iconSelectRef = ref(null);
const iconPopover = ref()
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const icon = ref<string>(props.modelValue)

watch(() => props.modelValue, (val) => {
  icon.value = val
})

watch(() => icon.value, (val) => {
  console.log(val);
  emit('update:modelValue', val)
})

/** 展示下拉图标 */
function showSelectIcon() {
  iconSelectRef.value.reset();
}
/** 选择图标 */
function selected(name: string) {
  icon.value = name;
  iconPopover.value.hide();
}
</script>

<template>
  <el-popover ref="iconPopover" placement="bottom-start" :width="700" trigger="click"
    @show="showSelectIcon">
    <template #reference>
      <el-input v-model="icon" placeholder="点击选择图标" @blur="showSelectIcon" readonly>
        <template #prefix> 
          <el-icon>
            <component :is="icon || 'Search'" />
          </el-icon>
        </template>
      </el-input>
    </template>
    <IconList ref="iconSelectRef" @selected="selected" :active-icon="icon"/>
  </el-popover>
</template>
<template>
  <el-switch
      @change="switchDark"
      inline-prompt
      v-model="themeConfig.isDark"
      :active-icon="Sunny"
      :inactive-icon="Moon"
  />
</template>

<script setup lang="ts" name="switchDark">
import { Sunny, Moon } from "@element-plus/icons-vue";
import {computed, ref} from "vue";
import { useThemeChange } from "@admin/hooks/theme/useThemeChange";
import {useSettingStore} from "@admin/store/modules/setting"


const { switchDark } = useThemeChange();
const SettingStore = useSettingStore()
// 设置信息
const themeConfig = computed(()=>SettingStore.themeConfig)
</script>

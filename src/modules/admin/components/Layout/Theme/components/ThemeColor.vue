<script lang="ts" setup>
import { computed } from 'vue'
import { useThemeChange } from "@admin/hooks/theme/useThemeChange";
import { useSettingStore } from "@admin/store/modules/setting"
import { Check } from "@element-plus/icons-vue";
const { 
  primary,
  themeColors,
  changePrimary
} = useThemeChange();
const SettingStore = useSettingStore()
const getThemeColor = computed(() => {
  return (color: string): string => {
    if(color != SettingStore.themeConfig.primary) return 'transparent';
    return color === '#ffffff' ? '#000000' : '#ffffff' ;
  };
})
</script>

<template>
  <div>
    <ul class="flex justify-center w-full">
      <li
        class="w-[20px] h-[20px] rounded cursor-pointer mr-2"
        v-for="(item, index) in themeColors"
        :key="index"
        :style="{ backgroundColor: item.color}"
        @click="changePrimary(item.color)">
        <el-icon style="margin: 1.5px 0 0 0.5px" :size="17" :color="getThemeColor(item.color)" >
          <Check />
        </el-icon>
      </li>
      <li class="-mt-2"><el-color-picker v-model="SettingStore.themeConfig.primary" @change="changePrimary" /></li>
    </ul>
  </div>
</template>
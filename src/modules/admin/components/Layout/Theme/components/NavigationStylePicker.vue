<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useSettingStore } from "@admin/store/modules/setting"
import { openLoading,closeLoading } from "@admin/utils/element"
import { useThemeChange } from "@admin/hooks/theme/useThemeChange";
const { 
  styleColors,
  switchStyle,
  changeStyle,
} = useThemeChange();
const SettingStore = useSettingStore()
const style = computed(() => SettingStore.themeConfig.style)
const styleColor = computed(() => SettingStore.themeConfig.styleColor)
const menuTypeList = ref([
  { type: 'dark', title: '暗色侧边栏' },
  { type: 'white', title: '白色侧边栏' },
  // { type: 'topDark', title: '暗色导航栏' },
])

const getIconColor = computed(() => {
  return (color: string): string => {
    if(color != SettingStore.themeConfig.styleColor) return 'transparent';
    return color === '#ffffff' ? '#000000' : '#ffffff' ;
  };
})
</script>

<template>
  <!-- <div class="flex justify-center py-4">
    <template v-for="item in menuTypeList">
      <el-tooltip :content="item.title" transition="sidebarLogoFade">
        <div :class="['d-item', `d-item--${item.type}`, { 'd-item--active': style === item.type}]" @click="switchStyle(item.type)">
          <div class="columns-menu"></div>
        </div>
      </el-tooltip>
    </template>
  </div> -->
  <ul class="flex justify-center w-full" v-if="style !== 'white'">
    <li
      class="w-[20px] h-[20px] rounded cursor-pointer mr-2"
      v-for="(item, index) in styleColors"
      :key="index"
      :style="{ backgroundColor: item.color,  border: item.color === '#ffffff' ? '1px solid #ebeef5' : 'none' }"
      @click="changeStyle(item.color)">
      <el-icon style="margin: 1.5px 0 0 0.5px" :size="17" :color="getIconColor(item.color)" >
        <Check />
      </el-icon>
    </li>
    <li class="-mt-2"><el-color-picker v-model="SettingStore.themeConfig.styleColor" @change="changeStyle" /></li>
  </ul>
</template>

<style scoped lang="scss">
  .d-item {
    @apply relative float-left w-14 h-12 mr-4 overflow-hidden cursor-pointer bg-gray-100 rounded-md shadow-md;
    &::before,
    &::after {
      @apply absolute;
      content: '';
    }
    &::before {
      @apply top-0 left-0 z-[1] w-1/3 h-full rounded-l;
      background-color: var(--d-sidebar-bg);
    }
    &::after {
      @apply top-0 right-0 w-full h-1/4 bg-white;
    }
    &--white {
      &::before {
        @apply bg-white;
      }
    }
    &--topDark {
      &::after {
        background-color: var(--d-sidebar-bg);
      }
    }
    &:hover, &--active {
      padding: 12px;
      border: 2px solid var(--el-color-primary);
      &::before,
      &::after {
        border-radius: 0;
      }
    }
  }
  
</style>
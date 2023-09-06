<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useSettingStore } from "@admin/store/modules/setting"
import { openLoading,closeLoading } from "@admin/utils/element"

const SettingStore = useSettingStore()
const mode = computed(() => SettingStore.themeConfig.mode)
const menuTypeList = ref([
  { type: 'vertical', title: '左侧菜单模式' },
  { type: 'horizontal', title: '顶部菜单模式' },
  { type: 'columns', title: '分栏菜单模式' },
])
// 进行配置
const changeSwitch = (val: string) => {
  SettingStore.setThemeConfig({ key: 'mode', val})
  openLoading()
  setTimeout(()=>{
    closeLoading()
  },600)
}
</script>

<template>
  <div class="flex justify-center py-4">
    <template v-for="item in menuTypeList">
      <el-tooltip :content="item.title" transition="sidebarLogoFade">
        <div :class="['d-item', `d-item--${item.type}`, { 'd-item--active': mode === item.type}]" @click="changeSwitch(item.type)">
          <div class="columns-menu"></div>
        </div>
      </el-tooltip>
    </template>
  </div>
</template>

<style scoped lang="scss">
  .d-item {
    @apply relative float-left w-14 h-12 mr-4 overflow-hidden cursor-pointer bg-gray-100 rounded-md shadow-md;
    &::before,
    &::after {
      @apply absolute;
      content: '';
    }
    &--vertical {
      &::before {
        @apply top-0 left-0 z-[1] w-1/3 h-full rounded-l;
        background-color: var(--d-sidebar-bg);
      }
      &::after {
        @apply top-0 right-0 w-full h-1/4 bg-white;
      }
    }
    &--horizontal {
      &::after {
        @apply top-0 right-0 w-full h-1/4 bg-gray-900;
      }
    }
    &--columns {
      &::before {
        @apply top-0 left-0 z-[1] w-[15%] h-full rounded-l;
        background-color: var(--d-sidebar-bg);
      }
      &::after {
        @apply top-0 right-0 w-full h-1/4 bg-white;
      }
      .columns-menu {
        @apply absolute left-[15%] top-1/4 w-[15%] h-full bg-white;
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
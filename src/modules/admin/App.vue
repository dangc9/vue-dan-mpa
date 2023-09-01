<template>
  <el-config-provider :size="globalComSize" :locale="zhCn">
    <router-view></router-view>
  </el-config-provider>
</template>

<script lang="ts" setup>
  import {computed} from "vue";
  // 配置element中文
  import zhCn from 'element-plus/es/locale/lang/zh-cn'

  import {useSettingStore} from "@admin/store/modules/setting"
  import { useInitTheme } from "@admin/hooks/theme/useInitTheme";
  useInitTheme()
  const SettingStore = useSettingStore()
  // 配置全局组件大小
  const globalComSize = computed(():string=>SettingStore.themeConfig.globalComSize)
  
</script>

<style lang="scss">
  #app {
    position: relative;
    width: 100%;
    height: 100%;
    font-family: Avenir, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  .el-pager li:focus {
    border: none;
  }
  .el-dropdown:focus {
    border: none;
  }
  .svg-icon:focus {
    border: none;
  }
</style>

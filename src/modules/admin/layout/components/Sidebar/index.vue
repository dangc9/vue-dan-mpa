<template>
  <div  class="sidebar-container" :class="{ 'has-logo': themeConfig.showLogo }">
    <Logo :isCollapse="isCollapse" v-if="themeConfig.showLogo"/>
    <el-scrollbar wrap-class="scrollbar-wrapper" class="sidebar-menu-tree">
      <el-menu
          :default-active="activeMenu"
          :unique-opened="SettingStore.themeConfig.uniqueOpened"
          :collapse-transition="false"
          :collapse="isCollapse">
        <SubMenu :menuList="permission_routes"/>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script lang="ts" setup>
import Logo from './components/Logo.vue'
import SubMenu from '../SubMenu/SubMenu.vue'
import {useSettingStore} from "@admin/store/modules/setting"
import {usePermissionStore} from "@admin/store/modules/permission"
import { computed, ref, watch } from "vue";
import { useRoute } from 'vue-router'

// 在setup中获取store
const route = useRoute()
const PermissionStore = usePermissionStore()
const SettingStore = useSettingStore()

// 是否折叠
const isCollapse = computed(() => !SettingStore.isCollapse)
// 设置
const themeConfig = computed(() =>SettingStore.themeConfig )

const basePath = ref('/')

// 获取路由
const permission_routes = computed(() => PermissionStore.permission_routes)

const activeMenu = computed(() => {
  const { meta, path } = route
  // if set path, the sidebar will highlight the path you set
  if (meta.activeMenu) {
    return meta.activeMenu
  }
  return path
})
</script>

<style lang="scss">
.el-menu-vertical-demo:not(.el-menu--collapse) {
  height: 100%;
}
</style>

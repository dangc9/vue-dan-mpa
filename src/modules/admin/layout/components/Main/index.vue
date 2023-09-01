<template>
  <div class="app-main" >
    <router-view v-slot="{ Component, route }">
      <transition name="fade-slide" mode="out-in" appear>
        <keep-alive :include="cacheRoutes" v-if="isReload">
          <component :is="useWrapComponents(Component,route)" :key="route.path" />
        </keep-alive>
      </transition>
    </router-view>
  </div>
</template>

<script lang="ts" setup>
  import {useWrapComponents} from '@admin/hooks/useWrapComponents'
  import { computed, ref } from 'vue'
  import {useSettingStore} from "@admin/store/modules/setting"
  import {usePermissionStore} from "@admin/store/modules/permission"
  const SettingStore = useSettingStore()
  const PermissionStore = usePermissionStore()
  const cacheRoutes = computed(() =>PermissionStore.keepAliveRoutes)
  const isReload = computed(() => SettingStore.isReload)
</script>

<style lang="scss" scoped>
  .app-main {
    flex: 1;
    display: flex;
    overflow-x: hidden;
    width: 100%;
    box-sizing: border-box;
    .app-main-inner{
      // flex: 1;
      // display: flex;
      overflow-x: hidden;
      width: 100%;
      box-sizing: border-box;
    }
  }
</style>

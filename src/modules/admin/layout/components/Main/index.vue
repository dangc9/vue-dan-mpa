<template>
  <div class="app-main" >
    <router-view v-slot="{ Component, route }">
      <transition name="fade-slide" mode="out-in" appear>
        <keep-alive :include="cacheRoutes"  v-if="isReload">
          <component :is="useWrapComponents(Component,route)" :key="route.fullPath" />
        </keep-alive>
      </transition>
    </router-view>
  </div>
</template>

<script lang="ts" setup>
  import {useWrapComponents} from '@admin/hooks/useWrapComponents'
  import { computed, ref } from 'vue'
  import {useSettingStore} from "@admin/store/modules/setting"
  import { useTagsViewStore } from "@admin/store/modules/tagsView"
  const SettingStore = useSettingStore()
  const TagsViewStore = useTagsViewStore()
  const cacheRoutes = computed(() =>TagsViewStore.cachedViews)
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

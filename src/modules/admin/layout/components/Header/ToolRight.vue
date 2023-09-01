<template>
  <div class="m-tool-right">
    <!-- <Link class="max-md:hidden" v-if="!isMobile"/> -->
    <GlobalComSize class="item-children" v-if="!isMobile"/>
    <!-- <HeaderSearch class="item-children" v-if="!isMobile"/> -->
    <!-- <Remind class="item-children" v-if="!isMobile"/> -->
    <ScreenFull class="item-children" v-if="!isMobile"/>
    <Avatar/>
    <Setting class="item-children" v-if="!isMobile"/>
  </div>
</template>

<script lang="ts" setup>
import Link from './components/Link.vue'
import GlobalComSize from './components/globalComSize.vue'
import HeaderSearch from './components/HeaderSearch.vue'
import Remind from './components/Remind.vue'
import ScreenFull from './components/ScreenFull.vue'
import Setting from './components/Setting.vue'
import Avatar from './components/Avatar.vue'
import { useSettingStore } from '@admin/store/modules/setting'
const SettingStore = useSettingStore()
const isMobile = SettingStore.isMobile
</script>

<style lang="scss" scoped>
.m-tool-right{
  display: flex;
  align-items: center;
  min-width: 100px;
  .item-children{
    margin: 0 8px 0 14px;
  }
}
</style>

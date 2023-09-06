<template>
  <div class="sidebar-logo-container">
    <transition name="sidebarLogoFadeCl">
      <router-link v-if="isCollapse" key="collapse" class="sidebar-logo-link flex items-center" to="/">
        <img src="@admin/assets/image/log.png" class="sidebar-logo ml-4">
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link flex items-center" to="/">
        <img src="@admin/assets/image/log.png" class="sidebar-logo ml-5">
        <h1 class="sidebar-title">{{ SYS_NAME }}</h1>
      </router-link>
    </transition>
  </div>
</template>

<script lang="ts" setup>
defineProps<{ isCollapse: boolean }>();
const SYS_NAME = import.meta.env.VITE_SYS_NAME
</script>

<style lang="scss" scoped>
  .sidebarLogoFadeCl-enter-active {
    transition: opacity 2s;
  }
  .sidebarLogoFadeCl-enter-from,
  .sidebarLogoFadeCl-leave-to {
    opacity: 0;
  }
  .sidebar-logo-container {
    position: relative;
    width: 100%;
    height: 50px;
    line-height: 50px;
    background: $menuBg;
    text-align: center;
    overflow: hidden;

    & .sidebar-logo-link {
      height: 100%;
      width: 100%;

      & .sidebar-logo {
        width: 32px;
        height: 32px;
        vertical-align: middle;

      }
      & .sidebar-title {
        display: inline-block;
        margin: 0;
        color: $menuText;
        font-weight: 600;
        margin-left: 9px;
        line-height: 50px;
        font-size: 14px;
        vertical-align: middle;
      }
    }
  }
</style>

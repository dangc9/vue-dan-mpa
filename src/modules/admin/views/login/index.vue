<template>
  <div class="login-container">
    <div class="login-box">
      <SwitchDark class="login-dark"/>
      <div class="login-left">
        <img src="@admin/assets/image/login/side-logo.png" >
      </div>
      <div class="login-form">
        <LoginForm v-if="accountLogin"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import {ref} from 'vue'
  import LoginForm from './components/LoginForm.vue'
  import SwitchDark from '@admin/components/Layout/Theme/components/SwitchDark.vue'
  const accountLogin = ref<boolean>(true)
</script>
<style lang="scss" scoped>
  @import "@admin/styles/login/index";
</style>

<script setup lang="ts">
console.log(import.meta.env.VITE_DG_PROJECT_SYSTEM);
const url =  `${import.meta.env.VITE_DG_PROJECT_SYSTEM}/index`
</script>

<template>
  <el-link type="primary" :underline="false" target="_blank" :href="url" class="mr-4">项目管理系统</el-link>
</template>

<style lang="scss" scoped>
  
</style>
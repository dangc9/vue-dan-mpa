<template>
   <i-frame v-model:src="url"></i-frame>
</template>

<script setup lang="ts">
import iFrame from '@admin/components/Ruoyi/iFrame/index.vue'

const url = import.meta.env.VITE_ADMIN_API + "/swagger-ui/index.html"
</script>

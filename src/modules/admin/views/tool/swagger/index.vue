<template>
   <i-frame v-model:src="url"></i-frame>
</template>

<script setup lang="ts">
import iFrame from '@admin/components/Ruoyi/iFrame/index.vue'

const url = import.meta.env.VITE_BASE_API + "/swagger-ui/index.html"
</script>

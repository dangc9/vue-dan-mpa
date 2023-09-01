<script lang="ts" setup>
  const VITE_SYS_NAME = import.meta.env.VITE_SYS_NAME
</script>

<template>
	<div class="footer-layout">
		<span href="/" target="_blank"> 2023 © {{ VITE_SYS_NAME }}. </span>
	</div>
</template>

<style scoped lang="scss">
.footer-layout{
  height: 20px;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  border-top: 1px solid #e4e7ed;
  flex-shrink: 0;
  color: rgba(0, 0, 0, 0.45);
}
</style>

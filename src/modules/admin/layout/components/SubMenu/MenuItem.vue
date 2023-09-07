<template>
  <el-menu-item
             :index="subItem.path"
             @click="handleClickMenu(subItem)">
    <el-icon>
      <component :is="getIconComponent(subItem.meta?.icon)"></component>
    </el-icon>
    <!-- <svg-icon :icon-class="subItem?.meta?.icon" /> -->
    <template #title>
      <span>{{ subItem?.meta?.title }}</span>
    </template>
  </el-menu-item>
</template>

<script setup lang="ts">
import { getCurrentInstance  } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
let props = defineProps({
  menuList:{
    type:Array,
    default:()=>[]
  },
  subItem:{
    type:Object,
    default:()=>{}
  },
})

const getIconComponent = (name: string) => {
  if(name === '#') return 'Grid'
  const app = getCurrentInstance().appContext.components[name.charAt(0).toUpperCase() + name.slice(1)]
  return app ? name : 'Grid'
}

const handleClickMenu = (subItem) => {
  if(subItem.meta?.link){
    return window.open(subItem.meta?.link, "_blank");
  }
  router.push(subItem.path);
};
</script>

<template>
  <el-menu-item
             :index="subItem.path"
             @click="handleClickMenu(subItem)">
    <el-icon>
      <component :is="subItem.meta?.icon === '#' ? 'Grid' :subItem.meta?.icon"></component>
    </el-icon>
    <!-- <svg-icon :icon-class="subItem?.meta?.icon" /> -->
    <template #title>
      <span>{{ subItem?.meta?.title }}</span>
    </template>
  </el-menu-item>
</template>

<script setup lang="ts">
import { ref, getCurrentInstance  } from "vue";
import { useRouter } from "vue-router";
function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

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
const isComponentRegistered = (name: string) => {
  const app = getCurrentInstance().appContext.config.globalProperties;
  // console.log(app);
  // return app.component(name) !== undefined;
}

const handleClickMenu = (subItem) => {
  if(subItem.meta?.link){
    return window.open(subItem.meta?.link, "_blank");
  }
  router.push(subItem.path);
};
</script>

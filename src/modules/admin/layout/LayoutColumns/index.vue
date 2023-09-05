<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { usePermissionStore } from "@admin/store/modules/permission"
import { useSettingStore } from "@admin/store/modules/setting";
import Footer from '../components/Footer/index.vue'
import SubMenu from '../components/SubMenu/SubMenu.vue'
import TagsView from '../components/TagsView/index.vue'
import HeaderToolRight from '../components/Header/ToolRight.vue'
import HeaderToolLeft from '../components/Header/ToolLeft.vue'
import Main from '../components/Main/index.vue'

const SYS_NAME = import.meta.env.VITE_SYS_NAME
const PermissionStore = usePermissionStore()
const SettingStore = useSettingStore()
const route = useRoute()
const router = useRouter();
// 获取路由
const permission_routes = computed(() => PermissionStore.permission_routes)

// 获取路由
const menusRoutes = computed(() => {
  return PermissionStore.permission_routes.filter(item => !item.hidden)
})

const activeCurrentMenu = ref('')
// 主题配置
const themeConfig = computed(() => SettingStore.themeConfig)
const isCollapse = computed(() => !SettingStore.isCollapse)
const activeMenu = computed(() => {
  const { meta, path } = route
  return path
})
const subMenus = ref([])

watch(() => [route], () => {
  if (!menusRoutes.value.length) return;
  const [firstMenu] = route.matched
  activeCurrentMenu.value = firstMenu.path;
  let menuItem = menusRoutes.value.find(item => firstMenu.path === item.path)
  if (menuItem && menuItem.children?.length) {
    subMenus.value = menuItem.children
  }
}, {
  deep: true,
  immediate: true
})

const handleChangeMenu = (item) => {
  const lastRoute = getFirstRoute(item)
  if(lastRoute.meta.link) {
    window.open(lastRoute.meta.link)
    return
  }
  router.push(lastRoute.path)
  function getFirstRoute(route) {
    if (route.children?.length) {
      return getFirstRoute(route.children[0])
    } else {
      return route
    }
  }
}
</script>

<template>
  <div class="main-columns">
    <div class="layout-columns-aside">
      <div class="logo flex-center">
        <img src="@admin/assets/image/log.png" alt="logo" />
      </div>
      <el-scrollbar>
        <div class="menu-wrap">
          <div 
            class="item-menu-wrap" 
            :class="{'active-menu': activeCurrentMenu === item.path}" 
            v-for="item in menusRoutes" 
            :key="item.path" 
            @click="handleChangeMenu(item)">
            <el-icon :size="20">
              <component :is="item?.meta?.icon"></component>
            </el-icon>
            <span class="title">{{ item?.meta?.title }}</span>
          </div>
        </div>
      </el-scrollbar>
    </div>

    <div class="layout-columns-sub" :style="{ width: isCollapse ? '60px' : '210px' }">
      <div class="logo flex-center">
        <span v-show="subMenus.length">{{ isCollapse ? "D" : SYS_NAME }}</span>
      </div>
      <el-scrollbar>
        <el-menu :collapse="isCollapse" :router="false" :default-active="activeMenu"
          :unique-opened="SettingStore.themeConfig.uniqueOpened" :collapse-transition="false" class="menu-columns">
          <SubMenu :menuList="subMenus" />
        </el-menu>
      </el-scrollbar>
    </div>

    <div class="layout-container">
      <div class="m-layout-header">
        <div class="header-tool">
          <HeaderToolLeft />
          <HeaderToolRight />
        </div>
        <TagsView v-if="themeConfig.showTag" />
      </div>
      <Main />
      <Footer/>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.main-columns {
  display: flex;
  flex-direction: row !important;
  height: 100%;
  width: 100%;
}

.layout-columns-aside {
  flex-shrink: 0;
  width: 80px;
  height: 100%;
  background-color: #304156;

  .el-scrollbar {
    height: calc(100% - 55px);
  }

  .logo {
    box-sizing: border-box;
    height: 50px;

    img {
      width: 32px;
      object-fit: contain;
    }
  }

  .menu-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .item-menu-wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 70px;
      width: 70px;
      cursor: pointer;
      transition: all .3s ease;
    }

    .active-menu {
      background: $primaryColor;
      border-radius: 5px;
    }

    .title {
      color: #e5eaf3;
    }

    .el-icon {
      color: #e5eaf3;
    }
  }
}

.layout-columns-sub {
  flex-shrink: 0;
  width: 200px;
  box-sizing: border-box;
  flex-direction: column;
  overflow: hidden;
  transition: all 0.3s ease;
  background: var(--el-bg-color)!important;
  border-right: 1px solid var(--el-border-color);
  .el-scrollbar {
    border: 0;
    height: calc(100vh - 50px);
  }

  .logo {
    width: 100%;
    box-sizing: border-box;
    height: 50px;
    border-bottom: 1px solid var(--el-border-color);

    span {
      font-weight: bold;
      white-space: nowrap;
    }
  }

  :deep(.menu-columns) {
    border-right: none;
  }
}

.layout-container {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.m-layout-header {
  background-color: var(--el-bg-color);
  transition: width 0.28s;
  flex-shrink: 0;
  box-sizing: border-box;
  box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
  .header-tool {
    height: 50px;
    width: 100%;
    border-bottom: 1px solid var(--el-border-color);
    display: flex;
    align-items: center;
    padding: 0 10px 0 0;
    box-sizing: border-box;
    justify-content: space-between;
    
  }
}</style>

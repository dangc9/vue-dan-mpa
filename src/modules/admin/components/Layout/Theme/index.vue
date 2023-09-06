<script lang="ts" setup>
  import {computed, ref,watch} from 'vue'
  import {openLoading,closeLoading} from "@admin/utils/element"
  import SwitchDark from '@admin/components/Layout/Theme/components/SwitchDark.vue'
  import NavigationTypePicker from './components/NavigationTypePicker.vue'
  import NavigationStylePicker from './components/NavigationStylePicker.vue'
  import ThemeColor from './components/ThemeColor.vue'
  import {useSettingStore} from "@admin/store/modules/setting"
  import { useThemeChange } from "@admin/hooks/theme/useThemeChange";

  const { 
    switchDark,
  } = useThemeChange();
  
  const SettingStore = useSettingStore()
  const layout = ref(SettingStore.themeConfig.mode)
  const showTag = ref(SettingStore.themeConfig.showTag)
  const showLogo = ref(SettingStore.themeConfig.showLogo)
  const uniqueOpened = ref(SettingStore.themeConfig.uniqueOpened)
  const fixedHeader = ref(SettingStore.themeConfig.fixedHeader)
  const gray = ref(SettingStore.themeConfig.gray)
  const weak = ref(SettingStore.themeConfig.weak)

  const drawer = computed({
    get() {
      return SettingStore.themeConfig.showSetting;
    },
    set() {
      changeSwitch('showSetting',!SettingStore.themeConfig.showSetting)
    }
  })

  // 进行配置
  const changeSwitch = (key,val) => {
    SettingStore.setThemeConfig({key, val})
    if(key==='mode'){
      openLoading()
      setTimeout(()=>{
        closeLoading()
      },600)
    }
  }

  // 监听布局变化
  watch(
    () => layout.value,
    () => {
      const body = document.body as HTMLElement;
      body.setAttribute("class", `layout-${layout.value}`);
    },
    { immediate: true }
  );

  // 修改灰色模式
  const changeGrayWeak = (type,val)=>{
    const body = document.documentElement as HTMLElement;
    if (!val) return body.setAttribute("style", "");
    if (type === "gray") body.setAttribute("style", "filter: grayscale(1)");
    if (type === "weak") body.setAttribute("style", "filter: invert(80%)");
    changeSwitch(type,val)
  }

</script>

<template>
  <div>
    <el-drawer v-model="drawer" title="主题配置" size="300px">
      <el-divider>主题</el-divider>
      <div class="text-center"><switch-dark></switch-dark></div>
      <el-divider>导航栏模式</el-divider>
      <NavigationTypePicker/>
      <br>
      <el-divider>导航栏风格</el-divider>
      <NavigationStylePicker/>
      <br>
      <el-divider>主题色</el-divider>
      <ThemeColor/>
      <br>
      <br>
      <div class="theme-item">
        <label>灰色模式</label>
        <el-switch v-model="gray" @change="(val) => changeGrayWeak('gray',val)" />
      </div>
      <div class="theme-item">
        <label>色弱模式</label>
        <el-switch v-model="weak" @change="(val) => changeGrayWeak('weak',val)" />
      </div>
      <div class="theme-item">
        <label>标签栏</label>
        <el-switch v-model="showTag" @change="(val) => changeSwitch('showTag',val)" />
      </div>
      <div class="theme-item">
        <label>侧边栏 Logo</label>
        <el-switch v-model="showLogo" @change="(val) => changeSwitch('showLogo',val)" />
      </div>
      <div class="theme-item">
        <label>保持一个子菜单的展开</label>
        <el-switch v-model="uniqueOpened" @change="(val) => changeSwitch('uniqueOpened',val)" />
      </div>
      <div class="theme-item">
        <label>固定header</label>
        <el-switch v-model="fixedHeader" @change="(val) => changeSwitch('fixedHeader',val)" />
      </div>
    </el-drawer>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-drawer__header){
  border-bottom: 1px solid #ebeef5;
  padding: 15px 20px 14px;
  margin-bottom: 0;
}
:deep(.el-drawer__title) {
  font-weight: bold;
  color: black;
}
.theme-item {
  width: 100%;
  display: flex;
  margin-bottom: 15px;
  align-items: center;
  font-size: 14px;
  color: black;
  justify-content: space-between;

}
:deep() {
  .el-drawer__body {
    padding-top: 10px
  }
}
</style>

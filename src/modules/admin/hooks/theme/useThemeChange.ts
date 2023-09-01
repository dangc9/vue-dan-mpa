import { ref } from "vue";
import { ElMessage } from "element-plus";
import { PRIMARY_COLOR } from "@admin/config/index";
import { useSettingStore } from "@admin/store/modules/setting"



export function useThemeChange() {
  const SettingStore = useSettingStore()
  const primary = ref(SettingStore.themeConfig.primary)

  // 进行配置
  const changeSwitch = (key: string, val: any) => {
    SettingStore.setThemeConfig({key, val})
  }
  /** 日间、夜间主题切换 */
  function switchDark ()  {
    const body = document.documentElement as HTMLElement;
    if (SettingStore.themeConfig.isDark) body.setAttribute("class", "dark");
    else body.setAttribute("class", "");
  }
  /* 修改主题颜色 */
  function changePrimary (val?: string){
    const primary_color = val || primary.value || PRIMARY_COLOR; 
    document.documentElement.style.setProperty("--el-color-primary", primary_color);
    changeSwitch('primary',primary_color)
  }
  return {
    primary,
    switchDark,
    changePrimary
  }
}
import { ref } from "vue";
import { PRIMARY_COLOR, STYLE_COLOR, THEME_COLORS, STYLE_COLORS } from "@admin/config/index";
import { useSettingStore } from "@admin/store/modules/setting"
import { darken, lighten } from "@admin/utils/common/theme"


export function useThemeChange() {
  const SettingStore = useSettingStore()
  const primary = ref(SettingStore.themeConfig.primary)
  const themeColors = ref(THEME_COLORS);
  const styleColors = ref(STYLE_COLORS);

  // 修改配置store
  const changeSwitch = (key: string, val: any) => {
    SettingStore.setThemeConfig({key, val})
  }
  /** 日间、夜间主题切换 */
  function switchDark ()  {
    const body = document.documentElement as HTMLElement;
    if (SettingStore.themeConfig.isDark) body.setAttribute("class", "dark");
    else body.setAttribute("class", "");
    changePrimary(SettingStore.themeConfig.primary)
  }

  /* 修改主题颜色 */
  function changePrimary (color?: string){
    const primary_color = color || primary.value || PRIMARY_COLOR; 
    document.documentElement.style.setProperty("--el-color-primary", primary_color);
    for (let i = 1; i <= 2; i++) {
      setPropertyPrimary("dark", i, primary_color);
    }
    for (let i = 1; i <= 9; i++) {
      setPropertyPrimary("light", i, primary_color);
    }
    const brightness = getColorBrightness(primary_color);
    document.documentElement.style.setProperty("--d-sidebar-active-color", brightness > 150 ? '#000000' : '#ffffff');
    changeSwitch('primary',primary_color)
  }
  // 设置主题色
  function setPropertyPrimary(mode: string, i: number, color: string) {
    document.documentElement.style.setProperty(
      `--el-color-primary-${mode}-${i}`,
      SettingStore.themeConfig.isDark? darken(color, i / 10) : lighten(color, i / 10)
    );
  }
  
  /** 风格切换 */
  function switchStyle (val?: string)  {
    val && SettingStore.setThemeConfig({ key: 'style', val})
    changeStyle()
  }
  /* 修改风格颜色 */
  function changeStyle (color?: string){
    const style_color = color || SettingStore.themeConfig.styleColor || STYLE_COLOR;
    const brightness = getColorBrightness(style_color);
    document.documentElement.style.setProperty("--d-sidebar-bg", style_color);
    document.documentElement.style.setProperty("--d-sidebar-color", brightness > 150 ? '#515a6e' : '#ffffff');
    changeSwitch('styleColor',style_color)
    for (let i = 1; i <= 3; i++) {
      console.log();
      document.documentElement.style.setProperty(
        `--d-sidebar-bg-light-${i}`,
        darken(style_color, i / (brightness > 150 ? 60 : 5))
      );
    }
  }
  function getColorBrightness(color: string) {
    if (color.charAt(0) === '#') {
      // 将十六进制颜色转换为整数值
      const hex = parseInt(color.slice(1), 16);
      const r = (hex >> 16) & 255;
      const g = (hex >> 8) & 255;
      const b = hex & 255;
      // 使用亮度公式计算亮度
      const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
      return parseInt(brightness.toString());
    }
    return null
  }
  return {
    themeColors,
    styleColors,
    primary,
    switchDark,
    switchStyle,
    changePrimary,
    changeStyle
  }
}
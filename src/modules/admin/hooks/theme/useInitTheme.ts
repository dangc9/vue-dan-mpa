import { useThemeChange } from "@admin/hooks/theme/useThemeChange";

export function useInitTheme() {
  const { switchDark, changePrimary, switchStyle  } = useThemeChange();
  switchDark()
  changePrimary()
  switchStyle()
}
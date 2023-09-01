import { useThemeChange } from "@admin/hooks/theme/useThemeChange";

export function useInitTheme() {
  const { switchDark, changePrimary } = useThemeChange();
  switchDark()
  changePrimary()
}
/**
 * Custom hook for themed styles
 */
import { useAppStore } from '../store/useAppStore';
import { darkTheme, lightTheme } from '../theme';
import type { ThemeColors } from '../theme';

export function useTheme(): ThemeColors {
  const mode = useAppStore((s) => s.theme);
  return mode === 'dark' ? darkTheme : lightTheme;
}

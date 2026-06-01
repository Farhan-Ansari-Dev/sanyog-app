/**
 * Custom hook for themed styles
 * Reads from the Zustand store so the in-app dark-mode toggle is respected.
 * Falls back to the OS color scheme only when the store value is unavailable.
 */
import { useColorScheme } from 'react-native';
import { darkTheme, lightTheme } from '../theme';
import { useAppStore } from '../store/useAppStore';
import type { ThemeColors } from '../theme';

export function useTheme(): ThemeColors {
  // Primary source: user's explicit preference stored in Zustand
  const storeTheme = useAppStore((s) => s.theme);
  // Fallback: OS-level color scheme (used before the store hydrates)
  const systemScheme = useColorScheme();

  const isDark = storeTheme ? storeTheme === 'dark' : systemScheme === 'dark';
  return isDark ? darkTheme : lightTheme;
}

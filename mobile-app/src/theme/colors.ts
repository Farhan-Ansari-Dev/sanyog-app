/**
 * Sanyog Conformity – Premium DICE Design System Colors (Mobile)
 * Supports Dark & Light mode with curated palettes based on the DICE Green+White standard.
 */

export const palette = {
  // Brand
  brandGreen: '#16A34A',      // light mode primary
  brandGreenHover: '#15803D',
  brandGreenDarkTheme: '#22C55E', // dark mode primary
  brandGold: '#EAB308',

  // Gradients
  gradientGreen: ['#16A34A', '#22C55E'],
  gradientPurple: ['#9333EA', '#A855F7'],
  gradientEmerald: ['#059669', '#10B981'],
  gradientGold: ['#CA8A04', '#EAB308'],

  // Neutrals (Dark Mode)
  darkBg: '#1E293B',
  darkSurface: '#263445',
  darkCardHover: '#334155',  // reused as hover
  darkBorder: '#334155',

  // Neutrals (Light Mode)
  lightBg: '#F8FAFC',
  lightSurface: '#FFFFFF',
  lightCardHover: '#F1F5F9',
  lightBorder: '#E2E8F0',

  // Text
  textMainLight: '#0F172A',
  textSubLight: '#475569',
  textMainDark: '#E2E8F0',
  textSubDark: '#94A3B8',
  white: '#FFFFFF',

  // Semantic Status
  success: '#16A34A',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',

  // Background statuses
  successBg: 'rgba(22, 163, 74, 0.12)',
  errorBg: 'rgba(239, 68, 68, 0.12)',
  warningBg: 'rgba(245, 158, 11, 0.12)',
  infoBg: 'rgba(59, 130, 246, 0.12)',

  // Overlays
  overlay: 'rgba(0,0,0,0.5)',
  glassLight: 'rgba(255,255,255,0.06)',
  glassDark: 'rgba(0,0,0,0.3)',
} as const;

export type ThemeMode = 'dark' | 'light';

export interface ThemeColors {
  bg: string;
  surface: string;
  card: string;
  cardHover: string;
  border: string;
  borderSubtle: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  textInverse: string;
  primary: string;
  primaryDark: string;
  primaryLight: string;
  accent: string;
  accentLight: string;
  success: string;
  successBg: string;
  warning: string;
  warningBg: string;
  error: string;
  errorBg: string;
  info: string;
  infoBg: string;
  pending: string;
  pendingBg: string;
  statusBar: 'light-content' | 'dark-content';
  tabBarBg: string;
  tabBarBorder: string;
  tabBarActive: string;
  tabBarInactive: string;
  inputBg: string;
  placeholder: string;
  shadow: string;
  glass: string;
}

export const darkTheme: ThemeColors = {
  bg: palette.darkBg,
  surface: palette.darkSurface,
  card: palette.darkSurface,
  cardHover: palette.darkCardHover,
  border: palette.darkBorder,
  borderSubtle: palette.darkBorder,
  text: palette.textMainDark,
  textSecondary: palette.textSubDark,
  textMuted: 'rgba(148, 163, 184, 0.5)',
  textInverse: palette.textMainLight,
  primary: palette.brandGreenDarkTheme,
  primaryDark: palette.brandGreen,
  primaryLight: '#4ADE80',
  accent: palette.brandGreenDarkTheme,
  accentLight: '#4ADE80',
  success: palette.brandGreenDarkTheme,
  successBg: palette.successBg,
  warning: palette.warning,
  warningBg: palette.warningBg,
  error: palette.error,
  errorBg: palette.errorBg,
  info: palette.info,
  infoBg: palette.infoBg,
  pending: '#8B5CF6',
  pendingBg: 'rgba(139,92,246,0.12)',
  statusBar: 'light-content',
  tabBarBg: palette.darkSurface,
  tabBarBorder: palette.darkBorder,
  tabBarActive: palette.brandGreenDarkTheme,
  tabBarInactive: palette.textSubDark,
  inputBg: palette.darkBg,
  placeholder: palette.textSubDark,
  shadow: '#000000',
  glass: palette.glassLight,
};

export const lightTheme: ThemeColors = {
  bg: palette.lightBg,
  surface: palette.lightSurface,
  card: palette.lightSurface,
  cardHover: palette.lightCardHover,
  border: palette.lightBorder,
  borderSubtle: palette.lightBorder,
  text: palette.textMainLight,
  textSecondary: palette.textSubLight,
  textMuted: 'rgba(71, 85, 105, 0.5)',
  textInverse: palette.white,
  primary: palette.brandGreen,
  primaryDark: palette.brandGreenHover,
  primaryLight: '#22C55E',
  accent: palette.brandGreen,
  accentLight: '#22C55E',
  success: palette.success,
  successBg: palette.successBg,
  warning: palette.warning,
  warningBg: palette.warningBg,
  error: palette.error,
  errorBg: palette.errorBg,
  info: palette.info,
  infoBg: palette.infoBg,
  pending: '#8B5CF6',
  pendingBg: 'rgba(139,92,246,0.12)',
  statusBar: 'dark-content',
  tabBarBg: palette.lightSurface,
  tabBarBorder: palette.lightBorder,
  tabBarActive: palette.brandGreen,
  tabBarInactive: palette.textSubLight,
  inputBg: palette.lightSurface,
  placeholder: palette.textSubLight,
  shadow: 'rgba(0,0,0,0.05)',
  glass: palette.glassDark,
};

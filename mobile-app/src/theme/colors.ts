/**
 * Sanyog Conformity – Premium Design System Colors
 * Supports Dark & Light mode with curated palettes.
 */

export const palette = {
  // Brand
  brandBlue: '#3B82F6',
  brandBlueDark: '#2563EB',
  brandBlueLight: '#60A5FA',
  brandGold: '#F59E0B',
  brandGoldLight: '#FBBF24',

  // Neutrals (Dark Mode)
  darkBg: '#080C14',
  darkSurface: '#0F1523',
  darkCard: '#161E30',
  darkCardHover: '#1C2640',
  darkBorder: '#1E293B',
  darkBorderSubtle: '#1A2236',

  // Neutrals (Light Mode)
  lightBg: '#F1F5F9',
  lightSurface: '#FFFFFF',
  lightCard: '#FFFFFF',
  lightCardHover: '#F8FAFC',
  lightBorder: '#E2E8F0',
  lightBorderSubtle: '#CBD5E1',

  // Text
  white: '#FFFFFF',
  white90: 'rgba(255,255,255,0.9)',
  white70: 'rgba(255,255,255,0.7)',
  white50: 'rgba(255,255,255,0.5)',
  white20: 'rgba(255,255,255,0.2)',
  black: '#0F172A',
  black90: 'rgba(15,23,42,0.9)',
  black70: 'rgba(15,23,42,0.7)',
  black50: 'rgba(15,23,42,0.5)',

  // Status
  success: '#10B981',
  successBg: 'rgba(16,185,129,0.12)',
  warning: '#F59E0B',
  warningBg: 'rgba(245,158,11,0.12)',
  error: '#EF4444',
  errorBg: 'rgba(239,68,68,0.12)',
  info: '#3B82F6',
  infoBg: 'rgba(59,130,246,0.12)',
  pending: '#8B5CF6',
  pendingBg: 'rgba(139,92,246,0.12)',

  // Gradients
  gradientBlue: ['#3B82F6', '#1D4ED8'] as [string, string],
  gradientGold: ['#F59E0B', '#D97706'] as [string, string],
  gradientDark: ['#0F1523', '#080C14'] as [string, string],
  gradientPurple: ['#8B5CF6', '#6D28D9'] as [string, string],
  gradientEmerald: ['#10B981', '#059669'] as [string, string],

  // Transparent overlays
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
  card: palette.darkCard,
  cardHover: palette.darkCardHover,
  border: palette.darkBorder,
  borderSubtle: palette.darkBorderSubtle,
  text: palette.white,
  textSecondary: palette.white70,
  textMuted: palette.white50,
  textInverse: palette.black,
  primary: palette.brandBlue,
  primaryDark: palette.brandBlueDark,
  primaryLight: palette.brandBlueLight,
  accent: palette.brandGold,
  accentLight: palette.brandGoldLight,
  success: palette.success,
  successBg: palette.successBg,
  warning: palette.warning,
  warningBg: palette.warningBg,
  error: palette.error,
  errorBg: palette.errorBg,
  info: palette.info,
  infoBg: palette.infoBg,
  pending: palette.pending,
  pendingBg: palette.pendingBg,
  statusBar: 'light-content',
  tabBarBg: palette.darkSurface,
  tabBarBorder: palette.darkBorder,
  tabBarActive: palette.brandBlue,
  tabBarInactive: palette.white50,
  inputBg: palette.darkCard,
  placeholder: palette.white50,
  shadow: '#000000',
  glass: palette.glassLight,
};

export const lightTheme: ThemeColors = {
  bg: palette.lightBg,
  surface: palette.lightSurface,
  card: palette.lightCard,
  cardHover: palette.lightCardHover,
  border: palette.lightBorder,
  borderSubtle: palette.lightBorderSubtle,
  text: palette.black,
  textSecondary: palette.black70,
  textMuted: palette.black50,
  textInverse: palette.white,
  primary: palette.brandBlue,
  primaryDark: palette.brandBlueDark,
  primaryLight: palette.brandBlueLight,
  accent: palette.brandGold,
  accentLight: palette.brandGoldLight,
  success: palette.success,
  successBg: palette.successBg,
  warning: palette.warning,
  warningBg: palette.warningBg,
  error: palette.error,
  errorBg: palette.errorBg,
  info: palette.info,
  infoBg: palette.infoBg,
  pending: palette.pending,
  pendingBg: palette.pendingBg,
  statusBar: 'dark-content',
  tabBarBg: palette.lightSurface,
  tabBarBorder: palette.lightBorder,
  tabBarActive: palette.brandBlue,
  tabBarInactive: palette.black50,
  inputBg: palette.lightBg,
  placeholder: palette.black50,
  shadow: 'rgba(0,0,0,0.08)',
  glass: palette.glassDark,
};

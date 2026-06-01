/**
 * Dice by Sanyog — Production Design System
 * Premium palette built for a B2B compliance platform.
 * Light: Clean white + forest green authority
 * Dark:  Deep navy + emerald accent
 */

export const palette = {
  // ── Brand ─────────────────────────────────────────────────────────────
  brandGreen: '#16A34A',
  brandGreenHover: '#15803D',
  brandGreenDark: '#166534',
  brandGreenDarkTheme: '#22C55E',
  brandGreenLight: '#4ADE80',
  brandGreenSubtle: '#DCFCE7',
  brandNavy: '#0A1628',
  brandNavyMid: '#0F2744',
  brandGold: '#EAB308',

  // ── Category Gradients ────────────────────────────────────────────────
  gradientGreen:   ['#16A34A', '#22C55E'] as string[],
  gradientNavy:    ['#0F2744', '#1E3A5F'] as string[],
  gradientPurple:  ['#7C3AED', '#A855F7'] as string[],
  gradientEmerald: ['#059669', '#10B981'] as string[],
  gradientGold:    ['#B45309', '#D97706'] as string[],
  gradientTeal:    ['#0E7490', '#0891B2'] as string[],
  gradientRose:    ['#BE185D', '#EC4899'] as string[],

  // ── Dark Mode Neutrals ────────────────────────────────────────────────
  darkBg:         '#080E1A',   // near-black navy
  darkBgAlt:      '#0D1526',   // slightly lighter
  darkSurface:    '#111C2E',   // card surface
  darkSurfaceAlt: '#162035',   // elevated card
  darkBorder:     '#1E2D42',
  darkBorderSoft: '#19273A',

  // ── Light Mode Neutrals ───────────────────────────────────────────────
  lightBg:         '#F5F7FA',  // warm-neutral bg
  lightBgAlt:      '#EEF1F6',  // section alt bg
  lightSurface:    '#FFFFFF',
  lightSurfaceAlt: '#FAFBFD',
  lightBorder:     '#E0E7EF',
  lightBorderSoft: '#EDF1F7',

  // ── Text ──────────────────────────────────────────────────────────────
  textMainLight:  '#0A1628',  // brand navy for headings
  textBodyLight:  '#1E293B',  // body text
  textSubLight:   '#475569',
  textMutedLight: '#94A3B8',
  textMainDark:   '#EFF4FB',
  textBodyDark:   '#C8D6E8',
  textSubDark:    '#7F96B2',
  textMutedDark:  '#4A637E',

  white:  '#FFFFFF',
  black:  '#000000',

  // ── Semantic ──────────────────────────────────────────────────────────
  success:   '#16A34A',
  successMid:'#15803D',
  error:     '#DC2626',
  warning:   '#D97706',
  info:      '#2563EB',
  purple:    '#7C3AED',
  teal:      '#0891B2',

  // ── Semantic backgrounds ──────────────────────────────────────────────
  successBg:  'rgba(22,163,74,0.10)',
  errorBg:    'rgba(220,38,38,0.10)',
  warningBg:  'rgba(217,119,6,0.10)',
  infoBg:     'rgba(37,99,235,0.10)',
  purpleBg:   'rgba(124,58,237,0.10)',
  tealBg:     'rgba(8,145,178,0.10)',

  // ── Overlays ──────────────────────────────────────────────────────────
  overlay:    'rgba(8,14,26,0.6)',
  overlayMid: 'rgba(8,14,26,0.35)',
  glassLight: 'rgba(255,255,255,0.08)',
  glassDark:  'rgba(0,0,0,0.25)',
} as const;

export type ThemeMode = 'dark' | 'light';

export interface ThemeColors {
  // Backgrounds
  bg: string;
  bgAlt: string;
  surface: string;
  surfaceAlt: string;
  card: string;
  cardHover: string;

  // Borders
  border: string;
  borderSubtle: string;
  borderFocus: string;

  // Text
  text: string;
  textBody: string;
  textSecondary: string;
  textMuted: string;
  textInverse: string;
  textOnPrimary: string;

  // Brand
  primary: string;
  primaryDark: string;
  primaryLight: string;
  primarySubtle: string;
  accent: string;

  // Status
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
  purple: string;
  purpleBg: string;
  teal: string;
  tealBg: string;

  // System
  statusBar: 'light-content' | 'dark-content';
  tabBarBg: string;
  tabBarBorder: string;
  tabBarActive: string;
  tabBarInactive: string;
  inputBg: string;
  inputBorder: string;
  placeholder: string;
  shadow: string;
  glass: string;
  overlay: string;

  // Gradients (convenience)
  heroGradient: string[];
  cardGradient: string[];
}

export const darkTheme: ThemeColors = {
  bg:            palette.darkBg,
  bgAlt:         palette.darkBgAlt,
  surface:       palette.darkSurface,
  surfaceAlt:    palette.darkSurfaceAlt,
  card:          palette.darkSurface,
  cardHover:     palette.darkSurfaceAlt,

  border:        palette.darkBorder,
  borderSubtle:  palette.darkBorderSoft,
  borderFocus:   palette.brandGreenDarkTheme,

  text:          palette.textMainDark,
  textBody:      palette.textBodyDark,
  textSecondary: palette.textSubDark,
  textMuted:     palette.textMutedDark,
  textInverse:   palette.textMainLight,
  textOnPrimary: palette.white,

  primary:       palette.brandGreenDarkTheme,
  primaryDark:   palette.brandGreen,
  primaryLight:  palette.brandGreenLight,
  primarySubtle: 'rgba(34,197,94,0.12)',
  accent:        palette.brandGreenDarkTheme,

  success:   palette.brandGreenDarkTheme,
  successBg: palette.successBg,
  warning:   '#FBBF24',
  warningBg: palette.warningBg,
  error:     '#F87171',
  errorBg:   palette.errorBg,
  info:      '#60A5FA',
  infoBg:    palette.infoBg,
  pending:   '#A78BFA',
  pendingBg: palette.purpleBg,
  purple:    '#A78BFA',
  purpleBg:  palette.purpleBg,
  teal:      '#22D3EE',
  tealBg:    palette.tealBg,

  statusBar:     'light-content',
  tabBarBg:      palette.darkSurface,
  tabBarBorder:  palette.darkBorder,
  tabBarActive:  palette.brandGreenDarkTheme,
  tabBarInactive:'#3D5470',
  inputBg:       palette.darkBgAlt,
  inputBorder:   palette.darkBorder,
  placeholder:   palette.textMutedDark,
  shadow:        '#000000',
  glass:         palette.glassLight,
  overlay:       palette.overlay,

  heroGradient: [palette.brandNavy, '#162035'],
  cardGradient: [palette.darkSurface, palette.darkSurfaceAlt],
};

export const lightTheme: ThemeColors = {
  bg:            palette.lightBg,
  bgAlt:         palette.lightBgAlt,
  surface:       palette.lightSurface,
  surfaceAlt:    palette.lightSurfaceAlt,
  card:          palette.lightSurface,
  cardHover:     palette.lightBgAlt,

  border:        palette.lightBorder,
  borderSubtle:  palette.lightBorderSoft,
  borderFocus:   palette.brandGreen,

  text:          palette.textMainLight,
  textBody:      palette.textBodyLight,
  textSecondary: palette.textSubLight,
  textMuted:     palette.textMutedLight,
  textInverse:   palette.white,
  textOnPrimary: palette.white,

  primary:       palette.brandGreen,
  primaryDark:   palette.brandGreenHover,
  primaryLight:  palette.brandGreenDarkTheme,
  primarySubtle: palette.brandGreenSubtle,
  accent:        palette.brandGreen,

  success:   palette.success,
  successBg: palette.successBg,
  warning:   palette.warning,
  warningBg: palette.warningBg,
  error:     palette.error,
  errorBg:   palette.errorBg,
  info:      palette.info,
  infoBg:    palette.infoBg,
  pending:   palette.purple,
  pendingBg: palette.purpleBg,
  purple:    palette.purple,
  purpleBg:  palette.purpleBg,
  teal:      palette.teal,
  tealBg:    palette.tealBg,

  statusBar:     'dark-content',
  tabBarBg:      palette.lightSurface,
  tabBarBorder:  palette.lightBorder,
  tabBarActive:  palette.brandGreen,
  tabBarInactive:'#94A3B8',
  inputBg:       palette.lightSurface,
  inputBorder:   palette.lightBorder,
  placeholder:   palette.textMutedLight,
  shadow:        'rgba(10,22,40,0.08)',
  glass:         palette.glassDark,
  overlay:       palette.overlay,

  heroGradient: [palette.brandNavy, palette.brandNavyMid],
  cardGradient: [palette.lightSurface, palette.lightSurfaceAlt],
};

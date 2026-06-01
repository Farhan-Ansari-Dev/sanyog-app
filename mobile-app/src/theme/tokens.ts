/**
 * Dice by Sanyog — Production Design Tokens
 */

export const typography = {
  // Weights
  light:     '300' as const,
  regular:   '400' as const,
  medium:    '500' as const,
  semiBold:  '600' as const,
  bold:      '700' as const,
  extraBold: '800' as const,
  black:     '900' as const,

  // Sizes
  xs:   11,
  sm:   12,
  base: 14,
  md:   15,
  lg:   17,
  xl:   20,
  '2xl': 24,
  '3xl': 28,
  '4xl': 34,
  '5xl': 42,

  // Letter spacing
  tighter: -0.8,
  tight_ls: -0.4,
  normal_ls: 0,
  wide: 0.3,
  wider: 0.6,
  widest: 1.2,

  // Line heights (multipliers)
  tight: 1.15,
  snug: 1.35,
  normal: 1.5,
  relaxed: 1.65,
  loose: 1.85,
} as const;

export const spacing = {
  '2xs': 2,
  xs:    4,
  sm:    8,
  md:   12,
  base: 16,
  lg:   20,
  xl:   24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  '5xl': 64,
  '6xl': 80,
} as const;

export const borderRadius = {
  xs:   4,
  sm:   8,
  md:   12,
  lg:   16,
  xl:   20,
  '2xl': 24,
  '3xl': 32,
  full: 9999,
} as const;

export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  xs: {
    shadowColor: '#0A1628',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  sm: {
    shadowColor: '#0A1628',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
  md: {
    shadowColor: '#0A1628',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 4,
  },
  lg: {
    shadowColor: '#0A1628',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.13,
    shadowRadius: 20,
    elevation: 7,
  },
  xl: {
    shadowColor: '#0A1628',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.17,
    shadowRadius: 30,
    elevation: 12,
  },
  green: {
    shadowColor: '#16A34A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 12,
    elevation: 5,
  },
} as const;

export const animation = {
  fast:   150,
  normal: 250,
  slow:   400,
  spring: { damping: 15, stiffness: 200 },
} as const;

export const zIndex = {
  base:    0,
  raised:  10,
  overlay: 100,
  modal:   200,
  toast:   300,
} as const;

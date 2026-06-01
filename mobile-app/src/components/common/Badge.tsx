/**
 * Badge — Versatile status/label pill
 */
import React from 'react';
import { View, Text, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { borderRadius, typography } from '../../theme';

type BadgeVariant = 'success' | 'error' | 'warning' | 'info' | 'pending' | 'neutral' | 'purple' | 'teal' | 'custom';

interface Props {
  label: string;
  variant?: BadgeVariant;
  size?: 'xs' | 'sm' | 'md';
  icon?: keyof typeof Ionicons.glyphMap;
  dot?: boolean;
  customColor?: string;
  style?: ViewStyle;
}

const VARIANT_COLORS: Record<BadgeVariant, { bg: string; text: string; dot: string }> = {
  success:  { bg: 'rgba(22,163,74,0.12)',   text: '#15803D', dot: '#16A34A' },
  error:    { bg: 'rgba(220,38,38,0.10)',   text: '#DC2626', dot: '#EF4444' },
  warning:  { bg: 'rgba(217,119,6,0.12)',   text: '#B45309', dot: '#D97706' },
  info:     { bg: 'rgba(37,99,235,0.10)',   text: '#1D4ED8', dot: '#3B82F6' },
  pending:  { bg: 'rgba(124,58,237,0.10)',  text: '#6D28D9', dot: '#7C3AED' },
  neutral:  { bg: 'rgba(100,116,139,0.10)', text: '#475569', dot: '#64748B' },
  purple:   { bg: 'rgba(124,58,237,0.10)',  text: '#6D28D9', dot: '#7C3AED' },
  teal:     { bg: 'rgba(8,145,178,0.10)',   text: '#0E7490', dot: '#0891B2' },
  custom:   { bg: 'rgba(22,163,74,0.12)',   text: '#15803D', dot: '#16A34A' },
};

export default function Badge({ label, variant = 'neutral', size = 'sm', icon, dot, customColor, style }: Props) {
  const colors = customColor
    ? { bg: customColor + '18', text: customColor, dot: customColor }
    : VARIANT_COLORS[variant];

  const padding = size === 'xs' ? { px: 6, py: 2 } : size === 'md' ? { px: 12, py: 5 } : { px: 9, py: 3 };
  const fontSize = size === 'xs' ? 9 : size === 'md' ? 12 : 11;
  const iconSize = size === 'xs' ? 9 : size === 'md' ? 13 : 11;
  const dotSize = size === 'xs' ? 5 : 6;

  return (
    <View style={[{
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.bg,
      borderRadius: borderRadius.full,
      paddingHorizontal: padding.px,
      paddingVertical: padding.py,
      gap: 4,
      alignSelf: 'flex-start',
    }, style]}>
      {dot && (
        <View style={{ width: dotSize, height: dotSize, borderRadius: dotSize / 2, backgroundColor: colors.dot }} />
      )}
      {icon && !dot && (
        <Ionicons name={icon} size={iconSize} color={colors.text} />
      )}
      <Text style={{ fontSize, fontWeight: '700', color: colors.text, letterSpacing: 0.1 }}>
        {label}
      </Text>
    </View>
  );
}

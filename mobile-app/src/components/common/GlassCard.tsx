/**
 * GlassCard – Enhanced card with elevation, press interaction, native shadows
 */
import React from 'react';
import { Pressable, ViewStyle, Platform } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { borderRadius, spacing } from '../../theme';

interface Props {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  variant?: 'default' | 'outlined' | 'elevated';
}

export default function GlassCard({ children, onPress, style, variant = 'default' }: Props) {
  const t = useTheme();

  const cardStyle: ViewStyle = {
    backgroundColor: t.card,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: t.borderSubtle,
    ...(variant === 'elevated' && {
      elevation: 4,
      shadowColor: t.shadow,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      borderWidth: 0,
    }),
    ...(variant === 'outlined' && {
      backgroundColor: 'transparent',
      borderColor: t.border,
      borderWidth: 1.5,
    }),
  };

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          cardStyle,
          pressed && {
            opacity: 0.85,
            transform: [{ scale: 0.98 }],
          },
          style,
        ]}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <Pressable style={[cardStyle, style]} disabled>
      {children}
    </Pressable>
  );
}

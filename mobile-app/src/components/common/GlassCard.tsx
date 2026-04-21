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
    borderRadius: borderRadius.xl,  // Upgraded soft corners
    padding: spacing.lg,            // Upgraded padding bounds
    borderWidth: 1,
    borderColor: t.borderSubtle,
    elevation: variant === 'default' ? 2 : 5,
    shadowColor: t.shadow,
    shadowOffset: { width: 0, height: variant === 'default' ? 2 : 6 },
    shadowOpacity: variant === 'default' ? 0.05 : 0.12,
    shadowRadius: variant === 'default' ? 8 : 14,
    ...(variant === 'outlined' && {
      backgroundColor: 'transparent',
      borderColor: t.border,
      borderWidth: 1.5,
      elevation: 0,
      shadowOpacity: 0,
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

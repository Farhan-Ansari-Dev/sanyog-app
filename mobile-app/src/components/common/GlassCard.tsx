/**
 * GlassCard — Production elevated card component
 */
import React from 'react';
import { View, Pressable, StyleSheet, ViewStyle, Animated } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { borderRadius, shadows, spacing } from '../../theme';

interface Props {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle | ViewStyle[];
  variant?: 'default' | 'elevated' | 'outlined' | 'flat' | 'tinted';
  tintColor?: string;
  disabled?: boolean;
  noPadding?: boolean;
}

export default function GlassCard({
  children,
  onPress,
  style,
  variant = 'default',
  tintColor,
  disabled,
  noPadding,
}: Props) {
  const t = useTheme();
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (!onPress) return;
    Animated.spring(scaleAnim, {
      toValue: 0.975,
      useNativeDriver: true,
      damping: 20,
      stiffness: 300,
    }).start();
  };

  const handlePressOut = () => {
    if (!onPress) return;
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      damping: 15,
      stiffness: 250,
    }).start();
  };

  const baseStyle: ViewStyle = {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
  };

  const variantStyle: ViewStyle =
    variant === 'elevated'
      ? { backgroundColor: t.card, borderColor: t.borderSubtle, borderWidth: 1, ...shadows.md }
      : variant === 'outlined'
      ? { backgroundColor: 'transparent', borderColor: t.border, borderWidth: 1.5 }
      : variant === 'flat'
      ? { backgroundColor: t.surfaceAlt, borderWidth: 0 }
      : variant === 'tinted'
      ? {
          backgroundColor: tintColor ? tintColor + '12' : t.primarySubtle,
          borderColor: tintColor ? tintColor + '28' : t.primary + '28',
          borderWidth: 1,
        }
      : { backgroundColor: t.card, borderColor: t.borderSubtle, borderWidth: 1, ...shadows.sm };

  const paddingStyle: ViewStyle = noPadding ? {} : { padding: spacing.lg };

  const combined = StyleSheet.flatten([baseStyle, variantStyle, paddingStyle, style]);

  if (onPress) {
    return (
      <Pressable onPress={disabled ? undefined : onPress} onPressIn={handlePressIn} onPressOut={handlePressOut} disabled={disabled}>
        <Animated.View style={[combined, { transform: [{ scale: scaleAnim }] }]}>
          {children}
        </Animated.View>
      </Pressable>
    );
  }

  return <View style={combined}>{children}</View>;
}

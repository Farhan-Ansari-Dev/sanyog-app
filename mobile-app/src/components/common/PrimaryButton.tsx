/**
 * PrimaryButton — Production action button with spring animations
 */
import React, { useRef } from 'react';
import {
  Pressable, Text, ActivityIndicator, ViewStyle, Animated, View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { borderRadius, shadows } from '../../theme';

interface Props {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  style?: ViewStyle;
}

export default function PrimaryButton({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
  icon,
  iconPosition = 'left',
  size = 'md',
  fullWidth = true,
  style,
}: Props) {
  const t = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const sizes = {
    sm: { py: 10, px: 18, fontSize: 13, iconSize: 15, radius: borderRadius.md },
    md: { py: 14, px: 22, fontSize: 15, iconSize: 18, radius: borderRadius.lg },
    lg: { py: 17, px: 26, fontSize: 16, iconSize: 19, radius: borderRadius.lg },
  };
  const s = sizes[size];

  const handlePressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.96, useNativeDriver: true, damping: 18, stiffness: 280 }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, damping: 14, stiffness: 220 }).start();
  };

  const isDisabled = disabled || loading;

  const variantStyles = (): { bg: string; border?: string; shadow?: object; textColor: string } => {
    switch (variant) {
      case 'primary':
        return { bg: t.primary, shadow: shadows.green, textColor: '#FFFFFF' };
      case 'secondary':
        return { bg: t.surface, border: t.border, shadow: shadows.xs, textColor: t.text };
      case 'outline':
        return { bg: 'transparent', border: t.primary, textColor: t.primary };
      case 'ghost':
        return { bg: t.primarySubtle, textColor: t.primary };
      case 'danger':
        return { bg: t.errorBg, border: t.error + '35', textColor: t.error };
      case 'success':
        return { bg: t.successBg, border: t.success + '35', textColor: t.success };
      default:
        return { bg: t.primary, textColor: '#FFFFFF' };
    }
  };

  const vs = variantStyles();

  const containerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: s.radius,
    paddingVertical: s.py,
    paddingHorizontal: s.px,
    backgroundColor: vs.bg,
    borderWidth: vs.border ? 1.5 : 0,
    borderColor: vs.border ?? 'transparent',
    ...(vs.shadow ?? {}),
    ...(fullWidth ? {} : { alignSelf: 'flex-start' as const }),
  };

  return (
    <Pressable
      onPress={isDisabled ? undefined : onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isDisabled}
    >
      <Animated.View
        style={[
          containerStyle,
          isDisabled && { opacity: 0.45 },
          { transform: [{ scale: scaleAnim }] },
          style,
        ]}
      >
        {loading ? (
          <ActivityIndicator color={vs.textColor} size="small" />
        ) : (
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            {icon && iconPosition === 'left' && (
              <Ionicons name={icon} size={s.iconSize} color={vs.textColor} style={{ marginRight: 7 }} />
            )}
            <Text style={{ color: vs.textColor, fontSize: s.fontSize, fontWeight: 'bold' }}>
              {title}
            </Text>
            {icon && iconPosition === 'right' && (
              <Ionicons name={icon} size={s.iconSize} color={vs.textColor} style={{ marginLeft: 7 }} />
            )}
          </View>
        )}
      </Animated.View>
    </Pressable>
  );
}

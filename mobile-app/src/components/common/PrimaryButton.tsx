/**
 * PrimaryButton – Premium action button with native-optimized touch feedback
 * Supports variants, sizes, loading states, icons
 */
import React from 'react';
import { Pressable, Text, ActivityIndicator, ViewStyle, TextStyle, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { borderRadius, spacing, typography } from '../../theme';

interface Props {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
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

  const sizes = {
    sm: { py: 10, px: 16, fontSize: 13, iconSize: 16, radius: 10 },
    md: { py: 14, px: 20, fontSize: 15, iconSize: 18, radius: 12 },
    lg: { py: 18, px: 24, fontSize: 17, iconSize: 20, radius: 14 },
  };

  const s = sizes[size];

  const getStyles = (): { container: ViewStyle; textColor: string } => {
    const base: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: s.radius,
      paddingVertical: s.py,
      paddingHorizontal: s.px,
      ...(fullWidth ? {} : { alignSelf: 'flex-start' as const }),
    };

    switch (variant) {
      case 'primary':
        return {
          container: {
            ...base,
            backgroundColor: t.primary,
            elevation: 4,
            shadowColor: t.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
          },
          textColor: '#FFFFFF',
        };
      case 'secondary':
        return {
          container: {
            ...base,
            backgroundColor: t.card,
            borderWidth: 1,
            borderColor: t.border,
            elevation: 2,
            shadowColor: t.shadow,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.06,
            shadowRadius: 3,
          },
          textColor: t.text,
        };
      case 'outline':
        return {
          container: {
            ...base,
            backgroundColor: 'transparent',
            borderWidth: 1.5,
            borderColor: t.primary,
          },
          textColor: t.primary,
        };
      case 'ghost':
        return {
          container: {
            ...base,
            backgroundColor: 'transparent',
          },
          textColor: t.textSecondary,
        };
      case 'danger':
        return {
          container: {
            ...base,
            backgroundColor: t.errorBg,
            borderWidth: 1,
            borderColor: t.error + '40',
          },
          textColor: t.error,
        };
      default:
        return { container: base, textColor: t.text };
    }
  };

  const { container, textColor } = getStyles();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      android_ripple={
        variant === 'primary'
          ? { color: 'rgba(255,255,255,0.2)', borderless: false }
          : { color: t.primary + '15', borderless: false }
      }
      style={({ pressed }) => [
        container,
        (disabled || loading) && { opacity: 0.5 },
        pressed && Platform.OS === 'ios' && {
          opacity: 0.85,
          transform: [{ scale: 0.97 }],
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <Ionicons name={icon} size={s.iconSize} color={textColor} style={{ marginRight: 8 }} />
          )}
          <Text
            style={{
              color: textColor,
              fontSize: s.fontSize,
              fontWeight: '700',
              letterSpacing: 0.3,
            }}
          >
            {title}
          </Text>
          {icon && iconPosition === 'right' && (
            <Ionicons name={icon} size={s.iconSize} color={textColor} style={{ marginLeft: 8 }} />
          )}
        </>
      )}
    </Pressable>
  );
}

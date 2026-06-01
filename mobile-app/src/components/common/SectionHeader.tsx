/**
 * SectionHeader — Production section title with pill action
 */
import React from 'react';
import { View, Text, Pressable, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { spacing, typography, borderRadius } from '../../theme';

interface Props {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: ViewStyle;
  size?: 'sm' | 'md' | 'lg';
}

export default function SectionHeader({ title, subtitle, actionLabel, onAction, style, size = 'md' }: Props) {
  const t = useTheme();

  const titleSize = size === 'lg' ? 22 : size === 'sm' ? 16 : 19;

  return (
    <View
      style={[{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        marginTop: spacing.xl,
        marginBottom: spacing.md,
      }, style]}
    >
      <View style={{ flex: 1 }}>
        <Text style={{
          fontSize: titleSize,
          fontWeight: '800',
          color: t.text,
          letterSpacing: -0.4,
          lineHeight: titleSize * 1.2,
        }}>
          {title}
        </Text>
        {subtitle && (
          <Text style={{
            fontSize: typography.sm,
            color: t.textMuted,
            marginTop: 3,
            fontWeight: '400',
            lineHeight: 17,
          }}>
            {subtitle}
          </Text>
        )}
      </View>
      {actionLabel && onAction && (
        <Pressable
          onPress={onAction}
          hitSlop={10}
          style={({ pressed }) => ({
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: borderRadius.full,
            backgroundColor: pressed ? t.primarySubtle : t.primarySubtle,
            gap: 3,
          })}
        >
          <Text style={{ fontSize: 12, fontWeight: '700', color: t.primary }}>
            {actionLabel}
          </Text>
          <Ionicons name="arrow-forward" size={12} color={t.primary} />
        </Pressable>
      )}
    </View>
  );
}

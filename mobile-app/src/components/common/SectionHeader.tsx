/**
 * SectionHeader – Section title with optional subtitle and action
 */
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { spacing, typography } from '../../theme';

interface Props {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function SectionHeader({ title, subtitle, actionLabel, onAction }: Props) {
  const t = useTheme();

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingHorizontal: spacing.lg,
        marginTop: spacing.xl,
        marginBottom: spacing.base,
      }}
    >
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: '900',
            color: t.text,
            letterSpacing: -0.3,
          }}
        >
          {title}
        </Text>
        {subtitle && (
          <Text
            style={{
              fontSize: 13,
              color: t.textMuted,
              marginTop: 2,
              fontWeight: '500',
            }}
          >
            {subtitle}
          </Text>
        )}
      </View>
      {actionLabel && onAction && (
        <Pressable
          onPress={onAction}
          hitSlop={8}
          style={({ pressed }) => ({
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 20,
            backgroundColor: pressed ? t.primary + '15' : 'transparent',
          })}
        >
          <Text
            style={{
              fontSize: 13,
              fontWeight: '700',
              color: t.primary,
              marginRight: 4,
            }}
          >
            {actionLabel}
          </Text>
          <Ionicons name="arrow-forward" size={14} color={t.primary} />
        </Pressable>
      )}
    </View>
  );
}

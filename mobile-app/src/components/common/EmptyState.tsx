/**
 * EmptyState — Production-quality empty/error placeholder
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { borderRadius, spacing, typography } from '../../theme';
import PrimaryButton from './PrimaryButton';

interface Props {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
  compact?: boolean;
}

export default function EmptyState({
  icon = 'cube-outline',
  title,
  subtitle,
  actionLabel,
  onAction,
  secondaryLabel,
  onSecondary,
  compact = false,
}: Props) {
  const t = useTheme();

  return (
    <View style={[styles.container, compact && styles.compact]}>
      <View style={[styles.iconWrap, { backgroundColor: t.primarySubtle }]}>
        <Ionicons name={icon} size={compact ? 28 : 36} color={t.primary} />
      </View>
      <Text style={[styles.title, { color: t.text }]} numberOfLines={2}>
        {title}
      </Text>
      {subtitle && (
        <Text style={[styles.subtitle, { color: t.textMuted }]}>
          {subtitle}
        </Text>
      )}
      {actionLabel && onAction && (
        <PrimaryButton
          title={actionLabel}
          onPress={onAction}
          size="sm"
          fullWidth={false}
          style={{ marginTop: compact ? 12 : 16 }}
        />
      )}
      {secondaryLabel && onSecondary && (
        <PrimaryButton
          title={secondaryLabel}
          onPress={onSecondary}
          variant="ghost"
          size="sm"
          fullWidth={false}
          style={{ marginTop: 8 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing['4xl'],
    paddingHorizontal: spacing['2xl'],
  },
  compact: {
    paddingVertical: spacing['2xl'],
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: borderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.lg,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: -0.2,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: typography.base,
    textAlign: 'center',
    lineHeight: 21,
    maxWidth: 280,
  },
});

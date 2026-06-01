/**
 * LoadingSkeleton — Shimmer placeholder for loading states
 */
import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { borderRadius } from '../../theme';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadiusSize?: number;
  style?: ViewStyle;
}

export function Skeleton({ width = '100%', height = 16, borderRadiusSize = borderRadius.sm, style }: SkeletonProps) {
  const t = useTheme();
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(shimmer, { toValue: 0, duration: 900, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const opacity = shimmer.interpolate({ inputRange: [0, 1], outputRange: [0.4, 0.9] });

  return (
    <Animated.View
      style={[
        {
          width: width as any,
          height,
          borderRadius: borderRadiusSize,
          backgroundColor: t.border,
          opacity,
        },
        style,
      ]}
    />
  );
}

// Pre-built skeleton layouts
export function CardSkeleton() {
  const t = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: t.card, borderColor: t.borderSubtle }]}>
      <View style={styles.row}>
        <Skeleton width={44} height={44} borderRadiusSize={borderRadius.md} />
        <View style={{ flex: 1, marginLeft: 12, gap: 8 }}>
          <Skeleton height={14} width="60%" />
          <Skeleton height={11} width="40%" />
        </View>
      </View>
      <View style={{ marginTop: 14, gap: 8 }}>
        <Skeleton height={11} />
        <Skeleton height={11} width="80%" />
        <Skeleton height={11} width="55%" />
      </View>
    </View>
  );
}

export function ListItemSkeleton() {
  const t = useTheme();
  return (
    <View style={[styles.listItem, { borderBottomColor: t.borderSubtle }]}>
      <Skeleton width={40} height={40} borderRadiusSize={borderRadius.md} />
      <View style={{ flex: 1, marginLeft: 12, gap: 7 }}>
        <Skeleton height={13} width="70%" />
        <Skeleton height={10} width="45%" />
      </View>
      <Skeleton width={60} height={24} borderRadiusSize={borderRadius.full} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    paddingHorizontal: 20,
  },
});

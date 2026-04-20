import React, { useEffect, useRef } from 'react';
import { Animated, ViewStyle } from 'react-native';
import { useAppStore } from '../store/useAppStore';

interface SkeletonProps {
  style?: ViewStyle | ViewStyle[];
  variant?: 'rectangular' | 'circular' | 'text';
}

export default function Skeleton({ style, variant = 'rectangular' }: SkeletonProps) {
  const isDark = useAppStore(s => s.theme) === 'dark';
  const fadeAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [fadeAnim]);

  let borderRadius = 12;
  if (variant === 'circular') borderRadius = 999;
  if (variant === 'text') borderRadius = 4;

  const backgroundColor = isDark ? '#1E293B' : '#E2E8F0';

  return (
    <Animated.View
      style={[
        { backgroundColor, borderRadius, opacity: fadeAnim },
        style,
      ]}
    />
  );
}

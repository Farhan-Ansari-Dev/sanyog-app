/**
 * OnboardingScreen – Premium 3-screen onboarding with animated pagination
 * Fixed for native Android/iOS with reliable scrolling
 */
import React, { useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StatusBar,
  SafeAreaView,
  useWindowDimensions,
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Platform,
  ViewToken,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { useAppStore } from '../../store/useAppStore';
import { spacing, typography, borderRadius } from '../../theme';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Onboarding'>;

interface Slide {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconBg: string;
  title: string;
  subtitle: string;
  description: string;
}

const slides: Slide[] = [
  {
    id: '1',
    icon: 'shield-checkmark',
    iconBg: '#10B981',
    title: 'Global Compliance\nSimplified',
    subtitle: 'BSWIFT BY SANYOG',
    description:
      'Navigate complex certification requirements across 50+ countries with our expert guidance. From BIS to SASO, we handle it all.',
  },
  {
    id: '2',
    icon: 'document-text',
    iconBg: '#34D399',
    title: 'Apply & Track\nin Real-Time',
    subtitle: 'SEAMLESS WORKFLOW',
    description:
      'Submit applications, upload documents, and track progress from submission to approval — all from your mobile device.',
  },
  {
    id: '3',
    icon: 'rocket',
    iconBg: '#059669',
    title: 'Expert Support\nat Every Step',
    subtitle: 'TRUSTED BY 500+ BUSINESSES',
    description:
      'Our certification specialists provide personalized guidance, smart document checklists, and live status updates.',
  },
];

export default function OnboardingScreen({ navigation }: Props) {
  const t = useTheme();
  const { width, height } = useWindowDimensions();
  const setOnboardingSeen = useAppStore((s) => s.setOnboardingSeen);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  // Use onViewableItemsChanged for reliable index tracking on native
  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;
  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setCurrentIndex(viewableItems[0].index);
      }
    },
    []
  );

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      const nextIndex = currentIndex + 1;
      flatListRef.current?.scrollToOffset({
        offset: nextIndex * width,
        animated: true,
      });
      setCurrentIndex(nextIndex);
    } else {
      setOnboardingSeen();
      navigation.replace('Login');
    }
  };

  const handleSkip = () => {
    setOnboardingSeen();
    navigation.replace('Login');
  };

  const isLastSlide = currentIndex === slides.length - 1;

  const renderSlide = ({ item, index }: { item: Slide; index: number }) => (
    <View
      style={{
        width,
        paddingHorizontal: spacing['2xl'],
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Animated Icon Circle */}
      <View
        style={{
          width: 140,
          height: 140,
          borderRadius: 70,
          backgroundColor: item.iconBg + '12',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: spacing['2xl'],
        }}
      >
        <View
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: item.iconBg + '20',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Ionicons name={item.icon} size={48} color={item.iconBg} />
        </View>
      </View>

      {/* Subtitle Tag */}
      <View
        style={{
          backgroundColor: t.primary + '12',
          paddingHorizontal: spacing.base,
          paddingVertical: spacing.xs,
          borderRadius: borderRadius.full,
          marginBottom: spacing.lg,
        }}
      >
        <Text
          style={{
            fontSize: 10,
            fontWeight: '800',
            color: t.primary,
            letterSpacing: 2,
          }}
        >
          {item.subtitle}
        </Text>
      </View>

      {/* Title */}
      <Text
        style={{
          fontSize: 32,
          fontWeight: '900',
          color: t.text,
          textAlign: 'center',
          lineHeight: 40,
          letterSpacing: -0.5,
          marginBottom: spacing.lg,
        }}
      >
        {item.title}
      </Text>

      {/* Description */}
      <Text
        style={{
          fontSize: 15,
          color: t.textSecondary,
          textAlign: 'center',
          lineHeight: 24,
          paddingHorizontal: spacing.md,
        }}
      >
        {item.description}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }}>
      <StatusBar barStyle={t.statusBar} backgroundColor={t.bg} />

      {/* Skip Button */}
      <View style={{ alignItems: 'flex-end', paddingHorizontal: spacing.xl, paddingTop: spacing.lg }}>
        <Pressable
          onPress={handleSkip}
          hitSlop={16}
          style={({ pressed }) => ({
            paddingHorizontal: spacing.base,
            paddingVertical: spacing.xs,
            borderRadius: borderRadius.full,
            backgroundColor: pressed ? t.border + '50' : 'transparent',
          })}
        >
          <Text
            style={{
              fontSize: typography.sm,
              fontWeight: '600',
              color: t.textMuted,
            }}
          >
            Skip
          </Text>
        </Pressable>
      </View>

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        style={{ flex: 1 }}
        contentContainerStyle={{ alignItems: 'center' }}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />

      {/* Bottom Controls */}
      <View
        style={{
          paddingHorizontal: spacing['2xl'],
          paddingBottom: Platform.OS === 'ios' ? spacing['2xl'] : spacing['3xl'],
          paddingTop: spacing.lg,
        }}
      >
        {/* Animated Dots */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: spacing.xl }}>
          {slides.map((_, i) => {
            const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [8, 28, 8],
              extrapolate: 'clamp',
            });
            const dotOpacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.3, 1, 0.3],
              extrapolate: 'clamp',
            });
            return (
              <Animated.View
                key={i}
                style={{
                  width: dotWidth,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: t.primary,
                  opacity: dotOpacity,
                  marginRight: i < slides.length - 1 ? 8 : 0,
                }}
              />
            );
          })}
        </View>

        {/* Action Button — Full Width */}
        <Pressable
          onPress={handleNext}
          style={({ pressed }) => ({
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            height: 56,
            borderRadius: borderRadius.lg,
            backgroundColor: isLastSlide ? '#10B981' : t.primary,
            opacity: pressed ? 0.85 : 1,
            transform: [{ scale: pressed ? 0.98 : 1 }],
            elevation: 4,
            shadowColor: isLastSlide ? '#10B981' : t.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
          })}
        >
          <Text
            style={{
              fontSize: 17,
              fontWeight: '700',
              color: '#FFFFFF',
              marginRight: spacing.sm,
            }}
          >
            {isLastSlide ? 'Get Started' : 'Next'}
          </Text>
          <Ionicons
            name={isLastSlide ? 'arrow-forward-circle' : 'arrow-forward'}
            size={22}
            color="#FFFFFF"
          />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

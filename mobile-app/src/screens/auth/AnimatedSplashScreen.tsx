import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, StatusBar, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { spacing, typography } from '../../theme';

const { width } = Dimensions.get('window');

export default function AnimatedSplashScreen({ navigation }: any) {
  const t = useTheme();
  
  // Animation values
  const rotateY = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.3)).current;
  const fadeText = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    // Sequence of animations
    Animated.sequence([
      // 1. Zoom and rotate cube
      Animated.parallel([
        Animated.spring(scale, {
          toValue: 1,
          friction: 4,
          useNativeDriver: true,
        }),
        Animated.loop(
          Animated.timing(rotateY, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          { iterations: 2 }
        )
      ]),
      // 2. Fade in text
      Animated.parallel([
        Animated.timing(fadeText, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        })
      ])
    ]).start();

    // Navigate to Onboarding after 3.5 seconds
    const timer = setTimeout(() => {
      navigation.replace('Onboarding');
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  const spin = rotateY.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={[styles.container, { backgroundColor: '#0A0E1A' }]}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0E1A" />
      
      {/* Decorative background glow */}
      <View style={styles.glow} />

      {/* Animated Certification Block */}
      <Animated.View 
        style={[
          styles.cubeContainer,
          { 
            transform: [
              { scale },
              { rotateY: spin },
              { perspective: 1000 }
            ] 
          }
        ]}
      >
        <View style={styles.diceFace}>
           <Ionicons name="shield-checkmark" size={54} color="#0A0E1A" />
        </View>
      </Animated.View>

      {/* Brand Text */}
      <Animated.View style={{ opacity: fadeText, transform: [{ translateY }], marginTop: spacing.xl, alignItems: 'center' }}>
        <Text style={[styles.diceText, { color: '#FFFFFF' }]}>DICE</Text>
        <View style={styles.byRow}>
          <Text style={styles.byText}>by</Text>
          <Text style={styles.sanyogText}>Sanyog</Text>
        </View>
      </Animated.View>

      <Text style={styles.footerText}>Digital Identity & Certification Ecosystem</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glow: {
    position: 'absolute',
    width: width,
    height: width,
    borderRadius: width / 2,
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
    top: '30%',
  },
  cubeContainer: {
    width: 100,
    height: 100,
  },
  diceFace: {
    width: 110,
    height: 110,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 20,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
  },
  diceText: {
    fontSize: 48,
    fontWeight: '900',
    letterSpacing: 4,
    textShadowColor: 'rgba(255, 255, 255, 0.4)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 10,
  },
  byRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  byText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    textTransform: 'uppercase',
    fontWeight: '700',
    letterSpacing: 1,
    marginRight: 6,
  },
  sanyogText: {
    fontSize: 18,
    color: '#10B981',
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  footerText: {
    position: 'absolute',
    bottom: 50,
    fontSize: 10,
    color: 'rgba(255,255,255,0.3)',
    textTransform: 'uppercase',
    fontWeight: '700',
    letterSpacing: 2,
    textAlign: 'center',
  }
});

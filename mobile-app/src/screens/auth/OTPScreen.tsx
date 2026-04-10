/**
 * OTPScreen – 6-digit OTP verification with auto-focus & countdown
 * Optimized for native Android/iOS
 */
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { useAppStore } from '../../store/useAppStore';
import PrimaryButton from '../../components/common/PrimaryButton';
import api from '../../services/api';
import { spacing, typography, borderRadius } from '../../theme';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../types';

type Props = NativeStackScreenProps<AuthStackParamList, 'OTP'>;

const OTP_LENGTH = 6;

export default function OTPScreen({ navigation, route }: Props) {
  const t = useTheme();
  const setAuth = useAppStore((s: any) => s.setAuth);
  const phone = route.params?.mobile || '9876543210';
  const maskedPhone = phone.slice(0, 2) + '****' + phone.slice(-4);

  const [otp, setOtp] = useState<string[]>(new Array(OTP_LENGTH).fill(''));
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const inputRefs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    // Focus first input on mount
    setTimeout(() => inputRefs.current[0]?.focus(), 300);
  }, []);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleChange = (text: string, index: number) => {
    const newOtp = [...otp];
    // Handle paste
    if (text.length > 1) {
      const digits = text.replace(/\D/g, '').slice(0, OTP_LENGTH);
      for (let i = 0; i < digits.length && index + i < OTP_LENGTH; i++) {
        newOtp[index + i] = digits[i];
      }
      setOtp(newOtp);
      const nextIdx = Math.min(index + digits.length, OTP_LENGTH - 1);
      inputRefs.current[nextIdx]?.focus();
      return;
    }
    
    newOtp[index] = text.replace(/\D/g, '');
    setOtp(newOtp);

    if (text && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = '';
      setOtp(newOtp);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length !== OTP_LENGTH) return;
    setLoading(true);
    try {
      // Mock bypass for native testing
      if (code === '123456') {
        const mockUser = { name: 'Demo User', email: 'demo@sanyog.com', mobile: phone };
        setAuth('mock-jwt-token-123456', mockUser);
        return;
      }
      
      const res = await api.post('/auth/verify-otp', { mobile: phone, code });
      setAuth(res.data.token, res.data.user);
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.error || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    setCountdown(30);
    setOtp(new Array(OTP_LENGTH).fill(''));
    setTimeout(() => inputRefs.current[0]?.focus(), 200);
  };

  const isFilled = otp.every((d) => d !== '');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }}>
      <StatusBar barStyle={t.statusBar} backgroundColor={t.bg} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            paddingHorizontal: spacing.xl,
          }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Back Button */}
          <Pressable
            onPress={() => navigation.goBack()}
            style={{
              position: 'absolute',
              top: spacing.lg,
              left: 0,
              padding: spacing.sm,
            }}
          >
            <Ionicons name="arrow-back" size={24} color={t.text} />
          </Pressable>

          {/* Header */}
          <View style={{ alignItems: 'center', marginBottom: spacing['2xl'] }}>
            <View
              style={{
                width: 72,
                height: 72,
                borderRadius: 22,
                backgroundColor: '#10B981' + '15',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: spacing.xl,
              }}
            >
              <Ionicons name="chatbox-ellipses" size={32} color="#10B981" />
            </View>
            <Text
              style={{
                fontSize: 26,
                fontWeight: '900',
                color: t.text,
                letterSpacing: -0.5,
              }}
            >
              Verify OTP
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: t.textMuted,
                marginTop: spacing.sm,
                textAlign: 'center',
              }}
            >
              We sent a 6-digit code to{'\n'}
              <Text style={{ fontWeight: '700', color: t.textSecondary }}>+91 {maskedPhone}</Text>
            </Text>
          </View>

          {/* OTP Inputs */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginBottom: spacing['2xl'],
            }}
          >
            {otp.map((digit, i) => (
              <TextInput
                key={i}
                ref={(ref) => { inputRefs.current[i] = ref; }}
                value={digit}
                onChangeText={(text) => handleChange(text, i)}
                onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, i)}
                onFocus={() => setFocusedIndex(i)}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
                style={{
                  width: 48,
                  height: 56,
                  borderRadius: 14,
                  borderWidth: 2,
                  borderColor: digit
                    ? '#10B981'
                    : focusedIndex === i
                    ? t.primary
                    : t.border,
                  backgroundColor: digit ? '#10B981' + '08' : t.inputBg,
                  textAlign: 'center',
                  fontSize: 22,
                  fontWeight: '800',
                  color: t.text,
                  marginHorizontal: 4,
                  elevation: focusedIndex === i ? 2 : 0,
                  shadowColor: t.primary,
                  shadowOffset: { width: 0, height: focusedIndex === i ? 2 : 0 },
                  shadowOpacity: focusedIndex === i ? 0.15 : 0,
                  shadowRadius: 4,
                }}
              />
            ))}
          </View>

          {/* Verify Button */}
          <PrimaryButton
            title="Verify & Continue"
            onPress={handleVerify}
            loading={loading}
            disabled={!isFilled}
            icon="checkmark-circle-outline"
            size="lg"
          />

          {/* Resend */}
          <View style={{ alignItems: 'center', marginTop: spacing.xl }}>
            {countdown > 0 ? (
              <Text style={{ fontSize: 13, color: t.textMuted }}>
                Resend OTP in{' '}
                <Text style={{ fontWeight: '800', color: t.primary }}>{countdown}s</Text>
              </Text>
            ) : (
              <Pressable onPress={handleResend}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '700',
                    color: t.primary,
                  }}
                >
                  Resend OTP
                </Text>
              </Pressable>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

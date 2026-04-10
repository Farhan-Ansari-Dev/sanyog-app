/**
 * LoginScreen – Phone-based auth with premium native UI
 */
import React, { useState } from 'react';
import { Alert } from 'react-native';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import PrimaryButton from '../../components/common/PrimaryButton';
import api from '../../services/api';
import { spacing, typography, borderRadius } from '../../theme';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const t = useTheme();
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const isValid = phone.replace(/\D/g, '').length === 10;

  const handleSend = async () => {
    if (!isValid) return;
    setLoading(true);
    try {
      // Mock bypass: Do not hit backend to prevent SMS provider crash
      navigation.navigate('OTP', { mobile: phone });
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.error || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

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
          {/* Logo */}
          <View style={{ alignItems: 'center', marginBottom: spacing['3xl'] }}>
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 24,
                backgroundColor: t.primary + '12',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: spacing.xl,
              }}
            >
              <Ionicons name="shield-checkmark" size={40} color={t.primary} />
            </View>
            <Text
              style={{
                fontSize: 28,
                fontWeight: '900',
                color: t.text,
                letterSpacing: -0.5,
              }}
            >
              Welcome Back
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: t.textMuted,
                marginTop: spacing.sm,
              }}
            >
              Sign in to manage your certifications
            </Text>
          </View>

          {/* Phone Input */}
          <Text
            style={{
              fontSize: 11,
              fontWeight: '800',
              color: t.textMuted,
              letterSpacing: 1.5,
              textTransform: 'uppercase',
              marginBottom: spacing.sm,
            }}
          >
            Mobile Number
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: t.inputBg,
              borderRadius: borderRadius.lg,
              borderWidth: 1.5,
              borderColor: phone.length > 0 ? t.primary + '60' : t.border,
              paddingHorizontal: spacing.base,
              marginBottom: spacing.xl,
              elevation: 1,
              shadowColor: t.shadow,
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 2,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: '700',
                color: t.textSecondary,
                marginRight: spacing.sm,
              }}
            >
              +91
            </Text>
            <View
              style={{
                width: 1,
                height: 24,
                backgroundColor: t.border,
                marginRight: spacing.sm,
              }}
            />
            <TextInput
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter 10-digit number"
              placeholderTextColor={t.placeholder}
              keyboardType="phone-pad"
              maxLength={10}
              style={{
                flex: 1,
                fontSize: 16,
                color: t.text,
                fontWeight: '500',
                paddingVertical: Platform.OS === 'ios' ? 16 : 14,
              }}
            />
            {isValid && (
              <Ionicons name="checkmark-circle" size={22} color="#10B981" />
            )}
          </View>

          {/* Send OTP */}
          <PrimaryButton
            title="Send OTP"
            onPress={handleSend}
            loading={loading}
            disabled={!isValid}
            icon="paper-plane-outline"
            size="lg"
          />

          {/* Footer Note */}
          <Text
            style={{
              fontSize: 12,
              color: t.textMuted,
              textAlign: 'center',
              marginTop: spacing.xl,
              lineHeight: 18,
            }}
          >
            In development mode, OTP is printed in backend logs.{'\n'}
            For demo, use any 10-digit number.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

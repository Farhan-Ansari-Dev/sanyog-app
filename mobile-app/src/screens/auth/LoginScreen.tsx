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
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const isValid = email.includes('@') && email.includes('.');

  const handleSend = async () => {
    if (!isValid) return;
    setLoading(true);
    try {
      await api.post('/auth/send-otp', { email });
      navigation.navigate('OTP', { email });
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
              Partner Login
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: t.textMuted,
                marginTop: spacing.sm,
              }}
            >
              Sign in with your Email ID
            </Text>
          </View>

          {/* Email Input */}
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
            Email Address
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: t.inputBg,
              borderRadius: borderRadius.lg,
              borderWidth: 1.5,
              borderColor: email.length > 0 ? t.primary + '60' : t.border,
              paddingHorizontal: spacing.base,
              marginBottom: spacing.xl,
              elevation: 1,
              shadowColor: t.shadow,
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 2,
            }}
          >
            <Ionicons name="mail-outline" size={20} color={t.textMuted} style={{ marginRight: spacing.sm }} />
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="name@company.com"
              placeholderTextColor={t.placeholder}
              keyboardType="email-address"
              autoCapitalize="none"
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

          {/* Mobile Login Option (Commented for later) */}
          {/* 
          <Pressable style={{ marginBottom: spacing.lg }}>
            <Text style={{ color: t.primary, fontWeight: '600' }}>Login with Mobile Number</Text>
          </Pressable> 
          */}

          {/* Send OTP */}
          <PrimaryButton
            title="Get OTP on Email"
            onPress={handleSend}
            loading={loading}
            disabled={!isValid}
            icon="paper-plane-outline"
            size="lg"
          />

          <Text
            style={{
              fontSize: 12,
              color: t.textMuted,
              textAlign: 'center',
              marginTop: spacing.xl,
              lineHeight: 18,
            }}
          >
            Email OTP is currently mandatory.{'\n'}
            Mobile registration option will be added later.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

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
import { useAppStore } from '../../store/useAppStore';
import { spacing, typography, borderRadius } from '../../theme';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const t = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const isValid = email.includes('@') && email.includes('.');
  const store = useAppStore();

  const handleLogin = async () => {
    if (!isValid || password.length < 6) return;
    setLoading(true);
    try {
      const res = await api.post('/auth/login-password', { email, password });
      store.setAuth(res.data.token, res.data.user);
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.error || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async () => {
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

          {/* Password Input */}
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
            Password
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: t.inputBg,
              borderRadius: borderRadius.lg,
              borderWidth: 1.5,
              borderColor: password.length > 5 ? t.primary + '60' : t.border,
              paddingHorizontal: spacing.base,
              marginBottom: spacing.xl,
              elevation: 1,
              shadowColor: t.shadow,
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 2,
            }}
          >
            <Ionicons name="lock-closed-outline" size={20} color={t.textMuted} style={{ marginRight: spacing.sm }} />
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              placeholderTextColor={t.placeholder}
              secureTextEntry
              style={{
                flex: 1,
                fontSize: 16,
                color: t.text,
                fontWeight: '500',
                paddingVertical: Platform.OS === 'ios' ? 16 : 14,
              }}
            />
            {password.length > 5 && (
              <Ionicons name="checkmark-circle" size={22} color="#10B981" />
            )}
          </View>

          {/* Action Buttons */}
          <PrimaryButton
            title="Sign In"
            onPress={handleLogin}
            loading={loading}
            disabled={!isValid || password.length < 6}
            icon="log-in-outline"
            size="lg"
          />

          <View style={{ alignItems: 'center', marginVertical: spacing.lg }}>
            <Text style={{ color: t.textMuted, fontSize: 13, fontWeight: '600' }}>OR</Text>
          </View>

          <Pressable 
            onPress={handleSendOTP} 
            disabled={!isValid || loading}
            style={({ pressed }) => ({
              backgroundColor: t.card,
              paddingVertical: 14,
              borderRadius: borderRadius.lg,
              borderWidth: 1,
              borderColor: t.primary + '40',
              alignItems: 'center',
              opacity: pressed || !isValid ? 0.6 : 1,
              flexDirection: 'row',
              justifyContent: 'center'
            })}
          >
             <Ionicons name="paper-plane-outline" size={18} color={t.primary} style={{ marginRight: 8 }} />
             <Text style={{ color: t.primary, fontWeight: '700', fontSize: 15 }}>Log in with OTP</Text>
          </Pressable>

          <View style={{ alignItems: 'center', marginTop: spacing.xl }}>
            <Text style={{ color: t.textMuted, marginBottom: spacing.xs }}>New Partner?</Text>
            <Pressable onPress={() => navigation.navigate('Register')}>
              <Text style={{ color: t.primary, fontWeight: '700', fontSize: 16 }}>Create an Account</Text>
            </Pressable>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

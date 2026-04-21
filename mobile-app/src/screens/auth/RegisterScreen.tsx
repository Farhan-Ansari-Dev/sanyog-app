/**
 * RegisterScreen - New Partner Onboarding
 */
import React, { useState } from 'react';
import {
  View, Text, TextInput, SafeAreaView, StatusBar,
  KeyboardAvoidingView, Platform, ScrollView, Pressable, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import PrimaryButton from '../../components/common/PrimaryButton';
import api from '../../services/api';
import { spacing, typography, borderRadius } from '../../theme';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../types';
import { useAppStore } from '../../store/useAppStore';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export default function RegisterScreen({ navigation }: Props) {
  const t = useTheme();
  const setAuth = useAppStore(s => s.setAuth);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const isValid = name.trim().length > 2 && email.includes('@') && password.length >= 6;

  const handleRegister = async () => {
    if (!isValid) return;
    setLoading(true);
    try {
      const res = await api.post('/auth/register', { name, email, password });
      setAuth(res.data.token, res.data.user);
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }}>
      <StatusBar barStyle={t.statusBar} backgroundColor={t.bg} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, padding: spacing.xl }}>
          
          <Pressable onPress={() => navigation.goBack()} style={{ marginBottom: spacing.xl }}>
            <Ionicons name="arrow-back" size={24} color={t.text} />
          </Pressable>

          <View style={{ marginBottom: spacing['3xl'] }}>
            <Text style={{ fontSize: 28, fontWeight: '900', color: t.text, letterSpacing: -0.5 }}>Create Account</Text>
            <Text style={{ fontSize: 14, color: t.textMuted, marginTop: spacing.sm }}>Apply for enterprise compliance effortlessly.</Text>
          </View>

          {/* Name */}
          <Text style={{ fontSize: 11, fontWeight: '800', color: t.textMuted, textTransform: 'uppercase', marginBottom: spacing.sm }}>Full Name</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: t.inputBg, borderRadius: borderRadius.lg, borderWidth: 1.5, borderColor: t.border, paddingHorizontal: spacing.base, marginBottom: spacing.lg }}>
            <Ionicons name="person-outline" size={20} color={t.textMuted} style={{ marginRight: spacing.sm }} />
            <TextInput value={name} onChangeText={setName} placeholder="John Doe" placeholderTextColor={t.placeholder} style={{ flex: 1, fontSize: 16, color: t.text, paddingVertical: 14 }} />
          </View>

          {/* Email */}
          <Text style={{ fontSize: 11, fontWeight: '800', color: t.textMuted, textTransform: 'uppercase', marginBottom: spacing.sm }}>Email Address</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: t.inputBg, borderRadius: borderRadius.lg, borderWidth: 1.5, borderColor: t.border, paddingHorizontal: spacing.base, marginBottom: spacing.lg }}>
            <Ionicons name="mail-outline" size={20} color={t.textMuted} style={{ marginRight: spacing.sm }} />
            <TextInput value={email} onChangeText={setEmail} placeholder="name@company.com" placeholderTextColor={t.placeholder} keyboardType="email-address" autoCapitalize="none" style={{ flex: 1, fontSize: 16, color: t.text, paddingVertical: 14 }} />
          </View>

          {/* Password */}
          <Text style={{ fontSize: 11, fontWeight: '800', color: t.textMuted, textTransform: 'uppercase', marginBottom: spacing.sm }}>Password</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: t.inputBg, borderRadius: borderRadius.lg, borderWidth: 1.5, borderColor: t.border, paddingHorizontal: spacing.base, marginBottom: spacing.xl }}>
            <Ionicons name="lock-closed-outline" size={20} color={t.textMuted} style={{ marginRight: spacing.sm }} />
            <TextInput value={password} onChangeText={setPassword} placeholder="Minimum 6 characters" placeholderTextColor={t.placeholder} secureTextEntry style={{ flex: 1, fontSize: 16, color: t.text, paddingVertical: 14 }} />
          </View>

          <PrimaryButton title="Create Account" onPress={handleRegister} loading={loading} disabled={!isValid} icon="chevron-forward-outline" size="lg" />

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

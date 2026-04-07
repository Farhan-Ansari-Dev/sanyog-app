import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import api from '../services/api';
import { setToken } from '../services/authStorage';
import { ui, colors } from './_ui';
import type { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'OTP'>;

export default function OtpScreen({ route, navigation }: Props) {
  const mobile = route.params?.mobile;
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const verifyOtp = async () => {
    setError('');
    if (!code || code.trim().length < 4) {
      setError('Enter the OTP');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post<{ token: string }>('/auth/verify-otp', { mobile, code: code.trim() });
      await setToken(res.data.token);
      navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
    } catch (e: unknown) {
      const msg = (e as any)?.response?.data?.error;
      setError(msg || 'Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={ui.screen}>
      <Text style={ui.title}>Verify OTP</Text>
      <Text style={{ color: colors.muted }}>OTP sent to {mobile}</Text>

      <Text style={ui.label}>OTP</Text>
      <TextInput
        style={ui.input}
        value={code}
        onChangeText={setCode}
        keyboardType="number-pad"
        placeholder="Enter OTP"
      />

      <Pressable style={ui.button} onPress={verifyOtp} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={ui.buttonText}>Verify & Continue</Text>}
      </Pressable>

      {!!error && <Text style={ui.error}>{error}</Text>}
    </View>
  );
}

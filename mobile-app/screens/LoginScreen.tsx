import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import api from '../services/api';
import { ui, colors } from './_ui';
import type { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const sendOtp = async () => {
    setError('');
    if (!mobile || mobile.trim().length < 8) {
      setError('Enter a valid mobile number');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/send-otp', { mobile: mobile.trim() });
      navigation.navigate('OTP', { mobile: mobile.trim() });
    } catch (e: unknown) {
      const msg = (e as any)?.response?.data?.error;
      setError(msg || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={ui.screen}>
      <Text style={ui.title}>Welcome</Text>
      <Text style={{ color: colors.muted }}>Enter your mobile number to continue.</Text>

      <Text style={ui.label}>Mobile Number</Text>
      <TextInput
        style={ui.input}
        value={mobile}
        onChangeText={setMobile}
        keyboardType="phone-pad"
        placeholder="10-digit mobile"
      />

      <Pressable style={ui.button} onPress={sendOtp} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={ui.buttonText}>Send OTP</Text>}
      </Pressable>

      {!!error && <Text style={ui.error}>{error}</Text>}

      <Text style={{ marginTop: 12, color: colors.muted }}>
        Tip: In dev mode (mock OTP), the OTP prints in backend logs.
      </Text>
    </View>
  );
}

import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator } from 'react-native';

import api from '../services/api';
import { ui } from './_ui';

export default function ContactExpertScreen() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const request = async () => {
    setError('');
    setStatus('');
    setLoading(true);
    try {
      await api.post('/contact/request', { message: message.trim() || undefined });
      setStatus('Callback request submitted. Our team will contact you soon.');
      setMessage('');
    } catch (e: unknown) {
      const msg = (e as any)?.response?.data?.error;
      setError(msg || 'Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={ui.screen}>
      <Text style={ui.title}>Need Assistance?</Text>
      <Text style={{ color: '#6b7280' }}>Submit a callback request and our compliance expert will reach out.</Text>

      <Text style={ui.label}>Message (optional)</Text>
      <TextInput
        style={[ui.input, { height: 90, textAlignVertical: 'top' }]}
        multiline
        value={message}
        onChangeText={setMessage}
        placeholder="Example: Need help with BIS certification"
      />

      <Pressable style={ui.button} onPress={request} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={ui.buttonText}>Request Callback</Text>}
      </Pressable>

      {!!status && <Text style={{ marginTop: 12, color: '#065f46', fontWeight: '700' }}>{status}</Text>}
      {!!error && <Text style={ui.error}>{error}</Text>}
    </View>
  );
}

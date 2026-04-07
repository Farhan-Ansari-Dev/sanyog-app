import React, { useState } from 'react';
import { Text, TextInput, Pressable, ActivityIndicator, ScrollView } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import api from '../services/api';
import { ui, colors } from './_ui';
import type { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'ApplicationForm'>;

export default function ApplicationFormScreen({ route, navigation }: Props) {
  const { serviceGroup, serviceName } = route.params;

  const [companyName, setCompanyName] = useState('');
  const [applicantName, setApplicantName] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [description, setDescription] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
    setError('');
    if (!companyName.trim() || !applicantName.trim()) {
      setError('Company name and applicant name are required');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post<{ _id: string }>('/applications', {
        serviceGroup,
        serviceName,
        companyName: companyName.trim(),
        applicantName: applicantName.trim(),
        email: email.trim() || undefined,
        city: city.trim() || undefined,
        description: description.trim() || undefined,
      });

      navigation.replace('Upload', { applicationId: res.data._id });
    } catch (e: unknown) {
      const msg = (e as any)?.response?.data?.error;
      setError(msg || 'Failed to create application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={ui.screen} contentContainerStyle={{ paddingBottom: 24 }}>
      <Text style={ui.title}>Application Details</Text>
      <Text style={{ color: colors.muted }}>Service Group: {serviceGroup}</Text>
      <Text style={{ color: colors.muted, marginBottom: 6 }}>Service: {serviceName}</Text>

      <Text style={ui.label}>Company Name *</Text>
      <TextInput style={ui.input} value={companyName} onChangeText={setCompanyName} placeholder="Company name" />

      <Text style={ui.label}>Applicant Name *</Text>
      <TextInput style={ui.input} value={applicantName} onChangeText={setApplicantName} placeholder="Your name" />

      <Text style={ui.label}>Email</Text>
      <TextInput style={ui.input} value={email} onChangeText={setEmail} keyboardType="email-address" placeholder="Email" />

      <Text style={ui.label}>City</Text>
      <TextInput style={ui.input} value={city} onChangeText={setCity} placeholder="City" />

      <Text style={ui.label}>Product / Service Description</Text>
      <TextInput
        style={[ui.input, { height: 90, textAlignVertical: 'top' }]}
        multiline
        value={description}
        onChangeText={setDescription}
        placeholder="Describe product/service"
      />

      <Pressable style={ui.button} onPress={submit} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={ui.buttonText}>Proceed to Upload</Text>}
      </Pressable>

      {!!error && <Text style={ui.error}>{error}</Text>}
    </ScrollView>
  );
}

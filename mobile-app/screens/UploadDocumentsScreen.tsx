import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, ActivityIndicator, ScrollView } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as DocumentPicker from 'expo-document-picker';

import api from '../services/api';
import { ui, colors } from './_ui';
import type { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Upload'>;

type PickedFile = {
  uri: string;
  name: string;
  mimeType: string;
};

export default function UploadDocumentsScreen({ route, navigation }: Props) {
  const { applicationId } = route.params;

  const [files, setFiles] = useState<PickedFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const pickedSummary = useMemo(() => {
    if (!files.length) return 'No files selected yet.';
    return files.map((f) => `• ${f.name}`).join('\n');
  }, [files]);

  const pick = async () => {
    setError('');
    const res = await DocumentPicker.getDocumentAsync({
      multiple: true,
      copyToCacheDirectory: true,
      type: ['application/pdf', 'image/*'],
    });

    if (res.canceled) return;

    const next: PickedFile[] = res.assets.map((a) => ({
      uri: a.uri,
      name: a.name || `file_${Date.now()}`,
      mimeType: a.mimeType || 'application/octet-stream',
    }));

    setFiles((prev) => [...prev, ...next].slice(0, 5));
  };

  const upload = async () => {
    setError('');
    if (!files.length) {
      setError('Please select at least one file');
      return;
    }

    setLoading(true);
    try {
      const form = new FormData();
      files.forEach((f) => {
        form.append('files', { uri: f.uri, name: f.name, type: f.mimeType } as any);
      });

      await api.post(`/applications/${applicationId}/upload`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      navigation.reset({ index: 0, routes: [{ name: 'Home' }, { name: 'MyApplications' }] });
    } catch (e: unknown) {
      const msg = (e as any)?.response?.data?.error;
      setError(msg || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={ui.screen} contentContainerStyle={{ paddingBottom: 24 }}>
      <Text style={ui.title}>Upload Documents</Text>
      <Text style={{ color: colors.muted }}>Application ID: {applicationId}</Text>

      <Pressable style={ui.button} onPress={pick} disabled={loading}>
        <Text style={ui.buttonText}>Select Documents (PDF/JPG/PNG)</Text>
      </Pressable>

      <View style={[ui.card, { marginTop: 12 }]}>
        <Text style={{ fontWeight: '700', marginBottom: 8, color: colors.text }}>Selected</Text>
        <Text style={{ color: colors.text, lineHeight: 20 }}>{pickedSummary}</Text>
      </View>

      <Pressable style={ui.button} onPress={upload} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={ui.buttonText}>Upload & Submit</Text>}
      </Pressable>

      {!!error && <Text style={ui.error}>{error}</Text>}

      <Text style={{ marginTop: 12, color: colors.muted }}>Max 5 files, 10MB each.</Text>
    </ScrollView>
  );
}

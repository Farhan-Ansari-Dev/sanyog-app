import React, { useCallback, useState, useMemo } from 'react';
import { View, Text, Pressable, ScrollView, RefreshControl, TextInput } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import api from '../services/api';
import { ui, colors } from './_ui';
import type { Application, RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'MyApplications'>;

function formatDate(value?: string) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleString();
}

export default function MyApplicationsScreen({ navigation }: Props) {
  const [apps, setApps] = useState<Application[]>([]);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const load = useCallback(async () => {
    setError('');
    setRefreshing(true);
    try {
      const res = await api.get<Application[]>('/applications/my');
      setApps(res.data);
    } catch (e: unknown) {
      const msg = (e as any)?.response?.data?.error;
      setError(msg || 'Failed to load applications');
    } finally {
      setRefreshing(false);
    }
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  const filteredApps = useMemo(() => {
    if (!searchQuery.trim()) return apps;
    const q = searchQuery.toLowerCase();
    return apps.filter(a => {
      const serviceName = (a.serviceName || a.certification || '').toLowerCase();
      const serviceGroup = (a.serviceGroup || '').toLowerCase();
      const status = (a.status || '').toLowerCase();
      return serviceName.includes(q) || serviceGroup.includes(q) || status.includes(q);
    });
  }, [apps, searchQuery]);

  return (
    <View style={ui.screen}>
      <Text style={ui.title}>My Applications</Text>

      <TextInput
        style={[ui.input, { marginBottom: 16 }]}
        placeholder="Search applications..."
        placeholderTextColor={colors.placeholder || colors.muted}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {!!error && <Text style={ui.error}>{error}</Text>}

      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={load} />}>
        {!apps.length ? (
          <View style={ui.card}>
            <Text style={{ fontWeight: '700', color: colors.text }}>No applications yet</Text>
            <Text style={{ color: colors.muted, marginTop: 6 }}>Tap "Apply for Service" from Home.</Text>
          </View>
        ) : filteredApps.length === 0 ? (
          <View style={ui.card}>
            <Text style={{ fontWeight: '700', color: colors.text }}>No applications found</Text>
            <Text style={{ color: colors.muted, marginTop: 6 }}>No applications match your search query.</Text>
          </View>
        ) : null}

        {filteredApps.map((a) => (
          <View key={a._id} style={ui.card}>
            <Text style={{ fontWeight: '800', marginBottom: 6, color: colors.text }}>{a.serviceName || a.certification || 'Application'}</Text>
            {!!a.serviceGroup && <Text style={{ color: colors.muted }}>{a.serviceGroup}</Text>}
            <Text style={{ color: colors.text, marginTop: 6 }}>Status: {a.status}</Text>
            {!!a.remarks && <Text style={{ color: colors.muted, marginTop: 6 }}>Remarks: {a.remarks}</Text>}
            <Text style={{ color: colors.muted, marginTop: 6 }}>Updated: {formatDate(a.updatedAt)}</Text>

            <View style={[ui.row, { marginTop: 10 }]}>
              <Pressable onPress={() => navigation.navigate('Upload', { applicationId: a._id })}>
                <Text style={ui.link}>Upload More Docs</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

import React, { useCallback, useState } from 'react';
import { View, Text, Pressable, ScrollView, RefreshControl } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import api from '../services/api';
import { ui } from './_ui';
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

  return (
    <View style={ui.screen}>
      <Text style={ui.title}>My Applications</Text>

      {!!error && <Text style={ui.error}>{error}</Text>}

      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={load} />}>
        {!apps.length ? (
          <View style={ui.card}>
            <Text style={{ fontWeight: '700' }}>No applications yet</Text>
            <Text style={{ color: '#6b7280', marginTop: 6 }}>Tap “Apply for Service” from Home.</Text>
          </View>
        ) : null}

        {apps.map((a) => (
          <View key={a._id} style={ui.card}>
            <Text style={{ fontWeight: '800', marginBottom: 6 }}>{a.serviceName || a.certification || 'Application'}</Text>
            {!!a.serviceGroup && <Text style={{ color: '#6b7280' }}>{a.serviceGroup}</Text>}
            <Text style={{ color: '#111827', marginTop: 6 }}>Status: {a.status}</Text>
            {!!a.remarks && <Text style={{ color: '#6b7280', marginTop: 6 }}>Remarks: {a.remarks}</Text>}
            <Text style={{ color: '#6b7280', marginTop: 6 }}>Updated: {formatDate(a.updatedAt)}</Text>

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

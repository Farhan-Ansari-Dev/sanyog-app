import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { fetchServiceCatalog } from '../services/catalog';
import { ui } from './_ui';
import type { RootStackParamList, ServiceCatalogGroup } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Certifications'>;

export default function CertificationScreen({ navigation }: Props) {
  const [groups, setGroups] = useState<ServiceCatalogGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      setError('');
      setLoading(true);
      try {
        const data = await fetchServiceCatalog();
        setGroups(data.groups || []);
      } catch (e: unknown) {
        const msg = (e as any)?.response?.data?.error;
        setError(msg || 'Failed to load services');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const total = useMemo(
    () => groups.reduce((sum, g) => sum + (g.services?.length || 0), 0),
    [groups]
  );

  return (
    <View style={ui.screen}>
      <Text style={ui.title}>Select Service</Text>

      {loading ? (
        <View style={{ paddingVertical: 18 }}>
          <ActivityIndicator />
        </View>
      ) : null}

      {!!error && <Text style={ui.error}>{error}</Text>}
      {!loading ? <Text style={{ color: '#6b7280', marginBottom: 10 }}>Available: {total}</Text> : null}

      <ScrollView>
        {groups.map((group) => (
          <View key={group.groupName} style={{ marginBottom: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: '800', marginBottom: 8 }}>{group.groupName}</Text>
            {(group.services || []).map((svc) => (
              <Pressable
                key={`${group.groupName}:${svc.slug}`}
                style={ui.card}
                onPress={() => navigation.navigate('ApplicationForm', { serviceGroup: group.groupName, serviceName: svc.name })}
              >
                <Text style={{ fontSize: 16, fontWeight: '600' }}>{svc.name}</Text>
                <Text style={{ color: '#6b7280', marginTop: 4 }}>Tap to start application</Text>
              </Pressable>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

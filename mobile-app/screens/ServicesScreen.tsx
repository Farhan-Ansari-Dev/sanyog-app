import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { fetchServiceCatalog } from '../services/catalog';
import { ui, colors } from './_ui';
import type { RootStackParamList, ServiceCatalogGroup } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Services'>;

export default function ServicesScreen({ navigation }: Props) {
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

  return (
    <View style={ui.screen}>
      <Text style={ui.title}>Our Services</Text>
      
      <Text style={[ui.label, { marginBottom: 20 }]}>
        Explore our comprehensive range of conformity and certification services.
      </Text>

      {loading ? (
        <View style={{ paddingVertical: 18 }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : null}

      {!!error && <Text style={ui.error}>{error}</Text>}

      <ScrollView showsVerticalScrollIndicator={false}>
        {!loading && groups.map((group) => (
          <Pressable
            key={group.groupName}
            style={[ui.card, { paddingVertical: 24, marginBottom: 16 }]}
            onPress={() => navigation.navigate('ServiceDetails', { groupName: group.groupName, services: group.services })}
          >
            <Text style={{ fontSize: 20, fontWeight: '800', color: colors.text, marginBottom: 8 }}>
              {group.groupName}
            </Text>
            <Text style={{ color: colors.muted, fontSize: 14 }}>
              {group.services?.length || 0} services available
            </Text>
            <Text style={{ position: 'absolute', right: 20, top: '50%', transform: [{ translateY: -12 }], color: colors.primary, fontSize: 24, fontWeight: '300' }}>→</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

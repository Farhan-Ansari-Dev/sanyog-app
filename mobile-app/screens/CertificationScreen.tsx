import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, Pressable, ScrollView, ActivityIndicator, TextInput } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { fetchServiceCatalog } from '../services/catalog';
import { ui, colors } from './_ui';
import type { RootStackParamList, ServiceCatalogGroup } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Certifications'>;

export default function CertificationScreen({ navigation }: Props) {
  const [groups, setGroups] = useState<ServiceCatalogGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredGroups = useMemo(() => {
    if (!searchQuery.trim()) return groups;
    const q = searchQuery.toLowerCase();
    
    return groups.map(group => {
      // Return group if its name matches, otherwise return the filtered services
      if (group.groupName.toLowerCase().includes(q)) {
        return group;
      }
      return {
        ...group,
        services: (group.services || []).filter(s => s.name.toLowerCase().includes(q))
      };
    }).filter(group => group.services && group.services.length > 0);
  }, [groups, searchQuery]);

  const total = useMemo(
    () => filteredGroups.reduce((sum, g) => sum + (g.services?.length || 0), 0),
    [filteredGroups]
  );

  return (
    <View style={ui.screen}>
      <Text style={ui.title}>Select Service</Text>

      <TextInput
        style={[ui.input, { marginBottom: 12 }]}
        placeholder="Search services..."
        placeholderTextColor={colors.placeholder || colors.muted}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {loading ? (
        <View style={{ paddingVertical: 18 }}>
          <ActivityIndicator />
        </View>
      ) : null}

      {!!error && <Text style={ui.error}>{error}</Text>}
      {!loading ? <Text style={{ color: colors.muted, marginBottom: 10 }}>Available: {total}</Text> : null}

      <ScrollView>
        {filteredGroups.map((group) => (
          <View key={group.groupName} style={{ marginBottom: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: '800', marginBottom: 8, color: colors.text }}>{group.groupName}</Text>
            {(group.services || []).map((svc) => (
              <Pressable
                key={`${group.groupName}:${svc.slug}`}
                style={ui.card}
                onPress={() => navigation.navigate('ApplicationForm', { serviceGroup: group.groupName, serviceName: svc.name })}
              >
                <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text }}>{svc.name}</Text>
                <Text style={{ color: colors.muted, marginTop: 4 }}>Tap to start application</Text>
              </Pressable>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { ui, colors } from './_ui';
import type { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'ServiceDetails'>;

export default function ServiceDetailsScreen({ route, navigation }: Props) {
  const { groupName = '', services = [] } = route.params || {};

  return (
    <View style={ui.screen}>
      <Text style={[ui.title, { fontSize: 28 }]}>{groupName}</Text>
      
      <Text style={[ui.label, { marginBottom: 20 }]}>
        Select a specific service below to start your application process.
      </Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ marginBottom: 40 }}>
          {services.map((svc) => (
            <View key={svc.slug} style={[ui.card, { marginBottom: 12 }]}>
              <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: 12 }}>
                {svc.name}
              </Text>
              
              <Pressable
                style={[ui.button, { marginTop: 8 }]}
                onPress={() => navigation.navigate('ApplicationForm', { serviceGroup: groupName, serviceName: svc.name })}
              >
                <Text style={ui.buttonText}>Apply Now</Text>
                <Text style={{ color: colors.primary, fontSize: 20, fontWeight: '300' }}>→</Text>
              </Pressable>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { clearToken } from '../services/authStorage';
import { ui } from './_ui';
import type { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const logout = async () => {
    await clearToken();
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  return (
    <View style={ui.screen}>
      <Text style={ui.title}>Sanyog Conformity Solutions</Text>
      <Text style={{ marginBottom: 16, color: '#6b7280' }}>Where Accuracy Meets Assurance</Text>

      <Pressable style={ui.button} onPress={() => navigation.navigate('Certifications')}>
        <Text style={ui.buttonText}>Apply for Service</Text>
      </Pressable>

      <Pressable style={ui.button} onPress={() => navigation.navigate('MyApplications')}>
        <Text style={ui.buttonText}>My Applications</Text>
      </Pressable>

      <Pressable style={ui.button} onPress={() => navigation.navigate('Contact')}>
        <Text style={ui.buttonText}>Contact Expert</Text>
      </Pressable>

      <Pressable style={[ui.button, { backgroundColor: '#111827' }]} onPress={() => navigation.navigate('About')}>
        <Text style={ui.buttonText}>About</Text>
      </Pressable>

      <Pressable style={[ui.button, { backgroundColor: '#b91c1c' }]} onPress={logout}>
        <Text style={ui.buttonText}>Logout</Text>
      </Pressable>
    </View>
  );
}

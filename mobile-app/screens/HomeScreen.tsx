import React, { useCallback, useState } from 'react';
import { View, Text, Pressable, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';

import api from '../services/api';
import { clearToken } from '../services/authStorage';
import { ui, colors } from './_ui';
import type { Application, RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const [appCount, setAppCount] = useState<number>(0);
  const [loadingCount, setLoadingCount] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        setLoadingCount(true);
        try {
          const res = await api.get<Application[]>('/applications/my');
          if (active) setAppCount(res.data?.length || 0);
        } catch {
          // silently fail — show 0
        } finally {
          if (active) setLoadingCount(false);
        }
      })();
      return () => { active = false; };
    }, [])
  );

  const logout = async () => {
    await clearToken();
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
      <ScrollView contentContainerStyle={ui.screen} showsVerticalScrollIndicator={false}>
        
        {/* Header Section */}
        <View style={{ marginTop: 20, marginBottom: 40 }}>
          <Text style={[ui.title, { fontSize: 32 }]}>Hello,</Text>
          <Text style={[ui.label, { color: colors.primary, fontSize: 16 }]}>Sanyog Conformity</Text>
          <Text style={{ marginTop: 8, color: colors.muted, fontSize: 15, lineHeight: 22 }}>
            Manage your global and domestic certifications with absolute precision.
          </Text>
        </View>

        {/* Stats / Overview Card */}
        <View style={ui.card}>
          <Text style={ui.statLabel}>Active Applications</Text>
          <Text style={ui.statValue}>{loadingCount ? '—' : appCount}</Text>
          <Text style={{ color: colors.muted, marginTop: 8, fontSize: 13 }}>
            {appCount === 0
              ? "You haven't submitted any applications yet."
              : `You have ${appCount} application${appCount > 1 ? 's' : ''} in progress.`}
          </Text>
        </View>

        {/* Action Buttons (Glassmorphic look from ui.button) */}
        <Text style={[ui.label, { marginTop: 24, marginBottom: 8 }]}>Quick Actions</Text>

        <Pressable style={ui.button} onPress={() => navigation.navigate('Services')}>
          <Text style={ui.buttonText}>Explore Services</Text>
          <Text style={{ color: colors.primary, fontSize: 24, fontWeight: '300' }}>→</Text>
        </Pressable>

        <Pressable style={ui.button} onPress={() => navigation.navigate('Certifications')}>
          <Text style={ui.buttonText}>Apply for Service</Text>
          <Text style={{ color: colors.primary, fontSize: 24, fontWeight: '300' }}>→</Text>
        </Pressable>

        <Pressable style={ui.button} onPress={() => navigation.navigate('MyApplications')}>
          <Text style={ui.buttonText}>My Applications</Text>
          <Text style={{ color: colors.primary, fontSize: 24, fontWeight: '300' }}>→</Text>
        </Pressable>

        <Pressable style={ui.button} onPress={() => navigation.navigate('Contact')}>
          <Text style={ui.buttonText}>Contact Expert</Text>
          <Text style={{ color: colors.primary, fontSize: 24, fontWeight: '300' }}>→</Text>
        </Pressable>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 30, marginBottom: 40 }}>
            <Pressable 
                style={[ui.button, { flex: 1, marginRight: 8, justifyContent: 'center', backgroundColor: 'transparent' }]} 
                onPress={() => navigation.navigate('About')}
            >
                <Text style={[ui.buttonText, { fontSize: 15, color: colors.muted }]}>About</Text>
            </Pressable>
            
            <Pressable 
                style={[ui.button, { flex: 1, marginLeft: 8, justifyContent: 'center', backgroundColor: 'rgba(255, 68, 68, 0.1)', borderColor: 'rgba(255, 68, 68, 0.3)' }]} 
                onPress={logout}
            >
                <Text style={[ui.buttonText, { fontSize: 15, color: colors.danger }]}>Logout</Text>
            </Pressable>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

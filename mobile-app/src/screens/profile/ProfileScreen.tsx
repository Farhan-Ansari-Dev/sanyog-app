/**
 * ProfileScreen – User profile, settings, and account management
 */
import React from 'react';
import { View, Text, ScrollView, SafeAreaView, StatusBar, Pressable, Switch, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import Toast from 'react-native-toast-message';
import api from '../../services/api';
import { useTheme } from '../../hooks/useTheme';
import { useAppStore } from '../../store/useAppStore';
import GlassCard from '../../components/common/GlassCard';
import PrimaryButton from '../../components/common/PrimaryButton';
import SectionHeader from '../../components/common/SectionHeader';
import { spacing, typography, borderRadius } from '../../theme';

export default function ProfileScreen({ navigation }: any) {
  const t = useTheme();
  const store = useAppStore();
  const user = store.user;

  const menuItems = [
    {
      section: 'Account',
      items: [
        { icon: 'person-outline', label: 'Edit Profile', onPress: () => navigation.navigate('Placeholder', { title: 'Edit Profile' }) },
        { icon: 'document-text-outline', label: 'My Documents', onPress: () => navigation.navigate('AppsList') },
        { icon: 'card-outline', label: 'Billing & Invoices', onPress: () => navigation.navigate('Placeholder', { title: 'Billing & Invoices' }) },
      ],
    },
    {
      section: 'Support',
      items: [
        { icon: 'chatbubble-ellipses-outline', label: 'Contact Expert', onPress: () => navigation.navigate('ContactExpert') },
        { icon: 'help-circle-outline', label: 'Help & FAQ', onPress: () => navigation.navigate('Placeholder', { title: 'Help & FAQ' }) },
        { icon: 'information-circle-outline', label: 'About Sanyog', onPress: () => navigation.navigate('About') },
      ],
    },
    {
      section: 'Legal',
      items: [
        { icon: 'shield-outline', label: 'Privacy Policy', onPress: () => navigation.navigate('Placeholder', { title: 'Privacy Policy' }) },
        { icon: 'document-outline', label: 'Terms of Service', onPress: () => navigation.navigate('Placeholder', { title: 'Terms of Service' }) },
      ],
    },
  ];

  const handleUploadPhoto = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'image/*',
        copyToCacheDirectory: true
      });
      if (!result.canceled && result.assets && result.assets[0]) {
        const fileUri = result.assets[0].uri;
        const base64 = await FileSystem.readAsStringAsync(fileUri, { encoding: FileSystem.EncodingType.Base64 });
        const mimeType = result.assets[0].mimeType || 'image/jpeg';
        const avatarUri = `data:${mimeType};base64,${base64}`;

        const res = await api.put('/auth/me', { avatar: avatarUri });
        store.setAuth(store.token!, res.data);
        Toast.show({ type: 'success', text1: 'Profile Avatar Updated' });
      }
    } catch (err: any) {
      Toast.show({ type: 'error', text1: 'Upload Failed', text2: err.message });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }}>
      <StatusBar barStyle={t.statusBar} backgroundColor={t.bg} />
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: spacing['3xl'] }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={{ marginTop: spacing.lg, marginBottom: spacing.xl }}>
          <Text
            style={{
              fontSize: typography['3xl'],
              fontWeight: typography.black,
              color: t.text,
              letterSpacing: typography.tighter,
            }}
          >
            Profile
          </Text>
        </View>

        {/* User Card */}
        <GlassCard variant="elevated" style={{ marginBottom: spacing.xl }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Pressable
              onPress={handleUploadPhoto}
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: t.primary + '20',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: spacing.base,
                overflow: 'hidden',
              }}
            >
              {user?.avatar ? (
                <Image source={{ uri: user.avatar }} style={{ width: '100%', height: '100%' }} />
              ) : (
                <Text
                  style={{
                    fontSize: typography['2xl'],
                    fontWeight: typography.black,
                    color: t.primary,
                  }}
                >
                  {user?.name?.charAt(0) || 'U'}
                </Text>
              )}
              <View style={{ position: 'absolute', bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', width: '100%', alignItems: 'center', paddingVertical: 2 }}>
                <Ionicons name="camera" size={12} color="#FFF" />
              </View>
            </Pressable>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: typography.lg,
                  fontWeight: typography.bold,
                  color: t.text,
                  marginBottom: 2,
                }}
              >
                {user?.name || 'User'}
              </Text>
              <Text style={{ fontSize: typography.sm, color: t.textMuted }}>{user?.company || 'Company'}</Text>
              <Text style={{ fontSize: typography.xs, color: t.textMuted, marginTop: 2 }}>{user?.email}</Text>
            </View>
          </View>
        </GlassCard>

        {/* App Stats */}
        <View style={{ flexDirection: 'row', marginBottom: spacing['xl'] }}>
          {[
            { value: store.applications.length, label: 'Applications', icon: 'documents-outline' as const },
            { value: store.applications.filter((a) => a.status === 'approved').length, label: 'Certified', icon: 'ribbon-outline' as const },
            { value: store.notifications.filter((n) => !n.read).length, label: 'Alerts', icon: 'notifications-outline' as const },
          ].map((stat, i) => (
            <View
              key={i}
              style={{
                flex: 1,
                backgroundColor: t.card,
                borderRadius: borderRadius['xl'],
                paddingVertical: spacing.lg,
                alignItems: 'center',
                borderWidth: 1,
                borderColor: t.borderSubtle,
                marginLeft: i > 0 ? spacing.base : 0,
                elevation: 3,
                shadowColor: t.shadow,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.08,
                shadowRadius: 10,
              }}
            >
              <Ionicons name={stat.icon} size={28} color={t.primary} style={{ marginBottom: spacing.sm }} />
              <Text style={{ fontSize: typography['2xl'], fontWeight: typography.black, color: t.text }}>{stat.value}</Text>
              <Text style={{ fontSize: typography.xs, color: t.textMuted, marginTop: 4, letterSpacing: 0.5, fontWeight: '700', textTransform: 'uppercase' }}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Dark Mode Toggle */}
        <GlassCard style={{ marginBottom: spacing.lg }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name={store.theme === 'dark' ? 'moon' : 'sunny'} size={20} color={t.primary} style={{ marginRight: spacing.md }} />
              <View>
                <Text style={{ fontSize: typography.base, fontWeight: typography.semiBold, color: t.text }}>
                  Dark Mode
                </Text>
                <Text style={{ fontSize: typography.xs, color: t.textMuted, marginTop: 2 }}>
                  {store.theme === 'dark' ? 'Currently enabled' : 'Currently disabled'}
                </Text>
              </View>
            </View>
            <Switch
              value={store.theme === 'dark'}
              onValueChange={store.toggleTheme}
              trackColor={{ false: t.border, true: t.primary + '50' }}
              thumbColor={store.theme === 'dark' ? t.primary : t.textMuted}
            />
          </View>
        </GlassCard>

        {/* Menu Sections */}
        {menuItems.map((section) => (
          <View key={section.section}>
            <SectionHeader title={section.section} />
            <GlassCard>
              {section.items.map((item, i) => (
                <Pressable
                  key={item.label}
                  onPress={item.onPress}
                  style={({ pressed }) => ({
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: spacing.md,
                    borderBottomWidth: i < section.items.length - 1 ? 1 : 0,
                    borderBottomColor: t.borderSubtle,
                    opacity: pressed ? 0.7 : 1,
                  })}
                >
                  <Ionicons name={item.icon as any} size={20} color={t.textSecondary} style={{ marginRight: spacing.md }} />
                  <Text style={{ flex: 1, fontSize: typography.base, color: t.text }}>{item.label}</Text>
                  <Ionicons name="chevron-forward" size={18} color={t.textMuted} />
                </Pressable>
              ))}
            </GlassCard>
          </View>
        ))}

        {/* Logout */}
        <PrimaryButton
          title="Sign Out"
          onPress={() => store.clearAuth()}
          variant="danger"
          icon="log-out-outline"
          style={{ marginTop: spacing['2xl'] }}
        />

        {/* Version */}
        <Text
          style={{
            fontSize: typography.xs,
            color: t.textMuted,
            textAlign: 'center',
            marginTop: spacing.xl,
          }}
        >
          Sanyog Conformity v1.0.0{'\n'}
          © 2026 Sanyog Conformity Solutions
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

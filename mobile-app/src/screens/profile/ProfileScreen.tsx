/**
 * ProfileScreen – User profile, settings, and account management
 */
import React from 'react';
import { View, Text, ScrollView, SafeAreaView, StatusBar, Pressable, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
        { icon: 'person-outline', label: 'Edit Profile', onPress: () => {} },
        { icon: 'document-text-outline', label: 'My Documents', onPress: () => {} },
        { icon: 'card-outline', label: 'Billing & Invoices', onPress: () => {} },
      ],
    },
    {
      section: 'Support',
      items: [
        { icon: 'chatbubble-ellipses-outline', label: 'Contact Expert', onPress: () => navigation.navigate('ContactExpert') },
        { icon: 'help-circle-outline', label: 'Help & FAQ', onPress: () => {} },
        { icon: 'information-circle-outline', label: 'About Sanyog', onPress: () => navigation.navigate('About') },
      ],
    },
    {
      section: 'Legal',
      items: [
        { icon: 'shield-outline', label: 'Privacy Policy', onPress: () => {} },
        { icon: 'document-outline', label: 'Terms of Service', onPress: () => {} },
      ],
    },
  ];

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
            <View
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: t.primary + '20',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: spacing.base,
              }}
            >
              <Text
                style={{
                  fontSize: typography['2xl'],
                  fontWeight: typography.black,
                  color: t.primary,
                }}
              >
                {user?.name?.charAt(0) || 'U'}
              </Text>
            </View>
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
        <View style={{ flexDirection: 'row', marginBottom: spacing.lg }}>
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
                borderRadius: borderRadius.lg,
                padding: spacing.md,
                alignItems: 'center',
                borderWidth: 1,
                borderColor: t.borderSubtle,
              }}
            >
              <Ionicons name={stat.icon} size={20} color={t.primary} style={{ marginBottom: spacing.xs }} />
              <Text style={{ fontSize: typography.lg, fontWeight: typography.black, color: t.text }}>{stat.value}</Text>
              <Text style={{ fontSize: typography.xs, color: t.textMuted, marginTop: 2 }}>{stat.label}</Text>
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

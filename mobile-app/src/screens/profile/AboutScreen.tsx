/**
 * AboutScreen – Company information
 */
import React from 'react';
import { View, Text, ScrollView, SafeAreaView, StatusBar, Linking, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import GlassCard from '../../components/common/GlassCard';
import SectionHeader from '../../components/common/SectionHeader';
import { spacing, typography, borderRadius } from '../../theme';

export default function AboutScreen() {
  const t = useTheme();

  const stats = [
    { value: '500+', label: 'Clients Served' },
    { value: '50+', label: 'Countries' },
    { value: '60+', label: 'Services' },
    { value: '10+', label: 'Years Experience' },
  ];

  const contactInfo = [
    { icon: 'globe-outline', label: 'Website', value: 'www.sanyogconformity.com', action: () => Linking.openURL('https://www.sanyogconformity.com') },
    { icon: 'mail-outline', label: 'Email', value: 'info@sanyogconformity.com', action: () => Linking.openURL('mailto:info@sanyogconformity.com') },
    { icon: 'call-outline', label: 'Phone', value: '+91 120 4567890', action: () => Linking.openURL('tel:+911204567890') },
    { icon: 'location-outline', label: 'Address', value: 'Noida, Uttar Pradesh, India', action: () => {} },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }}>
      <StatusBar barStyle={t.statusBar} backgroundColor={t.bg} />
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: spacing['3xl'] }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={{ alignItems: 'center', paddingVertical: spacing['2xl'] }}>
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: t.primary + '15',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: spacing.lg,
              borderWidth: 2,
              borderColor: t.primary + '30',
            }}
          >
            <Ionicons name="shield-checkmark" size={36} color={t.primary} />
          </View>
          <Text
            style={{
              fontSize: typography['2xl'],
              fontWeight: typography.black,
              color: t.text,
              textAlign: 'center',
            }}
          >
            Sanyog Conformity
          </Text>
          <Text
            style={{
              fontSize: typography.xs,
              fontWeight: typography.bold,
              color: t.primary,
              letterSpacing: typography.widest,
              textTransform: 'uppercase',
              marginTop: spacing.xs,
            }}
          >
            Solutions
          </Text>
        </View>

        {/* Mission */}
        <GlassCard style={{ marginBottom: spacing.lg }}>
          <Text style={{ fontSize: typography.base, color: t.textSecondary, lineHeight: typography.base * typography.relaxed, textAlign: 'center' }}>
            Sanyog Conformity offers top-notch certification and conformity assessment services for both international and domestic markets. We ensure compliance and quality for your products with expert guidance across 50+ countries.
          </Text>
        </GlassCard>

        {/* Stats Grid */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', }}>
          {stats.map((stat) => (
            <View
              key={stat.label}
              style={{
                width: '47%' as any,
                backgroundColor: t.card,
                borderRadius: borderRadius.lg,
                padding: spacing.lg,
                alignItems: 'center',
                borderWidth: 1,
                borderColor: t.borderSubtle,
              }}
            >
              <Text style={{ fontSize: typography['2xl'], fontWeight: typography.black, color: t.primary }}>
                {stat.value}
              </Text>
              <Text style={{ fontSize: typography.xs, color: t.textMuted, marginTop: spacing.xs }}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Contact */}
        <SectionHeader title="Get in Touch" />
        <GlassCard>
          {contactInfo.map((item, i) => (
            <Pressable
              key={item.label}
              onPress={item.action}
              style={({ pressed }) => ({
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: spacing.md,
                borderBottomWidth: i < contactInfo.length - 1 ? 1 : 0,
                borderBottomColor: t.borderSubtle,
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <Ionicons name={item.icon as any} size={20} color={t.primary} style={{ marginRight: spacing.md }} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: typography.xs, color: t.textMuted }}>{item.label}</Text>
                <Text style={{ fontSize: typography.sm, color: t.text, fontWeight: typography.medium, marginTop: 2 }}>
                  {item.value}
                </Text>
              </View>
              <Ionicons name="open-outline" size={16} color={t.textMuted} />
            </Pressable>
          ))}
        </GlassCard>
      </ScrollView>
    </SafeAreaView>
  );
}

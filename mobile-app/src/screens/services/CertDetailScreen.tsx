/**
 * CertDetailScreen – Detailed certification info with apply button
 */
import React, { useMemo } from 'react';
import { View, Text, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { useAppStore } from '../../store/useAppStore';
import GlassCard from '../../components/common/GlassCard';
import PrimaryButton from '../../components/common/PrimaryButton';
import SectionHeader from '../../components/common/SectionHeader';
import { spacing, typography, borderRadius, palette } from '../../theme';

export default function CertDetailScreen({ navigation, route }: any) {
  const t = useTheme();
  const { certId } = route.params;
  const certifications = useAppStore((s) => s.certifications);
  const cert = useMemo(() => certifications.find((c) => c.id === certId), [certifications, certId]);

  if (!cert) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: t.bg, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: t.textMuted }}>Certification not found</Text>
      </SafeAreaView>
    );
  }

  const infoCards = [
    { icon: 'time-outline' as const, label: 'Duration', value: cert.processDuration },
    { icon: 'folder-outline' as const, label: 'Category', value: cert.categoryName },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }}>
      <StatusBar barStyle={t.statusBar} backgroundColor={t.bg} />
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Header */}
        <View
          style={{
            paddingHorizontal: spacing.lg,
            paddingTop: spacing.xl,
            paddingBottom: spacing['2xl'],
          }}
        >
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: borderRadius.lg,
              backgroundColor: palette.brandBlue + '15',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: spacing.lg,
            }}
          >
            <Ionicons name="ribbon" size={28} color={palette.brandBlue} />
          </View>
          <Text
            style={{
              fontSize: typography['2xl'],
              fontWeight: typography.black,
              color: t.text,
              letterSpacing: typography.tighter,
              marginBottom: spacing.sm,
            }}
          >
            {cert.name}
          </Text>

          {/* Tags */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: spacing.sm }}>
            {cert.tags.map((tag) => (
              <View
                key={tag}
                style={{
                  paddingHorizontal: spacing.md,
                  paddingVertical: spacing.xs,
                  borderRadius: borderRadius.full,
                  backgroundColor: t.primary + '12',
                  borderWidth: 1,
                  borderColor: t.primary + '25',
                }}
              >
                <Text style={{ fontSize: typography.xs, color: t.primary, fontWeight: typography.semiBold }}>
                  {tag}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Info Cards */}
        <View style={{ flexDirection: 'row', paddingHorizontal: spacing.lg, }}>
          {infoCards.map((info, i) => (
            <GlassCard key={i} style={{ flex: 1, padding: spacing.md, alignItems: 'center' }}>
              <Ionicons name={info.icon} size={18} color={t.primary} style={{ marginBottom: spacing.xs }} />
              <Text style={{ fontSize: typography.xs, color: t.textMuted, marginBottom: 2, textAlign: 'center' }}>
                {info.label}
              </Text>
              <Text
                style={{
                  fontSize: typography.xs,
                  fontWeight: typography.bold,
                  color: t.text,
                  textAlign: 'center',
                }}
                numberOfLines={2}
              >
                {info.value}
              </Text>
            </GlassCard>
          ))}
        </View>

        {/* Description */}
        <View style={{ paddingHorizontal: spacing.lg }}>
          <SectionHeader title="About This Certification" />
          <Text
            style={{
              fontSize: typography.base,
              color: t.textSecondary,
              lineHeight: typography.base * typography.relaxed,
            }}
          >
            {cert.fullDescription}
          </Text>

          {/* Process Steps */}
          <SectionHeader title="Process Steps" />
          {cert.processSteps.map((step, i) => (
            <View
              key={i}
              style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                marginBottom: spacing.md,
              }}
            >
              <View
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  backgroundColor: t.primary + '15',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: spacing.md,
                  marginTop: 2,
                }}
              >
                <Text style={{ fontSize: typography.xs, fontWeight: typography.bold, color: t.primary }}>
                  {i + 1}
                </Text>
              </View>
              <Text
                style={{
                  flex: 1,
                  fontSize: typography.base,
                  color: t.textSecondary,
                  lineHeight: typography.base * typography.normal,
                }}
              >
                {step}
              </Text>
            </View>
          ))}

          {/* Required Documents */}
          <SectionHeader title="Required Documents" />
          {cert.requiredDocuments.map((doc, i) => (
            <View
              key={i}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: spacing.sm,
                borderBottomWidth: i < cert.requiredDocuments.length - 1 ? 1 : 0,
                borderBottomColor: t.borderSubtle,
              }}
            >
              <Ionicons name="document-text-outline" size={16} color={t.textMuted} style={{ marginRight: spacing.md }} />
              <Text style={{ fontSize: typography.sm, color: t.textSecondary, flex: 1 }}>{doc}</Text>
              <Ionicons name="checkmark-circle-outline" size={16} color={t.success} />
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Fixed Apply Button */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: spacing.lg,
          backgroundColor: t.bg,
          borderTopWidth: 1,
          borderTopColor: t.borderSubtle,
        }}
      >
        <PrimaryButton
          title="Apply for This Certification"
          onPress={() =>
            navigation.navigate('ApplyStep1', { certId: cert.id, certName: cert.name })
          }
          icon="arrow-forward-outline"
          iconPosition="right"
          size="lg"
        />
      </View>
    </SafeAreaView>
  );
}

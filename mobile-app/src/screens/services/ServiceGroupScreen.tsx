/**
 * ServiceGroupScreen – All certifications within a category
 */
import React, { useMemo } from 'react';
import { View, Text, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { useAppStore } from '../../store/useAppStore';
import GlassCard from '../../components/common/GlassCard';
import { spacing, typography, borderRadius, palette } from '../../theme';

export default function ServiceGroupScreen({ navigation, route }: any) {
  const t = useTheme();
  const { categoryId, categoryName } = route.params;
  const certifications = useAppStore((s) => s.certifications);

  const filtered = useMemo(
    () => certifications.filter((c) => c.categoryId === categoryId),
    [certifications, categoryId]
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }}>
      <StatusBar barStyle={t.statusBar} backgroundColor={t.bg} />
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: spacing['3xl'] }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ marginTop: spacing.lg, marginBottom: spacing.xl }}>
          <Text
            style={{
              fontSize: typography['2xl'],
              fontWeight: typography.black,
              color: t.text,
              letterSpacing: typography.tighter,
            }}
          >
            {categoryName}
          </Text>
          <Text style={{ fontSize: typography.sm, color: t.textMuted, marginTop: spacing.xs }}>
            {filtered.length} services available
          </Text>
        </View>

        {filtered.map((cert, index) => (
          <GlassCard
            key={cert.id}
            onPress={() => navigation.navigate('CertDetail', { certId: cert.id })}
            style={{ marginBottom: spacing.md }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: borderRadius.md,
                  backgroundColor: palette.brandBlue + '12',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: spacing.md,
                }}
              >
                <Text style={{ fontSize: typography.sm, fontWeight: typography.bold, color: palette.brandBlue }}>
                  {String(index + 1).padStart(2, '0')}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: typography.base,
                    fontWeight: typography.bold,
                    color: t.text,
                    marginBottom: 2,
                  }}
                >
                  {cert.name}
                </Text>
                <Text style={{ fontSize: typography.xs, color: t.textMuted }} numberOfLines={1}>
                  {cert.processDuration}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={t.textMuted} />
            </View>
          </GlassCard>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

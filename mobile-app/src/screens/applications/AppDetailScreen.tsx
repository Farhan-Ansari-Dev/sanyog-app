/**
 * AppDetailScreen – Application detail with timeline and document list
 */
import React, { useMemo } from 'react';
import { View, Text, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { useAppStore } from '../../store/useAppStore';
import GlassCard from '../../components/common/GlassCard';
import StatusBadge from '../../components/common/StatusBadge';
import PrimaryButton from '../../components/common/PrimaryButton';
import SectionHeader from '../../components/common/SectionHeader';
import { spacing, typography, borderRadius, palette } from '../../theme';
import type { ApplicationStatus } from '../../types';

const statusColors: Record<string, string> = {
  draft: palette.brandBlue,
  submitted: palette.brandBlue,
  under_review: palette.brandGold,
  documents_required: palette.brandGold,
  document_verification: '#8B5CF6',
  expert_assigned: '#06B6D4',
  testing: palette.brandGold,
  approved: palette.success,
  rejected: palette.error,
};

export default function AppDetailScreen({ navigation, route }: any) {
  const t = useTheme();
  const { appId } = route.params;
  const applications = useAppStore((s) => s.applications);
  const app = useMemo(() => applications.find((a) => a.id === appId), [applications, appId]);

  if (!app) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: t.bg, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: t.textMuted }}>Application not found</Text>
      </SafeAreaView>
    );
  }

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formatDateTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} at ${d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`;
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
          <StatusBadge status={app.status} />
          <Text
            style={{
              fontSize: typography['2xl'],
              fontWeight: typography.black,
              color: t.text,
              letterSpacing: typography.tighter,
              marginTop: spacing.md,
            }}
          >
            {app.certName}
          </Text>
          <Text style={{ fontSize: typography.sm, color: t.textMuted, marginTop: spacing.xs }}>
            {app.categoryName} • Applied {formatDate(app.createdAt)}
          </Text>
        </View>

        {/* Info Card */}
        <GlassCard style={{ marginBottom: spacing.lg }}>
          {[
            { label: 'Company', value: app.companyName },
            { label: 'Applicant', value: app.applicantName },
            { label: 'Email', value: app.email },
            { label: 'Last Updated', value: formatDate(app.updatedAt) },
          ].map((item, i) => (
            <View
              key={i}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingVertical: spacing.sm,
                borderBottomWidth: i < 3 ? 1 : 0,
                borderBottomColor: t.borderSubtle,
              }}
            >
              <Text style={{ fontSize: typography.sm, color: t.textMuted }}>{item.label}</Text>
              <Text
                style={{
                  fontSize: typography.sm,
                  color: t.text,
                  fontWeight: typography.medium,
                  maxWidth: '60%',
                  textAlign: 'right',
                }}
                numberOfLines={1}
              >
                {item.value}
              </Text>
            </View>
          ))}
        </GlassCard>

        {/* Remarks */}
        {!!app.remarks && (
          <View
            style={{
              padding: spacing.base,
              backgroundColor: app.status === 'documents_required' ? t.warningBg : t.infoBg,
              borderRadius: borderRadius.lg,
              marginBottom: spacing.lg,
              flexDirection: 'row',
              alignItems: 'flex-start',
            }}
          >
            <Ionicons
              name={app.status === 'documents_required' ? 'alert-circle' : 'information-circle'}
              size={18}
              color={app.status === 'documents_required' ? t.warning : t.info}
              style={{ marginRight: spacing.sm, marginTop: 2 }}
            />
            <Text
              style={{
                flex: 1,
                fontSize: typography.sm,
                color: app.status === 'documents_required' ? t.warning : t.info,
                lineHeight: typography.sm * typography.relaxed,
              }}
            >
              {app.remarks}
            </Text>
          </View>
        )}

        {/* Timeline */}
        <SectionHeader title="Status Timeline" />
        <GlassCard>
          {app.statusHistory.map((entry, i) => {
            const isLast = i === app.statusHistory.length - 1;
            const color = statusColors[entry.status];
            return (
              <View key={i} style={{ flexDirection: 'row', marginBottom: isLast ? 0 : spacing.lg }}>
                {/* Timeline line + dot */}
                <View style={{ alignItems: 'center', width: 24, marginRight: spacing.md }}>
                  <View
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 6,
                      backgroundColor: isLast ? color : color + '40',
                      borderWidth: isLast ? 3 : 2,
                      borderColor: isLast ? color + '30' : color + '25',
                    }}
                  />
                  {!isLast && (
                    <View
                      style={{
                        width: 2,
                        flex: 1,
                        backgroundColor: t.border,
                        marginTop: 4,
                      }}
                    />
                  )}
                </View>
                {/* Content */}
                <View style={{ flex: 1, paddingBottom: isLast ? 0 : spacing.xs }}>
                  <StatusBadge status={entry.status} size="sm" />
                  <Text
                    style={{
                      fontSize: typography.sm,
                      color: t.textSecondary,
                      marginTop: spacing.xs,
                      lineHeight: typography.sm * typography.relaxed,
                    }}
                  >
                    {entry.note}
                  </Text>
                  <Text
                    style={{
                      fontSize: typography.xs,
                      color: t.textMuted,
                      marginTop: spacing.xs,
                    }}
                  >
                    {formatDateTime(entry.date)}
                  </Text>
                </View>
              </View>
            );
          })}
        </GlassCard>

        {/* Documents */}
        <SectionHeader title="Documents" subtitle={`${app.documents.length} uploaded`} />
        {app.documents.length === 0 ? (
          <GlassCard>
            <View style={{ alignItems: 'center', paddingVertical: spacing.lg }}>
              <Ionicons name="cloud-upload-outline" size={36} color={t.textMuted} />
              <Text style={{ color: t.textMuted, fontSize: typography.sm, marginTop: spacing.md }}>
                No documents uploaded yet
              </Text>
            </View>
          </GlassCard>
        ) : (
          app.documents.map((doc) => (
            <GlassCard key={doc.id} style={{ marginBottom: spacing.sm }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: borderRadius.md,
                    backgroundColor: t.primary + '12',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: spacing.md,
                  }}
                >
                  <Ionicons name="document-text" size={20} color={t.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: typography.sm, color: t.text, fontWeight: typography.medium }} numberOfLines={1}>
                    {doc.name}
                  </Text>
                  <Text style={{ fontSize: typography.xs, color: t.textMuted, marginTop: 2 }}>
                    {doc.size} • {formatDate(doc.uploadedAt)}
                  </Text>
                </View>
              </View>
            </GlassCard>
          ))
        )}

        {/* Upload Button */}
        <PrimaryButton
          title="Upload Documents"
          onPress={() => navigation.navigate('UploadDocs', { appId: app.id })}
          variant="outline"
          icon="cloud-upload-outline"
          style={{ marginTop: spacing.lg }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

/**
 * ApplicationsScreen – Application tracking dashboard with timeline
 */
import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, ScrollView, SafeAreaView, StatusBar, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { useAppStore } from '../../store/useAppStore';
import GlassCard from '../../components/common/GlassCard';
import SearchBar from '../../components/common/SearchBar';
import StatusBadge from '../../components/common/StatusBadge';
import Skeleton from '../../components/Skeleton';
import { spacing, typography, borderRadius } from '../../theme';

export default function ApplicationsScreen({ navigation }: any) {
  const t = useTheme();
  const store = useAppStore();
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    store.loadApplications();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise((r) => setTimeout(r, 800));
    store.loadApplications();
    setRefreshing(false);
  };

  const filtered = useMemo(() => {
    if (!search.trim()) return store.applications;
    const q = search.toLowerCase();
    return store.applications.filter(
      (a) =>
        a.certName.toLowerCase().includes(q) ||
        a.categoryName.toLowerCase().includes(q) ||
        a.status.toLowerCase().includes(q) ||
        a.companyName.toLowerCase().includes(q)
    );
  }, [store.applications, search]);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }}>
      <StatusBar barStyle={t.statusBar} backgroundColor={t.bg} />
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: spacing['3xl'] }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={t.primary} />}
      >
        {/* Header */}
        <View style={{ marginTop: spacing.lg, marginBottom: spacing.lg }}>
          <Text
            style={{
              fontSize: typography['3xl'],
              fontWeight: typography.black,
              color: t.text,
              letterSpacing: typography.tighter,
            }}
          >
            Applications
          </Text>
          <Text style={{ fontSize: typography.sm, color: t.textMuted, marginTop: spacing.xs }}>
            Track and manage your certification applications
          </Text>
        </View>

        <View style={{ marginHorizontal: -spacing.lg }}>
          <SearchBar value={search} onChangeText={setSearch} placeholder="Search applications..." />
        </View>

        {/* Stats Summary */}
        <View style={{ flexDirection: 'row', marginTop: spacing.lg, marginBottom: spacing.lg }}>
          {[
            { label: 'Total', count: store.applications.length, color: t.primary },
            { label: 'Active', count: store.applications.filter((a) => !['approved', 'rejected'].includes(a.status)).length, color: t.warning },
            { label: 'Done', count: store.applications.filter((a) => a.status === 'approved').length, color: t.success },
          ].map((stat) => (
            <View
              key={stat.label}
              style={{
                flex: 1,
                backgroundColor: t.card,
                borderRadius: borderRadius.lg,
                padding: spacing.md,
                alignItems: 'center',
                borderWidth: 1,
                borderColor: t.borderSubtle,
                marginLeft: stat.label !== 'Total' ? spacing.sm : 0,
                elevation: 2,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.06,
                shadowRadius: 3,
              }}
            >
              <Text style={{ fontSize: typography.xl, fontWeight: typography.black, color: stat.color }}>
                {stat.count}
              </Text>
              <Text style={{ fontSize: typography.xs, color: t.textMuted, marginTop: 2 }}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Application Cards */}
        {store.isLoading ? (
          <View>
             {[1, 2, 3].map(i => (
               <View key={i} style={{ marginBottom: spacing.md, backgroundColor: t.card, borderRadius: borderRadius.lg, padding: spacing.md, borderWidth: 1, borderColor: t.borderSubtle }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.md }}>
                    <View style={{ flex: 1, gap: 8 }}>
                       <Skeleton style={{ height: 20, width: '70%' }} />
                       <Skeleton style={{ height: 14, width: '40%' }} />
                    </View>
                    <Skeleton style={{ height: 24, width: 80, borderRadius: 12 }} />
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: t.borderSubtle, paddingTop: spacing.md }}>
                     <Skeleton style={{ height: 14, width: 80 }} />
                     <Skeleton style={{ height: 14, width: 60 }} />
                     <Skeleton style={{ height: 14, width: 20 }} />
                  </View>
               </View>
             ))}
          </View>
        ) : filtered.length === 0 ? (
          <View style={{ alignItems: 'center', paddingVertical: spacing['3xl'] }}>
            <Ionicons name="document-text-outline" size={48} color={t.textMuted} />
            <Text style={{ color: t.textMuted, fontSize: typography.base, marginTop: spacing.md, fontWeight: typography.semiBold }}>
              {search ? 'No matching applications' : 'No applications yet'}
            </Text>
            <Text style={{ color: t.textMuted, fontSize: typography.sm, marginTop: spacing.xs, textAlign: 'center' }}>
              {search ? 'Try a different search term' : 'Start by applying for a certification'}
            </Text>
          </View>
        ) : (
          filtered.map((app) => (
            <GlassCard
              key={app.id}
              onPress={() => navigation.navigate('AppDetail', { appId: app.id })}
              style={{ marginBottom: spacing.md }}
            >
              {/* Header Row */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.md }}>
                <View style={{ flex: 1, marginRight: spacing.md }}>
                  <Text
                    style={{
                      fontSize: typography.base,
                      fontWeight: typography.bold,
                      color: t.text,
                      marginBottom: spacing.xs,
                    }}
                    numberOfLines={1}
                  >
                    {app.certName}
                  </Text>
                  <Text style={{ fontSize: typography.xs, color: t.textMuted }}>
                    {app.categoryName}
                  </Text>
                </View>
                <StatusBadge status={app.status} />
              </View>

              {/* Info Row */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: t.borderSubtle, paddingTop: spacing.md }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons name="calendar-outline" size={14} color={t.textMuted} />
                  <Text style={{ fontSize: typography.xs, color: t.textMuted, marginLeft: 4 }}>
                    {formatDate(app.createdAt)}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons name="document-outline" size={14} color={t.textMuted} />
                  <Text style={{ fontSize: typography.xs, color: t.textMuted, marginLeft: 4 }}>
                    {app.documents.length} docs
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons name="chevron-forward" size={16} color={t.textMuted} />
                </View>
              </View>

              {/* Remarks (if any) */}
              {!!app.remarks && app.status === 'documents_required' && (
                <View
                  style={{
                    marginTop: spacing.md,
                    padding: spacing.md,
                    backgroundColor: t.warningBg,
                    borderRadius: borderRadius.md,
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                  }}
                >
                  <Ionicons name="alert-circle" size={16} color={t.warning} style={{ marginRight: spacing.sm, marginTop: 2 }} />
                  <Text style={{ flex: 1, fontSize: typography.xs, color: t.warning, lineHeight: typography.xs * typography.relaxed }}>
                    {app.remarks}
                  </Text>
                </View>
              )}
            </GlassCard>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

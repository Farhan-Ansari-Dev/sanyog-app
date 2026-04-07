/**
 * ServicesScreen – Marketplace with category cards, search, and filters
 */
import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, ScrollView, SafeAreaView, StatusBar, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { useAppStore } from '../../store/useAppStore';
import GlassCard from '../../components/common/GlassCard';
import SearchBar from '../../components/common/SearchBar';
import SectionHeader from '../../components/common/SectionHeader';
import { spacing, typography, borderRadius, palette } from '../../theme';

export default function ServicesScreen({ navigation }: any) {
  const t = useTheme();
  const store = useAppStore();
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  useEffect(() => {
    store.loadCatalog();
  }, []);

  const filteredCerts = useMemo(() => {
    let certs = store.certifications;
    if (activeFilter) {
      certs = certs.filter((c) => c.categoryId === activeFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      certs = certs.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.categoryName.toLowerCase().includes(q) ||
          c.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }
    return certs;
  }, [store.certifications, search, activeFilter]);

  const popularCerts = useMemo(
    () => store.certifications.filter((c) => c.isPopular),
    [store.certifications]
  );

  const filterTabs = [
    { id: null, label: 'All' },
    ...store.categories.map((c) => ({ id: c.id, label: c.name.split(' ')[0] })),
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }}>
      <StatusBar barStyle={t.statusBar} backgroundColor={t.bg} />
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: spacing['3xl'] }}
        showsVerticalScrollIndicator={false}
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
            Services
          </Text>
          <Text style={{ fontSize: typography.sm, color: t.textMuted, marginTop: spacing.xs }}>
            Browse 60+ certification, testing & inspection services
          </Text>
        </View>

        {/* Search */}
        <SearchBar value={search} onChangeText={setSearch} placeholder="Search certifications..." />

        {/* Category Cards */}
        {!search && !activeFilter && (
          <>
            <SectionHeader title="Categories" />
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', }}>
              {store.categories.map((cat) => (
                <Pressable
                  key={cat.id}
                  onPress={() => navigation.navigate('ServiceGroup', { categoryId: cat.id, categoryName: cat.name })}
                  style={({ pressed }) => ({
                    width: '48%' as any,
                    backgroundColor: t.card,
                    borderRadius: borderRadius.xl,
                    padding: spacing.base,
                    borderWidth: 1,
                    borderColor: t.borderSubtle,
                    opacity: pressed ? 0.85 : 1,
                    minHeight: 140,
                  })}
                >
                  <View
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: borderRadius.md,
                      backgroundColor: cat.gradient[0] + '15',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginBottom: spacing.md,
                    }}
                  >
                    <Ionicons name={cat.icon as any} size={22} color={cat.gradient[0]} />
                  </View>
                  <Text
                    style={{
                      fontSize: typography.sm,
                      fontWeight: typography.bold,
                      color: t.text,
                      marginBottom: spacing.xs,
                    }}
                    numberOfLines={2}
                  >
                    {cat.name}
                  </Text>
                  <Text style={{ fontSize: typography.xs, color: t.textMuted }}>
                    {cat.serviceCount} services
                  </Text>
                </Pressable>
              ))}
            </View>
          </>
        )}

        {/* Filter Tabs */}
        <SectionHeader title={search || activeFilter ? 'Results' : 'Popular Services'} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: spacing.md, marginHorizontal: -spacing.lg }}>
          <View style={{ paddingHorizontal: spacing.lg, flexDirection: 'row', }}>
            {filterTabs.map((tab) => {
              const isActive = activeFilter === tab.id;
              return (
                <Pressable
                  key={tab.id ?? 'all'}
                  onPress={() => setActiveFilter(isActive ? null : tab.id)}
                  style={{
                    paddingHorizontal: spacing.base,
                    paddingVertical: spacing.sm,
                    borderRadius: borderRadius.full,
                    backgroundColor: isActive ? t.primary : t.card,
                    borderWidth: 1,
                    borderColor: isActive ? t.primary : t.borderSubtle,
                  }}
                >
                  <Text
                    style={{
                      fontSize: typography.sm,
                      fontWeight: typography.semiBold,
                      color: isActive ? '#FFFFFF' : t.textSecondary,
                    }}
                  >
                    {tab.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>

        {/* Certification List */}
        {(search || activeFilter ? filteredCerts : popularCerts).map((cert) => (
          <GlassCard
            key={cert.id}
            onPress={() => navigation.navigate('CertDetail', { certId: cert.id })}
            style={{ marginBottom: spacing.md }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: borderRadius.md,
                  backgroundColor: palette.brandBlue + '12',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: spacing.md,
                }}
              >
                <Ionicons name="ribbon-outline" size={22} color={palette.brandBlue} />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: typography.base,
                    fontWeight: typography.bold,
                    color: t.text,
                    marginBottom: 4,
                  }}
                >
                  {cert.name}
                </Text>
                <Text
                  style={{
                    fontSize: typography.xs,
                    color: t.textMuted,
                    lineHeight: typography.xs * typography.relaxed,
                    marginBottom: spacing.sm,
                  }}
                  numberOfLines={2}
                >
                  {cert.shortDescription}
                </Text>
                <View style={{ flexDirection: 'row', }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name="time-outline" size={12} color={t.textMuted} />
                    <Text style={{ fontSize: typography.xs, color: t.textMuted, marginLeft: 4 }}>
                      {cert.processDuration}
                    </Text>
                  </View>
                  </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color={t.textMuted} style={{ marginTop: 4 }} />
            </View>
          </GlassCard>
        ))}

        {filteredCerts.length === 0 && (search || activeFilter) && (
          <View style={{ alignItems: 'center', paddingVertical: spacing['3xl'] }}>
            <Ionicons name="search-outline" size={48} color={t.textMuted} />
            <Text style={{ color: t.textMuted, fontSize: typography.base, marginTop: spacing.md }}>
              No services found
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

/**
 * HomeScreen – Premium Dashboard with Hero CTA, stats, quick actions, featured services
 * Enhanced for native Android/iOS with elevation shadows and micro-interactions
 */
import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Pressable,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { useAppStore } from '../../store/useAppStore';
import GlassCard from '../../components/common/GlassCard';
import SectionHeader from '../../components/common/SectionHeader';
import StatusBadge from '../../components/common/StatusBadge';
import { spacing, typography, borderRadius, palette } from '../../theme';

export default function HomeScreen({ navigation }: any) {
  const t = useTheme();
  const store = useAppStore();
  const { width } = useWindowDimensions();

  useEffect(() => {
    store.loadCatalog();
    store.loadApplications();
    store.loadNotifications();
    store.loadNews();
  }, []);

  const recentApps = store.applications.slice(0, 3);
  const featuredCerts = store.certifications.filter((c) => c.isFeatured).slice(0, 4);

  const statCards = [
    {
      label: 'Active',
      value: store.applications.filter((a) => {
        const s = (a.status || "").toLowerCase();
        return !s.includes("approved") && !s.includes("rejected");
      }).length,
      icon: 'time-outline' as const,
      color: '#3B82F6',
      bg: '#3B82F6' + '15',
    },
    {
      label: 'Approved',
      value: store.applications.filter((a) => (a.status || "").toLowerCase().includes("approved")).length,
      icon: 'checkmark-circle-outline' as const,
      color: '#10B981',
      bg: '#10B981' + '15',
    },
    {
      label: 'Action',
      value: store.applications.filter((a) => a.status === 'documents_required').length,
      icon: 'alert-circle-outline' as const,
      color: '#F59E0B',
      bg: '#F59E0B' + '15',
    },
  ];

  const quickActions = [
    {
      label: 'Apply Now',
      icon: 'add-circle' as const,
      color: '#3B82F6',
      bg: '#3B82F6' + '12',
      onPress: () => navigation.navigate('ServicesList'),
    },
    {
      label: 'Track',
      icon: 'analytics' as const,
      color: '#10B981',
      bg: '#10B981' + '12',
      onPress: () => navigation.navigate('AppsList'),
    },
    {
      label: 'Expert',
      icon: 'chatbubble-ellipses' as const,
      color: '#8B5CF6',
      bg: '#8B5CF6' + '12',
      onPress: () => navigation.navigate('ContactExpert'),
    },
    {
      label: 'Call Us',
      icon: 'call' as const,
      color: '#F59E0B',
      bg: '#F59E0B' + '12',
      onPress: () => {},
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }}>
      <StatusBar barStyle={t.statusBar} backgroundColor={t.bg} />
      <ScrollView
        contentContainerStyle={{ paddingBottom: spacing['3xl'] }}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── Header ─── */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: spacing.lg,
            marginTop: spacing.lg,
            marginBottom: spacing.xl,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 13, color: t.textMuted, fontWeight: '500' }}>
              Welcome back,
            </Text>
            <Text
              style={{
                fontSize: 26,
                fontWeight: '900',
                color: t.text,
                letterSpacing: -0.5,
                marginTop: 2,
              }}
            >
              {store.user?.name?.split(' ')[0] || 'User'} 👋
            </Text>
          </View>

          <Pressable
            onPress={() => navigation.navigate('NotifList')}
            style={({ pressed }) => ({
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: t.card,
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: t.borderSubtle,
              opacity: pressed ? 0.7 : 1,
              elevation: 2,
              shadowColor: t.shadow,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
            })}
          >
            <Ionicons name="notifications-outline" size={22} color={t.text} />
            {store.unreadCount > 0 && (
              <View
                style={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: '#EF4444',
                  borderWidth: 2,
                  borderColor: t.bg,
                }}
              />
            )}
          </Pressable>
        </View>

        {/* ═══════════════════════════════════════════════════
            ★ COMPLIANCE DASHBOARD OVERVIEW
           ═══════════════════════════════════════════════════ */}
        <View style={{ marginHorizontal: spacing.lg, marginBottom: spacing.xl }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.md }}>
            <GlassCard style={{ flex: 1, marginRight: spacing.sm, backgroundColor: store.theme === 'dark' ? '#064E3B' : '#E7F9F3', borderColor: '#10B981', paddingTop: spacing.xl, borderLeftWidth: 6 }}>
               <Ionicons name="shield-checkmark" size={28} color="#10B981" style={{ marginBottom: spacing.sm }} />
               <Text style={{ fontSize: 32, fontWeight: '900', color: store.theme === 'dark' ? '#fff' : '#065F46' }}>
                 {store.applications.filter((a) => (a.status || "").toLowerCase().includes("approved")).length}
               </Text>
               <Text style={{ fontSize: 13, color: store.theme === 'dark' ? '#A7F3D0' : '#065F46', fontWeight: '700', marginTop: 4, letterSpacing: 0.5 }}>
                 Active Certificates
               </Text>
            </GlassCard>

            <View style={{ flex: 1, marginLeft: spacing.sm, justifyContent: 'space-between' }}>
              <GlassCard style={{ flex: 1, marginBottom: spacing.sm, padding: spacing.md }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <View>
                    <Text style={{ fontSize: 20, fontWeight: '800', color: t.text }}>
                      {store.applications.filter((a) => {
                        const s = (a.status || "").toLowerCase();
                        return !s.includes("approved") && !s.includes("rejected");
                      }).length}
                    </Text>
                    <Text style={{ fontSize: 12, color: t.textMuted, fontWeight: '500' }}>In Progress</Text>
                  </View>
                  <Ionicons name="sync" size={20} color="#3B82F6" />
                </View>
              </GlassCard>

              <GlassCard style={{ flex: 1, marginTop: spacing.sm, padding: spacing.md, backgroundColor: '#FEF2F2', borderColor: '#FCA5A5' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <View>
                    <Text style={{ fontSize: 20, fontWeight: '800', color: '#EF4444' }}>
                      {store.applications.filter((a) => {
                        if (!a.validUntil || a.status !== 'approved') return false;
                        const daysLeft = (new Date(a.validUntil).getTime() - Date.now()) / (1000 * 3600 * 24);
                        return daysLeft < 60; //Expiring in 60 days
                      }).length}
                    </Text>
                    <Text style={{ fontSize: 12, color: '#EF4444', fontWeight: '500' }}>Renewals Due</Text>
                  </View>
                  <Ionicons name="warning" size={20} color="#EF4444" />
                </View>
              </GlassCard>
            </View>
          </View>
        </View>

        {/* ═══════════════════════════════════════════════════
            ★ REGULATORY NEWS & ALERTS (Crawler Context)
           ═══════════════════════════════════════════════════ */}
        <SectionHeader title="Regulatory Updates" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: spacing.xl }}>
          <View style={{ paddingHorizontal: spacing.lg, flexDirection: 'row' }}>
            {store.news.length > 0 ? (
              store.news.map((item: any) => (
                <GlassCard key={item.id} style={{ width: width * 0.75, marginRight: spacing.md, backgroundColor: '#F8FAFC' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.xs }}>
                    <View style={{ 
                      paddingHorizontal: 8, 
                      paddingVertical: 4, 
                      borderRadius: 4, 
                      backgroundColor: item.category === 'BIS' ? '#DBEAFE' : item.category === 'EPR' ? '#D1FAE5' : '#FEF3C7' 
                    }}>
                      <Text style={{ fontSize: 10, fontWeight: '700', color: item.category === 'BIS' ? '#1E40AF' : item.category === 'EPR' ? '#065F46' : '#92400E' }}>
                        {item.category}
                      </Text>
                    </View>
                    <Text style={{ fontSize: 11, color: t.textMuted, marginLeft: 8 }}>
                      {new Date(item.date).toLocaleDateString()}
                    </Text>
                  </View>
                  <Text style={{ fontSize: 15, fontWeight: '700', color: t.text, marginBottom: 4 }}>
                    {item.title}
                  </Text>
                  <Text style={{ fontSize: 13, color: t.textMuted }} numberOfLines={2}>
                    {item.content}
                  </Text>
                </GlassCard>
              ))
            ) : (
              <GlassCard style={{ width: width * 0.75, marginRight: spacing.md, backgroundColor: '#F8FAFC' }}>
                <Text style={{ fontSize: 13, color: t.textMuted }}>Fetching latest updates...</Text>
              </GlassCard>
            )}
          </View>
        </ScrollView>
        {/* ═══════════════════════════════════════════════════
            ★ SMART AI ROADMAP — Big Hero CTA Card
           ═══════════════════════════════════════════════════ */}
        <Pressable
          onPress={() => navigation.navigate('RoadmapWizard')}
          style={({ pressed }) => ({
            marginHorizontal: spacing.lg,
            marginBottom: spacing.xl,
            borderRadius: borderRadius.xl,
            overflow: 'hidden',
            opacity: pressed ? 0.92 : 1,
            transform: [{ scale: pressed ? 0.985 : 1 }],
            elevation: 8,
            shadowColor: '#10B981',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.35,
            shadowRadius: 12,
          })}
        >
          <View
            style={{
              backgroundColor: '#064E3B',
              borderRadius: borderRadius.xl,
              padding: spacing.xl,
              overflow: 'hidden',
            }}
          >
            {/* Decorative circles */}
            <View
              style={{
                position: 'absolute',
                top: -30,
                right: -30,
                width: 120,
                height: 120,
                borderRadius: 60,
                backgroundColor: 'rgba(16,185,129,0.25)',
              }}
            />
            
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg }}>
              <View
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 16,
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Ionicons name="sparkles" size={28} color="#FFFFFF" />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: 'rgba(16,185,129,0.2)',
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 20,
                }}
              >
                <Ionicons name="flash" size={12} color="#34D399" />
                <Text style={{ color: '#34D399', fontSize: 11, fontWeight: '700', marginLeft: 4 }}>
                  AI Powered
                </Text>
              </View>
            </View>

            {/* Title */}
            <Text
              style={{
                fontSize: 24,
                fontWeight: '900',
                color: '#FFFFFF',
                letterSpacing: -0.3,
                marginBottom: spacing.sm,
              }}
            >
              Smart AI Roadmap
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: 'rgba(255,255,255,0.75)',
                lineHeight: 20,
                marginBottom: spacing.xl,
              }}
            >
              Get your complete certification roadmap in 60 seconds. No consultant. No confusion.
            </Text>

            {/* Bottom row: CTA + Stats */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: '#3B82F6',
                  paddingHorizontal: 20,
                  paddingVertical: 12,
                  borderRadius: borderRadius.lg,
                }}
              >
                <Text style={{ color: '#FFFFFF', fontSize: 15, fontWeight: '700', marginRight: 8 }}>
                  Generate Now
                </Text>
                <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
              </View>

              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: '600' }}>
                  Time
                </Text>
                <Text style={{ color: '#FFFFFF', fontSize: 22, fontWeight: '900' }}>
                  60s
                </Text>
              </View>
            </View>
          </View>
        </Pressable>

        {/* ─── Stats Row ─── */}
        <View style={{ flexDirection: 'row', paddingHorizontal: spacing.lg }}>
          {statCards.map((stat, i) => (
            <Pressable
              key={i}
              onPress={() => navigation.navigate('AppsList')}
              style={({ pressed }) => ({
                flex: 1,
                alignItems: 'center',
                paddingVertical: spacing.base,
                backgroundColor: t.card,
                borderRadius: borderRadius.lg,
                borderWidth: 1,
                borderColor: t.borderSubtle,
                marginLeft: i > 0 ? spacing.sm : 0,
                opacity: pressed ? 0.8 : 1,
                elevation: 2,
                shadowColor: t.shadow,
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.06,
                shadowRadius: 3,
              })}
            >
              <View
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 19,
                  backgroundColor: stat.bg,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: spacing.sm,
                }}
              >
                <Ionicons name={stat.icon} size={18} color={stat.color} />
              </View>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: '900',
                  color: t.text,
                }}
              >
                {stat.value}
              </Text>
              <Text
                style={{
                  fontSize: 11,
                  color: t.textMuted,
                  fontWeight: '600',
                  marginTop: 2,
                }}
              >
                {stat.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* ─── Quick Actions ─── */}
        <SectionHeader title="Quick Actions" />
        <View style={{ flexDirection: 'row', paddingHorizontal: spacing.lg }}>
          {quickActions.map((action, i) => (
            <Pressable
              key={i}
              onPress={action.onPress}
              style={({ pressed }) => ({
                flex: 1,
                alignItems: 'center',
                paddingVertical: spacing.base,
                backgroundColor: t.card,
                borderRadius: borderRadius.lg,
                borderWidth: 1,
                borderColor: t.borderSubtle,
                opacity: pressed ? 0.75 : 1,
                transform: [{ scale: pressed ? 0.95 : 1 }],
                marginLeft: i > 0 ? spacing.sm : 0,
                elevation: 2,
                shadowColor: t.shadow,
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.06,
                shadowRadius: 3,
              })}
            >
              <View
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 14,
                  backgroundColor: action.bg,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: spacing.sm,
                }}
              >
                <Ionicons name={action.icon} size={22} color={action.color} />
              </View>
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: '700',
                  color: t.textSecondary,
                }}
              >
                {action.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* ─── Featured Services ─── */}
        <SectionHeader
          title="Featured Services"
          subtitle="Popular certifications"
          actionLabel="View All"
          onAction={() => navigation.navigate('ServicesList')}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: spacing.lg }}
          decelerationRate="fast"
          snapToInterval={width * 0.52 + spacing.md}
        >
          {featuredCerts.map((cert, i) => (
            <Pressable
              key={cert.id}
              onPress={() => navigation.navigate('CertDetail', { certId: cert.id })}
              style={({ pressed }) => ({
                width: width * 0.52,
                backgroundColor: t.card,
                borderRadius: borderRadius.xl,
                padding: spacing.base,
                borderWidth: 1,
                borderColor: t.borderSubtle,
                opacity: pressed ? 0.85 : 1,
                transform: [{ scale: pressed ? 0.97 : 1 }],
                marginRight: spacing.md,
                elevation: 3,
                shadowColor: t.shadow,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 6,
              })}
            >
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  backgroundColor: '#3B82F6' + '15',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: spacing.md,
                }}
              >
                <Ionicons name="ribbon-outline" size={22} color="#3B82F6" />
              </View>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: '800',
                  color: t.text,
                  marginBottom: spacing.xs,
                }}
                numberOfLines={1}
              >
                {cert.name}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: t.textMuted,
                  lineHeight: 18,
                }}
                numberOfLines={2}
              >
                {cert.shortDescription}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: spacing.md,
                  backgroundColor: t.bg,
                  paddingHorizontal: spacing.sm,
                  paddingVertical: 4,
                  borderRadius: borderRadius.sm,
                  alignSelf: 'flex-start',
                }}
              >
                <Ionicons name="time-outline" size={12} color={t.textMuted} />
                <Text style={{ fontSize: 11, color: t.textMuted, marginLeft: 4, fontWeight: '600' }}>
                  {cert.processDuration}
                </Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>

        {/* ─── Recent Applications ─── */}
        {recentApps.length > 0 && (
          <>
            <SectionHeader
              title="Recent Applications"
              actionLabel="View All"
              onAction={() => navigation.navigate('AppsList')}
            />
            <View style={{ paddingHorizontal: spacing.lg }}>
              {recentApps.map((app) => (
                <Pressable
                  key={app.id}
                  onPress={() => navigation.navigate('AppDetail', { appId: app.id })}
                  style={({ pressed }) => ({
                    backgroundColor: t.card,
                    borderRadius: borderRadius.lg,
                    padding: spacing.base,
                    borderWidth: 1,
                    borderColor: t.borderSubtle,
                    marginBottom: spacing.sm,
                    opacity: pressed ? 0.85 : 1,
                    elevation: 2,
                    shadowColor: t.shadow,
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.06,
                    shadowRadius: 3,
                  })}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <View style={{ flex: 1, marginRight: spacing.md }}>
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: '700',
                          color: t.text,
                          marginBottom: 4,
                        }}
                        numberOfLines={1}
                      >
                        {app.certName}
                      </Text>
                      <Text style={{ fontSize: 12, color: t.textMuted }}>
                        {app.categoryName} • {new Date(app.updatedAt).toLocaleDateString()}
                      </Text>
                    </View>
                    <StatusBadge status={app.status} size="sm" />
                  </View>
                </Pressable>
              ))}
            </View>
          </>
        )}

        {/* ─── Service Categories ─── */}
        <SectionHeader
          title="Explore Categories"
          subtitle="Browse all service types"
        />
        <View style={{ paddingHorizontal: spacing.lg }}>
          {store.categories.map((cat) => (
            <Pressable
              key={cat.id}
              onPress={() => navigation.navigate('ServiceGroup', { categoryId: cat.id, categoryName: cat.name })}
              style={({ pressed }) => ({
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: t.card,
                borderRadius: borderRadius.lg,
                padding: spacing.base,
                borderWidth: 1,
                borderColor: t.borderSubtle,
                marginBottom: spacing.sm,
                opacity: pressed ? 0.85 : 1,
                transform: [{ scale: pressed ? 0.98 : 1 }],
                elevation: 2,
                shadowColor: t.shadow,
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.06,
                shadowRadius: 3,
              })}
            >
              <View
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 16,
                  backgroundColor: cat.gradient[0] + '15',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: spacing.base,
                }}
              >
                <Ionicons name={cat.icon as any} size={24} color={cat.gradient[0]} />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: '700',
                    color: t.text,
                    marginBottom: 2,
                  }}
                >
                  {cat.name}
                </Text>
                <Text style={{ fontSize: 12, color: t.textMuted, fontWeight: '500' }}>
                  {cat.serviceCount} services available
                </Text>
              </View>
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  backgroundColor: t.bg,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Ionicons name="chevron-forward" size={16} color={t.textMuted} />
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

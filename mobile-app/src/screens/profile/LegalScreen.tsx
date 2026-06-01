import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../hooks/useTheme';
import { spacing, typography, borderRadius } from '../../theme';

export default function LegalScreen() {
  const t = useTheme();
  const navigation = useNavigation();

  const LEGAL_ITEMS = [
    { title: 'Terms of Service', icon: 'document-text-outline' },
    { title: 'Privacy Policy', icon: 'shield-checkmark-outline' },
    { title: 'Cookie Policy', icon: 'browsers-outline' },
    { title: 'End User License Agreement', icon: 'business-outline' },
    { title: 'Data Processing Agreement', icon: 'server-outline' }
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: t.bg }]}>
      <View style={[styles.header, { backgroundColor: t.surface, borderBottomColor: t.border }]}>
        <Ionicons name="arrow-back" size={24} color={t.text} onPress={() => navigation.goBack()} style={styles.backIcon} />
        <Text style={[styles.headerTitle, { color: t.text }]}>Legal & Privacy</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={[styles.headerCard, { backgroundColor: t.primary }]}>
          <Ionicons name="shield-checkmark" size={48} color="#fff" />
          <Text style={styles.headerCardTitle}>Commitment to Privacy</Text>
          <Text style={styles.headerCardSubtitle}>
            We protect your compliance data with enterprise-grade security and strict confidentiality agreements.
          </Text>
        </View>

        <Text style={[styles.sectionTitle, { color: t.text }]}>Documents</Text>

        <View style={[styles.listContainer, { backgroundColor: t.surface, borderColor: t.border }]}>
          {LEGAL_ITEMS.map((item, index) => (
            <View key={index}>
              <TouchableOpacity style={styles.listItem}>
                <View style={[styles.iconBg, { backgroundColor: t.primary + '15' }]}>
                  <Ionicons name={item.icon as any} size={20} color={t.primary} />
                </View>
                <Text style={[styles.listTitle, { color: t.text }]}>{item.title}</Text>
                <Ionicons name="chevron-forward" size={20} color={t.textMuted} />
              </TouchableOpacity>
              {index < LEGAL_ITEMS.length - 1 && <View style={[styles.divider, { backgroundColor: t.border }]} />}
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={[styles.versionText, { color: t.textMuted }]}>App Version 1.0.0 (Build 42)</Text>
          <Text style={[styles.copyrightText, { color: t.textMuted }]}>© 2026 Sanyog Conformity</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  backIcon: {
    padding: spacing.xs,
  },
  headerTitle: {
    fontSize: typography.lg,
    fontWeight: '700',
  },
  scrollContent: {
    padding: spacing.lg,
  },
  headerCard: {
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  headerCardTitle: {
    color: '#fff',
    fontSize: typography.xl,
    fontWeight: '800',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  headerCardSubtitle: {
    color: '#fff',
    fontSize: typography.sm,
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: typography.lg,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  listContainer: {
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  iconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  listTitle: {
    flex: 1,
    fontSize: typography.base,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    marginLeft: 40 + spacing.md * 2,
  },
  footer: {
    alignItems: 'center',
    marginTop: spacing['2xl'],
    marginBottom: spacing.xl,
  },
  versionText: {
    fontSize: typography.sm,
    marginBottom: 4,
  },
  copyrightText: {
    fontSize: typography.xs,
  }
});

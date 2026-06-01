import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../hooks/useTheme';
import PrimaryButton from '../../components/common/PrimaryButton';
import { spacing, typography, borderRadius } from '../../theme';

export default function ServiceDetailScreen() {
  const t = useTheme();
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: t.bg }]}>
      <View style={[styles.header, { backgroundColor: t.surface, borderBottomColor: t.border }]}>
        <Ionicons name="arrow-back" size={24} color={t.text} onPress={() => navigation.goBack()} style={styles.backIcon} />
        <Text style={[styles.headerTitle, { color: t.text }]}>Service Details</Text>
        <TouchableOpacity>
          <Ionicons name="share-social-outline" size={24} color={t.text} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.banner, { backgroundColor: t.primary + '15' }]}>
          <Ionicons name="shield-checkmark" size={48} color={t.primary} />
          <Text style={[styles.bannerTitle, { color: t.primary }]}>BIS Certification</Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: t.text }]}>Overview</Text>
          <Text style={[styles.bodyText, { color: t.textSecondary }]}>
            The Bureau of Indian Standards (BIS) is the National Standard Body of India. Getting BIS certification ensures that your products are safe, reliable, and compliant with Indian quality standards. 
            It is mandatory for various electronic, IT, and consumer products before they can be sold in the Indian market.
          </Text>
        </View>

        <View style={[styles.infoCard, { backgroundColor: t.surface, borderColor: t.border }]}>
          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={20} color={t.textMuted} />
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: t.textMuted }]}>Estimated Time</Text>
              <Text style={[styles.infoValue, { color: t.text }]}>30 - 45 Days</Text>
            </View>
          </View>
          <View style={[styles.divider, { backgroundColor: t.border }]} />
          <View style={styles.infoRow}>
            <Ionicons name="document-text-outline" size={20} color={t.textMuted} />
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: t.textMuted }]}>Required Docs</Text>
              <Text style={[styles.infoValue, { color: t.text }]}>Technical specs, manual, ISO</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: t.text }]}>Benefits</Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Ionicons name="checkmark-circle" size={20} color={t.success} />
              <Text style={[styles.bulletText, { color: t.textSecondary }]}>Legal market access in India</Text>
            </View>
            <View style={styles.bulletItem}>
              <Ionicons name="checkmark-circle" size={20} color={t.success} />
              <Text style={[styles.bulletText, { color: t.textSecondary }]}>Increased consumer trust and brand value</Text>
            </View>
            <View style={styles.bulletItem}>
              <Ionicons name="checkmark-circle" size={20} color={t.success} />
              <Text style={[styles.bulletText, { color: t.textSecondary }]}>Assurance of quality and safety</Text>
            </View>
          </View>
        </View>

      </ScrollView>

      <View style={[styles.footer, { backgroundColor: t.surface, borderTopColor: t.border }]}>
        <PrimaryButton 
          title="Request Quote" 
          onPress={() => navigation.navigate('QuoteRequestScreen')} 
          style={styles.actionBtn}
        />
      </View>
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
    paddingBottom: 100,
  },
  banner: {
    height: 160,
    borderRadius: borderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  bannerTitle: {
    fontSize: typography.xl,
    fontWeight: '800',
    marginTop: spacing.sm,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.lg,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  bodyText: {
    fontSize: typography.base,
    lineHeight: 24,
  },
  infoCard: {
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoContent: {
    marginLeft: spacing.md,
  },
  infoLabel: {
    fontSize: typography.sm,
    fontWeight: '500',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: typography.base,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    marginVertical: spacing.md,
  },
  bulletList: {
    gap: spacing.sm,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  bulletText: {
    fontSize: typography.base,
    flex: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.lg,
    borderTopWidth: 1,
  },
  actionBtn: {
    width: '100%',
  }
});

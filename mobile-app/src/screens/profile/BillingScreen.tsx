import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../hooks/useTheme';
import { spacing, typography, borderRadius } from '../../theme';

export default function BillingScreen() {
  const t = useTheme();
  const navigation = useNavigation();

  const INVOICES = [
    { id: 'INV-2026-001', date: 'May 15, 2026', amount: '$450.00', status: 'Paid' },
    { id: 'INV-2026-002', date: 'May 01, 2026', amount: '$120.00', status: 'Pending' },
    { id: 'INV-2026-003', date: 'Apr 10, 2026', amount: '$850.00', status: 'Paid' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: t.bg }]}>
      <View style={[styles.header, { backgroundColor: t.surface, borderBottomColor: t.border }]}>
        <Ionicons name="arrow-back" size={24} color={t.text} onPress={() => navigation.goBack()} style={styles.backIcon} />
        <Text style={[styles.headerTitle, { color: t.text }]}>Billing & Invoices</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={[styles.summaryCard, { backgroundColor: t.primary }]}>
          <Text style={styles.summaryTitle}>Current Balance</Text>
          <Text style={styles.summaryAmount}>$120.00</Text>
          <Text style={styles.summarySubtitle}>Due by Jun 01, 2026</Text>
          <TouchableOpacity style={styles.payBtn}>
            <Text style={[styles.payBtnText, { color: t.primary }]}>Pay Now</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.sectionTitle, { color: t.text }]}>Recent Invoices</Text>
        
        <View style={[styles.invoiceList, { backgroundColor: t.surface, borderColor: t.border }]}>
          {INVOICES.map((invoice, idx) => (
            <View key={invoice.id}>
              <TouchableOpacity style={styles.invoiceItem}>
                <View style={styles.invoiceIcon}>
                  <Ionicons name="receipt-outline" size={24} color={t.primary} />
                </View>
                <View style={styles.invoiceDetails}>
                  <Text style={[styles.invoiceId, { color: t.text }]}>{invoice.id}</Text>
                  <Text style={[styles.invoiceDate, { color: t.textMuted }]}>{invoice.date}</Text>
                </View>
                <View style={styles.invoiceRight}>
                  <Text style={[styles.invoiceAmount, { color: t.text }]}>{invoice.amount}</Text>
                  <Text style={[
                    styles.invoiceStatus, 
                    { color: invoice.status === 'Paid' ? t.success : '#f59e0b' }
                  ]}>{invoice.status}</Text>
                </View>
              </TouchableOpacity>
              {idx < INVOICES.length - 1 && <View style={[styles.divider, { backgroundColor: t.border }]} />}
            </View>
          ))}
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
  summaryCard: {
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    marginBottom: spacing.xl,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  summaryTitle: {
    color: '#ffffff',
    fontSize: typography.sm,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    opacity: 0.9,
  },
  summaryAmount: {
    color: '#ffffff',
    fontSize: 40,
    fontWeight: '800',
    marginVertical: spacing.sm,
  },
  summarySubtitle: {
    color: '#ffffff',
    fontSize: typography.sm,
    opacity: 0.8,
    marginBottom: spacing.lg,
  },
  payBtn: {
    backgroundColor: '#ffffff',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
  },
  payBtnText: {
    fontWeight: '700',
    fontSize: typography.base,
  },
  sectionTitle: {
    fontSize: typography.lg,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  invoiceList: {
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  invoiceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  invoiceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  invoiceDetails: {
    flex: 1,
  },
  invoiceId: {
    fontSize: typography.base,
    fontWeight: '600',
    marginBottom: 4,
  },
  invoiceDate: {
    fontSize: typography.sm,
  },
  invoiceRight: {
    alignItems: 'flex-end',
  },
  invoiceAmount: {
    fontSize: typography.base,
    fontWeight: '700',
    marginBottom: 4,
  },
  invoiceStatus: {
    fontSize: typography.sm,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    marginLeft: 48 + spacing.md * 2,
  }
});

import React, { useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../hooks/useTheme';
import { useAppStore } from '../../store/useAppStore';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { spacing, typography, borderRadius } from '../../theme';

export default function InsightsScreen() {
  const t = useTheme();
  const navigation = useNavigation<any>();
  const applications = useAppStore(s => s.applications);
  
  // Example dummy stats for the dashboard
  const stats = [
    { label: 'Total Apps', value: applications.length.toString(), icon: 'document-text-outline', color: '#3b82f6' },
    { label: 'Pending', value: applications.filter(a => a.status !== 'approved').length.toString(), icon: 'time-outline', color: '#f59e0b' },
    { label: 'Approved', value: applications.filter(a => a.status === 'approved').length.toString(), icon: 'checkmark-circle-outline', color: '#10b981' },
    { label: 'Compliance Score', value: '98%', icon: 'shield-checkmark-outline', color: '#8b5cf6' },
  ];

  // The Phase 3 functionality: Export CSV
  const handleExportCSV = async () => {
    try {
      const header = 'ID,Status,Created At\n';
      const rows = applications.map(app => 
        `"${app.id}","${app.status}","${app.createdAt || ''}"`
      ).join('\n');
      
      const csvData = header + rows;
      
      const filename = `Compliance_Export_${new Date().getTime()}.csv`;
      const fileUri = `${FileSystem.documentDirectory}${filename}`;
      
      await FileSystem.writeAsStringAsync(fileUri, csvData, { encoding: FileSystem.EncodingType.UTF8 });
      
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, { mimeType: 'text/csv', dialogTitle: 'Export Compliance Data' });
      } else {
        Alert.alert('Error', 'Sharing is not available on this device');
      }
    } catch (error) {
      console.error('CSV Export Error:', error);
      Alert.alert('Export Failed', 'An error occurred while generating the CSV.');
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: 'Insights & Analytics',
      headerStyle: { backgroundColor: t.surface },
      headerTitleStyle: { color: t.text },
      headerTintColor: t.text,
      headerRight: () => (
        <TouchableOpacity onPress={handleExportCSV} style={{ marginRight: 15 }}>
          <Ionicons name="download-outline" size={24} color={t.primary} />
        </TouchableOpacity>
      )
    });
  }, [navigation, t, applications]);

  return (
    <ScrollView style={[styles.container, { backgroundColor: t.bg }]}>
      <View style={styles.content}>
        
        <View style={styles.header}>
          <Text style={[styles.title, { color: t.text }]}>Executive Summary</Text>
          <Text style={[styles.subtitle, { color: t.textSecondary }]}>Real-time compliance overview</Text>
        </View>

        <View style={styles.grid}>
          {stats.map((stat, idx) => (
            <View key={idx} style={[styles.statCard, { backgroundColor: t.surface, borderColor: t.border }]}>
              <View style={[styles.iconBg, { backgroundColor: `${stat.color}15` }]}>
                <Ionicons name={stat.icon as any} size={24} color={stat.color} />
              </View>
              <Text style={[styles.statValue, { color: t.text }]}>{stat.value}</Text>
              <Text style={[styles.statLabel, { color: t.textMuted }]}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <View style={[styles.chartPlaceholder, { backgroundColor: t.surface, borderColor: t.border }]}>
          <Ionicons name="bar-chart-outline" size={48} color={t.border} />
          <Text style={[styles.chartText, { color: t.textMuted }]}>Monthly Compliance Trend</Text>
          <Text style={[styles.chartSubtext, { color: t.textMuted }]}>Visualizations require active subscriptions.</Text>
        </View>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
  },
  header: {
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: typography.xl,
    fontWeight: 'bold',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: typography.sm,
    marginTop: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  statCard: {
    width: '48%',
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: typography.xs,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  chartPlaceholder: {
    height: 220,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'dashed',
  },
  chartText: {
    fontSize: typography.base,
    fontWeight: '600',
    marginTop: spacing.md,
  },
  chartSubtext: {
    fontSize: typography.sm,
    marginTop: 4,
  },
});

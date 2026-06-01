import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

// Extended Mock Data for Enterprise Testing View
const ACTIVE_TESTS = [
  { id: '1', product: 'Cotton T-Shirts Batch A', lab: 'SGS India', status: 'In Progress', eta: '2 Days', risk: 'Low', progress: 65, type: 'Fabric Testing' },
  { id: '2', product: 'Winter Jackets 2024', lab: 'Intertek', status: 'Pending Sample', eta: '-', risk: 'High', progress: 10, type: 'Insulation & Flammability' },
  { id: '3', product: 'Denim Jeans Premium', lab: 'Bureau Veritas', status: 'Report Ready', eta: 'Today', risk: 'Medium', progress: 100, type: 'Color Fastness' },
];

const LAB_METRICS = [
  { title: 'Passed', value: '142', icon: 'check-circle', color: '#16a34a' },
  { title: 'Failed', value: '3', icon: 'alert-circle', color: '#ef4444' },
  { title: 'Pending', value: '12', icon: 'clock', color: '#f59e0b' },
  { title: 'Avg Time', value: '4.2d', icon: 'activity', color: '#3b82f6' },
];

const QUICK_ACTIONS = [
  { id: '1', title: 'Book Lab Test', icon: 'flask-outline', color: '#8b5cf6', route: 'BookTest' },
  { id: '2', title: 'View Reports', icon: 'document-text-outline', color: '#10b981', route: 'TestReports' },
  { id: '3', title: 'Track Sample', icon: 'location-outline', color: '#f59e0b', route: 'SampleTracking' },
  { id: '4', title: 'Failed Tests', icon: 'warning-outline', color: '#ef4444', route: 'FailedTests' },
];

export default function TestingDashboardScreen() {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState('Overview');

  const renderHeader = () => (
    <View style={styles.header}>
      <View>
        <Text style={styles.greeting}>Testing & QA</Text>
        <Text style={styles.subGreeting}>Monitor lab tests & quality metrics</Text>
      </View>
      <TouchableOpacity style={styles.filterBtn}>
        <Feather name="sliders" size={20} color="#111827" />
      </TouchableOpacity>
    </View>
  );

  const renderMetrics = () => (
    <View style={styles.metricsGrid}>
      {LAB_METRICS.map((metric, index) => (
        <View key={index} style={styles.metricCard}>
          <View style={[styles.metricIconBg, { backgroundColor: `${metric.color}15` }]}>
            <Feather name={metric.icon as any} size={20} color={metric.color} />
          </View>
          <Text style={styles.metricValue}>{metric.value}</Text>
          <Text style={styles.metricTitle}>{metric.title}</Text>
        </View>
      ))}
    </View>
  );

  const renderQuickActions = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.actionsScroll}>
        {QUICK_ACTIONS.map((action) => (
          <TouchableOpacity 
            key={action.id} 
            style={styles.actionCard}
            onPress={() => {}}
          >
            <View style={[styles.actionIconBg, { backgroundColor: action.color }]}>
              <Ionicons name={action.icon as any} size={24} color="#fff" />
            </View>
            <Text style={styles.actionTitle}>{action.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderActiveTests = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Active Tests</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>View All</Text>
        </TouchableOpacity>
      </View>

      {ACTIVE_TESTS.map((test) => (
        <TouchableOpacity key={test.id} style={styles.testCard}>
          <View style={styles.testHeader}>
            <View>
              <Text style={styles.testProduct}>{test.product}</Text>
              <Text style={styles.testType}>{test.type}</Text>
            </View>
            <View style={[styles.statusBadge, 
              { backgroundColor: test.progress === 100 ? '#dcfce7' : '#fef3c7' }
            ]}>
              <Text style={[styles.statusText, 
                { color: test.progress === 100 ? '#166534' : '#92400e' }
              ]}>{test.status}</Text>
            </View>
          </View>

          <View style={styles.testDetails}>
            <View style={styles.detailItem}>
              <Feather name="server" size={14} color="#6b7280" />
              <Text style={styles.detailText}>{test.lab}</Text>
            </View>
            <View style={styles.detailItem}>
              <Feather name="clock" size={14} color="#6b7280" />
              <Text style={styles.detailText}>ETA: {test.eta}</Text>
            </View>
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Progress</Text>
              <Text style={styles.progressPercent}>{test.progress}%</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${test.progress}%`, backgroundColor: test.progress === 100 ? '#10b981' : '#3b82f6' }]} />
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Dynamic Background */}
      <View style={styles.bgBlobTopLeft} />
      <View style={styles.bgBlobBottomRight} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {renderHeader()}
        {renderMetrics()}
        {renderQuickActions()}
        {renderActiveTests()}
        
        {/* Safe Area Spacer */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  bgBlobTopLeft: {
    position: 'absolute',
    top: -100,
    left: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: '#3b82f6',
    opacity: 0.1,
    transform: [{ scale: 1.2 }],
  },
  bgBlobBottomRight: {
    position: 'absolute',
    bottom: -100,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: '#8b5cf6',
    opacity: 0.1,
    transform: [{ scale: 1.2 }],
  },
  scrollContent: {
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0f172a',
    letterSpacing: -0.5,
  },
  subGreeting: {
    fontSize: 15,
    color: '#64748b',
    marginTop: 4,
  },
  filterBtn: {
    width: 44,
    height: 44,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  metricCard: {
    width: (width - 56) / 2,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
  },
  metricIconBg: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
  },
  metricTitle: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 4,
    fontWeight: '500',
  },
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3b82f6',
  },
  actionsScroll: {
    paddingRight: 20,
  },
  actionCard: {
    width: 100,
    alignItems: 'center',
    marginRight: 16,
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  actionIconBg: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  actionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    textAlign: 'center',
  },
  testCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
  },
  testHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  testProduct: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  testType: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  testDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
  },
  progressContainer: {
    marginTop: 4,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
  },
  progressPercent: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
});

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import RevenueAnalyticsScreen from '../screens/admin/RevenueAnalyticsScreen';
import CRMDashboardScreen from '../screens/admin/CRMDashboardScreen';
import LeadsDashboardScreen from '../screens/admin/LeadsDashboardScreen';
import ApplicationQueueScreen from '../screens/admin/ApplicationQueueScreen';
import TeamAssignmentScreen from '../screens/admin/TeamAssignmentScreen';
import EmployeeManagementScreen from '../screens/admin/EmployeeManagementScreen';
import PerformanceReportsScreen from '../screens/admin/PerformanceReportsScreen';
import FinanceDashboardScreen from '../screens/admin/FinanceDashboardScreen';
import CMSManagementScreen from '../screens/admin/CMSManagementScreen';
import InsightsCMSScreen from '../screens/admin/InsightsCMSScreen';
import AIPromptManagementScreen from '../screens/admin/AIPromptManagementScreen';
import UserManagementScreen from '../screens/admin/UserManagementScreen';
import AuditLogsScreen from '../screens/admin/AuditLogsScreen';
import SystemLogsScreen from '../screens/admin/SystemLogsScreen';
import CalendarManagementScreen from '../screens/admin/CalendarManagementScreen';

const Stack = createNativeStackNavigator();

export default function AdminNavigator() {
  return (
    <Stack.Navigator initialRouteName="AdminDashboardScreen">
      <Stack.Screen name="AdminDashboardScreen" component={AdminDashboardScreen} options={{ headerShown: false }} />
      <Stack.Screen name="RevenueAnalyticsScreen" component={RevenueAnalyticsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="CRMDashboardScreen" component={CRMDashboardScreen} options={{ headerShown: false }} />
      <Stack.Screen name="LeadsDashboardScreen" component={LeadsDashboardScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ApplicationQueueScreen" component={ApplicationQueueScreen} options={{ headerShown: false }} />
      <Stack.Screen name="TeamAssignmentScreen" component={TeamAssignmentScreen} options={{ headerShown: false }} />
      <Stack.Screen name="EmployeeManagementScreen" component={EmployeeManagementScreen} options={{ headerShown: false }} />
      <Stack.Screen name="PerformanceReportsScreen" component={PerformanceReportsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="FinanceDashboardScreen" component={FinanceDashboardScreen} options={{ headerShown: false }} />
      <Stack.Screen name="CMSManagementScreen" component={CMSManagementScreen} options={{ headerShown: false }} />
      <Stack.Screen name="InsightsCMSScreen" component={InsightsCMSScreen} options={{ headerShown: false }} />
      <Stack.Screen name="AIPromptManagementScreen" component={AIPromptManagementScreen} options={{ headerShown: false }} />
      <Stack.Screen name="UserManagementScreen" component={UserManagementScreen} options={{ headerShown: false }} />
      <Stack.Screen name="AuditLogsScreen" component={AuditLogsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SystemLogsScreen" component={SystemLogsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="CalendarManagementScreen" component={CalendarManagementScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

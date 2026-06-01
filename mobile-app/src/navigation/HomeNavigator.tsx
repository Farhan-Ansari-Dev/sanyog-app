import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/home/HomeScreen';
import HomeDashboardScreen from '../screens/home/HomeDashboardScreen';
import ComplianceOverviewScreen from '../screens/home/ComplianceOverviewScreen';
import AIRecommendationsScreen from '../screens/home/AIRecommendationsScreen';
import QuickActionsScreen from '../screens/home/QuickActionsScreen';
import NotificationsFeedScreen from '../screens/home/NotificationsFeedScreen';
import RecentActivitiesScreen from '../screens/home/RecentActivitiesScreen';
import ShipmentOverviewScreen from '../screens/home/ShipmentOverviewScreen';
import RenewalAlertsScreen from '../screens/home/RenewalAlertsScreen';
import CountryComplianceAlertsScreen from '../screens/home/CountryComplianceAlertsScreen';
import ComplianceScoreScreen from '../screens/home/ComplianceScoreScreen';
import AssignedManagerScreen from '../screens/home/AssignedManagerScreen';

import NotificationsScreen from '../screens/notifications/NotificationsScreen';
import CertDetailScreen from '../screens/home/CertDetailScreen';
import PlaceholderScreen from '../screens/common/PlaceholderScreen';

const Stack = createNativeStackNavigator();

export default function HomeNavigator() {
  return (
    <Stack.Navigator initialRouteName="HomeScreen">
      <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="HomeDashboardScreen" component={HomeDashboardScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ComplianceOverviewScreen" component={ComplianceOverviewScreen} options={{ headerShown: false }} />
      <Stack.Screen name="AIRecommendationsScreen" component={AIRecommendationsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="QuickActionsScreen" component={QuickActionsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="NotificationsFeedScreen" component={NotificationsFeedScreen} options={{ headerShown: false }} />
      <Stack.Screen name="RecentActivitiesScreen" component={RecentActivitiesScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ShipmentOverviewScreen" component={ShipmentOverviewScreen} options={{ headerShown: false }} />
      <Stack.Screen name="RenewalAlertsScreen" component={RenewalAlertsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="CountryComplianceAlertsScreen" component={CountryComplianceAlertsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ComplianceScoreScreen" component={ComplianceScoreScreen} options={{ headerShown: false }} />
      <Stack.Screen name="AssignedManagerScreen" component={AssignedManagerScreen} options={{ headerShown: false }} />

      <Stack.Screen name="NotificationsScreen" component={NotificationsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="CertDetailScreen" component={CertDetailScreen} options={{ headerShown: false }} />
      <Stack.Screen name="PlaceholderScreen" component={PlaceholderScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

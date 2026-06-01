import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import InsightsScreen from '../screens/insights/InsightsScreen';
import InsightsHomeScreen from '../screens/insights/InsightsHomeScreen';
import LatestNewsFeedScreen from '../screens/insights/LatestNewsFeedScreen';
import GovernmentUpdatesScreen from '../screens/insights/GovernmentUpdatesScreen';
import CertificationNewsScreen from '../screens/insights/CertificationNewsScreen';
import TradeExportNewsScreen from '../screens/insights/TradeExportNewsScreen';
import ImportExportAlertsScreen from '../screens/insights/ImportExportAlertsScreen';
import CountryRegulationUpdatesScreen from '../screens/insights/CountryRegulationUpdatesScreen';
import AIInsightFeedScreen from '../screens/insights/AIInsightFeedScreen';
import AISummarizedCircularsScreen from '../screens/insights/AISummarizedCircularsScreen';
import ComplianceIntelligenceScreen from '../screens/insights/ComplianceIntelligenceScreen';
import TrendingCertificationsScreen from '../screens/insights/TrendingCertificationsScreen';
import SavedArticlesScreen from '../screens/insights/SavedArticlesScreen';
import ArticleDetailsScreen from '../screens/insights/ArticleDetailsScreen';
import VideoInsightsScreen from '../screens/insights/VideoInsightsScreen';
import AIRecommendationsFeedScreen from '../screens/insights/AIRecommendationsFeedScreen';
import SearchInsightsScreen from '../screens/insights/SearchInsightsScreen';
import FilterInsightsScreen from '../screens/insights/FilterInsightsScreen';
import NotificationAlertsScreen from '../screens/insights/NotificationAlertsScreen';
import BreakingComplianceAlertsScreen from '../screens/insights/BreakingComplianceAlertsScreen';

const Stack = createNativeStackNavigator();

export default function InsightsNavigator() {
  return (
    <Stack.Navigator initialRouteName="InsightsScreen">
      <Stack.Screen name="InsightsScreen" component={InsightsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="InsightsHomeScreen" component={InsightsHomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="LatestNewsFeedScreen" component={LatestNewsFeedScreen} options={{ headerShown: false }} />
      <Stack.Screen name="GovernmentUpdatesScreen" component={GovernmentUpdatesScreen} options={{ headerShown: false }} />
      <Stack.Screen name="CertificationNewsScreen" component={CertificationNewsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="TradeExportNewsScreen" component={TradeExportNewsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ImportExportAlertsScreen" component={ImportExportAlertsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="CountryRegulationUpdatesScreen" component={CountryRegulationUpdatesScreen} options={{ headerShown: false }} />
      <Stack.Screen name="AIInsightFeedScreen" component={AIInsightFeedScreen} options={{ headerShown: false }} />
      <Stack.Screen name="AISummarizedCircularsScreen" component={AISummarizedCircularsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ComplianceIntelligenceScreen" component={ComplianceIntelligenceScreen} options={{ headerShown: false }} />
      <Stack.Screen name="TrendingCertificationsScreen" component={TrendingCertificationsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SavedArticlesScreen" component={SavedArticlesScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ArticleDetailsScreen" component={ArticleDetailsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="VideoInsightsScreen" component={VideoInsightsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="AIRecommendationsFeedScreen" component={AIRecommendationsFeedScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SearchInsightsScreen" component={SearchInsightsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="FilterInsightsScreen" component={FilterInsightsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="NotificationAlertsScreen" component={NotificationAlertsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="BreakingComplianceAlertsScreen" component={BreakingComplianceAlertsScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

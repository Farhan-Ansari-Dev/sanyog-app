import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AIAssistantHomeScreen from '../screens/ai/AIAssistantHomeScreen';
import AIChatScreen from '../screens/ai/AIChatScreen';
import AIProductAnalyzerScreen from '../screens/ai/AIProductAnalyzerScreen';
import AICertificationFinderScreen from '../screens/ai/AICertificationFinderScreen';
import AIComplianceCheckerScreen from '../screens/ai/AIComplianceCheckerScreen';
import AICountryComplianceScreen from '../screens/ai/AICountryComplianceScreen';
import AIShipmentRiskScreen from '../screens/ai/AIShipmentRiskScreen';
import AIRiskPredictionScreen from '../screens/ai/AIRiskPredictionScreen';
import AIRegulationFeedScreen from '../screens/ai/AIRegulationFeedScreen';
import AISuggestedCertificationsScreen from '../screens/ai/AISuggestedCertificationsScreen';

const Stack = createNativeStackNavigator();

export default function AiNavigator() {
  return (
    <Stack.Navigator initialRouteName="AIAssistantHomeScreen">
      <Stack.Screen name="AIAssistantHomeScreen" component={AIAssistantHomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="AIChatScreen" component={AIChatScreen} options={{ headerShown: false }} />
      <Stack.Screen name="AIProductAnalyzerScreen" component={AIProductAnalyzerScreen} options={{ headerShown: false }} />
      <Stack.Screen name="AICertificationFinderScreen" component={AICertificationFinderScreen} options={{ headerShown: false }} />
      <Stack.Screen name="AIComplianceCheckerScreen" component={AIComplianceCheckerScreen} options={{ headerShown: false }} />
      <Stack.Screen name="AICountryComplianceScreen" component={AICountryComplianceScreen} options={{ headerShown: false }} />
      <Stack.Screen name="AIShipmentRiskScreen" component={AIShipmentRiskScreen} options={{ headerShown: false }} />
      <Stack.Screen name="AIRiskPredictionScreen" component={AIRiskPredictionScreen} options={{ headerShown: false }} />
      <Stack.Screen name="AIRegulationFeedScreen" component={AIRegulationFeedScreen} options={{ headerShown: false }} />
      <Stack.Screen name="AISuggestedCertificationsScreen" component={AISuggestedCertificationsScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

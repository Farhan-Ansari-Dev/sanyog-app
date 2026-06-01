import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ShipmentDashboardScreen from '../screens/shipment/ShipmentDashboardScreen';
import ShipmentTrackingScreen from '../screens/shipment/ShipmentTrackingScreen';
import ShipmentDetailsScreen from '../screens/shipment/ShipmentDetailsScreen';
import ContainerTrackingScreen from '../screens/shipment/ContainerTrackingScreen';
import CustomsClearanceScreen from '../screens/shipment/CustomsClearanceScreen';
import PortClearanceScreen from '../screens/shipment/PortClearanceScreen';
import CountryComplianceScreen from '../screens/shipment/CountryComplianceScreen';
import ImportRiskAnalysisScreen from '../screens/shipment/ImportRiskAnalysisScreen';
import ExportReadinessScreen from '../screens/shipment/ExportReadinessScreen';
import CustomsDocumentationScreen from '../screens/shipment/CustomsDocumentationScreen';
import ShippingDocumentsScreen from '../screens/shipment/ShippingDocumentsScreen';
import ShipmentTimelineScreen from '../screens/shipment/ShipmentTimelineScreen';
import ShipmentAnalyticsScreen from '../screens/shipment/ShipmentAnalyticsScreen';
import ShipmentAlertsScreen from '../screens/shipment/ShipmentAlertsScreen';
import ShipmentSuccessScreen from '../screens/shipment/ShipmentSuccessScreen';

const Stack = createNativeStackNavigator();

export default function ShipmentNavigator() {
  return (
    <Stack.Navigator initialRouteName="ShipmentDashboardScreen">
      <Stack.Screen name="ShipmentDashboardScreen" component={ShipmentDashboardScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ShipmentTrackingScreen" component={ShipmentTrackingScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ShipmentDetailsScreen" component={ShipmentDetailsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ContainerTrackingScreen" component={ContainerTrackingScreen} options={{ headerShown: false }} />
      <Stack.Screen name="CustomsClearanceScreen" component={CustomsClearanceScreen} options={{ headerShown: false }} />
      <Stack.Screen name="PortClearanceScreen" component={PortClearanceScreen} options={{ headerShown: false }} />
      <Stack.Screen name="CountryComplianceScreen" component={CountryComplianceScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ImportRiskAnalysisScreen" component={ImportRiskAnalysisScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ExportReadinessScreen" component={ExportReadinessScreen} options={{ headerShown: false }} />
      <Stack.Screen name="CustomsDocumentationScreen" component={CustomsDocumentationScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ShippingDocumentsScreen" component={ShippingDocumentsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ShipmentTimelineScreen" component={ShipmentTimelineScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ShipmentAnalyticsScreen" component={ShipmentAnalyticsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ShipmentAlertsScreen" component={ShipmentAlertsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ShipmentSuccessScreen" component={ShipmentSuccessScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

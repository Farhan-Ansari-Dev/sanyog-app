import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TestingDashboardScreen from '../screens/testing/TestingDashboardScreen';
import AssignedLabsScreen from '../screens/testing/AssignedLabsScreen';
import SampleDispatchScreen from '../screens/testing/SampleDispatchScreen';
import SampleTrackingScreen from '../screens/testing/SampleTrackingScreen';
import LabReportsScreen from '../screens/testing/LabReportsScreen';
import TestDetailsScreen from '../screens/testing/TestDetailsScreen';
import FailedReportsScreen from '../screens/testing/FailedReportsScreen';
import RetestingRequestScreen from '../screens/testing/RetestingRequestScreen';
import InspectionBookingScreen from '../screens/testing/InspectionBookingScreen';
import InspectionScheduleScreen from '../screens/testing/InspectionScheduleScreen';
import InspectionReportsScreen from '../screens/testing/InspectionReportsScreen';
import FactoryInspectionScreen from '../screens/testing/FactoryInspectionScreen';
import QualityInspectionScreen from '../screens/testing/QualityInspectionScreen';
import InspectionDetailsScreen from '../screens/testing/InspectionDetailsScreen';
import InspectionSuccessScreen from '../screens/testing/InspectionSuccessScreen';

const Stack = createNativeStackNavigator();

export default function TestingNavigator() {
  return (
    <Stack.Navigator initialRouteName="TestingDashboardScreen">
      <Stack.Screen name="TestingDashboardScreen" component={TestingDashboardScreen} options={{ headerShown: false }} />
      <Stack.Screen name="AssignedLabsScreen" component={AssignedLabsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SampleDispatchScreen" component={SampleDispatchScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SampleTrackingScreen" component={SampleTrackingScreen} options={{ headerShown: false }} />
      <Stack.Screen name="LabReportsScreen" component={LabReportsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="TestDetailsScreen" component={TestDetailsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="FailedReportsScreen" component={FailedReportsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="RetestingRequestScreen" component={RetestingRequestScreen} options={{ headerShown: false }} />
      <Stack.Screen name="InspectionBookingScreen" component={InspectionBookingScreen} options={{ headerShown: false }} />
      <Stack.Screen name="InspectionScheduleScreen" component={InspectionScheduleScreen} options={{ headerShown: false }} />
      <Stack.Screen name="InspectionReportsScreen" component={InspectionReportsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="FactoryInspectionScreen" component={FactoryInspectionScreen} options={{ headerShown: false }} />
      <Stack.Screen name="QualityInspectionScreen" component={QualityInspectionScreen} options={{ headerShown: false }} />
      <Stack.Screen name="InspectionDetailsScreen" component={InspectionDetailsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="InspectionSuccessScreen" component={InspectionSuccessScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

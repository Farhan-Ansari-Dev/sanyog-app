import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ApplicationsScreen from '../screens/applications/ApplicationsScreen';
import ApplicationsDashboardScreen from '../screens/applications/ApplicationsDashboardScreen';
import ActiveApplicationsScreen from '../screens/applications/ActiveApplicationsScreen';
import PendingApplicationsScreen from '../screens/applications/PendingApplicationsScreen';
import CompletedApplicationsScreen from '../screens/applications/CompletedApplicationsScreen';
import RejectedApplicationsScreen from '../screens/applications/RejectedApplicationsScreen';
import ApplicationDetailsScreen from '../screens/applications/ApplicationDetailsScreen';
import ApplicationTimelineScreen from '../screens/applications/ApplicationTimelineScreen';
import UploadAdditionalDocumentsScreen from '../screens/applications/UploadAdditionalDocumentsScreen';
import AppAssignedManagerScreen from '../screens/applications/AppAssignedManagerScreen';
import ApprovalWorkflowScreen from '../screens/applications/ApprovalWorkflowScreen';
import AppGovernmentQueriesScreen from '../screens/applications/AppGovernmentQueriesScreen';
import ApplicationNotesScreen from '../screens/applications/ApplicationNotesScreen';
import ApplicationHistoryScreen from '../screens/applications/ApplicationHistoryScreen';
import RenewalApplicationsScreen from '../screens/applications/RenewalApplicationsScreen';
import ApplicationSuccessScreen from '../screens/applications/ApplicationSuccessScreen';
import AppDetailScreen from '../screens/applications/AppDetailScreen';
import UploadDocsScreen from '../screens/applications/UploadDocsScreen';

const Stack = createNativeStackNavigator();

export default function ApplicationsNavigator() {
  return (
    <Stack.Navigator initialRouteName="ApplicationsScreen">
      <Stack.Screen name="ApplicationsScreen" component={ApplicationsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ApplicationsDashboardScreen" component={ApplicationsDashboardScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ActiveApplicationsScreen" component={ActiveApplicationsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="PendingApplicationsScreen" component={PendingApplicationsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="CompletedApplicationsScreen" component={CompletedApplicationsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="RejectedApplicationsScreen" component={RejectedApplicationsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ApplicationDetailsScreen" component={ApplicationDetailsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ApplicationTimelineScreen" component={ApplicationTimelineScreen} options={{ headerShown: false }} />
      <Stack.Screen name="UploadAdditionalDocumentsScreen" component={UploadAdditionalDocumentsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="AppAssignedManagerScreen" component={AppAssignedManagerScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ApprovalWorkflowScreen" component={ApprovalWorkflowScreen} options={{ headerShown: false }} />
      <Stack.Screen name="AppGovernmentQueriesScreen" component={AppGovernmentQueriesScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ApplicationNotesScreen" component={ApplicationNotesScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ApplicationHistoryScreen" component={ApplicationHistoryScreen} options={{ headerShown: false }} />
      <Stack.Screen name="RenewalApplicationsScreen" component={RenewalApplicationsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ApplicationSuccessScreen" component={ApplicationSuccessScreen} options={{ headerShown: false }} />
      <Stack.Screen name="AppDetailScreen" component={AppDetailScreen} options={{ headerShown: false }} />
      <Stack.Screen name="UploadDocsScreen" component={UploadDocsScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

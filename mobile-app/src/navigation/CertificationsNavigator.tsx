import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CertificationsScreen from '../screens/certifications/CertificationsScreen';
import AllCertificationsScreen from '../screens/certifications/AllCertificationsScreen';
import DomesticCertificationsScreen from '../screens/certifications/DomesticCertificationsScreen';
import InternationalCertificationsScreen from '../screens/certifications/InternationalCertificationsScreen';
import CertificationCategoriesScreen from '../screens/certifications/CertificationCategoriesScreen';
import CertificationDetailsScreen from '../screens/certifications/CertificationDetailsScreen';
import CertificationComparisonScreen from '../screens/certifications/CertificationComparisonScreen';
import CertificationEligibilityCheckerScreen from '../screens/certifications/CertificationEligibilityCheckerScreen';
import CertificationFAQScreen from '../screens/certifications/CertificationFAQScreen';
import ApplyCertificationScreen from '../screens/certifications/ApplyCertificationScreen';
import CertificationTimelineScreen from '../screens/certifications/CertificationTimelineScreen';
import CertificationProgressScreen from '../screens/certifications/CertificationProgressScreen';
import CertificationDocumentsScreen from '../screens/certifications/CertificationDocumentsScreen';
import GovernmentQueriesScreen from '../screens/certifications/GovernmentQueriesScreen';
import RejectedCertificationsScreen from '../screens/certifications/RejectedCertificationsScreen';
import RenewalCenterScreen from '../screens/certifications/RenewalCenterScreen';
import QuoteRequestScreen from '../screens/details/QuoteRequestScreen';
import ServiceDetailScreen from '../screens/details/ServiceDetailScreen';
import ApplyScreen from '../screens/services/ApplyScreen';
import CertDetailScreen from '../screens/services/CertDetailScreen';
import ServiceGroupScreen from '../screens/services/ServiceGroupScreen';
import ServicesScreen from '../screens/services/ServicesScreen';

const Stack = createNativeStackNavigator();

export default function CertificationsNavigator() {
  return (
    <Stack.Navigator initialRouteName="CertificationsScreen">
      <Stack.Screen name="CertificationsScreen" component={CertificationsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="AllCertificationsScreen" component={AllCertificationsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="DomesticCertificationsScreen" component={DomesticCertificationsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="InternationalCertificationsScreen" component={InternationalCertificationsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="CertificationCategoriesScreen" component={CertificationCategoriesScreen} options={{ headerShown: false }} />
      <Stack.Screen name="CertificationDetailsScreen" component={CertificationDetailsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="CertificationComparisonScreen" component={CertificationComparisonScreen} options={{ headerShown: false }} />
      <Stack.Screen name="CertificationEligibilityCheckerScreen" component={CertificationEligibilityCheckerScreen} options={{ headerShown: false }} />
      <Stack.Screen name="CertificationFAQScreen" component={CertificationFAQScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ApplyCertificationScreen" component={ApplyCertificationScreen} options={{ headerShown: false }} />
      <Stack.Screen name="CertificationTimelineScreen" component={CertificationTimelineScreen} options={{ headerShown: false }} />
      <Stack.Screen name="CertificationProgressScreen" component={CertificationProgressScreen} options={{ headerShown: false }} />
      <Stack.Screen name="CertificationDocumentsScreen" component={CertificationDocumentsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="GovernmentQueriesScreen" component={GovernmentQueriesScreen} options={{ headerShown: false }} />
      <Stack.Screen name="RejectedCertificationsScreen" component={RejectedCertificationsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="RenewalCenterScreen" component={RenewalCenterScreen} options={{ headerShown: false }} />
      <Stack.Screen name="QuoteRequestScreen" component={QuoteRequestScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ServiceDetailScreen" component={ServiceDetailScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ApplyScreen" component={ApplyScreen} options={{ headerShown: false }} />
      <Stack.Screen name="CertDetailScreen" component={CertDetailScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ServiceGroupScreen" component={ServiceGroupScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ServicesScreen" component={ServicesScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

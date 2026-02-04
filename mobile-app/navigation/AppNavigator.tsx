import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../types';

import LoginScreen from '../screens/LoginScreen';
import OtpScreen from '../screens/OtpScreen';
import HomeScreen from '../screens/HomeScreen';
import CertificationScreen from '../screens/CertificationScreen';
import ApplicationFormScreen from '../screens/ApplicationFormScreen';
import UploadDocumentsScreen from '../screens/UploadDocumentsScreen';
import MyApplicationsScreen from '../screens/MyApplicationsScreen';
import ContactExpertScreen from '../screens/ContactExpertScreen';
import AboutScreen from '../screens/AboutScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator({
  initialRouteName,
}: {
  initialRouteName: keyof RootStackParamList;
}) {
  return (
    <Stack.Navigator initialRouteName={initialRouteName}>
      <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />
      <Stack.Screen name="OTP" component={OtpScreen} options={{ title: 'Verify OTP' }} />

      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Sanyog' }} />
      <Stack.Screen name="Certifications" component={CertificationScreen} options={{ title: 'Select Service' }} />
      <Stack.Screen name="ApplicationForm" component={ApplicationFormScreen} options={{ title: 'Application Details' }} />
      <Stack.Screen name="Upload" component={UploadDocumentsScreen} options={{ title: 'Upload Documents' }} />
      <Stack.Screen name="MyApplications" component={MyApplicationsScreen} options={{ title: 'My Applications' }} />
      <Stack.Screen name="Contact" component={ContactExpertScreen} options={{ title: 'Contact Expert' }} />
      <Stack.Screen name="About" component={AboutScreen} options={{ title: 'About' }} />
    </Stack.Navigator>
  );
}

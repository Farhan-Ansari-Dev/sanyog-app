import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CertificateCenterScreen from '../screens/certificates/CertificateCenterScreen';
import CertificateDetailsScreen from '../screens/certificates/CertificateDetailsScreen';
import DownloadCertificateScreen from '../screens/certificates/DownloadCertificateScreen';
import QRVerificationScreen from '../screens/certificates/QRVerificationScreen';
import ShareCertificateScreen from '../screens/certificates/ShareCertificateScreen';
import ExpiredCertificatesScreen from '../screens/certificates/ExpiredCertificatesScreen';
import RenewalCertificatesScreen from '../screens/certificates/RenewalCertificatesScreen';

const Stack = createNativeStackNavigator();

export default function CertificatesNavigator() {
  return (
    <Stack.Navigator initialRouteName="CertificateCenterScreen">
      <Stack.Screen name="CertificateCenterScreen" component={CertificateCenterScreen} options={{ headerShown: false }} />
      <Stack.Screen name="CertificateDetailsScreen" component={CertificateDetailsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="DownloadCertificateScreen" component={DownloadCertificateScreen} options={{ headerShown: false }} />
      <Stack.Screen name="QRVerificationScreen" component={QRVerificationScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ShareCertificateScreen" component={ShareCertificateScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ExpiredCertificatesScreen" component={ExpiredCertificatesScreen} options={{ headerShown: false }} />
      <Stack.Screen name="RenewalCertificatesScreen" component={RenewalCertificatesScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

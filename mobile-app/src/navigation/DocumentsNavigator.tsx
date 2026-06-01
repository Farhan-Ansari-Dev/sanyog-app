import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import DocumentVaultScreen from '../screens/documents/DocumentVaultScreen';
import UploadDocumentScreen from '../screens/documents/UploadDocumentScreen';
import OCRScannerScreen from '../screens/documents/OCRScannerScreen';
import AIDocumentValidationScreen from '../screens/documents/AIDocumentValidationScreen';
import DocumentPreviewScreen from '../screens/documents/DocumentPreviewScreen';
import ProductDocumentsScreen from '../screens/documents/ProductDocumentsScreen';
import CompanyDocumentsScreen from '../screens/documents/CompanyDocumentsScreen';
import ShipmentDocumentsScreen from '../screens/documents/ShipmentDocumentsScreen';
import GovernmentDocumentsScreen from '../screens/documents/GovernmentDocumentsScreen';
import TestReportsScreen from '../screens/documents/TestReportsScreen';
import CertificatesStorageScreen from '../screens/documents/CertificatesStorageScreen';
import RejectedDocumentsScreen from '../screens/documents/RejectedDocumentsScreen';
import ExpiryTrackerScreen from '../screens/documents/ExpiryTrackerScreen';
import DownloadDocumentsScreen from '../screens/documents/DownloadDocumentsScreen';
import SearchDocumentsScreen from '../screens/documents/SearchDocumentsScreen';

const Stack = createNativeStackNavigator();

export default function DocumentsNavigator() {
  return (
    <Stack.Navigator initialRouteName="DocumentVaultScreen">
      <Stack.Screen name="DocumentVaultScreen" component={DocumentVaultScreen} options={{ headerShown: false }} />
      <Stack.Screen name="UploadDocumentScreen" component={UploadDocumentScreen} options={{ headerShown: false }} />
      <Stack.Screen name="OCRScannerScreen" component={OCRScannerScreen} options={{ headerShown: false }} />
      <Stack.Screen name="AIDocumentValidationScreen" component={AIDocumentValidationScreen} options={{ headerShown: false }} />
      <Stack.Screen name="DocumentPreviewScreen" component={DocumentPreviewScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ProductDocumentsScreen" component={ProductDocumentsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="CompanyDocumentsScreen" component={CompanyDocumentsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ShipmentDocumentsScreen" component={ShipmentDocumentsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="GovernmentDocumentsScreen" component={GovernmentDocumentsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="TestReportsScreen" component={TestReportsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="CertificatesStorageScreen" component={CertificatesStorageScreen} options={{ headerShown: false }} />
      <Stack.Screen name="RejectedDocumentsScreen" component={RejectedDocumentsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ExpiryTrackerScreen" component={ExpiryTrackerScreen} options={{ headerShown: false }} />
      <Stack.Screen name="DownloadDocumentsScreen" component={DownloadDocumentsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SearchDocumentsScreen" component={SearchDocumentsScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

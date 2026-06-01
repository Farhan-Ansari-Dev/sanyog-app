import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import PaymentsDashboardScreen from '../screens/payments/PaymentsDashboardScreen';
import PaymentsScreen from '../screens/payments/PaymentsScreen';
import InvoiceDetailsScreen from '../screens/payments/InvoiceDetailsScreen';
import QuotationsScreen from '../screens/payments/QuotationsScreen';
import ApproveQuotationScreen from '../screens/payments/ApproveQuotationScreen';
import PaymentGatewayScreen from '../screens/payments/PaymentGatewayScreen';
import AddCardScreen from '../screens/payments/AddCardScreen';
import PaymentMethodsScreen from '../screens/payments/PaymentMethodsScreen';
import PaymentSuccessScreen from '../screens/payments/PaymentSuccessScreen';
import PaymentFailedScreen from '../screens/payments/PaymentFailedScreen';
import DownloadInvoiceScreen from '../screens/payments/DownloadInvoiceScreen';

const Stack = createNativeStackNavigator();

export default function PaymentsNavigator() {
  return (
    <Stack.Navigator initialRouteName="PaymentsDashboardScreen">
      <Stack.Screen name="PaymentsDashboardScreen" component={PaymentsDashboardScreen} options={{ headerShown: false }} />
      <Stack.Screen name="PaymentsScreen" component={PaymentsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="InvoiceDetailsScreen" component={InvoiceDetailsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="QuotationsScreen" component={QuotationsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ApproveQuotationScreen" component={ApproveQuotationScreen} options={{ headerShown: false }} />
      <Stack.Screen name="PaymentGatewayScreen" component={PaymentGatewayScreen} options={{ headerShown: false }} />
      <Stack.Screen name="AddCardScreen" component={AddCardScreen} options={{ headerShown: false }} />
      <Stack.Screen name="PaymentMethodsScreen" component={PaymentMethodsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="PaymentSuccessScreen" component={PaymentSuccessScreen} options={{ headerShown: false }} />
      <Stack.Screen name="PaymentFailedScreen" component={PaymentFailedScreen} options={{ headerShown: false }} />
      <Stack.Screen name="DownloadInvoiceScreen" component={DownloadInvoiceScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

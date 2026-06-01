import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ChatListScreen from '../screens/communication/ChatListScreen';
import CommunicationScreen from '../screens/communication/CommunicationScreen';
import LiveChatScreen from '../screens/communication/LiveChatScreen';
import VideoConsultationScreen from '../screens/communication/VideoConsultationScreen';
import SupportCenterScreen from '../screens/communication/SupportCenterScreen';
import RaiseTicketScreen from '../screens/communication/RaiseTicketScreen';
import TicketDetailsScreen from '../screens/communication/TicketDetailsScreen';
import NotificationsCenterScreen from '../screens/communication/NotificationsCenterScreen';
import NotificationDetailsScreen from '../screens/communication/NotificationDetailsScreen';
import ActivityTimelineScreen from '../screens/communication/ActivityTimelineScreen';
import ContactExpertScreen from '../screens/communication/ContactExpertScreen';

const Stack = createNativeStackNavigator();

export default function CommunicationNavigator() {
  return (
    <Stack.Navigator initialRouteName="ChatListScreen">
      <Stack.Screen name="ChatListScreen" component={ChatListScreen} options={{ headerShown: false }} />
      <Stack.Screen name="CommunicationScreen" component={CommunicationScreen} options={{ headerShown: false }} />
      <Stack.Screen name="LiveChatScreen" component={LiveChatScreen} options={{ headerShown: false }} />
      <Stack.Screen name="VideoConsultationScreen" component={VideoConsultationScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SupportCenterScreen" component={SupportCenterScreen} options={{ headerShown: false }} />
      <Stack.Screen name="RaiseTicketScreen" component={RaiseTicketScreen} options={{ headerShown: false }} />
      <Stack.Screen name="TicketDetailsScreen" component={TicketDetailsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="NotificationsCenterScreen" component={NotificationsCenterScreen} options={{ headerShown: false }} />
      <Stack.Screen name="NotificationDetailsScreen" component={NotificationDetailsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ActivityTimelineScreen" component={ActivityTimelineScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ContactExpertScreen" component={ContactExpertScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

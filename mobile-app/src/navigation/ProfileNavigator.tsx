import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ProfileScreen from '../screens/profile/ProfileScreen';
import CompanyProfileScreen from '../screens/profile/CompanyProfileScreen';
import UserTypeSettingsScreen from '../screens/profile/UserTypeSettingsScreen';
import TeamMembersScreen from '../screens/profile/TeamMembersScreen';
import RolesPermissionsScreen from '../screens/profile/RolesPermissionsScreen';
import NotificationSettingsScreen from '../screens/profile/NotificationSettingsScreen';
import SecuritySettingsScreen from '../screens/profile/SecuritySettingsScreen';
import ChangePasswordScreen from '../screens/profile/ChangePasswordScreen';
import DeviceSessionsScreen from '../screens/profile/DeviceSessionsScreen';
import LanguageSettingsScreen from '../screens/profile/LanguageSettingsScreen';
import ThemeSettingsScreen from '../screens/profile/ThemeSettingsScreen';
import DarkModeScreen from '../screens/profile/DarkModeScreen';
import PrivacyPolicyScreen from '../screens/profile/PrivacyPolicyScreen';
import TermsConditionsScreen from '../screens/profile/TermsConditionsScreen';
import DeleteAccountScreen from '../screens/profile/DeleteAccountScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';
import BillingScreen from '../screens/profile/BillingScreen';
import MyDocumentsScreen from '../screens/profile/MyDocumentsScreen';
import AboutScreen from '../screens/profile/AboutScreen';
import FAQScreen from '../screens/profile/FAQScreen';
import LegalScreen from '../screens/profile/LegalScreen';

const Stack = createNativeStackNavigator();

export default function ProfileNavigator() {
  return (
    <Stack.Navigator initialRouteName="ProfileScreen">
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{ headerShown: false }} />
      <Stack.Screen name="CompanyProfileScreen" component={CompanyProfileScreen} options={{ headerShown: false }} />
      <Stack.Screen name="UserTypeSettingsScreen" component={UserTypeSettingsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="TeamMembersScreen" component={TeamMembersScreen} options={{ headerShown: false }} />
      <Stack.Screen name="RolesPermissionsScreen" component={RolesPermissionsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="NotificationSettingsScreen" component={NotificationSettingsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SecuritySettingsScreen" component={SecuritySettingsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ChangePasswordScreen" component={ChangePasswordScreen} options={{ headerShown: false }} />
      <Stack.Screen name="DeviceSessionsScreen" component={DeviceSessionsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="LanguageSettingsScreen" component={LanguageSettingsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ThemeSettingsScreen" component={ThemeSettingsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="DarkModeScreen" component={DarkModeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="PrivacyPolicyScreen" component={PrivacyPolicyScreen} options={{ headerShown: false }} />
      <Stack.Screen name="TermsConditionsScreen" component={TermsConditionsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="DeleteAccountScreen" component={DeleteAccountScreen} options={{ headerShown: false }} />
      <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} options={{ headerShown: false }} />
      <Stack.Screen name="BillingScreen" component={BillingScreen} options={{ headerShown: false }} />
      <Stack.Screen name="MyDocumentsScreen" component={MyDocumentsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="AboutScreen" component={AboutScreen} options={{ headerShown: false }} />
      <Stack.Screen name="FAQScreen" component={FAQScreen} options={{ headerShown: false }} />
      <Stack.Screen name="LegalScreen" component={LegalScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

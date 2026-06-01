import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from '../screens/auth/SplashScreen';
import OnboardingScreen1 from '../screens/auth/OnboardingScreen1';
import OnboardingScreen2 from '../screens/auth/OnboardingScreen2';
import OnboardingScreen3 from '../screens/auth/OnboardingScreen3';
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import ContinueWithGoogleScreen from '../screens/auth/ContinueWithGoogleScreen';
import EmailOtpLoginScreen from '../screens/auth/EmailOtpLoginScreen';
import OtpVerificationScreen from '../screens/auth/OtpVerificationScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import ResetPasswordScreen from '../screens/auth/ResetPasswordScreen';
import UserTypeSelectionScreen from '../screens/auth/UserTypeSelectionScreen';
import SessionExpiredScreen from '../screens/auth/SessionExpiredScreen';
import NoInternetScreen from '../screens/auth/NoInternetScreen';
import MaintenanceScreen from '../screens/auth/MaintenanceScreen';
import ForceUpdateScreen from '../screens/auth/ForceUpdateScreen';
import OnboardingScreen from '../screens/auth/OnboardingScreen';
import OtpScreen from '../screens/auth/OtpScreen';
import AnimatedSplashScreen from '../screens/auth/AnimatedSplashScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

import type { AuthStackParamList } from '../types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
  return (
    <Stack.Navigator initialRouteName="LoginScreen">
      <Stack.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown: false }} />
      <Stack.Screen name="OnboardingScreen1" component={OnboardingScreen1} options={{ headerShown: false }} />
      <Stack.Screen name="OnboardingScreen2" component={OnboardingScreen2} options={{ headerShown: false }} />
      <Stack.Screen name="OnboardingScreen3" component={OnboardingScreen3} options={{ headerShown: false }} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SignupScreen" component={SignupScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ContinueWithGoogleScreen" component={ContinueWithGoogleScreen} options={{ headerShown: false }} />
      <Stack.Screen name="EmailOtpLoginScreen" component={EmailOtpLoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="OtpVerificationScreen" component={OtpVerificationScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen} options={{ headerShown: false }} />
      <Stack.Screen name="UserTypeSelectionScreen" component={UserTypeSelectionScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SessionExpiredScreen" component={SessionExpiredScreen} options={{ headerShown: false }} />
      <Stack.Screen name="NoInternetScreen" component={NoInternetScreen} options={{ headerShown: false }} />
      <Stack.Screen name="MaintenanceScreen" component={MaintenanceScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ForceUpdateScreen" component={ForceUpdateScreen} options={{ headerShown: false }} />
      <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} options={{ headerShown: false }} />
      <Stack.Screen name="OtpScreen" component={OtpScreen} options={{ headerShown: false }} />
      <Stack.Screen name="AnimatedSplashScreen" component={AnimatedSplashScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Register" component={RegisterScreen as any} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

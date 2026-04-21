/**
 * Sanyog Conformity – Simplified Navigation (debugging)
 * Uses only stack navigators to bypass potential bottom-tabs issues
 */
import React from 'react';
import { View, Text, Pressable, SafeAreaView, StatusBar, ScrollView } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { useAppStore } from '../store/useAppStore';
import { typography, spacing, borderRadius } from '../theme';

// Import screens
import SplashScreen from '../screens/auth/AnimatedSplashScreen';
import OnboardingScreen from '../screens/auth/OnboardingScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import OTPScreen from '../screens/auth/OTPScreen';
import HomeScreen from '../screens/home/HomeScreen';
import ServicesScreen from '../screens/services/ServicesScreen';
import ServiceGroupScreen from '../screens/services/ServiceGroupScreen';
import CertDetailScreen from '../screens/services/CertDetailScreen';
import ApplyScreen from '../screens/services/ApplyScreen';
import ApplicationsScreen from '../screens/applications/ApplicationsScreen';
import AppDetailScreen from '../screens/applications/AppDetailScreen';
import UploadDocsScreen from '../screens/applications/UploadDocsScreen';
import NotificationsScreen from '../screens/notifications/NotificationsScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import AboutScreen from '../screens/profile/AboutScreen';
import ContactExpertScreen from '../screens/profile/ContactExpertScreen';
import RoadmapWizardScreen from '../screens/services/RoadmapWizardScreen';
import PlaceholderScreen from '../screens/common/PlaceholderScreen';

// Types
import type {
  AuthStackParamList,
  TabParamList,
} from '../types';

const AuthStack = createNativeStackNavigator<AuthStackParamList>();

// Simplified main stack that includes ALL screens
type MainStackParamList = {
  // Tabs (home screens for each tab)
  HomeMain: undefined;
  AppsList: undefined;
  ProfileMain: undefined;
  SupportMain: undefined;
  // Sub-screens
  ServicesList: undefined;
  NotifList: undefined;
  CertDetail: { certId: string };
  ServiceGroup: { categoryId: string; categoryName: string };
  ApplyStep1: { certId: string; certName: string };
  ApplyStep2: { certId: string; certName: string; formData: any };
  ApplyStep3: { certId: string; certName: string; formData: any };
  AppDetail: { appId: string };
  UploadDocs: { appId: string };
  About: undefined;
  ContactExpert: undefined;
  Settings: undefined;
  RoadmapWizard: undefined;
  Placeholder: { title: string };
};

const MainStack = createNativeStackNavigator<MainStackParamList>();

// ─── Custom Bottom Tab Bar ──────────────────────────────
function CustomTabBar({ navigation, currentTab }: { navigation: any; currentTab: string }) {
  const t = useTheme();
  const unreadCount = useAppStore((s) => s.unreadCount);

  const tabs = [
    { key: 'HomeMain', label: 'Home', icon: 'home-outline', iconFocused: 'home' },
    { key: 'AppsList', label: 'Applications', icon: 'document-text-outline', iconFocused: 'document-text' },
    { key: 'ProfileMain', label: 'Profile', icon: 'person-outline', iconFocused: 'person' },
    { key: 'SupportMain', label: 'Support', icon: 'help-buoy-outline', iconFocused: 'help-buoy' },
  ];

  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: t.tabBarBg,
        borderTopWidth: 1,
        borderTopColor: t.tabBarBorder,
        height: 64,
        paddingBottom: 8,
        paddingTop: 8,
      }}
    >
      {tabs.map((tab) => {
        const isActive = currentTab === tab.key;
        return (
          <Pressable
            key={tab.key}
            onPress={() => navigation.navigate(tab.key)}
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <View style={{ position: 'relative' }}>
              <Ionicons
                name={(isActive ? tab.iconFocused : tab.icon) as any}
                size={22}
                color={isActive ? t.tabBarActive : t.tabBarInactive}
              />
              {(tab.badge ?? 0) > 0 && (
                <View
                  style={{
                    position: 'absolute',
                    top: -3,
                    right: -8,
                    backgroundColor: '#EF4444',
                    borderRadius: 8,
                    minWidth: 16,
                    height: 16,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingHorizontal: 4,
                  }}
                >
                  <Text style={{ color: '#FFFFFF', fontSize: 9, fontWeight: '800' }}>
                    {tab.badge! > 9 ? '9+' : tab.badge!}
                  </Text>
                </View>
              )}
            </View>
            <Text
              style={{
                fontSize: typography.xs,
                fontWeight: isActive ? typography.bold : typography.medium,
                color: isActive ? t.tabBarActive : t.tabBarInactive,
                marginTop: 2,
              }}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

// ─── Wrapper for tab-level screens ──────────────────────
function TabScreen({ children, navigation, screenName }: { children: React.ReactNode; navigation: any; screenName: string }) {
  return (
    <View style={{ flex: 1 }}>
      {children}
      <CustomTabBar navigation={navigation} currentTab={screenName} />
    </View>
  );
}

// HOC to wrap a screen component with the tab bar
function withTabBar(Component: React.ComponentType<any>, screenName: string) {
  return function WrappedScreen(props: any) {
    return (
      <TabScreen navigation={props.navigation} screenName={screenName}>
        <Component {...props} />
      </TabScreen>
    );
  };
}

// ─── Screen Options ─────────────────────────────────────
function useScreenOptions() {
  const t = useTheme();
  return {
    headerStyle: { backgroundColor: t.surface },
    headerTintColor: t.text,
    headerTitleStyle: { fontWeight: typography.bold as any, fontSize: typography.lg },
    headerShadowVisible: false,
    contentStyle: { backgroundColor: t.bg },
  };
}

// ─── Auth Navigator ─────────────────────────────────────
export function AuthNavigator() {
  const opts = useScreenOptions();
  return (
    <AuthStack.Navigator screenOptions={{ ...opts, headerShown: false }}>
      <AuthStack.Screen name="Splash" component={SplashScreen} />
      <AuthStack.Screen name="Onboarding" component={OnboardingScreen} />
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
      <AuthStack.Screen name="OTP" component={OTPScreen} />
    </AuthStack.Navigator>
  );
}

// ─── Main Navigator ─────────────────────────────────────
export function MainTabNavigator() {
  const opts = useScreenOptions();

  return (
    <MainStack.Navigator screenOptions={opts}>
      {/* Tab-level screens (with tab bar) */}
      <MainStack.Screen
        name="HomeMain"
        component={withTabBar(HomeScreen, 'HomeMain')}
        options={{ headerShown: false }}
      />
      <MainStack.Screen
        name="ServicesList"
        component={withTabBar(ServicesScreen, 'ServicesList')}
        options={{ headerShown: false }}
      />
      <MainStack.Screen
        name="AppsList"
        component={withTabBar(ApplicationsScreen, 'AppsList')}
        options={{ headerShown: false }}
      />
      <MainStack.Screen
        name="ProfileMain"
        component={withTabBar(ProfileScreen, 'ProfileMain')}
        options={{ headerShown: false }}
      />
      <MainStack.Screen
        name="SupportMain"
        component={withTabBar(ContactExpertScreen, 'SupportMain')}
        options={{ headerShown: false }}
      />

      {/* Sub-screens (no tab bar) */}
      <MainStack.Screen name="CertDetail" component={CertDetailScreen} options={{ title: 'Certification' }} />
      <MainStack.Screen
        name="ServiceGroup"
        component={ServiceGroupScreen}
        options={({ route }: any) => ({ title: route.params.categoryName })}
      />
      <MainStack.Screen name="ApplyStep1" component={ApplyScreen} options={{ title: 'Apply' }} />
      <MainStack.Screen name="ApplyStep2" component={ApplyScreen as any} options={{ title: 'Apply' }} />
      <MainStack.Screen name="ApplyStep3" component={ApplyScreen as any} options={{ title: 'Apply' }} />
      <MainStack.Screen name="AppDetail" component={AppDetailScreen} options={{ title: 'Application Details' }} />
      <MainStack.Screen name="UploadDocs" component={UploadDocsScreen} options={{ title: 'Upload Documents' }} />
      <MainStack.Screen name="About" component={AboutScreen} options={{ title: 'About Sanyog' }} />
      <MainStack.Screen name="NotifList" component={NotificationsScreen} options={{ title: 'Notifications' }} />
      <MainStack.Screen name="RoadmapWizard" component={RoadmapWizardScreen} options={{ title: 'AI Roadmap' }} />
      <MainStack.Screen name="Placeholder" component={PlaceholderScreen} options={{ headerShown: false }} />
    </MainStack.Navigator>
  );
}

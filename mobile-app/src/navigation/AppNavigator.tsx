import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAppStore } from '../store/useAppStore';
import { useTheme } from '../hooks/useTheme';

import AuthNavigator from './AuthNavigator';
import HomeNavigator from './HomeNavigator';
import CertificationsNavigator from './CertificationsNavigator';
import ApplicationsNavigator from './ApplicationsNavigator';
import InsightsNavigator from './InsightsNavigator';
import ProfileNavigator from './ProfileNavigator';
import DocumentsNavigator from './DocumentsNavigator';
import ShipmentNavigator from './ShipmentNavigator';
import AiNavigator from './AiNavigator';
import TestingNavigator from './TestingNavigator';
import PaymentsNavigator from './PaymentsNavigator';
import CommunicationNavigator from './CommunicationNavigator';
import CertificatesNavigator from './CertificatesNavigator';
import AdminNavigator from './AdminNavigator';
import RoadmapWizardScreen from '../screens/services/RoadmapWizardScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const BRAND_COLOR = '#16a34a';

function MainTabs() {
  const navigation = useNavigation<any>();
  const user = useAppStore((s) => s.user);
  const t = useTheme();

  // Get initials from user name
  const initials = user?.name
    ? user.name.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase()
    : 'U';

  const ProfileAvatar = () => (
    <TouchableOpacity
      onPress={() => navigation.navigate('Dashboard', { screen: 'ProfileTab' })}
      style={{
        marginRight: 16,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#16a34a',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text style={{ color: '#fff', fontSize: 13, fontWeight: '800', letterSpacing: 0.5 }}>
        {initials}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, focused }) => {
          let iconName: any;
          if (route.name === 'HomeTab') iconName = 'home';
          else if (route.name === 'CertificationsTab') iconName = 'award';
          else if (route.name === 'ApplicationsTab') iconName = 'file-text';
          else if (route.name === 'InsightsTab') iconName = 'bar-chart-2';
          else if (route.name === 'ProfileTab') iconName = 'user';
          return (
            <Feather
              name={iconName}
              size={22}
              color={color}
            />
          );
        },
        tabBarActiveTintColor: BRAND_COLOR,
        tabBarInactiveTintColor: '#9ca3af',
        tabBarStyle: {
          backgroundColor: t.surface,
          borderTopWidth: 1,
          borderTopColor: t.borderSubtle,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.06,
          shadowRadius: 12,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2,
        },
        // Clean solid header — fixes content overlap on ALL screens
        headerStyle: {
          backgroundColor: t.surface,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: t.borderSubtle,
        },
        headerTintColor: t.text,
        headerTitleStyle: {
          fontWeight: '800',
          fontSize: 17,
          letterSpacing: -0.3,
        },
        headerTitleAlign: 'center',
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => navigation.openDrawer()}
            style={{ marginLeft: 16, width: 40, height: 40, justifyContent: 'center', alignItems: 'center' }}
          >
            <Feather name="menu" size={22} color={t.text} />
          </TouchableOpacity>
        ),
        headerRight: () => <ProfileAvatar />,
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeNavigator} options={{ title: 'Home', headerShown: false }} />
      <Tab.Screen name="CertificationsTab" component={CertificationsNavigator} options={{ title: 'Certs' }} />
      <Tab.Screen name="ApplicationsTab" component={ApplicationsNavigator} options={{ title: 'Apps' }} />
      <Tab.Screen name="InsightsTab" component={InsightsNavigator} options={{ title: 'Insights' }} />
      <Tab.Screen name="ProfileTab" component={ProfileNavigator} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
}

function MainDrawer() {
  const t = useTheme();
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: BRAND_COLOR,
        drawerInactiveTintColor: t.textSecondary,
        drawerStyle: {
          backgroundColor: t.surface,
        },
      }}
    >
      {/* Bottom Tabs wrapped in Drawer */}
      <Drawer.Screen 
        name="Dashboard" 
        component={MainTabs} 
        options={{ drawerIcon: ({color}) => <Feather name="layout" size={22} color={color} /> }} 
      />
      {/* Redundant items but explicitly requested in Hamburger Menu mapping to respective Tabs via Drawer component (We link the Tab stack here) */}
      <Drawer.Screen 
        name="Certifications" 
        component={CertificationsNavigator} 
        options={{ drawerIcon: ({color}) => <Feather name="award" size={22} color={color} /> }} 
      />
      <Drawer.Screen 
        name="Applications" 
        component={ApplicationsNavigator} 
        options={{ drawerIcon: ({color}) => <Feather name="file-text" size={22} color={color} /> }} 
      />
      
      {/* Other Hamburger Menu Modules */}
      <Drawer.Screen 
        name="Documents" 
        component={DocumentsNavigator} 
        options={{ drawerIcon: ({color}) => <Feather name="folder" size={22} color={color} /> }} 
      />
      <Drawer.Screen 
        name="Shipment & Compliance" 
        component={ShipmentNavigator} 
        options={{ drawerIcon: ({color}) => <Feather name="truck" size={22} color={color} /> }} 
      />
      <Drawer.Screen 
        name="AI Assistant" 
        component={AiNavigator} 
        options={{ drawerIcon: ({color}) => <Feather name="cpu" size={22} color={color} /> }} 
      />
      <Drawer.Screen 
        name="Testing & Inspection" 
        component={TestingNavigator} 
        options={{ drawerIcon: ({color}) => <Feather name="activity" size={22} color={color} /> }} 
      />
      <Drawer.Screen 
        name="Certificate Center" 
        component={CertificatesNavigator} 
        options={{ drawerIcon: ({color}) => <Feather name="shield" size={22} color={color} /> }} 
      />
      <Drawer.Screen 
        name="Payments & Billing" 
        component={PaymentsNavigator} 
        options={{ drawerIcon: ({color}) => <Feather name="credit-card" size={22} color={color} /> }} 
      />
      <Drawer.Screen 
        name="Communication Center" 
        component={CommunicationNavigator} 
        options={{ drawerIcon: ({color}) => <Feather name="message-circle" size={22} color={color} /> }} 
      />
      {/* Additional tabs that are in the drawer */}
      <Drawer.Screen 
        name="Insights" 
        component={InsightsNavigator} 
        options={{ drawerIcon: ({color}) => <Feather name="bar-chart-2" size={22} color={color} /> }} 
      />
      <Drawer.Screen 
        name="Profile" 
        component={ProfileNavigator} 
        options={{ drawerIcon: ({color}) => <Feather name="user" size={22} color={color} /> }} 
      />
      <Drawer.Screen 
        name="Admin Panel" 
        component={AdminNavigator} 
        options={{ drawerIcon: ({color}) => <Feather name="settings" size={22} color={color} /> }} 
      />
    </Drawer.Navigator>
  );
}

export default function AppNavigator() {
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
      }}
    >
      {isAuthenticated ? (
        <>
          <Stack.Screen name="Main" component={MainDrawer} />
          <Stack.Screen name="RoadmapWizard" component={RoadmapWizardScreen} options={{ presentation: 'fullScreenModal' }} />
        </>
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
}

/**
 * Sanyog Conformity – Mobile App Entry Point
 * Premium enterprise-grade certification management app
 */
import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { View, Text, LogBox, PermissionsAndroid, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { useAppStore } from './src/store/useAppStore';
import AppNavigator from './src/navigation/AppNavigator';
import PermissionModal from './src/components/common/PermissionModal';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Suppress non-critical warnings
LogBox?.ignoreLogs?.(['Require cycle']);

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error, info: any) {
    console.error('App Error:', error.message);
  }
  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0A0E1A', padding: 24 }}>
          <Text style={{ color: '#EF4444', fontSize: 20, fontWeight: '800', marginBottom: 12 }}>
            Something went wrong
          </Text>
          <Text style={{ color: '#94A3B8', fontSize: 14, textAlign: 'center', lineHeight: 22 }}>
            {this.state.error?.message || 'Unknown error'}
          </Text>
        </View>
      );
    }
    return this.props.children;
  }
}

function AppContent() {
  const hasGrantedPermissions = useAppStore((s) => s.hasGrantedPermissions);
  const setPermissionsGranted = useAppStore((s) => s.setPermissionsGranted);
  const [showPermModal, setShowPermModal] = React.useState(false);

  useEffect(() => {
    if (!hasGrantedPermissions) {
      setTimeout(() => setShowPermModal(true), 1500);
    }
    setupNotifications();
  }, [hasGrantedPermissions]);

  const setupNotifications = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status === 'granted') {
      // Schedule a mock notification for 5 seconds from now
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '🚨 Compliance Alert',
          body: 'Your ISO 9001 certification expires in 30 days. Tap to renew.',
          data: { certId: 'iso9001' },
        },
        trigger: { seconds: 5 },
      });
    }
  };

  const handleGrantPermissions = async () => {
    setShowPermModal(false);
    if (Platform.OS === 'android') {
      try {
        await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        ]);
        setPermissionsGranted();
      } catch (err) {
        console.warn(err);
      }
    } else {
      // iOS permissions would be handled here if needed via react-native-permissions
      setPermissionsGranted();
    }
  };

  return (
    <NavigationContainer>
      <AppNavigator />
      <PermissionModal 
        visible={showPermModal} 
        onAllow={handleGrantPermissions} 
        onSkip={() => setShowPermModal(false)} 
      />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppContent />
      <Toast />
    </ErrorBoundary>
  );
}

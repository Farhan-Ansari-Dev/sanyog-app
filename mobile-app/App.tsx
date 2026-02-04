import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';

import AppNavigator from './navigation/AppNavigator';
import { getToken } from './services/authStorage';
import type { RootStackParamList } from './types';

export default function App() {
  const [initialRoute, setInitialRoute] = useState<keyof RootStackParamList>('Login');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        setInitialRoute(token ? 'Home' : 'Login');
      } finally {
        setReady(true);
      }
    })();
  }, []);

  if (!ready) return null;

  return (
    <NavigationContainer>
      <AppNavigator initialRouteName={initialRoute} />
    </NavigationContainer>
  );
}

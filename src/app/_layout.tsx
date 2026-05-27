import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '123302997708-su1nviu51b3varro59mveqgapev67beb.apps.googleusercontent.com',
      offlineAccess: true,
    })
  }, []);

  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#0B0C0E' },
          animation: 'slide_from_right',
        }}
      />
      <StatusBar style="light" />
    </SafeAreaProvider>
  );
}

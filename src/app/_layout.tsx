import 'react-native-get-random-values';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';
import { setJSExceptionHandler } from 'react-native-exception-handler';
setJSExceptionHandler((error, isFatal) => {
  console.log('CAUGHT ERROR:', error.message);
  console.log('STACK TRACE:', error.stack);

  alert(`Error: ${error.message}\nStack: ${error.stack}`);
}, true);
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function RootLayout() {
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '123302997708-su1nviu51b3varro59mveqgapev67beb.apps.googleusercontent.com',
      offlineAccess: true,
    })
  }, []);



  return (
    <SafeAreaProvider>
      <KeyboardProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#0B0C0E' },
            animation: 'slide_from_right',
          }}
        />
        <StatusBar style="light" />
      </KeyboardProvider>
    </SafeAreaProvider>
  );
}

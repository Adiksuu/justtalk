import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
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

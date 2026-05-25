import TabBar from '@/components/utils/TabBar';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState('profile');
  const router = useRouter();

  function handleTabChange(tab: string) {
    setActiveTab(tab);
    if (tab === 'home') router.replace('/');
  }

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.center}>
          <Ionicons name="person" size={48} color="#6366F1" />
          <Text style={styles.title}>Profile</Text>
          <Text style={styles.subtitle}>Your account and settings</Text>
        </View>
      </SafeAreaView>
      <TabBar
        currentTab={activeTab}
        onTabChange={handleTabChange}
        styleType="capsule"
        themeMode="dark"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0B0C0E' },
  safeArea: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  title: { color: '#F9FAFB', fontSize: 28, fontWeight: '700' },
  subtitle: { color: '#6B7280', fontSize: 15 },
});

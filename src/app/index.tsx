import ChatList from '@/components/ui/ChatList';
import Filters from '@/components/ui/Filters';
import Header from '@/components/ui/Header';
import Stories from '@/components/ui/Stories';
import TabBar from '@/components/utils/TabBar';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const [activeFilter, setActiveFilter] = useState('Personal');
  const [activeTab] = useState('home');
  const router = useRouter();
  const [loggedIn] = useState(false);

  function handleTabChange(tab: string) {
    if (tab === 'profile') router.push('/profile');
  }

  useFocusEffect(() =>{
    if (!loggedIn) {
      router.push('/login');
    }
  })

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <Header />
        <Stories />
        <Filters activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
        <ChatList />
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

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0B0C0E',
  },
  safeArea: {
    flex: 1,
  },
});

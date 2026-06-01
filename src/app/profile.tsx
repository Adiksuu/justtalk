import TabBar from '@/components/utils/TabBar';
import { useRouter } from 'expo-router';
import Constants from 'expo-constants';
import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Clipboard,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/components/profile/Header';
import Avatar from '@/components/profile/Avatar';
import Card_1 from '@/components/profile/cards/card_1';
import Card_2 from '@/components/profile/cards/card_2';
import Logout from '@/components/profile/cards/Logout';
import FloatingToast from '@/components/profile/FloatingToast';
import BottomSheetModal from '@/components/profile/BottomSheetModal';
import { handleLogout } from '@/functions/auth';
import { copyUserId, fetchUserProfile, formatJoinedDate, getInitials } from '@/functions/profile';
import { UserProfileData } from '@/interfaces/UserProfileData';

export default function ProfileScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [profile, setProfile] = useState<UserProfileData>({
    uid: '',
    fullName: '',
    email: '',
    emailVerified: false,
    phoneNumber: '',
    avatar: null,
  });
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);
  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const toastAnim = useRef(new Animated.Value(-100)).current;
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const backdropAnim = useRef(new Animated.Value(0)).current;
  const modalAnim = useRef(new Animated.Value(300)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const [appVersion] = useState(Constants.expoConfig?.version || '1.0.0');

  function handleTabChange(tab: string) {
    setActiveTab(tab);
    if (tab === 'home') router.replace('/');
  }

  useEffect(() => {
    fetchUserProfile(router, setProfile, setLoading);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const triggerToast = () => {
    setShowToast(true);
    Animated.sequence([
      Animated.timing(toastAnim, {
        toValue: 20,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(2000),
      Animated.timing(toastAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowToast(false);
    });
  };

  const openLogoutConfirm = () => {
    setShowLogoutConfirm(true);
    Animated.parallel([
      Animated.timing(backdropAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(modalAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeLogoutConfirm = () => {
    Animated.parallel([
      Animated.timing(backdropAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(modalAnim, {
        toValue: 300,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowLogoutConfirm(false);
    });
  };

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <Header />
        <Animated.ScrollView
          style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Avatar profile={profile} getInitials={getInitials} />
          <Card_1
            profile={profile}
            formatJoinedDate={formatJoinedDate}
            copyUserId={() => copyUserId(profile, setCopiedId, triggerToast, Clipboard)}
            copiedId={copiedId}
          />
          <Card_2
            hapticsEnabled={hapticsEnabled}
            setHapticsEnabled={setHapticsEnabled}
            notificationsEnabled={notificationsEnabled}
            setNotificationsEnabled={setNotificationsEnabled}
            biometricsEnabled={biometricsEnabled}
            setBiometricsEnabled={setBiometricsEnabled}
          />
          <Logout 
            isLoggingOut={isLoggingOut}
            openLogoutConfirm={openLogoutConfirm}
          />
          <Text style={styles.footerNote}>JustTalk Version {appVersion} • Best messaging app</Text>
        </Animated.ScrollView>
      </SafeAreaView>
      {showToast && ( <FloatingToast toastAnim={toastAnim} /> )}
      {showLogoutConfirm && ( <BottomSheetModal backdropAnim={backdropAnim} modalAnim={modalAnim} closeLogoutConfirm={closeLogoutConfirm} handleLogout={() => handleLogout(setIsLoggingOut, closeLogoutConfirm, router)}/> )}
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
  screen: { 
    flex: 1, 
    backgroundColor: '#0B0C0E', 
  },
  safeArea: { 
    flex: 1, 
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 150,
  },
  footerNote: {
    color: '#656A76',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
});

import React, { useRef, useEffect, useState } from 'react'
import { View, StyleSheet, Animated } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import SettingsHeader from '@/components/profile/settings/SettingsHeader'
import RemoveAvatar from '@/components/profile/settings/RemoveAvatar'
import ChangeUsername from '@/components/profile/settings/ChangeUsername'
import ChangeTheme from '@/components/profile/settings/ChangeTheme'
import InitialsColor from '@/components/profile/settings/InitialsColor'
import DeleteAccount from '@/components/profile/settings/DeleteAccount'
import { fetchUserProfile } from '@/functions/profile'
import { UserProfileData } from '@/interfaces/UserProfileData'

export default function SettingsScreen() {
  const router = useRouter()
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(20)).current
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<UserProfileData>({
    uid: '',
    fullName: '',
    email: '',
    emailVerified: false,
    phoneNumber: '',
    avatar: null,
  })

  useEffect(() => {
    fetchUserProfile(router, setProfile, setLoading)

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start()
  }, [])

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <SettingsHeader onBack={() => router.back()} />
        <Animated.ScrollView
          style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <RemoveAvatar />
          <ChangeUsername currentName={profile.fullName} />
          <ChangeTheme />
          <InitialsColor currentColors={['#6366F1', '#8B5CF6']} />
          <DeleteAccount />
        </Animated.ScrollView>
      </SafeAreaView>
    </View>
  )
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
    paddingBottom: 60,
  },
})

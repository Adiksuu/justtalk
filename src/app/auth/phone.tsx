import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/components/auth/phone/Header';
import PhoneStep from '@/components/auth/phone/steps/PhoneStep';
import OTPStepContainer from '@/components/auth/phone/steps/OTPStepContainer';
import EmailStep from '@/components/auth/phone/email/EmailStep';
import { getApp } from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import { getDatabase, ref, set } from '@react-native-firebase/database';
import { useRouter } from 'expo-router';

export default function PhoneAuth() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [step, setStep] = useState<'phone' | 'otp' | 'email'>('phone');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [confirmResult, setConfirmResult] = useState<any>(null);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [emailError, setEmailError] = useState('');

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const otpInputs = useRef<(TextInput | null)[]>([]);

  const [isDisabled, setIsDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const timerRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [step]);

  function handleSendCode() {
    if (phone.length >= 6 && !isDisabled) {
      setCountdown(60);
      setIsDisabled(true);
      fadeAnim.setValue(0);
      slideAnim.setValue(30);
      auth().signInWithPhoneNumber(`${countryCode}${phone}`).then((result) => {
        setConfirmResult(result);
      }).catch((error) => {
        console.log(error)
      })
      setStep('otp');

      intervalRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      timerRef.current = setTimeout(() => {
        setIsDisabled(false);
        if (intervalRef.current) clearInterval(intervalRef.current);
      }, 60000);
    }
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  function handleOtpChange(value: string, index: number) {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      otpInputs.current[index + 1]?.focus();
    }
  }

  function handleOtpKeyPress(key: string, index: number) {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      otpInputs.current[index - 1]?.focus();
    }
  }

  function handleVerifyCode() {
    if (confirmResult && otp.length === 6) {
      confirmResult.confirm(otp.join(''))
        .then((userCredential: any) => {
          console.log("Logged in user:", userCredential.user);
          const user = userCredential.user;
          
          if (user.displayName) {
            router.replace('/');
          } else {
            fadeAnim.setValue(0);
            slideAnim.setValue(30);
            setStep('email');
          }
        })
        .catch((error: string) => {
          console.log("Wrong code:", error);
        });
    }
  }

  function handleSaveProfile() {
    if (!fullName.trim() || fullName.trim().length < 2) {
      setEmailError('Full name is required (minimum 2 characters)');
      return;
    }
    if (!email) {
      setEmailError('Email is required');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    setEmailError('');
    setIsSaving(true);

    const user = auth().currentUser;
    if (user) {
      console.log("Saving profile for user:", user.uid);
      
      // 1. Perform the Realtime Database write in the background using the new modular SDK API
      const db = getDatabase(getApp(), "https://justtalk-app-default-rtdb.europe-west1.firebasedatabase.app");
      set(ref(db, `users/${user.uid}`), {
        uid: user.uid,
        fullName: fullName.trim(),
        email: email.trim(),
        phoneNumber: user.phoneNumber || '',
        createdAt: new Date().toISOString()
      })
      .then(() => {
        console.log("Database write completed in background!");
      })
      .catch(dbErr => {
        console.log("Background DB write error:", dbErr);
      });

      // 2. Update Auth Profile in the background (non-blocking)
      user.updateProfile({ displayName: fullName.trim() })
        .then(() => {
          console.log("Auth display name updated successfully in background.");
        })
        .catch(authErr => {
          console.log("Background Auth update error:", authErr);
        });

      // 3. Navigate instantly on client-side!
      setIsSaving(false);
      router.replace('/');
    } else {
      setIsSaving(false);
      setEmailError('No user is currently signed in.');
    }
  }

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <Header
            step={step}
            fadeAnim={fadeAnim}
            slideAnim={slideAnim}
            setStep={setStep}
            setOtp={setOtp}
          />

          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Animated.View
              style={[
                styles.formContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              {step === 'phone' ? (
                <PhoneStep
                  countryCode={countryCode}
                  setCountryCode={setCountryCode}
                  phone={phone}
                  setPhone={setPhone}
                  handleSendCode={handleSendCode}
                  isDisabled={isDisabled}
                  countdown={countdown}
                />
              ) : step === 'otp' ? (
                <OTPStepContainer
                  countryCode={countryCode}
                  phone={phone}
                  otp={otp}
                  handleOtpChange={handleOtpChange}
                  handleOtpKeyPress={handleOtpKeyPress}
                  otpInputs={otpInputs}
                  handleVerifyCode={handleVerifyCode}
                  handleSendCode={handleSendCode}
                  isDisabled={isDisabled}
                  countdown={countdown}
                />
              ) : (
                <EmailStep
                  fullName={fullName}
                  setFullName={setFullName}
                  email={email}
                  setEmail={setEmail}
                  handleSaveProfile={handleSaveProfile}
                  isSaving={isSaving}
                  error={emailError}
                />
              )}
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
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
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  formContainer: {
    flex: 1,
  },
});

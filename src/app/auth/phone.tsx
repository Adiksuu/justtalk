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
import EmailStep from '@/components/auth/phone/steps/EmailStep';
import { useRouter } from 'expo-router';
import { handleOtpChange, handleOtpKeyPress, handleSaveProfile, handleSendCode, handleVerifyCode } from '@/functions/auth';

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

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

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
                  handleSendCode={() => handleSendCode(countryCode, phone, isDisabled, setCountdown, setIsDisabled, fadeAnim, slideAnim, setStep, setConfirmResult, intervalRef, timerRef)}
                  isDisabled={isDisabled}
                  countdown={countdown}
                />
              ) : step === 'otp' ? (
                <OTPStepContainer
                  countryCode={countryCode}
                  phone={phone}
                  otp={otp}
                  handleOtpChange={(value, index) => handleOtpChange(value, index, otp, setOtp, otpInputs)}
                  handleOtpKeyPress={(key, index) => handleOtpKeyPress(key, index, otp, otpInputs)}
                  otpInputs={otpInputs}
                  handleVerifyCode={() => handleVerifyCode(confirmResult, otp, router, fadeAnim, slideAnim, setStep)}
                  handleSendCode={() => handleSendCode(countryCode, phone, isDisabled, setCountdown, setIsDisabled, fadeAnim, slideAnim, setStep, setConfirmResult, intervalRef, timerRef)}
                  isDisabled={isDisabled}
                  countdown={countdown}
                />
              ) : (
                <EmailStep
                  fullName={fullName}
                  setFullName={setFullName}
                  email={email}
                  setEmail={setEmail}
                  handleSaveProfile={() => handleSaveProfile(fullName, email, setEmailError, setIsSaving, router)}
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

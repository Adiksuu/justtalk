import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import FullNameInput from '../email/FullNameInput';
import EmailInput from '../email/EmailInput';

interface EmailStepProps {
    fullName: string;
    setFullName: (name: string) => void;
    email: string;
    setEmail: (email: string) => void;
    handleSaveProfile: () => void;
    isSaving: boolean;
    error: string;
}

export default function EmailStep({ 
  fullName, 
  setFullName, 
  email, 
  setEmail, 
  handleSaveProfile, 
  isSaving, 
  error 
}: EmailStepProps) {
  const [isFullNameFocused, setIsFullNameFocused] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);

  const isValidEmail = (emailStr: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailStr);
  };

  const isButtonDisabled = !fullName.trim() || fullName.trim().length < 2 || !email || !isValidEmail(email) || isSaving;

  return (
    <>
      <View style={styles.iconContainer}>
        <View style={styles.iconCircle}>
          <Ionicons name="person-add" size={28} color="#6366F1" />
        </View>
      </View>

      <Text style={styles.title}>Complete Your Profile</Text>
      <Text style={styles.subtitle}>
        Please enter your full name and email address to finalize your account setup.
      </Text>

      <FullNameInput 
        fullName={fullName} 
        setFullName={setFullName}
        isFullNameFocused={isFullNameFocused}
        setIsFullNameFocused={setIsFullNameFocused}
        isSaving={isSaving}
      />

      <EmailInput
        email={email} 
        setEmail={setEmail}
        isEmailFocused={isEmailFocused}
        setIsEmailFocused={setIsEmailFocused}
        error={error}
        isSaving={isSaving}
      />

      {error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={16} color="#EF4444" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <TouchableOpacity
        style={[
          styles.primaryButton,
          isButtonDisabled && styles.primaryButtonDisabled,
        ]}
        activeOpacity={0.7}
        onPress={handleSaveProfile}
        disabled={isButtonDisabled}
      >
        {isSaving ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <>
            <Text style={styles.primaryButtonText}>Complete Setup</Text>
            <Ionicons name="arrow-forward" size={18} color="#fff" />
          </>
        )}
      </TouchableOpacity>
    </>
  )
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(99, 102, 241, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.2)',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#F9FAFB',
    textAlign: 'center',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
    paddingHorizontal: 10,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
  },
  primaryButton: {
    flexDirection: 'row',
    backgroundColor: '#6366F1',
    height: 54,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  primaryButtonDisabled: {
    backgroundColor: '#3730A3',
    opacity: 0.5,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },  
})

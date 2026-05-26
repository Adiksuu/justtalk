import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'

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

      {/* Full Name Input */}
      <View style={[
        styles.inputContainer,
        isFullNameFocused && styles.inputContainerFocused,
      ]}>
        <Ionicons 
          name="person-outline" 
          size={20} 
          color={isFullNameFocused ? "#6366F1" : "#9CA3AF"} 
          style={styles.inputIcon} 
        />
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#4B5563"
          autoCapitalize="words"
          autoCorrect={false}
          value={fullName}
          onChangeText={setFullName}
          onFocus={() => setIsFullNameFocused(true)}
          onBlur={() => setIsFullNameFocused(false)}
          editable={!isSaving}
        />
      </View>

      {/* Email Input */}
      <View style={[
        styles.inputContainer,
        isEmailFocused && styles.inputContainerFocused,
        error ? styles.inputContainerError : null
      ]}>
        <Ionicons 
          name="mail-outline" 
          size={20} 
          color={isEmailFocused ? "#6366F1" : "#9CA3AF"} 
          style={styles.inputIcon} 
        />
        <TextInput
          style={styles.input}
          placeholder="Email address"
          placeholderTextColor="#4B5563"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={setEmail}
          onFocus={() => setIsEmailFocused(true)}
          onBlur={() => setIsEmailFocused(false)}
          editable={!isSaving}
        />
      </View>

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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#191C21',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#2D2F38',
    paddingHorizontal: 16,
    height: 54,
    marginBottom: 16,
  },
  inputContainerFocused: {
    borderColor: '#6366F1',
    backgroundColor: '#1B1E25',
  },
  inputContainerError: {
    borderColor: '#EF4444',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: '#F9FAFB',
    fontSize: 16,
    fontWeight: '500',
    height: '100%',
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

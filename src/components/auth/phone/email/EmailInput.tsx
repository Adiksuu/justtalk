import { View, TextInput, StyleSheet } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'

interface EmailInputProps {
    email: string;
    setEmail: (email: string) => void;
    isEmailFocused: boolean;
    setIsEmailFocused: (isEmailFocused: boolean) => void;
    error: string;
    isSaving: boolean;
}

export default function EmailInput({
    email,
    setEmail,
    isEmailFocused,
    setIsEmailFocused,
    error,
    isSaving
}: EmailInputProps) {
  return (
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
  )
}

const styles = StyleSheet.create({
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
})
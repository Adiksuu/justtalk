import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

interface FullNameInputProps {
    fullName: string;
    setFullName: (name: string) => void;
    isFullNameFocused: boolean;
    setIsFullNameFocused: (isFullNameFocused: boolean) => void;
    isSaving: boolean;
}

export default function FullNameInput({
    fullName,
    setFullName,
    isFullNameFocused,
    setIsFullNameFocused,
    isSaving
}: FullNameInputProps) {
  return (
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
import { Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'

export default function SendCodeButton({ phone, handleSendCode, isDisabled, countdown }: { phone: string, handleSendCode: () => void, isDisabled: boolean, countdown: number }) {
  return (
    <TouchableOpacity
        style={[
            styles.primaryButton,
            (phone.length < 6 || isDisabled) && styles.primaryButtonDisabled,
        ]}
        activeOpacity={0.7}
        onPress={handleSendCode}
        disabled={isDisabled}
        >
        <Text style={styles.primaryButtonText}>{countdown > 1 ? `Wait ${countdown}s` : "Send Code"}</Text>
        <Ionicons name="arrow-forward" size={18} color="#fff" />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    primaryButton: {
        flexDirection: 'row',
        backgroundColor: '#6366F1',
        height: 54,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
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
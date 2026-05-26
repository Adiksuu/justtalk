import { Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'

export default function VerifyButton({ otp, handleVerifyCode }: { otp: string[], handleVerifyCode: () => void }) {
  return (
    <TouchableOpacity
        style={[
            styles.primaryButton,
            otp.some((d) => !d) && styles.primaryButtonDisabled,
        ]}
        activeOpacity={0.7}
        onPress={handleVerifyCode}
        >
        <Text style={styles.primaryButtonText}>Verify</Text>
        <Ionicons name="checkmark" size={18} color="#fff" />
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
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

interface OTPStepProps {
    countryCode: string;
    phone: string;
}

export default function OTPStep({ countryCode, phone }: OTPStepProps) {
  return (
    <>
        <View style={styles.iconContainer}>
            <View style={styles.iconCircle}>
                <Ionicons name="shield-checkmark" size={28} color="#6366F1" />
            </View>
            </View>

            <Text style={styles.title}>Verify Your Number</Text>
            <Text style={styles.subtitle}>
            Enter the 6-digit code sent to{'\n'}
            <Text style={styles.phoneHighlight}>
                {countryCode} {phone}
            </Text>
        </Text>
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
    },
    phoneHighlight: {
        color: '#6366F1',
        fontWeight: '600',
    },
})

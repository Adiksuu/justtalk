import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

export default function Informations() {
    return (
        <>
            <Text style={styles.title}>Your Phone Number</Text>
            <Text style={styles.subtitle}>We'll send you a verification code to confirm your identity</Text>
        </>
    )
}

const styles = StyleSheet.create({
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
})
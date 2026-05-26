import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

export default function Informations({ isLogin }: { isLogin: boolean }) {
  return (
    <>
        <Text style={styles.title}>
            {isLogin ? 'Welcome Back' : 'Create Account'}
        </Text>
        <Text style={styles.subtitle}>
            {isLogin
                ? 'Sign in to continue your conversations'
                : 'Sign up to start chatting with friends'}
        </Text>
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
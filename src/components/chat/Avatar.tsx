import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { getInitials } from '@/functions/profile'

export default function Avatar({ fullName, size = 38, fontSize = 12 }: {fullName: string; size?: number, fontSize?: number}) {
  return (
    <View style={styles.heroSection}>
        <TouchableOpacity
            activeOpacity={0.9} 
            style={[styles.avatarWrapper, { width: size, height: size, borderRadius: size / 2 }]}
        >
            <LinearGradient
            colors={['#6366F1', '#8B5CF6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.avatarGradient}
            >
                <Text style={[styles.avatarText, { fontSize }]}>{getInitials(fullName)}</Text>
            </LinearGradient>
        </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
    heroSection: {
        alignItems: 'center',
    },
    avatarWrapper: {
        borderRadius: 19,
        position: 'relative',
    },
    avatarGradient: {
        width: '100%',
        height: '100%',
        borderRadius: 48,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        color: '#FFFFFF',
        fontWeight: '700',
        letterSpacing: 0.5,
    },
})
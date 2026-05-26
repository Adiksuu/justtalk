import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'

export default function Avatar({profile, getInitials}: {profile: any, getInitials: (name: string) => string}) {
  return (
    <View style={styles.heroSection}>
        <TouchableOpacity
            activeOpacity={0.9} 
            style={styles.avatarWrapper}
            onPress={() => Alert.alert('Avatar upload features are coming soon!')}
        >
            <LinearGradient
            colors={['#6366F1', '#8B5CF6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.avatarGradient}
            >
            <Text style={styles.avatarText}>{getInitials(profile.fullName)}</Text>
            </LinearGradient>
            <View style={styles.cameraIconContainer}>
            <Ionicons name="camera" size={16} color="#FFFFFF" />
            </View>
        </TouchableOpacity>

        <Text style={styles.fullNameText}>{profile.fullName}</Text>
        <Text style={styles.emailSubText}>{profile.email}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    heroSection: {
        alignItems: 'center',
        marginBottom: 30,
        marginTop: 10,
    },
    avatarWrapper: {
        width: 96,
        height: 96,
        borderRadius: 48,
        position: 'relative',
        marginBottom: 16,
        shadowColor: '#6366F1',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 8,
    },
    avatarGradient: {
        width: '100%',
        height: '100%',
        borderRadius: 48,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    avatarText: {
        color: '#FFFFFF',
        fontSize: 32,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    cameraIconContainer: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#6366F1',
        borderWidth: 2,
        borderColor: '#0B0C0E',
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullNameText: {
        fontSize: 24,
        fontWeight: '700',
        color: '#F9FAFB',
        marginBottom: 4,
    },
    emailSubText: {
        fontSize: 14,
        color: '#9CA3AF',
        fontWeight: '400',
    },
})
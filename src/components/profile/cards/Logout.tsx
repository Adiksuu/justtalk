import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';

export default function Logout({isLoggingOut, openLogoutConfirm}: {isLoggingOut: boolean, openLogoutConfirm: () => void}) {
  return (
    <View style={styles.logoutCard}>
        <TouchableOpacity
            activeOpacity={0.7} 
            onPress={openLogoutConfirm} 
            style={styles.logoutRow}
        >
            {isLoggingOut ? (
            <ActivityIndicator color="#EF4444" size="small" style={{ marginRight: 12 }} />
            ) : (
            <View style={styles.logoutLeft}>
                <View style={[styles.iconBg, { backgroundColor: 'rgba(239, 68, 68, 0.12)' }]}>
                <Ionicons name="log-out-outline" size={22} color="#EF4444" />
                </View>
                <Text style={styles.logoutText}>Sign Out Account</Text>
            </View>
            )}
            <Ionicons name="chevron-forward" size={18} color="#EF4444" />
        </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
    logoutCard: {
        backgroundColor: '#16181D',
        borderRadius: 22,
        borderWidth: 1,
        borderColor: 'rgba(239, 68, 68, 0.15)',
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    iconBg: {
        width: 38,
        height: 38,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoutRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
    },
    logoutLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    logoutText: {
        fontSize: 15,
        color: '#EF4444',
        fontWeight: '600',
    },
})
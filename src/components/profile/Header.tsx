import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'

export default function Header() {
  return (
    <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity 
        style={styles.settingsButton} 
        activeOpacity={0.7}
        onPress={() => Alert.alert('Settings', 'Settings details and preferences editing are coming soon!')}
        >
        <Ionicons name="settings-outline" size={24} color="#F9FAFB" />
        </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 12,
        paddingBottom: 16,
    },
    headerTitle: {
        color: '#F9FAFB',
        fontSize: 30,
        fontWeight: '700',
        letterSpacing: -0.5,
    },
    settingsButton: {
        width: 42,
        height: 42,
        borderRadius: 14,
        backgroundColor: '#16181D',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.06)',
        justifyContent: 'center',
        alignItems: 'center',
    },
})
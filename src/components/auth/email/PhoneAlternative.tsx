import { Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';

export default function PhoneAlternative() {
    const router = useRouter();
    return (
        <TouchableOpacity
            style={styles.alternativeButton}
            activeOpacity={0.7}
            onPress={() => router.replace('/auth/phone')}
            >
            <Ionicons name="call-outline" size={20} color="#F9FAFB" />
            <Text style={styles.alternativeButtonText}>
                Continue with Phone
            </Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    alternativeButton: {
        flexDirection: 'row',
        backgroundColor: '#191C21',
        height: 54,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        borderWidth: 1,
        borderColor: '#2D2F38',
    },
    alternativeButtonText: {
        color: '#F9FAFB',
        fontSize: 15,
        fontWeight: '600',
    },
})
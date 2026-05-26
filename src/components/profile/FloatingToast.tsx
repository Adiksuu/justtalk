import { Text, Animated, StyleSheet } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons';

export default function FloatingToast({toastAnim}: {toastAnim: Animated.Value}) {
  return (
    <Animated.View style={[styles.toastContainer, { transform: [{ translateY: toastAnim }] }]}>
        <LinearGradient
        colors={['#6366F1', '#4F46E5']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.toastGradient}
        >
        <Ionicons name="checkbox" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
        <Text style={styles.toastText}>User ID copied to clipboard</Text>
        </LinearGradient>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
    toastContainer: {
        position: 'absolute',
        top: 50,
        left: 20,
        right: 20,
        zIndex: 999,
    },
    toastGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 14,
        justifyContent: 'center',
        shadowColor: '#6366F1',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 10,
        elevation: 8,
    },
    toastText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
})
import { View, Text, Animated, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'

export default function BottomSheetModal({backdropAnim, modalAnim, closeLogoutConfirm, handleLogout}: {backdropAnim: Animated.Value, modalAnim: Animated.Value, closeLogoutConfirm: () => void, handleLogout: () => void}) {
  return (
    <View style={StyleSheet.absoluteFill}>
        {/* Animated backdrop */}
        <Animated.View 
        style={[styles.backdrop, { opacity: backdropAnim }]} 
        onTouchStart={closeLogoutConfirm}
        />
        {/* Animated Sheet drawer */}
        <View style={styles.sheetWrapper}>
        <Animated.View style={[styles.sheetContent, { transform: [{ translateY: modalAnim }] }]}>
            <View style={styles.sheetHandle} />
            
            <View style={styles.sheetHeader}>
            <View style={styles.warningIconCircle}>
                <Ionicons name="warning-outline" size={32} color="#EF4444" />
            </View>
            <Text style={styles.sheetTitle}>Sign Out</Text>
            <Text style={styles.sheetSubtitle}>
                Are you absolutely sure you want to sign out? You will need to re-verify your account to log back in.
            </Text>
            </View>

            <View style={styles.sheetButtonsContainer}>
            <TouchableOpacity 
                style={styles.confirmLogoutButton} 
                activeOpacity={0.8}
                onPress={handleLogout}
            >
                <Text style={styles.confirmLogoutText}>Sign Out Now</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={styles.cancelLogoutButton} 
                activeOpacity={0.8}
                onPress={closeLogoutConfirm}
            >
                <Text style={styles.cancelLogoutText}>Cancel</Text>
            </TouchableOpacity>
            </View>
        </Animated.View>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
    backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    zIndex: 1000,
  },
  sheetWrapper: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    zIndex: 1001,
  },
  sheetContent: {
    backgroundColor: '#16181D',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 24,
    paddingBottom: 40,
    alignItems: 'center',
  },
  sheetHandle: {
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#374151',
    marginBottom: 24,
  },
  sheetHeader: {
    alignItems: 'center',
    marginBottom: 28,
  },
  warningIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.18)',
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#F9FAFB',
    marginBottom: 8,
  },
  sheetSubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 12,
  },
  sheetButtonsContainer: {
    width: '100%',
    gap: 12,
  },
  confirmLogoutButton: {
    backgroundColor: '#EF4444',
    height: 54,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmLogoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  cancelLogoutButton: {
    backgroundColor: 'transparent',
    height: 54,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  cancelLogoutText: {
    color: '#F9FAFB',
    fontSize: 16,
    fontWeight: '600',
  },
})
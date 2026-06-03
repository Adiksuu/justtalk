import { View, Text, Animated, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'

interface RemoveFriendModalProps {
  backdropAnim: Animated.Value;
  modalAnim: Animated.Value;
  closeConfirm: () => void;
  handleRemove: () => void;
  name: string;
}

export default function RemoveFriendModal({
  backdropAnim,
  modalAnim,
  closeConfirm,
  handleRemove,
  name,
}: RemoveFriendModalProps) {
  return (
    <View style={StyleSheet.absoluteFill}>
      <Animated.View 
        style={[styles.backdrop, { opacity: backdropAnim }]} 
        onTouchStart={closeConfirm}
      />
      <View style={styles.sheetWrapper}>
        <Animated.View style={[styles.sheetContent, { transform: [{ translateY: modalAnim }] }]}>
          <View style={styles.sheetHandle} />
          
          <View style={styles.sheetHeader}>
            <View style={styles.warningIconCircle}>
              <Ionicons name="person-remove-outline" size={32} color="#EF4444" />
            </View>
            <Text style={styles.sheetTitle}>Remove Friend</Text>
            <Text style={styles.sheetSubtitle}>
              Are you absolutely sure you want to remove {name} from your friend list? You will no longer be able to message each other unless you send another request.
            </Text>
          </View>

          <View style={styles.sheetButtonsContainer}>
            <TouchableOpacity 
              style={styles.confirmButton} 
              activeOpacity={0.8}
              onPress={handleRemove}
            >
              <Text style={styles.confirmText}>Remove Friend</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.cancelButton} 
              activeOpacity={0.8}
              onPress={closeConfirm}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    zIndex: 1000,
  },
  sheetWrapper: {
    ...StyleSheet.absoluteFill,
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
  confirmButton: {
    backgroundColor: '#EF4444',
    height: 54,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    height: 54,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  cancelText: {
    color: '#F9FAFB',
    fontSize: 16,
    fontWeight: '600',
  },
})

import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

export default function ToggleMode({ isLogin, toggleMode }: { isLogin: boolean; toggleMode: () => void }) {
  return (
    <View style={styles.toggleContainer}>
        <TouchableOpacity
            style={[styles.toggleButton, isLogin && styles.toggleButtonActive]}
            activeOpacity={0.7}
            onPress={() => { if (!isLogin) toggleMode(); }}
        >
            <Text
            style={[
                styles.toggleText,
                isLogin && styles.toggleTextActive,
            ]}
            >
            Login
            </Text>
        </TouchableOpacity>
        <TouchableOpacity
            style={[styles.toggleButton, !isLogin && styles.toggleButtonActive]}
            activeOpacity={0.7}
            onPress={() => { if (isLogin) toggleMode(); }}
        >
            <Text
            style={[
                styles.toggleText,
                !isLogin && styles.toggleTextActive,
            ]}
            >
            Register
            </Text>
        </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#191C21',
    borderRadius: 14,
    padding: 4,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#2D2F38',
  },
  toggleButton: {
    flex: 1,
    height: 40,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleButtonActive: {
    backgroundColor: '#6366F1',
  },
  toggleText: {
    color: '#6B7280',
    fontSize: 15,
    fontWeight: '600',
  },
  toggleTextActive: {
    color: '#fff',
  },
})
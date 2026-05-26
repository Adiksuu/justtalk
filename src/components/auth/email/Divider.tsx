import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

export default function Divider() {
  return (
    <View style={styles.dividerContainer}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>or</Text>
        <View style={styles.dividerLine} />
    </View>
  )
}

const styles = StyleSheet.create({
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 24,
        gap: 12,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#2D2F38',
    },
    dividerText: {
        color: '#6B7280',
        fontSize: 13,
        fontWeight: '500',
    },
})
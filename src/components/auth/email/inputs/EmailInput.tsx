import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { StyleSheet, TextInput, View } from 'react-native'

export default function EmailInput({email, setEmail}: {email: string, setEmail: (value: string) => void}) {
  return (
    <View style={styles.inputWrapper}>
        <View style={styles.inputIconBox}>
            <Ionicons name="mail-outline" size={20} color="#6366F1" />
        </View>
        <TextInput
            style={styles.input}
            placeholder="Email address"
            placeholderTextColor="#4B5563"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
        />
    </View>
  )
}

const styles = StyleSheet.create({
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#191C21',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#2D2F38',
        marginBottom: 12,
        height: 54,
        overflow: 'hidden',
    },
    inputIconBox: {
        width: 48,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        color: '#F9FAFB',
        fontSize: 15,
        fontWeight: '500',
        height: '100%',
        paddingRight: 12,
    },
})
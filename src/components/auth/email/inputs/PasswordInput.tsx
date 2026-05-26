import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native'

export default function PasswordInput({password, setPassword, showPassword, setShowPassword}: {password: string, setPassword: (value: string) => void, showPassword: boolean, setShowPassword: (value: boolean) => void}) {
  return (
    <View style={styles.inputWrapper}>
        <View style={styles.inputIconBox}>
            <Ionicons name="lock-closed-outline" size={20} color="#6366F1" />
        </View>
        <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#4B5563"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
        />
        <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowPassword(!showPassword)}
            activeOpacity={0.6}
        >
            <Ionicons
            name={showPassword ? 'eye-off-outline' : 'eye-outline'}
            size={20}
            color="#6B7280"
            />
        </TouchableOpacity>
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
    eyeButton: {
        width: 44,
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
    },
})
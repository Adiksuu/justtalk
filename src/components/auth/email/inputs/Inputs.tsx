import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import NameInput from './NameInput'
import EmailInput from './EmailInput'
import PasswordInput from './PasswordInput'
import ConfirmPasswordInput from './ConfirmPasswordInput'

export default function Inputs({isLogin, name, setName, email, setEmail, password, setPassword, showPassword, setShowPassword, confirmPassword, setConfirmPassword, showConfirmPassword, setShowConfirmPassword}: {isLogin: boolean, name: string, setName: (value: string) => void, email: string, setEmail: (value: string) => void, password: string, setPassword: (value: string) => void, showPassword: boolean, setShowPassword: (value: boolean) => void, confirmPassword: string, setConfirmPassword: (value: string) => void, showConfirmPassword: boolean, setShowConfirmPassword: (value: boolean) => void}) {
  return (
    <>
        {!isLogin && (
            <NameInput name={name} setName={setName} />
        )}
        <EmailInput email={email} setEmail={setEmail} />
        <PasswordInput password={password} setPassword={setPassword} showPassword={showPassword} setShowPassword={setShowPassword} />

        {!isLogin && (
            <ConfirmPasswordInput confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword} showConfirmPassword={showConfirmPassword} setShowConfirmPassword={setShowConfirmPassword} />
        )}
        {isLogin && (
            <TouchableOpacity style={styles.forgotButton} activeOpacity={0.6}>
                <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>
        )}
    </>
  )
}

const styles = StyleSheet.create({
    forgotButton: {
    alignSelf: 'flex-end',
    marginBottom: 24,
    marginTop: 4,
  },
  forgotText: {
    color: '#6366F1',
    fontSize: 14,
    fontWeight: '600',
  },
})
import { View, TextInput, StyleSheet, Dimensions } from 'react-native'
import React from 'react'

const { width } = Dimensions.get('window');

export default function OTPInputs({ otp, handleOtpChange, handleOtpKeyPress, otpInputs }: { otp: string[], handleOtpChange: (val: string, index: number) => void, handleOtpKeyPress: (key: string, index: number) => void, otpInputs: React.MutableRefObject<(TextInput | null)[]> }) {
  return (
    <View style={styles.otpRow}>
        {otp.map((digit, index) => (
            <TextInput
            key={index}
            ref={(ref) => { otpInputs.current[index] = ref; }}
            style={[
                styles.otpInput,
                digit ? styles.otpInputFilled : null,
            ]}
            value={digit}
            onChangeText={(val) => handleOtpChange(val, index)}
            onKeyPress={({ nativeEvent }) =>
                handleOtpKeyPress(nativeEvent.key, index)
            }
            keyboardType="number-pad"
            maxLength={1}
            selectTextOnFocus
            />
        ))}
    </View>
  )
}

const styles = StyleSheet.create({
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 24,
  },
  otpInput: {
    width: (width - 48 - 50) / 6,
    maxWidth: 52,
    height: 58,
    borderRadius: 14,
    backgroundColor: '#191C21',
    borderWidth: 1.5,
    borderColor: '#2D2F38',
    color: '#F9FAFB',
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
  },
  otpInputFilled: {
    borderColor: '#6366F1',
    backgroundColor: 'rgba(99, 102, 241, 0.08)',
  },  
})
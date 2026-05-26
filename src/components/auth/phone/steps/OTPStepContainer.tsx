import React from 'react'
import { StyleSheet, Text, TouchableOpacity, TextInput } from 'react-native'
import OTPStep from '../otp/OTPStep'
import OTPInputs from '../otp/OTPInputs'
import VerifyButton from '../otp/VerifyButton'

interface OTPStepContainerProps {
  countryCode: string
  phone: string
  otp: string[]
  handleOtpChange: (value: string, index: number) => void
  handleOtpKeyPress: (key: string, index: number) => void
  otpInputs: React.MutableRefObject<(TextInput | null)[]>
  handleVerifyCode: () => void
  handleSendCode: () => void
  isDisabled: boolean
  countdown: number
}

export default function OTPStepContainer({
  countryCode,
  phone,
  otp,
  handleOtpChange,
  handleOtpKeyPress,
  otpInputs,
  handleVerifyCode,
  handleSendCode,
  isDisabled,
  countdown,
}: OTPStepContainerProps) {
  return (
    <>
      <OTPStep countryCode={countryCode} phone={phone} />
      <OTPInputs 
        otp={otp} 
        handleOtpChange={handleOtpChange} 
        handleOtpKeyPress={handleOtpKeyPress} 
        otpInputs={otpInputs} 
      />
      
      <TouchableOpacity 
        style={styles.resendButton} 
        activeOpacity={0.6}
        onPress={handleSendCode}
        disabled={isDisabled}
      >
        <Text style={styles.resendText}>Didn't receive a code?</Text>
        <Text style={[
          styles.resendLink,
          isDisabled && styles.resendLinkDisabled
        ]}>
          {isDisabled ? `Resend in ${countdown}s` : 'Resend'}
        </Text>
      </TouchableOpacity>

      <VerifyButton otp={otp} handleVerifyCode={handleVerifyCode} />
    </>
  )
}

const styles = StyleSheet.create({
  resendButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    marginBottom: 32,
  },
  resendText: {
    color: '#6B7280',
    fontSize: 14,
  },
  resendLink: {
    color: '#6366F1',
    fontSize: 14,
    fontWeight: '600',
  },
  resendLinkDisabled: {
    color: '#4B5563',
  },
})

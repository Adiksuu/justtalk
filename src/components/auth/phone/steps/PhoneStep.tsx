import React from 'react'
import Icon from '../Icon'
import Informations from '../Informations'
import PhoneInput from '../inputs/PhoneInput'
import SendCodeButton from '../SendCodeButton'

interface PhoneStepProps {
  countryCode: string
  setCountryCode: (code: string) => void
  phone: string
  setPhone: (phone: string) => void
  handleSendCode: () => void
  isDisabled: boolean
  countdown: number
}

export default function PhoneStep({
  countryCode,
  setCountryCode,
  phone,
  setPhone,
  handleSendCode,
  isDisabled,
  countdown,
}: PhoneStepProps) {
  return (
    <>
      <Icon />
      <Informations />
      <PhoneInput 
        countryCode={countryCode} 
        setCountryCode={setCountryCode} 
        phone={phone} 
        setPhone={setPhone} 
      />
      <SendCodeButton 
        phone={phone} 
        handleSendCode={handleSendCode} 
        isDisabled={isDisabled} 
        countdown={countdown} 
      />
    </>
  )
}

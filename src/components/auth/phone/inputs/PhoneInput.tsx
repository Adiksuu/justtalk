import React, { useState } from 'react'
import { 
  View, 
  Text, 
  TouchableOpacity, 
  TextInput, 
  StyleSheet, 
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import CountryModal from './CountryModal'

interface PhoneInputProps {
  countryCode: string
  setCountryCode: (code: string) => void
  phone: string
  setPhone: (phone: string) => void
}

export default function PhoneInput({ countryCode, setCountryCode, phone, setPhone }: PhoneInputProps) {
  const [modalVisible, setModalVisible] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <View style={styles.phoneRow}>
      <TouchableOpacity 
        style={styles.countryCodeBox} 
        activeOpacity={0.7}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.countryCodeText}>{countryCode}</Text>
        <Ionicons name="chevron-down" size={14} color="#9CA3AF" />
      </TouchableOpacity>

      <View style={styles.phoneInputContainer}>
        <TextInput
          style={styles.phoneInput}
          placeholder="Phone number"
          placeholderTextColor="#4B5563"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
          maxLength={15}
        />
      </View>
      <CountryModal modalVisible={modalVisible} setModalVisible={setModalVisible} countryCode={countryCode} setCountryCode={setCountryCode} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
    </View>
  )
}

const styles = StyleSheet.create({
  phoneRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  countryCodeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#191C21',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 54,
    borderWidth: 1,
    borderColor: '#2D2F38',
  },
  countryCodeText: {
    color: '#F9FAFB',
    fontSize: 16,
    fontWeight: '600',
  },
  phoneInputContainer: {
    flex: 1,
    backgroundColor: '#191C21',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#2D2F38',
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  phoneInput: {
    color: '#F9FAFB',
    fontSize: 16,
    fontWeight: '500',
    height: 54,
  },
})
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

export default function InputBar() {
  return (
    <View style={inputStyles.container}>
      <TouchableOpacity activeOpacity={0.7} style={inputStyles.iconBtn}>
        <Ionicons name="attach-outline" size={22} color="#6B7280" style={{ transform: [{ rotate: '-45deg' }] }} />
      </TouchableOpacity>

      <View style={inputStyles.inputWrapper}>
        <TextInput
          placeholder="Message"
          placeholderTextColor="#6B7280"
          style={inputStyles.input}
          editable={false}
        />
      </View>

      <TouchableOpacity activeOpacity={0.7} style={inputStyles.iconBtn}>
        <Ionicons name="camera-outline" size={22} color="#6B7280" />
      </TouchableOpacity>
    </View>
  );
}

const inputStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#16181D',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    gap: 6,
  },
  iconBtn: {
    padding: 6,
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: '#1E2028',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  input: {
    color: '#F9FAFB',
    fontSize: 15,
    padding: 0,
  },
});
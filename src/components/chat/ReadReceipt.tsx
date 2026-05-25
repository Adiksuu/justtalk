import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native'
import React from 'react'

export default function ReadReceipt({ isRead }: { isRead?: boolean }) {
  return (
    <View style={{ flexDirection: 'row', marginLeft: 3 }}>
      <Ionicons
        name="checkmark-done"
        size={14}
        color={isRead ? '#A78BFA' : '#6B7280'}
      />
    </View>
  );
}
import React from 'react'
import { View, Text,StyleSheet, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

export default function Header() {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Chats</Text>
      <TouchableOpacity style={styles.addButton} activeOpacity={0.7}>
        <Ionicons name="add" size={26} color="#F9FAFB" />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  headerTitle: {
    color: '#F9FAFB',
    fontSize: 30,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  addButton: {
    width: 38,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
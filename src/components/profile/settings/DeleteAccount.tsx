import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'

export default function DeleteAccount() {
  return (
    <>
      <Text style={styles.sectionTitle}>Danger Zone</Text>
      <View style={styles.card}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.row}
        >
          <View style={styles.rowLeft}>
            <View style={styles.iconBg}>
              <Ionicons name="skull-outline" size={20} color="#EF4444" />
            </View>
            <View style={styles.textWrapper}>
              <Text style={styles.rowLabel}>Delete Account</Text>
              <Text style={styles.rowSubLabel}>Permanently remove your account and all data</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#656A76',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
    marginLeft: 6,
  },
  card: {
    backgroundColor: '#16181D',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.15)',
    paddingHorizontal: 16,
    marginBottom: 28,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconBg: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textWrapper: {
    flex: 1,
  },
  rowLabel: {
    fontSize: 15,
    color: '#EF4444',
    fontWeight: '600',
  },
  rowSubLabel: {
    fontSize: 11,
    color: '#656A76',
    marginTop: 2,
  },
})

import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { Alert, Platform, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native'

export default function card_2({
  darkModeEnabled,
  setDarkModeEnabled,
  notificationsEnabled,
  setNotificationsEnabled,
  biometricsEnabled,
  setBiometricsEnabled,
}: any) {
  return (
    <>
        <Text style={styles.sectionTitle}>Settings</Text>
        <View style={styles.card}>
          <View style={styles.rowWithControl}>
            <View style={styles.rowLeft}>
              <View style={[styles.iconBg, { backgroundColor: 'rgba(139, 92, 246, 0.12)' }]}>
                <Ionicons name="moon-outline" size={20} color="#8B5CF6" />
              </View>
              <View>
                <Text style={styles.rowLabel}>Dark Theme</Text>
                <Text style={styles.rowSubLabel}>Always display dark theme modes</Text>
              </View>
            </View>
            <Switch
              value={darkModeEnabled}
              onValueChange={(val) => setDarkModeEnabled(val)}
              trackColor={{ false: '#2D3139', true: '#6366F1' }}
              thumbColor={Platform.OS === 'ios' ? '#FFFFFF' : '#FFFFFF'}
            />
          </View>
          <View style={styles.separator} />
          <View style={styles.rowWithControl}>
            <View style={styles.rowLeft}>
              <View style={[styles.iconBg, { backgroundColor: 'rgba(139, 92, 246, 0.12)' }]}>
                <Ionicons name="notifications-outline" size={20} color="#8B5CF6" />
              </View>
              <View>
                <Text style={styles.rowLabel}>Push Notifications</Text>
                <Text style={styles.rowSubLabel}>Receive alerts for new messages</Text>
              </View>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={(val) => setNotificationsEnabled(val)}
              trackColor={{ false: '#2D3139', true: '#6366F1' }}
              thumbColor={Platform.OS === 'ios' ? '#FFFFFF' : '#FFFFFF'}
            />
          </View>
          <View style={styles.separator} />
          <View style={styles.rowWithControl}>
            <View style={styles.rowLeft}>
              <View style={[styles.iconBg, { backgroundColor: 'rgba(139, 92, 246, 0.12)' }]}>
                <Ionicons name="shield-checkmark-outline" size={20} color="#8B5CF6" />
              </View>
              <View>
                <Text style={styles.rowLabel}>Biometric Lock</Text>
                <Text style={styles.rowSubLabel}>Require FaceID or fingerprint unlock</Text>
              </View>
            </View>
            <Switch
              value={biometricsEnabled}
              onValueChange={(val) => setBiometricsEnabled(val)}
              trackColor={{ false: '#2D3139', true: '#6366F1' }}
              thumbColor={Platform.OS === 'ios' ? '#FFFFFF' : '#FFFFFF'}
            />
          </View>
          <View style={styles.separator} />
          <TouchableOpacity 
            activeOpacity={0.7} 
            onPress={() => Alert.alert('Support tickets and chat features are coming soon!')} 
            style={styles.rowInteractable}
          >
            <View style={styles.rowLeft}>
              <View style={[styles.iconBg, { backgroundColor: 'rgba(139, 92, 246, 0.12)' }]}>
                <Ionicons name="help-buoy-outline" size={20} color="#8B5CF6" />
              </View>
              <View>
                <Text style={styles.rowLabel}>Help & Feedback</Text>
                <Text style={styles.rowSubLabel}>Get help or request awesome features</Text>
              </View>
            </View>
            <View style={styles.moreBadge}>
              <Text style={styles.moreBadgeText}>Soon</Text>
            </View>
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
    borderColor: 'rgba(255, 255, 255, 0.06)',
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
  rowInteractable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  rowWithControl: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
    marginBottom: 2,
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
  rowSubLabel: {
    fontSize: 11,
    color: '#656A76',
  },
  moreBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  moreBadgeText: {
    color: '#8E9096',
    fontSize: 11,
    fontWeight: '600',
  },
})
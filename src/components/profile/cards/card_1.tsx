import { sendEmailVerify } from '@/functions/auth'
import { lightHaptic } from '@/functions/preferences'
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

export default function card_1({ profile, formatJoinedDate, copyUserId, copiedId }: any) {
  return (
    <>
        <Text style={styles.sectionTitle}>Account Details</Text>
        <View style={styles.card}>
        <View style={styles.row}>
            <View style={styles.rowLeft}>
            <View style={[styles.iconBg, { backgroundColor: 'rgba(99, 102, 241, 0.12)' }]}>
                <Ionicons name="person-outline" size={20} color="#6366F1" />
            </View>
            <View>
                <Text style={styles.rowLabel}>Full Name</Text>
                <Text style={styles.rowValue}>{profile.fullName}</Text>
            </View>
            </View>
        </View>
        <View style={styles.separator} />
        <TouchableOpacity style={styles.row} activeOpacity={0.7} onPress={profile.emailVerified ? () => {} : () => {sendEmailVerify(profile.email); lightHaptic();}}>
            <View style={styles.rowLeft}>
            <View style={[styles.iconBg, { backgroundColor: 'rgba(99, 102, 241, 0.12)' }]}>
                <Ionicons name="mail-outline" size={20} color="#6366F1" />
            </View>
            <View>
                <Text style={styles.rowLabel}>Email</Text>
                <Text style={styles.rowValue}>{profile.email}</Text>
            </View>
            </View>
            <View style={profile.emailVerified ? styles.badgeSuccess : styles.badgeDanger}>
                <Text style={profile.emailVerified ? styles.badgeText : styles.badgeTextDanger}>{profile.emailVerified ? "Verified" : "Unverified"}</Text>
            </View>
        </TouchableOpacity>
        <View style={styles.separator} />
        <View style={styles.row}>
            <View style={styles.rowLeft}>
            <View style={[styles.iconBg, { backgroundColor: 'rgba(99, 102, 241, 0.12)' }]}>
                <Ionicons name="call-outline" size={20} color="#6366F1" />
            </View>
            <View>
                <Text style={styles.rowLabel}>Phone Number</Text>
                <Text style={styles.rowValue}>{profile.phoneNumber}</Text>
            </View>
            </View>
        </View>
        <View style={styles.separator} />
        <View style={styles.row}>
            <View style={styles.rowLeft}>
            <View style={[styles.iconBg, { backgroundColor: 'rgba(99, 102, 241, 0.12)' }]}>
                <Ionicons name="calendar-outline" size={20} color="#6366F1" />
            </View>
            <View>
                <Text style={styles.rowLabel}>Member Since</Text>
                <Text style={styles.rowValue}>{formatJoinedDate(profile.createdAt)}</Text>
            </View>
            </View>
        </View>
        <View style={styles.separator} />
        <TouchableOpacity
            activeOpacity={0.7} 
            onPress={copyUserId} 
            style={styles.rowInteractable}
        >
            <View style={styles.rowLeft}>
            <View style={[styles.iconBg, { backgroundColor: 'rgba(99, 102, 241, 0.12)' }]}>
                <Ionicons name="finger-print-outline" size={20} color="#6366F1" />
            </View>
            <View style={{ maxWidth: '75%' }}>
                <Text style={styles.rowLabel}>User ID</Text>
                <Text style={styles.rowValueUid} numberOfLines={1}>
                {profile.uid || 'Fetching UID...'}
                </Text>
            </View>
            </View>
            <View style={styles.rowRightCopy}>
            <Ionicons 
                name={copiedId ? "checkmark-done-outline" : "copy-outline"} 
                size={18} 
                color={copiedId ? "#10B981" : "#8E9096"} 
            />
            <Text style={[styles.copyText, copiedId && { color: "#10B981" }]}>
                {copiedId ? "Copied" : "Copy"}
            </Text>
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
  rowValue: {
    fontSize: 15,
    color: '#F9FAFB',
    fontWeight: '600',
  },
  rowValueUid: {
    fontSize: 14,
    color: '#F9FAFB',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontWeight: '600',
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
  badgeSuccess: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  badgeDanger: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  badgeText: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '600',
  },
  badgeTextDanger: {
    color: '#EF4444',
    fontSize: 11,
    fontWeight: '600',
  },
  rowRightCopy: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  copyText: {
    color: '#8E9096',
    fontSize: 12,
    fontWeight: '600',
  },
})
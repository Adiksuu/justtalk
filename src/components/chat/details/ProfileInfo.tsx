import { View, Text } from 'react-native'
import React from 'react'
import Avatar from '../Avatar'
import { StyleSheet } from 'react-native'
import { timeAgo } from '@/functions/messages'

export default function ProfileInfo({ name, activeStatus }: { name: string, activeStatus: { state: string, lastSeen: number } | null }) {
  return (
    <View style={styles.profileSection}>
      <View style={styles.avatarContainer}>
        <Avatar fullName={name} size={92} fontSize={32} />
        <View style={activeStatus?.state === 'online' ? styles.onlineBadge : styles.offlineBadge} />
      </View>
      <Text style={styles.nameText}>{name}</Text>
      <Text style={styles.statusText}>
        {activeStatus?.state === 'online' ? 'Just now' : `last seen ${timeAgo(activeStatus?.lastSeen)}`}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
    profileSection: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 24,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#22C55E',
    borderWidth: 3,
    borderColor: '#16181D',
  },
  offlineBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#6B7280',
    borderWidth: 3,
    borderColor: '#16181D',
  },
  nameText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  statusText: {
    color: '#9CA3AF',
    fontSize: 14,
    marginTop: 4,
  },
})
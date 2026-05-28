import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { getInitials } from '@/functions/profile'
import { Ionicons } from '@expo/vector-icons'

export default function SearchResult({ uid, data, isSent, handleAddFriend }: { uid: string; data: any, isSent: boolean, handleAddFriend: (uid: string) => void }) {
  return (
    <View style={styles.resultItem}>
        <View style={styles.resultAvatar}>
          <Text style={styles.resultAvatarText}>
            {getInitials(data.fullName)}
          </Text>
        </View>
        <View style={styles.resultInfo}>
          <Text style={styles.resultUsername} numberOfLines={1}>
            {data.fullName}
          </Text>
          {data.fullName ? (
            <Text style={styles.resultFullName} numberOfLines={1}>
              {data.email}
            </Text>
          ) : null}
        </View>
        <TouchableOpacity
          style={[styles.addFriendBtn, isSent && styles.addFriendBtnSent]}
          activeOpacity={0.7}
          onPress={() => handleAddFriend(uid)}
          disabled={isSent}
        >
          <Ionicons
            name={isSent ? 'checkmark' : 'person-add-outline'}
            size={16}
            color={isSent ? '#34D399' : '#F9FAFB'}
          />
        </TouchableOpacity>
      </View>
  )
}

const styles = StyleSheet.create({
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 12,
  },
  resultAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#2D2F38',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultAvatarText: {
    color: '#F9FAFB',
    fontSize: 15,
    fontWeight: '700',
  },
  resultInfo: {
    flex: 1,
  },
  resultUsername: {
    color: '#F9FAFB',
    fontSize: 15,
    fontWeight: '600',
  },
  resultFullName: {
    color: '#9CA3AF',
    fontSize: 13,
    fontWeight: '400',
    marginTop: 1,
  },
  addFriendBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addFriendBtnSent: {
    backgroundColor: '#1C3D2A',
  },
})
import { View, Text, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import Avatar from '../Avatar'
import { StyleSheet } from 'react-native'
import { timeAgo } from '@/functions/messages'
import Feather from '@expo/vector-icons/Feather';
import { setFriendChatUsername } from '@/functions/friends'

export default function ProfileInfo({ name, activeStatus, friendId, chatId }: { name: string, activeStatus: { state: string, lastSeen: number } | null, friendId: string, chatId: string }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(name);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setEditedName(name);
  }, [name]);

  const handleSubmit = async () => {
    if (loading) return;
    const newFriendName = editedName;
    setLoading(true);
    const done = await setFriendChatUsername(friendId, chatId, newFriendName);
    setLoading(false);
    if (done) {
      setIsEditing(false);
    }
  };

  return (
    <View style={styles.profileSection}>
      <View style={styles.avatarContainer}>
        <Avatar fullName={name} size={92} fontSize={32} friendUID={friendId} />
        <View style={activeStatus?.state === 'online' ? styles.onlineBadge : styles.offlineBadge} />
      </View>
      {isEditing ? (
        <View style={styles.inputContainer}>
          {loading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <>
              <TextInput style={styles.nameInput} value={editedName} onChangeText={setEditedName} autoFocus onSubmitEditing={handleSubmit} onBlur={handleSubmit} returnKeyType="done" />
              <TouchableOpacity onPress={handleSubmit} style={styles.checkButton}>
                <Feather name="check" size={22} color="#10B981" />
              </TouchableOpacity>
            </>
          )}
        </View>
      ) : (
        <TouchableOpacity activeOpacity={0.8} onPress={() => setIsEditing(true)}>
          <Text style={styles.nameText}>{editedName || name} <Feather name="edit" size={20} color="white" /></Text>
        </TouchableOpacity>
      )}
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
    paddingHorizontal: 8,
    paddingVertical: 2,
    maxWidth: '80%',
  },
  nameInput: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 0.2,
    textAlign: 'center',
    minWidth: 120,
    padding: 0,
  },
  checkButton: {
    marginLeft: 8,
  },
  statusText: {
    color: '#9CA3AF',
    fontSize: 14,
    marginTop: 4,
  },
})
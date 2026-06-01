import { subscribeToUserActivity } from '@/functions/activity';
import { timeAgo } from '@/functions/messages';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {  StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Avatar from './Avatar';

export default function ChatHeader({ name, onBack, friendUID, onShowInfo }: { name: string; onBack: () => void; friendUID: string; onShowInfo?: () => void }) {
  const [activeStatus, setActiveStatus] = useState<{ state: string; lastSeen: number } | null>(null);

  useEffect(() => {
    if (!friendUID) return;

    const unsubscribe = subscribeToUserActivity(friendUID, (snapshot: any) => {
      if (!snapshot) return;

      setActiveStatus(snapshot);
    });

    return () => {
      unsubscribe();
    };
  }, [friendUID]);

  return (
    <View style={headerStyles.container}>
      <TouchableOpacity onPress={onBack} activeOpacity={0.7} style={headerStyles.backBtn}>
        <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
      </TouchableOpacity>

      <View style={headerStyles.avatarWrapper}>
        <Avatar fullName={name} friendUID={friendUID} />
        <View style={activeStatus?.state === 'online' ? headerStyles.onlineDot : headerStyles.offlineDot} />
      </View>

      <View style={headerStyles.info}>
        <Text style={headerStyles.name} numberOfLines={1}>
          {name}
        </Text>
        <Text style={headerStyles.status}>{activeStatus?.state === 'online' ? 'Just now' : `last seen ${timeAgo(activeStatus?.lastSeen)}`}</Text>
      </View>

      <View style={headerStyles.actions}>
        {/* <TouchableOpacity activeOpacity={0.7} style={headerStyles.actionBtn}>
          <Ionicons name="call-outline" size={20} color="#FFFFFF" />
        </TouchableOpacity> */}
        <TouchableOpacity onPress={onShowInfo} activeOpacity={0.7} style={headerStyles.actionBtn}>
          <Ionicons name="ellipsis-vertical" size={21} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const headerStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#16181D',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  backBtn: {
    padding: 6,
    marginRight: 4,
  },
  avatarWrapper: {
    borderRadius: 19,
    overflow: 'visible',
    marginRight: 10,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#22C55E',
    borderWidth: 2,
    borderColor: '#16181D',
  },
  offlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#6B7280',
    borderWidth: 2,
    borderColor: '#16181D',
  },
  info: {
    flex: 1,
    gap: 1,
  },
  name: {
    color: '#F9FAFB',
    fontSize: 16,
    fontWeight: '600',
  },
  status: {
    color: '#6B7280',
    fontSize: 12,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionBtn: {
    padding: 8,
  },
});
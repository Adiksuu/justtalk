import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Avatar from '../chat/Avatar';

interface ChatItemProps {
  name: string;
  lastMessage: string;
  time: string;
  unreadCount?: number;
  senderName?: string;
  onPress?: () => void;
}

export default function ChatItem({
  name,
  lastMessage,
  time,
  unreadCount,
  senderName,
  onPress,
}: ChatItemProps) {
  return (
    <TouchableOpacity activeOpacity={0.7} style={styles.container} onPress={onPress}>
      <Avatar fullName={name} size={54} fontSize={15} />
      <View style={styles.content}>
        <View style={styles.topRow}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>
              {name}
            </Text>
          </View>
          <Text style={styles.time}>{time}</Text>
        </View>
        <View style={styles.bottomRow}>
          <Text style={styles.messagePreview} numberOfLines={2}>
            {senderName ? (
              <Text>
                <Text style={styles.senderName}>{senderName}: </Text>
                {lastMessage}
              </Text>
            ) : (
              lastMessage
            )}
          </Text>
          <View style={styles.badgeArea}>
            {unreadCount ? (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>{unreadCount}</Text>
              </View>
            ) : null}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 14,
  },
  content: {
    flex: 1,
    gap: 4,
    justifyContent: 'center',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 4,
  },
  name: {
    color: '#F9FAFB',
    fontSize: 16,
    fontWeight: '600',
    flexShrink: 1,
  },
  icon: {
    marginLeft: 2,
  },
  time: {
    color: '#6B7280',
    fontSize: 12,
    marginLeft: 8,
    flexShrink: 0,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 8,
  },
  messagePreview: {
    color: '#9CA3AF',
    fontSize: 14,
    lineHeight: 19,
    flex: 1,
  },
  senderName: {
    color: '#B0B4BA',
    fontWeight: '500',
  },
  badgeArea: {
    flexShrink: 0,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 20,
    marginBottom: 2,
  },
  unreadBadge: {
    backgroundColor: '#6366F1',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
});

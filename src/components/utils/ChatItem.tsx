import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ChatItemProps {
  avatarUrl: string;
  name: string;
  lastMessage: string;
  time: string;
  unreadCount?: number;
  isMuted?: boolean;
  isPinned?: boolean;
  isGroup?: boolean;
  senderName?: string;
  onPress?: () => void;
}

export default function ChatItem({
  avatarUrl,
  name,
  lastMessage,
  time,
  unreadCount,
  isMuted = false,
  isPinned = false,
  isGroup = false,
  senderName,
  onPress,
}: ChatItemProps) {
  return (
    <TouchableOpacity activeOpacity={0.7} style={styles.container} onPress={onPress}>
      {/* Avatar */}
      <View style={styles.avatarWrapper}>
        <Image source={{ uri: avatarUrl }} style={styles.avatar} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Top row: name + time */}
        <View style={styles.topRow}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>
              {name}
            </Text>
            {isMuted && (
              <Ionicons
                name="volume-mute"
                size={13}
                color="#6B7280"
                style={styles.icon}
              />
            )}
          </View>
          <Text style={styles.time}>{time}</Text>
        </View>

        {/* Bottom row: message preview + unread / pin badge */}
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
            ) : isPinned ? (
              <Ionicons name="pin" size={14} color="#6B7280" style={{ transform: [{ rotate: '45deg' }] }} />
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
  avatarWrapper: {
    width: 54,
    height: 54,
    borderRadius: 27,
    overflow: 'hidden',
    backgroundColor: '#2A2D35',
    flexShrink: 0,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
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

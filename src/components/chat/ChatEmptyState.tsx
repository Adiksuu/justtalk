import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Avatar from './Avatar';

interface ChatEmptyStateProps {
  name: string;
  friendUID?: string;
}

export default function ChatEmptyState({ name, friendUID = '' }: ChatEmptyStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Avatar fullName={name} size={90} fontSize={24} friendUID={friendUID} />
        <View style={styles.iconBadge}>
          <Ionicons name="chatbubbles" size={16} color="#FFFFFF" />
        </View>
      </View>

      <Text style={styles.title}>Say hello to {name}!</Text>
      <Text style={styles.subtitle}>
        Your messages are end-to-end encrypted. No one outside of this chat can read them.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
    transform: [{ scaleY: -1 }], 
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: '#1E2028',
  },
  iconBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#6366F1',
    padding: 6,
    borderRadius: 14,
    borderWidth: 3,
    borderColor: '#16181D',
  },
  title: {
    color: '#F9FAFB',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    color: '#6B7280',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
});
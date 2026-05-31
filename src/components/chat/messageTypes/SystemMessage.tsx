import { Message } from '@/interfaces/Message';
import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { formatTime } from '@/functions/messages';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function SystemMessage({ message }: { message: Message }) {
  const { text, time } = message;

  return (
    <View style={[styles.absoluteWrapper, { transform: [{ scaleY: -1 }] }]}>
      <View style={styles.container}>
        <View style={styles.line} />
        <View style={styles.badge}>
          <Text style={styles.messageText}>
            {text} <Text style={styles.timeText}>{formatTime(time)}</Text>
          </Text>
        </View>
        <View style={styles.line} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  absoluteWrapper: {
    width: SCREEN_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    left: 0,
    right: 0,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    paddingHorizontal: 14,
    width: '100%',
  },
  line: {
    flex: 1,
    height: 2,
    backgroundColor: 'rgba(30, 32, 40, 0.6)',
  },
  badge: {
    backgroundColor: 'rgba(30, 32, 40, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginHorizontal: 10,
    maxWidth: '80%',
  },
  messageText: {
    color: '#9CA3AF',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  timeText: {
    fontSize: 10,
    color: '#6B7280',
  },
});
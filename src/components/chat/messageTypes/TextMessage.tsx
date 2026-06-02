import { Message } from '@/interfaces/Message';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import ReadReceipt from '../ReadReceipt';
import { formatTime } from '@/functions/messages';
import RenderReactions from '../RenderReactions';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const MAX_BUBBLE_WIDTH = SCREEN_WIDTH * 0.72;

export default function TextMessage({ message, chatTheme }: { message: Message, chatTheme: string }) {
  const { text, time, isSent, isRead, reactions } = message;

  const hasReactions = reactions && Object.keys(reactions).length > 0;

  return (
    <View style={[styles.row, isSent && styles.rowSent, { transform: [{ scaleY: -1 }] }]}>
      {isSent ? (
        <View style={[styles.bubbleWrapper, hasReactions && styles.containerWithReactions]}>
          <LinearGradient
            colors={[chatTheme[0], chatTheme[1]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.bubble, styles.bubbleSent]}
          >
            <Text style={[styles.messageText, styles.messageTextSent]}>
              {text}
            </Text>
            <View style={styles.metaRow}>
              <Text style={[styles.timeText, { color: 'rgba(255,255,255,0.6)' }]}>{formatTime(time)}</Text>
              <ReadReceipt isRead={isRead} />
            </View>
          </LinearGradient>
          <RenderReactions reactions={reactions} isSent={isSent} />
        </View>
      ) : (
        <View style={[styles.bubbleWrapper, hasReactions && styles.containerWithReactions]}>
          <View style={[styles.bubble, styles.bubbleReceived]}>
            <Text style={[styles.messageText, styles.messageTextReceived]}>
              {text}
            </Text>
            <View style={styles.metaRow}>
              <Text style={styles.timeText}>{formatTime(time)}</Text>
            </View>
          </View>
          <RenderReactions reactions={reactions} isSent={false} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginBottom: 6,
    paddingHorizontal: 14,
  },
  rowSent: {
    justifyContent: 'flex-end',
  },
  bubbleWrapper: {
    position: 'relative',
    maxWidth: MAX_BUBBLE_WIDTH,
  },
  containerWithReactions: {
    marginBottom: 10,
  },
  bubble: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 18,
  },
  bubbleSent: {
    borderBottomRightRadius: 4,
  },
  bubbleReceived: {
    backgroundColor: '#1E2028',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 21,
  },
  messageTextSent: {
    color: '#FFFFFF',
  },
  messageTextReceived: {
    color: '#E5E7EB',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 3,
    gap: 2,
  },
  timeText: {
    fontSize: 11,
    color: '#6B7280',
  },
});
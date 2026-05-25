import { Message } from '@/interfaces/Message';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import ReadReceipt from '../ReadReceipt';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const MAX_BUBBLE_WIDTH = SCREEN_WIDTH * 0.72;

export default function TextMessage({message}: {message: Message}) {
    const { text, time, isSent, isRead } = message;
    
  return (
      <View style={[bubbleStyles.row, isSent && bubbleStyles.rowSent]}>
        {isSent ? (
          <LinearGradient
            colors={['#7C3AED', '#6366F1']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[bubbleStyles.bubble, bubbleStyles.bubbleSent]}
          >
            <Text style={[bubbleStyles.messageText, bubbleStyles.messageTextSent]}>
              {text}
            </Text>
            <View style={bubbleStyles.metaRow}>
              <Text style={[bubbleStyles.timeText, { color: 'rgba(255,255,255,0.6)' }]}>{time}</Text>
              <ReadReceipt isRead={isRead} />
            </View>
          </LinearGradient>
        ) : (
          <View style={[bubbleStyles.bubble, bubbleStyles.bubbleReceived]}>
            <Text style={[bubbleStyles.messageText, bubbleStyles.messageTextReceived]}>
              {text}
            </Text>
            <View style={bubbleStyles.metaRow}>
              <Text style={bubbleStyles.timeText}>{time}</Text>
            </View>
          </View>
        )}
      </View>
    );
}

const bubbleStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginBottom: 6,
    paddingHorizontal: 14,
  },
  rowSent: {
    justifyContent: 'flex-end',
  },
  bubble: {
    maxWidth: MAX_BUBBLE_WIDTH,
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
import { Message } from '@/interfaces/Message';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import ReadReceipt from '../ReadReceipt';
import { formatTime } from '@/functions/messages';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const MAX_BUBBLE_WIDTH = SCREEN_WIDTH * 0.72;

export default function TextMessage({ message }: { message: Message }) {
  const { text, time, isSent, isRead, reactions } = message;

  const renderReactions = () => {
    if (!reactions || Object.keys(reactions).length === 0) return null;

    const allEmojis = Object.values(reactions) as string[];

    const emojiCounts = allEmojis.reduce((acc, emoji) => {
      acc[emoji] = (acc[emoji] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const uniqueEmojis = Object.keys(emojiCounts);

    return (
      <View style={[
        styles.reactionsContainer, 
        isSent ? styles.reactionsSent : styles.reactionsReceived
      ]}>
        {uniqueEmojis.map((emoji, index) => {
          const count = emojiCounts[emoji];
          
          return (
            <View key={index} style={styles.reactionBadge}>
              {count > 1 && (
                <Text style={styles.reactionCountText}>{count}</Text>
              )}
              <Text style={styles.reactionEmoji}>
                {emoji}
              </Text>
            </View>
          );
        })}
      </View>
    );
  };

  const hasReactions = reactions && Object.keys(reactions).length > 0;

  return (
    <View style={[styles.row, isSent && styles.rowSent, { transform: [{ scaleY: -1 }] }]}>
      {isSent ? (
        <View style={[styles.bubbleWrapper, hasReactions && styles.containerWithReactions]}>
          <LinearGradient
            colors={['#7C3AED', '#6366F1']}
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
          {renderReactions()}
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
          {renderReactions()}
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
  reactionsContainer: {
    position: 'absolute',
    bottom: -10,
    flexDirection: 'row',
    backgroundColor: '#272A35',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#0F1015',
    gap: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  reactionsSent: {
    left: 10,
  },
  reactionsReceived: {
    right: 10,
  },
  reactionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  reactionCountText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#9CA3AF',
  },
  reactionEmoji: {
    fontSize: 12,
  },
});
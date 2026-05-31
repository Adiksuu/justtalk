import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

export default function RenderReactions({ reactions, isSent }: { reactions: any, isSent: boolean }) {
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
}

const styles = StyleSheet.create({
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
})
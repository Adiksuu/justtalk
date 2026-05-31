import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';

export default function MessagePreview({ isSent, decryptedReplyText }: { isSent: boolean | undefined, decryptedReplyText: string | undefined }) {
  return (
      <View style={[
        styles.replyPreviewWrapper, 
        isSent ? styles.replyPreviewSent : styles.replyPreviewReceived
      ]}>
        <View style={styles.replyPreviewHeader}>
          <Ionicons name="arrow-undo" size={10} color="#6366F1" style={{ marginRight: 4 }} />
          <Text style={styles.replyPreviewTitle}>
            {isSent ? 'You replied' : 'Replied'}
          </Text>
        </View>
        <Text style={styles.replyPreviewText} numberOfLines={1}>
          {decryptedReplyText}
        </Text>
      </View>
    );
}

const styles = StyleSheet.create({
    replyPreviewWrapper: {
        backgroundColor: 'rgba(30, 32, 40, 0.4)',
        paddingHorizontal: 10,
        paddingVertical: 12,
        borderRadius: 14,
        marginBottom: -8,
        paddingBottom: 12,
        maxWidth: '72%',
        opacity: 0.85,
        transform: [{ scaleY: -1 }]
    },
    replyPreviewSent: {
        alignSelf: 'flex-end',
        marginRight: 14,
        borderBottomRightRadius: 4,
        backgroundColor: 'rgba(124, 58, 237, 0.2)',
    },
    replyPreviewReceived: {
        alignSelf: 'flex-start',
        marginLeft: 14,
        borderBottomLeftRadius: 4,
        backgroundColor: 'rgba(30, 32, 40, 0.6)',
    },
    replyPreviewHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2,
    },
    replyPreviewTitle: {
        fontSize: 10,
        fontWeight: '600',
        color: '#6366F1',
    },
    replyPreviewText: {
        fontSize: 12,
        color: '#9CA3AF',
    },
})
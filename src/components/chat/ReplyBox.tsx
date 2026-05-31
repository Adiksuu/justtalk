import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { Message } from '@/interfaces/Message'
import { decryptMessage } from '@/functions/crypto'

export default function ReplyBox({replyingTo, onCancelReply, chatId}: {replyingTo: Message, onCancelReply: () => void, chatId: string}) {
  return (
    <View style={inputStyles.replyContainer}>
        <Ionicons name="arrow-undo-outline" size={16} color="#6366F1" style={inputStyles.replyIcon} />
        <View style={inputStyles.replyTextContainer}>
        <Text style={inputStyles.replyTitle}>Replying to message</Text>
        <Text style={inputStyles.replyText} numberOfLines={1}>
            {replyingTo.type === 'image' ? '📷 Photo' : decryptMessage(replyingTo.text || '', chatId || '')}
        </Text>
        </View>
        <TouchableOpacity onPress={onCancelReply} style={inputStyles.cancelReplyBtn} activeOpacity={0.7}>
        <Ionicons name="close-circle" size={18} color="#6B7280" />
        </TouchableOpacity>
    </View>
  )
}

const inputStyles = StyleSheet.create({
  replyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 32, 40, 0.8)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
    marginBottom: 8,
    width: '100%',
  },
  replyIcon: {
    marginRight: 8,
  },
  replyTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  replyTitle: {
    color: '#6366F1',
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 1,
  },
  replyText: {
    color: '#9CA3AF',
    fontSize: 13,
  },
  cancelReplyBtn: {
    padding: 4,
    marginLeft: 8,
  },
});

import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { Message } from '@/interfaces/Message';
import { reactToMessage, removeMessage } from '@/functions/messages';
import { Ionicons } from '@expo/vector-icons';

interface ReactionMenuProps {
    message: Message;
    chatId: string;
    setShowMenu: (show: boolean) => void;
}

export default function ReactionMenu({ message, chatId, setShowMenu }: ReactionMenuProps) {
  return (
    <View style={{
        ...styles.menu,
        left: message.isSent ? undefined : 14,
        right: message.isSent ? 14 : undefined,
    }}>
        {message.isSent && <Text 
            style={{ fontSize: 20, marginRight: 10 }}
            onPress={async () => {
            await removeMessage(chatId || '', message.id);
            setShowMenu(false); 
            }}
        >
            <Ionicons name="trash" size={24} color="#E5E7EB" />
        </Text>}
        {['❤️', '😂', '😮', '😢', '🙏'].map((emoji) => (
        <Text 
            key={emoji} 
            style={{ fontSize: 20 }}
            onPress={async () => {
            await reactToMessage(chatId || '', message.id, emoji);
            setShowMenu(false); 
            }}
        >
            {emoji}
        </Text>
        ))}
    </View>
  )
}

const styles = StyleSheet.create({
    menu: {
        position: 'absolute',
        top: "100%",
        backgroundColor: '#272A35',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
        borderRadius: 20,
        gap: 10,
        elevation: 5,
        zIndex: 99999,
        transform: [{ scaleY: -1 }] 
    },
})
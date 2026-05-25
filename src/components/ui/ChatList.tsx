import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import ChatItem from '../utils/ChatItem';

export default function ChatList() {
    const router = useRouter();

    const CHATS = [
        {
            id: '1',
            name: 'Henry Kim',
            avatarUrl: 'https://i.pravatar.cc/150?img=33',
            lastMessage:
            '$1,350 per month. Utilities and one assigned parking spot in the garage ar...',
            time: '20:33',
            unreadCount: 1,
        },
        {
            id: '2',
            name: 'Team chat 🔕',
            avatarUrl: 'https://i.pravatar.cc/150?img=68',
            lastMessage: 'Any updates on this task? Please let me know if you need anythin...',
            time: '20:20',
            isMuted: true,
            isPinned: true,
            isGroup: true,
            senderName: 'Mira Vale',
        },
        {
            id: '3',
            name: 'Greta',
            avatarUrl: 'https://i.pravatar.cc/150?img=1',
            lastMessage: 'means a lot, thanks 🙌',
            time: '18:04',
        },
        {
            id: '4',
            name: 'Oliver Blake',
            avatarUrl: 'https://i.pravatar.cc/150?img=12',
            lastMessage: 'Sure, I will send over the files tomorrow morning.',
            time: '17:45',
        },
        {
            id: '5',
            name: 'Family 🏠',
            avatarUrl: 'https://i.pravatar.cc/150?img=44',
            lastMessage: 'Mom: Don\'t forget dinner this Sunday!',
            time: 'Yesterday',
            isGroup: true,
            senderName: 'Mom',
        },
        {
            id: '6',
            name: 'Mira Vale',
            avatarUrl: 'https://i.pravatar.cc/150?img=9',
            lastMessage: 'Got it. See you at the meeting.',
            time: 'Yesterday',
        },
        {
            id: '7',
            name: 'Book Club 📚',
            avatarUrl: 'https://i.pravatar.cc/150?img=60',
            lastMessage: 'Next book is "The Midnight Library" — starts Friday!',
            time: 'Mon',
            isGroup: true,
            senderName: 'Sarah',
            unreadCount: 4,
        },
    ];

  return (
    <FlatList
        data={CHATS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
        <ChatItem
            avatarUrl={item.avatarUrl}
            name={item.name}
            lastMessage={item.lastMessage}
            time={item.time}
            unreadCount={item.unreadCount}
            isMuted={item.isMuted}
            isPinned={item.isPinned}
            isGroup={item.isGroup}
            senderName={item.senderName}
            onPress={() => router.push({
                pathname: '/chat/[id]',
                params: { id: item.id, name: item.name, avatar: item.avatarUrl },
            })}
        />
        )}
        contentContainerStyle={styles.chatList}
        showsVerticalScrollIndicator={false}
    />
  )
}


const styles = StyleSheet.create({
    chatList: {
        paddingTop: 12,
        paddingBottom: 120,
    },
})
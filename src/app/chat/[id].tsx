import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import InputBar from '@/components/chat/InputBar';
import MessageBubble from '@/components/chat/MessageBubble';
import ChatHeader from '@/components/chat/ChatHeader';
import { Message } from '@/interfaces/Message';

const MESSAGES: Message[] = [
  {
    id: '1',
    type: 'text',
    text: 'day. Everything decent is either tiny or way over budget.',
    time: '20:09',
    isSent: false,
  },
  {
    id: '2',
    type: 'text',
    text: "It's close to the university, just a 10-minute walk through a nice park.",
    time: '20:12',
    isSent: false,
  },
  {
    id: '3',
    type: 'text',
    text: "But there's one place looks amazing",
    time: '20:20',
    isSent: false,
  },
  {
    id: '4',
    type: 'image',
    imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80',
    time: '20:20',
    isSent: false,
  },
  {
    id: '5',
    type: 'text',
    text: 'Love it 😍',
    time: '20:23',
    isSent: true,
    isRead: true,
  },
  {
    id: '6',
    type: 'text',
    text: 'The place looks very modern, with some really stylish furniture',
    time: '20:24',
    isSent: true,
    isRead: true,
  },
  {
    id: '7',
    type: 'text',
    text: 'Yeap',
    time: '20:28',
    isSent: false,
  },
  {
    id: '8',
    type: 'text',
    text: 'It was fully renovated last year 👆🧑‍🎨',
    time: '20:42',
    isSent: false,
  },
  {
    id: '9',
    type: 'text',
    text: "What's the monthly rent?",
    time: '20:44',
    isSent: true,
    isRead: true,
  },
  {
    id: '10',
    type: 'text',
    text: '$1,350 per month. Utilities and one assigned parking spot in the garage are included.',
    time: '20:45',
    isSent: false,
  },
];

export default function ChatScreen() {
  const router = useRouter();
  const { name, avatar } = useLocalSearchParams<{ id: string; name: string; avatar: string }>();

  return (
    <View style={styles.screen}>
      <SafeAreaView edges={['top']} style={{ backgroundColor: '#16181D' }}>
        <ChatHeader
          name={name || 'Chat'}
          avatarUrl={avatar || 'https://i.pravatar.cc/150?img=33'}
          onBack={() => router.back()}
        />
      </SafeAreaView>

        <FlatList
          data={MESSAGES}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <MessageBubble message={item} />}
          contentContainerStyle={styles.messageList}
          showsVerticalScrollIndicator={false}
        />

      <SafeAreaView edges={['bottom']} style={{ backgroundColor: '#16181D' }}>
        <InputBar />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  messageList: {
    paddingTop: 12,
    paddingBottom: 8,
  },
});

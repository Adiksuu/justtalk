import React, { useEffect, useState } from 'react';
import { StyleSheet, Platform, View } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { FlashList } from '@shopify/flash-list';

import InputBar from '@/components/chat/InputBar';
import MessageBubble from '@/components/chat/MessageBubble';
import ChatHeader from '@/components/chat/ChatHeader';
import { Message } from '@/interfaces/Message';
import { sendScreenshotNotificationMessage, subscribeToMessages } from '@/functions/messages';
import { setUserTyping, subscribeToTypingStatus } from '@/functions/activity';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as ScreenCapture from 'expo-screen-capture'

export default function ChatScreen() {
  const router = useRouter();
  const { id, name, avatar, friendUID } = useLocalSearchParams<{ id: string; name: string; avatar: string; friendUID: string }>();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [limit, setLimit] = useState(10);

  const [containerHeight, setContainerHeight] = useState(0);
  const [spacerHeight, setSpacerHeight] = useState(0);
  const [isFriendTyping, setIsFriendTyping] = useState(false);
  const [activeMenuMessageId, setActiveMenuMessageId] = useState<string | null>(null);

  ScreenCapture.useScreenshotListener(async () => {
    await sendScreenshotNotificationMessage(id || '');
  })

  useEffect(() => {
    if (!id) return;

    const unsubscribe = subscribeToMessages(id, limit, (data: Message[]) => {
      setMessages(data);
    });

    return () => unsubscribe();
  }, [id, limit]);

  const handleLoadMoreMessages = () => {
    setLimit((prevLimit) => prevLimit + 10);
  };

  useEffect(() => {
    return () => {
      if (id) setUserTyping(id, ""); 
    };
  }, [id]);

  useEffect(() => {
    if (!friendUID) return;

    const unsubscribe = subscribeToTypingStatus(id || '', friendUID || '', (data: boolean) => {
      setIsFriendTyping(data);
    });

    return () => unsubscribe();
  }, [id, friendUID]);

  return (
    <GestureHandlerRootView style={styles.outerContainer}>
      <Stack.Screen options={{ headerShown: false }} />

      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <SafeAreaView edges={['top']} style={{ backgroundColor: '#16181D' }}>
          <ChatHeader
            name={name || 'Chat'}
            avatarUrl={avatar || 'https://i.pravatar.cc/150?img=33'}
            onBack={() => router.back()}
            friendUID={friendUID}
          />
        </SafeAreaView>
        <View style={styles.listContainer} onLayout={(e) => setContainerHeight(e.nativeEvent.layout.height)}>
          <FlashList 
            data={messages}
            renderItem={({ item }) => (
                <View style={styles.invertedItem}>
                  <MessageBubble message={item} isMenuOpen={activeMenuMessageId === item.id} onToggleMenu={(open: boolean) => setActiveMenuMessageId(open ? item.id : null)} />
                </View>
            )}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            style={{ transform: [{ scaleY: -1 }] }}
            onEndReached={handleLoadMoreMessages}
            onEndReachedThreshold={0.2}
            ListHeaderComponent={<View style={{ height: spacerHeight }} />}
            onContentSizeChange={(w, h) => {
              const pureContentHeight = h - spacerHeight;
              const remainingSpace = containerHeight - pureContentHeight;
              const nextSpacerHeight = Math.max(0, remainingSpace);

              if (Math.abs(nextSpacerHeight - spacerHeight) > 1) {
                setSpacerHeight(nextSpacerHeight);
              }
            }}
          />
          {isFriendTyping ? (
            <MessageBubble message={{ type: 'typing', text: `${name} is typing...`, uid: '', id: 'typing', time: '',  }} isMenuOpen={false} onToggleMenu={() => {}} />
          ) : null}
        </View>
        <InputBar chatId={id || ''} friendUID={friendUID || ''} />
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#16181D',
  },
  screen: {
    flex: 1,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 12,
  },
  invertedItem: {
    paddingVertical: 4,
  },
  typingIndicator: {
    width: 60,
    height: 24,
    backgroundColor: '#272932',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 6,
    marginHorizontal: 10,
  },
});
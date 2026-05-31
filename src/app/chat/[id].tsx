import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Platform, View } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { FlashList } from '@shopify/flash-list'; // Upewnij się, że import jest poprawny

import InputBar from '@/components/chat/InputBar';
import MessageBubble from '@/components/chat/MessageBubble';
import ChatHeader from '@/components/chat/ChatHeader';
import { Message } from '@/interfaces/Message';
import { sendScreenshotNotificationMessage, subscribeToMessages } from '@/functions/messages';
import { setUserTyping, subscribeToTypingStatus } from '@/functions/activity';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as ScreenCapture from 'expo-screen-capture';
import ChatEmptyState from '@/components/chat/ChatEmptyState';

export default function ChatScreen() {
  const router = useRouter();
  const { id, name, avatar, friendUID } = useLocalSearchParams<{ id: string; name: string; avatar: string; friendUID: string }>();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [limit, setLimit] = useState(10);
  
  // Flagi blokujące zapętlanie
  const [hasMore, setHasMore] = useState(true);
  const isLoadingRef = useRef(false);

  const [containerHeight, setContainerHeight] = useState(0);
  const [spacerHeight, setSpacerHeight] = useState(0);
  const [isFriendTyping, setIsFriendTyping] = useState(false);
  const [activeMenuMessageId, setActiveMenuMessageId] = useState<string | null>(null);
  const [replyingToMessage, setReplyingToMessage] = useState<Message | null>(null);

  ScreenCapture.useScreenshotListener(async () => {
    await sendScreenshotNotificationMessage(id || '');
  });

  useEffect(() => {
    if (!id) return;

    isLoadingRef.current = true;
    const unsubscribe = subscribeToMessages(id, limit, (data: Message[]) => {
      // Jeśli baza zwróciła mniej wiadomości niż wynosi obecny limit,
      // oznacza to, że dotarliśmy do początku historii czatu.
      if (data.length < limit) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
      
      setMessages(data);
      isLoadingRef.current = false;
    });

    return () => unsubscribe();
  }, [id, limit]);

  const handleLoadMoreMessages = () => {
    // KLUCZOWE: Jeśli nie ma więcej wiadomości lub właśnie trwa ładowanie, przerywamy funkcję
    if (!hasMore || isLoadingRef.current) return;
    
    isLoadingRef.current = true;
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
            onBack={() => router.back()}
            friendUID={friendUID}
          />
        </SafeAreaView>
        
        <View style={styles.listContainer} onLayout={(e) => setContainerHeight(e.nativeEvent.layout.height)}>
          <FlashList 
            data={messages}
            renderItem={({ item }) => (
                <View style={styles.invertedItem}>
                  <MessageBubble 
                    message={item} 
                    isMenuOpen={activeMenuMessageId === item.id} 
                    onToggleMenu={(open: boolean) => setActiveMenuMessageId(open ? item.id : null)} 
                    setReplyingToMessage={setReplyingToMessage} 
                  />
                </View>
            )}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            style={{ transform: [{ scaleY: -1 }] }}
            onEndReached={handleLoadMoreMessages}
            onEndReachedThreshold={0.2}
            ListEmptyComponent={
              <ChatEmptyState name={name || 'User'} />
            }
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
            <View style={{ transform: [{ scaleY: -1 }], paddingBottom: 8 }}>
              <MessageBubble message={{ type: 'typing', text: `${name} is typing...`, uid: '', id: 'typing', time: '',  }} isMenuOpen={false} onToggleMenu={() => {}} setReplyingToMessage={setReplyingToMessage} />
            </View>
          ) : null}
        </View>
        <InputBar chatId={id || ''} friendUID={friendUID || ''} replyingTo={replyingToMessage} onCancelReply={() => setReplyingToMessage(null)} />
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
});
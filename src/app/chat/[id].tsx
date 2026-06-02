import React, { useEffect, useState, useRef } from 'react';
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
import { setUserReadMessages, setUserTyping, subscribeToTypingStatus, subscribeToUserReadTime, subscribeToUserActivity } from '@/functions/activity';
import ChatInfoSubscreen from '@/components/chat/ChatInfoSubscreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as ScreenCapture from 'expo-screen-capture';
import ChatEmptyState from '@/components/chat/ChatEmptyState';
import { handleScroll } from '@/functions/utility';
import ScrollToBottom from '@/components/chat/ScrollToBottom';
import { getDatabase, onValue, ref } from '@react-native-firebase/database';
import SystemMessage from '@/components/chat/messageTypes/SystemMessage';

export default function ChatScreen() {
  const router = useRouter();
  const { id, name, friendUID } = useLocalSearchParams<{ id: string; name: string; avatar: string; friendUID: string }>();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [limit, setLimit] = useState(10);
  
  const [hasMore, setHasMore] = useState(true);
  const isLoadingRef = useRef(false);

  const [containerHeight, setContainerHeight] = useState(0);
  const [spacerHeight, setSpacerHeight] = useState(0);
  const [isFriendTyping, setIsFriendTyping] = useState(false);
  const [friendReadTime, setFriendReadTime] = useState<number | null>(null);
  const [activeMenuMessageId, setActiveMenuMessageId] = useState<string | null>(null);
  const [replyingToMessage, setReplyingToMessage] = useState<Message | null>(null);

  const [infoVisible, setInfoVisible] = useState(false);
  const [activeStatus, setActiveStatus] = useState<{ state: string; lastSeen: number } | null>(null);

  const [showButton, setShowButton] = useState(false);
  const scrollViewRef = useRef(null); 
  const [chatName, setChatName] = useState(name);

  useEffect(() => {
        if (!id || !friendUID) return;

        const db = getDatabase();
        const usernameRef = ref(db, `chats/${id}/usernames/${friendUID}/chatUsername`);

        const unsubscribe = onValue(usernameRef, (snapshot) => {
            if (snapshot.exists()) {
                setChatName(snapshot.val());
            } else {
                setChatName(name);
            }
        });

        return () => unsubscribe();
    }, [id, friendUID]);

  useEffect(() => {
    if (!friendUID) return;

    const unsubscribe = subscribeToUserActivity(friendUID, (snapshot: any) => {
      if (!snapshot) return;
      setActiveStatus(snapshot);
    });

    return () => unsubscribe();
  }, [friendUID]);

  ScreenCapture.useScreenshotListener(async () => {
    await sendScreenshotNotificationMessage(id || '');
  });

  useEffect(() => {
    if (!id) return;

    isLoadingRef.current = true;
    const unsubscribe = subscribeToMessages(id, limit, (data: Message[]) => {
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
    if (id && messages.length > 0) {
      setUserReadMessages(id);
    }
  }, [id, messages]);

  useEffect(() => {
    if (!friendUID) return;

    const unsubscribeTyping = subscribeToTypingStatus(id || '', friendUID || '', (data: boolean) => {
      setIsFriendTyping(data);
    });

    const unsubscribeRead = subscribeToUserReadTime(id || '', friendUID, (time) => {
      setFriendReadTime(time);
    });

    return () => {
      unsubscribeTyping();
      unsubscribeRead();
    };
  }, [id, friendUID]);

  const processedMessages = React.useMemo(() => {
    return messages.map((msg) => {
      if (msg.isSent && friendReadTime && msg.time) {
        const msgTime = new Date(msg.time).getTime();
        if (!isNaN(msgTime) && msgTime <= friendReadTime) {
          return { ...msg, isRead: true };
        }
      }
      return msg;
    });
  }, [messages, friendReadTime]);

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
            name={chatName || 'Chat'}
            onBack={() => router.back()}
            friendUID={friendUID}
            onShowInfo={() => setInfoVisible(true)}
          />
        </SafeAreaView>
        
        <View style={styles.listContainer} onLayout={(e) => setContainerHeight(e.nativeEvent.layout.height)}>
          <FlashList 
            data={processedMessages}
            ref={scrollViewRef}
            scrollEventThrottle={16}
            onScroll={(e) => handleScroll(e, setShowButton)}
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
              <ChatEmptyState name={chatName || 'User'} friendUID={friendUID || ''} />
            }
            ListHeaderComponent={<View style={{ height: spacerHeight }} />}
            ListFooterComponentStyle={{ marginTop: 36 }}
            ListFooterComponent={processedMessages.length > 0 ? <SystemMessage message={{text: 'Messages in this chat are end-to-end encrypted.', time: ''}} /> : null}
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
              <MessageBubble message={{ type: 'typing', text: `${chatName} is typing...`, uid: '', id: 'typing', time: '',  }} isMenuOpen={false} onToggleMenu={() => {}} setReplyingToMessage={setReplyingToMessage} />
            </View>
          ) : null}
        </View>
        <ScrollToBottom showButton={showButton} scrollViewRef={scrollViewRef} />
        <InputBar chatId={id || ''} friendUID={friendUID || ''} replyingTo={replyingToMessage} onCancelReply={() => setReplyingToMessage(null)} />
      </KeyboardAvoidingView>

      {friendUID && (
        <ChatInfoSubscreen
          visible={infoVisible}
          onClose={() => setInfoVisible(false)}
          friendUID={friendUID}
          name={chatName || 'User'}
          chatId={id || ''}
          activeStatus={activeStatus}
          onFriendRemoved={() => {
            setInfoVisible(false);
            router.back();
          }}
        />
      )}
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
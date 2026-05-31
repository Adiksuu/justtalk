import React, { useMemo, useRef } from 'react';
import { Message } from '@/interfaces/Message';
import ImageMessage from './messageTypes/ImageMessage';
import TextMessage from './messageTypes/TextMessage';
import { useLocalSearchParams } from 'expo-router';
import { decryptMessage } from '@/functions/crypto';
import TypingMessage from './messageTypes/TypingMessage';
import { Gesture, GestureDetector, Swipeable } from 'react-native-gesture-handler';
import { reactToMessage } from '@/functions/messages';
import { StyleSheet, View } from 'react-native';
import ReactionMenu from './ReactionMenu';
import SystemMessage from './messageTypes/SystemMessage';
import { lightHaptic } from '@/functions/preferences';
import { Ionicons } from '@expo/vector-icons';
import MessagePreview from './MessagePreview';

export default function MessageBubble({ message, isMenuOpen, onToggleMenu, setReplyingToMessage }: { message: Message, isMenuOpen: boolean, onToggleMenu: (open: boolean) => void, setReplyingToMessage: (message: Message | null) => void }) {
  const { type, isSent } = message;
  const { id: chatId } = useLocalSearchParams<{ id: string }>();
  const swipeableRef = useRef<Swipeable>(null);

  const decryptedText = useMemo(() => {
    if (!chatId && type !== 'typing') return message.text;
    return decryptMessage(message.text || '', chatId);
  }, [message.text, chatId]);

  const decryptedReplyText = useMemo(() => {
    if (!message.replyingTo || !chatId) return message.replyingTo?.text;
    if (message.replyingTo.type === 'image') return '📷 Photo';
    return decryptMessage(message.replyingTo.text || '', chatId);
  }, [message.replyingTo, chatId]);

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .runOnJS(true)
    .onStart(async () => {
      if (type === 'system' || type === 'typing') return;
      lightHaptic()
      await reactToMessage(chatId || '', message.id, '❤️');
    });

  const longPress = Gesture.LongPress()
    .minDuration(500)
    .runOnJS(true)
    .onStart(() => {
      if (type === 'system' || type === 'typing') return;
      lightHaptic()
      onToggleMenu(!isMenuOpen);
    });

  const combinedGestures = Gesture.Race(doubleTap, longPress);

  const renderLeftActions = () => {
    return (
      <View style={styles.replyActionContainer}>
        <Ionicons name="arrow-undo-outline" size={20} color="#6366F1" />
      </View>
    );
  };

  const handleSwipeLeftOpen = () => {
    setReplyingToMessage({ ...message, text: decryptedText })
    lightHaptic();
    swipeableRef.current?.close();
  };

  const renderReplyPreview = () => {
    if (!message.replyingTo) return null;
    return <MessagePreview isSent={isSent} decryptedReplyText={decryptedReplyText} />
  };

  const renderMessageContent = () => {
    switch (type) {
      case 'image':
        return <ImageMessage message={message} />;
      case 'typing':
        return <TypingMessage message={message} />;
      case 'system':
        return <SystemMessage message={{ ...message, text: decryptedText }} />;
      default:
        return <TextMessage message={{ ...message, text: decryptedText }} />;
    }
  };

  if (type === 'typing' || type === 'system') {
    return renderMessageContent();
  }

  return (
    <View style={{ position: 'relative' }}>
      {renderReplyPreview()}
      
      {isMenuOpen && (
        <ReactionMenu message={message} chatId={chatId} setShowMenu={onToggleMenu} />
      )}

      <Swipeable
        ref={swipeableRef}
        renderLeftActions={renderLeftActions}
        onSwipeableWillOpen={handleSwipeLeftOpen}
        friction={2}
        overshootLeft={false}
      >
        <GestureDetector gesture={combinedGestures}>
          <View>
            {renderMessageContent()}
          </View>
        </GestureDetector>
      </Swipeable>
    </View>
  );
}

export const styles = StyleSheet.create({
  replyActionContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    paddingLeft: 10,
    transform: [{ scaleY: -1 }]
  },
});
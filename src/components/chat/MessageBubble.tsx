import React, { useMemo, useRef } from 'react';
import { Message } from '@/interfaces/Message';
import ImageMessage from './messageTypes/ImageMessage';
import TextMessage from './messageTypes/TextMessage';
import LinkPreviewMessage from './messageTypes/LinkPreviewMessage';
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
import VideoMessage from './messageTypes/VideoMessage';

export default function MessageBubble({ message, isMenuOpen, onToggleMenu, setReplyingToMessage, chatTheme }: { message: Message, isMenuOpen: boolean, onToggleMenu: (open: boolean) => void, setReplyingToMessage: (message: Message | null) => void, chatTheme: string }) {
  const { type, isSent, isRemoved } = message;
  const { id: chatId } = useLocalSearchParams<{ id: string }>();
  const swipeableRef = useRef<Swipeable>(null);

  const decryptedText = useMemo(() => {
    if (!chatId && type !== 'typing') return message.text;
    return decryptMessage(message.text || '', chatId);
  }, [message.text, chatId]);
  
  const decryptedMedia = useMemo(() => {
    if (!chatId && type !== 'typing') return message.media;
    return decryptMessage(message.media || '', chatId);
  }, [message.media, chatId]);

  const decryptedReplyText = useMemo(() => {
    if (!message.replyingTo || !chatId) return message.replyingTo?.text;
    if (message.replyingTo.type === 'image' || message.replyingTo.type === 'video') return `${message.replyingTo.media ? 'Photo' : 'Video'}`;
    return decryptMessage(message.replyingTo.text || '', chatId);
  }, [message.replyingTo, chatId]);

  const doubleTap = Gesture.Tap().numberOfTaps(2).runOnJS(true).onStart(async () => {
      if (type === 'system' || type === 'typing' || isRemoved) return;
      lightHaptic()
      await reactToMessage(chatId || '', message.id, '❤️');
  });

  const longPress = Gesture.LongPress().minDuration(500).runOnJS(true).onStart(() => {
      if (type === 'system' || type === 'typing' || isRemoved) return;
      lightHaptic()
      onToggleMenu(!isMenuOpen);
  });

  const combinedGestures = Gesture.Race(doubleTap, longPress);

  const renderLeftActions = () => {
    return (
      <View style={styles.replyActionContainer}>
        <Ionicons name="arrow-undo-outline" size={20} color={chatTheme[0]} />
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
    return <MessagePreview isSent={isSent} decryptedReplyText={decryptedReplyText} chatTheme={chatTheme} />
  };

  const renderMessageContent = () => {
    if (message.isRemoved) {
      return <SystemMessage message={{ ...message, text: 'Message removed' }} />;
    }
    switch (type) {
      case 'image':
        return <ImageMessage message={{ ...message, media: decryptedMedia }} />;
      case 'video':
        return <VideoMessage message={{ ...message, media: decryptedMedia }} />;
      case 'typing':
        return <TypingMessage message={message} chatTheme={chatTheme} />;
      case 'system':
        return <SystemMessage message={{ ...message, text: decryptedText }} />;
      default:
        const hasUrl = decryptedText && /https?:\/\/[^\s]+/i.test(decryptedText);
        if (hasUrl) {
          return <LinkPreviewMessage message={{ ...message, text: decryptedText }} chatTheme={chatTheme} />;
        }
        return <TextMessage message={{ ...message, text: decryptedText}} chatTheme={chatTheme} />;
    }
  };

  if (type === 'typing' || type === 'system' || isRemoved) {
    return renderMessageContent();
  }

  return (
    <View style={{ position: 'relative' }}>
      {renderReplyPreview()}
      
      {isMenuOpen && (
        <ReactionMenu 
          message={message} 
          chatId={chatId} 
          setShowMenu={onToggleMenu} 
          setReplyingToMessage={setReplyingToMessage}
        />
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
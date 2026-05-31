import React, { useMemo, useState } from 'react'; // Dodano useState
import { Message } from '@/interfaces/Message';
import ImageMessage from './messageTypes/ImageMessage';
import TextMessage from './messageTypes/TextMessage';
import { useLocalSearchParams } from 'expo-router';
import { decryptMessage } from '@/functions/crypto';
import TypingMessage from './messageTypes/TypingMessage';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { reactToMessage } from '@/functions/messages';
import { View } from 'react-native'; 
import ReactionMenu from './ReactionMenu';
import SystemMessage from './messageTypes/SystemMessage';

export default function MessageBubble({ message, isMenuOpen, onToggleMenu }: { message: Message, isMenuOpen: boolean, onToggleMenu: (open: boolean) => void }) {
  const { type } = message;
  const { id: chatId } = useLocalSearchParams<{ id: string }>();

  const decryptedText = useMemo(() => {
    if (!chatId && type !== 'typing') return message.text;
    return decryptMessage(message.text || '', chatId);
  }, [message.text, chatId]);

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .runOnJS(true)
    .onStart(async () => {
      if (type === 'system' || type === 'typing') return;
      await reactToMessage(chatId || '', message.id, '❤️');
    });

  const longPress = Gesture.LongPress()
    .minDuration(500)
    .runOnJS(true)
    .onStart(() => {
      if (type === 'system' || type === 'typing') return;
      onToggleMenu(!isMenuOpen);
    });

  const combinedGestures = Gesture.Race(doubleTap, longPress);

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

  if (type === 'typing') {
    return renderMessageContent();
  }

  return (
    <View style={{ position: 'relative' }}>
      <GestureDetector gesture={combinedGestures}>
        <View>
          {renderMessageContent()}
        </View>
      </GestureDetector>
      {isMenuOpen && (
        <ReactionMenu message={message} chatId={chatId} setShowMenu={onToggleMenu} />
      )}
    </View>
  );
}
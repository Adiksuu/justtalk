import React, { useMemo } from 'react'
import { Message } from '@/interfaces/Message'
import ImageMessage from './messageTypes/ImageMessage';
import TextMessage from './messageTypes/TextMessage';
import { useLocalSearchParams } from 'expo-router';
import { decryptMessage } from '@/functions/crypto';

export default function MessageBubble({message}: {message: Message}) {
  const { type } = message;
  const { id: chatId } = useLocalSearchParams<{ id: string }>();

  const decryptedText = useMemo(() => {
    if (!chatId) return message.text;
    return decryptMessage(message.text || '', chatId);
  }, [message.text, chatId]);

  switch (type) {
    case 'image':
      return <ImageMessage message={message} />
    default:
      return <TextMessage message={{...message, text: decryptedText}} />
  }
}
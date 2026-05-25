import React from 'react'
import { Message } from '@/interfaces/Message'
import ImageMessage from './messageTypes/ImageMessage';
import TextMessage from './messageTypes/TextMessage';

export default function MessageBubble({message}: {message: Message}) {
  const { type, text, imageUrl, time, isSent, isRead } = message;

  switch (type) {
    case 'image':
      return <ImageMessage message={message} />
    default:
      return <TextMessage message={message} />
  }
}
export interface Message {
  id: string;
  uid: string;
  type: MessageType;
  text?: string;
  imageUrl?: string;
  time: string;
  isSent?: boolean;
  isRead?: boolean;
  reaction?: string;
}


export type MessageType = 'text' | 'image' | 'typing';

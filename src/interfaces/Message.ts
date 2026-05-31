export interface Message {
  id: string;
  uid: string;
  type: MessageType;
  text?: string;
  media?: string;
  time: string;
  isSent?: boolean;
  isRead?: boolean;
  reactions?: { [key: string]: string };
  replyingTo?: Message;
}


export type MessageType = 'text' | 'image' | 'video' | 'typing' | 'system';

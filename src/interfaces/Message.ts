export interface Message {
  id: string;
  uid: string;
  type: MessageType;
  text?: string;
  imageUrl?: string;
  time: string;
  isSent?: boolean;
  isRead?: boolean;
  reactions?: { [key: string]: string };
}


export type MessageType = 'text' | 'image' | 'typing' | 'system';

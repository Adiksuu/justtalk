export interface Message {
  id?: string | any;
  uid?: string;
  type?: MessageType;
  text?: string;
  media?: string;
  time: string;
  isSent?: boolean;
  isRead?: boolean;
  isRemoved?: boolean;
  reactions?: { [key: string]: string };
  replyingTo?: Message;
}


export type MessageType = 'text' | 'image' | 'video' | 'typing' | 'system';

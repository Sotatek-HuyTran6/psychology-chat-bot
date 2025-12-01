export interface MessagePair {
  id: string;
  query: string;
  response: string | null;
  timestamp: number;
  conversationId: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: MessagePair[];
  createdAt: number;
  updatedAt: number;
}

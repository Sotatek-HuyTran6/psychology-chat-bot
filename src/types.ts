import type { ColumnType } from 'antd/es/table';

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

export interface Note {
  id: number;
  time: string;
  content: string;
  importance: 'low' | 'medium' | 'high' | 'critical';
  userId: number;
  createdAt: string;
  updatedAt: string;
  isAiGenerated: boolean;
}

export interface CreateNotePayload {
  time: string;
  content: string;
  importance: 'low' | 'medium' | 'high' | 'critical';
}

export interface UpdateNotePayload {
  time?: string;
  content?: string;
  importance?: 'low' | 'medium' | 'high' | 'critical';
}

export interface Test {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTestPayload {
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
}

export interface UpdateTestPayload {
  title?: string;
  description?: string;
  status?: 'pending' | 'in-progress' | 'completed' | 'failed';
}

export type ColumnsTypeExtend<T> = (ColumnType<T> & { sort?: boolean })[];

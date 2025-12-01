import { useEffect, useState } from 'react';
import type { Conversation, MessagePair } from '../types';

const STORAGE_KEY = 'chatbot_conversations';

const createNewConversation = (): Conversation => {
  const now = Date.now();
  return {
    id: `conv_${now}`,
    title: 'New Chat',
    messages: [],
    createdAt: now,
    updatedAt: now,
  };
};

export const useConversations = () => {
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return [];
  });

  const [temporaryConversation, setTemporaryConversation] = useState<Conversation | null>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored || JSON.parse(stored).length === 0) {
      return createNewConversation();
    }
    return null;
  });

  const [currentConversationId, setCurrentConversationId] = useState<string | null>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.length > 0 ? parsed[0].id : null;
    }
    const tempConv = createNewConversation();
    return tempConv.id;
  });

  // Save to localStorage whenever conversations change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations ?? []));
  }, [conversations]);

  const createTemporaryConversation = () => {
    const newConv = createNewConversation();
    setTemporaryConversation(newConv);
    setCurrentConversationId(newConv.id);
  };

  const addConversation = () => {
    createTemporaryConversation();
  };

  const deleteConversation = (id: string) => {
    setConversations((prev) => {
      const filtered = prev.filter((conv) => conv.id !== id);
      if (currentConversationId === id) {
        addConversation();
      }
      return filtered;
    });
  };

  const addMessagePair = (conversationId: string | null, query: string) => {
    if (temporaryConversation && (temporaryConversation.id === conversationId || !conversationId)) {
      const messagePair: MessagePair = {
        id: `msg_${Date.now()}`,
        query,
        response: null,
        timestamp: Date.now(),
        conversationId: temporaryConversation.id,
      };

      const updatedMessages = [...temporaryConversation.messages, messagePair];
      const title = query.slice(0, 30) + (query.length > 30 ? '...' : '');
      const newConv: Conversation = {
        ...temporaryConversation,
        messages: updatedMessages,
        title,
        updatedAt: Date.now(),
      };
      setConversations((prev) => [newConv, ...prev]);
      setTemporaryConversation(null);
      setCurrentConversationId(newConv.id);
    } else {
      const messagePair: MessagePair = {
        id: `msg_${Date.now()}`,
        query,
        response: null,
        timestamp: Date.now(),
        conversationId: conversationId!,
      };
      setConversations((prev) =>
        prev.map((conv) => {
          if (conv.id === conversationId) {
            const updatedMessages = [...conv.messages, messagePair];
            return {
              ...conv,
              messages: updatedMessages,
              updatedAt: Date.now(),
            };
          }
          return conv;
        }),
      );
    }
  };

  const getCurrentConversation = (): Conversation | undefined => {
    if (temporaryConversation && temporaryConversation.id === currentConversationId) {
      return temporaryConversation;
    }
    return conversations.find((conv) => conv.id === currentConversationId);
  };

  const currentConversation = getCurrentConversation();

  const handleGetBotResponse = (data: {
    response: string;
    conversationId: string;
    messageId: string;
  }) => {
    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === data.conversationId) {
          const updatedMessages = conv.messages.map((msg) => {
            if (msg.id === data.messageId) {
              return { ...msg, response: data.response };
            }
            return msg;
          });
          return {
            ...conv,
            messages: updatedMessages,
            updatedAt: Date.now(),
          };
        }
        return conv;
      }),
    );
  };

  return {
    conversations,
    currentConversationId,
    currentConversation,
    setCurrentConversationId,
    addConversation,
    deleteConversation,
    addMessagePair,
    handleGetBotResponse,
  };
};

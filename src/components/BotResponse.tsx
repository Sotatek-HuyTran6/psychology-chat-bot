import { RobotOutlined } from '@ant-design/icons';
import { Avatar, Spin } from 'antd';
import { marked } from 'marked';
import { useEffect, useState } from 'react';
import type { MessagePair } from '../types';

const PROXY_SERVER_URL = 'https://chatbot-reverse-proxy.onrender.com/api/chat';

interface BotResponseProps {
  messagePair: MessagePair;
  onGetBotResponse: (v: { response: string; conversationId: string; messageId: string }) => void;
  scrollToBottom?: () => void;
}

export const BotResponse = ({
  messagePair,
  onGetBotResponse,
  scrollToBottom,
}: BotResponseProps) => {
  const [botText, setBotText] = useState<string | null | undefined>(messagePair.response || null);
  const [previousLength, setPreviousLength] = useState(0);

  const sendQueryToBot = async (query: string) => {
    let result = '';

    const response = await fetch(PROXY_SERVER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Connection: 'keep-alive',
      },
      body: new URLSearchParams({ query }),
    });

    if (!response.ok || !response.body) {
      throw new Error('Failed to fetch from proxy server');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6).trim();

          if (data === '[DONE]') {
            break;
          }

          try {
            const parsed = JSON.parse(data);
            const text = parsed.text || '';
            result += text;

            setBotText((prev) => {
              const newText = prev ? (prev ?? '') + text : text;
              setPreviousLength(prev?.length || 0);
              return newText;
            });
          } catch (e) {
            console.error('Failed to parse SSE data:', e);
          }
        }
      }
    }

    return result || '';
  };

  useEffect(() => {
    if (!messagePair.response) {
      sendQueryToBot(messagePair.query).then((botResponse) => {
        onGetBotResponse?.({
          response: botResponse,
          conversationId: messagePair.conversationId,
          messageId: messagePair.id,
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (botText !== null && botText !== undefined) {
      scrollToBottom?.();
    }
  }, [botText, scrollToBottom]);

  const oldText = botText?.slice(0, previousLength) ?? '';
  const newText = botText?.slice(previousLength) ?? '';

  return (
    <div className="flex gap-3 justify-start">
      <Avatar icon={<RobotOutlined />} className="bg-blue-500 shrink-0" />
      <div className="max-w-[70%] rounded-lg px-4 py-3 text-gray-900">
        <div className="whitespace-pre-wrap wrap-break-word">
          {botText === null ? (
            <Spin size="small" />
          ) : (
            <div className="whitespace-pre-wrap wrap-break-word">
              <span dangerouslySetInnerHTML={{ __html: marked.parse(oldText) }} />
              <span
                key={botText}
                style={{ animation: 'fade-up 400ms ease-in-out' }}
                dangerouslySetInnerHTML={{ __html: marked.parse(newText) }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

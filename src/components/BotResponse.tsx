import { RobotOutlined } from '@ant-design/icons';
import { GoogleGenAI } from '@google/genai';
import { Avatar, Spin } from 'antd';
import { marked } from 'marked';
import { useEffect, useState } from 'react';
import type { MessagePair } from '../types';

const GEMINI_API_KEY = 'AIzaSyB2mAxah1Rj255LfSd9OsYkvJjgsiEaHRM';

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

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
    const response = await ai.models.generateContentStream({
      model: 'gemini-2.5-flash',
      contents: query,
    });

    for await (const chunk of response) {
      result += chunk.text;
      setBotText((prev) => {
        const newText = prev ? (prev ?? '') + chunk.text : chunk.text;
        setPreviousLength(prev?.length || 0);
        return newText;
      });
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

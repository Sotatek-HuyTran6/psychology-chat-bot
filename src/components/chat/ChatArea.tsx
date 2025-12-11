import { BotResponse } from '@/components/chat/BotResponse';
import { MyResponse } from '@/components/chat/MyResponse';
import {
  EMO_STATE,
  getBorderColorByState,
  getEmojiByState,
  getShadowColorByState,
} from '@/constant';
import { useChatScroll } from '@/hooks/useChatScroll';
import { useMentalHealthStore } from '@/stores/mentalHealthStore';
import type { MessagePair } from '@/types';
import { RobotOutlined } from '@ant-design/icons';
import { Button, Input } from 'antd';
import React, { useMemo, useRef, useState } from 'react';
import { FaArrowRight } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';

const { TextArea } = Input;

export const QUICK_QUESTIONS = [
  { title: 'Mình cảm thấy căng thẳng quá, không ngủ được vì sợ điểm thấp, phải làm sao?' },
  { title: 'Mình hay mất tập trung khi học, cứ nghĩ về thi cử, làm sao tập trung lại?' },
  { title: 'Mình sợ mình sẽ không đậu, áp lực từ gia đình quá nặng.' },
  { title: 'Mình hay so sánh bản thân với bạn bè, cảm thấy tự ti.' },
  { title: 'Mình không biết mình thích gì, chọn ngành nào phù hợp?' },
  { title: 'Mình có nên thi đại học hay đi học nghề?' },
  { title: 'Nếu không đậu đại học, mình sẽ thất bại cả đời à?' },
  { title: 'Mình thích vẽ/muốn làm game nhưng bố mẹ bảo chọn ngành y/dược.' },
  { title: 'Mình và bạn thân cãi nhau, cảm thấy cô đơn và mất động lực học.' },
  { title: 'Mình bị bạn bè bắt nạt, phải làm sao?' },
  { title: 'Mình thích một bạn nhưng ngại bày tỏ, cảm thấy áp lực tâm lý.' },
];

interface ChatAreaProps {
  messages: MessagePair[];
  onSendMessage: (query: string) => void;
  onGetBotResponse: (v: { response: string; conversationId: string; messageId: string }) => void;
  changeTab: (v: '' | 'evaluation') => void;
}

export const ChatArea = ({
  messages,
  onSendMessage,
  onGetBotResponse,
  changeTab,
}: ChatAreaProps) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mentalHealthEvaluation = useMentalHealthStore((state) => state.evaluation);
  const navigate = useNavigate();

  const isLoading = useMemo(() => {
    return messages.length > 0 && messages[messages.length - 1].response === null;
  }, [messages]);

  const borderColorClass = useMemo(
    () => getBorderColorByState(mentalHealthEvaluation?.emotion_state as EMO_STATE),
    [mentalHealthEvaluation],
  );
  const currentEmoji = useMemo(
    () => getEmojiByState(mentalHealthEvaluation?.emotion_state as EMO_STATE),
    [mentalHealthEvaluation],
  );
  const shadowColorValue = useMemo(
    () => getShadowColorByState(mentalHealthEvaluation?.emotion_state as EMO_STATE),
    [mentalHealthEvaluation],
  );

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userQuery = input.trim();
    setInput('');

    onSendMessage(userQuery);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const randomQuestions = useMemo(() => {
    const count = 4;
    const result: typeof QUICK_QUESTIONS = [];
    const usedIndexes = new Set<number>();

    while (result.length < count) {
      const idx = Math.floor(Math.random() * QUICK_QUESTIONS.length);
      if (!usedIndexes.has(idx)) {
        usedIndexes.add(idx);
        result.push(QUICK_QUESTIONS[idx]);
      }
    }

    return result;
  }, []);

  const {
    containerRef,
    bottomRef,
    handleScroll,
    scrollToBottom,
  } = useChatScroll(messages, false);

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-64px)] bg-[#f3efda]">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 pt-16 md:pt-6"
        ref={containerRef}
        onScroll={handleScroll}
      >
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-[#3b142a]">
            <div className="text-center">
              <RobotOutlined className="text-6xl mb-4" />
              <p className="text-[24px] font-semibold">Bắt đầu cuộc trò chuyện mới</p>
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-4">
            {messages.map((messagePair) => (
              <div key={messagePair.id} className="space-y-4">
                {/* User Query */}
                <MyResponse messagePair={messagePair} />
                {/* Bot Response */}
                <BotResponse
                  messagePair={messagePair}
                  onGetBotResponse={onGetBotResponse}
                  scrollToBottom={() => scrollToBottom()}
                />
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
        {/* Bottom message */}
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="bg-[#f3efda] pb-4 px-4 md:pb-16">
        {!messages.length ? (
          <div className="w-full max-w-3xl mx-auto mb-4">
            {randomQuestions?.map((question, index) => {
              return (
                <Button
                  style={{
                    animation: `fade-in ${300 + index * 150}ms ease-in-out`,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'normal',
                    textAlign: 'left',
                  }}
                  key={index}
                  type="dashed"
                  className="!text-[#f3efda] !text-[13px] md:!text-[16px] !w-full !mb-4 !h-[52px] md:!h-[72px] !bg-[#52293f] !font-semibold hover:translate-y-[-8px]"
                  onClick={() => onSendMessage(question.title)}
                >
                  {question.title}
                </Button>
              );
            })}
          </div>
        ) : null}
        <div
          className={`max-w-3xl mx-auto border-2 ${borderColorClass} rounded-2xl p-2 transition-all duration-300 relative bg-white`}
          style={{
            boxShadow: `${shadowColorValue} 0px 8px 24px`,
            background: isLoading ? 'bg-[#0000000A]' : 'trasparent',
          }}
        >
          <div
            className="absolute top-[-20px] right-[0px] text-4xl z-10 select-none cursor-pointer"
            onClick={() => navigate('/mental-health')}
          >
            {currentEmoji}
          </div>
          <div className="flex gap-2 items-end">
            <TextArea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Nhập câu hỏi của bạn..."
              autoSize={{ minRows: 2, maxRows: 6 }}
              className="flex-1 !border-none !outline-none !shadow-none text-[14px]! md:text-[18px]! bg-transparent! pr-10"
              disabled={isLoading}
            />

            <div
              onClick={handleSend}
              className="relative cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width={46} viewBox="0 0 52 50" fill="none"><path d="M6.80009 0.648197L45.4022 0.648214C49.0461 0.648215 52 3.60214 52 7.24599L52 42.874C52 46.5178 49.0461 49.4718 45.4022 49.4718L16.2333 49.4718C13.2398 49.4718 10.6215 47.4565 9.85529 44.5627L0.422082 8.93468C-0.68621 4.74881 2.46998 0.648195 6.80009 0.648197Z" fill='#e972be'></path></svg>
              <div className={`absolute inset-0 flex items-center justify-center text-white transition-transform duration-300`}>
                <FaArrowRight />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

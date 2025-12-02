import { RobotOutlined, SendOutlined } from '@ant-design/icons';
import { Button, Input } from 'antd';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { MessagePair } from '../types';
import { BotResponse } from './BotResponse';
import { MyResponse } from './MyResponse';
import RippleButton from './RippleButton';

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
  { title: 'Mình hay tự trách bản thân, cảm thấy vô dụng, không biết làm sao thay đổi.' },
  { title: 'Mình hay mất hứng, chán nản khi nhìn bạn bè tiến bộ.' },
  { title: 'Mình không biết cách quản lý stress hoặc thất vọng sau những kết quả kém.' },
  { title: 'Mình cảm thấy mệt mỏi vì phải học quá nhiều môn cùng lúc.' },
  { title: 'Mình thường trì hoãn việc học, đến sát ngày thi mới bắt đầu ôn.' },
  { title: 'Mình sợ trả lời sai trong các buổi kiểm tra hoặc thuyết trình.' },
  { title: 'Mình cảm thấy áp lực vì gia đình kỳ vọng quá cao.' },
  { title: 'Mình không biết cách đặt mục tiêu học tập hợp lý.' },
  { title: 'Mình bị mất động lực học khi thấy đề thi quá khó.' },
  { title: 'Mình lo lắng khi phải chọn ngành nghề mà mình chưa hiểu rõ.' },
  { title: 'Mình sợ sẽ hối hận nếu chọn sai ngành đại học.' },
  { title: 'Mình cảm thấy cô đơn khi không ai chia sẻ áp lực với mình.' },
  { title: 'Mình thường giấu cảm xúc, không biết tâm sự với ai.' },
  { title: 'Mình hay bị áp lực từ mạng xã hội và so sánh bản thân với người khác.' },
  { title: 'Mình không biết cách cân bằng giữa học và nghỉ ngơi.' },
  { title: 'Mình sợ bị thất bại, nên không dám thử những điều mới.' },
  { title: 'Mình hay căng thẳng trước mỗi bài kiểm tra lớn.' },
  { title: 'Mình cảm thấy lo lắng về tương lai sau khi tốt nghiệp.' },
  { title: 'Mình muốn tham gia hoạt động ngoại khóa nhưng sợ ảnh hưởng điểm số.' },
  { title: 'Mình thấy áp lực khi phải chuẩn bị hồ sơ thi đại học.' },
  { title: 'Mình sợ bố mẹ thất vọng nếu kết quả thi không như mong đợi.' },
  { title: 'Mình không biết cách quản lý thời gian để học hiệu quả.' },
  { title: 'Mình lo lắng về các mối quan hệ bạn bè khi sắp rời trường.' },
  { title: 'Mình cảm thấy mệt mỏi, chán nản, không muốn học gì cả.' },
  { title: 'Mình không biết cách giải tỏa căng thẳng khi áp lực học tập quá lớn.' },
  { title: 'Mình sợ mình sẽ mất định hướng nếu không thi đỗ đại học.' },
  { title: 'Mình không biết hỏi ai về vấn đề tâm lý hoặc định hướng nghề nghiệp.' },
  { title: 'Mình hay tự nghi ngờ khả năng của bản thân.' },
  { title: 'Mình sợ khi nhìn thấy điểm số của bạn bè cao hơn mình.' },
  { title: 'Mình muốn giảm áp lực nhưng không biết bắt đầu từ đâu.' },
];

interface ChatAreaProps {
  messages: MessagePair[];
  onSendMessage: (query: string) => void;
  onGetBotResponse: (v: { response: string; conversationId: string; messageId: string }) => void;
}

export const ChatArea = ({ messages, onSendMessage, onGetBotResponse }: ChatAreaProps) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isLoading = useMemo(() => {
    return messages.length > 0 && messages[messages.length - 1].response === null;
  }, [messages]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

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
      // eslint-disable-next-line react-hooks/purity
      const idx = Math.floor(Math.random() * QUICK_QUESTIONS.length);
      if (!usedIndexes.has(idx)) {
        usedIndexes.add(idx);
        result.push(QUICK_QUESTIONS[idx]);
      }
    }

    return result;
  }, []);

  return (
    <div className="flex-1 flex flex-col h-screen bg-white">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 pt-16 md:pt-6">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <RobotOutlined className="text-6xl mb-4" />
              <p className="text-lg">Bắt đầu cuộc trò chuyện mới</p>
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
                  scrollToBottom={scrollToBottom}
                />
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="bg-white pb-4 px-4 md:pb-16">
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
                  className="!text-[#575757] !text-[13px] md:!text-[16px] !w-full !mb-4 !h-[52px] md:!h-[72px] !bg-white"
                  onClick={() => onSendMessage(question.title)}
                >
                  {question.title}
                </Button>
              );
            })}
          </div>
        ) : null}
        <div
          className="max-w-3xl mx-auto flex gap-2 border border-[#dddddd] rounded-2xl p-2 items-end"
          style={{
            boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
            background: isLoading ? 'bg-[#0000000A]' : 'trasparent',
          }}
        >
          <TextArea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Nhập câu hỏi của bạn..."
            autoSize={{ minRows: 2, maxRows: 6 }}
            className="flex-1 !border-none !outline-none !shadow-none text-[14px]! md:text-[18px]! bg-transparent!"
            disabled={isLoading}
          />
          <RippleButton
            onClick={handleSend}
            className={`!w-10 !h-10 ${isLoading || !input.trim() ? '!cursor-not-allowed ' : ''} !rounded-full !flex !items-center !justify-center`}
            disabled={isLoading || !input.trim()}
          >
            <SendOutlined />
          </RippleButton>
        </div>
      </div>
    </div>
  );
};

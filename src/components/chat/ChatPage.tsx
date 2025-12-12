import { ChatArea } from '@/components/chat/ChatArea';
import { useConversations } from '@/hooks/useConversations';
import { Swiper, SwiperSlide } from "swiper/react";
import { Sidebar } from './Sidebar';
// import Swiper and modules styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { Grid } from 'antd';

const { useBreakpoint } = Grid;

export const ChatPage = () => {
  const screens = useBreakpoint();
  
  const {
    conversations,
    currentConversationId,
    currentConversation,
    setCurrentConversationId,
    addConversation,
    deleteConversation,
    addMessagePair,
    handleGetBotResponse,
  } = useConversations();

  const handleSendMessage = (query: string) => {
    addMessagePair(currentConversationId, query);
  };

  const handleAddConversation = () => {
    addConversation();
  };

  return (
    <div className='h-[calc(100dvh-80px)]'>
      {
        screens.md ? (
          <div className='flex h-full'>
            <div className='mt-4 mb-4 mr-4 pl-4 rounded-md'>
              <Sidebar
                conversations={conversations}
                currentConversationId={currentConversationId}
                onSelectConversation={setCurrentConversationId}
                onAddConversation={handleAddConversation}
                onDeleteConversation={deleteConversation}
                changeTab={() => null}
                rounded={true}
              />
            </div>
            <ChatArea
              messages={currentConversation?.messages || []}
              onSendMessage={handleSendMessage}
              onGetBotResponse={handleGetBotResponse}
              changeTab={() => null}
            />
          </div>
        ) : (
           <div className='h-[calc(100dvh-64px)]'>
            <Swiper
              allowTouchMove={true}
              slidesPerView={1}
            >
              <SwiperSlide className='h-full'>
                <div className='h-[calc(100dvh-64px)]'>
                  <Sidebar
                    conversations={conversations}
                    currentConversationId={currentConversationId}
                    onSelectConversation={setCurrentConversationId}
                    onAddConversation={handleAddConversation}
                    onDeleteConversation={deleteConversation}
                    changeTab={() => null}
                    allowSlide={true}
                    rounded={false}
                  />
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className='h-[calc(100dvh-64px)]'>
                  <ChatArea
                    messages={currentConversation?.messages || []}
                    onSendMessage={handleSendMessage}
                    onGetBotResponse={handleGetBotResponse}
                    changeTab={() => null}
                    key={currentConversationId}
                  />
                </div>
              </SwiperSlide>
            </Swiper>
          </div>
        )
      }
    </div>
  );
};

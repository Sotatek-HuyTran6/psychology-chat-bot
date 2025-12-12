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
    <div>
      {
        screens.md ? (
          <div className='flex'>
            <div>
              <Sidebar
                conversations={conversations}
                currentConversationId={currentConversationId}
                onSelectConversation={setCurrentConversationId}
                onAddConversation={handleAddConversation}
                onDeleteConversation={deleteConversation}
                changeTab={() => null}
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
           <div className='h-[calc(100vh-64px)]'>
            <Swiper
              allowTouchMove={true}
              slidesPerView={1}
            >
              <SwiperSlide className='h-full'>
                <div className='h-[calc(100vh-64px)]'>
                  <Sidebar
                    conversations={conversations}
                    currentConversationId={currentConversationId}
                    onSelectConversation={setCurrentConversationId}
                    onAddConversation={handleAddConversation}
                    onDeleteConversation={deleteConversation}
                    changeTab={() => null}
                    allowSlide={true}
                  />
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className='h-[calc(100vh-64px)]'>
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

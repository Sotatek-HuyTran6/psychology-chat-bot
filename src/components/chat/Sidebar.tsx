import RippleButton from '@/components/common/RippleButton';
import type { Conversation } from '@/types';
import {
  DeleteOutlined,
  MessageOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { List } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useSwiper } from "swiper/react";

dayjs.extend(relativeTime);
dayjs.locale('vi');

interface SidebarProps {
  conversations: Conversation[];
  currentConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onAddConversation: () => void;
  onDeleteConversation: (id: string) => void;
  changeTab: (tab: '' | 'evaluation') => void;
  allowSlide?: boolean;
  rounded: boolean;
}

export const Sidebar = ({
  conversations,
  currentConversationId,
  onSelectConversation,
  onAddConversation,
  onDeleteConversation,
  allowSlide = false,
  rounded,
}: SidebarProps) => {

  const swiper = useSwiper();

  return (
    <div className={`h-full max-md:w-full w-80  bg-[#f3d6b5] flex flex-col ${rounded ? 'rounded-sm' : ''}`}>
      {/* Header with Add button */}
      <div className="py-[22px] px-4 border-b border-slate-200 mt-8">
        <RippleButton
          icon={<PlusOutlined />}
          onClick={() => {
            onAddConversation();
            if (allowSlide) {
              swiper.slideTo(1);
            }
          }}
          className="w-full rounded-md text-[#3b142a] bg-[#ffc685] hover:bg-[#ffc685] h-[46px] text-[14px] !font-bold"
        >
          Đoạn chat mới
        </RippleButton>
      </div>

      {/* Conversations list */}
      <div className="grow overflow-y-auto px-4 py-3">
        <List
          dataSource={conversations}
          renderItem={(conv) => (
            <RippleButton
              key={conv.id}
              type='button'
              className={`w-full px-3 py-3 rounded-md cursor-pointer flex items-center justify-between group transition-all mb-2
                ${
                  currentConversationId === conv.id
                    ? 'text-[#3b142a] bg-[#ffc685] hover:bg-[#ffc685]'
                    : ''
                }
                  `}
              onClick={() => {
                onSelectConversation(conv.id)
                if (allowSlide) {
                  swiper.slideTo(1);
                }
              }}
            >
              <div className="flex items-center flex-1 min-w-0">
                <MessageOutlined
                  className={`mr-3 ${currentConversationId === conv.id ? 'text-[#3b142a]' : 'text-[#3b142a]'}`}
                />
                <span
                  className={`text-sm truncate font-medium ${
                    currentConversationId === conv.id ? 'text-[#3b142a]' : 'text-[#3b142a]'
                  }`}
                >
                  {conv.title}
                </span>
              </div>
              <div
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteConversation(conv.id);
                }}
              >
                <DeleteOutlined />
              </div>
            </RippleButton>
          )}
        />
      </div>
    </div>
  );
};

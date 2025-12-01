import { DeleteOutlined, MessageOutlined, PlusOutlined } from '@ant-design/icons';
import { List } from 'antd';
import type { Conversation } from '../types';
import RippleButton from './RippleButton';

interface SidebarProps {
  conversations: Conversation[];
  currentConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onAddConversation: () => void;
  onDeleteConversation: (id: string) => void;
}

export const Sidebar = ({
  conversations,
  currentConversationId,
  onSelectConversation,
  onAddConversation,
  onDeleteConversation,
}: SidebarProps) => {
  return (
    <div className="h-full w-full md:w-80  bg-[#e9eef6] flex flex-col">
      {/* Header with Add button */}
      <div className="p-4 border-b border-slate-200">
        <RippleButton
          icon={<PlusOutlined />}
          onClick={onAddConversation}
          className="w-full rounded-3xl text-[#0842a0] bg-[#d3e3fd] hover:bg-[#d3e3fd]"
        >
          Đoạn chat mới
        </RippleButton>
      </div>

      {/* Conversations list */}
      <div className="flex-grow-1 overflow-y-auto px-4 py-3">
        <List
          dataSource={conversations}
          renderItem={(conv) => (
            <RippleButton
              key={conv.id}
              className={`w-full px-3 py-3 rounded-3xl cursor-pointer flex items-center justify-between group transition-all mb-2
                ${
                  currentConversationId === conv.id
                    ? 'text-[#0842a0] bg-[#d3e3fd] hover:bg-[#d3e3fd]'
                    : ''
                }
                  `}
              onClick={() => onSelectConversation(conv.id)}
            >
              <div className="flex items-center flex-1 min-w-0">
                <MessageOutlined
                  className={`mr-3 ${currentConversationId === conv.id ? 'text-blue-600' : 'text-slate-500'}`}
                />
                <span
                  className={`text-sm truncate font-medium ${
                    currentConversationId === conv.id ? 'text-blue-900' : 'text-slate-700'
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

import {
  DeleteOutlined,
  LogoutOutlined,
  MessageOutlined,
  PlusOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, List, Modal } from 'antd';
import { useState } from 'react';
import { GoSignIn } from 'react-icons/go';
import { useAuthContext } from '../contexts/AuthContext';
import { useAuth } from '../hooks/useAuth';
import type { Conversation } from '../types';
import { LoginForm } from './LoginForm';
import RippleButton from './RippleButton';
import { SignUpForm } from './SignUpForm';

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
  const { user, isAuthenticated } = useAuthContext();
  const { signOut } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

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

      {/* User info hoặc Login button */}
      <div className="p-4 border-t border-slate-200">
        {isAuthenticated && user ? (
          <div className="space-y-3">
            {/* User info */}
            <div className="flex items-center gap-3 px-3 py-2 bg-white rounded-2xl">
              <Avatar
                size={40}
                src={user.avatar}
                icon={!user.avatar && <UserOutlined />}
                className="flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-slate-800 truncate">{user.name}</div>
                <div className="text-xs text-slate-500 truncate">{user.email}</div>
              </div>
            </div>

            {/* Logout button */}
            <RippleButton
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              className="w-full rounded-3xl text-red-600 bg-red-50 border border-red-200"
            >
              Đăng xuất
            </RippleButton>
          </div>
        ) : (
          <RippleButton
            icon={<GoSignIn size={20} />}
            onClick={() => setIsLoginModalOpen(true)}
            className="w-full rounded-3xl !items-center"
          >
            Đăng nhập
          </RippleButton>
        )}
      </div>

      <Modal
        title="Đăng nhập"
        centered
        open={isLoginModalOpen}
        onCancel={() => {
          setIsLoginModalOpen(false);
        }}
        footer={null}
        destroyOnHidden
      >
        <LoginForm
          setIsLoginModalOpen={setIsLoginModalOpen}
          setIsSignupModalOpen={setIsSignupModalOpen}
        />
      </Modal>

      <Modal
        title="Đăng ký tài khoản"
        centered
        open={isSignupModalOpen}
        onCancel={() => {
          setIsSignupModalOpen(false);
        }}
        width={500}
        destroyOnHidden
        footer={null}
      >
        <SignUpForm
          setIsSignupModalOpen={setIsSignupModalOpen}
          setIsLoginModalOpen={setIsLoginModalOpen}
        />
      </Modal>
    </div>
  );
};

import './App.css';
import { MenuOutlined } from '@ant-design/icons';
import { Button, ConfigProvider, Drawer } from 'antd';
import { useState } from 'react';
import { ChatArea } from './components/ChatArea';
import { Sidebar } from './components/Sidebar';
import { useConversations } from './hooks/useConversations';

function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);
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
    // if (!currentConversationId) return;
    addMessagePair(currentConversationId, query);
  };

  const handleAddConversation = () => {
    addConversation();
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#0842a0',
          controlHeight: 48,
          fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          fontSize: 16,
          fontWeightStrong: 600,
        },
        components: {
          Modal: {
            titleFontSize: 20,
          },
        },
      }}
    >
      <div className="flex h-screen overflow-hidden">
        {/* Mobile Header */}
        <div className="fixed top-0 left-0 right-0 h-14 bg-white border-b border-slate-200 z-50 flex items-center px-4 md:hidden">
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={() => setDrawerOpen(true)}
            className="text-lg"
          />
          <span className="ml-3 font-semibold text-slate-800">Chat Bot</span>
        </div>

        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <Sidebar
            conversations={conversations}
            currentConversationId={currentConversationId}
            onSelectConversation={setCurrentConversationId}
            onAddConversation={handleAddConversation}
            onDeleteConversation={deleteConversation}
          />
        </div>

        {/* Mobile Drawer */}
        <Drawer
          placement="left"
          onClose={() => setDrawerOpen(false)}
          open={drawerOpen}
          width={320}
          styles={{ body: { padding: 0 } }}
        >
          <Sidebar
            conversations={conversations}
            currentConversationId={currentConversationId}
            onSelectConversation={(id) => {
              setCurrentConversationId(id);
              setDrawerOpen(false);
            }}
            onAddConversation={() => {
              handleAddConversation();
              setDrawerOpen(false);
            }}
            onDeleteConversation={deleteConversation}
          />
        </Drawer>

        <ChatArea
          messages={currentConversation?.messages || []}
          onSendMessage={handleSendMessage}
          onGetBotResponse={handleGetBotResponse}
        />
      </div>
    </ConfigProvider>
  );
}

export default App;

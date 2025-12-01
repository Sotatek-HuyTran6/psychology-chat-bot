import './App.css';
import { ChatArea } from './components/ChatArea';
import { Sidebar } from './components/Sidebar';
import { useConversations } from './hooks/useConversations';

function App() {
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
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        conversations={conversations}
        currentConversationId={currentConversationId}
        onSelectConversation={setCurrentConversationId}
        onAddConversation={handleAddConversation}
        onDeleteConversation={deleteConversation}
      />
      <ChatArea
        messages={currentConversation?.messages || []}
        onSendMessage={handleSendMessage}
        onGetBotResponse={handleGetBotResponse}
      />
    </div>
  );
}

export default App;

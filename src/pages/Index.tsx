
import React, { useState } from 'react';
import ChatSidebar from '../components/ChatSidebar';
import ChatInterface from '../components/ChatInterface';

interface ChatSession {
  id: string;
  title: string;
  messages: Array<{
    id: string;
    text: string;
    isUser: boolean;
    timestamp: Date;
  }>;
  createdAt: Date;
}

const Index = () => {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string>('new-chat');
  const [currentMessages, setCurrentMessages] = useState<Array<{
    id: string;
    text: string;
    isUser: boolean;
    timestamp: Date;
  }>>([]);

  const getCurrentChat = () => {
    if (currentChatId === 'new-chat') {
      return { id: 'new-chat', title: 'New Chat', messages: currentMessages, createdAt: new Date() };
    }
    return chatSessions.find(chat => chat.id === currentChatId) || { id: 'new-chat', title: 'New Chat', messages: [], createdAt: new Date() };
  };

  const handleNewChat = () => {
    // Save current chat if it has messages
    if (currentMessages.length > 0 && currentChatId === 'new-chat') {
      const newChatSession: ChatSession = {
        id: Date.now().toString(),
        title: currentMessages[0]?.text.length > 30 
          ? currentMessages[0].text.substring(0, 30) + '...' 
          : currentMessages[0]?.text || 'New Chat',
        messages: currentMessages,
        createdAt: new Date()
      };
      
      setChatSessions(prev => [newChatSession, ...prev.slice(0, 9)]);
    }
    
    // Start new chat
    setCurrentChatId('new-chat');
    setCurrentMessages([]);
  };

  const handleSelectChat = (chatId: string) => {
    // Save current chat if it's new and has messages
    if (currentMessages.length > 0 && currentChatId === 'new-chat') {
      const newChatSession: ChatSession = {
        id: Date.now().toString(),
        title: currentMessages[0]?.text.length > 30 
          ? currentMessages[0].text.substring(0, 30) + '...' 
          : currentMessages[0]?.text || 'New Chat',
        messages: currentMessages,
        createdAt: new Date()
      };
      
      setChatSessions(prev => [newChatSession, ...prev.slice(0, 9)]);
    }

    setCurrentChatId(chatId);
    
    // Load selected chat messages
    const selectedChat = chatSessions.find(chat => chat.id === chatId);
    if (selectedChat) {
      setCurrentMessages([...selectedChat.messages]);
    } else {
      setCurrentMessages([]);
    }
  };

  const handleNewMessage = (userMessage: string, aiResponse: string) => {
    const userMsg = {
      id: Date.now().toString(),
      text: userMessage,
      isUser: true,
      timestamp: new Date(),
    };

    const aiMsg = {
      id: (Date.now() + 1).toString(),
      text: aiResponse,
      isUser: false,
      timestamp: new Date(),
    };

    setCurrentMessages(prev => [...prev, userMsg, aiMsg]);
  };

  const recentChatTitles = chatSessions.map(chat => ({
    id: chat.id,
    title: chat.title
  }));

  return (
    <div className="flex h-screen bg-[#212121] overflow-hidden">
      <ChatSidebar
        recentChats={recentChatTitles}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        selectedChat={currentChatId}
      />
      <div className="flex-1">
        <ChatInterface
          chatId={currentChatId}
          messages={currentMessages}
          onNewMessage={handleNewMessage}
        />
      </div>
    </div>
  );
};

export default Index;

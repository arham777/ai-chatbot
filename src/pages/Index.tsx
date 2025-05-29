
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
    // Start new chat
    setCurrentChatId('new-chat');
    setCurrentMessages([]);
  };

  const handleSelectChat = (chatId: string) => {
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

    const newMessages = [...currentMessages, userMsg, aiMsg];
    setCurrentMessages(newMessages);

    // If this is a new chat (first message), save it to recent chats
    if (currentChatId === 'new-chat' && currentMessages.length === 0) {
      const newChatId = Date.now().toString();
      const chatTitle = userMessage.length > 30 
        ? userMessage.substring(0, 30) + '...' 
        : userMessage;
      
      const newChatSession: ChatSession = {
        id: newChatId,
        title: chatTitle,
        messages: newMessages,
        createdAt: new Date()
      };
      
      setChatSessions(prev => [newChatSession, ...prev.slice(0, 9)]);
      setCurrentChatId(newChatId);
    } 
    // If it's an existing chat, update it in the sessions
    else if (currentChatId !== 'new-chat') {
      setChatSessions(prev => prev.map(chat => 
        chat.id === currentChatId 
          ? { ...chat, messages: newMessages }
          : chat
      ));
    }
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

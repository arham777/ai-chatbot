
import React, { useState } from 'react';
import ChatSidebar from '../components/ChatSidebar';
import ChatInterface from '../components/ChatInterface';

const Index = () => {
  const [recentChats, setRecentChats] = useState<string[]>([
    'How to learn React',
    'Python vs JavaScript',
    'Travel to Tokyo',
    'Healthy recipes',
    'Machine learning basics'
  ]);
  const [selectedChat, setSelectedChat] = useState<string>('new-chat');

  const handleNewChat = () => {
    setSelectedChat('new-chat');
  };

  const handleSelectChat = (chatId: string) => {
    setSelectedChat(chatId);
  };

  const handleNewMessage = (message: string) => {
    // If it's a new chat and we have a message, add it to recent chats
    if (selectedChat === 'new-chat' && message.trim()) {
      const newChatTitle = message.length > 30 ? message.substring(0, 30) + '...' : message;
      if (!recentChats.includes(newChatTitle)) {
        setRecentChats(prev => [newChatTitle, ...prev.slice(0, 9)]); // Keep only 10 recent chats
        setSelectedChat(newChatTitle);
      }
    }
  };

  return (
    <div className="flex h-screen bg-[#212121] overflow-hidden">
      <ChatSidebar
        recentChats={recentChats}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        selectedChat={selectedChat}
      />
      <div className="flex-1">
        <ChatInterface
          chatId={selectedChat}
          onNewMessage={handleNewMessage}
        />
      </div>
    </div>
  );
};

export default Index;

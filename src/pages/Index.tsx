import React, { useState, useEffect, useRef } from 'react';
import ChatSidebar from '../components/ChatSidebar';
import ChatInterface from '../components/ChatInterface';
import { GoogleGenerativeAI, ChatSession as GeminiChatSession, Content } from "@google/generative-ai";

// Access your API key (see "Set up your API key" above)
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-05-20"});

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Array<ChatMessage>;
  createdAt: Date;
}

const Index = () => {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string>('new-chat');
  const [currentMessages, setCurrentMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const activeChatRef = useRef<GeminiChatSession | null>(null);

  // Load chat sessions and current chat ID from localStorage on initial render
  useEffect(() => {
    const savedSessions = localStorage.getItem('chatSessions');
    let initialSessions: ChatSession[] = [];
    if (savedSessions) {
      try {
        initialSessions = JSON.parse(savedSessions).map((chat: ChatSession) => ({
          ...chat,
          createdAt: new Date(chat.createdAt), // Ensure date objects are correctly parsed
          messages: chat.messages.map(msg => ({ ...msg, timestamp: new Date(msg.timestamp) }))
        }));
        setChatSessions(initialSessions);
      } catch (e) {
        console.error("Error parsing chatSessions from localStorage", e);
        localStorage.removeItem('chatSessions');
      }
    }

    const savedCurrentChatId = localStorage.getItem('currentChatId');
    if (savedCurrentChatId) {
      setCurrentChatId(savedCurrentChatId);
      if (savedCurrentChatId !== 'new-chat') {
        const currentChat = initialSessions.find(chat => chat.id === savedCurrentChatId);
        if (currentChat) {
          setCurrentMessages(currentChat.messages.map(msg => ({ ...msg, timestamp: new Date(msg.timestamp) })));
        } else {
          setCurrentChatId('new-chat');
          setCurrentMessages([]);
        }
      } else {
        setCurrentMessages([]);
        activeChatRef.current = model.startChat({ history: [] });
      }
    } else {
      setCurrentChatId('new-chat');
      setCurrentMessages([]);
      activeChatRef.current = model.startChat({ history: [] });
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  // Save chat sessions to localStorage whenever they change
  useEffect(() => {
    if (chatSessions.length > 0 || localStorage.getItem('chatSessions')) { // Avoid writing empty array on first load if nothing was there
        localStorage.setItem('chatSessions', JSON.stringify(chatSessions));
    }
  }, [chatSessions]);

  // Save current chat ID to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('currentChatId', currentChatId);
  }, [currentChatId]);

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
    activeChatRef.current = model.startChat({ history: [] });
  };

  const handleSelectChat = (chatId: string) => {
    setCurrentChatId(chatId);
    
    // Load selected chat messages
    const selectedChat = chatSessions.find(chat => chat.id === chatId);
    if (selectedChat) {
      setCurrentMessages([...selectedChat.messages]);
      // Recreate the chat session with history
      const history: Content[] = selectedChat.messages.map(msg => ({
        role: msg.isUser ? "user" : "model",
        parts: [{ text: msg.text }]
      }));
      activeChatRef.current = model.startChat({ history });
    } else {
      setCurrentMessages([]);
      activeChatRef.current = model.startChat({ history: [] });
    }
  };

  const handleNewMessage = async (userMessage: string) => {
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      text: userMessage,
      isUser: true,
      timestamp: new Date(),
    };

    // Optimistically update with user message first
    const updatedMessagesWithUser = [...currentMessages, userMsg];
    setCurrentMessages(updatedMessagesWithUser);
    setIsLoading(true);

    let aiResponseText = "Sorry, I couldn't get a response.";
    try {
      if (!activeChatRef.current) {
        console.log("Chat not initialized, starting new one");
        activeChatRef.current = model.startChat({
            history: currentMessages.map(msg => ({
                role: msg.isUser ? "user" : "model",
                parts: [{ text: msg.text }]
            }))
        });
      }
      const result = await activeChatRef.current.sendMessage(userMessage);
      const response = await result.response;
      aiResponseText = response.text();
    } catch (error) {
      console.error("Error fetching from Gemini API:", error);
      // Keep the default error message or set a more specific one
    }

    const aiMsg: ChatMessage = {
      id: (Date.now() + 1).toString(), // Ensure unique ID
      text: aiResponseText,
      isUser: false,
      timestamp: new Date(),
    };

    const finalMessages = [...updatedMessagesWithUser, aiMsg];
    setCurrentMessages(finalMessages);
    setIsLoading(false);

    // If this is a new chat (first message), save it to recent chats
    if (currentChatId === 'new-chat' && updatedMessagesWithUser.length === 1) { // Check based on user message only
      const newChatId = Date.now().toString();
      const chatTitle = userMessage.length > 30 
        ? userMessage.substring(0, 30) + '...' 
        : userMessage;
      
      const newChatSession: ChatSession = {
        id: newChatId,
        title: chatTitle,
        messages: finalMessages, // Save messages including AI response
        createdAt: new Date()
      };
      
      setChatSessions(prev => [newChatSession, ...prev.slice(0, 9)]);
      setCurrentChatId(newChatId);
    } 
    // If it's an existing chat, update it in the sessions
    else if (currentChatId !== 'new-chat') {
      setChatSessions(prev => prev.map(chat => 
        chat.id === currentChatId 
          ? { ...chat, messages: finalMessages } // Save messages including AI response
          : chat
      ));
    }
  };

  const recentChatTitles = chatSessions.map(chat => ({
    id: chat.id,
    title: chat.title
  }));

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-[#141414] overflow-hidden">
      <ChatSidebar
        isOpen={isSidebarOpen}
        onToggle={toggleSidebar}
        recentChats={recentChatTitles}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        selectedChat={currentChatId}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <ChatInterface
          chatId={currentChatId}
          messages={currentMessages}
          onNewMessage={handleNewMessage}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default Index;

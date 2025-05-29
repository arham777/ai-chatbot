
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ChatMessage from './ChatMessage';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatInterfaceProps {
  chatId: string;
  onNewMessage: (message: string) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ chatId, onNewMessage }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Reset messages when chat changes
    setMessages([]);
  }, [chatId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    onNewMessage(inputValue);
    setInputValue('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm a demo AI response. In a real application, this would be connected to an actual AI service.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-screen bg-[#212121]">
      {/* Chat Header */}
      <div className="flex items-center justify-center p-4 border-b border-gray-700">
        <h1 className="text-xl font-semibold text-white">ChatGPT</h1>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <h2 className="text-3xl font-semibold text-white mb-4">
              What can I help with?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl">
              <Button
                variant="outline"
                className="p-4 h-auto text-left bg-transparent border-gray-600 hover:bg-gray-700 text-gray-300"
                onClick={() => setInputValue("Help me plan a trip")}
              >
                <div>
                  <div className="font-medium">Plan a trip</div>
                  <div className="text-sm text-gray-400">Help me plan a vacation</div>
                </div>
              </Button>
              <Button
                variant="outline"
                className="p-4 h-auto text-left bg-transparent border-gray-600 hover:bg-gray-700 text-gray-300"
                onClick={() => setInputValue("Write code")}
              >
                <div>
                  <div className="font-medium">Write code</div>
                  <div className="text-sm text-gray-400">Help with programming tasks</div>
                </div>
              </Button>
              <Button
                variant="outline"
                className="p-4 h-auto text-left bg-transparent border-gray-600 hover:bg-gray-700 text-gray-300"
                onClick={() => setInputValue("Explain a concept")}
              >
                <div>
                  <div className="font-medium">Explain concepts</div>
                  <div className="text-sm text-gray-400">Break down complex topics</div>
                </div>
              </Button>
              <Button
                variant="outline"
                className="p-4 h-auto text-left bg-transparent border-gray-600 hover:bg-gray-700 text-gray-300"
                onClick={() => setInputValue("Creative writing")}
              >
                <div>
                  <div className="font-medium">Creative writing</div>
                  <div className="text-sm text-gray-400">Stories, poems, and more</div>
                </div>
              </Button>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message.text}
                isUser={message.isUser}
              />
            ))}
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="bg-gray-700 px-4 py-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Container */}
      <div className="p-4 border-t border-gray-700">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <div className="flex-1 relative">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask anything"
                className="w-full bg-[#171717] border-gray-600 text-white placeholder-gray-400 focus:border-gray-500 pr-12"
                disabled={isLoading}
              />
              <Button
                type="submit"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white text-black hover:bg-gray-200 disabled:opacity-50"
                disabled={!inputValue.trim() || isLoading}
              >
                ↑
              </Button>
            </div>
          </form>
          <p className="text-xs text-gray-400 mt-2 text-center">
            ChatGPT can make mistakes. Check important info.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;

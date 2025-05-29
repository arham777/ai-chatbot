
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Sparkles } from 'lucide-react';
import ChatMessage from './ChatMessage';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatInterfaceProps {
  chatId: string;
  messages: Message[];
  onNewMessage: (userMessage: string, aiResponse: string) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ chatId, messages, onNewMessage }) => {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue;
    setInputValue('');
    setIsLoading(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse = "I'm a demo AI response. In a real application, this would be connected to an actual AI service.";
      onNewMessage(userMessage, aiResponse);
      setIsLoading(false);
    }, 1000);
  };

  const suggestedPrompts = [
    { title: "Plan a trip", subtitle: "Help me plan a vacation", prompt: "Help me plan a trip" },
    { title: "Write code", subtitle: "Help with programming tasks", prompt: "Write code" },
    { title: "Explain concepts", subtitle: "Break down complex topics", prompt: "Explain a concept" },
    { title: "Creative writing", subtitle: "Stories, poems, and more", prompt: "Creative writing" }
  ];

  return (
    <div className="flex flex-col h-screen bg-[#212121] relative">
      {/* Chat Header */}
      <div className="flex items-center justify-center p-6 border-b border-gray-800/50 backdrop-blur-sm bg-[#212121]/80">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-6 w-6 text-purple-500 animate-pulse" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            ChatGPT
          </h1>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-6 py-8 custom-scrollbar">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
            <div className="mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-4 mx-auto shadow-lg">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                What can I help with?
              </h2>
              <p className="text-gray-400 text-lg">Start a conversation with AI</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl w-full">
              {suggestedPrompts.map((prompt, index) => (
                <Button
                  key={prompt.title}
                  variant="outline"
                  className="p-6 h-auto text-left bg-gray-800/50 border-gray-700/50 hover:bg-gray-700/50 text-gray-300 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg group backdrop-blur-sm"
                  onClick={() => setInputValue(prompt.prompt)}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div>
                    <div className="font-medium group-hover:text-white transition-colors duration-200">{prompt.title}</div>
                    <div className="text-sm text-gray-400 mt-1">{prompt.subtitle}</div>
                  </div>
                </Button>
              ))}
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
              <div className="flex justify-start mb-6 animate-fade-in">
                <div className="bg-gray-800/80 backdrop-blur-sm px-6 py-4 rounded-2xl shadow-lg border border-gray-700/50">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-3 h-3 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Container */}
      <div className="p-6 border-t border-gray-800/50 backdrop-blur-sm bg-[#212121]/80">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="relative">
            <div className="relative group">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask anything..."
                className="w-full bg-gray-800/50 border-gray-700/50 text-white placeholder-gray-400 focus:border-purple-500 pr-14 rounded-2xl py-4 px-6 text-lg backdrop-blur-sm shadow-lg transition-all duration-300 focus:shadow-xl group-hover:shadow-lg"
                disabled={isLoading}
              />
              <Button
                type="submit"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 rounded-xl w-10 h-10 transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-xl hover:scale-105"
                disabled={!inputValue.trim() || isLoading}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
          <p className="text-xs text-gray-500 mt-3 text-center">
            ChatGPT can make mistakes. Check important info.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;

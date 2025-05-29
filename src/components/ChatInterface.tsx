import React, { useRef, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import ChatMessage from './ChatMessage';
import { PromptInputBox } from '@/components/ui/ai-prompt-box';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatInterfaceProps {
  chatId: string;
  messages: Message[];
  onNewMessage: (userMessage: string) => void;
  isLoading: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ chatId, messages, onNewMessage, isLoading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const suggestedPrompts = [
    { title: "Plan a trip", subtitle: "Help me plan a vacation", prompt: "Help me plan a trip" },
    { title: "Write code", subtitle: "Help with programming tasks", prompt: "Write code" },
    { title: "Explain concepts", subtitle: "Break down complex topics", prompt: "Explain a concept" },
    { title: "Creative writing", subtitle: "Stories, poems, and more", prompt: "Creative writing" }
  ];

  return (
    <div className="flex flex-col h-full bg-background relative">
      {/* Chat Header */}
      <div className="flex items-center justify-center p-4 border-b border-border backdrop-blur-sm bg-background/80 flex-shrink-0">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-5 w-5 text-primary animate-pulse" />
          <h1 className="text-xl font-bold text-foreground">
            Raven AI Scribe
          </h1>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6 custom-scrollbar">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
            <div className="mb-6">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-3 mx-auto shadow-lg">
                <Sparkles className="h-6 w-6 text-primary-foreground" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-1">
                What can I help with?
              </h2>
              <p className="text-muted-foreground text-base">Start a conversation</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-xl w-full">
              {suggestedPrompts.map((prompt, index) => (
                <button
                  key={prompt.title}
                  className="p-4 h-auto text-left bg-card border border-border hover:bg-accent text-card-foreground rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-md group backdrop-blur-sm"
                  onClick={() => {
                    console.log("Setting prompt: ", prompt.prompt);
                  }}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div>
                    <div className="font-medium text-sm group-hover:text-accent-foreground transition-colors duration-200">{prompt.title}</div>
                    <div className="text-xs text-muted-foreground mt-1">{prompt.subtitle}</div>
                  </div>
                </button>
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
              <div className="flex justify-start mb-4 animate-fade-in">
                <div className="bg-card/80 backdrop-blur-sm px-3 py-2 rounded-xl shadow-lg border border-border">
                  <div className="flex items-center space-x-1.5">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Container */}
      <div className="p-4 border-t border-border backdrop-blur-sm bg-background/80 flex-shrink-0">
        <div className="max-w-4xl mx-auto">
          <PromptInputBox
            onSend={(message, files) => {
              if (files && files.length > 0) {
                console.log("Files received, but not handled by current onNewMessage:", files);
              }
              onNewMessage(message);
            }}
            isLoading={isLoading}
            placeholder="Ask Raven AI anything..."
            className="w-full"
          />
          <p className="text-[10px] text-muted-foreground mt-2 text-center">
            AI can make mistakes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;

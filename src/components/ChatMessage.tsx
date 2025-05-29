import React from 'react';

interface ChatMessageProps {
  message: string;
  isUser: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isUser }) => {
  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-6 animate-fade-in`}>
      <div
        className={`max-w-3xl px-6 py-4 rounded-2xl shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl ${
          isUser
            ? 'bg-primary text-primary-foreground ml-auto transform hover:scale-[1.02]'
            : 'bg-card text-card-foreground border border-border'
        }`}
      >
        <div className="flex items-start space-x-4">
          {!isUser && (
            <div className="w-8 h-8 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-sm font-semibold shadow-md">
              AI
            </div>
          )}
          <div className="flex-1">
            <p className="text-xs leading-relaxed whitespace-pre-wrap">{message}</p>
          </div>
          {isUser && (
            <div className="w-8 h-8 bg-muted text-muted-foreground rounded-full flex items-center justify-center text-sm font-semibold shadow-md">
              U
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;

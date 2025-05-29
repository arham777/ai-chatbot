
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
            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white ml-auto transform hover:scale-[1.02]'
            : 'bg-gray-800/80 text-gray-100 border border-gray-700/50'
        }`}
      >
        <div className="flex items-start space-x-4">
          {!isUser && (
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-md">
              AI
            </div>
          )}
          <div className="flex-1">
            <p className="text-sm leading-relaxed">{message}</p>
          </div>
          {isUser && (
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-md">
              U
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;

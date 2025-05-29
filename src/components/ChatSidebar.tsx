
import React from 'react';
import { Button } from '@/components/ui/button';
import { Search, Library, Plus } from 'lucide-react';

interface ChatSidebarProps {
  recentChats: string[];
  onNewChat: () => void;
  onSelectChat: (chatId: string) => void;
  selectedChat: string;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  recentChats,
  onNewChat,
  onSelectChat,
  selectedChat,
}) => {
  return (
    <div className="w-64 bg-[#171717] h-screen flex flex-col border-r border-gray-800 shadow-lg">
      {/* Header */}
      <div className="p-4">
        <Button
          onClick={onNewChat}
          className="w-full justify-start bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          <Plus className="mr-2 h-4 w-4" />
          New chat
        </Button>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 px-3">
        <div className="space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-300 hover:bg-gray-800/50 hover:text-white rounded-xl transition-all duration-200 group"
          >
            <Search className="mr-3 h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
            Search chats
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-300 hover:bg-gray-800/50 hover:text-white rounded-xl transition-all duration-200 group"
          >
            <Library className="mr-3 h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
            Library
          </Button>
        </div>

        {/* Recent Chats */}
        {recentChats.length > 0 && (
          <div className="mt-8">
            <h3 className="px-3 mb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Recent
            </h3>
            <div className="space-y-1">
              {recentChats.map((chat, index) => (
                <Button
                  key={chat}
                  variant="ghost"
                  onClick={() => onSelectChat(chat)}
                  className={`w-full justify-start text-left text-gray-300 hover:bg-gray-800/50 hover:text-white truncate rounded-xl transition-all duration-200 transform hover:translate-x-1 ${
                    selectedChat === chat ? 'bg-gray-800/70 text-white shadow-md' : ''
                  }`}
                  style={{
                    animationDelay: `${index * 50}ms`
                  }}
                >
                  <span className="truncate">{chat}</span>
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800">
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-400 hover:bg-gray-800/50 hover:text-white text-sm rounded-xl transition-all duration-200"
        >
          <div className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mr-3 animate-pulse"></div>
          Upgrade plan
        </Button>
      </div>
    </div>
  );
};

export default ChatSidebar;

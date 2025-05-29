
import React from 'react';
import { Button } from '@/components/ui/button';
import { Search, Library } from 'lucide-react';

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
    <div className="w-64 bg-[#171717] h-screen flex flex-col border-r border-gray-700">
      {/* Header */}
      <div className="p-4">
        <Button
          onClick={onNewChat}
          className="w-full justify-start bg-transparent border border-gray-600 hover:bg-gray-700 text-white"
        >
          <span className="mr-2">+</span>
          New chat
        </Button>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 px-2">
        <div className="space-y-1">
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            <Search className="mr-3 h-4 w-4" />
            Search chats
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            <Library className="mr-3 h-4 w-4" />
            Library
          </Button>
        </div>

        {/* Recent Chats */}
        {recentChats.length > 0 && (
          <div className="mt-6">
            <h3 className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Recent
            </h3>
            <div className="space-y-1">
              {recentChats.map((chat) => (
                <Button
                  key={chat}
                  variant="ghost"
                  onClick={() => onSelectChat(chat)}
                  className={`w-full justify-start text-left text-gray-300 hover:bg-gray-700 hover:text-white truncate ${
                    selectedChat === chat ? 'bg-gray-700 text-white' : ''
                  }`}
                >
                  <span className="truncate">{chat}</span>
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-300 hover:bg-gray-700 hover:text-white text-sm"
        >
          Upgrade plan
        </Button>
      </div>
    </div>
  );
};

export default ChatSidebar;

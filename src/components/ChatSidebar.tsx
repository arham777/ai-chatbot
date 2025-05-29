import React from 'react';
import { Button } from '@/components/ui/button';
import { Search, Library, Plus, PanelLeftClose, PanelRightClose, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RecentChat {
  id: string;
  title: string;
}

interface ChatSidebarProps {
  recentChats: RecentChat[];
  onNewChat: () => void;
  onSelectChat: (chatId: string) => void;
  selectedChat: string;
  isOpen: boolean;
  onToggle: () => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  recentChats,
  onNewChat,
  onSelectChat,
  selectedChat,
  isOpen,
  onToggle,
}) => {
  return (
    <div
      className={cn(
        "bg-sidebar-background h-screen flex flex-col border-r border-sidebar-border shadow-lg transition-all duration-300 ease-in-out",
        isOpen ? "w-64" : "w-16"
      )}
    >
      {/* Header with Toggle Button */}
      <div className="p-2.5  mt-4 flex items-center justify-between border-b border-sidebar-border">
        {isOpen && (
          <Button
            onClick={onNewChat}
            className="flex-1 justify-start bg-sidebar-primary hover:bg-sidebar-primary/90 text-sidebar-primary-foreground rounded-md text-xs py-1.5 px-2 mr-1.5"
          >
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            New chat
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground h-7 w-7 rounded-md"
        >
          {isOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelRightClose className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation Items */}
      <div className={cn("flex-1 px-2 py-1.5 overflow-y-auto", isOpen ? "opacity-100" : "opacity-0 pointer-events-none h-0")}>
        <div className="space-y-0.5">
          <Button
            variant="ghost"
            className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md text-xs py-1.5 px-2 group"
          >
            <Search className="mr-2 h-3.5 w-3.5 flex-shrink-0" />
            {isOpen && <span className="truncate">Search chats</span>}
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md text-xs py-1.5 px-2 group"
          >
            <Library className="mr-2 h-3.5 w-3.5 flex-shrink-0" />
            {isOpen && <span className="truncate">Library</span>}
          </Button>
        </div>

        {/* Recent Chats */}
        {recentChats.length > 0 && (
          <div className="mt-4">
            <h3 className={cn("px-2 mb-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider", !isOpen && "text-center")}>
              {isOpen ? "Recent" : "R"}
            </h3>
            <div className="space-y-0.5">
              {recentChats.map((chat, index) => (
                <Button
                  key={chat.id}
                  variant="ghost"
                  onClick={() => onSelectChat(chat.id)}
                  title={isOpen ? chat.title : undefined}
                  className={cn(
                    "w-full justify-start text-left text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground truncate rounded-md text-xs py-1.5 px-2 transform transition-all duration-200",
                    selectedChat === chat.id && 'bg-sidebar-accent text-sidebar-accent-foreground shadow-sm',
                    !isOpen && "justify-center"
                  )}
                  style={{
                    animationDelay: `${index * 50}ms`
                  }}
                >
                  {isOpen ? (
                    <span className="truncate">{chat.title}</span>
                  ) : (
                    <span className="truncate w-3.5 h-3.5 flex items-center justify-center text-[10px]">
                      {chat.title.charAt(0).toUpperCase()}
                    </span>
                  )}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className={cn("p-2.5 border-t border-sidebar-border mt-auto", isOpen ? "opacity-100" : "opacity-0 pointer-events-none h-0")}>
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-xs rounded-md py-1.5 px-2"
        >
          <User className="mr-2 h-3.5 w-3.5 flex-shrink-0" />
          {isOpen && <span className="truncate">M. Arham Athar</span>}
        </Button>
      </div>
    </div>
  );
};

export default ChatSidebar;

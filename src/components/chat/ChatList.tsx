import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Clock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';
import { format } from 'date-fns';
import { Chat, Message } from '@/types';
import { Input } from '@/components/ui/input';

interface ChatListProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const ChatList: React.FC<ChatListProps> = ({ isOpen, onOpenChange }) => {
  const { user } = useAuth();
  const { chats, getChats, currentChat, setCurrentChat, sendMessage } = useChat();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  // Update selected chat when chats are updated
  useEffect(() => {
    if (selectedChat) {
      const updatedChat = chats.find(chat => chat._id === selectedChat._id);
      if (updatedChat) {
        setSelectedChat(updatedChat);
      }
    }
  }, [chats, selectedChat?._id]);

  const scrollToBottom = () => {
    if (shouldAutoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Handle scroll events to determine if we should auto-scroll
  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
      setShouldAutoScroll(isAtBottom);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedChat?.messages.length]); // Only scroll when new messages are added

  useEffect(() => {
    const fetchChats = async () => {
      if (!user) return;
      try {
        await getChats();
      } catch (err) {
        setError('Failed to load chats');
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [user, getChats]);

  const handleChatClick = (chat: Chat) => {
    setSelectedChat(chat);
    setCurrentChat(chat);
    setShouldAutoScroll(true); // Reset auto-scroll when switching chats
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedChat) return;

    const tempMessage: Message = {
      _id: `temp-${Date.now()}-${Math.random()}`,
      content: message.trim(),
      sender: user!,
      timestamp: new Date().toISOString(),
      receiver: selectedChat.seller._id === user?._id ? selectedChat.buyer : selectedChat.seller
    };

    // Create updated chat object for optimistic update
    const updatedChat: Chat = {
      ...selectedChat,
      messages: [...selectedChat.messages, tempMessage],
      updated_at: new Date().toISOString()
    };

    // Update both selected chat and current chat
    setSelectedChat(updatedChat);
    setCurrentChat(updatedChat);

    // Clear input immediately
    setMessage('');

    try {
      // Send to backend
      await sendMessage(selectedChat._id, message.trim());
    } catch (err) {
      setError('Failed to send message');
      console.error('Error sending message:', err);
      
      // Revert optimistic update
      const revertedChat = {
        ...selectedChat,
        messages: selectedChat.messages.filter(msg => msg._id !== tempMessage._id)
      };
      setSelectedChat(revertedChat);
      setCurrentChat(revertedChat);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'MMM d, h:mm a');
    } catch (error) {
      return 'Invalid date';
    }
  };

  const getOtherParty = (chat: Chat) => {
    if (!user) return null;
    // Check if current user is the buyer or seller
    const isBuyer = chat.buyer._id === user._id;
    return isBuyer ? chat.seller : chat.buyer;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Messages</DialogTitle>
          <DialogDescription>
            Chat with buyers and sellers
          </DialogDescription>
        </DialogHeader>
        <div className="flex h-[600px]">
          {/* Chat List */}
          <div className="w-1/3 border-r overflow-y-auto">
            {loading ? (
              <div className="flex-1 flex items-center justify-center">
                <p>Loading chats...</p>
              </div>
            ) : error ? (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-red-500">{error}</p>
              </div>
            ) : chats.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <MessageSquare size={48} className="text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No chats yet</h3>
                <p className="text-gray-500">
                  Start a conversation with a seller by clicking the "Chat with Seller" button on any product.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {chats.map((chat) => {
                  const otherParty = getOtherParty(chat);
                  const lastMessage = chat.messages[chat.messages.length - 1];
                  
                  return (
                    <Button
                      key={chat._id}
                      variant={selectedChat?._id === chat._id ? "secondary" : "ghost"}
                      className="w-full justify-start p-4 hover:bg-accent"
                      onClick={() => handleChatClick(chat)}
                    >
                      <div className="flex items-center space-x-4 w-full">
                        <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                          <User size={20} className="text-accent-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium truncate">
                              {otherParty?.name || 'Unknown User'}
                            </h4>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(chat.updated_at)}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {lastMessage?.content || 'No messages yet'}
                          </p>
                        </div>
                      </div>
                    </Button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Chat Messages */}
          <div className="w-2/3 flex flex-col">
            {selectedChat ? (
              <>
                <div className="border-b p-4">
                  <h3 className="font-semibold">
                    {getOtherParty(selectedChat)?.name || 'Unknown User'}
                  </h3>
                </div>
                <div 
                  ref={messagesContainerRef}
                  onScroll={handleScroll}
                  className="flex-1 overflow-y-auto p-4 space-y-4"
                >
                  {selectedChat.messages.map((msg) => {
                    const isCurrentUser = msg.sender._id === user?._id;
                    return (
                      <div 
                        key={msg._id}
                        className="flex flex-col items-start"
                      >
                        <span className="text-sm text-muted-foreground mb-1">
                          {isCurrentUser ? 'You' : msg.sender.name}
                        </span>
                        <div 
                          className="rounded-lg px-4 py-2 max-w-[80%] bg-muted"
                        >
                          <p className="text-sm">{msg.content}</p>
                          <p className="text-xs mt-1 opacity-70">
                            {formatDate(msg.timestamp)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
                <div className="border-t p-4">
                  <div className="flex gap-2">
                    <Input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your message..."
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <Button onClick={handleSendMessage} disabled={!message.trim()}>
                      Send
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-center p-8">
                <MessageSquare size={48} className="text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Select a chat</h3>
                <p className="text-gray-500">
                  Choose a conversation from the list to start messaging
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChatList; 
import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Clock, User, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';
import { format } from 'date-fns';
import { Chat, Message, Product } from '@/types';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { api } from '@/lib/api';

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
  const [productDetails, setProductDetails] = useState<Record<string, Product>>({});

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
        // Debug chat data structure
        console.log('Chats data:', chats);
        // Check first chat's product structure 
        if (chats.length > 0) {
          console.log('First chat product data:', chats[0].product);
        }
      } catch (err) {
        setError('Failed to load chats');
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [user, getChats]); // Remove chats dependency to prevent infinite loop

  // Debug first chat's product data structure in detail
  useEffect(() => {
    if (chats.length > 0 && chats[0].product) {
      const product = chats[0].product;
      console.log('First chat product data (detailed):', {
        productType: typeof product,
        productValue: product,
        hasName: typeof product !== 'string' && 'name' in product ? true : false,
        hasTitle: typeof product !== 'string' && 'title' in product ? true : false,
        id: typeof product !== 'string' && '_id' in product ? product._id : 'none',
        properties: typeof product === 'object' ? Object.keys(product) : []
      });
    }
  }, [chats.length]);

  // Fetch product details if not fully populated
  useEffect(() => {
    const fetchMissingProductDetails = async () => {
      // Don't run if no chats or already loading
      if (chats.length === 0 || loading) return;
      
      // Track which products we need to fetch to avoid multiple requests
      const productsToFetch = new Set<string>();
      
      for (const chat of chats) {
        // Skip if no product reference
        if (!chat.product) {
          continue;
        }
        
        // Get product ID based on type
        let productId: string | null = null;
        
        if (typeof chat.product === 'string') {
          productId = chat.product;
        } else if (chat.product._id) {
          productId = chat.product._id;
        }
        
        // If we have an ID and haven't fetched this product yet
        if (productId && !productDetails[productId]) {
          productsToFetch.add(productId);
        }
      }
      
      console.log('Products to fetch:', [...productsToFetch]);
      
      // Only make API calls if we have new products to fetch
      if (productsToFetch.size === 0) return;
      
      // Fetch each product once
      for (const productId of productsToFetch) {
        try {
          console.log(`Fetching product ${productId}...`);
          const response = await api.get(`/products/${productId}`);
          console.log(`Product ${productId} fetched:`, response.data);
          setProductDetails(prev => ({
            ...prev,
            [productId]: response.data
          }));
        } catch (error) {
          console.error(`Error fetching product ${productId}:`, error);
        }
      }
    };
    
    fetchMissingProductDetails();
  }, [chats.length]); // Only depend on the length of chats, not the entire array

  const handleChatClick = (chat: Chat) => {
    // Debug selected chat
    console.log('Selected chat:', chat);
    console.log('Chat product:', chat.product);
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
    
    // Get the current user's ID (checking both _id and id fields)
    const currentUserId = user._id || user.id;
    
    // Check if current user is the buyer or seller
    const isBuyer = chat.buyer._id === currentUserId || chat.buyer.id === currentUserId;
    return isBuyer ? chat.seller : chat.buyer;
  };

  const getProductName = (product: any): string => {
    if (!product) return 'Not specified';
    
    // If it's a string (just ID reference)
    if (typeof product === 'string') {
      // Try to get from cached details
      if (productDetails[product] && productDetails[product].name) {
        return productDetails[product].name;
      }
      return 'Product';
    }
    
    // If it's a populated product object with name
    if (product.name) {
      return product.name;
    }
    
    // If it has _id but no name (partially populated)
    if (product._id) {
      // Check if we have cached details
      if (productDetails[product._id] && productDetails[product._id].name) {
        return productDetails[product._id].name;
      }
      
      // If we have title but not name (schema mismatch)
      if (typeof product === 'object' && 'title' in product) {
        return (product as any).title;
      }
      
      return 'Product';
    }
    
    return 'Not specified';
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
                          <p className="text-xs text-primary font-medium truncate mb-1">
                            {getProductName(chat.product) !== 'Product' ? (
                              <>Re: <span className="text-primary-foreground bg-primary rounded px-1 py-0.5 text-[10px]">{getProductName(chat.product)}</span></>
                            ) : (
                              <>Re: Product</>
                            )}
                          </p>
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
                  <div className="flex items-center">
                    <p className="text-sm text-primary mr-2">
                      Product: {getProductName(selectedChat.product) !== 'Product' ? (
                        <span className="text-primary-foreground bg-primary rounded px-1 py-0.5 text-xs">{getProductName(selectedChat.product)}</span>
                      ) : (
                        'Product'
                      )}
                    </p>
                    {selectedChat.product && (
                      <Link 
                        to={`/product/${typeof selectedChat.product === 'string' ? selectedChat.product : selectedChat.product._id}`} 
                        className="inline-flex items-center text-xs text-blue-500 hover:underline"
                        onClick={() => onOpenChange(false)}
                      >
                        <ExternalLink size={12} className="mr-1" />
                        View Product
                      </Link>
                    )}
                  </div>
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
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useSocket } from './SocketContext';
import { api } from '@/lib/api';
import { Chat, Message } from '@/types';

interface ChatContextType {
  chats: Chat[];
  currentChat: Chat | null;
  loading: boolean;
  error: string | null;
  getChats: () => Promise<void>;
  startChat: (productId: string, sellerId: string) => Promise<Chat>;
  sendMessage: (chatId: string, content: string) => Promise<Chat>;
  setCurrentChat: (chat: Chat | null) => void;
  updateChat: (updatedChat: Chat) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { socket, joinChat, leaveChat, sendMessage: socketSendMessage } = useSocket();
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle incoming real-time messages
  useEffect(() => {
    if (socket) {
      const handleMessage = (data: { chatId: string; message: Chat }) => {
        const { chatId, message: updatedChat } = data;
        
        // Update chats list
        setChats(prev => {
          const existingChat = prev.find(chat => chat._id === chatId);
          if (!existingChat) {
            return [...prev, updatedChat];
          }
          return prev.map(chat => 
            chat._id === chatId ? updatedChat : chat
          );
        });
        
        // Update current chat if it's the active chat
        if (currentChat?._id === chatId) {
          setCurrentChat(updatedChat);
        }
      };

      socket.on('message_received', handleMessage);

      return () => {
        socket.off('message_received', handleMessage);
      };
    }
  }, [socket, currentChat?._id]);

  // Join chat room when current chat changes
  useEffect(() => {
    if (socket && currentChat?._id) {
      socket.emit('join_chat', currentChat._id);
      
      return () => {
        socket.emit('leave_chat', currentChat._id);
      };
    }
  }, [socket, currentChat?._id]);

  const getChats = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await api.get('/chats/user');
      const updatedChats = response.data;
      setChats(updatedChats);
      
      // Update current chat if it exists in the new data
      if (currentChat) {
        const updatedCurrentChat = updatedChats.find(chat => chat._id === currentChat._id);
        if (updatedCurrentChat) {
          setCurrentChat(updatedCurrentChat);
        }
      }
      
      setError(null);
    } catch (err) {
      console.error('Error fetching chats:', err);
      setError('Failed to load chats');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      getChats();
    }
  }, [user, getChats]);

  const startChat = async (productId: string, sellerId: string) => {
    if (!user) {
      throw new Error('User must be logged in to start a chat');
    }

    console.log('StartChat called with:', {
      productId,
      sellerId,
      user
    });

    try {
      setLoading(true);
      
      // Get the user ID from all possible sources
      const userId = user?.id || user?._id;
      if (!userId) {
        throw new Error('User ID not found');
      }
      
      console.log('User IDs for chat:', {
        userId,
        sellerId
      });
      
      // Check if a chat already exists for this specific product
      const existingChat = chats.find(chat => {
        // Safely access properties with null checks
        if (!chat.product || !chat.seller || !chat.buyer) {
          return false;
        }
        
        const chatProductId = chat.product._id;
        const chatSellerId = chat.seller._id || chat.seller.id;
        const chatBuyerId = chat.buyer._id || chat.buyer.id;
        
        return chatProductId === productId && 
          ((chatSellerId === sellerId && (chatBuyerId === userId)) ||
           (chatBuyerId === sellerId && (chatSellerId === userId)));
      });

      if (existingChat) {
        console.log('Found existing chat:', existingChat);
        setCurrentChat(existingChat);
        joinChat(existingChat._id);
        return existingChat;
      }

      // If no existing chat for this product, create a new one
      console.log('Creating new chat with payload:', { productId, sellerId });
      
      const response = await api.post(`/chats/product/${productId}`, { 
        sellerId
      });
      
      const newChat = response.data;
      console.log('New chat created:', newChat);
      
      setCurrentChat(newChat);
      setChats(prev => [newChat, ...prev]);
      joinChat(newChat._id);
      setError(null);
      return newChat;
    } catch (err: any) {
      console.error('Error starting chat details:', {
        error: err,
        message: err.message,
        response: err.response?.data
      });
      setError(err.response?.data?.message || err.message || 'Failed to start chat');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (chatId: string, content: string) => {
    try {
      setLoading(true);
      const response = await api.post(`/chats/${chatId}/message`, { content });
      const updatedChat = response.data;
      
      // Update current chat and chats list
      setCurrentChat(updatedChat);
      setChats(prev => prev.map(chat => 
        chat._id === chatId ? updatedChat : chat
      ));
      
      // Send message through socket
      if (socket) {
        socket.emit('new_message', {
          chatId,
          message: updatedChat
        });
      }
      
      setError(null);
      return updatedChat;
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateChat = (updatedChat: Chat) => {
    setChats(prev => prev.map(chat => 
      chat._id === updatedChat._id ? updatedChat : chat
    ));
    if (currentChat?._id === updatedChat._id) {
      setCurrentChat(updatedChat);
    }
  };

  return (
    <ChatContext.Provider value={{
      chats,
      currentChat,
      loading,
      error,
      getChats,
      startChat,
      sendMessage,
      setCurrentChat,
      updateChat
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}; 
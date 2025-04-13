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
    try {
      setLoading(true);
      
      // Check if a chat already exists for this specific product
      const existingChat = chats.find(chat => 
        chat.product._id === productId && 
        ((chat.seller._id === sellerId && chat.buyer._id === user?._id) ||
         (chat.buyer._id === sellerId && chat.seller._id === user?._id))
      );

      if (existingChat) {
        setCurrentChat(existingChat);
        joinChat(existingChat._id);
        return existingChat;
      }

      // If no existing chat for this product, create a new one
      const response = await api.post(`/chats/product/${productId}`, { 
        sellerId
      });
      
      const newChat = response.data;
      setCurrentChat(newChat);
      setChats(prev => [newChat, ...prev]);
      joinChat(newChat._id);
      setError(null);
      return newChat;
    } catch (err) {
      console.error('Error starting chat:', err);
      setError('Failed to start chat');
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
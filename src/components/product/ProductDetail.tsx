import React, { useState, useEffect, useRef } from 'react';
import { Heart, Share2, MapPin, Calendar, RefreshCw, Shield, Phone, MessageSquare, ArrowLeft, ArrowRight, Trash2, Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Product, User, Message, Chat } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';
import { useNavigate, useParams } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { getProductById } from '@/lib/api';
import { format } from 'date-fns';
import { api } from '@/lib/api';
import { toast } from 'sonner';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { 
    startChat, 
    currentChat, 
    sendMessage, 
    chats, 
    getChats,
    setCurrentChat 
  } = useChat();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [previousChats, setPreviousChats] = useState<Chat[]>([]);
  const [loadingChats, setLoadingChats] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id!);
        console.log('Product data:', data);
        console.log('Seller data:', data.seller);
        console.log('Seller phone:', data.seller.phone);
        setProduct(data);
      } catch (err) {
        setError('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  useEffect(() => {
    if (showChat && user && product) {
      const fetchChats = async () => {
        setLoadingChats(true);
        try {
          await getChats();
          const chatsWithSeller = chats.filter(
            chat => chat.seller._id === product.seller._id || chat.buyer._id === product.seller._id
          );
          setPreviousChats(chatsWithSeller);
          if (chatsWithSeller.length > 0) {
            const allMessages = chatsWithSeller.flatMap(chat => chat.messages);
            setMessages(allMessages);
          }
        } catch (error) {
          console.error('Error fetching chats:', error);
          setError('Failed to load chat history');
        } finally {
          setLoadingChats(false);
        }
      };

      fetchChats();
    }
  }, [showChat, user, product]);

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
  }, [messages.length]); // Only scroll when new messages are added

  const handleStartChat = async () => {
    if (!user || !product) {
      toast.error('You must be logged in to chat with sellers');
      return;
    }

    // Check if seller information is valid
    if (!product.seller) {
      toast.error('Seller information is not available');
      return;
    }

    // Safely get seller ID
    const sellerId = typeof product.seller === 'string' 
      ? product.seller 
      : product.seller._id || product.seller.id;

    if (!sellerId) {
      toast.error('Cannot identify seller. Please try again later.');
      return;
    }

    // Don't allow users to chat with themselves
    if (isUserSeller) {
      toast.error('You cannot chat with yourself as the seller');
      return;
    }

    try {
      setLoadingChats(true);
      
      // Debug information
      console.log('Starting chat with:', { 
        productId: product._id, 
        sellerId,
        user: user
      });
      
      const newChat = await startChat(product._id, sellerId);
      console.log('Chat started successfully:', newChat);
      setCurrentChat(newChat);
      setMessages(newChat.messages || []);
      setShowChat(true);
    } catch (error: any) {
      console.error('Error starting chat:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to start chat';
      toast.error(errorMessage);
      
      // Detailed error logging
      if (error?.response) {
        console.error('API Response Error:', {
          status: error.response.status,
          data: error.response.data
        });
      }
    } finally {
      setLoadingChats(false);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !currentChat) return;

    try {
      const updatedChat = await sendMessage(currentChat._id, message.trim());
      setMessages(prev => [...prev, ...updatedChat.messages.slice(-1)]);
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  useEffect(() => {
    if (showChat && currentChat && (!messages.length || messages[0]?.sender._id !== currentChat.messages[0]?.sender._id)) {
      // Only reset messages if we're switching to a different chat or if there are no messages loaded
      setMessages(currentChat.messages || []);
    }
  }, [showChat, currentChat?._id]); // Only depend on chat ID, not the entire chat object

  const handleDeleteListing = async () => {
    if (!user || !product) {
      return;
    }

    const sellerId = typeof product.seller === 'string' ? product.seller : product.seller._id;
    const userId = user.id || user._id || JSON.parse(localStorage.getItem('user') || '{}').id;

    // Compare seller ID with user ID
    if (!userId || !sellerId || userId !== sellerId) {
      console.log('Not authorized to delete:', { userId, sellerId });
      return;
    }

    if (!window.confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/products/${product._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete listing');
      }

      toast('Listing deleted successfully', {
        description: 'Your listing has been removed.',
        duration: 3000,
      });
      navigate('/');
    } catch (error) {
      console.error('Error deleting listing:', error);
      toast('Failed to delete listing', {
        description: 'There was an error deleting your listing. Please try again.',
        duration: 3000,
      });
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast('Link copied to clipboard!', {
        description: 'You can now share this product with others.',
        duration: 2000,
      });
      // Reset the copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast('Failed to copy link', {
        description: 'Please try again.',
        duration: 2000,
      });
    }
  };

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return '/placeholder.svg';
    
    // If it's already a full URL (starts with http or https), return as is
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    
    // Convert Windows-style backslashes to forward slashes
    const normalizedPath = imagePath.replace(/\\/g, '/');
    
    // For local paths, ensure they start with a slash
    const finalPath = normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`;
    return `${baseUrl}${finalPath}`;
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!product) return <div>Product not found</div>;

  // Get the seller ID, handling both populated and unpopulated cases
  const sellerId = typeof product.seller === 'string' ? product.seller : product.seller._id;
  const userId = user?.id || user?._id || JSON.parse(localStorage.getItem('user') || '{}').id;
  const isUserSeller = Boolean(userId && sellerId && userId === sellerId);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Images */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-lg overflow-hidden shadow-md mb-6">
            <div className="relative">
              <img 
                src={getImageUrl(product.images[currentImageIndex])} 
                alt={product.name} 
                className="w-full h-96 object-contain transition-transform duration-700 hover:scale-105" 
              />
              {product.images && product.images.length > 1 && (
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-between">
                  <button
                    onClick={() => setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length)}
                    className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full ml-4 transition-all duration-300"
                  >
                    <ArrowLeft size={24} />
                  </button>
                  <button
                    onClick={() => setCurrentImageIndex((prev) => (prev + 1) % product.images.length)}
                    className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full mr-4 transition-all duration-300"
                  >
                    <ArrowRight size={24} />
                  </button>
                </div>
              )}
            </div>
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 p-4 overflow-x-auto">
                {product.images.map((image, index) => (
                  <img
                    key={index}
                    src={getImageUrl(image)}
                    alt={`${product.name} - Image ${index + 1}`}
                    className={`w-20 h-20 object-cover rounded-lg cursor-pointer transition-all duration-300 ${
                      index === currentImageIndex 
                        ? 'ring-2 ring-primary scale-105' 
                        : 'hover:opacity-80'
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            )}
          </div>
          
          <div className="bg-card rounded-lg shadow-md p-6 mb-6">
            <h1 className="text-2xl font-bold text-foreground mb-4">{product.name}</h1>
            <div className="flex items-center text-muted-foreground mb-6">
              <Calendar size={16} className="mr-1 transition-transform hover:scale-110" />
              <span>Posted: {new Date(product.createdAt).toLocaleDateString()}</span>
            </div>
            
            <div className="text-3xl font-bold text-primary mb-8">
              ₹{product.price.toLocaleString()}
            </div>
            
            <h2 className="text-xl font-semibold text-foreground mb-3">Description</h2>
            <p className="text-muted-foreground mb-6">{product.description}</p>
            
            <div className="flex gap-4">
              <Button 
                variant="outline" 
                className="flex items-center transition-all duration-200 hover:bg-accent group"
                onClick={handleShare}
              >
                {copied ? (
                  <Check 
                    size={18} 
                    className="mr-2 text-green-500 transition-all duration-300 group-hover:scale-110" 
                  />
                ) : (
                  <Share2 
                    size={18} 
                    className="mr-2 text-muted-foreground group-hover:text-primary transition-all duration-300 group-hover:scale-110" 
                  />
                )}
                {copied ? 'Copied!' : 'Share'}
              </Button>
              {isUserSeller && (
                <Button 
                  variant="destructive"
                  className="flex items-center transition-all duration-200 group ml-auto"
                  onClick={handleDeleteListing}
                >
                  <Trash2 
                    size={18} 
                    className="mr-2 transition-all duration-300 group-hover:scale-110" 
                  />
                  Delete Listing
                </Button>
              )}
            </div>
          </div>
          
          {/* Details Section */}
          <div className="bg-card rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <span className="text-muted-foreground capitalize">Category</span>
                <span className="font-medium text-foreground">{product.category}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground capitalize">Condition</span>
                <span className="font-medium text-foreground">{product.condition}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Column - Seller Info & Actions */}
        <div className="space-y-6">
          <div className="bg-card rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Seller Information</h2>
            {product?.seller ? (
              <>
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mr-4 transition-all duration-300 hover:shadow-md hover:bg-primary hover:text-primary-foreground">
                    <img 
                      src={product.seller.profile_picture 
                        ? (product.seller.profile_picture.startsWith('http') 
                            ? product.seller.profile_picture 
                            : getImageUrl(product.seller.profile_picture))
                        : "/placeholder.svg"} 
                      alt={product.seller.name || 'Seller'} 
                      className="w-full h-full rounded-full object-cover" 
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{product.seller.name || 'Anonymous Seller'}</h3>
                    <p className="text-sm text-muted-foreground">Verified Seller</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Display phone number with improved error handling */}
                  <div className="flex items-center gap-2 py-2 px-3 bg-muted rounded-md">
                    <Phone size={18} className="text-primary" />
                    <div className="flex-1">
                      <span className="text-sm text-muted-foreground block">Phone Number:</span>
                      {typeof product.seller === 'object' ? (
                        product.seller.phone ? (
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{product.seller.phone}</span>
                            <button
                              onClick={async () => {
                                try {
                                  await navigator.clipboard.writeText(product.seller.phone);
                                  toast('Phone number copied!', {
                                    description: 'The phone number has been copied to your clipboard.',
                                    duration: 2000,
                                  });
                                } catch (err) {
                                  toast('Failed to copy phone number', {
                                    description: 'Please try again.',
                                    duration: 2000,
                                  });
                                }
                              }}
                              className="p-1 rounded-full hover:bg-accent transition-colors duration-200"
                              title="Copy phone number"
                            >
                              <Copy size={14} className="text-muted-foreground hover:text-primary" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-muted-foreground italic">Not provided by seller</span>
                        )
                      ) : (
                        <span className="text-muted-foreground italic">Loading seller details...</span>
                      )}
                    </div>
                  </div>

                  {/* Only show chat button if user is not the seller */}
                  {user && !isUserSeller && (
                    <Button
                      onClick={handleStartChat}
                      variant="outline"
                      className="w-full flex items-center justify-center gap-2 transition-all duration-200 hover:bg-accent"
                    >
                      <MessageSquare size={18} className="text-primary" />
                      Chat with Seller
                    </Button>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center text-muted-foreground">
                Seller information not available
              </div>
            )}
          </div>
          
          <div className="bg-card rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Safety Tips</h2>
            <ul className="space-y-3">
              <li className="flex items-start group">
                <Shield size={16} className="text-primary mt-1 mr-2 flex-shrink-0 transition-transform group-hover:scale-110" />
                <span className="text-sm">Meet in a safe, public location</span>
              </li>
              <li className="flex items-start group">
                <Shield size={16} className="text-primary mt-1 mr-2 flex-shrink-0 transition-transform group-hover:scale-110" />
                <span className="text-sm">Check the item before you buy</span>
              </li>
              <li className="flex items-start group">
                <Shield size={16} className="text-primary mt-1 mr-2 flex-shrink-0 transition-transform group-hover:scale-110" />
                <span className="text-sm">Pay only after inspecting the item</span>
              </li>
              <li className="flex items-start group">
                <RefreshCw size={16} className="text-primary mt-1 mr-2 flex-shrink-0 transition-transform group-hover:scale-110 group-hover:rotate-45" />
                <span className="text-sm">Read our safety guidelines</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Only render chat dialog if user is not the seller */}
      {user && !isUserSeller && (
        <Dialog open={showChat} onOpenChange={setShowChat}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Chat with {product?.seller?.name || 'Seller'}</DialogTitle>
              <DialogDescription>
                {previousChats.length > 0 
                  ? `You have ${previousChats.length} previous conversation${previousChats.length > 1 ? 's' : ''} with this seller.`
                  : 'Start a new conversation with the seller about this item.'}
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col h-[400px]">
              <div 
                ref={messagesContainerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto p-4"
              >
                {loadingChats ? (
                  <div className="text-center py-4">Loading previous messages...</div>
                ) : messages.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {messages.map((msg) => (
                      <div key={msg._id}>
                        <span className="text-sm text-muted-foreground">
                          {msg.sender.name}:
                        </span>
                        <div className="rounded-lg px-3 py-2 bg-muted">
                          <p className="text-sm">{msg.content}</p>
                          <p className="text-xs mt-1 opacity-70">
                            {format(new Date(msg.timestamp), 'h:mm a')}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    No previous messages. Start the conversation!
                  </div>
                )}
              </div>
              <div className="border-t p-4">
                <div className="flex gap-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button onClick={handleSendMessage} disabled={!message.trim()}>Send</Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ProductDetail;

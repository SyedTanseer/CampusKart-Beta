import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, MapPin, Menu, X, Bell, MessageSquare, Heart, User, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useIsMobile } from '@/hooks/use-mobile';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import LoginModal from '../auth/LoginModal';
import { useAuth } from '../../contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { LogOut } from 'lucide-react';
import ChatList from '../chat/ChatList';
import { searchProducts } from '@/lib/api';

const Header = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [showChatList, setShowChatList] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  const handleSellClick = () => {
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }
    navigate('/sell');
  };

  const handleChatClick = () => {
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }
    setShowChatList(true);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      setIsSearching(true);
      const results = await searchProducts(searchQuery);
      // Navigate to search results page or update state
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    } catch (error) {
      console.error('Error searching products:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getInitials = (name: string | undefined | null) => {
    if (!name) return 'U';
    
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname === '/') {
      window.location.reload();
    } else {
      navigate('/');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-background border-b">
      {/* Main Header */}
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Logo and toggle for mobile */}
          <div className="flex items-center">
            {isMobile && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleMenu}
                className="mr-2"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </Button>
            )}
            <Link to="/" onClick={handleLogoClick} className="flex items-center">
              <h1 className="text-2xl font-bold text-primary">CampusKart</h1>
            </Link>
          </div>

          {/* Location text (hidden on mobile) */}
          {!isMobile && (
            <div className="relative mx-4 hidden md:flex items-center min-w-[200px]">
              <MapPin size={18} className="text-muted-foreground absolute left-2" />
              <span className="pl-9 text-muted-foreground">SRM, KTR</span>
            </div>
          )}

          {/* Search bar (hidden on mobile) */}
          {!isMobile && (
            <div className="flex-1 max-w-2xl mx-4">
              <div className="relative">
                <Input 
                  type="text" 
                  placeholder="Find Textbooks, Electronics, Dorm Supplies and more..." 
                  className="w-full pl-10 pr-4 py-2"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-0 top-0 h-full"
                  onClick={handleSearch}
                  disabled={isSearching}
                >
                  <Search size={18} className="text-muted-foreground" />
                </Button>
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>
          )}

          {/* Right side buttons */}
          <div className="flex items-center space-x-2">
            {!isMobile && (
              <>
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={handleSellClick}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Plus size={16} className="mr-2" />
                  Sell
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={handleChatClick}
                  className="relative"
                >
                  <MessageSquare size={24} className="text-muted-foreground hover:text-foreground transition-colors" />
                </Button>
                {isAuthenticated ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user?.profile_picture || ''} alt={user?.name || ''} />
                          <AvatarFallback>{user ? getInitials(user.name) : 'U'}</AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                      <DropdownMenuItem 
                        className="flex items-center cursor-pointer"
                        onClick={() => navigate('/profile')}
                      >
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="flex items-center text-red-600"
                        onClick={handleLogout}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Logout</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={handleLoginClick}
                  >
                    <User size={24} className="text-muted-foreground hover:text-foreground transition-colors" />
                  </Button>
                )}
              </>
            )}
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile search bar */}
        {isMobile && (
          <div className="mt-2">
            <div className="relative">
              <Input 
                type="text" 
                placeholder="Find Textbooks, Electronics, Dorm Supplies and more..." 
                className="w-full pl-10 pr-4 py-2"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute right-0 top-0 h-full"
                onClick={handleSearch}
                disabled={isSearching}
              >
                <Search size={18} className="text-muted-foreground" />
              </Button>
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>
        )}
      </div>

      {/* Mobile menu */}
      {isMobile && isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-background">
          <div className="flex flex-col h-full">
            {/* Mobile menu header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Menu</h2>
              <div className="flex items-center space-x-2">
                <ThemeToggle />
                <Button variant="ghost" size="icon" onClick={toggleMenu}>
                  <X size={24} />
                </Button>
              </div>
            </div>

            {/* Mobile menu content */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="flex items-center space-x-2 mb-6">
                <MapPin size={20} className="text-muted-foreground" />
                <span>SRM, KTR</span>
              </div>

              <ul className="flex flex-col space-y-2">
                <li>
                  <button 
                    onClick={handleSellClick}
                    className="flex items-center p-2 hover:bg-accent hover:text-accent-foreground rounded transition-colors w-full"
                  >
                    <Plus size={20} className="mr-2" />
                    <span>Sell</span>
                  </button>
                </li>
                <li>
                  <button 
                    onClick={handleChatClick}
                    className="flex items-center p-2 hover:bg-accent hover:text-accent-foreground rounded transition-colors w-full"
                  >
                    <MessageSquare size={20} className="mr-2" />
                    <span>Chat</span>
                  </button>
                </li>
                <li>
                  {isAuthenticated ? (
                    <button 
                      onClick={handleLogout}
                      className="flex items-center p-2 hover:bg-accent hover:text-accent-foreground rounded transition-colors w-full"
                    >
                      <User size={20} className="mr-2" />
                      <span>Logout</span>
                    </button>
                  ) : (
                    <button 
                      onClick={handleLoginClick}
                      className="flex items-center p-2 hover:bg-accent hover:text-foreground rounded transition-colors w-full"
                    >
                      <User size={20} className="mr-2" />
                      <span>Login</span>
                    </button>
                  )}
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />

      {/* Chat List */}
      <ChatList isOpen={showChatList} onOpenChange={setShowChatList} />
    </header>
  );
};

export default Header;

import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import PlaceholderImage from '@/components/ui/placeholder-image';
import { Product } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
  onRemove?: () => void;
}

const getDefaultProductImage = (category: string): string => {
  const defaults: Record<string, string> = {
    textbooks: '/images/categories/textbook.jpg',
    electronics: '/images/categories/electronics.jpg',
    'dorm-supplies': '/images/categories/dorm.jpg',
    'course-notes': '/images/categories/notes.jpg',
    bikes: '/images/categories/bike.jpg',
    accessories: '/images/categories/accessories.jpg',
    furniture: '/images/categories/furniture.jpg',
    clothing: '/images/categories/clothing.jpg',
    'event-tickets': '/images/categories/tickets.jpg'
  };
  return defaults[category] || '/images/defaults/placeholder.jpg';
};

const ProductCard: React.FC<ProductCardProps> = ({ product, onRemove }) => {
  const { user } = useAuth();
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  
  // Check if user is the seller of this product or has admin/developer privileges
  const isUserSeller = user && product.seller && 
    (user.id === product.seller._id || user._id === product.seller._id);
  
  const isAdminOrDeveloper = user?.user_type === 'admin' || user?.user_type === 'developer';
  const canDeleteProduct = isUserSeller || isAdminOrDeveloper;
  
  const imageUrl = product.images && product.images.length > 0 
    ? product.images[0].startsWith('http') 
      ? product.images[0] 
      : `${baseUrl}/${product.images[0]}`
    : getDefaultProductImage(product.category);

  const handleRemove = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation(); // Prevent event bubbling

    if (!window.confirm('Are you sure you want to remove this listing?')) {
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/api/products/${product._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to remove listing');
      }

      toast.success('Listing removed successfully');
      if (onRemove) {
        onRemove();
      }
    } catch (error) {
      console.error('Error removing listing:', error);
      toast.error('Failed to remove listing');
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <Link to={`/product/${product._id}`}>
        <div className="aspect-square relative">
          <PlaceholderImage
            src={imageUrl}
            alt={product.name}
            className="object-cover w-full h-full"
          />
          <Badge 
            className="absolute top-2 right-2" 
            variant={product.condition === 'new' ? 'default' : 'secondary'}
          >
            {product.condition}
          </Badge>
          {canDeleteProduct && (
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 left-2"
              onClick={handleRemove}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
        <CardHeader className="p-4">
          <h3 className="font-semibold text-lg truncate">{product.name}</h3>
          <p className="text-2xl font-bold text-primary">₹{product.price.toLocaleString('en-IN')}</p>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between items-center">
          <span className="text-sm text-muted-foreground">
            Seller: {product.seller?.name || 'Unknown'}
          </span>
          <span className="text-sm text-muted-foreground">
            Posted: {product.createdAt ? 
              new Date(product.createdAt).toLocaleDateString() : 'N/A'}
          </span>
        </CardFooter>
      </Link>
    </Card>
  );
};

export default ProductCard;

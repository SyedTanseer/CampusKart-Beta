import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import PlaceholderImage from '@/components/ui/placeholder-image';
import { Product } from '@/data/products';

interface ProductCardProps {
  product: Product;
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

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <Link to={`/product/${product.id}`}>
        <div className="aspect-square relative">
          <PlaceholderImage
            src={product.image || getDefaultProductImage(product.category)}
            alt={product.title}
            className="object-cover w-full h-full"
          />
          <Badge 
            className="absolute top-2 right-2" 
            variant={product.condition === 'New' ? 'default' : 'secondary'}
          >
            {product.condition}
          </Badge>
        </div>
        <CardHeader className="p-4">
          <h3 className="font-semibold text-lg truncate">{product.title}</h3>
          <p className="text-2xl font-bold text-primary">₹{product.price.toLocaleString('en-IN')}</p>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Seller: {product.seller}</span>
          <span className="text-sm text-muted-foreground">
            {new Date(product.createdAt).toLocaleDateString()}
          </span>
        </CardFooter>
      </Link>
    </Card>
  );
};

export default ProductCard;

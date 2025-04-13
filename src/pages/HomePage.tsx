import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { getProducts, getProductsByCategory, searchProducts } from '@/lib/api';
import { Product } from '@/types';
import ProductCard from '@/components/product/ProductCard';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'textbooks', name: 'Textbooks' },
    { id: 'electronics', name: 'Electronics' },
    { id: 'furniture', name: 'Furniture' },
    { id: 'clothing', name: 'Clothing' },
    { id: 'other', name: 'Other' },
  ];

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      let data;
      if (selectedCategory === 'all') {
        data = await getProducts();
      } else {
        data = await getProductsByCategory(selectedCategory);
      }
      setProducts(data);
    } catch (err) {
      setError('Failed to fetch products. Please try again later.');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchProducts();
      return;
    }

    try {
      setIsSearching(true);
      setError(null);
      const data = await searchProducts(searchQuery);
      setProducts(data);
    } catch (err) {
      setError('Failed to search products. Please try again later.');
      console.error('Error searching products:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSellClick = () => {
    if (!user) {
      navigate('/login');
    } else {
      navigate('/sell');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to CampusKart</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Buy and sell items within your campus community
        </p>
        <div className="flex justify-center gap-4">
          <Button size="lg" onClick={handleSellClick}>
            Sell an Item
          </Button>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Categories</h2>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </Button>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-6">Featured Items</h2>
        {loading ? (
          <div className="text-center py-8">Loading products...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold mb-6">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-2">1. List Your Item</h3>
              <p className="text-gray-600">
                Create a listing with photos and details about your item
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-2">2. Connect with Buyers</h3>
              <p className="text-gray-600">
                Chat with interested buyers within your campus
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-2">3. Meet & Sell</h3>
              <p className="text-gray-600">
                Arrange a safe meeting point to complete the transaction
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 
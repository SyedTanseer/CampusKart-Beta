import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { searchProducts } from '@/lib/api';
import { Product } from '@/types';
import ProductCard from '@/components/product/ProductCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const SearchResults: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) {
        setLoading(false);
        setProducts([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const results = await searchProducts(query);
        setProducts(results);
      } catch (err) {
        console.error('Error searching products:', err);
        setError('Failed to search products. Please try again later.');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleBack}
          className="mr-2"
        >
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-2xl font-bold">
          {query ? `Search Results for "${query}"` : 'Search Results'}
        </h1>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p>Searching for products...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">
          <p>{error}</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => navigate('/')}
          >
            Return to Home
          </Button>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl mb-4">No products found matching your search.</p>
          <p className="text-muted-foreground mb-4">Try different keywords or browse categories.</p>
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
          >
            Browse All Products
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults; 
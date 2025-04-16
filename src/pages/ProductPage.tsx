import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ProductLayout from '@/components/layout/ProductLayout';
import ProductDetail from '@/components/product/ProductDetail';
import { getProductById } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Product } from '@/types';

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await getProductById(id);
        setProduct(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);
  
  if (loading) {
    return (
      <ProductLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <p>Loading product details...</p>
        </div>
      </ProductLayout>
    );
  }

  if (error || !product) {
    return (
      <ProductLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="mb-8">The product you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/')}>
            Back to Home
          </Button>
        </div>
      </ProductLayout>
    );
  }
  
  return (
    <ProductLayout>
      <div className="bg-background min-h-screen">
        <div className="container mx-auto px-4 py-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)} 
            className="flex items-center text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to results
          </Button>
          
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground animate-in fade-in duration-500">
              {product.name}
            </h1>
            <p className="text-muted-foreground mt-2 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-150">
              {product.category.charAt(0).toUpperCase() + product.category.slice(1)} | {product.condition.charAt(0).toUpperCase() + product.condition.slice(1)} Condition
            </p>
          </div>
          
          <ProductDetail />
        </div>
      </div>
    </ProductLayout>
  );
};

export default ProductPage;

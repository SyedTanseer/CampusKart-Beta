
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import ProductDetail from '@/components/product/ProductDetail';
import { products } from '@/data/mockData';
import { Button } from '@/components/ui/button';

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const product = products.find(p => p.id === id);
  
  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="mb-8">The product you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/')}>
            Back to Home
          </Button>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="bg-gray-100 min-h-screen">
        <div className="container mx-auto px-4 py-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)} 
            className="flex items-center text-marketplace-secondary mb-4"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to results
          </Button>
          
          <ProductDetail product={product} />
        </div>
      </div>
    </Layout>
  );
};

export default ProductPage;

import React from 'react';
import Layout from '@/components/layout/Layout';
import { products } from '@/data/mockData';
import ProductCard from '../product/ProductCard';

interface CategoryPageProps {
  categoryId: string;
  categoryName: string;
}

const CategoryPage: React.FC<CategoryPageProps> = ({ categoryId, categoryName }) => {
  // Filter products by category
  const categoryProducts = products.filter(product => product.category === categoryId);

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-foreground mb-8">{categoryName}</h1>
          
          {categoryProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {categoryProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  title={product.title}
                  price={product.price}
                  description={product.description}
                  location={product.location}
                  imageUrl={product.imageUrl}
                  date={product.date}
                  featured={product.featured}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No products found in this category yet.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CategoryPage; 
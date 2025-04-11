import React from 'react';
import Layout from '@/components/layout/Layout';
import HomeHero from '@/components/home/HomeHero';
import HomeSection from '@/components/home/HomeSection';
import { products } from '@/data/mockData';

const Index = () => {
  // Get featured products
  const featuredProducts = products.filter(product => product.featured);
  
  // Get products by category
  const getProductsByCategory = (categoryId: string, limit = 4) => {
    return products
      .filter(product => product.category === categoryId)
      .slice(0, limit);
  };

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Categories Hero Section */}
        <HomeHero />
        
        {/* Featured Products Section */}
        <section className="py-8 bg-card">
          <div className="container mx-auto px-4">
            <HomeSection 
              title="Featured Products"
              categoryId="featured"
              viewAllUrl="/category/featured"
              products={featuredProducts}
            />
          </div>
        </section>

        {/* Textbooks Section */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6">Textbooks</h2>
            <HomeSection 
              title="Textbooks"
              categoryId="textbooks"
              viewAllUrl="/category/textbooks"
              products={getProductsByCategory('textbooks')}
            />
          </div>
        </section>

        {/* Electronics Section */}
        <section className="py-8 bg-card">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6">Electronics</h2>
            <HomeSection 
              title="Electronics"
              categoryId="electronics"
              viewAllUrl="/category/electronics"
              products={getProductsByCategory('electronics')}
            />
          </div>
        </section>

        {/* Dorm Supplies Section */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6">Dorm Supplies</h2>
            <HomeSection 
              title="Dorm Supplies"
              categoryId="dorm-supplies"
              viewAllUrl="/category/dorm-supplies"
              products={getProductsByCategory('dorm-supplies')}
            />
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Index;

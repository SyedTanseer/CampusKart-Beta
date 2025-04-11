
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import ProductCard from '../product/ProductCard';

interface HomeSectionProps {
  title: string;
  categoryId: string;
  viewAllUrl: string;
  products: Array<{
    id: string;
    title: string;
    price: number;
    description: string;
    location: string;
    imageUrl: string;
    date: string;
    featured?: boolean;
  }>;
}

const HomeSection: React.FC<HomeSectionProps> = ({
  title,
  categoryId,
  viewAllUrl,
  products,
}) => {
  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-marketplace-secondary">{title}</h2>
          <Link 
            to={viewAllUrl} 
            className="text-marketplace-primary hover:text-marketplace-primary/80 flex items-center"
          >
            View All
            <ChevronRight size={16} className="ml-1" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map(product => (
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
      </div>
    </section>
  );
};

export default HomeSection;

import React from 'react';
import { categories } from '@/data/mockData';
import CategoryCard from '../category/CategoryCard';

const HomeHero = () => {
  return (
    <div className="bg-card py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-foreground text-center mb-8">
          Categories
        </h1>
        
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-2 md:gap-4">
          {categories.map((category) => (
            <CategoryCard 
              key={category.id}
              icon={category.icon}
              name={category.name}
              url={category.url}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeHero;

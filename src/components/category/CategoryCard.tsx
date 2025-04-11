import React from 'react';
import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

interface CategoryCardProps {
  icon: LucideIcon;
  name: string;
  url: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ icon: Icon, name, url }) => {
  return (
    <Link 
      to={url}
      className="flex flex-col items-center justify-center p-4 rounded-lg hover:bg-marketplace-light transition duration-200"
    >
      <div className="w-16 h-16 rounded-full bg-marketplace-light flex items-center justify-center mb-2 group overflow-hidden transition-all duration-300 hover:shadow-md hover:bg-marketplace-primary/10">
        <Icon 
          size={32} 
          className="text-marketplace-primary transform transition-all duration-300 group-hover:scale-125 group-hover:text-marketplace-secondary" 
        />
      </div>
      <span className="text-sm font-medium text-marketplace-secondary text-center group-hover:font-semibold transition-all duration-200">
        {name}
      </span>
    </Link>
  );
};

export default CategoryCard;

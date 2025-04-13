import React from 'react';

interface ProductLayoutProps {
  children: React.ReactNode;
}

const ProductLayout: React.FC<ProductLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <main className="flex-grow">
        {children}
      </main>
    </div>
  );
};

export default ProductLayout; 
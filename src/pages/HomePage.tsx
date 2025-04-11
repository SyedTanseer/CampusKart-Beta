import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { categories } from '@/data/categories';
import { products } from '@/data/products';
import ProductCard from '@/components/product/ProductCard';

const HomePage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Welcome to CampusKart</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Buy and sell items within your campus community
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild>
            <Link to="/sell">Sell an Item</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/category/textbooks">Browse Textbooks</Link>
          </Button>
        </div>
      </div>

      {/* Categories Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6">Browse Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => {
            const categoryProducts = products.filter(p => p.category === category.slug).slice(0, 3);
            return (
              <Card key={category.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>{category.name}</span>
                    <Button variant="link" asChild className="text-sm">
                      <Link to={`/category/${category.slug}`}>View All</Link>
                    </Button>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {categoryProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                    {categoryProducts.length === 0 && (
                      <p className="text-center text-muted-foreground py-4">
                        No items listed yet
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>1. Create a Listing</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Take photos and write a description of your item
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>2. Connect with Buyers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Chat with interested buyers and arrange meetups
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>3. Make the Sale</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Meet on campus and complete the transaction safely
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 
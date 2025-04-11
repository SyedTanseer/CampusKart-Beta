
import React from 'react';
import { Heart, Share2, MapPin, Calendar, RefreshCw, Shield, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface ProductDetailProps {
  product: {
    id: string;
    title: string;
    price: number;
    description: string;
    location: string;
    imageUrl: string;
    category: string;
    date: string;
    featured?: boolean;
    seller: {
      id: string;
      name: string;
      joinDate: string;
      rating: number;
    };
    details: Record<string, any>;
  };
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Images */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg overflow-hidden shadow-md mb-6">
            <img 
              src={product.imageUrl || "/placeholder.svg"} 
              alt={product.title} 
              className="w-full h-96 object-contain transition-transform duration-700 hover:scale-105" 
            />
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h1 className="text-2xl font-bold text-marketplace-secondary mb-4">{product.title}</h1>
            <div className="flex items-center text-gray-500 mb-6">
              <MapPin size={16} className="mr-1 transition-transform hover:scale-110" />
              <span className="mr-4">{product.location}</span>
              <Calendar size={16} className="mr-1 transition-transform hover:scale-110" />
              <span>Posted: {product.date}</span>
            </div>
            
            <div className="text-3xl font-bold text-marketplace-primary mb-8">
              ₹{product.price.toLocaleString()}
            </div>
            
            <h2 className="text-xl font-semibold text-marketplace-secondary mb-3">Description</h2>
            <p className="text-gray-700 mb-6">{product.description}</p>
            
            <div className="flex space-x-4">
              <Button 
                variant="outline" 
                className="flex items-center transition-all duration-200 hover:bg-red-50 group"
              >
                <Heart 
                  size={18} 
                  className="mr-2 text-gray-500 group-hover:text-red-500 transition-all duration-300 group-hover:scale-110" 
                />
                Save
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center transition-all duration-200 hover:bg-blue-50 group"
              >
                <Share2 
                  size={18} 
                  className="mr-2 text-gray-500 group-hover:text-blue-500 transition-all duration-300 group-hover:scale-110" 
                />
                Share
              </Button>
            </div>
          </div>
          
          {/* Details Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-marketplace-secondary mb-4">Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(product.details).map(([key, value]) => {
                // Handle arrays (like features)
                if (Array.isArray(value)) {
                  return (
                    <div key={key} className="col-span-2">
                      <h3 className="text-lg font-medium capitalize mb-2">{key}</h3>
                      <ul className="list-disc pl-5">
                        {value.map((item, index) => (
                          <li key={index} className="text-gray-700">{item}</li>
                        ))}
                      </ul>
                    </div>
                  );
                }
                
                // Handle regular key-value pairs
                return (
                  <div key={key} className="flex flex-col">
                    <span className="text-gray-500 capitalize">{key}</span>
                    <span className="font-medium">{value}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Right Column - Seller Info & Actions */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-marketplace-secondary mb-4">Seller Information</h2>
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 bg-marketplace-light rounded-full flex items-center justify-center mr-4 transition-all duration-300 hover:shadow-md hover:bg-marketplace-primary hover:text-white">
                <span className="text-2xl font-bold text-marketplace-primary transition-colors duration-300 hover:text-white">
                  {product.seller.name.charAt(0)}
                </span>
              </div>
              <div>
                <h3 className="font-semibold">{product.seller.name}</h3>
                <p className="text-sm text-gray-500">Member since {product.seller.joinDate}</p>
                <div className="flex items-center mt-1">
                  {/* Star Rating */}
                  <div className="flex">
                    {Array(5).fill(0).map((_, i) => (
                      <svg 
                        key={i} 
                        className={`w-4 h-4 ${i < Math.floor(product.seller.rating) ? 'text-yellow-400' : 'text-gray-300'} transition-transform hover:scale-110`} 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24" 
                        fill="currentColor"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                  <span className="ml-1 text-sm text-gray-500">{product.seller.rating}</span>
                </div>
              </div>
            </div>
            <Separator className="my-4" />
            <Button className="w-full bg-marketplace-primary hover:bg-marketplace-primary/90 text-white mb-3 transition-transform hover:scale-[1.02] hover:shadow-md group">
              <Phone size={18} className="mr-2 transition-transform group-hover:scale-110" />
              Show Phone Number
            </Button>
            <Button className="w-full transition-transform hover:scale-[1.02] hover:shadow-md group" variant="outline">
              Chat with Seller
            </Button>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-marketplace-secondary mb-4">Safety Tips</h2>
            <ul className="space-y-3">
              <li className="flex items-start group">
                <Shield size={16} className="text-marketplace-primary mt-1 mr-2 flex-shrink-0 transition-transform group-hover:scale-110" />
                <span className="text-sm">Meet in a safe, public location</span>
              </li>
              <li className="flex items-start group">
                <Shield size={16} className="text-marketplace-primary mt-1 mr-2 flex-shrink-0 transition-transform group-hover:scale-110" />
                <span className="text-sm">Check the item before you buy</span>
              </li>
              <li className="flex items-start group">
                <Shield size={16} className="text-marketplace-primary mt-1 mr-2 flex-shrink-0 transition-transform group-hover:scale-110" />
                <span className="text-sm">Pay only after inspecting the item</span>
              </li>
              <li className="flex items-start group">
                <RefreshCw size={16} className="text-marketplace-primary mt-1 mr-2 flex-shrink-0 transition-transform group-hover:scale-110 group-hover:rotate-45" />
                <span className="text-sm">Read our safety guidelines</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

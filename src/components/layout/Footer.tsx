import React from 'react';
import { Smartphone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About & Help */}
          <div>
            <h3 className="text-lg font-semibold mb-4">About & Help</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">About MarketPlace</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Careers</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Help</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Sitemap</a></li>
            </ul>
          </div>

          {/* MarketPlace Apps */}
          <div>
            <h3 className="text-lg font-semibold mb-4">MarketPlace Apps</h3>
            <div className="flex items-center mb-4">
              <Smartphone size={24} className="mr-2 text-muted-foreground" />
              <p className="text-muted-foreground">Get the app today</p>
            </div>
            <div className="flex space-x-2 mb-6">
              <a href="#" className="block w-32 border border-muted rounded p-2 hover:border-foreground transition-colors">
                <img 
                  src="/placeholder.svg" 
                  alt="App Store" 
                  className="w-full h-8 object-contain" 
                />
              </a>
              <a href="#" className="block w-32 border border-muted rounded p-2 hover:border-foreground transition-colors">
                <img 
                  src="/placeholder.svg" 
                  alt="Google Play" 
                  className="w-full h-8 object-contain" 
                />
              </a>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Terms of Use</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Cookie Policy</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Accessibility</a></li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Facebook</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Twitter</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Instagram</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">LinkedIn</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} CampusKart. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

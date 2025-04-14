import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* About & Help */}
          <div>
            <h3 className="text-lg font-semibold mb-4">About & Help</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">About MarketPlace</Link></li>
              <li><a href="mailto:campuskart.sup@gmail.com" className="text-muted-foreground hover:text-foreground transition-colors">Email: campuskart.sup@gmail.com</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/legal/terms" className="text-muted-foreground hover:text-foreground transition-colors">Terms of Use</Link></li>
              <li><Link to="/legal/privacy" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link to="/legal/cookies" className="text-muted-foreground hover:text-foreground transition-colors">Cookie Policy</Link></li>
              <li><Link to="/legal/accessibility" className="text-muted-foreground hover:text-foreground transition-colors">Accessibility</Link></li>
            </ul>
          </div>

          {/* MarketPlace Apps - Commented out
          <div>
            <h3 className="text-lg font-semibold mb-4">MarketPlace Apps</h3>
            <div className="flex items-center mb-4">
              <Smartphone size={24} className="mr-2 text-muted-foreground" />
              <p className="text-muted-foreground">Get the app today</p>
            </div>
            <div className="flex space-x-2">
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
          */}
        </div>

        <div className="mt-8 pt-8 border-t text-center text-muted-foreground relative">
          <p>© {new Date().getFullYear()} CampusKart. All rights reserved.</p>
          <span className="absolute bottom-0 right-0 text-xs text-muted-foreground/60">ver 0.3</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

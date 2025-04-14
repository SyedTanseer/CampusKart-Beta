import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

const ContactPage = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <h1 className="text-4xl font-bold mb-8 text-center">Contact Us</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Information */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-6">Get In Touch</h2>
            <p className="text-muted-foreground mb-8">
              Have questions, suggestions, or need assistance with your CampusKart experience? 
              We're here to help! Reach out to us using any of the methods below.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-start">
                <Mail className="text-primary w-5 h-5 mr-3 mt-1" />
                <div>
                  <h3 className="font-medium">Email</h3>
                  <a 
                    href="mailto:campuskart.sup@gmail.com" 
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    campuskart.sup@gmail.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-start">
                <Phone className="text-primary w-5 h-5 mr-3 mt-1" />
                <div>
                  <h3 className="font-medium">Phone</h3>
                  <p className="text-muted-foreground">+91 (555) 123-4567</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <MapPin className="text-primary w-5 h-5 mr-3 mt-1" />
                <div>
                  <h3 className="font-medium">Address</h3>
                  <p className="text-muted-foreground">
                    Campus Innovation Hub<br />
                    123 University Avenue<br />
                    New Delhi, India
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Clock className="text-primary w-5 h-5 mr-3 mt-1" />
                <div>
                  <h3 className="font-medium">Support Hours</h3>
                  <p className="text-muted-foreground">Monday to Friday: 9AM - 6PM IST<br />Saturday: 10AM - 2PM IST</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Follow Us</h2>
            <p className="text-muted-foreground mb-4">
              Stay updated with the latest news, features, and promotions by following us on social media.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="p-2 bg-muted rounded-full hover:bg-primary hover:text-primary-foreground transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="#" className="p-2 bg-muted rounded-full hover:bg-primary hover:text-primary-foreground transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="#" className="p-2 bg-muted rounded-full hover:bg-primary hover:text-primary-foreground transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
              </a>
              <a href="#" className="p-2 bg-muted rounded-full hover:bg-primary hover:text-primary-foreground transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* FAQ Section */}
      <section className="mt-16">
        <h2 className="text-2xl font-semibold mb-6 text-center">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card rounded-lg shadow-md p-6">
            <h3 className="text-xl font-medium mb-2">How do I list an item for sale?</h3>
            <p className="text-muted-foreground">
              Sign in to your account, click on the "Sell" button in the navigation bar, and follow the 
              step-by-step process to create your listing with photos, description, and price.
            </p>
          </div>
          
          <div className="bg-card rounded-lg shadow-md p-6">
            <h3 className="text-xl font-medium mb-2">How does payment work?</h3>
            <p className="text-muted-foreground">
              CampusKart facilitates direct transactions between buyers and sellers. We recommend using 
              cash for in-person exchanges or secure digital payment methods for your convenience.
            </p>
          </div>
          
          <div className="bg-card rounded-lg shadow-md p-6">
            <h3 className="text-xl font-medium mb-2">Is there a fee for using CampusKart?</h3>
            <p className="text-muted-foreground">
              CampusKart is currently free to use for all verified students. We do not charge any 
              listing fees or commission on sales.
            </p>
          </div>
          
          <div className="bg-card rounded-lg shadow-md p-6">
            <h3 className="text-xl font-medium mb-2">How do I report inappropriate content?</h3>
            <p className="text-muted-foreground">
              If you see a listing or user that violates our community guidelines, please use the "Report" 
              button on the listing or contact us directly via email at campuskart.sup@gmail.com.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage; 
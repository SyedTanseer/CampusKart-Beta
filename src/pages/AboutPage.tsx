import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Book, Heart, Users, Award, ShieldCheck } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <h1 className="text-4xl font-bold mb-8 text-center">About CampusKart</h1>
      
      {/* Mission Statement */}
      <section className="mb-12">
        <div className="bg-card rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            CampusKart was created with a simple mission: to provide students with a safe, convenient, and affordable 
            marketplace exclusively for campus communities. We believe in connecting students directly, reducing waste 
            through reuse, and making student life more affordable by giving items a second life.
          </p>
        </div>
      </section>
      
      {/* Features */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">What Makes Us Different</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card rounded-lg shadow-md p-6 flex items-start">
            <ShieldCheck className="text-primary mr-4 mt-1 w-8 h-8" />
            <div>
              <h3 className="text-xl font-medium mb-2">Campus Verified</h3>
              <p className="text-muted-foreground">
                Every user is verified with their campus email, creating a trusted community 
                of buyers and sellers from your institution.
              </p>
            </div>
          </div>
          
          <div className="bg-card rounded-lg shadow-md p-6 flex items-start">
            <Users className="text-primary mr-4 mt-1 w-8 h-8" />
            <div>
              <h3 className="text-xl font-medium mb-2">Community Focused</h3>
              <p className="text-muted-foreground">
                Unlike large marketplaces, we focus exclusively on campus communities, making 
                exchanges convenient and safe.
              </p>
            </div>
          </div>
          
          <div className="bg-card rounded-lg shadow-md p-6 flex items-start">
            <Book className="text-primary mr-4 mt-1 w-8 h-8" />
            <div>
              <h3 className="text-xl font-medium mb-2">Student Essentials</h3>
              <p className="text-muted-foreground">
                Categories focused on what students actually need: textbooks, electronics, 
                dorm supplies, and more.
              </p>
            </div>
          </div>
          
          <div className="bg-card rounded-lg shadow-md p-6 flex items-start">
            <Heart className="text-primary mr-4 mt-1 w-8 h-8" />
            <div>
              <h3 className="text-xl font-medium mb-2">Sustainability</h3>
              <p className="text-muted-foreground">
                By keeping items within the campus community, we reduce waste and 
                promote sustainable consumption.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Our Story */}
      <section className="mb-12">
        <div className="bg-card rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            CampusKart began as a student project, when a group of friends 
            noticed how many perfectly good items were being discarded at the end of each semester. 
            Textbooks, furniture, electronics - all being thrown away while incoming students were 
            purchasing the same items new.
          </p>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            We created a simple platform for students to buy and sell within their campus community, 
            focusing on trust, convenience, and affordability. What started as a small project has 
            grown into a platform serving multiple campuses, helping thousands of students save money 
            and reduce waste.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Today, CampusKart remains committed to its founding principles, continuously improving 
            to better serve students and campus communities across the country.
          </p>
        </div>
      </section>
      
      {/* Team */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Our Team</h2>
        <div className="bg-card rounded-lg shadow-md p-8">
          <p className="text-muted-foreground mb-6 leading-relaxed">
            CampusKart is developed and maintained by a dedicated team of student entrepreneurs, 
            developers, and designers who are passionate about creating a better marketplace experience 
            for campus communities.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Our team draws from diverse backgrounds in computer science, business, and design, with 
            every member bringing unique skills and insights to the platform. What unites us is our 
            commitment to our users and our belief in the power of student communities.
          </p>
        </div>
      </section>
      
      {/* Contact Link */}
      <div className="text-center mt-8">
        <p className="text-muted-foreground mb-4">Have questions or want to get in touch?</p>
        <Link 
          to="/contact" 
          className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
        >
          Contact Us
        </Link>
      </div>
    </div>
  );
};

export default AboutPage; 
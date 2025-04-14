import React from 'react';
import { Link } from 'react-router-dom';

const Accessibility = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Accessibility Statement</h1>
      
      <div className="prose prose-gray dark:prose-invert">
        <p className="text-muted-foreground mb-4">Last updated: {new Date().toLocaleDateString()}</p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Our Commitment</h2>
          <p>
            CampusKart is committed to ensuring digital accessibility for people with disabilities. We are continually
            improving the user experience for everyone and applying the relevant accessibility standards.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Accessibility Features</h2>
          <p>
            Our website includes the following features:
          </p>
          <ul className="list-disc pl-6 mt-2">
            <li>Keyboard navigation support</li>
            <li>Screen reader compatibility</li>
            <li>High contrast mode</li>
            <li>Text resizing options</li>
            <li>Alternative text for images</li>
            <li>Clear and consistent navigation</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Standards Compliance</h2>
          <p>
            We aim to meet the following accessibility standards:
          </p>
          <ul className="list-disc pl-6 mt-2">
            <li>Web Content Accessibility Guidelines (WCAG) 2.1 Level AA</li>
            <li>Section 508 of the Rehabilitation Act</li>
            <li>Americans with Disabilities Act (ADA)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Feedback</h2>
          <p>
            We welcome your feedback on the accessibility of CampusKart. Please let us know if you encounter
            accessibility barriers:
          </p>
          <ul className="list-disc pl-6 mt-2">
            <li>Email: <a href="mailto:campuskart.sup@gmail.com" className="text-primary hover:underline">campuskart.sup@gmail.com</a></li>
            <li>Phone: (555) 123-4567</li>
            <li>Postal address: [Your Address]</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Ongoing Efforts</h2>
          <p>
            We are actively working to increase the accessibility and usability of our website. Our efforts include:
          </p>
          <ul className="list-disc pl-6 mt-2">
            <li>Regular accessibility audits</li>
            <li>User testing with people with disabilities</li>
            <li>Staff training on accessibility</li>
            <li>Continuous improvement of our website</li>
          </ul>
        </section>

        <div className="mt-8">
          <Link to="/" className="text-primary hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Accessibility; 
import React from 'react';
import { Link } from 'react-router-dom';

const TermsOfUse = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Terms of Use</h1>
      
      <div className="prose prose-gray dark:prose-invert">
        <p className="text-muted-foreground mb-4">Last updated: {new Date().toLocaleDateString()}</p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing and using CampusKart, you accept and agree to be bound by the terms and provision of this agreement.
            If you do not agree to abide by the above, please do not use this service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. User Accounts</h2>
          <p>
            To use certain features of CampusKart, you must register for an account. You agree to:
          </p>
          <ul className="list-disc pl-6 mt-2">
            <li>Provide accurate and complete information</li>
            <li>Maintain the security of your account</li>
            <li>Accept responsibility for all activities that occur under your account</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Marketplace Rules</h2>
          <p>
            When using CampusKart's marketplace:
          </p>
          <ul className="list-disc pl-6 mt-2">
            <li>You must be a current student or faculty member</li>
            <li>All items must comply with campus policies</li>
            <li>Prohibited items include but are not limited to: weapons, drugs, alcohol, and stolen goods</li>
            <li>You are responsible for the accuracy of your listings</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Intellectual Property</h2>
          <p>
            All content on CampusKart, including but not limited to text, graphics, logos, and software, is the property of CampusKart
            and is protected by copyright and other intellectual property laws.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Limitation of Liability</h2>
          <p>
            CampusKart shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from
            your use of or inability to use the service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. We will notify users of any changes by updating the "Last updated" date
            at the top of these terms.
          </p>
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

export default TermsOfUse; 
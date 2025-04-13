import React from 'react';
import { Link } from 'react-router-dom';

const CookiePolicy = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Cookie Policy</h1>
      
      <div className="prose prose-gray dark:prose-invert">
        <p className="text-muted-foreground mb-4">Last updated: {new Date().toLocaleDateString()}</p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. What Are Cookies</h2>
          <p>
            Cookies are small text files that are placed on your computer or mobile device when you visit our website.
            They help us provide you with a better experience and allow certain features to work properly.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. How We Use Cookies</h2>
          <p>
            We use cookies for the following purposes:
          </p>
          <ul className="list-disc pl-6 mt-2">
            <li>Essential cookies: Required for basic site functionality</li>
            <li>Authentication cookies: To keep you logged in</li>
            <li>Preference cookies: To remember your settings</li>
            <li>Analytics cookies: To understand how you use our site</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Types of Cookies We Use</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold">Essential Cookies</h3>
              <p>These cookies are necessary for the website to function properly. They enable basic functions like page navigation and access to secure areas.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold">Functionality Cookies</h3>
              <p>These cookies allow the website to remember choices you make and provide enhanced, more personal features.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold">Analytics Cookies</h3>
              <p>These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.</p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Managing Cookies</h2>
          <p>
            You can control and/or delete cookies as you wish. You can delete all cookies that are already on your computer
            and you can set most browsers to prevent them from being placed. However, if you do this, you may have to manually
            adjust some preferences every time you visit our site.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Third-Party Cookies</h2>
          <p>
            Some cookies are placed by third-party services that appear on our pages. We do not control the use of these cookies
            and cannot access them due to the way that cookies work, as cookies can only be accessed by the party who originally set them.
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

export default CookiePolicy; 
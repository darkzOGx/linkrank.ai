import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-medium text-black mb-8">Privacy Policy</h1>
      
      <div className="prose prose-gray max-w-none">
        <p className="text-gray-600 mb-6">
          <strong>Last Updated: {new Date().toLocaleDateString()}</strong>
        </p>
        
        <section className="mb-8">
          <h2 className="text-2xl font-medium text-black mb-4">Introduction</h2>
          <p className="text-gray-700 mb-4">
            LinkRank.ai ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our SEO and GEO audit tools at linkrank.ai.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-medium text-black mb-4">Information We Collect</h2>
          <h3 className="text-xl font-medium text-black mb-2">Website URLs</h3>
          <p className="text-gray-700 mb-4">
            When you use our audit tools, you provide us with website URLs to analyze. We process these URLs solely for the purpose of generating SEO and GEO audit reports.
          </p>
          
          <h3 className="text-xl font-medium text-black mb-2">Usage Data</h3>
          <p className="text-gray-700 mb-4">
            We may collect information about how you interact with our services, including pages visited, features used, and analysis performed.
          </p>
          
          <h3 className="text-xl font-medium text-black mb-2">Analytics Data</h3>
          <p className="text-gray-700 mb-4">
            We use Google Analytics to understand how visitors use our site. This includes information such as browser type, device type, and general location (country/city level).
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-medium text-black mb-4">How We Use Your Information</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>To provide SEO and GEO audit services</li>
            <li>To improve our tools and services</li>
            <li>To analyze usage patterns and optimize user experience</li>
            <li>To respond to user inquiries and support requests</li>
            <li>To detect and prevent fraud or abuse</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-medium text-black mb-4">Data Security</h2>
          <p className="text-gray-700 mb-4">
            We implement appropriate technical and organizational measures to protect your information against unauthorized access, alteration, disclosure, or destruction. All data transmission is encrypted using HTTPS protocol.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-medium text-black mb-4">Data Retention</h2>
          <p className="text-gray-700 mb-4">
            We do not permanently store the URLs you analyze or the audit results. Analysis data is processed in real-time and not retained after the session ends. Analytics data is retained according to Google Analytics' data retention policies.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-medium text-black mb-4">Third-Party Services</h2>
          <p className="text-gray-700 mb-4">
            We use Google Analytics for website analytics. Google's privacy policy can be found at https://policies.google.com/privacy. We do not sell, trade, or transfer your information to third parties.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-medium text-black mb-4">Your Rights</h2>
          <p className="text-gray-700 mb-4">
            You have the right to:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Access the information we have about you</li>
            <li>Request correction of any inaccurate information</li>
            <li>Request deletion of your information</li>
            <li>Opt-out of analytics tracking using browser settings or extensions</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-medium text-black mb-4">Cookies</h2>
          <p className="text-gray-700 mb-4">
            We use cookies for analytics purposes only. These cookies help us understand how visitors use our site. You can control cookie settings through your browser preferences.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-medium text-black mb-4">Children's Privacy</h2>
          <p className="text-gray-700 mb-4">
            Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-medium text-black mb-4">Changes to This Policy</h2>
          <p className="text-gray-700 mb-4">
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-medium text-black mb-4">Contact Us</h2>
          <p className="text-gray-700 mb-4">
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <p className="text-gray-700">
            Email: support@linkrank.ai<br />
            Phone: +1 (502) 232-8511<br />
            Website: https://linkrank.ai
          </p>
        </section>
      </div>
    </div>
  );
}
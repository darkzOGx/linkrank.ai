import React from 'react';

export default function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-medium text-black mb-8">Terms of Service</h1>
      
      <div className="prose prose-gray max-w-none">
        <p className="text-gray-600 mb-6">
          <strong>Last Updated: {new Date().toLocaleDateString()}</strong>
        </p>
        
        <section className="mb-8">
          <h2 className="text-2xl font-medium text-black mb-4">1. Acceptance of Terms</h2>
          <p className="text-gray-700 mb-4">
            By accessing and using LinkRank.ai ("the Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our Service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-medium text-black mb-4">2. Description of Service</h2>
          <p className="text-gray-700 mb-4">
            LinkRank.ai provides free SEO (Search Engine Optimization) and GEO (Generative Engine Optimization) audit tools. Our Service analyzes websites to provide insights and recommendations for improving search engine rankings and AI system visibility.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-medium text-black mb-4">3. Use of Service</h2>
          <h3 className="text-xl font-medium text-black mb-2">Permitted Use</h3>
          <p className="text-gray-700 mb-4">
            You may use LinkRank.ai for legitimate website analysis purposes. The Service is provided free of charge for both personal and commercial use.
          </p>
          
          <h3 className="text-xl font-medium text-black mb-2">Prohibited Use</h3>
          <p className="text-gray-700 mb-4">You agree not to:</p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
            <li>Use the Service to analyze websites you do not own or have permission to analyze</li>
            <li>Use the Service for any illegal or unauthorized purpose</li>
            <li>Attempt to overload, disable, or impair the Service</li>
            <li>Use automated scripts or bots without permission</li>
            <li>Attempt to reverse engineer or copy the Service</li>
            <li>Use the Service to harm, harass, or violate the rights of others</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-medium text-black mb-4">4. Intellectual Property</h2>
          <p className="text-gray-700 mb-4">
            All content, features, and functionality of LinkRank.ai, including but not limited to text, graphics, logos, and software, are the exclusive property of LinkRank.ai and are protected by international copyright, trademark, and other intellectual property laws.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-medium text-black mb-4">5. Disclaimer of Warranties</h2>
          <p className="text-gray-700 mb-4">
            THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR COMPLETELY SECURE.
          </p>
          <p className="text-gray-700 mb-4">
            The SEO and GEO recommendations provided are for informational purposes only. We do not guarantee specific results or improvements in search rankings or AI visibility.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-medium text-black mb-4">6. Limitation of Liability</h2>
          <p className="text-gray-700 mb-4">
            IN NO EVENT SHALL LINKRANK.AI, ITS OFFICERS, DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE SERVICE.
          </p>
          <p className="text-gray-700 mb-4">
            Our total liability to you for any claims arising from your use of the Service shall not exceed the amount you paid to us (which is zero for free services).
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-medium text-black mb-4">7. Indemnification</h2>
          <p className="text-gray-700 mb-4">
            You agree to indemnify and hold harmless LinkRank.ai and its affiliates from any claims, losses, liabilities, damages, costs, or expenses arising from your use of the Service or violation of these Terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-medium text-black mb-4">8. Privacy</h2>
          <p className="text-gray-700 mb-4">
            Your use of the Service is also governed by our Privacy Policy, which can be found at <a href="/privacy-policy" className="text-blue-600 hover:underline">linkrank.ai/privacy-policy</a>.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-medium text-black mb-4">9. Modifications to Service</h2>
          <p className="text-gray-700 mb-4">
            We reserve the right to modify, suspend, or discontinue the Service at any time without notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuance of the Service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-medium text-black mb-4">10. Governing Law</h2>
          <p className="text-gray-700 mb-4">
            These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-medium text-black mb-4">11. Changes to Terms</h2>
          <p className="text-gray-700 mb-4">
            We reserve the right to update these Terms at any time. We will notify you of any changes by posting the new Terms on this page and updating the "Last Updated" date.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-medium text-black mb-4">12. Contact Information</h2>
          <p className="text-gray-700 mb-4">
            If you have any questions about these Terms of Service, please contact us at:
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
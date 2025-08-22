import React from 'react';

export default function CredibilityLogos() {
  return (
    <div>
      <p className="text-base uppercase tracking-widest text-gray-500 mb-4">
        Powered by linkrank.ai
      </p>
      <div className="flex justify-center">
        <img 
          src="/linkrank-logo.png" 
          alt="LinkRank.ai - Professional SEO and GEO Audit Tool Logo" 
          loading="lazy"
          decoding="async"
          width="200"
          height="80"
          className="w-auto max-w-full opacity-80 hover:opacity-100 transition-opacity"
          style={{ height: '103px', maxHeight: '80px' }}
        />
      </div>
    </div>
  );
}
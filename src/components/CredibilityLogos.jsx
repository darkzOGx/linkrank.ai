import React from 'react';

export default function CredibilityLogos() {
  return (
    <div>
      <p className="text-sm uppercase tracking-widest text-gray-500 mb-4">
        Powered by linkrank.ai
      </p>
      <div className="flex justify-center">
        <img 
          src="/linkrank-logo.png" 
          alt="LinkRank.ai Logo" 
          className="h-32 w-auto opacity-80 hover:opacity-100 transition-opacity"
        />
      </div>
    </div>
  );
}
import React from 'react';

const logos = [
  { name: 'Stanford AI Lab', path: 'M10 20v-6m0 6l-4-4m4 4l4-4m-4-12v6m0-6l-4 4m4-4l4 4' },
  { name: 'MIT Media Lab', path: 'M4 12h16M4 12l4-4m-4 4l4 4' },
  { name: 'Berkeley AI Research', path: 'M12 4v16m0-16l-4 4m4-4l4 4M4 12h16' },
  { name: 'ETH Zurich', path: 'M20 12H4m16 0l-4-4m4 4l-4 4M12 4v16' },
];

export default function CredibilityLogos() {
  return (
    <div>
      <p className="text-sm uppercase tracking-widest text-gray-500 mb-4">
        Methodology based on research from
      </p>
      <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
        {logos.map(logo => (
          <div key={logo.name} className="flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={logo.path} />
            </svg>
            <span className="text-gray-600 font-medium">{logo.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
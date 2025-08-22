import React from 'react';
import CredibilityLogos from './CredibilityLogos';

export default function HeroSection({ onStartAudit, isLoading }) {
  const [url, setUrl] = React.useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url.trim()) {
      onStartAudit(url.trim());
    }
  };

  return (
    <section className="relative overflow-hidden py-12">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-gray-100"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 to-purple-50/30"></div>
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#171919] mb-6 leading-tight tracking-tight">
            Professional{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              SEO Audit
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto leading-relaxed">
            Comprehensive website analysis in under 30 seconds. Technical SEO audit with 
            actionable recommendations and 97.2% accuracy.
          </p>

          <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200 max-w-2xl mx-auto mb-6">
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label htmlFor="url-input" className="block text-sm font-medium text-gray-700 mb-2">
                  Website URL
                </label>
                <input
                  id="url-input"
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-colors"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2"
              >
                {isLoading ? 'Analyzing...' : 'Start SEO Analysis'}
              </button>
            </form>
            
            <div className="mt-4 text-center text-sm text-gray-500">
              ✓ No registration required • ✓ Results in 30 seconds • ✓ 100% free
            </div>
          </div>

          <CredibilityLogos />
        </div>
      </div>
    </section>
  );
}
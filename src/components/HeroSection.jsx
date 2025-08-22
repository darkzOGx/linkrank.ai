import React from 'react';
import { ArrowRight } from 'lucide-react';
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
    <section className="bg-white border-b border-black">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-medium text-black mb-6">
            Website Performance & <span className="text-[#fcd63a]">SEO Audit</span>
          </h1>
          <p className="text-lg text-gray-700 mb-10 max-w-3xl mx-auto">
            An independent analysis protocol for evaluating on-page search engine optimization and technical performance metrics. Enter a URL to begin the automated assessment.
          </p>

          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto mb-20">
            <div className="flex flex-col sm:flex-row gap-0">
              <label htmlFor="url-input" className="sr-only">Website URL</label>
              <input
                id="url-input"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="flex-1 px-4 py-3 text-base bg-white border border-black rounded-none focus:ring-1 focus:ring-black focus:outline-none placeholder-gray-500"
                required
              />
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 bg-[#fcd63a] text-black font-medium flex items-center justify-center gap-2 hover:bg-[#e6c133] disabled:bg-gray-400 transition-colors"
              >
                {isLoading ? 'Analyzing...' : 'Generate Report'}
                {!isLoading && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </form>

          <CredibilityLogos />
        </div>
      </div>
    </section>
  );
}
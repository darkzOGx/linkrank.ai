import React from 'react';
import { ArrowRight, Search } from 'lucide-react';
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
            LinkRank.ai - Professional <span className="text-[#fcd63a]">SEO & GEO Audit</span> Tool
          </h1>
          <p className="text-lg text-gray-700 mb-10 max-w-3xl mx-auto">
            <strong>LinkRank.ai</strong> provides comprehensive SEO and GEO (Generative Engine Optimization) audits to help your website rank higher in search engines and perform better with AI systems. Our advanced analysis protocol evaluates over 50+ on-page optimization factors, technical performance metrics, and AI-readiness signals.
          </p>

          {/* What is SEO explanation */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 max-w-4xl mx-auto mb-6">
            <h2 className="text-xl font-medium text-gray-900 mb-3 flex items-center justify-center gap-2">
              <Search className="w-5 h-5" />
              What is SEO (Search Engine Optimization)?
            </h2>
            <p className="text-gray-800 text-sm leading-relaxed mb-4">
              <strong>SEO (Search Engine Optimization)</strong> is the practice of optimizing websites to rank higher in traditional search engine results pages (SERPs) like Google, Bing, and Yahoo. 
              It involves improving on-page elements, technical performance, content quality, and user experience to increase organic visibility and drive more clicks to your website.
            </p>
            <p className="text-gray-800 text-sm leading-relaxed">
              LinkRank.ai's SEO audit analyzes critical factors including title tags, meta descriptions, heading structure, content quality, page speed, mobile-friendliness, schema markup, and accessibility compliance. 
              Our tool provides actionable recommendations with practical implementation examples to help you improve your search rankings.
            </p>
          </div>

          {/* What is GEO explanation */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 max-w-4xl mx-auto mb-10">
            <h2 className="text-xl font-medium text-gray-900 mb-3 flex items-center justify-center gap-2">
              <Search className="w-5 h-5" />
              What is GEO (Generative Engine Optimization)?
            </h2>
            <p className="text-gray-800 text-sm leading-relaxed mb-4">
              <strong>GEO (Generative Engine Optimization)</strong> is the emerging practice of optimizing content for AI systems and large language models like ChatGPT, Claude, and Google's AI Overview. 
              As AI-powered search becomes more prevalent, GEO ensures your content is easily understood, extracted, and cited by these systems.
            </p>
            <p className="text-gray-800 text-sm leading-relaxed">
              LinkRank.ai's GEO audit evaluates structured data implementation, fact density, citation potential, authority signals, and content extractability. 
              We help you optimize for AI systems by improving schema markup, enhancing factual content, and implementing proper attribution to increase your visibility in AI-generated responses.
            </p>
          </div>

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
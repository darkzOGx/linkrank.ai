import React, { useState } from 'react';
import { ArrowRight, Search, ExternalLink, TrendingUp, MapPin } from 'lucide-react';

export default function GoogleSERPChecker() {
  const [keyword, setKeyword] = useState('');
  const [domain, setDomain] = useState('');
  const [location, setLocation] = useState('United States');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);

  const locations = [
    'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 
    'France', 'Spain', 'Italy', 'Netherlands', 'Sweden', 'Japan', 'India'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!keyword.trim()) return;

    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch(`/api/serp-check?keyword=${encodeURIComponent(keyword.trim())}&domain=${encodeURIComponent(domain.trim())}&location=${encodeURIComponent(location)}`);
      const data = await response.json();

      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error: 'Network error occurred while checking SERP rankings'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getRankingColor = (position) => {
    if (position <= 3) return 'text-green-600 bg-green-50';
    if (position <= 10) return 'text-blue-600 bg-blue-50';
    if (position <= 20) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-medium text-black mb-4">Google SERP Checker</h1>
        <p className="text-gray-700">
          Check your website's ranking position in Google search results for specific keywords.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="space-y-4 max-w-2xl mx-auto">
          <div>
            <label htmlFor="keyword" className="block text-sm font-medium text-gray-700 mb-2">
              Target Keyword *
            </label>
            <input
              type="text"
              id="keyword"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Enter keyword to check (e.g., 'best pizza recipe')"
              className="w-full px-4 py-3 text-base bg-white border border-black rounded-none focus:ring-1 focus:ring-black focus:outline-none placeholder-gray-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="domain" className="block text-sm font-medium text-gray-700 mb-2">
              Your Domain (Optional)
            </label>
            <input
              type="text"
              id="domain"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="example.com (leave empty to see all top results)"
              className="w-full px-4 py-3 text-base bg-white border border-black rounded-none focus:ring-1 focus:ring-black focus:outline-none placeholder-gray-500"
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              Search Location
            </label>
            <select
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-3 text-base bg-white border border-black rounded-none focus:ring-1 focus:ring-black focus:outline-none"
            >
              {locations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-6 py-3 bg-black text-white font-medium flex items-center justify-center gap-2 hover:bg-gray-800 disabled:bg-gray-400 transition-colors"
          >
            {isLoading ? 'Checking Rankings...' : 'Check SERP Position'}
            {!isLoading && <Search className="w-4 h-4" />}
          </button>
        </div>
      </form>

      {result && (
        <div className="border border-black">
          <div className="bg-gray-50 p-4 border-b border-black">
            <h2 className="text-lg font-medium">SERP Analysis Results</h2>
            <p className="text-sm text-gray-600 mt-1">
              Keyword: "{keyword}" | Location: {location}
              {domain && ` | Domain: ${domain}`}
            </p>
          </div>

          {result.success ? (
            <div className="p-6">
              {/* Summary */}
              {domain && result.domainRanking && (
                <div className="mb-6 p-4 bg-gray-50 border border-gray-200">
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Your Domain Performance
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className={`text-3xl font-bold p-2 rounded ${getRankingColor(result.domainRanking.position)}`}>
                        #{result.domainRanking.position}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">Current Position</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-medium">{result.domainRanking.page}</div>
                      <div className="text-sm text-gray-600">Search Page</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-medium">{result.totalResults?.toLocaleString() || 'N/A'}</div>
                      <div className="text-sm text-gray-600">Total Results</div>
                    </div>
                  </div>
                </div>
              )}

              {domain && !result.domainRanking && (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200">
                  <h3 className="font-medium text-yellow-800 mb-2">Domain Not Found</h3>
                  <p className="text-sm text-yellow-700">
                    Your domain "{domain}" was not found in the top 100 search results for this keyword.
                  </p>
                </div>
              )}

              {/* Top Results */}
              <div>
                <h3 className="font-medium mb-4">Top Search Results</h3>
                <div className="space-y-3">
                  {result.results?.map((item, index) => (
                    <div key={index} className="border border-gray-200 p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start gap-4">
                        <div className={`text-lg font-bold px-3 py-1 rounded ${getRankingColor(item.position)}`}>
                          #{item.position}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-blue-600 mb-1">
                            <a 
                              href={item.link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="hover:underline flex items-center gap-1"
                            >
                              {item.title}
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </h4>
                          <p className="text-sm text-green-700 mb-2">{item.displayedLink}</p>
                          <p className="text-sm text-gray-700">{item.snippet}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SEO Tips */}
              <div className="mt-8 p-4 bg-blue-50 border border-blue-200">
                <h3 className="font-medium text-blue-800 mb-3">💡 SEO Improvement Tips</h3>
                <ul className="text-sm text-blue-700 space-y-2">
                  <li>• Analyze competitors' content in top positions for keyword optimization ideas</li>
                  <li>• Focus on creating comprehensive, high-quality content that matches search intent</li>
                  <li>• Optimize your page title and meta description to include the target keyword</li>
                  <li>• Build high-quality backlinks from relevant, authoritative websites</li>
                  <li>• Ensure your website loads quickly and is mobile-friendly</li>
                  <li>• Monitor your rankings regularly and track improvements over time</li>
                </ul>
              </div>
            </div>
          ) : result.educational ? (
            <div className="p-6">
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200">
                <h3 className="font-medium text-blue-800 mb-3">📚 {result.message}</h3>
                <p className="text-blue-700 mb-4">{result.info.explanation}</p>
              </div>

              <div className="mb-6">
                <h3 className="font-medium mb-3">🆓 Free Alternatives</h3>
                <ul className="space-y-2">
                  {result.info.alternatives.map((alternative, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-green-600 mt-1">✓</span>
                      <span>{alternative}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="font-medium mb-3">🔧 Professional Tools</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>SEMrush API - Comprehensive SERP tracking and competitor analysis</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>Ahrefs API - Professional SEO tracking with historical data</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>DataForSEO API - Real-time SERP data from multiple search engines</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>SerpApi - Search engine results API for developers</span>
                  </li>
                </ul>
              </div>

              <div className="p-4 bg-gray-50 border border-gray-200">
                <h4 className="font-medium mb-2">🚀 Implementation Guide</h4>
                <p className="text-sm text-gray-700">{result.info.implementation}</p>
              </div>
            </div>
          ) : (
            <div className="p-6">
              <div className="text-red-600 mb-4">
                <span className="font-medium">Error:</span> {result.error || 'An unknown error occurred'}
              </div>
              <div className="bg-blue-50 border border-blue-200 p-4">
                <h4 className="font-medium text-blue-800 mb-2">Troubleshooting:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Try a different keyword or check your spelling</li>
                  <li>• Ensure you're using relevant keywords for your content</li>
                  <li>• Check if the domain is spelled correctly</li>
                  <li>• Try again in a few moments if there was a temporary error</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
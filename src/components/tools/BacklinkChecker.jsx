import React, { useState } from 'react';
import { ArrowRight, Link, Globe, TrendingUp, Award, AlertCircle } from 'lucide-react';

export default function BacklinkChecker() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsLoading(true);
    setResult(null);

    try {
      let cleanUrl = url.trim();
      if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
        cleanUrl = 'https://' + cleanUrl;
      }

      const response = await fetch(`/api/backlink-check?url=${encodeURIComponent(cleanUrl)}`);
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error: 'Network error occurred while checking backlinks'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getAuthorityColor = (score) => {
    if (score >= 70) return 'text-green-600 bg-green-50';
    if (score >= 40) return 'text-blue-600 bg-blue-50';
    if (score >= 20) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-medium text-black mb-4">Free Backlink Checker</h1>
        <p className="text-gray-700">
          Analyze your website's backlink profile and discover link building opportunities.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex flex-col sm:flex-row gap-0 max-w-2xl mx-auto">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter website URL (e.g., example.com)"
            className="flex-1 px-4 py-3 text-base bg-white border border-black rounded-none focus:ring-1 focus:ring-black focus:outline-none placeholder-gray-500"
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-black text-white font-medium flex items-center justify-center gap-2 hover:bg-gray-800 disabled:bg-gray-400 transition-colors"
          >
            {isLoading ? 'Analyzing...' : 'Check Backlinks'}
            {!isLoading && <Link className="w-4 h-4" />}
          </button>
        </div>
      </form>

      {result && (
        <div className="border border-black">
          <div className="bg-gray-50 p-4 border-b border-black">
            <h2 className="text-lg font-medium">Backlink Analysis Results</h2>
            <p className="text-sm text-gray-600 mt-1">{result.url}</p>
          </div>

          {result.success ? (
            <div className="p-6">
              {/* Overview Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="text-center p-4 border border-gray-200">
                  <div className="text-3xl font-bold text-blue-600">{result.totalBacklinks?.toLocaleString()}</div>
                  <div className="text-sm text-gray-600 mt-1">Total Backlinks</div>
                </div>
                <div className="text-center p-4 border border-gray-200">
                  <div className="text-3xl font-bold text-green-600">{result.referringDomains}</div>
                  <div className="text-sm text-gray-600 mt-1">Referring Domains</div>
                </div>
                <div className="text-center p-4 border border-gray-200">
                  <div className={`text-3xl font-bold ${getAuthorityColor(result.domainAuthority)}`}>
                    {result.domainAuthority}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Domain Authority</div>
                </div>
                <div className="text-center p-4 border border-gray-200">
                  <div className="text-3xl font-bold text-purple-600">{result.trustFlow}</div>
                  <div className="text-sm text-gray-600 mt-1">Trust Flow</div>
                </div>
              </div>

              {/* Link Types Distribution */}
              <div className="mb-8">
                <h3 className="font-medium mb-4">Link Types Distribution</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-3 bg-gray-50 border border-gray-200">
                    <div className="text-xl font-medium">{result.linkTypes.dofollow}%</div>
                    <div className="text-sm text-gray-600">DoFollow</div>
                  </div>
                  <div className="p-3 bg-gray-50 border border-gray-200">
                    <div className="text-xl font-medium">{result.linkTypes.nofollow}%</div>
                    <div className="text-sm text-gray-600">NoFollow</div>
                  </div>
                  <div className="p-3 bg-gray-50 border border-gray-200">
                    <div className="text-xl font-medium">{result.linkTypes.text}%</div>
                    <div className="text-sm text-gray-600">Text Links</div>
                  </div>
                  <div className="p-3 bg-gray-50 border border-gray-200">
                    <div className="text-xl font-medium">{result.linkTypes.image}%</div>
                    <div className="text-sm text-gray-600">Image Links</div>
                  </div>
                </div>
              </div>

              {/* Top Backlinks */}
              <div className="mb-8">
                <h3 className="font-medium mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Top Referring Domains
                </h3>
                <div className="space-y-3">
                  {result.topBacklinks.map((link, index) => (
                    <div key={index} className="border border-gray-200 p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-blue-600 mb-1">
                            <a 
                              href={link.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="hover:underline"
                            >
                              {link.domain}
                            </a>
                          </h4>
                          <p className="text-sm text-gray-600 mb-2">
                            Anchor Text: "{link.anchorText}"
                          </p>
                          <div className="flex gap-4 text-xs">
                            <span className={`px-2 py-1 rounded ${link.dofollow ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                              {link.dofollow ? 'DoFollow' : 'NoFollow'}
                            </span>
                            <span className="text-gray-500">
                              DA: {link.domainAuthority}
                            </span>
                            <span className="text-gray-500">
                              First Seen: {link.firstSeen}
                            </span>
                          </div>
                        </div>
                        <div className={`px-3 py-1 rounded ${getAuthorityColor(link.domainAuthority)}`}>
                          {link.domainAuthority}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Anchor Text Distribution */}
              <div className="mb-8">
                <h3 className="font-medium mb-4">Top Anchor Texts</h3>
                <div className="space-y-2">
                  {result.anchorTexts.map((anchor, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200">
                      <span className="text-sm">{anchor.text}</span>
                      <div className="flex items-center gap-4">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${anchor.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{anchor.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Backlink Growth */}
              <div className="mb-8 p-4 bg-green-50 border border-green-200">
                <h3 className="font-medium text-green-800 mb-2 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Backlink Growth
                </h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-green-700">New (30 days):</span>
                    <span className="ml-2 font-medium text-green-800">+{result.growth.new30days}</span>
                  </div>
                  <div>
                    <span className="text-green-700">Lost (30 days):</span>
                    <span className="ml-2 font-medium text-red-600">-{result.growth.lost30days}</span>
                  </div>
                  <div>
                    <span className="text-green-700">Net Growth:</span>
                    <span className="ml-2 font-medium text-green-800">+{result.growth.net}</span>
                  </div>
                </div>
              </div>

              {/* Link Building Tips */}
              <div className="p-4 bg-blue-50 border border-blue-200">
                <h3 className="font-medium text-blue-800 mb-3">🔗 Link Building Strategies</h3>
                <ul className="text-sm text-blue-700 space-y-2">
                  <li>• Focus on acquiring links from high Domain Authority websites (DA 50+)</li>
                  <li>• Diversify anchor text to avoid over-optimization penalties</li>
                  <li>• Build relationships with industry-relevant websites for quality backlinks</li>
                  <li>• Create linkable assets like infographics, tools, and comprehensive guides</li>
                  <li>• Monitor and disavow toxic or spammy backlinks regularly</li>
                  <li>• Guest post on authoritative blogs in your niche</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="p-6">
              <div className="text-red-600 mb-4">
                <span className="font-medium">Error:</span> {result.error}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
import React, { useState } from 'react';
import { ArrowRight, Map, Check, X, FileText, ExternalLink } from 'lucide-react';

export default function SitemapFinder() {
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

      const response = await fetch(`/api/sitemap-find?url=${encodeURIComponent(cleanUrl)}`);
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error: 'Network error occurred while finding sitemap'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-medium text-black mb-4">Sitemap Finder</h1>
        <p className="text-gray-700">
          Locate and analyze XML sitemaps to understand site structure and indexed pages.
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
            {isLoading ? 'Searching...' : 'Find Sitemap'}
            {!isLoading && <Map className="w-4 h-4" />}
          </button>
        </div>
      </form>

      {result && (
        <div className="border border-black">
          <div className="bg-gray-50 p-4 border-b border-black">
            <h2 className="text-lg font-medium">Sitemap Analysis Results</h2>
            <p className="text-sm text-gray-600 mt-1">{result.url}</p>
          </div>

          {result.success ? (
            <div className="p-6">
              {/* Sitemaps Found */}
              <div className="mb-8">
                <h3 className="font-medium mb-4 flex items-center gap-2">
                  {result.sitemaps.length > 0 ? (
                    <Check className="w-5 h-5 text-green-600" />
                  ) : (
                    <X className="w-5 h-5 text-red-600" />
                  )}
                  {result.sitemaps.length} Sitemap(s) Found
                </h3>
                
                {result.sitemaps.length > 0 ? (
                  <div className="space-y-4">
                    {result.sitemaps.map((sitemap, index) => (
                      <div key={index} className="border border-gray-200 p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-medium text-blue-600 mb-1">
                              <a 
                                href={sitemap.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="hover:underline flex items-center gap-1"
                              >
                                {sitemap.url}
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </h4>
                            <p className="text-sm text-gray-600">Type: {sitemap.type}</p>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded ${
                            sitemap.status === 'Found' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {sitemap.status}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                          <div className="text-center p-2 bg-gray-50 border border-gray-200">
                            <div className="font-medium">{sitemap.urlCount}</div>
                            <div className="text-xs text-gray-600">URLs</div>
                          </div>
                          <div className="text-center p-2 bg-gray-50 border border-gray-200">
                            <div className="font-medium">{sitemap.size}</div>
                            <div className="text-xs text-gray-600">Size</div>
                          </div>
                          <div className="text-center p-2 bg-gray-50 border border-gray-200">
                            <div className="font-medium">{sitemap.lastModified}</div>
                            <div className="text-xs text-gray-600">Last Modified</div>
                          </div>
                          <div className="text-center p-2 bg-gray-50 border border-gray-200">
                            <div className="font-medium">{sitemap.format}</div>
                            <div className="text-xs text-gray-600">Format</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-yellow-50 border border-yellow-200">
                    <p className="text-yellow-800">No sitemaps found at standard locations.</p>
                    <p className="text-sm text-yellow-700 mt-2">
                      Check robots.txt or try common paths like /sitemap.xml, /sitemap_index.xml
                    </p>
                  </div>
                )}
              </div>

              {/* Checked Locations */}
              <div className="mb-8">
                <h3 className="font-medium mb-4">Checked Locations</h3>
                <div className="space-y-2">
                  {result.checkedLocations.map((location, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm p-2 bg-gray-50 border border-gray-200">
                      {location.found ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <X className="w-4 h-4 text-gray-400" />
                      )}
                      <span className={location.found ? 'text-green-700' : 'text-gray-600'}>
                        {location.path}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sitemap Structure */}
              {result.structure && (
                <div className="mb-8">
                  <h3 className="font-medium mb-4">Sitemap Structure Analysis</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div className="p-3 bg-blue-50 border border-blue-200">
                      <div className="text-2xl font-medium text-blue-600">{result.structure.pages}</div>
                      <div className="text-sm text-blue-700">Pages</div>
                    </div>
                    <div className="p-3 bg-green-50 border border-green-200">
                      <div className="text-2xl font-medium text-green-600">{result.structure.posts}</div>
                      <div className="text-sm text-green-700">Posts</div>
                    </div>
                    <div className="p-3 bg-purple-50 border border-purple-200">
                      <div className="text-2xl font-medium text-purple-600">{result.structure.categories}</div>
                      <div className="text-sm text-purple-700">Categories</div>
                    </div>
                    <div className="p-3 bg-yellow-50 border border-yellow-200">
                      <div className="text-2xl font-medium text-yellow-600">{result.structure.products}</div>
                      <div className="text-sm text-yellow-700">Products</div>
                    </div>
                    <div className="p-3 bg-red-50 border border-red-200">
                      <div className="text-2xl font-medium text-red-600">{result.structure.images}</div>
                      <div className="text-sm text-red-700">Images</div>
                    </div>
                    <div className="p-3 bg-gray-50 border border-gray-200">
                      <div className="text-2xl font-medium text-gray-600">{result.structure.other}</div>
                      <div className="text-sm text-gray-700">Other</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Recommendations */}
              <div className="p-4 bg-blue-50 border border-blue-200">
                <h3 className="font-medium text-blue-800 mb-3">🗺️ Sitemap Best Practices</h3>
                <ul className="text-sm text-blue-700 space-y-2">
                  <li>• Submit your sitemap to Google Search Console and Bing Webmaster Tools</li>
                  <li>• Keep sitemap files under 50MB and 50,000 URLs per file</li>
                  <li>• Use sitemap index files for large websites with multiple sitemaps</li>
                  <li>• Include lastmod dates to help search engines prioritize crawling</li>
                  <li>• Add sitemap location to robots.txt: Sitemap: https://example.com/sitemap.xml</li>
                  <li>• Update sitemaps automatically when content changes</li>
                  <li>• Include only canonical URLs in your sitemap</li>
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
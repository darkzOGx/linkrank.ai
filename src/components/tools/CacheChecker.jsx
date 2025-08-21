import React, { useState } from 'react';
import { Calendar, Search, CheckCircle, X, AlertTriangle, Globe, Server, FileText, Shield } from 'lucide-react';

export default function CacheChecker() {
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

      const response = await fetch(`/api/cache-checker?url=${encodeURIComponent(cleanUrl)}`);
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error: 'Network error occurred while checking Google cache'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    if (score >= 40) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const getCacheStatusColor = (status) => {
    switch (status) {
      case 'cached': return 'bg-green-100 text-green-800';
      case 'likely_cached': return 'bg-blue-100 text-blue-800';
      case 'possibly_cached': return 'bg-yellow-100 text-yellow-800';
      case 'not_cached': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getIndexabilityColor = (level) => {
    switch (level) {
      case 'good': return 'bg-green-100 text-green-800';
      case 'fair': return 'bg-yellow-100 text-yellow-800';
      case 'poor': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCacheStatus = (status) => {
    switch (status) {
      case 'cached': return 'Cached';
      case 'likely_cached': return 'Likely Cached';
      case 'possibly_cached': return 'Possibly Cached';
      case 'not_cached': return 'Not Cached';
      default: return 'Unknown';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not available';
    return new Date(dateString).toLocaleString();
  };

  const getStatusIcon = (exists, accessible) => {
    if (exists && accessible) {
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    } else if (exists && !accessible) {
      return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
    } else {
      return <X className="w-5 h-5 text-red-600" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-medium text-black mb-4">Google Cache Date Checker</h1>
        <p className="text-gray-700">
          Check if your website pages are cached by Google and analyze cache-related factors.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex flex-col sm:flex-row gap-0 max-w-2xl mx-auto">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter URL to check cache status (e.g., https://example.com)"
            className="flex-1 px-4 py-3 text-base bg-white border border-black rounded-none focus:ring-1 focus:ring-black focus:outline-none placeholder-gray-500"
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-black text-white font-medium flex items-center justify-center gap-2 hover:bg-gray-800 disabled:bg-gray-400 transition-colors"
          >
            {isLoading ? 'Checking...' : 'Check Cache'}
            {!isLoading && <Calendar className="w-4 h-4" />}
          </button>
        </div>
      </form>

      {result && (
        <div className="border border-black">
          <div className="bg-gray-50 p-4 border-b border-black">
            <h2 className="text-lg font-medium">Google Cache Analysis Results</h2>
            <p className="text-sm text-gray-600 mt-1">{result.domain}</p>
          </div>

          {result.success ? (
            <div className="p-6">
              {/* Cache Health Score */}
              <div className="text-center mb-8">
                <div className={`text-6xl font-bold mx-auto w-32 h-32 rounded-full flex items-center justify-center ${getScoreColor(result.cacheHealthScore || 0)}`}>
                  {result.cacheHealthScore || 0}
                </div>
                <p className="text-lg font-medium mt-2">Cache Health Score</p>
                <p className="text-sm text-gray-600">Based on cache status and indexability factors</p>
              </div>

              {/* Cache Status Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="text-center p-4 border border-gray-200">
                  <div className={`text-xl font-bold px-3 py-1 rounded ${getCacheStatusColor(result.cacheStatus)}`}>
                    {formatCacheStatus(result.cacheStatus)}
                  </div>
                  <div className="text-sm text-gray-600 mt-2">Cache Status</div>
                </div>
                <div className="text-center p-4 border border-gray-200">
                  <div className={`text-xl font-bold px-3 py-1 rounded ${getIndexabilityColor(result.indexabilityFactors?.indexability)}`}>
                    {result.indexabilityFactors?.indexability?.toUpperCase() || 'UNKNOWN'}
                  </div>
                  <div className="text-sm text-gray-600 mt-2">Indexability</div>
                </div>
                <div className="text-center p-4 border border-gray-200">
                  <div className="text-2xl font-bold text-purple-600">
                    {result.cacheability?.score || 0}%
                  </div>
                  <div className="text-sm text-gray-600 mt-2">Cacheability</div>
                </div>
              </div>

              {/* Cache Dates */}
              {(result.cacheDate || result.lastModified) && (
                <div className="mb-8">
                  <h3 className="font-medium mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Cache & Modification Dates
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {result.cacheDate && (
                      <div className="p-4 bg-blue-50 border border-blue-200">
                        <h4 className="font-medium text-blue-800 mb-2">Estimated Cache Date</h4>
                        <div className="text-blue-700">{formatDate(result.cacheDate)}</div>
                      </div>
                    )}
                    {result.lastModified && (
                      <div className="p-4 bg-green-50 border border-green-200">
                        <h4 className="font-medium text-green-800 mb-2">Last Modified</h4>
                        <div className="text-green-700">{formatDate(result.lastModified)}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Cacheability Analysis */}
              {result.cacheability && (
                <div className="mb-8">
                  <h3 className="font-medium mb-4 flex items-center gap-2">
                    <Server className="w-5 h-5" />
                    Cacheability Analysis
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="p-4 border border-gray-200">
                      <h4 className="font-medium mb-3">Cacheability Level: {result.cacheability.level}</h4>
                      <div className="space-y-2">
                        {result.cacheability.factors && result.cacheability.factors.map((factor, index) => (
                          <div key={index} className="text-sm p-2 bg-gray-50 border border-gray-200">
                            {factor}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Cache Headers Analysis */}
                    {result.details?.headerAnalysis && !result.details.headerAnalysis.error && (
                      <div className="p-4 border border-gray-200">
                        <h4 className="font-medium mb-3">HTTP Cache Headers</h4>
                        <div className="space-y-2">
                          {result.details.headerAnalysis.cacheHeaders?.lastModified && (
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Last-Modified:</span>
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            </div>
                          )}
                          {result.details.headerAnalysis.cacheHeaders?.etag && (
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">ETag:</span>
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            </div>
                          )}
                          {result.details.headerAnalysis.cacheHeaders?.cacheControl && (
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Cache-Control:</span>
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            </div>
                          )}
                          {result.details.headerAnalysis.cacheHeaders?.expires && (
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Expires:</span>
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Indexability Factors */}
              {result.indexabilityFactors && (
                <div className="mb-8">
                  <h3 className="font-medium mb-4 flex items-center gap-2">
                    <Search className="w-5 h-5" />
                    Indexability Factors
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                    <div className="p-4 bg-gray-50 border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Robots.txt</span>
                        {getStatusIcon(
                          result.indexabilityFactors.robotsTxt === 'exists',
                          result.indexabilityFactors.robotsTxt === 'exists'
                        )}
                      </div>
                      <div className="text-sm text-gray-600">
                        {result.indexabilityFactors.robotsTxt === 'exists' ? 'Found' : 'Missing'}
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">XML Sitemap</span>
                        {getStatusIcon(
                          result.indexabilityFactors.sitemap === 'exists',
                          result.indexabilityFactors.sitemap === 'exists'
                        )}
                      </div>
                      <div className="text-sm text-gray-600">
                        {result.indexabilityFactors.sitemap === 'exists' ? 'Found' : 'Missing'}
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">HTTP Status</span>
                        {getStatusIcon(
                          result.indexabilityFactors.httpStatus === 'ok',
                          result.indexabilityFactors.httpStatus === 'ok'
                        )}
                      </div>
                      <div className="text-sm text-gray-600">
                        {result.indexabilityFactors.httpStatus === 'ok' ? '200 OK' : 'Error'}
                      </div>
                    </div>
                  </div>

                  {/* Indexability Issues and Positives */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {result.indexabilityFactors.issues && result.indexabilityFactors.issues.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-3 text-red-700">❌ Issues Found</h4>
                        <div className="space-y-2">
                          {result.indexabilityFactors.issues.map((issue, index) => (
                            <div key={index} className="p-3 bg-red-50 border border-red-200">
                              <div className="flex items-center gap-2">
                                <X className="w-4 h-4 text-red-600" />
                                <span className="text-red-800 text-sm">{issue}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {result.indexabilityFactors.positives && result.indexabilityFactors.positives.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-3 text-green-700">✅ Positive Factors</h4>
                        <div className="space-y-2">
                          {result.indexabilityFactors.positives.map((positive, index) => (
                            <div key={index} className="p-3 bg-green-50 border border-green-200">
                              <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                <span className="text-green-800 text-sm">{positive}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Content Analysis */}
              {result.details?.contentAnalysis && !result.details.contentAnalysis.error && (
                <div className="mb-8">
                  <h3 className="font-medium mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Content Analysis
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-50 border border-gray-200">
                      <div className="text-lg font-bold">
                        {result.details.contentAnalysis.cacheability}
                      </div>
                      <div className="text-sm text-gray-600">Content Type</div>
                    </div>
                    <div className="p-4 bg-gray-50 border border-gray-200">
                      <div className="text-lg font-bold">
                        {result.details.contentAnalysis.dynamicContent ? 'Yes' : 'No'}
                      </div>
                      <div className="text-sm text-gray-600">Dynamic Content</div>
                    </div>
                    <div className="p-4 bg-gray-50 border border-gray-200">
                      <div className="text-lg font-bold">
                        {result.details.contentAnalysis.personalizedContent ? 'Yes' : 'No'}
                      </div>
                      <div className="text-sm text-gray-600">Personalized</div>
                    </div>
                  </div>

                  {result.details.contentAnalysis.factors && result.details.contentAnalysis.factors.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Content Factors</h4>
                      <div className="space-y-2">
                        {result.details.contentAnalysis.factors.map((factor, index) => (
                          <div key={index} className="text-sm p-2 bg-blue-50 border border-blue-200">
                            {factor}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Detailed Analysis */}
              {result.details && (
                <div className="mb-8">
                  <h3 className="font-medium mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Detailed Analysis
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Google Cache Check */}
                    <div className="p-4 border border-gray-200">
                      <h4 className="font-medium mb-2">Google Cache Check</h4>
                      {result.details.googleCacheCheck?.error ? (
                        <div className="text-red-600 text-sm">{result.details.googleCacheCheck.error}</div>
                      ) : (
                        <div className="space-y-2">
                          <div className="text-sm">
                            <span className="font-medium">Method:</span> {result.details.googleCacheCheck?.method}
                          </div>
                          <div className="text-sm">
                            <span className="font-medium">Found:</span> {result.details.googleCacheCheck?.found ? 'Yes' : 'No'}
                          </div>
                          <div className="text-sm">
                            <span className="font-medium">Accessible:</span> {result.details.googleCacheCheck?.accessibility ? 'Yes' : 'No'}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Robots Analysis */}
                    <div className="p-4 border border-gray-200">
                      <h4 className="font-medium mb-2">Robots.txt Analysis</h4>
                      {result.details.robotsAnalysis?.error ? (
                        <div className="text-red-600 text-sm">{result.details.robotsAnalysis.error}</div>
                      ) : (
                        <div className="space-y-2">
                          <div className="text-sm">
                            <span className="font-medium">Exists:</span> {result.details.robotsAnalysis?.exists ? 'Yes' : 'No'}
                          </div>
                          <div className="text-sm">
                            <span className="font-medium">Allows Crawling:</span> {result.details.robotsAnalysis?.allowsCrawling ? 'Yes' : 'No'}
                          </div>
                          <div className="text-sm">
                            <span className="font-medium">Has Sitemap:</span> {result.details.robotsAnalysis?.hasSitemap ? 'Yes' : 'No'}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {result.recommendations && result.recommendations.length > 0 && (
                <div className="p-4 bg-blue-50 border border-blue-200">
                  <h3 className="font-medium text-blue-800 mb-3">🚀 Cache Optimization Recommendations</h3>
                  <ul className="text-sm text-blue-700 space-y-2">
                    {result.recommendations.map((rec, index) => (
                      <li key={index}>• {rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="p-6">
              <div className="text-red-600 mb-4">
                <span className="font-medium">Error:</span> {result.error || 'An unknown error occurred'}
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200">
                <h3 className="font-medium text-blue-800 mb-3">💡 Cache Check Tips</h3>
                <ul className="text-sm text-blue-700 space-y-2">
                  <li>• Ensure the URL is valid and accessible</li>
                  <li>• Check if the website allows automated requests</li>
                  <li>• Verify the page returns a 200 status code</li>
                  <li>• Some pages may not be cached due to dynamic content</li>
                  <li>• Try checking the main domain page if subpages fail</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
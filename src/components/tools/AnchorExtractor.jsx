import React, { useState } from 'react';
import { Link, ExternalLink, CheckCircle, X, AlertTriangle, TrendingUp, Hash } from 'lucide-react';

export default function AnchorExtractor() {
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

      const response = await fetch(`/api/anchor-extractor?url=${encodeURIComponent(cleanUrl)}`);
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error: 'Network error occurred while extracting anchor texts'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getLinkTypeColor = (type) => {
    switch (type) {
      case 'internal': return 'bg-blue-100 text-blue-800';
      case 'external': return 'bg-green-100 text-green-800';
      case 'email': return 'bg-purple-100 text-purple-800';
      case 'phone': return 'bg-orange-100 text-orange-800';
      case 'javascript': return 'bg-gray-100 text-gray-800';
      case 'fragment': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const shortenText = (text, maxLength = 60) => {
    if (text && text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-medium text-black mb-4">Anchor Text Link Extractor</h1>
        <p className="text-gray-700">
          Extract and analyze all anchor texts from web pages for SEO optimization insights.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex flex-col sm:flex-row gap-0 max-w-2xl mx-auto">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter URL to extract anchor texts (e.g., https://example.com)"
            className="flex-1 px-4 py-3 text-base bg-white border border-black rounded-none focus:ring-1 focus:ring-black focus:outline-none placeholder-gray-500"
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-black text-white font-medium flex items-center justify-center gap-2 hover:bg-gray-800 disabled:bg-gray-400 transition-colors"
          >
            {isLoading ? 'Extracting...' : 'Extract Anchors'}
            {!isLoading && <Link className="w-4 h-4" />}
          </button>
        </div>
      </form>

      {result && (
        <div className="border border-black">
          <div className="bg-gray-50 p-4 border-b border-black">
            <h2 className="text-lg font-medium">Anchor Text Analysis Results</h2>
            <p className="text-sm text-gray-600 mt-1">{result.url}</p>
          </div>

          {result.success ? (
            <div className="p-6">
              {/* Summary Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
                <div className="text-center p-4 border border-gray-200">
                  <div className="text-3xl font-bold text-blue-600">{result.totalLinks}</div>
                  <div className="text-sm text-gray-600 mt-1">Total Links</div>
                </div>
                <div className="text-center p-4 border border-gray-200">
                  <div className="text-3xl font-bold text-green-600">{result.summary?.internalLinks || 0}</div>
                  <div className="text-sm text-gray-600 mt-1">Internal Links</div>
                </div>
                <div className="text-center p-4 border border-gray-200">
                  <div className="text-3xl font-bold text-orange-600">{result.summary?.externalLinks || 0}</div>
                  <div className="text-sm text-gray-600 mt-1">External Links</div>
                </div>
                <div className="text-center p-4 border border-gray-200">
                  <div className="text-3xl font-bold text-purple-600">{result.summary?.emptyAnchors || 0}</div>
                  <div className="text-sm text-gray-600 mt-1">Empty Anchors</div>
                </div>
              </div>

              {/* Anchor Analysis Score */}
              {result.insights?.score !== undefined && (
                <div className="text-center mb-8">
                  <div className={`text-6xl font-bold mx-auto w-32 h-32 rounded-full flex items-center justify-center ${getScoreColor(result.insights.score)}`}>
                    {result.insights.score}
                  </div>
                  <p className="text-lg font-medium mt-2">Anchor Text Quality Score</p>
                  <p className="text-sm text-gray-600">Based on anchor text patterns and optimization</p>
                </div>
              )}

              {/* Anchor Statistics */}
              {result.anchorAnalysis && (
                <div className="mb-8">
                  <h3 className="font-medium mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Anchor Text Statistics
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-3 bg-gray-50 border border-gray-200">
                      <div className="text-lg font-bold">{result.anchorAnalysis.statistics?.uniqueAnchors || 0}</div>
                      <div className="text-sm text-gray-600">Unique Anchors</div>
                    </div>
                    <div className="p-3 bg-gray-50 border border-gray-200">
                      <div className="text-lg font-bold">{result.anchorAnalysis.statistics?.avgLength || 0}</div>
                      <div className="text-sm text-gray-600">Avg Length</div>
                    </div>
                    <div className="p-3 bg-gray-50 border border-gray-200">
                      <div className="text-lg font-bold">{result.anchorAnalysis.statistics?.diversityScore || 0}%</div>
                      <div className="text-sm text-gray-600">Diversity Score</div>
                    </div>
                    <div className="p-3 bg-gray-50 border border-gray-200">
                      <div className="text-lg font-bold">{result.anchorAnalysis.statistics?.keywordRichAnchors || 0}</div>
                      <div className="text-sm text-gray-600">Keyword Rich</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Most Common Anchor Texts */}
              {result.anchorAnalysis?.anchorFrequency && result.anchorAnalysis.anchorFrequency.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-medium mb-4 flex items-center gap-2">
                    <Hash className="w-5 h-5" />
                    Most Common Anchor Texts
                  </h3>
                  <div className="space-y-2">
                    {result.anchorAnalysis.anchorFrequency.slice(0, 10).map((anchor, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200">
                        <span className="font-medium">{shortenText(anchor.text)}</span>
                        <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded">
                          {anchor.count} times
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Link Categories */}
              {result.categorizedLinks && (
                <div className="mb-8">
                  <h3 className="font-medium mb-4 flex items-center gap-2">
                    <Link className="w-5 h-5" />
                    Link Categories
                  </h3>
                  
                  {/* Internal Links */}
                  {result.categorizedLinks.internal && result.categorizedLinks.internal.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-medium mb-3">Internal Links ({result.categorizedLinks.internal.length})</h4>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {result.categorizedLinks.internal.slice(0, 20).map((link, index) => (
                          <div key={index} className="p-3 bg-blue-50 border border-blue-200">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="font-medium text-sm">
                                  {link.anchorText || '<empty anchor>'}
                                </div>
                                <div className="text-xs text-gray-600 break-all">
                                  {shortenText(link.href, 80)}
                                </div>
                              </div>
                              <span className={`text-xs px-2 py-1 rounded ml-2 ${getLinkTypeColor(link.linkType)}`}>
                                Internal
                              </span>
                            </div>
                          </div>
                        ))}
                        {result.categorizedLinks.internal.length > 20 && (
                          <div className="text-center text-sm text-gray-600 p-2">
                            ... and {result.categorizedLinks.internal.length - 20} more internal links
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* External Links */}
                  {result.categorizedLinks.external && result.categorizedLinks.external.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-medium mb-3">External Links ({result.categorizedLinks.external.length})</h4>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {result.categorizedLinks.external.slice(0, 20).map((link, index) => (
                          <div key={index} className="p-3 bg-green-50 border border-green-200">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="font-medium text-sm">
                                  {link.anchorText || '<empty anchor>'}
                                </div>
                                <div className="text-xs text-gray-600 break-all">
                                  {shortenText(link.href, 80)}
                                </div>
                                {link.domain && (
                                  <div className="text-xs text-green-700 mt-1">
                                    Domain: {link.domain}
                                  </div>
                                )}
                              </div>
                              <span className={`text-xs px-2 py-1 rounded ml-2 ${getLinkTypeColor(link.linkType)}`}>
                                External
                              </span>
                            </div>
                          </div>
                        ))}
                        {result.categorizedLinks.external.length > 20 && (
                          <div className="text-center text-sm text-gray-600 p-2">
                            ... and {result.categorizedLinks.external.length - 20} more external links
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Special Links */}
                  {result.categorizedLinks.special && result.categorizedLinks.special.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-medium mb-3">Special Links ({result.categorizedLinks.special.length})</h4>
                      <div className="space-y-2">
                        {result.categorizedLinks.special.map((link, index) => (
                          <div key={index} className="p-3 bg-purple-50 border border-purple-200">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="font-medium text-sm">
                                  {link.anchorText || '<empty anchor>'}
                                </div>
                                <div className="text-xs text-gray-600 break-all">
                                  {shortenText(link.href, 80)}
                                </div>
                              </div>
                              <span className={`text-xs px-2 py-1 rounded ml-2 ${getLinkTypeColor(link.linkType)}`}>
                                {link.linkType}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Issues */}
              {result.insights?.issues && result.insights.issues.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-medium mb-4 flex items-center gap-2">
                    <X className="w-5 h-5 text-red-600" />
                    Issues Found
                  </h3>
                  <div className="space-y-2">
                    {result.insights.issues.map((issue, index) => (
                      <div key={index} className="p-3 bg-red-50 border border-red-200">
                        <span className="text-red-800 text-sm">{issue}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Insights */}
              {result.insights?.insights && result.insights.insights.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-medium mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                    SEO Insights
                  </h3>
                  <div className="space-y-2">
                    {result.insights.insights.map((insight, index) => (
                      <div key={index} className="p-3 bg-blue-50 border border-blue-200">
                        <span className="text-blue-800 text-sm">{insight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {result.insights?.recommendations && result.insights.recommendations.length > 0 && (
                <div className="p-4 bg-green-50 border border-green-200">
                  <h3 className="font-medium text-green-800 mb-3">⚡ Optimization Recommendations</h3>
                  <ul className="text-sm text-green-700 space-y-2">
                    {result.insights.recommendations.map((rec, index) => (
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
                <h3 className="font-medium text-blue-800 mb-3">🔍 Troubleshooting Tips</h3>
                <ul className="text-sm text-blue-700 space-y-2">
                  <li>• Ensure the URL is valid and accessible</li>
                  <li>• Check if the website blocks automated requests</li>
                  <li>• Verify the page contains anchor links</li>
                  <li>• Try with a different page from the same domain</li>
                  <li>• Some websites may require specific user agents</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
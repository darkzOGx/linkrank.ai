import React, { useState } from 'react';
import { ArrowRight, Link, CheckCircle, X, AlertTriangle, ExternalLink, Hash, Mail } from 'lucide-react';

export default function InternalLinkChecker() {
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

      const response = await fetch(`/api/internal-links?url=${encodeURIComponent(cleanUrl)}`);
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error: 'Network error occurred while analyzing internal links'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getHealthColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-medium text-black mb-4">Internal Link Checker</h1>
        <p className="text-gray-700">
          Analyze your website's internal link structure and identify optimization opportunities.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex flex-col sm:flex-row gap-0 max-w-2xl mx-auto">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter website URL (e.g., https://example.com)"
            className="flex-1 px-4 py-3 text-base bg-white border border-black rounded-none focus:ring-1 focus:ring-black focus:outline-none placeholder-gray-500"
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-black text-white font-medium flex items-center justify-center gap-2 hover:bg-gray-800 disabled:bg-gray-400 transition-colors"
          >
            {isLoading ? 'Analyzing...' : 'Check Links'}
            {!isLoading && <Link className="w-4 h-4" />}
          </button>
        </div>
      </form>

      {result && (
        <div className="border border-black">
          <div className="bg-gray-50 p-4 border-b border-black">
            <h2 className="text-lg font-medium">Internal Link Analysis</h2>
            <p className="text-sm text-gray-600 mt-1">{result.url}</p>
          </div>

          {result.success ? (
            <div className="p-6">
              {/* Overview Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="text-center p-4 border border-gray-200">
                  <div className="text-3xl font-bold text-blue-600">{result.totalLinks}</div>
                  <div className="text-sm text-gray-600 mt-1">Total Links</div>
                </div>
                <div className="text-center p-4 border border-gray-200">
                  <div className="text-3xl font-bold text-green-600">{result.internalLinks}</div>
                  <div className="text-sm text-gray-600 mt-1">Internal Links</div>
                </div>
                <div className="text-center p-4 border border-gray-200">
                  <div className="text-3xl font-bold text-purple-600">{result.externalLinks}</div>
                  <div className="text-sm text-gray-600 mt-1">External Links</div>
                </div>
                <div className="text-center p-4 border border-gray-200">
                  <div className="text-3xl font-bold text-orange-600">{result.analysis?.internalRatio}%</div>
                  <div className="text-sm text-gray-600 mt-1">Internal Ratio</div>
                </div>
              </div>

              {/* Link Health Score */}
              {result.linkHealth && (
                <div className="text-center mb-8">
                  <div className={`text-6xl font-bold mx-auto w-32 h-32 rounded-full flex items-center justify-center ${getHealthColor(result.linkHealth.score)}`}>
                    {result.linkHealth.score}
                  </div>
                  <p className="text-lg font-medium mt-2">Link Health Score</p>
                  <p className="text-sm text-gray-600">Based on link quality and structure</p>
                </div>
              )}

              {/* Link Structure Analysis */}
              {result.linkStructure && (
                <div className="mb-8">
                  <h3 className="font-medium mb-4">Link Structure Analysis</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 border border-gray-200">
                      <h4 className="font-medium mb-2">Depth Distribution</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Shallow (≤1 level):</span>
                          <span>{result.linkStructure.depthDistribution.shallow}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Medium (2-3 levels):</span>
                          <span>{result.linkStructure.depthDistribution.medium}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Deep (&gt;3 levels):</span>
                          <span>{result.linkStructure.depthDistribution.deep}</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 border border-gray-200">
                      <h4 className="font-medium mb-2">Structure Metrics</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Average Depth:</span>
                          <span>{result.linkStructure.averageDepth}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Max Depth:</span>
                          <span>{result.linkStructure.maxDepth}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Unique Pages:</span>
                          <span>{result.analysis?.uniqueInternalPages}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Anchor Text Analysis */}
              {result.anchorTextAnalysis && (
                <div className="mb-8">
                  <h3 className="font-medium mb-4">Anchor Text Analysis</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Top Anchor Texts</h4>
                      <div className="space-y-2">
                        {result.anchorTextAnalysis.topAnchorTexts?.map((anchor, index) => (
                          <div key={index} className="flex justify-between items-center p-2 bg-gray-50 border border-gray-200">
                            <span className="text-sm truncate flex-1">{anchor.text}</span>
                            <span className="text-sm font-medium text-blue-600 ml-2">{anchor.count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-3">Anchor Text Stats</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Total Anchors:</span>
                          <span>{result.anchorTextAnalysis.totalCount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Empty Anchors:</span>
                          <span className={result.anchorTextAnalysis.emptyAnchors > 0 ? 'text-red-600' : ''}>
                            {result.anchorTextAnalysis.emptyAnchors}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Unique Anchors:</span>
                          <span>{result.anchorTextAnalysis.uniqueAnchors}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Problematic Anchors:</span>
                          <span className={result.anchorTextAnalysis.problematicAnchors > 0 ? 'text-yellow-600' : ''}>
                            {result.anchorTextAnalysis.problematicAnchors}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Sample Links */}
              <div className="mb-8">
                <h3 className="font-medium mb-4">Sample Internal Links</h3>
                <div className="max-h-64 overflow-y-auto">
                  <div className="space-y-2">
                    {result.linkDetails?.internal?.slice(0, 20).map((link, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 border border-gray-200">
                        <Link className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{link.anchorText || 'No anchor text'}</div>
                          <div className="text-xs text-gray-500 truncate">{link.fullUrl || link.href}</div>
                          <div className="flex gap-2 mt-1">
                            {link.isRelative && (
                              <span className="text-xs bg-blue-100 text-blue-800 px-1 rounded">Relative</span>
                            )}
                            {link.hasParameters && (
                              <span className="text-xs bg-yellow-100 text-yellow-800 px-1 rounded">Parameters</span>
                            )}
                            {link.isInvalid && (
                              <span className="text-xs bg-red-100 text-red-800 px-1 rounded">Invalid</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Link Health Issues */}
              {result.linkHealth?.issues && result.linkHealth.issues.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-medium mb-4 flex items-center gap-2">
                    <X className="w-5 h-5 text-red-600" />
                    Link Health Issues
                  </h3>
                  <div className="space-y-2">
                    {result.linkHealth.issues.map((issue, index) => (
                      <div key={index} className="p-3 bg-red-50 border border-red-200">
                        <span className="text-red-800 text-sm">{issue}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Warnings */}
              {result.linkHealth?.warnings && result.linkHealth.warnings.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-medium mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    Warnings
                  </h3>
                  <div className="space-y-2">
                    {result.linkHealth.warnings.map((warning, index) => (
                      <div key={index} className="p-3 bg-yellow-50 border border-yellow-200">
                        <span className="text-yellow-800 text-sm">{warning}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Duplicate Links */}
              {result.analysis?.duplicateLinks && result.analysis.duplicateLinks.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-medium mb-4">Duplicate Links</h3>
                  <div className="space-y-2">
                    {result.analysis.duplicateLinks.map((duplicate, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-yellow-50 border border-yellow-200">
                        <span className="text-sm truncate flex-1">{duplicate.url}</span>
                        <span className="text-sm font-medium text-yellow-600 ml-2">{duplicate.count} times</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {result.recommendations && result.recommendations.length > 0 && (
                <div className="p-4 bg-blue-50 border border-blue-200">
                  <h3 className="font-medium text-blue-800 mb-3">🔗 Internal Linking Recommendations</h3>
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
                <h3 className="font-medium text-blue-800 mb-3">🔍 Troubleshooting Tips</h3>
                <ul className="text-sm text-blue-700 space-y-2">
                  <li>• Ensure the URL is correct and accessible</li>
                  <li>• Check if the website blocks automated requests</li>
                  <li>• Verify the page contains HTML content with links</li>
                  <li>• Make sure there are no authentication requirements</li>
                  <li>• Test with a different page on the same website</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
import React, { useState } from 'react';
import { ArrowRight, Search, CheckCircle, X, AlertTriangle, Globe, Clock, FileText } from 'lucide-react';

export default function CrawlTest() {
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

      const response = await fetch(`/api/crawl-test?url=${encodeURIComponent(cleanUrl)}`);
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error: 'Network error occurred while testing crawlability'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-medium text-black mb-4">Page Crawl Test</h1>
        <p className="text-gray-700">
          Test how search engine crawlers can access and understand your webpage content.
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
            {isLoading ? 'Testing...' : 'Test Crawlability'}
            {!isLoading && <Search className="w-4 h-4" />}
          </button>
        </div>
      </form>

      {result && (
        <div className="border border-black">
          <div className="bg-gray-50 p-4 border-b border-black">
            <h2 className="text-lg font-medium">Crawl Test Results</h2>
            <p className="text-sm text-gray-600 mt-1">{result.url}</p>
          </div>

          {result.success ? (
            <div className="p-6">
              {/* Overall Assessment */}
              <div className="text-center mb-8">
                <div className={`text-6xl font-bold mx-auto w-32 h-32 rounded-full flex items-center justify-center ${getScoreColor(result.score || 0)}`}>
                  {result.score || 0}
                </div>
                <p className="text-lg font-medium mt-2">
                  {result.crawlable ? 'Crawlable' : 'Crawling Issues Detected'}
                </p>
                <p className="text-sm text-gray-600">Overall crawlability assessment</p>
              </div>

              {/* Technical Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="text-center p-4 border border-gray-200">
                  <div className="text-2xl font-medium mb-2">{result.statusCode}</div>
                  <div className="text-sm text-gray-600">HTTP Status</div>
                </div>
                <div className="text-center p-4 border border-gray-200">
                  <div className="text-2xl font-medium mb-2">{(result.contentLength / 1024).toFixed(1)}KB</div>
                  <div className="text-sm text-gray-600">Content Size</div>
                </div>
                <div className="text-center p-4 border border-gray-200">
                  <div className="text-2xl font-medium mb-2">{result.contentType?.split(';')[0] || 'Unknown'}</div>
                  <div className="text-sm text-gray-600">Content Type</div>
                </div>
              </div>

              {/* Crawl Checks */}
              <div className="mb-8">
                <h3 className="font-medium mb-4">Crawlability Checks</h3>
                <div className="space-y-3">
                  {result.checks?.map((check, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 border border-gray-200">
                      {check.passed ? (
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      ) : (
                        <X className="w-5 h-5 text-red-600 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <div className="font-medium text-sm">{check.name}</div>
                        <div className="text-sm text-gray-600 mt-1">{check.description}</div>
                        {check.details && (
                          <div className="text-xs text-gray-500 mt-1">{check.details}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Issues */}
              {result.issues && result.issues.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-medium mb-4 flex items-center gap-2">
                    <X className="w-5 h-5 text-red-600" />
                    Critical Issues
                  </h3>
                  <div className="space-y-2">
                    {result.issues.map((issue, index) => (
                      <div key={index} className="p-3 bg-red-50 border border-red-200">
                        <span className="text-red-800 text-sm">{issue}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Warnings */}
              {result.warnings && result.warnings.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-medium mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    Warnings
                  </h3>
                  <div className="space-y-2">
                    {result.warnings.map((warning, index) => (
                      <div key={index} className="p-3 bg-yellow-50 border border-yellow-200">
                        <span className="text-yellow-800 text-sm">{warning}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Analysis Summary */}
              {result.analysis && (
                <div className="mb-8 p-4 bg-blue-50 border border-blue-200">
                  <h3 className="font-medium text-blue-800 mb-3">📊 Analysis Summary</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-blue-700">Total Checks:</span>
                      <span className="ml-2 font-medium text-blue-800">{result.analysis.totalChecks}</span>
                    </div>
                    <div>
                      <span className="text-blue-700">Passed:</span>
                      <span className="ml-2 font-medium text-green-600">{result.analysis.passedChecks}</span>
                    </div>
                    <div>
                      <span className="text-blue-700">Failed:</span>
                      <span className="ml-2 font-medium text-red-600">{result.analysis.failedChecks}</span>
                    </div>
                    <div>
                      <span className="text-blue-700">Structured Data:</span>
                      <span className={`ml-2 font-medium ${result.analysis.hasStructuredData ? 'text-green-600' : 'text-gray-600'}`}>
                        {result.analysis.hasStructuredData ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {result.recommendations && result.recommendations.length > 0 && (
                <div className="p-4 bg-green-50 border border-green-200">
                  <h3 className="font-medium text-green-800 mb-3">🚀 Crawlability Recommendations</h3>
                  <ul className="text-sm text-green-700 space-y-2">
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
                  <li>• Ensure the URL is correct and the website is accessible</li>
                  <li>• Check if the website blocks automated requests</li>
                  <li>• Verify the website responds to HTTP requests properly</li>
                  <li>• Make sure there are no authentication requirements</li>
                  <li>• Test the URL in a regular browser first</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
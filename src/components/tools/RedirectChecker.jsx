import React, { useState } from 'react';
import { ArrowRight, ExternalLink, CheckCircle, X, AlertTriangle, Clock, Shield } from 'lucide-react';

export default function RedirectChecker() {
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

      const response = await fetch(`/api/redirect-checker?url=${encodeURIComponent(cleanUrl)}`);
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error: 'Network error occurred while checking redirects'
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

  const getStatusColor = (statusCode) => {
    if (statusCode >= 200 && statusCode < 300) return 'bg-green-100 text-green-800';
    if (statusCode >= 300 && statusCode < 400) return 'bg-blue-100 text-blue-800';
    if (statusCode >= 400 && statusCode < 500) return 'bg-yellow-100 text-yellow-800';
    if (statusCode >= 500) return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getRedirectTypeColor = (permanent) => {
    return permanent ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
  };

  const shortenUrl = (url, maxLength = 50) => {
    if (url && url.length > maxLength) {
      return url.substring(0, maxLength) + '...';
    }
    return url;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-medium text-black mb-4">URL Redirect Checker</h1>
        <p className="text-gray-700">
          Trace URL redirects and analyze redirect chains for SEO and performance optimization.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex flex-col sm:flex-row gap-0 max-w-2xl mx-auto">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter URL to check redirects (e.g., https://example.com)"
            className="flex-1 px-4 py-3 text-base bg-white border border-black rounded-none focus:ring-1 focus:ring-black focus:outline-none placeholder-gray-500"
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-black text-white font-medium flex items-center justify-center gap-2 hover:bg-gray-800 disabled:bg-gray-400 transition-colors"
          >
            {isLoading ? 'Checking...' : 'Check Redirects'}
            {!isLoading && <ExternalLink className="w-4 h-4" />}
          </button>
        </div>
      </form>

      {result && (
        <div className="border border-black">
          <div className="bg-gray-50 p-4 border-b border-black">
            <h2 className="text-lg font-medium">Redirect Analysis Results</h2>
            <p className="text-sm text-gray-600 mt-1">{result.startUrl}</p>
          </div>

          {result.success ? (
            <div className="p-6">
              {/* Health Score */}
              <div className="text-center mb-8">
                <div className={`text-6xl font-bold mx-auto w-32 h-32 rounded-full flex items-center justify-center ${getHealthColor(result.healthScore || 0)}`}>
                  {result.healthScore || 0}
                </div>
                <p className="text-lg font-medium mt-2">Redirect Health Score</p>
                <p className="text-sm text-gray-600">Based on redirect chain quality and performance</p>
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="text-center p-4 border border-gray-200">
                  <div className="text-3xl font-bold text-blue-600">{result.totalRedirects}</div>
                  <div className="text-sm text-gray-600 mt-1">Total Redirects</div>
                </div>
                <div className="text-center p-4 border border-gray-200">
                  <div className="text-3xl font-bold text-green-600">
                    {result.performance?.totalTime?.toFixed(0) || 'N/A'}ms
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Total Time</div>
                </div>
                <div className="text-center p-4 border border-gray-200">
                  <div className="text-3xl font-bold text-purple-600">
                    {result.security?.domainChanges || 0}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Domain Changes</div>
                </div>
              </div>

              {/* Redirect Chain */}
              <div className="mb-8">
                <h3 className="font-medium mb-4 flex items-center gap-2">
                  <ExternalLink className="w-5 h-5" />
                  Redirect Chain
                </h3>
                <div className="space-y-3">
                  {result.redirectChain?.map((redirect, index) => (
                    <div key={index} className="border border-gray-200 p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="bg-gray-100 text-gray-800 text-sm px-2 py-1 rounded">
                              Step {index + 1}
                            </span>
                            {redirect.statusCode && (
                              <span className={`text-sm px-2 py-1 rounded ${getStatusColor(redirect.statusCode)}`}>
                                {redirect.statusCode} {redirect.statusText}
                              </span>
                            )}
                            {redirect.error && (
                              <span className="text-sm px-2 py-1 rounded bg-red-100 text-red-800">
                                Error
                              </span>
                            )}
                          </div>
                          <div className="text-sm break-all">
                            <strong>URL:</strong> {redirect.url}
                          </div>
                          {redirect.error && (
                            <div className="text-sm text-red-600 mt-1">
                              <strong>Error:</strong> {redirect.error}
                            </div>
                          )}
                          {redirect.headers?.location && (
                            <div className="text-sm text-gray-600 mt-1">
                              <strong>Redirects to:</strong> {shortenUrl(redirect.headers.location)}
                            </div>
                          )}
                        </div>
                        {index < result.redirectChain.length - 1 && !redirect.error && (
                          <ArrowRight className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Redirect Types */}
              {result.redirectTypes && result.redirectTypes.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-medium mb-4">Redirect Types</h3>
                  <div className="space-y-2">
                    {result.redirectTypes.map((redirect, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200">
                        <div>
                          <span className="font-medium">Step {redirect.step}: {redirect.type}</span>
                          <div className="text-sm text-gray-600">{redirect.description}</div>
                        </div>
                        <span className={`text-sm px-2 py-1 rounded ${getRedirectTypeColor(redirect.permanent)}`}>
                          {redirect.permanent ? 'Permanent' : 'Temporary'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Performance Analysis */}
              {result.performance && (
                <div className="mb-8">
                  <h3 className="font-medium mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Performance Analysis
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {result.performance.slowestStep && (
                      <div className="p-4 bg-red-50 border border-red-200">
                        <h4 className="font-medium text-red-800 mb-2">Slowest Step</h4>
                        <div className="text-sm text-red-700">
                          <div>Step {result.performance.slowestStep.step}</div>
                          <div className="text-xs break-all">{shortenUrl(result.performance.slowestStep.url)}</div>
                          <div className="font-medium">{result.performance.slowestStep.time?.toFixed(0)}ms</div>
                        </div>
                      </div>
                    )}
                    {result.performance.fastestStep && (
                      <div className="p-4 bg-green-50 border border-green-200">
                        <h4 className="font-medium text-green-800 mb-2">Fastest Step</h4>
                        <div className="text-sm text-green-700">
                          <div>Step {result.performance.fastestStep.step}</div>
                          <div className="text-xs break-all">{shortenUrl(result.performance.fastestStep.url)}</div>
                          <div className="font-medium">{result.performance.fastestStep.time?.toFixed(0)}ms</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Security Analysis */}
              {result.security && (
                <div className="mb-8">
                  <h3 className="font-medium mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Security Analysis
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 border border-gray-200">
                      <h4 className="font-medium mb-2">Security Score</h4>
                      <div className={`text-2xl font-bold ${getHealthColor(result.security.securityScore).split(' ')[0]}`}>
                        {result.security.securityScore}%
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 border border-gray-200">
                      <h4 className="font-medium mb-2">HTTPS Upgrade</h4>
                      <div className="flex items-center gap-2">
                        {result.security.httpsUpgrade ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <X className="w-5 h-5 text-red-600" />
                        )}
                        <span>{result.security.httpsUpgrade ? 'Yes' : 'No'}</span>
                      </div>
                    </div>
                  </div>
                  
                  {result.security.suspiciousRedirects && result.security.suspiciousRedirects.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium mb-2 text-red-600">Suspicious Redirects</h4>
                      <div className="space-y-2">
                        {result.security.suspiciousRedirects.map((suspicious, index) => (
                          <div key={index} className="p-3 bg-red-50 border border-red-200">
                            <div className="font-medium text-red-800">Step {suspicious.step}: {suspicious.reason}</div>
                            <div className="text-sm text-red-700 break-all">{suspicious.url}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

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

              {/* Recommendations */}
              {result.recommendations && result.recommendations.length > 0 && (
                <div className="p-4 bg-blue-50 border border-blue-200">
                  <h3 className="font-medium text-blue-800 mb-3">🔗 Redirect Optimization Recommendations</h3>
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
                  <li>• Ensure the URL is valid and accessible</li>
                  <li>• Check if the website blocks automated requests</li>
                  <li>• Verify the URL responds to HEAD requests</li>
                  <li>• Try testing with a different URL from the same domain</li>
                  <li>• Some websites may have complex redirect configurations</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
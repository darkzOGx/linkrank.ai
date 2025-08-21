import React, { useState } from 'react';
import { ArrowRight, Code, CheckCircle, X, AlertTriangle, Shield, Zap, Globe, FileText } from 'lucide-react';

export default function HeaderTest() {
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

      const response = await fetch(`/api/header-test?url=${encodeURIComponent(cleanUrl)}`);
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error: 'Network error occurred while analyzing headers'
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

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Security': return <Shield className="w-4 h-4" />;
      case 'SEO': return <Globe className="w-4 h-4" />;
      case 'Performance': return <Zap className="w-4 h-4" />;
      case 'Content': return <FileText className="w-4 h-4" />;
      default: return <Code className="w-4 h-4" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-medium text-black mb-4">HTTP Header Test</h1>
        <p className="text-gray-700">
          Analyze HTTP headers for SEO optimization, security, and performance best practices.
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
            {isLoading ? 'Analyzing...' : 'Analyze Headers'}
            {!isLoading && <Code className="w-4 h-4" />}
          </button>
        </div>
      </form>

      {result && (
        <div className="border border-black">
          <div className="bg-gray-50 p-4 border-b border-black">
            <h2 className="text-lg font-medium">HTTP Header Analysis</h2>
            <p className="text-sm text-gray-600 mt-1">{result.url}</p>
          </div>

          {result.success !== false ? (
            <div className="p-6">
              {/* Overall Score */}
              <div className="text-center mb-8">
                <div className={`text-6xl font-bold mx-auto w-32 h-32 rounded-full flex items-center justify-center ${getScoreColor(result.score || 0)}`}>
                  {result.score || 0}
                </div>
                <p className="text-lg font-medium mt-2">Overall Header Score</p>
                <p className="text-sm text-gray-600">HTTP Status: {result.statusCode} {result.statusText}</p>
              </div>

              {/* Category Scores */}
              {result.analysis && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  <div className="text-center p-4 border border-gray-200">
                    <Shield className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                    <div className="text-2xl font-medium mb-1">{result.analysis.securityScore}%</div>
                    <div className="text-sm text-gray-600">Security Headers</div>
                  </div>
                  <div className="text-center p-4 border border-gray-200">
                    <Globe className="w-8 h-8 mx-auto mb-2 text-green-600" />
                    <div className="text-2xl font-medium mb-1">{result.analysis.seoScore}%</div>
                    <div className="text-sm text-gray-600">SEO Headers</div>
                  </div>
                  <div className="text-center p-4 border border-gray-200">
                    <Zap className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                    <div className="text-2xl font-medium mb-1">{result.analysis.performanceScore}%</div>
                    <div className="text-sm text-gray-600">Performance Headers</div>
                  </div>
                </div>
              )}

              {/* Header Checks */}
              <div className="mb-8">
                <h3 className="font-medium mb-4">Header Analysis</h3>
                <div className="space-y-3">
                  {result.checks?.map((check, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 border border-gray-200">
                      {check.passed ? (
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      ) : (
                        <X className="w-5 h-5 text-red-600 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {getCategoryIcon(check.category)}
                          <span className="font-medium text-sm">{check.name}</span>
                          <span className="text-xs bg-gray-200 px-2 py-1 rounded">{check.category}</span>
                        </div>
                        <div className="text-sm text-gray-600 mb-1">{check.description}</div>
                        <div className="text-xs bg-white px-2 py-1 rounded border font-mono">
                          {check.value}
                        </div>
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
                    Recommendations
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

              {/* Raw Headers */}
              {result.headers && (
                <div className="mb-8">
                  <h3 className="font-medium mb-4">Raw HTTP Headers</h3>
                  <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm max-h-64 overflow-y-auto">
                    {Object.entries(result.headers).map(([key, value]) => (
                      <div key={key} className="mb-1">
                        <span className="text-blue-400">{key}:</span> {value}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Best Practices */}
              <div className="p-4 bg-blue-50 border border-blue-200">
                <h3 className="font-medium text-blue-800 mb-3">🛡️ HTTP Header Best Practices</h3>
                <ul className="text-sm text-blue-700 space-y-2">
                  <li>• Implement Content Security Policy (CSP) to prevent XSS attacks</li>
                  <li>• Set X-Frame-Options to prevent clickjacking vulnerabilities</li>
                  <li>• Use HSTS header to enforce HTTPS connections</li>
                  <li>• Enable compression headers to improve page load times</li>
                  <li>• Set appropriate cache headers for better performance</li>
                  <li>• Use X-Content-Type-Options: nosniff to prevent MIME sniffing</li>
                  <li>• Configure proper robots headers for SEO control</li>
                </ul>
              </div>
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
                  <li>• Verify the website responds to HEAD requests</li>
                  <li>• Make sure there are no CORS restrictions</li>
                  <li>• Test the URL in a browser first</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
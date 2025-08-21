import React, { useState } from 'react';
import { ArrowRight, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function RobotsTester() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsLoading(true);
    setResult(null);

    try {
      // Clean the URL and construct robots.txt URL
      let cleanUrl = url.trim();
      if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
        cleanUrl = 'https://' + cleanUrl;
      }
      
      const urlObj = new URL(cleanUrl);
      const robotsUrl = `${urlObj.protocol}//${urlObj.hostname}/robots.txt`;

      // Fetch robots.txt content
      const response = await fetch(`/api/robots-check?url=${encodeURIComponent(robotsUrl)}&_t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      const data = await response.json();

      if (data.success) {
        setResult({
          success: true,
          robotsUrl,
          content: data.content,
          analysis: analyzeRobots(data.content),
          lastModified: data.lastModified,
          size: data.size
        });
      } else {
        setResult({
          success: false,
          robotsUrl,
          error: data.error || 'Failed to fetch robots.txt'
        });
      }
    } catch (error) {
      setResult({
        success: false,
        robotsUrl: url,
        error: 'Network error or invalid URL'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeRobots = (content) => {
    const lines = content.split('\n').filter(line => line.trim());
    const analysis = {
      userAgents: [],
      disallowedPaths: [],
      allowedPaths: [],
      sitemaps: [],
      crawlDelay: null,
      errors: [],
      warnings: []
    };

    let currentUserAgent = null;

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      if (!trimmedLine || trimmedLine.startsWith('#')) return;

      const colonIndex = trimmedLine.indexOf(':');
      if (colonIndex === -1) {
        analysis.errors.push(`Line ${index + 1}: Invalid syntax - missing colon`);
        return;
      }

      const directive = trimmedLine.substring(0, colonIndex).trim().toLowerCase();
      const value = trimmedLine.substring(colonIndex + 1).trim();

      switch (directive) {
        case 'user-agent':
          currentUserAgent = value;
          if (!analysis.userAgents.includes(value)) {
            analysis.userAgents.push(value);
          }
          break;
        case 'disallow':
          if (currentUserAgent) {
            analysis.disallowedPaths.push({ userAgent: currentUserAgent, path: value });
          }
          break;
        case 'allow':
          if (currentUserAgent) {
            analysis.allowedPaths.push({ userAgent: currentUserAgent, path: value });
          }
          break;
        case 'sitemap':
          analysis.sitemaps.push(value);
          break;
        case 'crawl-delay':
          analysis.crawlDelay = parseInt(value);
          break;
        default:
          analysis.warnings.push(`Line ${index + 1}: Unknown directive "${directive}"`);
      }
    });

    // Additional checks
    if (analysis.userAgents.length === 0) {
      analysis.warnings.push('No User-agent directives found');
    }
    if (analysis.sitemaps.length === 0) {
      analysis.warnings.push('No Sitemap directive found');
    }

    return analysis;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-medium text-black mb-4">Robots.txt Tester</h1>
        <p className="text-gray-700">
          Test and analyze your website's robots.txt file to ensure search engines can properly crawl your site.
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
            {isLoading ? 'Testing...' : 'Test Robots.txt'}
            {!isLoading && <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </form>

      {result && (
        <div className="border border-black">
          <div className="bg-gray-50 p-4 border-b border-black">
            <h2 className="text-lg font-medium">Robots.txt Analysis Results</h2>
            <p className="text-sm text-gray-600 mt-1">{result.robotsUrl}</p>
          </div>

          {result.success ? (
            <div className="p-6">
              {/* File Info */}
              <div className="mb-6 p-4 bg-gray-50 border border-gray-200">
                <h3 className="font-medium mb-2">File Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Status:</span>
                    <span className="ml-2 text-green-600 font-medium">Found</span>
                  </div>
                  {result.size && (
                    <div>
                      <span className="text-gray-600">Size:</span>
                      <span className="ml-2">{result.size} bytes</span>
                    </div>
                  )}
                  {result.lastModified && (
                    <div>
                      <span className="text-gray-600">Last Modified:</span>
                      <span className="ml-2">{new Date(result.lastModified).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Analysis Summary */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Analysis Summary</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-3 border border-gray-200 bg-gray-50">
                    <div className="text-2xl font-medium">{result.analysis.userAgents.length}</div>
                    <div className="text-sm text-gray-600">User Agents</div>
                  </div>
                  <div className="p-3 border border-gray-200 bg-gray-50">
                    <div className="text-2xl font-medium">{result.analysis.disallowedPaths.length}</div>
                    <div className="text-sm text-gray-600">Disallow Rules</div>
                  </div>
                  <div className="p-3 border border-gray-200 bg-gray-50">
                    <div className="text-2xl font-medium">{result.analysis.sitemaps.length}</div>
                    <div className="text-sm text-gray-600">Sitemaps</div>
                  </div>
                  <div className="p-3 border border-gray-200 bg-gray-50">
                    <div className="text-2xl font-medium">{result.analysis.errors.length}</div>
                    <div className="text-sm text-gray-600">Errors</div>
                  </div>
                </div>
              </div>

              {/* Errors and Warnings */}
              {(result.analysis.errors.length > 0 || result.analysis.warnings.length > 0) && (
                <div className="mb-6">
                  {result.analysis.errors.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium text-red-700 mb-2 flex items-center gap-2">
                        <XCircle className="w-4 h-4" />
                        Errors ({result.analysis.errors.length})
                      </h4>
                      <ul className="space-y-1">
                        {result.analysis.errors.map((error, index) => (
                          <li key={index} className="text-sm text-red-600 bg-red-50 p-2 border-l-4 border-red-200">
                            {error}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {result.analysis.warnings.length > 0 && (
                    <div>
                      <h4 className="font-medium text-yellow-700 mb-2 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        Warnings ({result.analysis.warnings.length})
                      </h4>
                      <ul className="space-y-1">
                        {result.analysis.warnings.map((warning, index) => (
                          <li key={index} className="text-sm text-yellow-600 bg-yellow-50 p-2 border-l-4 border-yellow-200">
                            {warning}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Detailed Analysis */}
              <div className="space-y-6">
                {result.analysis.userAgents.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">User Agents</h4>
                    <div className="space-y-1">
                      {result.analysis.userAgents.map((agent, index) => (
                        <div key={index} className="text-sm bg-gray-50 p-2 border border-gray-200">
                          {agent}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {result.analysis.sitemaps.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Sitemaps</h4>
                    <div className="space-y-1">
                      {result.analysis.sitemaps.map((sitemap, index) => (
                        <div key={index} className="text-sm bg-gray-50 p-2 border border-gray-200">
                          <a href={sitemap} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            {sitemap}
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Raw Content */}
                <div>
                  <h4 className="font-medium mb-2">Raw Content</h4>
                  <pre className="text-xs bg-gray-900 text-green-400 p-4 overflow-x-auto border border-gray-200">
{result.content}
                  </pre>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6">
              <div className="flex items-center gap-2 text-red-600 mb-4">
                <XCircle className="w-5 h-5" />
                <span className="font-medium">Robots.txt Not Found or Error</span>
              </div>
              <p className="text-gray-700 mb-4">{result.error}</p>
              <div className="bg-blue-50 border border-blue-200 p-4">
                <h4 className="font-medium text-blue-800 mb-2">Recommendations:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Create a robots.txt file in your website's root directory</li>
                  <li>• Ensure the file is accessible at: {result.robotsUrl}</li>
                  <li>• Include basic directives like User-agent and Disallow</li>
                  <li>• Add your sitemap URL for better SEO</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
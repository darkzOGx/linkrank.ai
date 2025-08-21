import React, { useState } from 'react';
import { ArrowRight, Gauge, Clock, Zap, Globe, Smartphone, Monitor, AlertTriangle, CheckCircle } from 'lucide-react';

export default function WebsiteSpeedTest() {
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

      const response = await fetch(`/api/speed-test?url=${encodeURIComponent(cleanUrl)}`);
      const data = await response.json();

      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error: 'Network error occurred while testing website speed'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 50) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getSpeedColor = (time) => {
    if (time <= 2) return 'text-green-600';
    if (time <= 4) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-medium text-black mb-4">Website Speed Test</h1>
        <p className="text-gray-700">
          Test your website's loading speed and Core Web Vitals performance across different devices.
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
            {isLoading ? 'Testing Speed...' : 'Test Speed'}
            {!isLoading && <Gauge className="w-4 h-4" />}
          </button>
        </div>
      </form>

      {result && (
        <div className="border border-black">
          <div className="bg-gray-50 p-4 border-b border-black">
            <h2 className="text-lg font-medium">Speed Test Results</h2>
            <p className="text-sm text-gray-600 mt-1">{result.url}</p>
          </div>

          {result.success ? (
            <div className="p-6">
              {/* Overall Score */}
              <div className="text-center mb-8">
                <div className={`text-6xl font-bold mx-auto w-32 h-32 rounded-full flex items-center justify-center ${getScoreColor(result.overallScore || 0)}`}>
                  {result.overallScore || 0}
                </div>
                <p className="text-lg font-medium mt-2">Overall Performance Score</p>
                <p className="text-sm text-gray-600">Based on Core Web Vitals and performance metrics</p>
              </div>

              {/* Device Performance */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Desktop */}
                <div className="border border-gray-200 p-4">
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <Monitor className="w-5 h-5" />
                    Desktop Performance
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Performance Score</span>
                      <span className={`font-medium px-2 py-1 rounded ${getScoreColor(result.desktop?.performanceScore || 0)}`}>
                        {result.desktop?.performanceScore || 0}/100
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Load Time</span>
                      <span className={`font-medium ${getSpeedColor(result.desktop?.loadTime || 0)}`}>
                        {result.desktop?.loadTime || 0}s
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">First Contentful Paint</span>
                      <span className="font-medium">{result.desktop?.fcp || 0}s</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Largest Contentful Paint</span>
                      <span className="font-medium">{result.desktop?.lcp || 0}s</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Cumulative Layout Shift</span>
                      <span className="font-medium">{result.desktop?.cls || 0}</span>
                    </div>
                  </div>
                </div>

                {/* Mobile */}
                <div className="border border-gray-200 p-4">
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <Smartphone className="w-5 h-5" />
                    Mobile Performance
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Performance Score</span>
                      <span className={`font-medium px-2 py-1 rounded ${getScoreColor(result.mobile?.performanceScore || 0)}`}>
                        {result.mobile?.performanceScore || 0}/100
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Load Time</span>
                      <span className={`font-medium ${getSpeedColor(result.mobile?.loadTime || 0)}`}>
                        {result.mobile?.loadTime || 0}s
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">First Contentful Paint</span>
                      <span className="font-medium">{result.mobile?.fcp || 0}s</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Largest Contentful Paint</span>
                      <span className="font-medium">{result.mobile?.lcp || 0}s</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Cumulative Layout Shift</span>
                      <span className="font-medium">{result.mobile?.cls || 0}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Core Web Vitals */}
              <div className="mb-8">
                <h3 className="font-medium mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Core Web Vitals Summary
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 border border-gray-200 text-center">
                    <div className="text-2xl font-medium mb-2">{result.coreWebVitals?.lcp || 0}s</div>
                    <div className="text-sm text-gray-600 mb-1">Largest Contentful Paint</div>
                    <div className={`text-xs px-2 py-1 rounded ${(result.coreWebVitals?.lcp || 0) <= 2.5 ? 'bg-green-100 text-green-800' : (result.coreWebVitals?.lcp || 0) <= 4 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                      {(result.coreWebVitals?.lcp || 0) <= 2.5 ? 'Good' : (result.coreWebVitals?.lcp || 0) <= 4 ? 'Needs Improvement' : 'Poor'}
                    </div>
                  </div>
                  <div className="p-4 border border-gray-200 text-center">
                    <div className="text-2xl font-medium mb-2">{result.coreWebVitals?.fid || 0}ms</div>
                    <div className="text-sm text-gray-600 mb-1">First Input Delay</div>
                    <div className={`text-xs px-2 py-1 rounded ${(result.coreWebVitals?.fid || 0) <= 100 ? 'bg-green-100 text-green-800' : (result.coreWebVitals?.fid || 0) <= 300 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                      {(result.coreWebVitals?.fid || 0) <= 100 ? 'Good' : (result.coreWebVitals?.fid || 0) <= 300 ? 'Needs Improvement' : 'Poor'}
                    </div>
                  </div>
                  <div className="p-4 border border-gray-200 text-center">
                    <div className="text-2xl font-medium mb-2">{result.coreWebVitals?.cls || 0}</div>
                    <div className="text-sm text-gray-600 mb-1">Cumulative Layout Shift</div>
                    <div className={`text-xs px-2 py-1 rounded ${(result.coreWebVitals?.cls || 0) <= 0.1 ? 'bg-green-100 text-green-800' : (result.coreWebVitals?.cls || 0) <= 0.25 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                      {(result.coreWebVitals?.cls || 0) <= 0.1 ? 'Good' : (result.coreWebVitals?.cls || 0) <= 0.25 ? 'Needs Improvement' : 'Poor'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Opportunities and Diagnostics */}
              <div className="space-y-6">
                {result.opportunities && result.opportunities.length > 0 && (
                  <div>
                    <h3 className="font-medium mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-yellow-600" />
                      Performance Opportunities
                    </h3>
                    <div className="space-y-2">
                      {result.opportunities?.map((opportunity, index) => (
                        <div key={index} className="p-3 bg-yellow-50 border border-yellow-200">
                          <h4 className="font-medium text-yellow-800">{opportunity.title}</h4>
                          <p className="text-sm text-yellow-700 mt-1">{opportunity.description}</p>
                          {opportunity.savings && (
                            <div className="text-xs text-yellow-600 mt-2">
                              Potential savings: {opportunity.savings}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {result.passed && result.passed.length > 0 && (
                  <div>
                    <h3 className="font-medium mb-3 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      Passed Audits
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {result.passed?.map((item, index) => (
                        <div key={index} className="p-2 bg-green-50 border border-green-200 text-sm">
                          <span className="text-green-800">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Optimization Tips */}
              <div className="mt-8 p-4 bg-blue-50 border border-blue-200">
                <h3 className="font-medium text-blue-800 mb-3">🚀 Speed Optimization Tips</h3>
                <ul className="text-sm text-blue-700 space-y-2">
                  <li>• Optimize and compress images (use WebP format when possible)</li>
                  <li>• Minimize and compress CSS, JavaScript, and HTML files</li>
                  <li>• Enable browser caching and use a Content Delivery Network (CDN)</li>
                  <li>• Reduce server response time and upgrade hosting if needed</li>
                  <li>• Eliminate render-blocking resources and lazy load non-critical content</li>
                  <li>• Use critical CSS and defer non-essential JavaScript</li>
                  <li>• Optimize web fonts and reduce the number of external requests</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="p-6">
              <div className="text-red-600 mb-4">
                <span className="font-medium">Error:</span> {result.error}
              </div>
              <div className="bg-blue-50 border border-blue-200 p-4">
                <h4 className="font-medium text-blue-800 mb-2">Troubleshooting:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Ensure the URL is correct and the website is accessible</li>
                  <li>• Check if the website is behind authentication or firewall</li>
                  <li>• Verify the website responds to HTTP requests</li>
                  <li>• Try testing again in a few moments</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
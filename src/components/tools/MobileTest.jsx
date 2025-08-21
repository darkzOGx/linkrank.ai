import React, { useState } from 'react';
import { ArrowRight, Smartphone, Check, X, AlertCircle } from 'lucide-react';

export default function MobileTest() {
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

      const response = await fetch(`/api/mobile-test?url=${encodeURIComponent(cleanUrl)}`);
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error: 'Network error occurred while testing mobile compatibility'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-medium text-black mb-4">Mobile Support Test</h1>
        <p className="text-gray-700">
          Test your website's mobile-friendliness and responsive design performance.
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
            {isLoading ? 'Testing...' : 'Test Mobile'}
            {!isLoading && <Smartphone className="w-4 h-4" />}
          </button>
        </div>
      </form>

      {result && (
        <div className="border border-black">
          <div className="bg-gray-50 p-4 border-b border-black">
            <h2 className="text-lg font-medium">Mobile Compatibility Results</h2>
            <p className="text-sm text-gray-600 mt-1">{result.url}</p>
          </div>

          {result.success ? (
            <div className="p-6">
              {/* Overall Score */}
              <div className="text-center mb-8">
                <div className={`text-6xl font-bold mx-auto w-32 h-32 rounded-full flex items-center justify-center ${
                  result.score >= 90 ? 'bg-green-50 text-green-600' : 
                  result.score >= 70 ? 'bg-yellow-50 text-yellow-600' : 
                  'bg-red-50 text-red-600'
                }`}>
                  {result.score}%
                </div>
                <p className="text-lg font-medium mt-2">
                  {result.isMobileFriendly ? 'Mobile Friendly' : 'Not Mobile Friendly'}
                </p>
              </div>

              {/* Test Results */}
              <div className="mb-8">
                <h3 className="font-medium mb-4">Mobile Compatibility Checks</h3>
                <div className="space-y-3">
                  {result.checks?.map((check, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 border border-gray-200">
                      {check.passed ? (
                        <Check className="w-5 h-5 text-green-600 mt-0.5" />
                      ) : (
                        <X className="w-5 h-5 text-red-600 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <div className="font-medium text-sm">{check.name}</div>
                        <div className="text-sm text-gray-600 mt-1">{check.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Device Preview Scores */}
              {result.devices && result.devices.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-medium mb-4">Device-Specific Scores</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {result.devices.map((device, index) => (
                    <div key={index} className="text-center p-4 border border-gray-200">
                      <Smartphone className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                      <div className="font-medium">{device.name}</div>
                      <div className={`text-2xl font-bold mt-2 ${
                        device.score >= 90 ? 'text-green-600' : 
                        device.score >= 70 ? 'text-yellow-600' : 
                        'text-red-600'
                      }`}>
                        {device.score}%
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{device.resolution}</div>
                    </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Issues Found */}
              {result.issues && result.issues.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-medium mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                    Issues to Fix
                  </h3>
                  <div className="space-y-2">
                    {result.issues?.map((issue, index) => (
                      <div key={index} className="p-3 bg-yellow-50 border border-yellow-200">
                        <div className="font-medium text-yellow-800">{issue.title}</div>
                        <div className="text-sm text-yellow-700 mt-1">{issue.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              <div className="p-4 bg-blue-50 border border-blue-200">
                <h3 className="font-medium text-blue-800 mb-3">📱 Mobile Optimization Tips</h3>
                <ul className="text-sm text-blue-700 space-y-2">
                  <li>• Use responsive design with flexible layouts and images</li>
                  <li>• Ensure text is readable without zooming (16px minimum)</li>
                  <li>• Make buttons and links large enough for touch (48x48px)</li>
                  <li>• Avoid horizontal scrolling on mobile devices</li>
                  <li>• Optimize images and resources for mobile bandwidth</li>
                  <li>• Test on real devices, not just browser emulators</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="p-6">
              <div className="text-red-600 mb-4">
                <span className="font-medium">Error:</span> {result.error || 'An unknown error occurred'}
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200">
                <h3 className="font-medium text-blue-800 mb-3">📱 Alternative Mobile Testing Options</h3>
                <ul className="text-sm text-blue-700 space-y-2">
                  <li>• <strong>Google Mobile-Friendly Test:</strong> Official Google tool for testing mobile compatibility</li>
                  <li>• <strong>Google PageSpeed Insights:</strong> Includes mobile performance and usability analysis</li>
                  <li>• <strong>GTmetrix:</strong> Comprehensive mobile performance testing</li>
                  <li>• <strong>WebPageTest:</strong> Advanced mobile testing with device emulation</li>
                  <li>• <strong>Browser DevTools:</strong> Use Chrome/Firefox responsive design mode for quick testing</li>
                  <li>• <strong>BrowserStack:</strong> Real device testing across multiple mobile browsers</li>
                </ul>
              </div>

              <div className="mt-4 p-4 bg-gray-50 border border-gray-200">
                <h4 className="font-medium mb-2">🔧 Manual Mobile Testing Tips</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Test on actual mobile devices when possible</li>
                  <li>• Check viewport meta tag: <code className="bg-gray-200 px-1">&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;</code></li>
                  <li>• Ensure text is readable without zooming (minimum 16px font size)</li>
                  <li>• Verify touch targets are at least 48x48 pixels</li>
                  <li>• Test horizontal scrolling doesn't occur</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
import React, { useState } from 'react';
import { ArrowRight, Award, CheckCircle, X, AlertTriangle, Shield, Clock, Globe } from 'lucide-react';

export default function DomainAuthorityChecker() {
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

      const response = await fetch(`/api/domain-authority?url=${encodeURIComponent(cleanUrl)}`);
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error: 'Network error occurred while checking domain authority'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getDAColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-blue-600 bg-blue-50';
    if (score >= 40) return 'text-yellow-600 bg-yellow-50';
    if (score >= 20) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const getInterpretationColor = (level) => {
    const colors = {
      'Excellent': 'text-green-600 bg-green-50 border-green-200',
      'Good': 'text-blue-600 bg-blue-50 border-blue-200',
      'Average': 'text-yellow-600 bg-yellow-50 border-yellow-200',
      'Low': 'text-orange-600 bg-orange-50 border-orange-200',
      'Very Low': 'text-red-600 bg-red-50 border-red-200'
    };
    return colors[level] || 'text-gray-600 bg-gray-50 border-gray-200';
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-medium text-black mb-4">Domain Authority Checker</h1>
        <p className="text-gray-700">
          Check the Domain Authority score of any website based on link profile, trust signals, and technical factors.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex flex-col sm:flex-row gap-0 max-w-2xl mx-auto">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter domain or URL (e.g., example.com)"
            className="flex-1 px-4 py-3 text-base bg-white border border-black rounded-none focus:ring-1 focus:ring-black focus:outline-none placeholder-gray-500"
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-black text-white font-medium flex items-center justify-center gap-2 hover:bg-gray-800 disabled:bg-gray-400 transition-colors"
          >
            {isLoading ? 'Checking...' : 'Check DA'}
            {!isLoading && <Award className="w-4 h-4" />}
          </button>
        </div>
      </form>

      {result && (
        <div className="border border-black">
          <div className="bg-gray-50 p-4 border-b border-black">
            <h2 className="text-lg font-medium">Domain Authority Analysis</h2>
            <p className="text-sm text-gray-600 mt-1">{result.domain}</p>
          </div>

          {result.success ? (
            <div className="p-6">
              {/* DA & PA Scores */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div className="text-center">
                  <div className={`text-6xl font-bold mx-auto w-32 h-32 rounded-full flex items-center justify-center ${getDAColor(result.domainAuthority)}`}>
                    {result.domainAuthority}
                  </div>
                  <p className="text-lg font-medium mt-2">Domain Authority</p>
                  <p className="text-sm text-gray-600">Overall domain strength</p>
                </div>
                <div className="text-center">
                  <div className={`text-6xl font-bold mx-auto w-32 h-32 rounded-full flex items-center justify-center ${getDAColor(result.pageAuthority)}`}>
                    {result.pageAuthority}
                  </div>
                  <p className="text-lg font-medium mt-2">Page Authority</p>
                  <p className="text-sm text-gray-600">Homepage strength</p>
                </div>
              </div>

              {/* Interpretation */}
              {result.interpretation && (
                <div className={`p-4 border mb-8 ${getInterpretationColor(result.interpretation.level)}`}>
                  <h3 className="font-medium mb-2">Authority Level: {result.interpretation.level}</h3>
                  <p className="text-sm">{result.interpretation.description}</p>
                </div>
              )}

              {/* Domain Metrics */}
              {result.metrics && (
                <div className="mb-8">
                  <h3 className="font-medium mb-4">Domain Analysis</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="text-center p-4 border border-gray-200">
                      <Clock className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                      <div className="text-2xl font-medium mb-1">{result.metrics.domainAge}</div>
                      <div className="text-sm text-gray-600">Years Old</div>
                    </div>
                    <div className="text-center p-4 border border-gray-200">
                      <Globe className="w-8 h-8 mx-auto mb-2 text-green-600" />
                      <div className="text-2xl font-medium mb-1">.{result.metrics.tlExtension.extension}</div>
                      <div className="text-sm text-gray-600">TLD Extension</div>
                    </div>
                    <div className="text-center p-4 border border-gray-200">
                      <ArrowRight className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                      <div className="text-2xl font-medium mb-1">{result.metrics.backlinksEstimate?.toLocaleString() || 'N/A'}</div>
                      <div className="text-sm text-gray-600">Est. Backlinks</div>
                    </div>
                    <div className="text-center p-4 border border-gray-200">
                      <Shield className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                      <div className="text-2xl font-medium mb-1">{result.metrics.technicalSEO?.securityScore?.toFixed(0) || 'N/A'}%</div>
                      <div className="text-sm text-gray-600">Security Score</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Technical SEO Factors */}
              {result.metrics?.technicalSEO && (
                <div className="mb-8">
                  <h3 className="font-medium mb-4">Technical SEO Factors</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200">
                      {result.metrics.technicalSEO.hasSSL ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <X className="w-5 h-5 text-red-600" />
                      )}
                      <span className="text-sm">SSL Certificate</span>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200">
                      {result.metrics.technicalSEO.hasHSTS ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <X className="w-5 h-5 text-red-600" />
                      )}
                      <span className="text-sm">HSTS Header</span>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200">
                      {result.metrics.technicalSEO.hasCSP ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <X className="w-5 h-5 text-red-600" />
                      )}
                      <span className="text-sm">Content Security Policy</span>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200">
                      {result.metrics.technicalSEO.hasCompression ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <X className="w-5 h-5 text-red-600" />
                      )}
                      <span className="text-sm">Compression</span>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200">
                      {result.metrics.technicalSEO.cacheHeaders ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <X className="w-5 h-5 text-red-600" />
                      )}
                      <span className="text-sm">Cache Headers</span>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200">
                      <span className="text-sm font-medium">{result.metrics.technicalSEO.securityHeaders}/5</span>
                      <span className="text-sm">Security Headers</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Trust Signals */}
              {result.metrics?.trustSignals && result.metrics.trustSignals.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-medium mb-4">Trust Signals</h3>
                  <div className="flex flex-wrap gap-2">
                    {result.metrics.trustSignals.map((signal, index) => (
                      <span key={index} className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                        {signal}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Content Quality */}
              {result.metrics?.contentQuality && (
                <div className="mb-8 p-4 bg-blue-50 border border-blue-200">
                  <h3 className="font-medium text-blue-800 mb-3">Content Quality Analysis</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-blue-700">Word Count:</span>
                      <span className="ml-2 font-medium text-blue-800">{result.metrics.contentQuality.wordCount}</span>
                    </div>
                    <div>
                      <span className="text-blue-700">Title Tag:</span>
                      <span className={`ml-2 font-medium ${result.metrics.contentQuality.hasTitle ? 'text-green-600' : 'text-red-600'}`}>
                        {result.metrics.contentQuality.hasTitle ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div>
                      <span className="text-blue-700">Meta Description:</span>
                      <span className={`ml-2 font-medium ${result.metrics.contentQuality.hasDescription ? 'text-green-600' : 'text-red-600'}`}>
                        {result.metrics.contentQuality.hasDescription ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div>
                      <span className="text-blue-700">Structured Data:</span>
                      <span className={`ml-2 font-medium ${result.metrics.contentQuality.hasStructuredData ? 'text-green-600' : 'text-red-600'}`}>
                        {result.metrics.contentQuality.hasStructuredData ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {result.recommendations && result.recommendations.length > 0 && (
                <div className="p-4 bg-green-50 border border-green-200">
                  <h3 className="font-medium text-green-800 mb-3">🚀 Domain Authority Improvement Tips</h3>
                  <ul className="text-sm text-green-700 space-y-2">
                    {result.recommendations.map((rec, index) => (
                      <li key={index}>• {rec}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* DA Scale Reference */}
              <div className="mt-8 p-4 bg-gray-50 border border-gray-200">
                <h3 className="font-medium mb-3">Domain Authority Scale Reference</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>90-100:</span>
                    <span className="text-green-600 font-medium">Exceptional (Google, Facebook, etc.)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>70-89:</span>
                    <span className="text-blue-600 font-medium">Very High Authority</span>
                  </div>
                  <div className="flex justify-between">
                    <span>50-69:</span>
                    <span className="text-yellow-600 font-medium">High Authority</span>
                  </div>
                  <div className="flex justify-between">
                    <span>30-49:</span>
                    <span className="text-orange-600 font-medium">Medium Authority</span>
                  </div>
                  <div className="flex justify-between">
                    <span>1-29:</span>
                    <span className="text-red-600 font-medium">Low Authority</span>
                  </div>
                </div>
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
                  <li>• Ensure the domain is valid and accessible</li>
                  <li>• Check if the website is online and responds to requests</li>
                  <li>• Try entering just the domain name without http://</li>
                  <li>• Verify the domain spelling is correct</li>
                  <li>• Some domains may block automated analysis requests</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
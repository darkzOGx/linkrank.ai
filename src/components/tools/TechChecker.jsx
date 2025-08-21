import React, { useState } from 'react';
import { ArrowRight, Code, Monitor, Shield, Zap, Globe, Database, Cpu } from 'lucide-react';

export default function TechChecker() {
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

      const response = await fetch(`/api/tech-checker?url=${encodeURIComponent(cleanUrl)}`);
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error: 'Network error occurred while analyzing website technology'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'CMS': return <Monitor className="w-5 h-5" />;
      case 'JavaScript Framework': return <Code className="w-5 h-5" />;
      case 'CSS Framework': return <Globe className="w-5 h-5" />;
      case 'Web Analytics': return <Zap className="w-5 h-5" />;
      case 'CDN': return <Shield className="w-5 h-5" />;
      case 'Database': return <Database className="w-5 h-5" />;
      default: return <Cpu className="w-5 h-5" />;
    }
  };

  const getConfidenceColor = (confidence) => {
    switch (confidence) {
      case 'High': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-medium text-black mb-4">Website Technology Checker</h1>
        <p className="text-gray-700">
          Discover the technology stack powering any website including CMS, frameworks, libraries, and more.
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
            {isLoading ? 'Analyzing...' : 'Analyze Tech'}
            {!isLoading && <Code className="w-4 h-4" />}
          </button>
        </div>
      </form>

      {result && (
        <div className="border border-black">
          <div className="bg-gray-50 p-4 border-b border-black">
            <h2 className="text-lg font-medium">Technology Stack Analysis</h2>
            <p className="text-sm text-gray-600 mt-1">{result.url}</p>
          </div>

          {result.success ? (
            <div className="p-6">
              {/* Technology Scores */}
              {result.scores && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <div className="text-center p-4 border border-gray-200">
                    <div className={`text-3xl font-bold ${getScoreColor(result.scores.modernityScore)}`}>
                      {result.scores.modernityScore}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Modernity</div>
                  </div>
                  <div className="text-center p-4 border border-gray-200">
                    <div className={`text-3xl font-bold ${getScoreColor(result.scores.securityScore)}`}>
                      {result.scores.securityScore}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Security</div>
                  </div>
                  <div className="text-center p-4 border border-gray-200">
                    <div className={`text-3xl font-bold ${getScoreColor(result.scores.performanceScore)}`}>
                      {result.scores.performanceScore}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Performance</div>
                  </div>
                  <div className="text-center p-4 border border-gray-200">
                    <div className={`text-3xl font-bold ${getScoreColor(result.scores.seoScore)}`}>
                      {result.scores.seoScore}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">SEO</div>
                  </div>
                </div>
              )}

              {/* Summary */}
              {result.summary && (
                <div className="mb-8 p-4 bg-blue-50 border border-blue-200">
                  <h3 className="font-medium text-blue-800 mb-3">📊 Technology Summary</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-blue-700">Total Technologies:</span>
                      <span className="ml-2 font-medium text-blue-800">{result.summary.totalTechnologies}</span>
                    </div>
                    <div>
                      <span className="text-blue-700">Stack Level:</span>
                      <span className="ml-2 font-medium text-blue-800">{result.summary.modernStack}</span>
                    </div>
                    <div>
                      <span className="text-blue-700">Security:</span>
                      <span className="ml-2 font-medium text-blue-800">{result.summary.securityLevel}</span>
                    </div>
                    <div>
                      <span className="text-blue-700">Performance:</span>
                      <span className="ml-2 font-medium text-blue-800">{result.summary.performanceOptimization}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Content Management System */}
              {result.technologies?.cms && result.technologies.cms.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-medium mb-4 flex items-center gap-2">
                    <Monitor className="w-5 h-5" />
                    Content Management System
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {result.technologies.cms.map((tech, index) => (
                      <div key={index} className="p-4 bg-gray-50 border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{tech.name}</h4>
                          <span className={`text-xs px-2 py-1 rounded ${getConfidenceColor(tech.confidence)}`}>
                            {tech.confidence}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">{tech.category}</div>
                        {tech.evidence && (
                          <div className="text-xs text-gray-500">
                            Evidence: {tech.evidence.join(', ')}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Web Server */}
              {result.technologies?.webServer && result.technologies.webServer.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-medium mb-4 flex items-center gap-2">
                    <Monitor className="w-5 h-5" />
                    Web Server
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {result.technologies.webServer.map((server, index) => (
                      <div key={index} className="p-4 bg-gray-50 border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{server.name}</h4>
                          <span className={`text-xs px-2 py-1 rounded ${getConfidenceColor(server.confidence)}`}>
                            {server.confidence}
                          </span>
                        </div>
                        {server.version && (
                          <div className="text-sm text-gray-600">Version: {server.version}</div>
                        )}
                        {server.type && (
                          <div className="text-sm text-gray-600">Type: {server.type}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* JavaScript Frameworks */}
              {result.technologies?.frameworks && result.technologies.frameworks.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-medium mb-4 flex items-center gap-2">
                    <Code className="w-5 h-5" />
                    JavaScript Frameworks
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {result.technologies.frameworks.map((framework, index) => (
                      <div key={index} className="p-4 bg-gray-50 border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{framework.name}</h4>
                          <span className={`text-xs px-2 py-1 rounded ${getConfidenceColor(framework.confidence)}`}>
                            {framework.confidence}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">{framework.category}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* JavaScript Libraries */}
              {result.technologies?.jsLibraries && result.technologies.jsLibraries.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-medium mb-4 flex items-center gap-2">
                    <Code className="w-5 h-5" />
                    JavaScript Libraries
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {result.technologies.jsLibraries.map((lib, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded">
                        {lib.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* CSS Frameworks */}
              {result.technologies?.cssFrameworks && result.technologies.cssFrameworks.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-medium mb-4 flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    CSS Frameworks
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {result.technologies.cssFrameworks.map((framework, index) => (
                      <span key={index} className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded">
                        {framework.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Analytics & Tracking */}
              {result.technologies?.analytics && result.technologies.analytics.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-medium mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Analytics & Tracking
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {result.technologies.analytics.map((analytics, index) => (
                      <div key={index} className="p-4 bg-gray-50 border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{analytics.name}</h4>
                          <span className={`text-xs px-2 py-1 rounded ${getConfidenceColor(analytics.confidence)}`}>
                            {analytics.confidence}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">{analytics.category}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CDN & Security */}
              {result.technologies?.cdn && result.technologies.cdn.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-medium mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    CDN & Infrastructure
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {result.technologies.cdn.map((cdn, index) => (
                      <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded">
                        {cdn.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Security Features */}
              {result.technologies?.security && result.technologies.security.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-medium mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Security Features
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {result.technologies.security.map((security, index) => (
                      <div key={index} className={`p-3 border ${security.enabled ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                        <div className="flex items-center gap-2">
                          {security.enabled ? (
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          ) : (
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          )}
                          <span className="text-sm font-medium">{security.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Performance Features */}
              {result.technologies?.performance && result.technologies.performance.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-medium mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Performance Features
                  </h3>
                  <div className="space-y-2">
                    {result.technologies.performance.map((perf, index) => (
                      <div key={index} className="p-3 bg-blue-50 border border-blue-200">
                        <div className="font-medium text-sm">{perf.name}</div>
                        {perf.type && (
                          <div className="text-xs text-gray-600">Type: {perf.type}</div>
                        )}
                        {perf.value && (
                          <div className="text-xs text-gray-600">Value: {perf.value}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Hosting & Infrastructure */}
              {result.technologies?.hosting && result.technologies.hosting.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-medium mb-4 flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    Hosting & Infrastructure
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {result.technologies.hosting.map((host, index) => (
                      <span key={index} className="px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded">
                        {host.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Programming Languages */}
              {result.technologies?.programming && result.technologies.programming.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-medium mb-4 flex items-center gap-2">
                    <Cpu className="w-5 h-5" />
                    Programming Languages
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {result.technologies.programming.map((lang, index) => (
                      <div key={index} className="p-4 bg-gray-50 border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{lang.name}</h4>
                          <span className={`text-xs px-2 py-1 rounded ${getConfidenceColor(lang.confidence)}`}>
                            {lang.confidence}
                          </span>
                        </div>
                        {lang.version && (
                          <div className="text-sm text-gray-600">Version: {lang.version}</div>
                        )}
                        {lang.framework && (
                          <div className="text-sm text-gray-600">Framework: {lang.framework}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Insights */}
              {result.insights && result.insights.length > 0 && (
                <div className="p-4 bg-yellow-50 border border-yellow-200">
                  <h3 className="font-medium text-yellow-800 mb-3">💡 Technology Insights</h3>
                  <ul className="text-sm text-yellow-700 space-y-2">
                    {result.insights.map((insight, index) => (
                      <li key={index}>• {insight}</li>
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
                  <li>• Some websites may not reveal their technology stack</li>
                  <li>• Try testing with the homepage URL</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
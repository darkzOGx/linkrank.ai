import React, { useState } from 'react';
import { TrendingUp, CheckCircle, AlertCircle, Copy, Check, ExternalLink, BarChart3, Target, Award } from 'lucide-react';

const GEOPerformanceTracker = () => {
  const [url, setUrl] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedStates, setCopiedStates] = useState({});

  const handleAnalyze = async () => {
    if (!url.trim()) {
      setError('Please enter a URL to analyze');
      return;
    }

    setLoading(true);
    setError('');
    setResults(null);

    try {
      const response = await fetch(`/api/geo-performance-tracker?url=${encodeURIComponent(url)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed');
      }

      setResults(data);
    } catch (err) {
      setError(err.message || 'Network error occurred while tracking GEO performance');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text, key) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates(prev => ({ ...prev, [key]: true }));
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [key]: false }));
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const getGradeColor = (grade) => {
    switch (grade) {
      case 'A': return 'text-green-600';
      case 'B': return 'text-blue-600';
      case 'C': return 'text-yellow-600';
      case 'D': return 'text-orange-600';
      case 'F': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getPositionColor = (position) => {
    return position === 'Above Average' ? 'text-green-600' : 'text-orange-600';
  };

  const formatTrendData = (trendData) => {
    if (!trendData || trendData.length === 0) return [];
    return trendData.slice(-6); // Show last 6 months
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">GEO Performance Tracker</h1>
          <p className="text-gray-600">
            Monitor your Generative Engine Optimization performance and track AI citation metrics over time.
          </p>
        </div>

        <div className="mb-6">
          <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
            Website URL
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
            <button
              onClick={handleAnalyze}
              disabled={loading || !url.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Tracking...
                </>
              ) : (
                <>
                  <TrendingUp className="h-4 w-4" />
                  Track Performance
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Analysis Failed</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        )}

        {results && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">Overall GEO Score</h3>
                  <span className={`text-2xl font-bold ${getGradeColor(results.analysis.grade)}`}>
                    {results.analysis.grade}
                  </span>
                </div>
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {results.analysis.overallGeoScore}/100
                </div>
                <p className="text-sm text-gray-600">Current performance rating</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Market Position</h3>
                <div className={`text-xl font-bold mb-1 ${getPositionColor(results.analysis.benchmarks.yourPosition)}`}>
                  {results.analysis.benchmarks.yourPosition}
                </div>
                <div className="text-sm text-gray-600">
                  <div>Industry avg: {results.analysis.benchmarks.industryAverage}</div>
                  <div>Top performers: {results.analysis.benchmarks.topPerformers}</div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Visibility</h3>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Citations:</span>
                    <span className="font-medium">{results.analysis.metrics.aiVisibility.estimatedCitations}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Mentions:</span>
                    <span className="font-medium">{results.analysis.metrics.aiVisibility.mentionProbability}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Relevance:</span>
                    <span className="font-medium">{results.analysis.metrics.aiVisibility.topicRelevance}%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Content Quality Metrics
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Fact Density:</span>
                    <span className="font-medium">{results.analysis.metrics.contentQuality.factDensity}/1000 chars</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Structured Data:</span>
                    <span className="font-medium">{results.analysis.metrics.contentQuality.structuredData} schemas</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Heading Structure:</span>
                    <span className="font-medium">{results.analysis.metrics.contentQuality.headingStructure} headings</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Citable Content:</span>
                    <span className="font-medium">{results.analysis.metrics.contentQuality.citableContent} references</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Technical Optimization
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Schema Markup:</span>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${results.analysis.metrics.technicalOptimization.schemaMarkup > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className="font-medium">{results.analysis.metrics.technicalOptimization.schemaMarkup}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Meta Optimization:</span>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${results.analysis.metrics.technicalOptimization.metaOptimization > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className="font-medium">{results.analysis.metrics.technicalOptimization.metaOptimization}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">SSL Security:</span>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${results.analysis.metrics.technicalOptimization.sslSecurity > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className="font-medium">{results.analysis.metrics.technicalOptimization.sslSecurity}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Mobile Optimized:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="font-medium">{results.analysis.metrics.technicalOptimization.mobileOptimization}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {results.analysis.trendData && results.analysis.trendData.length > 0 && (
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Performance Trends (Last 6 Months)
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-lg border">
                    <h4 className="font-medium text-gray-900 mb-3">Citations</h4>
                    <div className="space-y-2">
                      {formatTrendData(results.analysis.trendData).map((data, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-gray-600">{data.month}:</span>
                          <span className="font-medium">{data.citations}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border">
                    <h4 className="font-medium text-gray-900 mb-3">Visibility</h4>
                    <div className="space-y-2">
                      {formatTrendData(results.analysis.trendData).map((data, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-gray-600">{data.month}:</span>
                          <span className="font-medium">{data.visibility}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border">
                    <h4 className="font-medium text-gray-900 mb-3">Mentions</h4>
                    <div className="space-y-2">
                      {formatTrendData(results.analysis.trendData).map((data, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-gray-600">{data.month}:</span>
                          <span className="font-medium">{data.mentions}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {results.recommendations && results.recommendations.length > 0 && (
              <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                  Recommendations
                </h3>
                <ul className="space-y-2">
                  {results.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-yellow-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {results.practicalImplementations && results.practicalImplementations.length > 0 && (
              <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Practical Implementations
                </h3>
                <div className="space-y-4">
                  {results.practicalImplementations.map((impl, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg border border-green-200">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-semibold text-gray-900">{impl.title}</h4>
                        <button
                          onClick={() => handleCopy(impl.code, `impl-${index}`)}
                          className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                          title="Copy code"
                        >
                          {copiedStates[`impl-${index}`] ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{impl.description}</p>
                      <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                        <code>{impl.code}</code>
                      </pre>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Last updated: {new Date(results.analysis.lastUpdated).toLocaleString()}</span>
                <a
                  href={results.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
                >
                  <ExternalLink className="h-4 w-4" />
                  View tracked page
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GEOPerformanceTracker;
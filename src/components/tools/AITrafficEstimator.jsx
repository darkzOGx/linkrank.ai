import React, { useState } from 'react';
import { TrendingUp, CheckCircle, AlertCircle, Copy, Check, ExternalLink, BarChart3, Users, Target } from 'lucide-react';

const AITrafficEstimator = () => {
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
      const response = await fetch(`/api/ai-traffic-estimator?url=${encodeURIComponent(url)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed');
      }

      setResults(data);
    } catch (err) {
      setError(err.message || 'Network error occurred while estimating AI traffic');
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

  const formatNumber = (num) => {
    if (num === undefined || num === null || isNaN(num)) return '0';
    const numValue = Number(num);
    if (numValue >= 1000000) return `${(numValue / 1000000).toFixed(1)}M`;
    if (numValue >= 1000) return `${(numValue / 1000).toFixed(1)}K`;
    return numValue.toLocaleString();
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">AI Traffic Estimator</h1>
          <p className="text-gray-600">
            Estimate your potential traffic from AI-powered search engines and chatbots based on your content optimization.
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
                  Analyzing...
                </>
              ) : (
                <>
                  <TrendingUp className="h-4 w-4" />
                  Estimate AI Traffic
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
                  <h3 className="text-lg font-semibold text-gray-900">Content Optimization</h3>
                </div>
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {results.analysis?.contentOptimization || 0}/100
                </div>
                <p className="text-sm text-gray-600">Content optimization for AI</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Traffic Estimate</h3>
                <div className="text-3xl font-bold text-green-600 mb-1">
                  {formatNumber(results.analysis?.totalMonthlyEstimate)}
                </div>
                <p className="text-sm text-gray-600">Monthly AI-driven visits</p>
                <div className="mt-2 text-xs text-gray-500">
                  Confidence: {results.analysis.confidenceLevel || 'Medium'}
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Content Quality</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-purple-500" />
                    <span className="text-sm">{results.analysis?.breakdown?.factDensity || 0}% fact density</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-purple-500" />
                    <span className="text-sm">{results.analysis?.breakdown?.topicRelevance || 0}% topic relevance</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-purple-500" />
                    <span className="text-sm">{results.analysis?.breakdown?.aiReadiness || 0}% AI readiness</span>
                  </div>
                </div>
              </div>
            </div>

            {results.trafficEstimates && (
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Platform Traffic Breakdown</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {Object.entries(results.trafficEstimates).map(([platform, data]) => (
                    <div key={platform} className="bg-white p-4 rounded-lg border">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-3 h-3 rounded-full ${
                          platform.includes('chatgpt') ? 'bg-green-500' : 
                          platform.includes('claude') ? 'bg-purple-500' : 
                          platform.includes('bard') ? 'bg-blue-500' : 
                          platform.includes('bing') ? 'bg-orange-500' : 'bg-gray-500'
                        }`}></div>
                        <h4 className="font-semibold text-gray-900 capitalize">
                          {platform.replace(/([A-Z])/g, ' $1').trim()}
                        </h4>
                      </div>
                      <div className="text-2xl font-bold text-gray-900 mb-1">
                        {formatNumber(data?.monthlyVisits)}
                      </div>
                      <div className="text-sm text-gray-600 mb-2">visits/month</div>
                      <div className="text-xs text-gray-500">
                        {Math.round((data?.confidence || 0) * 100)}% confidence
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {results.projections && (
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Traffic Projections</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-lg border">
                    <h4 className="font-semibold text-gray-900 mb-2">3 Months</h4>
                    <div className="text-2xl font-bold text-blue-600">
                      {formatNumber(results.projections?.threeMonth)}
                    </div>
                    <p className="text-xs text-gray-600">monthly visits</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border">
                    <h4 className="font-semibold text-gray-900 mb-2">6 Months</h4>
                    <div className="text-2xl font-bold text-green-600">
                      {formatNumber(results.projections?.sixMonth)}
                    </div>
                    <p className="text-xs text-gray-600">monthly visits</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border">
                    <h4 className="font-semibold text-gray-900 mb-2">12 Months</h4>
                    <div className="text-2xl font-bold text-purple-600">
                      {formatNumber(results.projections?.twelveMonth)}
                    </div>
                    <p className="text-xs text-gray-600">monthly visits</p>
                  </div>
                </div>
              </div>
            )}

            {results.recommendations && results.recommendations.length > 0 && (
              <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                  Traffic Growth Recommendations
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
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Implementation Examples</h3>
                {results.practicalImplementations.map((impl, index) => (
                  <div key={index} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-semibold text-gray-900">{impl.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{impl.description}</p>
                      </div>
                      <button
                        onClick={() => handleCopy(impl.code, `impl-${index}`)}
                        className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 transition-colors"
                      >
                        {copiedStates[`impl-${index}`] ? (
                          <>
                            <Check className="h-3 w-3" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" />
                            Copy Code
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="bg-white p-4 rounded border text-sm overflow-x-auto">
                      <code>{impl.code}</code>
                    </pre>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Analysis completed: {new Date(results.timestamp).toLocaleString()}</span>
                <a
                  href={results.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
                >
                  <ExternalLink className="h-4 w-4" />
                  View analyzed page
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AITrafficEstimator;
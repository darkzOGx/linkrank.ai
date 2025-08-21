import React, { useState } from 'react';
import { Target, CheckCircle, AlertCircle, Copy, Check, ExternalLink, Search, ShoppingCart, Navigation, Info } from 'lucide-react';

const IntentMatchingOptimizer = () => {
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
      const response = await fetch(`/api/intent-matching-optimizer?url=${encodeURIComponent(url)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed');
      }

      setResults(data);
    } catch (err) {
      setError(err.message || 'Network error occurred while analyzing intent matching');
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

  const getIntentIcon = (type) => {
    switch (type) {
      case 'informational': return <Info className="h-5 w-5" />;
      case 'navigational': return <Navigation className="h-5 w-5" />;
      case 'transactional': return <ShoppingCart className="h-5 w-5" />;
      case 'commercial': return <Search className="h-5 w-5" />;
      default: return <Target className="h-5 w-5" />;
    }
  };

  const getIntentColor = (type) => {
    switch (type) {
      case 'informational': return 'bg-blue-100 text-blue-800';
      case 'navigational': return 'bg-green-100 text-green-800';
      case 'transactional': return 'bg-purple-100 text-purple-800';
      case 'commercial': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStrengthColor = (strength) => {
    switch (strength.toLowerCase()) {
      case 'strong': return 'bg-green-500';
      case 'moderate': return 'bg-yellow-500';
      case 'weak': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Intent Matching Optimizer</h1>
          <p className="text-gray-600">
            Optimize your content to match different user search intents for better AI response inclusion.
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
                  <Target className="h-4 w-4" />
                  Optimize Intent Matching
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
                  <h3 className="text-lg font-semibold text-gray-900">Intent Matching</h3>
                  <span className={`text-2xl font-bold ${getGradeColor(results.analysis.grade)}`}>
                    {results.analysis.grade}
                  </span>
                </div>
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {results.analysis.intentMatchingScore}/100
                </div>
                <p className="text-sm text-gray-600">Overall intent coverage</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Detected Intents</h3>
                <div className="text-3xl font-bold text-green-600 mb-1">
                  {results.detectedIntents ? results.detectedIntents.length : 0}
                </div>
                <p className="text-sm text-gray-600">Intent types matched</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Q&A Coverage</h3>
                <div className="text-3xl font-bold text-purple-600 mb-1">
                  {results.qaPatterns ? results.qaPatterns.directAnswers : 0}
                </div>
                <p className="text-sm text-gray-600">Direct answers found</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Intent Breakdown</h3>
                <div className="space-y-4">
                  {Object.entries(results.analysis.intentBreakdown).map(([intent, score]) => (
                    <div key={intent} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getIntentIcon(intent)}
                        <span className="text-sm font-medium text-gray-700 capitalize">{intent}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${score}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium w-8">{score}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Q&A Pattern Analysis</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Questions Found:</span>
                    <span className="font-medium">{results.qaPatterns?.questionCount || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Direct Answers:</span>
                    <span className="font-medium">{results.qaPatterns?.directAnswers || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">How-to Steps:</span>
                    <span className="font-medium">{results.qaPatterns?.howToSteps || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Structured Answers:</span>
                    <span className={`font-medium ${results.qaPatterns?.hasStructuredAnswers ? 'text-green-600' : 'text-red-600'}`}>
                      {results.qaPatterns?.hasStructuredAnswers ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {results.detectedIntents && results.detectedIntents.length > 0 && (
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Detected Intent Matches</h3>
                <div className="grid gap-4">
                  {results.detectedIntents.map((intent, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg border border-blue-200">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {getIntentIcon(intent.type)}
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getIntentColor(intent.type)}`}>
                            {intent.type.charAt(0).toUpperCase() + intent.type.slice(1)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${getStrengthColor(intent.strength)}`}></div>
                          <span className="text-sm font-medium">{intent.strength} ({intent.score}%)</span>
                        </div>
                      </div>
                      {intent.indicators && intent.indicators.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {intent.indicators.map((indicator, indicatorIndex) => (
                            <span key={indicatorIndex} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                              {indicator}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
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

export default IntentMatchingOptimizer;
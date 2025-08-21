import React, { useState } from 'react';
import { Brain, MessageSquare, Copy, Check, ExternalLink, AlertTriangle } from 'lucide-react';

const LLMResponseSimulator = () => {
  const [url, setUrl] = useState('');
  const [query, setQuery] = useState('');
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
      const queryParam = query.trim() ? `&query=${encodeURIComponent(query)}` : '';
      const response = await fetch(`/api/llm-response-simulator?url=${encodeURIComponent(url)}${queryParam}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed');
      }

      setResults(data);
    } catch (err) {
      setError(err.message || 'Network error occurred while simulating LLM responses');
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

  const getLikelihoodColor = (likelihood) => {
    switch (likelihood.toLowerCase()) {
      case 'high': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getModelIcon = (model) => {
    return <Brain className="h-5 w-5" />;
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">LLM Response Simulator</h1>
          <p className="text-gray-600">
            Simulate how different AI models would reference and cite your content in their responses.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
              Website URL *
            </label>
            <input
              type="url"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="query" className="block text-sm font-medium text-gray-700 mb-2">
              Test Query (Optional)
            </label>
            <input
              type="text"
              id="query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What is machine learning?"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
          </div>
        </div>

        <button
          onClick={handleAnalyze}
          disabled={loading || !url.trim()}
          className="mb-6 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Simulating Responses...
            </>
          ) : (
            <>
              <MessageSquare className="h-4 w-4" />
              Simulate LLM Responses
            </>
          )}
        </button>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
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
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Citation Probability</h3>
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {results.analysis.citationProbability}%
                </div>
                <p className="text-sm text-gray-600">Likelihood of being cited</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Facts Extracted</h3>
                <div className="text-3xl font-bold text-green-600 mb-1">
                  {results.analysis.factsFound}
                </div>
                <p className="text-sm text-gray-600">Citable data points found</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Domain Authority</h3>
                <div className="text-lg font-bold text-purple-600 mb-1">
                  {results.analysis.domainAuthority}
                </div>
                <p className="text-sm text-gray-600">Trust level assessment</p>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Query</h3>
              <p className="text-gray-700 bg-white p-3 rounded border italic">
                "{results.testQuery}"
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">Simulated AI Responses</h3>
              {Object.entries(results.simulatedResponses).map(([modelKey, response]) => (
                <div key={modelKey} className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {getModelIcon(response.model)}
                      <h4 className="text-lg font-semibold text-gray-900">{response.model}</h4>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLikelihoodColor(response.likelihood)}`}>
                      {response.likelihood} Likelihood
                    </span>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-700 leading-relaxed">{response.response}</p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                      <div>
                        <h5 className="font-medium text-gray-900 mb-2">Citation Style</h5>
                        <p className="text-sm text-gray-600">{response.citationStyle}</p>
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-900 mb-2">Extracted Information</h5>
                        <div className="flex flex-wrap gap-2">
                          {response.extractedInfo.map((info, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              {info}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {results.extractedFacts && results.extractedFacts.length > 0 && (
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Extracted Facts</h3>
                <div className="grid gap-3">
                  {results.extractedFacts.map((fact, index) => (
                    <div key={index} className="bg-white p-4 rounded border">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <span className="font-mono text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded">
                            {fact.value}
                          </span>
                          <p className="text-sm text-gray-600 mt-2">{fact.context}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {results.suggestedQueries && (
              <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Suggested Test Queries</h3>
                <div className="grid md:grid-cols-2 gap-2">
                  {results.suggestedQueries.map((query, index) => (
                    <button
                      key={index}
                      onClick={() => setQuery(query)}
                      className="text-left p-3 bg-white border border-yellow-200 rounded hover:bg-yellow-50 transition-colors text-sm"
                    >
                      {query}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {results.recommendations && results.recommendations.length > 0 && (
              <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  Recommendations
                </h3>
                <ul className="space-y-2">
                  {results.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {results.practicalImplementations && results.practicalImplementations.length > 0 && (
              <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-600" />
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

export default LLMResponseSimulator;
import React, { useState } from 'react';
import { Atom, CheckCircle, AlertCircle, Copy, Check, ExternalLink, Hash, Clock, FileText, GitBranch } from 'lucide-react';

const ContentAtomizationTool = () => {
  const [url, setUrl] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedStates, setCopiedStates] = useState({});
  const [selectedFilter, setSelectedFilter] = useState('all');

  const handleAnalyze = async () => {
    if (!url.trim()) {
      setError('Please enter a URL to analyze');
      return;
    }

    setLoading(true);
    setError('');
    setResults(null);

    try {
      const response = await fetch(`/api/content-atomization-tool?url=${encodeURIComponent(url)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed');
      }

      setResults(data);
    } catch (err) {
      setError(err.message || 'Network error occurred while atomizing content');
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

  const getFactTypeIcon = (type) => {
    switch (type) {
      case 'numerical': return <Hash className="h-4 w-4" />;
      case 'temporal': return <Clock className="h-4 w-4" />;
      case 'definitional': return <FileText className="h-4 w-4" />;
      case 'procedural': return <GitBranch className="h-4 w-4" />;
      case 'causal': return <GitBranch className="h-4 w-4" />;
      default: return <Atom className="h-4 w-4" />;
    }
  };

  const getFactTypeColor = (type) => {
    switch (type) {
      case 'numerical': return 'bg-blue-100 text-blue-800';
      case 'temporal': return 'bg-purple-100 text-purple-800';
      case 'definitional': return 'bg-green-100 text-green-800';
      case 'procedural': return 'bg-orange-100 text-orange-800';
      case 'causal': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getExtractabilityColor = (extractability) => {
    switch (extractability) {
      case 'high': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredFacts = results ? [
    ...(selectedFilter === 'all' || selectedFilter === 'high' ? results.atomicFacts.high : []),
    ...(selectedFilter === 'all' || selectedFilter === 'medium' ? results.atomicFacts.medium : [])
  ] : [];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Content Atomization Tool</h1>
          <p className="text-gray-600">
            Break down your content into discrete, extractable facts that AI systems can easily cite and reference.
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
                  Atomizing...
                </>
              ) : (
                <>
                  <Atom className="h-4 w-4" />
                  Atomize Content
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
                  <h3 className="text-lg font-semibold text-gray-900">Atomization Score</h3>
                  <span className={`text-2xl font-bold ${getGradeColor(results.analysis.grade)}`}>
                    {results.analysis.grade}
                  </span>
                </div>
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {results.analysis.atomizationScore}/100
                </div>
                <p className="text-sm text-gray-600">Content extractability</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Atomic Facts</h3>
                <div className="text-3xl font-bold text-green-600 mb-1">
                  {results.analysis.totalAtomicFacts}
                </div>
                <div className="text-sm text-gray-600">
                  <span className="text-green-600 font-medium">{results.analysis.highExtractabilityFacts}</span> high-value facts
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Fact Distribution</h3>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Numerical:</span>
                    <span className="font-medium">{results.analysis.factDistribution.numerical}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Temporal:</span>
                    <span className="font-medium">{results.analysis.factDistribution.temporal}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Definitional:</span>
                    <span className="font-medium">{results.analysis.factDistribution.definitional}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Extracted Atomic Facts</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedFilter('all')}
                    className={`px-3 py-1 rounded text-sm ${selectedFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                  >
                    All ({results.analysis.totalAtomicFacts})
                  </button>
                  <button
                    onClick={() => setSelectedFilter('high')}
                    className={`px-3 py-1 rounded text-sm ${selectedFilter === 'high' ? 'bg-green-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                  >
                    High ({results.analysis.highExtractabilityFacts})
                  </button>
                  <button
                    onClick={() => setSelectedFilter('medium')}
                    className={`px-3 py-1 rounded text-sm ${selectedFilter === 'medium' ? 'bg-yellow-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                  >
                    Medium ({results.analysis.mediumExtractabilityFacts})
                  </button>
                </div>
              </div>

              <div className="grid gap-3 max-h-96 overflow-y-auto">
                {filteredFacts.map((fact, index) => (
                  <div key={index} className="bg-white p-4 rounded border hover:shadow-sm transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getFactTypeIcon(fact.type)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getFactTypeColor(fact.type)}`}>
                          {fact.type}
                        </span>
                        <div className={`w-2 h-2 rounded-full ${getExtractabilityColor(fact.extractability)}`}></div>
                        <span className="text-xs text-gray-500 capitalize">{fact.extractability}</span>
                      </div>
                      <button
                        onClick={() => handleCopy(fact.fact, `fact-${index}`)}
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                        title="Copy fact"
                      >
                        {copiedStates[`fact-${index}`] ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">{fact.fact}</p>
                    {fact.category && (
                      <span className="inline-block mt-2 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        {fact.category}
                      </span>
                    )}
                  </div>
                ))}

                {filteredFacts.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No facts found for the selected filter.
                  </div>
                )}
              </div>
            </div>

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

export default ContentAtomizationTool;
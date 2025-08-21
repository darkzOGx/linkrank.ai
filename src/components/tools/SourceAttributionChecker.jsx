import React, { useState } from 'react';
import { FileText, CheckCircle, AlertCircle, Copy, Check, ExternalLink, Link, Quote, Users, Award } from 'lucide-react';

const SourceAttributionChecker = () => {
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
      const response = await fetch(`/api/source-attribution-checker?url=${encodeURIComponent(url)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed');
      }

      setResults(data);
    } catch (err) {
      setError(err.message || 'Network error occurred while checking source attribution');
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

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'citations': return <Quote className="h-4 w-4" />;
      case 'externalLinks': return <Link className="h-4 w-4" />;
      case 'references': return <FileText className="h-4 w-4" />;
      case 'sourceCredibility': return <Award className="h-4 w-4" />;
      case 'authorAttribution': return <Users className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Source Attribution Checker</h1>
          <p className="text-gray-600">
            Analyze your content for proper source attribution, citations, and credibility signals that AI systems value for trust and accuracy.
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
                  <FileText className="h-4 w-4" />
                  Check Attribution
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
                  <h3 className="text-lg font-semibold text-gray-900">Attribution Score</h3>
                  <span className={`text-2xl font-bold ${getGradeColor(results.analysis.grade)}`}>
                    {results.analysis.grade}
                  </span>
                </div>
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {results.analysis.attributionScore}/100
                </div>
                <p className="text-sm text-gray-600">Overall attribution quality</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Score Breakdown</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Citations:</span>
                    <span className="font-medium">{results.analysis.breakdown.citations}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>External Links:</span>
                    <span className="font-medium">{results.analysis.breakdown.externalLinks}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>References:</span>
                    <span className="font-medium">{results.analysis.breakdown.references}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Credibility:</span>
                    <span className="font-medium">{results.analysis.breakdown.sourceCredibility}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Author Info:</span>
                    <span className="font-medium">{results.analysis.breakdown.authorAttribution}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Source Quality</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">{results.detectedSources.citations.length} Citations Found</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">{results.detectedSources.externalLinks.length} External Links</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">{results.detectedSources.credibleSources.length} Credibility Signals</span>
                  </div>
                </div>
              </div>
            </div>

            {Object.entries(results.detectedSources).some(([_, sources]) => sources.length > 0) && (
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Detected Sources</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {Object.entries(results.detectedSources)
                    .filter(([_, sources]) => sources.length > 0)
                    .map(([category, sources]) => (
                      <div key={category} className="bg-white p-4 rounded-lg border">
                        <div className="flex items-center gap-2 mb-3">
                          {getCategoryIcon(category)}
                          <h4 className="font-semibold text-gray-900 capitalize">
                            {category.replace(/([A-Z])/g, ' $1').trim()}
                          </h4>
                          <span className="ml-auto bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            {sources.length} found
                          </span>
                        </div>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {sources.slice(0, 5).map((source, index) => (
                            <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                              <div className="font-medium text-gray-700">{source.type}</div>
                              <div className="text-gray-600 break-words">{source.value}</div>
                            </div>
                          ))}
                          {sources.length > 5 && (
                            <div className="text-sm text-gray-500 text-center">
                              +{sources.length - 5} more sources detected
                            </div>
                          )}
                        </div>
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

export default SourceAttributionChecker;
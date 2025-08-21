import React, { useState } from 'react';
import { Award, CheckCircle, AlertCircle, Copy, Check, ExternalLink, Shield, User, Building, BookOpen } from 'lucide-react';

const ExpertiseMarkupValidator = () => {
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
      const response = await fetch(`/api/expertise-markup-validator?url=${encodeURIComponent(url)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed');
      }

      setResults(data);
    } catch (err) {
      setError(err.message || 'Network error occurred while validating expertise markup');
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
      case 'authors': return <User className="h-4 w-4" />;
      case 'organizations': return <Building className="h-4 w-4" />;
      case 'credentials': return <Award className="h-4 w-4" />;
      case 'expertiseSignals': return <BookOpen className="h-4 w-4" />;
      case 'trustSignals': return <Shield className="h-4 w-4" />;
      default: return <CheckCircle className="h-4 w-4" />;
    }
  };

  const getCategoryTitle = (category) => {
    switch (category) {
      case 'authors': return 'Author Information';
      case 'organizations': return 'Organization Details';
      case 'credentials': return 'Credentials & Qualifications';
      case 'expertiseSignals': return 'Expertise Indicators';
      case 'trustSignals': return 'Trust Signals';
      default: return category;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Expertise Markup Validator</h1>
          <p className="text-gray-600">
            Validate and optimize your website's expertise markup to establish authority and credibility with AI systems.
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
                  Validating...
                </>
              ) : (
                <>
                  <Award className="h-4 w-4" />
                  Validate Expertise
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Validation Failed</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        )}

        {results && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">Expertise Score</h3>
                  <span className={`text-2xl font-bold ${getGradeColor(results.analysis.grade)}`}>
                    {results.analysis.grade}
                  </span>
                </div>
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {results.analysis.expertiseScore}/100
                </div>
                <p className="text-sm text-gray-600">Overall expertise markup quality</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Markup Breakdown</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Author Markup:</span>
                    <span className="font-medium">{results.analysis.breakdown.authorMarkup}/20</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Organization:</span>
                    <span className="font-medium">{results.analysis.breakdown.organizationMarkup}/20</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Credentials:</span>
                    <span className="font-medium">{results.analysis.breakdown.credentialsMarkup}/20</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Expertise:</span>
                    <span className="font-medium">{results.analysis.breakdown.expertiseSignals}/20</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Trust Signals:</span>
                    <span className="font-medium">{results.analysis.breakdown.trustSignals}/20</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Validation Status</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${results.analysis.breakdown.authorMarkup > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="text-sm">Author Information</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${results.analysis.breakdown.organizationMarkup > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="text-sm">Organization Data</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${results.analysis.breakdown.credentialsMarkup > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="text-sm">Credentials Listed</span>
                  </div>
                </div>
              </div>
            </div>

            {Object.entries(results.detectedMarkup).some(([_, markup]) => markup.length > 0) && (
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Detected Markup</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {Object.entries(results.detectedMarkup)
                    .filter(([_, markup]) => markup.length > 0)
                    .map(([category, markup]) => (
                      <div key={category} className="bg-white p-4 rounded-lg border">
                        <div className="flex items-center gap-2 mb-3">
                          {getCategoryIcon(category)}
                          <h4 className="font-semibold text-gray-900">
                            {getCategoryTitle(category)}
                          </h4>
                          <span className="ml-auto bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            {markup.length} found
                          </span>
                        </div>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {markup.slice(0, 5).map((item, index) => (
                            <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                              <div className="font-medium text-gray-700">{item.type}</div>
                              <div className="text-gray-600 break-words">{item.value}</div>
                            </div>
                          ))}
                          {markup.length > 5 && (
                            <div className="text-sm text-gray-500 text-center">
                              +{markup.length - 5} more items detected
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {results.optimizedMarkup && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Optimized Markup Examples</h3>
                
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">Author Schema Markup</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Add structured data to showcase author expertise and credentials
                      </p>
                    </div>
                    <button
                      onClick={() => handleCopy(results.optimizedMarkup.authorSchema, 'author-schema')}
                      className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 transition-colors"
                    >
                      {copiedStates['author-schema'] ? (
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
                    <code>{results.optimizedMarkup.authorSchema}</code>
                  </pre>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">Organization Schema Markup</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Add structured data showing organizational expertise and credentials
                      </p>
                    </div>
                    <button
                      onClick={() => handleCopy(results.optimizedMarkup.organizationSchema, 'org-schema')}
                      className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 transition-colors"
                    >
                      {copiedStates['org-schema'] ? (
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
                    <code>{results.optimizedMarkup.organizationSchema}</code>
                  </pre>
                </div>
              </div>
            )}

            {results.recommendations && results.recommendations.length > 0 && (
              <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                  Expertise Enhancement Recommendations
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
                <span>Validation completed: {new Date(results.timestamp).toLocaleString()}</span>
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

export default ExpertiseMarkupValidator;
import React, { useState } from 'react';
import { FileText, CheckCircle, AlertCircle, Copy, Check, ExternalLink, HelpCircle, Plus } from 'lucide-react';

const FAQSchemaGenerator = () => {
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
      const response = await fetch(`/api/faq-schema-generator?url=${encodeURIComponent(url)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed');
      }

      setResults(data);
    } catch (err) {
      setError(err.message || 'Network error occurred while generating FAQ schema');
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

  const getSourceColor = (source) => {
    switch (source) {
      case 'existing_content': return 'bg-green-100 text-green-800';
      case 'content_analysis': return 'bg-blue-100 text-blue-800';
      case 'ai_generated': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">FAQ Schema Generator</h1>
          <p className="text-gray-600">
            Generate FAQ schema markup optimized for AI responses and create properly structured Q&A content.
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
                  Generating...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4" />
                  Generate FAQ Schema
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
                  <h3 className="text-lg font-semibold text-gray-900">FAQ Score</h3>
                  <span className={`text-2xl font-bold ${getGradeColor(results.analysis.grade)}`}>
                    {results.analysis.grade}
                  </span>
                </div>
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {results.analysis.score}/100
                </div>
                <p className="text-sm text-gray-600">FAQ optimization rating</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Detected FAQs</h3>
                <div className="text-3xl font-bold text-green-600 mb-1">
                  {results.analysis.detectedFAQs}
                </div>
                <p className="text-sm text-gray-600">Found on your page</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Schema Status</h3>
                <div className={`text-lg font-bold mb-1 ${results.analysis.hasSchema ? 'text-green-600' : 'text-red-600'}`}>
                  {results.analysis.hasSchema ? 'Found' : 'Missing'}
                </div>
                <p className="text-sm text-gray-600">FAQ schema markup</p>
              </div>
            </div>

            {results.faqs && (results.faqs.detected.length > 0 || results.faqs.suggested.length > 0) && (
              <div className="space-y-6">
                {results.faqs.detected.length > 0 && (
                  <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      Detected FAQs ({results.faqs.detected.length})
                    </h3>
                    <div className="space-y-4">
                      {results.faqs.detected.map((faq, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg border border-green-200">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                              <HelpCircle className="h-4 w-4 text-blue-500" />
                              {faq.question}
                            </h4>
                            <button
                              onClick={() => handleCopy(`Q: ${faq.question}\nA: ${faq.answer}`, `detected-${index}`)}
                              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                              title="Copy Q&A"
                            >
                              {copiedStates[`detected-${index}`] ? (
                                <Check className="h-4 w-4 text-green-600" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                          <p className="text-gray-700 text-sm mb-2">{faq.answer}</p>
                          {faq.source && (
                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getSourceColor(faq.source)}`}>
                              {faq.source.replace('_', ' ')}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {results.faqs.suggested.length > 0 && (
                  <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Plus className="h-5 w-5 text-blue-600" />
                      Suggested FAQs ({results.faqs.suggested.length})
                    </h3>
                    <div className="space-y-4">
                      {results.faqs.suggested.map((faq, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg border border-blue-200">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                              <HelpCircle className="h-4 w-4 text-blue-500" />
                              {faq.question}
                            </h4>
                            <button
                              onClick={() => handleCopy(`Q: ${faq.question}\nA: ${faq.answer}`, `suggested-${index}`)}
                              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                              title="Copy Q&A"
                            >
                              {copiedStates[`suggested-${index}`] ? (
                                <Check className="h-4 w-4 text-green-600" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                          <p className="text-gray-700 text-sm mb-2">{faq.answer}</p>
                          <div className="flex items-center gap-2">
                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getSourceColor(faq.source)}`}>
                              AI Generated
                            </span>
                            {faq.confidence && (
                              <span className="text-xs text-gray-500">
                                Confidence: {Math.round(faq.confidence * 100)}%
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {results.schemaCode && (
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Generated FAQ Schema</h3>
                  <button
                    onClick={() => handleCopy(results.schemaCode, 'schema')}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                  >
                    {copiedStates.schema ? (
                      <>
                        <Check className="h-4 w-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copy Schema
                      </>
                    )}
                  </button>
                </div>
                <pre className="bg-gray-900 text-green-400 p-4 rounded text-sm overflow-x-auto">
                  <code>{results.schemaCode}</code>
                </pre>
                <p className="text-sm text-gray-600 mt-3">
                  Add this JSON-LD schema to your page's &lt;head&gt; section to help AI systems understand your FAQ content.
                </p>
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

export default FAQSchemaGenerator;
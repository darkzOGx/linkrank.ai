import React, { useState } from 'react';
import { Brain, ArrowRight, AlertCircle, Copy, Check, List, Quote } from 'lucide-react';

export default function AIContentExtractor() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copiedField, setCopiedField] = useState(null);

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

      const response = await fetch(`/api/ai-content-extractor?url=${encodeURIComponent(cleanUrl)}`);
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error: 'Network error occurred while extracting content'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(typeof text === 'object' ? JSON.stringify(text, null, 2) : text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const getGradeColor = (grade) => {
    switch (grade) {
      case 'A': return 'text-green-600 bg-green-100';
      case 'B': return 'text-blue-600 bg-blue-100';
      case 'C': return 'text-yellow-600 bg-yellow-100';
      case 'D': return 'text-orange-600 bg-orange-100';
      case 'F': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-medium text-black mb-4">AI Content Extractor</h1>
        <p className="text-gray-700">
          See how AI systems extract and interpret your content for citations and responses.
        </p>
      </div>

      <div className="bg-white border border-black p-6 mb-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-black mb-2">
              Website URL
            </label>
            <input
              type="text"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter URL (e.g., example.com or https://example.com)"
              className="w-full p-3 border border-gray-300 text-black placeholder-gray-500 focus:outline-none focus:border-black"
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !url.trim()}
            className="w-full bg-black text-white p-3 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Extracting Content for AI...
              </>
            ) : (
              <>
                <Brain className="w-4 h-4" />
                Extract Content for AI
              </>
            )}
          </button>
        </form>
      </div>

      {result && (
        <div className="space-y-6">
          {result.success ? (
            <>
              {/* AI Extraction Overview */}
              <div className="bg-white border border-black p-6">
                <h2 className="text-xl font-medium text-black mb-4 flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  AI Extraction Analysis
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className={`text-2xl font-bold px-3 py-2 rounded ${getGradeColor(result.extraction.grade)}`}>
                      {result.extraction.grade}
                    </div>
                    <p className="text-sm text-gray-600 mt-2">AI Readiness</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-black">
                      {result.extraction.aiReadinessScore}/100
                    </div>
                    <p className="text-sm text-gray-600 mt-2">Extraction Score</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-black">
                      {result.extraction.dataPointsCount}
                    </div>
                    <p className="text-sm text-gray-600 mt-2">Data Points</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Headings:</span>
                    <span className="font-medium">{result.extraction.headingsCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Lists:</span>
                    <span className="font-medium">{result.extraction.listsCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Quotes:</span>
                    <span className="font-medium">{result.extraction.quotesCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Data Points:</span>
                    <span className="font-medium">{result.extraction.dataPointsCount}</span>
                  </div>
                </div>
              </div>

              {/* AI Extraction Summary */}
              <div className="bg-white border border-black p-6">
                <h3 className="text-lg font-medium text-black mb-4">AI Extraction Summary</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Primary Topic</h4>
                    <p className="text-black bg-gray-50 p-3 rounded">{result.aiExtraction.primaryTopic}</p>
                  </div>

                  {result.aiExtraction.keyPoints && result.aiExtraction.keyPoints.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Key Points Extracted</h4>
                      <ul className="space-y-2">
                        {result.aiExtraction.keyPoints.map((point, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-500" />
                            <span className="text-gray-800">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {result.aiExtraction.citableQuotes && result.aiExtraction.citableQuotes.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <Quote className="w-4 h-4" />
                        Citable Quotes
                      </h4>
                      <div className="space-y-2">
                        {result.aiExtraction.citableQuotes.map((quote, index) => (
                          <blockquote key={index} className="border-l-4 border-gray-300 pl-4 py-2 bg-gray-50">
                            <p className="text-gray-800 italic">"{quote.text}"</p>
                            {quote.source && <cite className="text-sm text-gray-600">— {quote.source}</cite>}
                          </blockquote>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Structured Content */}
              {result.structuredContent && (
                <div className="bg-white border border-black p-6">
                  <h3 className="text-lg font-medium text-black mb-4 flex items-center gap-2">
                    <List className="w-5 h-5" />
                    Structured Content Detected
                  </h3>

                  {result.structuredContent.headings && result.structuredContent.headings.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-700 mb-2">Heading Hierarchy</h4>
                      <div className="space-y-1">
                        {result.structuredContent.headings.map((heading, index) => (
                          <div key={index} className={`${heading.level === 'h1' ? 'ml-0' : heading.level === 'h2' ? 'ml-4' : heading.level === 'h3' ? 'ml-8' : 'ml-12'}`}>
                            <span className="text-xs text-gray-500 mr-2">{heading.level.toUpperCase()}</span>
                            <span className="text-gray-800">{heading.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {result.structuredContent.lists && result.structuredContent.lists.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Lists Detected</h4>
                      <div className="space-y-2">
                        {result.structuredContent.lists.map((list, index) => (
                          <div key={index} className="bg-gray-50 p-3 rounded">
                            <span className="text-xs text-gray-600 uppercase">{list.type} List</span>
                            <ul className="mt-1 space-y-1">
                              {list.items.slice(0, 3).map((item, i) => (
                                <li key={i} className="text-sm text-gray-700">• {item}</li>
                              ))}
                              {list.items.length > 3 && (
                                <li className="text-sm text-gray-500">...and {list.items.length - 3} more items</li>
                              )}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Recommendations */}
              {result.recommendations && result.recommendations.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 p-6 rounded">
                  <h3 className="text-lg font-medium text-blue-900 mb-4">Recommendations</h3>
                  <ul className="space-y-2">
                    {result.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2 text-blue-800">
                        <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Practical Implementations */}
              {result.practicalImplementations && result.practicalImplementations.length > 0 && (
                <div className="bg-green-50 border border-green-200 p-6 rounded">
                  <h3 className="text-lg font-medium text-green-900 mb-4">Practical Implementations</h3>
                  <div className="space-y-4">
                    {result.practicalImplementations.map((impl, index) => (
                      <div key={index} className="bg-white border border-green-300 rounded p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-green-900">{impl.title}</h4>
                          {impl.code && (
                            <button
                              onClick={() => copyToClipboard(impl.code, `impl-${index}`)}
                              className="flex items-center gap-1 text-sm text-green-700 hover:text-green-900"
                            >
                              {copiedField === `impl-${index}` ? (
                                <Check className="w-3 h-3" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                              Copy
                            </button>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{impl.description}</p>
                        {impl.code && (
                          <pre className="bg-gray-50 border border-gray-200 rounded p-3 text-xs overflow-x-auto">
                            <code>{impl.code}</code>
                          </pre>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="bg-red-50 border border-red-200 p-6 rounded">
              <div className="flex items-center gap-2 text-red-800 mb-2">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">Extraction Failed</span>
              </div>
              <p className="text-red-700">{result.error}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
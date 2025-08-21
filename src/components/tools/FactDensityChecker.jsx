import React, { useState } from 'react';
import { ArrowRight, FileCheck, AlertCircle, BarChart3, Copy, Check } from 'lucide-react';

export default function FactDensityChecker() {
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

      const response = await fetch(`/api/fact-density-checker?url=${encodeURIComponent(cleanUrl)}`);
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error: 'Network error occurred while analyzing fact density'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
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

  const FactCategory = ({ category, count, examples, description }) => (
    <div className="border border-gray-200 p-4 rounded">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium text-black capitalize">{category.replace('_', ' ')}</h4>
        <span className="text-lg font-bold text-blue-600">{count}</span>
      </div>
      <p className="text-sm text-gray-600 mb-3">{description}</p>
      {examples.length > 0 && (
        <div>
          <p className="text-xs text-gray-500 mb-1">Examples:</p>
          <div className="flex flex-wrap gap-1">
            {examples.slice(0, 3).map((example, idx) => (
              <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded">
                {example}
              </span>
            ))}
            {examples.length > 3 && (
              <span className="text-xs text-gray-500">+{examples.length - 3} more</span>
            )}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-medium text-black mb-4">Fact Density Checker</h1>
        <p className="text-gray-700">
          Measure the factual density of your content to optimize for AI extraction and improve citation potential.
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
                Analyzing Fact Density...
              </>
            ) : (
              <>
                <FileCheck className="w-4 h-4" />
                Check Fact Density
              </>
            )}
          </button>
        </form>
      </div>

      {result && (
        <div className="space-y-6">
          {result.success ? (
            <>
              {/* Overall Analysis */}
              <div className="bg-white border border-black p-6">
                <h2 className="text-xl font-medium text-black mb-4 flex items-center gap-2">
                  <FileCheck className="w-5 h-5" />
                  Fact Density Analysis
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <div className={`text-2xl font-bold px-3 py-2 rounded ${getGradeColor(result.analysis.grade)}`}>
                      {result.analysis.grade}
                    </div>
                    <p className="text-sm text-gray-600 mt-2">Overall Grade</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-black">
                      {result.analysis.fact_score}/100
                    </div>
                    <p className="text-sm text-gray-600 mt-2">Fact Score</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-black">
                      {result.analysis.total_facts}
                    </div>
                    <p className="text-sm text-gray-600 mt-2">Total Facts</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-black">
                      {result.analysis.density_metrics.facts_per_100_words}
                    </div>
                    <p className="text-sm text-gray-600 mt-2">Facts/100 Words</p>
                  </div>
                </div>
              </div>

              {/* Content Statistics */}
              <div className="bg-white border border-black p-6">
                <h3 className="text-lg font-medium text-black mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Content Statistics
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-xl font-bold text-black">{result.analysis.content_stats.sentences}</div>
                    <p className="text-sm text-gray-600">Sentences</p>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-black">{result.analysis.content_stats.paragraphs}</div>
                    <p className="text-sm text-gray-600">Paragraphs</p>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-black">{result.analysis.content_stats.words.toLocaleString()}</div>
                    <p className="text-sm text-gray-600">Words</p>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-black">{result.analysis.content_stats.factual_sentences}</div>
                    <p className="text-sm text-gray-600">Factual Sentences</p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-blue-50 p-4 rounded">
                    <div className="flex justify-between items-center">
                      <span className="text-blue-800">Facts per Sentence:</span>
                      <span className="font-bold text-blue-900">{result.analysis.density_metrics.facts_per_sentence}</span>
                    </div>
                  </div>
                  <div className="bg-green-50 p-4 rounded">
                    <div className="flex justify-between items-center">
                      <span className="text-green-800">Facts per Paragraph:</span>
                      <span className="font-bold text-green-900">{result.analysis.density_metrics.facts_per_paragraph}</span>
                    </div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded">
                    <div className="flex justify-between items-center">
                      <span className="text-purple-800">Factual Sentence %:</span>
                      <span className="font-bold text-purple-900">{result.analysis.density_metrics.factual_sentence_ratio}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fact Categories */}
              <div className="bg-white border border-black p-6">
                <h3 className="text-lg font-medium text-black mb-4">Fact Categories Breakdown</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.fact_breakdown.map((category, index) => (
                    <FactCategory
                      key={index}
                      category={category.category}
                      count={category.count}
                      examples={category.examples}
                      description={category.description}
                    />
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              {result.recommendations.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 p-6 rounded">
                  <h3 className="text-lg font-medium text-blue-900 mb-4">Optimization Recommendations</h3>
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
                              Copy Code
                            </button>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{impl.description}</p>
                        {impl.before && impl.after && (
                          <div className="space-y-2">
                            <div className="bg-red-50 border border-red-200 rounded p-3">
                              <p className="text-xs font-medium text-red-700 mb-1">Before:</p>
                              <p className="text-sm text-red-900">{impl.before}</p>
                            </div>
                            <div className="bg-green-50 border border-green-200 rounded p-3">
                              <p className="text-xs font-medium text-green-700 mb-1">After:</p>
                              <p className="text-sm text-green-900">{impl.after}</p>
                            </div>
                          </div>
                        )}
                        {impl.code && (
                          <pre className="bg-gray-50 border border-gray-200 rounded p-3 text-xs overflow-x-auto mt-3">
                            <code className="language-html">{impl.code}</code>
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
                <span className="font-medium">Analysis Failed</span>
              </div>
              <p className="text-red-700">{result.error}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
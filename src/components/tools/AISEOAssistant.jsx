import React, { useState } from 'react';
import { Bot, Search, FileText, TrendingUp, Users, Lightbulb, CheckCircle, AlertCircle } from 'lucide-react';

export default function AISEOAssistant() {
  const [query, setQuery] = useState('');
  const [url, setUrl] = useState('');
  const [analysisType, setAnalysisType] = useState('general');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);

  const analysisTypes = [
    { value: 'general', label: 'General SEO Advice', icon: Lightbulb },
    { value: 'content-analysis', label: 'Content Analysis', icon: FileText },
    { value: 'keyword-suggestions', label: 'Keyword Research', icon: Search },
    { value: 'seo-audit', label: 'SEO Audit', icon: CheckCircle },
    { value: 'content-optimization', label: 'Content Optimization', icon: TrendingUp },
    { value: 'competitor-analysis', label: 'Competitor Analysis', icon: Users }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setResult(null);

    try {
      const requestBody = {
        query: query.trim(),
        type: analysisType
      };

      // Add URL if provided and relevant for the analysis type
      if (url.trim() && ['content-analysis', 'seo-audit'].includes(analysisType)) {
        let cleanUrl = url.trim();
        if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
          cleanUrl = 'https://' + cleanUrl;
        }
        requestBody.url = cleanUrl;
      }

      const response = await fetch('/api/ai-seo-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error: 'Network error occurred while processing your request'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const needsUrl = ['content-analysis', 'seo-audit'].includes(analysisType);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-medium text-black mb-4 flex items-center justify-center gap-3">
          <Bot className="w-8 h-8" />
          AI SEO Assistant
        </h1>
        <p className="text-gray-700">
          Get intelligent SEO recommendations, content analysis, and optimization strategies powered by AI.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="max-w-4xl mx-auto space-y-4">
          {/* Analysis Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Choose Analysis Type
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {analysisTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setAnalysisType(type.value)}
                  className={`p-3 border rounded-none text-left transition-colors ${
                    analysisType === type.value
                      ? 'border-black bg-black text-white'
                      : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <type.icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{type.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* URL Input (conditional) */}
          {needsUrl && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website URL (Required for this analysis)
              </label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-4 py-3 text-base bg-white border border-gray-300 rounded-none focus:ring-1 focus:ring-black focus:border-black focus:outline-none placeholder-gray-500"
                required={needsUrl}
              />
            </div>
          )}

          {/* Query Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {analysisType === 'content-optimization' 
                ? 'Content to Optimize' 
                : analysisType === 'keyword-suggestions'
                ? 'Seed Keyword or Topic'
                : 'SEO Question or Target Keyword'
              }
            </label>
            {analysisType === 'content-optimization' ? (
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Paste your content here for optimization analysis..."
                rows={6}
                className="w-full px-4 py-3 text-base bg-white border border-gray-300 rounded-none focus:ring-1 focus:ring-black focus:border-black focus:outline-none placeholder-gray-500 resize-vertical"
                required
              />
            ) : (
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={
                  analysisType === 'keyword-suggestions' 
                    ? "SEO, digital marketing, content strategy..." 
                    : "How to improve my SEO rankings, keyword research tips..."
                }
                className="w-full px-4 py-3 text-base bg-white border border-gray-300 rounded-none focus:ring-1 focus:ring-black focus:border-black focus:outline-none placeholder-gray-500"
                required
              />
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-6 py-3 bg-black text-white font-medium flex items-center justify-center gap-2 hover:bg-gray-800 disabled:bg-gray-400 transition-colors"
          >
            {isLoading ? 'Analyzing...' : 'Get AI Recommendations'}
            {!isLoading && <Bot className="w-5 h-5" />}
          </button>
        </div>
      </form>

      {result && (
        <div className="border border-black">
          <div className="bg-gray-50 p-4 border-b border-black">
            <h2 className="text-lg font-medium">AI SEO Analysis Results</h2>
            <p className="text-sm text-gray-600 mt-1">
              {result.type && `Analysis Type: ${analysisTypes.find(t => t.value === result.type)?.label || result.type}`}
            </p>
          </div>

          {result.success ? (
            <div className="p-6">
              {/* Score Display */}
              {result.score !== undefined && (
                <div className="text-center mb-8">
                  <div className={`text-6xl font-bold mx-auto w-32 h-32 rounded-full flex items-center justify-center ${getScoreColor(result.score)}`}>
                    {result.score}
                  </div>
                  <p className="text-lg font-medium mt-2">SEO Score</p>
                  <p className="text-sm text-gray-600">Based on analysis criteria</p>
                </div>
              )}

              {/* Analysis Text */}
              {result.analysis && (
                <div className="mb-8">
                  <h3 className="font-medium mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Analysis Summary
                  </h3>
                  <div className="p-4 bg-blue-50 border border-blue-200">
                    <pre className="text-sm text-blue-800 whitespace-pre-wrap font-sans">
                      {result.analysis}
                    </pre>
                  </div>
                </div>
              )}

              {/* Content Quality (for content analysis) */}
              {result.contentQuality && (
                <div className="mb-8">
                  <h3 className="font-medium mb-4">Content Quality Metrics</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-3 bg-gray-50 border border-gray-200">
                      <div className="text-lg font-bold">{result.contentQuality.wordCount}</div>
                      <div className="text-sm text-gray-600">Words</div>
                    </div>
                    <div className="p-3 bg-gray-50 border border-gray-200">
                      <div className="text-lg font-bold">{result.contentQuality.keywordDensity}%</div>
                      <div className="text-sm text-gray-600">Keyword Density</div>
                    </div>
                    <div className="p-3 bg-gray-50 border border-gray-200">
                      <div className="text-lg font-bold">{result.contentQuality.readabilityScore}</div>
                      <div className="text-sm text-gray-600">Readability</div>
                    </div>
                    <div className="p-3 bg-gray-50 border border-gray-200">
                      <div className="text-lg font-bold">{result.contentQuality.titleOptimization?.score || 0}</div>
                      <div className="text-sm text-gray-600">Title Score</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Keyword Suggestions */}
              {result.suggestions && (
                <div className="mb-8">
                  <h3 className="font-medium mb-4 flex items-center gap-2">
                    <Search className="w-5 h-5" />
                    Keyword Suggestions
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-medium mb-2">Primary Keywords</h4>
                      <div className="space-y-2">
                        {result.suggestions.slice(0, 8).map((keyword, index) => (
                          <div key={index} className="p-2 bg-blue-50 border border-blue-200 text-sm">
                            {keyword}
                          </div>
                        ))}
                      </div>
                    </div>
                    {result.longtail && (
                      <div>
                        <h4 className="font-medium mb-2">Long-tail Keywords</h4>
                        <div className="space-y-2">
                          {result.longtail.slice(0, 8).map((keyword, index) => (
                            <div key={index} className="p-2 bg-green-50 border border-green-200 text-sm">
                              {keyword}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {result.related && (
                      <div>
                        <h4 className="font-medium mb-2">Related Terms</h4>
                        <div className="space-y-2">
                          {result.related.slice(0, 8).map((keyword, index) => (
                            <div key={index} className="p-2 bg-purple-50 border border-purple-200 text-sm">
                              {keyword}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Competitors */}
              {result.competitors && (
                <div className="mb-8">
                  <h3 className="font-medium mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Competitor Analysis
                  </h3>
                  <div className="space-y-4">
                    {result.competitors.map((competitor, index) => (
                      <div key={index} className="p-4 border border-gray-200">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">{competitor.domain}</h4>
                          <span className="text-sm text-gray-600">{competitor.estimatedTraffic}</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <h5 className="text-sm font-medium text-green-700 mb-1">Strengths</h5>
                            <ul className="text-sm text-gray-600">
                              {competitor.strengths.map((strength, idx) => (
                                <li key={idx}>• {strength}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h5 className="text-sm font-medium text-red-700 mb-1">Weaknesses</h5>
                            <ul className="text-sm text-gray-600">
                              {competitor.weaknesses.map((weakness, idx) => (
                                <li key={idx}>• {weakness}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Wins */}
              {result.quickWins && (
                <div className="mb-8">
                  <h3 className="font-medium mb-4 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-yellow-600" />
                    Quick Wins
                  </h3>
                  <div className="space-y-2">
                    {result.quickWins.map((win, index) => (
                      <div key={index} className="p-3 bg-yellow-50 border border-yellow-200">
                        <span className="text-yellow-800 text-sm">⚡ {win}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Issues */}
              {result.issues && result.issues.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-medium mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    Issues Found
                  </h3>
                  <div className="space-y-2">
                    {result.issues.map((issue, index) => (
                      <div key={index} className="p-3 bg-red-50 border border-red-200">
                        <span className="text-red-800 text-sm">{issue}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Opportunities */}
              {result.opportunities && (
                <div className="mb-8">
                  <h3 className="font-medium mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    Opportunities
                  </h3>
                  <div className="space-y-2">
                    {result.opportunities.map((opportunity, index) => (
                      <div key={index} className="p-3 bg-green-50 border border-green-200">
                        <span className="text-green-800 text-sm">📈 {opportunity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Long-term Strategy */}
              {result.longTermStrategy && (
                <div className="mb-8">
                  <h3 className="font-medium mb-4">Long-term Strategy</h3>
                  <div className="space-y-2">
                    {result.longTermStrategy.map((strategy, index) => (
                      <div key={index} className="p-3 bg-purple-50 border border-purple-200">
                        <span className="text-purple-800 text-sm">🎯 {strategy}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {result.recommendations && result.recommendations.length > 0 && (
                <div className="p-4 bg-blue-50 border border-blue-200">
                  <h3 className="font-medium text-blue-800 mb-3">🤖 AI Recommendations</h3>
                  <ul className="text-sm text-blue-700 space-y-2">
                    {result.recommendations.map((rec, index) => (
                      <li key={index}>• {rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="p-6">
              <div className="text-red-600 mb-4">
                <span className="font-medium">Error:</span> {result.error || 'An unknown error occurred'}
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200">
                <h3 className="font-medium text-blue-800 mb-3">💡 Tips</h3>
                <ul className="text-sm text-blue-700 space-y-2">
                  <li>• Be specific with your questions or keywords</li>
                  <li>• Provide a valid URL for content analysis</li>
                  <li>• Try different analysis types for comprehensive insights</li>
                  <li>• Check your internet connection</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
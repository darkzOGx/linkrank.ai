import React, { useState } from 'react';
import { ArrowRight, Search, TrendingUp, Target, DollarSign } from 'lucide-react';

export default function KeywordResearch() {
  const [keyword, setKeyword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!keyword.trim()) return;

    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch(`/api/keyword-research?keyword=${encodeURIComponent(keyword.trim())}`);
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error: 'Network error occurred while researching keywords'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    if (difficulty <= 30) return 'text-green-600 bg-green-50';
    if (difficulty <= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getCPCValue = (cpc) => {
    if (cpc >= 5) return 'text-green-600';
    if (cpc >= 2) return 'text-blue-600';
    return 'text-gray-600';
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-medium text-black mb-4">Free Keyword Research Tool</h1>
        <p className="text-gray-700">
          Discover high-ranking keywords and analyze search volume, competition, and trends.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex flex-col sm:flex-row gap-0 max-w-2xl mx-auto">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Enter seed keyword (e.g., 'digital marketing')"
            className="flex-1 px-4 py-3 text-base bg-white border border-black rounded-none focus:ring-1 focus:ring-black focus:outline-none placeholder-gray-500"
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-black text-white font-medium flex items-center justify-center gap-2 hover:bg-gray-800 disabled:bg-gray-400 transition-colors"
          >
            {isLoading ? 'Researching...' : 'Find Keywords'}
            {!isLoading && <Search className="w-4 h-4" />}
          </button>
        </div>
      </form>

      {result && (
        <div className="border border-black">
          <div className="bg-gray-50 p-4 border-b border-black">
            <h2 className="text-lg font-medium">Keyword Research Results</h2>
            <p className="text-sm text-gray-600 mt-1">Seed Keyword: "{keyword}"</p>
          </div>

          {result.success ? (
            <div className="p-6">
              {/* Main Keyword Analysis */}
              <div className="mb-8 p-4 bg-gray-50 border border-gray-200">
                <h3 className="font-medium mb-3">Primary Keyword Analysis</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{result.mainKeyword?.volume?.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Monthly Volume</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${getDifficultyColor(result.mainKeyword?.difficulty)}`}>
                      {result.mainKeyword?.difficulty}%
                    </div>
                    <div className="text-sm text-gray-600">Difficulty</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${getCPCValue(result.mainKeyword?.cpc)}`}>
                      ${result.mainKeyword?.cpc}
                    </div>
                    <div className="text-sm text-gray-600">Avg. CPC</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {result.mainKeyword?.competition}
                    </div>
                    <div className="text-sm text-gray-600">Competition</div>
                  </div>
                </div>
              </div>

              {/* Related Keywords */}
              <div className="mb-8">
                <h3 className="font-medium mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Related Keywords
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left p-3 text-sm font-medium">Keyword</th>
                        <th className="text-center p-3 text-sm font-medium">Volume</th>
                        <th className="text-center p-3 text-sm font-medium">Difficulty</th>
                        <th className="text-center p-3 text-sm font-medium">CPC</th>
                        <th className="text-center p-3 text-sm font-medium">Trend</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.relatedKeywords?.map((kw, index) => (
                        <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="p-3 text-sm">{kw.keyword}</td>
                          <td className="p-3 text-sm text-center font-medium">
                            {kw.volume?.toLocaleString()}
                          </td>
                          <td className="p-3 text-sm text-center">
                            <span className={`px-2 py-1 rounded ${getDifficultyColor(kw.difficulty)}`}>
                              {kw.difficulty}%
                            </span>
                          </td>
                          <td className={`p-3 text-sm text-center font-medium ${getCPCValue(kw.cpc)}`}>
                            ${kw.cpc}
                          </td>
                          <td className="p-3 text-sm text-center">
                            <TrendingUp className={`w-4 h-4 mx-auto ${kw.trend === 'up' ? 'text-green-600' : kw.trend === 'down' ? 'text-red-600' : 'text-gray-400'}`} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Long-tail Keywords */}
              <div className="mb-8">
                <h3 className="font-medium mb-4">Long-tail Keywords</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {result.longtailKeywords?.map((kw, index) => (
                    <div key={index} className="p-3 bg-gray-50 border border-gray-200">
                      <div className="font-medium text-sm mb-1">{kw.keyword}</div>
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>Vol: {kw.volume?.toLocaleString()}</span>
                        <span className={getDifficultyColor(kw.difficulty)}>
                          Diff: {kw.difficulty}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Questions */}
              <div className="mb-8">
                <h3 className="font-medium mb-4">People Also Ask</h3>
                <div className="space-y-2">
                  {result.questions?.map((question, index) => (
                    <div key={index} className="p-3 bg-blue-50 border border-blue-200">
                      <span className="text-sm text-blue-800">{question}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* SEO Tips */}
              <div className="p-4 bg-green-50 border border-green-200">
                <h3 className="font-medium text-green-800 mb-3">💡 Keyword Strategy Tips</h3>
                <ul className="text-sm text-green-700 space-y-2">
                  <li>• Target keywords with 30-60% difficulty for balanced competition</li>
                  <li>• Focus on long-tail keywords for higher conversion rates</li>
                  <li>• Include question-based keywords for featured snippets</li>
                  <li>• Monitor keyword trends to identify seasonal opportunities</li>
                  <li>• Use a mix of commercial and informational keywords</li>
                  <li>• Consider search intent when selecting target keywords</li>
                </ul>
              </div>
            </div>
          ) : result.educational ? (
            <div className="p-6">
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200">
                <h3 className="font-medium text-blue-800 mb-3">📚 {result.message}</h3>
                <p className="text-blue-700 mb-4">{result.info.explanation}</p>
              </div>

              <div className="mb-6">
                <h3 className="font-medium mb-3">🆓 Free Keyword Research Tools</h3>
                <ul className="space-y-2">
                  {result.info.freeAlternatives.map((alternative, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-green-600 mt-1">✓</span>
                      <span>{alternative}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="font-medium mb-3">🔧 Professional Keyword Tools</h3>
                <ul className="space-y-2">
                  {result.info.professionalTools.map((tool, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>{tool}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="font-medium mb-3">📊 Key Keyword Metrics to Track</h3>
                <ul className="space-y-2">
                  {result.info.keywordMetrics.map((metric, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-purple-600 mt-1">📈</span>
                      <span>{metric}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="font-medium mb-3">🎯 Keyword Research Process</h3>
                <ul className="space-y-2">
                  {result.info.researchProcess.map((step, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-green-600 mt-1 font-medium">{index + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-gray-50 border border-gray-200">
                <h4 className="font-medium mb-2">🚀 Implementation Guide</h4>
                <p className="text-sm text-gray-700">{result.info.implementation}</p>
              </div>
            </div>
          ) : (
            <div className="p-6">
              <div className="text-red-600 mb-4">
                <span className="font-medium">Error:</span> {result.error || 'An unknown error occurred'}
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200">
                <h3 className="font-medium text-blue-800 mb-3">🔍 Manual Keyword Research Tips</h3>
                <ul className="text-sm text-blue-700 space-y-2">
                  <li>• Use Google Autocomplete to find popular search suggestions</li>
                  <li>• Check "People also ask" and "Related searches" sections in Google</li>
                  <li>• Analyze competitor websites to identify target keywords</li>
                  <li>• Use Google Keyword Planner for basic search volume data</li>
                  <li>• Look at Google Trends for seasonal keyword patterns</li>
                  <li>• Consider user intent: informational, commercial, or navigational</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
import React, { useState } from 'react';
import { ArrowRight, Target, AlertCircle, TrendingUp } from 'lucide-react';

export default function KeywordDensity() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);

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

      const response = await fetch(`/api/keyword-density?url=${encodeURIComponent(cleanUrl)}`);
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error: 'Network error occurred while analyzing keyword density'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getDensityColor = (density) => {
    if (density < 1) return 'text-yellow-600 bg-yellow-50';
    if (density <= 2.5) return 'text-green-600 bg-green-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-medium text-black mb-4">Keyword Density Analyzer</h1>
        <p className="text-gray-700">
          Analyze keyword frequency and density to optimize your content for SEO.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex flex-col sm:flex-row gap-0 max-w-2xl mx-auto">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter webpage URL to analyze"
            className="flex-1 px-4 py-3 text-base bg-white border border-black rounded-none focus:ring-1 focus:ring-black focus:outline-none placeholder-gray-500"
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-black text-white font-medium flex items-center justify-center gap-2 hover:bg-gray-800 disabled:bg-gray-400 transition-colors"
          >
            {isLoading ? 'Analyzing...' : 'Analyze Density'}
            {!isLoading && <Target className="w-4 h-4" />}
          </button>
        </div>
      </form>

      {result && (
        <div className="border border-black">
          <div className="bg-gray-50 p-4 border-b border-black">
            <h2 className="text-lg font-medium">Keyword Density Analysis</h2>
            <p className="text-sm text-gray-600 mt-1">{result.url}</p>
          </div>

          {result.success ? (
            <div className="p-6">
              {/* Content Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                <div className="text-center p-3 bg-gray-50 border border-gray-200">
                  <div className="text-2xl font-bold">{result.stats.totalWords}</div>
                  <div className="text-sm text-gray-600">Total Words</div>
                </div>
                <div className="text-center p-3 bg-gray-50 border border-gray-200">
                  <div className="text-2xl font-bold">{result.stats.uniqueWords}</div>
                  <div className="text-sm text-gray-600">Unique Words</div>
                </div>
                <div className="text-center p-3 bg-gray-50 border border-gray-200">
                  <div className="text-2xl font-bold">{result.stats.avgSentenceLength}</div>
                  <div className="text-sm text-gray-600">Avg Sentence Length</div>
                </div>
                <div className="text-center p-3 bg-gray-50 border border-gray-200">
                  <div className="text-2xl font-bold">{result.stats.readingTime}</div>
                  <div className="text-sm text-gray-600">Reading Time</div>
                </div>
              </div>

              {/* Top Keywords */}
              <div className="mb-8">
                <h3 className="font-medium mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Top Keywords by Frequency
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left p-3 text-sm font-medium">#</th>
                        <th className="text-left p-3 text-sm font-medium">Keyword</th>
                        <th className="text-center p-3 text-sm font-medium">Count</th>
                        <th className="text-center p-3 text-sm font-medium">Density</th>
                        <th className="text-left p-3 text-sm font-medium">Prominence</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.topKeywords.map((keyword, index) => (
                        <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="p-3 text-sm">{index + 1}</td>
                          <td className="p-3 text-sm font-medium">{keyword.word}</td>
                          <td className="p-3 text-sm text-center">{keyword.count}</td>
                          <td className="p-3 text-sm text-center">
                            <span className={`px-2 py-1 rounded ${getDensityColor(keyword.density)}`}>
                              {keyword.density}%
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${keyword.prominence}%` }}
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Two-Word Phrases */}
              <div className="mb-8">
                <h3 className="font-medium mb-4">Top Two-Word Phrases</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {result.twoWordPhrases.map((phrase, index) => (
                    <div key={index} className="p-3 bg-gray-50 border border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{phrase.phrase}</span>
                        <span className="text-xs text-gray-600">
                          {phrase.count}x ({phrase.density}%)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Three-Word Phrases */}
              <div className="mb-8">
                <h3 className="font-medium mb-4">Top Three-Word Phrases</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {result.threeWordPhrases.map((phrase, index) => (
                    <div key={index} className="p-3 bg-gray-50 border border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{phrase.phrase}</span>
                        <span className="text-xs text-gray-600">
                          {phrase.count}x ({phrase.density}%)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SEO Analysis */}
              <div className="mb-8">
                <h3 className="font-medium mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                  Keyword Density Analysis
                </h3>
                <div className="space-y-2">
                  {result.analysis.map((item, index) => (
                    <div key={index} className={`p-3 border ${
                      item.type === 'good' ? 'bg-green-50 border-green-200' :
                      item.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                      'bg-red-50 border-red-200'
                    }`}>
                      <span className={`text-sm ${
                        item.type === 'good' ? 'text-green-800' :
                        item.type === 'warning' ? 'text-yellow-800' :
                        'text-red-800'
                      }`}>
                        {item.message}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Optimization Tips */}
              <div className="p-4 bg-blue-50 border border-blue-200">
                <h3 className="font-medium text-blue-800 mb-3">🎯 Keyword Optimization Tips</h3>
                <ul className="text-sm text-blue-700 space-y-2">
                  <li>• Maintain keyword density between 1-2.5% for optimal SEO</li>
                  <li>• Use variations and synonyms of your target keywords</li>
                  <li>• Place important keywords in headings, first paragraph, and conclusion</li>
                  <li>• Avoid keyword stuffing - focus on natural, readable content</li>
                  <li>• Include long-tail keywords and phrases for better targeting</li>
                  <li>• Use LSI (Latent Semantic Indexing) keywords related to your topic</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="p-6">
              <div className="text-red-600 mb-4">
                <span className="font-medium">Error:</span> {result.error}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
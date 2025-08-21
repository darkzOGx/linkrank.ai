import React, { useState } from 'react';
import { TrendingUp, CheckCircle, AlertCircle, Copy, Check, ExternalLink, Users, Target, Award } from 'lucide-react';

const CitationCompetitorAnalysis = () => {
  const [url, setUrl] = useState('');
  const [competitors, setCompetitors] = useState('');
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
      const queryParams = new URLSearchParams({
        url: url.trim()
      });
      
      if (competitors.trim()) {
        queryParams.append('competitors', competitors.trim());
      }

      const response = await fetch(`/api/citation-competitor-analysis?${queryParams}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed');
      }

      setResults(data);
    } catch (err) {
      setError(err.message || 'Network error occurred while analyzing citations');
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

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    if (score >= 20) return 'text-orange-600';
    return 'text-red-600';
  };

  const getRankingColor = (ranking) => {
    if (ranking.includes('#1')) return 'text-green-600';
    if (ranking.includes('#2') || ranking.includes('#3')) return 'text-blue-600';
    return 'text-gray-600';
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Citation Competitor Analysis</h1>
          <p className="text-gray-600">
            Compare your citation strategy against competitors to identify opportunities for improvement and market positioning.
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
              Your Website URL
            </label>
            <input
              type="url"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://yoursite.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
          </div>
          
          <div>
            <label htmlFor="competitors" className="block text-sm font-medium text-gray-700 mb-2">
              Competitor URLs (comma-separated, up to 3)
            </label>
            <input
              type="text"
              id="competitors"
              value={competitors}
              onChange={(e) => setCompetitors(e.target.value)}
              placeholder="https://competitor1.com, https://competitor2.com, https://competitor3.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">Optional: Leave blank for general recommendations</p>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={loading || !url.trim()}
            className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Analyzing...
              </>
            ) : (
              <>
                <TrendingUp className="h-4 w-4" />
                Analyze Citations
              </>
            )}
          </button>
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
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Your Citation Score</h3>
                <div className={`text-3xl font-bold mb-1 ${getScoreColor(results.primarySite.citationScore)}`}>
                  {results.primarySite.citationScore}/100
                </div>
                <p className="text-sm text-gray-600">Overall citation quality</p>
                <div className="mt-2 text-xs text-gray-500">
                  {results.primarySite.totalCitations} total citations
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Competitive Ranking</h3>
                <div className={`text-2xl font-bold mb-1 ${getRankingColor(results.competitiveAnalysis.ranking)}`}>
                  {results.competitiveAnalysis.ranking}
                </div>
                <p className="text-sm text-gray-600">Among analyzed sites</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Authority Links</h3>
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {results.primarySite.authorityLinks}
                </div>
                <p className="text-sm text-gray-600">High-quality sources</p>
                <div className="text-xs text-gray-500 mt-1">
                  of {results.primarySite.totalLinks} total links
                </div>
              </div>
            </div>

            {results.competitors && results.competitors.length > 0 && (
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Competitor Comparison</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 font-medium text-gray-700">Website</th>
                        <th className="text-center py-2 font-medium text-gray-700">Citation Score</th>
                        <th className="text-center py-2 font-medium text-gray-700">Total Citations</th>
                        <th className="text-center py-2 font-medium text-gray-700">Authority Links</th>
                        <th className="text-center py-2 font-medium text-gray-700">Content Length</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-100 bg-blue-50">
                        <td className="py-3 font-medium text-blue-700">
                          Your Site
                          <div className="text-xs text-gray-600">{results.primarySite.domain}</div>
                        </td>
                        <td className="text-center py-3">
                          <span className={`font-bold ${getScoreColor(results.primarySite.citationScore)}`}>
                            {results.primarySite.citationScore}
                          </span>
                        </td>
                        <td className="text-center py-3">{results.primarySite.totalCitations}</td>
                        <td className="text-center py-3">{results.primarySite.authorityLinks}</td>
                        <td className="text-center py-3">{results.primarySite.contentWords?.toLocaleString() || 'N/A'}</td>
                      </tr>
                      {results.competitors.map((competitor, index) => (
                        <tr key={index} className="border-b border-gray-100">
                          <td className="py-3">
                            Competitor {index + 1}
                            <div className="text-xs text-gray-600">{competitor.domain}</div>
                          </td>
                          <td className="text-center py-3">
                            {competitor.error ? (
                              <span className="text-red-500 text-xs">Error</span>
                            ) : (
                              <span className={`font-bold ${getScoreColor(competitor.citationScore)}`}>
                                {competitor.citationScore}
                              </span>
                            )}
                          </td>
                          <td className="text-center py-3">{competitor.totalCitations || 0}</td>
                          <td className="text-center py-3">{competitor.authorityLinks || 0}</td>
                          <td className="text-center py-3">{competitor.contentWords?.toLocaleString() || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Strengths
                </h3>
                <ul className="space-y-2">
                  {results.competitiveAnalysis.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  Areas for Improvement
                </h3>
                <ul className="space-y-2">
                  {results.competitiveAnalysis.weaknesses.map((weakness, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{weakness}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {results.competitiveAnalysis.opportunities && results.competitiveAnalysis.opportunities.length > 0 && (
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  Growth Opportunities
                </h3>
                <ul className="space-y-2">
                  {results.competitiveAnalysis.opportunities.map((opportunity, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{opportunity}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {results.recommendations && results.recommendations.length > 0 && (
              <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Award className="h-5 w-5 text-yellow-600" />
                  Strategic Recommendations
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

            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Analysis completed: {new Date(results.timestamp).toLocaleString()}</span>
                <a
                  href={results.primarySite.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
                >
                  <ExternalLink className="h-4 w-4" />
                  View your site
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CitationCompetitorAnalysis;
import React, { useState } from 'react';
import { TrendingUp, Users, Search, Target, BarChart3, Calendar, Globe, CheckCircle, X } from 'lucide-react';

export default function OrganicTrafficChecker() {
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

      const response = await fetch(`/api/organic-traffic?url=${encodeURIComponent(cleanUrl)}`);
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error: 'Network error occurred while analyzing organic traffic'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    if (score >= 40) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const getTrafficCategoryColor = (category) => {
    switch (category) {
      case 'Very High': return 'bg-green-100 text-green-800';
      case 'High': return 'bg-blue-100 text-blue-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-orange-100 text-orange-800';
      case 'Very Low': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCompetitivenessColor = (level) => {
    switch (level) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toLocaleString();
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-medium text-black mb-4">Organic Traffic Checker</h1>
        <p className="text-gray-700">
          Analyze estimated organic search traffic and discover optimization opportunities.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex flex-col sm:flex-row gap-0 max-w-2xl mx-auto">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter website URL (e.g., https://example.com)"
            className="flex-1 px-4 py-3 text-base bg-white border border-black rounded-none focus:ring-1 focus:ring-black focus:outline-none placeholder-gray-500"
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-black text-white font-medium flex items-center justify-center gap-2 hover:bg-gray-800 disabled:bg-gray-400 transition-colors"
          >
            {isLoading ? 'Analyzing...' : 'Check Traffic'}
            {!isLoading && <TrendingUp className="w-4 h-4" />}
          </button>
        </div>
      </form>

      {result && (
        <div className="border border-black">
          <div className="bg-gray-50 p-4 border-b border-black">
            <h2 className="text-lg font-medium">Organic Traffic Analysis Results</h2>
            <p className="text-sm text-gray-600 mt-1">{result.domain}</p>
          </div>

          {result.success ? (
            <div className="p-6">
              {/* Traffic Estimation Overview */}
              <div className="mb-8">
                <h3 className="font-medium mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Traffic Estimation
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center p-6 border border-gray-200">
                    <div className="text-4xl font-bold text-blue-600 mb-2">
                      {formatNumber(result.estimatedTraffic?.estimated?.monthly || 0)}
                    </div>
                    <div className="text-sm text-gray-600">Monthly Visits</div>
                  </div>
                  <div className="text-center p-6 border border-gray-200">
                    <div className="text-2xl font-bold text-green-600 mb-2">
                      {formatNumber(result.estimatedTraffic?.estimated?.daily || 0)}
                    </div>
                    <div className="text-sm text-gray-600">Daily Visits</div>
                  </div>
                  <div className="text-center p-6 border border-gray-200">
                    <div className={`text-lg font-bold px-3 py-1 rounded ${getTrafficCategoryColor(result.estimatedTraffic?.category)}`}>
                      {result.estimatedTraffic?.category || 'Unknown'}
                    </div>
                    <div className="text-sm text-gray-600 mt-2">Traffic Level</div>
                  </div>
                  <div className="text-center p-6 border border-gray-200">
                    <div className="text-2xl font-bold text-purple-600 mb-2">
                      {result.estimatedTraffic?.confidence || 0}%
                    </div>
                    <div className="text-sm text-gray-600">Confidence</div>
                  </div>
                </div>

                {/* Traffic Range */}
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200">
                  <h4 className="font-medium text-blue-800 mb-2">Estimated Traffic Range</h4>
                  <div className="text-blue-700">
                    <span className="font-medium">
                      {formatNumber(result.estimatedTraffic?.estimated?.min || 0)} - {formatNumber(result.estimatedTraffic?.estimated?.max || 0)}
                    </span> monthly visits
                  </div>
                </div>
              </div>

              {/* SEO Factors */}
              {result.seoFactors && (
                <div className="mb-8">
                  <h3 className="font-medium mb-4 flex items-center gap-2">
                    <Search className="w-5 h-5" />
                    SEO Performance
                  </h3>
                  
                  {/* SEO Scores */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-4 border border-gray-200">
                      <div className={`text-3xl font-bold mx-auto w-20 h-20 rounded-full flex items-center justify-center ${getScoreColor(result.seoFactors.contentQuality?.score || 0)}`}>
                        {result.seoFactors.contentQuality?.score || 0}
                      </div>
                      <div className="text-sm text-gray-600 mt-2">Content Quality</div>
                    </div>
                    <div className="text-center p-4 border border-gray-200">
                      <div className={`text-3xl font-bold mx-auto w-20 h-20 rounded-full flex items-center justify-center ${getScoreColor(result.seoFactors.technicalSEO?.score || 0)}`}>
                        {result.seoFactors.technicalSEO?.score || 0}
                      </div>
                      <div className="text-sm text-gray-600 mt-2">Technical SEO</div>
                    </div>
                    <div className="text-center p-4 border border-gray-200">
                      <div className={`text-3xl font-bold mx-auto w-20 h-20 rounded-full flex items-center justify-center ${getScoreColor(result.seoFactors.overallScore || 0)}`}>
                        {result.seoFactors.overallScore || 0}
                      </div>
                      <div className="text-sm text-gray-600 mt-2">Overall SEO</div>
                    </div>
                  </div>

                  {/* SEO Strengths and Issues */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {result.seoFactors.keyOptimizations && result.seoFactors.keyOptimizations.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-3 text-green-700">✅ SEO Strengths</h4>
                        <div className="space-y-2">
                          {result.seoFactors.keyOptimizations.slice(0, 8).map((strength, index) => (
                            <div key={index} className="p-3 bg-green-50 border border-green-200">
                              <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                <span className="text-green-800 text-sm">{strength}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {result.seoFactors.criticalIssues && result.seoFactors.criticalIssues.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-3 text-red-700">❌ Critical Issues</h4>
                        <div className="space-y-2">
                          {result.seoFactors.criticalIssues.slice(0, 8).map((issue, index) => (
                            <div key={index} className="p-3 bg-red-50 border border-red-200">
                              <div className="flex items-center gap-2">
                                <X className="w-4 h-4 text-red-600" />
                                <span className="text-red-800 text-sm">{issue}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Traffic Factors */}
              {result.estimatedTraffic?.factors && (
                <div className="mb-8">
                  <h3 className="font-medium mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Traffic Influence Factors
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    <div className="p-3 bg-gray-50 border border-gray-200">
                      <div className="text-lg font-bold">{result.estimatedTraffic.factors.wordCount?.toLocaleString() || 0}</div>
                      <div className="text-sm text-gray-600">Words</div>
                    </div>
                    <div className="p-3 bg-gray-50 border border-gray-200">
                      <div className="text-lg font-bold">{result.estimatedTraffic.factors.pageCount || 0}</div>
                      <div className="text-sm text-gray-600">Pages</div>
                    </div>
                    <div className="p-3 bg-gray-50 border border-gray-200">
                      <div className="text-lg font-bold">{result.estimatedTraffic.factors.domainAge || 0}y</div>
                      <div className="text-sm text-gray-600">Domain Age</div>
                    </div>
                    <div className="p-3 bg-gray-50 border border-gray-200">
                      <div className="text-lg font-bold">{result.estimatedTraffic.factors.domainAuthority || 0}</div>
                      <div className="text-sm text-gray-600">Domain Authority</div>
                    </div>
                    <div className="p-3 bg-gray-50 border border-gray-200">
                      <div className="text-lg font-bold">{result.estimatedTraffic.factors.contentQualityScore || 0}</div>
                      <div className="text-sm text-gray-600">Content Score</div>
                    </div>
                    <div className="p-3 bg-gray-50 border border-gray-200">
                      <div className="text-lg font-bold">{result.estimatedTraffic.factors.technicalSEOScore || 0}</div>
                      <div className="text-sm text-gray-600">Technical Score</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Keyword Insights */}
              {result.keywordInsights && (
                <div className="mb-8">
                  <h3 className="font-medium mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Keyword Analysis
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Top Keywords */}
                    {result.keywordInsights.topKeywords && result.keywordInsights.topKeywords.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-3">Top Keywords</h4>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {result.keywordInsights.topKeywords.slice(0, 15).map((keyword, index) => (
                            <div key={index} className="flex justify-between items-center p-2 bg-blue-50 border border-blue-200">
                              <span className="font-medium text-sm">{keyword.keyword}</span>
                              <div className="text-xs text-blue-700">
                                {keyword.frequency}x ({keyword.density}%)
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Keyword Stats */}
                    <div>
                      <h4 className="font-medium mb-3">Keyword Statistics</h4>
                      <div className="space-y-3">
                        <div className="p-3 bg-gray-50 border border-gray-200">
                          <div className="text-lg font-bold">{result.keywordInsights.totalWords?.toLocaleString() || 0}</div>
                          <div className="text-sm text-gray-600">Total Words</div>
                        </div>
                        <div className="p-3 bg-gray-50 border border-gray-200">
                          <div className="text-lg font-bold">{result.keywordInsights.uniqueWords?.toLocaleString() || 0}</div>
                          <div className="text-sm text-gray-600">Unique Words</div>
                        </div>
                        <div className="p-3 bg-gray-50 border border-gray-200">
                          <div className="text-lg font-bold">{result.keywordInsights.keywordDiversity || 0}%</div>
                          <div className="text-sm text-gray-600">Keyword Diversity</div>
                        </div>
                        {result.keywordInsights.titleKeywords && result.keywordInsights.titleKeywords.length > 0 && (
                          <div className="p-3 bg-blue-50 border border-blue-200">
                            <div className="text-sm text-blue-800 font-medium mb-2">Title Keywords</div>
                            <div className="text-xs text-blue-700">
                              {result.keywordInsights.titleKeywords.slice(0, 5).join(', ')}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Competitiveness Analysis */}
              {result.competitiveness && (
                <div className="mb-8">
                  <h3 className="font-medium mb-4 flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Competitiveness Analysis
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="text-center p-6 border border-gray-200">
                      <div className="text-4xl font-bold text-purple-600 mb-2">
                        {result.competitiveness.score}/100
                      </div>
                      <div className={`inline-block px-3 py-1 rounded text-sm font-medium ${getCompetitivenessColor(result.competitiveness.level)}`}>
                        {result.competitiveness.level} Competition
                      </div>
                    </div>
                    <div className="space-y-3">
                      {result.competitiveness.factors && Object.entries(result.competitiveness.factors).map(([factor, value], index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 border border-gray-200">
                          <span className="font-medium capitalize">{factor.replace(/([A-Z])/g, ' $1').trim()}</span>
                          <span className="text-sm text-gray-600">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Analysis Summary */}
              {result.analysis && (
                <div className="mb-8">
                  <h3 className="font-medium mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Traffic Analysis Summary
                  </h3>
                  <div className="p-4 bg-blue-50 border border-blue-200">
                    <pre className="text-sm text-blue-800 whitespace-pre-wrap font-sans">
                      {result.analysis}
                    </pre>
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {result.recommendations && result.recommendations.length > 0 && (
                <div className="p-4 bg-green-50 border border-green-200">
                  <h3 className="font-medium text-green-800 mb-3">🚀 Traffic Growth Recommendations</h3>
                  <ul className="text-sm text-green-700 space-y-2">
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
                <h3 className="font-medium text-blue-800 mb-3">💡 Traffic Analysis Tips</h3>
                <ul className="text-sm text-blue-700 space-y-2">
                  <li>• Ensure the URL is valid and accessible</li>
                  <li>• Check if the website blocks automated requests</li>
                  <li>• Verify the site has sufficient content for analysis</li>
                  <li>• Try with the main domain URL (not subpages)</li>
                  <li>• Some websites may require time to load fully</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
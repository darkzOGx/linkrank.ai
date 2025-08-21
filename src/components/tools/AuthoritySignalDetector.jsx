import React, { useState } from 'react';
import { Award, CheckCircle, AlertCircle, Copy, Check, ExternalLink, Shield, User, Book, Star } from 'lucide-react';

const AuthoritySignalDetector = () => {
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
      const response = await fetch(`/api/authority-signal-detector?url=${encodeURIComponent(url)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed');
      }

      setResults(data);
    } catch (err) {
      setError(err.message || 'Network error occurred while detecting authority signals');
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
      case 'academic_credentials': return <Book className="h-4 w-4" />;
      case 'professional_titles': return <User className="h-4 w-4" />;
      case 'awards_recognition': return <Star className="h-4 w-4" />;
      case 'certifications': return <Award className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Authority Signal Detector</h1>
          <p className="text-gray-600">
            Scan your website for authority signals that AI systems look for including credentials, certifications, awards, and trustworthiness indicators.
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
                  Detecting...
                </>
              ) : (
                <>
                  <Award className="h-4 w-4" />
                  Detect Authority Signals
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
                  <h3 className="text-lg font-semibold text-gray-900">Authority Score</h3>
                  <span className={`text-2xl font-bold ${getGradeColor(results.analysis.grade)}`}>
                    {results.analysis.grade}
                  </span>
                </div>
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {results.analysis.total_authority_score}/100
                </div>
                <p className="text-sm text-gray-600">Overall authority rating</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Signal Breakdown</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Authority:</span>
                    <span className="font-medium">{results.analysis.breakdown.authority_patterns}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Contact:</span>
                    <span className="font-medium">{results.analysis.breakdown.contact_signals}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Technical:</span>
                    <span className="font-medium">{results.analysis.breakdown.technical_signals}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Trust Signals</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${results.contact_signals.email ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="text-sm">Email Contact</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${results.technical_signals.ssl_certificate ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="text-sm">SSL Certificate</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${results.technical_signals.privacy_policy ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="text-sm">Privacy Policy</span>
                  </div>
                </div>
              </div>
            </div>

            {results.authority_signals && (
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Detected Authority Signals</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {Object.entries(results.authority_signals)
                    .filter(([_, data]) => data.count > 0)
                    .map(([category, data]) => (
                      <div key={category} className="bg-white p-4 rounded-lg border">
                        <div className="flex items-center gap-2 mb-3">
                          {getCategoryIcon(category)}
                          <h4 className="font-semibold text-gray-900 capitalize">
                            {category.replace('_', ' ')}
                          </h4>
                          <span className="ml-auto bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            {data.count} found
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{data.description}</p>
                        {data.matches.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {data.matches.slice(0, 5).map((match, index) => (
                              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                {match}
                              </span>
                            ))}
                            {data.matches.length > 5 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded">
                                +{data.matches.length - 5} more
                              </span>
                            )}
                          </div>
                        )}
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

export default AuthoritySignalDetector;
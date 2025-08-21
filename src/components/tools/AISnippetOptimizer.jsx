import React, { useState } from 'react';
import { Zap, CheckCircle, AlertCircle, Copy, Check, ExternalLink, Search, MessageSquare, Sparkles } from 'lucide-react';

const AISnippetOptimizer = () => {
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
      const response = await fetch(`/api/ai-snippet-optimizer?url=${encodeURIComponent(url)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed');
      }

      setResults(data);
    } catch (err) {
      setError(err.message || 'Network error occurred while optimizing AI snippets');
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

  const getAIPlatformIcon = (platform) => {
    switch (platform) {
      case 'chatgpt': return <MessageSquare className="h-4 w-4" />;
      case 'claude': return <Sparkles className="h-4 w-4" />;
      case 'gemini': return <Search className="h-4 w-4" />;
      case 'perplexity': return <Zap className="h-4 w-4" />;
      default: return <Zap className="h-4 w-4" />;
    }
  };

  const getAIPlatformColor = (platform) => {
    switch (platform) {
      case 'chatgpt': return 'border-green-200 bg-green-50';
      case 'claude': return 'border-purple-200 bg-purple-50';
      case 'gemini': return 'border-blue-200 bg-blue-50';
      case 'perplexity': return 'border-orange-200 bg-orange-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">AI Snippet Optimizer</h1>
          <p className="text-gray-600">
            Optimize your content for AI-generated snippets across ChatGPT, Claude, Gemini, Perplexity, and other AI platforms.
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
                  Optimizing...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4" />
                  Optimize AI Snippets
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
                  <h3 className="text-lg font-semibold text-gray-900">Snippet Score</h3>
                  <span className={`text-2xl font-bold ${getGradeColor(results.analysis.grade)}`}>
                    {results.analysis.grade}
                  </span>
                </div>
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {results.analysis.snippetScore}/100
                </div>
                <p className="text-sm text-gray-600">AI snippet optimization</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Current Elements</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Title Length:</span>
                    <span className={`font-medium ${results.analysis.currentElements.titleLength >= 30 && results.analysis.currentElements.titleLength <= 60 ? 'text-green-600' : 'text-red-600'}`}>
                      {results.analysis.currentElements.titleLength} chars
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Description:</span>
                    <span className={`font-medium ${results.analysis.currentElements.descriptionLength >= 120 && results.analysis.currentElements.descriptionLength <= 160 ? 'text-green-600' : 'text-red-600'}`}>
                      {results.analysis.currentElements.descriptionLength} chars
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>H1 Present:</span>
                    <span className={`font-medium ${results.analysis.currentElements.h1 ? 'text-green-600' : 'text-red-600'}`}>
                      {results.analysis.currentElements.h1 ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Optimization Breakdown</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Title:</span>
                    <span className="font-medium">{results.analysis.optimizationBreakdown.titleOptimization}/25</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Description:</span>
                    <span className="font-medium">{results.analysis.optimizationBreakdown.descriptionOptimization}/25</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Structure:</span>
                    <span className="font-medium">{results.analysis.optimizationBreakdown.contentStructure}/25</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Answer Format:</span>
                    <span className="font-medium">{results.analysis.optimizationBreakdown.answerFormat}/25</span>
                  </div>
                </div>
              </div>
            </div>

            {results.optimizedSnippets && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Optimized Snippets by AI Platform</h3>
                <div className="grid gap-6">
                  {Object.entries(results.optimizedSnippets).map(([platform, snippet]) => (
                    <div key={platform} className={`p-6 rounded-lg border ${getAIPlatformColor(platform)}`}>
                      <div className="flex items-center gap-2 mb-4">
                        {getAIPlatformIcon(platform)}
                        <h4 className="font-semibold text-gray-900 capitalize">
                          {platform === 'chatgpt' ? 'ChatGPT' : 
                           platform === 'claude' ? 'Claude' : 
                           platform === 'gemini' ? 'Gemini' : 
                           platform === 'perplexity' ? 'Perplexity' : platform}
                        </h4>
                        <span className="ml-auto text-xs text-gray-500">{snippet.format}</span>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs font-medium text-gray-700 uppercase tracking-wider">Optimized Title</label>
                          <div className="mt-1 p-3 bg-white rounded border">
                            <div className="flex justify-between items-start">
                              <p className="text-sm text-gray-900">{snippet.title}</p>
                              <button
                                onClick={() => handleCopy(snippet.title, `${platform}-title`)}
                                className="ml-2 p-1 text-gray-400 hover:text-gray-600"
                              >
                                {copiedStates[`${platform}-title`] ? (
                                  <Check className="h-3 w-3" />
                                ) : (
                                  <Copy className="h-3 w-3" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-xs font-medium text-gray-700 uppercase tracking-wider">Optimized Description</label>
                          <div className="mt-1 p-3 bg-white rounded border">
                            <div className="flex justify-between items-start">
                              <p className="text-sm text-gray-900">{snippet.description}</p>
                              <button
                                onClick={() => handleCopy(snippet.description, `${platform}-desc`)}
                                className="ml-2 p-1 text-gray-400 hover:text-gray-600"
                              >
                                {copiedStates[`${platform}-desc`] ? (
                                  <Check className="h-3 w-3" />
                                ) : (
                                  <Copy className="h-3 w-3" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-xs font-medium text-gray-700 uppercase tracking-wider">Key Points for AI</label>
                          <div className="mt-1 space-y-2">
                            {snippet.keyPoints.map((point, index) => (
                              <div key={index} className="p-2 bg-white rounded border text-sm text-gray-700">
                                • {point}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {results.recommendations && results.recommendations.length > 0 && (
              <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                  Optimization Recommendations
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

export default AISnippetOptimizer;
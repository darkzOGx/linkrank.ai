import React, { useState } from 'react';
import { ArrowRight, Quote, AlertCircle, TrendingUp, ExternalLink, Copy, Check } from 'lucide-react';

export default function AICitationAnalyzer() {
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

      const response = await fetch(`/api/ai-citation-analyzer?url=${encodeURIComponent(cleanUrl)}`);
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error: 'Network error occurred while analyzing citation potential'
      });
    } finally {
      setIsLoading(false);
    }
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

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const AuthoritySignal = ({ label, value, description }) => (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
      <div>
        <span className="text-black font-medium">{label}</span>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <div className={`w-4 h-4 rounded-full ${value ? 'bg-green-500' : 'bg-gray-300'}`}></div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-medium text-black mb-4">AI Citation Analyzer</h1>
        <p className="text-gray-700">
          Analyze how AI-friendly your content is for citations and discover optimization opportunities for better AI visibility.
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
                Analyzing Citation Potential...
              </>
            ) : (
              <>
                <Quote className="w-4 h-4" />
                Analyze Citation Potential
              </>
            )}
          </button>
        </form>
      </div>

      {result && (
        <div className="space-y-6">
          {result.success ? (
            <>
              {/* Overall Score */}
              <div className="bg-white border border-black p-6">
                <h2 className="text-xl font-medium text-black mb-4 flex items-center gap-2">
                  <Quote className="w-5 h-5" />
                  Citation Potential Analysis
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
                      {result.analysis.citation_potential_score}/100
                    </div>
                    <p className="text-sm text-gray-600 mt-2">Citation Score</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-black">
                      {result.analysis.factual_density}%
                    </div>
                    <p className="text-sm text-gray-600 mt-2">Fact Density</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-black">
                      {result.analysis.factual_indicators}
                    </div>
                    <p className="text-sm text-gray-600 mt-2">Facts Found</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Content Length:</span>
                      <span className="font-medium">{result.analysis.content_length.toLocaleString()} chars</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sentences:</span>
                      <span className="font-medium">{result.analysis.sentence_count}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">External Sources:</span>
                      <span className="font-medium">{result.source_attribution.external_sources}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Citations:</span>
                      <span className="font-medium">{result.source_attribution.citations}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Authority Signals */}
              <div className="bg-white border border-black p-6">
                <h3 className="text-lg font-medium text-black mb-4">Authority Signals</h3>
                <div className="space-y-1">
                  <AuthoritySignal 
                    label="Academic Credentials" 
                    value={result.authority_signals.credentials}
                    description="PhD, Dr., Professor, or other academic titles found"
                  />
                  <AuthoritySignal 
                    label="Publications" 
                    value={result.authority_signals.publications}
                    description="References to published work or research"
                  />
                  <AuthoritySignal 
                    label="Professional Experience" 
                    value={result.authority_signals.experience}
                    description="Years of experience or expertise mentioned"
                  />
                  <AuthoritySignal 
                    label="Institutional Affiliations" 
                    value={result.authority_signals.affiliations}
                    description="University, institute, or organization connections"
                  />
                </div>
              </div>

              {/* Content Structure */}
              <div className="bg-white border border-black p-6">
                <h3 className="text-lg font-medium text-black mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Content Structure Analysis
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(result.content_structure.headings).map(([level, count]) => (
                    <div key={level} className="text-center">
                      <div className="text-xl font-bold text-black">{count}</div>
                      <p className="text-sm text-gray-600">{level.toUpperCase()} Tags</p>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="text-center">
                    <div className="text-xl font-bold text-black">{result.content_structure.lists}</div>
                    <p className="text-sm text-gray-600">Lists</p>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-black">{result.content_structure.tables}</div>
                    <p className="text-sm text-gray-600">Tables</p>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-black">{result.content_structure.blockquotes}</div>
                    <p className="text-sm text-gray-600">Blockquotes</p>
                  </div>
                </div>
              </div>

              {/* External Sources */}
              {result.source_attribution.sources.length > 0 && (
                <div className="bg-white border border-black p-6">
                  <h3 className="text-lg font-medium text-black mb-4 flex items-center gap-2">
                    <ExternalLink className="w-5 h-5" />
                    External Sources ({result.source_attribution.sources.length})
                  </h3>
                  <div className="space-y-3">
                    {result.source_attribution.sources.map((source, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <div className="flex-1">
                          <p className="font-medium text-black truncate">{source.text || 'Link'}</p>
                          <p className="text-sm text-gray-600 truncate">{source.url}</p>
                        </div>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {source.type}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {result.recommendations.length > 0 && (
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
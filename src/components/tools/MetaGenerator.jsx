import React, { useState } from 'react';
import { FileText, Target, Copy, CheckCircle, X, Lightbulb, TrendingUp, Globe } from 'lucide-react';

export default function MetaGenerator() {
  const [formData, setFormData] = useState({
    keyword: '',
    description: '',
    url: '',
    type: 'general',
    tone: 'professional',
    language: 'en'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const contentTypes = [
    { value: 'general', label: 'General Content' },
    { value: 'blog', label: 'Blog Post' },
    { value: 'product', label: 'Product Page' },
    { value: 'service', label: 'Service Page' },
    { value: 'local', label: 'Local Business' }
  ];

  const toneOptions = [
    { value: 'professional', label: 'Professional' },
    { value: 'casual', label: 'Casual' },
    { value: 'urgent', label: 'Urgent' },
    { value: 'friendly', label: 'Friendly' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.keyword.trim()) return;

    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/meta-generator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error: 'Network error occurred while generating meta tags'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text, index, type) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(`${type}-${index}`);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    if (score >= 40) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const getScoreBadgeColor = (score) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    if (score >= 40) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-medium text-black mb-4">Meta Title & Description Generator</h1>
        <p className="text-gray-700">
          Generate SEO-optimized meta titles and descriptions with AI-powered suggestions and analysis.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Keyword Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Keyword *
            </label>
            <input
              type="text"
              value={formData.keyword}
              onChange={(e) => handleInputChange('keyword', e.target.value)}
              placeholder="Enter your main keyword (e.g., SEO optimization, web design)"
              className="w-full px-4 py-3 text-base bg-white border border-gray-300 rounded-none focus:ring-1 focus:ring-black focus:border-black focus:outline-none placeholder-gray-500"
              required
            />
          </div>

          {/* Content Type and Tone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className="w-full px-4 py-3 text-base bg-white border border-gray-300 rounded-none focus:ring-1 focus:ring-black focus:border-black focus:outline-none"
              >
                {contentTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tone
              </label>
              <select
                value={formData.tone}
                onChange={(e) => handleInputChange('tone', e.target.value)}
                className="w-full px-4 py-3 text-base bg-white border border-gray-300 rounded-none focus:ring-1 focus:ring-black focus:border-black focus:outline-none"
              >
                {toneOptions.map(tone => (
                  <option key={tone.value} value={tone.value}>{tone.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Optional Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Existing Description (Optional)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="If you have an existing description to optimize, paste it here..."
                rows={3}
                className="w-full px-4 py-3 text-base bg-white border border-gray-300 rounded-none focus:ring-1 focus:ring-black focus:border-black focus:outline-none placeholder-gray-500 resize-vertical"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Page URL (Optional)
              </label>
              <input
                type="text"
                value={formData.url}
                onChange={(e) => handleInputChange('url', e.target.value)}
                placeholder="https://example.com/page (for content analysis)"
                className="w-full px-4 py-3 text-base bg-white border border-gray-300 rounded-none focus:ring-1 focus:ring-black focus:border-black focus:outline-none placeholder-gray-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-6 py-3 bg-black text-white font-medium flex items-center justify-center gap-2 hover:bg-gray-800 disabled:bg-gray-400 transition-colors"
          >
            {isLoading ? 'Generating...' : 'Generate Meta Tags'}
            {!isLoading && <FileText className="w-5 h-5" />}
          </button>
        </div>
      </form>

      {result && (
        <div className="border border-black">
          <div className="bg-gray-50 p-4 border-b border-black">
            <h2 className="text-lg font-medium">Generated Meta Tags</h2>
            <p className="text-sm text-gray-600 mt-1">Keyword: {result.keyword}</p>
          </div>

          {result.success ? (
            <div className="p-6">
              {/* Overall Score */}
              {result.optimization && (
                <div className="text-center mb-8">
                  <div className={`text-6xl font-bold mx-auto w-32 h-32 rounded-full flex items-center justify-center ${getScoreColor(result.optimization.overallScore || 0)}`}>
                    {result.optimization.overallScore || 0}
                  </div>
                  <p className="text-lg font-medium mt-2">Overall SEO Score</p>
                  <p className="text-sm text-gray-600">Based on title and description optimization</p>
                </div>
              )}

              {/* Best Recommendations */}
              {result.optimization && (
                <div className="mb-8">
                  <h3 className="font-medium mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Recommended Meta Tags
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Best Title */}
                    <div className="p-4 bg-green-50 border border-green-200">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-green-800">Best Title</h4>
                        <span className={`text-xs px-2 py-1 rounded ${getScoreBadgeColor(result.optimization.bestTitle?.score || 0)}`}>
                          Score: {result.optimization.bestTitle?.score || 0}
                        </span>
                      </div>
                      <div className="text-sm text-green-700 mb-3 break-words">
                        {result.optimization.bestTitle?.title}
                      </div>
                      <div className="text-xs text-green-600">
                        Length: {result.optimization.bestTitle?.length} characters
                      </div>
                    </div>

                    {/* Best Description */}
                    <div className="p-4 bg-blue-50 border border-blue-200">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-blue-800">Best Description</h4>
                        <span className={`text-xs px-2 py-1 rounded ${getScoreBadgeColor(result.optimization.bestDescription?.score || 0)}`}>
                          Score: {result.optimization.bestDescription?.score || 0}
                        </span>
                      </div>
                      <div className="text-sm text-blue-700 mb-3 break-words">
                        {result.optimization.bestDescription?.description}
                      </div>
                      <div className="text-xs text-blue-600">
                        Length: {result.optimization.bestDescription?.length} characters
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Title Variations */}
              {result.titles && result.titles.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-medium mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Title Variations
                  </h3>
                  <div className="space-y-3">
                    {result.titles.map((titleData, index) => (
                      <div key={index} className="p-4 border border-gray-200 hover:bg-gray-50">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <div className="font-medium text-sm break-words pr-2">
                              {titleData.title}
                            </div>
                            <div className="text-xs text-gray-600 mt-1">
                              {titleData.length} characters
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs px-2 py-1 rounded ${getScoreBadgeColor(titleData.score)}`}>
                              {titleData.score}
                            </span>
                            <button
                              onClick={() => copyToClipboard(titleData.title, index, 'title')}
                              className="p-1 hover:bg-gray-200 rounded"
                              title="Copy to clipboard"
                            >
                              {copiedIndex === `title-${index}` ? (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              ) : (
                                <Copy className="w-4 h-4 text-gray-600" />
                              )}
                            </button>
                          </div>
                        </div>
                        
                        {/* Strengths and Issues */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                          {titleData.strengths && titleData.strengths.length > 0 && (
                            <div>
                              <div className="text-xs font-medium text-green-700 mb-1">Strengths</div>
                              <div className="space-y-1">
                                {titleData.strengths.map((strength, idx) => (
                                  <div key={idx} className="flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3 text-green-600" />
                                    <span className="text-xs text-green-700">{strength}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {titleData.issues && titleData.issues.length > 0 && (
                            <div>
                              <div className="text-xs font-medium text-red-700 mb-1">Issues</div>
                              <div className="space-y-1">
                                {titleData.issues.map((issue, idx) => (
                                  <div key={idx} className="flex items-center gap-1">
                                    <X className="w-3 h-3 text-red-600" />
                                    <span className="text-xs text-red-700">{issue}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Description Variations */}
              {result.descriptions && result.descriptions.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-medium mb-4 flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Description Variations
                  </h3>
                  <div className="space-y-3">
                    {result.descriptions.map((descData, index) => (
                      <div key={index} className="p-4 border border-gray-200 hover:bg-gray-50">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <div className="text-sm break-words pr-2">
                              {descData.description}
                            </div>
                            <div className="text-xs text-gray-600 mt-1">
                              {descData.length} characters
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs px-2 py-1 rounded ${getScoreBadgeColor(descData.score)}`}>
                              {descData.score}
                            </span>
                            <button
                              onClick={() => copyToClipboard(descData.description, index, 'desc')}
                              className="p-1 hover:bg-gray-200 rounded"
                              title="Copy to clipboard"
                            >
                              {copiedIndex === `desc-${index}` ? (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              ) : (
                                <Copy className="w-4 h-4 text-gray-600" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Strengths and Issues */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                          {descData.strengths && descData.strengths.length > 0 && (
                            <div>
                              <div className="text-xs font-medium text-green-700 mb-1">Strengths</div>
                              <div className="space-y-1">
                                {descData.strengths.map((strength, idx) => (
                                  <div key={idx} className="flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3 text-green-600" />
                                    <span className="text-xs text-green-700">{strength}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {descData.issues && descData.issues.length > 0 && (
                            <div>
                              <div className="text-xs font-medium text-red-700 mb-1">Issues</div>
                              <div className="space-y-1">
                                {descData.issues.map((issue, idx) => (
                                  <div key={idx} className="flex items-center gap-1">
                                    <X className="w-3 h-3 text-red-600" />
                                    <span className="text-xs text-red-700">{issue}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Keyword Suggestions */}
              {result.keywords && (
                <div className="mb-8">
                  <h3 className="font-medium mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Keyword Suggestions
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {['primary', 'longtail', 'related', 'semantic'].map(type => (
                      result.keywords[type] && result.keywords[type].length > 0 && (
                        <div key={type} className="p-4 bg-gray-50 border border-gray-200">
                          <h4 className="font-medium mb-3 capitalize">{type} Keywords</h4>
                          <div className="space-y-2">
                            {result.keywords[type].slice(0, 8).map((keyword, idx) => (
                              <div key={idx} className="text-sm bg-white px-2 py-1 border border-gray-200">
                                {keyword}
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              )}

              {/* Content Analysis */}
              {result.contentAnalysis && !result.contentAnalysis.error && (
                <div className="mb-8">
                  <h3 className="font-medium mb-4">Content Analysis</h3>
                  <div className="p-4 bg-blue-50 border border-blue-200">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-blue-600">Current Title</div>
                        <div className="font-medium text-blue-800">
                          {result.contentAnalysis.current?.title || 'Not found'}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-blue-600">Current Description</div>
                        <div className="font-medium text-blue-800">
                          {result.contentAnalysis.current?.description || 'Not found'}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-blue-600">Content Quality</div>
                        <div className="font-medium text-blue-800">
                          {result.contentAnalysis.content?.contentQuality || 'N/A'}/100
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {result.recommendations && result.recommendations.length > 0 && (
                <div className="p-4 bg-green-50 border border-green-200">
                  <h3 className="font-medium text-green-800 mb-3 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5" />
                    Optimization Recommendations
                  </h3>
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
                <h3 className="font-medium text-blue-800 mb-3">💡 Tips for Better Meta Tags</h3>
                <ul className="text-sm text-blue-700 space-y-2">
                  <li>• Use specific, relevant keywords that match user search intent</li>
                  <li>• Keep titles between 30-60 characters for optimal display</li>
                  <li>• Write descriptions between 120-160 characters</li>
                  <li>• Include compelling calls-to-action in descriptions</li>
                  <li>• Make sure meta tags accurately reflect page content</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
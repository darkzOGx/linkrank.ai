import React, { useState } from 'react';
import { FileText, Download, Copy, CheckCircle, X, AlertTriangle, Globe, Settings, Code } from 'lucide-react';

export default function LLMsGenerator() {
  const [formData, setFormData] = useState({
    url: '',
    customContent: '',
    includeDefaults: true,
    customRules: ['']
  });
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copiedContent, setCopiedContent] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCustomRuleChange = (index, value) => {
    const newRules = [...formData.customRules];
    newRules[index] = value;
    setFormData(prev => ({
      ...prev,
      customRules: newRules
    }));
  };

  const addCustomRule = () => {
    setFormData(prev => ({
      ...prev,
      customRules: [...prev.customRules, '']
    }));
  };

  const removeCustomRule = (index) => {
    if (formData.customRules.length > 1) {
      const newRules = formData.customRules.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        customRules: newRules
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setIsLoading(true);
    setResult(null);

    try {
      const requestData = {
        ...formData,
        customRules: formData.customRules.filter(rule => rule.trim())
      };

      const response = await fetch('/api/llms-generator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error: 'Network error occurred while generating LLMs.txt'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedContent(true);
      setTimeout(() => setCopiedContent(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const downloadFile = (content, filename) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getValidationIcon = (isValid) => {
    return isValid ? (
      <CheckCircle className="w-5 h-5 text-green-600" />
    ) : (
      <X className="w-5 h-5 text-red-600" />
    );
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-medium text-black mb-4">Free LLMs.txt Generator</h1>
        <p className="text-gray-700">
          Generate LLMs.txt files to guide Large Language Models on how to interact with your website.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Website URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Website URL (Optional)
            </label>
            <input
              type="text"
              value={formData.url}
              onChange={(e) => handleInputChange('url', e.target.value)}
              placeholder="https://example.com (for automatic site analysis)"
              className="w-full px-4 py-3 text-base bg-white border border-gray-300 rounded-none focus:ring-1 focus:ring-black focus:border-black focus:outline-none placeholder-gray-500"
            />
            <p className="text-sm text-gray-600 mt-1">
              Provide your website URL to automatically generate site-specific rules
            </p>
          </div>

          {/* Include Defaults */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="includeDefaults"
              checked={formData.includeDefaults}
              onChange={(e) => handleInputChange('includeDefaults', e.target.checked)}
              className="h-4 w-4 text-black border-gray-300 rounded focus:ring-black"
            />
            <label htmlFor="includeDefaults" className="ml-2 text-sm text-gray-700">
              Include default LLM guidance rules (recommended)
            </label>
          </div>

          {/* Custom Rules */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custom Rules (Optional)
            </label>
            {formData.customRules.map((rule, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={rule}
                  onChange={(e) => handleCustomRuleChange(index, e.target.value)}
                  placeholder="e.g., Disallow: /private/ or Allow: /docs/"
                  className="flex-1 px-4 py-2 text-base bg-white border border-gray-300 rounded-none focus:ring-1 focus:ring-black focus:border-black focus:outline-none placeholder-gray-500"
                />
                {formData.customRules.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeCustomRule(index)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 border border-red-300 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addCustomRule}
              className="mt-2 px-4 py-2 text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300 transition-colors"
            >
              Add Custom Rule
            </button>
          </div>

          {/* Custom Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custom Instructions (Optional)
            </label>
            <textarea
              value={formData.customContent}
              onChange={(e) => handleInputChange('customContent', e.target.value)}
              placeholder="Add any custom instructions or comments for LLMs..."
              rows={4}
              className="w-full px-4 py-3 text-base bg-white border border-gray-300 rounded-none focus:ring-1 focus:ring-black focus:border-black focus:outline-none placeholder-gray-500 resize-vertical"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-6 py-3 bg-black text-white font-medium flex items-center justify-center gap-2 hover:bg-gray-800 disabled:bg-gray-400 transition-colors"
          >
            {isLoading ? 'Generating...' : 'Generate LLMs.txt'}
            {!isLoading && <FileText className="w-5 h-5" />}
          </button>
        </div>
      </form>

      {result && (
        <div className="border border-black">
          <div className="bg-gray-50 p-4 border-b border-black">
            <h2 className="text-lg font-medium">Generated LLMs.txt File</h2>
            {result.metadata && (
              <p className="text-sm text-gray-600 mt-1">
                {result.metadata.lineCount} lines, {result.metadata.contentLength} characters
              </p>
            )}
          </div>

          {result.success ? (
            <div className="p-6">
              {/* Generated Content */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium flex items-center gap-2">
                    <Code className="w-5 h-5" />
                    LLMs.txt Content
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => copyToClipboard(result.content)}
                      className="px-4 py-2 bg-blue-600 text-white text-sm flex items-center gap-2 hover:bg-blue-700 transition-colors"
                    >
                      {copiedContent ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                      {copiedContent ? 'Copied!' : 'Copy'}
                    </button>
                    <button
                      onClick={() => downloadFile(result.content, 'llms.txt')}
                      className="px-4 py-2 bg-green-600 text-white text-sm flex items-center gap-2 hover:bg-green-700 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                </div>
                
                <div className="bg-gray-900 text-green-400 p-4 rounded border font-mono text-sm overflow-x-auto">
                  <pre className="whitespace-pre-wrap">{result.content}</pre>
                </div>
              </div>

              {/* Validation Results */}
              {result.validation && (
                <div className="mb-8">
                  <h3 className="font-medium mb-4 flex items-center gap-2">
                    {getValidationIcon(result.validation.valid)}
                    Validation Results
                  </h3>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                    <div className="p-3 bg-gray-50 border border-gray-200">
                      <div className="text-lg font-bold">{result.validation.stats.lines}</div>
                      <div className="text-sm text-gray-600">Total Lines</div>
                    </div>
                    <div className="p-3 bg-gray-50 border border-gray-200">
                      <div className="text-lg font-bold">{result.validation.stats.rules}</div>
                      <div className="text-sm text-gray-600">Rules</div>
                    </div>
                    <div className="p-3 bg-gray-50 border border-gray-200">
                      <div className="text-lg font-bold">{result.validation.stats.comments}</div>
                      <div className="text-sm text-gray-600">Comments</div>
                    </div>
                    <div className="p-3 bg-gray-50 border border-gray-200">
                      <div className={`text-lg font-bold ${result.validation.valid ? 'text-green-600' : 'text-red-600'}`}>
                        {result.validation.valid ? 'Valid' : 'Invalid'}
                      </div>
                      <div className="text-sm text-gray-600">Status</div>
                    </div>
                  </div>

                  {/* Issues */}
                  {result.validation.issues && result.validation.issues.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium mb-2 text-red-700">❌ Issues</h4>
                      <div className="space-y-2">
                        {result.validation.issues.map((issue, index) => (
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

                  {/* Warnings */}
                  {result.validation.warnings && result.validation.warnings.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium mb-2 text-yellow-700">⚠️ Warnings</h4>
                      <div className="space-y-2">
                        {result.validation.warnings.map((warning, index) => (
                          <div key={index} className="p-3 bg-yellow-50 border border-yellow-200">
                            <div className="flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4 text-yellow-600" />
                              <span className="text-yellow-800 text-sm">{warning}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Suggestions */}
                  {result.validation.suggestions && result.validation.suggestions.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2 text-blue-700">💡 Suggestions</h4>
                      <div className="space-y-2">
                        {result.validation.suggestions.map((suggestion, index) => (
                          <div key={index} className="p-3 bg-blue-50 border border-blue-200">
                            <span className="text-blue-800 text-sm">{suggestion}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Site Analysis */}
              {result.siteAnalysis && !result.siteAnalysis.error && (
                <div className="mb-8">
                  <h3 className="font-medium mb-4 flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Site Analysis Results
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 border border-blue-200">
                        <h4 className="font-medium text-blue-800 mb-2">Basic Information</h4>
                        <div className="space-y-1 text-sm">
                          <div><strong>Domain:</strong> {result.siteAnalysis.domain}</div>
                          <div><strong>Content Type:</strong> {result.siteAnalysis.contentType}</div>
                          <div><strong>Languages:</strong> {result.siteAnalysis.languages.join(', ')}</div>
                          {result.siteAnalysis.technologies.length > 0 && (
                            <div><strong>Technologies:</strong> {result.siteAnalysis.technologies.join(', ')}</div>
                          )}
                        </div>
                      </div>

                      <div className="p-4 bg-green-50 border border-green-200">
                        <h4 className="font-medium text-green-800 mb-2">Detected Features</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>API:</span>
                            <span>{result.siteAnalysis.hasAPI ? '✅' : '❌'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Documentation:</span>
                            <span>{result.siteAnalysis.hasDocumentation ? '✅' : '❌'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Privacy Policy:</span>
                            <span>{result.siteAnalysis.hasPrivacyPolicy ? '✅' : '❌'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Terms of Service:</span>
                            <span>{result.siteAnalysis.hasTermsOfService ? '✅' : '❌'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Contact Info:</span>
                            <span>{result.siteAnalysis.hasContactInfo ? '✅' : '❌'}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {result.siteAnalysis.contentAreas && result.siteAnalysis.contentAreas.length > 0 && (
                        <div className="p-4 bg-purple-50 border border-purple-200">
                          <h4 className="font-medium text-purple-800 mb-2">Content Areas</h4>
                          <div className="space-y-1">
                            {result.siteAnalysis.contentAreas.map((area, index) => (
                              <div key={index} className="text-sm text-purple-700">• {area}</div>
                            ))}
                          </div>
                        </div>
                      )}

                      {result.siteAnalysis.title && (
                        <div className="p-4 bg-gray-50 border border-gray-200">
                          <h4 className="font-medium mb-2">Site Details</h4>
                          <div className="space-y-2 text-sm">
                            <div><strong>Title:</strong> {result.siteAnalysis.title}</div>
                            {result.siteAnalysis.description && (
                              <div><strong>Description:</strong> {result.siteAnalysis.description}</div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Implementation Guidelines */}
              {result.implementation && (
                <div className="mb-8">
                  <h3 className="font-medium mb-4 flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Implementation Guidelines
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="p-4 bg-gray-50 border border-gray-200">
                      <h4 className="font-medium mb-3">Server Configuration</h4>
                      <ul className="text-sm space-y-1">
                        {result.implementation.serverConfiguration.map((item, index) => (
                          <li key={index}>• {item}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 bg-gray-50 border border-gray-200">
                      <h4 className="font-medium mb-3">Best Practices</h4>
                      <ul className="text-sm space-y-1">
                        {result.implementation.bestPractices.slice(0, 6).map((item, index) => (
                          <li key={index}>• {item}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 bg-gray-50 border border-gray-200">
                      <h4 className="font-medium mb-3">Testing</h4>
                      <ul className="text-sm space-y-1">
                        {result.implementation.testing.map((item, index) => (
                          <li key={index}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {result.recommendations && result.recommendations.length > 0 && (
                <div className="p-4 bg-green-50 border border-green-200">
                  <h3 className="font-medium text-green-800 mb-3">🤖 LLMs.txt Recommendations</h3>
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
                <h3 className="font-medium text-blue-800 mb-3">💡 LLMs.txt Generator Tips</h3>
                <ul className="text-sm text-blue-700 space-y-2">
                  <li>• You can generate a basic LLMs.txt without providing a URL</li>
                  <li>• Include default rules for comprehensive LLM guidance</li>
                  <li>• Add custom rules specific to your website structure</li>
                  <li>• Test the generated file before deploying to production</li>
                  <li>• Keep the file updated as your website evolves</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
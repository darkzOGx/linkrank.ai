import React, { useState } from 'react';
import { ArrowRight, Database, Copy, Check, AlertCircle, CheckCircle } from 'lucide-react';

export default function StructuredDataValidator() {
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

      const response = await fetch(`/api/structured-data-validator?url=${encodeURIComponent(cleanUrl)}`);
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error: 'Network error occurred while validating structured data'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(JSON.stringify(text, null, 2));
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
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

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-medium text-black mb-4">Structured Data Validator</h1>
        <p className="text-gray-700">
          Validate and analyze your website's structured data markup to improve AI comprehension and citation potential.
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
                Analyzing Structured Data...
              </>
            ) : (
              <>
                <Database className="w-4 h-4" />
                Validate Schema Markup
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
                  <Database className="w-5 h-5" />
                  Structured Data Analysis
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className={`text-2xl font-bold px-3 py-2 rounded ${getGradeColor(result.analysis.grade)}`}>
                      {result.analysis.grade}
                    </div>
                    <p className="text-sm text-gray-600 mt-2">Overall Grade</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-black">
                      {result.analysis.score}/100
                    </div>
                    <p className="text-sm text-gray-600 mt-2">Schema Score</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-black">
                      {result.analysis.totalStructuredData}
                    </div>
                    <p className="text-sm text-gray-600 mt-2">Total Schemas</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">JSON-LD:</span>
                    <span className="font-medium">{result.analysis.jsonLdCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Microdata:</span>
                    <span className="font-medium">{result.analysis.microdataCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">RDFa:</span>
                    <span className="font-medium">{result.analysis.rdfaCount}</span>
                  </div>
                </div>
              </div>

              {/* JSON-LD Schemas */}
              {result.structured_data.jsonLd.length > 0 && (
                <div className="bg-white border border-black p-6">
                  <h3 className="text-lg font-medium text-black mb-4">JSON-LD Schemas ({result.structured_data.jsonLd.length})</h3>
                  <div className="space-y-4">
                    {result.structured_data.jsonLd.map((schema, index) => (
                      <div key={index} className="border border-gray-200 p-4 rounded">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {schema.valid ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-red-600" />
                            )}
                            <span className="font-medium">
                              {schema.type} {!schema.valid && '(Invalid)'}
                            </span>
                          </div>
                          <button
                            onClick={() => copyToClipboard(schema.data, `jsonld-${index}`)}
                            className="flex items-center gap-1 text-sm text-gray-600 hover:text-black"
                          >
                            {copiedField === `jsonld-${index}` ? (
                              <Check className="w-3 h-3" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                            Copy
                          </button>
                        </div>
                        <p className="text-sm text-gray-600">Context: {schema.context}</p>
                        {schema.error && (
                          <p className="text-sm text-red-600 mt-1">Error: {schema.error}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Microdata Items */}
              {result.structured_data.microdata.length > 0 && (
                <div className="bg-white border border-black p-6">
                  <h3 className="text-lg font-medium text-black mb-4">Microdata Items ({result.structured_data.microdata.length})</h3>
                  <div className="space-y-4">
                    {result.structured_data.microdata.map((item, index) => (
                      <div key={index} className="border border-gray-200 p-4 rounded">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{item.type}</span>
                          <span className="text-sm text-gray-600">{Object.keys(item.properties).length} properties</span>
                        </div>
                        <div className="text-sm space-y-1">
                          {Object.entries(item.properties).slice(0, 3).map(([key, value]) => (
                            <div key={key} className="flex">
                              <span className="text-gray-600 w-20 flex-shrink-0">{key}:</span>
                              <span className="truncate">{value}</span>
                            </div>
                          ))}
                          {Object.keys(item.properties).length > 3 && (
                            <span className="text-gray-500">...and {Object.keys(item.properties).length - 3} more</span>
                          )}
                        </div>
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
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{impl.description}</p>
                        <pre className="bg-gray-50 border border-gray-200 rounded p-3 text-xs overflow-x-auto">
                          <code className="language-html">{impl.code}</code>
                        </pre>
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
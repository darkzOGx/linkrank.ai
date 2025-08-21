import React, { useState } from 'react';
import { ArrowRight, FileText, Copy, Check } from 'lucide-react';

export default function MetaExtractor() {
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

      const response = await fetch(`/api/meta-extract?url=${encodeURIComponent(cleanUrl)}`);
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error: 'Network error occurred while extracting meta tags'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-medium text-black mb-4">Extract Meta Tags</h1>
        <p className="text-gray-700">
          Extract and analyze all meta tags from any webpage for SEO insights.
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
            {isLoading ? 'Extracting...' : 'Extract Meta Tags'}
            {!isLoading && <FileText className="w-4 h-4" />}
          </button>
        </div>
      </form>

      {result && (
        <div className="border border-black">
          <div className="bg-gray-50 p-4 border-b border-black">
            <h2 className="text-lg font-medium">Meta Tags Extracted</h2>
            <p className="text-sm text-gray-600 mt-1">{result.url}</p>
          </div>

          {result.success ? (
            <div className="p-6">
              {/* Basic Meta Tags */}
              <div className="mb-8">
                <h3 className="font-medium mb-4">Basic Meta Tags</h3>
                <div className="space-y-3">
                  {result.basicMeta.map((meta, index) => (
                    <div key={index} className="p-4 bg-gray-50 border border-gray-200">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-medium text-gray-700">{meta.name}</span>
                        <button
                          onClick={() => copyToClipboard(meta.content, `basic-${index}`)}
                          className="text-gray-500 hover:text-black"
                        >
                          {copiedField === `basic-${index}` ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      <div className="text-sm bg-white p-2 border border-gray-300 font-mono break-all">
                        {meta.content || '(empty)'}
                      </div>
                      {meta.length && (
                        <div className="text-xs text-gray-500 mt-2">
                          Length: {meta.length} characters
                          {meta.recommendation && (
                            <span className={`ml-2 ${meta.length > meta.maxLength ? 'text-red-600' : 'text-green-600'}`}>
                              {meta.recommendation}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Open Graph Tags */}
              {result.openGraph && result.openGraph.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-medium mb-4">Open Graph Tags</h3>
                  <div className="space-y-3">
                    {result.openGraph.map((og, index) => (
                      <div key={index} className="p-3 bg-blue-50 border border-blue-200">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-sm font-medium text-blue-800">{og.property}</span>
                          <button
                            onClick={() => copyToClipboard(og.content, `og-${index}`)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            {copiedField === `og-${index}` ? (
                              <Check className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                        <div className="text-sm text-blue-700 break-all">{og.content}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Twitter Cards */}
              {result.twitterCards && result.twitterCards.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-medium mb-4">Twitter Card Tags</h3>
                  <div className="space-y-3">
                    {result.twitterCards.map((twitter, index) => (
                      <div key={index} className="p-3 bg-purple-50 border border-purple-200">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-sm font-medium text-purple-800">{twitter.name}</span>
                          <button
                            onClick={() => copyToClipboard(twitter.content, `twitter-${index}`)}
                            className="text-purple-500 hover:text-purple-700"
                          >
                            {copiedField === `twitter-${index}` ? (
                              <Check className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                        <div className="text-sm text-purple-700 break-all">{twitter.content}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Other Meta Tags */}
              {result.otherMeta && result.otherMeta.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-medium mb-4">Other Meta Tags</h3>
                  <div className="space-y-2">
                    {result.otherMeta.map((meta, index) => (
                      <div key={index} className="p-3 bg-gray-50 border border-gray-200">
                        <span className="text-sm font-medium">{meta.name}:</span>
                        <span className="text-sm ml-2">{meta.content}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SEO Analysis */}
              <div className="p-4 bg-green-50 border border-green-200">
                <h3 className="font-medium text-green-800 mb-3">🔍 SEO Analysis</h3>
                <ul className="text-sm text-green-700 space-y-2">
                  {result.seoAnalysis.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className={item.status === 'good' ? 'text-green-600' : item.status === 'warning' ? 'text-yellow-600' : 'text-red-600'}>
                        {item.status === 'good' ? '✓' : item.status === 'warning' ? '⚠' : '✗'}
                      </span>
                      <span>{item.message}</span>
                    </li>
                  ))}
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
import React, { useState, useEffect } from 'react';
import { Link, TrendingUp, AlertCircle, CheckCircle, X, Download, ExternalLink, Shield, AlertTriangle, Loader2 } from 'lucide-react';

export default function BacklinkAudit() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [progress, setProgress] = useState('');
  const [abortController, setAbortController] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedUrl = url.trim();
    if (!trimmedUrl) {
      alert('Please enter a domain or URL');
      return;
    }
    
    if (!validateUrl(trimmedUrl)) {
      alert('Please enter a valid domain (e.g., example.com)');
      return;
    }

    setIsLoading(true);
    setResult(null);
    setProgress('Initializing backlink analysis...');

    const controller = new AbortController();
    setAbortController(controller);
    
    try {
      let cleanUrl = trimmedUrl;
      if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
        cleanUrl = 'https://' + cleanUrl;
      }

      setProgress('Connecting to analysis service...');
      
      const response = await fetch(`/api/backlink-audit?url=${encodeURIComponent(cleanUrl)}`, {
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      setProgress('Processing backlink data...');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        setResult({
          success: false,
          error: data.error || 'Analysis failed'
        });
        return;
      }
      
      // Transform data to match expected format
      const transformedData = {
        ...data,
        totalBacklinks: data.backlinks?.length || 0,
        uniqueDomains: data.uniqueDomains || new Set(data.backlinks?.map(b => b.domain) || []).size,
        averageAuthority: data.averageAuthority || Math.round(
          (data.backlinks?.reduce((sum, b) => sum + (b.authorityScore || 0), 0) || 0) / 
          (data.backlinks?.length || 1)
        ),
        followRatio: data.followRatio || Math.round(
          ((data.backlinks?.filter(b => b.isFollow).length || 0) / (data.backlinks?.length || 1)) * 100
        )
      };
      
      setResult(transformedData);
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Request aborted');
      } else {
        console.error('Backlink analysis error:', error);
        setResult({
          success: false,
          error: error.message || 'Network error occurred while auditing backlinks'
        });
      }
    } finally {
      setIsLoading(false);
      setProgress('');
      setAbortController(null);
    }
  };
  
  const handleCancel = () => {
    if (abortController) {
      abortController.abort();
      setAbortController(null);
      setIsLoading(false);
      setProgress('');
    }
  };
  
  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (abortController) {
        abortController.abort();
      }
    };
  }, [abortController]);

  const getAuthorityColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-blue-600 bg-blue-50';
    if (score >= 40) return 'text-yellow-600 bg-yellow-50';
    if (score >= 20) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const getQualityBadge = (quality) => {
    const badges = {
      'High': { color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle },
      'Medium': { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: AlertCircle },
      'Low': { color: 'bg-red-100 text-red-800 border-red-200', icon: X },
      'Toxic': { color: 'bg-red-600 text-white border-red-700', icon: AlertTriangle }
    };
    const badge = badges[quality] || badges['Medium'];
    const Icon = badge.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium border rounded-full ${badge.color}`}>
        <Icon className="w-3 h-3" />
        {quality}
      </span>
    );
  };

  const validateUrl = (url) => {
    try {
      // Remove protocol if present
      const cleanUrl = url.replace(/^https?:\/\//, '').trim();
      
      // Basic domain validation
      const domainPattern = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/;
      const parts = cleanUrl.split('/');
      const domain = parts[0];
      
      return domainPattern.test(domain);
    } catch {
      return false;
    }
  };

  const exportToCSV = () => {
    if (!result || !result.backlinks || result.backlinks.length === 0) {
      alert('No backlink data available to export');
      return;
    }
    
    const headers = ['Domain', 'Authority Score', 'Quality', 'Anchor Text', 'Type', 'Follow Status'];
    const rows = result.backlinks.map(link => [
      link.domain,
      link.authorityScore,
      link.quality,
      link.anchorText || 'N/A',
      link.type,
      link.isFollow ? 'Follow' : 'NoFollow'
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backlink-audit-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-medium text-black mb-4">Backlink Audit Tool</h1>
        <p className="text-gray-700">
          Analyze your website's backlink profile to identify high-quality links, toxic links, and opportunities for improvement.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex flex-col sm:flex-row gap-0 max-w-2xl mx-auto">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter domain or URL to audit (e.g., example.com)"
            className="flex-1 px-4 py-3 text-base bg-white border border-black rounded-none focus:ring-1 focus:ring-black focus:outline-none placeholder-gray-500"
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-black text-white font-medium flex items-center justify-center gap-2 hover:bg-gray-800 disabled:bg-gray-400 transition-colors"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                Analyze Backlinks
                <Link className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
      
      {/* Progress Indicator */}
      {isLoading && (
        <div className="mb-6 max-w-2xl mx-auto">
          <div className="bg-blue-50 border border-blue-200 rounded p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                <span className="text-sm font-medium text-blue-800">{progress}</span>
              </div>
              <button
                onClick={handleCancel}
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                Cancel
              </button>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{width: '40%'}}></div>
            </div>
            <p className="text-xs text-blue-600 mt-2">
              This may take 30-60 seconds depending on the website size and backlink profile.
            </p>
          </div>
        </div>
      )}

      {result && (
        <div className="border border-black">
          <div className="bg-gray-50 p-4 border-b border-black flex justify-between items-center">
            <div>
              <h2 className="text-lg font-medium">Backlink Analysis Results</h2>
              <p className="text-sm text-gray-600 mt-1">{result.domain}</p>
            </div>
            {result.success && result.backlinks && result.backlinks.length > 0 && (
              <button
                onClick={exportToCSV}
                className="px-4 py-2 bg-white border border-gray-300 text-sm font-medium flex items-center gap-2 hover:bg-gray-50 transition-colors"
              >
                <Download className="w-4 h-4" />
                Export to CSV
              </button>
            )}
          </div>

          {result.success ? (
            <div className="p-6">
              {/* Overview Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                <div className="text-center p-4 border border-gray-200">
                  <div className="text-3xl font-bold text-blue-600">{result.totalBacklinks || 0}</div>
                  <div className="text-sm text-gray-600 mt-1">Total Backlinks</div>
                </div>
                <div className="text-center p-4 border border-gray-200">
                  <div className="text-3xl font-bold text-green-600">{result.uniqueDomains || 0}</div>
                  <div className="text-sm text-gray-600 mt-1">Unique Domains</div>
                </div>
                <div className="text-center p-4 border border-gray-200">
                  <div className="text-3xl font-bold text-purple-600">{result.averageAuthority || 0}</div>
                  <div className="text-sm text-gray-600 mt-1">Avg Authority</div>
                </div>
                <div className="text-center p-4 border border-gray-200">
                  <div className="text-3xl font-bold text-orange-600">{result.followRatio || 0}%</div>
                  <div className="text-sm text-gray-600 mt-1">Follow Ratio</div>
                </div>
              </div>
              
              {/* Analysis Info */}
              {result.analysisInfo && (
                <div className="mb-6 p-4 bg-gray-50 border border-gray-200">
                  <h3 className="font-medium mb-2">Analysis Details</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>Analysis Time:</strong> {result.analysisInfo.analysisTime || 'N/A'}</p>
                    <p><strong>Methods Used:</strong> {result.analysisInfo.methodsUsed?.join(', ') || 'Multiple sources'}</p>
                    <p><strong>Last Updated:</strong> {new Date().toLocaleString()}</p>
                  </div>
                </div>
              )}

              {/* Quality Distribution */}
              {result.qualityDistribution && (
                <div className="mb-8">
                  <h3 className="font-medium mb-4">Backlink Quality Distribution</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-4 bg-green-50 border border-green-200 text-center">
                      <div className="text-2xl font-bold text-green-700">{result.qualityDistribution.high || 0}</div>
                      <div className="text-sm text-green-600">High Quality</div>
                    </div>
                    <div className="p-4 bg-yellow-50 border border-yellow-200 text-center">
                      <div className="text-2xl font-bold text-yellow-700">{result.qualityDistribution.medium || 0}</div>
                      <div className="text-sm text-yellow-600">Medium Quality</div>
                    </div>
                    <div className="p-4 bg-orange-50 border border-orange-200 text-center">
                      <div className="text-2xl font-bold text-orange-700">{result.qualityDistribution.low || 0}</div>
                      <div className="text-sm text-orange-600">Low Quality</div>
                    </div>
                    <div className="p-4 bg-red-50 border border-red-200 text-center">
                      <div className="text-2xl font-bold text-red-700">{result.qualityDistribution.toxic || 0}</div>
                      <div className="text-sm text-red-600">Toxic Links</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Backlinks Table */}
              {result.backlinks && result.backlinks.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-medium mb-4">Top Backlinks</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                          <th className="text-left p-3 font-medium text-sm">Domain</th>
                          <th className="text-center p-3 font-medium text-sm">Authority</th>
                          <th className="text-center p-3 font-medium text-sm">Quality</th>
                          <th className="text-left p-3 font-medium text-sm">Anchor Text</th>
                          <th className="text-center p-3 font-medium text-sm">Type</th>
                          <th className="text-center p-3 font-medium text-sm">Follow</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.backlinks.slice(0, 20).map((link, index) => (
                          <tr key={`${link.domain}-${index}`} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium" title={link.sourceUrl}>{link.domain}</span>
                                {link.sourceUrl && (
                                  <a href={link.sourceUrl} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="w-3 h-3 text-gray-400 hover:text-blue-600" />
                                  </a>
                                )}
                              </div>
                            </td>
                            <td className="p-3 text-center">
                              <span className={`inline-block px-2 py-1 rounded text-sm font-medium ${getAuthorityColor(link.authorityScore || 0)}`}>
                                {link.authorityScore || 0}
                              </span>
                            </td>
                            <td className="p-3 text-center">
                              {getQualityBadge(link.quality || 'Medium')}
                            </td>
                            <td className="p-3 text-sm text-gray-700" title={link.anchorText}>
                              {link.anchorText || 'N/A'}
                            </td>
                            <td className="p-3 text-center">
                              <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                                {link.type || 'Unknown'}
                              </span>
                            </td>
                            <td className="p-3 text-center">
                              {link.isFollow !== false ? (
                                <CheckCircle className="w-4 h-4 text-green-600 mx-auto" title="Follow link" />
                              ) : (
                                <X className="w-4 h-4 text-gray-400 mx-auto" title="NoFollow link" />
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {result.backlinks.length > 20 && (
                    <p className="text-sm text-gray-600 mt-2">
                      Showing top 20 of {result.backlinks.length} backlinks. Export to CSV to see all.
                    </p>
                  )}
                </div>
              )}

              {/* Anchor Text Distribution */}
              {result.anchorTextDistribution && result.anchorTextDistribution.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-medium mb-4">Top Anchor Texts</h3>
                  <div className="space-y-2">
                    {result.anchorTextDistribution.slice(0, 10).map((anchor, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200">
                        <span className="text-sm">{anchor.text}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-600">{anchor.count} links</span>
                          <span className="text-sm font-medium">{anchor.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Issues & Recommendations */}
              {result.issues && result.issues.length > 0 && (
                <div className="mb-8 p-4 bg-red-50 border border-red-200">
                  <h3 className="font-medium text-red-800 mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Issues Found
                  </h3>
                  <ul className="text-sm text-red-700 space-y-2">
                    {result.issues.map((issue, index) => (
                      <li key={index}>• {issue}</li>
                    ))}
                  </ul>
                </div>
              )}

              {result.recommendations && result.recommendations.length > 0 && (
                <div className="p-4 bg-green-50 border border-green-200">
                  <h3 className="font-medium text-green-800 mb-3 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Recommendations
                  </h3>
                  <ul className="text-sm text-green-700 space-y-2">
                    {result.recommendations.map((rec, index) => (
                      <li key={index}>• {rec}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Info Box */}
              <div className="mt-8 p-4 bg-blue-50 border border-blue-200">
                <h3 className="font-medium text-blue-800 mb-2">About Backlink Analysis</h3>
                <p className="text-sm text-blue-700">
                  This tool provides an overview of your website's backlink profile. Regular backlink audits help identify:
                </p>
                <ul className="text-sm text-blue-700 mt-2 space-y-1">
                  <li>• High-quality links that boost your SEO</li>
                  <li>• Toxic or spammy links that could harm rankings</li>
                  <li>• Link building opportunities from competitors</li>
                  <li>• Anchor text optimization needs</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="p-6">
              <div className="text-red-600 mb-4 p-4 bg-red-50 border border-red-200 rounded">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5" />
                  <span className="font-medium">Analysis Error</span>
                </div>
                <p className="text-sm">{result.error || 'An unknown error occurred during backlink analysis'}</p>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
                <h3 className="font-medium text-blue-800 mb-3 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Troubleshooting Tips
                </h3>
                <ul className="text-sm text-blue-700 space-y-2">
                  <li>• Ensure the domain is valid and accessible (e.g., example.com)</li>
                  <li>• Check if the website is online and not blocking automated requests</li>
                  <li>• Try entering just the domain name without http:// or https://</li>
                  <li>• Some websites have strict anti-bot protection that may prevent analysis</li>
                  <li>• Very new domains may have limited backlink data available</li>
                  <li>• If the issue persists, try again in a few minutes</li>
                </ul>
              </div>
              
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
                <h3 className="font-medium text-yellow-800 mb-2">Note about Backlink Analysis</h3>
                <p className="text-sm text-yellow-700">
                  Backlink analysis requires checking multiple external sources and may take time to complete. 
                  The accuracy and completeness of results depend on publicly available data and may vary by domain.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
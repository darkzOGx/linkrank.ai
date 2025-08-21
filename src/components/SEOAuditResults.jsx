import React from 'react';
import { ArrowLeft, CheckCircle, AlertTriangle, AlertCircle, Info, Clock, Globe, Smartphone, Target, FileText, Search, Zap } from 'lucide-react';

// Score indicator component
const ScoreIndicator = ({ score, size = 'large' }) => {
  const getColor = (score) => {
    if (score >= 90) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    if (score >= 50) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const sizeClasses = size === 'large' 
    ? 'w-24 h-24 text-3xl font-bold' 
    : 'w-16 h-16 text-xl font-semibold';

  return (
    <div className={`${sizeClasses} ${getColor(score)} border-2 rounded-full flex items-center justify-center`}>
      {score}
    </div>
  );
};

// Issue type icon
const IssueIcon = ({ type }) => {
  const iconProps = { className: "w-4 h-4" };
  
  switch (type) {
    case 'success': return <CheckCircle {...iconProps} className="w-4 h-4 text-green-600" />;
    case 'warning': return <AlertTriangle {...iconProps} className="w-4 h-4 text-yellow-600" />;
    case 'error': return <AlertCircle {...iconProps} className="w-4 h-4 text-red-600" />;
    case 'info': return <Info {...iconProps} className="w-4 h-4 text-blue-600" />;
    default: return <Info {...iconProps} className="w-4 h-4 text-gray-600" />;
  }
};

// Comprehensive audit item with detailed tracking and examples
const ComprehensiveAuditItem = ({ item, category }) => {
  const getStatusIcon = (score) => {
    if (score >= 90) return <CheckCircle className="w-5 h-5 text-green-600" />;
    if (score >= 70) return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
    return <AlertCircle className="w-5 h-5 text-red-600" />;
  };

  const getStatusBg = (score) => {
    if (score >= 90) return 'bg-green-50 border-green-200';
    if (score >= 70) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  return (
    <div className={`border-2 rounded-lg p-6 ${getStatusBg(item.score)}`}>
      <div className="flex items-start gap-4">
        {getStatusIcon(item.score)}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-lg text-gray-900">{item.label}</h4>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-gray-700">{item.score}/100</span>
            </div>
          </div>
          
          <p className="text-sm text-gray-700 mb-4 leading-relaxed">{item.description}</p>
          
          <div className="space-y-4">
            {/* Current Status */}
            <div className="bg-white/80 p-4 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-gray-800">Current Status:</p>
                {item.path && (
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    📍 {item.path}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-900 font-mono bg-gray-50 p-2 rounded">
                {item.current}
              </p>
            </div>

            {/* Issues and Details */}
            {item.issues && item.issues.length > 0 && (
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                <p className="text-sm font-semibold text-red-800 mb-2">⚠️ Issues Found:</p>
                <ul className="text-sm text-red-700 space-y-1">
                  {item.issues.map((issue, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span>{issue}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Element Details/Paths */}
            {item.details && item.details.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                <p className="text-sm font-semibold text-yellow-800 mb-2">📋 Element Details:</p>
                <div className="space-y-1">
                  {item.details.map((detail, index) => (
                    <p key={index} className="text-xs text-yellow-700 font-mono bg-yellow-100 p-2 rounded">
                      {detail}
                    </p>
                  ))}
                </div>
              </div>
            )}
            
            {/* Recommendations - only show if score < 90 */}
            {item.score < 90 && item.recommendations && item.recommendations.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <p className="text-sm font-semibold text-blue-800 mb-2">💡 Recommendations:</p>
                <ul className="text-sm text-blue-700 space-y-1">
                  {item.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Practical Example - only show if score < 90 */}
            {item.score < 90 && item.practicalExample && (
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <p className="text-sm font-semibold text-green-800 mb-2">🔧 Practical Example:</p>
                <pre className="text-xs text-green-700 bg-green-100 p-3 rounded overflow-x-auto">
                  <code>{item.practicalExample}</code>
                </pre>
              </div>
            )}
            
            {/* Success State */}
            {item.score >= 90 && (
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <p className="text-sm font-semibold text-green-800 mb-1">✅ Excellent Optimization:</p>
                <p className="text-sm text-green-700">This element is properly configured and following SEO best practices.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Individual category results with comprehensive details
const CategoryResults = ({ title, score, items, description, icon: Icon }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <Icon className="w-7 h-7 text-gray-700" />
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
      <ScoreIndicator score={score} size="small" />
    </div>
    
    <div className="space-y-4">
      {items.map((item, index) => (
        <ComprehensiveAuditItem key={index} item={item} category={title} />
      ))}
    </div>
  </div>
);

// Main audit results component
export default function SEOAuditResults({ result, onNewAudit }) {
  // Handle error cases where analysis failed
  if (!result || result.error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-red-200 rounded-lg p-8">
            <button 
              onClick={onNewAudit}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Try Again
            </button>
            
            <div className="text-center">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Analysis Failed</h1>
              <p className="text-gray-600 mb-6">
                {result?.errorMessage || 'Unable to analyze this website due to CORS restrictions.'}
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-blue-900 mb-3">💡 Try These Working Examples:</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => window.location.href = '/?url=demo.linkrank.ai'}
                    className="block w-full text-left px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded transition-colors"
                  >
                    demo.linkrank.ai - Demo website for testing
                  </button>
                  <button
                    onClick={() => window.location.href = '/?url=example.com'}
                    className="block w-full text-left px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded transition-colors"
                  >
                    example.com - Standard test domain
                  </button>
                </div>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-800 mb-2">Why This Happens:</h4>
                <p className="text-sm text-yellow-700">
                  Many websites block cross-origin requests for security. This is a browser limitation, not a tool issue. 
                  Professional SEO tools use server-side analysis to avoid these restrictions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Use ONLY the enhanced API analysis data, no fallback legacy format to avoid duplicates
  const onPageItems = result.analysis?.on_page?.results || [];

  const technicalItems = result.analysis?.technical?.results || [];

  const contentItems = result.analysis?.content?.results || [];

  // Calculate category scores using API data if available, otherwise calculate from items
  const onPageScore = result.analysis?.on_page?.score || Math.round(onPageItems.reduce((sum, item) => sum + item.score, 0) / onPageItems.length);
  const technicalScore = result.analysis?.technical?.score || Math.round(technicalItems.reduce((sum, item) => sum + item.score, 0) / technicalItems.length);
  const contentScore = result.analysis?.content?.score || Math.round(contentItems.reduce((sum, item) => sum + item.score, 0) / contentItems.length);
  
  // Calculate overall comprehensive score (average of all category scores)
  const overallComprehensiveScore = Math.round((onPageScore + technicalScore + contentScore) / 3);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 mb-8">
          <button 
            onClick={onNewAudit}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            New Analysis
          </button>
          
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Comprehensive SEO Audit</h1>
              <p className="text-gray-600 mb-2 break-all font-mono text-sm">{result.url}</p>
              <p className="text-sm text-gray-500">
                Analysis completed on {new Date().toLocaleString()}
              </p>
              <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Response: {result.response_time || 'N/A'}ms
                </div>
                <div className="flex items-center gap-1">
                  <Globe className="w-4 h-4" />
                  H1s: {result.headings?.h1_count || 0}
                </div>
                <div className="flex items-center gap-1">
                  <Smartphone className="w-4 h-4" />
                  Images: {result.images?.total_images || 0}
                </div>
              </div>
            </div>
            
            <div className="flex justify-center">
              <div className="text-center">
                <ScoreIndicator score={result.overall_score || 0} />
                <p className="text-lg font-semibold text-gray-900 mt-3">Overall Score</p>
                <p className="text-sm text-gray-600">SEO Performance Rating</p>
              </div>
            </div>
          </div>
        </div>

        {/* Score Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
            <ScoreIndicator score={onPageScore} size="small" />
            <h3 className="font-semibold text-gray-900 mt-3">On-Page SEO</h3>
            <p className="text-sm text-gray-600 mt-1">{onPageItems.length} elements analyzed</p>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
            <ScoreIndicator score={technicalScore} size="small" />
            <h3 className="font-semibold text-gray-900 mt-3">Advanced Technical Performance</h3>
            <p className="text-sm text-gray-600 mt-1">{technicalItems.length} factors checked</p>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
            <ScoreIndicator score={contentScore} size="small" />
            <h3 className="font-semibold text-gray-900 mt-3">Content & Structure</h3>
            <p className="text-sm text-gray-600 mt-1">{contentItems.length} metrics evaluated</p>
          </div>
        </div>

        {/* Detailed Results */}
        <CategoryResults 
          title="On-Page SEO Elements" 
          score={onPageScore}
          description="Critical meta elements that search engines use to understand and rank your content"
          items={onPageItems}
          icon={Search}
        />
        
        <CategoryResults 
          title="Advanced Technical Performance" 
          score={technicalScore}
          description="Comprehensive technical factors including performance, security, analytics, and crawlability"
          items={technicalItems}
          icon={Zap}
        />
        
        <CategoryResults 
          title="Content & Link Structure" 
          score={contentScore}
          description="Content quality and internal/external linking that builds authority and relevance"
          items={contentItems}
          icon={FileText}
        />

        {/* Page Summary */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Info className="w-6 h-6 text-blue-600" />
            Page Analysis Summary
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Page Title</h4>
              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded border">
                {result.title_tag?.value || 'No title tag found'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Length: {result.title_tag?.value?.length || 0} characters
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Meta Description</h4>
              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded border">
                {result.meta_description?.value || 'No meta description found'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Length: {result.meta_description?.value?.length || 0} characters
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{result.headings?.h1_count || 0}</p>
              <p className="text-sm text-gray-600">H1 Headings</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{result.images?.total_images || 0}</p>
              <p className="text-sm text-gray-600">Total Images</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{(result.links?.internal_count || 0) + (result.links?.external_count || 0)}</p>
              <p className="text-sm text-gray-600">Total Links</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{result.content?.word_count || 0}</p>
              <p className="text-sm text-gray-600">Word Count</p>
            </div>
          </div>
        </div>

        {/* Link Structure Analysis from API */}
        {result.analysis?.link_structure && (
          <CategoryResults 
            title="Link Structure & Navigation" 
            score={result.analysis.link_structure.score}
            description="Internal/external links, URL structure, and site navigation analysis"
            items={result.analysis.link_structure.results}
            icon={Globe}
          />
        )}

        {/* SEO Checklists */}
        {result.seo_checklists && (
          <div className="bg-white border border-gray-200 rounded-lg p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              SEO Optimization Checklists
            </h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              {Object.entries(result.seo_checklists).map(([key, checklist]) => (
                <div key={key} className="border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">{checklist.title}</h4>
                  <div className="space-y-3">
                    {checklist.items.map((item, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded">
                        <div className={`w-3 h-3 rounded-full mt-1 ${
                          item.status === 'completed' ? 'bg-green-500' : 
                          item.status === 'critical' ? 'bg-red-500' : 'bg-yellow-500'
                        }`} />
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900">{item.item}</h5>
                          <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                          <p className="text-xs text-gray-500 mt-1"><strong>Current:</strong> {item.current_state}</p>
                          <p className="text-xs text-blue-600 mt-1"><strong>Recommendation:</strong> {item.recommendation}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Strategy Sections */}
        {result.strategy_sections && (
          <div className="bg-white border border-gray-200 rounded-lg p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Target className="w-8 h-8 text-purple-600" />
              Strategic SEO Recommendations
            </h3>
            
            <div className="grid gap-8">
              {Object.entries(result.strategy_sections).map(([key, section]) => (
                <div key={key} className="border border-gray-200 rounded-lg p-6">
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">{section.title}</h4>
                  <p className="text-gray-600 mb-4">{section.description}</p>
                  
                  <div className="space-y-4">
                    {section.recommendations.map((rec, index) => (
                      <div key={index} className="border-l-4 border-blue-500 pl-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded ${
                            rec.priority === 'high' ? 'bg-red-100 text-red-800' :
                            rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {rec.priority} priority
                          </span>
                          <h5 className="font-medium text-gray-900">{rec.action}</h5>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                        <p className="text-sm text-blue-600"><strong>Implementation:</strong> {rec.implementation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Overall Score Summary */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <Target className="w-8 h-8 text-blue-600" />
            Overall SEO Performance Score
          </h3>
          
          <div className="flex items-center justify-center mb-6">
            <ScoreIndicator score={overallComprehensiveScore} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white/70 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-center mb-2">
                <Search className="w-6 h-6 text-gray-700 mr-2" />
                <span className="font-semibold text-gray-900">On-Page SEO</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">{onPageScore}/100</div>
            </div>
            
            <div className="bg-white/70 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-center mb-2">
                <Zap className="w-6 h-6 text-gray-700 mr-2" />
                <span className="font-semibold text-gray-900">Advanced Technical Performance</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">{technicalScore}/100</div>
            </div>
            
            <div className="bg-white/70 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-center mb-2">
                <FileText className="w-6 h-6 text-gray-700 mr-2" />
                <span className="font-semibold text-gray-900">Content & Structure</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">{contentScore}/100</div>
            </div>
          </div>
          
          <div className="bg-white/50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-gray-700 leading-relaxed">
              This comprehensive analysis evaluated <span className="font-semibold">{onPageItems.length + technicalItems.length + contentItems.length} critical SEO factors</span> across 
              on-page elements, technical performance, and content structure. Each element was analyzed with detailed path tracking, 
              issue identification, and practical optimization examples to help improve your search engine visibility.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
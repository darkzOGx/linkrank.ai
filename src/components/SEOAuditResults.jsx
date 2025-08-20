import React from 'react';
import { ArrowLeft, CheckCircle, AlertTriangle, AlertCircle, Info, Clock, Globe, Smartphone } from 'lucide-react';

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

// Individual category results
const CategoryResults = ({ title, score, results, icon: Icon }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <Icon className="w-6 h-6 text-gray-700" />
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
      </div>
      <ScoreIndicator score={score} size="small" />
    </div>
    
    {results.length === 0 ? (
      <p className="text-gray-500 text-sm">No issues found in this category.</p>
    ) : (
      <div className="space-y-3">
        {results.map((result, index) => (
          <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <IssueIcon type={result.type} />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-medium text-sm text-gray-900">{result.issue}</h4>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  result.impact === 'High' ? 'bg-red-100 text-red-800' :
                  result.impact === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  result.impact === 'Low' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {result.impact} Impact
                </span>
              </div>
              <p className="text-sm text-gray-600">{result.description}</p>
              <p className="text-xs text-gray-500 mt-1">Category: {result.category}</p>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

// Main audit results component
export default function SEOAuditResults({ results, onNewAudit }) {
  const { categories, overallScore, url, responseTime, metadata, timestamp } = results;

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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">SEO Analysis Report</h1>
              <p className="text-gray-600 mb-2 break-all">{url}</p>
              <p className="text-sm text-gray-500">
                Analyzed on {new Date(timestamp).toLocaleString()}
              </p>
              <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Response: {responseTime}ms
                </div>
                <div className="flex items-center gap-1">
                  <Globe className="w-4 h-4" />
                  H1s: {metadata.h1Count}
                </div>
                <div className="flex items-center gap-1">
                  <Smartphone className="w-4 h-4" />
                  Images: {metadata.imageCount}
                </div>
              </div>
            </div>
            
            <div className="flex justify-center">
              <div className="text-center">
                <ScoreIndicator score={overallScore} />
                <p className="text-lg font-semibold text-gray-900 mt-3">Overall Score</p>
                <p className="text-sm text-gray-600">Out of 100</p>
              </div>
            </div>
          </div>
        </div>

        {/* Score Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <ScoreIndicator score={categories.onPage.score} size="small" />
            <h3 className="font-semibold text-gray-900 mt-2">On-Page SEO</h3>
            <p className="text-sm text-gray-600">{categories.onPage.results.length} issues</p>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <ScoreIndicator score={categories.performance.score} size="small" />
            <h3 className="font-semibold text-gray-900 mt-2">Performance</h3>
            <p className="text-sm text-gray-600">{categories.performance.results.length} issues</p>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <ScoreIndicator score={categories.accessibility.score} size="small" />
            <h3 className="font-semibold text-gray-900 mt-2">Accessibility</h3>
            <p className="text-sm text-gray-600">{categories.accessibility.results.length} issues</p>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <ScoreIndicator score={categories.bestPractices.score} size="small" />
            <h3 className="font-semibold text-gray-900 mt-2">Best Practices</h3>
            <p className="text-sm text-gray-600">{categories.bestPractices.results.length} issues</p>
          </div>
        </div>

        {/* Detailed Results */}
        <CategoryResults 
          title="On-Page SEO" 
          score={categories.onPage.score}
          results={categories.onPage.results}
          icon={Globe}
        />
        
        <CategoryResults 
          title="Performance" 
          score={categories.performance.score}
          results={categories.performance.results}
          icon={Clock}
        />
        
        <CategoryResults 
          title="Accessibility" 
          score={categories.accessibility.score}
          results={categories.accessibility.results}
          icon={Smartphone}
        />
        
        <CategoryResults 
          title="Best Practices" 
          score={categories.bestPractices.score}
          results={categories.bestPractices.results}
          icon={CheckCircle}
        />

        {/* Metadata Summary */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Page Summary</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Title</h4>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                {metadata.title || 'No title found'}
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Meta Description</h4>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                {metadata.description || 'No meta description found'}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{metadata.h1Count}</p>
              <p className="text-sm text-gray-600">H1 Tags</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{metadata.imageCount}</p>
              <p className="text-sm text-gray-600">Images</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{metadata.linkCount}</p>
              <p className="text-sm text-gray-600">Links</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{responseTime}ms</p>
              <p className="text-sm text-gray-600">Load Time</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
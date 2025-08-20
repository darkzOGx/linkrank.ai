import React from 'react';
import { ArrowLeft } from 'lucide-react';

const StatusIndicator = ({ score }) => {
  if (score >= 80) return <div className="w-2.5 h-2.5 bg-green-500 rounded-full" title="Pass" />;
  if (score >= 60) return <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full" title="Needs Improvement" />;
  return <div className="w-2.5 h-2.5 bg-red-500 rounded-full" title="Fail" />;
};

const RecommendationPriority = ({ priority }) => {
  const priorityStyles = {
    high: 'border-red-500 text-red-700 bg-red-50',
    medium: 'border-yellow-500 text-yellow-700 bg-yellow-50',
    low: 'border-blue-500 text-blue-700 bg-blue-50',
  };
  return (
    <span className={`px-2 py-0.5 text-xs font-medium border rounded-full ${priorityStyles[priority] || 'border-gray-500 text-gray-700 bg-gray-50'}`}>
      {priority} Priority
    </span>
  );
};

const ResultRow = ({ label, value, score }) => (
  <tr className="border-b border-gray-200 last:border-b-0">
    <td className="py-4 pr-4 align-top text-sm font-medium">{label}</td>
    <td className="py-4 pr-4 align-top text-sm text-gray-700"><pre className="whitespace-pre-wrap font-sans">{value || 'N/A'}</pre></td>
    <td className="py-4 pr-4 align-top text-sm text-center font-mono">{score !== undefined ? `${score}/100` : 'N/A'}</td>
    <td className="py-4 pl-4 align-top w-12 text-center"><div className="flex justify-center pt-1.5"><StatusIndicator score={score} /></div></td>
  </tr>
);


export default function AuditResults({ result, onNewAudit }) {
  const metrics = [
    { label: 'Title Tag', value: result.title_tag?.value, score: result.title_tag?.score },
    { label: 'Meta Description', value: result.meta_description?.value, score: result.meta_description?.score },
    { label: 'H1 Headings', value: `${result.headings?.h1_count} found`, score: result.headings?.score },
    { label: 'Image ALT Tags', value: `${result.images?.missing_alt} missing from ${result.images?.total_images} total`, score: result.images?.score },
    { label: 'Page Load Time', value: result.page_speed?.load_time ? `${result.page_speed.load_time.toFixed(2)}s` : 'N/A', score: result.page_speed?.score },
    { label: 'Mobile Friendly', value: result.mobile_friendly?.is_mobile_friendly ? 'Pass' : 'Fail', score: result.mobile_friendly?.score },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <header className="mb-12">
        <button onClick={onNewAudit} className="flex items-center gap-2 text-sm text-gray-600 hover:text-black mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          New Audit
        </button>
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-3xl font-medium text-black">Audit Report</h1>
            <p className="text-gray-600 font-mono text-sm mt-2">{result.url}</p>
          </div>
          <div className="text-left sm:text-right">
            <div className="text-5xl font-medium">{result.overall_score}<span className="text-3xl text-gray-400">/100</span></div>
            <p className="text-sm text-gray-500 mt-1">Overall Performance Score</p>
          </div>
        </div>
      </header>
      
      <div className="mb-16 border border-black">
        <h2 className="text-lg font-medium p-4 border-b border-black bg-gray-50">On-Page SEO Metrics</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="border-b border-black bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-xs uppercase tracking-wider font-medium text-gray-500">Metric</th>
                <th className="py-3 px-4 text-xs uppercase tracking-wider font-medium text-gray-500">Value</th>
                <th className="py-3 px-4 text-xs uppercase tracking-wider font-medium text-gray-500 text-center">Score</th>
                <th className="py-3 px-4 text-xs uppercase tracking-wider font-medium text-gray-500 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {metrics.map(metric => (
                <ResultRow key={metric.label} label={metric.label} value={metric.value} score={metric.score} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-medium p-4 border border-b-0 border-black bg-gray-50">Actionable Recommendations</h2>
        <div className="border border-black p-6 space-y-6">
          {result.recommendations && result.recommendations.length > 0 ? (
            result.recommendations.map((rec, index) => (
              <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
                  <h3 className="font-medium text-black">{rec.category}</h3>
                  <RecommendationPriority priority={rec.priority} />
                </div>
                <p className="text-gray-700 text-sm mb-3">{rec.description}</p>
                {rec.how_to_fix && (
                  <div className="bg-gray-50 p-3 text-sm border border-gray-200">
                    <p className="font-medium text-gray-800">How to fix:</p>
                    <p className="text-gray-600 font-mono text-xs mt-1">{rec.how_to_fix}</p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-600 text-sm">No specific recommendations found. The site performs well in all audited categories.</p>
          )}
        </div>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { Users, CheckCircle, AlertCircle, Copy, Check, ExternalLink, Building, MapPin, Calendar, Package, Cpu } from 'lucide-react';

const EntityRecognitionOptimizer = () => {
  const [url, setUrl] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedStates, setCopiedStates] = useState({});
  const [selectedEntityType, setSelectedEntityType] = useState('all');

  const handleAnalyze = async () => {
    if (!url.trim()) {
      setError('Please enter a URL to analyze');
      return;
    }

    setLoading(true);
    setError('');
    setResults(null);

    try {
      const response = await fetch(`/api/entity-recognition-optimizer?url=${encodeURIComponent(url)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed');
      }

      setResults(data);
    } catch (err) {
      setError(err.message || 'Network error occurred while optimizing entity recognition');
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

  const getEntityIcon = (type) => {
    switch (type) {
      case 'people': return <Users className="h-4 w-4" />;
      case 'organizations': return <Building className="h-4 w-4" />;
      case 'locations': return <MapPin className="h-4 w-4" />;
      case 'dates': return <Calendar className="h-4 w-4" />;
      case 'products': return <Package className="h-4 w-4" />;
      case 'technologies': return <Cpu className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const getEntityColor = (type) => {
    switch (type) {
      case 'people': return 'bg-blue-100 text-blue-800';
      case 'organizations': return 'bg-green-100 text-green-800';
      case 'locations': return 'bg-purple-100 text-purple-800';
      case 'dates': return 'bg-orange-100 text-orange-800';
      case 'products': return 'bg-pink-100 text-pink-800';
      case 'technologies': return 'bg-indigo-100 text-indigo-800';
      case 'metrics': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFilteredEntities = () => {
    if (!results || selectedEntityType === 'all') {
      return results ? Object.entries(results.entities).flatMap(([type, entities]) => 
        entities.map(entity => ({ ...entity, entityType: type }))
      ) : [];
    }
    return results.entities[selectedEntityType] || [];
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Entity Recognition Optimizer</h1>
          <p className="text-gray-600">
            Optimize how AI systems identify and understand people, organizations, locations, and other entities in your content.
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
                  Analyzing...
                </>
              ) : (
                <>
                  <Users className="h-4 w-4" />
                  Optimize Entity Recognition
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
                  <h3 className="text-lg font-semibold text-gray-900">Entity Score</h3>
                  <span className={`text-2xl font-bold ${getGradeColor(results.analysis.grade)}`}>
                    {results.analysis.grade}
                  </span>
                </div>
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {results.analysis.entityScore}/100
                </div>
                <p className="text-sm text-gray-600">Recognition optimization</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Entities</h3>
                <div className="text-3xl font-bold text-green-600 mb-1">
                  {results.analysis.totalEntities}
                </div>
                <p className="text-sm text-gray-600">Detected entities</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Structured Data</h3>
                <div className="text-3xl font-bold text-purple-600 mb-1">
                  {results.analysis.structuredDataEntities}
                </div>
                <p className="text-sm text-gray-600">Schema markups found</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Entity Distribution</h3>
                <div className="space-y-3">
                  {Object.entries(results.analysis.entityDistribution).map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getEntityIcon(type)}
                        <span className="text-sm font-medium text-gray-700 capitalize">{type}:</span>
                      </div>
                      <span className="font-medium">{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {results.structuredDataEntities && results.structuredDataEntities.length > 0 && (
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Existing Schema Markup</h3>
                  <div className="space-y-3">
                    {results.structuredDataEntities.map((schema, index) => (
                      <div key={index} className="bg-white p-3 rounded border border-blue-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900">{schema.type}</span>
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {schema.markup}
                          </span>
                        </div>
                        <div className="text-xs text-gray-600">
                          Properties: {schema.properties.slice(0, 3).join(', ')}
                          {schema.properties.length > 3 && ` +${schema.properties.length - 3} more`}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Detected Entities</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedEntityType('all')}
                    className={`px-3 py-1 rounded text-sm ${selectedEntityType === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                  >
                    All ({results.analysis.totalEntities})
                  </button>
                  {Object.entries(results.analysis.entityDistribution)
                    .filter(([, count]) => count > 0)
                    .map(([type, count]) => (
                      <button
                        key={type}
                        onClick={() => setSelectedEntityType(type)}
                        className={`px-3 py-1 rounded text-sm capitalize ${selectedEntityType === type ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                      >
                        {type} ({count})
                      </button>
                    ))}
                </div>
              </div>

              <div className="grid gap-3 max-h-96 overflow-y-auto">
                {getFilteredEntities().map((entity, index) => (
                  <div key={index} className="bg-white p-4 rounded border hover:shadow-sm transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getEntityIcon(entity.entityType || entity.type)}
                        <span className="font-medium text-gray-900">{entity.name}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEntityColor(entity.entityType || entity.type)}`}>
                          {(entity.entityType || entity.type).replace(/s$/, '')}
                        </span>
                      </div>
                      <button
                        onClick={() => handleCopy(entity.name, `entity-${index}`)}
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                        title="Copy entity name"
                      >
                        {copiedStates[`entity-${index}`] ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {entity.context && (
                      <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded italic">
                        "{entity.context}"
                      </p>
                    )}
                  </div>
                ))}

                {getFilteredEntities().length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No entities found for the selected filter.
                  </div>
                )}
              </div>
            </div>

            {results.recommendations && results.recommendations.length > 0 && (
              <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                  Recommendations
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
              <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Practical Implementations
                </h3>
                <div className="space-y-4">
                  {results.practicalImplementations.map((impl, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg border border-green-200">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-semibold text-gray-900">{impl.title}</h4>
                        <button
                          onClick={() => handleCopy(impl.code, `impl-${index}`)}
                          className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                          title="Copy code"
                        >
                          {copiedStates[`impl-${index}`] ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{impl.description}</p>
                      <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                        <code>{impl.code}</code>
                      </pre>
                    </div>
                  ))}
                </div>
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

export default EntityRecognitionOptimizer;
import React, { useState } from 'react';
import GEOAuditResults from '../components/GEOAuditResults';
import CredibilityLogos from '../components/CredibilityLogos';
import { AlertTriangle, Brain, Zap, Database, ArrowRight, Server, Search, Target, Shield } from 'lucide-react';

// GEO Hero Section matching SEO audit theme
const GEOHeroSection = ({ onStartAudit, isLoading }) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url.trim()) {
      onStartAudit(url.trim());
    }
  };

  return (
    <section className="bg-white border-b border-black">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-medium text-black mb-6">
            <span className="block sm:inline">AI Visibility</span>{' '}
            <span className="block sm:inline">& <span className="text-[#fcd63a]">GEO Audit</span></span>
          </h1>
          <p className="text-lg text-gray-700 mb-10 max-w-3xl mx-auto">
            A comprehensive analysis protocol for evaluating Generative Engine Optimization and AI citation potential. Enter a URL to assess your website's visibility across AI platforms and language models.
          </p>

          {/* What is GEO explanation */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 max-w-4xl mx-auto mb-10">
            <h2 className="text-xl font-medium text-gray-900 mb-3 flex items-center justify-center gap-2">
              <Database className="w-5 h-5" />
              What is GEO (Generative Engine Optimization)?
            </h2>
            <p className="text-gray-800 text-sm leading-relaxed">
              GEO focuses on optimizing content for inclusion within AI-generated answers, prioritizing factual authority, 
              structured data, and citations to be quoted or referenced by large language models like ChatGPT, Claude, Gemini, 
              and Perplexity. Unlike SEO which aims for clicks, GEO aims to be cited as a source within AI responses.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto mb-20">
            <div className="flex flex-col sm:flex-row gap-0">
              <label htmlFor="geo-url-input" className="sr-only">Website URL</label>
              <input
                id="geo-url-input"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="flex-1 px-4 py-3 text-base bg-white border border-black rounded-none focus:ring-1 focus:ring-black focus:outline-none placeholder-gray-500"
                required
              />
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 bg-[#fcd63a] text-black font-medium flex items-center justify-center gap-2 hover:bg-[#e6c133] disabled:bg-gray-400 transition-colors"
              >
                {isLoading ? 'Analyzing...' : 'Generate Report'}
                {!isLoading && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </form>

          <CredibilityLogos />
        </div>
      </div>
    </section>
  );
};

// GEO Features Section matching SEO audit theme
const geoAnalysisPoints = [
  { icon: Database, title: 'Structured Data Markup', description: 'Schema.org, JSON-LD validation' },
  { icon: Brain, title: 'Citation Potential', description: 'Fact density, statistical content' },
  { icon: Shield, title: 'Authority Signals', description: 'Expert authorship, credentials' },
  { icon: Target, title: 'AI Readability', description: 'Content structure, extraction' },
  { icon: Search, title: 'Entity Recognition', description: 'People, places, organizations' },
  { icon: Zap, title: 'Trust Indicators', description: 'SSL, transparency, sources' }
];

const GEOFeaturesSection = () => {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-medium text-black mb-4">
            <span className="block sm:inline">Comprehensive</span>{' '}
            <span className="block sm:inline">GEO Analysis</span>
          </h2>
          <p className="text-lg text-gray-700">
            Our protocol performs a multi-point inspection of a given URL against established best practices for Generative Engine Optimization and AI citation potential. Key areas of analysis include:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-black border border-black">
          {geoAnalysisPoints.map((point) => (
            <div key={point.title} className="bg-white p-8">
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  <point.icon className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-black mb-1">
                    {point.title}
                  </h3>
                  <p className="text-gray-600">
                    {point.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional GEO Factors */}
        <div className="mt-16 bg-white border border-black p-8">
          <h3 className="text-2xl font-medium text-black mb-6">
            Additional GEO Factors Analyzed
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium text-black mb-3">Content Optimization</h4>
              <ul className="text-gray-600 space-y-1">
                <li>• Fact density analysis</li>
                <li>• AI readability scoring</li>
                <li>• Content extraction optimization</li>
                <li>• Citation format analysis</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-black mb-3">Expertise Markup</h4>
              <ul className="text-gray-600 space-y-1">
                <li>• Author schema validation</li>
                <li>• Credential documentation</li>
                <li>• E-A-T signal detection</li>
                <li>• Professional markup analysis</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-black mb-3">Technical Factors</h4>
              <ul className="text-gray-600 space-y-1">
                <li>• Entity recognition optimization</li>
                <li>• Knowledge panel readiness</li>
                <li>• Source attribution checking</li>
                <li>• FAQ schema implementation</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// GEO Audit service function
async function performGEOAudit(url) {
  const response = await fetch('/api/geo-audit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Cache-Control': 'no-cache'
    },
    body: JSON.stringify({ url }),
    cache: 'no-store'
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(errorData.message || `Request failed with status ${response.status}`);
  }
  
  return await response.json();
}

export default function GEOAuditPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentResult, setCurrentResult] = useState(null);
  const [error, setError] = useState(null);

  const performAnalysis = async (url) => {
    setIsLoading(true);
    setError(null);
    setCurrentResult(null);

    try {
      const result = await performGEOAudit(url);
      setCurrentResult(result);
    } catch (err) {
      console.error('GEO analysis error:', err);
      setError(err.message || 'Failed to analyze website. Please check the URL and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewAudit = () => {
    setCurrentResult(null);
    setError(null);
  };
  
  if (currentResult) {
    return <GEOAuditResults result={currentResult} onNewAudit={handleNewAudit} />;
  }

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="mb-6">
            <Server className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Server-Side GEO Analysis in Progress</h2>
          <p className="text-gray-600 mb-4">Our advanced GEO crawler is analyzing your website...</p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
            <div className="flex items-center gap-2 text-sm text-blue-800">
              <Zap className="w-4 h-4" />
              <span>AI citation analysis • Structured data validation • Authority assessment</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md border border-red-500 p-8 rounded-lg">
          <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-4" />
          <h2 className="text-lg font-medium text-black mb-2">GEO Analysis Failed</h2>
          <p className="text-gray-600 text-sm mb-6">{error}</p>
          <button
            onClick={handleNewAudit}
            className="px-6 py-2 bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <GEOHeroSection onStartAudit={performAnalysis} isLoading={isLoading} />
      <GEOFeaturesSection />
    </>
  );
}
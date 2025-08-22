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
    <section className="relative overflow-hidden py-20">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-gray-100"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 to-purple-50/30"></div>
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            AI-powered GEO audit that works
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Optimize for AI search engines and increase your content's citation potential. 
            Advanced GEO analysis with 340% higher AI visibility rates.
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

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 max-w-2xl mx-auto mb-12">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="geo-url-input" className="block text-sm font-medium text-gray-700 mb-2">
                  Website URL
                </label>
                <input
                  id="geo-url-input"
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-colors"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2"
              >
                {isLoading ? 'Analyzing...' : 'Start GEO Analysis'}
                {!isLoading && <ArrowRight className="w-5 h-5" />}
              </button>
            </form>
            
            <div className="mt-4 text-center text-sm text-gray-500">
              ✓ AI optimization analysis • ✓ Citation potential • ✓ 100% free
            </div>
          </div>

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
    <section className="py-20 sm:py-24" style={{ backgroundColor: '#E8E8E8' }}>
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
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-4">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-gray-100"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 to-purple-50/30"></div>
        
        <div className="relative text-center max-w-md bg-white rounded-2xl p-8 shadow-xl border border-gray-200">
          <div className="mb-6">
            <Brain className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
          <h2 className="text-xl font-semibold text-[#171919] mb-2">GEO Analysis in Progress</h2>
          <p className="text-gray-600 mb-4">Our AI-powered analyzer is examining your website...</p>
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Zap className="w-4 h-4" />
              <span>AI citation analysis • Authority assessment</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-4">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-gray-100"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 to-purple-50/30"></div>
        
        <div className="relative text-center max-w-md bg-white border border-red-200 p-8 rounded-2xl shadow-xl">
          <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-[#171919] mb-2">GEO Analysis Failed</h2>
          <p className="text-gray-600 text-sm mb-6">{error}</p>
          <button
            onClick={handleNewAudit}
            className="px-6 py-3 bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl rounded-lg"
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
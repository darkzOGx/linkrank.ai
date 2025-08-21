import React, { useState } from 'react';
import { performServerSideAnalysis } from '../services/serverSeoAnalyzer';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import SEOAuditResults from '../components/SEOAuditResults';
import { AlertTriangle, Server, Zap } from 'lucide-react';

export default function SEOAuditPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentResult, setCurrentResult] = useState(null);
  const [error, setError] = useState(null);

  const performAnalysis = async (url) => {
    setIsLoading(true);
    setError(null);
    setCurrentResult(null);

    try {
      const result = await performServerSideAnalysis(url);
      setCurrentResult(result);
    } catch (err) {
      console.error('SEO analysis error:', err);
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
    return <SEOAuditResults result={currentResult} onNewAudit={handleNewAudit} />;
  }

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="mb-6">
            <Server className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Server-Side Analysis in Progress</h2>
          <p className="text-gray-600 mb-4">Our advanced SEO crawler is analyzing your website...</p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
            <div className="flex items-center gap-2 text-sm text-blue-800">
              <Zap className="w-4 h-4" />
              <span>No CORS restrictions • Full website access • Comprehensive analysis</span>
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
          <h2 className="text-lg font-medium text-black mb-2">Analysis Failed</h2>
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
      <HeroSection onStartAudit={performAnalysis} isLoading={isLoading} />
      <FeaturesSection />
    </>
  );
}
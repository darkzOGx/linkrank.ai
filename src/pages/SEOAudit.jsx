import React, { useState } from 'react';
import { performSEOAnalysis } from '../services/seoAnalyzer';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import SEOAuditResults from '../components/SEOAuditResults';
import { AlertTriangle } from 'lucide-react';

export default function SEOAuditPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentResult, setCurrentResult] = useState(null);
  const [error, setError] = useState(null);

  const performAnalysis = async (url) => {
    setIsLoading(true);
    setError(null);
    setCurrentResult(null);

    try {
      const result = await performSEOAnalysis(url);
      setCurrentResult(result);
    } catch (err) {
      console.error('SEO analysis error:', err);
      setError('Failed to analyze website. Please check the URL and try again. The website may be blocking automated requests or may be temporarily unavailable.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewAudit = () => {
    setCurrentResult(null);
    setError(null);
  };
  
  if (currentResult) {
    return <SEOAuditResults results={currentResult} onNewAudit={handleNewAudit} />;
  }

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center px-4">
        <div className="text-center font-mono">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm">ANALYZING WEBSITE...</p>
          <p className="text-xs text-gray-500 mt-2">Please wait while we analyze the page</p>
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
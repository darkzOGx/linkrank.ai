import React, { useState, useEffect } from 'react';
import { performServerSideAnalysis } from '../services/serverSeoAnalyzer';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import SEOAuditResults from '../components/SEOAuditResults';
import { trackToolUsage, trackPageView } from '../services/analytics';
import { AlertTriangle, Server, Zap } from 'lucide-react';

export default function SEOAuditPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentResult, setCurrentResult] = useState(null);
  const [error, setError] = useState(null);

  // Track page view
  useEffect(() => {
    trackPageView('SEO Audit');
  }, []);

  const performAnalysis = async (url) => {
    setIsLoading(true);
    setError(null);
    setCurrentResult(null);

    const startTime = Date.now();

    try {
      const result = await performServerSideAnalysis(url);
      setCurrentResult(result);
      
      // Track successful SEO audit usage
      trackToolUsage('SEO Audit', {
        url: url,
        execution_time: Date.now() - startTime,
        success: true,
        overall_score: result.overall_score,
        onpage_score: result.onpage_score,
        technical_score: result.technical_score,
        content_score: result.content_score
      });
    } catch (err) {
      console.error('SEO analysis error:', err);
      setError(err.message || 'Failed to analyze website. Please check the URL and try again.');
      
      // Track failed SEO audit usage
      trackToolUsage('SEO Audit', {
        url: url,
        execution_time: Date.now() - startTime,
        success: false,
        error: err.message || 'Analysis failed'
      });
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
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-4">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-gray-100"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 to-purple-50/30"></div>
        
        <div className="relative text-center max-w-md bg-white rounded-2xl p-6 shadow-xl border border-gray-200">
          <div className="mb-6">
            <Server className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
          <h2 className="text-xl font-semibold text-[#171919] mb-2">Analysis in Progress</h2>
          <p className="text-gray-600 mb-4">Our advanced SEO analyzer is examining your website...</p>
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Zap className="w-4 h-4" />
              <span>Comprehensive analysis • Real-time results</span>
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
        
        <div className="relative text-center max-w-md bg-white border border-red-200 p-6 rounded-2xl shadow-xl">
          <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-[#171919] mb-2">Analysis Failed</h2>
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
      <HeroSection onStartAudit={performAnalysis} isLoading={isLoading} />
      <FeaturesSection />
    </>
  );
}
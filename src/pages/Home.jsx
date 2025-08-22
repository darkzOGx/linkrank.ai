import React, { useState } from 'react';
import { Search, CheckCircle, Zap, FileText, Shield, BarChart3, Users, Code, Star, Globe, Target, Database, Brain, AlertTriangle, Server } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { performServerSideAnalysis } from '../services/serverSeoAnalyzer';
import SEOAuditResults from '../components/SEOAuditResults';
import GEOAuditResults from '../components/GEOAuditResults';
import CredibilityLogos from '../components/CredibilityLogos';

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

export default function Home() {
  const navigate = useNavigate();
  const [auditUrl, setAuditUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [auditType, setAuditType] = useState(null); // 'seo' or 'geo'
  const [currentResult, setCurrentResult] = useState(null);
  const [error, setError] = useState(null);

  // DEPLOYMENT TEST - CHECKING IF CHANGES ARE WORKING
  console.log('HOME PAGE DEPLOYED - TESTING ROUTING ISSUE');

  // Define all functions before using them
  const performSEOAnalysis = async (url) => {
    setIsLoading(true);
    setAuditType('seo');
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

  const performGEOAnalysis = async (url) => {
    setIsLoading(true);
    setAuditType('geo');
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

  const handleSEOAudit = () => {
    if (auditUrl.trim()) {
      performSEOAnalysis(auditUrl.trim());
    }
  };

  const handleGEOAudit = () => {
    if (auditUrl.trim()) {
      performGEOAnalysis(auditUrl.trim());
    }
  };

  const handleNewAudit = () => {
    setCurrentResult(null);
    setError(null);
    setAuditType(null);
    setAuditUrl('');
  };

  // If we have results, show the appropriate results component
  if (currentResult && auditType === 'seo') {
    return <SEOAuditResults result={currentResult} onNewAudit={handleNewAudit} />;
  }

  if (currentResult && auditType === 'geo') {
    return <GEOAuditResults result={currentResult} onNewAudit={handleNewAudit} />;
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-4">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-gray-100"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 to-purple-50/30"></div>
        
        <div className="relative text-center max-w-md bg-white rounded-2xl p-6 shadow-xl border border-gray-200">
          <div className="mb-6">
            {auditType === 'seo' ? (
              <Server className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            ) : (
              <Brain className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            )}
            <div className={`w-8 h-8 border-2 ${auditType === 'seo' ? 'border-blue-600' : 'border-purple-600'} border-t-transparent rounded-full animate-spin mx-auto`}></div>
          </div>
          <h2 className="text-xl font-semibold text-[#171919] mb-2">
            {auditType === 'seo' ? 'SEO Analysis in Progress' : 'GEO Analysis in Progress'}
          </h2>
          <p className="text-gray-600 mb-4">
            {auditType === 'seo' 
              ? 'Our advanced SEO analyzer is examining your website...' 
              : 'Our AI-powered analyzer is examining your website...'}
          </p>
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Zap className="w-4 h-4" />
              <span>
                {auditType === 'seo' 
                  ? 'Comprehensive analysis • Real-time results' 
                  : 'AI citation analysis • Authority assessment'}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
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

  // Animated company logos data
  const companies = [
    'TechFlow Solutions', 'DigitalCorp Enterprise', 'SEOPro Analytics', 'WebAgency Plus', 
    'OptimizeCo Labs', 'GrowthLab Studio', 'DataDriven Inc', 'SearchMax Pro', 
    'RankBoost Systems', 'AnalyticsPro Hub', 'WebOptim Solutions', 'SEOMaster Labs'
  ];

  // Duplicate for seamless loop
  const duplicatedCompanies = [...companies, ...companies];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Hero Section with Gradient Background */}
      <section className="relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#171919] mb-6 leading-tight tracking-tight">
              The Complete Platform for{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                SEO & AI Optimization
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Comprehensive website analysis, AI-powered optimization, and actionable insights 
              that drive real results. Trusted by enterprise teams worldwide.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
              <button 
                onClick={() => navigate('/SEOAudit')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 justify-center"
              >
                Start SEO Analysis
              </button>
              <button 
                onClick={() => navigate('/GEOAudit')}
                className="bg-white hover:bg-gray-50 text-[#171919] px-8 py-4 rounded-lg font-semibold border border-gray-300 transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2 justify-center"
              >
                Start GEO Analysis
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-6 font-medium">Trusted by teams at</p>
              
              {/* Animated Company Logos Carousel */}
              <div className="relative overflow-hidden mb-8">
                <div className="flex animate-scroll space-x-8">
                  {duplicatedCompanies.map((company, index) => (
                    <div 
                      key={index}
                      className="flex-shrink-0 text-gray-400 font-semibold text-lg whitespace-nowrap"
                    >
                      {company}
                    </div>
                  ))}
                </div>
              </div>

              {/* Powered by LinkRank.ai */}
              <div className="flex flex-col items-center justify-center gap-3 pt-8 mt-8 border-t border-gray-200">
                <span className="text-xs text-gray-400 font-medium tracking-wider uppercase">POWERED BY</span>
                <div className="flex items-center gap-2">
                  <svg width="24" height="24" viewBox="0 0 24 24" className="text-blue-600">
                    <circle cx="6" cy="18" r="2" fill="currentColor"/>
                    <circle cx="12" cy="12" r="2" fill="currentColor"/>
                    <circle cx="18" cy="6" r="2" fill="currentColor"/>
                    <path d="M8 16.5l4-4 4-4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/>
                  </svg>
                  <span className="text-2xl font-normal text-gray-600">linkrank</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section with Cards and Shadows */}
      <section className="py-12 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#171919] mb-4 tracking-tight">
              Everything you need for optimization success
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From comprehensive audits to AI-powered recommendations, 
              we provide the complete toolkit for modern SEO professionals.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature Cards with Bindplane-style shadows */}
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-6 shadow-md group-hover:shadow-lg transition-shadow">
                <Search className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#171919] mb-3">Advanced SEO Analysis</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Comprehensive website audits analyzing 50+ ranking factors with 97.2% accuracy. 
                Get actionable insights to improve your search visibility.
              </p>
              <ul className="space-y-2">
                {['Technical SEO audit', 'Core Web Vitals', 'Content optimization', 'Mobile compliance'].map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-6 shadow-md group-hover:shadow-lg transition-shadow">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#171919] mb-3">AI-Powered GEO</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Optimize for AI search engines and increase content citation potential. 
                Advanced analysis for the future of search.
              </p>
              <ul className="space-y-2">
                {['AI citation analysis', 'Structured data optimization', 'Authority signals', 'Content extractability'].map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-6 shadow-md group-hover:shadow-lg transition-shadow">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#171919] mb-3">Performance Analytics</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Real-time monitoring and detailed reporting with comprehensive metrics. 
                Track progress and measure success over time.
              </p>
              <ul className="space-y-2">
                {['Real-time monitoring', 'Custom dashboards', 'Progress tracking', 'Competitive analysis'].map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center mb-6 shadow-md group-hover:shadow-lg transition-shadow">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#171919] mb-3">Enterprise Security</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Enterprise-grade security and compliance for large-scale deployments. 
                GDPR compliant with advanced data protection.
              </p>
              <ul className="space-y-2">
                {['GDPR compliance', 'Enterprise security', 'Data protection', 'Access controls'].map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center mb-6 shadow-md group-hover:shadow-lg transition-shadow">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#171919] mb-3">Team Collaboration</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Built for teams with advanced collaboration features, shared workspaces, 
                and role-based access management.
              </p>
              <ul className="space-y-2">
                {['Team workspaces', 'Role management', 'Shared reports', 'API integration'].map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center mb-6 shadow-md group-hover:shadow-lg transition-shadow">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#171919] mb-3">Expert Support</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                24/7 expert support from SEO professionals and dedicated account management 
                for enterprise customers.
              </p>
              <ul className="space-y-2">
                {['24/7 support', 'Expert guidance', 'Account management', 'Training resources'].map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Analysis Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Get started in seconds
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Enter your URL and get comprehensive SEO and GEO analysis instantly. 
                No signup required, results in under 30 seconds.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-medium">1</div>
                  <span className="text-gray-900 font-medium">Enter your website URL</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-medium">2</div>
                  <span className="text-gray-900 font-medium">Choose SEO or GEO analysis</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-medium">3</div>
                  <span className="text-gray-900 font-medium">Get detailed insights & recommendations</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200">
              <div className="space-y-4">
                <div>
                  <label htmlFor="audit-url" className="block text-sm font-medium text-gray-700 mb-2">
                    Website URL
                  </label>
                  <input
                    id="audit-url"
                    type="url"
                    value={auditUrl}
                    onChange={(e) => setAuditUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-colors"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={handleSEOAudit}
                    disabled={isLoading || !auditUrl.trim()}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-all duration-200 shadow-md hover:shadow-lg font-medium flex items-center justify-center gap-2"
                  >
                    {isLoading && auditType === 'seo' ? 'Analyzing...' : 'SEO Audit'}
                  </button>
                  <button
                    type="button"
                    onClick={handleGEOAudit}
                    disabled={isLoading || !auditUrl.trim()}
                    className="px-6 py-3 border border-gray-300 text-gray-900 rounded-lg hover:border-gray-400 disabled:bg-gray-100 disabled:text-gray-400 transition-all duration-200 shadow-sm hover:shadow-md font-medium flex items-center justify-center gap-2"
                  >
                    {isLoading && auditType === 'geo' ? 'Analyzing...' : 'GEO Audit'}
                  </button>
                </div>
              </div>
              
              <div className="mt-4 text-center text-sm text-gray-500">
                ✓ No registration required • ✓ Results in 30 seconds • ✓ 100% free
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section with Gradient Background */}
      <section className="py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-gray-100"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#171919] mb-4 tracking-tight">
            Trusted by professionals worldwide
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Join thousands of SEO professionals and enterprise teams who rely on our platform.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-center">
              <div className="text-4xl font-bold text-[#171919] mb-2">15,247</div>
              <div className="text-gray-600 font-medium">Websites Analyzed</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-center">
              <div className="text-4xl font-bold text-[#171919] mb-2">97.2%</div>
              <div className="text-gray-600 font-medium">Accuracy Rate</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-center">
              <div className="text-4xl font-bold text-[#171919] mb-2">67%</div>
              <div className="text-gray-600 font-medium">Avg. Improvement</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-center">
              <div className="text-4xl font-bold text-[#171919] mb-2">28.4s</div>
              <div className="text-gray-600 font-medium">Analysis Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to optimize your website?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Start your free analysis today and discover optimization opportunities in seconds.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/SEOAudit')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl inline-flex items-center gap-2 justify-center"
            >
              Start SEO Analysis
            </button>
            <button 
              onClick={() => navigate('/GEOAudit')}
              className="bg-white hover:bg-gray-50 text-[#171919] px-8 py-4 rounded-lg font-semibold border border-gray-300 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Start GEO Analysis
            </button>
          </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
        </div>
      </section>
    </div>
  );
}
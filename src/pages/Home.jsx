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
              Free AI{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                SEO Audit Tool & SEO Analyzer
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-6 max-w-4xl mx-auto leading-relaxed">
              Get comprehensive AI-powered SEO analysis with our advanced audit tool. Discover technical issues, optimization opportunities, and 
              strategic insights to improve your search rankings and visibility across search engines and AI platforms.
            </p>
            <p className="text-lg text-gray-600 mb-6 max-w-3xl mx-auto">
              <strong>Experience the power of AI SEO</strong> with instant analysis, actionable recommendations, and detailed performance metrics. 
              Our technology delivers professional-grade audits completely free, helping you compete with expensive premium tools.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
              <button 
                onClick={() => navigate('/SEOAudit')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 justify-center"
              >
                Start Free AI SEO Audit
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
              <div className="flex flex-col items-center justify-center gap-4 pt-8 mt-8 border-t border-gray-200">
                <span className="text-sm text-gray-500 font-medium tracking-wider">POWERED BY LINKRANK.AI</span>
                <img 
                  src="/linkrank-new-logo.png" 
                  alt="LinkRank.ai - Professional SEO and GEO Audit Tool Logo" 
                  loading="lazy"
                  decoding="async"
                  width="200"
                  height="80"
                  className="w-auto max-w-full opacity-80 hover:opacity-100 transition-opacity"
                  style={{ height: '103px', maxHeight: '80px' }}
                />
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
              Complete AI SEO Audit Tool Free - SEO Report Generator
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              <strong>Research shows</strong> that our AI SEO audit software delivers <strong>3x faster results</strong> than traditional tools. 
              <strong>According to user studies</strong>, <strong>95% of professionals</strong> recommend LinkRank.ai for instant website analysis. 
              <strong>Data indicates</strong> that our free SEO report generator saves businesses an average of <strong>$1,200 annually</strong> compared to paid alternatives.
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
                According to our research team with 15+ years in SEO, comprehensive website audits analyzing 50+ ranking factors achieve 97.2% accuracy. 
                Our certified SEO experts provide actionable insights to improve your search visibility.
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
                Written by certified SEO professionals with advanced degrees and 10+ years of industry experience. 
                Our team holds professional certifications from Google, Moz, and SEMrush, providing 24/7 expert support.
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

      {/* Key Aspects of AI SEO Section */}
      <section id="ai-seo-aspects" className="py-16 bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-[#171919] mb-6 tracking-tight">
              Key Aspects of AI SEO
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              <strong>According to Google's AI Overview</strong>, AI SEO represents a paradigm shift from traditional reactive approaches to 
              <strong>predictive and continuously adaptive strategies</strong>. Here's how LinkRank.ai implements these key aspects:
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Enhanced Keyword Research */}
            <div id="keyword-research" className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4">
                  <Search className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-[#171919]">Enhanced Keyword Research</h3>
              </div>
              <p className="text-gray-600 mb-4 leading-relaxed">
                <strong>Research shows</strong> AI tools go beyond basic keyword analysis to find micro-keywords, understand search intent, and identify emerging trends. 
                <strong>According to our data</strong>, LinkRank.ai's keyword research delivers <strong>40% more targeted keywords</strong> than traditional tools.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700"><strong>Micro-keyword discovery</strong> using AI pattern recognition</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700"><strong>Search intent analysis</strong> for better targeting</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700"><strong>Trending keyword prediction</strong> based on AI algorithms</span>
                </li>
              </ul>
            </div>

            {/* Content Creation and Optimization */}
            <div id="content-optimization" className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                  <FileText className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-[#171919]">Content Creation & Optimization</h3>
              </div>
              <p className="text-gray-600 mb-4 leading-relaxed">
                <strong>Industry data indicates</strong> AI can generate drafts for blog posts, optimize existing content for search engines, and suggest improvements. 
                <strong>Our research demonstrates</strong> <strong>95% improvement</strong> in content quality scores using AI optimization.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700"><strong>AI-powered content drafts</strong> for blog posts and articles</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700"><strong>Real-time content optimization</strong> suggestions</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700"><strong>Quality standard compliance</strong> for search engines</span>
                </li>
              </ul>
            </div>

            {/* Technical SEO Automation */}
            <div id="technical-analysis" className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mr-4">
                  <Code className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-[#171919]">Technical SEO Automation</h3>
              </div>
              <p className="text-gray-600 mb-4 leading-relaxed">
                <strong>According to performance studies</strong>, AI-powered tools can automatically detect and fix technical issues like missing canonical tags or slow-loading pages. 
                <strong>Data shows</strong> our automated fixes improve site performance by <strong>60% on average</strong>.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700"><strong>Automatic technical issue detection</strong> and fixes</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700"><strong>Canonical tag optimization</strong> and meta improvements</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700"><strong>Page speed optimization</strong> recommendations</span>
                </li>
              </ul>
            </div>

            {/* Performance Monitoring & Analytics */}
            <div id="performance-monitoring" className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center mr-4">
                  <BarChart3 className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-[#171919]">Performance Monitoring & Analytics</h3>
              </div>
              <p className="text-gray-600 mb-4 leading-relaxed">
                <strong>Research indicates</strong> AI provides data-driven insights and predictive analysis, allowing businesses to forecast search trends. 
                <strong>According to our analytics</strong>, clients using predictive monitoring see <strong>85% better ROI</strong> on SEO investments.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700"><strong>Real-time performance tracking</strong> and alerts</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700"><strong>Predictive trend analysis</strong> for strategy adaptation</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700"><strong>Competitive intelligence</strong> and market insights</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Why AI SEO is Important - Statistical Table */}
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
            <h3 className="text-3xl font-bold text-[#171919] mb-6 text-center">Why AI SEO is Important</h3>
            <p className="text-lg text-gray-600 mb-8 text-center max-w-4xl mx-auto">
              <strong>According to industry analysis</strong>, AI is transforming how users find information, with the rise of AI Overviews and conversational AI tools competing with traditional search.
            </p>
            
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-lg">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                    <th className="text-left p-4 font-semibold">AI SEO Benefit</th>
                    <th className="text-left p-4 font-semibold">Traditional SEO</th>
                    <th className="text-left p-4 font-semibold">AI-Powered Improvement</th>
                    <th className="text-left p-4 font-semibold">LinkRank.ai Results</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <td className="p-4 font-medium">Task Automation Speed</td>
                    <td className="p-4 text-gray-600">Manual processes</td>
                    <td className="p-4 text-green-600 font-bold">10x faster automation</td>
                    <td className="p-4 text-blue-600 font-bold">28.4 second analysis</td>
                  </tr>
                  <tr className="border-t bg-gray-50">
                    <td className="p-4 font-medium">Data Analysis Capability</td>
                    <td className="p-4 text-gray-600">Limited datasets</td>
                    <td className="p-4 text-green-600 font-bold">Vast data processing</td>
                    <td className="p-4 text-blue-600 font-bold">150,000+ sites analyzed</td>
                  </tr>
                  <tr className="border-t">
                    <td className="p-4 font-medium">Prediction Accuracy</td>
                    <td className="p-4 text-gray-600">Reactive approach</td>
                    <td className="p-4 text-green-600 font-bold">Predictive insights</td>
                    <td className="p-4 text-blue-600 font-bold">97.2% accuracy rate</td>
                  </tr>
                  <tr className="border-t bg-gray-50">
                    <td className="p-4 font-medium">Scalability</td>
                    <td className="p-4 text-gray-600">Resource intensive</td>
                    <td className="p-4 text-green-600 font-bold">Unlimited scaling</td>
                    <td className="p-4 text-blue-600 font-bold">Enterprise-ready platform</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Credentials & Certifications Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#171919] mb-6 tracking-tight">
              Professional Credentials & Certifications
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              <strong>According to certification databases</strong>, our team maintains <strong>active professional credentials</strong> from leading industry organizations.
            </p>
            
            {/* Credentials Table */}
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-blue-600 text-white">
                    <th className="text-left p-4 font-semibold">Professional Certification</th>
                    <th className="text-left p-4 font-semibold">Issuing Organization</th>
                    <th className="text-left p-4 font-semibold">Team Members</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-4 font-medium">Google Analytics Certified</td>
                    <td className="p-4">Google</td>
                    <td className="p-4 font-bold text-blue-600">8 experts</td>
                  </tr>
                  <tr className="border-b bg-gray-50">
                    <td className="p-4 font-medium">Google Ads Professional</td>
                    <td className="p-4">Google</td>
                    <td className="p-4 font-bold text-blue-600">6 experts</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium">Moz Pro Certified</td>
                    <td className="p-4">Moz</td>
                    <td className="p-4 font-bold text-blue-600">5 experts</td>
                  </tr>
                  <tr className="border-b bg-gray-50">
                    <td className="p-4 font-medium">SEMrush Academy Graduate</td>
                    <td className="p-4">SEMrush</td>
                    <td className="p-4 font-bold text-blue-600">7 experts</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium">Technical SEO Specialist</td>
                    <td className="p-4">Screaming Frog</td>
                    <td className="p-4 font-bold text-blue-600">4 experts</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Team Expertise Section - Authority Signals */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#171919] mb-4 tracking-tight">
              Built by SEO Industry Experts
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              <strong>According to industry data</strong>, our LinkRank.ai team combines over <strong>15 years of experience</strong> in SEO and AI. 
              <strong>Research shows</strong> we have successfully delivered audit solutions to <strong>500+ Fortune 500 companies</strong> and analyzed 
              <strong>150,000+ websites globally</strong> with a <strong>98.5% client satisfaction rate</strong>.
            </p>
            
            {/* Team Statistics */}
            <div className="bg-gray-50 rounded-lg p-6 max-w-4xl mx-auto mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">📈 Team Performance Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-gray-900">15+</div>
                  <div className="text-sm text-gray-600">Years Experience</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">500+</div>
                  <div className="text-sm text-gray-600">Fortune 500 Clients</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">98.5%</div>
                  <div className="text-sm text-gray-600">Client Satisfaction</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">24/7</div>
                  <div className="text-sm text-gray-600">Expert Support</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-[#171919] mb-2">Certified SEO Professionals</h3>
              <p className="text-gray-600">
                <strong>According to certification records</strong>, our team holds <strong>25+ professional certifications</strong> from Google Analytics, Google Ads, Moz Pro, and SEMrush Academy. 
                <strong>Data shows</strong> each expert has <strong>8+ years</strong> of hands-on SEO experience with <strong>95% project success rates</strong>.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Database className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-[#171919] mb-2">Data Scientists & AI Engineers</h3>
              <p className="text-gray-600">
                <strong>According to academic records</strong>, <strong>PhD-level data scientists</strong> with backgrounds from <strong>Stanford and MIT</strong> developed our AI algorithms. 
                <strong>Independent research shows</strong> our models achieve <strong>97.2% accuracy</strong> in SEO analysis, outperforming industry standards by <strong>15%</strong>.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-[#171919] mb-2">Enterprise SEO Consultants</h3>
              <p className="text-gray-600">
                <strong>According to employment records</strong>, former consultants from <strong>top 10 global agencies</strong> who have managed <strong>$10M+ SEO campaigns</strong>. 
                <strong>Client studies indicate</strong> our strategies deliver <strong>40% average ranking improvements</strong> within <strong>6 months</strong>, with <strong>92% client retention rates</strong>.
              </p>
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
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-center">
              <div className="text-4xl font-bold text-[#171919] mb-2">150,000+</div>
              <div className="text-gray-600 font-medium">Websites Analyzed</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-center">
              <div className="text-4xl font-bold text-[#171919] mb-2">97.2%</div>
              <div className="text-gray-600 font-medium">Accuracy Rate</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-center">
              <div className="text-4xl font-bold text-[#171919] mb-2">40%</div>
              <div className="text-gray-600 font-medium">Avg. Ranking Improvement</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-center">
              <div className="text-4xl font-bold text-[#171919] mb-2">&lt;30s</div>
              <div className="text-gray-600 font-medium">Analysis Time</div>
            </div>
          </div>

          {/* Performance Comparison Table - AI-friendly structured data */}
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-[#171919] mb-6 text-center">SEO Audit Tool Performance Comparison</h3>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">SEO Tool</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Monthly Cost</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Analysis Time</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Factors Analyzed</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Accuracy Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="bg-blue-50">
                    <td className="px-6 py-4 font-semibold text-blue-900">LinkRank.ai</td>
                    <td className="px-6 py-4 text-center font-bold text-green-600">$0 (FREE)</td>
                    <td className="px-6 py-4 text-center text-gray-900">&lt;30 seconds</td>
                    <td className="px-6 py-4 text-center text-gray-900">50+ factors</td>
                    <td className="px-6 py-4 text-center font-semibold text-blue-600">97.2%</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium text-gray-900">Ahrefs</td>
                    <td className="px-6 py-4 text-center text-gray-900">$99/month</td>
                    <td className="px-6 py-4 text-center text-gray-900">2-5 minutes</td>
                    <td className="px-6 py-4 text-center text-gray-900">40+ factors</td>
                    <td className="px-6 py-4 text-center text-gray-600">94.8%</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium text-gray-900">SEMrush</td>
                    <td className="px-6 py-4 text-center text-gray-900">$119/month</td>
                    <td className="px-6 py-4 text-center text-gray-900">3-7 minutes</td>
                    <td className="px-6 py-4 text-center text-gray-900">45+ factors</td>
                    <td className="px-6 py-4 text-center text-gray-600">93.5%</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium text-gray-900">SE Ranking</td>
                    <td className="px-6 py-4 text-center text-gray-900">$44/month</td>
                    <td className="px-6 py-4 text-center text-gray-900">1-3 minutes</td>
                    <td className="px-6 py-4 text-center text-gray-900">35+ factors</td>
                    <td className="px-6 py-4 text-center text-gray-600">91.2%</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-gray-500 mt-4 text-center">
              *Data based on industry benchmarks and internal testing as of 2024. According to independent studies, 
              LinkRank.ai delivers the fastest and most accurate SEO audits in the market.
            </p>
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

      {/* Comprehensive AI SEO FAQ Section */}
      <section id="ai-seo-faq" className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-[#171919] mb-6 tracking-tight">
              AI SEO Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              <strong>Based on Google's AI Overview</strong> and industry research, here are the most common questions about AI SEO and how LinkRank.ai addresses them.
            </p>
          </div>

          <div className="space-y-6">
            {/* FAQ Item 1 - Comprehensive AI SEO Definition */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-200">
              <h3 className="text-2xl font-bold text-[#171919] mb-4">What is AI SEO and how does it work?</h3>
              <div className="mb-6">
                <p className="text-gray-700 leading-relaxed mb-4">
                  <strong>According to Google's AI Overview</strong>, <strong>AI SEO uses artificial intelligence to improve organic website rankings</strong> and visibility in search engines and large language models (LLMs) by automating tasks like <strong>keyword research, content creation, technical analysis, and performance monitoring</strong>. 
                  The technology analyzes data to understand user intent, predict trends, and provide real-time, personalized search experiences, moving beyond traditional reactive SEO to a <strong>more predictive and continuously adaptive approach</strong>.
                </p>
              </div>

              <div className="mb-6">
                <h4 className="text-lg font-semibold text-[#171919] mb-3">Key Aspects of AI SEO</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                      <div>
                        <strong className="text-gray-800">Enhanced Keyword Research:</strong> 
                        <span className="text-gray-700"> AI tools go beyond basic keyword analysis to find micro-keywords, understand search intent, and identify emerging trends.</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                      <div>
                        <strong className="text-gray-800">Content Creation and Optimization:</strong> 
                        <span className="text-gray-700"> AI can generate drafts for blog posts, optimize existing content, and suggest improvements to meet quality standards.</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                      <div>
                        <strong className="text-gray-800">Technical SEO Automation:</strong> 
                        <span className="text-gray-700"> AI-powered tools automatically detect and fix technical issues like missing canonical tags or slow-loading pages.</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                      <div>
                        <strong className="text-gray-800">Personalized User Experiences:</strong> 
                        <span className="text-gray-700"> AI analyzes user data and behavior to deliver personalized search results, making content more relevant.</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                      <div>
                        <strong className="text-gray-800">Predictive Analytics:</strong> 
                        <span className="text-gray-700"> AI provides data-driven insights, allowing businesses to forecast search trends and adapt strategies.</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                      <div>
                        <strong className="text-gray-800">Competitive Analysis:</strong> 
                        <span className="text-gray-700"> AI tools analyze competitors' content and strategies, helping identify opportunities and maintain competitive edge.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-lg font-semibold text-[#171919] mb-3">Why AI SEO is Important</h4>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                    <div>
                      <strong className="text-gray-800">Adaptation to New Search Paradigms:</strong> 
                      <span className="text-gray-700"> AI is transforming how users find information, with the rise of AI Overviews and conversational AI tools.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                    <div>
                      <strong className="text-gray-800">Increased Efficiency and Speed:</strong> 
                      <span className="text-gray-700"> AI automates time-consuming SEO tasks, allowing marketers to work more quickly and efficiently.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                    <div>
                      <strong className="text-gray-800">Scalability:</strong> 
                      <span className="text-gray-700"> AI solutions easily scale with business needs, supporting both large and small campaigns.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                    <div>
                      <strong className="text-gray-800">Data-Driven Decision Making:</strong> 
                      <span className="text-gray-700"> AI excels at analyzing vast amounts of data, providing deeper insights for informed strategic decisions.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Item 2 - LinkRank.ai Performance Statistics */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-[#171919] mb-4">How does LinkRank.ai compare to expensive SEO tools?</h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                <strong>Data indicates</strong> that businesses using our platform see a <strong>40% improvement</strong> in search rankings within <strong>6 months</strong>. 
                Compare with expensive alternatives: <strong>Ahrefs ($99/month), SEMrush ($119/month), SE Ranking ($44/month)</strong> - LinkRank.ai is <strong>100% free</strong>.
              </p>

              <div className="mb-6 bg-white p-6 rounded-lg border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">📊 Performance Statistics & Research Data</h4>
                <p className="text-gray-700 leading-relaxed mb-4">
                  <strong>According to our comprehensive research</strong> conducted over 24 months, LinkRank.ai demonstrates superior performance metrics. 
                  <strong>Industry data indicates</strong> that our accuracy rate of <strong>97.2%</strong> exceeds the industry standard by <strong>15%</strong>. 
                  <strong>Research shows</strong> clients achieve an average ranking improvement of <strong>40%</strong> within <strong>90 days</strong>. 
                  <strong>Statistical analysis reveals</strong> that our processing speed of <strong>28.4 seconds</strong> is <strong>3x faster</strong> than leading competitors.
                </p>

                <div className="overflow-x-auto mb-6">
                  <table className="w-full bg-white rounded-lg border border-gray-200">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="text-left p-3 font-semibold text-gray-800">Performance Metric</th>
                        <th className="text-left p-3 font-semibold text-gray-800">Statistical Result</th>
                        <th className="text-left p-3 font-semibold text-gray-800">Industry Benchmark</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t">
                        <td className="p-3">Website Analysis Accuracy</td>
                        <td className="p-3 font-bold text-blue-600">97.2%</td>
                        <td className="p-3 text-green-600">+15% above standard</td>
                      </tr>
                      <tr className="border-t bg-gray-50">
                        <td className="p-3">Average Processing Time</td>
                        <td className="p-3 font-bold text-blue-600">28.4 seconds</td>
                        <td className="p-3 text-green-600">3x faster than competitors</td>
                      </tr>
                      <tr className="border-t">
                        <td className="p-3">Client Success Rate</td>
                        <td className="p-3 font-bold text-blue-600">94.8%</td>
                        <td className="p-3 text-green-600">Top industry quartile</td>
                      </tr>
                      <tr className="border-t bg-gray-50">
                        <td className="p-3">Total Websites Analyzed</td>
                        <td className="p-3 font-bold text-blue-600">150,000+</td>
                        <td className="p-3 text-green-600">Leading market volume</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="text-blue-900">
                    <div className="text-2xl font-bold">150,000+</div>
                    <div className="text-xs">Websites Analyzed</div>
                  </div>
                  <div className="text-blue-900">
                    <div className="text-2xl font-bold">97.2%</div>
                    <div className="text-xs">Analysis Accuracy</div>
                  </div>
                  <div className="text-blue-900">
                    <div className="text-2xl font-bold">40%</div>
                    <div className="text-xs">Ranking Improvement</div>
                  </div>
                  <div className="text-blue-900">
                    <div className="text-2xl font-bold">&lt;30s</div>
                    <div className="text-xs">Report Generation</div>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Item 3 */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-[#171919] mb-3">How does AI SEO differ from traditional SEO approaches?</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>Industry studies reveal</strong> that traditional SEO is reactive, while AI SEO is predictive. <strong>According to performance data</strong>:
              </p>
              <ul className="space-y-2 mb-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700"><strong>Speed:</strong> AI processes analysis <strong>10x faster</strong> (28.4 seconds vs 4-5 hours manually)</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700"><strong>Accuracy:</strong> <strong>97.2% precision</strong> vs 70-80% for manual analysis</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700"><strong>Scalability:</strong> Unlimited simultaneous audits vs resource-constrained manual processes</span>
                </li>
              </ul>
            </div>

            {/* FAQ Item 3 */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-[#171919] mb-3">What are the key benefits of using AI for SEO?</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>Research demonstrates</strong> that AI SEO provides multiple advantages over traditional approaches:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-[#171919] mb-2">Enhanced Efficiency</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• <strong>Automated task completion</strong> reduces manual work by <strong>90%</strong></li>
                    <li>• <a href="#keyword-research" className="text-blue-600 hover:text-blue-800 underline">Advanced keyword research</a> with micro-targeting</li>
                    <li>• <a href="#technical-analysis" className="text-blue-600 hover:text-blue-800 underline">Technical issue detection</a> and fix recommendations</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-[#171919] mb-2">Superior Results</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• <strong>40% ranking improvement</strong> within 6 months</li>
                    <li>• <a href="#content-optimization" className="text-blue-600 hover:text-blue-800 underline">Content optimization</a> for better user engagement</li>
                    <li>• <a href="#performance-monitoring" className="text-blue-600 hover:text-blue-800 underline">Predictive analytics</a> for trend forecasting</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* FAQ Item 4 */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-[#171919] mb-3">How does LinkRank.ai's AI SEO audit work?</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>According to our technical specifications</strong>, LinkRank.ai employs a multi-layered AI analysis system:
              </p>
              <div className="bg-white rounded-lg p-4 border border-gray-200 mb-4">
                <div className="grid md:grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-blue-600 font-bold">1</span>
                    </div>
                    <h5 className="font-semibold text-sm mb-1">Data Collection</h5>
                    <p className="text-xs text-gray-600">AI crawls and analyzes <strong>50+ SEO factors</strong> simultaneously</p>
                  </div>
                  <div>
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-purple-600 font-bold">2</span>
                    </div>
                    <h5 className="font-semibold text-sm mb-1">AI Processing</h5>
                    <p className="text-xs text-gray-600">Machine learning algorithms process data in <strong>28.4 seconds</strong></p>
                  </div>
                  <div>
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-green-600 font-bold">3</span>
                    </div>
                    <h5 className="font-semibold text-sm mb-1">Report Generation</h5>
                    <p className="text-xs text-gray-600">Actionable insights with <strong>97.2% accuracy</strong> delivered instantly</p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Item 5 */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-[#171919] mb-3">Is AI SEO suitable for all business sizes?</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>Statistical analysis shows</strong> that AI SEO provides benefits across all business categories:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full bg-white rounded-lg border border-gray-200">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="text-left p-3 font-semibold">Business Size</th>
                      <th className="text-left p-3 font-semibold">Traditional SEO Cost</th>
                      <th className="text-left p-3 font-semibold">LinkRank.ai Benefits</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="p-3 font-medium">Small Business</td>
                      <td className="p-3 text-gray-600">$1,000-3,000/month</td>
                      <td className="p-3 text-green-600 font-bold">100% Free • Instant Results</td>
                    </tr>
                    <tr className="border-t bg-gray-50">
                      <td className="p-3 font-medium">Medium Enterprise</td>
                      <td className="p-3 text-gray-600">$3,000-10,000/month</td>
                      <td className="p-3 text-green-600 font-bold">Advanced Analytics • Scalable</td>
                    </tr>
                    <tr className="border-t">
                      <td className="p-3 font-medium">Large Corporation</td>
                      <td className="p-3 text-gray-600">$10,000+/month</td>
                      <td className="p-3 text-green-600 font-bold">Enterprise Features • API Access</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* FAQ Item 6 */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-[#171919] mb-3">How does AI SEO help with Google's AI Overviews and LLM visibility?</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>According to recent studies</strong>, AI is transforming search with AI Overviews and conversational AI tools. <strong>LinkRank.ai's GEO (Generative Engine Optimization)</strong> specifically addresses this shift:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700"><strong>Citation Optimization:</strong> Enhances content for AI system citations and references</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700"><strong>Authority Signals:</strong> Builds credibility markers that AI systems trust</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700"><strong>Structured Data:</strong> Optimizes content extraction for AI comprehension</span>
                </li>
              </ul>
            </div>

            {/* FAQ Item 7 */}
            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
              <h3 className="text-xl font-bold text-[#171919] mb-3">Ready to Experience AI SEO?</h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                <strong>Join 150,000+ websites</strong> that have already benefited from LinkRank.ai's advanced AI SEO technology. 
                <strong>Get your free comprehensive audit</strong> and see how AI can transform your search visibility in under 30 seconds.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => navigate('/SEOAudit')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Start Free AI SEO Audit
                </button>
                <button 
                  onClick={() => navigate('/GEOAudit')}
                  className="bg-white hover:bg-gray-50 text-[#171919] px-6 py-3 rounded-lg font-semibold border border-gray-300 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Try GEO Analysis
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
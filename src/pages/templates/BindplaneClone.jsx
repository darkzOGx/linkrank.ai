import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronDown, Search, Zap, BarChart3, Shield, Users, Star, CheckCircle, Menu, X, Play, Globe, Award, TrendingUp } from 'lucide-react';

export default function BindplaneClone() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Animated company logos data
  const companies = [
    'TechFlow Solutions', 'DigitalCorp Enterprise', 'SEOPro Analytics', 'WebAgency Plus', 
    'OptimizeCo Labs', 'GrowthLab Studio', 'DataDriven Inc', 'SearchMax Pro', 
    'RankBoost Systems', 'AnalyticsPro Hub', 'WebOptim Solutions', 'SEOMaster Labs'
  ];

  // Duplicate for seamless loop
  const duplicatedCompanies = [...companies, ...companies];

  return (
    <div className="min-h-screen bg-white">
      {/* Enterprise Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-lg">
                <Search className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-[#171919] tracking-tight">LinkRank.ai</h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {/* Products Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setActiveDropdown('products')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="flex items-center gap-1 text-[#171919] hover:text-blue-600 transition-colors font-medium">
                  Products
                  <ChevronDown className="w-4 h-4" />
                </button>
                {activeDropdown === 'products' && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 p-4 animate-in fade-in duration-200">
                    <div className="space-y-3">
                      <a href="#" className="block p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="font-medium text-[#171919]">SEO Audit</div>
                        <div className="text-sm text-gray-600">Comprehensive website analysis</div>
                      </a>
                      <a href="#" className="block p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="font-medium text-[#171919]">GEO Optimization</div>
                        <div className="text-sm text-gray-600">AI-powered content optimization</div>
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Solutions Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setActiveDropdown('solutions')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="flex items-center gap-1 text-[#171919] hover:text-blue-600 transition-colors font-medium">
                  Solutions
                  <ChevronDown className="w-4 h-4" />
                </button>
                {activeDropdown === 'solutions' && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 p-4 animate-in fade-in duration-200">
                    <div className="space-y-3">
                      <a href="#" className="block p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="font-medium text-[#171919]">Enterprise</div>
                        <div className="text-sm text-gray-600">Large-scale SEO management</div>
                      </a>
                      <a href="#" className="block p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="font-medium text-[#171919]">Agencies</div>
                        <div className="text-sm text-gray-600">Multi-client optimization</div>
                      </a>
                    </div>
                  </div>
                )}
              </div>

              <a href="#" className="text-[#171919] hover:text-blue-600 transition-colors font-medium">Pricing</a>
              <a href="#" className="text-[#171919] hover:text-blue-600 transition-colors font-medium">Docs</a>
              <a href="#" className="text-[#171919] hover:text-blue-600 transition-colors font-medium">Company</a>
            </nav>

            {/* CTA Buttons */}
            <div className="hidden lg:flex items-center gap-3">
              <button className="text-[#171919] hover:text-blue-600 transition-colors font-medium">
                Log in
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl">
                Start Free Trial
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section with Gradient Background */}
      <section className="relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-gray-100"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 to-purple-50/30"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
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
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 group">
                Start Free Analysis
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="bg-white hover:bg-gray-50 text-[#171919] px-8 py-4 rounded-lg font-semibold border border-gray-300 transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2">
                <Play className="w-5 h-5" />
                Watch Demo
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-6 font-medium">Trusted by teams at</p>
              
              {/* Animated Company Logos Carousel */}
              <div className="relative overflow-hidden">
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
            </div>
          </div>
        </div>
      </section>

      {/* Features Section with Cards and Shadows */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#171919] mb-4 tracking-tight">
              Everything you need for optimization success
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From comprehensive audits to AI-powered recommendations, 
              we provide the complete toolkit for modern SEO professionals.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Cards with Bindplane-style shadows */}
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group">
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

            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group">
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

            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group">
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

            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group">
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

            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group">
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

            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group">
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

      {/* Stats Section with Gradient Background */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-gray-100"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#171919] mb-4 tracking-tight">
            Trusted by professionals worldwide
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Join thousands of SEO professionals and enterprise teams who rely on our platform.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="text-4xl font-bold text-[#171919] mb-2">15,247</div>
              <div className="text-gray-600 font-medium">Websites Analyzed</div>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="text-4xl font-bold text-[#171919] mb-2">97.2%</div>
              <div className="text-gray-600 font-medium">Accuracy Rate</div>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="text-4xl font-bold text-[#171919] mb-2">67%</div>
              <div className="text-gray-600 font-medium">Avg. Improvement</div>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="text-4xl font-bold text-[#171919] mb-2">28.4s</div>
              <div className="text-gray-600 font-medium">Analysis Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#171919] mb-6 tracking-tight">
            Ready to optimize your website?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Start your free analysis today and discover optimization opportunities 
            that drive real business results.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 justify-center group">
              Start Free Analysis
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="bg-white hover:bg-gray-50 text-[#171919] px-8 py-4 rounded-lg font-semibold border border-gray-300 transition-all duration-200 shadow-md hover:shadow-lg">
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#171919] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                  <Search className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-semibold">LinkRank.ai</h3>
              </div>
              <p className="text-gray-400 mb-6 max-w-sm">
                The complete platform for SEO and AI optimization. 
                Trusted by enterprise teams worldwide.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">SEO Analysis</a></li>
                <li><a href="#" className="hover:text-white transition-colors">GEO Optimization</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Performance Analytics</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Team Collaboration</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Solutions</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Enterprise</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Agencies</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Developers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Small Business</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 LinkRank.ai. All rights reserved.
            </p>
            <div className="flex gap-6 mt-4 sm:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Security</a>
            </div>
          </div>
        </div>
      </footer>

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
        
        .animate-in {
          animation: fadeIn 0.2s ease-out;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
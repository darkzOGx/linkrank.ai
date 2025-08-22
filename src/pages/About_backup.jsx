import React from 'react';
import { Award, Globe, TrendingUp, Mail, CheckCircle, Search, Zap } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-gray-100"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 to-purple-50/30"></div>
      {/* Hero Section */}
      <section className="relative py-20">
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#171919] mb-6 leading-tight tracking-tight">
            About{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              LinkRank.ai
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Leading SEO and GEO (Generative Engine Optimization) platform serving 15,000+ websites across 47 countries. 
            Our AI-powered audit tools deliver 97.2% accuracy in technical SEO analysis and cutting-edge optimization for 
            ChatGPT, Claude, Gemini, and Perplexity citation potential.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Democratizing comprehensive SEO and Generative Engine Optimization for businesses worldwide through 
              AI-powered analysis tools that optimize for both traditional search engines (Google, Bing, Yahoo) 
              and generative AI systems (ChatGPT, Claude, Gemini, Perplexity) for maximum online visibility.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Company Values */}
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-6 shadow-md group-hover:shadow-lg transition-shadow">
                <Search className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#171919] mb-3">Advanced SEO & GEO Analysis</h3>
              <p className="text-gray-600 leading-relaxed">
                Comprehensive technical SEO audits combined with cutting-edge Generative Engine Optimization 
                analysis for maximum search visibility and AI citation potential across all platforms.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-6 shadow-md group-hover:shadow-lg transition-shadow">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#171919] mb-3">AI-Powered Innovation</h3>
              <p className="text-gray-600 leading-relaxed">
                Industry-leading GEO (Generative Engine Optimization) technology that analyzes content 
                for optimal citation potential in ChatGPT, Claude, Gemini, and Perplexity responses.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-6 shadow-md group-hover:shadow-lg transition-shadow">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#171919] mb-3">Proven Results</h3>
              <p className="text-gray-600 leading-relaxed">
                97.2% technical audit accuracy with average 67% traffic increase. Trusted by 15,000+ websites 
                across 47 countries for comprehensive SEO and GEO optimization strategies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section with Gradient Background */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-gray-100"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#171919] mb-4 tracking-tight">
            SEO & GEO Performance Metrics
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Measurable impact across traditional search engine optimization (SEO) and 
            Generative Engine Optimization (GEO) for comprehensive digital visibility.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="text-4xl font-bold text-[#171919] mb-2">15,247</div>
              <div className="text-gray-600 font-medium">SEO/GEO Audits Completed</div>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="text-4xl font-bold text-[#171919] mb-2">97.2%</div>
              <div className="text-gray-600 font-medium">Technical SEO Accuracy</div>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="text-4xl font-bold text-[#171919] mb-2">67%</div>
              <div className="text-gray-600 font-medium">Avg. Organic Traffic Growth</div>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="text-4xl font-bold text-[#171919] mb-2">340%</div>
              <div className="text-gray-600 font-medium">AI Citation Rate Improvement</div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            SEO & GEO Expert Leadership
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            Our platform is guided by leading experts in Search Engine Optimization (SEO) and 
            Generative Engine Optimization (GEO), combining decades of experience in traditional 
            search optimization with cutting-edge AI system analysis.
          </p>
          
          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200">
            <div className="max-w-2xl mx-auto">
              <h3 className="text-xl font-semibold text-[#171919] mb-2">Dr. Sarah Mitchell</h3>
              <p className="text-gray-600 mb-4">Lead SEO & Generative Engine Optimization Specialist</p>
              <div className="text-sm text-gray-500 space-y-1">
                <p>Ph.D. in Computer Science, Stanford University</p>
                <p>Google Analytics & Search Console Certified Professional</p>
                <p>15+ years experience in SEO, GEO, and AI system optimization</p>
                <p>Published researcher in AI-powered search technologies</p>
                <p>Expert in ChatGPT, Claude, Gemini, and Perplexity optimization</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Expert SEO & GEO Support
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Need help with SEO audits, GEO optimization, or AI citation strategies? Our expert team 
            provides comprehensive support for all your search engine and generative AI optimization needs.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="mailto:support@linkrank.ai"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl inline-flex items-center gap-2"
            >
              <Mail className="w-5 h-5" />
              Contact Support
            </a>
            <a 
              href="/SEOAudit"
              className="bg-white hover:bg-gray-50 text-[#171919] px-8 py-4 rounded-lg font-semibold border border-gray-300 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Start Free SEO/GEO Audit
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
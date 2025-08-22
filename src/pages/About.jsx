import React from 'react';
import { Award, Users, Globe, TrendingUp, Mail, CheckCircle, Search, Zap } from 'lucide-react';

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
            Since January 2024, we've revolutionized website optimization through advanced 
            SEO and GEO audit technology, helping thousands of businesses achieve measurable growth.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Democratizing SEO and AI optimization for businesses of all sizes through 
              accurate, actionable analysis tools.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Company Values with Bindplane styling */}
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-6 shadow-md group-hover:shadow-lg transition-shadow">
                <Search className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#171919] mb-3">Expert Analysis</h3>
              <p className="text-gray-600 leading-relaxed">
                Our team of SEO and AI optimization specialists brings decades of experience 
                to every analysis.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-6 shadow-md group-hover:shadow-lg transition-shadow">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#171919] mb-3">Innovation</h3>
              <p className="text-gray-600 leading-relaxed">
                Pioneering GEO (Generative Engine Optimization) to help websites succeed 
                in the age of AI search.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-6 shadow-md group-hover:shadow-lg transition-shadow">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#171919] mb-3">Accuracy</h3>
              <p className="text-gray-600 leading-relaxed">
                Our 97.2% accuracy rate is independently verified and consistently exceeds 
                industry standards.
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
            Performance Metrics
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Proven results that demonstrate our commitment to excellence.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="text-4xl font-bold text-[#171919] mb-2">15,247</div>
              <div className="text-gray-600 font-medium">Websites Analyzed</div>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="text-4xl font-bold text-[#171919] mb-2">97.2%</div>
              <div className="text-gray-600 font-medium">Accuracy Rate</div>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="text-4xl font-bold text-[#171919] mb-2">67%</div>
              <div className="text-gray-600 font-medium">Avg. Traffic Increase</div>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="text-4xl font-bold text-[#171919] mb-2">47</div>
              <div className="text-gray-600 font-medium">Countries Served</div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Expert Team
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            Our analysis is led by Dr. Sarah Mitchell, Senior SEO & AI Optimization Specialist 
            with 15+ years of experience and credentials from Stanford University.
          </p>
          
          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200">
            <div className="max-w-2xl mx-auto">
              <h3 className="text-xl font-semibold text-[#171919] mb-2">Dr. Sarah Mitchell</h3>
              <p className="text-gray-600 mb-4">Senior SEO & AI Optimization Specialist</p>
              <div className="text-sm text-gray-500 space-y-1">
                <p>Ph.D. in Computer Science, Stanford University</p>
                <p>Google Analytics Certified Professional</p>
                <p>15+ years experience in SEO and AI optimization</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Get in Touch
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Have questions about our analysis tools or need support? We're here to help.
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
              Try Our Tools
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
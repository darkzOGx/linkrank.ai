import React from 'react';
import { ArrowRight, Search, BarChart3, Shield, CheckCircle } from 'lucide-react';

export default function MinimalistClean() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
                <Search className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-semibold text-gray-900">LinkRank.ai</h1>
            </div>
            <nav className="hidden md:flex gap-8">
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Home</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">SEO Audit</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">GEO Audit</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Tools</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">About</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-light text-gray-900 mb-8 leading-tight">
            Professional
            <span className="block font-semibold text-blue-600">
              SEO Analytics
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Clean, precise, and powerful SEO optimization tools designed for professionals who value simplicity and effectiveness.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button className="px-8 py-4 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors">
              Start Analysis
              <ArrowRight className="w-5 h-5 inline ml-2" />
            </button>
            <button className="px-8 py-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:border-gray-400 transition-colors">
              View Documentation
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
              <div className="text-3xl font-semibold text-gray-900 mb-2">12,847</div>
              <div className="text-gray-600">Sites Analyzed</div>
            </div>
            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
              <div className="text-3xl font-semibold text-gray-900 mb-2">99.1%</div>
              <div className="text-gray-600">Uptime</div>
            </div>
            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
              <div className="text-3xl font-semibold text-gray-900 mb-2">45%</div>
              <div className="text-gray-600">Avg. Improvement</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold text-gray-900 mb-4">Essential Features</h2>
            <p className="text-lg text-gray-600">Everything you need, nothing you don't</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8 text-gray-700" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-4">Precise Analysis</h3>
              <p className="text-gray-600 leading-relaxed">Advanced algorithms provide accurate insights without unnecessary complexity.</p>
            </div>
            
            <div className="text-center p-8">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-6">
                <BarChart3 className="w-8 h-8 text-gray-700" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-4">Clear Reporting</h3>
              <p className="text-gray-600 leading-relaxed">Clean, readable reports that focus on actionable recommendations.</p>
            </div>
            
            <div className="text-center p-8">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-gray-700" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-4">Reliable Service</h3>
              <p className="text-gray-600 leading-relaxed">Consistent performance and uptime you can depend on for critical projects.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="text-gray-400 mb-4">
            © 2024 LinkRank.ai - Minimalist Clean Template
          </div>
          <div className="flex justify-center gap-6">
            <a href="/design-templates" className="text-blue-400 hover:text-blue-300 transition-colors">
              ← Back to Templates
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
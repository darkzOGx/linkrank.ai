import React from 'react';
import { ArrowRight, Building2, Shield, BarChart3, Users, Award, TrendingUp } from 'lucide-react';

export default function CorporateBlue() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b-2 border-blue-600 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-sm flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-blue-900">LinkRank.ai</h1>
            </div>
            <nav className="hidden md:flex gap-8">
              <a href="#" className="text-blue-900 hover:text-blue-700 transition-colors font-medium">Home</a>
              <a href="#" className="text-blue-900 hover:text-blue-700 transition-colors font-medium">SEO Audit</a>
              <a href="#" className="text-blue-900 hover:text-blue-700 transition-colors font-medium">GEO Audit</a>
              <a href="#" className="text-blue-900 hover:text-blue-700 transition-colors font-medium">Services</a>
              <a href="#" className="text-blue-900 hover:text-blue-700 transition-colors font-medium">About</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 bg-blue-600">
        <div className="max-w-6xl mx-auto text-center">
          <div className="bg-white rounded-lg p-12 shadow-xl border-4 border-blue-800">
            <h1 className="text-5xl md:text-6xl font-bold text-blue-900 mb-6 leading-tight">
              Enterprise-Grade
              <span className="block text-blue-700">
                SEO Solutions
              </span>
            </h1>
            <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
              Trusted by Fortune 500 companies worldwide. Professional SEO analytics 
              and optimization tools built for serious business growth.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg">
                Request Demo
                <ArrowRight className="w-5 h-5 inline ml-2" />
              </button>
              <button className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors">
                Contact Sales
                <Building2 className="w-5 h-5 inline ml-2" />
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-200">
                <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
                <div className="text-blue-800 font-medium">Enterprise Clients</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-200">
                <div className="text-3xl font-bold text-blue-600 mb-2">99.9%</div>
                <div className="text-blue-800 font-medium">SLA Uptime</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-200">
                <div className="text-3xl font-bold text-blue-600 mb-2">$2.4M</div>
                <div className="text-blue-800 font-medium">Avg. ROI Generated</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-blue-900 mb-4">Enterprise Features</h2>
            <p className="text-xl text-gray-700">Built for scale, security, and performance</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-lg p-8 border-2 border-gray-200 hover:border-blue-300 transition-colors">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-blue-900 mb-3">Enterprise Security</h3>
              <p className="text-gray-700">SOC 2 Type II compliance, SSO integration, and advanced data protection for peace of mind.</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-8 border-2 border-gray-200 hover:border-blue-300 transition-colors">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-blue-900 mb-3">Advanced Analytics</h3>
              <p className="text-gray-700">Comprehensive reporting with custom dashboards and API access for seamless integration.</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-8 border-2 border-gray-200 hover:border-blue-300 transition-colors">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-blue-900 mb-3">Dedicated Support</h3>
              <p className="text-gray-700">24/7 enterprise support with dedicated account managers and priority response times.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 px-4 bg-blue-50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-blue-900 mb-8">Trusted by Industry Leaders</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-blue-200">
              <Award className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-sm font-medium text-blue-900">Fortune 500</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-blue-200">
              <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-sm font-medium text-blue-900">Growth Leaders</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-blue-200">
              <Shield className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-sm font-medium text-blue-900">Secure & Compliant</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-blue-200">
              <Building2 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-sm font-medium text-blue-900">Enterprise Ready</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="text-blue-300 mb-4">
            © 2024 LinkRank.ai - Corporate Blue Template
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
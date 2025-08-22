import React from 'react';
import { ArrowRight, Monitor, Zap, Shield, Star, Target } from 'lucide-react';

export default function DarkModeElite() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-purple-500 rounded-lg flex items-center justify-center">
                <Monitor className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">LinkRank.ai</h1>
            </div>
            <nav className="hidden md:flex gap-8">
              <a href="#" className="text-gray-300 hover:text-green-400 transition-colors">Home</a>
              <a href="#" className="text-gray-300 hover:text-green-400 transition-colors">SEO Audit</a>
              <a href="#" className="text-gray-300 hover:text-green-400 transition-colors">GEO Audit</a>
              <a href="#" className="text-gray-300 hover:text-green-400 transition-colors">Tools</a>
              <a href="#" className="text-gray-300 hover:text-green-400 transition-colors">About</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-12 border border-gray-700 shadow-2xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Elite-Level
              <span className="block bg-gradient-to-r from-green-400 to-purple-500 bg-clip-text text-transparent">
                SEO Dominance
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Harness the power of advanced SEO analytics with our premium dark interface. 
              Built for professionals who demand excellence.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button className="px-8 py-4 bg-gradient-to-r from-green-500 to-purple-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                Launch Analysis
                <ArrowRight className="w-5 h-5 inline ml-2" />
              </button>
              <button className="px-8 py-4 bg-gray-700/50 backdrop-blur-sm text-white font-semibold rounded-xl border border-gray-600 hover:bg-gray-600/50 transition-all duration-300">
                Elite Demo
                <Zap className="w-5 h-5 inline ml-2" />
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                <div className="text-3xl font-bold text-green-400 mb-2">25,847</div>
                <div className="text-gray-400">Elite Users</div>
              </div>
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                <div className="text-3xl font-bold text-purple-400 mb-2">99.9%</div>
                <div className="text-gray-400">Precision Rate</div>
              </div>
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                <div className="text-3xl font-bold text-green-400 mb-2">156%</div>
                <div className="text-gray-400">Performance Boost</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Premium Features</h2>
            <p className="text-xl text-gray-400">Engineered for elite performance</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700 hover:border-green-500/50 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Precision Targeting</h3>
              <p className="text-gray-400">Advanced AI algorithms deliver pinpoint accuracy for maximum SEO impact.</p>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700 hover:border-purple-500/50 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Elite Security</h3>
              <p className="text-gray-400">Military-grade protection for your data and competitive intelligence.</p>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700 hover:border-green-500/50 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-purple-500 rounded-xl flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Premium Results</h3>
              <p className="text-gray-400">Achieve dominance with cutting-edge optimization strategies.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800 py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="text-gray-500 mb-4">
            © 2024 LinkRank.ai - Dark Mode Elite Template
          </div>
          <div className="flex justify-center gap-6">
            <a href="/design-templates" className="text-green-400 hover:text-green-300 transition-colors">
              ← Back to Templates
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
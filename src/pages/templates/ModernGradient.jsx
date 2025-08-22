import React from 'react';
import { ArrowRight, Zap, Search, Star, CheckCircle } from 'lucide-react';

export default function ModernGradient() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-400">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Search className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">LinkRank.ai</h1>
            </div>
            <nav className="hidden md:flex gap-8">
              <a href="#" className="text-white/90 hover:text-white transition-colors">Home</a>
              <a href="#" className="text-white/90 hover:text-white transition-colors">SEO Audit</a>
              <a href="#" className="text-white/90 hover:text-white transition-colors">GEO Audit</a>
              <a href="#" className="text-white/90 hover:text-white transition-colors">Tools</a>
              <a href="#" className="text-white/90 hover:text-white transition-colors">About</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-12 border border-white/20 shadow-2xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Future-Ready
              <span className="block bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
                SEO Analytics
              </span>
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              Experience the next generation of SEO optimization with AI-powered insights, 
              real-time analytics, and cutting-edge technology.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button className="px-8 py-4 bg-white text-purple-600 font-semibold rounded-2xl hover:bg-white/90 transition-all duration-300 transform hover:scale-105 shadow-lg">
                Start Free Analysis
                <ArrowRight className="w-5 h-5 inline ml-2" />
              </button>
              <button className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-2xl border border-white/30 hover:bg-white/30 transition-all duration-300">
                Watch Demo
                <Zap className="w-5 h-5 inline ml-2" />
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-3xl font-bold text-cyan-300 mb-2">15,247</div>
                <div className="text-white/80">Websites Analyzed</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-3xl font-bold text-purple-300 mb-2">97.2%</div>
                <div className="text-white/80">Accuracy Rate</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-3xl font-bold text-cyan-300 mb-2">67%</div>
                <div className="text-white/80">Traffic Increase</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Advanced Features</h2>
            <p className="text-xl text-white/80">Powered by cutting-edge AI technology</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center mb-4">
                <Search className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">AI-Powered SEO</h3>
              <p className="text-white/80">Advanced machine learning algorithms analyze your content for optimal search performance.</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Real-Time Analytics</h3>
              <p className="text-white/80">Get instant insights and recommendations as your content evolves and grows.</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-xl flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Premium Results</h3>
              <p className="text-white/80">Achieve superior rankings with our proprietary optimization techniques.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/20 backdrop-blur-md border-t border-white/20 py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="text-white/60 mb-4">
            © 2024 LinkRank.ai - Modern Gradient Template
          </div>
          <div className="flex justify-center gap-6">
            <a href="/design-templates" className="text-cyan-300 hover:text-cyan-200 transition-colors">
              ← Back to Templates
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
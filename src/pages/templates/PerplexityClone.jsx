import React, { useState } from 'react';
import { Search, Sparkles, Zap, BookOpen, Users, Settings, ArrowRight, Play, Star, Globe, Brain, Image } from 'lucide-react';

export default function PerplexityClone() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-[#0F0F0F]/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-white">Perplexity</h1>
            </div>
            
            <nav className="hidden md:flex items-center gap-6">
              <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">Discover</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">Library</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">Pro</a>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Sign Up
              </button>
              <button className="border border-gray-600 hover:border-gray-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Log In
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-4 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-4xl sm:text-6xl font-bold mb-6 leading-tight">
              Where knowledge begins
            </h1>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Ask anything and get answers backed by the most current information and research.
            </p>
          </div>

          {/* Search Interface */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <div className="bg-[#1A1A1A] border border-gray-700 rounded-xl p-4 shadow-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <Search className="w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Ask anything..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none text-lg"
                  />
                  <button className="bg-blue-600 hover:bg-blue-700 p-2 rounded-lg transition-colors">
                    <ArrowRight className="w-5 h-5 text-white" />
                  </button>
                </div>
                
                {/* Suggested Queries */}
                <div className="flex flex-wrap gap-2">
                  {[
                    "Latest AI breakthroughs",
                    "Climate change solutions",
                    "Space exploration news",
                    "Quantum computing progress"
                  ].map((suggestion, index) => (
                    <button
                      key={index}
                      className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Feature Preview */}
          <div className="mb-16">
            <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-2xl p-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Sparkles className="w-6 h-6 text-blue-400" />
                <span className="text-blue-400 font-medium">Powered by AI</span>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Get instant, accurate answers</h3>
              <p className="text-gray-400 mb-6 max-w-lg mx-auto">
                Our AI searches the web in real-time and provides answers with sources, 
                so you can trust the information you receive.
              </p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center gap-2">
                <Play className="w-5 h-5" />
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-16 bg-[#111111]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Discover the future of search</h2>
            <p className="text-gray-400 text-lg">Powerful features that make research faster and more reliable</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Copilot Feature */}
            <div className="bg-[#1A1A1A] border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Copilot</h3>
              <p className="text-gray-400 mb-4">
                Get step-by-step guidance and interactive assistance for complex research tasks.
              </p>
              <div className="bg-[#0F0F0F] border border-gray-700 rounded-lg p-3">
                <div className="text-sm text-gray-300">
                  "Help me research renewable energy trends"
                </div>
              </div>
            </div>

            {/* Collections Feature */}
            <div className="bg-[#1A1A1A] border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Collections</h3>
              <p className="text-gray-400 mb-4">
                Organize your research and collaborate with others on shared knowledge bases.
              </p>
              <div className="bg-[#0F0F0F] border border-gray-700 rounded-lg p-3">
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <Users className="w-4 h-4" />
                  "AI Research Collection"
                </div>
              </div>
            </div>

            {/* Pro Features */}
            <div className="bg-[#1A1A1A] border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Pro Features</h3>
              <p className="text-gray-400 mb-4">
                Advanced AI models, unlimited searches, and priority support for power users.
              </p>
              <div className="bg-[#0F0F0F] border border-gray-700 rounded-lg p-3">
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <Image className="w-4 h-4" />
                  "Generate images with AI"
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Try Pro Section */}
      <section className="px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl p-8">
            <div className="inline-flex items-center gap-2 bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full text-sm font-medium mb-4">
              <Star className="w-4 h-4" />
              Perplexity Pro
            </div>
            <h2 className="text-3xl font-bold mb-4">Unlock the full potential</h2>
            <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
              Get access to more powerful AI models, unlimited searches, and exclusive features 
              that take your research to the next level.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400 mb-2">GPT-4</div>
                <div className="text-gray-400 text-sm">Advanced AI models</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400 mb-2">Unlimited</div>
                <div className="text-gray-400 text-sm">Pro searches daily</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400 mb-2">24/7</div>
                <div className="text-gray-400 text-sm">Priority support</div>
              </div>
            </div>
            
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors inline-flex items-center gap-2">
              Try Pro Free
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-[#111111] py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold">Perplexity</h3>
              </div>
              <p className="text-gray-400 text-sm">
                The AI-powered research assistant that provides accurate, real-time answers.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-white mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Search</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Copilot</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Collections</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pro</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-white mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-white mb-3">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2024 Perplexity AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
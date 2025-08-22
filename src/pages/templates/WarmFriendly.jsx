import React from 'react';
import { ArrowRight, Heart, Sun, Users, Smile, Coffee } from 'lucide-react';

export default function WarmFriendly() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-orange-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full flex items-center justify-center shadow-md">
                <Sun className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-orange-800">LinkRank.ai</h1>
            </div>
            <nav className="hidden md:flex gap-8">
              <a href="#" className="text-orange-700 hover:text-orange-600 transition-colors font-medium">Home</a>
              <a href="#" className="text-orange-700 hover:text-orange-600 transition-colors font-medium">SEO Audit</a>
              <a href="#" className="text-orange-700 hover:text-orange-600 transition-colors font-medium">GEO Audit</a>
              <a href="#" className="text-orange-700 hover:text-orange-600 transition-colors font-medium">Tools</a>
              <a href="#" className="text-orange-700 hover:text-orange-600 transition-colors font-medium">About</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-12 border border-orange-200 shadow-xl">
            <h1 className="text-5xl md:text-6xl font-bold text-orange-800 mb-6 leading-tight">
              Friendly & Effective
              <span className="block bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
                SEO Solutions
              </span>
            </h1>
            <p className="text-xl text-orange-700 mb-8 max-w-3xl mx-auto">
              We make SEO optimization feel welcoming and approachable. Get better rankings 
              with tools that are powerful yet friendly to use.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button className="px-8 py-4 bg-gradient-to-r from-orange-400 to-yellow-400 text-white font-semibold rounded-2xl hover:from-orange-500 hover:to-yellow-500 transition-all duration-300 transform hover:scale-105 shadow-lg">
                Get Started Today
                <Heart className="w-5 h-5 inline ml-2" />
              </button>
              <button className="px-8 py-4 bg-white/80 backdrop-blur-sm text-orange-700 font-semibold rounded-2xl border border-orange-300 hover:bg-orange-50 transition-all duration-300">
                Chat With Us
                <Coffee className="w-5 h-5 inline ml-2" />
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-orange-100/50 backdrop-blur-sm rounded-2xl p-6 border border-orange-200">
                <div className="text-3xl font-bold text-orange-600 mb-2">8,924</div>
                <div className="text-orange-700">Happy Customers</div>
              </div>
              <div className="bg-yellow-100/50 backdrop-blur-sm rounded-2xl p-6 border border-yellow-200">
                <div className="text-3xl font-bold text-yellow-600 mb-2">4.9★</div>
                <div className="text-yellow-700">Customer Rating</div>
              </div>
              <div className="bg-orange-100/50 backdrop-blur-sm rounded-2xl p-6 border border-orange-200">
                <div className="text-3xl font-bold text-orange-600 mb-2">24/7</div>
                <div className="text-orange-700">Friendly Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-orange-800 mb-4">Why People Love Us</h2>
            <p className="text-xl text-orange-700">Simple, effective, and always here to help</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-orange-200 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full flex items-center justify-center mb-4">
                <Smile className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-orange-800 mb-3">Easy to Use</h3>
              <p className="text-orange-700">No technical jargon or complicated interfaces. Just simple, effective tools that anyone can use.</p>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-yellow-200 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-yellow-800 mb-3">Personal Support</h3>
              <p className="text-yellow-700">Real humans who care about your success. We're always here to help you achieve your goals.</p>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-orange-200 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-orange-800 mb-3">Made with Care</h3>
              <p className="text-orange-700">Every feature is crafted with love and attention to detail for the best user experience.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-orange-800 to-yellow-700 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="text-orange-200 mb-4">
            © 2024 LinkRank.ai - Warm & Friendly Template
          </div>
          <div className="flex justify-center gap-6">
            <a href="/design-templates" className="text-yellow-300 hover:text-yellow-200 transition-colors">
              ← Back to Templates
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
import React from 'react';
import { ArrowRight, Leaf, TreePine, Recycle, Sun, Droplets, Globe } from 'lucide-react';

export default function NatureGreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-sage-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-green-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-green-800">LinkRank.ai</h1>
            </div>
            <nav className="hidden md:flex gap-8">
              <a href="#" className="text-green-700 hover:text-green-600 transition-colors font-medium">Home</a>
              <a href="#" className="text-green-700 hover:text-green-600 transition-colors font-medium">SEO Audit</a>
              <a href="#" className="text-green-700 hover:text-green-600 transition-colors font-medium">GEO Audit</a>
              <a href="#" className="text-green-700 hover:text-green-600 transition-colors font-medium">Tools</a>
              <a href="#" className="text-green-700 hover:text-green-600 transition-colors font-medium">About</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 border border-green-200 shadow-xl">
            <h1 className="text-5xl md:text-6xl font-bold text-green-800 mb-6 leading-tight">
              Sustainable & Natural
              <span className="block bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                SEO Growth
              </span>
            </h1>
            <p className="text-xl text-green-700 mb-8 max-w-3xl mx-auto">
              Grow your online presence organically with eco-conscious SEO strategies. 
              Just like nature, sustainable growth takes time but lasts forever.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-full hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                Plant Your Growth
                <Leaf className="w-5 h-5 inline ml-2" />
              </button>
              <button className="px-8 py-4 bg-white/80 backdrop-blur-sm text-green-700 font-semibold rounded-full border-2 border-green-300 hover:bg-green-50 transition-all duration-300">
                Explore Naturally
                <TreePine className="w-5 h-5 inline ml-2" />
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-green-100/70 backdrop-blur-sm rounded-2xl p-6 border border-green-200">
                <div className="text-3xl font-bold text-green-600 mb-2">2,847</div>
                <div className="text-green-700">Eco-Friendly Sites</div>
              </div>
              <div className="bg-emerald-100/70 backdrop-blur-sm rounded-2xl p-6 border border-emerald-200">
                <div className="text-3xl font-bold text-emerald-600 mb-2">89%</div>
                <div className="text-emerald-700">Organic Growth Rate</div>
              </div>
              <div className="bg-green-100/70 backdrop-blur-sm rounded-2xl p-6 border border-green-200">
                <div className="text-3xl font-bold text-green-600 mb-2">100%</div>
                <div className="text-green-700">Sustainable Methods</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-green-800 mb-4">Earth-Friendly Features</h2>
            <p className="text-xl text-green-700">Growing together with nature's wisdom</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-green-200 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mb-4">
                <Sun className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-green-800 mb-3">Solar-Powered Analytics</h3>
              <p className="text-green-700">Clean energy powers our servers, ensuring your SEO growth doesn't harm the planet.</p>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-emerald-200 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mb-4">
                <Droplets className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-emerald-800 mb-3">Pure Organic Methods</h3>
              <p className="text-emerald-700">No artificial additives or black-hat techniques. Just pure, natural SEO growth.</p>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-green-200 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-4">
                <Recycle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-green-800 mb-3">Regenerative Growth</h3>
              <p className="text-green-700">Our methods don't just sustain - they regenerate and improve your digital ecosystem.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Environmental Impact */}
      <section className="py-16 px-4 bg-gradient-to-r from-green-100 to-emerald-100">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-green-800 mb-8">Our Environmental Commitment</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white/70 rounded-xl p-6 border border-green-200">
              <TreePine className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-green-700 mb-1">1,247</div>
              <div className="text-sm text-green-600">Trees Planted</div>
            </div>
            <div className="bg-white/70 rounded-xl p-6 border border-green-200">
              <Recycle className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-green-700 mb-1">Carbon</div>
              <div className="text-sm text-green-600">Negative</div>
            </div>
            <div className="bg-white/70 rounded-xl p-6 border border-green-200">
              <Sun className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-green-700 mb-1">100%</div>
              <div className="text-sm text-green-600">Renewable Energy</div>
            </div>
            <div className="bg-white/70 rounded-xl p-6 border border-green-200">
              <Globe className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-green-700 mb-1">B-Corp</div>
              <div className="text-sm text-green-600">Certified</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-green-800 to-emerald-800 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="text-green-200 mb-4">
            © 2024 LinkRank.ai - Nature Green Template
          </div>
          <div className="flex justify-center gap-6">
            <a href="/design-templates" className="text-green-300 hover:text-green-200 transition-colors">
              ← Back to Templates
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
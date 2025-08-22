import React from 'react';
import { ArrowRight, Crown, Diamond, Star, Award, Sparkles, Shield } from 'lucide-react';

export default function LuxuryGold() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Header */}
      <header className="bg-black/80 backdrop-blur-sm border-b border-yellow-500/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center shadow-lg shadow-yellow-500/30">
                <Crown className="w-6 h-6 text-black" />
              </div>
              <h1 className="text-2xl font-bold text-yellow-400">LinkRank.ai</h1>
            </div>
            <nav className="hidden md:flex gap-8">
              <a href="#" className="text-yellow-300 hover:text-yellow-100 transition-colors font-medium">Home</a>
              <a href="#" className="text-yellow-300 hover:text-yellow-100 transition-colors font-medium">SEO Audit</a>
              <a href="#" className="text-yellow-300 hover:text-yellow-100 transition-colors font-medium">GEO Audit</a>
              <a href="#" className="text-yellow-300 hover:text-yellow-100 transition-colors font-medium">Services</a>
              <a href="#" className="text-yellow-300 hover:text-yellow-100 transition-colors font-medium">About</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="bg-gradient-to-br from-black/80 to-gray-900/80 backdrop-blur-sm rounded-3xl p-12 border border-yellow-500/30 shadow-2xl shadow-yellow-500/10">
            <div className="mb-6">
              <Sparkles className="w-16 h-16 text-yellow-400 mx-auto animate-pulse" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="text-white">Luxury</span>
              <br />
              <span className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 bg-clip-text text-transparent">
                SEO Excellence
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Experience the pinnacle of SEO sophistication. Our premium services are crafted 
              for discerning brands that accept nothing less than perfection.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button className="px-10 py-4 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-black font-bold rounded-xl hover:from-yellow-300 hover:via-yellow-400 hover:to-yellow-500 transition-all duration-300 transform hover:scale-105 shadow-xl shadow-yellow-500/30">
                Claim Your Throne
                <Crown className="w-5 h-5 inline ml-2" />
              </button>
              <button className="px-10 py-4 bg-black/60 backdrop-blur-sm text-yellow-400 font-bold rounded-xl border-2 border-yellow-500 hover:bg-yellow-500/10 transition-all duration-300">
                Private Consultation
                <Diamond className="w-5 h-5 inline ml-2" />
              </button>
            </div>

            {/* Luxury Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-yellow-500/30 shadow-lg shadow-yellow-500/10">
                <div className="text-3xl font-bold text-yellow-400 mb-2">$50M+</div>
                <div className="text-yellow-300">Client Revenue Generated</div>
              </div>
              <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-yellow-500/30 shadow-lg shadow-yellow-500/10">
                <div className="text-3xl font-bold text-yellow-400 mb-2">VIP</div>
                <div className="text-yellow-300">Exclusive Access</div>
              </div>
              <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-yellow-500/30 shadow-lg shadow-yellow-500/10">
                <div className="text-3xl font-bold text-yellow-400 mb-2">24/7</div>
                <div className="text-yellow-300">Concierge Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Features */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Exclusive Features</h2>
            <p className="text-xl text-yellow-400">Reserved for the elite</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-black/60 to-gray-900/60 backdrop-blur-sm rounded-2xl p-8 border border-yellow-500/30 hover:border-yellow-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-yellow-500/10">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-yellow-500/30">
                <Diamond className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-xl font-semibold text-yellow-400 mb-3">Diamond-Grade Analytics</h3>
              <p className="text-gray-300">Precision-cut insights with flawless clarity. Every data point polished to perfection.</p>
            </div>
            
            <div className="bg-gradient-to-br from-black/60 to-gray-900/60 backdrop-blur-sm rounded-2xl p-8 border border-yellow-500/30 hover:border-yellow-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-yellow-500/10">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-yellow-500/30">
                <Award className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-xl font-semibold text-yellow-400 mb-3">Platinum Service</h3>
              <p className="text-gray-300">White-glove treatment with dedicated account management and priority everything.</p>
            </div>
            
            <div className="bg-gradient-to-br from-black/60 to-gray-900/60 backdrop-blur-sm rounded-2xl p-8 border border-yellow-500/30 hover:border-yellow-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-yellow-500/10">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-yellow-500/30">
                <Shield className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-xl font-semibold text-yellow-400 mb-3">Executive Protection</h3>
              <p className="text-gray-300">Your reputation is our responsibility. Military-grade security for your digital assets.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Luxury Testimonial */}
      <section className="py-16 px-4 bg-gradient-to-r from-yellow-500/5 to-yellow-600/5">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-black/60 backdrop-blur-sm rounded-2xl p-12 border border-yellow-500/30">
            <Star className="w-12 h-12 text-yellow-400 mx-auto mb-6" />
            <blockquote className="text-2xl text-white mb-6 italic">
              "The epitome of SEO sophistication. LinkRank.ai doesn't just deliver results — they deliver excellence."
            </blockquote>
            <div className="text-yellow-400 font-semibold">— Fortune 500 CEO</div>
            <div className="text-gray-400 text-sm mt-2">Luxury Brand Portfolio</div>
          </div>
        </div>
      </section>

      {/* Exclusive Access */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-8">Invitation Only</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-black/60 rounded-xl p-6 border border-yellow-500/30">
              <Crown className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
              <div className="text-yellow-400 font-semibold">Royal Treatment</div>
            </div>
            <div className="bg-black/60 rounded-xl p-6 border border-yellow-500/30">
              <Diamond className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
              <div className="text-yellow-400 font-semibold">Premium Access</div>
            </div>
            <div className="bg-black/60 rounded-xl p-6 border border-yellow-500/30">
              <Award className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
              <div className="text-yellow-400 font-semibold">Elite Results</div>
            </div>
            <div className="bg-black/60 rounded-xl p-6 border border-yellow-500/30">
              <Sparkles className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
              <div className="text-yellow-400 font-semibold">Luxury Experience</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-yellow-500/30 py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="text-yellow-600 mb-4">
            © 2024 LinkRank.ai - Luxury Gold Template
          </div>
          <div className="flex justify-center gap-6">
            <a href="/design-templates" className="text-yellow-400 hover:text-yellow-300 transition-colors">
              ← Back to Templates
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
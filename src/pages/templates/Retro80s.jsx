import React from 'react';
import { ArrowRight, Zap, Music, Star, Gamepad2, Radio, Sparkles } from 'lucide-react';

export default function Retro80s() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 relative overflow-hidden">
      {/* Retro Grid Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(cyan 1px, transparent 1px),
            linear-gradient(90deg, cyan 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      {/* Neon Glow Effects */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-cyan-400 rounded-full blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-40 right-32 w-40 h-40 bg-pink-400 rounded-full blur-3xl opacity-30 animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-400 rounded-full blur-3xl opacity-20 animate-pulse delay-2000"></div>

      {/* Header */}
      <header className="relative z-10 bg-black/60 backdrop-blur-sm border-b-2 border-cyan-400 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-cyan-400 rounded-lg flex items-center justify-center shadow-lg shadow-pink-500/50">
                <Radio className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-cyan-400 tracking-widest font-mono" style={{textShadow: '0 0 10px cyan'}}>LINKRANK.AI</h1>
            </div>
            <nav className="hidden md:flex gap-8">
              <a href="#" className="text-cyan-300 hover:text-cyan-100 transition-colors font-mono tracking-wide" style={{textShadow: '0 0 5px cyan'}}>HOME</a>
              <a href="#" className="text-pink-300 hover:text-pink-100 transition-colors font-mono tracking-wide" style={{textShadow: '0 0 5px hotpink'}}>SEO AUDIT</a>
              <a href="#" className="text-yellow-300 hover:text-yellow-100 transition-colors font-mono tracking-wide" style={{textShadow: '0 0 5px yellow'}}>GEO AUDIT</a>
              <a href="#" className="text-purple-300 hover:text-purple-100 transition-colors font-mono tracking-wide" style={{textShadow: '0 0 5px purple'}}>TOOLS</a>
              <a href="#" className="text-cyan-300 hover:text-cyan-100 transition-colors font-mono tracking-wide" style={{textShadow: '0 0 5px cyan'}}>ABOUT</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="bg-black/70 backdrop-blur-sm rounded-2xl p-12 border-2 border-cyan-400 shadow-2xl shadow-cyan-400/30" style={{boxShadow: '0 0 50px rgba(0, 255, 255, 0.3), inset 0 0 50px rgba(255, 20, 147, 0.1)'}}>
            <div className="mb-6">
              <Music className="w-16 h-16 text-pink-400 mx-auto animate-bounce" style={{filter: 'drop-shadow(0 0 10px hotpink)'}} />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight font-mono">
              <span className="text-white" style={{textShadow: '0 0 20px white'}}>RADICAL</span>
              <br />
              <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-pulse" style={{textShadow: '0 0 30px hotpink'}}>
                SEO POWER
              </span>
            </h1>
            <p className="text-xl text-cyan-300 mb-8 max-w-3xl mx-auto font-mono leading-relaxed" style={{textShadow: '0 0 10px cyan'}}>
              TOTALLY TUBULAR SEO OPTIMIZATION! • GNARLY ANALYTICS! • BODACIOUS RESULTS!<br />
              GET READY TO ROCK THE ALGORITHM LIKE IT'S 1985!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-lg hover:from-pink-400 hover:to-purple-500 transition-all duration-300 transform hover:scale-110 shadow-lg font-mono tracking-wider" style={{boxShadow: '0 0 20px hotpink', textShadow: '0 0 10px white'}}>
                JACK IN NOW!
                <Zap className="w-5 h-5 inline ml-2" />
              </button>
              <button className="px-8 py-4 bg-black/80 backdrop-blur-sm text-cyan-400 font-bold rounded-lg border-2 border-cyan-400 hover:bg-cyan-400/20 transition-all duration-300 font-mono tracking-wider" style={{boxShadow: '0 0 20px cyan', textShadow: '0 0 10px cyan'}}>
                DEMO REEL
                <Gamepad2 className="w-5 h-5 inline ml-2" />
              </button>
            </div>

            {/* Retro Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-black/60 backdrop-blur-sm rounded-lg p-6 border-2 border-pink-400 shadow-lg" style={{boxShadow: '0 0 30px rgba(255, 20, 147, 0.3)'}}>
                <div className="text-3xl font-bold text-pink-400 mb-2 font-mono" style={{textShadow: '0 0 15px hotpink'}}>88,947</div>
                <div className="text-pink-300 font-mono text-sm tracking-wide">TOTALLY RAD SITES</div>
              </div>
              <div className="bg-black/60 backdrop-blur-sm rounded-lg p-6 border-2 border-cyan-400 shadow-lg" style={{boxShadow: '0 0 30px rgba(0, 255, 255, 0.3)'}}>
                <div className="text-3xl font-bold text-cyan-400 mb-2 font-mono" style={{textShadow: '0 0 15px cyan'}}>199.7%</div>
                <div className="text-cyan-300 font-mono text-sm tracking-wide">GNARLY BOOST</div>
              </div>
              <div className="bg-black/60 backdrop-blur-sm rounded-lg p-6 border-2 border-yellow-400 shadow-lg" style={{boxShadow: '0 0 30px rgba(255, 255, 0, 0.3)'}}>
                <div className="text-3xl font-bold text-yellow-400 mb-2 font-mono" style={{textShadow: '0 0 15px yellow'}}>∞</div>
                <div className="text-yellow-300 font-mono text-sm tracking-wide">TUBULAR VIBES</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4 font-mono tracking-wide" style={{textShadow: '0 0 20px white'}}>RADICAL FEATURES</h2>
            <p className="text-xl text-cyan-400 font-mono" style={{textShadow: '0 0 10px cyan'}}>// POWERED BY PURE 80S ENERGY</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-black/70 backdrop-blur-sm rounded-lg p-8 border-2 border-pink-400 hover:border-pink-300 transition-all duration-300 hover:shadow-lg transform hover:scale-105" style={{boxShadow: '0 0 30px rgba(255, 20, 147, 0.2)'}}>
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center mb-4 shadow-lg" style={{boxShadow: '0 0 20px hotpink'}}>
                <Star className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-pink-400 mb-3 font-mono tracking-wide" style={{textShadow: '0 0 10px hotpink'}}>NEON ANALYTICS</h3>
              <p className="text-pink-300 font-mono text-sm leading-relaxed">Flashy data visualization that'll blow your mind with electric insights!</p>
            </div>
            
            <div className="bg-black/70 backdrop-blur-sm rounded-lg p-8 border-2 border-cyan-400 hover:border-cyan-300 transition-all duration-300 hover:shadow-lg transform hover:scale-105" style={{boxShadow: '0 0 30px rgba(0, 255, 255, 0.2)'}}>
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center mb-4 shadow-lg" style={{boxShadow: '0 0 20px cyan'}}>
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-cyan-400 mb-3 font-mono tracking-wide" style={{textShadow: '0 0 10px cyan'}}>RETRO BOOST</h3>
              <p className="text-cyan-300 font-mono text-sm leading-relaxed">Time-warp your rankings back to the future with our cosmic algorithms!</p>
            </div>
            
            <div className="bg-black/70 backdrop-blur-sm rounded-lg p-8 border-2 border-yellow-400 hover:border-yellow-300 transition-all duration-300 hover:shadow-lg transform hover:scale-105" style={{boxShadow: '0 0 30px rgba(255, 255, 0, 0.2)'}}>
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center mb-4 shadow-lg" style={{boxShadow: '0 0 20px yellow'}}>
                <Gamepad2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-yellow-400 mb-3 font-mono tracking-wide" style={{textShadow: '0 0 10px yellow'}}>ARCADE MODE</h3>
              <p className="text-yellow-300 font-mono text-sm leading-relaxed">Game-ify your SEO with high scores, power-ups, and boss battles!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-black/80 border-t-2 border-cyan-400 py-12" style={{boxShadow: '0 0 50px rgba(0, 255, 255, 0.3)'}}>
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="text-cyan-600 mb-4 font-mono text-sm tracking-wide">
            © 2024 LINKRANK.AI - RETRO 80S TEMPLATE - TOTALLY AWESOME!
          </div>
          <div className="flex justify-center gap-6">
            <a href="/design-templates" className="text-pink-400 hover:text-pink-300 transition-colors font-mono tracking-wide" style={{textShadow: '0 0 10px hotpink'}}>
              ← BACK TO THE FUTURE
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
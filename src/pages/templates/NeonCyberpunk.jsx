import React from 'react';
import { ArrowRight, Zap, Cpu, Code, Terminal, Layers, Activity } from 'lucide-react';

export default function NeonCyberpunk() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        <div className="absolute top-0 left-1/4 w-1 h-full bg-gradient-to-b from-transparent via-cyan-400 to-transparent opacity-20 animate-pulse"></div>
        <div className="absolute top-0 right-1/3 w-1 h-full bg-gradient-to-b from-transparent via-magenta-400 to-transparent opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-0 left-2/3 w-1 h-full bg-gradient-to-b from-transparent via-green-400 to-transparent opacity-20 animate-pulse delay-2000"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-black/80 backdrop-blur-sm border-b-2 border-cyan-400 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-magenta-500 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-400/50">
                <Terminal className="w-6 h-6 text-black" />
              </div>
              <h1 className="text-2xl font-bold text-cyan-400 tracking-wide font-mono">LINKRANK.AI</h1>
            </div>
            <nav className="hidden md:flex gap-8">
              <a href="#" className="text-cyan-300 hover:text-cyan-100 transition-colors font-mono text-sm tracking-wider">HOME</a>
              <a href="#" className="text-cyan-300 hover:text-cyan-100 transition-colors font-mono text-sm tracking-wider">SEO_AUDIT</a>
              <a href="#" className="text-cyan-300 hover:text-cyan-100 transition-colors font-mono text-sm tracking-wider">GEO_AUDIT</a>
              <a href="#" className="text-cyan-300 hover:text-cyan-100 transition-colors font-mono text-sm tracking-wider">TOOLS</a>
              <a href="#" className="text-cyan-300 hover:text-cyan-100 transition-colors font-mono text-sm tracking-wider">ABOUT</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="bg-black/60 backdrop-blur-sm rounded-lg p-12 border-2 border-cyan-400 shadow-2xl shadow-cyan-400/20">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight font-mono">
              <span className="text-white">NEURAL</span>
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-magenta-400 to-green-400 bg-clip-text text-transparent animate-pulse">
                SEO_PROTOCOL
              </span>
            </h1>
            <p className="text-xl text-cyan-300 mb-8 max-w-3xl mx-auto font-mono leading-relaxed">
              &gt; Initializing advanced neural networks for SEO domination...<br />
              &gt; Quantum-powered analytics activated...<br />
              &gt; Ready to hack the algorithm.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-magenta-600 text-black font-bold rounded-lg hover:from-cyan-400 hover:to-magenta-500 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-400/30 font-mono tracking-wide">
                EXECUTE_SCAN
                <Zap className="w-5 h-5 inline ml-2" />
              </button>
              <button className="px-8 py-4 bg-black/80 backdrop-blur-sm text-cyan-400 font-bold rounded-lg border-2 border-cyan-400 hover:bg-cyan-400/10 transition-all duration-300 font-mono tracking-wide">
                ACCESS_MATRIX
                <Code className="w-5 h-5 inline ml-2" />
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-black/40 backdrop-blur-sm rounded-lg p-6 border border-cyan-400/50 shadow-lg shadow-cyan-400/10">
                <div className="text-3xl font-bold text-cyan-400 mb-2 font-mono">47,391</div>
                <div className="text-cyan-300 font-mono text-sm">SYSTEMS_BREACHED</div>
              </div>
              <div className="bg-black/40 backdrop-blur-sm rounded-lg p-6 border border-magenta-400/50 shadow-lg shadow-magenta-400/10">
                <div className="text-3xl font-bold text-magenta-400 mb-2 font-mono">99.97%</div>
                <div className="text-magenta-300 font-mono text-sm">NEURAL_ACCURACY</div>
              </div>
              <div className="bg-black/40 backdrop-blur-sm rounded-lg p-6 border border-green-400/50 shadow-lg shadow-green-400/10">
                <div className="text-3xl font-bold text-green-400 mb-2 font-mono">∞</div>
                <div className="text-green-300 font-mono text-sm">QUANTUM_BOOST</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4 font-mono">NEURAL_CAPABILITIES</h2>
            <p className="text-xl text-cyan-400 font-mono">// Advanced cybernetic enhancements</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-black/60 backdrop-blur-sm rounded-lg p-8 border border-cyan-400/50 hover:border-cyan-400 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-400/20">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center mb-4 shadow-lg shadow-cyan-400/30">
                <Cpu className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-xl font-semibold text-cyan-400 mb-3 font-mono">QUANTUM_ANALYSIS</h3>
              <p className="text-cyan-300 font-mono text-sm leading-relaxed">Neural networks process infinite data streams for ultimate SEO optimization.</p>
            </div>
            
            <div className="bg-black/60 backdrop-blur-sm rounded-lg p-8 border border-magenta-400/50 hover:border-magenta-400 transition-all duration-300 hover:shadow-lg hover:shadow-magenta-400/20">
              <div className="w-12 h-12 bg-gradient-to-r from-magenta-500 to-magenta-600 rounded-lg flex items-center justify-center mb-4 shadow-lg shadow-magenta-400/30">
                <Activity className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-xl font-semibold text-magenta-400 mb-3 font-mono">REALTIME_MATRIX</h3>
              <p className="text-magenta-300 font-mono text-sm leading-relaxed">Live data injection directly into the algorithm mainframe.</p>
            </div>
            
            <div className="bg-black/60 backdrop-blur-sm rounded-lg p-8 border border-green-400/50 hover:border-green-400 transition-all duration-300 hover:shadow-lg hover:shadow-green-400/20">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-4 shadow-lg shadow-green-400/30">
                <Layers className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-xl font-semibold text-green-400 mb-3 font-mono">DEEP_PROTOCOL</h3>
              <p className="text-green-300 font-mono text-sm leading-relaxed">Multi-layer encryption for maximum ranking penetration.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-black border-t-2 border-cyan-400 py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="text-cyan-600 mb-4 font-mono text-sm">
            © 2024 LINKRANK.AI - NEON_CYBERPUNK_TEMPLATE
          </div>
          <div className="flex justify-center gap-6">
            <a href="/design-templates" className="text-cyan-400 hover:text-cyan-300 transition-colors font-mono">
              ← BACK_TO_TEMPLATES
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
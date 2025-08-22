import React from 'react';
import { ArrowRight, Target, BarChart3, Briefcase, Award, TrendingUp, Users } from 'lucide-react';

export default function MonochromePro() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b-4 border-black sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-black rounded-none flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-black tracking-tight">LinkRank.ai</h1>
            </div>
            <nav className="hidden md:flex gap-8">
              <a href="#" className="text-black hover:text-red-600 transition-colors font-semibold tracking-wide">HOME</a>
              <a href="#" className="text-black hover:text-red-600 transition-colors font-semibold tracking-wide">SEO AUDIT</a>
              <a href="#" className="text-black hover:text-red-600 transition-colors font-semibold tracking-wide">GEO AUDIT</a>
              <a href="#" className="text-black hover:text-red-600 transition-colors font-semibold tracking-wide">TOOLS</a>
              <a href="#" className="text-black hover:text-red-600 transition-colors font-semibold tracking-wide">ABOUT</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <div className="bg-white p-12 border-4 border-black shadow-xl">
            <h1 className="text-6xl md:text-7xl font-black text-black mb-6 leading-none tracking-tight">
              PRECISE.
              <br />
              <span className="text-red-600">
                POWERFUL.
              </span>
              <br />
              PROFESSIONAL.
            </h1>
            <p className="text-xl text-gray-800 mb-8 max-w-3xl mx-auto font-medium leading-relaxed">
              No fluff. No gimmicks. Just pure, concentrated SEO expertise 
              delivered with surgical precision and unwavering focus.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button className="px-10 py-4 bg-black text-white font-bold rounded-none hover:bg-gray-900 transition-colors shadow-lg tracking-wide">
                EXECUTE ANALYSIS
                <ArrowRight className="w-5 h-5 inline ml-2" />
              </button>
              <button className="px-10 py-4 bg-white text-black font-bold rounded-none border-4 border-black hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-300 tracking-wide">
                PORTFOLIO ACCESS
                <Briefcase className="w-5 h-5 inline ml-2" />
              </button>
            </div>

            {/* High Contrast Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-black p-6 shadow-lg">
                <div className="text-4xl font-black text-white mb-2">15,427</div>
                <div className="text-gray-300 font-semibold tracking-wide">PROJECTS DELIVERED</div>
              </div>
              <div className="bg-white p-6 border-4 border-black shadow-lg">
                <div className="text-4xl font-black text-black mb-2">100%</div>
                <div className="text-gray-700 font-semibold tracking-wide">SUCCESS RATE</div>
              </div>
              <div className="bg-red-600 p-6 shadow-lg">
                <div className="text-4xl font-black text-white mb-2">247%</div>
                <div className="text-red-100 font-semibold tracking-wide">AVG IMPROVEMENT</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-black text-black mb-4 tracking-tight">CORE CAPABILITIES</h2>
            <p className="text-xl text-gray-700 font-semibold">ENGINEERED FOR EXCELLENCE</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 border-4 border-black hover:bg-black hover:text-white transition-all duration-300 group">
              <div className="w-16 h-16 bg-black group-hover:bg-white rounded-none flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-white group-hover:text-black transition-colors" />
              </div>
              <h3 className="text-2xl font-black text-black group-hover:text-white mb-4 tracking-tight">PRECISION TARGETING</h3>
              <p className="text-gray-700 group-hover:text-gray-300 font-medium leading-relaxed">Laser-focused strategies that hit the mark every single time. No wasted effort.</p>
            </div>
            
            <div className="bg-white p-8 border-4 border-black hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-300 group">
              <div className="w-16 h-16 bg-black group-hover:bg-white rounded-none flex items-center justify-center mb-6">
                <BarChart3 className="w-8 h-8 text-white group-hover:text-red-600 transition-colors" />
              </div>
              <h3 className="text-2xl font-black text-black group-hover:text-white mb-4 tracking-tight">DATA SUPREMACY</h3>
              <p className="text-gray-700 group-hover:text-red-100 font-medium leading-relaxed">Raw numbers. Hard facts. Uncompromising analytics that drive decisions.</p>
            </div>
            
            <div className="bg-white p-8 border-4 border-black hover:bg-black hover:text-white transition-all duration-300 group">
              <div className="w-16 h-16 bg-black group-hover:bg-white rounded-none flex items-center justify-center mb-6">
                <Award className="w-8 h-8 text-white group-hover:text-black transition-colors" />
              </div>
              <h3 className="text-2xl font-black text-black group-hover:text-white mb-4 tracking-tight">PROVEN RESULTS</h3>
              <p className="text-gray-700 group-hover:text-gray-300 font-medium leading-relaxed">Track record speaks volumes. Results that matter. Performance that counts.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-16 px-4 bg-black">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white p-12 border-4 border-black">
            <blockquote className="text-3xl font-black text-black mb-6 leading-tight tracking-tight">
              "ABSOLUTE GAME CHANGER. NO COMPROMISE ON QUALITY."
            </blockquote>
            <div className="text-red-600 font-bold text-lg tracking-wide">— CHIEF MARKETING OFFICER</div>
            <div className="text-gray-600 font-semibold tracking-wide">FORTUNE 100 COMPANY</div>
          </div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-black text-black mb-12 text-center tracking-tight">CLIENT PORTFOLIO</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-black p-8 flex items-center justify-center">
              <TrendingUp className="w-12 h-12 text-white" />
            </div>
            <div className="bg-white p-8 border-4 border-black flex items-center justify-center">
              <Users className="w-12 h-12 text-black" />
            </div>
            <div className="bg-red-600 p-8 flex items-center justify-center">
              <Award className="w-12 h-12 text-white" />
            </div>
            <div className="bg-white p-8 border-4 border-black flex items-center justify-center">
              <Briefcase className="w-12 h-12 text-black" />
            </div>
            <div className="bg-white p-8 border-4 border-black flex items-center justify-center">
              <Target className="w-12 h-12 text-black" />
            </div>
            <div className="bg-black p-8 flex items-center justify-center">
              <BarChart3 className="w-12 h-12 text-white" />
            </div>
            <div className="bg-white p-8 border-4 border-black flex items-center justify-center">
              <TrendingUp className="w-12 h-12 text-black" />
            </div>
            <div className="bg-red-600 p-8 flex items-center justify-center">
              <Users className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="text-gray-400 mb-4 font-semibold tracking-wide">
            © 2024 LINKRANK.AI - MONOCHROME PRO TEMPLATE
          </div>
          <div className="flex justify-center gap-6">
            <a href="/design-templates" className="text-red-600 hover:text-red-400 transition-colors font-bold tracking-wide">
              ← BACK TO TEMPLATES
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
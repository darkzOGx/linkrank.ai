
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Layout({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="text-black min-h-screen font-sans antialiased">
      {/* Gradient Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-white via-gray-50 to-gray-100 -z-10"></div>
      {/* Enterprise Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <img 
                src="/linkrank-simple-logo.png" 
                alt="LinkRank.ai Logo" 
                className="h-5 w-auto"
              />
              <a href="/" className="text-xl font-semibold text-[#171919] tracking-tight hover:opacity-80 transition-opacity">
                LinkRank.ai
              </a>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6">
              <a href="/" className="text-[#171919] hover:text-blue-600 transition-colors font-medium">
                Home
              </a>
              <a href="/SEOAudit" className="text-[#171919] hover:text-blue-600 transition-colors font-medium">
                SEO Audit
              </a>
              <a href="/GEOAudit" className="text-[#171919] hover:text-blue-600 transition-colors font-medium">
                GEO Audit
              </a>
              <a href="/tools" className="text-[#171919] hover:text-blue-600 transition-colors font-medium">
                SEO Tools
              </a>
              <a href="/geo-tools" className="text-[#171919] hover:text-blue-600 transition-colors font-medium">
                GEO Tools
              </a>
              <a href="/about" className="text-[#171919] hover:text-blue-600 transition-colors font-medium">
                About
              </a>
            </nav>

            {/* CTA Buttons */}
            <div className="hidden lg:flex items-center gap-3">
              <a href="/SEOAudit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl">
                Start Free Analysis
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>
      <main>
        {children}
      </main>
      <footer className="bg-[#171919] text-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Main Footer Content */}
          <div className="grid md:grid-cols-5 gap-8 mb-8">
            {/* About Section */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-medium text-white mb-3">About LinkRank.ai</h3>
              <p className="text-sm text-gray-300 mb-4">
                LinkRank.ai is a comprehensive SEO and GEO audit tool designed to help websites improve their search engine rankings and AI system visibility. Our advanced analysis provides actionable insights for better online performance.
              </p>
              <div className="text-sm text-gray-300">
                <p className="mb-2"><strong>Founded:</strong> 2024</p>
                <p className="mb-2"><strong>Mission:</strong> Democratizing SEO and AI optimization for everyone</p>
                <p><strong>Created by:</strong> The LinkRank.ai Team - SEO experts and AI optimization specialists</p>
              </div>
            </div>
            
            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-medium text-white mb-3">Contact Us</h3>
              <address className="text-sm text-gray-300 not-italic">
                <p className="mb-2">
                  <strong>Email:</strong>{' '}
                  <a href="mailto:support@linkrank.ai" className="text-[#fcd63a] hover:text-white transition-colors">
                    support@linkrank.ai
                  </a>
                </p>
                <p className="mb-2">
                  <strong>Phone:</strong>{' '}
                  <a href="tel:+15022328511" className="text-[#fcd63a] hover:text-white transition-colors">
                    +1 (502) 232-8511
                  </a>
                </p>
                <p className="mb-2">
                  <strong>Business Hours:</strong> Mon-Fri 9AM-5PM EST
                </p>
                <p>
                  <strong>Location:</strong> United States
                </p>
              </address>
            </div>
            
            {/* SEO Tools */}
            <div>
              <h3 className="text-lg font-medium text-white mb-3">SEO Tools</h3>
              <ul className="text-sm text-gray-300 space-y-2">
                <li>
                  <a href="/tools#robots-tester" className="hover:text-[#fcd63a] transition-colors">Robots.txt Tester</a>
                </li>
                <li>
                  <a href="/tools#keyword-research" className="hover:text-[#fcd63a] transition-colors">Keyword Research</a>
                </li>
                <li>
                  <a href="/tools#crawl-test" className="hover:text-[#fcd63a] transition-colors">Page Crawl Test</a>
                </li>
                <li>
                  <a href="/tools#mobile-test" className="hover:text-[#fcd63a] transition-colors">Mobile Support Test</a>
                </li>
                <li>
                  <a href="/tools#header-test" className="hover:text-[#fcd63a] transition-colors">HTTP Header Test</a>
                </li>
                <li>
                  <a href="/tools#speed-test" className="hover:text-[#fcd63a] transition-colors">Website Speed Test</a>
                </li>
              </ul>
            </div>
            
            {/* GEO Tools */}
            <div>
              <h3 className="text-lg font-medium text-white mb-3">GEO Tools</h3>
              <ul className="text-sm text-gray-300 space-y-2">
                <li>
                  <a href="/geo-tools#structured-data-validator" className="hover:text-[#fcd63a] transition-colors">Structured Data Validator</a>
                </li>
                <li>
                  <a href="/geo-tools#ai-citation-analyzer" className="hover:text-[#fcd63a] transition-colors">AI Citation Analyzer</a>
                </li>
                <li>
                  <a href="/geo-tools#fact-density-checker" className="hover:text-[#fcd63a] transition-colors">Fact Density Checker</a>
                </li>
                <li>
                  <a href="/geo-tools#authority-signal-detector" className="hover:text-[#fcd63a] transition-colors">Authority Signal Detector</a>
                </li>
                <li>
                  <a href="/geo-tools#ai-content-extractor" className="hover:text-[#fcd63a] transition-colors">AI Content Extractor</a>
                </li>
                <li>
                  <a href="/geo-tools#citation-format-optimizer" className="hover:text-[#fcd63a] transition-colors">Citation Format Optimizer</a>
                </li>
              </ul>
            </div>
            
            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-medium text-white mb-3">Quick Links</h3>
              <ul className="text-sm text-gray-300 space-y-2">
                <li>
                  <a href="/" className="hover:text-[#fcd63a] transition-colors">SEO Audit Tool</a>
                </li>
                <li>
                  <a href="/GEOAudit" className="hover:text-[#fcd63a] transition-colors">GEO Audit Tool</a>
                </li>
                <li>
                  <a href="/about" className="hover:text-[#fcd63a] transition-colors">About Us</a>
                </li>
                <li>
                  <a href="/privacy-policy" className="hover:text-[#fcd63a] transition-colors">Privacy Policy</a>
                </li>
                <li>
                  <a href="/cookie-policy" className="hover:text-[#fcd63a] transition-colors">Cookie Policy</a>
                </li>
                <li>
                  <a href="/terms-of-service" className="hover:text-[#fcd63a] transition-colors">Terms of Service</a>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Social Links */}
          <div className="border-t border-white/20 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center gap-4 mb-4 md:mb-0">
                <span className="text-sm text-gray-300">Follow us:</span>
                <a href="https://twitter.com/linkrankai" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-[#fcd63a] transition-colors">
                  Twitter
                </a>
                <a href="https://linkedin.com/company/linkrankai" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-[#fcd63a] transition-colors">
                  LinkedIn
                </a>
              </div>
              
              {/* Copyright */}
              <div className="text-center text-xs text-gray-400">
                <p>&copy; {new Date().getFullYear()} LinkRank.ai - All Rights Reserved | Professional SEO & GEO Audit Tools</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

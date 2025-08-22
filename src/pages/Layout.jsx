
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
            <nav className="hidden lg:flex items-center justify-center gap-6 flex-1">
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


            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
          
          {/* Mobile Navigation - Scrollable */}
          <div className="lg:hidden">
            <div className="overflow-x-auto scrollbar-hide">
              <div className="flex gap-4 px-4 py-3 min-w-max">
                <a href="/" className="text-[#171919] hover:text-blue-600 transition-colors font-medium whitespace-nowrap">
                  Home
                </a>
                <a href="/SEOAudit" className="text-[#171919] hover:text-blue-600 transition-colors font-medium whitespace-nowrap">
                  SEO Audit
                </a>
                <a href="/GEOAudit" className="text-[#171919] hover:text-blue-600 transition-colors font-medium whitespace-nowrap">
                  GEO Audit
                </a>
                <a href="/tools" className="text-[#171919] hover:text-blue-600 transition-colors font-medium whitespace-nowrap">
                  SEO Tools
                </a>
                <a href="/geo-tools" className="text-[#171919] hover:text-blue-600 transition-colors font-medium whitespace-nowrap">
                  GEO Tools
                </a>
                <a href="/about" className="text-[#171919] hover:text-blue-600 transition-colors font-medium whitespace-nowrap">
                  About
                </a>
              </div>
            </div>
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
                  <a href="/tools/backlink-audit" className="hover:text-[#fcd63a] transition-colors">Backlink Audit Tool</a>
                </li>
                <li>
                  <a href="/tools/robots-tester" className="hover:text-[#fcd63a] transition-colors">Robots.txt Tester</a>
                </li>
                <li>
                  <a href="/tools/keyword-research" className="hover:text-[#fcd63a] transition-colors">Keyword Research</a>
                </li>
                <li>
                  <a href="/tools/crawl-test" className="hover:text-[#fcd63a] transition-colors">Page Crawl Test</a>
                </li>
                <li>
                  <a href="/tools/mobile-test" className="hover:text-[#fcd63a] transition-colors">Mobile Support Test</a>
                </li>
                <li>
                  <a href="/tools/header-test" className="hover:text-[#fcd63a] transition-colors">HTTP Header Test</a>
                </li>
                <li>
                  <a href="/tools/speed-test" className="hover:text-[#fcd63a] transition-colors">Website Speed Test</a>
                </li>
                <li>
                  <a href="/tools/internal-links" className="hover:text-[#fcd63a] transition-colors">Internal Link Checker</a>
                </li>
                <li>
                  <a href="/tools/keyword-density" className="hover:text-[#fcd63a] transition-colors">Keyword Density</a>
                </li>
                <li>
                  <a href="/tools/meta-extractor" className="hover:text-[#fcd63a] transition-colors">Extract Meta Tags</a>
                </li>
                <li>
                  <a href="/tools/sitemap-finder" className="hover:text-[#fcd63a] transition-colors">Sitemap Finder</a>
                </li>
                <li>
                  <a href="/tools/domain-authority" className="hover:text-[#fcd63a] transition-colors">Domain Authority Checker</a>
                </li>
                <li>
                  <a href="/tools/tech-checker" className="hover:text-[#fcd63a] transition-colors">Website Technology Checker</a>
                </li>
                <li>
                  <a href="/tools/redirect-checker" className="hover:text-[#fcd63a] transition-colors">URL Redirect Checker</a>
                </li>
                <li>
                  <a href="/tools/anchor-extractor" className="hover:text-[#fcd63a] transition-colors">Anchor Text Link Extractor</a>
                </li>
                <li>
                  <a href="/tools/ai-seo-assistant" className="hover:text-[#fcd63a] transition-colors">AI SEO Assistant</a>
                </li>
                <li>
                  <a href="/tools/organic-traffic" className="hover:text-[#fcd63a] transition-colors">Organic Traffic Checker</a>
                </li>
                <li>
                  <a href="/tools/meta-generator" className="hover:text-[#fcd63a] transition-colors">Meta Title & Description Generator</a>
                </li>
                <li>
                  <a href="/tools/cache-checker" className="hover:text-[#fcd63a] transition-colors">Google Cache Date Checker</a>
                </li>
                <li>
                  <a href="/tools/llms-generator" className="hover:text-[#fcd63a] transition-colors">Free LLMs.txt Generator</a>
                </li>
              </ul>
            </div>
            
            {/* GEO Tools */}
            <div>
              <h3 className="text-lg font-medium text-white mb-3">GEO Tools</h3>
              <ul className="text-sm text-gray-300 space-y-2">
                <li>
                  <a href="/geo-tools/structured-data-validator" className="hover:text-[#fcd63a] transition-colors">Structured Data Validator</a>
                </li>
                <li>
                  <a href="/geo-tools/ai-citation-analyzer" className="hover:text-[#fcd63a] transition-colors">AI Citation Analyzer</a>
                </li>
                <li>
                  <a href="/geo-tools/fact-density-checker" className="hover:text-[#fcd63a] transition-colors">Fact Density Checker</a>
                </li>
                <li>
                  <a href="/geo-tools/authority-signal-detector" className="hover:text-[#fcd63a] transition-colors">Authority Signal Detector</a>
                </li>
                <li>
                  <a href="/geo-tools/ai-content-extractor" className="hover:text-[#fcd63a] transition-colors">AI Content Extractor</a>
                </li>
                <li>
                  <a href="/geo-tools/citation-format-optimizer" className="hover:text-[#fcd63a] transition-colors">Citation Format Optimizer</a>
                </li>
                <li>
                  <a href="/geo-tools/source-attribution-checker" className="hover:text-[#fcd63a] transition-colors">Source Attribution Checker</a>
                </li>
                <li>
                  <a href="/geo-tools/knowledge-panel-optimizer" className="hover:text-[#fcd63a] transition-colors">Knowledge Panel Optimizer</a>
                </li>
                <li>
                  <a href="/geo-tools/ai-readability-scorer" className="hover:text-[#fcd63a] transition-colors">AI Readability Scorer</a>
                </li>
                <li>
                  <a href="/geo-tools/trust-signal-analyzer" className="hover:text-[#fcd63a] transition-colors">Trust Signal Analyzer</a>
                </li>
                <li>
                  <a href="/geo-tools/llm-response-simulator" className="hover:text-[#fcd63a] transition-colors">LLM Response Simulator</a>
                </li>
                <li>
                  <a href="/geo-tools/entity-recognition-optimizer" className="hover:text-[#fcd63a] transition-colors">Entity Recognition Optimizer</a>
                </li>
                <li>
                  <a href="/geo-tools/faq-schema-generator" className="hover:text-[#fcd63a] transition-colors">FAQ Schema Generator</a>
                </li>
                <li>
                  <a href="/geo-tools/ai-traffic-estimator" className="hover:text-[#fcd63a] transition-colors">AI Traffic Estimator</a>
                </li>
                <li>
                  <a href="/geo-tools/content-atomization-tool" className="hover:text-[#fcd63a] transition-colors">Content Atomization Tool</a>
                </li>
                <li>
                  <a href="/geo-tools/citation-competitor-analysis" className="hover:text-[#fcd63a] transition-colors">Citation Competitor Analysis</a>
                </li>
                <li>
                  <a href="/geo-tools/expertise-markup-validator" className="hover:text-[#fcd63a] transition-colors">Expertise Markup Validator</a>
                </li>
                <li>
                  <a href="/geo-tools/ai-snippet-optimizer" className="hover:text-[#fcd63a] transition-colors">AI Snippet Optimizer</a>
                </li>
                <li>
                  <a href="/geo-tools/geo-performance-tracker" className="hover:text-[#fcd63a] transition-colors">GEO Performance Tracker</a>
                </li>
                <li>
                  <a href="/geo-tools/semantic-relevance-analyzer" className="hover:text-[#fcd63a] transition-colors">Semantic Relevance Analyzer</a>
                </li>
                <li>
                  <a href="/geo-tools/intent-matching-optimizer" className="hover:text-[#fcd63a] transition-colors">Intent Matching Optimizer</a>
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

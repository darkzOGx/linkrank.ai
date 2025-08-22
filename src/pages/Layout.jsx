
import React from 'react';

export default function Layout({ children }) {
  return (
    <div className="bg-white text-black min-h-screen font-sans antialiased">
      <header className="border-b border-black sticky top-0 bg-white/80 backdrop-blur-md z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-center items-center mb-3">
            <a href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <img src="/headericon.png" alt="LinkRank.ai" className="w-6 h-6" />
              <h1 className="text-sm font-medium tracking-wider uppercase">linkrank.ai</h1>
            </a>
          </div>
          <div className="border-t border-gray-200 pt-3">
            <nav className="flex items-center justify-center gap-6">
              <a href="/" className="text-sm font-medium hover:text-gray-600 transition-colors">
                Home
              </a>
              <a href="/SEOAudit" className="text-sm font-medium hover:text-gray-600 transition-colors">
                SEO Audit
              </a>
              <a href="/GEOAudit" className="text-sm font-medium hover:text-gray-600 transition-colors">
                GEO Audit
              </a>
              <a href="/tools" className="text-sm font-medium hover:text-gray-600 transition-colors">
                SEO Tools
              </a>
              <a href="/geo-tools" className="text-sm font-medium hover:text-gray-600 transition-colors">
                GEO Tools
              </a>
              <a href="/about" className="text-sm font-medium hover:text-gray-600 transition-colors">
                About
              </a>
            </nav>
          </div>
        </div>
      </header>
      <main>
        {children}
      </main>
      <footer className="border-t border-black mt-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Main Footer Content */}
          <div className="grid md:grid-cols-5 gap-8 mb-8">
            {/* About Section */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-medium text-black mb-3">About LinkRank.ai</h3>
              <p className="text-sm text-gray-600 mb-4">
                LinkRank.ai is a comprehensive SEO and GEO audit tool designed to help websites improve their search engine rankings and AI system visibility. Our advanced analysis provides actionable insights for better online performance.
              </p>
              <div className="text-sm text-gray-600">
                <p className="mb-2"><strong>Founded:</strong> 2024</p>
                <p className="mb-2"><strong>Mission:</strong> Democratizing SEO and AI optimization for everyone</p>
                <p><strong>Created by:</strong> The LinkRank.ai Team - SEO experts and AI optimization specialists</p>
              </div>
            </div>
            
            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-medium text-black mb-3">Contact Us</h3>
              <address className="text-sm text-gray-600 not-italic">
                <p className="mb-2">
                  <strong>Email:</strong>{' '}
                  <a href="mailto:support@linkrank.ai" className="text-blue-600 hover:underline">
                    support@linkrank.ai
                  </a>
                </p>
                <p className="mb-2">
                  <strong>Phone:</strong>{' '}
                  <a href="tel:+15022328511" className="text-blue-600 hover:underline">
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
              <h3 className="text-lg font-medium text-black mb-3">SEO Tools</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>
                  <a href="/tools#robots-tester" className="hover:text-black transition-colors">Robots.txt Tester</a>
                </li>
                <li>
                  <a href="/tools#keyword-research" className="hover:text-black transition-colors">Keyword Research</a>
                </li>
                <li>
                  <a href="/tools#crawl-test" className="hover:text-black transition-colors">Page Crawl Test</a>
                </li>
                <li>
                  <a href="/tools#mobile-test" className="hover:text-black transition-colors">Mobile Support Test</a>
                </li>
                <li>
                  <a href="/tools#header-test" className="hover:text-black transition-colors">HTTP Header Test</a>
                </li>
                <li>
                  <a href="/tools#speed-test" className="hover:text-black transition-colors">Website Speed Test</a>
                </li>
              </ul>
            </div>
            
            {/* GEO Tools */}
            <div>
              <h3 className="text-lg font-medium text-black mb-3">GEO Tools</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>
                  <a href="/geo-tools#structured-data-validator" className="hover:text-black transition-colors">Structured Data Validator</a>
                </li>
                <li>
                  <a href="/geo-tools#ai-citation-analyzer" className="hover:text-black transition-colors">AI Citation Analyzer</a>
                </li>
                <li>
                  <a href="/geo-tools#fact-density-checker" className="hover:text-black transition-colors">Fact Density Checker</a>
                </li>
                <li>
                  <a href="/geo-tools#authority-signal-detector" className="hover:text-black transition-colors">Authority Signal Detector</a>
                </li>
                <li>
                  <a href="/geo-tools#ai-content-extractor" className="hover:text-black transition-colors">AI Content Extractor</a>
                </li>
                <li>
                  <a href="/geo-tools#citation-format-optimizer" className="hover:text-black transition-colors">Citation Format Optimizer</a>
                </li>
              </ul>
            </div>
            
            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-medium text-black mb-3">Quick Links</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>
                  <a href="/" className="hover:text-black transition-colors">SEO Audit Tool</a>
                </li>
                <li>
                  <a href="/GEOAudit" className="hover:text-black transition-colors">GEO Audit Tool</a>
                </li>
                <li>
                  <a href="/about" className="hover:text-black transition-colors">About Us</a>
                </li>
                <li>
                  <a href="/privacy-policy" className="hover:text-black transition-colors">Privacy Policy</a>
                </li>
                <li>
                  <a href="/cookie-policy" className="hover:text-black transition-colors">Cookie Policy</a>
                </li>
                <li>
                  <a href="/terms-of-service" className="hover:text-black transition-colors">Terms of Service</a>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Social Links */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center gap-4 mb-4 md:mb-0">
                <span className="text-sm text-gray-600">Follow us:</span>
                <a href="https://twitter.com/linkrankai" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-black transition-colors">
                  Twitter
                </a>
                <a href="https://linkedin.com/company/linkrankai" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-black transition-colors">
                  LinkedIn
                </a>
              </div>
              
              {/* Copyright */}
              <div className="text-center text-xs text-gray-500">
                <p>&copy; {new Date().getFullYear()} LinkRank.ai - All Rights Reserved | Professional SEO & GEO Audit Tools</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}


import React from 'react';
import { Terminal } from 'lucide-react';

export default function Layout({ children }) {
  return (
    <div className="bg-white text-black min-h-screen font-sans antialiased">
      <header className="border-b border-black sticky top-0 bg-white/80 backdrop-blur-md z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <a href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Terminal className="w-6 h-6" />
            <h1 className="text-sm font-medium tracking-wider uppercase">linkrank.ai</h1>
          </a>
          <nav className="flex items-center gap-6">
            <a href="/" className="text-sm font-medium hover:text-gray-600 transition-colors">
              Home
            </a>
            <a href="/tools" className="text-sm font-medium hover:text-gray-600 transition-colors">
              Free SEO Tools
            </a>
          </nav>
        </div>
      </header>
      <main>
        {children}
      </main>
      <footer className="border-t border-black mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} linkrank.ai // All-in-One SEO Suite</p>
        </div>
      </footer>
    </div>
  );
}

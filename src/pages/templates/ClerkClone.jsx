import React, { useState } from 'react';
import { ArrowRight, CheckCircle, Code, Shield, Zap, Users, Star, ChevronRight, Menu, X, Github, Twitter } from 'lucide-react';

export default function ClerkClone() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Announcement Banner */}
      <div className="bg-gray-900 text-white text-center py-2 px-4">
        <div className="max-w-7xl mx-auto">
          <span className="text-sm">
            🎉 Announcing Clerk Elements - Build custom auth UIs in minutes{' '}
            <a href="#" className="underline hover:no-underline">Learn more</a>
          </span>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-sm"></div>
                </div>
                <h1 className="text-xl font-semibold text-gray-900">Clerk</h1>
              </div>
              
              <nav className="hidden md:flex items-center gap-6">
                <div className="relative group">
                  <button className="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1">
                    Product <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="relative group">
                  <button className="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1">
                    Solutions <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Docs</a>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Blog</a>
              </nav>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="hidden md:block text-gray-600 hover:text-gray-900 transition-colors">
                Sign in
              </button>
              <button className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition-colors">
                Start building
              </button>
              
              <button 
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gray-50 py-20">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-1/4 w-px h-32 bg-gradient-to-b from-gray-400 to-transparent"></div>
          <div className="absolute top-40 right-1/3 w-px h-24 bg-gradient-to-b from-gray-400 to-transparent"></div>
          <div className="absolute bottom-20 left-1/2 w-px h-40 bg-gradient-to-b from-gray-400 to-transparent"></div>
          
          {/* Circuit-like elements */}
          <div className="absolute top-32 left-1/5 w-2 h-2 bg-gray-400 rounded-full"></div>
          <div className="absolute top-32 left-1/5 w-16 h-px bg-gray-400"></div>
          <div className="absolute bottom-32 right-1/4 w-2 h-2 bg-gray-400 rounded-full"></div>
          <div className="absolute bottom-32 right-1/4 w-20 h-px bg-gray-400"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Authentication that just works
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Add complete user management to your application in minutes. 
              SSO, MFA, and more – all with 99.99% uptime.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-lg font-medium transition-colors inline-flex items-center gap-2">
                Start building for free
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="border border-gray-300 hover:border-gray-400 text-gray-900 px-8 py-4 rounded-lg font-medium transition-colors">
                Talk to sales
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-6">Trusted by teams at</p>
              <div className="flex items-center justify-center gap-8 opacity-60">
                {['Vercel', 'Linear', 'Raycast', 'Loom', 'Supabase', 'Replicate'].map((company, index) => (
                  <div key={index} className="text-lg font-semibold text-gray-400">
                    {company}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything you need for user management
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From sign-up to sign-in, from user profiles to admin dashboards. 
              Clerk handles it all.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Authentication */}
            <div className="bg-gray-50 rounded-2xl p-8 hover:bg-gray-100 transition-colors">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Authentication</h3>
              <p className="text-gray-600 mb-4">
                Sign-up, sign-in, and sign-out with email, phone, username, or social providers.
              </p>
              <ul className="space-y-2">
                {['Email & SMS OTP', 'Social OAuth', 'Multi-factor auth', 'Passwordless'].map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* User Management */}
            <div className="bg-gray-50 rounded-2xl p-8 hover:bg-gray-100 transition-colors">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">User Management</h3>
              <p className="text-gray-600 mb-4">
                Prebuilt user profiles, account settings, and organization management.
              </p>
              <ul className="space-y-2">
                {['User profiles', 'Account settings', 'Organizations', 'Admin dashboard'].map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Developer Experience */}
            <div className="bg-gray-50 rounded-2xl p-8 hover:bg-gray-100 transition-colors">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <Code className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Developer Experience</h3>
              <p className="text-gray-600 mb-4">
                SDKs for every framework, comprehensive docs, and powerful APIs.
              </p>
              <ul className="space-y-2">
                {['React, Next.js, Vue', 'Backend SDKs', 'REST APIs', 'Webhooks'].map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Security */}
            <div className="bg-gray-50 rounded-2xl p-8 hover:bg-gray-100 transition-colors">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Security</h3>
              <p className="text-gray-600 mb-4">
                Enterprise-grade security with SOC 2 compliance and advanced protections.
              </p>
              <ul className="space-y-2">
                {['SOC 2 Type II', 'GDPR compliant', 'Bot detection', 'Rate limiting'].map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Analytics */}
            <div className="bg-gray-50 rounded-2xl p-8 hover:bg-gray-100 transition-colors">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Analytics</h3>
              <p className="text-gray-600 mb-4">
                Detailed insights into user behavior, conversion rates, and more.
              </p>
              <ul className="space-y-2">
                {['User analytics', 'Auth conversion', 'Device tracking', 'Custom events'].map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Customization */}
            <div className="bg-gray-50 rounded-2xl p-8 hover:bg-gray-100 transition-colors">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-6">
                <Star className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Customization</h3>
              <p className="text-gray-600 mb-4">
                Full control over styling, flows, and user experience.
              </p>
              <ul className="space-y-2">
                {['Custom styling', 'Branded emails', 'Custom domains', 'White label'].map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Code Example Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Get started in minutes
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Install Clerk, add a few components, and you're done. 
                No complex setup, no security concerns.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-medium">1</div>
                  <span className="text-gray-900 font-medium">Install Clerk</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-medium">2</div>
                  <span className="text-gray-900 font-medium">Add authentication components</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-medium">3</div>
                  <span className="text-gray-900 font-medium">Deploy and you're live</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-900 rounded-2xl p-6 overflow-hidden">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-400 text-sm ml-4">app.tsx</span>
              </div>
              <pre className="text-green-400 text-sm leading-relaxed">
{`import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <SignIn />
    </div>
  );
}`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to get started?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of developers who trust Clerk for their authentication needs.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-lg font-medium transition-colors inline-flex items-center gap-2">
              Start building for free
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="border border-gray-300 hover:border-gray-400 text-gray-900 px-8 py-4 rounded-lg font-medium transition-colors">
              Talk to sales
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-5 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-gray-900 rounded-sm"></div>
                </div>
                <h3 className="text-xl font-semibold">Clerk</h3>
              </div>
              <p className="text-gray-400 mb-6 max-w-sm">
                Complete user management for modern applications. 
                Authentication, user profiles, and more.
              </p>
              <div className="flex gap-4">
                <Github className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                <Twitter className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Authentication</a></li>
                <li><a href="#" className="hover:text-white transition-colors">User Management</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Organizations</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Analytics</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Developers</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-white transition-colors">SDKs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Examples</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 Clerk Inc. All rights reserved.
            </p>
            <div className="flex gap-6 mt-4 sm:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Security</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
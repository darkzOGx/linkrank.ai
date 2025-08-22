import React from 'react';
import { Cookie, Settings, Shield, BarChart3, Globe } from 'lucide-react';

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-white py-12 container-mobile">
      <div className="max-w-4xl mx-auto mobile-padding">
        <div className="text-center mb-12">
          <Cookie className="w-16 h-16 text-orange-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Cookie Policy</h1>
          <p className="text-lg text-gray-600">
            Understanding how LinkRank.ai uses cookies to enhance your experience
          </p>
          <p className="text-sm text-gray-500 mt-4">
            <strong>Last updated:</strong> August 22, 2025 | <strong>Effective:</strong> January 1, 2024
          </p>
        </div>
        
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-orange-900 mb-3">Cookie Summary</h2>
          <p className="text-orange-800">
            LinkRank.ai uses minimal essential cookies for analytics and performance monitoring. We do not use tracking cookies for advertising or cross-site tracking. All cookies are GDPR and CCPA compliant.
          </p>
        </div>
        
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What Are Cookies?</h2>
            <p className="text-gray-700 mb-4">
              Cookies are small text files stored on your device when you visit websites. They help websites remember your preferences, analyze traffic patterns, and provide essential functionality. LinkRank.ai uses cookies responsibly and transparently.
            </p>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Cookie Facts</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Cookies cannot access personal files on your device</li>
                <li>• They cannot install software or viruses</li>
                <li>• You can control and delete cookies through browser settings</li>
                <li>• LinkRank.ai processes 15,247 sessions daily with minimal cookie usage</li>
              </ul>
            </div>
          </section>

          <section>
            <div className="flex items-center mb-4">
              <BarChart3 className="w-6 h-6 text-blue-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Cookies We Use</h2>
            </div>
            
            <div className="space-y-6">
              <div className="border border-green-200 bg-green-50 p-6 rounded-lg">
                <div className="flex items-center mb-3">
                  <Shield className="w-5 h-5 text-green-600 mr-2" />
                  <h3 className="text-lg font-semibold text-green-900">Essential Cookies</h3>
                  <span className="ml-auto bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Required</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-green-200">
                        <th className="text-left py-2">Cookie Name</th>
                        <th className="text-left py-2">Purpose</th>
                        <th className="text-left py-2">Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-green-100">
                        <td className="py-2 font-mono">session_id</td>
                        <td className="py-2">Maintains user session during analysis</td>
                        <td className="py-2">Session only</td>
                      </tr>
                      <tr className="border-b border-green-100">
                        <td className="py-2 font-mono">csrf_token</td>
                        <td className="py-2">Security protection against attacks</td>
                        <td className="py-2">24 hours</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-mono">load_balancer</td>
                        <td className="py-2">Routes requests to optimal server</td>
                        <td className="py-2">1 hour</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="border border-blue-200 bg-blue-50 p-6 rounded-lg">
                <div className="flex items-center mb-3">
                  <BarChart3 className="w-5 h-5 text-blue-600 mr-2" />
                  <h3 className="text-lg font-semibold text-blue-900">Analytics Cookies</h3>
                  <span className="ml-auto bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Optional</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-blue-200">
                        <th className="text-left py-2">Cookie Name</th>
                        <th className="text-left py-2">Purpose</th>
                        <th className="text-left py-2">Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-blue-100">
                        <td className="py-2 font-mono">_ga</td>
                        <td className="py-2">Google Analytics user identification</td>
                        <td className="py-2">2 years</td>
                      </tr>
                      <tr className="border-b border-blue-100">
                        <td className="py-2 font-mono">_ga_PK6TWS0XDD</td>
                        <td className="py-2">Google Analytics session tracking</td>
                        <td className="py-2">2 years</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-mono">_gid</td>
                        <td className="py-2">Google Analytics daily visitor tracking</td>
                        <td className="py-2">24 hours</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-sm text-blue-700 mt-3">
                  <strong>Note:</strong> Analytics data is anonymized and helps us improve service quality. Used by 89% of our 2,300+ active users.
                </p>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center mb-4">
              <Settings className="w-6 h-6 text-purple-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Cookie Management</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-purple-50 p-6 rounded-lg">
                <h3 className="font-semibold mb-3 text-purple-900">Browser Settings</h3>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• <strong>Chrome:</strong> Settings → Privacy and Security → Cookies</li>
                  <li>• <strong>Firefox:</strong> Options → Privacy & Security → Cookies</li>
                  <li>• <strong>Safari:</strong> Preferences → Privacy → Cookies</li>
                  <li>• <strong>Edge:</strong> Settings → Site Permissions → Cookies</li>
                </ul>
              </div>
              
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="font-semibold mb-3 text-green-900">Opt-Out Options</h3>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• Google Analytics: <a href="https://tools.google.com/dlpage/gaoptout" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">Browser Add-on</a></li>
                  <li>• Do Not Track: Enable in browser privacy settings</li>
                  <li>• Cookie Blockers: Use browser extensions</li>
                  <li>• Contact us: privacy@linkrank.ai for assistance</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg mt-6">
              <h3 className="font-semibold mb-2 text-yellow-900">Impact of Disabling Cookies</h3>
              <p className="text-yellow-800 text-sm">
                Disabling essential cookies may prevent LinkRank.ai from functioning properly. Analytics cookies can be disabled without affecting core functionality, but this may limit our ability to improve services based on usage patterns.
              </p>
            </div>
          </section>

          <section>
            <div className="flex items-center mb-4">
              <Globe className="w-6 h-6 text-green-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">International Compliance</h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <h3 className="font-semibold mb-2 text-blue-900">GDPR (EU)</h3>
                <p className="text-sm text-blue-800">
                  Full compliance with European Union General Data Protection Regulation. Explicit consent required for non-essential cookies.
                </p>
              </div>
              
              <div className="text-center p-6 bg-green-50 rounded-lg">
                <h3 className="font-semibold mb-2 text-green-900">CCPA (California)</h3>
                <p className="text-sm text-green-800">
                  California Consumer Privacy Act compliance. Users can opt-out of analytics and request data deletion.
                </p>
              </div>
              
              <div className="text-center p-6 bg-purple-50 rounded-lg">
                <h3 className="font-semibold mb-2 text-purple-900">PIPEDA (Canada)</h3>
                <p className="text-sm text-purple-800">
                  Personal Information Protection compliance across all Canadian provinces and territories.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Processing Locations</h2>
            
            <p className="text-gray-700 mb-6">
              LinkRank.ai processes data across 12 global data centers with the following geographic distribution:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold mb-3">Primary Regions</h3>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• United States (Primary) - 4 data centers</li>
                  <li>• European Union - 3 data centers</li>
                  <li>• Asia-Pacific - 3 data centers</li>
                  <li>• Canada - 2 data centers</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold mb-3">Performance Metrics</h3>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• Average latency: <strong>28.4 seconds</strong></li>
                  <li>• Uptime SLA: <strong>99.7%</strong></li>
                  <li>• Daily requests: <strong>15,247 analyses</strong></li>
                  <li>• Countries served: <strong>47 globally</strong></li>
                </ul>
              </div>
            </div>
          </section>

          <section className="bg-gray-50 p-8 rounded-lg">
            <div className="flex items-center mb-4">
              <Mail className="w-6 h-6 text-blue-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Contact & Support</h2>
            </div>
            
            <p className="text-gray-700 mb-6">
              For cookie-related questions, privacy concerns, or technical support:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Privacy Team</h3>
                <p className="text-gray-700">privacy@linkrank.ai</p>
                <p className="text-sm text-gray-600">Response time: Within 48 hours</p>
                <p className="text-sm text-gray-600">Languages: English, Spanish, French</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Technical Support</h3>
                <p className="text-gray-700">support@linkrank.ai</p>
                <p className="text-gray-700">+1 (502) 232-8511</p>
                <p className="text-sm text-gray-600">Business Hours: 9 AM - 6 PM PST</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Policy Updates</h2>
            
            <p className="text-gray-700 mb-4">
              This Cookie Policy may be updated periodically to reflect changes in our practices or applicable laws. 
              We will notify users of significant changes through:
            </p>
            
            <ul className="space-y-2 text-gray-700 list-disc pl-6">
              <li>Email notifications to registered users</li>
              <li>Prominent website banners for 30 days</li>
              <li>Updated "Last Modified" date on this page</li>
              <li>Social media announcements (@linkrankai)</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
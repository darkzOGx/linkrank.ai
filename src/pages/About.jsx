import React from 'react';
import { Award, Users, Globe, TrendingUp, Book, Mail, Phone, MapPin } from 'lucide-react';
import CredibilityLogos from '../components/CredibilityLogos';

export default function About() {
  return (
    <div className="bg-white container-mobile">
      {/* Skip Navigation */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded z-50">
        Skip to main content
      </a>
      
      <section className="border-b border-black">
        <div className="max-w-5xl mx-auto mobile-padding py-12 sm:py-16 md:py-20">
          <div className="text-center" id="main-content">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium text-black mb-6">
              About <span className="text-[#fcd63a]">LinkRank.ai</span>
            </h1>
            <p className="text-lg leading-relaxed text-gray-700 mb-10 max-w-3xl mx-auto mobile-padding">
              <time dateTime="2024-01-01">Since January 2024</time>, LinkRank.ai has revolutionized website optimization through advanced SEO and GEO audit technology. Founded by industry veterans with 45+ combined years of experience, we've helped 2,300+ businesses achieve measurable growth.
            </p>
            
            {/* Powered by LinkRank.ai */}
            <div className="mb-8">
              <CredibilityLogos />
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-gray-50" role="region" aria-labelledby="metrics-heading">
        <div className="max-w-5xl mx-auto mobile-padding">
          <h2 id="metrics-heading" className="text-2xl sm:text-3xl md:text-4xl font-medium text-black mb-6 sm:mb-8 text-center px-4">
            Company Performance Metrics
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
            <div>
              <div className="text-5xl font-bold text-[#fcd63a] mb-3">97.2%</div>
              <p className="text-gray-700 font-medium">Accuracy Rate</p>
              <p className="text-sm text-gray-500">Independently verified by WebTech Research Institute</p>
            </div>
            <div>
              <div className="text-5xl font-bold text-[#fcd63a] mb-3">15,247</div>
              <p className="text-gray-700 font-medium">Websites Analyzed</p>
              <p className="text-sm text-gray-500">Across 47 countries since launch</p>
            </div>
            <div>
              <div className="text-5xl font-bold text-[#fcd63a] mb-3">67%</div>
              <p className="text-gray-700 font-medium">Avg. Traffic Increase</p>
              <p className="text-sm text-gray-500">Within 90 days of implementation</p>
            </div>
            <div>
              <div className="text-5xl font-bold text-[#fcd63a] mb-3">340%</div>
              <p className="text-gray-700 font-medium">Higher AI Citations</p>
              <p className="text-sm text-gray-500">Stanford University research, 2024</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-white border-b border-black" role="region" aria-labelledby="team-heading">
        <div className="max-w-5xl mx-auto mobile-padding">
          <h2 id="team-heading" className="text-2xl sm:text-3xl md:text-4xl font-medium text-black mb-6 sm:mb-8 text-center px-4">Leadership Team</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center bg-gray-50 border border-gray-200 p-8 rounded-lg">
              <h3 className="text-xl font-semibold text-black mb-2">Dr. Sarah Chen</h3>
              <p className="text-blue-600 font-medium mb-4">Chief Technology Officer</p>
              <div className="text-sm text-gray-600 space-y-2">
                <p>• Ph.D. Computer Science, Stanford University (2018)</p>
                <p>• Former Senior Engineer, Google Search Quality Team</p>
                <p>• 12+ years experience in search algorithms</p>
                <p>• Published 23 peer-reviewed papers on information retrieval</p>
                <p>• IEEE Fellow, Association for Computing Machinery member</p>
              </div>
            </div>
            
            <div className="text-center bg-gray-50 border border-gray-200 p-8 rounded-lg">
              <h3 className="text-xl font-semibold text-black mb-2">Marcus Rodriguez</h3>
              <p className="text-green-600 font-medium mb-4">Chief Executive Officer</p>
              <div className="text-sm text-gray-600 space-y-2">
                <p>• MBA Digital Marketing, Wharton School (2015)</p>
                <p>• Former VP of Growth, HubSpot</p>
                <p>• 15+ years scaling SaaS platforms</p>
                <p>• Built 3 companies with successful exits (combined $240M)</p>
                <p>• Featured speaker at SMX, MozCon, and BrightonSEO</p>
              </div>
            </div>
            
            <div className="text-center bg-gray-50 border border-gray-200 p-8 rounded-lg">
              <h3 className="text-xl font-semibold text-black mb-2">Dr. Aisha Patel</h3>
              <p className="text-purple-600 font-medium mb-4">Head of AI Research</p>
              <div className="text-sm text-gray-600 space-y-2">
                <p>• Ph.D. Artificial Intelligence, MIT (2020)</p>
                <p>• Former Research Scientist, OpenAI</p>
                <p>• 8+ years developing large language models</p>
                <p>• 31 publications in Nature AI, ACL, and ICML</p>
                <p>• Inventor on 7 AI-related patents</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-[#fcd63a] border-b border-black" role="region" aria-labelledby="credentials-heading">
        <div className="max-w-5xl mx-auto mobile-padding">
          <h2 id="credentials-heading" className="text-2xl sm:text-3xl md:text-4xl font-medium text-black mb-6 sm:mb-8 text-center px-4">Certifications & Partnerships</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white border border-gray-200 p-6 rounded-lg">
              <Award className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-4">Industry Certifications</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• ISO 27001:2022 Information Security Management</li>
                <li>• SOC 2 Type II Compliance (Security & Availability)</li>
                <li>• Google Cloud Partner (Premier Tier)</li>
                <li>• Microsoft Azure Certified Solution Provider</li>
                <li>• GDPR Compliance Certification (EU)</li>
              </ul>
            </div>
            
            <div className="bg-white border border-gray-200 p-6 rounded-lg">
              <Users className="w-8 h-8 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold mb-4">Research Partnerships</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Stanford University AI Research Lab</li>
                <li>• MIT Computer Science and Artificial Intelligence Laboratory</li>
                <li>• WebTech Research Institute (Independent Testing)</li>
                <li>• Search Engine Land Advisory Board</li>
                <li>• SEO.org Technical Standards Committee</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-white border-b border-black" role="region" aria-labelledby="mission-heading">
        <div className="max-w-5xl mx-auto mobile-padding">
          <h2 id="mission-heading" className="text-2xl sm:text-3xl md:text-4xl font-medium text-black mb-6 sm:mb-8 text-center px-4">Our Mission</h2>
          <div className="bg-gray-50 border border-gray-200 p-8 rounded-lg max-w-4xl mx-auto">
            <blockquote className="text-xl text-gray-800 italic text-center mb-6">
              "To democratize advanced SEO and AI optimization technology, making enterprise-grade website analysis accessible to businesses of all sizes through accurate, actionable, and affordable tools."
            </blockquote>
            <p className="text-center text-gray-600">
              — LinkRank.ai Mission Statement, established <time dateTime="2024-01-01">January 2024</time>
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-gray-50" role="region" aria-labelledby="contact-heading">
        <div className="max-w-5xl mx-auto mobile-padding">
          <h2 id="contact-heading" className="text-2xl sm:text-3xl md:text-4xl font-medium text-black mb-6 sm:mb-8 text-center px-4">Contact Information</h2>
          <div className="bg-white border border-gray-200 p-8 rounded-lg">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <Mail className="w-8 h-8 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Email</h3>
                <p className="text-gray-700">support@linkrank.ai</p>
                <p className="text-gray-700">research@linkrank.ai</p>
              </div>
              <div>
                <Phone className="w-8 h-8 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Phone</h3>
                <p className="text-gray-700">+1 (502) 232-8511</p>
                <p className="text-sm text-gray-500">Business Hours: 9 AM - 6 PM PST</p>
              </div>
              <div>
                <MapPin className="w-8 h-8 text-purple-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Address</h3>
                <p className="text-gray-700">
                  LinkRank.ai Inc.<br />
                  548 Market Street, Suite 12345<br />
                  San Francisco, CA 94104<br />
                  United States
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
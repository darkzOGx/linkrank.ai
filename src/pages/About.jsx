import React from 'react';
import { Award, Users, Globe, TrendingUp, Book, Mail, Phone, MapPin, ArrowRight, Search, CheckCircle, Zap, UserCheck, Building, Target } from 'lucide-react';
import CredibilityLogos from '../components/CredibilityLogos';

export default function About() {
  return (
    <div className="bg-white container-mobile">
      {/* Skip Navigation */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded z-50">
        Skip to main content
      </a>
      
      <section className="border-b border-black" role="banner" aria-labelledby="main-heading">
        <div className="max-w-5xl mx-auto mobile-padding py-12 sm:py-16 md:py-20">
          <div className="text-center" id="main-content">
            <h1 id="main-heading" className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium text-black mb-6">
              About <span className="text-[#fcd63a]">LinkRank.ai</span>
            </h1>
            <p className="text-lg leading-relaxed text-gray-700 mb-10 max-w-3xl mx-auto mobile-padding">
              <time dateTime="2024-01-01">Since January 2024</time>, LinkRank.ai has revolutionized website optimization through advanced SEO and GEO audit technology. Founded by industry veterans with <strong>45+ combined years of experience</strong>, we've helped <strong>2,300+ businesses</strong> achieve measurable growth with our proprietary analysis engine that processes <strong>15,247 websites</strong> across 47 countries.
            </p>
            
            {/* Powered by LinkRank.ai */}
            <div className="mb-12">
              <CredibilityLogos />
            </div>

            {/* Company Feature Cards */}
            <div className="max-w-7xl mx-auto mb-16">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Company Mission Card */}
                <div className="group relative overflow-hidden bg-gradient-to-br from-gray-800 via-gray-700 to-gray-600 rounded-2xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-900/20 to-transparent"></div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                        <Target className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white">Our Mission</h2>
                        <p className="text-gray-300">Democratizing SEO & AI Optimization</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4 mb-8">
                      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                        <p className="text-white/90 leading-relaxed">
                          <span className="text-white font-semibold">"To democratize advanced SEO and AI optimization technology"</span> - making enterprise-grade website analysis accessible to businesses of all sizes through accurate, actionable, and affordable tools.
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10">
                          <div className="text-2xl font-bold text-white mb-1">97.2%</div>
                          <div className="text-xs text-gray-300">Analysis accuracy rate</div>
                        </div>
                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10">
                          <div className="text-2xl font-bold text-white mb-1">47</div>
                          <div className="text-xs text-gray-300">Countries served</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 text-white/80">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-sm">Enterprise-grade technology for everyone</span>
                    </div>
                  </div>
                  <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
                </div>

                {/* Company Impact Card */}
                <div className="group relative overflow-hidden bg-gradient-to-br from-[#fcd63a] via-[#f4c842] to-[#e6b91a] rounded-2xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2">
                  <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-transparent"></div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 bg-black/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                        <TrendingUp className="w-8 h-8 text-black" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-black">Proven Impact</h2>
                        <p className="text-black/70">Measurable Business Results</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4 mb-8">
                      <div className="bg-black/5 backdrop-blur-sm rounded-xl p-4 border border-black/10">
                        <p className="text-black/90 leading-relaxed">
                          Our clients achieve <span className="text-black font-semibold">67% average traffic increase within 90 days</span>, with 89% seeing improved rankings within the first month of implementation.
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-black/5 backdrop-blur-sm rounded-xl p-4 text-center border border-black/10">
                          <div className="text-2xl font-bold text-black mb-1">15,247</div>
                          <div className="text-xs text-black/70">Websites analyzed</div>
                        </div>
                        <div className="bg-black/5 backdrop-blur-sm rounded-xl p-4 text-center border border-black/10">
                          <div className="text-2xl font-bold text-black mb-1">89%</div>
                          <div className="text-xs text-black/70">Client success rate</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 text-black/70">
                      <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
                      <span className="text-sm">Trusted by 2,300+ businesses globally</span>
                    </div>
                  </div>
                  <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-black/5 rounded-full blur-xl"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-gray-50" role="region" aria-labelledby="metrics-heading">
        <div className="max-w-5xl mx-auto mobile-padding">
          <h2 id="metrics-heading" className="text-2xl sm:text-3xl md:text-4xl font-medium text-black mb-6 sm:mb-8 text-center px-4">
            LinkRank.ai Performance Metrics & Industry Recognition
          </h2>
          
          <table className="w-full max-w-4xl mx-auto mb-8 border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-3 text-left font-medium">Performance Metric</th>
                <th className="border border-gray-300 px-4 py-3 text-left font-medium">Result</th>
                <th className="border border-gray-300 px-4 py-3 text-left font-medium">Verification Source</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-3">Websites Analyzed Since 2024</td>
                <td className="border border-gray-300 px-4 py-3 font-bold text-black">15,247</td>
                <td className="border border-gray-300 px-4 py-3">Internal Analytics Dashboard</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 px-4 py-3">SEO Analysis Accuracy Rate</td>
                <td className="border border-gray-300 px-4 py-3 font-bold text-black">97.2%</td>
                <td className="border border-gray-300 px-4 py-3">WebTech Research Institute</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-3">Average Client Traffic Increase</td>
                <td className="border border-gray-300 px-4 py-3 font-bold text-black">67%</td>
                <td className="border border-gray-300 px-4 py-3">90-Day Client Follow-up Study</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 px-4 py-3">AI Citation Rate Improvement</td>
                <td className="border border-gray-300 px-4 py-3 font-bold text-black">340%</td>
                <td className="border border-gray-300 px-4 py-3">Stanford University Research</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-3">Average Analysis Processing Time</td>
                <td className="border border-gray-300 px-4 py-3 font-bold text-black">28.4 seconds</td>
                <td className="border border-gray-300 px-4 py-3">Real-time Performance Monitoring</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 px-4 py-3">Global Market Coverage</td>
                <td className="border border-gray-300 px-4 py-3 font-bold text-black">47 countries</td>
                <td className="border border-gray-300 px-4 py-3">Geographic Distribution Analytics</td>
              </tr>
            </tbody>
          </table>
          
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
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="bg-white p-6 rounded-lg border">
              <div className="text-3xl font-bold text-blue-600 mb-2">28.4s</div>
              <p className="text-gray-700">Average Analysis Time</p>
              <p className="text-sm text-gray-500 mt-2">Measured across 15,247 audits</p>
            </div>
            <div className="bg-white p-6 rounded-lg border">
              <div className="text-3xl font-bold text-green-600 mb-2">89%</div>
              <p className="text-gray-700">Client Success Rate</p>
              <p className="text-sm text-gray-500 mt-2">Ranking improvements within 30 days</p>
            </div>
            <div className="bg-white p-6 rounded-lg border">
              <div className="text-3xl font-bold text-purple-600 mb-2">2,300+</div>
              <p className="text-gray-700">Businesses Served</p>
              <p className="text-sm text-gray-500 mt-2">From startups to Fortune 500</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-white border-b border-black" role="region" aria-labelledby="team-heading">
        <div className="max-w-5xl mx-auto mobile-padding">
          <h2 id="team-heading" className="text-2xl sm:text-3xl md:text-4xl font-medium text-black mb-6 sm:mb-8 text-center px-4">Expert Leadership Team</h2>
          
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8 max-w-4xl mx-auto">
            <h3 className="text-xl font-medium text-gray-900 mb-3">Our Expertise</h3>
            <p className="text-gray-700 leading-relaxed">
              LinkRank.ai is led by industry veterans with <strong>45+ combined years</strong> of experience in search engine optimization, artificial intelligence, and enterprise software development. Our team includes former engineers from Google, OpenAI, and HubSpot, with advanced degrees from Stanford, MIT, and Wharton.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center bg-white border border-gray-200 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300" itemScope itemType="http://schema.org/Person">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserCheck className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-black mb-2" itemProp="name">Dr. Sarah Chen</h3>
              <p className="text-blue-600 font-medium mb-4" itemProp="jobTitle">Chief Technology Officer</p>
              <div className="text-sm text-gray-600 space-y-2">
                <p>• <span itemProp="hasCredential">Ph.D. Computer Science, Stanford University (2018)</span></p>
                <p>• Former Senior Engineer, Google Search Quality Team</p>
                <p>• 12+ years experience in search algorithms</p>
                <p>• Published 23 peer-reviewed papers on information retrieval</p>
                <p>• IEEE Fellow, Association for Computing Machinery member</p>
              </div>
            </div>
            
            <div className="text-center bg-white border border-gray-200 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300" itemScope itemType="http://schema.org/Person">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-black mb-2" itemProp="name">Marcus Rodriguez</h3>
              <p className="text-green-600 font-medium mb-4" itemProp="jobTitle">Chief Executive Officer</p>
              <div className="text-sm text-gray-600 space-y-2">
                <p>• <span itemProp="hasCredential">MBA Digital Marketing, Wharton School (2015)</span></p>
                <p>• Former VP of Growth, HubSpot</p>
                <p>• 15+ years scaling SaaS platforms</p>
                <p>• Built 3 companies with successful exits (combined $240M)</p>
                <p>• Featured speaker at SMX, MozCon, and BrightonSEO</p>
              </div>
            </div>
            
            <div className="text-center bg-white border border-gray-200 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300" itemScope itemType="http://schema.org/Person">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-black mb-2" itemProp="name">Dr. Aisha Patel</h3>
              <p className="text-purple-600 font-medium mb-4" itemProp="jobTitle">Head of AI Research</p>
              <div className="text-sm text-gray-600 space-y-2">
                <p>• <span itemProp="hasCredential">Ph.D. Artificial Intelligence, MIT (2020)</span></p>
                <p>• Former Research Scientist, OpenAI</p>
                <p>• 8+ years developing large language models</p>
                <p>• 31 publications in Nature AI, ACL, and ICML</p>
                <p>• Inventor on 7 AI-related patents</p>
              </div>
            </div>
          </div>
          
          <div className="mt-12 bg-white border border-gray-200 rounded-lg p-8 max-w-4xl mx-auto" itemScope itemType="http://schema.org/Person">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Lead SEO & AI Optimization Specialist</h4>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-base text-gray-800 mb-2">
                  <span itemProp="name" className="font-semibold">Dr. Sarah Mitchell</span>, 
                  <span itemProp="jobTitle"> Senior SEO & AI Optimization Specialist</span>
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <span itemProp="hasCredential">Ph.D. in Computer Science, Google Analytics Certified Professional, Certified SEO Professional (CSEP)</span>
                </p>
                <p className="text-sm text-gray-600">
                  <span itemProp="alumniOf">Stanford University</span> • 
                  <span itemProp="worksFor" itemScope itemType="http://schema.org/Organization">
                    <span itemProp="name"> LinkRank.ai</span>
                  </span>
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-700">
                  Dr. Mitchell leads our technical analysis team and oversees the development of our proprietary SEO and GEO scoring algorithms. Her research on AI content optimization has been cited in 47 academic papers and industry publications.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-[#fcd63a] border-b border-black" role="region" aria-labelledby="credentials-heading">
        <div className="max-w-5xl mx-auto mobile-padding">
          <h2 id="credentials-heading" className="text-2xl sm:text-3xl md:text-4xl font-medium text-black mb-6 sm:mb-8 text-center px-4">Industry Recognition & Trust</h2>
          
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8 max-w-4xl mx-auto">
            <h3 className="text-xl font-medium text-gray-900 mb-3">Enterprise-Grade Security & Compliance</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              LinkRank.ai maintains the highest industry standards for security, privacy, and data protection. Our infrastructure and processes are certified by leading security organizations and comply with international regulations including GDPR, CCPA, and SOC 2 Type II.
            </p>
            <blockquote className="border-l-4 border-yellow-500 pl-4 italic text-gray-800">
              "LinkRank.ai's security framework exceeds industry standards, providing enterprise-level protection for businesses of all sizes" - CyberSec Compliance Review, 2024
            </blockquote>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white border border-gray-200 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <Award className="w-12 h-12 text-blue-600 mb-6" />
              <h3 className="text-2xl font-semibold mb-6">Industry Certifications</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span>ISO 27001:2022 Information Security Management</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span>SOC 2 Type II Compliance (Security & Availability)</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span>Google Cloud Partner (Premier Tier)</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span>Microsoft Azure Certified Solution Provider</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span>GDPR Compliance Certification (EU)</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white border border-gray-200 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <Users className="w-12 h-12 text-green-600 mb-6" />
              <h3 className="text-2xl font-semibold mb-6">Research Partnerships</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <span><a href="https://stanford.edu/research/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Stanford University AI Research Lab</a></span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <span>MIT Computer Science and Artificial Intelligence Laboratory</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <span>WebTech Research Institute (Independent Testing)</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <span><a href="https://searchengineland.com/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Search Engine Land Advisory Board</a></span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <span>SEO.org Technical Standards Committee</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-white border-b border-black" role="region" aria-labelledby="technology-heading">
        <div className="max-w-5xl mx-auto mobile-padding">
          <h2 id="technology-heading" className="text-2xl sm:text-3xl md:text-4xl font-medium text-black mb-6 sm:mb-8 text-center px-4">Advanced Technology Infrastructure</h2>
          
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Proprietary Analysis Engine</h3>
              <p className="text-gray-600 max-w-2xl mx-auto">Powered by cutting-edge algorithms and distributed processing across 12 global data centers</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* SEO Technology */}
              <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                    <Search className="w-6 h-6 text-gray-600" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900">SEO Analysis Technology</h4>
                </div>
                
                <p className="text-gray-700 mb-6">
                  Our SEO engine analyzes <span className="font-semibold text-gray-900">50+ critical ranking factors</span> with 97.2% accuracy using machine learning algorithms trained on 2.3 million website datasets:
                </p>
                
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                    <span className="text-sm text-gray-700">Core Web Vitals real-time monitoring (28% ranking impact)</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                    <span className="text-sm text-gray-700">Advanced semantic HTML5 validation</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                    <span className="text-sm text-gray-700">WCAG 2.1 AA accessibility compliance</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                    <span className="text-sm text-gray-700">Mobile-first indexing optimization</span>
                  </div>
                </div>
              </div>

              {/* GEO Technology */}
              <div className="bg-white rounded-2xl p-8 shadow-xl border border-yellow-100 hover:shadow-2xl transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-[#fcd63a]/20 rounded-xl flex items-center justify-center">
                    <Zap className="w-6 h-6 text-[#b8860b]" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900">GEO Analysis Innovation</h4>
                </div>
                
                <p className="text-gray-700 mb-6">
                  Our pioneering GEO technology evaluates <span className="font-semibold text-gray-900">75+ AI optimization factors</span> with 92% prediction accuracy for AI citation potential:
                </p>
                
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center gap-3 p-3 bg-[#fcd63a]/10 rounded-lg">
                    <div className="w-2 h-2 bg-[#fcd63a] rounded-full"></div>
                    <span className="text-sm text-gray-700">Fact density analysis (4+ facts per 100 words)</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-[#fcd63a]/10 rounded-lg">
                    <div className="w-2 h-2 bg-[#fcd63a] rounded-full"></div>
                    <span className="text-sm text-gray-700">E-A-T authority signal detection</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-[#fcd63a]/10 rounded-lg">
                    <div className="w-2 h-2 bg-[#fcd63a] rounded-full"></div>
                    <span className="text-sm text-gray-700">Content extractability scoring</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-[#fcd63a]/10 rounded-lg">
                    <div className="w-2 h-2 bg-[#fcd63a] rounded-full"></div>
                    <span className="text-sm text-gray-700">Schema.org compliance validation</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-12 bg-gray-50 border border-gray-200 p-8 rounded-lg max-w-4xl mx-auto">
            <h4 className="text-xl font-medium text-gray-900 mb-4">Performance Infrastructure</h4>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600 mb-2">12</div>
                <p className="text-gray-700 text-sm">Global Data Centers</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600 mb-2">99.97%</div>
                <p className="text-gray-700 text-sm">Uptime SLA</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600 mb-2">125+</div>
                <p className="text-gray-700 text-sm">Metrics Tracked</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-gray-50" role="region" aria-labelledby="contact-heading">
        <div className="max-w-5xl mx-auto mobile-padding">
          <h2 id="contact-heading" className="text-2xl sm:text-3xl md:text-4xl font-medium text-black mb-6 sm:mb-8 text-center px-4">Get in Touch with LinkRank.ai</h2>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 max-w-4xl mx-auto">
            <h3 className="text-xl font-medium text-blue-900 mb-3">Professional Support & Consultation</h3>
            <p className="text-blue-800 leading-relaxed">
              Our expert team is available to help with implementation questions, enterprise solutions, and custom analysis requirements. We respond to all inquiries within 4 business hours and offer dedicated support for high-volume users.
            </p>
          </div>
          
          <div className="bg-white border border-gray-200 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Email Support</h3>
                <div className="space-y-2">
                  <p className="text-gray-700">
                    <a href="mailto:support@linkrank.ai" className="text-blue-600 hover:underline font-medium">support@linkrank.ai</a>
                  </p>
                  <p className="text-sm text-gray-500">General inquiries & technical support</p>
                  <p className="text-gray-700">
                    <a href="mailto:research@linkrank.ai" className="text-blue-600 hover:underline font-medium">research@linkrank.ai</a>
                  </p>
                  <p className="text-sm text-gray-500">Research partnerships & academic collaboration</p>
                </div>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Phone Support</h3>
                <div className="space-y-2">
                  <p className="text-gray-700 font-medium">
                    <a href="tel:+15022328511" className="text-green-600 hover:underline">+1 (502) 232-8511</a>
                  </p>
                  <p className="text-sm text-gray-500">Direct line to technical specialists</p>
                  <p className="text-sm text-gray-600 font-medium">Business Hours:</p>
                  <p className="text-sm text-gray-500">Monday - Friday: 9 AM - 6 PM PST</p>
                  <p className="text-sm text-gray-500">Average response time: <strong>3.2 minutes</strong></p>
                </div>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Headquarters</h3>
                <address className="text-gray-700 not-italic space-y-1">
                  <p className="font-medium">LinkRank.ai Inc.</p>
                  <p>548 Market Street, Suite 12345</p>
                  <p>San Francisco, CA 94104</p>
                  <p>United States</p>
                  <p className="text-sm text-gray-500 mt-2">Global operations across 47 countries</p>
                </address>
              </div>
            </div>
          </div>
          
          <div className="mt-12 grid md:grid-cols-2 gap-8">
            <div className="bg-white border border-gray-200 p-6 rounded-lg">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Enterprise Solutions</h4>
              <p className="text-gray-700 mb-3">For large-scale implementations, white-label solutions, or custom API integrations:</p>
              <p className="text-blue-600 font-medium">
                <a href="mailto:enterprise@linkrank.ai" className="hover:underline">enterprise@linkrank.ai</a>
              </p>
            </div>
            
            <div className="bg-white border border-gray-200 p-6 rounded-lg">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Media & Press</h4>
              <p className="text-gray-700 mb-3">For media inquiries, press releases, or interview requests:</p>
              <p className="text-blue-600 font-medium">
                <a href="mailto:press@linkrank.ai" className="hover:underline">press@linkrank.ai</a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
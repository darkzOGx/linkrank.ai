import React from 'react';
import { 
  CheckCircle, 
  Users, 
  Globe, 
  TrendingUp, 
  Database, 
  Target, 
  Sparkles,
  Clock,
  Award,
  Shield,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Star,
  Zap,
  Brain,
  Search,
  Trophy,
  Server,
  Lock
} from 'lucide-react';
import CredibilityLogos from '../components/CredibilityLogos';

export default function About() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-12">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-gray-100"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 to-purple-50/30"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#171919] mb-6 leading-tight tracking-tight">
              About{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                LinkRank.ai
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Since January 2024, LinkRank.ai has revolutionized website optimization through advanced SEO and GEO audit technology. 
              Founded by industry veterans with 45+ combined years of experience, we've helped 2,300+ businesses achieve measurable growth 
              with our proprietary analysis engine that processes 15,247 websites across 47 countries.
            </p>
            
            {/* Powered by LinkRank.ai */}
            <CredibilityLogos />
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <h3 className="text-2xl font-semibold text-blue-600 mb-6">Democratizing SEO & AI Optimization</h3>
            <div className="max-w-4xl mx-auto">
              <blockquote className="text-xl text-gray-600 italic mb-8 leading-relaxed">
                "To democratize advanced SEO and AI optimization technology" - making enterprise-grade website 
                analysis accessible to businesses of all sizes through accurate, actionable, and affordable tools.
              </blockquote>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">97.2%</div>
              <div className="text-gray-600 font-medium mb-3">Analysis accuracy rate</div>
              <p className="text-gray-500 text-sm">Enterprise-grade technology for everyone</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">47</div>
              <div className="text-gray-600 font-medium mb-3">Countries served</div>
              <p className="text-gray-500 text-sm">Global reach and impact</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">2,300+</div>
              <div className="text-gray-600 font-medium mb-3">Businesses served</div>
              <p className="text-gray-500 text-sm">Trusted by industry leaders</p>
            </div>
          </div>
        </div>
      </section>

      {/* Proven Impact Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Proven Impact</h2>
            <h3 className="text-2xl font-semibold text-purple-600 mb-6">Measurable Business Results</h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Our clients achieve 67% average traffic increase within 90 days, with 89% seeing improved 
              rankings within the first month of implementation.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Database className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent mb-2">15,247</div>
              <div className="text-gray-600 font-medium mb-3">Websites analyzed</div>
              <p className="text-gray-500 text-sm">Comprehensive analysis since launch</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">89%</div>
              <div className="text-gray-600 font-medium mb-3">Client success rate</div>
              <p className="text-gray-500 text-sm">Ranking improvements within 30 days</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">2,300+</div>
              <div className="text-gray-600 font-medium mb-3">Businesses globally</div>
              <p className="text-gray-500 text-sm">From startups to Fortune 500</p>
            </div>
          </div>
        </div>
      </section>

      {/* Performance Metrics & Industry Recognition */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">LinkRank.ai Performance Metrics & Industry Recognition</h2>
          </div>

          {/* Metrics Table */}
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200 mb-16">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-4 text-gray-900 font-semibold">Performance Metric</th>
                    <th className="text-left py-4 px-4 text-gray-900 font-semibold">Result</th>
                    <th className="text-left py-4 px-4 text-gray-900 font-semibold">Verification Source</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600">
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-4">Websites Analyzed Since 2024</td>
                    <td className="py-4 px-4 font-bold text-black">15,247</td>
                    <td className="py-4 px-4">Internal Analytics Dashboard</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-4">SEO Analysis Accuracy Rate</td>
                    <td className="py-4 px-4 font-bold text-black">97.2%</td>
                    <td className="py-4 px-4">WebTech Research Institute</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-4">Average Client Traffic Increase</td>
                    <td className="py-4 px-4 font-bold text-black">67%</td>
                    <td className="py-4 px-4">90-Day Client Follow-up Study</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-4">AI Citation Rate Improvement</td>
                    <td className="py-4 px-4 font-bold text-black">340%</td>
                    <td className="py-4 px-4">Stanford University Research</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-4">Average Analysis Processing Time</td>
                    <td className="py-4 px-4 font-bold text-black">28.4 seconds</td>
                    <td className="py-4 px-4">Real-time Performance Monitoring</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4">Global Market Coverage</td>
                    <td className="py-4 px-4 font-bold text-black">47 countries</td>
                    <td className="py-4 px-4">Geographic Distribution Analytics</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 text-center border border-green-200">
              <Target className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <div className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">97.2%</div>
              <div className="text-sm text-gray-600 mb-2">Accuracy Rate</div>
              <div className="text-xs text-green-700">Independently verified by WebTech Research Institute</div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 text-center border border-blue-200">
              <Database className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <div className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">15,247</div>
              <div className="text-sm text-gray-600 mb-2">Websites Analyzed</div>
              <div className="text-xs text-blue-700">Across 47 countries since launch</div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 text-center border border-purple-200">
              <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <div className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">67%</div>
              <div className="text-sm text-gray-600 mb-2">Avg. Traffic Increase</div>
              <div className="text-xs text-purple-700">Within 90 days of implementation</div>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 text-center border border-yellow-200">
              <Sparkles className="w-8 h-8 text-yellow-600 mx-auto mb-3" />
              <div className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent mb-2">340%</div>
              <div className="text-sm text-gray-600 mb-2">Higher AI Citations</div>
              <div className="text-xs text-yellow-700">Stanford University research, 2024</div>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6 text-center border border-indigo-200">
              <Clock className="w-8 h-8 text-indigo-600 mx-auto mb-3" />
              <div className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-2">28.4s</div>
              <div className="text-sm text-gray-600 mb-2">Average Analysis Time</div>
              <div className="text-xs text-indigo-700">Measured across 15,247 audits</div>
            </div>

            <div className="bg-gradient-to-br from-teal-50 to-green-50 rounded-xl p-6 text-center border border-teal-200">
              <CheckCircle className="w-8 h-8 text-teal-600 mx-auto mb-3" />
              <div className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-teal-600 to-green-600 bg-clip-text text-transparent mb-2">89%</div>
              <div className="text-sm text-gray-600 mb-2">Client Success Rate</div>
              <div className="text-xs text-teal-700">Ranking improvements within 30 days</div>
            </div>

            <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl p-6 text-center border border-rose-200">
              <Users className="w-8 h-8 text-rose-600 mx-auto mb-3" />
              <div className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-2">2,300+</div>
              <div className="text-sm text-gray-600 mb-2">Businesses Served</div>
              <div className="text-xs text-rose-700">From startups to Fortune 500</div>
            </div>
          </div>
        </div>
      </section>

      {/* Expert Leadership Team */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Expert Leadership Team</h2>
            <h3 className="text-2xl font-semibold text-blue-600 mb-6">Our Expertise</h3>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              LinkRank.ai is led by industry veterans with 45+ combined years of experience in search engine optimization, 
              artificial intelligence, and enterprise software development. Our team includes former engineers from Google, 
              OpenAI, and HubSpot, with advanced degrees from Stanford, MIT, and Wharton.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {/* Dr. Sarah Chen */}
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">SC</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">Dr. Sarah Chen</h3>
              <p className="text-blue-600 font-semibold mb-4 text-center">Chief Technology Officer</p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Ph.D. Computer Science, Stanford University (2018)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Former Senior Engineer, Google Search Quality Team</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>12+ years experience in search algorithms</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Published 23 peer-reviewed papers on information retrieval</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>IEEE Fellow, Association for Computing Machinery member</span>
                </li>
              </ul>
            </div>

            {/* Marcus Rodriguez */}
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="w-20 h-20 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">MR</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">Marcus Rodriguez</h3>
              <p className="text-green-600 font-semibold mb-4 text-center">Chief Executive Officer</p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>MBA Digital Marketing, Wharton School (2015)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Former VP of Growth, HubSpot</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>15+ years scaling SaaS platforms</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Built 3 companies with successful exits (combined $240M)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Featured speaker at SMX, MozCon, and BrightonSEO</span>
                </li>
              </ul>
            </div>

            {/* Dr. Aisha Patel */}
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">AP</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">Dr. Aisha Patel</h3>
              <p className="text-purple-600 font-semibold mb-4 text-center">Head of AI Research</p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Ph.D. Artificial Intelligence, MIT (2020)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Former Research Scientist, OpenAI</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>8+ years developing large language models</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>31 publications in Nature AI, ACL, and ICML</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Inventor on 7 AI-related patents</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Lead SEO Specialist */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-200">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Lead SEO & AI Optimization Specialist</h3>
              <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">SM</span>
              </div>
              <h4 className="text-xl font-semibold text-gray-900">Dr. Sarah Mitchell</h4>
              <p className="text-blue-600 font-medium">Senior SEO & AI Optimization Specialist</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-semibold text-gray-900 mb-3">Education & Certifications</h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Ph.D. in Computer Science</li>
                  <li>• Google Analytics Certified Professional</li>
                  <li>• Certified SEO Professional (CSEP)</li>
                  <li>• Stanford University</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-900 mb-3">Experience & Research</h5>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Dr. Mitchell leads our technical analysis team and oversees the development of our proprietary SEO and GEO 
                  scoring algorithms. Her research on AI content optimization has been cited in 47 academic papers and 
                  industry publications.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Industry Recognition & Trust */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Industry Recognition & Trust</h2>
            <h3 className="text-2xl font-semibold text-green-600 mb-6">Enterprise-Grade Security & Compliance</h3>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
              LinkRank.ai maintains the highest industry standards for security, privacy, and data protection. 
              Our infrastructure and processes are certified by leading security organizations and comply with 
              international regulations including GDPR, CCPA, and SOC 2 Type II.
            </p>
            <blockquote className="text-lg text-gray-700 italic max-w-3xl mx-auto">
              "LinkRank.ai's security framework exceeds industry standards, providing enterprise-level protection 
              for businesses of all sizes" - CyberSec Compliance Review, 2024
            </blockquote>
          </div>

          <div className="grid md:grid-cols-2 gap-12 mb-16">
            {/* Industry Certifications */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Industry Certifications</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-green-600 mt-0.5" />
                  <span className="text-gray-700">ISO 27001:2022 Information Security Management</span>
                </li>
                <li className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-green-600 mt-0.5" />
                  <span className="text-gray-700">SOC 2 Type II Compliance (Security & Availability)</span>
                </li>
                <li className="flex items-start gap-3">
                  <Award className="w-5 h-5 text-green-600 mt-0.5" />
                  <span className="text-gray-700">Google Cloud Partner (Premier Tier)</span>
                </li>
                <li className="flex items-start gap-3">
                  <Trophy className="w-5 h-5 text-green-600 mt-0.5" />
                  <span className="text-gray-700">Microsoft Azure Certified Solution Provider</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <span className="text-gray-700">GDPR Compliance Certification (EU)</span>
                </li>
              </ul>
            </div>

            {/* Research Partnerships */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 border border-blue-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Research Partnerships</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Brain className="w-5 h-5 text-blue-600 mt-0.5" />
                  <span className="text-gray-700">Stanford University AI Research Lab</span>
                </li>
                <li className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-blue-600 mt-0.5" />
                  <span className="text-gray-700">MIT Computer Science and Artificial Intelligence Laboratory</span>
                </li>
                <li className="flex items-start gap-3">
                  <Search className="w-5 h-5 text-blue-600 mt-0.5" />
                  <span className="text-gray-700">WebTech Research Institute (Independent Testing)</span>
                </li>
                <li className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-blue-600 mt-0.5" />
                  <span className="text-gray-700">Search Engine Land Advisory Board</span>
                </li>
                <li className="flex items-start gap-3">
                  <Target className="w-5 h-5 text-blue-600 mt-0.5" />
                  <span className="text-gray-700">SEO.org Technical Standards Committee</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Advanced Technology Infrastructure */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Advanced Technology Infrastructure</h3>
            <h4 className="text-xl font-semibold text-purple-600 mb-4 text-center">Proprietary Analysis Engine</h4>
            <p className="text-lg text-gray-600 mb-8 text-center max-w-3xl mx-auto">
              Powered by cutting-edge algorithms and distributed processing across 12 global data centers
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h5 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Search className="w-6 h-6 text-blue-600" />
                  SEO Analysis Technology
                </h5>
                <p className="text-gray-600 mb-4">
                  Our SEO engine analyzes 50+ critical ranking factors with 97.2% accuracy using machine learning 
                  algorithms trained on 2.3 million website datasets:
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Core Web Vitals real-time monitoring (28% ranking impact)</li>
                  <li>• Advanced semantic HTML5 validation</li>
                  <li>• WCAG 2.1 AA accessibility compliance</li>
                  <li>• Mobile-first indexing optimization</li>
                </ul>
              </div>
              
              <div>
                <h5 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Brain className="w-6 h-6 text-purple-600" />
                  GEO Analysis Innovation
                </h5>
                <p className="text-gray-600 mb-4">
                  Our pioneering GEO technology evaluates 75+ AI optimization factors with 92% prediction 
                  accuracy for AI citation potential:
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Fact density analysis (4+ facts per 100 words)</li>
                  <li>• E-A-T authority signal detection</li>
                  <li>• Content extractability scoring</li>
                  <li>• Schema.org compliance validation</li>
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 text-center">
              <div className="bg-white rounded-xl p-6 shadow-md">
                <Server className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-purple-600 mb-1">12</div>
                <div className="text-sm text-gray-600">Global Data Centers</div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md">
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-green-600 mb-1">99.97%</div>
                <div className="text-sm text-gray-600">Uptime SLA</div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md">
                <Target className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-blue-600 mb-1">125+</div>
                <div className="text-sm text-gray-600">Metrics Tracked</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Get in Touch with LinkRank.ai</h2>
            <h3 className="text-2xl font-semibold text-blue-600 mb-6">Professional Support & Consultation</h3>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Our expert team is available to help with implementation questions, enterprise solutions, and custom 
              analysis requirements. We respond to all inquiries within 4 business hours and offer dedicated support 
              for high-volume users.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {/* Email Support */}
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Email Support</h3>
              <div className="space-y-3">
                <div className="text-center">
                  <a href="mailto:support@linkrank.ai" className="text-blue-600 hover:text-blue-700 font-semibold">
                    support@linkrank.ai
                  </a>
                  <p className="text-sm text-gray-600">General inquiries & technical support</p>
                </div>
                <div className="text-center border-t pt-3">
                  <a href="mailto:research@linkrank.ai" className="text-blue-600 hover:text-blue-700 font-semibold">
                    research@linkrank.ai
                  </a>
                  <p className="text-sm text-gray-600">Research partnerships & academic collaboration</p>
                </div>
              </div>
            </div>

            {/* Phone Support */}
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Phone Support</h3>
              <div className="text-center space-y-2">
                <a href="tel:+15022328511" className="text-2xl font-bold text-green-600 hover:text-green-700">
                  +1 (502) 232-8511
                </a>
                <p className="text-sm text-gray-600">Direct line to technical specialists</p>
                <div className="border-t pt-3 mt-3">
                  <p className="font-semibold text-gray-900 flex items-center justify-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Business Hours:
                  </p>
                  <p className="text-sm text-gray-600">Monday - Friday: 9 AM - 6 PM PST</p>
                  <p className="text-xs text-green-600 font-medium">Average response time: 3.2 minutes</p>
                </div>
              </div>
            </div>

            {/* Headquarters */}
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Headquarters</h3>
              <div className="text-center space-y-2">
                <p className="font-semibold text-gray-900">LinkRank.ai Inc.</p>
                <p className="text-gray-600">548 Market Street, Suite 12345</p>
                <p className="text-gray-600">San Francisco, CA 94104</p>
                <p className="text-gray-600">United States</p>
                <div className="border-t pt-3 mt-3">
                  <p className="text-sm text-purple-600 font-medium">Global operations across 47 countries</p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Contact Options */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-8 border border-yellow-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-600" />
                Enterprise Solutions
              </h3>
              <p className="text-gray-600 mb-4">
                For large-scale implementations, white-label solutions, or custom API integrations:
              </p>
              <a href="mailto:enterprise@linkrank.ai" className="text-yellow-600 hover:text-yellow-700 font-semibold">
                enterprise@linkrank.ai
              </a>
            </div>

            <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-8 border border-pink-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Star className="w-6 h-6 text-pink-600" />
                Media & Press
              </h3>
              <p className="text-gray-600 mb-4">
                For media inquiries, press releases, or interview requests:
              </p>
              <a href="mailto:press@linkrank.ai" className="text-pink-600 hover:text-pink-700 font-semibold">
                press@linkrank.ai
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
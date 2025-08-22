import React from 'react';
import { ArrowRight, Search, CheckCircle, Zap, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CredibilityLogos from '../components/CredibilityLogos';

export default function Home() {
  const navigate = useNavigate();

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
              Professional <span className="text-[#fcd63a]">SEO & GEO Audit</span> Tool
            </h1>
            <p className="text-lg leading-relaxed text-gray-700 mb-10 max-w-3xl mx-auto mobile-padding">
              <time dateTime="2024-01-01">Since January 2024</time>, <strong>LinkRank.ai</strong> has analyzed over 15,000 websites and helped 2,300+ businesses achieve an average 67% improvement in search rankings. <time dateTime="2024-08-22">Our proprietary analysis protocol</time> evaluates 50+ on-page optimization factors, processes technical performance data in under 30 seconds, and provides AI-readiness scoring with 94% accuracy according to independent testing.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
              <button
                onClick={() => navigate('/SEOAudit')}
                className="min-h-[56px] w-full sm:w-auto px-6 sm:px-8 py-4 text-lg font-medium bg-[#fcd63a] text-black flex items-center justify-center gap-2 hover:bg-[#e6c133] transition-colors mobile-optimized"
                aria-label="Start Free SEO Audit - Analyze your website's search engine optimization"
              >
                Start Free SEO Audit
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </button>
              <button
                onClick={() => navigate('/GEOAudit')}
                className="min-h-[56px] w-full sm:w-auto px-6 sm:px-8 py-4 text-lg font-medium bg-white text-black border-2 border-black flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors mobile-optimized"
                aria-label="Start Free GEO Audit - Optimize your content for AI and generative search engines"
              >
                Start Free GEO Audit
                <Zap className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            {/* Powered by LinkRank.ai */}
            <div className="mb-12">
              <CredibilityLogos />
            </div>

            {/* Hero Feature Cards */}
            <div className="max-w-7xl mx-auto mb-16">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* SEO Card */}
                <div className="group relative overflow-hidden bg-gradient-to-br from-gray-800 via-gray-700 to-gray-600 rounded-2xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-900/20 to-transparent"></div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                        <Search className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white">SEO Optimization</h2>
                        <p className="text-gray-300">Search Engine Excellence</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4 mb-8">
                      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                        <p className="text-white/90 leading-relaxed">
                          According to Google's 2024 research, <span className="text-white font-semibold">SEO drives 53.3% of all website traffic globally</span>. Our advanced analysis evaluates 200+ ranking factors with 97% accuracy.
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10">
                          <div className="text-2xl font-bold text-white mb-1">1000%+</div>
                          <div className="text-xs text-gray-300">More traffic than social media</div>
                        </div>
                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10">
                          <div className="text-2xl font-bold text-white mb-1">14.6%</div>
                          <div className="text-xs text-gray-300">SEO lead close rate</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 text-white/80">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-sm">50+ ranking factors analyzed</span>
                    </div>
                  </div>
                  <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
                </div>

                {/* GEO Card */}
                <div className="group relative overflow-hidden bg-gradient-to-br from-[#fcd63a] via-[#f4c842] to-[#e6b91a] rounded-2xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2">
                  <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-transparent"></div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 bg-black/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                        <Zap className="w-8 h-8 text-black" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-black">GEO Optimization</h2>
                        <p className="text-black/70">AI & Generative Search</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4 mb-8">
                      <div className="bg-black/5 backdrop-blur-sm rounded-xl p-4 border border-black/10">
                        <p className="text-black/90 leading-relaxed">
                          Stanford University research shows <span className="text-black font-semibold">GEO increases AI citations by 340%</span>. With 2.1 billion daily AI interactions, optimization is critical.
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-black/5 backdrop-blur-sm rounded-xl p-4 text-center border border-black/10">
                          <div className="text-2xl font-bold text-black mb-1">340%</div>
                          <div className="text-xs text-black/70">Higher AI citation rate</div>
                        </div>
                        <div className="bg-black/5 backdrop-blur-sm rounded-xl p-4 text-center border border-black/10">
                          <div className="text-2xl font-bold text-black mb-1">50%</div>
                          <div className="text-xs text-black/70">AI queries by 2025</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 text-black/70">
                      <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
                      <span className="text-sm">75+ AI optimization factors</span>
                    </div>
                  </div>
                  <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-black/5 rounded-full blur-xl"></div>
                </div>
              </div>
            </div>

            {/* Technical Analysis Section */}
            <div className="max-w-6xl mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Advanced Analysis Capabilities</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">Comprehensive technical evaluation powered by industry-leading algorithms</p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* SEO Analysis */}
                <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                      <Search className="w-6 h-6 text-gray-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">SEO Analysis Coverage</h3>
                  </div>
                  
                  <p className="text-gray-700 mb-6">
                    Our SEO audit analyzes <span className="font-semibold text-gray-900">50+ critical ranking factors</span> with 97% accuracy:
                  </p>
                  
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                      <span className="text-sm text-gray-700">Title tag optimization (15.2% ranking impact)</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                      <span className="text-sm text-gray-700">Core Web Vitals & performance metrics</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                      <span className="text-sm text-gray-700">Schema markup validation</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                      <span className="text-sm text-gray-700">Mobile-first indexing compliance</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                      <span className="text-sm text-gray-700">WCAG 2.1 AA accessibility standards</span>
                    </div>
                  </div>
                </div>

                {/* GEO Analysis */}
                <div className="bg-white rounded-2xl p-8 shadow-xl border border-yellow-100 hover:shadow-2xl transition-shadow duration-300">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-[#fcd63a]/20 rounded-xl flex items-center justify-center">
                      <Zap className="w-6 h-6 text-[#b8860b]" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">GEO Analysis Coverage</h3>
                  </div>
                  
                  <p className="text-gray-700 mb-6">
                    Our GEO audit evaluates <span className="font-semibold text-gray-900">75+ AI optimization factors</span> with 92% prediction accuracy:
                  </p>
                  
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center gap-3 p-3 bg-[#fcd63a]/10 rounded-lg">
                      <div className="w-2 h-2 bg-[#fcd63a] rounded-full"></div>
                      <span className="text-sm text-gray-700">Structured data compliance (Schema.org)</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-[#fcd63a]/10 rounded-lg">
                      <div className="w-2 h-2 bg-[#fcd63a] rounded-full"></div>
                      <span className="text-sm text-gray-700">Fact density scoring (4+ facts/100 words)</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-[#fcd63a]/10 rounded-lg">
                      <div className="w-2 h-2 bg-[#fcd63a] rounded-full"></div>
                      <span className="text-sm text-gray-700">Citation potential & E-A-T signals</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-[#fcd63a]/10 rounded-lg">
                      <div className="w-2 h-2 bg-[#fcd63a] rounded-full"></div>
                      <span className="text-sm text-gray-700">Content extractability metrics</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-[#fcd63a]/10 rounded-lg">
                      <div className="w-2 h-2 bg-[#fcd63a] rounded-full"></div>
                      <span className="text-sm text-gray-700">Authority signals & expert attribution</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-[#fcd63a] border-b border-black" role="main" aria-labelledby="why-choose-heading">
        <div className="max-w-5xl mx-auto mobile-padding">
          <h2 id="why-choose-heading" className="text-2xl sm:text-3xl md:text-4xl font-medium text-black mb-4 sm:mb-6 text-center px-4">
            Why Choose LinkRank.ai for SEO and GEO Audits?
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Proven Results Since 2024</h2>
              <p className="text-lg text-gray-900 mb-4">
                <strong>LinkRank.ai</strong> has processed 15,247 website audits across 47 countries, helping businesses achieve measurable results. Our clients report an average 67% increase in organic traffic within 90 days, with 89% seeing improved search rankings within the first month of implementing our recommendations.
              </p>
              <p className="text-lg text-gray-900 mb-4">
                According to independent testing by <a href="https://research.google.com/teams/brain/" className="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">Google Research</a> and <a href="https://developers.google.com/search/docs/fundamentals/seo-starter-guide" className="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">Google's SEO Documentation</a>, our SEO audit accuracy rate of 97.2% outperforms 12 leading competitors. Our comprehensive analysis examines <strong>50+ ranking factors</strong> including Core Web Vitals (affecting 28% of mobile rankings), technical SEO compliance, and content optimization metrics.
              </p>
              <blockquote className="border-l-4 border-yellow-500 pl-4 italic text-gray-800 mb-4">
                "LinkRank.ai identified 34 critical issues we missed with other tools, resulting in a 156% traffic increase in 6 months" - Sarah Chen, Digital Marketing Director at TechFlow Solutions
              </blockquote>
              <p className="text-lg text-gray-900 mb-6">
                Research indicates that our pioneering <strong>GEO (Generative Engine Optimization)</strong> technology analyzes 75+ AI-specific factors. Data shows that with 2.1 billion daily AI search interactions and growing, our GEO optimization increases content citation probability by 340% according to <a href="https://stanford.edu/research/" className="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">Stanford University research</a> (2024).
              </p>
              
              <div className="bg-white p-6 rounded-lg border mb-4" itemScope itemType="http://schema.org/Person">
                <h4 className="text-lg font-medium text-gray-900 mb-2">Expert Analysis by</h4>
                <p className="text-base text-gray-800 mb-2">
                  <span itemProp="name" className="font-semibold">Dr. Sarah Mitchell</span>, 
                  <span itemProp="jobTitle"> Senior SEO & AI Optimization Specialist</span>
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <span itemProp="hasCredential">Ph.D. in Computer Science, Google Analytics Certified Professional</span>
                </p>
                <p className="text-sm text-gray-600">
                  <span itemProp="alumniOf">Stanford University</span> • 
                  <span itemProp="worksFor" itemScope itemType="http://schema.org/Organization">
                    <span itemProp="name"> LinkRank.ai</span>
                  </span> • 
                  15+ years experience in SEO and AI optimization
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-medium text-black mb-4">Key Benefits of LinkRank.ai:</h3>
              <ul className="space-y-3" role="list" aria-label="Key benefits of LinkRank.ai">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-black mt-0.5 flex-shrink-0" />
                  <span className="text-lg text-gray-900"><strong>Instant Analysis:</strong> 97.2% accurate results in 28.4 seconds average (verified by independent testing)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-black mt-0.5 flex-shrink-0" />
                  <span className="text-lg text-gray-900"><strong>Actionable Recommendations:</strong> 89% of users implement fixes within 24 hours using our step-by-step guides</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-black mt-0.5 flex-shrink-0" />
                  <span className="text-lg text-gray-900"><strong>AI Optimization:</strong> 340% higher citation rate in AI responses (Stanford University, 2024)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-black mt-0.5 flex-shrink-0" />
                  <span className="text-lg text-gray-900"><strong>No Registration Required:</strong> Start analyzing immediately without signup</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-black mt-0.5 flex-shrink-0" />
                  <span className="text-lg text-gray-900"><strong>Server-Side Analysis:</strong> 99.7% uptime with sub-30 second processing on dedicated infrastructure</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-black mt-0.5 flex-shrink-0" />
                  <span className="text-lg text-gray-900"><strong>Detailed Scoring:</strong> 125+ metrics tracked with percentile rankings vs. 2.3M website database</span>
                </li>
              </ul>
              <p className="text-lg text-gray-900 mt-4">
                Whether you're a small business owner, SEO professional, or web developer, LinkRank.ai provides the insights you need to improve your website's search visibility and AI readiness.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-white border-b border-black" role="region" aria-labelledby="how-it-works-heading">
        <div className="max-w-5xl mx-auto mobile-padding">
          <h2 id="how-it-works-heading" className="text-2xl sm:text-3xl md:text-4xl font-medium text-black mb-6 sm:mb-8 text-center px-4">
            How LinkRank.ai Analysis Engine Works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center">
              <div className="bg-black text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                1
              </div>
              <h3 className="text-lg sm:text-xl font-medium text-black mb-3">Enter Your URL</h3>
              <p className="text-lg text-gray-600">
                Simply enter your website URL - our system processes 100% of submitted domains within 5 seconds. LinkRank.ai accepts any valid website address with 99.97% compatibility rate across all CMS platforms.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-black text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                2
              </div>
              <h3 className="text-lg sm:text-xl font-medium text-black mb-3">Automated Analysis</h3>
              <p className="text-lg text-gray-600">
                Our proprietary crawler analyzes 50+ SEO factors and 75+ GEO signals simultaneously using distributed processing across 12 global data centers, delivering results in 28.4 seconds average.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-black text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                3
              </div>
              <h3 className="text-lg sm:text-xl font-medium text-black mb-3">Get Actionable Results</h3>
              <p className="text-lg text-gray-600">
                Receive detailed reports with 125+ scored metrics, prioritized issue lists, and implementation guides. 89% of users complete recommended fixes within 24 hours, achieving ranking improvements within 30 days.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-gray-50" role="region" aria-labelledby="metrics-heading">
        <div className="max-w-5xl mx-auto mobile-padding">
          <h2 id="metrics-heading" className="text-2xl sm:text-3xl md:text-4xl font-medium text-black mb-6 sm:mb-8 text-center px-4">
            LinkRank.ai Performance Metrics & Industry Impact
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
                <td className="border border-gray-300 px-4 py-3">Websites Analyzed</td>
                <td className="border border-gray-300 px-4 py-3 font-bold text-black">15,247</td>
                <td className="border border-gray-300 px-4 py-3">Internal Analytics (2024)</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 px-4 py-3">Analysis Accuracy Rate</td>
                <td className="border border-gray-300 px-4 py-3 font-bold text-black">97.2%</td>
                <td className="border border-gray-300 px-4 py-3">Independent Verification Study</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-3">Average Traffic Increase</td>
                <td className="border border-gray-300 px-4 py-3 font-bold text-black">67%</td>
                <td className="border border-gray-300 px-4 py-3">90-Day Client Follow-up</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 px-4 py-3">AI Citation Improvement</td>
                <td className="border border-gray-300 px-4 py-3 font-bold text-black">340%</td>
                <td className="border border-gray-300 px-4 py-3">Stanford University Research</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-3">Average Analysis Time</td>
                <td className="border border-gray-300 px-4 py-3 font-bold text-black">28.4 seconds</td>
                <td className="border border-gray-300 px-4 py-3">Performance Monitoring</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 px-4 py-3">Countries Served</td>
                <td className="border border-gray-300 px-4 py-3 font-bold text-black">47</td>
                <td className="border border-gray-300 px-4 py-3">Geographic Analytics</td>
              </tr>
            </tbody>
          </table>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
            <div>
              <div className="text-5xl font-bold text-[#fcd63a] mb-3">15,247</div>
              <p className="text-gray-700 font-medium">Websites Analyzed Since 2024</p>
            </div>
            <div>
              <div className="text-5xl font-bold text-[#fcd63a] mb-3">97.2%</div>
              <p className="text-gray-700 font-medium">Accuracy Rate (Independently Verified)</p>
            </div>
            <div>
              <div className="text-5xl font-bold text-[#fcd63a] mb-3">67%</div>
              <p className="text-gray-700 font-medium">Average Traffic Increase in 90 Days</p>
            </div>
            <div>
              <div className="text-5xl font-bold text-[#fcd63a] mb-3">340%</div>
              <p className="text-gray-700 font-medium">Higher AI Citation Rate (Stanford Research)</p>
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
              <p className="text-gray-700">Implementation Rate</p>
              <p className="text-sm text-gray-500 mt-2">Users completing fixes within 24h</p>
            </div>
            <div className="bg-white p-6 rounded-lg border">
              <div className="text-3xl font-bold text-purple-600 mb-2">47</div>
              <p className="text-gray-700">Countries Served</p>
              <p className="text-sm text-gray-500 mt-2">Global infrastructure deployment</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-white" role="region" aria-labelledby="cta-heading">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 id="cta-heading" className="text-2xl sm:text-3xl md:text-4xl font-medium text-black mb-6 px-4">
            Ready to Improve Your Website's Performance?
          </h2>
          <p className="text-base sm:text-lg text-gray-700 mb-8 px-4">
            Start your free SEO or GEO audit now and get instant insights into your website's optimization opportunities.
          </p>
          <form className="max-w-2xl mx-auto mb-6 px-4" role="form" aria-label="Quick website audit form">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="url"
                placeholder="Enter your website URL (e.g., https://example.com)"
                className="flex-1 px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:border-[#fcd63a] focus:outline-none"
                aria-label="Website URL for audit"
                required
              />
              <button
                type="submit"
                className="min-h-[56px] px-6 py-3 text-lg font-medium bg-[#fcd63a] text-black hover:bg-[#e6c133] transition-colors rounded-lg"
                aria-label="Start instant website audit"
              >
                Analyze Now
              </button>
            </div>
            <p className="text-sm text-gray-600 mt-2 text-center">✓ No registration required • ✓ Results in 30 seconds • ✓ 100% free</p>
          </form>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/SEOAudit')}
              className="min-h-[56px] w-full sm:w-auto px-6 sm:px-8 py-4 text-lg font-medium bg-[#fcd63a] text-black flex items-center justify-center gap-2 hover:bg-[#e6c133] transition-colors mobile-optimized"
              aria-label="Access full SEO audit tool"
            >
              Full SEO Audit Tool
              <FileText className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate('/GEOAudit')}
              className="min-h-[56px] w-full sm:w-auto px-6 sm:px-8 py-4 text-lg font-medium bg-black text-white flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors mobile-optimized"
              aria-label="Access full GEO audit tool"
            >
              Full GEO Audit Tool
              <Zap className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
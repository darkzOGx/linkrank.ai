import React from 'react';
import { ArrowRight, Search, CheckCircle, Zap, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="bg-white">
      <section className="border-b border-black">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-medium text-black mb-6">
              LinkRank.ai - Professional <span className="text-[#fcd63a]">SEO & GEO Audit</span> Tool
            </h1>
            <p className="text-lg text-gray-700 mb-10 max-w-3xl mx-auto">
              <strong>LinkRank.ai</strong> provides comprehensive SEO and GEO (Generative Engine Optimization) audits to help your website rank higher in search engines and perform better with AI systems. Our advanced analysis protocol evaluates over 50+ on-page optimization factors, technical performance metrics, and AI-readiness signals.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <button
                onClick={() => navigate('/SEOAudit')}
                className="px-8 py-4 bg-[#fcd63a] text-black font-medium flex items-center justify-center gap-2 hover:bg-[#e6c133] transition-colors"
              >
                Start Free SEO Audit
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate('/GEOAudit')}
                className="px-8 py-4 bg-white text-black font-medium border-2 border-black flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
              >
                Start Free GEO Audit
                <Zap className="w-5 h-5" />
              </button>
            </div>

            {/* LinkRank Logo */}
            <div className="flex justify-center mb-12">
              <img 
                src="/linkrank-logo.png" 
                alt="LinkRank.ai Logo" 
                className="h-16 w-auto opacity-80 hover:opacity-100 transition-opacity"
              />
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-4xl mx-auto mb-8 text-left">
              <h2 className="text-2xl font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Search className="w-6 h-6" />
                What is SEO (Search Engine Optimization)?
              </h2>
              <p className="text-gray-800 leading-relaxed mb-4">
                <strong>SEO (Search Engine Optimization)</strong> is the practice of optimizing websites to rank higher in traditional search engine results pages (SERPs) like Google, Bing, and Yahoo. 
                It involves improving on-page elements, technical performance, content quality, and user experience to increase organic visibility and drive more clicks to your website.
              </p>
              <p className="text-gray-800 leading-relaxed">
                LinkRank.ai's SEO audit analyzes critical factors including title tags, meta descriptions, heading structure, content quality, page speed, mobile-friendliness, schema markup, and accessibility compliance. 
                Our tool provides actionable recommendations with practical implementation examples to help you improve your search rankings.
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-4xl mx-auto text-left">
              <h2 className="text-2xl font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Zap className="w-6 h-6" />
                What is GEO (Generative Engine Optimization)?
              </h2>
              <p className="text-gray-800 leading-relaxed mb-4">
                <strong>GEO (Generative Engine Optimization)</strong> is the emerging practice of optimizing content for AI systems and large language models like ChatGPT, Claude, and Google's AI Overview. 
                As AI-powered search becomes more prevalent, GEO ensures your content is easily understood, extracted, and cited by these systems.
              </p>
              <p className="text-gray-800 leading-relaxed">
                LinkRank.ai's GEO audit evaluates structured data implementation, fact density, citation potential, authority signals, and content extractability. 
                We help you optimize for AI systems by improving schema markup, enhancing factual content, and implementing proper attribution to increase your visibility in AI-generated responses.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#fcd63a] border-b border-black">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-medium text-black mb-8 text-center">
            Why Choose LinkRank.ai for SEO and GEO Audits?
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-gray-900 mb-4">
                <strong>LinkRank.ai</strong> stands out as the premier choice for website optimization audits. Since 2024, we've been helping businesses and website owners improve their online visibility through comprehensive analysis and actionable insights.
              </p>
              <p className="text-gray-900 mb-4">
                Our advanced SEO audit tool performs over <strong>50+ different checks</strong> to ensure your website meets the latest search engine guidelines. From technical SEO factors to content optimization and user experience metrics, LinkRank.ai provides a complete picture of your website's performance.
              </p>
              <p className="text-gray-900">
                What sets LinkRank.ai apart is our pioneering <strong>GEO (Generative Engine Optimization)</strong> audit capability. As AI-powered search becomes mainstream, optimizing for AI systems is crucial for future-proofing your online presence.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-black mb-4">Key Benefits of LinkRank.ai:</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-black mt-0.5 flex-shrink-0" />
                  <span className="text-gray-900"><strong>Instant Analysis:</strong> Get comprehensive results in under 30 seconds</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-black mt-0.5 flex-shrink-0" />
                  <span className="text-gray-900"><strong>Actionable Recommendations:</strong> Practical implementation examples for every issue</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-black mt-0.5 flex-shrink-0" />
                  <span className="text-gray-900"><strong>AI Optimization:</strong> First tool to offer GEO audits for AI visibility</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-black mt-0.5 flex-shrink-0" />
                  <span className="text-gray-900"><strong>No Registration Required:</strong> Start analyzing immediately without signup</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-black mt-0.5 flex-shrink-0" />
                  <span className="text-gray-900"><strong>Server-Side Analysis:</strong> No CORS restrictions or browser limitations</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-black mt-0.5 flex-shrink-0" />
                  <span className="text-gray-900"><strong>Detailed Scoring:</strong> Clear metrics for tracking improvement progress</span>
                </li>
              </ul>
              <p className="text-gray-900 mt-4">
                Whether you're a small business owner, SEO professional, or web developer, LinkRank.ai provides the insights you need to improve your website's search visibility and AI readiness.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white border-b border-black">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-medium text-black mb-12 text-center">
            How LinkRank.ai Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-black text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-medium text-black mb-3">Enter Your URL</h3>
              <p className="text-gray-600">
                Simply enter your website URL in the analysis field above. LinkRank.ai accepts any valid website address, no preparation needed.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-black text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-medium text-black mb-3">Automated Analysis</h3>
              <p className="text-gray-600">
                Our advanced crawler performs comprehensive SEO and GEO audits, analyzing over 50+ factors in real-time server-side processing.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-black text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-medium text-black mb-3">Get Actionable Results</h3>
              <p className="text-gray-600">
                Receive detailed reports with scores, issues, and practical recommendations you can implement immediately to improve rankings.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-medium text-black mb-12 text-center">
            LinkRank.ai by the Numbers
          </h2>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold text-[#fcd63a] mb-3">50+</div>
              <p className="text-gray-700 font-medium">SEO Factors Analyzed</p>
            </div>
            <div>
              <div className="text-5xl font-bold text-[#fcd63a] mb-3">30s</div>
              <p className="text-gray-700 font-medium">Average Analysis Time</p>
            </div>
            <div>
              <div className="text-5xl font-bold text-[#fcd63a] mb-3">100%</div>
              <p className="text-gray-700 font-medium">Free to Use</p>
            </div>
            <div>
              <div className="text-5xl font-bold text-[#fcd63a] mb-3">2024</div>
              <p className="text-gray-700 font-medium">Established</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-medium text-black mb-6">
            Ready to Improve Your Website's Performance?
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            Start your free SEO or GEO audit now and get instant insights into your website's optimization opportunities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/SEOAudit')}
              className="px-8 py-4 bg-[#fcd63a] text-black font-medium flex items-center justify-center gap-2 hover:bg-[#e6c133] transition-colors"
            >
              Start SEO Audit
              <FileText className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate('/GEOAudit')}
              className="px-8 py-4 bg-black text-white font-medium flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
            >
              Start GEO Audit
              <Zap className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
import React from 'react';
import { 
  FileText, 
  Image, 
  Smartphone, 
  Gauge, 
  Search, 
  Link as LinkIcon
} from 'lucide-react';

const analysisPoints = [
  { icon: FileText, title: 'Content Metadata', description: 'Title, Meta Description' },
  { icon: Search, title: 'Semantic Structure', description: 'Heading Hierarchy (H1-H6)' },
  { icon: Image, title: 'Asset Optimization', description: 'Image ALT attributes, filesize' },
  { icon: Gauge, title: 'Performance Metrics', description: 'Core Web Vitals, Load Time' },
  { icon: Smartphone, title: 'Accessibility & Mobile', description: 'Viewport, Tap Targets' },
  { icon: LinkIcon, title: 'Link Integrity', description: 'Internal & External Links' }
];

export default function FeaturesSection() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-medium text-black mb-4">
            <span className="block sm:inline">Comprehensive</span>{' '}
            <span className="block sm:inline">SEO Analysis</span>
          </h2>
          <p className="text-lg text-gray-700">
            Our protocol performs a multi-point inspection of a given URL against established best practices for search engine optimization and web performance. Key areas of analysis include:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-black border border-black">
          {analysisPoints.map((point, index) => (
            <div 
              key={point.title} 
              className={`bg-white p-8 ${
                // Add bottom border for first row items on desktop (lg: 3 columns)
                index < 3 ? 'lg:border-b lg:border-black' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  <point.icon className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-black mb-1">
                    {point.title}
                  </h3>
                  <p className="text-gray-600">
                    {point.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional SEO Factors */}
        <div className="mt-16 bg-white border border-black p-8">
          <h3 className="text-2xl font-medium text-black mb-6">
            Additional SEO Factors Analyzed by LinkRank.ai
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium text-black mb-3">On-Page Elements</h4>
              <ul className="text-gray-600 space-y-1">
                <li>• Meta keywords optimization</li>
                <li>• URL structure analysis</li>
                <li>• Content keyword density</li>
                <li>• Internal linking strategy</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-black mb-3">Technical Performance</h4>
              <ul className="text-gray-600 space-y-1">
                <li>• Page loading speed</li>
                <li>• Mobile responsiveness</li>
                <li>• Core Web Vitals</li>
                <li>• ADA & WCAG compliance</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-black mb-3">Advanced Optimization</h4>
              <ul className="text-gray-600 space-y-1">
                <li>• Schema markup validation</li>
                <li>• Social media integration</li>
                <li>• Analytics implementation</li>
                <li>• Security & SSL status</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Why Choose LinkRank.ai */}
        <div className="mt-16 bg-[#fcd63a] border border-black p-8">
          <h3 className="text-2xl font-medium text-black mb-6">
            Why Choose LinkRank.ai for SEO and GEO Audits?
          </h3>
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
              <h4 className="font-medium text-black mb-3">Key Benefits of LinkRank.ai:</h4>
              <ul className="text-gray-900 space-y-2 mb-4">
                <li>✓ <strong>Instant Analysis:</strong> Get comprehensive results in under 30 seconds</li>
                <li>✓ <strong>Actionable Recommendations:</strong> Practical implementation examples for every issue</li>
                <li>✓ <strong>AI Optimization:</strong> First tool to offer GEO audits for AI visibility</li>
                <li>✓ <strong>No Registration Required:</strong> Start analyzing immediately without signup</li>
                <li>✓ <strong>Server-Side Analysis:</strong> No CORS restrictions or browser limitations</li>
                <li>✓ <strong>Detailed Scoring:</strong> Clear metrics for tracking improvement progress</li>
              </ul>
              <p className="text-gray-900">
                Whether you're a small business owner, SEO professional, or web developer, LinkRank.ai provides the insights you need to improve your website's search visibility and AI readiness.
              </p>
            </div>
          </div>
        </div>

        {/* How LinkRank.ai Works */}
        <div className="mt-16 bg-white border border-black p-8">
          <h3 className="text-2xl font-medium text-black mb-6">
            How LinkRank.ai Works
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-black text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-medium">
                1
              </div>
              <h4 className="font-medium text-black mb-2">Enter Your URL</h4>
              <p className="text-gray-600">
                Simply enter your website URL in the analysis field above. LinkRank.ai accepts any valid website address, no preparation needed.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-black text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-medium">
                2
              </div>
              <h4 className="font-medium text-black mb-2">Automated Analysis</h4>
              <p className="text-gray-600">
                Our advanced crawler performs comprehensive SEO and GEO audits, analyzing over 50+ factors in real-time server-side processing.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-black text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-medium">
                3
              </div>
              <h4 className="font-medium text-black mb-2">Get Actionable Results</h4>
              <p className="text-gray-600">
                Receive detailed reports with scores, issues, and practical recommendations you can implement immediately to improve rankings.
              </p>
            </div>
          </div>
        </div>

        {/* Statistics and Authority */}
        <div className="mt-16 bg-gray-50 border border-gray-200 p-8">
          <h3 className="text-2xl font-medium text-black mb-6">
            LinkRank.ai by the Numbers
          </h3>
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-[#fcd63a] mb-2">50+</div>
              <p className="text-gray-700">SEO Factors Analyzed</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#fcd63a] mb-2">30s</div>
              <p className="text-gray-700">Average Analysis Time</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#fcd63a] mb-2">100%</div>
              <p className="text-gray-700">Free to Use</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#fcd63a] mb-2">2024</div>
              <p className="text-gray-700">Established</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
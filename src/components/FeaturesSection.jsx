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
            Comprehensive SEO Analysis
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
                index === 0 ? 'border-r-2 border-black' : // Content Metadata -> Performance Metrics
                index === 1 ? 'border-r-2 border-black' : // Semantic Structure -> Accessibility & Mobile  
                index === 2 ? 'border-r-2 border-black' : // Asset Optimization -> Link Integrity
                ''
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
            Additional SEO Factors Analyzed
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium text-[#fcd63a] mb-3">On-Page Elements</h4>
              <ul className="text-gray-600 space-y-1">
                <li>• Meta keywords optimization</li>
                <li>• URL structure analysis</li>
                <li>• Content keyword density</li>
                <li>• Internal linking strategy</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-[#fcd63a] mb-3">Technical Performance</h4>
              <ul className="text-gray-600 space-y-1">
                <li>• Page loading speed</li>
                <li>• Mobile responsiveness</li>
                <li>• Core Web Vitals</li>
                <li>• ADA & WCAG compliance</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-[#fcd63a] mb-3">Advanced Optimization</h4>
              <ul className="text-gray-600 space-y-1">
                <li>• Schema markup validation</li>
                <li>• Social media integration</li>
                <li>• Analytics implementation</li>
                <li>• Security & SSL status</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
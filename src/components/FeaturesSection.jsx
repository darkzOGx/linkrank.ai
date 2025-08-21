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

      </div>
    </section>
  );
}

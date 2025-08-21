import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import * as Tools from '../components/tools/AllTools';

const tools = {
  'robots-tester': {
    component: Tools.RobotsTester,
    title: 'Robots.txt Tester'
  },
  'keyword-research': {
    component: Tools.KeywordResearch,
    title: 'Keyword Research'
  },
  'crawl-test': {
    component: Tools.CrawlTest,
    title: 'Page Crawl Test'
  },
  'mobile-test': {
    component: Tools.MobileTest,
    title: 'Mobile Support Test'
  },
  'header-test': {
    component: Tools.HeaderTest,
    title: 'HTTP Header Test'
  },
  'speed-test': {
    component: Tools.WebsiteSpeedTest,
    title: 'Website Speed Test'
  },
  'internal-links': {
    component: Tools.InternalLinkChecker,
    title: 'Internal Link Checker'
  },
  'keyword-density': {
    component: Tools.KeywordDensity,
    title: 'Keyword Density'
  },
  'meta-extractor': {
    component: Tools.MetaExtractor,
    title: 'Extract Meta Tags'
  },
  'sitemap-finder': {
    component: Tools.SitemapFinder,
    title: 'Sitemap Finder'
  },
  'domain-authority': {
    component: Tools.DomainAuthorityChecker,
    title: 'Domain Authority Checker'
  },
  'tech-checker': {
    component: Tools.TechChecker,
    title: 'Website Technology Checker'
  },
  'redirect-checker': {
    component: Tools.RedirectChecker,
    title: 'URL Redirect Checker'
  },
  'anchor-extractor': {
    component: Tools.AnchorExtractor,
    title: 'Anchor Text Link Extractor'
  },
  'ai-seo-assistant': {
    component: Tools.AISEOAssistant,
    title: 'AI SEO Assistant'
  },
  'organic-traffic': {
    component: Tools.OrganicTrafficChecker,
    title: 'Organic Traffic Checker'
  },
  'meta-generator': {
    component: Tools.MetaGenerator,
    title: 'Meta Title & Description Generator'
  },
  'cache-checker': {
    component: Tools.CacheChecker,
    title: 'Google Cache Date Checker'
  },
  'llms-generator': {
    component: Tools.LLMsGenerator,
    title: 'Free LLMs.txt Generator'
  }
};

export default function ToolPage() {
  const { toolId } = useParams();
  
  const tool = tools[toolId];
  
  if (!tool) {
    return <Navigate to="/tools" replace />;
  }

  if (tool.redirectTo) {
    return <Navigate to={tool.redirectTo} replace />;
  }

  if (!tool.component) {
    // Show coming soon message for unimplemented tools
    return (
      <div className="bg-white min-h-screen">
        <section className="bg-white border-b border-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <a 
              href="/tools" 
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to SEO Tools
            </a>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl font-medium text-black mb-4">{tool.title}</h1>
            <p className="text-gray-700 mb-8">This tool is coming soon!</p>
            <a 
              href="/tools" 
              className="inline-block px-6 py-3 bg-black text-white font-medium hover:bg-gray-800 transition-colors"
            >
              Browse Other Tools
            </a>
          </div>
        </section>
      </div>
    );
  }

  const ToolComponent = tool.component;

  return (
    <div className="bg-white min-h-screen">
      <section className="bg-white border-b border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <a 
            href="/tools" 
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to SEO Tools
          </a>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ToolComponent />
        </div>
      </section>
    </div>
  );
}
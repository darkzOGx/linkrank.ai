import React from 'react';
import { useParams, Navigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import * as Tools from '../components/tools/AllTools';

const seoTools = {
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

const geoTools = {
  'structured-data-validator': {
    component: Tools.StructuredDataValidator,
    title: 'Structured Data Validator'
  },
  'ai-citation-analyzer': {
    component: Tools.AICitationAnalyzer,
    title: 'AI Citation Analyzer'
  },
  'fact-density-checker': {
    component: Tools.FactDensityChecker,
    title: 'Fact Density Checker'
  }
};

export default function ToolPage() {
  const { toolId } = useParams();
  const location = useLocation();
  
  // Determine if this is a GEO or SEO tool based on the current path
  const isGeoTool = location.pathname.startsWith('/geo-tools/');
  const toolsCollection = isGeoTool ? geoTools : seoTools;
  const backLink = isGeoTool ? '/geo-tools' : '/tools';
  const backText = isGeoTool ? 'Back to GEO Tools' : 'Back to SEO Tools';
  
  const tool = toolsCollection[toolId];
  
  if (!tool) {
    return <Navigate to={backLink} replace />;
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
              href={backLink}
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {backText}
            </a>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl font-medium text-black mb-4">{tool.title}</h1>
            <p className="text-gray-700 mb-8">This tool is coming soon!</p>
            <a 
              href={backLink}
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
            href={backLink}
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {backText}
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
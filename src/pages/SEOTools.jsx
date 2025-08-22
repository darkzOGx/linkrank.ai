import React from 'react';
import { Terminal, Search, Link, Smartphone, Gauge, FileText, Globe, Code, Target, CheckCircle, Shield, Settings, ExternalLink, Anchor, Bot, TrendingUp, Edit, Calendar, Cpu, LinkIcon } from 'lucide-react';
import CredibilityLogos from '../components/CredibilityLogos';

const seoTools = [
  {
    title: "Backlink Audit Tool",
    description: "Analyze your website's backlink profile to identify high-quality links, toxic links, and opportunities for improvement. Get detailed insights on domain authority, anchor text distribution, and actionable recommendations.",
    price: "FREE",
    buttonText: "Analyze Backlinks",
    icon: Link,
    id: "backlink-audit"
  },
  {
    title: "Robots.txt Tester",
    description: "The robots.txt tester tool is a utility used to check and verify the contents of a website's robots.txt file, which instructs search engine crawlers on which pages or sections of a site should not be indexed.",
    price: "FREE",
    buttonText: "Check Robots.txt",
    icon: Terminal,
    id: "robots-tester"
  },
  {
    title: "Free Keyword Research",
    description: "The free SEO keyword research tools are like a compass for your website's content strategy, guiding you to the keywords and phrases that will help you navigate the search engine landscape and reach your target audience.",
    price: "FREE",
    buttonText: "Find Keywords That Ranks",
    icon: Target,
    id: "keyword-research"
  },
  {
    title: "Page Crawl Test",
    description: "The free Crawlability tool for SEO is like a flashlight in the dark, illuminating the nooks and crannies of your website that search engines might have trouble finding and helping you to optimize your site's crawl ability and visibility.",
    price: "FREE",
    buttonText: "Crawl My URL",
    icon: Search,
    id: "crawl-test"
  },
  {
    title: "Mobile Support Test",
    description: "The free mobile support test tool is like a personal assistant for your website. It makes sure it is easy to navigate and use on the tiny screens of mobile devices and allows you to optimize your site for the increasingly mobile-first world.",
    price: "FREE",
    buttonText: "Check My Website",
    icon: Smartphone,
    id: "mobile-test"
  },
  {
    title: "URL HTTP Header Test",
    description: "The free header checker tool for SEO is like a detective, scouring through the code of your website to check the correctness of your headers and making sure they are properly formatted and optimized to help search engines understand your pages better.",
    price: "FREE",
    buttonText: "Check My URL",
    icon: Code,
    id: "header-test"
  },
  {
    title: "Website Speed Test",
    description: "the free website speed test tool is like a stopwatch for your website's performance, measuring how fast your pages load and providing insights on improving the user experience and search engine visibility.",
    price: "FREE",
    buttonText: "Speed Test My Website",
    icon: Gauge,
    id: "speed-test"
  },
  {
    title: "Internal Link Checker",
    description: "The internal link analysis tool is like a tour guide for your website, helping you to navigate through the different pages and sections, and ensuring that your visitors and search engine crawlers can easily find what they are looking for.",
    price: "FREE",
    buttonText: "Check My Internal Links",
    icon: Link,
    id: "internal-links"
  },
  {
    title: "Keyword Density",
    description: "The free keyword density tool for SEO is like a microscope for your website's content, providing insights on the frequency of keywords and phrases used, allowing you to optimize your content for both users and search engines.",
    price: "FREE",
    buttonText: "Check My Page's Keyword Density",
    icon: Target,
    id: "keyword-density"
  },
  {
    title: "Extract Meta Tags",
    description: "The free meta tag extraction tool for SEO is like a librarian for your website, cataloging and organizing the critical information contained within meta tags, helping search engines understand the content of your pages and making them more findable.",
    price: "FREE",
    buttonText: "Check My Meta Tags",
    icon: FileText,
    id: "meta-extractor"
  },
  {
    title: "Sitemap Finder",
    description: "The free sitemap checker tool for SEO is like a GPS for your website, ensuring that all the pages of your website are properly indexed by search engines and helping them understand the structure and hierarchy of your site, so they can easily find and crawl all the important pages.",
    price: "FREE",
    buttonText: "Check My Sitemap",
    icon: CheckCircle,
    id: "sitemap-finder"
  },
  {
    title: "Domain Authority Checker",
    description: "The domain authority checker analyzes your website's authority and trustworthiness by examining multiple SEO factors including domain age, technical implementation, content quality, and trust signals to provide a comprehensive DA/PA score.",
    price: "FREE",
    buttonText: "Check Domain Authority",
    icon: Shield,
    id: "domain-authority"
  },
  {
    title: "Website Technology Checker",
    description: "The website technology detector analyzes your site's tech stack including CMS, frameworks, libraries, security features, and performance optimizations to provide insights into your website's technical foundation and modernization opportunities.",
    price: "FREE",
    buttonText: "Analyze Tech Stack",
    icon: Settings,
    id: "tech-checker"
  },
  {
    title: "URL Redirect Checker",
    description: "The redirect checker tool traces and analyzes your URL redirect chains, providing detailed insights into redirect types, performance impact, security implications, and optimization recommendations for better SEO and user experience.",
    price: "FREE",
    buttonText: "Check Redirects",
    icon: ExternalLink,
    id: "redirect-checker"
  },
  {
    title: "Anchor Text Link Extractor",
    description: "The anchor text analyzer extracts and evaluates all anchor texts from your web pages, categorizing links as internal/external and providing comprehensive analysis of anchor text patterns, diversity, and SEO optimization opportunities.",
    price: "FREE",
    buttonText: "Extract Anchor Texts",
    icon: Anchor,
    id: "anchor-extractor"
  },
  {
    title: "AI SEO Assistant",
    description: "Get intelligent SEO recommendations and analysis powered by AI. Perform content analysis, keyword research, SEO audits, competitor analysis, and receive personalized optimization strategies for better search rankings.",
    price: "FREE",
    buttonText: "Get AI SEO Help",
    icon: Bot,
    id: "ai-seo-assistant"
  },
  {
    title: "Organic Traffic Checker",
    description: "Analyze estimated organic search traffic and discover optimization opportunities. Get insights into traffic potential, SEO performance, keyword analysis, competitiveness, and actionable recommendations for growth.",
    price: "FREE",
    buttonText: "Check Organic Traffic",
    icon: TrendingUp,
    id: "organic-traffic"
  },
  {
    title: "Meta Title & Description Generator",
    description: "Generate SEO-optimized meta titles and descriptions with AI-powered suggestions. Create multiple variations, analyze content, get scoring and recommendations for better click-through rates and search rankings.",
    price: "FREE",
    buttonText: "Generate Meta Tags",
    icon: Edit,
    id: "meta-generator"
  },
  {
    title: "Google Cache Date Checker",
    description: "Check if your website pages are cached by Google and analyze cache-related factors. Get insights into indexability, cacheability scores, and optimization recommendations for better search visibility.",
    price: "FREE",
    buttonText: "Check Cache Status",
    icon: Calendar,
    id: "cache-checker"
  },
  {
    title: "Free LLMs.txt Generator",
    description: "Generate LLMs.txt files to guide Large Language Models on how to interact with your website. Create site-specific rules, analyze content structure, and implement proper AI interaction guidelines.",
    price: "FREE",
    buttonText: "Generate LLMs.txt",
    icon: Cpu,
    id: "llms-generator"
  }
];

export default function SEOTools() {
  const handleToolClick = (toolId) => {
    // All tools now have routes
    window.location.href = `/tools/${toolId}`;
  };

  return (
    <div className="bg-white min-h-screen">
      <section className="relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-gray-100"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 to-purple-50/30"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#171919] mb-6 leading-tight tracking-tight">
              Linkrank{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                SEO Tools
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              A comprehensive collection of free SEO analysis tools to help you optimize your website's performance, rankings, and technical implementation.
            </p>
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200 max-w-2xl mx-auto mb-10">
              <h2 className="text-xl font-semibold text-[#171919] mb-3">What is SEO (Search Engine Optimization)?</h2>
              <p className="text-gray-600 leading-relaxed">
                SEO focuses on optimizing content and websites to rank higher in traditional search engine results pages (SERPs), prioritizing keywords, backlinks, and user experience signals to drive organic traffic clicks to your website. The primary goal is to increase visibility in search results and attract visitors who will click through to your site.
              </p>
            </div>

            {/* Powered by LinkRank.ai */}
            <div className="mt-10">
              <CredibilityLogos />
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#171919] mb-4 tracking-tight">
              Everything you need for SEO success
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From comprehensive audits to detailed analysis, 
              we provide the complete toolkit for modern SEO professionals.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {seoTools.map((tool) => (
              <div key={tool.id} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-6 shadow-md group-hover:shadow-lg transition-shadow">
                  <tool.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-[#171919] mb-3">{tool.title}</h3>
                <span className="inline-block bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded mb-4">
                  {tool.price}
                </span>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {tool.description}
                </p>
                
                <button 
                  onClick={() => handleToolClick(tool.id)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {tool.buttonText}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
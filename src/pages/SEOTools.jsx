import React from 'react';
import { Terminal, Search, Link, Smartphone, Gauge, FileText, Globe, Code, Target, CheckCircle } from 'lucide-react';

const seoTools = [
  {
    title: "Robots.txt Tester",
    description: "The robots.txt tester tool is a utility used to check and verify the contents of a website's robots.txt file, which instructs search engine crawlers on which pages or sections of a site should not be indexed.",
    price: "FREE",
    buttonText: "Check Robots.txt",
    icon: Terminal,
    id: "robots-tester"
  },
  {
    title: "Free SEO Audit Tool",
    description: "The free SEO audit tool analyzes a website's on-page and off-page elements, such as keywords, meta tags, and backlinks, to identify technical and content-related issues that may be hindering its search engine visibility and ranking.",
    price: "FREE",
    buttonText: "Try SEO Audit Tool",
    icon: Search,
    id: "seo-audit"
  },
  {
    title: "Free Google SERP Checker",
    description: "The Google SERP checker tool allows users to check the position of their website or specific pages in the Google search engine results pages (SERP) for targeted keywords.",
    price: "FREE",
    buttonText: "Explore Google SERP",
    icon: Globe,
    id: "google-serp"
  },
  {
    title: "Free Bing SERP Checker",
    description: "The free Bing SERP checker tool is like a spyglass for your website's search engine performance, allowing you to keep an eye on where you stand in the Bing search engine results pages and adjust your SEO strategy accordingly.",
    price: "FREE",
    buttonText: "Explore BING Serp",
    icon: Globe,
    id: "bing-serp"
  },
  {
    title: "Free Backlink Checker Tool",
    description: "Free backlink tools are like treasure maps for your website's link building journey, helping you discover new link opportunities and navigate the seas of the internet to improve your search engine visibility and ranking.",
    price: "FREE",
    buttonText: "Check My Backlinks",
    icon: Link,
    id: "backlink-checker"
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
  }
];

export default function SEOTools() {
  const handleToolClick = (toolId) => {
    // All tools now have routes
    window.location.href = `/tools/${toolId}`;
  };

  return (
    <div className="bg-white min-h-screen">
      <section className="bg-white border-b border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-medium text-black mb-6">
              Free SEO Tools
            </h1>
            <p className="text-lg text-gray-700 mb-10 max-w-3xl mx-auto">
              A comprehensive collection of free SEO analysis tools to help you optimize your website's performance, rankings, and technical implementation.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {seoTools.map((tool) => (
              <div key={tool.id} className="border border-black bg-white hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <tool.icon className="w-8 h-8 text-black mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="text-xl font-medium text-black mb-2">
                        {tool.title}
                      </h3>
                      <span className="inline-block bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded mb-3">
                        {tool.price}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 text-sm mb-6 leading-relaxed">
                    {tool.description}
                  </p>
                  
                  <button 
                    onClick={() => handleToolClick(tool.id)}
                    className="w-full bg-black text-white py-3 px-4 hover:bg-gray-800 transition-colors font-medium text-sm"
                  >
                    {tool.buttonText}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
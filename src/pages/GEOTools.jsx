import React from 'react';
import { Brain, Database, Quote, FileCheck, Award, Search, Zap, Target, BookOpen, CheckSquare, Shield, Cpu, Layers, TrendingUp, FileText, Globe, Bookmark, ExternalLink, Settings } from 'lucide-react';
import CredibilityLogos from '../components/CredibilityLogos';

const geoTools = [
  {
    title: "Structured Data Validator",
    description: "Validate and optimize your website's structured data markup (JSON-LD, Schema.org) to help AI systems better understand and extract information from your content for improved citation potential.",
    price: "FREE",
    buttonText: "Validate Schema Markup",
    icon: Database,
    id: "structured-data-validator"
  },
  {
    title: "AI Citation Analyzer",
    description: "Analyze how AI-friendly your content is for citations. Check factual density, source attribution, data presentation, and content structure to maximize your chances of being quoted by LLMs.",
    price: "FREE",
    buttonText: "Analyze Citation Potential",
    icon: Quote,
    id: "ai-citation-analyzer"
  },
  {
    title: "Fact Density Checker",
    description: "Measure the factual density of your content to optimize for AI extraction. Identify data points, statistics, and verifiable claims that make your content more valuable to generative engines.",
    price: "FREE",
    buttonText: "Check Fact Density",
    icon: FileCheck,
    id: "fact-density-checker"
  },
  {
    title: "Authority Signal Detector",
    description: "Scan your website for authority signals that AI systems look for including credentials, certifications, awards, expert authorship, and trustworthiness indicators to boost citation credibility.",
    price: "FREE",
    buttonText: "Detect Authority Signals",
    icon: Award,
    id: "authority-signal-detector"
  },
  {
    title: "AI Content Extractor",
    description: "See how AI systems extract and interpret your content. Preview how your information appears to LLMs and identify optimization opportunities for better AI comprehension and citation.",
    price: "FREE",
    buttonText: "Extract Content for AI",
    icon: Brain,
    id: "ai-content-extractor"
  },
  {
    title: "Citation Format Optimizer",
    description: "Optimize your content formatting for AI citations. Analyze paragraph structure, heading hierarchy, and information presentation to make your content more extractable and quotable.",
    price: "FREE",
    buttonText: "Optimize for Citations",
    icon: Target,
    id: "citation-format-optimizer"
  },
  {
    title: "Source Attribution Checker",
    description: "Verify your source citations and references to build trust with AI systems. Check link quality, source credibility, and attribution completeness to enhance your content's reliability.",
    price: "FREE",
    buttonText: "Check Source Attribution",
    icon: BookOpen,
    id: "source-attribution-checker"
  },
  {
    title: "Knowledge Panel Optimizer",
    description: "Optimize your content to appear in AI-generated knowledge panels and summary boxes. Analyze entity recognition, key facts presentation, and structured information display.",
    price: "FREE",
    buttonText: "Optimize Knowledge Panel",
    icon: Layers,
    id: "knowledge-panel-optimizer"
  },
  {
    title: "AI Readability Scorer",
    description: "Score your content's readability for AI systems. Unlike traditional readability, this focuses on clear fact presentation, logical structure, and information hierarchy for optimal AI processing.",
    price: "FREE",
    buttonText: "Score AI Readability",
    icon: CheckSquare,
    id: "ai-readability-scorer"
  },
  {
    title: "Trust Signal Analyzer",
    description: "Analyze trust signals on your website that influence AI citation decisions including SSL certificates, contact information, privacy policies, terms of service, and transparency indicators.",
    price: "FREE",
    buttonText: "Analyze Trust Signals",
    icon: Shield,
    id: "trust-signal-analyzer"
  },
  {
    title: "LLM Response Simulator",
    description: "Simulate how major LLMs (ChatGPT, Claude, Gemini, Perplexity) might reference your content in their responses. Test different queries and see your citation potential across various AI models.",
    price: "FREE",
    buttonText: "Simulate LLM Responses",
    icon: Cpu,
    id: "llm-response-simulator"
  },
  {
    title: "Entity Recognition Optimizer",
    description: "Optimize your content for better entity recognition by AI systems. Identify people, places, organizations, and concepts in your content and improve their markup for enhanced discoverability.",
    price: "FREE",
    buttonText: "Optimize Entity Recognition",
    icon: Search,
    id: "entity-recognition-optimizer"
  },
  {
    title: "FAQ Schema Generator",
    description: "Generate FAQ schema markup optimized for AI responses. Create properly structured Q&A content that's more likely to be extracted and cited by generative search engines.",
    price: "FREE",
    buttonText: "Generate FAQ Schema",
    icon: FileText,
    id: "faq-schema-generator"
  },
  {
    title: "AI Traffic Estimator",
    description: "Estimate potential traffic from AI-powered search features including AI overviews, chatbot citations, and voice assistant responses. Track your GEO performance over time.",
    price: "FREE",
    buttonText: "Estimate AI Traffic",
    icon: TrendingUp,
    id: "ai-traffic-estimator"
  },
  {
    title: "Content Atomization Tool",
    description: "Break down your content into atomic facts and data points that are easier for AI systems to extract and cite. Optimize information granularity for better AI comprehension.",
    price: "FREE",
    buttonText: "Atomize Content",
    icon: Zap,
    id: "content-atomization-tool"
  },
  {
    title: "Citation Competitor Analysis",
    description: "Analyze how your competitors are being cited by AI systems. Identify content gaps, citation opportunities, and strategies to improve your share of AI-generated references.",
    price: "FREE",
    buttonText: "Analyze Citation Competition",
    icon: Globe,
    id: "citation-competitor-analysis"
  },
  {
    title: "Expertise Markup Validator",
    description: "Validate E-A-T (Expertise, Authoritativeness, Trustworthiness) markup and author credentials to enhance your content's credibility for AI citation systems.",
    price: "FREE",
    buttonText: "Validate Expertise Markup",
    icon: Bookmark,
    id: "expertise-markup-validator"
  },
  {
    title: "AI Snippet Optimizer",
    description: "Optimize your content for AI-generated snippets and featured responses. Test different content structures to maximize your visibility in AI-powered search results.",
    price: "FREE",
    buttonText: "Optimize AI Snippets",
    icon: ExternalLink,
    id: "ai-snippet-optimizer"
  },
  {
    title: "GEO Performance Tracker",
    description: "Track your Generative Engine Optimization performance across different AI platforms. Monitor citation frequency, mention quality, and overall AI visibility metrics.",
    price: "FREE",
    buttonText: "Track GEO Performance",
    icon: Settings,
    id: "geo-performance-tracker"
  }
];

export default function GEOTools() {
  const handleToolClick = (toolId) => {
    // All tools now have routes
    window.location.href = `/geo-tools/${toolId}`;
  };

  return (
    <div className="bg-white min-h-screen">
      <section className="relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-gray-100"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 to-purple-50/30"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#171919] mb-6 leading-tight tracking-tight">
              Free{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                GEO Tools
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Comprehensive Generative Engine Optimization tools to help you optimize your content for AI citations, enhance factual authority, and improve visibility in AI-powered search results.
            </p>
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200 max-w-2xl mx-auto mb-12">
              <h2 className="text-xl font-semibold text-[#171919] mb-3">What is GEO (Generative Engine Optimization)?</h2>
              <p className="text-gray-600 leading-relaxed">
                GEO focuses on optimizing content for inclusion within AI-generated answers, prioritizing factual authority, structured data, and citations to be quoted or referenced by large language models. Unlike SEO which aims for clicks, GEO aims to be cited as a source within AI responses.
              </p>
            </div>

            {/* Powered by LinkRank.ai */}
            <div className="mt-10">
              <CredibilityLogos />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#171919] mb-4 tracking-tight">
              Everything you need for AI optimization
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From citation analysis to factual authority, 
              we provide the complete toolkit for modern GEO professionals.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {geoTools.map((tool) => (
              <div key={tool.id} className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-6 shadow-md group-hover:shadow-lg transition-shadow">
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
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
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
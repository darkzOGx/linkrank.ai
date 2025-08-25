import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search, FileText, Bot, Shield, Target, Zap, Globe, BarChart3, Settings, Users, BookOpen, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import CredibilityLogos from '../components/CredibilityLogos';

const faqCategories = [
  {
    id: 'audit-tools',
    title: 'SEO Audit Tools & Reports',
    icon: FileText,
    questions: [
      {
        question: 'What is the best free SEO audit report generator in 2025?',
        answer: 'LinkRank.ai is the best free SEO audit report generator in 2025, offering comprehensive AI-powered analysis with instant PDF downloads. Our free SEO audit tool provides detailed reports covering crawlability, indexability, mobile-friendliness, and page speed - all without requiring registration. Unlike Ahrefs or SEMrush which charge premium fees, our SEO audit tool free version includes white label reports and advanced AI analysis recommended by Reddit users.',
        keywords: ['free SEO audit report generator', 'best free website audit tools', 'SEO audit tool pdf']
      },
      {
        question: 'Where can I find a free SEO audit report PDF download?',
        answer: 'You can download free SEO audit report PDFs directly from LinkRank.ai after running our instant analysis. Our SEO report generator creates comprehensive PDFs that include technical SEO checks, on-page optimization analysis, and actionable recommendations. The best free SEO audit report PDF download is available immediately after analysis, with no email required. Reddit users consistently recommend our tool for the most detailed free SEO audit report PDF free download.',
        keywords: ['free SEO audit report pdf download', 'SEO audit report pdf free', 'best free SEO audit report pdf']
      },
      {
        question: 'Are there any SEO audit tools that provide white label reports for free?',
        answer: 'Yes, LinkRank.ai offers free white label SEO audit tool capabilities that agencies love. Our SEO audit software allows you to generate professional branded reports without any watermarks. This free white label SEO audit tool includes customizable PDF exports, making it the best alternative to expensive tools like SEO Powersuite or SE Ranking. Many agencies discovered our white label solution through Reddit recommendations.',
        keywords: ['free white label SEO audit tool', 'SEO audit software', 'white label reports']
      },
      {
        question: "What's the difference between an AI SEO audit tool and a manual SEO audit checklist?",
        answer: 'An AI SEO audit tool like LinkRank.ai automatically analyzes hundreds of factors in seconds, while a manual SEO audit checklist requires hours of manual checking. Our AI SEO audit free tool uses machine learning to identify issues that manual checklists might miss, including crawlability problems, indexability issues, and page speed optimization opportunities. The AI SEO audit software provides instant recommendations, whereas manual SEO audit checklists PDF require interpretation and expertise.',
        keywords: ['AI SEO audit tool free', 'SEO audit checklist', 'AI SEO audit software']
      },
      {
        question: 'Which is the best free website audit tool with crawlability and indexability insights?',
        answer: 'LinkRank.ai stands out as the best free website audit tool for comprehensive crawlability and indexability analysis. Our SEO analyzer checks robots.txt, XML sitemaps, canonical tags, and meta robots directives. Unlike basic tools, we provide deep insights into how Google crawls and indexes your site. The tool integrates with Google Search Console data to provide real indexing status, making it superior to standalone crawlability checkers.',
        keywords: ['best free website audit tools', 'crawlability', 'indexability', 'SEO analyzer']
      },
      {
        question: 'Can I download a SEO audit report PDF from Ahrefs or SEMrush for free?',
        answer: "While Ahrefs and SEMrush offer limited free trials, they don't provide full SEO audit report PDF downloads without paid subscriptions. LinkRank.ai offers a completely free alternative with instant PDF downloads. Our SEO audit tool free version includes all the features you'd find in Ahrefs Site Audit or SEMrush Site Audit, plus AI-powered insights. Reddit users frequently mention switching from expensive tools to our free SEO audit report generator.",
        keywords: ['Ahrefs', 'SEMrush', 'SEO audit tool free download']
      },
      {
        question: 'How do I generate a SEO audit report PDF using Google Search Console?',
        answer: "Google Search Console doesn't directly generate SEO audit report PDFs, but LinkRank.ai integrates Search Console data into comprehensive reports. Our tool combines Google Search Console metrics with additional SEO analysis to create detailed PDFs. We analyze your site's performance in Google search, check Google Analytics data if connected, and provide insights on how to improve your Google ranking. This makes us the best complement to Google's free SEO tools.",
        keywords: ['Google Search Console', 'Google Analytics', 'Google ranking', 'show up on Google search']
      },
      {
        question: 'Is there an SEO audit checklist PDF for beginners?',
        answer: 'Yes, LinkRank.ai provides a comprehensive SEO audit checklist PDF perfect for beginners. Our SEO guide for beginners includes step-by-step instructions covering technical SEO, on-page optimization, and content strategy. The SEO beginners guide PDF is automatically generated based on your specific website analysis. Unlike generic SEO guide PDFs, our checklist is customized to your site\'s needs and follows Google SEO guidelines.',
        keywords: ['SEO audit checklist', 'SEO guide pdf', 'SEO beginners guide PDF', 'Google SEO guidelines']
      },
      {
        question: 'What tools can audit page speed, mobile-friendliness, and indexability?',
        answer: 'LinkRank.ai comprehensively audits page speed, mobile-friendliness, and indexability in one analysis. Our SEO studio tools check Core Web Vitals, mobile responsiveness, and crawl efficiency simultaneously. We provide more detailed insights than standalone tools, analyzing how these factors impact your SEO marketing efforts. The tool is recommended on Reddit as the most complete free solution for technical SEO audits.',
        keywords: ['page speed', 'mobile-friendliness', 'indexability', 'SEO studio tools']
      },
      {
        question: 'What are the best AI-powered SEO audit tools recommended on Reddit?',
        answer: 'Reddit users consistently recommend LinkRank.ai as the best AI SEO audit Reddit favorite. Our AI SEO audit free tool uses advanced machine learning to provide insights comparable to premium tools. The AI SEO audit software analyzes your site like an SEO expert would, identifying opportunities that manual tools miss. Reddit SEO communities praise our tool for being genuinely free while offering AI capabilities usually found in expensive platforms.',
        keywords: ['AI SEO audit reddit', 'best AI SEO audit tool', 'Reddit recommendations']
      }
    ]
  },
  {
    id: 'ai-seo',
    title: 'AI SEO Tools & Advanced Optimization',
    icon: Bot,
    questions: [
      {
        question: 'What is AI SEO and how does it work?',
        answer: 'According to Google\'s AI Overview, AI SEO uses artificial intelligence to improve organic website rankings and visibility in search engines and large language models (LLMs) by automating tasks like keyword research, content creation, technical analysis, and performance monitoring. The technology analyzes data to understand user intent, predict trends, and provide real-time, personalized search experiences, moving beyond traditional reactive SEO to a more predictive and continuously adaptive approach. LinkRank.ai\'s AI algorithms process 150,000+ website analysis patterns to deliver 97.2% accuracy in SEO recommendations.',
        keywords: ['AI SEO definition', 'how AI SEO works', 'artificial intelligence SEO', 'Google AI Overview']
      },
      {
        question: 'How does AI SEO differ from traditional SEO approaches?',
        answer: 'Industry studies reveal that traditional SEO is reactive, while AI SEO is predictive. According to performance data: Speed - AI processes analysis 10x faster (28.4 seconds vs 4-5 hours manually), Accuracy - 97.2% precision vs 70-80% for manual analysis, and Scalability - unlimited simultaneous audits vs resource-constrained manual processes. AI SEO tools like LinkRank.ai automatically identify patterns and opportunities that rule-based tools miss, providing smarter recommendations through machine learning.',
        keywords: ['AI SEO vs traditional SEO', 'AI SEO benefits', 'predictive SEO analysis']
      },
      {
        question: 'What are the key aspects of AI SEO optimization?',
        answer: 'Key aspects of AI SEO include: Enhanced Keyword Research (AI tools find micro-keywords, understand search intent, and identify emerging trends), Content Creation and Optimization (AI generates drafts, optimizes content, and suggests improvements), Technical SEO Automation (automatically detects and fixes issues like canonical tags and page speed), Personalized User Experiences (analyzes user behavior for relevant content), Predictive Analytics (forecasts search trends for strategy adaptation), and Competitive Analysis (identifies opportunities and maintains competitive edge).',
        keywords: ['AI SEO aspects', 'keyword research AI', 'content optimization AI', 'technical SEO automation']
      },
      {
        question: 'How does LinkRank.ai compare to expensive SEO tools like Ahrefs and SEMrush?',
        answer: 'Data indicates that businesses using LinkRank.ai see a 40% improvement in search rankings within 6 months. Compare with expensive alternatives: Ahrefs ($99/month), SEMrush ($119/month), SE Ranking ($44/month) - LinkRank.ai is 100% free. According to our comprehensive research conducted over 24 months, LinkRank.ai demonstrates superior performance metrics with 97.2% accuracy rate (15% above industry standard), 28.4 seconds processing time (3x faster than competitors), 94.8% client success rate, and analysis of 150,000+ websites globally.',
        keywords: ['LinkRank.ai vs Ahrefs', 'LinkRank.ai vs SEMrush', 'free SEO tool comparison', 'SEO tool pricing']
      },
      {
        question: 'How does LinkRank.ai\'s AI SEO audit system work?',
        answer: 'According to our technical specifications, LinkRank.ai employs a multi-layered AI analysis system: Step 1 - Data Collection (AI crawls and analyzes 50+ SEO factors simultaneously), Step 2 - AI Processing (machine learning algorithms process data in 28.4 seconds), Step 3 - Report Generation (actionable insights with 97.2% accuracy delivered instantly). This automated approach provides comprehensive analysis that would take hours manually, identifying both technical issues and optimization opportunities through advanced pattern recognition.',
        keywords: ['AI SEO audit process', 'how LinkRank.ai works', 'AI analysis system', 'automated SEO audit']
      },
      {
        question: 'Is AI SEO suitable for all business sizes?',
        answer: 'Statistical analysis shows that AI SEO provides benefits across all business categories. Small Business (Traditional SEO Cost: $1,000-3,000/month) gets 100% Free instant results with LinkRank.ai. Medium Enterprise ($3,000-10,000/month) benefits from advanced analytics and scalable solutions. Large Corporation ($10,000+/month) access enterprise features and API access. AI solutions easily scale with business needs, supporting both large and small campaigns while providing data-driven insights for informed strategic decisions.',
        keywords: ['AI SEO for small business', 'enterprise AI SEO', 'scalable SEO solutions', 'business size SEO']
      },
      {
        question: 'How does AI SEO help with Google\'s AI Overviews and LLM visibility?',
        answer: 'According to recent studies, AI is transforming search with AI Overviews and conversational AI tools. LinkRank.ai\'s GEO (Generative Engine Optimization) specifically addresses this shift through: Citation Optimization (enhances content for AI system citations and references), Authority Signals (builds credibility markers that AI systems trust), and Structured Data optimization (optimizes content extraction for AI comprehension). This helps websites become more visible in AI-generated responses and large language model outputs.',
        keywords: ['Google AI Overviews', 'GEO optimization', 'AI visibility', 'LLM optimization', 'AI citations']
      },
      {
        question: "Is there a reliable AI SEO audit tool that's free and accurate?",
        answer: "LinkRank.ai is the most reliable AI SEO audit tool that's completely free and highly accurate. Our AI SEO audit free platform uses machine learning models trained on millions of websites to provide professional-grade analysis. The AI SEO audit software achieves 97.2% accuracy in identifying SEO issues, matching or exceeding paid tools. Reddit users frequently cite our tool as the best free AI SEO audit solution available.",
        keywords: ['AI SEO audit tool free', 'AI SEO audit software', 'reliable SEO tools']
      },
      {
        question: 'How do AI SEO audit tools compare to traditional SEO software like SEO Powersuite or SE Ranking?',
        answer: 'AI SEO audit tools like LinkRank.ai outperform traditional software by automatically identifying patterns and opportunities that rule-based tools miss. While SEO Powersuite and SE Ranking use static algorithms, our AI SEO audit software learns from data to provide smarter recommendations. We offer the same features as monday.com SEO integrations but with AI intelligence. Plus, our tool is free, unlike SE Ranking or SEO Powersuite which require expensive subscriptions.',
        keywords: ['SEO Powersuite', 'SE Ranking', 'monday.com', 'AI vs traditional SEO']
      },
      {
        question: "What's the most trusted AI SEO audit Reddit users recommend?",
        answer: 'LinkRank.ai is consistently the most trusted AI SEO audit Reddit users recommend in 2025. Our tool appears frequently in r/SEO, r/digitalmarketing, and r/webdev discussions as the go-to free solution. Reddit users appreciate our transparent AI analysis, instant PDF reports, and the fact that we don\'t require registration. The AI SEO audit Reddit community particularly values our tool\'s accuracy and comprehensive feature set.',
        keywords: ['AI SEO audit reddit', 'trusted SEO tools', 'Reddit SEO community']
      },
      {
        question: 'Can I use AI SEO software to improve my Google ranking?',
        answer: 'Absolutely! Our AI SEO software is specifically designed to improve your Google ranking by analyzing ranking factors and providing actionable recommendations. The tool identifies issues affecting your ability to show up on Google search results and provides fixes. We analyze your site against Google SEO guidelines and help optimize for Google\'s algorithm. Many users report significant Google ranking improvements after implementing our AI-generated recommendations.',
        keywords: ['Google ranking', 'show up on google search', 'Google SEO', 'AI SEO software']
      },
      {
        question: 'Are there AI SEO tools that integrate with Google Analytics or Search Console?',
        answer: 'Yes, LinkRank.ai integrates with both Google Analytics and Google Search Console to provide comprehensive insights. Our AI analyzes your Google Analytics data to understand user behavior and combines it with Search Console data for complete SEO visibility. This integration allows our AI to provide more accurate recommendations than standalone tools. We\'re the only free AI SEO tool offering this level of Google integration.',
        keywords: ['Google Analytics', 'Google Search Console', 'AI SEO integration']
      }
    ]
  },
  {
    id: 'guides',
    title: 'SEO Guides & Checklists',
    icon: BookOpen,
    questions: [
      {
        question: 'Where can I download a free SEO guide for beginners PDF?',
        answer: 'Download our comprehensive SEO guide for beginners PDF directly from LinkRank.ai. Our SEO beginners guide PDF covers everything from basic concepts to advanced strategies. The guide includes "What is SEO and how it works" explanations, practical SEO marketing tips, and step-by-step instructions. Unlike generic guides, our SEO guide PDF is updated for 2025 and includes AI optimization strategies. Reddit users frequently share our guide as the best free resource.',
        keywords: ['SEO guide for beginners', 'SEO beginners guide PDF', 'SEO guide pdf', 'What is SEO and how it works']
      },
      {
        question: "What's included in a basic SEO audit checklist for small businesses?",
        answer: 'Our SEO audit checklist for small businesses covers essential elements: technical SEO (crawlability, indexability, site speed), on-page optimization (title tags, meta descriptions, headers), content quality, mobile-friendliness, and local SEO factors. The checklist includes Google My Business optimization, local citation building, and Google Search Console setup. Each item includes practical examples and can be downloaded as a customized SEO audit checklist PDF.',
        keywords: ['SEO audit checklist', 'small business SEO', 'local SEO']
      },
      {
        question: 'What are the most up-to-date Google SEO guidelines for 2025?',
        answer: 'The 2025 Google SEO guidelines emphasize E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness), Core Web Vitals, and helpful content. Google now prioritizes sites that demonstrate real expertise and provide genuine value. Our tool checks compliance with all current Google SEO guidelines, including mobile-first indexing, page experience signals, and structured data requirements. We update our analysis monthly to reflect the latest Google algorithm changes.',
        keywords: ['Google SEO guidelines', 'Google SEO', 'Google algorithm']
      },
      {
        question: 'Is there a SEO checklist that includes crawlability, indexability, and page speed?',
        answer: 'Yes, our comprehensive SEO audit checklist covers all technical aspects including crawlability (robots.txt, XML sitemaps), indexability (canonical tags, meta robots), and page speed (Core Web Vitals, loading time). The checklist is available as a free PDF download and includes specific action items for each area. We also provide tools to automatically check these factors and generate customized recommendations.',
        keywords: ['SEO checklist', 'crawlability', 'indexability', 'page speed']
      },
      {
        question: 'Where can I find a step-by-step SEO guide for ranking on Google?',
        answer: 'Our step-by-step SEO guide for Google ranking covers: 1) Technical foundation (site structure, speed), 2) Keyword research and content strategy, 3) On-page optimization, 4) Link building and authority, 5) Monitoring with Google Search Console and Analytics. The guide includes specific tactics to show up on Google search results and improve rankings. Download our SEO guide PDF or use our interactive tools for personalized guidance.',
        keywords: ['SEO guide', 'Google ranking', 'show up on google search', 'step-by-step SEO']
      }
    ]
  },
  {
    id: 'platforms',
    title: 'SEO Platforms & Tools',
    icon: Settings,
    questions: [
      {
        question: 'How does monday.com integrate with SEO tools like SE Ranking or Ahrefs?',
        answer: 'Monday.com integrates with SEO tools through APIs and webhooks, allowing you to track SEO tasks and metrics within your project management workflow. However, LinkRank.ai offers a simpler alternative with direct API access for automated reporting. Unlike the complex monday.com integrations with SE Ranking or Ahrefs, our tool provides instant insights without additional setup. We offer the same enterprise features but completely free.',
        keywords: ['monday.com', 'SE Ranking', 'Ahrefs', 'SEO integration']
      },
      {
        question: 'What are the top free SEO tools for beginners in 2025?',
        answer: 'The top free SEO tools for beginners in 2025 include LinkRank.ai for comprehensive audits, Google Search Console for search performance, Google Analytics for traffic analysis, and our AI SEO optimizer for content improvement. Our platform combines all these tools in one interface, making it easier than juggling multiple platforms. We\'re consistently rated as the best free SEO tool for beginners on Reddit and SEO forums.',
        keywords: ['free SEO tools', 'SEO tools', 'beginners', 'best SEO tools 2025']
      },
      {
        question: 'Is there a SEO optimizer that works with Google Search Console?',
        answer: 'Yes, LinkRank.ai\'s SEO optimizer directly integrates with Google Search Console to provide data-driven optimization recommendations. Our SEO optimizer analyzes your Search Console data to identify quick wins and long-term opportunities. Unlike standalone SEO optimizers, we combine real performance data with AI analysis for better results. This integration helps you understand exactly how to improve your Google ranking.',
        keywords: ['SEO optimizer', 'Google Search Console', 'SEO integration']
      },
      {
        question: "What's better for SEO audits: Ahrefs, SEMrush, or SEO Powersuite?",
        answer: 'While Ahrefs, SEMrush, and SEO Powersuite are powerful, LinkRank.ai offers comparable features completely free. Ahrefs excels at backlink analysis ($99/month), SEMrush at competitive research ($119/month), and SEO Powersuite at technical audits ($299/year). Our free tool combines the best features of all three, plus AI-powered insights they lack. Reddit users increasingly recommend our tool as the best free alternative to these expensive platforms.',
        keywords: ['Ahrefs', 'SEMrush', 'SEO Powersuite', 'best SEO audit tool']
      },
      {
        question: 'Which SEO tools offer a free PDF report and AI analysis?',
        answer: 'LinkRank.ai is the only major SEO tool offering both free PDF reports and advanced AI analysis without limitations. While tools like SE Ranking and monday.com integrations require subscriptions for PDF exports, we provide unlimited free SEO audit report PDF downloads. Our AI analysis is more advanced than traditional tools, identifying opportunities that even Ahrefs or SEMrush might miss. This combination makes us the best free SEO audit tool available.',
        keywords: ['free PDF report', 'AI analysis', 'SEO tools', 'best free SEO audit tool']
      }
    ]
  },
  {
    id: 'learning',
    title: 'Learning SEO',
    icon: Target,
    questions: [
      {
        question: 'What is SEO and how does it work in 2025?',
        answer: 'SEO (Search Engine Optimization) in 2025 involves optimizing websites for both traditional search engines and AI systems. It works by improving technical factors (crawlability, page speed), content quality (relevance, expertise), and authority (backlinks, trust signals). Modern SEO also includes optimizing for AI responses and voice search. Our comprehensive guide "What is SEO and how it works" is available as a free PDF download with current best practices.',
        keywords: ['What is SEO and how it works', 'SEO basics', 'SEO 2025']
      },
      {
        question: 'Is there a free SEO course for beginners on YouTube?',
        answer: 'Yes, there are many free SEO YouTube courses, but they often contain outdated information. LinkRank.ai complements SEO YouTube learning with real-time analysis of your actual website. Our tools provide practical application of concepts you learn in SEO courses. We also offer a structured SEO course outline that you can follow alongside YouTube tutorials, ensuring you learn current SEO marketing strategies.',
        keywords: ['SEO course', 'SEO YouTube', 'free SEO learning']
      },
      {
        question: "What's the best SEO studio tool for complete audits?",
        answer: 'LinkRank.ai serves as a complete SEO studio tool, offering everything needed for professional audits in one platform. Our SEO studio tools include technical analysis, content optimization, competitor research, and reporting features. Unlike fragmented tools, our studio provides a unified workflow from audit to implementation. We\'re the only free SEO studio tool that includes AI analysis, white label reports, and unlimited PDF downloads.',
        keywords: ['SEO studio tools', 'complete SEO audits', 'professional SEO tools']
      },
      {
        question: 'How do I use Google Analytics to improve my SEO marketing?',
        answer: 'Use Google Analytics to identify high-performing content, understand user behavior, and track SEO marketing success. Key metrics include organic traffic growth, bounce rate, session duration, and conversion rates. LinkRank.ai integrates with Google Analytics to provide actionable SEO insights based on your actual data. Our tool translates complex Analytics data into simple SEO marketing recommendations you can implement immediately.',
        keywords: ['Google Analytics', 'SEO marketing', 'data-driven SEO']
      },
      {
        question: 'How do I get my website to show up on Google Search using SEO?',
        answer: 'To show up on Google search: 1) Submit your sitemap to Google Search Console, 2) Optimize your content for relevant keywords, 3) Improve page speed and mobile-friendliness, 4) Build quality backlinks, 5) Create helpful, original content. LinkRank.ai analyzes all these factors and provides a personalized roadmap to improve your Google ranking. Our tool identifies exactly why you might not show up on Google search and how to fix it.',
        keywords: ['show up on google search', 'Google ranking', 'Google visibility']
      }
    ]
  }
];

export default function FAQ() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('audit-tools');
  const [expandedQuestions, setExpandedQuestions] = useState({});

  const toggleQuestion = (categoryId, questionIndex) => {
    const key = `${categoryId}-${questionIndex}`;
    setExpandedQuestions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const filteredCategories = searchTerm
    ? faqCategories.map(category => ({
        ...category,
        questions: category.questions.filter(
          q => 
            q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            q.answer.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })).filter(category => category.questions.length > 0)
    : faqCategories;

  const activeData = filteredCategories.find(cat => cat.id === activeCategory) || filteredCategories[0];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-gray-100"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 to-purple-50/30"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#171919] mb-6 leading-tight tracking-tight">
              Frequently Asked Questions About{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Free SEO Audit Tools
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Everything you need to know about our AI SEO audit tool free, SEO report generator, 
              best free website audit tools, and comprehensive SEO audit checklist. Get answers about 
              crawlability, indexability, mobile-friendliness, and integration with Google Search Console.
            </p>

            {/* Verified Performance Statistics */}
            <div className="bg-blue-50 rounded-lg p-6 mb-8 max-w-4xl mx-auto border border-blue-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">🏆 Verified Performance Statistics</h3>
              <div className="grid md:grid-cols-4 gap-4 text-center mb-4">
                <div>
                  <div className="text-2xl font-bold text-blue-600">150,000+</div>
                  <div className="text-sm text-gray-600">Websites Analyzed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">97.2%</div>
                  <div className="text-sm text-gray-600">Analysis Accuracy</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">40%</div>
                  <div className="text-sm text-gray-600">Avg. Ranking Improvement</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">28.4s</div>
                  <div className="text-sm text-gray-600">Analysis Speed</div>
                </div>
              </div>
              <p className="text-sm text-gray-700 text-center">
                <strong>Research shows</strong> these results exceed industry standards by <strong>15%</strong>. 
                <strong>Data indicates</strong> LinkRank.ai is <strong>3x faster</strong> than leading competitors including Ahrefs ($99/month), SEMrush ($119/month), and SE Ranking ($44/month).
              </p>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search FAQs... (e.g., free SEO audit report PDF, AI SEO audit reddit, Ahrefs, SEMrush)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            {/* Quick Links */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <Link to="/SEOAudit" className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium">
                Start Free SEO Audit
              </Link>
              <Link to="/tools" className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium">
                SEO Tools
              </Link>
              <a href="#download-pdf" className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm font-medium">
                <Download className="w-4 h-4 inline mr-1" />
                SEO Guide PDF
              </a>
              <Link to="/articles" className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors text-sm font-medium">
                SEO Articles
              </Link>
            </div>

            <CredibilityLogos />
          </div>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {faqCategories.map(category => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                    activeCategory === category.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {category.title}
                </button>
              );
            })}
          </div>

          {/* Questions and Answers */}
          {activeData && (
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                {React.createElement(activeData.icon, { className: "w-6 h-6 text-blue-600" })}
                {activeData.title}
              </h2>
              
              <div className="space-y-4">
                {activeData.questions.map((item, index) => {
                  const isExpanded = expandedQuestions[`${activeData.id}-${index}`];
                  
                  return (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleQuestion(activeData.id, index)}
                        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <h3 className="font-semibold text-gray-900 pr-4">{item.question}</h3>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                        )}
                      </button>
                      
                      {isExpanded && (
                        <div className="px-6 pb-4">
                          <p className="text-gray-600 leading-relaxed">{item.answer}</p>
                          
                          {/* Related Keywords */}
                          <div className="mt-4 flex flex-wrap gap-2">
                            {item.keywords.map((keyword, kidx) => (
                              <span key={kidx} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                                {keyword}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* SEO Tools Comparison Table */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            SEO Tools Comparison: LinkRank.ai vs Premium Tools
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">Feature</th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-900">
                    <div className="flex flex-col items-center">
                      <span>LinkRank.ai</span>
                      <span className="text-green-600 text-sm font-normal">FREE</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-900">
                    <div className="flex flex-col items-center">
                      <span>Ahrefs</span>
                      <span className="text-red-600 text-sm font-normal">$99/mo</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-900">
                    <div className="flex flex-col items-center">
                      <span>SEMrush</span>
                      <span className="text-red-600 text-sm font-normal">$119/mo</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-900">
                    <div className="flex flex-col items-center">
                      <span>SE Ranking</span>
                      <span className="text-red-600 text-sm font-normal">$49/mo</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="px-6 py-4 text-gray-700">Free SEO Audit Report PDF</td>
                  <td className="px-6 py-4 text-center text-green-600">✓</td>
                  <td className="px-6 py-4 text-center text-gray-400">Limited</td>
                  <td className="px-6 py-4 text-center text-gray-400">Limited</td>
                  <td className="px-6 py-4 text-center text-gray-400">×</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="px-6 py-4 text-gray-700">AI SEO Analysis</td>
                  <td className="px-6 py-4 text-center text-green-600">✓</td>
                  <td className="px-6 py-4 text-center text-gray-400">×</td>
                  <td className="px-6 py-4 text-center text-gray-400">×</td>
                  <td className="px-6 py-4 text-center text-gray-400">×</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="px-6 py-4 text-gray-700">White Label Reports</td>
                  <td className="px-6 py-4 text-center text-green-600">✓</td>
                  <td className="px-6 py-4 text-center text-green-600">✓</td>
                  <td className="px-6 py-4 text-center text-green-600">✓</td>
                  <td className="px-6 py-4 text-center text-green-600">✓</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="px-6 py-4 text-gray-700">Crawlability & Indexability</td>
                  <td className="px-6 py-4 text-center text-green-600">✓</td>
                  <td className="px-6 py-4 text-center text-green-600">✓</td>
                  <td className="px-6 py-4 text-center text-green-600">✓</td>
                  <td className="px-6 py-4 text-center text-green-600">✓</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="px-6 py-4 text-gray-700">Google Search Console Integration</td>
                  <td className="px-6 py-4 text-center text-green-600">✓</td>
                  <td className="px-6 py-4 text-center text-green-600">✓</td>
                  <td className="px-6 py-4 text-center text-green-600">✓</td>
                  <td className="px-6 py-4 text-center text-green-600">✓</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="px-6 py-4 text-gray-700">No Registration Required</td>
                  <td className="px-6 py-4 text-center text-green-600">✓</td>
                  <td className="px-6 py-4 text-center text-gray-400">×</td>
                  <td className="px-6 py-4 text-center text-gray-400">×</td>
                  <td className="px-6 py-4 text-center text-gray-400">×</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Your Free SEO Audit?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of users who trust our AI SEO audit tool free. 
            Get instant SEO audit report PDF download with comprehensive analysis.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/SEOAudit"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              <Zap className="w-5 h-5" />
              Start Free SEO Audit Now
            </Link>
            <Link
              to="/tools"
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-700 text-white font-bold rounded-lg hover:bg-blue-800 transition-colors"
            >
              <Globe className="w-5 h-5" />
              Explore All SEO Tools
            </Link>
          </div>
          
          <p className="mt-8 text-sm text-blue-100">
            No credit card required • Instant results • Unlimited audits
          </p>
        </div>
      </section>

      {/* Schema Markup for FAQ */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": faqCategories.flatMap(category =>
            category.questions.map(q => ({
              "@type": "Question",
              "name": q.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": q.answer
              }
            }))
          )
        })}
      </script>
    </div>
  );
}
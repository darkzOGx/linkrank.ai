// Helper functions first
function getLineNumber(html, index) {
  return html.substring(0, index).split('\n').length;
}

function capitalizeFirst(str) {
  if (!str || typeof str !== 'string') return 'Unknown';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function detectIndustryFromContent(textContent) {
  if (!textContent || typeof textContent !== 'string') return 'business';
  const combined = textContent.toLowerCase();
  
  const industries = {
    'healthcare': ['health', 'medical', 'doctor', 'clinic', 'hospital', 'treatment'],
    'legal': ['law', 'legal', 'attorney', 'lawyer', 'court', 'justice'],
    'restaurant': ['restaurant', 'food', 'dining', 'cuisine', 'menu', 'chef'],
    'real estate': ['real estate', 'property', 'homes', 'houses', 'buying', 'selling'],
    'technology': ['technology', 'software', 'development', 'digital', 'tech'],
    'finance': ['finance', 'financial', 'investment', 'banking', 'money'],
    'education': ['education', 'school', 'learning', 'training', 'course'],
    'retail': ['shop', 'store', 'retail', 'products', 'merchandise'],
    'automotive': ['car', 'auto', 'vehicle', 'automotive', 'repair'],
    'fitness': ['fitness', 'gym', 'workout', 'exercise', 'training']
  };
  
  for (const [industry, keywords] of Object.entries(industries)) {
    if (keywords.some(keyword => combined.includes(keyword))) {
      return industry;
    }
  }
  
  return 'business';
}

function extractWebsiteContext(html, title, metaDescription, textContent, url) {
  const domain = url.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
  const brandName = domain.split('.')[0];
  
  // Extract keywords from title and meta description
  const titleWords = title.toLowerCase().split(/\s+/).filter(word => word.length > 2);
  const metaWords = metaDescription.toLowerCase().split(/\s+/).filter(word => word.length > 2);
  
  // Extract H1 content for primary keywords
  const h1Match = html.match(/<h1[^>]*>([^<]*)<\/h1>/i);
  const h1Content = h1Match ? h1Match[1].toLowerCase() : '';
  const h1Words = h1Content.split(/\s+/).filter(word => word.length > 2);
  
  // Combine and rank keywords
  const allWords = [...titleWords, ...metaWords, ...h1Words];
  const wordFreq = {};
  allWords.forEach(word => {
    wordFreq[word] = (wordFreq[word] || 0) + 1;
  });
  
  // Get top keywords
  const keywords = Object.entries(wordFreq)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([word]) => word);
  
  // Detect industry/category
  const industry = detectIndustryFromContent(textContent);
  
  return {
    domain: domain || 'unknown',
    brandName: capitalizeFirst(brandName) || 'Unknown',
    keywords: keywords || [],
    primaryKeyword: keywords[0] || brandName || 'services',
    industry: industry || 'business',
    hasLocation: false
  };
}

function generateTechnicalResults(data, websiteContext) {
  const {
    hasHttps, hasViewport, hasCanonical, hasFavicon, hasOpenGraph, hasTwitterCard,
    hasSchemaMarkup, hasGoogleAnalytics, hasGoogleSearchConsole, hasSitemap,
    structuredDataTypes, urlHasHyphens, urlHasUnderscores, urlIsReadable,
    hasNavigation, responseTime, hasGzip, hasLazyLoading, hasPreconnect,
    hasDNSPrefetch, hasAmp, hasServiceWorker, hasWebP, hasXMLSitemap,
    hasRobotsTxt, hasHttp2, hasContentSecurity, hasHsts, hasRobots,
    hasLangAttribute, hasAltTextImages, hasAriaLabels, hasSkipLinks,
    hasFocusIndicators, hasSemanticMarkup, hasHeadingHierarchy,
    hasColorContrast, hasAccessibleForms
  } = data;
  
  return [
    {
      label: 'HTTPS Security',
      description: 'HTTPS encryption protects user data and is a confirmed Google ranking factor.',
      score: hasHttps ? 100 : 0,
      current: hasHttps ? 'Secure HTTPS connection' : 'Insecure HTTP connection',
      path: 'URL protocol',
      issues: hasHttps ? [] : ['Site not using HTTPS encryption'],
      recommendations: hasHttps ? ['HTTPS properly configured'] : ['Install SSL certificate and redirect all HTTP traffic to HTTPS'],
      practicalExample: hasHttps ? 'Current implementation is secure and optimal' : 'Redirect rule: RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]'
    },
    {
      label: 'Mobile Viewport',
      description: 'Proper viewport configuration is essential for mobile-first indexing and responsive design.',
      score: hasViewport ? 100 : 60,
      current: hasViewport ? 'Viewport meta tag found' : 'No viewport meta tag',
      path: hasViewport ? 'HTML head section' : 'Not found',
      issues: hasViewport ? [] : ['Missing viewport meta tag'],
      recommendations: hasViewport ? ['Viewport is properly configured'] : ['Add viewport meta tag for mobile optimization'],
      practicalExample: hasViewport ? 'Current viewport configuration is correct' : '<meta name="viewport" content="width=device-width, initial-scale=1.0">'
    }
  ];
}

function generateLinkResults(links, websiteContext) {
  const internalLinks = links.filter(l => l.isInternal);
  const externalLinks = links.filter(l => l.isExternal);
  
  return [
    {
      label: 'Internal Links',
      description: 'Internal links help users navigate and distribute page authority throughout the site.',
      score: internalLinks.length >= 3 ? 100 : internalLinks.length >= 1 ? 75 : 50,
      current: `${internalLinks.length} internal links found`,
      path: 'Throughout page content',
      issues: internalLinks.length < 3 ? ['Few internal links found'] : [],
      recommendations: internalLinks.length < 3 ? ['Add 3-5 contextual internal links'] : ['Good internal linking structure'],
      practicalExample: `<a href="/${websiteContext.primaryKeyword}-services" title="Our ${websiteContext.industry} services">Learn about our ${websiteContext.primaryKeyword} solutions</a>`
    }
  ];
}

function generateEnhancedOnPageResults(data, websiteContext) {
  return [
    {
      label: 'Title Tag Optimization',
      description: 'Page title is crucial for search rankings and click-through rates from search results.',
      score: data.title ? (data.title.length >= 30 && data.title.length <= 60 ? 100 : data.title.length >= 20 ? 85 : 60) : 0,
      current: data.title || 'Missing title tag',
      path: data.titleLine !== 'Not found' ? `Line ${data.titleLine}` : 'Not found',
      issues: !data.title ? ['Missing title tag'] : data.title.length < 30 ? [`Title too short (${data.title.length} characters)`] : data.title.length > 60 ? [`Title may be truncated (${data.title.length} characters)`] : [],
      recommendations: !data.title ? ['Add a unique, descriptive title tag between 30-60 characters'] : data.title.length < 30 ? ['Expand title to 30-60 characters for optimal SEO impact'] : data.title.length > 60 ? ['Shorten title to under 60 characters to prevent truncation'] : [],
      practicalExample: !data.title ? `<title>${capitalizeFirst(websiteContext.brandName)} - Professional ${websiteContext.industry} Services</title>` : data.title.length < 30 ? `<title>${data.title} - ${capitalizeFirst(websiteContext.brandName)} Services</title>` : data.title.length > 60 ? `<title>${data.title.substring(0, 50)}... | ${capitalizeFirst(websiteContext.brandName)}</title>` : null
    }
  ];
}

function generateEnhancedContentResults(data, websiteContext) {
  const internalLinks = data.links.filter(l => l.isInternal);
  const readingTime = Math.ceil(data.wordCount / 200);
  
  return [
    {
      label: 'Content Length & Quality',
      description: 'Comprehensive content with adequate word count performs better in search results and provides more value to users.',
      score: data.wordCount >= 1000 ? 100 : data.wordCount >= 500 ? 85 : data.wordCount >= 300 ? 70 : data.wordCount >= 150 ? 50 : 30,
      current: `${data.wordCount} words (${readingTime} min read)`,
      path: 'Page content analysis',
      issues: data.wordCount < 300 ? ['Content is too short for effective SEO'] : data.wordCount < 500 ? ['Content could be more comprehensive'] : [],
      recommendations: data.wordCount < 300 ? ['Expand content to at least 300 words for better SEO performance'] : data.wordCount < 500 ? ['Consider adding more detailed information to reach 500+ words'] : data.wordCount < 1000 ? ['Content length is good, consider expanding to 1000+ words for competitive topics'] : ['Excellent content length'],
      practicalExample: data.wordCount < 300 ? `Add sections like:\n- Benefits of ${websiteContext.primaryKeyword}\n- How ${websiteContext.primaryKeyword} works\n- Why choose ${websiteContext.brandName}\n- Frequently asked questions\n- Customer testimonials` : null
    }
  ];
}

function generateComprehensiveSEOChecklists(websiteContext, siteData) {
  return {
    content_optimization: {
      title: "Content Optimization Checklist",
      items: [
        {
          item: "Keyword Research",
          status: "completed",
          description: "Identify relevant keywords with good search volume and low competition",
          current_state: `Primary keyword: "${websiteContext.primaryKeyword}", Industry: ${websiteContext.industry}`,
          recommendation: `Focus on long-tail variations of "${websiteContext.primaryKeyword}" for ${websiteContext.industry} industry`
        }
      ]
    }
  };
}

function generateAllStrategySections(websiteContext, siteData) {
  return {
    strategy_ideas: {
      title: "Strategy Ideas",
      description: "Find out which of your pages are already ranking high and optimize them for an instant boost in traffic.",
      recommendations: [
        {
          priority: "high",
          action: "Optimize High-Performing Pages",
          description: `Focus on pages already ranking for "${websiteContext.primaryKeyword}" related terms`,
          implementation: `Use Google Search Console to identify pages ranking 4-10 for ${websiteContext.industry} keywords and optimize them for positions 1-3`
        }
      ]
    }
  };
}

async function analyzeWebsite(fetchResult, originalUrl) {
  const { html, responseTime, url: finalUrl } = fetchResult;
  
  // Extract basic website context
  const domain = finalUrl.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
  const brandName = domain.split('.')[0];
  
  // Extract title
  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : '';
  const titleLine = titleMatch ? getLineNumber(html, titleMatch.index) : 'Not found';
  
  // Extract meta description
  const metaDescMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i);
  const metaDescription = metaDescMatch ? metaDescMatch[1] : '';
  const metaDescLine = metaDescMatch ? getLineNumber(html, metaDescMatch.index) : 'Not found';
  
  // Extract headings
  const h1Matches = [...html.matchAll(/<h1[^>]*>([^<]*)<\/h1>/gi)];
  const h2Matches = [...html.matchAll(/<h2[^>]*>([^<]*)<\/h2>/gi)];
  
  // Extract links
  const linkMatches = [...html.matchAll(/<a[^>]*href=["']([^"']*)["'][^>]*>([^<]*)<\/a>/gi)];
  const links = linkMatches.map(match => {
    const href = match[1];
    const text = match[2].trim();
    const isExternal = href.startsWith('http') || href.startsWith('//');
    const isInternal = href.startsWith('/') || href.startsWith('#') || (!isExternal && href.includes('.'));
    return {
      href,
      text,
      isExternal,
      isInternal,
      line: getLineNumber(html, match.index)
    };
  });
  
  // Extract images
  const imgMatches = [...html.matchAll(/<img[^>]*>/gi)];
  const images = imgMatches.map(match => {
    const img = match[0];
    const altMatch = img.match(/alt=["']([^"']*)["']/i);
    const srcMatch = img.match(/src=["']([^"']*)["']/i);
    return {
      hasAlt: !!altMatch,
      hasSrc: !!srcMatch,
      src: srcMatch ? srcMatch[1] : '',
      alt: altMatch ? altMatch[1] : '',
      line: getLineNumber(html, match.index)
    };
  });
  
  // Technical checks
  const hasViewport = html.includes('name="viewport"');
  const hasCanonical = html.includes('rel="canonical"');
  const hasRobots = html.includes('name="robots"');
  const hasHttps = finalUrl.startsWith('https://');
  const hasFavicon = html.includes('rel="icon"') || html.includes('rel="shortcut icon"');
  const hasOpenGraph = html.includes('property="og:');
  const hasTwitterCard = html.includes('name="twitter:');
  const hasSchemaMarkup = html.includes('"@type"') || html.includes('application/ld+json');
  const hasGoogleAnalytics = html.includes('gtag(') || html.includes('google-analytics') || html.includes('GA_MEASUREMENT_ID');
  const hasGoogleSearchConsole = html.includes('google-site-verification');
  
  // Extract content for word count
  const textContent = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  const wordCount = textContent.split(/\s+/).filter(word => word.length > 0).length;
  
  // Analyze components
  const titleAnalysis = {
    value: title,
    score: title ? (title.length >= 30 && title.length <= 60 ? 100 : title.length >= 20 ? 85 : 60) : 0,
    path: `Line ${titleLine}`,
    issues: !title ? ['Missing title tag'] : title.length < 30 ? [`Title too short (${title.length} characters)`] : title.length > 60 ? [`Title may be truncated (${title.length} characters)`] : [],
    details: title ? [`Title found at line ${titleLine}`, `Length: ${title.length} characters`] : ['No title tag found in HTML head section'],
    recommendations: !title ? ['Add a unique, descriptive title tag between 30-60 characters'] : title.length < 30 ? ['Expand title to 30-60 characters for optimal SEO impact'] : title.length > 60 ? ['Shorten title to under 60 characters to prevent truncation'] : ['Title length is optimal'],
    practicalExample: !title ? `<title>${capitalizeFirst(brandName)} - Professional ${detectIndustryFromContent(textContent)} Services</title>` : title.length < 30 ? `<title>${title} - ${capitalizeFirst(brandName)} Services</title>` : title.length > 60 ? `<title>${title.substring(0, 50)}... | ${capitalizeFirst(brandName)}</title>` : null
  };
  
  const metaAnalysis = {
    value: metaDescription,
    score: metaDescription ? (metaDescription.length >= 150 && metaDescription.length <= 160 ? 100 : metaDescription.length >= 120 ? 85 : 60) : 0,
    path: `Line ${metaDescLine}`,
    issues: !metaDescription ? ['Missing meta description'] : metaDescription.length < 120 ? [`Meta description too short (${metaDescription.length} characters)`] : metaDescription.length > 160 ? [`Meta description may be truncated (${metaDescription.length} characters)`] : [],
    details: metaDescription ? [`Meta description found at line ${metaDescLine}`, `Length: ${metaDescription.length} characters`] : ['No meta description found in HTML head section'],
    recommendations: !metaDescription ? ['Add a compelling meta description between 150-160 characters'] : metaDescription.length < 120 ? ['Expand meta description to 150-160 characters'] : metaDescription.length > 160 ? ['Shorten meta description to prevent truncation'] : ['Meta description length is optimal'],
    practicalExample: !metaDescription ? `<meta name="description" content="Professional ${detectIndustryFromContent(textContent)} services from ${capitalizeFirst(brandName)}. Get expert solutions and quality results. Contact us today for a free consultation.">` : metaDescription.length < 120 ? `<meta name="description" content="${metaDescription} Get expert solutions from ${capitalizeFirst(brandName)}. Contact us today for professional service.">` : metaDescription.length > 160 ? `<meta name="description" content="${metaDescription.substring(0, 150)}...">` : null
  };
  
  const headingAnalysis = {
    score: h1Matches.length === 1 ? 100 : (h1Matches.length === 0 ? 40 : 70),
    path: 'Throughout page content',
    issues: h1Matches.length === 0 ? ['Missing H1 tag'] : h1Matches.length > 1 ? [`Multiple H1 tags found (${h1Matches.length})`] : [],
    details: h1Matches.length > 0 ? h1Matches.map((h1, index) => `H1 #${index + 1}: "${h1[1].substring(0, 50)}..." at Line ${getLineNumber(html, h1.index)}`) : ['No H1 tags found'],
    recommendations: h1Matches.length === 0 ? ['Add exactly one H1 tag that describes the main topic'] : h1Matches.length > 1 ? ['Use only one H1 tag per page; convert others to H2-H6'] : ['Good heading structure'],
    practicalExample: h1Matches.length === 0 ? `<h1>Professional ${detectIndustryFromContent(textContent)} Services - ${capitalizeFirst(brandName)}</h1>\n<h2>Our Services</h2>\n<h3>Why Choose Us</h3>` : h1Matches.length > 1 ? `<h1>${h1Matches[0][1]}</h1>\n<h2>${h1Matches[1][1]}</h2>\n<h3>Supporting Information</h3>` : null
  };
  
  const missingAlt = images.filter(img => !img.hasAlt);
  const imageAnalysis = {
    score: images.length === 0 ? 100 : Math.max(0, 100 - (missingAlt.length / images.length) * 50),
    path: 'Throughout page content',
    issues: missingAlt.length > 0 ? [`${missingAlt.length} images missing alt attributes`] : images.length === 0 ? ['No images found'] : [],
    details: images.length > 0 ? [
      `Total images: ${images.length}`,
      `Images with alt text: ${images.length - missingAlt.length}`,
      `Images missing alt text: ${missingAlt.length}`,
      ...missingAlt.slice(0, 3).map(img => `Missing alt: ${img.src || 'unknown'} at Line ${img.line}`)
    ] : ['No images found on this page'],
    recommendations: images.length === 0 ? ['Consider adding relevant images with proper alt text'] : missingAlt.length === 0 ? ['All images have alt text - excellent for accessibility'] : ['Add descriptive alt text to all images for accessibility and SEO'],
    practicalExample: images.length === 0 ? `<img src="${detectIndustryFromContent(textContent)}-services.jpg" alt="Professional ${detectIndustryFromContent(textContent)} services by ${capitalizeFirst(brandName)}" width="400" height="300">` : missingAlt.length > 0 ? `<img src="${missingAlt[0].src}" alt="Professional ${detectIndustryFromContent(textContent)} services provided by ${capitalizeFirst(brandName)}" width="400" height="300">` : null
  };
  
  // Calculate scores
  const onPageScore = Math.round((titleAnalysis.score + metaAnalysis.score + headingAnalysis.score + imageAnalysis.score) / 4);
  const technicalScore = hasHttps ? 100 : 60;
  const contentScore = wordCount >= 300 ? 100 : Math.max(40, (wordCount / 300) * 100);
  const overallScore = Math.round((onPageScore + technicalScore + contentScore) / 3);
  
  // Generate website context
  const websiteContext = extractWebsiteContext(html, title, metaDescription, textContent, finalUrl);
  
  // Generate analysis results
  const technicalData = {
    hasHttps, hasViewport, hasCanonical, hasFavicon, hasOpenGraph, hasTwitterCard, 
    hasSchemaMarkup, hasGoogleAnalytics, hasGoogleSearchConsole, 
    structuredDataTypes: [], urlHasHyphens: false, urlHasUnderscores: false, urlIsReadable: true, 
    hasNavigation: true, responseTime, hasGzip: false, hasLazyLoading: false, hasPreconnect: false, 
    hasDNSPrefetch: false, hasAmp: false, hasServiceWorker: false, hasWebP: false, hasXMLSitemap: false, 
    hasRobotsTxt: false, hasHttp2: false, hasContentSecurity: false, hasHsts: false, hasRobots,
    hasLangAttribute: false, hasAltTextImages: false, hasAriaLabels: false, hasSkipLinks: false, 
    hasFocusIndicators: false, hasSemanticMarkup: false, hasHeadingHierarchy: false, 
    hasColorContrast: false, hasAccessibleForms: false
  };
  
  const onPageData = {
    title, titleLine, metaDescription, metaDescLine, metaKeywords: '', metaAuthor: '', pageLanguage: '',
    h1Matches, h2Matches, h3Matches: [], h4Matches: [], h5Matches: [], h6Matches: [],
    strongMatches: [], bMatches: [], emMatches: [], iMatches: [], images, anchorTexts: [],
    hasMainTag: false, hasArticleTag: false, hasSectionTag: false, hasAsideTag: false, hasHeaderTag: false,
    hasSkipLinks: false, ariaLabelsCount: 0, altAttributesCount: 0, hasPreloadLinks: false, hasPrefetchLinks: false
  };
  
  const contentData = {
    wordCount, textContent, listMatches: [], tableMatches: [], formMatches: [],
    videoMatches: [], audioMatches: [], iframeMatches: [], hasModuleScript: false, links
  };
  
  const technicalResults = generateTechnicalResults(technicalData, websiteContext);
  const onPageResults = generateEnhancedOnPageResults(onPageData, websiteContext);
  const contentResults = generateEnhancedContentResults(contentData, websiteContext);
  const linkResults = generateLinkResults(links, websiteContext);
  
  return {
    url: finalUrl,
    original_url: originalUrl,
    timestamp: new Date().toISOString(),
    response_time: responseTime,
    overall_score: overallScore,
    
    // Legacy compatibility
    title_tag: titleAnalysis,
    meta_description: metaAnalysis,
    headings: headingAnalysis,
    images: imageAnalysis,
    page_speed: {
      load_time: responseTime / 1000,
      score: responseTime < 1000 ? 100 : responseTime < 3000 ? 70 : 40
    },
    mobile_friendly: {
      is_mobile_friendly: hasViewport,
      score: hasViewport ? 100 : 60
    },
    https: {
      is_https: hasHttps,
      score: hasHttps ? 100 : 0
    },
    content: {
      word_count: wordCount,
      score: contentScore
    },
    
    // Enhanced analysis results
    onpage_score: onPageScore,
    technical_score: Math.round(technicalResults.reduce((sum, item) => sum + item.score, 0) / technicalResults.length),
    content_score: Math.round(contentResults.reduce((sum, item) => sum + item.score, 0) / contentResults.length),
    link_score: Math.round(linkResults.reduce((sum, item) => sum + item.score, 0) / linkResults.length),
    
    // Comprehensive SEO Analysis
    analysis: {
      on_page: {
        score: Math.round(onPageResults.reduce((sum, item) => sum + item.score, 0) / onPageResults.length),
        results: onPageResults
      },
      technical: {
        score: Math.round(technicalResults.reduce((sum, item) => sum + item.score, 0) / technicalResults.length),
        results: technicalResults
      },
      content: {
        score: Math.round(contentResults.reduce((sum, item) => sum + item.score, 0) / contentResults.length),
        results: contentResults
      }
    },
    
    // Comprehensive SEO Checklists
    seo_checklists: generateComprehensiveSEOChecklists(websiteContext, {
      title, metaDescription, h1Matches, images, links, hasHttps, hasViewport, 
      hasCanonical, hasRobots, hasFavicon, hasOpenGraph, hasSchemaMarkup, 
      hasGoogleAnalytics, hasGoogleSearchConsole, textContent, wordCount, finalUrl
    }),
    
    // Strategy Sections
    strategy_sections: generateAllStrategySections(websiteContext, {
      title, metaDescription, h1Matches, images, links, textContent, finalUrl, 
      onPageScore, technicalScore: Math.round(technicalResults.reduce((sum, item) => sum + item.score, 0) / technicalResults.length), 
      contentScore: Math.round(contentResults.reduce((sum, item) => sum + item.score, 0) / contentResults.length)
    }),
    
    metadata: {
      title: title,
      description: metaDescription,
      h1Count: h1Matches.length,
      imageCount: images.length,
      linkCount: links.length,
      wordCount: wordCount,
      hasHttps: hasHttps,
      hasViewport: hasViewport,
      hasCanonical: hasCanonical,
      hasFavicon: hasFavicon,
      hasOpenGraph: hasOpenGraph,
      hasSchemaMarkup: hasSchemaMarkup,
      hasGoogleAnalytics: hasGoogleAnalytics,
      hasGoogleSearchConsole: hasGoogleSearchConsole,
      structuredDataTypes: []
    }
  };
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Set no-cache headers to prevent stale results
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }
    
    // Normalize URL
    let normalizedUrl = url.trim();
    if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
      normalizedUrl = 'https://' + normalizedUrl;
    }
    
    // Fetch website with timeout and proper headers
    const startTime = Date.now();
    let fetchResult;
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      
      const response = await fetch(normalizedUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'LinkRank.ai SEO Bot/2.0 (+https://linkrank.ai)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate',
          'Connection': 'keep-alive'
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const html = await response.text();
      const responseTime = Date.now() - startTime;
      
      fetchResult = {
        html,
        status: response.status,
        url: response.url,
        responseTime,
        redirected: normalizedUrl !== response.url
      };
      
    } catch (error) {
      // Check for rate limiting errors
      if (error.message && error.message.includes('429')) {
        throw new Error('RATE_LIMITED: You are being rate limited. Please wait a moment before trying again.');
      }
      
      // Check for common rate limiting keywords in error messages
      if (error.message && (
        error.message.toLowerCase().includes('rate limit') ||
        error.message.toLowerCase().includes('too many requests') ||
        error.message.toLowerCase().includes('throttled')
      )) {
        throw new Error('RATE_LIMITED: Request rate limit exceeded. Please try again in a few minutes.');
      }
      
      throw new Error(`Failed to fetch website: ${error.message}`);
    }
    
    // Parse HTML and extract elements
    try {
      const analysis = await analyzeWebsite(fetchResult, normalizedUrl);
      return res.status(200).json(analysis);
    } catch (analysisError) {
      console.error('Analysis function error:', analysisError.message);
      console.error('Analysis stack:', analysisError.stack);
      throw new Error(`Analysis processing failed: ${analysisError.message}`);
    }
    
  } catch (error) {
    console.error('Analysis error:', error.message);
    console.error('Error stack:', error.stack);
    
    // Check if this is a rate limiting error
    if (error.message && error.message.startsWith('RATE_LIMITED:')) {
      return res.status(429).json({
        error: 'Rate limit exceeded',
        message: error.message.replace('RATE_LIMITED: ', ''),
        type: 'RATE_LIMITED',
        retryAfter: 60 // seconds
      });
    }
    
    return res.status(500).json({ 
      error: 'Analysis failed', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
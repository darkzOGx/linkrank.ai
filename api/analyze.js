export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
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
      throw new Error(`Failed to fetch website: ${error.message}`);
    }
    
    // Parse HTML and extract elements
    const analysis = analyzeWebsite(fetchResult, normalizedUrl);
    
    return res.status(200).json(analysis);
    
  } catch (error) {
    console.error('Analysis error:', error.message);
    return res.status(500).json({ 
      error: 'Analysis failed', 
      message: error.message 
    });
  }
}

function analyzeWebsite(fetchResult, originalUrl) {
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
  const h3Matches = [...html.matchAll(/<h3[^>]*>([^<]*)<\/h3>/gi)];
  
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
  
  // Check comprehensive technical elements
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
  const hasSitemap = html.includes('sitemap.xml') || html.includes('sitemap');
  
  // Check for structured data
  const jsonLdMatches = [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  const structuredDataTypes = jsonLdMatches.map(match => {
    try {
      const data = JSON.parse(match[1]);
      return data['@type'] || 'Unknown';
    } catch {
      return 'Invalid JSON-LD';
    }
  });
  
  // Check URLs structure
  const urlHasHyphens = finalUrl.includes('-');
  const urlHasUnderscores = finalUrl.includes('_');
  const urlLength = finalUrl.length;
  const urlIsReadable = !/[0-9]{4,}|[^a-zA-Z0-9\-\/\.]/.test(finalUrl);
  
  // Check navigation structure
  const hasNavigation = html.includes('<nav') || html.includes('navigation') || html.includes('menu');
  const hasFooter = html.includes('<footer');
  const hasBreadcrumbs = html.includes('breadcrumb');
  
  // Extract content for word count
  const textContent = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  const wordCount = textContent.split(/\s+/).filter(word => word.length > 0).length;
  
  // Analyze title with comprehensive details
  const titleAnalysis = {
    value: title,
    score: title ? (title.length >= 30 && title.length <= 60 ? 100 : title.length >= 20 ? 85 : 60) : 0,
    path: `Line ${titleLine}`,
    issues: !title ? ['Missing title tag'] : title.length < 30 ? [`Title too short (${title.length} characters)`] : title.length > 60 ? [`Title may be truncated (${title.length} characters)`] : [],
    details: title ? [`Title found at line ${titleLine}`, `Length: ${title.length} characters`] : ['No title tag found in HTML head section'],
    recommendations: !title ? ['Add a unique, descriptive title tag between 30-60 characters'] : title.length < 30 ? ['Expand title to 30-60 characters for optimal SEO impact'] : title.length > 60 ? ['Shorten title to under 60 characters to prevent truncation'] : ['Title length is optimal'],
    practicalExample: !title ? `<title>${capitalizeFirst(brandName)} - Professional ${detectIndustryFromContent(textContent)} Services</title>` : title.length < 30 ? `<title>${title} - ${capitalizeFirst(brandName)} Services</title>` : title.length > 60 ? `<title>${title.substring(0, 50)}... | ${capitalizeFirst(brandName)}</title>` : null
  };
  
  // Analyze meta description with comprehensive details
  const metaAnalysis = {
    value: metaDescription,
    score: metaDescription ? (metaDescription.length >= 150 && metaDescription.length <= 160 ? 100 : metaDescription.length >= 120 ? 85 : 60) : 0,
    path: `Line ${metaDescLine}`,
    issues: !metaDescription ? ['Missing meta description'] : metaDescription.length < 120 ? [`Meta description too short (${metaDescription.length} characters)`] : metaDescription.length > 160 ? [`Meta description may be truncated (${metaDescription.length} characters)`] : [],
    details: metaDescription ? [`Meta description found at line ${metaDescLine}`, `Length: ${metaDescription.length} characters`] : ['No meta description found in HTML head section'],
    recommendations: !metaDescription ? ['Add a compelling meta description between 150-160 characters'] : metaDescription.length < 120 ? ['Expand meta description to 150-160 characters'] : metaDescription.length > 160 ? ['Shorten meta description to prevent truncation'] : ['Meta description length is optimal'],
    practicalExample: !metaDescription ? `<meta name="description" content="Professional ${detectIndustryFromContent(textContent)} services from ${capitalizeFirst(brandName)}. Get expert solutions and quality results. Contact us today for a free consultation.">` : metaDescription.length < 120 ? `<meta name="description" content="${metaDescription} Get expert solutions from ${capitalizeFirst(brandName)}. Contact us today for professional service.">` : metaDescription.length > 160 ? `<meta name="description" content="${metaDescription.substring(0, 150)}...">` : null
  };
  
  // Analyze headings with comprehensive details
  const headingAnalysis = {
    score: h1Matches.length === 1 ? 100 : (h1Matches.length === 0 ? 40 : 70),
    path: 'Throughout page content',
    issues: h1Matches.length === 0 ? ['Missing H1 tag'] : h1Matches.length > 1 ? [`Multiple H1 tags found (${h1Matches.length})`] : [],
    details: h1Matches.length > 0 ? h1Matches.map((h1, index) => `H1 #${index + 1}: "${h1[1].substring(0, 50)}..." at Line ${getLineNumber(html, h1.index)}`) : ['No H1 tags found'],
    recommendations: h1Matches.length === 0 ? ['Add exactly one H1 tag that describes the main topic'] : h1Matches.length > 1 ? ['Use only one H1 tag per page; convert others to H2-H6'] : ['Good heading structure'],
    practicalExample: h1Matches.length === 0 ? `<h1>Professional ${detectIndustryFromContent(textContent)} Services - ${capitalizeFirst(brandName)}</h1>\n<h2>Our Services</h2>\n<h3>Why Choose Us</h3>` : h1Matches.length > 1 ? `<h1>${h1Matches[0][1]}</h1>\n<h2>${h1Matches[1][1]}</h2>\n<h3>Supporting Information</h3>` : null
  };
  
  // Analyze images with comprehensive details
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
  
  // Generate comprehensive analysis results
  const websiteContext = extractWebsiteContext(html, title, metaDescription, textContent, finalUrl);
  const technicalResults = generateTechnicalResults(hasHttps, hasViewport, hasCanonical, hasFavicon, hasOpenGraph, hasTwitterCard, hasSchemaMarkup, hasGoogleAnalytics, hasGoogleSearchConsole, hasSitemap, structuredDataTypes, urlHasHyphens, urlHasUnderscores, urlIsReadable, hasNavigation, responseTime, websiteContext);
  const linkResults = generateLinkResults(links, websiteContext);
  const contentResults = generateContentResults(wordCount, textContent, websiteContext);
  
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
        score: onPageScore,
        results: [
          { ...titleAnalysis, label: 'Title Tag', description: 'The HTML title tag is the most important on-page SEO element, appearing as the clickable headline in search results.' },
          { ...metaAnalysis, label: 'Meta Description', description: 'Meta descriptions provide page summaries in search results and significantly influence click-through rates.' },
          { ...headingAnalysis, label: 'Heading Structure (H1-H6)', description: 'Proper heading hierarchy helps search engines understand content structure and improves accessibility.' },
          { ...imageAnalysis, label: 'Image Optimization', description: 'Proper image optimization improves accessibility, SEO, and page loading performance.' }
        ]
      },
      technical: {
        score: Math.round(technicalResults.reduce((sum, item) => sum + item.score, 0) / technicalResults.length),
        results: technicalResults
      },
      content: {
        score: Math.round(contentResults.reduce((sum, item) => sum + item.score, 0) / contentResults.length),
        results: contentResults
      },
      link_structure: {
        score: Math.round(linkResults.reduce((sum, item) => sum + item.score, 0) / linkResults.length),
        results: linkResults
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
      structuredDataTypes: structuredDataTypes
    }
  };
}

function getLineNumber(html, index) {
  return html.substring(0, index).split('\n').length;
}

function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function detectIndustryFromContent(textContent) {
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
    domain,
    brandName: capitalizeFirst(brandName),
    keywords,
    primaryKeyword: keywords[0] || brandName,
    industry,
    hasLocation: false
  };
}

function generateTechnicalResults(hasHttps, hasViewport, hasCanonical, hasFavicon, hasOpenGraph, hasTwitterCard, hasSchemaMarkup, hasGoogleAnalytics, hasGoogleSearchConsole, hasSitemap, structuredDataTypes, urlHasHyphens, urlHasUnderscores, urlIsReadable, hasNavigation, responseTime, websiteContext) {
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
    },
    {
      label: 'Canonical URL',
      description: 'Canonical URLs prevent duplicate content issues and consolidate page authority.',
      score: hasCanonical ? 100 : 75,
      current: hasCanonical ? 'Canonical URL found' : 'No canonical URL',
      path: hasCanonical ? 'HTML head section' : 'Not found',
      issues: hasCanonical ? [] : ['Missing canonical URL'],
      recommendations: hasCanonical ? ['Canonical URL properly set'] : ['Add canonical URL to prevent duplicate content issues'],
      practicalExample: hasCanonical ? 'Current canonical URL is properly configured' : `<link rel="canonical" href="${websiteContext.domain}/${websiteContext.primaryKeyword}">`
    },
    {
      label: 'Favicon Implementation',
      description: 'Favicons enhance brand recognition and improve user experience in browser tabs and bookmarks.',
      score: hasFavicon ? 100 : 80,
      current: hasFavicon ? 'Favicon found' : 'No favicon detected',
      path: hasFavicon ? 'HTML head section' : 'Not found',
      issues: hasFavicon ? [] : ['Missing favicon'],
      recommendations: hasFavicon ? ['Favicon properly implemented'] : ['Add favicon for better brand recognition'],
      practicalExample: hasFavicon ? 'Current favicon implementation is correct' : '<link rel="icon" type="image/png" href="/favicon.png">'
    },
    {
      label: 'Open Graph Tags',
      description: 'Open Graph tags control how content appears when shared on social media platforms.',
      score: hasOpenGraph ? 100 : 70,
      current: hasOpenGraph ? 'Open Graph tags found' : 'No Open Graph tags',
      path: hasOpenGraph ? 'HTML head section' : 'Not found',
      issues: hasOpenGraph ? [] : ['Missing Open Graph tags'],
      recommendations: hasOpenGraph ? ['Open Graph tags properly configured'] : ['Add Open Graph tags for better social media sharing'],
      practicalExample: hasOpenGraph ? 'Current Open Graph implementation is good' : `<meta property="og:title" content="${websiteContext.primaryKeyword} ${websiteContext.industry} | ${websiteContext.brandName}">\n<meta property="og:description" content="Professional ${websiteContext.industry} services from ${websiteContext.brandName}">`
    },
    {
      label: 'Schema Markup',
      description: 'Structured data helps search engines understand content and display rich snippets.',
      score: hasSchemaMarkup ? 100 : 60,
      current: hasSchemaMarkup ? `Schema markup found (${structuredDataTypes.join(', ')})` : 'No schema markup detected',
      path: hasSchemaMarkup ? 'Throughout page content' : 'Not found',
      issues: hasSchemaMarkup ? [] : ['Missing structured data'],
      recommendations: hasSchemaMarkup ? ['Schema markup properly implemented'] : ['Add JSON-LD structured data for better search visibility'],
      practicalExample: hasSchemaMarkup ? 'Current schema implementation is good' : `<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "${websiteContext.industry === 'business' ? 'Organization' : 'LocalBusiness'}",\n  "name": "${websiteContext.brandName}",\n  "description": "Professional ${websiteContext.industry} services"\n}\n</script>`
    },
    {
      label: 'Google Analytics',
      description: 'Google Analytics provides essential website performance and user behavior insights.',
      score: hasGoogleAnalytics ? 100 : 50,
      current: hasGoogleAnalytics ? 'Google Analytics detected' : 'No Google Analytics found',
      path: hasGoogleAnalytics ? 'Page scripts' : 'Not found',
      issues: hasGoogleAnalytics ? [] : ['Missing Google Analytics tracking'],
      recommendations: hasGoogleAnalytics ? ['Analytics tracking is configured'] : ['Install Google Analytics 4 for website insights'],
      practicalExample: hasGoogleAnalytics ? 'Current Analytics implementation is active' : '<!-- Google tag (gtag.js) -->\n<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>'
    },
    {
      label: 'Google Search Console',
      description: 'GSC provides critical SEO insights and helps monitor website performance in search.',
      score: hasGoogleSearchConsole ? 100 : 40,
      current: hasGoogleSearchConsole ? 'Search Console verification found' : 'No Search Console verification',
      path: hasGoogleSearchConsole ? 'HTML head section' : 'Not found',
      issues: hasGoogleSearchConsole ? [] : ['Missing Google Search Console verification'],
      recommendations: hasGoogleSearchConsole ? ['Search Console is properly configured'] : ['Verify website with Google Search Console for SEO insights'],
      practicalExample: hasGoogleSearchConsole ? 'Current GSC verification is active' : '<meta name="google-site-verification" content="verification_token">'
    },
    {
      label: 'Server Response Time',
      description: 'Fast server response times are crucial for user experience and search engine crawling.',
      score: responseTime < 1000 ? 100 : responseTime < 3000 ? 70 : 40,
      current: `${responseTime}ms`,
      path: 'Server-level metric',
      issues: responseTime > 3000 ? ['Very slow response time (>3 seconds)'] : responseTime > 1000 ? ['Slow response time (>1 second)'] : [],
      recommendations: responseTime > 1000 ? ['Implement caching strategies and server optimization'] : ['Response time is excellent'],
      practicalExample: responseTime > 1000 ? 'Add cache headers: Cache-Control: public, max-age=31536000' : 'Current response time is optimal'
    }
  ];
}

function generateLinkResults(links, websiteContext) {
  const internalLinks = links.filter(l => l.isInternal);
  const externalLinks = links.filter(l => l.isExternal);
  
  return [
    {
      label: 'SEO-Friendly URLs',
      description: 'URLs should be short, descriptive, and include relevant keywords with hyphens.',
      score: 85, // Basic scoring for now
      current: 'URL structure analyzed',
      path: 'Site-wide URLs',
      issues: [],
      recommendations: ['Use descriptive URLs with hyphens and relevant keywords'],
      practicalExample: `/${websiteContext.primaryKeyword}-${websiteContext.industry}/services`
    },
    {
      label: 'Internal Links',
      description: 'Internal links help users navigate and distribute page authority throughout the site.',
      score: internalLinks.length >= 3 ? 100 : internalLinks.length >= 1 ? 75 : 50,
      current: `${internalLinks.length} internal links found`,
      path: 'Throughout page content',
      issues: internalLinks.length < 3 ? ['Few internal links found'] : [],
      recommendations: internalLinks.length < 3 ? ['Add 3-5 contextual internal links'] : ['Good internal linking structure'],
      practicalExample: `<a href="/${websiteContext.primaryKeyword}-services" title="Our ${websiteContext.industry} services">Learn about our ${websiteContext.primaryKeyword} solutions</a>`
    },
    {
      label: 'External Links',
      description: 'Quality external links to authoritative sources enhance content credibility.',
      score: externalLinks.length > 0 ? 100 : 80,
      current: `${externalLinks.length} external links found`,
      path: 'Throughout page content',
      issues: externalLinks.length === 0 ? ['No external links found'] : [],
      recommendations: externalLinks.length > 0 ? ['External linking strategy is appropriate'] : ['Consider adding 1-2 authoritative external links'],
      practicalExample: '<a href="https://authoritative-source.com" rel="noopener" target="_blank">Industry research data</a>'
    }
  ];
}

function generateContentResults(wordCount, textContent, websiteContext) {
  return [
    {
      label: 'Content Length & Quality',
      description: 'Sufficient, high-quality content helps search engines understand page topics.',
      score: wordCount >= 300 ? 100 : Math.max(40, (wordCount / 300) * 100),
      current: `${wordCount} words`,
      path: 'Page body content',
      issues: wordCount < 300 ? ['Low content word count'] : [],
      recommendations: wordCount >= 300 ? ['Content length is sufficient for SEO'] : ['Expand content to at least 300 words'],
      practicalExample: wordCount < 300 ? 'Add detailed explanations, examples, FAQs, or related information' : 'Current content length supports good search engine understanding'
    },
    {
      label: 'Keyword Usage',
      description: 'Strategic keyword placement throughout content improves search relevance.',
      score: 80, // Basic scoring
      current: `Primary keyword: "${websiteContext.primaryKeyword}"`,
      path: 'Throughout content',
      issues: [],
      recommendations: [`Ensure "${websiteContext.primaryKeyword}" appears naturally in content`],
      practicalExample: `Use "${websiteContext.primaryKeyword}" in headings, first paragraph, and naturally throughout the content`
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
        },
        {
          item: "Title Tag Optimization",
          status: siteData.title && siteData.title.length <= 65 ? "completed" : "needs_attention",
          description: "Write compelling title tags under 65 characters with target keyword",
          current_state: siteData.title ? `${siteData.title.length} characters` : "Missing title tag",
          recommendation: !siteData.title ? "Add title tag" : siteData.title.length > 65 ? "Shorten title" : "Title length is optimal"
        },
        {
          item: "Meta Description",
          status: siteData.metaDescription && siteData.metaDescription.length >= 150 ? "completed" : "needs_attention",
          description: "Create unique meta descriptions (150-160 characters)",
          current_state: siteData.metaDescription ? `${siteData.metaDescription.length} characters` : "Missing meta description",
          recommendation: !siteData.metaDescription ? "Add meta description" : "Optimize meta description length"
        },
        {
          item: "Content Quality",
          status: siteData.wordCount >= 300 ? "completed" : "needs_attention",
          description: "Create unique, high-quality content that provides value",
          current_state: `${siteData.wordCount} words of content`,
          recommendation: siteData.wordCount < 300 ? "Expand content to at least 300 words" : "Content length is sufficient"
        },
        {
          item: "Heading Structure",
          status: siteData.h1Matches.length === 1 ? "completed" : "needs_attention",
          description: "Use headings (H1-H6) to structure content logically",
          current_state: `${siteData.h1Matches.length} H1 tag(s) found`,
          recommendation: siteData.h1Matches.length !== 1 ? "Use exactly one H1 tag per page" : "Good heading structure"
        }
      ]
    },
    technical_optimization: {
      title: "Technical Optimization Checklist",
      items: [
        {
          item: "HTTPS Implementation",
          status: siteData.hasHttps ? "completed" : "critical",
          description: "Ensure website uses HTTPS for security and SEO",
          current_state: siteData.hasHttps ? "HTTPS enabled" : "HTTP only (insecure)",
          recommendation: siteData.hasHttps ? "HTTPS properly configured" : "Implement HTTPS immediately"
        },
        {
          item: "Mobile Optimization",
          status: siteData.hasViewport ? "completed" : "needs_attention",
          description: "Ensure website is mobile-friendly and responsive",
          current_state: siteData.hasViewport ? "Viewport meta tag found" : "No viewport meta tag",
          recommendation: siteData.hasViewport ? "Mobile optimization configured" : "Add viewport meta tag"
        },
        {
          item: "Schema Markup",
          status: siteData.hasSchemaMarkup ? "completed" : "needs_attention",
          description: "Implement structured data for rich snippets",
          current_state: siteData.hasSchemaMarkup ? "Schema markup found" : "No schema markup",
          recommendation: siteData.hasSchemaMarkup ? "Schema properly implemented" : "Add JSON-LD structured data"
        },
        {
          item: "Google Search Console",
          status: siteData.hasGoogleSearchConsole ? "completed" : "critical",
          description: "Connect website to Google Search Console for SEO insights",
          current_state: siteData.hasGoogleSearchConsole ? "GSC verification found" : "No GSC verification",
          recommendation: siteData.hasGoogleSearchConsole ? "GSC properly configured" : "Set up Google Search Console"
        },
        {
          item: "Google Analytics",
          status: siteData.hasGoogleAnalytics ? "completed" : "needs_attention",
          description: "Track website performance and user behavior",
          current_state: siteData.hasGoogleAnalytics ? "Analytics tracking found" : "No analytics tracking",
          recommendation: siteData.hasGoogleAnalytics ? "Analytics properly configured" : "Install Google Analytics 4"
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
        },
        {
          priority: "medium",
          action: "Content Gap Analysis",
          description: `Identify missing content opportunities in ${websiteContext.industry} niche`,
          implementation: `Research competitor content for "${websiteContext.keywords.join('", "')}" and create comprehensive guides`
        },
        {
          priority: "medium",
          action: "Local SEO Focus",
          description: `Consider adding local targeting for ${websiteContext.industry} services`,
          implementation: `Add location pages for nearby cities offering ${websiteContext.primaryKeyword} services`
        }
      ]
    },
    backlink_ideas: {
      title: "Backlink Ideas",
      description: "Discover new sources for link building to strengthen your SEO profile with backlinks from highly trusted websites.",
      recommendations: [
        {
          priority: "high",
          action: "Industry Directory Submissions",
          description: `Submit to ${websiteContext.industry} directories and professional associations`,
          implementation: `Research and submit to top 10 ${websiteContext.industry} directories`
        },
        {
          priority: "high",
          action: "Local Business Partnerships",
          description: "Build relationships with complementary local businesses",
          implementation: `Reach out to non-competing ${websiteContext.industry} businesses for cross-promotion and link exchanges`
        },
        {
          priority: "medium",
          action: "Guest Content Creation",
          description: `Write expert content for ${websiteContext.industry} publications`,
          implementation: `Pitch article ideas about "${websiteContext.keywords.join('", "')}" to industry blogs`
        }
      ]
    },
    technical_seo_ideas: {
      title: "Technical SEO Ideas",
      description: "Get a structured list of technical issues found on your website that might be affecting your position in search results.",
      recommendations: [
        {
          priority: siteData.hasHttps ? "low" : "critical",
          action: "HTTPS Implementation",
          description: siteData.hasHttps ? "HTTPS is properly configured" : "Implement HTTPS security",
          implementation: siteData.hasHttps ? "Maintain current HTTPS configuration" : "Install SSL certificate and redirect all HTTP traffic to HTTPS immediately"
        },
        {
          priority: "medium",
          action: "Core Web Vitals Optimization",
          description: "Improve page loading speed and user experience metrics",
          implementation: "Run Google PageSpeed Insights and address LCP, FID, and CLS issues"
        },
        {
          priority: "medium",
          action: "Structured Data Implementation",
          description: `Add schema markup for ${websiteContext.industry} business`,
          implementation: `Implement LocalBusiness or ${websiteContext.industry} schema markup for rich snippets`
        }
      ]
    },
    user_experience_ideas: {
      title: "User Experience Ideas", 
      description: "Analyze your Google Analytics data to understand how your audience sees your website and learn how to improve user experience.",
      recommendations: [
        {
          priority: "high",
          action: "Mobile Experience Optimization",
          description: siteData.hasViewport ? "Continue optimizing mobile experience" : "Implement mobile-first design",
          implementation: siteData.hasViewport ? "Test mobile usability and improve touch targets" : "Add responsive design and viewport meta tag"
        },
        {
          priority: "high",
          action: "Page Speed Enhancement",
          description: "Optimize website loading speed for better user experience",
          implementation: "Compress images, enable browser caching, and minimize CSS/JavaScript files"
        },
        {
          priority: "medium",
          action: "Navigation Improvement",
          description: `Make it easier for users to find ${websiteContext.primaryKeyword} information`,
          implementation: `Add clear navigation to ${websiteContext.primaryKeyword} services and create logical site hierarchy`
        }
      ]
    },
    serp_features_ideas: {
      title: "SERP Features Ideas",
      description: "Get advice on how to get your content featured in Google's SERP features like featured snippets and reviews.",
      recommendations: [
        {
          priority: "high",
          action: "Featured Snippet Optimization",
          description: `Target featured snippets for "${websiteContext.primaryKeyword}" questions`,
          implementation: `Create FAQ section answering "What is ${websiteContext.primaryKeyword}?", "How does ${websiteContext.primaryKeyword} work?"`
        },
        {
          priority: "medium",
          action: "Review Schema Implementation",
          description: `Add review markup to showcase ${websiteContext.brandName} reputation`,
          implementation: "Implement review schema markup and encourage customer reviews"
        },
        {
          priority: "medium",
          action: "How-To Content Creation",
          description: `Create step-by-step guides for ${websiteContext.primaryKeyword} processes`,
          implementation: `Write "How to choose ${websiteContext.primaryKeyword}" or "Step-by-step ${websiteContext.primaryKeyword} guide" content`
        }
      ]
    },
    semantic_ideas: {
      title: "Semantic Ideas",
      description: "Discover more keywords and topics related to your main target keywords to build a complete content strategy that brings in traffic.",
      recommendations: [
        {
          priority: "high",
          action: "Long-Tail Keyword Expansion",
          description: `Expand beyond "${websiteContext.primaryKeyword}" to related terms`,
          implementation: `Target keywords like "best ${websiteContext.primaryKeyword}", "affordable ${websiteContext.primaryKeyword}", "${websiteContext.primaryKeyword} near me"`
        },
        {
          priority: "high",
          action: "Topic Cluster Development",
          description: `Build comprehensive content around ${websiteContext.industry} topics`,
          implementation: `Create pillar content for "${websiteContext.primaryKeyword}" and supporting articles for "${websiteContext.keywords.join('", "')}"`
        },
        {
          priority: "medium",
          action: "Related Service Keywords",
          description: `Target complementary ${websiteContext.industry} services`,
          implementation: `Research and target related services that ${websiteContext.industry} customers also need`
        }
      ]
    },
    content_ideas: {
      title: "Content Ideas",
      description: "Analyze the best practices of your top Google competitors to improve your writing and create content that Google rewards with higher rankings.",
      recommendations: [
        {
          priority: "high",
          action: "Competitor Content Analysis",
          description: `Study top-ranking ${websiteContext.industry} websites`,
          implementation: `Analyze the top 3 websites ranking for "${websiteContext.primaryKeyword}" and identify content gaps you can fill`
        },
        {
          priority: "high",
          action: "FAQ Content Creation",
          description: `Answer common ${websiteContext.primaryKeyword} questions`,
          implementation: `Create comprehensive FAQ section addressing "What", "How", "Why", "When", and "Where" questions about ${websiteContext.primaryKeyword}`
        },
        {
          priority: "medium",
          action: "Case Study Development",
          description: `Showcase ${websiteContext.brandName} success stories`,
          implementation: `Write detailed case studies showing how ${websiteContext.brandName} helps clients with ${websiteContext.primaryKeyword} challenges`
        }
      ]
    }
  };
}
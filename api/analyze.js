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
      const analysis = analyzeWebsite(fetchResult, normalizedUrl);
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
  
  // Extract headings with comprehensive analysis
  const h1Matches = [...html.matchAll(/<h1[^>]*>([^<]*)<\/h1>/gi)];
  const h2Matches = [...html.matchAll(/<h2[^>]*>([^<]*)<\/h2>/gi)];
  const h3Matches = [...html.matchAll(/<h3[^>]*>([^<]*)<\/h3>/gi)];
  const h4Matches = [...html.matchAll(/<h4[^>]*>([^<]*)<\/h4>/gi)];
  const h5Matches = [...html.matchAll(/<h5[^>]*>([^<]*)<\/h5>/gi)];
  const h6Matches = [...html.matchAll(/<h6[^>]*>([^<]*)<\/h6>/gi)];
  
  // Extract additional on-page elements
  const metaKeywordsMatch = html.match(/<meta[^>]*name=["']keywords["'][^>]*content=["']([^"']*)["']/i);
  const metaKeywords = metaKeywordsMatch ? metaKeywordsMatch[1] : '';
  
  const metaAuthorMatch = html.match(/<meta[^>]*name=["']author["'][^>]*content=["']([^"']*)["']/i);
  const metaAuthor = metaAuthorMatch ? metaAuthorMatch[1] : '';
  
  const metaLanguageMatch = html.match(/<html[^>]*lang=["']([^"']*)["']/i);
  const pageLanguage = metaLanguageMatch ? metaLanguageMatch[1] : '';
  
  // Extract bold and italic text for keyword emphasis
  const strongMatches = [...html.matchAll(/<strong[^>]*>([^<]*)<\/strong>/gi)];
  const bMatches = [...html.matchAll(/<b[^>]*>([^<]*)<\/b>/gi)];
  const emMatches = [...html.matchAll(/<em[^>]*>([^<]*)<\/em>/gi)];
  const iMatches = [...html.matchAll(/<i[^>]*>([^<]*)<\/i>/gi)];
  
  // Extract links first 
  const linkMatches = [...html.matchAll(/<a[^>]*href=["']([^"']*)["'][^>]*>([^<]*)<\/a>/gi)];
  
  // Extract anchor text for internal links
  const anchorTexts = linkMatches.map(match => match[2].trim()).filter(text => text.length > 0);
  
  // Check for semantic HTML5 elements
  const hasMainTag = html.includes('<main');
  const hasArticleTag = html.includes('<article');
  const hasSectionTag = html.includes('<section');
  const hasAsideTag = html.includes('<aside');
  const hasHeaderTag = html.includes('<header');
  
  // Check for multimedia elements
  const videoMatches = [...html.matchAll(/<video[^>]*>/gi)];
  const audioMatches = [...html.matchAll(/<audio[^>]*>/gi)];
  const iframeMatches = [...html.matchAll(/<iframe[^>]*>/gi)];
  
  // Check for accessibility features  
  const ariaLabelsCount = (html.match(/aria-label=/gi) || []).length;
  const altAttributesCount = (html.match(/alt=/gi) || []).length;
  
  // Extract page performance hints
  const hasPreloadLinks = html.includes('rel="preload"');
  const hasPrefetchLinks = html.includes('rel="prefetch"');
  const hasModuleScript = html.includes('type="module"');
  
  // Check content structure indicators
  const listMatches = [...html.matchAll(/<[uo]l[^>]*>/gi)];
  const tableMatches = [...html.matchAll(/<table[^>]*>/gi)];
  const formMatches = [...html.matchAll(/<form[^>]*>/gi)];
  
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
  
  // Process links to extract detailed information
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
  
  // Additional technical checks
  const hasGzip = html.includes('gzip') || html.includes('compress');
  const hasLazyLoading = html.includes('loading="lazy"');
  const hasPreconnect = html.includes('rel="preconnect"');
  const hasDNSPrefetch = html.includes('rel="dns-prefetch"');
  const hasAmp = html.includes('⚡') || html.includes('amp-');
  const hasServiceWorker = html.includes('serviceWorker') || html.includes('sw.js');
  const hasWebP = html.includes('.webp');
  const hasXMLSitemap = html.includes('sitemap.xml');
  const hasRobotsTxt = html.includes('robots.txt');
  const hasHttp2 = finalUrl.startsWith('https://'); // Assume HTTPS sites use HTTP/2
  const hasContentSecurity = html.includes('Content-Security-Policy');
  const hasHsts = html.includes('Strict-Transport-Security');
  
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

  // ADA & WCAG Accessibility Compliance Checks
  const hasLangAttribute = html.includes('<html') && html.includes('lang=');
  const hasAltTextImages = (() => {
    const imgMatches = [...html.matchAll(/<img[^>]*>/gi)];
    const totalImages = imgMatches.length;
    if (totalImages === 0) return true; // No images to check
    const imagesWithAlt = imgMatches.filter(match => match[0].includes('alt=')).length;
    return imagesWithAlt / totalImages > 0.8; // 80% threshold for good compliance
  })();
  const hasAriaLabels = html.includes('aria-label') || html.includes('aria-labelledby');
  const hasSkipLinks = html.includes('skip') && (html.includes('content') || html.includes('main'));
  const hasFocusIndicators = html.includes(':focus') || html.includes('focus-');
  const hasSemanticMarkup = html.includes('<main') || html.includes('<article') || html.includes('<section');
  const hasHeadingHierarchy = (() => {
    const h1Count = (html.match(/<h1[^>]*>/gi) || []).length;
    const hasH2 = html.includes('<h2');
    return h1Count === 1 && hasH2; // Should have exactly one H1 and some H2s
  })();
  const hasColorContrast = !html.includes('color:') || html.includes('contrast') || html.includes('wcag');
  const hasAccessibleForms = (() => {
    const hasForm = html.includes('<form');
    if (!hasForm) return true; // No forms to check
    return html.includes('<label') && (html.includes('for=') || html.includes('aria-label'));
  })();
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
  const technicalData = {
    hasHttps, hasViewport, hasCanonical, hasFavicon, hasOpenGraph, hasTwitterCard, 
    hasSchemaMarkup, hasGoogleAnalytics, hasGoogleSearchConsole, hasSitemap, 
    structuredDataTypes, urlHasHyphens, urlHasUnderscores, urlIsReadable, 
    hasNavigation, responseTime, hasGzip, hasLazyLoading, hasPreconnect, 
    hasDNSPrefetch, hasAmp, hasServiceWorker, hasWebP, hasXMLSitemap, 
    hasRobotsTxt, hasHttp2, hasContentSecurity, hasHsts, hasRobots,
    // ADA & WCAG Accessibility
    hasLangAttribute, hasAltTextImages, hasAriaLabels, hasSkipLinks, 
    hasFocusIndicators, hasSemanticMarkup, hasHeadingHierarchy, 
    hasColorContrast, hasAccessibleForms
  };
  
  const onPageData = {
    title, titleLine, metaDescription, metaDescLine, metaKeywords, metaAuthor, pageLanguage,
    h1Matches, h2Matches, h3Matches, h4Matches, h5Matches, h6Matches,
    strongMatches, bMatches, emMatches, iMatches, images, anchorTexts,
    hasMainTag, hasArticleTag, hasSectionTag, hasAsideTag, hasHeaderTag,
    hasSkipLinks, ariaLabelsCount, altAttributesCount, hasPreloadLinks, hasPrefetchLinks
  };
  
  const contentData = {
    wordCount, textContent, listMatches, tableMatches, formMatches,
    videoMatches, audioMatches, iframeMatches, hasModuleScript, links
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
      structuredDataTypes: structuredDataTypes
    }
  };
}

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
    // ADA & WCAG Accessibility
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
      practicalExample: responseTime > 1000 ? 'Add cache headers: Cache-Control: public, max-age=31536000' : null
    },
    {
      label: 'Image Optimization & Lazy Loading',
      description: 'Lazy loading and modern image formats improve page performance and user experience.',
      score: hasLazyLoading ? 100 : hasWebP ? 85 : 70,
      current: hasLazyLoading ? 'Lazy loading detected' : hasWebP ? 'WebP images found' : 'Standard image loading',
      path: 'Image elements',
      issues: !hasLazyLoading ? ['Images not using lazy loading'] : [],
      recommendations: !hasLazyLoading ? ['Add loading="lazy" to images below the fold'] : ['Image optimization is good'],
      practicalExample: !hasLazyLoading ? '<img src="image.webp" alt="Description" loading="lazy" width="400" height="300">' : null
    },
    {
      label: 'Resource Preloading & DNS Optimization',
      description: 'Preconnect and DNS prefetch improve loading speed by establishing early connections.',
      score: hasPreconnect && hasDNSPrefetch ? 100 : hasPreconnect || hasDNSPrefetch ? 80 : 60,
      current: hasPreconnect && hasDNSPrefetch ? 'Both preconnect and DNS prefetch found' : hasPreconnect ? 'Preconnect found' : hasDNSPrefetch ? 'DNS prefetch found' : 'No resource preloading',
      path: 'HTML head section',
      issues: !hasPreconnect && !hasDNSPrefetch ? ['No resource preloading optimizations'] : [],
      recommendations: !hasPreconnect && !hasDNSPrefetch ? ['Add preconnect and DNS prefetch for external resources'] : ['Resource preloading is configured'],
      practicalExample: !hasPreconnect && !hasDNSPrefetch ? '<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="dns-prefetch" href="//cdn.example.com">' : null
    },
    {
      label: 'Robots Meta & Crawl Directives',
      description: 'Robots meta tags control how search engines crawl and index your pages.',
      score: hasRobots ? 100 : 85,
      current: hasRobots ? 'Robots meta tag found' : 'No robots meta tag (default crawling)',
      path: hasRobots ? 'HTML head section' : 'Not specified',
      issues: [],
      recommendations: hasRobots ? ['Robots directives are set'] : ['Consider adding robots meta tag if needed'],
      practicalExample: !hasRobots ? '<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">' : null
    },
    {
      label: 'XML Sitemap & Robots.txt',
      description: 'XML sitemaps and robots.txt help search engines discover and crawl your content efficiently.',
      score: hasXMLSitemap && hasRobotsTxt ? 100 : hasXMLSitemap || hasRobotsTxt ? 80 : 60,
      current: hasXMLSitemap && hasRobotsTxt ? 'Both sitemap and robots.txt referenced' : hasXMLSitemap ? 'XML sitemap referenced' : hasRobotsTxt ? 'Robots.txt referenced' : 'No sitemap/robots.txt references',
      path: 'Site-wide files',
      issues: !hasXMLSitemap ? ['XML sitemap not referenced'] : [],
      recommendations: !hasXMLSitemap ? ['Create and submit XML sitemap to search engines'] : ['Sitemap configuration is good'],
      practicalExample: !hasXMLSitemap ? 'Add to robots.txt: Sitemap: https://example.com/sitemap.xml' : null
    },
    {
      label: 'Twitter Card Meta Tags',
      description: 'Twitter Cards enhance how content appears when shared on Twitter, improving engagement.',
      score: hasTwitterCard ? 100 : 70,
      current: hasTwitterCard ? 'Twitter Card tags found' : 'No Twitter Card tags',
      path: hasTwitterCard ? 'HTML head section' : 'Not found',
      issues: hasTwitterCard ? [] : ['Missing Twitter Card meta tags'],
      recommendations: hasTwitterCard ? ['Twitter Cards properly configured'] : ['Add Twitter Card meta tags for better social sharing'],
      practicalExample: hasTwitterCard ? null : `<meta name="twitter:card" content="summary_large_image">\n<meta name="twitter:title" content="${websiteContext.primaryKeyword} Services | ${websiteContext.brandName}">\n<meta name="twitter:description" content="Professional ${websiteContext.industry} services">`
    },
    {
      label: 'ADA & WCAG Compliance - Language Declaration',
      description: 'Language attribute helps screen readers and assistive technologies properly interpret content.',
      score: hasLangAttribute ? 100 : 40,
      current: hasLangAttribute ? 'Language attribute found on HTML element' : 'No language attribute detected',
      path: hasLangAttribute ? 'HTML element' : 'Missing from HTML tag',
      issues: hasLangAttribute ? [] : ['Missing lang attribute on HTML element'],
      recommendations: hasLangAttribute ? ['Language declaration is properly set'] : ['Add lang attribute to HTML element for accessibility'],
      practicalExample: hasLangAttribute ? null : '<html lang="en">'
    },
    {
      label: 'ADA & WCAG Compliance - Image Accessibility',
      description: 'Alt text on images is essential for screen readers and visually impaired users.',
      score: hasAltTextImages ? 100 : 30,
      current: hasAltTextImages ? 'Most images have alt attributes' : 'Many images missing alt text',
      path: 'Image elements throughout site',
      issues: hasAltTextImages ? [] : ['Images missing alt attributes'],
      recommendations: hasAltTextImages ? ['Image accessibility is well implemented'] : ['Add descriptive alt text to all images'],
      practicalExample: hasAltTextImages ? null : '<img src="logo.png" alt="Company name logo" width="200" height="60">'
    },
    {
      label: 'ADA & WCAG Compliance - ARIA Labels & Landmarks',
      description: 'ARIA labels provide additional context for screen readers and assistive technologies.',
      score: hasAriaLabels ? 100 : 60,
      current: hasAriaLabels ? 'ARIA labels or landmarks detected' : 'No ARIA labels found',
      path: hasAriaLabels ? 'Various elements' : 'Not implemented',
      issues: hasAriaLabels ? [] : ['Consider adding ARIA labels for better accessibility'],
      recommendations: hasAriaLabels ? ['ARIA implementation is present'] : ['Add ARIA labels to interactive elements and form controls'],
      practicalExample: hasAriaLabels ? null : '<button aria-label="Close dialog">×</button>\n<nav aria-label="Main navigation">'
    },
    {
      label: 'ADA & WCAG Compliance - Heading Hierarchy',
      description: 'Proper heading structure (H1-H6) creates logical content flow for screen readers.',
      score: hasHeadingHierarchy ? 100 : 50,
      current: hasHeadingHierarchy ? 'Heading hierarchy properly structured' : 'Heading structure needs improvement',
      path: 'Document structure',
      issues: hasHeadingHierarchy ? [] : ['Heading hierarchy should be improved'],
      recommendations: hasHeadingHierarchy ? ['Heading structure follows best practices'] : ['Use one H1 per page and follow logical H2, H3 sequence'],
      practicalExample: hasHeadingHierarchy ? null : '<h1>Main Page Title</h1>\n<h2>Section Title</h2>\n<h3>Subsection Title</h3>'
    },
    {
      label: 'ADA & WCAG Compliance - Accessible Forms',
      description: 'Form labels and proper association help users understand form purpose and requirements.',
      score: hasAccessibleForms ? 100 : 50,
      current: hasAccessibleForms ? 'Forms have proper labels' : 'Forms may lack proper labeling',
      path: 'Form elements',
      issues: hasAccessibleForms ? [] : ['Forms should have proper labels'],
      recommendations: hasAccessibleForms ? ['Form accessibility is well implemented'] : ['Associate labels with form inputs using for attributes'],
      practicalExample: hasAccessibleForms ? null : '<label for="email">Email Address</label>\n<input type="email" id="email" required>'
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

function generateEnhancedOnPageResults(data, websiteContext) {
  const {
    title, titleLine, metaDescription, metaDescLine, metaKeywords, metaAuthor, pageLanguage,
    h1Matches, h2Matches, h3Matches, h4Matches, h5Matches, h6Matches,
    strongMatches, bMatches, emMatches, iMatches, images, anchorTexts,
    hasMainTag, hasArticleTag, hasSectionTag, hasAsideTag, hasHeaderTag,
    hasSkipLinks, ariaLabelsCount, altAttributesCount, hasPreloadLinks, hasPrefetchLinks
  } = data;

  return [
    {
      label: 'Title Tag Optimization',
      description: 'Page title is crucial for search rankings and click-through rates from search results.',
      score: title ? (title.length >= 30 && title.length <= 60 ? 100 : title.length >= 20 ? 85 : 60) : 0,
      current: title || 'Missing title tag',
      path: titleLine !== 'Not found' ? `Line ${titleLine}` : 'Not found',
      issues: !title ? ['Missing title tag'] : title.length < 30 ? [`Title too short (${title.length} characters)`] : title.length > 60 ? [`Title may be truncated (${title.length} characters)`] : [],
      recommendations: !title ? ['Add a unique, descriptive title tag between 30-60 characters'] : title.length < 30 ? ['Expand title to 30-60 characters for optimal SEO impact'] : title.length > 60 ? ['Shorten title to under 60 characters to prevent truncation'] : [],
      practicalExample: !title ? `<title>${capitalizeFirst(websiteContext.brandName)} - Professional ${websiteContext.industry} Services</title>` : title.length < 30 ? `<title>${title} - ${capitalizeFirst(websiteContext.brandName)} Services</title>` : title.length > 60 ? `<title>${title.substring(0, 50)}... | ${capitalizeFirst(websiteContext.brandName)}</title>` : null
    },
    {
      label: 'Meta Description Optimization',
      description: 'Meta descriptions influence click-through rates and provide context about page content to search engines.',
      score: metaDescription ? (metaDescription.length >= 150 && metaDescription.length <= 160 ? 100 : metaDescription.length >= 120 ? 85 : 60) : 0,
      current: metaDescription || 'Missing meta description',
      path: metaDescLine !== 'Not found' ? `Line ${metaDescLine}` : 'Not found',
      issues: !metaDescription ? ['Missing meta description'] : metaDescription.length < 120 ? [`Meta description too short (${metaDescription.length} characters)`] : metaDescription.length > 160 ? [`Meta description may be truncated (${metaDescription.length} characters)`] : [],
      recommendations: !metaDescription ? ['Add a compelling meta description between 150-160 characters'] : metaDescription.length < 120 ? ['Expand meta description to 150-160 characters'] : metaDescription.length > 160 ? ['Shorten meta description to prevent truncation'] : [],
      practicalExample: !metaDescription ? `<meta name="description" content="Professional ${websiteContext.industry} services from ${capitalizeFirst(websiteContext.brandName)}. Get expert solutions and quality results. Contact us today for a free consultation.">` : metaDescription.length < 120 ? `<meta name="description" content="${metaDescription} Get expert solutions from ${capitalizeFirst(websiteContext.brandName)}. Contact us today for professional service.">` : null
    },
    {
      label: 'Heading Structure (H1-H6)',
      description: 'Proper heading hierarchy helps search engines understand content structure and improves accessibility.',
      score: h1Matches.length === 1 ? (h2Matches.length > 0 ? 100 : 85) : (h1Matches.length === 0 ? 40 : 70),
      current: `H1: ${h1Matches.length}, H2: ${h2Matches.length}, H3: ${h3Matches.length}, H4: ${h4Matches.length}, H5: ${h5Matches.length}, H6: ${h6Matches.length}`,
      path: 'Throughout page content',
      issues: h1Matches.length === 0 ? ['Missing H1 tag'] : h1Matches.length > 1 ? [`Multiple H1 tags found (${h1Matches.length})`] : h2Matches.length === 0 ? ['No H2 tags found - missing content structure'] : [],
      recommendations: h1Matches.length === 0 ? ['Add exactly one H1 tag that describes the main topic'] : h1Matches.length > 1 ? ['Use only one H1 tag per page; convert others to H2-H6'] : h2Matches.length === 0 ? ['Add H2 tags to structure your content properly'] : [],
      practicalExample: h1Matches.length === 0 ? `<h1>Professional ${websiteContext.industry} Services - ${capitalizeFirst(websiteContext.brandName)}</h1>\n<h2>Our Services</h2>\n<h3>Why Choose Us</h3>` : h1Matches.length > 1 ? `<h1>${h1Matches[0][1]}</h1>\n<h2>${h1Matches[1][1]}</h2>\n<h3>Supporting Information</h3>` : null
    },
    {
      label: 'Meta Keywords Tag',
      description: 'While not directly used for rankings, meta keywords can help with content organization and internal analysis.',
      score: metaKeywords ? 100 : 80,
      current: metaKeywords || 'No meta keywords tag',
      path: metaKeywords ? 'HTML head section' : 'Not found',
      issues: [],
      recommendations: metaKeywords ? ['Meta keywords are present'] : ['Consider adding meta keywords for content organization'],
      practicalExample: !metaKeywords ? `<meta name="keywords" content="${websiteContext.keywords.slice(0, 5).join(', ')}, ${websiteContext.industry}, ${websiteContext.brandName}">` : null
    },
    {
      label: 'Page Language Declaration',
      description: 'Language declaration helps search engines understand content language and improves international SEO.',
      score: pageLanguage ? 100 : 70,
      current: pageLanguage || 'No language specified',
      path: pageLanguage ? 'HTML tag' : 'Not found',
      issues: !pageLanguage ? ['Missing language declaration'] : [],
      recommendations: !pageLanguage ? ['Add lang attribute to HTML tag'] : ['Language declaration is properly set'],
      practicalExample: !pageLanguage ? '<html lang="en">' : null
    },
    {
      label: 'Author Information',
      description: 'Author meta tag helps establish content authority and can support E-A-T (Expertise, Authoritativeness, Trustworthiness).',
      score: metaAuthor ? 100 : 75,
      current: metaAuthor || 'No author specified',
      path: metaAuthor ? 'HTML head section' : 'Not found',
      issues: [],
      recommendations: metaAuthor ? ['Author information is present'] : ['Consider adding author meta tag for content authority'],
      practicalExample: !metaAuthor ? `<meta name="author" content="${capitalizeFirst(websiteContext.brandName)} Team">` : null
    },
    {
      label: 'Text Emphasis & Keywords',
      description: 'Proper use of bold and italic text helps emphasize important keywords and improves content readability.',
      score: (strongMatches.length + bMatches.length + emMatches.length + iMatches.length) > 0 ? 100 : 70,
      current: `Strong: ${strongMatches.length}, Bold: ${bMatches.length}, Em: ${emMatches.length}, Italic: ${iMatches.length}`,
      path: 'Throughout page content',
      issues: (strongMatches.length + bMatches.length + emMatches.length + iMatches.length) === 0 ? ['No text emphasis found'] : [],
      recommendations: (strongMatches.length + bMatches.length + emMatches.length + iMatches.length) === 0 ? ['Add emphasis to important keywords using <strong> or <em> tags'] : ['Good use of text emphasis'],
      practicalExample: (strongMatches.length + bMatches.length + emMatches.length + iMatches.length) === 0 ? `<p>We provide <strong>${websiteContext.primaryKeyword}</strong> services with <em>professional expertise</em>.</p>` : null
    },
    {
      label: 'Image SEO Optimization',
      description: 'Proper image optimization with alt tags improves accessibility and helps search engines understand visual content.',
      score: images.length === 0 ? 100 : Math.max(0, 100 - (images.filter(img => !img.hasAlt).length / images.length) * 50),
      current: `${images.length} images, ${images.filter(img => img.hasAlt).length} with alt tags`,
      path: 'Throughout page content',
      issues: images.filter(img => !img.hasAlt).length > 0 ? [`${images.filter(img => !img.hasAlt).length} images missing alt attributes`] : images.length === 0 ? ['No images found'] : [],
      recommendations: images.length === 0 ? ['Consider adding relevant images with proper alt text'] : images.filter(img => !img.hasAlt).length === 0 ? ['All images have alt text - excellent for accessibility'] : ['Add descriptive alt text to all images for accessibility and SEO'],
      practicalExample: images.length === 0 ? `<img src="${websiteContext.industry}-services.jpg" alt="Professional ${websiteContext.industry} services by ${capitalizeFirst(websiteContext.brandName)}" width="400" height="300">` : images.filter(img => !img.hasAlt).length > 0 ? `<img src="${images.find(img => !img.hasAlt)?.src || 'image.jpg'}" alt="Professional ${websiteContext.industry} services provided by ${capitalizeFirst(websiteContext.brandName)}" width="400" height="300">` : null
    },
    {
      label: 'Semantic HTML5 Elements',
      description: 'Modern HTML5 semantic elements help search engines better understand page structure and content organization.',
      score: [hasMainTag, hasArticleTag, hasSectionTag, hasAsideTag, hasHeaderTag].filter(Boolean).length * 20,
      current: `Main: ${hasMainTag ? 'Yes' : 'No'}, Article: ${hasArticleTag ? 'Yes' : 'No'}, Section: ${hasSectionTag ? 'Yes' : 'No'}, Aside: ${hasAsideTag ? 'Yes' : 'No'}, Header: ${hasHeaderTag ? 'Yes' : 'No'}`,
      path: 'Throughout page structure',
      issues: [hasMainTag, hasArticleTag, hasSectionTag, hasAsideTag, hasHeaderTag].filter(Boolean).length < 2 ? ['Limited use of semantic HTML5 elements'] : [],
      recommendations: [hasMainTag, hasArticleTag, hasSectionTag, hasAsideTag, hasHeaderTag].filter(Boolean).length < 2 ? ['Use more semantic HTML5 elements like <main>, <article>, <section>, <aside>, <header>'] : ['Good use of semantic HTML5 elements'],
      practicalExample: !hasMainTag ? '<main>\n  <article>\n    <header>\n      <h1>Page Title</h1>\n    </header>\n    <section>\n      <h2>Content Section</h2>\n    </section>\n  </article>\n</main>' : null
    },
    {
      label: 'Accessibility Features',
      description: 'Accessibility features improve user experience for all users and are considered by search engines for rankings.',
      score: hasSkipLinks ? 100 : ariaLabelsCount > 0 ? 85 : altAttributesCount > 0 ? 70 : 50,
      current: `Skip links: ${hasSkipLinks ? 'Yes' : 'No'}, ARIA labels: ${ariaLabelsCount}, Alt attributes: ${altAttributesCount}`,
      path: 'Throughout page content',
      issues: !hasSkipLinks && ariaLabelsCount === 0 ? ['Limited accessibility features'] : [],
      recommendations: !hasSkipLinks ? ['Add skip navigation links for keyboard users'] : ariaLabelsCount === 0 ? ['Consider adding ARIA labels for better accessibility'] : ['Good accessibility implementation'],
      practicalExample: !hasSkipLinks ? '<a href="#main-content" class="skip-link">Skip to main content</a>\n<div id="main-content">' : ariaLabelsCount === 0 ? '<button aria-label="Open navigation menu">Menu</button>' : null
    },
    {
      label: 'Performance Hints & Preloading',
      description: 'Resource hints like preload and prefetch improve page loading performance, which is a ranking factor.',
      score: hasPreloadLinks && hasPrefetchLinks ? 100 : hasPreloadLinks || hasPrefetchLinks ? 80 : 60,
      current: `Preload links: ${hasPreloadLinks ? 'Yes' : 'No'}, Prefetch links: ${hasPrefetchLinks ? 'Yes' : 'No'}`,
      path: 'HTML head section',
      issues: !hasPreloadLinks && !hasPrefetchLinks ? ['No performance optimization hints found'] : [],
      recommendations: !hasPreloadLinks && !hasPrefetchLinks ? ['Add preload and prefetch hints for critical resources'] : ['Performance hints are configured'],
      practicalExample: !hasPreloadLinks && !hasPrefetchLinks ? '<link rel="preload" href="critical-font.woff2" as="font" type="font/woff2" crossorigin>\n<link rel="prefetch" href="next-page.html">' : null
    }
  ];
}

function generateEnhancedContentResults(data, websiteContext) {
  const {
    wordCount, textContent, listMatches, tableMatches, formMatches,
    videoMatches, audioMatches, iframeMatches, hasModuleScript, links
  } = data;

  const internalLinks = links.filter(l => l.isInternal);
  const externalLinks = links.filter(l => l.isExternal);
  const readingTime = Math.ceil(wordCount / 200); // Average reading speed

  return [
    {
      label: 'Content Length & Quality',
      description: 'Comprehensive content with adequate word count performs better in search results and provides more value to users.',
      score: wordCount >= 1000 ? 100 : wordCount >= 500 ? 85 : wordCount >= 300 ? 70 : wordCount >= 150 ? 50 : 30,
      current: `${wordCount} words (${readingTime} min read)`,
      path: 'Page content analysis',
      issues: wordCount < 300 ? ['Content is too short for effective SEO'] : wordCount < 500 ? ['Content could be more comprehensive'] : [],
      recommendations: wordCount < 300 ? ['Expand content to at least 300 words for better SEO performance'] : wordCount < 500 ? ['Consider adding more detailed information to reach 500+ words'] : wordCount < 1000 ? ['Content length is good, consider expanding to 1000+ words for competitive topics'] : ['Excellent content length'],
      practicalExample: wordCount < 300 ? `Add sections like:\n- Benefits of ${websiteContext.primaryKeyword}\n- How ${websiteContext.primaryKeyword} works\n- Why choose ${websiteContext.brandName}\n- Frequently asked questions\n- Customer testimonials` : null
    },
    {
      label: 'Content Structure Elements',
      description: 'Lists, tables, and forms provide structured content that enhances user experience and search engine understanding.',
      score: (listMatches.length > 0 ? 30 : 0) + (tableMatches.length > 0 ? 35 : 0) + (formMatches.length > 0 ? 35 : 0),
      current: `Lists: ${listMatches.length}, Tables: ${tableMatches.length}, Forms: ${formMatches.length}`,
      path: 'Throughout page content',
      issues: listMatches.length === 0 && tableMatches.length === 0 ? ['Limited content structure elements'] : [],
      recommendations: listMatches.length === 0 ? ['Add bulleted or numbered lists to improve content structure'] : tableMatches.length === 0 && formMatches.length === 0 ? ['Consider adding tables or forms where appropriate'] : ['Good use of content structure elements'],
      practicalExample: listMatches.length === 0 ? `<h3>Benefits of ${websiteContext.primaryKeyword}:</h3>\n<ul>\n  <li>Professional expertise</li>\n  <li>Quality results</li>\n  <li>Competitive pricing</li>\n  <li>Excellent customer service</li>\n</ul>` : null
    },
    {
      label: 'Multimedia Content Integration',
      description: 'Videos, audio, and embedded content enhance user engagement and can improve dwell time, a positive ranking signal.',
      score: (videoMatches.length > 0 ? 40 : 0) + (audioMatches.length > 0 ? 30 : 0) + (iframeMatches.length > 0 ? 30 : 0),
      current: `Videos: ${videoMatches.length}, Audio: ${audioMatches.length}, Embedded content: ${iframeMatches.length}`,
      path: 'Throughout page content',
      issues: videoMatches.length === 0 && audioMatches.length === 0 && iframeMatches.length === 0 ? ['No multimedia content found'] : [],
      recommendations: videoMatches.length === 0 && audioMatches.length === 0 && iframeMatches.length === 0 ? ['Consider adding videos or other multimedia content to enhance user engagement'] : ['Good multimedia integration'],
      practicalExample: videoMatches.length === 0 && audioMatches.length === 0 ? `<video width="560" height="315" controls>\n  <source src="${websiteContext.primaryKeyword}-demo.mp4" type="video/mp4">\n  Your browser does not support the video tag.\n</video>` : null
    },
    {
      label: 'Internal Linking Structure',
      description: 'Strong internal linking helps distribute page authority and improves site navigation for users and search engines.',
      score: internalLinks.length >= 5 ? 100 : internalLinks.length >= 3 ? 80 : internalLinks.length >= 1 ? 60 : 20,
      current: `${internalLinks.length} internal links`,
      path: 'Throughout page content',
      issues: internalLinks.length < 3 ? ['Insufficient internal linking'] : [],
      recommendations: internalLinks.length < 3 ? ['Add more internal links to related pages and services'] : internalLinks.length < 5 ? ['Good internal linking, consider adding 1-2 more relevant links'] : ['Excellent internal linking structure'],
      practicalExample: internalLinks.length < 3 ? `<p>Learn more about our <a href="/about">company background</a> and explore our <a href="/services">${websiteContext.industry} services</a>. Contact us through our <a href="/contact">contact page</a> for a consultation.</p>` : null
    },
    {
      label: 'External Link Authority',
      description: 'Quality external links to authoritative sources can enhance content credibility and provide additional value to users.',
      score: externalLinks.length >= 2 ? 100 : externalLinks.length >= 1 ? 80 : 60,
      current: `${externalLinks.length} external links`,
      path: 'Throughout page content',
      issues: externalLinks.length === 0 ? ['No external links found'] : [],
      recommendations: externalLinks.length === 0 ? ['Consider adding 1-2 links to authoritative external sources'] : externalLinks.length < 2 ? ['Good external linking, consider adding one more authoritative link'] : ['Good external link profile'],
      practicalExample: externalLinks.length === 0 ? `<p>According to <a href="https://www.industry-authority.com" target="_blank" rel="noopener">Industry Authority</a>, ${websiteContext.primaryKeyword} best practices include...</p>` : null
    },
    {
      label: 'Keyword Density & Distribution',
      description: 'Proper keyword usage throughout content helps search engines understand topic relevance without over-optimization.',
      score: calculateKeywordScore(textContent, websiteContext.primaryKeyword),
      current: `Primary keyword appears ${countKeywordOccurrences(textContent, websiteContext.primaryKeyword)} times`,
      path: 'Content analysis',
      issues: countKeywordOccurrences(textContent, websiteContext.primaryKeyword) === 0 ? ['Primary keyword not found in content'] : countKeywordOccurrences(textContent, websiteContext.primaryKeyword) < 2 ? ['Primary keyword used too rarely'] : [],
      recommendations: countKeywordOccurrences(textContent, websiteContext.primaryKeyword) === 0 ? [`Include "${websiteContext.primaryKeyword}" naturally throughout the content`] : countKeywordOccurrences(textContent, websiteContext.primaryKeyword) < 2 ? [`Use "${websiteContext.primaryKeyword}" 2-5 times naturally in the content`] : ['Good keyword usage'],
      practicalExample: countKeywordOccurrences(textContent, websiteContext.primaryKeyword) < 2 ? `<h2>Why Choose Our ${websiteContext.primaryKeyword} Services?</h2>\n<p>Our ${websiteContext.primaryKeyword} expertise ensures quality results for every project.</p>` : null
    },
    {
      label: 'Content Freshness & Updates',
      description: 'Fresh, updated content signals to search engines that the site is actively maintained and provides current information.',
      score: 75, // Default score since we can't detect last modified date from HTML alone
      current: 'Content freshness not detectable from HTML',
      path: 'Content analysis',
      issues: [],
      recommendations: ['Regularly update content with fresh information', 'Add publication or last modified dates to content'],
      practicalExample: '<p><small>Last updated: <time datetime="2024-01-15">January 15, 2024</time></small></p>'
    },
    {
      label: 'Call-to-Action Elements',
      description: 'Clear calls-to-action improve user engagement and conversion rates, which can indirectly benefit SEO through user signals.',
      score: formMatches.length > 0 ? 100 : textContent.toLowerCase().includes('contact') || textContent.toLowerCase().includes('call') ? 80 : 60,
      current: formMatches.length > 0 ? `${formMatches.length} forms found` : 'CTAs detected in text',
      path: 'Throughout page content',
      issues: formMatches.length === 0 && !textContent.toLowerCase().includes('contact') ? ['No clear call-to-action elements found'] : [],
      recommendations: formMatches.length === 0 ? ['Add contact forms or clear call-to-action buttons'] : ['Good call-to-action implementation'],
      practicalExample: formMatches.length === 0 ? `<div class="cta-section">\n  <h3>Ready to get started?</h3>\n  <p>Contact ${websiteContext.brandName} today for professional ${websiteContext.industry} services.</p>\n  <a href="/contact" class="cta-button">Get Free Quote</a>\n</div>` : null
    },
    {
      label: 'Topic Authority & Expertise',
      description: 'Demonstrating expertise in your field helps establish E-A-T (Expertise, Authoritativeness, Trustworthiness) for better rankings.',
      score: calculateExpertiseScore(textContent, websiteContext.industry),
      current: 'Topic authority analysis based on content',
      path: 'Content analysis',
      issues: calculateExpertiseScore(textContent, websiteContext.industry) < 70 ? ['Content could demonstrate more expertise'] : [],
      recommendations: calculateExpertiseScore(textContent, websiteContext.industry) < 70 ? ['Add more detailed explanations, case studies, or technical information to demonstrate expertise'] : ['Good demonstration of topic expertise'],
      practicalExample: calculateExpertiseScore(textContent, websiteContext.industry) < 70 ? `<section>\n  <h3>Our ${websiteContext.industry} Methodology</h3>\n  <p>With over X years of experience, ${websiteContext.brandName} follows industry best practices...</p>\n</section>` : null
    },
    {
      label: 'Content Readability & Structure',
      description: 'Well-structured, readable content improves user experience and helps search engines understand content hierarchy.',
      score: calculateReadabilityScore(wordCount, textContent),
      current: `Estimated readability based on ${wordCount} words`,
      path: 'Content analysis',
      issues: calculateReadabilityScore(wordCount, textContent) < 70 ? ['Content structure could be improved for better readability'] : [],
      recommendations: calculateReadabilityScore(wordCount, textContent) < 70 ? ['Break up long paragraphs, use more subheadings, and simplify complex sentences'] : ['Good content readability'],
      practicalExample: calculateReadabilityScore(wordCount, textContent) < 70 ? `<h3>What is ${websiteContext.primaryKeyword}?</h3>\n<p>Short, clear paragraph explaining the concept.</p>\n\n<h3>How does it work?</h3>\n<p>Another concise paragraph with actionable information.</p>` : null
    }
  ];
}

// Helper functions for enhanced content analysis
function countKeywordOccurrences(text, keyword) {
  if (!keyword || !text) return 0;
  // Use a safer approach to escape regex special characters
  const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, function(match) {
    return '\\' + match;
  });
  const regex = new RegExp(escapedKeyword, 'gi');
  return (text.match(regex) || []).length;
}

function calculateKeywordScore(text, keyword) {
  const occurrences = countKeywordOccurrences(text, keyword);
  const wordCount = text.split(/\s+/).length;
  const density = (occurrences / wordCount) * 100;
  
  if (density === 0) return 0;
  if (density > 0.5 && density <= 2) return 100;
  if (density > 2 && density <= 3) return 85;
  if (density > 3) return 60; // Over-optimization penalty
  if (density > 0 && density <= 0.5) return 70;
  return 50;
}

function calculateExpertiseScore(text, industry) {
  const expertiseWords = ['experience', 'expert', 'professional', 'certified', 'qualified', 'specializ', 'years', 'proven', 'award'];
  const industryTerms = getIndustryTerms(industry);
  
  let score = 60; // Base score
  
  expertiseWords.forEach(word => {
    if (text.toLowerCase().includes(word)) score += 5;
  });
  
  industryTerms.forEach(term => {
    if (text.toLowerCase().includes(term)) score += 3;
  });
  
  return Math.min(100, score);
}

function calculateReadabilityScore(wordCount, text) {
  // Simple readability estimate based on word count and sentence structure
  const sentences = text.split(/[.!?]+/).length;
  const avgWordsPerSentence = wordCount / sentences;
  
  let score = 80; // Base score
  
  if (avgWordsPerSentence > 25) score -= 20; // Long sentences
  if (avgWordsPerSentence > 20) score -= 10;
  if (wordCount < 150) score -= 15; // Too short
  
  return Math.max(30, Math.min(100, score));
}

function getIndustryTerms(industry) {
  const terms = {
    'healthcare': ['patient', 'treatment', 'medical', 'health', 'clinic', 'diagnosis'],
    'legal': ['client', 'case', 'court', 'law', 'attorney', 'legal'],
    'technology': ['software', 'digital', 'solution', 'system', 'tech', 'development'],
    'finance': ['investment', 'financial', 'money', 'capital', 'portfolio', 'banking'],
    'real estate': ['property', 'home', 'house', 'listing', 'market', 'mortgage'],
    'business': ['service', 'solution', 'client', 'customer', 'professional', 'quality']
  };
  
  return terms[industry] || terms['business'];
}
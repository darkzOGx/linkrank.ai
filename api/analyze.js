/**
 * Comprehensive Server-side SEO Analysis API
 * Provides detailed element tracking, paths, and practical examples
 */

// Rate limiting and caching storage
const rateLimits = new Map();
const requestCache = new Map();

// Helper function to check rate limits
function checkRateLimit(ip) {
  const now = Date.now();
  const windowStart = now - 60000; // 1 minute window
  
  if (!rateLimits.has(ip)) {
    rateLimits.set(ip, []);
  }
  
  const requests = rateLimits.get(ip).filter(time => time > windowStart);
  
  if (requests.length >= 20) { // 20 requests per minute
    return false;
  }
  
  requests.push(now);
  rateLimits.set(ip, requests);
  return true;
}

// Helper function to get cached result
function getCachedResult(url) {
  const cached = requestCache.get(url);
  if (cached && Date.now() - cached.timestamp < 300000) { // 5 minute cache
    return cached.result;
  }
  return null;
}

// Helper function to cache result
function cacheResult(url, result) {
  if (requestCache.size > 100) {
    const firstKey = requestCache.keys().next().value;
    requestCache.delete(firstKey);
  }
  
  requestCache.set(url, {
    result,
    timestamp: Date.now()
  });
}

// Enhanced website fetcher
async function fetchWebsite(url) {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'LinkRank.ai SEO Bot/2.0 (+https://linkrank.ai)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none'
      },
      signal: AbortSignal.timeout(20000) // 20 second timeout
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const html = await response.text();
    return {
      html,
      status: response.status,
      url: response.url,
      headers: response.headers,
      redirected: url !== response.url
    };
    
  } catch (error) {
    if (error.name === 'AbortError' || error.name === 'TimeoutError') {
      throw new Error('Website took too long to respond (timeout after 20 seconds)');
    }
    throw new Error(`Failed to fetch website: ${error.message}`);
  }
}

// Comprehensive HTML parser with element tracking
function parseHTMLComprehensive(html) {
  // Helper to extract elements with their positions and attributes
  const extractElementsWithDetails = (tagPattern, attributePattern = null) => {
    const elements = [];
    const regex = new RegExp(tagPattern, 'gi');
    let match;
    let elementIndex = 1;
    
    while ((match = regex.exec(html)) !== null) {
      const element = {
        index: elementIndex++,
        position: match.index,
        fullTag: match[0],
        content: match[1] || '',
        path: `Line ${html.substring(0, match.index).split('\n').length}`,
        attributes: {}
      };
      
      // Extract attributes if specified
      if (attributePattern) {
        const attrMatches = [...match[0].matchAll(attributePattern)];
        attrMatches.forEach(attrMatch => {
          element.attributes[attrMatch[1]] = attrMatch[2];
        });
      }
      
      elements.push(element);
    }
    
    return elements;
  };
  
  // Extract title
  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  const title = {
    value: titleMatch ? titleMatch[1].trim() : '',
    path: titleMatch ? `Line ${html.substring(0, titleMatch.index).split('\n').length}` : 'Not found',
    length: titleMatch ? titleMatch[1].trim().length : 0
  };
  
  // Extract meta description
  const metaDescMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i);
  const metaDescription = {
    value: metaDescMatch ? metaDescMatch[1] : '',
    path: metaDescMatch ? `Line ${html.substring(0, metaDescMatch.index).split('\n').length}` : 'Not found',
    length: metaDescMatch ? metaDescMatch[1].length : 0
  };
  
  // Extract all headings with hierarchy tracking
  const headings = {
    h1: extractElementsWithDetails('<h1[^>]*>([^<]*)<\/h1>'),
    h2: extractElementsWithDetails('<h2[^>]*>([^<]*)<\/h2>'),
    h3: extractElementsWithDetails('<h3[^>]*>([^<]*)<\/h3>'),
    h4: extractElementsWithDetails('<h4[^>]*>([^<]*)<\/h4>'),
    h5: extractElementsWithDetails('<h5[^>]*>([^<]*)<\/h5>'),
    h6: extractElementsWithDetails('<h6[^>]*>([^<]*)<\/h6>')
  };
  
  // Extract images with detailed analysis
  const images = extractElementsWithDetails('<img[^>]*>', /(\w+)=["']([^"']*)["']/g);
  images.forEach(img => {
    img.hasAlt = !!img.attributes.alt;
    img.hasTitle = !!img.attributes.title;
    img.hasSrc = !!img.attributes.src;
    img.isLazy = !!(img.attributes.loading && img.attributes.loading === 'lazy');
    img.hasWidth = !!img.attributes.width;
    img.hasHeight = !!img.attributes.height;
  });
  
  // Extract links with comprehensive analysis
  const links = extractElementsWithDetails('<a[^>]*href=["']([^"']*)["'][^>]*>([^<]*)<\/a>', /(\w+)=["']([^"']*)["']/g);
  links.forEach(link => {
    link.href = link.content;
    link.text = link.fullTag.match(/>([^<]*)<\/a>/)?.[1] || '';
    link.hasTitle = !!link.attributes.title;
    link.hasRel = !!link.attributes.rel;
    link.isExternal = link.href && (link.href.startsWith('http') || link.href.startsWith('//'));
    link.isInternal = link.href && (link.href.startsWith('/') || link.href.startsWith('#'));
  });
  
  // Extract meta tags
  const metaTags = extractElementsWithDetails('<meta[^>]*>', /(\w+)=["']([^"']*)["']/g);
  
  // Extract structured data
  const jsonLdScripts = extractElementsWithDetails('<script[^>]*type=["\']*application\/ld\+json["\'][^>]*>([^<]*)<\/script>');
  const microdataElements = extractElementsWithDetails('<[^>]*itemscope[^>]*>');
  
  // Extract forms for accessibility analysis
  const forms = extractElementsWithDetails('<form[^>]*>');
  const inputs = extractElementsWithDetails('<input[^>]*>', /(\w+)=["']([^"']*)["']/g);
  const labels = extractElementsWithDetails('<label[^>]*>([^<]*)<\/label>', /(\w+)=["']([^"']*)["']/g);
  
  // Extract page content for analysis
  const textContent = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  // Check for important technical elements
  const technicalElements = {
    viewport: html.includes('name="viewport"'),
    canonical: html.includes('rel="canonical"'),
    robots: html.includes('name="robots"'),
    charset: html.includes('charset='),
    openGraph: html.includes('property="og:'),
    twitterCard: html.includes('name="twitter:'),
    favicon: html.includes('rel="icon"') || html.includes('rel="shortcut icon"'),
    sitemap: html.includes('rel="sitemap"'),
    rss: html.includes('rel="alternate"') && html.includes('application/rss+xml')
  };
  
  return {
    title,
    metaDescription,
    headings,
    images,
    links,
    metaTags,
    jsonLdScripts,
    microdataElements,
    forms,
    inputs,
    labels,
    textContent,
    technicalElements,
    wordCount: textContent.split(/\s+/).filter(word => word.length > 0).length,
    htmlLength: html.length
  };
}

// Comprehensive On-Page SEO Analysis
function analyzeOnPageSEO(parsed, url) {
  const results = [];
  
  // Title Tag Analysis
  const titleAnalysis = {
    label: 'Title Tag',
    description: 'The HTML title tag is the most critical on-page SEO element, appearing as the clickable headline in search results.',
    current: parsed.title.value || 'No title tag found',
    path: parsed.title.path,
    score: 0,
    issues: [],
    recommendations: [],
    practicalExample: ''
  };
  
  if (!parsed.title.value) {
    titleAnalysis.score = 0;
    titleAnalysis.issues.push('Missing title tag');
    titleAnalysis.recommendations.push('Add a unique, descriptive title tag between 50-60 characters');
    titleAnalysis.practicalExample = '<title>Your Primary Keyword | Brand Name</title>';
  } else {
    let score = 100;
    const length = parsed.title.length;
    
    if (length < 30) {
      score = 60;
      titleAnalysis.issues.push(`Title too short (${length} characters)`);
      titleAnalysis.recommendations.push('Expand title to 30-60 characters for optimal SEO impact');
      titleAnalysis.practicalExample = `<title>${parsed.title.value} - Additional Keywords | Brand</title>`;
    } else if (length > 60) {
      score = 75;
      titleAnalysis.issues.push(`Title may be truncated (${length} characters)`);
      titleAnalysis.recommendations.push('Shorten title to under 60 characters to prevent truncation in search results');
      titleAnalysis.practicalExample = `<title>${parsed.title.value.substring(0, 50)}...</title>`;
    } else {
      titleAnalysis.recommendations.push('Title length is optimal');
      titleAnalysis.practicalExample = `Current title is well-optimized: "${parsed.title.value}"`;
    }
    
    titleAnalysis.score = score;
  }
  
  results.push(titleAnalysis);
  
  // Meta Description Analysis
  const metaDescAnalysis = {
    label: 'Meta Description',
    description: 'Meta descriptions provide page summaries in search results and significantly influence click-through rates.',
    current: parsed.metaDescription.value || 'No meta description found',
    path: parsed.metaDescription.path,
    score: 0,
    issues: [],
    recommendations: [],
    practicalExample: ''
  };
  
  if (!parsed.metaDescription.value) {
    metaDescAnalysis.score = 0;
    metaDescAnalysis.issues.push('Missing meta description');
    metaDescAnalysis.recommendations.push('Add a compelling meta description between 150-160 characters');
    metaDescAnalysis.practicalExample = '<meta name="description" content="Discover how our services help you achieve your goals. Get started today with our expert team and proven solutions.">';
  } else {
    let score = 100;
    const length = parsed.metaDescription.length;
    
    if (length < 120) {
      score = 70;
      metaDescAnalysis.issues.push(`Meta description too short (${length} characters)`);
      metaDescAnalysis.recommendations.push('Expand to 150-160 characters for better search result display');
      metaDescAnalysis.practicalExample = `<meta name="description" content="${parsed.metaDescription.value} Learn more about our comprehensive solutions and expert support.">`;
    } else if (length > 160) {
      score = 80;
      metaDescAnalysis.issues.push(`Meta description may be truncated (${length} characters)`);
      metaDescAnalysis.recommendations.push('Shorten to 150-160 characters to prevent truncation');
      metaDescAnalysis.practicalExample = `<meta name="description" content="${parsed.metaDescription.value.substring(0, 150)}...">`;
    } else {
      metaDescAnalysis.recommendations.push('Meta description length is optimal');
      metaDescAnalysis.practicalExample = `Current meta description is well-optimized: "${parsed.metaDescription.value}"`;
    }
    
    metaDescAnalysis.score = score;
  }
  
  results.push(metaDescAnalysis);
  
  // Heading Structure Analysis
  const headingAnalysis = {
    label: 'Heading Structure (H1-H6)',
    description: 'Proper heading hierarchy helps search engines understand content structure and improves accessibility.',
    current: `H1: ${parsed.headings.h1.length}, H2: ${parsed.headings.h2.length}, H3: ${parsed.headings.h3.length}, H4: ${parsed.headings.h4.length}, H5: ${parsed.headings.h5.length}, H6: ${parsed.headings.h6.length}`,
    path: '',
    score: 0,
    issues: [],
    recommendations: [],
    practicalExample: '',
    details: []
  };
  
  let headingScore = 100;
  const h1Count = parsed.headings.h1.length;
  
  if (h1Count === 0) {
    headingScore = 40;
    headingAnalysis.issues.push('Missing H1 tag');
    headingAnalysis.recommendations.push('Add exactly one H1 tag that describes the main topic');
    headingAnalysis.practicalExample = '<h1>Your Main Page Topic - Primary Keyword</h1>';
  } else if (h1Count > 1) {
    headingScore = 70;
    headingAnalysis.issues.push(`Multiple H1 tags found (${h1Count})`);
    headingAnalysis.recommendations.push('Use only one H1 tag per page; convert others to H2-H6');
    headingAnalysis.practicalExample = '<h1>Main Topic</h1>\n<h2>Subtopic</h2>\n<h3>Sub-subtopic</h3>';
    
    // Show paths of all H1 tags
    parsed.headings.h1.forEach((h1, index) => {
      headingAnalysis.details.push(`H1 #${index + 1}: "${h1.content}" at ${h1.path}`);
    });
  }
  
  // Check heading hierarchy
  const allHeadings = [
    ...parsed.headings.h1.map(h => ({...h, level: 1})),
    ...parsed.headings.h2.map(h => ({...h, level: 2})),
    ...parsed.headings.h3.map(h => ({...h, level: 3})),
    ...parsed.headings.h4.map(h => ({...h, level: 4})),
    ...parsed.headings.h5.map(h => ({...h, level: 5})),
    ...parsed.headings.h6.map(h => ({...h, level: 6}))
  ].sort((a, b) => a.position - b.position);
  
  let previousLevel = 0;
  let hierarchyViolations = [];
  
  allHeadings.forEach((heading, index) => {
    if (heading.level - previousLevel > 1) {
      hierarchyViolations.push(`H${heading.level} at ${heading.path} skips hierarchy levels`);
    }
    previousLevel = heading.level;
  });
  
  if (hierarchyViolations.length > 0) {
    headingScore -= Math.min(20, hierarchyViolations.length * 5);
    headingAnalysis.issues.push(`${hierarchyViolations.length} heading hierarchy violations`);
    headingAnalysis.details.push(...hierarchyViolations);
  }
  
  headingAnalysis.score = Math.max(0, headingScore);
  results.push(headingAnalysis);
  
  // Image Optimization Analysis
  const imageAnalysis = {
    label: 'Image Optimization',
    description: 'Proper image optimization improves accessibility, SEO, and page loading performance.',
    current: `${parsed.images.length} images found`,
    path: '',
    score: 0,
    issues: [],
    recommendations: [],
    practicalExample: '',
    details: []
  };
  
  if (parsed.images.length === 0) {
    imageAnalysis.score = 100; // No penalty for no images
    imageAnalysis.current = 'No images found';
  } else {
    let imageScore = 100;
    const missingAlt = parsed.images.filter(img => !img.hasAlt);
    const missingTitle = parsed.images.filter(img => !img.hasTitle);
    const missingDimensions = parsed.images.filter(img => !img.hasWidth || !img.hasHeight);
    
    if (missingAlt.length > 0) {
      imageScore -= Math.min(30, (missingAlt.length / parsed.images.length) * 50);
      imageAnalysis.issues.push(`${missingAlt.length} images missing alt attributes`);
      imageAnalysis.recommendations.push('Add descriptive alt text to all images for accessibility and SEO');
      imageAnalysis.practicalExample = '<img src="product.jpg" alt="Blue wireless headphones with noise cancellation" width="300" height="200">';
      
      // Show paths of images missing alt text
      missingAlt.forEach((img, index) => {
        const src = img.attributes.src || 'unknown source';
        imageAnalysis.details.push(`Image #${img.index} missing alt text: ${src} at ${img.path}`);
      });
    }
    
    if (missingDimensions.length > 0) {
      imageScore -= 10;
      imageAnalysis.issues.push(`${missingDimensions.length} images missing width/height attributes`);
      imageAnalysis.recommendations.push('Add width and height attributes to prevent layout shifts');
    }
    
    imageAnalysis.current = `${parsed.images.length} total images, ${missingAlt.length} missing alt text, ${missingDimensions.length} missing dimensions`;
    imageAnalysis.score = Math.max(0, imageScore);
  }
  
  results.push(imageAnalysis);
  
  // Link Structure Analysis
  const linkAnalysis = {
    label: 'Link Structure',
    description: 'Internal and external links distribute authority and provide navigation paths for users and search engines.',
    current: `${parsed.links.length} total links found`,
    path: '',
    score: 0,
    issues: [],
    recommendations: [],
    practicalExample: '',
    details: []
  };
  
  const internalLinks = parsed.links.filter(link => link.isInternal);
  const externalLinks = parsed.links.filter(link => link.isExternal);
  const emptyLinks = parsed.links.filter(link => !link.text.trim());
  
  let linkScore = 100;
  
  if (internalLinks.length === 0) {
    linkScore -= 15;
    linkAnalysis.issues.push('No internal links found');
    linkAnalysis.recommendations.push('Add 2-5 contextual internal links to related pages');
    linkAnalysis.practicalExample = '<a href="/related-page" title="Learn more about our services">Our comprehensive services</a>';
  }
  
  if (emptyLinks.length > 0) {
    linkScore -= 10;
    linkAnalysis.issues.push(`${emptyLinks.length} links with empty anchor text`);
    linkAnalysis.recommendations.push('Provide descriptive anchor text for all links');
    
    emptyLinks.forEach((link, index) => {
      linkAnalysis.details.push(`Empty link #${link.index}: ${link.href} at ${link.path}`);
    });
  }
  
  const externalLinksWithoutRel = externalLinks.filter(link => !link.hasRel);
  if (externalLinksWithoutRel.length > 0) {
    linkScore -= 5;
    linkAnalysis.issues.push(`${externalLinksWithoutRel.length} external links missing rel attributes`);
    linkAnalysis.recommendations.push('Add rel="noopener" or rel="nofollow" to external links as appropriate');
  }
  
  linkAnalysis.current = `${internalLinks.length} internal, ${externalLinks.length} external, ${emptyLinks.length} with empty text`;
  linkAnalysis.score = Math.max(0, linkScore);
  results.push(linkAnalysis);
  
  // Calculate category score
  const categoryScore = Math.round(results.reduce((sum, item) => sum + item.score, 0) / results.length);
  
  return {
    score: categoryScore,
    results
  };
}

// Comprehensive Technical Performance Analysis
function analyzeTechnicalPerformance(parsed, fetchResult, responseTime) {
  const results = [];
  
  // Response Time Analysis
  const responseTimeAnalysis = {
    label: 'Server Response Time',
    description: 'Fast server response times are crucial for user experience and search engine crawling efficiency.',
    current: `${responseTime}ms`,
    path: 'Server-level metric',
    score: 0,
    issues: [],
    recommendations: [],
    practicalExample: ''
  };
  
  let responseScore = 100;
  if (responseTime > 3000) {
    responseScore = 40;
    responseTimeAnalysis.issues.push('Very slow response time (>3 seconds)');
    responseTimeAnalysis.recommendations.push('Optimize server performance, implement caching, use a CDN');
    responseTimeAnalysis.practicalExample = 'Target: <1000ms response time. Use server-side caching, optimize database queries, implement Redis/Memcached.';
  } else if (responseTime > 1000) {
    responseScore = 70;
    responseTimeAnalysis.issues.push('Slow response time (>1 second)');
    responseTimeAnalysis.recommendations.push('Implement caching strategies and server optimization');
    responseTimeAnalysis.practicalExample = 'Add cache headers: Cache-Control: public, max-age=31536000';
  } else {
    responseTimeAnalysis.recommendations.push('Response time is excellent');
    responseTimeAnalysis.practicalExample = 'Current response time is optimal for user experience';
  }
  
  responseTimeAnalysis.score = responseScore;
  results.push(responseTimeAnalysis);
  
  // HTTPS Analysis
  const httpsAnalysis = {
    label: 'HTTPS Security',
    description: 'HTTPS encryption protects user data and is a confirmed Google ranking factor.',
    current: fetchResult.url.startsWith('https://') ? 'Secure HTTPS connection' : 'Insecure HTTP connection',
    path: 'URL protocol',
    score: fetchResult.url.startsWith('https://') ? 100 : 0,
    issues: [],
    recommendations: [],
    practicalExample: ''
  };
  
  if (!fetchResult.url.startsWith('https://')) {
    httpsAnalysis.issues.push('Site not using HTTPS encryption');
    httpsAnalysis.recommendations.push('Install SSL certificate and redirect all HTTP traffic to HTTPS');
    httpsAnalysis.practicalExample = 'Redirect rule: RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]';
  } else {
    // Check for mixed content
    const httpResources = parsed.images.filter(img => 
      img.attributes.src && img.attributes.src.startsWith('http://')
    );
    
    if (httpResources.length > 0) {
      httpsAnalysis.score = 70;
      httpsAnalysis.issues.push(`${httpResources.length} HTTP resources on HTTPS page (mixed content)`);
      httpsAnalysis.recommendations.push('Update all resources to use HTTPS URLs');
      httpsAnalysis.practicalExample = 'Change: src="http://example.com/image.jpg" to src="https://example.com/image.jpg"';
    }
  }
  
  results.push(httpsAnalysis);
  
  // Mobile Viewport Analysis
  const viewportAnalysis = {
    label: 'Mobile Viewport',
    description: 'Proper viewport configuration is essential for mobile-first indexing and responsive design.',
    current: parsed.technicalElements.viewport ? 'Viewport meta tag found' : 'No viewport meta tag',
    path: parsed.technicalElements.viewport ? 'HTML head section' : 'Not found',
    score: parsed.technicalElements.viewport ? 100 : 60,
    issues: [],
    recommendations: [],
    practicalExample: ''
  };
  
  if (!parsed.technicalElements.viewport) {
    viewportAnalysis.issues.push('Missing viewport meta tag');
    viewportAnalysis.recommendations.push('Add viewport meta tag for mobile optimization');
    viewportAnalysis.practicalExample = '<meta name="viewport" content="width=device-width, initial-scale=1.0">';
  } else {
    viewportAnalysis.recommendations.push('Viewport is properly configured');
    viewportAnalysis.practicalExample = 'Current viewport configuration is correct for mobile devices';
  }
  
  results.push(viewportAnalysis);
  
  // Canonical URL Analysis
  const canonicalAnalysis = {
    label: 'Canonical URL',
    description: 'Canonical URLs prevent duplicate content issues and consolidate page authority.',
    current: parsed.technicalElements.canonical ? 'Canonical URL found' : 'No canonical URL',
    path: parsed.technicalElements.canonical ? 'HTML head section' : 'Not found',
    score: parsed.technicalElements.canonical ? 100 : 75,
    issues: [],
    recommendations: [],
    practicalExample: ''
  };
  
  if (!parsed.technicalElements.canonical) {
    canonicalAnalysis.issues.push('Missing canonical URL');
    canonicalAnalysis.recommendations.push('Add canonical URL to prevent duplicate content issues');
    canonicalAnalysis.practicalExample = `<link rel="canonical" href="${fetchResult.url}">`;
  }
  
  results.push(canonicalAnalysis);
  
  // Robots Meta Analysis
  const robotsAnalysis = {
    label: 'Robots Meta Tag',
    description: 'Robots meta tags control how search engines crawl and index your pages.',
    current: parsed.technicalElements.robots ? 'Robots meta tag found' : 'No robots meta tag (default: index, follow)',
    path: parsed.technicalElements.robots ? 'HTML head section' : 'Default behavior',
    score: 100, // No penalty for missing robots tag (default is fine)
    issues: [],
    recommendations: [],
    practicalExample: ''
  };
  
  if (!parsed.technicalElements.robots) {
    robotsAnalysis.recommendations.push('Consider adding robots meta tag for explicit control');
    robotsAnalysis.practicalExample = '<meta name="robots" content="index, follow">';
  }
  
  results.push(robotsAnalysis);
  
  // Structured Data Analysis
  const structuredDataAnalysis = {
    label: 'Structured Data',
    description: 'Structured data helps search engines understand your content and can enable rich snippets.',
    current: `JSON-LD: ${parsed.jsonLdScripts.length}, Microdata: ${parsed.microdataElements.length}`,
    path: parsed.jsonLdScripts.length > 0 ? 'JSON-LD scripts found' : 'No structured data found',
    score: 0,
    issues: [],
    recommendations: [],
    practicalExample: ''
  };
  
  let structuredScore = 100;
  
  if (parsed.jsonLdScripts.length === 0 && parsed.microdataElements.length === 0) {
    structuredScore = 80;
    structuredDataAnalysis.issues.push('No structured data found');
    structuredDataAnalysis.recommendations.push('Add JSON-LD structured data for better search engine understanding');
    structuredDataAnalysis.practicalExample = `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Your Company",
  "url": "${fetchResult.url}"
}
</script>`;
  } else {
    structuredDataAnalysis.recommendations.push('Structured data implementation detected');
    structuredDataAnalysis.practicalExample = 'Continue expanding structured data for additional content types';
  }
  
  structuredDataAnalysis.score = structuredScore;
  results.push(structuredDataAnalysis);
  
  // Calculate category score
  const categoryScore = Math.round(results.reduce((sum, item) => sum + item.score, 0) / results.length);
  
  return {
    score: categoryScore,
    results
  };
}

// Comprehensive Content Analysis
function analyzeContentStructure(parsed, url) {
  const results = [];
  
  // Content Length Analysis
  const contentAnalysis = {
    label: 'Content Length & Quality',
    description: 'Sufficient, high-quality content helps search engines understand your page topic and provides user value.',
    current: `${parsed.wordCount} words`,
    path: 'Page body content',
    score: 0,
    issues: [],
    recommendations: [],
    practicalExample: ''
  };
  
  let contentScore = 100;
  
  if (parsed.wordCount < 150) {
    contentScore = 40;
    contentAnalysis.issues.push('Very low content word count');
    contentAnalysis.recommendations.push('Add substantial, relevant content (aim for 300+ words minimum)');
    contentAnalysis.practicalExample = 'Create comprehensive content covering: problem definition, solution explanation, benefits, examples, and call-to-action.';
  } else if (parsed.wordCount < 300) {
    contentScore = 60;
    contentAnalysis.issues.push('Low content word count');
    contentAnalysis.recommendations.push('Expand content to provide more value to users');
    contentAnalysis.practicalExample = 'Add detailed explanations, examples, FAQs, or related information to reach 300+ words.';
  } else {
    contentAnalysis.recommendations.push('Content length is sufficient for SEO');
    contentAnalysis.practicalExample = 'Current content length supports good search engine understanding';
  }
  
  contentAnalysis.score = contentScore;
  results.push(contentAnalysis);
  
  // Internal Link Distribution
  const internalLinkAnalysis = {
    label: 'Internal Link Structure',
    description: 'Internal links distribute page authority and help users navigate to related content.',
    current: `${parsed.links.filter(l => l.isInternal).length} internal links`,
    path: 'Throughout page content',
    score: 0,
    issues: [],
    recommendations: [],
    practicalExample: '',
    details: []
  };
  
  const internalLinks = parsed.links.filter(l => l.isInternal);
  let internalScore = 100;
  
  if (internalLinks.length === 0) {
    internalScore = 70;
    internalLinkAnalysis.issues.push('No internal links found');
    internalLinkAnalysis.recommendations.push('Add 2-5 contextual internal links to related pages');
    internalLinkAnalysis.practicalExample = '<a href="/related-service" title="Learn about our related services">Explore our comprehensive services</a>';
  } else if (internalLinks.length < 2) {
    internalScore = 85;
    internalLinkAnalysis.issues.push('Very few internal links');
    internalLinkAnalysis.recommendations.push('Add more internal links to improve site navigation');
  } else {
    internalLinkAnalysis.recommendations.push('Good internal linking structure');
    
    // Show internal link details
    internalLinks.slice(0, 5).forEach((link, index) => {
      internalLinkAnalysis.details.push(`Internal link #${index + 1}: "${link.text}" → ${link.href} at ${link.path}`);
    });
    
    if (internalLinks.length > 5) {
      internalLinkAnalysis.details.push(`... and ${internalLinks.length - 5} more internal links`);
    }
  }
  
  internalLinkAnalysis.score = internalScore;
  results.push(internalLinkAnalysis);
  
  // External Link Authority
  const externalLinkAnalysis = {
    label: 'External Link Strategy',
    description: 'Quality external links to authoritative sources enhance content credibility and user experience.',
    current: `${parsed.links.filter(l => l.isExternal).length} external links`,
    path: 'Throughout page content',
    score: 0,
    issues: [],
    recommendations: [],
    practicalExample: '',
    details: []
  };
  
  const externalLinks = parsed.links.filter(l => l.isExternal);
  let externalScore = 100;
  
  if (externalLinks.length === 0) {
    externalScore = 90; // Minor penalty
    externalLinkAnalysis.issues.push('No external links found');
    externalLinkAnalysis.recommendations.push('Consider adding 1-2 links to authoritative sources');
    externalLinkAnalysis.practicalExample = '<a href="https://authoritative-source.com" rel="noopener" target="_blank">Industry research data</a>';
  } else {
    // Check for proper rel attributes
    const linksWithoutRel = externalLinks.filter(link => !link.hasRel);
    if (linksWithoutRel.length > 0) {
      externalScore -= 10;
      externalLinkAnalysis.issues.push(`${linksWithoutRel.length} external links missing rel attributes`);
      externalLinkAnalysis.recommendations.push('Add rel="noopener" or rel="nofollow" to external links');
    }
    
    // Show external link details
    externalLinks.slice(0, 3).forEach((link, index) => {
      externalLinkAnalysis.details.push(`External link #${index + 1}: "${link.text}" → ${link.href} at ${link.path}`);
    });
  }
  
  externalLinkAnalysis.score = Math.max(0, externalScore);
  results.push(externalLinkAnalysis);
  
  // Form Accessibility Analysis
  const formAnalysis = {
    label: 'Form Accessibility',
    description: 'Proper form labeling improves accessibility and user experience.',
    current: `${parsed.forms.length} forms, ${parsed.inputs.length} inputs, ${parsed.labels.length} labels`,
    path: parsed.forms.length > 0 ? 'Forms found throughout page' : 'No forms found',
    score: 100,
    issues: [],
    recommendations: [],
    practicalExample: '',
    details: []
  };
  
  if (parsed.inputs.length > 0) {
    const inputsWithoutLabels = parsed.inputs.filter(input => {
      const id = input.attributes.id;
      const hasAriaLabel = input.attributes['aria-label'];
      const hasLabel = id && parsed.labels.some(label => label.attributes.for === id);
      
      return !hasLabel && !hasAriaLabel;
    });
    
    if (inputsWithoutLabels.length > 0) {
      formAnalysis.score = 70;
      formAnalysis.issues.push(`${inputsWithoutLabels.length} form inputs without proper labels`);
      formAnalysis.recommendations.push('Add labels or aria-label attributes to all form inputs');
      formAnalysis.practicalExample = '<label for="email">Email Address:</label>\n<input type="email" id="email" name="email" required>';
      
      inputsWithoutLabels.slice(0, 3).forEach((input, index) => {
        const type = input.attributes.type || 'text';
        formAnalysis.details.push(`Unlabeled ${type} input at ${input.path}`);
      });
    }
  }
  
  results.push(formAnalysis);
  
  // Calculate category score
  const categoryScore = Math.round(results.reduce((sum, item) => sum + item.score, 0) / results.length);
  
  return {
    score: categoryScore,
    results
  };
}

// Main comprehensive analysis function
function performComprehensiveAnalysis(parsed, fetchResult, responseTime) {
  const onPageAnalysis = analyzeOnPageSEO(parsed, fetchResult.url);
  const technicalAnalysis = analyzeTechnicalPerformance(parsed, fetchResult, responseTime);
  const contentAnalysis = analyzeContentStructure(parsed, fetchResult.url);
  
  // Calculate overall score as average of all category scores
  const overallScore = Math.round((
    onPageAnalysis.score + 
    technicalAnalysis.score + 
    contentAnalysis.score
  ) / 3);
  
  return {
    url: fetchResult.url,
    original_url: fetchResult.url,
    timestamp: new Date().toISOString(),
    response_time: responseTime,
    overall_score: overallScore,
    
    // Legacy compatibility
    title_tag: {
      value: parsed.title.value,
      score: onPageAnalysis.results.find(r => r.label === 'Title Tag')?.score || 0
    },
    meta_description: {
      value: parsed.metaDescription.value,
      score: onPageAnalysis.results.find(r => r.label === 'Meta Description')?.score || 0
    },
    headings: {
      h1_count: parsed.headings.h1.length,
      score: onPageAnalysis.results.find(r => r.label.includes('Heading'))?.score || 0
    },
    images: {
      total_images: parsed.images.length,
      missing_alt: parsed.images.filter(img => !img.hasAlt).length,
      score: onPageAnalysis.results.find(r => r.label === 'Image Optimization')?.score || 0
    },
    page_speed: {
      load_time: responseTime / 1000,
      score: technicalAnalysis.results.find(r => r.label === 'Server Response Time')?.score || 0
    },
    mobile_friendly: {
      is_mobile_friendly: parsed.technicalElements.viewport,
      score: technicalAnalysis.results.find(r => r.label === 'Mobile Viewport')?.score || 0
    },
    https: {
      is_https: fetchResult.url.startsWith('https://'),
      score: technicalAnalysis.results.find(r => r.label === 'HTTPS Security')?.score || 0
    },
    content: {
      word_count: parsed.wordCount,
      score: contentAnalysis.results.find(r => r.label.includes('Content Length'))?.score || 0
    },
    links: {
      internal_count: parsed.links.filter(l => l.isInternal).length,
      external_count: parsed.links.filter(l => l.isExternal).length,
      internal_score: contentAnalysis.results.find(r => r.label === 'Internal Link Structure')?.score || 0,
      external_score: contentAnalysis.results.find(r => r.label === 'External Link Strategy')?.score || 0
    },
    
    // Enhanced analysis results
    onpage_score: onPageAnalysis.score,
    technical_score: technicalAnalysis.score,
    content_score: contentAnalysis.score,
    
    // Detailed analysis breakdown
    analysis: {
      on_page: onPageAnalysis,
      technical: technicalAnalysis,
      content: contentAnalysis
    },
    
    metadata: {
      title: parsed.title.value,
      description: parsed.metaDescription.value,
      h1Count: parsed.headings.h1.length,
      imageCount: parsed.images.length,
      linkCount: parsed.links.length,
      wordCount: parsed.wordCount
    }
  };
}

// Main handler
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
    
    // Rate limiting
    const clientIP = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown';
    
    if (!checkRateLimit(clientIP)) {
      return res.status(429).json({ 
        error: 'Rate limit exceeded. Please wait before making another request.' 
      });
    }
    
    // Normalize URL
    let normalizedUrl = url.trim();
    if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
      normalizedUrl = 'https://' + normalizedUrl;
    }
    
    // Check cache
    const cachedResult = getCachedResult(normalizedUrl);
    if (cachedResult) {
      return res.status(200).json(cachedResult);
    }
    
    // Fetch and analyze
    const startTime = Date.now();
    const fetchResult = await fetchWebsite(normalizedUrl);
    const responseTime = Date.now() - startTime;
    
    const parsed = parseHTMLComprehensive(fetchResult.html);
    const analysis = performComprehensiveAnalysis(parsed, fetchResult, responseTime);
    
    // Cache result
    cacheResult(normalizedUrl, analysis);
    
    return res.status(200).json(analysis);
    
  } catch (error) {
    console.error('Analysis error:', error.message);
    return res.status(500).json({ 
      error: 'Analysis failed', 
      message: error.message 
    });
  }
}
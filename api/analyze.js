/**
 * Real Server-side SEO Analysis API
 * Fetches and analyzes actual websites
 */

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
      const response = await fetch(normalizedUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'LinkRank.ai SEO Bot/2.0 (+https://linkrank.ai)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate',
          'Connection': 'keep-alive'
        },
        signal: AbortSignal.timeout(15000) // 15 second timeout
      });
      
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
  const h4Matches = [...html.matchAll(/<h4[^>]*>([^<]*)<\/h4>/gi)];
  const h5Matches = [...html.matchAll(/<h5[^>]*>([^<]*)<\/h5>/gi)];
  const h6Matches = [...html.matchAll(/<h6[^>]*>([^<]*)<\/h6>/gi)];
  
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
  
  // Check technical elements
  const hasViewport = html.includes('name="viewport"');
  const hasCanonical = html.includes('rel="canonical"');
  const hasRobots = html.includes('name="robots"');
  const hasHttps = finalUrl.startsWith('https://');
  
  // Extract content for word count and keyword analysis
  const textContent = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  const wordCount = textContent.split(/\s+/).filter(word => word.length > 0).length;
  
  // Extract keywords and website context
  const websiteContext = extractWebsiteContext(html, title, metaDescription, textContent, finalUrl);
  
  // Analyze and score each element with website context
  const titleAnalysis = analyzeTitleTag(title, titleLine, websiteContext);
  const metaAnalysis = analyzeMetaDescription(metaDescription, metaDescLine, websiteContext);
  const headingAnalysis = analyzeHeadings(h1Matches, h2Matches, h3Matches, h4Matches, h5Matches, h6Matches, html, websiteContext);
  const imageAnalysis = analyzeImages(images, websiteContext);
  const linkAnalysis = analyzeLinks(links, websiteContext);
  const technicalAnalysis = analyzeTechnical(hasHttps, hasViewport, hasCanonical, hasRobots, responseTime, websiteContext);
  const contentAnalysis = analyzeContent(wordCount, links, websiteContext);
  
  // Calculate scores
  const onPageScore = Math.round((titleAnalysis.score + metaAnalysis.score + headingAnalysis.score + imageAnalysis.score + linkAnalysis.score) / 5);
  const technicalScore = Math.round(technicalAnalysis.reduce((sum, item) => sum + item.score, 0) / technicalAnalysis.length);
  const contentScore = Math.round(contentAnalysis.reduce((sum, item) => sum + item.score, 0) / contentAnalysis.length);
  const overallScore = Math.round((onPageScore + technicalScore + contentScore) / 3);
  
  return {
    url: finalUrl,
    original_url: originalUrl,
    timestamp: new Date().toISOString(),
    response_time: responseTime,
    overall_score: overallScore,
    
    // Legacy compatibility
    title_tag: {
      value: title,
      score: titleAnalysis.score
    },
    meta_description: {
      value: metaDescription,
      score: metaAnalysis.score
    },
    headings: {
      h1_count: h1Matches.length,
      score: headingAnalysis.score
    },
    images: {
      total_images: images.length,
      missing_alt: images.filter(img => !img.hasAlt).length,
      score: imageAnalysis.score
    },
    page_speed: {
      load_time: responseTime / 1000,
      score: technicalAnalysis.find(t => t.label === 'Server Response Time')?.score || 0
    },
    mobile_friendly: {
      is_mobile_friendly: hasViewport,
      score: technicalAnalysis.find(t => t.label === 'Mobile Viewport')?.score || 0
    },
    https: {
      is_https: hasHttps,
      score: technicalAnalysis.find(t => t.label === 'HTTPS Security')?.score || 0
    },
    content: {
      word_count: wordCount,
      score: contentAnalysis.find(c => c.label === 'Content Length & Quality')?.score || 0
    },
    links: {
      internal_count: links.filter(l => l.isInternal).length,
      external_count: links.filter(l => l.isExternal).length,
      internal_score: contentAnalysis.find(c => c.label === 'Internal Link Structure')?.score || 0,
      external_score: contentAnalysis.find(c => c.label === 'External Link Strategy')?.score || 0
    },
    
    // Enhanced analysis results
    onpage_score: onPageScore,
    technical_score: technicalScore,
    content_score: contentScore,
    
    // Detailed analysis breakdown
    analysis: {
      on_page: {
        score: onPageScore,
        results: [titleAnalysis, metaAnalysis, headingAnalysis, imageAnalysis, linkAnalysis]
      },
      technical: {
        score: technicalScore,
        results: technicalAnalysis
      },
      content: {
        score: contentScore,
        results: contentAnalysis
      }
    },
    
    metadata: {
      title: title,
      description: metaDescription,
      h1Count: h1Matches.length,
      imageCount: images.length,
      linkCount: links.length,
      wordCount: wordCount
    }
  };
}

function getLineNumber(html, index) {
  return html.substring(0, index).split('\n').length;
}

function extractWebsiteContext(html, title, metaDescription, textContent, url) {
  // Extract domain and brand name
  const domain = url.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
  const brandName = domain.split('.')[0];
  
  // Extract keywords from title and meta description
  const titleWords = title.toLowerCase().split(/\s+/).filter(word => word.length > 2 && !isStopWord(word));
  const metaWords = metaDescription.toLowerCase().split(/\s+/).filter(word => word.length > 2 && !isStopWord(word));
  
  // Extract H1 content for primary keywords
  const h1Match = html.match(/<h1[^>]*>([^<]*)<\/h1>/i);
  const h1Content = h1Match ? h1Match[1].toLowerCase() : '';
  const h1Words = h1Content.split(/\s+/).filter(word => word.length > 2 && !isStopWord(word));
  
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
  const industry = detectIndustry(textContent, title, h1Content);
  
  // Extract location keywords
  const locationKeywords = extractLocationKeywords(textContent, title, metaDescription);
  
  return {
    domain,
    brandName: capitalizeFirst(brandName),
    keywords,
    primaryKeyword: keywords[0] || brandName,
    industry,
    locationKeywords,
    hasLocation: locationKeywords.length > 0
  };
}

function isStopWord(word) {
  const stopWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 
                   'from', 'up', 'about', 'into', 'through', 'during', 'before', 'after', 'above', 
                   'below', 'between', 'among', 'this', 'that', 'these', 'those', 'is', 'are', 'was', 
                   'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 
                   'would', 'should', 'could', 'can', 'may', 'might', 'must', 'shall', 'your', 'our', 
                   'we', 'you', 'they', 'them', 'their', 'its', 'his', 'her', 'my', 'me', 'us', 'him'];
  return stopWords.includes(word.toLowerCase());
}

function detectIndustry(textContent, title, h1Content) {
  const combined = (textContent + ' ' + title + ' ' + h1Content).toLowerCase();
  
  const industries = {
    'healthcare': ['health', 'medical', 'doctor', 'clinic', 'hospital', 'treatment', 'therapy', 'wellness'],
    'legal': ['law', 'legal', 'attorney', 'lawyer', 'court', 'justice', 'litigation', 'counsel'],
    'restaurant': ['restaurant', 'food', 'dining', 'cuisine', 'menu', 'chef', 'culinary', 'catering'],
    'real estate': ['real estate', 'property', 'homes', 'houses', 'buying', 'selling', 'realtor', 'agent'],
    'technology': ['technology', 'software', 'development', 'digital', 'tech', 'solutions', 'innovation'],
    'finance': ['finance', 'financial', 'investment', 'banking', 'money', 'wealth', 'insurance'],
    'education': ['education', 'school', 'learning', 'training', 'course', 'university', 'academy'],
    'retail': ['shop', 'store', 'retail', 'products', 'merchandise', 'shopping', 'buy', 'sell'],
    'automotive': ['car', 'auto', 'vehicle', 'automotive', 'repair', 'dealer', 'mechanic'],
    'fitness': ['fitness', 'gym', 'workout', 'exercise', 'training', 'health', 'sport']
  };
  
  for (const [industry, keywords] of Object.entries(industries)) {
    if (keywords.some(keyword => combined.includes(keyword))) {
      return industry;
    }
  }
  
  return 'business';
}

function extractLocationKeywords(textContent, title, metaDescription) {
  const combined = (textContent + ' ' + title + ' ' + metaDescription).toLowerCase();
  const locationPattern = /\b(in|near|around|serving|located|based|area|city|county|state|california|texas|florida|new york|los angeles|chicago|houston|phoenix|philadelphia|san antonio|san diego|dallas|san jose|austin|jacksonville|fort worth|columbus|charlotte|san francisco|indianapolis|seattle|denver|washington|boston|el paso|detroit|nashville|portland|oklahoma|las vegas|baltimore|louisville|milwaukee|albuquerque|tucson|fresno|sacramento|mesa|kansas city|atlanta|colorado springs|raleigh|omaha|miami|oakland|tulsa|minneapolis|cleveland|wichita|arlington|new orleans|bakersfield|tampa|honolulu|anaheim|aurora|santa ana|st louis|riverside|corpus christi|lexington|pittsburgh|anchorage|stockton|cincinnati|st paul|toledo|newark|greensboro|plano|henderson|lincoln|buffalo|jersey city|chula vista|fort wayne|orlando|st petersburg|chandler|laredo|norfolk|durham|madison|lubbock|irvine|winston salem|glendale|garland|hialeah|reno|chesapeake|gilbert|baton rouge|irving|scottsdale|north las vegas|fremont|boise|richmond|san bernardino|birmingham|spokane|rochester|des moines|modesto|fayetteville|tacoma|oxnard|fontana|columbus|montgomery|moreno valley|shreveport|aurora|yonkers|akron|huntington beach|little rock|augusta|amarillo|glendale|mobile|grand rapids|salt lake city|tallahassee|huntsville|grand prairie|knoxville|worcester|newport news|brownsville|overland park|santa clarita|providence|garden grove|chattanooga|oceanside|jackson|fort lauderdale|santa rosa|rancho cucamonga|port st lucie|tempe|ontario|vancouver|cape coral|sioux falls|springfield|peoria|pembroke pines|elk grove|salem|lancaster|corona|eugene|palmdale|salinas|springfield|pasadena|fort collins|hayward|pomona|cary|rockford|alexandria|escondido|mckinney|kansas city|joliet|sunnyvale|torrance|bridgeport|lakewood|hollywood|paterson|naperville|syracuse|mesquite|dayton|savannah|clarksville|orange|pasadena|fullerton|killeen|frisco|hampton|mcallen|warren|bellevue|west valley city|columbia|olathe|sterling heights|new haven|miramar|waco|thousand oaks|cedar rapids|charleston|sioux city|round rock|fargo|carrollton|roseville|concord|thornton|visalia|gainesville|coral springs|stamford|elizabeth|thousand oaks|vallejo|lowell|norwalk|kent|denton|manchester|ventura|inglewood|richmond|westminster|pearland|high point|miami gardens|temecula|murfreesboro|evansville|ann arbor|berkeley|peoria|provo|el monte|columbia|lansing|flint|victorville|pueblo|largo|daly city|topeka|sandy springs|centennial|midland|downey|waterbury|lewisville|livonia|fairfield|billings|west covina|arvada|clearwater|new bedford|richardson|carmel|west palm beach|independence|rochester|yuma)\s+[a-z]+/gi);
  
  const matches = combined.match(locationPattern) || [];
  return [...new Set(matches.map(match => match.trim()))].slice(0, 3);
}

function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function analyzeTitleTag(title, line, websiteContext) {
  const length = title.length;
  let score = 100;
  let issues = [];
  let recommendations = [];
  let practicalExample = '';
  
  if (!title) {
    score = 0;
    issues.push('Missing title tag');
    recommendations.push('Add a unique, descriptive title tag between 50-60 characters');
    const locationPart = websiteContext.hasLocation ? ` ${websiteContext.locationKeywords[0] || ''}` : '';
    practicalExample = `<title>${capitalizeFirst(websiteContext.primaryKeyword)} ${capitalizeFirst(websiteContext.industry)}${locationPart} | ${websiteContext.brandName}</title>`;
  } else if (length < 30) {
    score = 60;
    issues.push(`Title too short (${length} characters)`);
    recommendations.push('Expand title to 30-60 characters for optimal SEO impact');
    const additionalKeywords = websiteContext.keywords.slice(1, 3).join(' ');
    practicalExample = `<title>${title} - ${capitalizeFirst(additionalKeywords)} | ${websiteContext.brandName}</title>`;
  } else if (length > 60) {
    score = 75;
    issues.push(`Title may be truncated (${length} characters)`);
    recommendations.push('Shorten title to under 60 characters to prevent truncation in search results');
    const shortenedTitle = title.includes('|') ? title.split('|')[0].trim() : title.substring(0, 50);
    practicalExample = `<title>${shortenedTitle} | ${websiteContext.brandName}</title>`;
  } else {
    recommendations.push('Title length is optimal');
    practicalExample = `Current title is well-optimized: "${title}"`;
  }
  
  return {
    label: 'Title Tag',
    description: 'The HTML title tag is the most critical on-page SEO element, appearing as the clickable headline in search results.',
    current: title || 'No title tag found',
    path: `Line ${line}`,
    score,
    issues,
    recommendations,
    practicalExample,
    details: [`Title length: ${length} characters`]
  };
}

function analyzeMetaDescription(metaDescription, line, websiteContext) {
  const length = metaDescription.length;
  let score = 100;
  let issues = [];
  let recommendations = [];
  let practicalExample = '';
  
  if (!metaDescription) {
    score = 0;
    issues.push('Missing meta description');
    recommendations.push('Add a compelling meta description between 150-160 characters');
    const locationPart = websiteContext.hasLocation ? ` in ${websiteContext.locationKeywords[0] || ''}` : '';
    const keywords = websiteContext.keywords.slice(0, 2).join(' and ');
    practicalExample = `<meta name="description" content="Professional ${websiteContext.primaryKeyword} ${websiteContext.industry} services${locationPart}. Expert ${keywords} solutions for your needs. Contact ${websiteContext.brandName} today for a free consultation.">`;
  } else if (length < 120) {
    score = 70;
    issues.push(`Meta description too short (${length} characters)`);
    recommendations.push('Expand to 150-160 characters for better search result display');
    const additionalContent = websiteContext.hasLocation ? ` Serving ${websiteContext.locationKeywords[0] || ''} and surrounding areas` : ` with expert ${websiteContext.primaryKeyword} solutions`;
    practicalExample = `<meta name="description" content="${metaDescription}${additionalContent}. Contact us today for more information.">`;
  } else if (length > 160) {
    score = 80;
    issues.push(`Meta description may be truncated (${length} characters)`);
    recommendations.push('Shorten to 150-160 characters to prevent truncation');
    practicalExample = `<meta name="description" content="${metaDescription.substring(0, 150)}...">`;
  } else {
    recommendations.push('Meta description length is optimal');
    practicalExample = `Current meta description is well-optimized: "${metaDescription}"`;
  }
  
  return {
    label: 'Meta Description',
    description: 'Meta descriptions provide page summaries in search results and significantly influence click-through rates.',
    current: metaDescription || 'No meta description found',
    path: `Line ${line}`,
    score,
    issues,
    recommendations,
    practicalExample,
    details: [`Length: ${length} characters`]
  };
}

function analyzeHeadings(h1s, h2s, h3s, h4s, h5s, h6s, html, websiteContext) {
  let score = 100;
  let issues = [];
  let recommendations = [];
  let details = [];
  
  let practicalExample = '';
  
  if (h1s.length === 0) {
    score = 40;
    issues.push('Missing H1 tag');
    recommendations.push('Add exactly one H1 tag that describes the main topic');
    const locationPart = websiteContext.hasLocation ? ` in ${websiteContext.locationKeywords[0] || ''}` : '';
    practicalExample = `<h1>${capitalizeFirst(websiteContext.primaryKeyword)} ${capitalizeFirst(websiteContext.industry)}${locationPart} - ${websiteContext.brandName}</h1>`;
  } else if (h1s.length > 1) {
    score = 70;
    issues.push(`Multiple H1 tags found (${h1s.length})`);
    recommendations.push('Use only one H1 tag per page; convert others to H2-H6');
    h1s.forEach((h1, index) => {
      details.push(`H1 #${index + 1}: "${h1[1]}" at Line ${getLineNumber(html, h1.index)}`);
    });
    practicalExample = `<h1>${h1s[0][1]}</h1>\n<h2>${h1s[1][1]}</h2>\n<h3>Supporting ${websiteContext.primaryKeyword} Information</h3>`;
  } else {
    details.push(`H1: "${h1s[0][1]}" at Line ${getLineNumber(html, h1s[0].index)}`);
    practicalExample = `<h1>${h1s[0][1]}</h1>\n<h2>Our ${capitalizeFirst(websiteContext.primaryKeyword)} Services</h2>\n<h3>Why Choose ${websiteContext.brandName}</h3>`;
  }
  
  return {
    label: 'Heading Structure (H1-H6)',
    description: 'Proper heading hierarchy helps search engines understand content structure and improves accessibility.',
    current: `H1: ${h1s.length}, H2: ${h2s.length}, H3: ${h3s.length}, H4: ${h4s.length}, H5: ${h5s.length}, H6: ${h6s.length}`,
    path: 'Throughout page content',
    score,
    issues,
    recommendations,
    practicalExample,
    details
  };
}

function analyzeImages(images, websiteContext) {
  let score = 100;
  let issues = [];
  let recommendations = [];
  let details = [];
  
  if (images.length === 0) {
    return {
      label: 'Image Optimization',
      description: 'Proper image optimization improves accessibility, SEO, and page loading performance.',
      current: 'No images found',
      path: 'No images found',
      score: 100,
      issues: [],
      recommendations: ['No images to optimize'],
      practicalExample: 'Add images with proper alt text when adding visual content',
      details: []
    };
  }
  
  const missingAlt = images.filter(img => !img.hasAlt);
  
  if (missingAlt.length > 0) {
    score -= Math.min(30, (missingAlt.length / images.length) * 50);
    issues.push(`${missingAlt.length} images missing alt attributes`);
    recommendations.push('Add descriptive alt text to all images for accessibility and SEO');
    
    missingAlt.slice(0, 3).forEach((img, index) => {
      details.push(`Image missing alt text: ${img.src || 'unknown source'} at Line ${img.line}`);
    });
  } else {
    recommendations.push('All images have alt text - excellent for accessibility');
  }
  
  return {
    label: 'Image Optimization',
    description: 'Proper image optimization improves accessibility, SEO, and page loading performance.',
    current: `${images.length} total images, ${missingAlt.length} missing alt text`,
    path: 'Throughout page content',
    score: Math.max(0, score),
    issues,
    recommendations,
    practicalExample: `<img src="${websiteContext.primaryKeyword}-${websiteContext.industry}.jpg" alt="${capitalizeFirst(websiteContext.primaryKeyword)} ${websiteContext.industry} services by ${websiteContext.brandName}" width="400" height="300">`,
    details
  };
}

function analyzeLinks(links, websiteContext) {
  let score = 100;
  let issues = [];
  let recommendations = [];
  let details = [];
  
  const internalLinks = links.filter(link => link.isInternal);
  const externalLinks = links.filter(link => link.isExternal);
  const emptyLinks = links.filter(link => !link.text.trim());
  
  if (internalLinks.length === 0) {
    score -= 15;
    issues.push('No internal links found');
    recommendations.push('Add 2-5 contextual internal links to related pages');
  } else {
    details.push(`${internalLinks.length} internal links found`);
  }
  
  if (emptyLinks.length > 0) {
    score -= 10;
    issues.push(`${emptyLinks.length} links with empty anchor text`);
    recommendations.push('Provide descriptive anchor text for all links');
  }
  
  return {
    label: 'Link Structure',
    description: 'Internal and external links distribute authority and provide navigation paths for users and search engines.',
    current: `${internalLinks.length} internal, ${externalLinks.length} external, ${emptyLinks.length} with empty text`,
    path: 'Throughout page content',
    score: Math.max(0, score),
    issues,
    recommendations,
    practicalExample: `<a href="/${websiteContext.primaryKeyword}-services" title="Learn about our ${websiteContext.primaryKeyword} ${websiteContext.industry} services">Our ${capitalizeFirst(websiteContext.primaryKeyword)} Services</a>`,
    details
  };
}

function analyzeTechnical(hasHttps, hasViewport, hasCanonical, hasRobots, responseTime, websiteContext) {
  const results = [];
  
  // HTTPS Analysis
  results.push({
    label: 'HTTPS Security',
    description: 'HTTPS encryption protects user data and is a confirmed Google ranking factor.',
    current: hasHttps ? 'Secure HTTPS connection' : 'Insecure HTTP connection',
    path: 'URL protocol',
    score: hasHttps ? 100 : 0,
    issues: hasHttps ? [] : ['Site not using HTTPS encryption'],
    recommendations: hasHttps ? ['HTTPS properly configured'] : ['Install SSL certificate and redirect all HTTP traffic to HTTPS'],
    practicalExample: hasHttps ? 'Current implementation is secure and optimal' : 'Redirect rule: RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]'
  });
  
  // Response Time Analysis
  let responseScore = 100;
  let responseIssues = [];
  let responseRecs = [];
  
  if (responseTime > 3000) {
    responseScore = 40;
    responseIssues.push('Very slow response time (>3 seconds)');
    responseRecs.push('Optimize server performance, implement caching, use a CDN');
  } else if (responseTime > 1000) {
    responseScore = 70;
    responseIssues.push('Slow response time (>1 second)');
    responseRecs.push('Implement caching strategies and server optimization');
  } else {
    responseRecs.push('Response time is excellent');
  }
  
  results.push({
    label: 'Server Response Time',
    description: 'Fast server response times are crucial for user experience and search engine crawling efficiency.',
    current: `${responseTime}ms`,
    path: 'Server-level metric',
    score: responseScore,
    issues: responseIssues,
    recommendations: responseRecs,
    practicalExample: responseTime > 1000 ? 'Add cache headers: Cache-Control: public, max-age=31536000' : 'Current response time is optimal for user experience'
  });
  
  // Viewport Analysis
  results.push({
    label: 'Mobile Viewport',
    description: 'Proper viewport configuration is essential for mobile-first indexing and responsive design.',
    current: hasViewport ? 'Viewport meta tag found' : 'No viewport meta tag',
    path: hasViewport ? 'HTML head section' : 'Not found',
    score: hasViewport ? 100 : 60,
    issues: hasViewport ? [] : ['Missing viewport meta tag'],
    recommendations: hasViewport ? ['Viewport is properly configured'] : ['Add viewport meta tag for mobile optimization'],
    practicalExample: hasViewport ? 'Current viewport configuration is correct for mobile devices' : '<meta name="viewport" content="width=device-width, initial-scale=1.0">'
  });
  
  // Canonical Analysis
  results.push({
    label: 'Canonical URL',
    description: 'Canonical URLs prevent duplicate content issues and consolidate page authority.',
    current: hasCanonical ? 'Canonical URL found' : 'No canonical URL',
    path: hasCanonical ? 'HTML head section' : 'Not found',
    score: hasCanonical ? 100 : 75,
    issues: hasCanonical ? [] : ['Missing canonical URL'],
    recommendations: hasCanonical ? ['Canonical URL properly set'] : ['Add canonical URL to prevent duplicate content issues'],
    practicalExample: hasCanonical ? 'Current canonical URL is properly configured' : `<link rel="canonical" href="${websiteContext.domain}/${websiteContext.primaryKeyword}-${websiteContext.industry}">`
  });
  
  return results;
}

function analyzeContent(wordCount, links, websiteContext) {
  const results = [];
  
  // Content Length Analysis
  let contentScore = 100;
  let contentIssues = [];
  let contentRecs = [];
  
  if (wordCount < 150) {
    contentScore = 40;
    contentIssues.push('Very low content word count');
    contentRecs.push('Add substantial, relevant content (aim for 300+ words minimum)');
  } else if (wordCount < 300) {
    contentScore = 60;
    contentIssues.push('Low content word count');
    contentRecs.push('Expand content to provide more value to users');
  } else {
    contentRecs.push('Content length is sufficient for SEO');
  }
  
  results.push({
    label: 'Content Length & Quality',
    description: 'Sufficient, high-quality content helps search engines understand your page topic and provides user value.',
    current: `${wordCount} words`,
    path: 'Page body content',
    score: contentScore,
    issues: contentIssues,
    recommendations: contentRecs,
    practicalExample: wordCount < 300 ? 'Add detailed explanations, examples, FAQs, or related information to reach 300+ words' : 'Current content length supports good search engine understanding'
  });
  
  // Internal Links Analysis
  const internalLinks = links.filter(l => l.isInternal);
  let internalScore = 100;
  let internalIssues = [];
  let internalRecs = [];
  
  if (internalLinks.length === 0) {
    internalScore = 70;
    internalIssues.push('No internal links found');
    internalRecs.push('Add 2-5 contextual internal links to related pages');
  } else if (internalLinks.length < 2) {
    internalScore = 85;
    internalIssues.push('Very few internal links');
    internalRecs.push('Add more internal links to improve site navigation');
  } else {
    internalRecs.push('Good internal linking structure');
  }
  
  results.push({
    label: 'Internal Link Structure',
    description: 'Internal links distribute page authority and help users navigate to related content.',
    current: `${internalLinks.length} internal links`,
    path: 'Throughout page content',
    score: internalScore,
    issues: internalIssues,
    recommendations: internalRecs,
    practicalExample: `<a href="/${websiteContext.keywords[1] || 'about'}" title="Learn about our ${websiteContext.primaryKeyword} ${websiteContext.industry} services">Explore Our ${capitalizeFirst(websiteContext.primaryKeyword)} Solutions</a>`
  });
  
  // External Links Analysis
  const externalLinks = links.filter(l => l.isExternal);
  let externalScore = 100;
  let externalIssues = [];
  let externalRecs = [];
  
  if (externalLinks.length === 0) {
    externalScore = 90;
    externalIssues.push('No external links found');
    externalRecs.push('Consider adding 1-2 links to authoritative sources');
  } else {
    externalRecs.push('External linking strategy is appropriate');
  }
  
  results.push({
    label: 'External Link Strategy',
    description: 'Quality external links to authoritative sources enhance content credibility and user experience.',
    current: `${externalLinks.length} external links`,
    path: 'Throughout page content',
    score: externalScore,
    issues: externalIssues,
    recommendations: externalRecs,
    practicalExample: '<a href="https://authoritative-source.com" rel="noopener" target="_blank">Industry research data</a>'
  });
  
  return results;
}
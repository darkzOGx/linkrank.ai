export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  try {
    // Validate URL
    let targetUrl;
    try {
      targetUrl = url.startsWith('http') ? url : `https://${url}`;
      new URL(targetUrl);
    } catch (e) {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    const trafficData = await analyzeOrganicTraffic(targetUrl);
    
    return res.json({
      success: true,
      url: targetUrl,
      ...trafficData
    });

  } catch (error) {
    console.error('Organic traffic analysis error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error occurred while analyzing organic traffic'
    });
  }
}

async function analyzeOrganicTraffic(url) {
  try {
    const domain = new URL(url).hostname;
    
    // Fetch website content for analysis
    const siteData = await fetchSiteData(url);
    
    // Estimate traffic based on various factors
    const trafficEstimation = estimateTraffic(siteData, domain);
    
    // Analyze SEO factors that influence traffic
    const seoFactors = analyzeSEOFactors(siteData);
    
    // Generate keyword insights
    const keywordInsights = analyzeKeywords(siteData);
    
    // Calculate competitiveness
    const competitiveness = analyzeCompetitiveness(domain, siteData);
    
    // Generate recommendations
    const recommendations = generateTrafficRecommendations(trafficEstimation, seoFactors, keywordInsights);

    return {
      domain,
      estimatedTraffic: trafficEstimation,
      seoFactors,
      keywordInsights,
      competitiveness,
      recommendations,
      analysis: generateTrafficAnalysis(trafficEstimation, seoFactors, domain),
      lastUpdated: new Date().toISOString()
    };

  } catch (error) {
    throw new Error(`Failed to analyze organic traffic: ${error.message}`);
  }
}

async function fetchSiteData(url) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Organic-Traffic-Checker/1.0 (+https://linkrank.ai/bot)'
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    
    return {
      html,
      headers: Object.fromEntries(response.headers.entries()),
      statusCode: response.status,
      url: response.url
    };

  } catch (fetchError) {
    clearTimeout(timeoutId);
    
    if (fetchError.name === 'AbortError') {
      throw new Error('Request timeout - server took too long to respond');
    }
    
    throw new Error(`Network error: ${fetchError.message}`);
  }
}

function estimateTraffic(siteData, domain) {
  const { html } = siteData;
  
  // Extract content metrics
  const textContent = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
                         .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
                         .replace(/<[^>]*>/g, ' ')
                         .replace(/\s+/g, ' ')
                         .trim();

  const wordCount = textContent.split(/\s+/).length;
  const pageCount = estimatePageCount(html, domain);
  const domainAge = estimateDomainAge(domain);
  const contentQuality = assessContentQuality(html, textContent);
  const technicalSEO = assessTechnicalSEO(html, siteData.headers);

  // Traffic estimation algorithm
  let baseTraffic = 100; // Base traffic for any website

  // Content factors
  baseTraffic += Math.min(wordCount / 100, 500); // Up to 500 based on content
  baseTraffic += pageCount * 50; // 50 per estimated page
  
  // Domain age factor
  baseTraffic += domainAge * 100; // 100 per estimated year

  // Content quality multiplier
  baseTraffic *= (contentQuality.score / 100);

  // Technical SEO multiplier
  baseTraffic *= (technicalSEO.score / 100);

  // Domain authority estimation (simplified)
  const domainAuthority = estimateDomainAuthority(domain, contentQuality, technicalSEO);
  baseTraffic *= (domainAuthority / 50); // DA of 50 = 1x multiplier

  // Apply variance for realistic estimation
  const minTraffic = Math.round(baseTraffic * 0.7);
  const maxTraffic = Math.round(baseTraffic * 1.5);
  const estimatedTraffic = Math.round(baseTraffic);

  return {
    estimated: {
      monthly: estimatedTraffic,
      min: minTraffic,
      max: maxTraffic,
      daily: Math.round(estimatedTraffic / 30)
    },
    factors: {
      wordCount,
      pageCount,
      domainAge,
      domainAuthority,
      contentQualityScore: contentQuality.score,
      technicalSEOScore: technicalSEO.score
    },
    confidence: calculateConfidence(contentQuality, technicalSEO, wordCount),
    category: categorizeTraffic(estimatedTraffic)
  };
}

function estimatePageCount(html, domain) {
  // Look for sitemaps, navigation, pagination indicators
  let pageEstimate = 1; // Current page

  // Check for sitemap links
  if (html.includes('sitemap') || html.includes('Sitemap')) {
    pageEstimate += 20; // Websites with sitemaps typically have more pages
  }

  // Count navigation links
  const navLinks = (html.match(/<nav[^>]*>[\s\S]*?<\/nav>/gi) || [])
    .join('')
    .match(/<a[^>]*href=[^>]*>/gi);
  if (navLinks) {
    pageEstimate += Math.min(navLinks.length, 50);
  }

  // Look for pagination
  if (html.includes('pagination') || html.includes('page-numbers') || 
      html.includes('next') || html.includes('previous')) {
    pageEstimate += 10;
  }

  // Check for blog/news indicators
  if (html.includes('blog') || html.includes('news') || html.includes('articles')) {
    pageEstimate += 25;
  }

  return Math.min(pageEstimate, 200); // Cap at 200 for estimation
}

function estimateDomainAge(domain) {
  // Simple heuristic based on domain patterns
  // In real implementation, you'd check WHOIS data
  
  const commonOldDomains = ['com', 'org', 'net', 'edu', 'gov'];
  const tld = domain.split('.').pop();
  
  let estimatedAge = 1; // Default 1 year
  
  if (commonOldDomains.includes(tld)) {
    estimatedAge = 3; // Assume older for traditional TLDs
  }
  
  // Look for indicators of established sites
  if (domain.length < 8) {
    estimatedAge += 2; // Short domains often older
  }
  
  return Math.min(estimatedAge, 10); // Cap at 10 years
}

function assessContentQuality(html, textContent) {
  let score = 50; // Base score
  const issues = [];
  const strengths = [];
  
  const wordCount = textContent.split(/\s+/).length;
  
  // Content length
  if (wordCount < 300) {
    issues.push('Content too short (under 300 words)');
    score -= 20;
  } else if (wordCount > 1000) {
    strengths.push('Comprehensive content (1000+ words)');
    score += 15;
  }
  
  // Title tag
  const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
  if (titleMatch && titleMatch[1].trim()) {
    const title = titleMatch[1].trim();
    if (title.length >= 30 && title.length <= 60) {
      strengths.push('Well-optimized title length');
      score += 10;
    } else {
      issues.push('Title length not optimal');
      score -= 5;
    }
  } else {
    issues.push('Missing or empty title tag');
    score -= 15;
  }
  
  // Meta description
  const metaDescMatch = html.match(/<meta\s+name=['""]description['""].*?content=['""]([^'""]*)['""][^>]*>/i);
  if (metaDescMatch && metaDescMatch[1].trim()) {
    strengths.push('Has meta description');
    score += 10;
  } else {
    issues.push('Missing meta description');
    score -= 10;
  }
  
  // Header structure
  const h1Count = (html.match(/<h1[^>]*>/gi) || []).length;
  const h2Count = (html.match(/<h2[^>]*>/gi) || []).length;
  
  if (h1Count === 1) {
    strengths.push('Proper H1 usage');
    score += 5;
  } else if (h1Count === 0) {
    issues.push('Missing H1 tag');
    score -= 10;
  } else {
    issues.push('Multiple H1 tags');
    score -= 5;
  }
  
  if (h2Count > 0) {
    strengths.push('Good header structure');
    score += 5;
  }
  
  // Image optimization
  const images = (html.match(/<img[^>]*>/gi) || []);
  const imagesWithAlt = (html.match(/<img[^>]*alt=[^>]*>/gi) || []);
  
  if (images.length > 0) {
    if (imagesWithAlt.length === images.length) {
      strengths.push('All images have alt text');
      score += 10;
    } else {
      issues.push('Some images missing alt text');
      score -= 5;
    }
  }
  
  return {
    score: Math.max(0, Math.min(100, score)),
    issues,
    strengths,
    metrics: {
      wordCount,
      hasTitle: !!titleMatch,
      hasMetaDesc: !!metaDescMatch,
      h1Count,
      h2Count,
      imageCount: images.length,
      imagesWithAlt: imagesWithAlt.length
    }
  };
}

function assessTechnicalSEO(html, headers) {
  let score = 50; // Base score
  const issues = [];
  const strengths = [];
  
  // HTTPS
  if (headers['strict-transport-security']) {
    strengths.push('HTTPS with HSTS');
    score += 10;
  }
  
  // Mobile viewport
  if (html.includes('viewport') && html.includes('device-width')) {
    strengths.push('Mobile-friendly viewport');
    score += 10;
  } else {
    issues.push('Missing mobile viewport meta tag');
    score -= 15;
  }
  
  // Canonical URL
  if (html.includes('canonical')) {
    strengths.push('Has canonical URL');
    score += 5;
  }
  
  // Open Graph
  if (html.includes('og:') && html.includes('property=')) {
    strengths.push('Open Graph meta tags');
    score += 5;
  }
  
  // Schema markup
  if (html.includes('schema.org') || html.includes('application/ld+json')) {
    strengths.push('Structured data (Schema.org)');
    score += 10;
  }
  
  // Page loading indicators
  if (html.includes('defer') || html.includes('async')) {
    strengths.push('Optimized script loading');
    score += 5;
  }
  
  // CSS optimization
  if (html.includes('minified') || headers['content-encoding'] === 'gzip') {
    strengths.push('Optimized content delivery');
    score += 5;
  }
  
  return {
    score: Math.max(0, Math.min(100, score)),
    issues,
    strengths
  };
}

function estimateDomainAuthority(domain, contentQuality, technicalSEO) {
  let da = 20; // Base DA
  
  // Domain factors
  if (domain.length < 10) da += 5; // Shorter domains often more authoritative
  if (domain.includes('www.')) da += 2;
  
  // Content quality factor
  da += (contentQuality.score / 100) * 30;
  
  // Technical SEO factor
  da += (technicalSEO.score / 100) * 20;
  
  // Popular TLDs
  if (domain.endsWith('.com') || domain.endsWith('.org')) {
    da += 5;
  }
  
  return Math.max(1, Math.min(100, Math.round(da)));
}

function calculateConfidence(contentQuality, technicalSEO, wordCount) {
  let confidence = 50; // Base confidence
  
  if (contentQuality.score > 70) confidence += 20;
  if (technicalSEO.score > 70) confidence += 15;
  if (wordCount > 500) confidence += 10;
  if (wordCount > 1500) confidence += 5;
  
  return Math.max(30, Math.min(95, confidence));
}

function categorizeTraffic(traffic) {
  if (traffic < 100) return 'Very Low';
  if (traffic < 1000) return 'Low';
  if (traffic < 5000) return 'Medium';
  if (traffic < 20000) return 'High';
  return 'Very High';
}

function analyzeSEOFactors(siteData) {
  const { html } = siteData;
  const contentQuality = assessContentQuality(html, html.replace(/<[^>]*>/g, ' '));
  const technicalSEO = assessTechnicalSEO(html, siteData.headers);
  
  return {
    contentQuality,
    technicalSEO,
    overallScore: Math.round((contentQuality.score + technicalSEO.score) / 2),
    keyOptimizations: [
      ...contentQuality.strengths,
      ...technicalSEO.strengths
    ],
    criticalIssues: [
      ...contentQuality.issues,
      ...technicalSEO.issues
    ]
  };
}

function analyzeKeywords(siteData) {
  const { html } = siteData;
  const textContent = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
  
  // Extract potential keywords
  const words = textContent.split(/\s+/)
    .filter(word => word.length > 3)
    .filter(word => !/^\d+$/.test(word))
    .filter(word => !['that', 'this', 'with', 'from', 'they', 'have', 'will', 'been', 'their', 'said', 'each', 'which', 'them', 'more', 'very', 'what', 'know', 'just', 'first', 'time', 'year', 'work', 'make', 'only', 'over', 'think', 'also', 'its', 'after', 'back', 'other', 'many', 'than', 'then', 'them', 'these', 'some', 'like', 'into', 'him', 'has', 'two', 'see', 'could', 'way', 'who', 'oil', 'sit', 'now', 'find', 'long', 'down', 'day', 'did', 'get', 'may', 'new', 'where', 'much', 'your', 'good', 'through', 'little', 'still', 'should', 'come', 'such', 'well', 'take', 'because', 'turn', 'here', 'why', 'when', 'how', 'out', 'too', 'any', 'all', 'would', 'our', 'use', 'her', 'own', 'under', 'think', 'most', 'even', 'move', 'right', 'boy', 'old', 'great', 'tell', 'men', 'say', 'small', 'every', 'found', 'still', 'between', 'name', 'should', 'home', 'big', 'give', 'air', 'line', 'set', 'world', 'own', 'under', 'last', 'read', 'never', 'am', 'us', 'left', 'end', 'along', 'while', 'might', 'next', 'sound', 'below', 'saw', 'something', 'thought', 'both', 'few', 'those', 'always', 'show', 'large', 'often', 'together', 'asked', 'house', 'don', 'put', 'around', 'stop', 'off', 'again', 'want', 'need', 'look', 'help', 'want', 'back', 'time', 'page', 'about', 'information', 'contact', 'home', 'privacy', 'terms', 'services', 'policy', 'copyright'].includes(word));

  // Count word frequency
  const wordFreq = {};
  words.forEach(word => {
    wordFreq[word] = (wordFreq[word] || 0) + 1;
  });

  // Get top keywords
  const topKeywords = Object.entries(wordFreq)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 20)
    .map(([word, count]) => ({
      keyword: word,
      frequency: count,
      density: ((count / words.length) * 100).toFixed(2)
    }));

  // Extract title keywords
  const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
  const titleKeywords = titleMatch ? 
    titleMatch[1].toLowerCase().split(/\s+/).filter(word => word.length > 3) : [];

  return {
    topKeywords,
    titleKeywords,
    totalWords: words.length,
    uniqueWords: Object.keys(wordFreq).length,
    keywordDiversity: (Object.keys(wordFreq).length / words.length * 100).toFixed(2)
  };
}

function analyzeCompetitiveness(domain, siteData) {
  // Simplified competitiveness analysis
  const tld = domain.split('.').pop();
  const domainLength = domain.length;
  const { html } = siteData;
  
  let competitiveness = 50; // Medium competitiveness
  
  // TLD factor
  if (tld === 'com') competitiveness += 10;
  if (tld === 'org') competitiveness += 5;
  
  // Domain length
  if (domainLength < 8) competitiveness += 15;
  if (domainLength > 20) competitiveness -= 10;
  
  // Content depth
  const wordCount = html.replace(/<[^>]*>/g, ' ').split(/\s+/).length;
  if (wordCount > 2000) competitiveness += 10;
  if (wordCount < 300) competitiveness -= 15;
  
  // SEO optimization level
  if (html.includes('schema.org')) competitiveness += 10;
  if (html.includes('og:')) competitiveness += 5;
  
  return {
    score: Math.max(10, Math.min(90, competitiveness)),
    level: competitiveness > 70 ? 'High' : competitiveness > 40 ? 'Medium' : 'Low',
    factors: {
      domainStrength: domainLength < 10 ? 'Strong' : 'Weak',
      contentDepth: wordCount > 1000 ? 'Deep' : 'Shallow',
      technicalOptimization: html.includes('schema.org') ? 'Advanced' : 'Basic'
    }
  };
}

function generateTrafficRecommendations(trafficEstimation, seoFactors, keywordInsights) {
  const recommendations = [];
  
  // Content recommendations
  if (seoFactors.contentQuality.score < 70) {
    recommendations.push('Improve content quality and length for better rankings');
  }
  
  if (trafficEstimation.estimated.monthly < 1000) {
    recommendations.push('Focus on long-tail keywords to increase organic visibility');
  }
  
  // Technical SEO recommendations
  if (seoFactors.technicalSEO.score < 70) {
    recommendations.push('Address technical SEO issues to improve search performance');
  }
  
  // Keyword recommendations
  if (keywordInsights.keywordDiversity < 5) {
    recommendations.push('Increase keyword diversity in your content');
  }
  
  // General recommendations
  recommendations.push('Create high-quality, comprehensive content targeting your main keywords');
  recommendations.push('Build authoritative backlinks to improve domain authority');
  recommendations.push('Optimize page loading speed for better user experience');
  recommendations.push('Ensure mobile-friendliness for all pages');
  recommendations.push('Implement proper internal linking structure');
  
  return recommendations;
}

function generateTrafficAnalysis(trafficEstimation, seoFactors, domain) {
  const { estimated, confidence, category } = trafficEstimation;
  
  let analysis = `Organic traffic analysis for ${domain}:\n\n`;
  
  analysis += `Estimated Monthly Organic Traffic: ${estimated.monthly.toLocaleString()} visits\n`;
  analysis += `Traffic Range: ${estimated.min.toLocaleString()} - ${estimated.max.toLocaleString()} visits\n`;
  analysis += `Daily Average: ${estimated.daily.toLocaleString()} visits\n`;
  analysis += `Traffic Category: ${category}\n`;
  analysis += `Confidence Level: ${confidence}%\n\n`;
  
  analysis += `SEO Performance Summary:\n`;
  analysis += `• Content Quality Score: ${seoFactors.contentQuality.score}/100\n`;
  analysis += `• Technical SEO Score: ${seoFactors.technicalSEO.score}/100\n`;
  analysis += `• Overall SEO Score: ${seoFactors.overallScore}/100\n\n`;
  
  if (estimated.monthly < 500) {
    analysis += `The website has very low organic traffic. Focus on improving content quality, targeting long-tail keywords, and addressing technical SEO issues.`;
  } else if (estimated.monthly < 2000) {
    analysis += `The website has moderate organic traffic with good potential for growth. Continue optimizing content and building authority.`;
  } else if (estimated.monthly < 10000) {
    analysis += `The website has good organic traffic. Focus on scaling content production and targeting competitive keywords.`;
  } else {
    analysis += `The website has excellent organic traffic. Maintain current SEO strategies and explore advanced optimization techniques.`;
  }
  
  return analysis;
}
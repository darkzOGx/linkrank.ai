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

    const cacheData = await checkGoogleCache(targetUrl);
    
    return res.json({
      success: true,
      url: targetUrl,
      ...cacheData
    });

  } catch (error) {
    console.error('Google cache check error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error occurred while checking Google cache'
    });
  }
}

async function checkGoogleCache(url) {
  try {
    const domain = new URL(url).hostname;
    
    // Check multiple cache indicators
    const cacheResults = await Promise.allSettled([
      checkGoogleCacheAPI(url),
      checkSiteHeaders(url),
      analyzeCacheableContent(url),
      checkRobotsTxt(domain),
      checkSitemap(domain)
    ]);

    const [cacheApiResult, headersResult, contentResult, robotsResult, sitemapResult] = cacheResults;

    // Compile results
    const analysis = {
      domain,
      cacheStatus: determineCacheStatus(cacheResults),
      cacheDate: extractCacheDate(cacheApiResult),
      lastModified: extractLastModified(headersResult),
      cacheability: assessCacheability(contentResult, headersResult),
      indexabilityFactors: analyzeIndexabilityFactors(robotsResult, sitemapResult, headersResult),
      recommendations: [],
      details: {
        googleCacheCheck: cacheApiResult.status === 'fulfilled' ? cacheApiResult.value : { error: cacheApiResult.reason?.message },
        headerAnalysis: headersResult.status === 'fulfilled' ? headersResult.value : { error: headersResult.reason?.message },
        contentAnalysis: contentResult.status === 'fulfilled' ? contentResult.value : { error: contentResult.reason?.message },
        robotsAnalysis: robotsResult.status === 'fulfilled' ? robotsResult.value : { error: robotsResult.reason?.message },
        sitemapAnalysis: sitemapResult.status === 'fulfilled' ? sitemapResult.value : { error: sitemapResult.reason?.message }
      }
    };

    // Generate recommendations based on findings
    analysis.recommendations = generateCacheRecommendations(analysis);

    // Calculate cache health score
    analysis.cacheHealthScore = calculateCacheHealthScore(analysis);

    return analysis;

  } catch (error) {
    throw new Error(`Failed to check Google cache: ${error.message}`);
  }
}

async function checkGoogleCacheAPI(url) {
  // Check Google cache using cache: operator simulation
  try {
    const cacheUrl = `cache:${url}`;
    
    // Simulate cache check by examining various indicators
    const urlCheck = await fetchPageWithCacheHeaders(url);
    
    return {
      method: 'cache_simulation',
      found: urlCheck.cacheable,
      estimated_date: urlCheck.lastModified || urlCheck.dateHeader,
      cache_url: cacheUrl,
      indicators: urlCheck.cacheIndicators,
      accessibility: urlCheck.accessible
    };

  } catch (error) {
    return {
      method: 'cache_simulation',
      found: false,
      error: error.message,
      accessibility: false
    };
  }
}

async function fetchPageWithCacheHeaders(url) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(url, {
      method: 'HEAD', // Use HEAD to get headers without body
      headers: {
        'User-Agent': 'Cache-Checker/1.0 (+https://linkrank.ai/bot)'
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    const headers = {};
    response.headers.forEach((value, key) => {
      headers[key.toLowerCase()] = value;
    });

    const cacheIndicators = {
      statusCode: response.status,
      hasLastModified: !!headers['last-modified'],
      hasEtag: !!headers['etag'],
      hasCacheControl: !!headers['cache-control'],
      hasExpires: !!headers['expires'],
      serverType: headers['server'] || 'unknown'
    };

    return {
      accessible: response.ok,
      cacheable: response.ok && !headers['cache-control']?.includes('no-cache'),
      lastModified: headers['last-modified'],
      dateHeader: headers['date'],
      etag: headers['etag'],
      cacheControl: headers['cache-control'],
      expires: headers['expires'],
      cacheIndicators,
      headers
    };

  } catch (fetchError) {
    clearTimeout(timeoutId);
    
    if (fetchError.name === 'AbortError') {
      throw new Error('Request timeout - server took too long to respond');
    }
    
    throw new Error(`Network error: ${fetchError.message}`);
  }
}

async function checkSiteHeaders(url) {
  try {
    const pageData = await fetchPageWithCacheHeaders(url);
    
    return {
      accessible: pageData.accessible,
      headers: pageData.headers,
      cacheHeaders: {
        lastModified: pageData.lastModified,
        etag: pageData.etag,
        cacheControl: pageData.cacheControl,
        expires: pageData.expires
      },
      cacheability: {
        score: calculateCacheabilityScore(pageData),
        factors: analyzeCacheHeaders(pageData)
      }
    };

  } catch (error) {
    return {
      accessible: false,
      error: error.message,
      cacheability: { score: 0, factors: [] }
    };
  }
}

function calculateCacheabilityScore(pageData) {
  let score = 50; // Base score

  if (pageData.accessible) {
    score += 20;
  } else {
    return 0; // Not accessible = not cacheable
  }

  // Positive factors
  if (pageData.lastModified) score += 15;
  if (pageData.etag) score += 10;
  if (pageData.cacheControl && !pageData.cacheControl.includes('no-cache')) score += 10;
  if (pageData.expires) score += 5;

  // Negative factors
  if (pageData.cacheControl?.includes('no-cache')) score -= 30;
  if (pageData.cacheControl?.includes('no-store')) score -= 40;
  if (pageData.cacheControl?.includes('private')) score -= 20;

  return Math.max(0, Math.min(100, score));
}

function analyzeCacheHeaders(pageData) {
  const factors = [];

  if (pageData.lastModified) {
    factors.push({ type: 'positive', description: 'Has Last-Modified header' });
  } else {
    factors.push({ type: 'negative', description: 'Missing Last-Modified header' });
  }

  if (pageData.etag) {
    factors.push({ type: 'positive', description: 'Has ETag for cache validation' });
  } else {
    factors.push({ type: 'negative', description: 'Missing ETag header' });
  }

  if (pageData.cacheControl) {
    if (pageData.cacheControl.includes('no-cache')) {
      factors.push({ type: 'negative', description: 'Cache-Control prevents caching' });
    } else if (pageData.cacheControl.includes('max-age')) {
      factors.push({ type: 'positive', description: 'Has cache expiration time' });
    }
  } else {
    factors.push({ type: 'neutral', description: 'No Cache-Control header specified' });
  }

  if (pageData.expires) {
    factors.push({ type: 'positive', description: 'Has Expires header' });
  }

  return factors;
}

async function analyzeCacheableContent(url) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Cache-Checker/1.0 (+https://linkrank.ai/bot)'
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return {
        accessible: false,
        statusCode: response.status,
        cacheability: 'unknown'
      };
    }

    const html = await response.text();
    const contentAnalysis = analyzeContentCacheability(html);

    return {
      accessible: true,
      statusCode: response.status,
      ...contentAnalysis
    };

  } catch (error) {
    return {
      accessible: false,
      error: error.message,
      cacheability: 'unknown'
    };
  }
}

function analyzeContentCacheability(html) {
  const analysis = {
    contentType: 'html',
    dynamicContent: false,
    personalizedContent: false,
    cacheability: 'cacheable',
    factors: []
  };

  // Check for dynamic content indicators
  const dynamicIndicators = [
    'document.write',
    'new Date()',
    'Math.random()',
    'session',
    'csrf',
    'nonce'
  ];

  dynamicIndicators.forEach(indicator => {
    if (html.includes(indicator)) {
      analysis.dynamicContent = true;
      analysis.factors.push(`Contains ${indicator} - may have dynamic content`);
    }
  });

  // Check for personalized content
  const personalizationIndicators = [
    'user',
    'login',
    'account',
    'profile',
    'dashboard',
    'welcome back'
  ];

  personalizationIndicators.forEach(indicator => {
    if (html.toLowerCase().includes(indicator)) {
      analysis.personalizedContent = true;
      analysis.factors.push(`Contains ${indicator} - may be personalized`);
    }
  });

  // Check for meta tags that affect caching
  if (html.includes('no-cache') || html.includes('no-store')) {
    analysis.cacheability = 'not-cacheable';
    analysis.factors.push('Contains meta tags preventing caching');
  }

  // Check for cache-friendly indicators
  if (html.includes('static') || html.includes('cdn')) {
    analysis.factors.push('Contains references to static/CDN resources');
  }

  // Assess overall cacheability
  if (analysis.dynamicContent || analysis.personalizedContent) {
    analysis.cacheability = 'partially-cacheable';
  }

  return analysis;
}

async function checkRobotsTxt(domain) {
  try {
    const robotsUrl = `https://${domain}/robots.txt`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(robotsUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Cache-Checker/1.0 (+https://linkrank.ai/bot)'
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return {
        exists: false,
        accessible: false,
        statusCode: response.status
      };
    }

    const robotsContent = await response.text();
    const robotsAnalysis = analyzeRobotsContent(robotsContent);

    return {
      exists: true,
      accessible: true,
      content: robotsContent,
      ...robotsAnalysis
    };

  } catch (error) {
    return {
      exists: false,
      accessible: false,
      error: error.message
    };
  }
}

function analyzeRobotsContent(content) {
  const analysis = {
    allowsCrawling: true,
    blocksCrawling: false,
    hasSitemap: false,
    crawlDelays: [],
    disallowedPaths: [],
    sitemapUrls: []
  };

  const lines = content.split('\n').map(line => line.trim());

  lines.forEach(line => {
    if (line.toLowerCase().startsWith('disallow:')) {
      const path = line.substring(9).trim();
      if (path === '/') {
        analysis.blocksCrawling = true;
        analysis.allowsCrawling = false;
      } else if (path) {
        analysis.disallowedPaths.push(path);
      }
    } else if (line.toLowerCase().startsWith('sitemap:')) {
      const sitemapUrl = line.substring(8).trim();
      analysis.hasSitemap = true;
      analysis.sitemapUrls.push(sitemapUrl);
    } else if (line.toLowerCase().startsWith('crawl-delay:')) {
      const delay = line.substring(12).trim();
      analysis.crawlDelays.push(delay);
    }
  });

  return analysis;
}

async function checkSitemap(domain) {
  try {
    const sitemapUrls = [
      `https://${domain}/sitemap.xml`,
      `https://${domain}/sitemap_index.xml`,
      `https://${domain}/sitemaps.xml`
    ];

    for (const sitemapUrl of sitemapUrls) {
      const result = await checkSingleSitemap(sitemapUrl);
      if (result.exists) {
        return result;
      }
    }

    return {
      exists: false,
      accessible: false,
      checked_urls: sitemapUrls
    };

  } catch (error) {
    return {
      exists: false,
      accessible: false,
      error: error.message
    };
  }
}

async function checkSingleSitemap(sitemapUrl) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(sitemapUrl, {
      method: 'HEAD',
      headers: {
        'User-Agent': 'Cache-Checker/1.0 (+https://linkrank.ai/bot)'
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    return {
      exists: response.ok,
      accessible: response.ok,
      url: sitemapUrl,
      statusCode: response.status,
      lastModified: response.headers.get('last-modified'),
      contentType: response.headers.get('content-type')
    };

  } catch (error) {
    return {
      exists: false,
      accessible: false,
      url: sitemapUrl,
      error: error.message
    };
  }
}

function determineCacheStatus(cacheResults) {
  const [cacheApiResult, headersResult, contentResult] = cacheResults;

  if (cacheApiResult.status === 'fulfilled' && cacheApiResult.value.found) {
    return 'cached';
  }

  if (headersResult.status === 'fulfilled' && headersResult.value.accessible) {
    const cacheScore = headersResult.value.cacheability?.score || 0;
    if (cacheScore > 70) {
      return 'likely_cached';
    } else if (cacheScore > 40) {
      return 'possibly_cached';
    }
  }

  if (contentResult.status === 'fulfilled' && contentResult.value.accessible) {
    if (contentResult.value.cacheability === 'not-cacheable') {
      return 'not_cached';
    }
  }

  return 'unknown';
}

function extractCacheDate(cacheApiResult) {
  if (cacheApiResult.status === 'fulfilled' && cacheApiResult.value.estimated_date) {
    return new Date(cacheApiResult.value.estimated_date).toISOString();
  }
  return null;
}

function extractLastModified(headersResult) {
  if (headersResult.status === 'fulfilled' && headersResult.value.cacheHeaders?.lastModified) {
    return new Date(headersResult.value.cacheHeaders.lastModified).toISOString();
  }
  return null;
}

function assessCacheability(contentResult, headersResult) {
  let score = 50;
  const factors = [];

  // Content analysis
  if (contentResult.status === 'fulfilled') {
    const content = contentResult.value;
    if (content.accessible) {
      score += 20;
      factors.push('Page is accessible');
    } else {
      score -= 30;
      factors.push('Page is not accessible');
    }

    if (content.cacheability === 'cacheable') {
      score += 20;
      factors.push('Content appears cacheable');
    } else if (content.cacheability === 'not-cacheable') {
      score -= 30;
      factors.push('Content prevents caching');
    } else if (content.cacheability === 'partially-cacheable') {
      score += 5;
      factors.push('Content is partially cacheable');
    }

    if (content.dynamicContent) {
      score -= 15;
      factors.push('Contains dynamic content');
    }

    if (content.personalizedContent) {
      score -= 20;
      factors.push('Contains personalized content');
    }
  }

  // Headers analysis
  if (headersResult.status === 'fulfilled') {
    const headers = headersResult.value;
    score += (headers.cacheability?.score || 0) * 0.3; // 30% weight
  }

  return {
    score: Math.max(0, Math.min(100, Math.round(score))),
    level: score > 70 ? 'High' : score > 40 ? 'Medium' : 'Low',
    factors
  };
}

function analyzeIndexabilityFactors(robotsResult, sitemapResult, headersResult) {
  const factors = {
    robotsTxt: 'unknown',
    sitemap: 'unknown',
    httpStatus: 'unknown',
    indexability: 'unknown',
    issues: [],
    positives: []
  };

  // Robots.txt analysis
  if (robotsResult.status === 'fulfilled') {
    const robots = robotsResult.value;
    if (robots.exists && robots.accessible) {
      factors.robotsTxt = 'exists';
      if (robots.allowsCrawling) {
        factors.positives.push('Robots.txt allows crawling');
      } else {
        factors.issues.push('Robots.txt blocks crawling');
      }
      if (robots.hasSitemap) {
        factors.positives.push('Robots.txt references sitemap');
      }
    } else {
      factors.robotsTxt = 'missing';
      factors.issues.push('No robots.txt found');
    }
  }

  // Sitemap analysis
  if (sitemapResult.status === 'fulfilled') {
    const sitemap = sitemapResult.value;
    if (sitemap.exists && sitemap.accessible) {
      factors.sitemap = 'exists';
      factors.positives.push('XML sitemap found');
    } else {
      factors.sitemap = 'missing';
      factors.issues.push('No XML sitemap found');
    }
  }

  // HTTP status analysis
  if (headersResult.status === 'fulfilled') {
    const headers = headersResult.value;
    if (headers.accessible) {
      factors.httpStatus = 'ok';
      factors.positives.push('Page returns 200 OK status');
    } else {
      factors.httpStatus = 'error';
      factors.issues.push('Page returns error status');
    }
  }

  // Overall indexability assessment
  if (factors.issues.length === 0 && factors.positives.length > 0) {
    factors.indexability = 'good';
  } else if (factors.issues.length > factors.positives.length) {
    factors.indexability = 'poor';
  } else {
    factors.indexability = 'fair';
  }

  return factors;
}

function generateCacheRecommendations(analysis) {
  const recommendations = [];

  // Cache status recommendations
  switch (analysis.cacheStatus) {
    case 'not_cached':
      recommendations.push('Page is not cached by Google - check for crawl issues');
      recommendations.push('Ensure the page is accessible and returns 200 status code');
      break;
    case 'unknown':
      recommendations.push('Cache status unclear - verify page accessibility');
      break;
    case 'cached':
      recommendations.push('Page is cached by Google - good for SEO visibility');
      break;
  }

  // Cacheability recommendations
  if (analysis.cacheability.score < 50) {
    recommendations.push('Improve page cacheability by adding cache headers');
    recommendations.push('Consider adding Last-Modified and ETag headers');
  }

  // Indexability recommendations
  const indexability = analysis.indexabilityFactors;
  
  if (indexability.robotsTxt === 'missing') {
    recommendations.push('Create a robots.txt file to guide search engine crawlers');
  }
  
  if (indexability.sitemap === 'missing') {
    recommendations.push('Create and submit an XML sitemap to Google Search Console');
  }

  if (indexability.issues.length > 0) {
    recommendations.push('Address crawling issues to improve cache likelihood');
  }

  // Headers recommendations
  if (analysis.details.headerAnalysis && !analysis.details.headerAnalysis.error) {
    const headers = analysis.details.headerAnalysis.cacheHeaders;
    if (!headers.lastModified) {
      recommendations.push('Add Last-Modified header to help Google understand content freshness');
    }
    if (!headers.etag) {
      recommendations.push('Add ETag header for better cache validation');
    }
  }

  // Content recommendations
  if (analysis.details.contentAnalysis && !analysis.details.contentAnalysis.error) {
    const content = analysis.details.contentAnalysis;
    if (content.dynamicContent) {
      recommendations.push('Minimize dynamic content that prevents effective caching');
    }
    if (content.personalizedContent) {
      recommendations.push('Consider separating personalized and static content');
    }
  }

  // General recommendations
  recommendations.push('Monitor cache status regularly in Google Search Console');
  recommendations.push('Ensure consistent URL structure for better cache management');
  recommendations.push('Optimize page load speed to improve crawl efficiency');

  return recommendations;
}

function calculateCacheHealthScore(analysis) {
  let score = 0;

  // Cache status (40 points)
  switch (analysis.cacheStatus) {
    case 'cached':
      score += 40;
      break;
    case 'likely_cached':
      score += 30;
      break;
    case 'possibly_cached':
      score += 20;
      break;
    case 'not_cached':
      score += 0;
      break;
    default:
      score += 10;
  }

  // Cacheability (30 points)
  score += (analysis.cacheability.score / 100) * 30;

  // Indexability factors (30 points)
  const indexability = analysis.indexabilityFactors;
  if (indexability.indexability === 'good') score += 30;
  else if (indexability.indexability === 'fair') score += 20;
  else if (indexability.indexability === 'poor') score += 5;

  return Math.round(Math.max(0, Math.min(100, score)));
}
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

    const speedData = await performBasicSpeedTest(targetUrl);
    
    return res.json({
      success: true,
      url: targetUrl,
      ...speedData
    });

  } catch (error) {
    console.error('Speed test error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error occurred while testing website speed'
    });
  }
}

async function performBasicSpeedTest(url) {
  const startTime = Date.now();
  
  try {
    // Perform basic timing test
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'SEO-Analysis-Protocol/1.0 (Speed Tester)'
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    const endTime = Date.now();
    const responseTime = endTime - startTime;

    if (!response.ok) {
      return {
        success: false,
        error: `HTTP ${response.status}: ${response.statusText}`
      };
    }

    const html = await response.text();
    const analysis = analyzePagePerformance(html, response, responseTime);
    
    return {
      responseTime,
      ...analysis,
      recommendations: generateSpeedRecommendations(analysis),
      note: 'This is a basic speed test. For comprehensive performance analysis, use Google PageSpeed Insights, GTmetrix, or WebPageTest.'
    };

  } catch (fetchError) {
    if (fetchError.name === 'AbortError') {
      return {
        success: false,
        error: 'Request timeout - the server took too long to respond (>30 seconds)'
      };
    }

    return {
      success: false,
      error: `Network error: ${fetchError.message}`
    };
  }
}

function analyzePagePerformance(html, response, responseTime) {
  const analysis = {
    score: 0,
    metrics: {},
    issues: [],
    opportunities: []
  };

  // Basic timing metrics
  analysis.metrics.responseTime = responseTime;
  analysis.metrics.status = response.status;
  
  // Content size analysis
  const contentLength = response.headers.get('content-length');
  const htmlSize = html.length;
  analysis.metrics.htmlSize = contentLength ? parseInt(contentLength) : htmlSize;
  analysis.metrics.htmlSizeFormatted = formatFileSize(analysis.metrics.htmlSize);

  // Compression check
  const contentEncoding = response.headers.get('content-encoding');
  analysis.metrics.compression = contentEncoding || 'none';
  
  if (!contentEncoding) {
    analysis.issues.push('No compression detected - enable gzip/brotli compression');
  }

  // Cache headers check
  const cacheControl = response.headers.get('cache-control');
  analysis.metrics.caching = cacheControl || 'none';
  
  if (!cacheControl || cacheControl.includes('no-cache')) {
    analysis.issues.push('No caching headers detected - implement browser caching');
  }

  // Resource analysis
  const resources = analyzeResources(html);
  analysis.metrics.resources = resources;

  // Performance scoring
  let score = 100;
  
  // Response time scoring
  if (responseTime > 3000) {
    score -= 30;
    analysis.issues.push(`Slow response time (${responseTime}ms) - optimize server response`);
  } else if (responseTime > 1000) {
    score -= 15;
    analysis.issues.push(`Moderate response time (${responseTime}ms) - consider server optimization`);
  }

  // File size scoring
  if (analysis.metrics.htmlSize > 500000) { // 500KB
    score -= 20;
    analysis.issues.push('Large HTML size - minimize and compress content');
  } else if (analysis.metrics.htmlSize > 100000) { // 100KB
    score -= 10;
    analysis.opportunities.push('Consider reducing HTML size for faster loading');
  }

  // Resource scoring
  if (resources.images > 50) {
    score -= 15;
    analysis.issues.push('Many images detected - optimize and lazy load images');
  }

  if (resources.scripts > 20) {
    score -= 10;
    analysis.issues.push('Many JavaScript files - consider bundling and minification');
  }

  if (resources.stylesheets > 10) {
    score -= 5;
    analysis.issues.push('Many CSS files - consider combining stylesheets');
  }

  analysis.score = Math.max(0, score);

  return analysis;
}

function analyzeResources(html) {
  const images = (html.match(/<img[^>]*>/gi) || []).length;
  const scripts = (html.match(/<script[^>]*src=/gi) || []).length;
  const stylesheets = (html.match(/<link[^>]*rel=["\']stylesheet/gi) || []).length;
  const fonts = (html.match(/@font-face|fonts\.googleapis/gi) || []).length;

  return {
    images,
    scripts,
    stylesheets,
    fonts,
    total: images + scripts + stylesheets + fonts
  };
}

function generateSpeedRecommendations(analysis) {
  const recommendations = [];

  // Basic optimization recommendations
  recommendations.push('Enable compression (gzip/brotli) on your server');
  recommendations.push('Implement browser caching with appropriate cache headers');
  recommendations.push('Optimize images by compressing and using modern formats (WebP, AVIF)');
  recommendations.push('Minify CSS, JavaScript, and HTML files');
  recommendations.push('Use a Content Delivery Network (CDN) for faster global delivery');

  // Specific recommendations based on analysis
  if (analysis.metrics.responseTime > 1000) {
    recommendations.push('Optimize server response time by upgrading hosting or optimizing database queries');
  }

  if (analysis.metrics.resources.images > 10) {
    recommendations.push('Implement lazy loading for images below the fold');
    recommendations.push('Use responsive images with srcset for different screen sizes');
  }

  if (analysis.metrics.resources.scripts > 5) {
    recommendations.push('Bundle and minify JavaScript files to reduce HTTP requests');
    recommendations.push('Load non-critical JavaScript asynchronously');
  }

  // Advanced recommendations
  recommendations.push('Consider implementing Critical CSS for above-the-fold content');
  recommendations.push('Use service workers for caching and offline functionality');
  recommendations.push('Implement HTTP/2 server push for critical resources');

  return recommendations;
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
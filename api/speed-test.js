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
    
    return analysis;

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
  const htmlSize = html.length;
  const resources = analyzeResources(html);
  
  // Calculate estimated metrics based on response time and content
  const loadTimeSeconds = responseTime / 1000;
  const estimatedFCP = Math.max(0.5, loadTimeSeconds * 0.7);
  const estimatedLCP = Math.max(1.0, loadTimeSeconds * 1.2);
  const estimatedCLS = Math.max(0, (resources.total * 0.001));
  const estimatedFID = Math.max(50, responseTime * 0.1);
  
  // Performance scoring based on metrics
  let overallScore = 100;
  let desktopScore = 100;
  let mobileScore = 100;
  
  // Response time scoring
  if (responseTime > 3000) {
    overallScore -= 40;
    desktopScore -= 35;
    mobileScore -= 45;
  } else if (responseTime > 1500) {
    overallScore -= 25;
    desktopScore -= 20;
    mobileScore -= 30;
  } else if (responseTime > 800) {
    overallScore -= 15;
    desktopScore -= 10;
    mobileScore -= 20;
  }

  // File size impact
  if (htmlSize > 500000) {
    overallScore -= 20;
    desktopScore -= 15;
    mobileScore -= 25;
  } else if (htmlSize > 100000) {
    overallScore -= 10;
    desktopScore -= 5;
    mobileScore -= 15;
  }

  // Resource count impact
  if (resources.total > 50) {
    overallScore -= 15;
    desktopScore -= 10;
    mobileScore -= 20;
  } else if (resources.total > 25) {
    overallScore -= 8;
    desktopScore -= 5;
    mobileScore -= 10;
  }

  // Ensure scores don't go below 0
  overallScore = Math.max(0, overallScore);
  desktopScore = Math.max(0, desktopScore);
  mobileScore = Math.max(0, mobileScore);

  // Generate opportunities based on analysis
  const opportunities = [];
  const passed = [];

  if (responseTime > 2000) {
    opportunities.push({
      title: 'Reduce server response time',
      description: `Server response time is ${responseTime}ms. Optimize server performance to improve loading speed.`,
      savings: `${Math.round((responseTime - 500) / 1000 * 100) / 100}s potential savings`
    });
  } else {
    passed.push('Fast server response time');
  }

  if (htmlSize > 100000) {
    opportunities.push({
      title: 'Minimize HTML size',
      description: `HTML document is ${formatFileSize(htmlSize)}. Consider minifying HTML and removing unnecessary content.`,
      savings: `${Math.round((htmlSize - 50000) / 1000)}KB potential savings`
    });
  } else {
    passed.push('Optimized HTML size');
  }

  if (resources.images > 20) {
    opportunities.push({
      title: 'Optimize images',
      description: `${resources.images} images detected. Implement image optimization and lazy loading.`,
      savings: 'Significant loading time improvement'
    });
  } else if (resources.images <= 10) {
    passed.push('Moderate image usage');
  }

  if (resources.scripts > 15) {
    opportunities.push({
      title: 'Reduce JavaScript',
      description: `${resources.scripts} JavaScript files detected. Bundle and minify scripts.`,
      savings: 'Faster script loading and execution'
    });
  } else if (resources.scripts <= 5) {
    passed.push('Optimized JavaScript usage');
  }

  // Check for good practices
  const contentEncoding = response.headers.get('content-encoding');
  if (contentEncoding) {
    passed.push('Content compression enabled');
  } else {
    opportunities.push({
      title: 'Enable compression',
      description: 'Enable gzip or brotli compression to reduce transfer size.',
      savings: '20-30% size reduction'
    });
  }

  const cacheControl = response.headers.get('cache-control');
  if (cacheControl && !cacheControl.includes('no-cache')) {
    passed.push('Browser caching configured');
  } else {
    opportunities.push({
      title: 'Implement caching',
      description: 'Set up proper cache headers to improve repeat visit performance.',
      savings: 'Faster repeat visits'
    });
  }

  return {
    overallScore,
    desktop: {
      performanceScore: desktopScore,
      loadTime: parseFloat(loadTimeSeconds.toFixed(2)),
      fcp: parseFloat(estimatedFCP.toFixed(2)),
      lcp: parseFloat(estimatedLCP.toFixed(2)),
      cls: parseFloat(estimatedCLS.toFixed(3))
    },
    mobile: {
      performanceScore: mobileScore,
      loadTime: parseFloat((loadTimeSeconds * 1.3).toFixed(2)), // Mobile typically slower
      fcp: parseFloat((estimatedFCP * 1.4).toFixed(2)),
      lcp: parseFloat((estimatedLCP * 1.5).toFixed(2)),
      cls: parseFloat((estimatedCLS * 1.2).toFixed(3))
    },
    coreWebVitals: {
      lcp: parseFloat(estimatedLCP.toFixed(2)),
      fid: Math.round(estimatedFID),
      cls: parseFloat(estimatedCLS.toFixed(3))
    },
    opportunities,
    passed,
    responseTime,
    htmlSize,
    resources
  };
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
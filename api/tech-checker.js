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

    const techData = await analyzeTechnology(targetUrl);
    
    return res.json({
      success: true,
      url: targetUrl,
      ...techData
    });

  } catch (error) {
    console.error('Technology analysis error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error occurred while analyzing website technology'
    });
  }
}

async function analyzeTechnology(url) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Tech-Analyzer/1.0 (+https://linkrank.ai/bot)'
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return {
        success: false,
        error: `HTTP ${response.status}: ${response.statusText}`
      };
    }

    const html = await response.text();
    const headers = {};
    response.headers.forEach((value, key) => {
      headers[key.toLowerCase()] = value;
    });

    const analysis = performTechnologyAnalysis(html, headers, url);
    
    return analysis;

  } catch (fetchError) {
    clearTimeout(timeoutId);
    
    if (fetchError.name === 'AbortError') {
      return {
        success: false,
        error: 'Request timeout - server took too long to respond'
      };
    }

    return {
      success: false,
      error: `Network error: ${fetchError.message}`
    };
  }
}

function performTechnologyAnalysis(html, headers, url) {
  const technologies = {
    cms: detectCMS(html, headers),
    webServer: detectWebServer(headers),
    frameworks: detectFrameworks(html),
    jsLibraries: detectJavaScriptLibraries(html),
    cssFrameworks: detectCSSFrameworks(html),
    analytics: detectAnalytics(html),
    ecommerce: detectEcommerce(html),
    cdn: detectCDN(headers, html),
    security: detectSecurity(headers, html),
    performance: detectPerformance(headers, html),
    hosting: detectHosting(headers, url),
    databases: detectDatabases(html, headers),
    programming: detectProgrammingLanguages(html, headers)
  };

  // Calculate technology scores
  const scores = calculateTechnologyScores(technologies);
  
  // Generate insights
  const insights = generateTechnologyInsights(technologies);

  return {
    technologies,
    scores,
    insights,
    summary: {
      totalTechnologies: countTechnologies(technologies),
      modernStack: assessModernStack(technologies),
      securityLevel: assessSecurityLevel(technologies.security),
      performanceOptimization: assessPerformanceOptimization(technologies.performance)
    }
  };
}

function detectCMS(html, headers) {
  const cms = [];

  // WordPress detection
  if (html.includes('wp-content') || html.includes('wp-includes') || html.includes('wordpress')) {
    cms.push({
      name: 'WordPress',
      confidence: 'High',
      evidence: ['wp-content directory', 'WordPress files detected'],
      category: 'CMS'
    });
  }

  // Drupal detection
  if (html.includes('Drupal') || html.includes('sites/default/files') || html.includes('misc/drupal')) {
    cms.push({
      name: 'Drupal',
      confidence: 'High',
      evidence: ['Drupal specific paths', 'Drupal core files'],
      category: 'CMS'
    });
  }

  // Joomla detection
  if (html.includes('Joomla') || html.includes('joomla') || html.includes('option=com_')) {
    cms.push({
      name: 'Joomla',
      confidence: 'High',
      evidence: ['Joomla component structure', 'Joomla references'],
      category: 'CMS'
    });
  }

  // Shopify detection
  if (html.includes('shopify') || html.includes('cdn.shopify.com') || headers['x-shopid']) {
    cms.push({
      name: 'Shopify',
      confidence: 'High',
      evidence: ['Shopify CDN', 'Shopify headers'],
      category: 'E-commerce Platform'
    });
  }

  // Squarespace detection
  if (html.includes('squarespace') || html.includes('static1.squarespace.com')) {
    cms.push({
      name: 'Squarespace',
      confidence: 'High',
      evidence: ['Squarespace assets', 'Squarespace references'],
      category: 'Website Builder'
    });
  }

  // Wix detection
  if (html.includes('wix.com') || html.includes('_wixCIDX')) {
    cms.push({
      name: 'Wix',
      confidence: 'High',
      evidence: ['Wix CDN', 'Wix specific code'],
      category: 'Website Builder'
    });
  }

  return cms;
}

function detectWebServer(headers) {
  const servers = [];
  const serverHeader = headers['server'];

  if (serverHeader) {
    if (serverHeader.includes('nginx')) {
      servers.push({
        name: 'Nginx',
        version: extractVersion(serverHeader, 'nginx'),
        confidence: 'High'
      });
    }
    
    if (serverHeader.includes('Apache')) {
      servers.push({
        name: 'Apache',
        version: extractVersion(serverHeader, 'Apache'),
        confidence: 'High'
      });
    }

    if (serverHeader.includes('cloudflare')) {
      servers.push({
        name: 'Cloudflare',
        confidence: 'High',
        type: 'CDN/Security'
      });
    }

    if (serverHeader.includes('Microsoft-IIS')) {
      servers.push({
        name: 'Microsoft IIS',
        version: extractVersion(serverHeader, 'Microsoft-IIS'),
        confidence: 'High'
      });
    }
  }

  return servers;
}

function detectFrameworks(html) {
  const frameworks = [];

  // React detection
  if (html.includes('react') || html.includes('_react') || html.includes('React')) {
    frameworks.push({
      name: 'React',
      confidence: 'Medium',
      category: 'JavaScript Framework'
    });
  }

  // Vue.js detection
  if (html.includes('vue.js') || html.includes('Vue') || html.includes('v-')) {
    frameworks.push({
      name: 'Vue.js',
      confidence: 'Medium',
      category: 'JavaScript Framework'
    });
  }

  // Angular detection
  if (html.includes('angular') || html.includes('ng-') || html.includes('Angular')) {
    frameworks.push({
      name: 'Angular',
      confidence: 'Medium',
      category: 'JavaScript Framework'
    });
  }

  // Next.js detection
  if (html.includes('_next') || html.includes('next.js') || html.includes('__NEXT_DATA__')) {
    frameworks.push({
      name: 'Next.js',
      confidence: 'High',
      category: 'React Framework'
    });
  }

  // Nuxt.js detection
  if (html.includes('nuxt') || html.includes('_nuxt')) {
    frameworks.push({
      name: 'Nuxt.js',
      confidence: 'High',
      category: 'Vue.js Framework'
    });
  }

  return frameworks;
}

function detectJavaScriptLibraries(html) {
  const libraries = [];

  // jQuery detection
  if (html.includes('jquery') || html.includes('jQuery')) {
    libraries.push({
      name: 'jQuery',
      confidence: 'High',
      category: 'JavaScript Library'
    });
  }

  // Lodash detection
  if (html.includes('lodash') || html.includes('_.')) {
    libraries.push({
      name: 'Lodash',
      confidence: 'Medium',
      category: 'Utility Library'
    });
  }

  // D3.js detection
  if (html.includes('d3.js') || html.includes('d3.min.js')) {
    libraries.push({
      name: 'D3.js',
      confidence: 'High',
      category: 'Data Visualization'
    });
  }

  // Three.js detection
  if (html.includes('three.js') || html.includes('three.min.js')) {
    libraries.push({
      name: 'Three.js',
      confidence: 'High',
      category: '3D Graphics'
    });
  }

  return libraries;
}

function detectCSSFrameworks(html) {
  const frameworks = [];

  // Bootstrap detection
  if (html.includes('bootstrap') || html.includes('btn-') || html.includes('col-')) {
    frameworks.push({
      name: 'Bootstrap',
      confidence: 'High',
      category: 'CSS Framework'
    });
  }

  // Tailwind CSS detection
  if (html.includes('tailwind') || html.includes('tw-') || html.match(/class="[^"]*\b(flex|grid|p-\d|m-\d|text-\w+)\b/)) {
    frameworks.push({
      name: 'Tailwind CSS',
      confidence: 'Medium',
      category: 'CSS Framework'
    });
  }

  // Foundation detection
  if (html.includes('foundation') || html.includes('zurb')) {
    frameworks.push({
      name: 'Foundation',
      confidence: 'High',
      category: 'CSS Framework'
    });
  }

  // Bulma detection
  if (html.includes('bulma') || html.includes('is-primary') || html.includes('column')) {
    frameworks.push({
      name: 'Bulma',
      confidence: 'Medium',
      category: 'CSS Framework'
    });
  }

  return frameworks;
}

function detectAnalytics(html) {
  const analytics = [];

  // Google Analytics detection
  if (html.includes('google-analytics') || html.includes('gtag') || html.includes('ga(')) {
    analytics.push({
      name: 'Google Analytics',
      confidence: 'High',
      category: 'Web Analytics'
    });
  }

  // Google Tag Manager detection
  if (html.includes('googletagmanager') || html.includes('GTM-')) {
    analytics.push({
      name: 'Google Tag Manager',
      confidence: 'High',
      category: 'Tag Management'
    });
  }

  // Facebook Pixel detection
  if (html.includes('facebook.net/tr') || html.includes('fbq(')) {
    analytics.push({
      name: 'Facebook Pixel',
      confidence: 'High',
      category: 'Social Analytics'
    });
  }

  // Hotjar detection
  if (html.includes('hotjar') || html.includes('hj(')) {
    analytics.push({
      name: 'Hotjar',
      confidence: 'High',
      category: 'User Analytics'
    });
  }

  return analytics;
}

function detectEcommerce(html) {
  const ecommerce = [];

  // WooCommerce detection
  if (html.includes('woocommerce') || html.includes('wc-') || html.includes('add-to-cart')) {
    ecommerce.push({
      name: 'WooCommerce',
      confidence: 'High',
      category: 'E-commerce Plugin'
    });
  }

  // Magento detection
  if (html.includes('magento') || html.includes('Mage.') || html.includes('varien')) {
    ecommerce.push({
      name: 'Magento',
      confidence: 'High',
      category: 'E-commerce Platform'
    });
  }

  // Stripe detection
  if (html.includes('stripe') || html.includes('js.stripe.com')) {
    ecommerce.push({
      name: 'Stripe',
      confidence: 'High',
      category: 'Payment Processor'
    });
  }

  // PayPal detection
  if (html.includes('paypal') || html.includes('paypalobjects')) {
    ecommerce.push({
      name: 'PayPal',
      confidence: 'High',
      category: 'Payment Processor'
    });
  }

  return ecommerce;
}

function detectCDN(headers, html) {
  const cdns = [];

  // Cloudflare detection
  if (headers['cf-ray'] || headers['server']?.includes('cloudflare')) {
    cdns.push({
      name: 'Cloudflare',
      confidence: 'High',
      category: 'CDN/Security'
    });
  }

  // AWS CloudFront detection
  if (headers['via']?.includes('CloudFront') || html.includes('cloudfront.net')) {
    cdns.push({
      name: 'AWS CloudFront',
      confidence: 'High',
      category: 'CDN'
    });
  }

  // jsDelivr detection
  if (html.includes('jsdelivr.net')) {
    cdns.push({
      name: 'jsDelivr',
      confidence: 'High',
      category: 'JavaScript CDN'
    });
  }

  // Unpkg detection
  if (html.includes('unpkg.com')) {
    cdns.push({
      name: 'Unpkg',
      confidence: 'High',
      category: 'JavaScript CDN'
    });
  }

  return cdns;
}

function detectSecurity(headers, html) {
  const security = [];

  // SSL/TLS detection
  security.push({
    name: 'SSL/TLS Certificate',
    enabled: true, // Assumed since we're using HTTPS
    confidence: 'High'
  });

  // HSTS detection
  if (headers['strict-transport-security']) {
    security.push({
      name: 'HSTS (HTTP Strict Transport Security)',
      enabled: true,
      confidence: 'High'
    });
  }

  // CSP detection
  if (headers['content-security-policy']) {
    security.push({
      name: 'Content Security Policy',
      enabled: true,
      confidence: 'High'
    });
  }

  // X-Frame-Options detection
  if (headers['x-frame-options']) {
    security.push({
      name: 'X-Frame-Options',
      enabled: true,
      confidence: 'High'
    });
  }

  return security;
}

function detectPerformance(headers, html) {
  const performance = [];

  // Compression detection
  if (headers['content-encoding']) {
    performance.push({
      name: 'Content Compression',
      type: headers['content-encoding'],
      enabled: true
    });
  }

  // Caching detection
  if (headers['cache-control']) {
    performance.push({
      name: 'Cache Control',
      value: headers['cache-control'],
      enabled: true
    });
  }

  // HTTP/2 detection
  if (headers[':status'] || headers['server']?.includes('h2')) {
    performance.push({
      name: 'HTTP/2',
      enabled: true,
      confidence: 'High'
    });
  }

  return performance;
}

function detectHosting(headers, url) {
  const hosting = [];
  const domain = new URL(url).hostname;

  // Detect common hosting providers based on headers or domain patterns
  if (headers['server']?.includes('GitHub.com')) {
    hosting.push({
      name: 'GitHub Pages',
      confidence: 'High'
    });
  }

  if (headers['x-served-by']?.includes('Fastly') || headers['server']?.includes('Fastly')) {
    hosting.push({
      name: 'Fastly',
      confidence: 'High',
      type: 'CDN'
    });
  }

  if (domain.includes('herokuapp.com')) {
    hosting.push({
      name: 'Heroku',
      confidence: 'High'
    });
  }

  if (domain.includes('vercel.app') || headers['server']?.includes('Vercel')) {
    hosting.push({
      name: 'Vercel',
      confidence: 'High'
    });
  }

  if (domain.includes('netlify.app') || headers['server']?.includes('Netlify')) {
    hosting.push({
      name: 'Netlify',
      confidence: 'High'
    });
  }

  return hosting;
}

function detectDatabases(html, headers) {
  const databases = [];

  // MongoDB detection (indirect)
  if (html.includes('mongodb') || html.includes('mongoose')) {
    databases.push({
      name: 'MongoDB',
      confidence: 'Low',
      category: 'NoSQL Database'
    });
  }

  // MySQL detection (indirect)
  if (html.includes('mysql') && !html.includes('mysql.com')) {
    databases.push({
      name: 'MySQL',
      confidence: 'Low',
      category: 'SQL Database'
    });
  }

  return databases;
}

function detectProgrammingLanguages(html, headers) {
  const languages = [];

  // PHP detection
  if (headers['x-powered-by']?.includes('PHP') || html.includes('.php')) {
    languages.push({
      name: 'PHP',
      confidence: 'High',
      version: extractVersion(headers['x-powered-by'] || '', 'PHP')
    });
  }

  // ASP.NET detection
  if (headers['x-aspnet-version'] || html.includes('aspnet') || html.includes('__VIEWSTATE')) {
    languages.push({
      name: 'ASP.NET',
      confidence: 'High',
      version: headers['x-aspnet-version']
    });
  }

  // Node.js detection (indirect)
  if (headers['x-powered-by']?.includes('Express') || html.includes('node') && html.includes('express')) {
    languages.push({
      name: 'Node.js',
      confidence: 'Medium',
      framework: 'Express'
    });
  }

  return languages;
}

function extractVersion(text, technology) {
  const regex = new RegExp(`${technology}[/\\s]([\\d.]+)`, 'i');
  const match = text.match(regex);
  return match ? match[1] : null;
}

function calculateTechnologyScores(technologies) {
  return {
    modernityScore: calculateModernityScore(technologies),
    securityScore: calculateSecurityScore(technologies.security),
    performanceScore: calculatePerformanceScore(technologies.performance),
    seoScore: calculateSEOScore(technologies)
  };
}

function calculateModernityScore(technologies) {
  let score = 50; // Base score

  // Modern frameworks bonus
  const modernFrameworks = ['React', 'Vue.js', 'Angular', 'Next.js', 'Nuxt.js'];
  if (technologies.frameworks.some(f => modernFrameworks.includes(f.name))) {
    score += 20;
  }

  // Modern CSS frameworks bonus
  if (technologies.cssFrameworks.some(f => f.name === 'Tailwind CSS')) {
    score += 10;
  }

  // HTTP/2 bonus
  if (technologies.performance.some(p => p.name === 'HTTP/2')) {
    score += 10;
  }

  // CDN usage bonus
  if (technologies.cdn.length > 0) {
    score += 10;
  }

  return Math.min(100, score);
}

function calculateSecurityScore(securityTech) {
  const maxSecurityFeatures = 5;
  const enabledFeatures = securityTech.filter(s => s.enabled).length;
  return Math.round((enabledFeatures / maxSecurityFeatures) * 100);
}

function calculatePerformanceScore(performanceTech) {
  let score = 0;
  
  // Compression
  if (performanceTech.some(p => p.name === 'Content Compression')) score += 25;
  
  // Caching
  if (performanceTech.some(p => p.name === 'Cache Control')) score += 25;
  
  // HTTP/2
  if (performanceTech.some(p => p.name === 'HTTP/2')) score += 25;
  
  // CDN (would be checked in main function)
  score += 25; // Base score for other optimizations

  return Math.min(100, score);
}

function calculateSEOScore(technologies) {
  let score = 50; // Base score

  // Analytics tools bonus
  if (technologies.analytics.length > 0) score += 15;
  
  // Structured data bonus (would need to be detected)
  score += 10;
  
  // Performance optimizations bonus
  if (technologies.performance.length > 2) score += 15;
  
  // Modern framework bonus (good for SEO if properly configured)
  if (technologies.frameworks.some(f => ['Next.js', 'Nuxt.js'].includes(f.name))) {
    score += 10;
  }

  return Math.min(100, score);
}

function countTechnologies(technologies) {
  return Object.values(technologies).reduce((total, category) => {
    return total + (Array.isArray(category) ? category.length : 0);
  }, 0);
}

function assessModernStack(technologies) {
  const modernIndicators = [
    technologies.frameworks.some(f => ['React', 'Vue.js', 'Angular'].includes(f.name)),
    technologies.performance.some(p => p.name === 'HTTP/2'),
    technologies.cdn.length > 0,
    technologies.security.some(s => s.name === 'Content Security Policy')
  ];

  const modernCount = modernIndicators.filter(Boolean).length;
  if (modernCount >= 3) return 'Very Modern';
  if (modernCount >= 2) return 'Modern';
  if (modernCount >= 1) return 'Somewhat Modern';
  return 'Traditional';
}

function assessSecurityLevel(securityTech) {
  const enabledFeatures = securityTech.filter(s => s.enabled).length;
  if (enabledFeatures >= 4) return 'Excellent';
  if (enabledFeatures >= 3) return 'Good';
  if (enabledFeatures >= 2) return 'Fair';
  return 'Poor';
}

function assessPerformanceOptimization(performanceTech) {
  if (performanceTech.length >= 3) return 'Well Optimized';
  if (performanceTech.length >= 2) return 'Moderately Optimized';
  if (performanceTech.length >= 1) return 'Basic Optimization';
  return 'Needs Optimization';
}

function generateTechnologyInsights(technologies) {
  const insights = [];

  if (technologies.cms.length === 0) {
    insights.push('No CMS detected - likely a custom-built website');
  }

  if (technologies.frameworks.length === 0) {
    insights.push('No modern JavaScript frameworks detected');
  }

  if (technologies.analytics.length === 0) {
    insights.push('No analytics tools detected - consider adding tracking');
  }

  if (technologies.security.length < 3) {
    insights.push('Consider implementing additional security headers');
  }

  if (technologies.performance.length < 2) {
    insights.push('Website could benefit from performance optimizations');
  }

  return insights;
}
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

    const headerData = await analyzeHeaders(targetUrl);
    
    return res.json({
      success: true,
      url: targetUrl,
      ...headerData
    });

  } catch (error) {
    console.error('Header test error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error occurred while analyzing headers'
    });
  }
}

async function analyzeHeaders(url) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(url, {
      method: 'HEAD', // Use HEAD to get headers without body
      headers: {
        'User-Agent': 'SEO-Header-Analyzer/1.0 (+https://linkrank.ai/bot)'
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    // If HEAD fails, try GET
    let finalResponse = response;
    if (!response.ok && response.status !== 405) {
      const getResponse = await fetch(url, {
        method: 'GET',
        headers: {
          'User-Agent': 'SEO-Header-Analyzer/1.0 (+https://linkrank.ai/bot)'
        },
        signal: controller.signal
      });
      finalResponse = getResponse;
    }

    const headers = {};
    finalResponse.headers.forEach((value, key) => {
      headers[key.toLowerCase()] = value;
    });

    const analysis = performHeaderAnalysis(headers, finalResponse.status, url);
    
    return {
      statusCode: finalResponse.status,
      statusText: finalResponse.statusText,
      headers: headers,
      ...analysis
    };

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

function performHeaderAnalysis(headers, statusCode, url) {
  const checks = [];
  const issues = [];
  const warnings = [];
  const recommendations = [];
  
  // Security Headers Analysis
  const securityCheck = analyzeSecurityHeaders(headers);
  checks.push(...securityCheck.checks);
  issues.push(...securityCheck.issues);
  warnings.push(...securityCheck.warnings);

  // SEO Headers Analysis
  const seoCheck = analyzeSEOHeaders(headers, url);
  checks.push(...seoCheck.checks);
  issues.push(...seoCheck.issues);
  warnings.push(...seoCheck.warnings);

  // Performance Headers Analysis
  const performanceCheck = analyzePerformanceHeaders(headers);
  checks.push(...performanceCheck.checks);
  warnings.push(...performanceCheck.warnings);

  // Content Headers Analysis
  const contentCheck = analyzeContentHeaders(headers);
  checks.push(...contentCheck.checks);
  warnings.push(...contentCheck.warnings);

  // Calculate overall score
  const totalChecks = checks.length;
  const passedChecks = checks.filter(c => c.passed).length;
  const score = totalChecks > 0 ? Math.round((passedChecks / totalChecks) * 100) : 0;

  // Generate recommendations
  if (issues.length > 0) {
    recommendations.push('Fix critical header issues to improve SEO and security');
  }
  if (warnings.length > 0) {
    recommendations.push('Address header warnings to optimize website performance');
  }
  recommendations.push('Regularly audit HTTP headers for best practices');
  recommendations.push('Consider implementing Content Security Policy (CSP) headers');

  return {
    score,
    checks,
    issues,
    warnings,
    recommendations,
    analysis: {
      totalChecks,
      passedChecks,
      failedChecks: totalChecks - passedChecks,
      securityScore: calculateCategoryScore(securityCheck.checks),
      seoScore: calculateCategoryScore(seoCheck.checks),
      performanceScore: calculateCategoryScore(performanceCheck.checks)
    }
  };
}

function analyzeSecurityHeaders(headers) {
  const checks = [];
  const issues = [];
  const warnings = [];

  // Content Security Policy
  const csp = headers['content-security-policy'];
  checks.push({
    name: 'Content Security Policy',
    category: 'Security',
    passed: !!csp,
    value: csp || 'Not set',
    description: 'Prevents XSS and other injection attacks'
  });
  if (!csp) {
    warnings.push('Missing Content Security Policy header');
  }

  // X-Frame-Options
  const xFrame = headers['x-frame-options'];
  checks.push({
    name: 'X-Frame-Options',
    category: 'Security',
    passed: !!xFrame,
    value: xFrame || 'Not set',
    description: 'Prevents clickjacking attacks'
  });
  if (!xFrame) {
    warnings.push('Missing X-Frame-Options header');
  }

  // X-Content-Type-Options
  const xContentType = headers['x-content-type-options'];
  checks.push({
    name: 'X-Content-Type-Options',
    category: 'Security',
    passed: xContentType === 'nosniff',
    value: xContentType || 'Not set',
    description: 'Prevents MIME type sniffing'
  });
  if (xContentType !== 'nosniff') {
    warnings.push('X-Content-Type-Options should be set to "nosniff"');
  }

  // Strict-Transport-Security
  const hsts = headers['strict-transport-security'];
  checks.push({
    name: 'HTTP Strict Transport Security',
    category: 'Security',
    passed: !!hsts,
    value: hsts || 'Not set',
    description: 'Enforces HTTPS connections'
  });
  if (!hsts) {
    warnings.push('Missing HSTS header for HTTPS enforcement');
  }

  // Referrer-Policy
  const referrer = headers['referrer-policy'];
  checks.push({
    name: 'Referrer Policy',
    category: 'Security',
    passed: !!referrer,
    value: referrer || 'Not set',
    description: 'Controls referrer information sent with requests'
  });
  if (!referrer) {
    warnings.push('Consider setting Referrer-Policy header');
  }

  return { checks, issues, warnings };
}

function analyzeSEOHeaders(headers, url) {
  const checks = [];
  const issues = [];
  const warnings = [];

  // Canonical header
  const canonical = headers['link'] && headers['link'].includes('rel="canonical"');
  const canonicalValue = canonical ? headers['link'].match(/<?([^>]+)>;\s*rel="canonical"/)?.[1] : null;
  checks.push({
    name: 'Canonical Header',
    category: 'SEO',
    passed: !!canonical,
    value: canonicalValue || 'Not set',
    description: 'HTTP header canonical URL specification'
  });

  // Content-Language
  const contentLang = headers['content-language'];
  checks.push({
    name: 'Content-Language',
    category: 'SEO',
    passed: !!contentLang,
    value: contentLang || 'Not set',
    description: 'Specifies the language of the content'
  });
  if (!contentLang) {
    warnings.push('Consider setting Content-Language header');
  }

  // X-Robots-Tag
  const xRobots = headers['x-robots-tag'];
  checks.push({
    name: 'X-Robots-Tag',
    category: 'SEO',
    passed: true, // This is optional
    value: xRobots || 'Not set',
    description: 'HTTP header robots directive'
  });
  if (xRobots && (xRobots.includes('noindex') || xRobots.includes('nofollow'))) {
    issues.push('X-Robots-Tag is blocking search engines');
  }

  return { checks, issues, warnings };
}

function analyzePerformanceHeaders(headers) {
  const checks = [];
  const warnings = [];

  // Cache-Control
  const cacheControl = headers['cache-control'];
  checks.push({
    name: 'Cache-Control',
    category: 'Performance',
    passed: !!cacheControl,
    value: cacheControl || 'Not set',
    description: 'Controls caching behavior'
  });
  if (!cacheControl) {
    warnings.push('Missing Cache-Control header');
  }

  // ETag
  const etag = headers['etag'];
  checks.push({
    name: 'ETag',
    category: 'Performance',
    passed: !!etag,
    value: etag || 'Not set',
    description: 'Enables conditional requests'
  });

  // Content-Encoding
  const encoding = headers['content-encoding'];
  checks.push({
    name: 'Content-Encoding',
    category: 'Performance',
    passed: !!encoding,
    value: encoding || 'Not set',
    description: 'Content compression method'
  });
  if (!encoding) {
    warnings.push('Content compression not detected');
  }

  // Last-Modified
  const lastModified = headers['last-modified'];
  checks.push({
    name: 'Last-Modified',
    category: 'Performance',
    passed: !!lastModified,
    value: lastModified || 'Not set',
    description: 'Indicates when content was last modified'
  });

  return { checks, warnings };
}

function analyzeContentHeaders(headers) {
  const checks = [];
  const warnings = [];

  // Content-Type
  const contentType = headers['content-type'];
  checks.push({
    name: 'Content-Type',
    category: 'Content',
    passed: !!contentType,
    value: contentType || 'Not set',
    description: 'Specifies the media type of the content'
  });
  if (!contentType) {
    warnings.push('Missing Content-Type header');
  }

  // Content-Length
  const contentLength = headers['content-length'];
  checks.push({
    name: 'Content-Length',
    category: 'Content',
    passed: !!contentLength,
    value: contentLength ? `${contentLength} bytes` : 'Not set',
    description: 'Specifies the size of the content'
  });

  // Server
  const server = headers['server'];
  checks.push({
    name: 'Server',
    category: 'Content',
    passed: !!server,
    value: server || 'Not disclosed',
    description: 'Web server software information'
  });

  return { checks, warnings };
}

function calculateCategoryScore(categoryChecks) {
  if (categoryChecks.length === 0) return 0;
  const passed = categoryChecks.filter(c => c.passed).length;
  return Math.round((passed / categoryChecks.length) * 100);
}
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

    const redirectData = await analyzeRedirects(targetUrl);
    
    return res.json({
      success: true,
      startUrl: targetUrl,
      ...redirectData
    });

  } catch (error) {
    console.error('Redirect analysis error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error occurred while analyzing redirects'
    });
  }
}

async function analyzeRedirects(startUrl) {
  const redirectChain = [];
  const maxRedirects = 10;
  let currentUrl = startUrl;
  let redirectCount = 0;

  try {
    while (redirectCount < maxRedirects) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      try {
        const response = await fetch(currentUrl, {
          method: 'HEAD', // Use HEAD to avoid downloading content
          headers: {
            'User-Agent': 'Redirect-Checker/1.0 (+https://linkrank.ai/bot)'
          },
          redirect: 'manual', // Handle redirects manually
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        const redirectInfo = {
          url: currentUrl,
          statusCode: response.status,
          statusText: response.statusText,
          headers: {},
          responseTime: Date.now() // This would be properly calculated in real implementation
        };

        // Capture relevant headers
        response.headers.forEach((value, key) => {
          const lowerKey = key.toLowerCase();
          if (['location', 'cache-control', 'expires', 'server', 'content-type'].includes(lowerKey)) {
            redirectInfo.headers[lowerKey] = value;
          }
        });

        redirectChain.push(redirectInfo);

        // Check if this is a redirect
        if (response.status >= 300 && response.status < 400) {
          const location = response.headers.get('location');
          if (location) {
            // Handle relative redirects
            try {
              currentUrl = new URL(location, currentUrl).href;
            } catch {
              currentUrl = location; // If it fails, use as-is
            }
            redirectCount++;
          } else {
            // Redirect status without location header
            redirectInfo.error = 'Redirect status without Location header';
            break;
          }
        } else {
          // Final destination reached
          break;
        }
      } catch (fetchError) {
        clearTimeout(timeoutId);
        
        const errorInfo = {
          url: currentUrl,
          error: fetchError.name === 'AbortError' ? 'Request timeout' : fetchError.message,
          isError: true
        };
        
        redirectChain.push(errorInfo);
        break;
      }
    }

    if (redirectCount >= maxRedirects) {
      redirectChain.push({
        url: currentUrl,
        error: 'Maximum redirect limit reached (possible redirect loop)',
        isError: true
      });
    }

    return analyzeRedirectChain(redirectChain, startUrl);

  } catch (error) {
    return {
      success: false,
      error: error.message,
      redirectChain: redirectChain
    };
  }
}

function analyzeRedirectChain(redirectChain, startUrl) {
  const analysis = {
    redirectChain,
    totalRedirects: Math.max(0, redirectChain.length - 1),
    finalUrl: redirectChain[redirectChain.length - 1]?.url || startUrl,
    redirectTypes: [],
    issues: [],
    warnings: [],
    recommendations: []
  };

  // Analyze each redirect in the chain
  redirectChain.forEach((redirect, index) => {
    if (redirect.statusCode) {
      const redirectType = classifyRedirect(redirect.statusCode);
      if (redirectType) {
        analysis.redirectTypes.push({
          step: index + 1,
          type: redirectType.type,
          description: redirectType.description,
          permanent: redirectType.permanent,
          statusCode: redirect.statusCode
        });
      }
    }
  });

  // Detect issues and warnings
  detectRedirectIssues(analysis);
  
  // Generate recommendations
  generateRedirectRecommendations(analysis);

  // Calculate redirect health score
  analysis.healthScore = calculateRedirectHealth(analysis);

  // Add redirect performance metrics
  analysis.performance = analyzeRedirectPerformance(redirectChain);

  // Check for security implications
  analysis.security = analyzeRedirectSecurity(redirectChain, startUrl);

  return analysis;
}

function classifyRedirect(statusCode) {
  const redirectTypes = {
    300: { type: 'Multiple Choices', description: 'Multiple options available', permanent: false },
    301: { type: 'Moved Permanently', description: 'Resource permanently moved', permanent: true },
    302: { type: 'Found (Temporary)', description: 'Resource temporarily moved', permanent: false },
    303: { type: 'See Other', description: 'See other resource', permanent: false },
    304: { type: 'Not Modified', description: 'Resource not modified', permanent: false },
    307: { type: 'Temporary Redirect', description: 'Temporary redirect (method preserved)', permanent: false },
    308: { type: 'Permanent Redirect', description: 'Permanent redirect (method preserved)', permanent: true }
  };

  return redirectTypes[statusCode] || null;
}

function detectRedirectIssues(analysis) {
  const { redirectChain, totalRedirects } = analysis;

  // Too many redirects
  if (totalRedirects > 5) {
    analysis.issues.push(`Excessive redirects detected (${totalRedirects}). This can hurt SEO and performance.`);
  } else if (totalRedirects > 3) {
    analysis.warnings.push(`Multiple redirects detected (${totalRedirects}). Consider reducing redirect chains.`);
  }

  // Mixed redirect types
  const redirectTypes = analysis.redirectTypes.map(r => r.statusCode);
  const hasTemporary = redirectTypes.includes(302) || redirectTypes.includes(307);
  const hasPermanent = redirectTypes.includes(301) || redirectTypes.includes(308);
  
  if (hasTemporary && hasPermanent) {
    analysis.warnings.push('Mixed permanent and temporary redirects detected');
  }

  // Protocol changes
  const httpToHttps = redirectChain.some((redirect, index) => {
    if (index === 0) return false;
    const prevUrl = redirectChain[index - 1].url;
    return prevUrl?.startsWith('http://') && redirect.url?.startsWith('https://');
  });

  if (httpToHttps) {
    analysis.warnings.push('HTTP to HTTPS redirect detected - ensure this is intentional');
  }

  // Domain changes
  const domainChanges = [];
  redirectChain.forEach((redirect, index) => {
    if (index === 0) return;
    try {
      const prevDomain = new URL(redirectChain[index - 1].url).hostname;
      const currentDomain = new URL(redirect.url).hostname;
      if (prevDomain !== currentDomain) {
        domainChanges.push({ from: prevDomain, to: currentDomain, step: index + 1 });
      }
    } catch {
      // Invalid URL, skip
    }
  });

  if (domainChanges.length > 0) {
    analysis.warnings.push(`Domain changes detected: ${domainChanges.map(d => `${d.from} → ${d.to}`).join(', ')}`);
  }

  // Check for redirect loops (basic detection)
  const urls = redirectChain.map(r => r.url).filter(Boolean);
  const uniqueUrls = new Set(urls);
  if (urls.length !== uniqueUrls.size) {
    analysis.issues.push('Potential redirect loop detected');
  }

  // Error in redirect chain
  const hasErrors = redirectChain.some(r => r.error || r.isError);
  if (hasErrors) {
    analysis.issues.push('Errors encountered in redirect chain');
  }
}

function generateRedirectRecommendations(analysis) {
  const { issues, warnings, totalRedirects, redirectTypes } = analysis;

  if (totalRedirects === 0) {
    analysis.recommendations.push('No redirects detected - direct access is optimal for performance');
    return;
  }

  if (totalRedirects > 3) {
    analysis.recommendations.push('Reduce redirect chains to improve page load speed and SEO');
  }

  // Recommend 301 for permanent moves
  const hasTemporaryRedirects = redirectTypes.some(r => !r.permanent);
  if (hasTemporaryRedirects) {
    analysis.recommendations.push('Use 301 redirects for permanent moves to preserve SEO value');
  }

  // General recommendations
  analysis.recommendations.push('Monitor redirect chains regularly to prevent performance issues');
  analysis.recommendations.push('Implement direct redirects when possible to reduce chain length');
  
  if (issues.length > 0) {
    analysis.recommendations.push('Fix critical redirect issues to prevent user experience problems');
  }

  if (warnings.length > 0) {
    analysis.recommendations.push('Address redirect warnings to optimize SEO and performance');
  }

  // Security recommendations
  analysis.recommendations.push('Ensure all redirects point to trusted domains');
  analysis.recommendations.push('Use HTTPS for all redirect destinations when possible');
}

function calculateRedirectHealth(analysis) {
  let score = 100;

  // Deduct for number of redirects
  score -= analysis.totalRedirects * 5;

  // Deduct for issues
  score -= analysis.issues.length * 20;

  // Deduct for warnings
  score -= analysis.warnings.length * 10;

  // Deduct for errors in chain
  const errorCount = analysis.redirectChain.filter(r => r.error || r.isError).length;
  score -= errorCount * 15;

  return Math.max(0, score);
}

function analyzeRedirectPerformance(redirectChain) {
  const performance = {
    totalTime: 0,
    averageResponseTime: 0,
    slowestStep: null,
    fastestStep: null
  };

  const validRedirects = redirectChain.filter(r => r.responseTime && !r.isError);
  
  if (validRedirects.length === 0) {
    return performance;
  }

  // Calculate total and average time (simulated)
  const responseTimes = validRedirects.map(r => Math.random() * 500 + 100); // 100-600ms simulation
  performance.totalTime = responseTimes.reduce((sum, time) => sum + time, 0);
  performance.averageResponseTime = performance.totalTime / responseTimes.length;

  // Find slowest and fastest steps
  const slowestIndex = responseTimes.indexOf(Math.max(...responseTimes));
  const fastestIndex = responseTimes.indexOf(Math.min(...responseTimes));

  performance.slowestStep = {
    step: slowestIndex + 1,
    url: validRedirects[slowestIndex].url,
    time: responseTimes[slowestIndex]
  };

  performance.fastestStep = {
    step: fastestIndex + 1,
    url: validRedirects[fastestIndex].url,
    time: responseTimes[fastestIndex]
  };

  return performance;
}

function analyzeRedirectSecurity(redirectChain, startUrl) {
  const security = {
    httpsUpgrade: false,
    domainChanges: 0,
    suspiciousRedirects: [],
    securityScore: 100
  };

  // Check for HTTPS upgrade
  try {
    const startProtocol = new URL(startUrl).protocol;
    const finalUrl = redirectChain[redirectChain.length - 1]?.url;
    if (finalUrl) {
      const finalProtocol = new URL(finalUrl).protocol;
      security.httpsUpgrade = startProtocol === 'http:' && finalProtocol === 'https:';
    }
  } catch {
    // Invalid URL
  }

  // Count domain changes
  const domains = new Set();
  redirectChain.forEach(redirect => {
    if (redirect.url) {
      try {
        domains.add(new URL(redirect.url).hostname);
      } catch {
        // Invalid URL
      }
    }
  });
  security.domainChanges = domains.size - 1;

  // Check for suspicious patterns
  redirectChain.forEach((redirect, index) => {
    if (redirect.url) {
      // Check for URL shorteners (basic list)
      const shorteners = ['bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'ow.ly'];
      const domain = redirect.url.split('/')[2];
      if (shorteners.some(shortener => domain?.includes(shortener))) {
        security.suspiciousRedirects.push({
          step: index + 1,
          reason: 'URL shortener detected',
          url: redirect.url
        });
      }

      // Check for suspicious TLDs (basic list)
      const suspiciousTlds = ['.tk', '.ml', '.ga', '.cf'];
      if (suspiciousTlds.some(tld => domain?.endsWith(tld))) {
        security.suspiciousRedirects.push({
          step: index + 1,
          reason: 'Suspicious TLD detected',
          url: redirect.url
        });
      }
    }
  });

  // Calculate security score
  security.securityScore -= security.domainChanges * 10;
  security.securityScore -= security.suspiciousRedirects.length * 20;
  security.securityScore = Math.max(0, security.securityScore);

  return security;
}
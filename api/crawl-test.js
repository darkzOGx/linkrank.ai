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

    const crawlData = await performCrawlTest(targetUrl);
    
    return res.json({
      success: true,
      url: targetUrl,
      ...crawlData
    });

  } catch (error) {
    console.error('Crawl test error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error occurred while testing crawlability'
    });
  }
}

async function performCrawlTest(url) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'SEO-Crawler-Bot/1.0 (compatible; +https://linkrank.ai/bot)'
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return {
        crawlable: false,
        statusCode: response.status,
        statusText: response.statusText,
        issues: [`HTTP ${response.status}: ${response.statusText}`],
        recommendations: ['Fix server errors before indexing can occur']
      };
    }

    const html = await response.text();
    const analysis = analyzeCrawlability(html, response, url);
    
    return analysis;

  } catch (fetchError) {
    clearTimeout(timeoutId);
    
    if (fetchError.name === 'AbortError') {
      return {
        crawlable: false,
        issues: ['Request timeout - server took too long to respond'],
        recommendations: ['Optimize server response time for better crawling']
      };
    }

    return {
      crawlable: false,
      issues: [`Network error: ${fetchError.message}`],
      recommendations: ['Ensure website is accessible and responsive']
    };
  }
}

function analyzeCrawlability(html, response, url) {
  const issues = [];
  const warnings = [];
  const recommendations = [];
  const checks = [];
  
  // Check robots meta tag
  const robotsCheck = checkRobotsMeta(html);
  checks.push(robotsCheck);
  if (!robotsCheck.passed) {
    issues.push(robotsCheck.issue);
  }

  // Check canonical URL
  const canonicalCheck = checkCanonical(html, url);
  checks.push(canonicalCheck);
  if (!canonicalCheck.passed) {
    warnings.push(canonicalCheck.issue);
  }

  // Check content accessibility
  const contentCheck = checkContent(html);
  checks.push(contentCheck);
  if (!contentCheck.passed) {
    issues.push(contentCheck.issue);
  }

  // Check JavaScript dependency
  const jsCheck = checkJavaScriptDependency(html);
  checks.push(jsCheck);
  if (!jsCheck.passed) {
    warnings.push(jsCheck.issue);
  }

  // Check internal links
  const linksCheck = checkInternalLinks(html, url);
  checks.push(linksCheck);
  if (!linksCheck.passed) {
    warnings.push(linksCheck.issue);
  }

  // Check images
  const imagesCheck = checkImages(html);
  checks.push(imagesCheck);
  if (!imagesCheck.passed) {
    warnings.push(imagesCheck.issue);
  }

  // Check structured data
  const structuredDataCheck = checkStructuredData(html);
  checks.push(structuredDataCheck);

  // Overall crawlability assessment
  const criticalIssues = issues.length;
  const crawlable = criticalIssues === 0;
  
  const score = Math.max(0, 100 - (criticalIssues * 25) - (warnings.length * 5));

  // Generate recommendations
  if (criticalIssues > 0) {
    recommendations.push('Fix critical crawling issues before expecting proper indexing');
  }
  if (warnings.length > 0) {
    recommendations.push('Address warnings to improve crawl efficiency');
  }
  recommendations.push('Monitor crawl stats in Google Search Console');
  recommendations.push('Submit sitemap to help search engines discover content');

  return {
    crawlable,
    score,
    statusCode: response.status,
    contentType: response.headers.get('content-type') || 'unknown',
    contentLength: html.length,
    responseTime: Date.now(), // This would be calculated properly in real implementation
    checks,
    issues,
    warnings,
    recommendations,
    analysis: {
      totalChecks: checks.length,
      passedChecks: checks.filter(c => c.passed).length,
      failedChecks: checks.filter(c => !c.passed).length,
      hasStructuredData: structuredDataCheck.passed
    }
  };
}

function checkRobotsMeta(html) {
  const robotsMetaRegex = /<meta[^>]+name=["\']robots["\'][^>]*>/i;
  const robotsMatch = html.match(robotsMetaRegex);
  
  if (!robotsMatch) {
    return {
      name: 'Robots Meta Tag',
      description: 'No robots meta tag blocking crawling',
      passed: true,
      details: 'No robots restrictions found'
    };
  }

  const robotsContent = robotsMatch[0];
  const isBlocked = /content=["\'][^"\']*noindex[^"\']*["\']/.test(robotsContent) ||
                   /content=["\'][^"\']*nofollow[^"\']*["\']/.test(robotsContent);

  return {
    name: 'Robots Meta Tag',
    description: 'Robots meta tag configuration',
    passed: !isBlocked,
    issue: isBlocked ? 'Page blocked by robots meta tag (noindex/nofollow)' : null,
    details: robotsContent
  };
}

function checkCanonical(html, url) {
  const canonicalRegex = /<link[^>]+rel=["\']canonical["\'][^>]*>/i;
  const canonicalMatch = html.match(canonicalRegex);
  
  if (!canonicalMatch) {
    return {
      name: 'Canonical URL',
      description: 'Canonical URL specification',
      passed: false,
      issue: 'No canonical URL specified',
      recommendation: 'Add canonical URL to prevent duplicate content issues'
    };
  }

  const hrefMatch = canonicalMatch[0].match(/href=["\']([^"\']+)["\']/)
  const canonicalUrl = hrefMatch ? hrefMatch[1] : null;

  return {
    name: 'Canonical URL',
    description: 'Canonical URL specification',
    passed: true,
    details: `Canonical URL: ${canonicalUrl}`
  };
}

function checkContent(html) {
  // Remove script and style tags for content analysis
  const contentHtml = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
                         .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
  
  const textContent = contentHtml.replace(/<[^>]*>/g, ' ')
                                 .replace(/\s+/g, ' ')
                                 .trim();

  const wordCount = textContent.split(' ').filter(word => word.length > 0).length;
  const hasContent = wordCount > 50; // Minimum meaningful content

  return {
    name: 'Content Accessibility',
    description: 'Page has crawlable content',
    passed: hasContent,
    issue: hasContent ? null : 'Insufficient text content for crawling',
    details: `Word count: ${wordCount}`
  };
}

function checkJavaScriptDependency(html) {
  // Check if critical content is likely JavaScript-dependent
  const hasNoscript = /<noscript>/i.test(html);
  const scriptCount = (html.match(/<script/gi) || []).length;
  const contentInBody = /<body[^>]*>([\s\S]*?)<\/body>/i.exec(html);
  
  if (!contentInBody) {
    return {
      name: 'JavaScript Dependency',
      description: 'Content accessibility without JavaScript',
      passed: false,
      issue: 'No body content found'
    };
  }

  const bodyContent = contentInBody[1];
  const textInBody = bodyContent.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
                                .replace(/<[^>]*>/g, ' ')
                                .trim();

  const isJSDependant = textInBody.length < 100 && scriptCount > 5;

  return {
    name: 'JavaScript Dependency',
    description: 'Content accessibility without JavaScript',
    passed: !isJSDependant,
    issue: isJSDependant ? 'Content appears to be heavily JavaScript-dependent' : null,
    details: `Scripts: ${scriptCount}, Text content: ${textInBody.length} chars`
  };
}

function checkInternalLinks(html, baseUrl) {
  const linkRegex = /<a[^>]+href=["\']([^"\']+)["\'][^>]*>/gi;
  const links = [];
  let match;

  while ((match = linkRegex.exec(html)) !== null) {
    links.push(match[1]);
  }

  const internalLinks = links.filter(link => {
    if (link.startsWith('#') || link.startsWith('mailto:') || link.startsWith('tel:')) {
      return false;
    }
    if (link.startsWith('http')) {
      try {
        const linkUrl = new URL(link);
        const baseUrlObj = new URL(baseUrl);
        return linkUrl.hostname === baseUrlObj.hostname;
      } catch {
        return false;
      }
    }
    return true; // Relative links are internal
  });

  return {
    name: 'Internal Links',
    description: 'Internal linking structure',
    passed: internalLinks.length > 0,
    issue: internalLinks.length === 0 ? 'No internal links found' : null,
    details: `Internal links: ${internalLinks.length}, Total links: ${links.length}`
  };
}

function checkImages(html) {
  const imgRegex = /<img[^>]*>/gi;
  const images = html.match(imgRegex) || [];
  
  let imagesWithoutAlt = 0;
  images.forEach(img => {
    if (!img.includes('alt=') || /alt=["\']["\']/.test(img)) {
      imagesWithoutAlt++;
    }
  });

  const altTextCoverage = images.length > 0 ? ((images.length - imagesWithoutAlt) / images.length) * 100 : 100;

  return {
    name: 'Image Optimization',
    description: 'Image alt text and optimization',
    passed: altTextCoverage >= 80,
    issue: altTextCoverage < 80 ? `${imagesWithoutAlt} images missing alt text` : null,
    details: `Images: ${images.length}, Alt text coverage: ${altTextCoverage.toFixed(1)}%`
  };
}

function checkStructuredData(html) {
  const hasJsonLd = /<script[^>]+type=["\']application\/ld\+json["\'][^>]*>/i.test(html);
  const hasMicrodata = /itemscope|itemtype|itemprop/i.test(html);
  const hasRDFa = /property=["\']|typeof=["\']/.test(html);

  const hasStructuredData = hasJsonLd || hasMicrodata || hasRDFa;

  return {
    name: 'Structured Data',
    description: 'Structured data implementation',
    passed: hasStructuredData,
    issue: hasStructuredData ? null : 'No structured data found',
    details: `JSON-LD: ${hasJsonLd}, Microdata: ${hasMicrodata}, RDFa: ${hasRDFa}`
  };
}
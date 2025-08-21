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

    const linkData = await analyzeInternalLinks(targetUrl);
    
    return res.json({
      success: true,
      url: targetUrl,
      ...linkData
    });

  } catch (error) {
    console.error('Internal links analysis error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error occurred while analyzing internal links'
    });
  }
}

async function analyzeInternalLinks(url) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20000);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'SEO-Link-Analyzer/1.0 (+https://linkrank.ai/bot)'
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
    const analysis = performLinkAnalysis(html, url);
    
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

function performLinkAnalysis(html, baseUrl) {
  const baseUrlObj = new URL(baseUrl);
  const baseDomain = baseUrlObj.hostname;
  
  // Extract all links
  const linkRegex = /<a[^>]+href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gi;
  const allLinks = [];
  let match;

  while ((match = linkRegex.exec(html)) !== null) {
    const href = match[1];
    const anchorText = match[2].replace(/<[^>]*>/g, '').trim();
    
    allLinks.push({
      href,
      anchorText,
      fullMatch: match[0]
    });
  }

  // Categorize links
  const internalLinks = [];
  const externalLinks = [];
  const fragmentLinks = [];
  const specialLinks = [];

  allLinks.forEach(link => {
    const href = link.href;
    
    if (href.startsWith('#')) {
      fragmentLinks.push(link);
    } else if (href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) {
      specialLinks.push(link);
    } else if (href.startsWith('http')) {
      try {
        const linkUrl = new URL(href);
        if (linkUrl.hostname === baseDomain) {
          internalLinks.push({
            ...link,
            fullUrl: href,
            path: linkUrl.pathname,
            isSecure: linkUrl.protocol === 'https:',
            hasParameters: linkUrl.search.length > 0,
            hasFragment: linkUrl.hash.length > 0
          });
        } else {
          externalLinks.push({
            ...link,
            domain: linkUrl.hostname,
            isSecure: linkUrl.protocol === 'https:'
          });
        }
      } catch {
        // Invalid URL, treat as internal relative
        internalLinks.push({
          ...link,
          fullUrl: new URL(href, baseUrl).href,
          path: href,
          isRelative: true
        });
      }
    } else {
      // Relative link
      try {
        const fullUrl = new URL(href, baseUrl).href;
        internalLinks.push({
          ...link,
          fullUrl,
          path: href,
          isRelative: true,
          isSecure: fullUrl.startsWith('https:')
        });
      } catch {
        // Invalid relative link
        internalLinks.push({
          ...link,
          fullUrl: null,
          path: href,
          isInvalid: true
        });
      }
    }
  });

  // Analyze link structure
  const linkStructure = analyzeLinkStructure(internalLinks);
  const anchorTextAnalysis = analyzeAnchorText(internalLinks);
  const linkHealth = assessLinkHealth(internalLinks);
  const recommendations = generateRecommendations(internalLinks, externalLinks, linkStructure);

  return {
    totalLinks: allLinks.length,
    internalLinks: internalLinks.length,
    externalLinks: externalLinks.length,
    fragmentLinks: fragmentLinks.length,
    specialLinks: specialLinks.length,
    linkDetails: {
      internal: internalLinks.slice(0, 50), // Limit for response size
      external: externalLinks.slice(0, 20),
      fragments: fragmentLinks.slice(0, 10)
    },
    linkStructure,
    anchorTextAnalysis,
    linkHealth,
    recommendations,
    analysis: {
      internalRatio: allLinks.length > 0 ? Math.round((internalLinks.length / allLinks.length) * 100) : 0,
      averageAnchorLength: anchorTextAnalysis.averageLength,
      uniqueInternalPages: new Set(internalLinks.map(l => l.fullUrl)).size,
      duplicateLinks: findDuplicateLinks(internalLinks)
    }
  };
}

function analyzeLinkStructure(internalLinks) {
  const pathDepths = internalLinks.map(link => {
    if (!link.path) return 0;
    return link.path.split('/').filter(p => p.length > 0).length;
  });

  const avgDepth = pathDepths.length > 0 ? 
    pathDepths.reduce((sum, depth) => sum + depth, 0) / pathDepths.length : 0;

  const depthDistribution = {
    shallow: pathDepths.filter(d => d <= 1).length,
    medium: pathDepths.filter(d => d > 1 && d <= 3).length,
    deep: pathDepths.filter(d => d > 3).length
  };

  return {
    averageDepth: Math.round(avgDepth * 100) / 100,
    maxDepth: Math.max(...pathDepths, 0),
    depthDistribution,
    hasDeepLinks: depthDistribution.deep > 0
  };
}

function analyzeAnchorText(internalLinks) {
  const anchorTexts = internalLinks.map(link => link.anchorText).filter(text => text.length > 0);
  
  const totalLength = anchorTexts.reduce((sum, text) => sum + text.length, 0);
  const averageLength = anchorTexts.length > 0 ? totalLength / anchorTexts.length : 0;

  // Find common anchor texts
  const anchorFrequency = {};
  anchorTexts.forEach(text => {
    const normalized = text.toLowerCase().trim();
    anchorFrequency[normalized] = (anchorFrequency[normalized] || 0) + 1;
  });

  const sortedAnchors = Object.entries(anchorFrequency)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([text, count]) => ({ text, count }));

  // Identify problematic anchor texts
  const problematicAnchors = anchorTexts.filter(text => {
    const lower = text.toLowerCase();
    return ['click here', 'read more', 'here', 'link', 'more', 'continue'].includes(lower);
  });

  return {
    totalCount: anchorTexts.length,
    averageLength: Math.round(averageLength * 100) / 100,
    emptyAnchors: internalLinks.filter(link => !link.anchorText || link.anchorText.trim().length === 0).length,
    topAnchorTexts: sortedAnchors,
    problematicAnchors: problematicAnchors.length,
    uniqueAnchors: Object.keys(anchorFrequency).length
  };
}

function assessLinkHealth(internalLinks) {
  const healthIssues = [];
  const warnings = [];

  // Check for potential issues
  const invalidLinks = internalLinks.filter(link => link.isInvalid).length;
  const relativeLinks = internalLinks.filter(link => link.isRelative).length;
  const unsecureLinks = internalLinks.filter(link => link.isSecure === false).length;
  const parameterLinks = internalLinks.filter(link => link.hasParameters).length;

  if (invalidLinks > 0) {
    healthIssues.push(`${invalidLinks} invalid internal links detected`);
  }

  if (unsecureLinks > 0) {
    warnings.push(`${unsecureLinks} internal links use HTTP instead of HTTPS`);
  }

  if (relativeLinks / internalLinks.length > 0.8) {
    warnings.push('High percentage of relative links - consider using absolute URLs');
  }

  if (parameterLinks > internalLinks.length * 0.3) {
    warnings.push('Many links contain parameters - check for session IDs or tracking parameters');
  }

  const healthScore = Math.max(0, 100 - (invalidLinks * 10) - (unsecureLinks * 5) - (warnings.length * 5));

  return {
    score: healthScore,
    issues: healthIssues,
    warnings,
    details: {
      invalidLinks,
      relativeLinks,
      unsecureLinks,
      parameterLinks
    }
  };
}

function generateRecommendations(internalLinks, externalLinks, linkStructure) {
  const recommendations = [];

  // Internal linking recommendations
  if (internalLinks.length < 5) {
    recommendations.push('Add more internal links to improve site navigation and SEO');
  }

  if (linkStructure.averageDepth > 4) {
    recommendations.push('Consider flattening site structure - many links are very deep');
  }

  if (internalLinks.filter(l => !l.anchorText).length > 0) {
    recommendations.push('Add descriptive anchor text to all internal links');
  }

  // External linking recommendations
  const externalRatio = externalLinks.length / (internalLinks.length + externalLinks.length);
  if (externalRatio > 0.5) {
    recommendations.push('Consider balancing internal and external links');
  }

  // General recommendations
  recommendations.push('Use descriptive anchor text that indicates the destination page content');
  recommendations.push('Ensure all internal links are working and point to relevant pages');
  recommendations.push('Consider adding breadcrumb navigation for better user experience');
  recommendations.push('Review link structure to ensure logical site hierarchy');

  return recommendations;
}

function findDuplicateLinks(internalLinks) {
  const urlCounts = {};
  internalLinks.forEach(link => {
    if (link.fullUrl) {
      urlCounts[link.fullUrl] = (urlCounts[link.fullUrl] || 0) + 1;
    }
  });

  return Object.entries(urlCounts)
    .filter(([url, count]) => count > 1)
    .map(([url, count]) => ({ url, count }))
    .slice(0, 10);
}
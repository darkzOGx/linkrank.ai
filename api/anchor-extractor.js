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

    const anchorData = await extractAnchorTexts(targetUrl);
    
    return res.json({
      success: true,
      url: targetUrl,
      ...anchorData
    });

  } catch (error) {
    console.error('Anchor text extraction error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error occurred while extracting anchor texts'
    });
  }
}

async function extractAnchorTexts(url) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Anchor-Extractor/1.0 (+https://linkrank.ai/bot)'
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
    const analysis = analyzeAnchorTexts(html, url);
    
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

function analyzeAnchorTexts(html, baseUrl) {
  const baseUrlObj = new URL(baseUrl);
  const baseDomain = baseUrlObj.hostname;
  
  // Extract all links with anchor texts
  const linkRegex = /<a[^>]*href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gis;
  const allLinks = [];
  let match;

  while ((match = linkRegex.exec(html)) !== null) {
    const href = match[1];
    const rawAnchorText = match[2];
    const fullMatch = match[0];
    
    // Clean anchor text
    const anchorText = cleanAnchorText(rawAnchorText);
    
    allLinks.push({
      href,
      anchorText,
      rawAnchorText,
      fullMatch,
      linkAttributes: extractLinkAttributes(fullMatch)
    });
  }

  // Categorize links
  const categorizedLinks = categorizeLinks(allLinks, baseDomain, baseUrl);
  
  // Analyze anchor text patterns
  const anchorAnalysis = analyzeAnchorPatterns(categorizedLinks);
  
  // Generate insights and recommendations
  const insights = generateAnchorInsights(categorizedLinks, anchorAnalysis);
  
  return {
    totalLinks: allLinks.length,
    categorizedLinks,
    anchorAnalysis,
    insights,
    summary: {
      internalLinks: categorizedLinks.internal.length,
      externalLinks: categorizedLinks.external.length,
      emptyAnchors: categorizedLinks.internal.concat(categorizedLinks.external).filter(l => !l.anchorText.trim()).length,
      imageLinks: categorizedLinks.internal.concat(categorizedLinks.external).filter(l => l.linkAttributes.hasImage).length,
      nofollowLinks: categorizedLinks.internal.concat(categorizedLinks.external).filter(l => l.linkAttributes.nofollow).length
    }
  };
}

function cleanAnchorText(rawText) {
  // Remove HTML tags but preserve image alt text
  let cleaned = rawText.replace(/<img[^>]+alt=["']([^"']*)["'][^>]*>/gi, '$1');
  cleaned = cleaned.replace(/<[^>]*>/g, '');
  
  // Decode HTML entities
  cleaned = cleaned.replace(/&amp;/g, '&')
                  .replace(/&lt;/g, '<')
                  .replace(/&gt;/g, '>')
                  .replace(/&quot;/g, '"')
                  .replace(/&#39;/g, "'")
                  .replace(/&nbsp;/g, ' ');
  
  // Clean whitespace
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  
  return cleaned;
}

function extractLinkAttributes(linkHtml) {
  const attributes = {
    nofollow: /rel=["'][^"']*nofollow[^"']*["']/i.test(linkHtml),
    noopener: /rel=["'][^"']*noopener[^"']*["']/i.test(linkHtml),
    noreferrer: /rel=["'][^"']*noreferrer[^"']*["']/i.test(linkHtml),
    sponsored: /rel=["'][^"']*sponsored[^"']*["']/i.test(linkHtml),
    ugc: /rel=["'][^"']*ugc[^"']*["']/i.test(linkHtml),
    hasImage: /<img[^>]*>/i.test(linkHtml),
    hasTitle: /title=["'][^"']+["']/i.test(linkHtml),
    hasTarget: /target=["'][^"']+["']/i.test(linkHtml),
    opensNewWindow: /target=["']_blank["']/i.test(linkHtml)
  };

  // Extract title attribute
  const titleMatch = linkHtml.match(/title=["']([^"']+)["']/i);
  if (titleMatch) {
    attributes.title = titleMatch[1];
  }

  return attributes;
}

function categorizeLinks(allLinks, baseDomain, baseUrl) {
  const internal = [];
  const external = [];
  const special = []; // mailto, tel, javascript, etc.

  allLinks.forEach(link => {
    const href = link.href;
    
    if (href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:') || href.startsWith('#')) {
      special.push({
        ...link,
        linkType: href.startsWith('mailto:') ? 'email' :
                 href.startsWith('tel:') ? 'phone' :
                 href.startsWith('javascript:') ? 'javascript' : 'fragment'
      });
    } else if (href.startsWith('http')) {
      try {
        const linkUrl = new URL(href);
        if (linkUrl.hostname === baseDomain) {
          internal.push({
            ...link,
            linkType: 'internal',
            fullUrl: href,
            path: linkUrl.pathname
          });
        } else {
          external.push({
            ...link,
            linkType: 'external',
            domain: linkUrl.hostname,
            fullUrl: href
          });
        }
      } catch {
        // Invalid URL, treat as relative (internal)
        internal.push({
          ...link,
          linkType: 'internal',
          fullUrl: null,
          path: href,
          isInvalid: true
        });
      }
    } else {
      // Relative link
      try {
        const fullUrl = new URL(href, baseUrl).href;
        internal.push({
          ...link,
          linkType: 'internal',
          fullUrl,
          path: href,
          isRelative: true
        });
      } catch {
        internal.push({
          ...link,
          linkType: 'internal',
          fullUrl: null,
          path: href,
          isInvalid: true
        });
      }
    }
  });

  return { internal, external, special };
}

function analyzeAnchorPatterns(categorizedLinks) {
  const allLinks = [...categorizedLinks.internal, ...categorizedLinks.external];
  
  // Analyze anchor text frequency
  const anchorFrequency = {};
  const anchorLengths = [];
  let emptyAnchors = 0;
  let genericAnchors = 0;
  let keywordRichAnchors = 0;
  let brandAnchors = 0;

  const genericTerms = [
    'click here', 'read more', 'here', 'link', 'more', 'continue', 'view more',
    'learn more', 'see more', 'find out', 'discover', 'explore', 'check out'
  ];

  allLinks.forEach(link => {
    const anchorText = link.anchorText.toLowerCase().trim();
    
    if (!anchorText) {
      emptyAnchors++;
      return;
    }

    anchorLengths.push(anchorText.length);
    
    // Count frequency
    anchorFrequency[anchorText] = (anchorFrequency[anchorText] || 0) + 1;
    
    // Categorize anchor types
    if (genericTerms.includes(anchorText)) {
      genericAnchors++;
    } else if (anchorText.includes('.com') || anchorText.includes('www.')) {
      brandAnchors++;
    } else if (anchorText.split(' ').length >= 2) {
      keywordRichAnchors++;
    }
  });

  // Calculate statistics
  const avgLength = anchorLengths.length > 0 ? 
    anchorLengths.reduce((sum, len) => sum + len, 0) / anchorLengths.length : 0;

  const maxLength = Math.max(...anchorLengths, 0);
  const minLength = anchorLengths.length > 0 ? Math.min(...anchorLengths) : 0;

  // Find most common anchor texts
  const sortedAnchors = Object.entries(anchorFrequency)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 20)
    .map(([text, count]) => ({ text, count }));

  // Analyze anchor text diversity
  const uniqueAnchors = Object.keys(anchorFrequency).length;
  const totalAnchors = allLinks.filter(l => l.anchorText.trim()).length;
  const diversityScore = totalAnchors > 0 ? (uniqueAnchors / totalAnchors) * 100 : 0;

  return {
    anchorFrequency: sortedAnchors,
    statistics: {
      totalAnchors: allLinks.length,
      uniqueAnchors,
      emptyAnchors,
      genericAnchors,
      keywordRichAnchors,
      brandAnchors,
      avgLength: Math.round(avgLength * 100) / 100,
      maxLength,
      minLength,
      diversityScore: Math.round(diversityScore * 100) / 100
    },
    distribution: {
      empty: Math.round((emptyAnchors / allLinks.length) * 100),
      generic: Math.round((genericAnchors / allLinks.length) * 100),
      keywordRich: Math.round((keywordRichAnchors / allLinks.length) * 100),
      brand: Math.round((brandAnchors / allLinks.length) * 100)
    }
  };
}

function generateAnchorInsights(categorizedLinks, anchorAnalysis) {
  const insights = [];
  const recommendations = [];
  const issues = [];
  const stats = anchorAnalysis.statistics;

  // Check for empty anchor texts
  if (stats.emptyAnchors > 0) {
    issues.push(`${stats.emptyAnchors} links have empty anchor text`);
    recommendations.push('Add descriptive anchor text to all links for better SEO');
  }

  // Check for generic anchor texts
  if (stats.genericAnchors > stats.totalAnchors * 0.2) {
    issues.push(`${stats.genericAnchors} links use generic anchor text`);
    recommendations.push('Replace generic anchor texts like "click here" with descriptive text');
  }

  // Check anchor text diversity
  if (anchorAnalysis.statistics.diversityScore < 50) {
    insights.push('Low anchor text diversity detected - consider using more varied anchor texts');
  } else if (anchorAnalysis.statistics.diversityScore > 80) {
    insights.push('Good anchor text diversity - helps with SEO optimization');
  }

  // Check for over-optimization
  const topAnchor = anchorAnalysis.anchorFrequency[0];
  if (topAnchor && topAnchor.count > stats.totalAnchors * 0.3) {
    issues.push(`Over-optimization detected: "${topAnchor.text}" used ${topAnchor.count} times`);
    recommendations.push('Avoid over-using the same anchor text to prevent penalties');
  }

  // Check internal vs external link balance
  const internalCount = categorizedLinks.internal.length;
  const externalCount = categorizedLinks.external.length;
  const totalLinks = internalCount + externalCount;
  
  if (totalLinks > 0) {
    const internalRatio = (internalCount / totalLinks) * 100;
    
    if (internalRatio < 30) {
      insights.push('Low internal linking ratio - consider adding more internal links');
    } else if (internalRatio > 90) {
      insights.push('Very high internal linking ratio - consider adding relevant external links');
    } else {
      insights.push('Good balance between internal and external links');
    }
  }

  // Check for nofollow usage
  const allLinks = [...categorizedLinks.internal, ...categorizedLinks.external];
  const nofollowCount = allLinks.filter(l => l.linkAttributes.nofollow).length;
  
  if (nofollowCount > 0) {
    insights.push(`${nofollowCount} links use nofollow attribute`);
  }

  // Check for image links
  const imageLinks = allLinks.filter(l => l.linkAttributes.hasImage).length;
  if (imageLinks > 0) {
    insights.push(`${imageLinks} links contain images - ensure alt text is descriptive`);
  }

  // General recommendations
  recommendations.push('Use descriptive anchor text that indicates the destination content');
  recommendations.push('Maintain a natural distribution of anchor text variations');
  recommendations.push('Consider the user experience when crafting anchor texts');
  
  return {
    insights,
    recommendations,
    issues,
    score: calculateAnchorScore(anchorAnalysis, categorizedLinks)
  };
}

function calculateAnchorScore(anchorAnalysis, categorizedLinks) {
  let score = 100;
  const stats = anchorAnalysis.statistics;
  const totalLinks = categorizedLinks.internal.length + categorizedLinks.external.length;

  // Deduct for empty anchors
  score -= (stats.emptyAnchors / totalLinks) * 30;

  // Deduct for generic anchors
  score -= (stats.genericAnchors / totalLinks) * 20;

  // Deduct for poor diversity
  if (anchorAnalysis.statistics.diversityScore < 30) {
    score -= 20;
  }

  // Deduct for over-optimization
  const topAnchor = anchorAnalysis.anchorFrequency[0];
  if (topAnchor && topAnchor.count > totalLinks * 0.3) {
    score -= 25;
  }

  // Bonus for good practices
  if (stats.keywordRichAnchors > totalLinks * 0.4) {
    score += 10;
  }

  return Math.max(0, Math.min(100, Math.round(score)));
}
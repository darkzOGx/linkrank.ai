export default async function handler(req, res) {
  const cheerio = await import('cheerio').then(m => m.default || m);
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url, competitors } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  try {
    const targetUrl = url.startsWith('http') ? url : `https://${url}`;
    const competitorUrls = competitors ? competitors.split(',').map(u => u.trim()) : [];
    
    // Analyze primary URL
    const primaryAnalysis = await analyzeCitations(targetUrl);
    
    // Analyze competitor URLs
    const competitorAnalyses = [];
    for (const compUrl of competitorUrls.slice(0, 3)) { // Limit to 3 competitors
      try {
        const fullCompUrl = compUrl.startsWith('http') ? compUrl : `https://${compUrl}`;
        const analysis = await analyzeCitations(fullCompUrl);
        competitorAnalyses.push({
          url: fullCompUrl,
          domain: new URL(fullCompUrl).hostname,
          ...analysis
        });
      } catch (err) {
        competitorAnalyses.push({
          url: compUrl,
          domain: compUrl,
          error: 'Failed to analyze',
          citationScore: 0,
          totalCitations: 0
        });
      }
    }

    // Generate competitive insights
    const insights = generateCompetitiveInsights(primaryAnalysis, competitorAnalyses);
    
    const result = {
      success: true,
      primarySite: {
        url: targetUrl,
        domain: new URL(targetUrl).hostname,
        ...primaryAnalysis
      },
      competitors: competitorAnalyses,
      competitiveAnalysis: insights,
      recommendations: generateRecommendations(primaryAnalysis, competitorAnalyses),
      timestamp: new Date().toISOString()
    };

    res.status(200).json(result);

  } catch (error) {
    console.error('Citation competitor analysis error:', error);
    return res.status(500).json({ 
      error: 'Failed to analyze citation competitors',
      details: error.message 
    });
  }
}

async function analyzeCitations(url) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'GEO-Analysis-Protocol/1.0 (Citation Competitor Analysis)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();
    const cheerio = await import('cheerio').then(m => m.default || m);
    const $ = cheerio.load(html);
    
    const textContent = $('body').text();
    
    // Analyze citations
    const citations = analyzeCitationPatterns(textContent);
    const externalLinks = analyzeExternalLinks($, url);
    const authoritySignals = analyzeAuthoritySignals($, textContent);
    const contentDepth = analyzeContentDepth($, textContent);
    
    const totalScore = citations.score + externalLinks.score + authoritySignals.score + contentDepth.score;
    
    return {
      citationScore: Math.round(totalScore),
      totalCitations: citations.count,
      authorityLinks: externalLinks.authorityCount,
      totalLinks: externalLinks.totalCount,
      contentWords: textContent.split(/\s+/).length,
      citations,
      externalLinks,
      authoritySignals,
      contentDepth
    };
    
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  }
}

function analyzeCitationPatterns(text) {
  const patterns = [
    /according to [^.!?]*(?:study|research|report|survey)/gi,
    /research shows|studies indicate|data suggests/gi,
    /published in|journal of|university of/gi,
    /\([A-Z][a-z]+,?\s+\d{4}\)/g,
    /\[[0-9]+\]/g
  ];
  
  let totalMatches = 0;
  const foundCitations = [];
  
  patterns.forEach(pattern => {
    const matches = text.match(pattern) || [];
    totalMatches += matches.length;
    matches.forEach(match => {
      foundCitations.push(match.trim());
    });
  });
  
  return {
    score: Math.min(25, totalMatches * 3),
    count: totalMatches,
    examples: foundCitations.slice(0, 5)
  };
}

function analyzeExternalLinks($, currentUrl) {
  let totalCount = 0;
  let authorityCount = 0;
  const links = [];
  
  const currentDomain = new URL(currentUrl).hostname;
  const authoritativeDomains = [
    '.edu', '.gov', '.org', 'wikipedia.org', 'nature.com', 
    'science.org', 'pubmed.ncbi.nlm.nih.gov', 'scholar.google.com'
  ];
  
  $('a[href^="http"]').each((i, elem) => {
    const href = $(elem).attr('href');
    if (href && !href.includes(currentDomain)) {
      totalCount++;
      const isAuthority = authoritativeDomains.some(domain => href.includes(domain));
      if (isAuthority) {
        authorityCount++;
        links.push(href);
      }
    }
  });
  
  return {
    score: Math.min(25, authorityCount * 4 + (totalCount - authorityCount)),
    totalCount,
    authorityCount,
    examples: links.slice(0, 5)
  };
}

function analyzeAuthoritySignals($, text) {
  const signals = [
    'peer-reviewed', 'published', 'journal', 'university', 'institute',
    'research', 'study', 'academic', 'scholar', 'professor', 'phd',
    'expert', 'authority', 'certified', 'accredited'
  ];
  
  const textLower = text.toLowerCase();
  let count = 0;
  const found = [];
  
  signals.forEach(signal => {
    if (textLower.includes(signal)) {
      count++;
      found.push(signal);
    }
  });
  
  return {
    score: Math.min(25, count * 2),
    count,
    signals: found
  };
}

function analyzeContentDepth($, text) {
  const wordCount = text.split(/\s+/).length;
  const headings = $('h1, h2, h3, h4, h5, h6').length;
  const lists = $('ul, ol').length;
  const paragraphs = $('p').length;
  
  let score = 0;
  score += Math.min(15, Math.floor(wordCount / 200)); // 1 point per 200 words, max 15
  score += Math.min(5, headings); // 1 point per heading, max 5
  score += Math.min(5, lists); // 1 point per list, max 5
  
  return {
    score: Math.min(25, score),
    wordCount,
    headings,
    lists,
    paragraphs
  };
}

function generateCompetitiveInsights(primary, competitors) {
  const validCompetitors = competitors.filter(c => !c.error);
  
  if (validCompetitors.length === 0) {
    return {
      ranking: 'N/A - No valid competitors to compare',
      strengths: ['Unable to compare without competitor data'],
      weaknesses: ['Add competitor URLs for analysis']
    };
  }
  
  // Calculate rankings
  const allSites = [primary, ...validCompetitors];
  const sorted = allSites.sort((a, b) => b.citationScore - a.citationScore);
  const primaryRank = sorted.findIndex(site => site.url === primary.url || site === primary) + 1;
  
  // Identify strengths and weaknesses
  const avgCitations = validCompetitors.reduce((sum, c) => sum + c.totalCitations, 0) / validCompetitors.length;
  const avgAuthorityLinks = validCompetitors.reduce((sum, c) => sum + c.authorityLinks, 0) / validCompetitors.length;
  
  const strengths = [];
  const weaknesses = [];
  const opportunities = [];
  
  if (primary.totalCitations > avgCitations) {
    strengths.push(`Above average citation count (${primary.totalCitations} vs ${Math.round(avgCitations)} avg)`);
  } else {
    weaknesses.push(`Below average citation count (${primary.totalCitations} vs ${Math.round(avgCitations)} avg)`);
    opportunities.push('Increase citation frequency in content');
  }
  
  if (primary.authorityLinks > avgAuthorityLinks) {
    strengths.push(`Strong authority link profile (${primary.authorityLinks} vs ${Math.round(avgAuthorityLinks)} avg)`);
  } else {
    weaknesses.push(`Low authority link count (${primary.authorityLinks} vs ${Math.round(avgAuthorityLinks)} avg)`);
    opportunities.push('Add more links to authoritative sources');
  }
  
  return {
    ranking: `#${primaryRank} of ${allSites.length} sites analyzed`,
    strengths: strengths.length > 0 ? strengths : ['Competitive analysis shows room for improvement'],
    weaknesses,
    opportunities: opportunities.length > 0 ? opportunities : ['Maintain current citation strategy']
  };
}

function generateRecommendations(primary, competitors) {
  const recommendations = [];
  const validCompetitors = competitors.filter(c => !c.error);
  
  if (validCompetitors.length === 0) {
    return [
      'Add competitor URLs to get comparative insights',
      'Focus on increasing citation density in content',
      'Add more authoritative external links'
    ];
  }
  
  const topCompetitor = validCompetitors.reduce((top, current) => 
    current.citationScore > top.citationScore ? current : top
  );
  
  if (primary.citationScore < topCompetitor.citationScore) {
    recommendations.push(`Improve citation score to match top competitor (${topCompetitor.citationScore})`);
  }
  
  if (primary.totalCitations < topCompetitor.totalCitations) {
    recommendations.push(`Increase citation frequency (competitor has ${topCompetitor.totalCitations} citations)`);
  }
  
  if (primary.authorityLinks < topCompetitor.authorityLinks) {
    recommendations.push(`Add more authoritative links (competitor has ${topCompetitor.authorityLinks})`);
  }
  
  if (recommendations.length === 0) {
    recommendations.push('Your citation strategy is competitive with analyzed competitors');
  }
  
  return recommendations;
}
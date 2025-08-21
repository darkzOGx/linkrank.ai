export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  try {
    const mockResults = generateMockBacklinkData(url);
    return res.json(mockResults);
  } catch (error) {
    console.error('Backlink check error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error occurred while checking backlinks'
    });
  }
}

function generateMockBacklinkData(url) {
  const totalBacklinks = Math.floor(Math.random() * 50000) + 1000;
  const referringDomains = Math.floor(totalBacklinks / (Math.random() * 10 + 5));
  const domainAuthority = Math.floor(Math.random() * 60) + 20;

  const topDomains = [
    { domain: 'techcrunch.com', da: 92 },
    { domain: 'forbes.com', da: 95 },
    { domain: 'medium.com', da: 89 },
    { domain: 'wikipedia.org', da: 93 },
    { domain: 'github.com', da: 94 },
    { domain: 'stackoverflow.com', da: 91 },
    { domain: 'reddit.com', da: 91 },
    { domain: 'linkedin.com', da: 98 },
    { domain: 'twitter.com', da: 94 },
    { domain: 'youtube.com', da: 100 }
  ];

  const anchorTexts = [
    'click here', 'learn more', 'website', 'official site', 
    'read article', 'source', 'reference', 'visit site'
  ];

  const topBacklinks = topDomains.slice(0, 5).map(site => ({
    domain: site.domain,
    url: `https://${site.domain}/article-${Math.floor(Math.random() * 1000)}`,
    anchorText: anchorTexts[Math.floor(Math.random() * anchorTexts.length)],
    domainAuthority: site.da,
    dofollow: Math.random() > 0.3,
    firstSeen: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  }));

  const anchorTextDistribution = anchorTexts.slice(0, 5).map(text => ({
    text: text,
    percentage: Math.floor(Math.random() * 30) + 5
  }));

  return {
    success: true,
    url: url,
    totalBacklinks: totalBacklinks,
    referringDomains: referringDomains,
    domainAuthority: domainAuthority,
    trustFlow: Math.floor(domainAuthority * 0.8 + Math.random() * 10),
    linkTypes: {
      dofollow: 65,
      nofollow: 35,
      text: 80,
      image: 20
    },
    topBacklinks: topBacklinks,
    anchorTexts: anchorTextDistribution,
    growth: {
      new30days: Math.floor(Math.random() * 100) + 10,
      lost30days: Math.floor(Math.random() * 30) + 5,
      net: Math.floor(Math.random() * 70) + 5
    }
  };
}
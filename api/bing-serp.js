export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { keyword, domain, location = 'United States' } = req.query;

  if (!keyword) {
    return res.status(400).json({ error: 'Keyword parameter is required' });
  }

  try {
    const mockResults = generateMockBingSERPResults(keyword, domain, location);
    return res.json(mockResults);
  } catch (error) {
    console.error('Bing SERP check error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error occurred while checking Bing SERP rankings'
    });
  }
}

function generateMockBingSERPResults(keyword, domain, location) {
  const results = [];
  const totalResults = Math.floor(Math.random() * 30000000) + 500000;
  
  const bingDomains = [
    'microsoft.com', 'bing.com', 'msn.com', 'linkedin.com', 'github.com',
    'stackoverflow.com', 'technet.microsoft.com', 'docs.microsoft.com',
    'wikipedia.org', 'youtube.com', 'reddit.com', 'quora.com'
  ];

  for (let i = 1; i <= 10; i++) {
    const randomDomain = bingDomains[Math.floor(Math.random() * bingDomains.length)];
    const isTargetDomain = domain && Math.random() < 0.25 && i <= 15;
    const resultDomain = isTargetDomain ? domain : randomDomain;
    
    results.push({
      position: i,
      title: `${keyword} - Bing Result ${i}`,
      link: `https://${resultDomain}/${keyword.toLowerCase().replace(/\s+/g, '-')}`,
      displayedLink: `${resultDomain} › ${keyword}`,
      snippet: `Comprehensive information about ${keyword}. Find detailed guides, tutorials, and expert insights on Bing.`
    });
  }

  const response = {
    success: true,
    keyword: keyword,
    location: location,
    totalResults: totalResults,
    results: results
  };

  if (domain) {
    const domainResult = results.find(r => r.link.includes(domain));
    if (domainResult) {
      response.domainRanking = {
        position: domainResult.position,
        page: Math.ceil(domainResult.position / 10),
        title: domainResult.title,
        link: domainResult.link
      };
    }
  }

  return response;
}
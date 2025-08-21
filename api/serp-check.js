export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { keyword, domain, location = 'United States' } = req.query;

  if (!keyword) {
    return res.status(400).json({ error: 'Keyword parameter is required' });
  }

  try {
    // Since we can't actually scrape Google SERP due to their terms of service,
    // we'll provide a mock response with realistic data structure
    // In a real implementation, you would use a SERP API service like SerpApi, DataForSEO, etc.
    
    const mockResults = generateMockSERPResults(keyword, domain, location);
    
    return res.json(mockResults);

  } catch (error) {
    console.error('SERP check error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error occurred while checking SERP rankings'
    });
  }
}

function generateMockSERPResults(keyword, domain, location) {
  // Generate realistic mock SERP results
  const results = [];
  const totalResults = Math.floor(Math.random() * 50000000) + 1000000;
  
  // Some common domains for realistic results
  const commonDomains = [
    'wikipedia.org', 'youtube.com', 'reddit.com', 'medium.com', 'github.com',
    'stackoverflow.com', 'amazon.com', 'ebay.com', 'etsy.com', 'shopify.com',
    'wordpress.com', 'blogger.com', 'tumblr.com', 'facebook.com', 'twitter.com',
    'linkedin.com', 'pinterest.com', 'instagram.com', 'tiktok.com', 'quora.com'
  ];

  // Generate 10 search results
  for (let i = 1; i <= 10; i++) {
    const randomDomain = commonDomains[Math.floor(Math.random() * commonDomains.length)];
    const isTargetDomain = domain && Math.random() < 0.3 && i <= 10; // 30% chance target domain appears in top 10
    
    const resultDomain = isTargetDomain ? domain : randomDomain;
    
    results.push({
      position: i,
      title: generateMockTitle(keyword, i),
      link: `https://${resultDomain}/${generateMockPath(keyword)}`,
      displayedLink: `${resultDomain} › ${generateMockBreadcrumb(keyword)}`,
      snippet: generateMockSnippet(keyword, i)
    });
  }

  const response = {
    success: true,
    keyword: keyword,
    location: location,
    totalResults: totalResults,
    results: results
  };

  // If domain is specified and found in results, add domain ranking info
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

function generateMockTitle(keyword, position) {
  const templates = [
    `${keyword} - Complete Guide and Best Practices`,
    `Ultimate ${keyword} Tutorial for Beginners`,
    `${keyword}: Everything You Need to Know`,
    `Best ${keyword} Tips and Tricks`,
    `How to Master ${keyword} in 2025`,
    `${keyword} Explained: A Comprehensive Overview`,
    `Top 10 ${keyword} Strategies That Work`,
    `${keyword} Made Simple: Step-by-Step Guide`,
    `Advanced ${keyword} Techniques and Methods`,
    `${keyword} for Professionals: Expert Insights`
  ];
  
  return templates[position % templates.length];
}

function generateMockPath(keyword) {
  const slug = keyword.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const pathTypes = ['blog', 'guide', 'tutorial', 'article', 'resource', 'how-to'];
  const pathType = pathTypes[Math.floor(Math.random() * pathTypes.length)];
  
  return `${pathType}/${slug}`;
}

function generateMockBreadcrumb(keyword) {
  const categories = ['Blog', 'Guides', 'Tutorials', 'Resources', 'Articles', 'How-to'];
  const category = categories[Math.floor(Math.random() * categories.length)];
  
  return `${category} › ${keyword}`;
}

function generateMockSnippet(keyword, position) {
  const snippets = [
    `Learn everything about ${keyword} with our comprehensive guide. Discover proven strategies, expert tips, and best practices that will help you succeed.`,
    `${keyword} is essential for modern businesses. This detailed tutorial covers all the fundamentals you need to know to get started effectively.`,
    `Master ${keyword} with our step-by-step approach. Our expert-reviewed content provides practical insights and real-world examples.`,
    `Discover the ultimate ${keyword} strategies used by professionals. This complete resource includes tools, techniques, and implementation guides.`,
    `${keyword} made simple! Our beginner-friendly guide breaks down complex concepts into easy-to-understand steps with practical examples.`,
    `Get ahead with our advanced ${keyword} techniques. Learn from industry experts and implement proven methods for better results.`,
    `Everything you need to know about ${keyword}. From basics to advanced strategies, this comprehensive resource covers it all.`,
    `Unlock the power of ${keyword} with our detailed analysis. Includes case studies, best practices, and actionable insights.`,
    `${keyword} essentials: A complete overview of tools, techniques, and strategies for success in today's competitive landscape.`,
    `Transform your approach to ${keyword} with our expert guidance. Practical tips and proven methods for immediate implementation.`
  ];
  
  return snippets[position % snippets.length];
}
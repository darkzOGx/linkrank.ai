export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { keyword, domain, location = 'United States' } = req.query;

  if (!keyword) {
    return res.status(400).json({ error: 'Keyword parameter is required' });
  }

  try {
    // Note: Direct SERP scraping violates Bing's ToS and can get IP addresses blocked
    // For production use, integrate with legitimate SERP API services
    return res.json({
      success: false,
      educational: true,
      message: 'Direct SERP checking requires API integration',
      info: {
        keyword,
        domain,
        location,
        explanation: 'Due to Bing\'s Terms of Service, we cannot directly scrape search results. For accurate Bing SERP data, please use legitimate APIs like Bing Webmaster Tools or third-party SERP services.',
        alternatives: [
          'Bing Webmaster Tools - Free official tool for tracking your site\'s Bing rankings',
          'Microsoft Advertising Intelligence - Keyword and SERP insights',
          'SEMrush API - Includes Bing search data and competitor analysis',
          'DataForSEO API - Multi-engine SERP data including Bing',
          'SerpApi - Search engine results API supporting Bing'
        ],
        bingSpecific: [
          'Bing typically has different ranking factors than Google',
          'Bing gives more weight to exact match domains and social signals',
          'Bing\'s market share varies significantly by region and demographic',
          'Consider optimizing for both Google and Bing for maximum visibility'
        ],
        implementation: 'To implement Bing SERP checking, sign up for Bing Webmaster Tools or a professional SERP API service.'
      }
    });

  } catch (error) {
    console.error('Bing SERP check error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error occurred while checking Bing SERP rankings'
    });
  }
}
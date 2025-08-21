export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { keyword, domain, location = 'United States' } = req.query;

  if (!keyword) {
    return res.status(400).json({ error: 'Keyword parameter is required' });
  }

  try {
    // Note: Direct SERP scraping violates Google's ToS and can get IP addresses blocked
    // For production use, integrate with legitimate SERP API services
    return res.json({
      success: false,
      educational: true,
      message: 'Direct SERP checking requires API integration',
      info: {
        keyword,
        domain,
        location,
        explanation: 'Due to Google\'s Terms of Service, we cannot directly scrape search results. For accurate SERP data, please use legitimate APIs like Google Search Console, SEMrush, Ahrefs, or DataForSEO.',
        alternatives: [
          'Google Search Console - Free official tool for tracking your site\'s rankings',
          'SEMrush API - Comprehensive SERP tracking and competitor analysis',
          'Ahrefs API - Professional SEO tracking with historical data',
          'DataForSEO API - Real-time SERP data from multiple search engines',
          'SerpApi - Search engine results API for developers'
        ],
        implementation: 'To implement SERP checking, sign up for one of these services and integrate their API endpoints.'
      }
    });

  } catch (error) {
    console.error('SERP check error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error occurred while checking SERP rankings'
    });
  }
}
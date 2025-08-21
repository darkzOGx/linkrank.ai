export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  try {
    const mockResults = generateMockMetaData(url);
    return res.json(mockResults);
  } catch (error) {
    console.error('Meta extract error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error occurred while extracting meta tags'
    });
  }
}

function generateMockMetaData(url) {
  const title = 'Example Website - Leading Solutions for Your Business';
  const description = 'Discover innovative solutions and expert insights. We provide comprehensive services to help your business grow and succeed in the digital age.';
  
  const basicMeta = [
    {
      name: 'Title',
      content: title,
      length: title.length,
      maxLength: 60,
      recommendation: title.length > 60 ? 'Too long (recommended: 50-60 chars)' : 'Good length'
    },
    {
      name: 'Description',
      content: description,
      length: description.length,
      maxLength: 160,
      recommendation: description.length > 160 ? 'Too long (recommended: 150-160 chars)' : 'Good length'
    },
    {
      name: 'Keywords',
      content: 'business, solutions, digital, innovation, services, growth',
      length: 58
    },
    {
      name: 'Viewport',
      content: 'width=device-width, initial-scale=1.0'
    },
    {
      name: 'Charset',
      content: 'UTF-8'
    }
  ];

  const openGraph = [
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: url },
    { property: 'og:image', content: `${url}/og-image.jpg` },
    { property: 'og:site_name', content: 'Example Website' }
  ];

  const twitterCards = [
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: `${url}/twitter-card.jpg` },
    { name: 'twitter:site', content: '@example' }
  ];

  const otherMeta = [
    { name: 'robots', content: 'index, follow' },
    { name: 'googlebot', content: 'index, follow' },
    { name: 'author', content: 'Example Company' },
    { name: 'language', content: 'en-US' },
    { name: 'revisit-after', content: '7 days' }
  ];

  const seoAnalysis = [
    { status: 'good', message: 'Title tag is present and within recommended length' },
    { status: 'good', message: 'Meta description is present and optimized' },
    { status: 'good', message: 'Open Graph tags are properly configured' },
    { status: 'good', message: 'Twitter Card tags are present' },
    { status: 'warning', message: 'Consider adding schema.org structured data' },
    { status: 'good', message: 'Viewport meta tag is configured for mobile' },
    { status: 'good', message: 'Charset is properly defined' }
  ];

  return {
    success: true,
    url: url,
    basicMeta: basicMeta,
    openGraph: openGraph,
    twitterCards: twitterCards,
    otherMeta: otherMeta,
    seoAnalysis: seoAnalysis
  };
}
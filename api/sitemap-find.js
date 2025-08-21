export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  try {
    const mockResults = generateMockSitemapData(url);
    return res.json(mockResults);
  } catch (error) {
    console.error('Sitemap find error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error occurred while finding sitemap'
    });
  }
}

function generateMockSitemapData(url) {
  const hasSitemap = Math.random() > 0.2; // 80% chance of having sitemap
  
  const sitemaps = hasSitemap ? [
    {
      url: `${url}/sitemap.xml`,
      type: 'Main Sitemap',
      status: 'Found',
      urlCount: Math.floor(Math.random() * 500) + 50,
      size: `${Math.floor(Math.random() * 500) + 10}KB`,
      lastModified: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      format: 'XML'
    }
  ] : [];

  if (hasSitemap && Math.random() > 0.5) {
    sitemaps.push({
      url: `${url}/sitemap_index.xml`,
      type: 'Sitemap Index',
      status: 'Found',
      urlCount: Math.floor(Math.random() * 10) + 2,
      size: `${Math.floor(Math.random() * 50) + 5}KB`,
      lastModified: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      format: 'XML'
    });
  }

  const checkedLocations = [
    { path: '/sitemap.xml', found: hasSitemap },
    { path: '/sitemap_index.xml', found: sitemaps.length > 1 },
    { path: '/sitemap.xml.gz', found: false },
    { path: '/sitemap', found: false },
    { path: '/sitemaps.xml', found: false },
    { path: '/sitemap/sitemap.xml', found: false }
  ];

  const structure = hasSitemap ? {
    pages: Math.floor(Math.random() * 100) + 10,
    posts: Math.floor(Math.random() * 200) + 20,
    categories: Math.floor(Math.random() * 20) + 5,
    products: Math.floor(Math.random() * 150),
    images: Math.floor(Math.random() * 300) + 50,
    other: Math.floor(Math.random() * 50)
  } : null;

  return {
    success: true,
    url: url,
    sitemaps: sitemaps,
    checkedLocations: checkedLocations,
    structure: structure
  };
}
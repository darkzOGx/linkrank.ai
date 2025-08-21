export default async function handler(req, res) {
  // Set no-cache headers to prevent stale results
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  try {
    // Validate and construct robots.txt URL
    let baseUrl;
    let robotsUrl;
    try {
      // Handle URL with or without protocol
      const inputUrl = url.startsWith('http') ? url : `https://${url}`;
      baseUrl = new URL(inputUrl);
      
      // Always construct robots.txt URL from the domain root
      robotsUrl = new URL('/robots.txt', baseUrl.origin);
    } catch (e) {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    // Add timeout for the fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(robotsUrl.toString(), {
        method: 'GET',
        headers: {
          'User-Agent': 'LinkRank-SEO-Bot/1.0 (Robots.txt Checker)',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
        cache: 'no-store',
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 404) {
          return res.json({
            success: false,
            error: 'Robots.txt file not found (404). This means there are no crawling restrictions for search engines.'
          });
        }
        return res.json({
          success: false,
          error: `HTTP ${response.status}: ${response.statusText}`
        });
      }

      const content = await response.text();
      
      // Get additional file information
      const contentLength = response.headers.get('content-length');
      const lastModified = response.headers.get('last-modified');

      return res.json({
        success: true,
        content: content || '# Empty robots.txt file',
        size: contentLength ? parseInt(contentLength) : content.length,
        lastModified: lastModified || null,
        url: robotsUrl.toString()
      });

    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError') {
        return res.json({
          success: false,
          error: 'Request timeout - the server took too long to respond'
        });
      }

      return res.json({
        success: false,
        error: `Network error: ${fetchError.message}`
      });
    }

  } catch (error) {
    console.error('Robots.txt check error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error occurred while checking robots.txt'
    });
  }
}
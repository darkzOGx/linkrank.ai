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

    const sitemapData = await findSitemaps(targetUrl);
    
    return res.json({
      success: true,
      url: targetUrl,
      ...sitemapData
    });

  } catch (error) {
    console.error('Sitemap find error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error occurred while finding sitemap'
    });
  }
}

async function findSitemaps(baseUrl) {
  const urlObj = new URL(baseUrl);
  const domain = `${urlObj.protocol}//${urlObj.hostname}`;
  
  // Common sitemap locations to check
  const sitemapPaths = [
    '/sitemap.xml',
    '/sitemap_index.xml',
    '/sitemap.xml.gz',
    '/sitemap',
    '/sitemaps.xml',
    '/sitemap/sitemap.xml',
    '/wp-sitemap.xml',
    '/sitemap-index.xml'
  ];

  const foundSitemaps = [];
  const checkedLocations = [];

  // Check each common location
  for (const path of sitemapPaths) {
    const sitemapUrl = domain + path;
    try {
      const result = await checkSitemapUrl(sitemapUrl);
      checkedLocations.push({
        path,
        found: result.found,
        status: result.status
      });
      
      if (result.found) {
        foundSitemaps.push({
          url: sitemapUrl,
          type: determineSitemapType(path, result.content),
          status: 'Found',
          urlCount: result.urlCount,
          size: result.size,
          lastModified: result.lastModified,
          format: result.format
        });
      }
    } catch (error) {
      checkedLocations.push({
        path,
        found: false,
        status: 'Error'
      });
    }
  }

  // Check robots.txt for sitemap references
  try {
    const robotsSitemaps = await checkRobotsForSitemaps(domain);
    for (const sitemapUrl of robotsSitemaps) {
      if (!foundSitemaps.some(s => s.url === sitemapUrl)) {
        try {
          const result = await checkSitemapUrl(sitemapUrl);
          if (result.found) {
            foundSitemaps.push({
              url: sitemapUrl,
              type: 'From Robots.txt',
              status: 'Found',
              urlCount: result.urlCount,
              size: result.size,
              lastModified: result.lastModified,
              format: result.format
            });
          }
        } catch (error) {
          // Ignore errors for robots.txt referenced sitemaps
        }
      }
    }
  } catch (error) {
    // Ignore robots.txt errors
  }

  // Analyze sitemap structure if we found any
  let structure = null;
  if (foundSitemaps.length > 0) {
    structure = await analyzeSitemapStructure(foundSitemaps);
  }

  return {
    sitemaps: foundSitemaps,
    checkedLocations,
    structure
  };
}

async function checkSitemapUrl(url) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(url, {
      method: 'HEAD', // Use HEAD first for efficiency
      headers: {
        'User-Agent': 'SEO-Analysis-Protocol/1.0 (Sitemap Finder)'
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      // If HEAD request succeeded, make a GET request to analyze content
      const contentResponse = await fetch(url, {
        method: 'GET',
        headers: {
          'User-Agent': 'SEO-Analysis-Protocol/1.0 (Sitemap Finder)'
        }
      });

      const content = await contentResponse.text();
      const analysis = analyzeSitemapContent(content);
      
      return {
        found: true,
        status: response.status,
        content,
        urlCount: analysis.urlCount,
        size: formatFileSize(content.length),
        lastModified: response.headers.get('last-modified') || 'Unknown',
        format: analysis.format
      };
    } else {
      return {
        found: false,
        status: response.status
      };
    }
  } catch (error) {
    clearTimeout(timeoutId);
    return {
      found: false,
      status: 'Error'
    };
  }
}

function analyzeSitemapContent(content) {
  let urlCount = 0;
  let format = 'Unknown';

  // Check if it's XML sitemap
  if (content.includes('<?xml') && content.includes('<urlset')) {
    format = 'XML';
    const urlMatches = content.match(/<url>/g);
    urlCount = urlMatches ? urlMatches.length : 0;
  }
  // Check if it's sitemap index
  else if (content.includes('<?xml') && content.includes('<sitemapindex')) {
    format = 'XML Index';
    const sitemapMatches = content.match(/<sitemap>/g);
    urlCount = sitemapMatches ? sitemapMatches.length : 0;
  }
  // Check if it's text format
  else if (content.includes('http://') || content.includes('https://')) {
    format = 'Text';
    const lines = content.split('\n').filter(line => 
      line.trim() && (line.includes('http://') || line.includes('https://'))
    );
    urlCount = lines.length;
  }

  return { urlCount, format };
}

async function checkRobotsForSitemaps(domain) {
  try {
    const robotsUrl = `${domain}/robots.txt`;
    const response = await fetch(robotsUrl, {
      headers: {
        'User-Agent': 'SEO-Analysis-Protocol/1.0 (Sitemap Finder)'
      }
    });

    if (response.ok) {
      const content = await response.text();
      const sitemapMatches = content.match(/^Sitemap:\s*(.+)$/gmi);
      
      if (sitemapMatches) {
        return sitemapMatches.map(match => 
          match.replace(/^Sitemap:\s*/i, '').trim()
        );
      }
    }
  } catch (error) {
    // Ignore errors
  }
  
  return [];
}

function determineSitemapType(path, content) {
  if (path.includes('index')) {
    return 'Sitemap Index';
  }
  
  if (content && content.includes('<sitemapindex')) {
    return 'Sitemap Index';
  }
  
  if (path === '/sitemap.xml') {
    return 'Main Sitemap';
  }
  
  if (path.includes('wp-')) {
    return 'WordPress Sitemap';
  }
  
  return 'XML Sitemap';
}

async function analyzeSitemapStructure(sitemaps) {
  const structure = {
    pages: 0,
    posts: 0,
    categories: 0,
    products: 0,
    images: 0,
    other: 0
  };

  // Simple heuristic analysis based on sitemap URLs and content
  for (const sitemap of sitemaps) {
    try {
      const response = await fetch(sitemap.url);
      const content = await response.text();
      
      // Count different types of URLs based on patterns
      const urls = extractUrlsFromSitemap(content);
      
      for (const url of urls) {
        if (url.includes('/post/') || url.includes('/blog/') || url.includes('/article/')) {
          structure.posts++;
        } else if (url.includes('/category/') || url.includes('/tag/')) {
          structure.categories++;
        } else if (url.includes('/product/') || url.includes('/shop/')) {
          structure.products++;
        } else if (url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
          structure.images++;
        } else if (url.includes('/page/')) {
          structure.pages++;
        } else {
          structure.other++;
        }
      }
    } catch (error) {
      // If we can't fetch content, use the URL count from the sitemap info
      structure.other += sitemap.urlCount || 0;
    }
  }

  return structure;
}

function extractUrlsFromSitemap(content) {
  const urls = [];
  
  // Extract URLs from XML sitemap
  const locMatches = content.match(/<loc>(.*?)<\/loc>/g);
  if (locMatches) {
    for (const match of locMatches) {
      const url = match.replace(/<\/?loc>/g, '');
      urls.push(url);
    }
  }
  
  // Extract URLs from text sitemap
  if (!locMatches) {
    const lines = content.split('\n');
    for (const line of lines) {
      if (line.trim() && (line.includes('http://') || line.includes('https://'))) {
        urls.push(line.trim());
      }
    }
  }
  
  return urls;
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
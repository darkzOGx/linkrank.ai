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

    // Add timeout for the fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch(targetUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'SEO-Analysis-Protocol/1.0 (Meta Tag Extractor)'
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        return res.json({
          success: false,
          error: `HTTP ${response.status}: ${response.statusText}`
        });
      }

      const html = await response.text();
      const metaData = extractMetaTags(html, targetUrl);
      
      return res.json({
        success: true,
        url: targetUrl,
        ...metaData
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
    console.error('Meta extraction error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error occurred while extracting meta tags'
    });
  }
}

function extractMetaTags(html, url) {
  const basicMeta = [];
  const openGraph = [];
  const twitterCards = [];
  const otherMeta = [];

  // Extract title
  const titleMatch = html.match(/<title[^>]*>([^<]*)</i);
  const title = titleMatch ? titleMatch[1].trim() : '';
  
  if (title) {
    basicMeta.push({
      name: 'Title',
      content: title,
      length: title.length,
      maxLength: 60,
      recommendation: title.length > 60 ? 'Too long (recommended: 50-60 chars)' : 
                      title.length < 30 ? 'Too short (recommended: 30-60 chars)' : 'Good length'
    });
  }

  // Extract all meta tags
  const metaRegex = /<meta[^>]+>/gi;
  const metaMatches = html.match(metaRegex) || [];
  
  metaMatches.forEach(tag => {
    const nameMatch = tag.match(/name=[\"']([^\"']+)[\"']/i);
    const propertyMatch = tag.match(/property=[\"']([^\"']+)[\"']/i);
    const contentMatch = tag.match(/content=[\"']([^\"']*)[\"']/i);
    const charsetMatch = tag.match(/charset=[\"']?([^\"'\\s>]+)/i);
    
    if (charsetMatch) {
      basicMeta.push({
        name: 'Charset',
        content: charsetMatch[1]
      });
    }
    
    if (contentMatch) {
      const content = contentMatch[1];
      
      if (nameMatch) {
        const name = nameMatch[1].toLowerCase();
        
        if (name === 'description') {
          basicMeta.push({
            name: 'Description',
            content: content,
            length: content.length,
            maxLength: 160,
            recommendation: content.length > 160 ? 'Too long (recommended: 150-160 chars)' : 
                            content.length < 120 ? 'Too short (recommended: 120-160 chars)' : 'Good length'
          });
        } else if (name === 'keywords') {
          basicMeta.push({
            name: 'Keywords',
            content: content,
            length: content.length
          });
        } else if (name === 'viewport') {
          basicMeta.push({
            name: 'Viewport',
            content: content
          });
        } else if (name.startsWith('twitter:')) {
          twitterCards.push({
            name: name,
            content: content
          });
        } else {
          otherMeta.push({
            name: name,
            content: content
          });
        }
      }
      
      if (propertyMatch) {
        const property = propertyMatch[1].toLowerCase();
        if (property.startsWith('og:')) {
          openGraph.push({
            property: property,
            content: content
          });
        }
      }
    }
  });

  // Extract canonical link
  const canonicalMatch = html.match(/<link[^>]+rel=[\"']canonical[\"'][^>]*href=[\"']([^\"']+)[\"']/i);
  if (canonicalMatch) {
    otherMeta.push({
      name: 'canonical',
      content: canonicalMatch[1]
    });
  }

  // Analyze the meta data
  const seoAnalysis = analyzeMetaData({ basicMeta, openGraph, twitterCards, otherMeta });
  
  return {
    basicMeta,
    openGraph,
    twitterCards,
    otherMeta,
    seoAnalysis
  };
}

function analyzeMetaData({ basicMeta, openGraph, twitterCards, otherMeta }) {
  const analysis = [];
  
  // Check for title
  const title = basicMeta.find(meta => meta.name === 'Title');
  if (!title) {
    analysis.push({ status: 'error', message: 'Title tag is missing' });
  } else if (title.length > 60) {
    analysis.push({ status: 'warning', message: 'Title tag is too long (over 60 characters)' });
  } else if (title.length < 30) {
    analysis.push({ status: 'warning', message: 'Title tag is too short (under 30 characters)' });
  } else {
    analysis.push({ status: 'good', message: 'Title tag is present and within recommended length' });
  }
  
  // Check for description
  const description = basicMeta.find(meta => meta.name === 'Description');
  if (!description) {
    analysis.push({ status: 'error', message: 'Meta description is missing' });
  } else if (description.length > 160) {
    analysis.push({ status: 'warning', message: 'Meta description is too long (over 160 characters)' });
  } else if (description.length < 120) {
    analysis.push({ status: 'warning', message: 'Meta description is too short (under 120 characters)' });
  } else {
    analysis.push({ status: 'good', message: 'Meta description is present and optimized' });
  }
  
  // Check for Open Graph tags
  if (openGraph.length === 0) {
    analysis.push({ status: 'warning', message: 'No Open Graph tags found for social media sharing' });
  } else {
    analysis.push({ status: 'good', message: 'Open Graph tags are properly configured' });
  }
  
  // Check for Twitter Card tags
  if (twitterCards.length === 0) {
    analysis.push({ status: 'warning', message: 'No Twitter Card tags found' });
  } else {
    analysis.push({ status: 'good', message: 'Twitter Card tags are present' });
  }
  
  // Check for viewport
  const viewport = basicMeta.find(meta => meta.name === 'Viewport');
  if (!viewport) {
    analysis.push({ status: 'warning', message: 'Viewport meta tag is missing' });
  } else if (viewport.content.includes('width=device-width')) {
    analysis.push({ status: 'good', message: 'Viewport meta tag is configured for mobile' });
  } else {
    analysis.push({ status: 'warning', message: 'Viewport meta tag may not be optimized for mobile' });
  }
  
  // Check for charset
  const charset = basicMeta.find(meta => meta.name === 'Charset');
  if (!charset) {
    analysis.push({ status: 'warning', message: 'Character set is not defined' });
  } else {
    analysis.push({ status: 'good', message: 'Charset is properly defined' });
  }
  
  // Check for robots
  const robots = otherMeta.find(meta => meta.name === 'robots');
  if (!robots) {
    analysis.push({ status: 'info', message: 'Consider adding robots meta tag for better crawl control' });
  } else {
    analysis.push({ status: 'good', message: 'Robots meta tag is present' });
  }
  
  return analysis;
}
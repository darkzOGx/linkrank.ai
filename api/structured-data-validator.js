import * as cheerio from 'cheerio';

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
          'User-Agent': 'GEO-Analysis-Protocol/1.0 (Structured Data Validator)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate',
          'Cache-Control': 'no-cache',
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        return res.status(400).json({ 
          error: `HTTP ${response.status}: Unable to fetch the webpage` 
        });
      }

      const html = await response.text();
      const $ = cheerio.load(html);

      // Extract JSON-LD structured data
      const jsonLdScripts = [];
      $('script[type="application/ld+json"]').each((i, elem) => {
        try {
          const content = $(elem).html().trim();
          const parsed = JSON.parse(content);
          jsonLdScripts.push({
            index: i + 1,
            type: parsed['@type'] || 'Unknown',
            context: parsed['@context'] || 'Unknown',
            data: parsed,
            valid: true
          });
        } catch (e) {
          jsonLdScripts.push({
            index: i + 1,
            type: 'Invalid JSON-LD',
            context: 'Unknown',
            data: $(elem).html().trim(),
            valid: false,
            error: e.message
          });
        }
      });

      // Extract microdata
      const microdataItems = [];
      $('[itemscope]').each((i, elem) => {
        const item = {
          index: i + 1,
          type: $(elem).attr('itemtype') || 'Unknown',
          properties: {}
        };

        $(elem).find('[itemprop]').each((j, propElem) => {
          const prop = $(propElem).attr('itemprop');
          const value = $(propElem).attr('content') || $(propElem).text().trim();
          item.properties[prop] = value;
        });

        microdataItems.push(item);
      });

      // Extract RDFa data
      const rdfaItems = [];
      $('[typeof]').each((i, elem) => {
        const item = {
          index: i + 1,
          type: $(elem).attr('typeof'),
          properties: {}
        };

        $(elem).find('[property]').each((j, propElem) => {
          const prop = $(propElem).attr('property');
          const value = $(propElem).attr('content') || $(propElem).text().trim();
          item.properties[prop] = value;
        });

        rdfaItems.push(item);
      });

      // Calculate scores and provide recommendations
      const totalStructuredData = jsonLdScripts.length + microdataItems.length + rdfaItems.length;
      const validJsonLd = jsonLdScripts.filter(item => item.valid).length;
      
      let score = 0;
      let recommendations = [];

      if (totalStructuredData === 0) {
        score = 0;
        recommendations.push('No structured data found. Add JSON-LD, Microdata, or RDFa to help AI systems understand your content.');
      } else {
        score = Math.min(100, (validJsonLd * 30) + (microdataItems.length * 20) + (rdfaItems.length * 15));
        
        if (validJsonLd === 0) {
          recommendations.push('Add JSON-LD structured data for better AI comprehension.');
        }
        
        if (!jsonLdScripts.some(item => item.type === 'Organization' || item.type === 'Person')) {
          recommendations.push('Add Organization or Person schema to establish authority.');
        }
        
        if (!jsonLdScripts.some(item => item.type === 'Article' || item.type === 'BlogPosting')) {
          recommendations.push('Add Article schema for content-based pages.');
        }
      }

      const result = {
        success: true,
        url: targetUrl,
        analysis: {
          totalStructuredData,
          jsonLdCount: jsonLdScripts.length,
          microdataCount: microdataItems.length,
          rdfaCount: rdfaItems.length,
          validJsonLd,
          score,
          grade: score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C' : score >= 60 ? 'D' : 'F'
        },
        structured_data: {
          jsonLd: jsonLdScripts,
          microdata: microdataItems,
          rdfa: rdfaItems
        },
        recommendations,
        timestamp: new Date().toISOString()
      };

      res.status(200).json(result);

    } catch (fetchError) {
      if (fetchError.name === 'AbortError') {
        return res.status(408).json({ error: 'Request timeout - webpage took too long to load' });
      }
      throw fetchError;
    }

  } catch (error) {
    console.error('Structured data validation error:', error);
    return res.status(500).json({ 
      error: 'Failed to analyze structured data',
      details: error.message 
    });
  }
}
export default async function handler(req, res) {
  const cheerio = await import('cheerio').then(m => m.default || m);
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
      let practicalImplementations = [];

      // Extract page title and description for context
      const pageTitle = $('title').text() || '';
      const pageDescription = $('meta[name="description"]').attr('content') || '';
      const h1Text = $('h1').first().text() || pageTitle;
      const domain = new URL(targetUrl).hostname;

      if (totalStructuredData === 0) {
        score = 0;
        recommendations.push('No structured data found. Add JSON-LD, Microdata, or RDFa to help AI systems understand your content.');
        
        // Generate practical implementations for no structured data
        practicalImplementations.push({
          title: 'Add Basic Organization Schema',
          code: `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "${h1Text || domain}",
  "url": "${targetUrl}",
  "description": "${pageDescription || 'Your organization description'}",
  "logo": "${targetUrl}/logo.png"
}
</script>`,
          description: 'Add this to your <head> section to establish basic entity recognition.'
        });

        practicalImplementations.push({
          title: 'Implement WebSite Schema with SearchAction',
          code: `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "${h1Text}",
  "url": "${targetUrl}",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "${targetUrl}/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
</script>`,
          description: 'Enable AI systems to understand your site structure and search functionality.'
        });
      } else {
        score = Math.min(100, (validJsonLd * 30) + (microdataItems.length * 20) + (rdfaItems.length * 15));
        
        if (validJsonLd === 0) {
          recommendations.push('Add JSON-LD structured data for better AI comprehension.');
          practicalImplementations.push({
            title: 'Convert Microdata to JSON-LD',
            code: `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "${h1Text}",
  "description": "${pageDescription}",
  "url": "${targetUrl}",
  "datePublished": "${new Date().toISOString()}",
  "author": {
    "@type": "Person",
    "name": "Your Name"
  }
}
</script>`,
            description: 'JSON-LD is preferred by AI systems. Add alongside existing microdata.'
          });
        }
        
        if (!jsonLdScripts.some(item => item.type === 'Organization' || item.type === 'Person')) {
          recommendations.push('Add Organization or Person schema to establish authority.');
          practicalImplementations.push({
            title: 'Add Author/Organization Authority Schema',
            code: `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Expert Name",
  "jobTitle": "Your Title",
  "worksFor": {
    "@type": "Organization",
    "name": "${domain}"
  },
  "sameAs": [
    "https://linkedin.com/in/yourprofile",
    "https://twitter.com/yourhandle"
  ]
}
</script>`,
            description: 'Establish credibility by linking to your professional profiles.'
          });
        }
        
        if (!jsonLdScripts.some(item => item.type === 'Article' || item.type === 'BlogPosting')) {
          recommendations.push('Add Article schema for content-based pages.');
          practicalImplementations.push({
            title: 'Implement Article Schema for Content',
            code: `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "${h1Text}",
  "alternativeHeadline": "${pageDescription}",
  "image": "${targetUrl}/featured-image.jpg",
  "author": {
    "@type": "Person",
    "name": "Author Name",
    "url": "${targetUrl}/about"
  },
  "publisher": {
    "@type": "Organization",
    "name": "${domain}",
    "logo": {
      "@type": "ImageObject",
      "url": "${targetUrl}/logo.png"
    }
  },
  "datePublished": "${new Date().toISOString()}",
  "dateModified": "${new Date().toISOString()}"
}
</script>`,
            description: 'Help AI understand your content structure and authorship.'
          });
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
        practicalImplementations,
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
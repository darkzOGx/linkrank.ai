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
    let targetUrl;
    try {
      targetUrl = url.startsWith('http') ? url : `https://${url}`;
      new URL(targetUrl);
    } catch (e) {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch(targetUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'GEO-Analysis-Protocol/1.0 (AI Content Extractor)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
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

      // Remove non-content elements
      $('script, style, nav, footer, aside, header').remove();
      
      // Extract key content elements
      const title = $('title').text().trim();
      const metaDescription = $('meta[name="description"]').attr('content') || '';
      const h1 = $('h1').first().text().trim();
      
      // Extract main content
      const mainContent = $('main, article, .content, #content').first();
      const contentHtml = mainContent.length ? mainContent.html() : $('body').html();
      
      // Extract headings hierarchy
      const headings = [];
      $('h1, h2, h3, h4, h5, h6').each((i, elem) => {
        headings.push({
          level: elem.name,
          text: $(elem).text().trim(),
          order: i + 1
        });
      });

      // Extract key facts and data points
      const dataPoints = [];
      const factPatterns = [
        /\b\d+(?:\.\d+)?%/g,
        /\$[\d,]+(?:\.\d{2})?/g,
        /\b\d{4}\b/g,
        /\b\d+(?:\.\d+)?\s*(?:million|billion|thousand)/gi
      ];

      const textContent = $('body').text();
      factPatterns.forEach(pattern => {
        const matches = textContent.match(pattern) || [];
        matches.forEach(match => {
          dataPoints.push({
            type: 'fact',
            value: match,
            context: extractContext(textContent, match)
          });
        });
      });

      // Extract entities (simplified)
      const entities = {
        organizations: [],
        people: [],
        locations: [],
        products: []
      };

      // Look for common entity patterns
      const orgPattern = /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\s+(?:Inc|Corp|LLC|Ltd|Company|Organization|Institute|University)\b/g;
      const orgMatches = textContent.match(orgPattern) || [];
      entities.organizations = [...new Set(orgMatches)].slice(0, 10);

      // Extract lists
      const lists = [];
      $('ul, ol').each((i, elem) => {
        const items = [];
        $(elem).find('li').each((j, li) => {
          items.push($(li).text().trim());
        });
        if (items.length > 0) {
          lists.push({
            type: elem.name,
            items: items.slice(0, 10)
          });
        }
      });

      // Extract quotes
      const quotes = [];
      $('blockquote, q, .quote').each((i, elem) => {
        const quoteText = $(elem).text().trim();
        const cite = $(elem).find('cite').text() || $(elem).attr('cite') || '';
        if (quoteText) {
          quotes.push({
            text: quoteText,
            source: cite
          });
        }
      });

      // AI extraction summary
      const aiExtraction = {
        primaryTopic: h1 || title,
        keyPoints: extractKeyPoints(textContent),
        mainEntities: entities,
        factualClaims: dataPoints.slice(0, 20),
        citableQuotes: quotes.slice(0, 5)
      };

      // Calculate AI-readiness score
      let aiScore = 0;
      if (headings.length > 3) aiScore += 20;
      if (dataPoints.length > 5) aiScore += 30;
      if (lists.length > 0) aiScore += 15;
      if (quotes.length > 0) aiScore += 15;
      if (entities.organizations.length > 0) aiScore += 10;
      if (metaDescription) aiScore += 10;

      // Recommendations
      const recommendations = [];
      const practicalImplementations = [];

      if (headings.length < 3) {
        recommendations.push('Add more structured headings to improve content hierarchy.');
      }
      
      if (dataPoints.length < 5) {
        recommendations.push('Include more factual data points and statistics.');
      }

      if (lists.length === 0) {
        recommendations.push('Use lists to structure information for better AI extraction.');
        practicalImplementations.push({
          title: 'Structure Key Points as Lists',
          code: `<ul class="key-points">
  <li><strong>Fact 1:</strong> Specific data point with number</li>
  <li><strong>Fact 2:</strong> Percentage or comparison</li>
  <li><strong>Fact 3:</strong> Temporal information with date</li>
</ul>`,
          description: 'Lists help AI systems extract and organize information efficiently.'
        });
      }

      const result = {
        success: true,
        url: targetUrl,
        extraction: {
          title,
          description: metaDescription,
          mainHeading: h1,
          headingsCount: headings.length,
          dataPointsCount: dataPoints.length,
          listsCount: lists.length,
          quotesCount: quotes.length,
          aiReadinessScore: aiScore,
          grade: aiScore >= 80 ? 'A' : aiScore >= 60 ? 'B' : aiScore >= 40 ? 'C' : aiScore >= 20 ? 'D' : 'F'
        },
        aiExtraction,
        structuredContent: {
          headings: headings.slice(0, 10),
          lists: lists.slice(0, 5),
          quotes: quotes.slice(0, 5)
        },
        recommendations,
        practicalImplementations,
        timestamp: new Date().toISOString()
      };

      res.status(200).json(result);

    } catch (fetchError) {
      if (fetchError.name === 'AbortError') {
        return res.status(408).json({ error: 'Request timeout' });
      }
      throw fetchError;
    }

  } catch (error) {
    console.error('AI content extraction error:', error);
    return res.status(500).json({ 
      error: 'Failed to extract content',
      details: error.message 
    });
  }
}

function extractContext(text, match) {
  const index = text.indexOf(match);
  if (index === -1) return '';
  const start = Math.max(0, index - 50);
  const end = Math.min(text.length, index + match.length + 50);
  return '...' + text.substring(start, end).replace(/\s+/g, ' ').trim() + '...';
}

function extractKeyPoints(text) {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
  const keyPoints = [];
  
  // Look for sentences with key indicators
  const indicators = ['important', 'key', 'main', 'primary', 'critical', 'essential', 'significant'];
  
  sentences.forEach(sentence => {
    if (indicators.some(indicator => sentence.toLowerCase().includes(indicator))) {
      keyPoints.push(sentence.trim());
    }
  });
  
  // Also get sentences with numbers
  sentences.forEach(sentence => {
    if (/\d/.test(sentence) && keyPoints.length < 5) {
      keyPoints.push(sentence.trim());
    }
  });
  
  return keyPoints.slice(0, 5);
}
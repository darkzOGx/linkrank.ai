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
          'User-Agent': 'GEO-Analysis-Protocol/1.0 (AI Citation Analyzer)',
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

      // Remove script and style elements for clean text analysis
      $('script, style, nav, footer, aside').remove();
      
      // Extract main content
      const contentText = $('main, article, .content, #content, .post, .entry').first().text() || $('body').text();
      const cleanText = contentText.replace(/\s+/g, ' ').trim();
      
      // Analyze factual density
      const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim().length > 10);
      const totalSentences = sentences.length;
      
      // Count factual indicators
      const factualPatterns = [
        /\b\d{4}\b/g, // Years
        /\b\d+%/g, // Percentages
        /\$[\d,]+/g, // Dollar amounts
        /\b\d+\.\d+/g, // Decimals
        /\b(according to|research shows|study found|data indicates|statistics show)/gi,
        /\b(source:|sources:|reference:|cited in)/gi,
        /\b\d+\s*(people|users|customers|patients|participants)/gi
      ];
      
      let factualCount = 0;
      factualPatterns.forEach(pattern => {
        const matches = cleanText.match(pattern) || [];
        factualCount += matches.length;
      });

      // Check for authority signals
      const authoritySignals = {
        credentials: /\b(PhD|Dr\.|MD|Professor|Expert|Certified|Licensed)\b/gi.test(cleanText),
        publications: /\b(published|journal|research|peer-reviewed|study)/gi.test(cleanText),
        experience: /\b(\d+\s*years?\s*(of\s*)?(experience|expertise))/gi.test(cleanText),
        affiliations: /\b(University|Institute|Association|Organization|Board)/gi.test(cleanText)
      };

      // Check for source attribution
      const sources = [];
      $('a[href*="://"]').each((i, elem) => {
        const href = $(elem).attr('href');
        const text = $(elem).text().trim();
        if (href && !href.includes(new URL(targetUrl).hostname)) {
          sources.push({ url: href, text, type: 'external_link' });
        }
      });

      // Look for citations
      const citations = cleanText.match(/\[[0-9]+\]|\([A-Z][a-z]+,?\s+\d{4}\)|\(.*?\d{4}.*?\)/g) || [];

      // Check content structure for AI readability
      const headings = {
        h1: $('h1').length,
        h2: $('h2').length,
        h3: $('h3').length,
        h4: $('h4').length,
        h5: $('h5').length,
        h6: $('h6').length
      };

      const lists = $('ul, ol').length;
      const tables = $('table').length;
      const blockquotes = $('blockquote').length;

      // Calculate citation potential score
      let score = 0;
      const factualDensity = totalSentences > 0 ? (factualCount / totalSentences) * 100 : 0;
      
      // Scoring factors
      score += Math.min(30, factualDensity * 3); // Factual density (max 30)
      score += Object.values(authoritySignals).filter(Boolean).length * 10; // Authority signals (max 40)
      score += Math.min(20, sources.length * 2); // External sources (max 20)
      score += Math.min(10, citations.length * 5); // Citations (max 10)

      const totalHeadings = Object.values(headings).reduce((a, b) => a + b, 0);
      if (totalHeadings > 0) score += 5; // Structure bonus

      const grade = score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C' : score >= 60 ? 'D' : 'F';

      // Generate recommendations
      const recommendations = [];
      
      if (factualDensity < 10) {
        recommendations.push('Increase factual density by adding more statistics, data points, and verifiable claims.');
      }
      
      if (!Object.values(authoritySignals).some(Boolean)) {
        recommendations.push('Add author credentials, qualifications, or institutional affiliations to establish authority.');
      }
      
      if (sources.length < 3) {
        recommendations.push('Include more external sources and references to authoritative websites.');
      }
      
      if (citations.length === 0) {
        recommendations.push('Add proper citations and references to support your claims.');
      }
      
      if (totalHeadings < 3) {
        recommendations.push('Improve content structure with more descriptive headings for better AI comprehension.');
      }

      const result = {
        success: true,
        url: targetUrl,
        analysis: {
          content_length: cleanText.length,
          sentence_count: totalSentences,
          factual_density: Math.round(factualDensity * 100) / 100,
          factual_indicators: factualCount,
          citation_potential_score: Math.round(score),
          grade
        },
        authority_signals: authoritySignals,
        source_attribution: {
          external_sources: sources.length,
          citations: citations.length,
          sources: sources.slice(0, 10) // Limit to first 10 sources
        },
        content_structure: {
          headings,
          lists,
          tables,
          blockquotes,
          total_headings: totalHeadings
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
    console.error('AI citation analysis error:', error);
    return res.status(500).json({ 
      error: 'Failed to analyze citation potential',
      details: error.message 
    });
  }
}
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
          'User-Agent': 'GEO-Analysis-Protocol/1.0 (Fact Density Checker)',
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
      
      // Split into sentences and paragraphs
      const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim().length > 10);
      const paragraphs = cleanText.split(/\n\s*\n/).filter(p => p.trim().length > 50);
      const words = cleanText.split(/\s+/).filter(w => w.length > 0);

      // Define fact patterns and their categories
      const factPatterns = {
        numbers: {
          pattern: /\b\d[\d,]*(?:\.\d+)?\b/g,
          description: 'Numerical data points'
        },
        percentages: {
          pattern: /\b\d+(?:\.\d+)?%/g,
          description: 'Percentage statistics'
        },
        years: {
          pattern: /\b(19|20)\d{2}\b/g,
          description: 'Year references'
        },
        currencies: {
          pattern: /[\$£€¥]\s?[\d,]+(?:\.\d{2})?(?:\s?(?:million|billion|trillion|k|M|B|T))?/gi,
          description: 'Financial figures'
        },
        measurements: {
          pattern: /\b\d+(?:\.\d+)?\s?(km|miles?|ft|feet|inches?|lbs?|kg|pounds?|tons?|degrees?|celsius|fahrenheit|°[CF])\b/gi,
          description: 'Physical measurements'
        },
        dates: {
          pattern: /\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}|\d{1,2}\/\d{1,2}\/\d{4}|\d{4}-\d{2}-\d{2}/gi,
          description: 'Specific dates'
        },
        research_terms: {
          pattern: /\b(study|research|survey|poll|investigation|analysis|report|data|statistics|findings|results|evidence)\b/gi,
          description: 'Research-based language'
        },
        authority_claims: {
          pattern: /\b(according to|research shows|study found|data indicates|statistics show|experts say|scientists believe|studies suggest)\b/gi,
          description: 'Authority-backed statements'
        },
        specific_quantities: {
          pattern: /\b\d+\s+(people|users|customers|patients|participants|subjects|respondents|companies|organizations|countries|states)\b/gi,
          description: 'Quantified subjects'
        }
      };

      // Count facts by category
      const factCounts = {};
      const factExamples = {};
      let totalFacts = 0;

      Object.entries(factPatterns).forEach(([category, { pattern, description }]) => {
        const matches = cleanText.match(pattern) || [];
        factCounts[category] = matches.length;
        factExamples[category] = matches.slice(0, 5); // Store first 5 examples
        totalFacts += matches.length;
      });

      // Calculate density metrics
      const factDensityPerSentence = sentences.length > 0 ? totalFacts / sentences.length : 0;
      const factDensityPerParagraph = paragraphs.length > 0 ? totalFacts / paragraphs.length : 0;
      const factDensityPer100Words = words.length > 0 ? (totalFacts / words.length) * 100 : 0;

      // Analyze sentence types for factual content
      const factualSentences = sentences.filter(sentence => {
        return Object.values(factPatterns).some(({ pattern }) => pattern.test(sentence));
      });

      // Calculate overall score
      let score = 0;
      
      // Base score from fact density
      score += Math.min(40, factDensityPer100Words * 10);
      
      // Bonus for variety of fact types
      const factTypesUsed = Object.values(factCounts).filter(count => count > 0).length;
      score += factTypesUsed * 5; // Max 45 points
      
      // Bonus for research-based language
      score += Math.min(15, factCounts.research_terms * 2);

      const grade = score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C' : score >= 60 ? 'D' : 'F';

      // Generate recommendations
      const recommendations = [];
      
      if (factDensityPer100Words < 2) {
        recommendations.push('Increase fact density by adding more statistics, numbers, and data points (aim for 2-5 facts per 100 words).');
      }
      
      if (factCounts.percentages === 0) {
        recommendations.push('Include percentage statistics to make your content more concrete and citation-worthy.');
      }
      
      if (factCounts.years < 2) {
        recommendations.push('Add more temporal context with specific years and dates.');
      }
      
      if (factCounts.authority_claims === 0) {
        recommendations.push('Use phrases like "according to research" or "studies show" to introduce factual claims.');
      }
      
      if (factTypesUsed < 4) {
        recommendations.push('Diversify your fact types by including measurements, financial figures, and quantified subjects.');
      }
      
      if (factualSentences.length / sentences.length < 0.3) {
        recommendations.push('Aim to have at least 30% of your sentences contain factual elements for better AI extraction.');
      }

      const result = {
        success: true,
        url: targetUrl,
        analysis: {
          total_facts: totalFacts,
          content_stats: {
            sentences: sentences.length,
            paragraphs: paragraphs.length,
            words: words.length,
            factual_sentences: factualSentences.length
          },
          density_metrics: {
            facts_per_sentence: Math.round(factDensityPerSentence * 100) / 100,
            facts_per_paragraph: Math.round(factDensityPerParagraph * 100) / 100,
            facts_per_100_words: Math.round(factDensityPer100Words * 100) / 100,
            factual_sentence_ratio: Math.round((factualSentences.length / sentences.length) * 100)
          },
          fact_score: Math.round(score),
          grade
        },
        fact_breakdown: Object.entries(factCounts).map(([category, count]) => ({
          category,
          description: factPatterns[category].description,
          count,
          examples: factExamples[category]
        })),
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
    console.error('Fact density analysis error:', error);
    return res.status(500).json({ 
      error: 'Failed to analyze fact density',
      details: error.message 
    });
  }
}
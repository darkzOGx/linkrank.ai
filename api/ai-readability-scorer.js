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
          'User-Agent': 'GEO-Analysis-Protocol/1.0 (AI Readability Scorer)',
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
      $('script, style, nav, footer, aside').remove();
      const textContent = $('main, article, .content, #content').first().text() || $('body').text();
      
      // Clean and process text
      const cleanText = textContent.replace(/\s+/g, ' ').trim();
      const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim().length > 10);
      const words = cleanText.split(/\s+/).filter(w => w.length > 0);
      const paragraphs = cleanText.split(/\n\s*\n/).filter(p => p.trim().length > 20);

      // AI Readability Metrics (different from traditional readability)
      const metrics = {
        // Content Structure
        averageSentenceLength: sentences.length > 0 ? Math.round(words.length / sentences.length) : 0,
        averageParagraphLength: paragraphs.length > 0 ? Math.round(words.length / paragraphs.length) : 0,
        
        // Information Density
        factualSentences: 0,
        questionsCount: sentences.filter(s => s.includes('?')).length,
        imperativeStatements: sentences.filter(s => /^(use|try|consider|note|remember|ensure)/i.test(s.trim())).length,
        
        // Clarity Indicators
        conjunctionUsage: (cleanText.match(/\b(however|therefore|furthermore|moreover|consequently|additionally)\b/gi) || []).length,
        transitionWords: (cleanText.match(/\b(first|second|next|then|finally|in conclusion|for example|specifically)\b/gi) || []).length,
        
        // AI-Friendly Structure
        headingsCount: $('h1, h2, h3, h4, h5, h6').length,
        listsCount: $('ul, ol').length,
        tableCount: $('table').length,
        emphasisCount: $('strong, b, em, i').length
      };

      // Count factual sentences (containing numbers, percentages, specific data)
      metrics.factualSentences = sentences.filter(sentence => {
        return /\d/.test(sentence) || 
               /according to|research shows|studies indicate|data suggests/i.test(sentence) ||
               /%|\$|million|billion|thousand/.test(sentence);
      }).length;

      // Calculate AI Readability Score
      let aiScore = 0;
      
      // Optimal sentence length for AI (15-25 words) - 25 points
      if (metrics.averageSentenceLength >= 15 && metrics.averageSentenceLength <= 25) {
        aiScore += 25;
      } else if (metrics.averageSentenceLength >= 10 && metrics.averageSentenceLength <= 30) {
        aiScore += 15;
      }
      
      // Paragraph structure - 20 points
      if (metrics.averageParagraphLength >= 50 && metrics.averageParagraphLength <= 150) {
        aiScore += 20;
      } else if (metrics.averageParagraphLength >= 30 && metrics.averageParagraphLength <= 200) {
        aiScore += 12;
      }
      
      // Factual content density - 20 points
      const factualDensity = sentences.length > 0 ? (metrics.factualSentences / sentences.length) * 100 : 0;
      if (factualDensity >= 30) aiScore += 20;
      else if (factualDensity >= 15) aiScore += 12;
      else if (factualDensity >= 5) aiScore += 6;
      
      // Structure and organization - 20 points
      if (metrics.headingsCount >= 3) aiScore += 8;
      if (metrics.listsCount > 0) aiScore += 6;
      if (metrics.transitionWords >= 5) aiScore += 6;
      
      // Information clarity - 15 points  
      if (metrics.conjunctionUsage >= 3) aiScore += 8;
      if (metrics.imperativeStatements > 0) aiScore += 7;

      const grade = aiScore >= 85 ? 'A' : aiScore >= 70 ? 'B' : aiScore >= 55 ? 'C' : aiScore >= 40 ? 'D' : 'F';

      // Generate recommendations
      const recommendations = [];
      const practicalImplementations = [];
      
      const h1Text = $('h1').first().text() || $('title').text();

      if (metrics.averageSentenceLength > 25) {
        recommendations.push('Shorten sentences for better AI comprehension (aim for 15-25 words per sentence).');
      }
      
      if (factualDensity < 15) {
        recommendations.push('Increase factual density with more data points and specific information.');
        practicalImplementations.push({
          title: 'Enhance Factual Density for AI Processing',
          before: 'Our service is very effective and helps many businesses.',
          after: 'Our service has helped 2,847 businesses achieve an average 34% increase in efficiency, with 92% reporting measurable improvements within 90 days.',
          description: 'Transform vague statements into specific, fact-rich content that AI can easily extract and cite.'
        });
      }
      
      if (metrics.transitionWords < 5) {
        recommendations.push('Add more transition words to improve logical flow for AI understanding.');
        practicalImplementations.push({
          title: 'Improve Content Flow with Transition Words',
          code: `<!-- Add logical connectors throughout your content -->
<p>First, we analyze your current situation and identify key areas for improvement.</p>
<p>Next, our team develops a customized strategy based on your specific needs.</p>
<p>Then, we implement the solution with careful monitoring and adjustments.</p>
<p>Finally, we provide ongoing support to ensure long-term success.</p>
<p>Therefore, you can expect measurable results within the first 30 days.</p>`,
          description: 'Use transition words to create logical flow that AI systems can follow and reference.'
        });
      }

      const result = {
        success: true,
        url: targetUrl,
        analysis: {
          aiReadabilityScore: aiScore,
          grade,
          contentMetrics: {
            totalWords: words.length,
            totalSentences: sentences.length,
            totalParagraphs: paragraphs.length,
            ...metrics
          },
          factualDensity: Math.round(factualDensity * 100) / 100,
          structureScore: Math.round(((metrics.headingsCount > 0 ? 1 : 0) + 
                                     (metrics.listsCount > 0 ? 1 : 0) + 
                                     (metrics.tableCount > 0 ? 1 : 0)) / 3 * 100)
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
    console.error('AI readability scoring error:', error);
    return res.status(500).json({ 
      error: 'Failed to score AI readability',
      details: error.message 
    });
  }
}
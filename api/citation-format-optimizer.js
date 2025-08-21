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
          'User-Agent': 'GEO-Analysis-Protocol/1.0 (Citation Format Optimizer)',
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
      
      $('script, style, nav, footer, aside').remove();
      const textContent = $('body').text();
      const sentences = textContent.split(/[.!?]+/).filter(s => s.trim().length > 20);
      
      // Analyze content structure for citation optimization
      const analysis = {
        paragraphCount: $('p').length,
        headingStructure: {
          h1: $('h1').length,
          h2: $('h2').length, 
          h3: $('h3').length
        },
        listsCount: $('ul, ol').length,
        blockquotesCount: $('blockquote').length,
        emphasisElements: $('strong, b, em, i').length,
        averageParagraphLength: 0,
        sentenceComplexity: 0
      };

      // Calculate average paragraph length
      const paragraphs = $('p').map((i, elem) => $(elem).text().trim()).get();
      if (paragraphs.length > 0) {
        analysis.averageParagraphLength = Math.round(
          paragraphs.reduce((sum, p) => sum + p.length, 0) / paragraphs.length
        );
      }

      // Analyze sentence complexity (avg words per sentence)
      const avgWordsPerSentence = sentences.length > 0 ? 
        sentences.reduce((sum, s) => sum + s.split(/\s+/).length, 0) / sentences.length : 0;
      analysis.sentenceComplexity = Math.round(avgWordsPerSentence);

      // Calculate citation optimization score
      let score = 0;
      
      // Well-structured headings (0-25 points)
      if (analysis.headingStructure.h1 >= 1) score += 10;
      if (analysis.headingStructure.h2 >= 3) score += 10;
      if (analysis.headingStructure.h3 >= 2) score += 5;
      
      // Content formatting (0-30 points)
      if (analysis.listsCount > 0) score += 10;
      if (analysis.blockquotesCount > 0) score += 10;
      if (analysis.emphasisElements > 5) score += 10;
      
      // Paragraph optimization (0-25 points)
      if (analysis.averageParagraphLength > 50 && analysis.averageParagraphLength < 200) score += 15;
      if (analysis.paragraphCount >= 5) score += 10;
      
      // Sentence complexity (0-20 points)
      if (analysis.sentenceComplexity > 10 && analysis.sentenceComplexity < 25) score += 20;

      const grade = score >= 80 ? 'A' : score >= 60 ? 'B' : score >= 40 ? 'C' : score >= 20 ? 'D' : 'F';

      // Generate recommendations and implementations
      const recommendations = [];
      const practicalImplementations = [];
      
      const pageTitle = $('title').text() || '';
      const h1Text = $('h1').first().text() || pageTitle;
      
      if (analysis.headingStructure.h2 < 3) {
        recommendations.push('Add more H2 headings to create clear content sections for better AI parsing.');
        practicalImplementations.push({
          title: 'Optimize Heading Structure for AI Citations',
          code: `<article>
  <h1>${h1Text}</h1>
  
  <h2>Key Research Findings</h2>
  <p>Present your main findings with specific data points...</p>
  
  <h2>Methodology and Analysis</h2>
  <p>Explain your research approach with clear steps...</p>
  
  <h2>Practical Applications</h2>
  <p>Provide real-world use cases and examples...</p>
  
  <h2>Conclusion and Recommendations</h2>
  <p>Summarize key takeaways and next steps...</p>
</article>`,
          description: 'Structure content with clear, descriptive headings that AI can easily extract and reference.'
        });
      }

      if (analysis.listsCount === 0) {
        recommendations.push('Use bullet points and numbered lists to make information more extractable.');
        practicalImplementations.push({
          title: 'Format Key Information as Lists',
          code: `<!-- Transform dense paragraphs into structured lists -->
<h3>Key Benefits:</h3>
<ul>
  <li><strong>Increased Efficiency:</strong> 35% improvement in processing time</li>
  <li><strong>Cost Reduction:</strong> Average savings of $2,400 per month</li>
  <li><strong>User Satisfaction:</strong> 94% positive feedback rating</li>
</ul>

<h3>Implementation Steps:</h3>
<ol>
  <li>Initial assessment and planning (Week 1-2)</li>
  <li>System configuration and testing (Week 3-4)</li>
  <li>Staff training and rollout (Week 5-6)</li>
  <li>Monitoring and optimization (Ongoing)</li>
</ol>`,
          description: 'Lists make data points easily extractable by AI systems for citations.'
        });
      }

      if (analysis.blockquotesCount === 0) {
        recommendations.push('Add blockquotes to highlight key statements and expert opinions.');
      }

      const result = {
        success: true,
        url: targetUrl,
        analysis: {
          ...analysis,
          citationScore: score,
          grade,
          optimizationLevel: score >= 60 ? 'Well Optimized' : score >= 30 ? 'Needs Improvement' : 'Poor Formatting'
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
    console.error('Citation format optimization error:', error);
    return res.status(500).json({ 
      error: 'Failed to optimize citation format',
      details: error.message 
    });
  }
}
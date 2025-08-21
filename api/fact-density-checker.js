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

      // Generate recommendations and practical implementations
      const recommendations = [];
      const practicalImplementations = [];
      
      // Extract page context for practical examples
      const pageTitle = $('title').text() || '';
      const h1Text = $('h1').first().text() || pageTitle;
      const domain = new URL(targetUrl).hostname;
      
      // Get sample content from the page
      const sampleSentences = sentences.slice(0, 3);
      const hasLists = $('ul, ol').length > 0;
      
      if (factDensityPer100Words < 2) {
        recommendations.push('Increase fact density by adding more statistics, numbers, and data points (aim for 2-5 facts per 100 words).');
        
        // Create a practical example using their content
        const sampleText = sampleSentences[0] || 'We provide excellent service to our customers.';
        practicalImplementations.push({
          title: 'Enhance Content with Specific Facts and Data',
          before: sampleText.substring(0, 150),
          after: `Since 2019, we've served 12,847 customers across 48 states, maintaining a 94.3% satisfaction rate. Our response time averages 2.4 hours, 65% faster than the industry standard of 6.8 hours.`,
          description: 'Transform generic statements into fact-rich content that AI systems can extract and cite.'
        });
      }
      
      if (factCounts.percentages === 0) {
        recommendations.push('Include percentage statistics to make your content more concrete and citation-worthy.');
        practicalImplementations.push({
          title: 'Add Percentage-Based Statistics',
          code: `<!-- Transform absolute numbers into percentages -->
<p>Original: "Most of our clients are satisfied with our service."</p>
<p>Improved: "92% of our 5,000+ clients rate our service 4.5 stars or higher, with 78% becoming repeat customers within 6 months."</p>

<!-- Create comparison percentages -->
<ul>
  <li>Customer retention: 87% (industry average: 72%)</li>
  <li>First-call resolution: 91% (up from 76% in 2023)</li>
  <li>Cost savings for clients: Average 34% reduction in operational expenses</li>
</ul>`,
          description: 'Percentages make comparisons clearer and are highly valued by AI for factual citations.'
        });
      }
      
      if (factCounts.years < 2) {
        recommendations.push('Add more temporal context with specific years and dates.');
        practicalImplementations.push({
          title: 'Include Temporal Context and Timeline',
          code: `<!-- Add specific dates and timeframes -->
<section class="timeline">
  <h3>Key Milestones</h3>
  <ul>
    <li><strong>2019:</strong> Company founded with initial team of 5</li>
    <li><strong>2021:</strong> Reached 1,000 customers milestone</li>
    <li><strong>2023:</strong> Expanded to 25 states, 45 employees</li>
    <li><strong>Q1 2024:</strong> Launched AI-powered features</li>
    <li><strong>October 2024:</strong> Achieved ISO 27001 certification</li>
  </ul>
  <p>As of ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}, we've processed over 250,000 transactions.</p>
</section>`,
          description: 'Specific dates and years help AI understand the recency and relevance of information.'
        });
      }
      
      if (factCounts.authority_claims === 0) {
        recommendations.push('Use phrases like "according to research" or "studies show" to introduce factual claims.');
        practicalImplementations.push({
          title: 'Add Authority-Backed Statements',
          code: `<!-- Include research-backed claims -->
<p>According to a 2024 Harvard Business Review study, companies using our methodology see an average 45% improvement in efficiency.</p>

<p>Research from MIT Sloan Management Review (2023) shows that businesses implementing similar strategies report:</p>
<ul>
  <li>38% reduction in operational costs</li>
  <li>52% improvement in customer satisfaction scores</li>
  <li>41% increase in employee productivity</li>
</ul>

<blockquote>
  "Studies conducted by Stanford University indicate that this approach yields a 3.2x ROI within the first 18 months."
  <cite>- Stanford Business Research, 2024</cite>
</blockquote>`,
          description: 'Reference studies and research to add credibility to your factual claims.'
        });
      }
      
      if (factTypesUsed < 4) {
        recommendations.push('Diversify your fact types by including measurements, financial figures, and quantified subjects.');
        practicalImplementations.push({
          title: 'Diversify Fact Categories',
          code: `<!-- Include various types of facts -->
<div class="fact-rich-content">
  <!-- Financial figures -->
  <p>Investment: $2.5 million seed funding, $15 million Series A (2023)</p>
  
  <!-- Measurements and scale -->
  <p>Coverage: 50,000 square feet facility, 12 regional offices</p>
  
  <!-- Quantified subjects -->
  <p>Team: 125 engineers, 45 data scientists, 30 customer success managers</p>
  
  <!-- Time-based metrics -->
  <p>Performance: 99.9% uptime, 15ms average response time, 24/7 support</p>
  
  <!-- Comparative statistics -->
  <p>Market position: #3 in North America, serving 15% market share</p>
</div>`,
          description: 'Mix different fact types to create comprehensive, citable content.'
        });
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
    console.error('Fact density analysis error:', error);
    return res.status(500).json({ 
      error: 'Failed to analyze fact density',
      details: error.message 
    });
  }
}
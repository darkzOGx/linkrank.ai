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
          'User-Agent': 'GEO-Analysis-Protocol/1.0 (Response Quality Evaluator)',
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
      
      // Evaluate different quality dimensions
      const qualityMetrics = {
        completeness: evaluateCompleteness(textContent, $),
        accuracy: evaluateAccuracy(textContent),
        clarity: evaluateClarity(textContent),
        relevance: evaluateRelevance(textContent, $),
        freshness: evaluateFreshness(textContent, $)
      };

      // Calculate overall quality score
      const overallScore = Math.round(
        (qualityMetrics.completeness.score * 0.25 +
         qualityMetrics.accuracy.score * 0.25 +
         qualityMetrics.clarity.score * 0.2 +
         qualityMetrics.relevance.score * 0.2 +
         qualityMetrics.freshness.score * 0.1)
      );

      const grade = overallScore >= 85 ? 'A' : overallScore >= 70 ? 'B' : overallScore >= 55 ? 'C' : overallScore >= 40 ? 'D' : 'F';

      const recommendations = [];
      const practicalImplementations = [];

      if (qualityMetrics.completeness.score < 70) {
        recommendations.push('Add more comprehensive coverage of the topic with detailed explanations.');
        practicalImplementations.push({
          title: 'Improve Content Completeness',
          code: `<!-- Add comprehensive topic coverage -->
<section class="comprehensive-guide">
  <h2>Complete Guide to [Topic]</h2>
  
  <div class="topic-overview">
    <h3>What You'll Learn</h3>
    <ul>
      <li>Fundamental concepts and definitions</li>
      <li>Step-by-step implementation guide</li>
      <li>Common challenges and solutions</li>
      <li>Best practices and expert tips</li>
      <li>Real-world examples and case studies</li>
    </ul>
  </div>

  <div class="detailed-sections">
    <h3>Detailed Coverage</h3>
    <p>This comprehensive guide covers all aspects of [topic], ensuring you have complete understanding from basic concepts to advanced applications.</p>
  </div>
</section>`,
          description: 'Create comprehensive content that thoroughly covers all aspects of your topic.'
        });
      }

      if (qualityMetrics.accuracy.score < 60) {
        recommendations.push('Add more credible sources, statistics, and verifiable information.');
      }

      const result = {
        success: true,
        url: targetUrl,
        analysis: {
          overallQualityScore: overallScore,
          grade,
          qualityBreakdown: {
            completeness: qualityMetrics.completeness.score,
            accuracy: qualityMetrics.accuracy.score,
            clarity: qualityMetrics.clarity.score,
            relevance: qualityMetrics.relevance.score,
            freshness: qualityMetrics.freshness.score
          }
        },
        detailedMetrics: qualityMetrics,
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
    console.error('Response quality evaluation error:', error);
    return res.status(500).json({ 
      error: 'Failed to evaluate response quality',
      details: error.message 
    });
  }
}

function evaluateCompleteness(text, $) {
  let score = 0;
  const indicators = [];

  // Content length and depth
  const wordCount = text.split(/\s+/).length;
  if (wordCount >= 1500) score += 30;
  else if (wordCount >= 800) score += 20;
  else if (wordCount >= 400) score += 10;

  // Heading structure indicating comprehensive coverage
  const headingCount = $('h1, h2, h3, h4, h5, h6').length;
  if (headingCount >= 8) score += 25;
  else if (headingCount >= 5) score += 15;
  else if (headingCount >= 3) score += 10;

  // Lists and structured information
  const listCount = $('ul, ol').length;
  score += Math.min(20, listCount * 5);

  // Tables and detailed information
  const tableCount = $('table').length;
  score += Math.min(15, tableCount * 8);

  // Examples and case studies
  const exampleCount = (text.match(/for example|case study|instance|such as/gi) || []).length;
  score += Math.min(10, exampleCount * 2);

  return {
    score: Math.min(100, score),
    indicators: [`${wordCount} words`, `${headingCount} headings`, `${listCount} lists`],
    wordCount,
    headingCount,
    hasExamples: exampleCount > 0
  };
}

function evaluateAccuracy(text) {
  let score = 50; // Start with neutral score
  const indicators = [];

  // Statistical data and numbers
  const numberCount = (text.match(/\d+(?:\.\d+)?%|\d+(?:,\d{3})*|\$[\d,]+/g) || []).length;
  score += Math.min(25, numberCount * 2);
  if (numberCount > 0) indicators.push(`${numberCount} data points`);

  // Citations and sources
  const citationCount = (text.match(/according to|research shows|study found|source:|via|from|published/gi) || []).length;
  score += Math.min(20, citationCount * 3);
  if (citationCount > 0) indicators.push(`${citationCount} citations`);

  // Dates indicating current information
  const recentDates = (text.match(/202[0-9]|2019/g) || []).length;
  score += Math.min(15, recentDates * 3);
  if (recentDates > 0) indicators.push(`${recentDates} recent dates`);

  // Expert opinions and quotes
  const expertCount = (text.match(/expert|specialist|professor|dr\.|phd|researcher/gi) || []).length;
  score += Math.min(10, expertCount * 2);
  if (expertCount > 0) indicators.push(`${expertCount} expert references`);

  return {
    score: Math.min(100, score),
    indicators,
    hasCitations: citationCount > 0,
    hasExpertOpinions: expertCount > 0
  };
}

function evaluateClarity(text) {
  let score = 0;
  const indicators = [];

  // Sentence length analysis
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
  const avgSentenceLength = sentences.reduce((sum, s) => sum + s.split(/\s+/).length, 0) / sentences.length;
  
  if (avgSentenceLength <= 20) score += 25;
  else if (avgSentenceLength <= 30) score += 15;
  else score += 5;

  // Transition words for flow
  const transitionCount = (text.match(/however|therefore|furthermore|moreover|additionally|consequently|meanwhile|nevertheless/gi) || []).length;
  score += Math.min(20, transitionCount * 4);
  if (transitionCount > 0) indicators.push(`${transitionCount} transitions`);

  // Clear definitions
  const definitionCount = (text.match(/is defined as|means|refers to|is a|are a/gi) || []).length;
  score += Math.min(20, definitionCount * 3);
  if (definitionCount > 0) indicators.push(`${definitionCount} definitions`);

  // Simple language patterns
  const jargonCount = (text.match(/utilize|facilitate|paradigm|leverage|synergy|optimize/gi) || []).length;
  const totalWords = text.split(/\s+/).length;
  const jargonRatio = jargonCount / totalWords * 1000; // per 1000 words
  
  if (jargonRatio < 5) score += 20;
  else if (jargonRatio < 10) score += 10;
  else score += 0;

  // Question format for engagement
  const questionCount = (text.match(/\?/g) || []).length;
  score += Math.min(15, questionCount * 2);
  if (questionCount > 0) indicators.push(`${questionCount} questions`);

  return {
    score: Math.min(100, score),
    indicators: [`Avg sentence: ${Math.round(avgSentenceLength)} words`, ...indicators],
    avgSentenceLength: Math.round(avgSentenceLength),
    hasGoodFlow: transitionCount >= 3
  };
}

function evaluateRelevance(text, $) {
  let score = 0;
  const indicators = [];

  const title = $('title').text().trim();
  const h1 = $('h1').first().text().trim();

  // Title-content alignment
  if (title && text.toLowerCase().includes(title.toLowerCase())) {
    score += 20;
    indicators.push('Title alignment');
  }

  // H1-content alignment
  if (h1 && text.toLowerCase().includes(h1.toLowerCase())) {
    score += 15;
    indicators.push('H1 alignment');
  }

  // Topic consistency throughout
  const firstParagraph = text.substring(0, 500).toLowerCase();
  const lastParagraph = text.substring(text.length - 500).toLowerCase();
  
  // Check if key terms appear in both beginning and end
  const keyTerms = extractKeyTerms(firstParagraph);
  let consistencyScore = 0;
  keyTerms.forEach(term => {
    if (lastParagraph.includes(term)) consistencyScore++;
  });
  
  score += Math.min(30, consistencyScore * 8);
  if (consistencyScore > 0) indicators.push(`${consistencyScore} consistent terms`);

  // Focused content (not too broad)
  const topicDiversity = (text.match(/\b[A-Z][a-z]+\b/g) || []).length;
  const uniqueTopics = new Set((text.match(/\b[A-Z][a-z]+\b/g) || [])).size;
  const focusRatio = uniqueTopics / Math.max(1, topicDiversity / 100); // topics per 100 words
  
  if (focusRatio < 0.3) score += 25;
  else if (focusRatio < 0.5) score += 15;
  else score += 5;

  // Specific rather than general
  const specificCount = (text.match(/specifically|particularly|exactly|precisely|detailed/gi) || []).length;
  score += Math.min(10, specificCount * 2);

  return {
    score: Math.min(100, score),
    indicators,
    hasTopicConsistency: consistencyScore >= 2,
    focusRatio: Math.round(focusRatio * 100) / 100
  };
}

function evaluateFreshness(text, $) {
  let score = 50; // Start neutral
  const indicators = [];

  // Recent dates
  const currentYear = new Date().getFullYear();
  const recentYears = [`${currentYear}`, `${currentYear - 1}`, `${currentYear - 2}`];
  
  recentYears.forEach((year, index) => {
    if (text.includes(year)) {
      score += 20 - (index * 5);
      indicators.push(`${year} references`);
    }
  });

  // Updated/modified dates in meta
  const lastModified = $('meta[http-equiv="last-modified"]').attr('content') ||
                      $('meta[name="date"]').attr('content') ||
                      $('time[datetime]').attr('datetime');
  
  if (lastModified) {
    const lastModDate = new Date(lastModified);
    const monthsAgo = (Date.now() - lastModDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
    
    if (monthsAgo <= 6) score += 25;
    else if (monthsAgo <= 12) score += 15;
    else if (monthsAgo <= 24) score += 5;
    
    indicators.push(`Last modified: ${monthsAgo.toFixed(1)} months ago`);
  }

  // Trending/current terminology
  const trendingTerms = ['AI', 'machine learning', 'cloud', 'remote work', 'digital transformation', '2024', '2023'];
  const trendingCount = trendingTerms.filter(term => 
    text.toLowerCase().includes(term.toLowerCase())
  ).length;
  
  score += Math.min(15, trendingCount * 3);
  if (trendingCount > 0) indicators.push(`${trendingCount} current terms`);

  return {
    score: Math.min(100, score),
    indicators,
    hasRecentContent: recentYears.some(year => text.includes(year)),
    lastModified
  };
}

function extractKeyTerms(text) {
  const words = text.toLowerCase().split(/\W+/)
    .filter(word => word.length > 4 && word.length < 20)
    .filter(word => !/^(this|that|with|from|they|have|will|been|when|what|where|which)$/.test(word));
  
  const frequency = {};
  words.forEach(word => {
    frequency[word] = (frequency[word] || 0) + 1;
  });
  
  return Object.entries(frequency)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([word]) => word);
}
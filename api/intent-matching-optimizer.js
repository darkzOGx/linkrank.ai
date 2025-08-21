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
          'User-Agent': 'GEO-Analysis-Protocol/1.0 (Intent Matching Optimizer)',
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
      const title = $('title').text().trim();
      const h1 = $('h1').first().text().trim();
      const headings = $('h1, h2, h3').map((i, elem) => $(elem).text().trim()).get();

      // Analyze different user intents
      const intentAnalysis = {
        informational: analyzeInformationalIntent(textContent, headings),
        navigational: analyzeNavigationalIntent(textContent, title, h1),
        transactional: analyzeTransactionalIntent(textContent),
        commercial: analyzeCommercialIntent(textContent)
      };

      // Analyze question-answering patterns
      const qaPatterns = analyzeQAPatterns(textContent);
      
      // Calculate intent matching score
      let score = 0;
      score += intentAnalysis.informational.score * 0.3;
      score += intentAnalysis.navigational.score * 0.2;
      score += intentAnalysis.transactional.score * 0.25;
      score += intentAnalysis.commercial.score * 0.25;

      const grade = score >= 80 ? 'A' : score >= 60 ? 'B' : score >= 40 ? 'C' : score >= 20 ? 'D' : 'F';

      // Generate optimization recommendations
      const recommendations = [];
      const practicalImplementations = [];

      if (intentAnalysis.informational.score < 60) {
        recommendations.push('Add more "how-to", "what is", and explanatory content to match informational queries.');
        practicalImplementations.push({
          title: 'Optimize for Informational Intent',
          code: `<!-- Add FAQ section to match user questions -->
<section class="faq-section">
  <h2>Frequently Asked Questions</h2>
  
  <div class="faq-item">
    <h3>What is ${h1 || 'your service'}?</h3>
    <p>${h1 || 'Your service'} is a comprehensive solution that helps users achieve their goals through innovative technology and proven methodologies.</p>
  </div>
  
  <div class="faq-item">
    <h3>How does ${h1 || 'your service'} work?</h3>
    <p>Our process involves three key steps: analysis, implementation, and optimization to deliver measurable results.</p>
  </div>
  
  <div class="faq-item">
    <h3>Why choose ${h1 || 'your service'}?</h3>
    <p>We provide expert guidance, proven results, and ongoing support to ensure your success.</p>
  </div>
</section>`,
          description: 'Create FAQ sections that directly answer common user questions and informational queries.'
        });
      }

      if (qaPatterns.directAnswers < 3) {
        recommendations.push('Include more direct answers to common questions in your content.');
      }

      if (intentAnalysis.transactional.score < 40) {
        recommendations.push('Add clear calls-to-action and conversion-focused content for commercial queries.');
      }

      const result = {
        success: true,
        url: targetUrl,
        analysis: {
          intentMatchingScore: Math.round(score),
          grade,
          intentBreakdown: {
            informational: Math.round(intentAnalysis.informational.score),
            navigational: Math.round(intentAnalysis.navigational.score),
            transactional: Math.round(intentAnalysis.transactional.score),
            commercial: Math.round(intentAnalysis.commercial.score)
          }
        },
        intentAnalysis,
        qaPatterns,
        detectedIntents: extractDetectedIntents(intentAnalysis),
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
    console.error('Intent matching optimization error:', error);
    return res.status(500).json({ 
      error: 'Failed to optimize intent matching',
      details: error.message 
    });
  }
}

function analyzeInformationalIntent(text, headings) {
  let score = 0;
  const indicators = [];

  // Question words and patterns
  const questionPatterns = [
    /what is|what are|how to|how does|why is|why does|when to|where is/gi,
    /definition|explanation|guide|tutorial|learn about|understand/gi,
    /benefits|advantages|features|characteristics|properties/gi
  ];

  questionPatterns.forEach(pattern => {
    const matches = text.match(pattern) || [];
    score += Math.min(20, matches.length * 2);
    if (matches.length > 0) {
      indicators.push(`${matches.length} informational patterns found`);
    }
  });

  // FAQ sections
  if (text.toLowerCase().includes('frequently asked questions') || text.toLowerCase().includes('faq')) {
    score += 15;
    indicators.push('FAQ section detected');
  }

  // Educational headings
  const educationalHeadings = headings.filter(h => 
    /what|how|why|guide|tutorial|learn|understanding|basics|introduction/i.test(h)
  ).length;
  
  score += Math.min(15, educationalHeadings * 3);
  if (educationalHeadings > 0) {
    indicators.push(`${educationalHeadings} educational headings found`);
  }

  return {
    score: Math.min(100, score),
    indicators,
    patterns: questionPatterns.length
  };
}

function analyzeNavigationalIntent(text, title, h1) {
  let score = 0;
  const indicators = [];

  // Brand and company mentions
  const brandMentions = (text.match(/official|homepage|main site|company|about us|contact/gi) || []).length;
  score += Math.min(30, brandMentions * 5);
  
  if (brandMentions > 0) {
    indicators.push(`${brandMentions} brand/navigation indicators`);
  }

  // Navigation elements
  if (title && h1 && title.toLowerCase().includes(h1.toLowerCase())) {
    score += 20;
    indicators.push('Title-heading alignment detected');
  }

  // Contact information
  const contactPatterns = [
    /contact us|get in touch|reach out|phone:|email:|address:/gi,
    /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, // Phone numbers
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g // Email addresses
  ];

  contactPatterns.forEach(pattern => {
    const matches = text.match(pattern) || [];
    score += Math.min(15, matches.length * 3);
    if (matches.length > 0) {
      indicators.push('Contact information found');
    }
  });

  return {
    score: Math.min(100, score),
    indicators,
    hasContactInfo: contactPatterns.some(pattern => pattern.test(text))
  };
}

function analyzeTransactionalIntent(text) {
  let score = 0;
  const indicators = [];

  // Transactional keywords
  const transactionalPatterns = [
    /buy|purchase|order|checkout|cart|shop|price|cost|payment/gi,
    /sign up|register|subscribe|get started|free trial|demo/gi,
    /download|install|get now|buy now|order now/gi
  ];

  transactionalPatterns.forEach(pattern => {
    const matches = text.match(pattern) || [];
    score += Math.min(25, matches.length * 3);
    if (matches.length > 0) {
      indicators.push(`Transactional keywords found: ${matches.length}`);
    }
  });

  // Call-to-action buttons/links
  const ctaPatterns = /click here|learn more|get started|sign up|try free|contact sales/gi;
  const ctaMatches = text.match(ctaPatterns) || [];
  score += Math.min(25, ctaMatches.length * 5);
  
  if (ctaMatches.length > 0) {
    indicators.push(`${ctaMatches.length} call-to-action elements`);
  }

  return {
    score: Math.min(100, score),
    indicators,
    ctaCount: ctaMatches.length
  };
}

function analyzeCommercialIntent(text) {
  let score = 0;
  const indicators = [];

  // Commercial keywords
  const commercialPatterns = [
    /best|top|review|compare|vs|versus|alternative|pricing|discount/gi,
    /solution|service|product|software|tool|platform/gi,
    /professional|enterprise|business|company|agency/gi
  ];

  commercialPatterns.forEach(pattern => {
    const matches = text.match(pattern) || [];
    score += Math.min(20, matches.length * 2);
    if (matches.length > 0) {
      indicators.push(`Commercial indicators found: ${matches.length}`);
    }
  });

  // Pricing information
  const pricingPatterns = /\$[\d,]+|\d+\s*dollars?|pricing|plans|packages|cost|fee/gi;
  const pricingMatches = text.match(pricingPatterns) || [];
  score += Math.min(30, pricingMatches.length * 4);
  
  if (pricingMatches.length > 0) {
    indicators.push(`${pricingMatches.length} pricing references`);
  }

  return {
    score: Math.min(100, score),
    indicators,
    hasPricing: pricingMatches.length > 0
  };
}

function analyzeQAPatterns(text) {
  const questions = text.match(/[.!?]\s*([A-Z][^?]*\?)/g) || [];
  const directAnswers = text.match(/the answer is|simply put|in short|to summarize|basically/gi) || [];
  const howToSteps = text.match(/step \d+|first|second|third|next|then|finally/gi) || [];

  return {
    questionCount: questions.length,
    directAnswers: directAnswers.length,
    howToSteps: howToSteps.length,
    hasStructuredAnswers: howToSteps.length >= 3
  };
}

function extractDetectedIntents(intentAnalysis) {
  const intents = [];

  Object.entries(intentAnalysis).forEach(([type, analysis]) => {
    if (analysis.score >= 40) {
      intents.push({
        type,
        score: analysis.score,
        strength: analysis.score >= 70 ? 'Strong' : 'Moderate',
        indicators: analysis.indicators || []
      });
    }
  });

  return intents.sort((a, b) => b.score - a.score);
}
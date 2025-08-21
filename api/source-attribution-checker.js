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
          'User-Agent': 'GEO-Analysis-Protocol/1.0 (Source Attribution Checker)',
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
      
      const textContent = $('body').text();

      // Analyze source attribution quality
      const attributionAnalysis = {
        citations: analyzeCitations($, textContent),
        links: analyzeExternalLinks($, targetUrl),
        references: analyzeReferences(textContent),
        credibility: analyzeSourceCredibility($),
        authorAttribution: analyzeAuthorAttribution($, textContent)
      };

      // Calculate overall attribution score
      let attributionScore = 0;
      attributionScore += attributionAnalysis.citations.score;
      attributionScore += attributionAnalysis.links.score;
      attributionScore += attributionAnalysis.references.score;
      attributionScore += attributionAnalysis.credibility.score;
      attributionScore += attributionAnalysis.authorAttribution.score;

      const grade = attributionScore >= 80 ? 'A' : attributionScore >= 60 ? 'B' : attributionScore >= 40 ? 'C' : attributionScore >= 20 ? 'D' : 'F';

      // Generate recommendations
      const recommendations = [];
      const practicalImplementations = [];

      if (attributionAnalysis.citations.score < 15) {
        recommendations.push('Add more source citations and references to support your claims.');
        practicalImplementations.push({
          title: 'Add Proper Source Citations',
          code: `<!-- Add citations with proper attribution -->
<article>
  <p>According to a recent study by Stanford University, 
  <a href="https://stanford.edu/study" rel="nofollow" target="_blank">
    machine learning accuracy has improved by 23%
  </a> over the past year.</p>
  
  <blockquote cite="https://example.com/research">
    "The implementation of AI in healthcare has shown remarkable results, 
    with 89% of patients reporting improved outcomes."
    <footer>
      — <cite>Dr. Jane Smith, Harvard Medical School</cite>
    </footer>
  </blockquote>
  
  <p>Research from the 
  <a href="https://nature.com/articles/123" rel="nofollow">
    Nature Journal (2024)
  </a> confirms these findings.</p>
</article>

<!-- Add source list at the end -->
<section class="sources">
  <h3>Sources</h3>
  <ol>
    <li>Stanford University. "AI Performance Study 2024." 
        <a href="https://stanford.edu/study">stanford.edu/study</a></li>
    <li>Smith, J. "Healthcare AI Implementation." Harvard Medical Review, 2024.</li>
    <li>Nature Journal. "AI Research Findings." Nature.com, 2024.</li>
  </ol>
</section>`,
          description: 'Add proper citations with credible sources to improve AI trust and citation potential.'
        });
      }

      if (attributionAnalysis.links.score < 10) {
        recommendations.push('Include more high-quality external links to authoritative sources.');
      }

      if (attributionAnalysis.authorAttribution.score < 10) {
        recommendations.push('Add clear author attribution and credentials.');
      }

      const result = {
        success: true,
        url: targetUrl,
        analysis: {
          attributionScore: Math.round(attributionScore),
          grade,
          breakdown: {
            citations: attributionAnalysis.citations.score,
            externalLinks: attributionAnalysis.links.score,
            references: attributionAnalysis.references.score,
            sourceCredibility: attributionAnalysis.credibility.score,
            authorAttribution: attributionAnalysis.authorAttribution.score
          }
        },
        detectedSources: {
          citations: attributionAnalysis.citations.items,
          externalLinks: attributionAnalysis.links.items,
          references: attributionAnalysis.references.items,
          credibleSources: attributionAnalysis.credibility.items,
          authors: attributionAnalysis.authorAttribution.items
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
    console.error('Source attribution checking error:', error);
    return res.status(500).json({ 
      error: 'Failed to check source attribution',
      details: error.message 
    });
  }
}

function analyzeCitations($, text) {
  const items = [];
  let score = 0;

  // Look for citation patterns
  const citationPatterns = [
    /according to [^.!?]*(?:study|research|report|survey)/gi,
    /research shows|studies indicate|data suggests/gi,
    /published in|journal of|university of/gi,
    /source:|sources?:/gi
  ];

  citationPatterns.forEach(pattern => {
    const matches = text.match(pattern) || [];
    matches.forEach(match => {
      items.push({ type: 'Citation Pattern', value: match.trim() });
      score += 3;
    });
  });

  // Look for cite attributes and blockquotes
  $('blockquote[cite], q[cite]').each((i, elem) => {
    const cite = $(elem).attr('cite');
    items.push({ type: 'Citation Attribute', value: cite });
    score += 5;
  });

  // Look for bibliography or references sections
  if (text.toLowerCase().includes('references') || text.toLowerCase().includes('bibliography')) {
    items.push({ type: 'Reference Section', value: 'References section found' });
    score += 10;
  }

  return { score: Math.min(25, score), items: items.slice(0, 10) };
}

function analyzeExternalLinks($, currentUrl) {
  const items = [];
  let score = 0;
  
  // Get current domain from the analyzed URL
  let currentDomain = '';
  try {
    currentDomain = new URL(currentUrl).hostname;
  } catch (e) {
    // If URL parsing fails, continue without domain filtering
  }

  // Analyze external links
  $('a[href^="http"]').each((i, elem) => {
    const href = $(elem).attr('href');
    const text = $(elem).text().trim();
    
    if (href && (!currentDomain || !href.includes(currentDomain))) {
      // Check for authoritative domains
      const authoritativeDomains = [
        '.edu', '.gov', '.org', 'wikipedia.org', 'nature.com', 
        'science.org', 'pubmed.ncbi.nlm.nih.gov', 'scholar.google.com'
      ];
      
      const isAuthoritative = authoritativeDomains.some(domain => href.includes(domain));
      
      items.push({ 
        type: isAuthoritative ? 'Authoritative Link' : 'External Link', 
        value: `${text} (${href})`,
        authoritative: isAuthoritative
      });
      
      score += isAuthoritative ? 4 : 1;
    }
  });

  return { score: Math.min(20, score), items: items.slice(0, 15) };
}

function analyzeReferences(text) {
  const items = [];
  let score = 0;

  // Look for formal reference patterns
  const referencePatterns = [
    /\([A-Z][a-z]+,?\s+\d{4}\)/g,  // (Smith, 2024)
    /\[[0-9]+\]/g,                  // [1]
    /\(\d{4}\)/g,                   // (2024)
    /et al\./gi,                    // et al.
    /ibid\./gi                      // ibid.
  ];

  referencePatterns.forEach(pattern => {
    const matches = text.match(pattern) || [];
    matches.forEach(match => {
      items.push({ type: 'Reference Citation', value: match });
      score += 2;
    });
  });

  return { score: Math.min(15, score), items: items.slice(0, 8) };
}

function analyzeSourceCredibility($) {
  const items = [];
  let score = 0;

  // Check for credible source indicators
  const text = $('body').text().toLowerCase();
  
  const credibilityIndicators = [
    'peer-reviewed', 'published', 'journal', 'university', 'institute',
    'research', 'study', 'academic', 'scholar', 'professor', 'phd'
  ];

  credibilityIndicators.forEach(indicator => {
    if (text.includes(indicator)) {
      items.push({ type: 'Credibility Indicator', value: indicator });
      score += 2;
    }
  });

  // Check for dates (recent sources are more credible)
  const recentDates = text.match(/202[0-4]/g) || [];
  if (recentDates.length > 0) {
    items.push({ type: 'Recent Sources', value: `${recentDates.length} recent date references` });
    score += 5;
  }

  return { score: Math.min(20, score), items: items.slice(0, 10) };
}

function analyzeAuthorAttribution($, text) {
  const items = [];
  let score = 0;

  // Look for author information
  const authorSelectors = [
    '[rel="author"]',
    '.author',
    '.byline',
    '[itemprop="author"]'
  ];

  authorSelectors.forEach(selector => {
    $(selector).each((i, elem) => {
      const author = $(elem).text().trim();
      if (author) {
        items.push({ type: 'Author Attribution', value: author });
        score += 3;
      }
    });
  });

  // Look for author patterns in text
  const authorPatterns = [
    /by [A-Z][a-z]+ [A-Z][a-z]+/gi,
    /written by [A-Z][a-z]+ [A-Z][a-z]+/gi,
    /author: [A-Z][a-z]+ [A-Z][a-z]+/gi
  ];

  authorPatterns.forEach(pattern => {
    const matches = text.match(pattern) || [];
    matches.forEach(match => {
      items.push({ type: 'Author Pattern', value: match });
      score += 2;
    });
  });

  return { score: Math.min(20, score), items: items.slice(0, 6) };
}
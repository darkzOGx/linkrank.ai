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
          'User-Agent': 'GEO-Analysis-Protocol/1.0 (Expertise Markup Validator)',
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

      // Analyze expertise markup
      const expertiseAnalysis = {
        authorMarkup: analyzeAuthorMarkup($),
        organizationMarkup: analyzeOrganizationMarkup($),
        credentialsMarkup: analyzeCredentialsMarkup($, textContent),
        expertiseSignals: analyzeExpertiseSignals($, textContent),
        trustSignals: analyzeTrustSignals($, textContent)
      };

      // Calculate expertise score
      let expertiseScore = 0;
      Object.values(expertiseAnalysis).forEach(category => {
        expertiseScore += category.score;
      });

      const grade = expertiseScore >= 80 ? 'A' : expertiseScore >= 60 ? 'B' : expertiseScore >= 40 ? 'C' : expertiseScore >= 20 ? 'D' : 'F';

      // Generate optimized markup
      const optimizedMarkup = generateExpertiseMarkup($, expertiseAnalysis);

      // Generate recommendations
      const recommendations = [];
      const practicalImplementations = [];

      if (expertiseAnalysis.authorMarkup.score < 15) {
        recommendations.push('Add proper author markup with credentials and expertise indicators.');
        practicalImplementations.push({
          title: 'Add Author Markup with Expertise',
          code: optimizedMarkup.authorSchema,
          description: 'Implement structured data to showcase author expertise and credentials.'
        });
      }

      if (expertiseAnalysis.organizationMarkup.score < 15) {
        recommendations.push('Include organization markup with authority indicators.');
        practicalImplementations.push({
          title: 'Add Organization Authority Markup',
          code: optimizedMarkup.organizationSchema,
          description: 'Add structured data showing organizational expertise and credentials.'
        });
      }

      const result = {
        success: true,
        url: targetUrl,
        analysis: {
          expertiseScore: Math.round(expertiseScore),
          grade,
          breakdown: {
            authorMarkup: expertiseAnalysis.authorMarkup.score,
            organizationMarkup: expertiseAnalysis.organizationMarkup.score,
            credentialsMarkup: expertiseAnalysis.credentialsMarkup.score,
            expertiseSignals: expertiseAnalysis.expertiseSignals.score,
            trustSignals: expertiseAnalysis.trustSignals.score
          }
        },
        detectedMarkup: {
          authors: expertiseAnalysis.authorMarkup.items,
          organizations: expertiseAnalysis.organizationMarkup.items,
          credentials: expertiseAnalysis.credentialsMarkup.items,
          expertiseSignals: expertiseAnalysis.expertiseSignals.items,
          trustSignals: expertiseAnalysis.trustSignals.items
        },
        optimizedMarkup,
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
    console.error('Expertise markup validation error:', error);
    return res.status(500).json({ 
      error: 'Failed to validate expertise markup',
      details: error.message 
    });
  }
}

function analyzeAuthorMarkup($) {
  const items = [];
  let score = 0;

  // Check for author schema
  $('script[type="application/ld+json"]').each((i, elem) => {
    try {
      const jsonData = JSON.parse($(elem).html());
      if (jsonData['@type'] === 'Person' || jsonData.author) {
        items.push({ type: 'Author Schema', value: 'JSON-LD author markup found' });
        score += 10;
      }
    } catch (e) {
      // Invalid JSON
    }
  });

  // Check for author microdata
  $('[itemtype*="Person"]').each((i, elem) => {
    items.push({ type: 'Author Microdata', value: 'Person microdata found' });
    score += 8;
  });

  // Check for author attributes
  $('[rel="author"], .author, .byline, [itemprop="author"]').each((i, elem) => {
    const author = $(elem).text().trim();
    if (author) {
      items.push({ type: 'Author Markup', value: author });
      score += 5;
    }
  });

  return { score: Math.min(20, score), items: items.slice(0, 5) };
}

function analyzeOrganizationMarkup($) {
  const items = [];
  let score = 0;

  // Check for organization schema
  $('script[type="application/ld+json"]').each((i, elem) => {
    try {
      const jsonData = JSON.parse($(elem).html());
      if (jsonData['@type'] === 'Organization' || jsonData.publisher) {
        items.push({ type: 'Organization Schema', value: 'JSON-LD organization markup found' });
        score += 12;
      }
    } catch (e) {
      // Invalid JSON
    }
  });

  // Check for organization microdata
  $('[itemtype*="Organization"]').each((i, elem) => {
    items.push({ type: 'Organization Microdata', value: 'Organization microdata found' });
    score += 10;
  });

  // Check for publisher markup
  $('[itemprop="publisher"], .publisher').each((i, elem) => {
    const publisher = $(elem).text().trim();
    if (publisher) {
      items.push({ type: 'Publisher Markup', value: publisher });
      score += 6;
    }
  });

  return { score: Math.min(20, score), items: items.slice(0, 5) };
}

function analyzeCredentialsMarkup($, text) {
  const items = [];
  let score = 0;

  // Look for credential patterns
  const credentialPatterns = [
    /\b(?:PhD|Ph\.D\.|Doctor|Professor|Prof\.)\b/gi,
    /\b(?:MD|M\.D\.|DDS|JD|MBA|MSc|BSc)\b/gi,
    /\b(?:certified|accredited|licensed|board-certified)\b/gi,
    /\b(?:expert|specialist|authority|consultant)\b/gi
  ];

  credentialPatterns.forEach(pattern => {
    const matches = text.match(pattern) || [];
    matches.forEach(match => {
      items.push({ type: 'Credential Mention', value: match });
      score += 3;
    });
  });

  // Check for structured credential markup
  $('[itemprop*="credential"], [itemprop*="qualification"]').each((i, elem) => {
    const credential = $(elem).text().trim();
    if (credential) {
      items.push({ type: 'Structured Credential', value: credential });
      score += 8;
    }
  });

  return { score: Math.min(20, score), items: items.slice(0, 8) };
}

function analyzeExpertiseSignals($, text) {
  const items = [];
  let score = 0;

  // Look for expertise indicators
  const expertiseIndicators = [
    'years of experience', 'decade of experience', 'expert in', 'specialist in',
    'authority on', 'leading expert', 'recognized expert', 'industry expert',
    'published research', 'peer-reviewed', 'academic research', 'clinical experience'
  ];

  const textLower = text.toLowerCase();
  expertiseIndicators.forEach(indicator => {
    if (textLower.includes(indicator)) {
      items.push({ type: 'Expertise Indicator', value: indicator });
      score += 2;
    }
  });

  // Check for experience markup
  $('[itemprop*="experience"], .experience, .expertise').each((i, elem) => {
    const experience = $(elem).text().trim();
    if (experience && experience.length > 10) {
      items.push({ type: 'Experience Markup', value: experience.slice(0, 100) });
      score += 5;
    }
  });

  return { score: Math.min(20, score), items: items.slice(0, 10) };
}

function analyzeTrustSignals($, text) {
  const items = [];
  let score = 0;

  // Look for trust indicators
  const trustIndicators = [
    'peer-reviewed', 'published', 'journal', 'university', 'medical school',
    'hospital', 'clinic', 'board-certified', 'licensed', 'accredited',
    'award', 'recognition', 'fellowship', 'member of', 'association'
  ];

  const textLower = text.toLowerCase();
  trustIndicators.forEach(indicator => {
    if (textLower.includes(indicator)) {
      items.push({ type: 'Trust Indicator', value: indicator });
      score += 2;
    }
  });

  // Check for testimonials or reviews
  $('.testimonial, .review, [itemprop="review"]').each((i, elem) => {
    items.push({ type: 'Social Proof', value: 'Testimonial or review found' });
    score += 4;
  });

  return { score: Math.min(20, score), items: items.slice(0, 8) };
}

function generateExpertiseMarkup($, analysis) {
  const title = $('title').text().trim();
  const authorName = analysis.authorMarkup.items.find(item => item.value && item.value !== 'JSON-LD author markup found')?.value || 'Dr. Expert Name';
  const orgName = analysis.organizationMarkup.items.find(item => item.value && item.value !== 'JSON-LD organization markup found')?.value || 'Expert Organization';

  const authorSchema = `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "${authorName}",
  "jobTitle": "Medical Expert",
  "worksFor": {
    "@type": "Organization",
    "name": "${orgName}"
  },
  "hasCredential": [
    {
      "@type": "EducationalOccupationalCredential",
      "name": "Medical Degree",
      "credentialCategory": "Medical License"
    }
  ],
  "knowsAbout": [
    "Medical Practice",
    "Healthcare",
    "Patient Care"
  ],
  "url": "https://example.com/about-author"
}
</script>`;

  const organizationSchema = `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "${orgName}",
  "url": "https://example.com",
  "logo": "https://example.com/logo.png",
  "description": "Leading medical organization with certified experts",
  "hasCredential": {
    "@type": "EducationalOccupationalCredential",
    "name": "Medical Accreditation",
    "credentialCategory": "Organizational Certification"
  },
  "member": [
    {
      "@type": "Person",
      "name": "${authorName}",
      "hasCredential": {
        "@type": "EducationalOccupationalCredential",
        "name": "Medical License"
      }
    }
  ]
}
</script>`;

  return {
    authorSchema,
    organizationSchema
  };
}
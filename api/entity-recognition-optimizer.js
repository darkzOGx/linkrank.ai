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
          'User-Agent': 'GEO-Analysis-Protocol/1.0 (Entity Recognition Optimizer)',
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

      // Extract various entity types
      const entities = {
        people: extractPeople(textContent),
        organizations: extractOrganizations(textContent),
        locations: extractLocations(textContent),
        dates: extractDates(textContent),
        products: extractProducts(textContent),
        technologies: extractTechnologies(textContent),
        metrics: extractMetrics(textContent)
      };

      // Analyze structured data for entity markup
      const structuredDataEntities = analyzeStructuredDataEntities($);
      
      // Calculate entity recognition score
      let score = 0;
      const totalEntities = Object.values(entities).reduce((sum, arr) => sum + arr.length, 0);
      
      score += Math.min(25, totalEntities * 2);
      score += entities.people.length > 0 ? 15 : 0;
      score += entities.organizations.length > 0 ? 15 : 0;
      score += entities.locations.length > 0 ? 10 : 0;
      score += entities.dates.length > 0 ? 10 : 0;
      score += structuredDataEntities.length > 0 ? 25 : 0;

      const grade = score >= 80 ? 'A' : score >= 60 ? 'B' : score >= 40 ? 'C' : score >= 20 ? 'D' : 'F';

      const recommendations = [];
      const practicalImplementations = [];

      if (structuredDataEntities.length === 0) {
        recommendations.push('Add structured data markup to clearly identify entities for AI systems.');
        practicalImplementations.push({
          title: 'Add Person and Organization Schema Markup',
          code: `<!-- Schema markup for person entities -->
<div itemscope itemtype="https://schema.org/Person">
  <span itemprop="name">John Smith</span>, 
  <span itemprop="jobTitle">Chief Technology Officer</span> at 
  <span itemprop="worksFor" itemscope itemtype="https://schema.org/Organization">
    <span itemprop="name">TechCorp Inc.</span>
  </span>
</div>

<!-- JSON-LD for organization -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "${extractMainOrganization(textContent)}",
  "founder": {
    "@type": "Person",
    "name": "${entities.people[0]?.name || 'Company Founder'}"
  },
  "foundingDate": "${entities.dates[0]?.value || '2020'}",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "${entities.locations[0]?.name || 'City'}"
  }
}
</script>`,
          description: 'Use structured data to help AI systems identify and understand key entities in your content.'
        });
      }

      if (entities.people.length < 2) {
        recommendations.push('Include more named individuals with their roles and credentials.');
      }

      if (entities.organizations.length < 1) {
        recommendations.push('Reference relevant organizations, companies, or institutions.');
      }

      const result = {
        success: true,
        url: targetUrl,
        analysis: {
          entityScore: score,
          grade,
          totalEntities,
          entityDistribution: {
            people: entities.people.length,
            organizations: entities.organizations.length,
            locations: entities.locations.length,
            dates: entities.dates.length,
            products: entities.products.length,
            technologies: entities.technologies.length,
            metrics: entities.metrics.length
          },
          structuredDataEntities: structuredDataEntities.length
        },
        entities,
        structuredDataEntities,
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
    console.error('Entity recognition optimization error:', error);
    return res.status(500).json({ 
      error: 'Failed to optimize entity recognition',
      details: error.message 
    });
  }
}

function extractPeople(text) {
  const people = [];
  
  // Pattern for names with titles
  const namePatterns = [
    /(?:Dr\.?|Prof\.?|Mr\.?|Ms\.?|Mrs\.?)\s+([A-Z][a-z]+\s+[A-Z][a-z]+)/g,
    /([A-Z][a-z]+\s+[A-Z][a-z]+),?\s+(?:CEO|CTO|CFO|President|Director|Manager|Engineer|Scientist)/g,
    /(?:founded by|created by|developed by)\s+([A-Z][a-z]+\s+[A-Z][a-z]+)/g
  ];

  namePatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const name = match[1];
      if (name && !people.find(p => p.name === name)) {
        people.push({
          name,
          type: 'person',
          context: extractContext(text, name)
        });
      }
    }
  });

  return people.slice(0, 10);
}

function extractOrganizations(text) {
  const organizations = [];
  
  // Pattern for company names
  const orgPatterns = [
    /([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)*)\s+(?:Inc\.?|LLC|Corp\.?|Corporation|Company|Ltd\.?|Limited)/g,
    /(?:at|from|with)\s+([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)*)\s+(?:Inc\.?|LLC|Corp\.?|Corporation|Company)/g,
    /([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)*)\s+(?:University|Institute|Foundation|Agency)/g
  ];

  orgPatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const name = match[1];
      if (name && name.length > 2 && !organizations.find(o => o.name === name)) {
        organizations.push({
          name,
          type: 'organization',
          context: extractContext(text, name)
        });
      }
    }
  });

  return organizations.slice(0, 8);
}

function extractLocations(text) {
  const locations = [];
  
  // Common location patterns
  const locationPatterns = [
    /(?:in|from|at|located in)\s+([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)*),?\s+(?:California|New York|Texas|Florida|Illinois|Pennsylvania|Ohio|Georgia|North Carolina|Michigan|USA|United States)/g,
    /([A-Z][a-zA-Z]+),\s+(California|New York|Texas|Florida|Illinois|Pennsylvania|Ohio|Georgia|North Carolina|Michigan)/g,
    /(?:in|from|at)\s+([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)*),?\s+(?:UK|United Kingdom|Canada|Australia|Germany|France|Japan|China)/g
  ];

  locationPatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const name = match[1];
      if (name && !locations.find(l => l.name === name)) {
        locations.push({
          name,
          type: 'location',
          context: extractContext(text, name)
        });
      }
    }
  });

  return locations.slice(0, 6);
}

function extractDates(text) {
  const dates = [];
  
  // Date patterns
  const datePatterns = [
    /(?:since|in|during|from)\s+(19|20)\d{2}/g,
    /(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+(19|20)\d{2}/g
  ];

  datePatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      dates.push({
        value: match[0],
        type: 'date',
        context: extractContext(text, match[0])
      });
    }
  });

  return dates.slice(0, 5);
}

function extractProducts(text) {
  const products = [];
  
  // Product name patterns (simplified)
  const productPatterns = [
    /([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z0-9]+)*)\s+(?:software|platform|system|tool|application|app|service|solution)/g,
    /(?:using|with|via)\s+([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z0-9]+)*)\s+(?:platform|system|tool)/g
  ];

  productPatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const name = match[1];
      if (name && name.length > 2 && !products.find(p => p.name === name)) {
        products.push({
          name,
          type: 'product',
          context: extractContext(text, name)
        });
      }
    }
  });

  return products.slice(0, 5);
}

function extractTechnologies(text) {
  const technologies = [];
  
  // Common technology terms
  const techTerms = [
    'JavaScript', 'Python', 'React', 'Node.js', 'AWS', 'Azure', 'Docker', 'Kubernetes',
    'Machine Learning', 'AI', 'Artificial Intelligence', 'Blockchain', 'API', 'REST API',
    'GraphQL', 'MongoDB', 'PostgreSQL', 'Redis', 'Elasticsearch'
  ];

  techTerms.forEach(term => {
    const regex = new RegExp(`\\b${term}\\b`, 'gi');
    if (regex.test(text)) {
      technologies.push({
        name: term,
        type: 'technology',
        context: extractContext(text, term)
      });
    }
  });

  return technologies.slice(0, 8);
}

function extractMetrics(text) {
  const metrics = [];
  
  // Metric patterns
  const metricPatterns = [
    /(\d+(?:\.\d+)?)\s*(?:%|percent|percentage)/g,
    /\$(\d+(?:,\d{3})*(?:\.\d{2})?)/g,
    /(\d+(?:,\d{3})*)\s+(?:users|customers|people|employees|downloads)/g
  ];

  metricPatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      metrics.push({
        value: match[0],
        type: 'metric',
        context: extractContext(text, match[0])
      });
    }
  });

  return metrics.slice(0, 8);
}

function analyzeStructuredDataEntities($) {
  const entities = [];
  
  // Check for schema.org markup
  $('script[type="application/ld+json"]').each((i, elem) => {
    try {
      const jsonData = JSON.parse($(elem).html());
      if (jsonData['@type']) {
        entities.push({
          type: jsonData['@type'],
          markup: 'JSON-LD',
          properties: Object.keys(jsonData).filter(key => key !== '@context' && key !== '@type')
        });
      }
    } catch (e) {
      // Invalid JSON
    }
  });
  
  // Check for microdata
  $('[itemtype]').each((i, elem) => {
    const type = $(elem).attr('itemtype');
    if (type) {
      entities.push({
        type: type.split('/').pop(),
        markup: 'Microdata',
        properties: $(elem).find('[itemprop]').map((j, prop) => $(prop).attr('itemprop')).get()
      });
    }
  });

  return entities;
}

function extractContext(text, term) {
  const index = text.indexOf(term);
  if (index === -1) return '';
  const start = Math.max(0, index - 50);
  const end = Math.min(text.length, index + term.length + 50);
  return text.substring(start, end).replace(/\s+/g, ' ').trim();
}

function extractMainOrganization(text) {
  const orgs = extractOrganizations(text);
  return orgs.length > 0 ? orgs[0].name : 'Your Company';
}
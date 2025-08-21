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
          'User-Agent': 'GEO-Analysis-Protocol/1.0 (Knowledge Panel Optimizer)',
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
      const title = $('title').text().trim();
      const h1 = $('h1').first().text().trim();
      const domain = new URL(targetUrl).hostname;

      // Analyze knowledge panel optimization factors
      const panelAnalysis = {
        entityIdentification: analyzeEntityIdentification($, textContent, title, h1),
        structuredData: analyzeKnowledgeStructuredData($),
        keyFacts: analyzeKeyFacts(textContent),
        definitions: analyzeDefinitions(textContent),
        relationships: analyzeEntityRelationships(textContent),
        multimedia: analyzeMultimediaContent($)
      };

      // Calculate knowledge panel score
      let panelScore = 0;
      Object.values(panelAnalysis).forEach(category => {
        panelScore += category.score;
      });

      const grade = panelScore >= 80 ? 'A' : panelScore >= 60 ? 'B' : panelScore >= 40 ? 'C' : panelScore >= 20 ? 'D' : 'F';

      // Generate knowledge panel schema
      const knowledgeSchema = generateKnowledgePanelSchema(title, h1, panelAnalysis, domain);

      // Generate recommendations
      const recommendations = [];
      const practicalImplementations = [];

      if (panelAnalysis.entityIdentification.score < 15) {
        recommendations.push('Clearly define the main entity and its type for better knowledge panel recognition.');
        practicalImplementations.push({
          title: 'Optimize Entity Identification for Knowledge Panels',
          code: knowledgeSchema,
          description: 'Implement comprehensive structured data to help AI systems create knowledge panels about your entity.'
        });
      }

      if (panelAnalysis.keyFacts.score < 10) {
        recommendations.push('Add more key facts and statistics that would appear in a knowledge panel.');
      }

      if (panelAnalysis.definitions.score < 10) {
        recommendations.push('Include clear, concise definitions for better knowledge panel extraction.');
      }

      const result = {
        success: true,
        url: targetUrl,
        analysis: {
          knowledgePanelScore: Math.round(panelScore),
          grade,
          entityType: panelAnalysis.entityIdentification.primaryType,
          breakdown: {
            entityIdentification: panelAnalysis.entityIdentification.score,
            structuredData: panelAnalysis.structuredData.score,
            keyFacts: panelAnalysis.keyFacts.score,
            definitions: panelAnalysis.definitions.score,
            relationships: panelAnalysis.relationships.score,
            multimedia: panelAnalysis.multimedia.score
          }
        },
        detectedElements: {
          entities: panelAnalysis.entityIdentification.entities,
          keyFacts: panelAnalysis.keyFacts.facts,
          definitions: panelAnalysis.definitions.items,
          relationships: panelAnalysis.relationships.items,
          multimedia: panelAnalysis.multimedia.items
        },
        optimizedSchema: knowledgeSchema,
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
    console.error('Knowledge panel optimization error:', error);
    return res.status(500).json({ 
      error: 'Failed to optimize knowledge panel',
      details: error.message 
    });
  }
}

function analyzeEntityIdentification($, text, title, h1) {
  const entities = [];
  let score = 0;
  let primaryType = 'Organization'; // Default

  // Determine entity type
  const entityPatterns = {
    Person: /\b(?:CEO|founder|author|doctor|professor|expert)\b/gi,
    Organization: /\b(?:company|corporation|business|organization|agency)\b/gi,
    Product: /\b(?:software|tool|platform|service|application)\b/gi,
    Place: /\b(?:located|headquarters|address|city|country)\b/gi
  };

  Object.entries(entityPatterns).forEach(([type, pattern]) => {
    const matches = text.match(pattern) || [];
    if (matches.length > 0) {
      entities.push({ type, matches: matches.length });
      if (matches.length > 2) primaryType = type;
      score += matches.length * 2;
    }
  });

  // Check for clear entity identification
  if (h1 && title && h1.toLowerCase() === title.toLowerCase()) {
    score += 10;
    entities.push({ type: 'Clear Identity', value: 'Title-H1 alignment' });
  }

  return {
    score: Math.min(20, score),
    entities,
    primaryType
  };
}

function analyzeKnowledgeStructuredData($) {
  let score = 0;
  const items = [];

  // Check for relevant schema types
  $('script[type="application/ld+json"]').each((i, elem) => {
    try {
      const jsonData = JSON.parse($(elem).html());
      const type = jsonData['@type'];
      
      if (['Organization', 'Person', 'Product', 'Place', 'Thing'].includes(type)) {
        items.push({ type: 'Schema Type', value: type });
        score += 15;
      }
    } catch (e) {
      // Invalid JSON
    }
  });

  // Check for microdata
  const microdataItems = $('[itemscope]').length;
  if (microdataItems > 0) {
    items.push({ type: 'Microdata', value: `${microdataItems} items` });
    score += 5;
  }

  return { score: Math.min(20, score), items };
}

function analyzeKeyFacts(text) {
  const facts = [];
  let score = 0;

  // Extract numerical facts
  const numericalFacts = [
    /founded in \d{4}/gi,
    /established \d{4}/gi,
    /\d+(?:,\d{3})* (?:employees|users|customers|clients)/gi,
    /\$[\d,]+(?:\.\d{2})? (?:revenue|profit|valuation)/gi,
    /\d+(?:\.\d+)?% (?:growth|increase|market share)/gi
  ];

  numericalFacts.forEach(pattern => {
    const matches = text.match(pattern) || [];
    matches.forEach(match => {
      facts.push({ type: 'Numerical Fact', value: match });
      score += 3;
    });
  });

  // Extract location facts
  const locationFacts = text.match(/(?:headquartered|located|based) in [A-Z][a-zA-Z\s,]+/gi) || [];
  locationFacts.forEach(fact => {
    facts.push({ type: 'Location Fact', value: fact });
    score += 4;
  });

  return { score: Math.min(15, score), facts: facts.slice(0, 10) };
}

function analyzeDefinitions(text) {
  const items = [];
  let score = 0;

  // Look for definition patterns
  const definitionPatterns = [
    /[A-Z][^.!?]+ is (?:a|an) [^.!?]+\./g,
    /[A-Z][^.!?]+ refers to [^.!?]+\./g,
    /[A-Z][^.!?]+ means [^.!?]+\./g
  ];

  definitionPatterns.forEach(pattern => {
    const matches = text.match(pattern) || [];
    matches.forEach(match => {
      if (match.length < 200) { // Keep definitions concise
        items.push({ type: 'Definition', value: match });
        score += 5;
      }
    });
  });

  return { score: Math.min(15, score), items: items.slice(0, 5) };
}

function analyzeEntityRelationships(text) {
  const items = [];
  let score = 0;

  // Look for relationship patterns
  const relationshipPatterns = [
    /(?:subsidiary of|owned by|part of|division of) [A-Z][a-zA-Z\s]+/gi,
    /(?:founded by|created by|developed by) [A-Z][a-zA-Z\s]+/gi,
    /(?:partnered with|affiliated with|works with) [A-Z][a-zA-Z\s]+/gi,
    /(?:competitor to|similar to|alternative to) [A-Z][a-zA-Z\s]+/gi
  ];

  relationshipPatterns.forEach(pattern => {
    const matches = text.match(pattern) || [];
    matches.forEach(match => {
      items.push({ type: 'Relationship', value: match });
      score += 3;
    });
  });

  return { score: Math.min(15, score), items: items.slice(0, 8) };
}

function analyzeMultimediaContent($) {
  const items = [];
  let score = 0;

  // Check for images with alt text
  const images = $('img[alt]').length;
  if (images > 0) {
    items.push({ type: 'Images', value: `${images} images with alt text` });
    score += Math.min(5, images);
  }

  // Check for videos
  const videos = $('video, iframe[src*="youtube"], iframe[src*="vimeo"]').length;
  if (videos > 0) {
    items.push({ type: 'Videos', value: `${videos} video elements` });
    score += videos * 2;
  }

  // Check for logo
  const logo = $('img[alt*="logo"], .logo img, [class*="logo"] img').length;
  if (logo > 0) {
    items.push({ type: 'Logo', value: 'Logo image detected' });
    score += 3;
  }

  return { score: Math.min(15, score), items };
}

function generateKnowledgePanelSchema(title, h1, analysis, domain) {
  const entityName = h1 || title || 'Entity Name';
  const entityType = analysis.entityIdentification.primaryType;
  
  const baseSchema = {
    "@context": "https://schema.org",
    "@type": entityType,
    "name": entityName,
    "url": `https://${domain}`,
    "description": `${entityName} - ${analysis.definitions.items[0]?.value || 'Description of the entity'}`
  };

  // Add type-specific properties
  if (entityType === 'Organization') {
    baseSchema.foundingDate = analysis.keyFacts.facts.find(f => f.value.includes('founded'))?.value.match(/\d{4}/)?.[0];
    baseSchema.logo = `https://${domain}/logo.png`;
    baseSchema.contactPoint = {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "url": `https://${domain}/contact`
    };
  }

  if (entityType === 'Person') {
    baseSchema.jobTitle = "Professional Title";
    baseSchema.worksFor = {
      "@type": "Organization",
      "name": "Organization Name"
    };
  }

  if (entityType === 'Product') {
    baseSchema.manufacturer = {
      "@type": "Organization",
      "name": "Manufacturer Name"
    };
    baseSchema.category = "Product Category";
  }

  // Add facts as additional properties
  if (analysis.keyFacts.facts.length > 0) {
    baseSchema.additionalProperty = analysis.keyFacts.facts.slice(0, 3).map(fact => ({
      "@type": "PropertyValue",
      "name": "Key Fact",
      "value": fact.value
    }));
  }

  return `<script type="application/ld+json">
${JSON.stringify(baseSchema, null, 2)}
</script>`;
}
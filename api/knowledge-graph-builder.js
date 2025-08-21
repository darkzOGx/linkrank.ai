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
          'User-Agent': 'GEO-Analysis-Protocol/1.0 (Knowledge Graph Builder)',
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

      // Extract knowledge graph elements
      const entities = extractEntities(textContent);
      const relationships = extractRelationships(textContent, entities);
      const concepts = extractConcepts(textContent, headings);
      const factTriples = buildFactTriples(textContent, entities);
      
      // Analyze existing structured data
      const existingKnowledgeGraph = analyzeExistingKG($);
      
      // Calculate knowledge graph completeness score
      let score = 0;
      score += Math.min(30, entities.length * 3);
      score += Math.min(25, relationships.length * 5);
      score += Math.min(25, concepts.length * 4);
      score += existingKnowledgeGraph.schemas.length > 0 ? 20 : 0;

      const grade = score >= 80 ? 'A' : score >= 60 ? 'B' : score >= 40 ? 'C' : score >= 20 ? 'D' : 'F';

      // Generate knowledge graph visualization data
      const graphData = buildGraphVisualization(entities, relationships, concepts);

      const recommendations = [];
      const practicalImplementations = [];

      if (existingKnowledgeGraph.schemas.length === 0) {
        recommendations.push('Add structured data markup to create machine-readable knowledge connections.');
        practicalImplementations.push({
          title: 'Create Knowledge Graph Schema',
          code: `<!-- JSON-LD Knowledge Graph for ${title || 'your content'} -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "headline": "${title || 'Main Topic'}",
      "author": {
        "@type": "Person",
        "name": "${entities.find(e => e.type === 'person')?.name || 'Author Name'}"
      },
      "about": [
        ${concepts.slice(0, 3).map(concept => `{
          "@type": "Thing",
          "name": "${concept.name}",
          "description": "${concept.description}"
        }`).join(',\n        ')}
      ],
      "mentions": [
        ${entities.filter(e => e.type === 'organization').slice(0, 2).map(entity => `{
          "@type": "Organization",
          "name": "${entity.name}"
        }`).join(',\n        ')}
      ]
    }
  ]
}
</script>`,
          description: 'Build a comprehensive knowledge graph that connects all key concepts, entities, and relationships in your content.'
        });
      }

      if (relationships.length < 5) {
        recommendations.push('Add more explicit relationships between concepts to strengthen knowledge connections.');
      }

      if (concepts.length < 3) {
        recommendations.push('Define key concepts more clearly with detailed explanations.');
      }

      const result = {
        success: true,
        url: targetUrl,
        analysis: {
          knowledgeGraphScore: score,
          grade,
          totalEntities: entities.length,
          totalRelationships: relationships.length,
          totalConcepts: concepts.length,
          existingSchemas: existingKnowledgeGraph.schemas.length
        },
        knowledgeGraph: {
          entities: entities.slice(0, 15),
          relationships: relationships.slice(0, 10),
          concepts: concepts.slice(0, 8),
          factTriples: factTriples.slice(0, 12)
        },
        graphVisualization: graphData,
        existingKnowledgeGraph,
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
    console.error('Knowledge graph building error:', error);
    return res.status(500).json({ 
      error: 'Failed to build knowledge graph',
      details: error.message 
    });
  }
}

function extractEntities(text) {
  const entities = [];
  
  // Person entities
  const personPattern = /([A-Z][a-z]+\s+[A-Z][a-z]+)(?:\s*,\s*(?:CEO|CTO|CFO|President|Director|founder|co-founder))/g;
  let match;
  while ((match = personPattern.exec(text)) !== null) {
    entities.push({
      name: match[1],
      type: 'person',
      id: `person_${entities.filter(e => e.type === 'person').length}`,
      description: `Person mentioned in content: ${match[1]}`
    });
  }

  // Organization entities  
  const orgPattern = /([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)*)\s+(?:Inc\.?|LLC|Corp\.?|Corporation|Company|Ltd\.?|Limited|University|Institute)/g;
  while ((match = orgPattern.exec(text)) !== null) {
    entities.push({
      name: match[1],
      type: 'organization',
      id: `org_${entities.filter(e => e.type === 'organization').length}`,
      description: `Organization referenced: ${match[1]}`
    });
  }

  // Technology entities
  const techTerms = ['JavaScript', 'Python', 'React', 'Node.js', 'AI', 'Machine Learning', 'Blockchain', 'Cloud Computing'];
  techTerms.forEach(term => {
    if (text.includes(term)) {
      entities.push({
        name: term,
        type: 'technology',
        id: `tech_${term.replace(/\s+/g, '_').toLowerCase()}`,
        description: `Technology mentioned: ${term}`
      });
    }
  });

  return entities.slice(0, 15);
}

function extractRelationships(text, entities) {
  const relationships = [];
  
  // Relationship patterns
  const relationshipPatterns = [
    { pattern: /([A-Z][a-zA-Z\s]+)\s+(?:is|are)\s+(?:a|an|the)?\s*([a-z][a-zA-Z\s]+)/, type: 'is_a' },
    { pattern: /([A-Z][a-zA-Z\s]+)\s+(?:uses|utilizes|employs)\s+([A-Z][a-zA-Z\s]+)/, type: 'uses' },
    { pattern: /([A-Z][a-zA-Z\s]+)\s+(?:founded|created|developed)\s+([A-Z][a-zA-Z\s]+)/, type: 'created' },
    { pattern: /([A-Z][a-zA-Z\s]+)\s+(?:works\s+at|is\s+employed\s+by)\s+([A-Z][a-zA-Z\s]+)/, type: 'works_at' },
    { pattern: /([A-Z][a-zA-Z\s]+)\s+(?:partnered\s+with|collaborated\s+with)\s+([A-Z][a-zA-Z\s]+)/, type: 'partners_with' }
  ];

  relationshipPatterns.forEach(({ pattern, type }) => {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const subject = match[1].trim();
      const object = match[2].trim();
      
      // Check if both entities exist in our extracted entities
      const subjectEntity = entities.find(e => e.name === subject);
      const objectEntity = entities.find(e => e.name === object);
      
      if (subjectEntity || objectEntity) {
        relationships.push({
          subject: subject,
          predicate: type,
          object: object,
          confidence: 0.8,
          context: extractContext(text, match[0])
        });
      }
    }
  });

  return relationships.slice(0, 10);
}

function extractConcepts(text, headings) {
  const concepts = [];
  
  // Use headings as primary concepts
  headings.forEach((heading, index) => {
    if (heading.length > 5 && heading.length < 100) {
      // Find the section content for this heading
      const description = extractSectionContent(text, heading);
      
      concepts.push({
        name: heading,
        type: 'concept',
        id: `concept_${index}`,
        description: description.slice(0, 200) + (description.length > 200 ? '...' : ''),
        importance: calculateConceptImportance(heading, text)
      });
    }
  });

  // Extract key phrases as concepts
  const keyPhrasePattern = /(?:the concept of|understanding|definition of|approach to|method of)\s+([a-z][a-zA-Z\s]{10,50})/gi;
  let match;
  while ((match = keyPhrasePattern.exec(text)) !== null) {
    const concept = match[1].trim();
    if (!concepts.find(c => c.name.toLowerCase() === concept.toLowerCase())) {
      concepts.push({
        name: concept,
        type: 'concept',
        id: `concept_${concepts.length}`,
        description: extractContext(text, concept),
        importance: 0.6
      });
    }
  }

  return concepts.slice(0, 8);
}

function buildFactTriples(text, entities) {
  const triples = [];
  
  // Extract numerical facts
  const numericalPattern = /([A-Z][a-zA-Z\s]+)\s+(?:has|have|contains|includes)\s+(\d+(?:,\d{3})*(?:\.\d+)?)\s*([a-zA-Z\s]+)/g;
  let match;
  while ((match = numericalPattern.exec(text)) !== null) {
    triples.push({
      subject: match[1].trim(),
      predicate: 'has_metric',
      object: `${match[2]} ${match[3].trim()}`,
      type: 'numerical_fact',
      confidence: 0.9
    });
  }

  // Extract temporal facts
  const temporalPattern = /([A-Z][a-zA-Z\s]+)\s+(?:since|from|in|during)\s+(19|20)\d{2}/g;
  while ((match = temporalPattern.exec(text)) !== null) {
    triples.push({
      subject: match[1].trim(),
      predicate: 'temporal_reference',
      object: match[2],
      type: 'temporal_fact',
      confidence: 0.8
    });
  }

  // Extract categorical facts
  const categoricalPattern = /([A-Z][a-zA-Z\s]+)\s+is\s+(?:a|an)\s+([a-z][a-zA-Z\s]+)/g;
  while ((match = categoricalPattern.exec(text)) !== null) {
    triples.push({
      subject: match[1].trim(),
      predicate: 'is_type_of',
      object: match[2].trim(),
      type: 'categorical_fact',
      confidence: 0.7
    });
  }

  return triples.slice(0, 12);
}

function analyzeExistingKG($) {
  const schemas = [];
  
  // Check for existing schema markup
  $('script[type="application/ld+json"]').each((i, elem) => {
    try {
      const jsonData = JSON.parse($(elem).html());
      schemas.push({
        type: jsonData['@type'] || 'Unknown',
        hasGraph: !!jsonData['@graph'],
        properties: Object.keys(jsonData).length,
        context: jsonData['@context'] || 'None'
      });
    } catch (e) {
      // Invalid JSON
    }
  });

  return {
    schemas,
    hasMicrodata: $('[itemscope]').length > 0,
    hasRDFa: $('[property]').length > 0
  };
}

function buildGraphVisualization(entities, relationships, concepts) {
  const nodes = [];
  const links = [];

  // Add entity nodes
  entities.forEach(entity => {
    nodes.push({
      id: entity.id,
      name: entity.name,
      type: entity.type,
      size: entity.type === 'person' ? 15 : entity.type === 'organization' ? 12 : 8
    });
  });

  // Add concept nodes
  concepts.forEach(concept => {
    nodes.push({
      id: concept.id,
      name: concept.name,
      type: 'concept',
      size: 10
    });
  });

  // Add relationship links
  relationships.forEach((rel, index) => {
    const sourceNode = nodes.find(n => n.name === rel.subject);
    const targetNode = nodes.find(n => n.name === rel.object);
    
    if (sourceNode && targetNode) {
      links.push({
        source: sourceNode.id,
        target: targetNode.id,
        relationship: rel.predicate,
        strength: rel.confidence
      });
    }
  });

  return {
    nodes: nodes.slice(0, 20),
    links: links.slice(0, 15)
  };
}

function extractContext(text, term) {
  const index = text.indexOf(term);
  if (index === -1) return '';
  const start = Math.max(0, index - 40);
  const end = Math.min(text.length, index + term.length + 40);
  return text.substring(start, end).replace(/\s+/g, ' ').trim();
}

function extractSectionContent(text, heading) {
  const headingIndex = text.indexOf(heading);
  if (headingIndex === -1) return '';
  
  const start = headingIndex + heading.length;
  const end = Math.min(text.length, start + 300);
  return text.substring(start, end).trim();
}

function calculateConceptImportance(concept, text) {
  const mentions = (text.match(new RegExp(concept, 'gi')) || []).length;
  const normalized = Math.min(1.0, mentions / 5);
  return Math.round(normalized * 100) / 100;
}
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
          'User-Agent': 'GEO-Analysis-Protocol/1.0 (AI Snippet Optimizer)',
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
      
      const title = $('title').text().trim();
      const metaDescription = $('meta[name="description"]').attr('content') || '';
      const h1 = $('h1').first().text().trim();
      const textContent = $('body').text();

      // Analyze current snippet potential
      const snippetAnalysis = analyzeSnippetElements($, textContent);
      
      // Generate optimized snippets for different AI platforms
      const optimizedSnippets = generateOptimizedSnippets(title, h1, textContent, snippetAnalysis);
      
      // Calculate snippet optimization score
      let score = 0;
      score += snippetAnalysis.titleOptimization;
      score += snippetAnalysis.descriptionOptimization;
      score += snippetAnalysis.contentStructure;
      score += snippetAnalysis.answerFormat;
      
      const grade = score >= 80 ? 'A' : score >= 60 ? 'B' : score >= 40 ? 'C' : score >= 20 ? 'D' : 'F';

      const recommendations = [];
      const practicalImplementations = [];

      if (snippetAnalysis.titleOptimization < 20) {
        recommendations.push('Optimize title for better AI snippet extraction.');
        practicalImplementations.push({
          title: 'Optimize Page Title for AI Snippets',
          code: `<!-- Current title optimization -->
<title>${optimizedSnippets.chatgpt.title}</title>
<meta name="description" content="${optimizedSnippets.chatgpt.description}">

<!-- Add structured data for better extraction -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "${optimizedSnippets.chatgpt.title}",
  "description": "${optimizedSnippets.chatgpt.description}",
  "mainEntity": {
    "@type": "Thing",
    "name": "${h1 || title}",
    "description": "${optimizedSnippets.chatgpt.keyPoints[0] || 'Main topic description'}"
  }
}
</script>`,
          description: 'Optimize your page title and meta description for better AI snippet generation.'
        });
      }

      const result = {
        success: true,
        url: targetUrl,
        analysis: {
          snippetScore: Math.round(score),
          grade,
          currentElements: {
            title: title,
            metaDescription: metaDescription,
            h1: h1,
            titleLength: title.length,
            descriptionLength: metaDescription.length
          },
          optimizationBreakdown: snippetAnalysis
        },
        optimizedSnippets,
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
    console.error('AI snippet optimization error:', error);
    return res.status(500).json({ 
      error: 'Failed to optimize AI snippets',
      details: error.message 
    });
  }
}

function analyzeSnippetElements($, textContent) {
  const title = $('title').text().trim();
  const metaDesc = $('meta[name="description"]').attr('content') || '';
  const h1 = $('h1').first().text().trim();
  
  // Title optimization (0-25 points)
  let titleScore = 0;
  if (title.length >= 30 && title.length <= 60) titleScore += 15;
  if (title.includes('?') || title.includes('how') || title.includes('what')) titleScore += 10;
  
  // Description optimization (0-25 points)
  let descScore = 0;
  if (metaDesc.length >= 120 && metaDesc.length <= 160) descScore += 15;
  if (metaDesc.includes('learn') || metaDesc.includes('discover') || metaDesc.includes('find out')) descScore += 10;
  
  // Content structure (0-25 points)
  let structureScore = 0;
  const headings = $('h1, h2, h3').length;
  const lists = $('ul, ol').length;
  const paragraphs = $('p').length;
  
  structureScore += Math.min(15, headings * 3);
  structureScore += Math.min(10, lists * 5);
  
  // Answer format (0-25 points)
  let answerScore = 0;
  const sentences = textContent.split(/[.!?]+/).filter(s => s.trim().length > 20);
  const definitions = sentences.filter(s => s.includes(' is ') || s.includes(' are ')).length;
  const explanations = sentences.filter(s => s.includes('because') || s.includes('therefore')).length;
  
  answerScore += Math.min(15, definitions * 5);
  answerScore += Math.min(10, explanations * 3);
  
  return {
    titleOptimization: titleScore,
    descriptionOptimization: descScore,
    contentStructure: structureScore,
    answerFormat: answerScore
  };
}

function generateOptimizedSnippets(title, h1, textContent, analysis) {
  const topic = h1 || title || 'this topic';
  const sentences = textContent.split(/[.!?]+/).filter(s => s.trim().length > 20);
  
  // Extract key points
  const keyPoints = sentences
    .filter(s => s.includes(' is ') || s.includes(' are ') || s.includes('because'))
    .slice(0, 3)
    .map(s => s.trim().slice(0, 100) + (s.length > 100 ? '...' : ''));
  
  return {
    chatgpt: {
      title: `What is ${topic}? Complete Guide & Benefits`,
      description: `Discover everything about ${topic}. Learn key benefits, how it works, and practical applications. Expert insights and proven strategies included.`,
      keyPoints: keyPoints.length > 0 ? keyPoints : [
        `${topic} is a comprehensive solution that provides significant benefits`,
        `Understanding ${topic} helps improve outcomes and efficiency`,
        `Implementation of ${topic} requires proper planning and execution`
      ],
      format: 'Comprehensive answer with bullet points'
    },
    claude: {
      title: `${topic}: Definition, Benefits & Implementation Guide`,
      description: `Learn about ${topic} with detailed explanations, practical benefits, and step-by-step implementation guidance from industry experts.`,
      keyPoints: keyPoints.length > 0 ? keyPoints : [
        `${topic} definition and core concepts explained`,
        `Key benefits and advantages for users`,
        `Practical implementation strategies and best practices`
      ],
      format: 'Structured explanation with examples'
    },
    gemini: {
      title: `How ${topic} Works: Benefits, Uses & Expert Tips`,
      description: `Comprehensive guide to ${topic}. Explore how it works, key benefits, real-world applications, and expert recommendations for success.`,
      keyPoints: keyPoints.length > 0 ? keyPoints : [
        `How ${topic} functions and operates`,
        `Real-world applications and use cases`,
        `Expert tips for optimal results`
      ],
      format: 'Detailed guide with practical examples'
    },
    perplexity: {
      title: `${topic}: Complete Analysis & Implementation`,
      description: `Research-backed insights on ${topic}. Comprehensive analysis with sources, implementation steps, and evidence-based recommendations for optimal results.`,
      keyPoints: keyPoints.length > 0 ? keyPoints : [
        `Research-based analysis of ${topic}`,
        `Evidence-backed implementation methods`,
        `Source-verified best practices and outcomes`
      ],
      format: 'Research-focused with source citations'
    }
  };
}
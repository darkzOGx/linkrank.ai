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
          'User-Agent': 'GEO-Analysis-Protocol/1.0 (AI Traffic Estimator)',
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
      const domain = new URL(targetUrl).hostname;

      // Analyze content for AI traffic potential
      const contentAnalysis = analyzeContentForAI(textContent, $);
      const topicAnalysis = analyzeTopicRelevance(title, textContent);
      const structuredDataAnalysis = analyzeStructuredData($);
      
      // Estimate traffic from different AI sources
      const trafficEstimates = {
        chatgptCitations: estimateChatGPTTraffic(contentAnalysis, topicAnalysis),
        claudeReferences: estimateClaudeTraffic(contentAnalysis, topicAnalysis),
        bingCopilot: estimateBingCopilotTraffic(contentAnalysis, topicAnalysis),
        googleBard: estimateGoogleBardTraffic(contentAnalysis, topicAnalysis),
        voiceAssistants: estimateVoiceTraffic(contentAnalysis, topicAnalysis)
      };

      // Calculate total potential
      const totalMonthlyEstimate = Object.values(trafficEstimates).reduce((sum, source) => sum + source.monthlyVisits, 0);
      
      // Generate optimization recommendations
      const recommendations = [];
      const practicalImplementations = [];

      if (contentAnalysis.factDensity < 30) {
        recommendations.push('Increase factual content density to improve AI citation potential.');
        practicalImplementations.push({
          title: 'Boost AI Traffic with Fact-Rich Content',
          code: `<!-- Add specific, citable facts throughout your content -->
<section class="key-statistics">
  <h2>Industry-Leading Performance</h2>
  <div class="stats-grid">
    <div class="stat">
      <strong>98.7%</strong>
      <span>Customer satisfaction rate</span>
    </div>
    <div class="stat">
      <strong>50,000+</strong>
      <span>Users served since 2020</span>
    </div>
    <div class="stat">
      <strong>35%</strong>
      <span>Average efficiency improvement</span>
    </div>
    <div class="stat">
      <strong>24/7</strong>
      <span>Expert support availability</span>
    </div>
  </div>
</section>`,
          description: 'Add specific statistics and data points that AI systems can easily extract and cite.'
        });
      }

      const result = {
        success: true,
        url: targetUrl,
        analysis: {
          totalMonthlyEstimate: Math.round(totalMonthlyEstimate),
          confidenceLevel: calculateConfidence(contentAnalysis, topicAnalysis),
          contentOptimization: Math.round((contentAnalysis.factDensity + contentAnalysis.structureScore + topicAnalysis.relevanceScore) / 3),
          breakdown: {
            factDensity: contentAnalysis.factDensity,
            structureScore: contentAnalysis.structureScore,
            topicRelevance: topicAnalysis.relevanceScore,
            aiReadiness: structuredDataAnalysis.score
          }
        },
        trafficEstimates,
        projections: generateTrafficProjections(totalMonthlyEstimate),
        topKeywords: topicAnalysis.keywords.slice(0, 10),
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
    console.error('AI traffic estimation error:', error);
    return res.status(500).json({ 
      error: 'Failed to estimate AI traffic',
      details: error.message 
    });
  }
}

function analyzeContentForAI(text, $) {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
  const words = text.split(/\s+/).length;
  
  // Calculate fact density
  const factualPatterns = [
    /\d+(?:\.\d+)?%/g,  // Percentages
    /\$[\d,]+/g,        // Dollar amounts
    /\b\d{4}\b/g,       // Years
    /\d+(?:,\d{3})*/g   // Large numbers
  ];
  
  let factCount = 0;
  factualPatterns.forEach(pattern => {
    factCount += (text.match(pattern) || []).length;
  });
  
  const factDensity = Math.min(100, (factCount / words) * 1000);
  
  // Structure analysis
  const headings = $('h1, h2, h3, h4, h5, h6').length;
  const lists = $('ul, ol').length;
  const tables = $('table').length;
  
  const structureScore = Math.min(100, (headings * 5) + (lists * 8) + (tables * 10));
  
  return {
    factDensity: Math.round(factDensity),
    structureScore: Math.round(structureScore),
    wordCount: words,
    sentenceCount: sentences.length,
    averageSentenceLength: Math.round(words / sentences.length)
  };
}

function analyzeTopicRelevance(title, text) {
  const words = text.toLowerCase().split(/\W+/).filter(w => w.length > 3);
  const frequency = {};
  
  words.forEach(word => {
    frequency[word] = (frequency[word] || 0) + 1;
  });
  
  const keywords = Object.entries(frequency)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 20)
    .map(([word, freq]) => ({ word, frequency: freq, relevance: Math.min(100, freq * 2) }));
  
  // Calculate topic focus
  const topKeywordFreq = keywords[0]?.frequency || 1;
  const relevanceScore = Math.min(100, topKeywordFreq * 3);
  
  return {
    keywords,
    relevanceScore: Math.round(relevanceScore),
    topicFocus: keywords.length > 0 ? keywords[0].word : 'general'
  };
}

function analyzeStructuredData($) {
  let score = 0;
  
  // JSON-LD
  const jsonLd = $('script[type="application/ld+json"]').length;
  score += jsonLd * 20;
  
  // Microdata
  const microdata = $('[itemscope]').length;
  score += microdata * 10;
  
  // Schema.org types
  const schemaTypes = $('[itemtype]').length;
  score += schemaTypes * 15;
  
  return {
    score: Math.min(100, score),
    hasJsonLd: jsonLd > 0,
    hasMicrodata: microdata > 0,
    schemaTypes: schemaTypes
  };
}

function estimateChatGPTTraffic(content, topic) {
  let baseScore = content.factDensity + topic.relevanceScore;
  let monthlyVisits = Math.round((baseScore / 100) * 150); // Base estimate
  
  return {
    platform: 'ChatGPT',
    monthlyVisits,
    citationProbability: Math.round(baseScore / 2),
    trafficType: 'Referenced citations',
    growthPotential: 'High'
  };
}

function estimateClaudeTraffic(content, topic) {
  let baseScore = (content.structureScore + topic.relevanceScore) * 0.8;
  let monthlyVisits = Math.round((baseScore / 100) * 120);
  
  return {
    platform: 'Claude',
    monthlyVisits,
    citationProbability: Math.round(baseScore / 2),
    trafficType: 'Source attributions',
    growthPotential: 'Medium'
  };
}

function estimateBingCopilotTraffic(content, topic) {
  let baseScore = (content.factDensity + content.structureScore) * 0.7;
  let monthlyVisits = Math.round((baseScore / 100) * 100);
  
  return {
    platform: 'Bing Copilot',
    monthlyVisits,
    citationProbability: Math.round(baseScore / 2),
    trafficType: 'Search integrations',
    growthPotential: 'Medium'
  };
}

function estimateGoogleBardTraffic(content, topic) {
  let baseScore = topic.relevanceScore * 0.9;
  let monthlyVisits = Math.round((baseScore / 100) * 80);
  
  return {
    platform: 'Google Bard',
    monthlyVisits,
    citationProbability: Math.round(baseScore / 2),
    trafficType: 'Knowledge citations',
    growthPotential: 'High'
  };
}

function estimateVoiceTraffic(content, topic) {
  let baseScore = content.factDensity * 0.6;
  let monthlyVisits = Math.round((baseScore / 100) * 50);
  
  return {
    platform: 'Voice Assistants',
    monthlyVisits,
    citationProbability: Math.round(baseScore / 3),
    trafficType: 'Voice responses',
    growthPotential: 'Medium'
  };
}

function calculateConfidence(content, topic) {
  const factors = [
    content.factDensity,
    content.structureScore,
    topic.relevanceScore
  ];
  
  const average = factors.reduce((sum, factor) => sum + factor, 0) / factors.length;
  
  if (average >= 70) return 'High';
  if (average >= 40) return 'Medium';
  return 'Low';
}

function generateTrafficProjections(currentEstimate) {
  const months = [];
  
  for (let i = 1; i <= 12; i++) {
    // Simulate growth with some variance
    const growthFactor = 1 + (i * 0.15) + (Math.random() * 0.1 - 0.05);
    months.push({
      month: i,
      estimate: Math.round(currentEstimate * growthFactor),
      confidence: i <= 3 ? 'High' : i <= 6 ? 'Medium' : 'Low'
    });
  }
  
  return {
    next3Months: months.slice(0, 3),
    next6Months: months.slice(0, 6),
    next12Months: months
  };
}
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
          'User-Agent': 'GEO-Analysis-Protocol/1.0 (Semantic Relevance Analyzer)',
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
      const title = $('title').text().trim();
      const h1 = $('h1').first().text().trim();
      const headings = $('h1, h2, h3, h4, h5, h6').map((i, elem) => $(elem).text().trim()).get();
      const textContent = $('main, article, .content, #content').first().text() || $('body').text();
      const metaDescription = $('meta[name="description"]').attr('content') || '';
      const metaKeywords = $('meta[name="keywords"]').attr('content') || '';

      // Extract key topics and terms
      const sentences = textContent.split(/[.!?]+/).filter(s => s.trim().length > 20);
      const words = textContent.toLowerCase().split(/\W+/).filter(w => w.length > 3);
      
      // Count word frequency (excluding common stop words)
      const stopWords = ['this', 'that', 'with', 'have', 'will', 'from', 'they', 'know', 'want', 'been', 'good', 'much', 'some', 'time', 'very', 'when', 'come', 'here', 'how', 'just', 'like', 'long', 'make', 'many', 'over', 'such', 'take', 'than', 'them', 'well', 'were'];
      const wordFreq = {};
      
      words.forEach(word => {
        if (!stopWords.includes(word) && word.length > 3) {
          wordFreq[word] = (wordFreq[word] || 0) + 1;
        }
      });

      // Get top keywords by frequency
      const topKeywords = Object.entries(wordFreq)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 20)
        .map(([word, freq]) => ({ term: word, frequency: freq, relevance: Math.min(100, freq * 5) }));

      // Analyze semantic clusters
      const semanticClusters = analyzeSemanticClusters(topKeywords, headings, sentences);
      
      // Calculate topic coherence
      const topicCoherence = calculateTopicCoherence(semanticClusters, textContent);
      
      // Analyze context depth
      const contextDepth = analyzeContextDepth(sentences, topKeywords);
      
      // Calculate overall semantic score
      let semanticScore = 0;
      semanticScore += Math.min(30, topKeywords.length * 1.5);
      semanticScore += Math.min(25, topicCoherence * 0.25);
      semanticScore += Math.min(25, contextDepth.avgDepth * 5);
      semanticScore += semanticClusters.length >= 3 ? 20 : semanticClusters.length * 6;

      const grade = semanticScore >= 80 ? 'A' : semanticScore >= 60 ? 'B' : semanticScore >= 40 ? 'C' : semanticScore >= 20 ? 'D' : 'F';

      // Generate recommendations
      const recommendations = [];
      const practicalImplementations = [];

      if (topKeywords.length < 10) {
        recommendations.push('Expand semantic vocabulary with more topic-related terms and synonyms.');
      }

      if (topicCoherence < 60) {
        recommendations.push('Improve topic coherence by connecting related concepts more explicitly.');
        practicalImplementations.push({
          title: 'Create Semantic Topic Clusters',
          code: `<!-- Group related content into semantic sections -->
<section class="topic-cluster" data-topic="machine-learning">
  <h2>Machine Learning Fundamentals</h2>
  <p>Machine learning algorithms enable systems to automatically learn and improve from experience. 
  These algorithms identify patterns in data to make predictions and decisions.</p>
  
  <h3>Key Concepts</h3>
  <ul>
    <li><strong>Supervised Learning:</strong> Training with labeled examples</li>
    <li><strong>Unsupervised Learning:</strong> Finding patterns in unlabeled data</li>
    <li><strong>Neural Networks:</strong> Interconnected nodes that process information</li>
  </ul>
</section>

<section class="topic-cluster" data-topic="applications">
  <h2>Real-World Applications</h2>
  <p>Machine learning powers recommendation systems, image recognition, 
  natural language processing, and predictive analytics across industries.</p>
</section>`,
          description: 'Organize content into semantic clusters that AI can easily understand and relate.'
        });
      }

      if (contextDepth.avgDepth < 3) {
        recommendations.push('Add more contextual depth with examples, explanations, and supporting details.');
      }

      const result = {
        success: true,
        url: targetUrl,
        analysis: {
          semanticScore: Math.round(semanticScore),
          grade,
          topicCoherence: Math.round(topicCoherence),
          contextDepth: contextDepth.avgDepth,
          keywordDiversity: topKeywords.length,
          semanticClusters: semanticClusters.length
        },
        topKeywords: topKeywords.slice(0, 15),
        semanticClusters,
        contextAnalysis: {
          totalSentences: sentences.length,
          avgWordsPerSentence: sentences.length > 0 ? Math.round(words.length / sentences.length) : 0,
          conceptDensity: contextDepth.conceptDensity
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
    console.error('Semantic relevance analysis error:', error);
    return res.status(500).json({ 
      error: 'Failed to analyze semantic relevance',
      details: error.message 
    });
  }
}

function analyzeSemanticClusters(keywords, headings, sentences) {
  const clusters = [];
  
  // Group keywords by semantic similarity (simplified clustering)
  const mainTopics = keywords.slice(0, 8);
  
  mainTopics.forEach((keyword, index) => {
    const relatedTerms = keywords.filter(k => 
      k.term !== keyword.term && 
      (k.term.includes(keyword.term.slice(0, 4)) || keyword.term.includes(k.term.slice(0, 4)))
    ).slice(0, 3);
    
    const relevantHeadings = headings.filter(h => 
      h.toLowerCase().includes(keyword.term) || keyword.term.includes(h.toLowerCase().slice(0, 4))
    );
    
    if (relatedTerms.length > 0 || relevantHeadings.length > 0) {
      clusters.push({
        mainTopic: keyword.term,
        relatedTerms: relatedTerms.map(t => t.term),
        headings: relevantHeadings,
        strength: Math.min(100, (relatedTerms.length * 20) + (relevantHeadings.length * 15) + keyword.relevance)
      });
    }
  });
  
  return clusters.slice(0, 6);
}

function calculateTopicCoherence(clusters, textContent) {
  if (clusters.length === 0) return 0;
  
  let coherenceScore = 0;
  const totalWords = textContent.split(/\s+/).length;
  
  clusters.forEach(cluster => {
    const allTerms = [cluster.mainTopic, ...cluster.relatedTerms];
    let termCoOccurrence = 0;
    
    allTerms.forEach(term1 => {
      allTerms.forEach(term2 => {
        if (term1 !== term2) {
          const regex1 = new RegExp(`\\b${term1}\\b`, 'gi');
          const regex2 = new RegExp(`\\b${term2}\\b`, 'gi');
          const occurrences1 = (textContent.match(regex1) || []).length;
          const occurrences2 = (textContent.match(regex2) || []).length;
          
          if (occurrences1 > 0 && occurrences2 > 0) {
            termCoOccurrence += Math.min(occurrences1, occurrences2);
          }
        }
      });
    });
    
    coherenceScore += termCoOccurrence;
  });
  
  return Math.min(100, coherenceScore * 2);
}

function analyzeContextDepth(sentences, keywords) {
  let totalDepth = 0;
  let conceptCount = 0;
  
  sentences.forEach(sentence => {
    let sentenceDepth = 0;
    let conceptsInSentence = 0;
    
    keywords.forEach(keyword => {
      if (sentence.toLowerCase().includes(keyword.term)) {
        sentenceDepth += 1;
        conceptsInSentence += 1;
      }
    });
    
    // Bonus for explanatory patterns
    if (sentence.match(/because|therefore|however|for example|specifically|such as/i)) {
      sentenceDepth += 1;
    }
    
    if (sentenceDepth > 0) {
      totalDepth += sentenceDepth;
      conceptCount += 1;
    }
  });
  
  return {
    avgDepth: conceptCount > 0 ? Math.round((totalDepth / conceptCount) * 10) / 10 : 0,
    conceptDensity: Math.round((conceptCount / sentences.length) * 100)
  };
}
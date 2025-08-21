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
          'User-Agent': 'GEO-Analysis-Protocol/1.0 (Content Atomization Tool)',
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
      const textContent = $('main, article, .content, #content').first().text() || $('body').text();
      const sentences = textContent.split(/[.!?]+/).filter(s => s.trim().length > 15);

      // Extract atomic facts
      const atomicFacts = [];
      
      // Numerical facts
      const numericalPattern = /([^.!?]*\b\d+(?:\.\d+)?(?:%|\s*(?:million|billion|thousand|percent|dollars?|years?|months?|days?|people|users|customers))\b[^.!?]*)/gi;
      let match;
      while ((match = numericalPattern.exec(textContent)) !== null) {
        atomicFacts.push({
          type: 'numerical',
          fact: match[1].trim(),
          extractability: 'high',
          category: 'statistic'
        });
      }

      // Date/time facts
      const datePattern = /([^.!?]*\b(?:since|in|during|by|from|until)?\s*(?:19|20)\d{2}[^.!?]*)/gi;
      while ((match = datePattern.exec(textContent)) !== null) {
        atomicFacts.push({
          type: 'temporal',
          fact: match[1].trim(),
          extractability: 'high',
          category: 'timeline'
        });
      }

      // Definitional facts
      sentences.forEach(sentence => {
        if (sentence.includes(' is ') || sentence.includes(' are ') || sentence.includes(' means ')) {
          const cleanSentence = sentence.trim();
          if (cleanSentence.length < 200 && cleanSentence.split(' ').length > 5) {
            atomicFacts.push({
              type: 'definitional',
              fact: cleanSentence,
              extractability: 'medium',
              category: 'definition'
            });
          }
        }
      });

      // Process/step facts
      const processPattern = /([^.!?]*\b(?:first|second|third|next|then|finally|step \d+|phase \d+)[^.!?]*)/gi;
      while ((match = processPattern.exec(textContent)) !== null) {
        atomicFacts.push({
          type: 'procedural',
          fact: match[1].trim(),
          extractability: 'medium',
          category: 'process'
        });
      }

      // Causal facts
      const causalPattern = /([^.!?]*\b(?:because|due to|results in|leads to|causes|resulting from)[^.!?]*)/gi;
      while ((match = causalPattern.exec(textContent)) !== null) {
        atomicFacts.push({
          type: 'causal',
          fact: match[1].trim(),
          extractability: 'high',
          category: 'cause-effect'
        });
      }

      // Remove duplicates and sort by extractability
      const uniqueFacts = Array.from(new Map(
        atomicFacts.map(fact => [`${fact.fact}`, fact])
      ).values()).slice(0, 50);

      // Categorize by extractability
      const highExtractability = uniqueFacts.filter(f => f.extractability === 'high');
      const mediumExtractability = uniqueFacts.filter(f => f.extractability === 'medium');
      
      // Calculate atomization score
      let score = 0;
      score += Math.min(40, highExtractability.length * 2);
      score += Math.min(30, mediumExtractability.length * 1.5);
      score += sentences.length > 20 ? 20 : sentences.length;
      score += uniqueFacts.length > 10 ? 10 : uniqueFacts.length;

      const grade = score >= 80 ? 'A' : score >= 60 ? 'B' : score >= 40 ? 'C' : score >= 20 ? 'D' : 'F';

      // Recommendations
      const recommendations = [];
      const practicalImplementations = [];
      
      if (highExtractability.length < 5) {
        recommendations.push('Add more specific data points and numerical facts for better AI extraction.');
        practicalImplementations.push({
          title: 'Create Atomic Data Points',
          code: `<!-- Transform complex information into atomic facts -->
<div class="atomic-facts">
  <p>Fact 1: Our service has 15,000+ active users.</p>
  <p>Fact 2: Customer satisfaction rate is 96.7%.</p>
  <p>Fact 3: Average response time is 2.3 seconds.</p>
  <p>Fact 4: Available in 23 countries worldwide.</p>
  <p>Fact 5: Founded in 2019 by a team of 5 engineers.</p>
</div>`,
          description: 'Break down complex information into discrete, citable facts that AI can easily extract.'
        });
      }

      if (uniqueFacts.filter(f => f.type === 'definitional').length < 2) {
        recommendations.push('Include clear definitions for better AI understanding.');
      }

      const result = {
        success: true,
        url: targetUrl,
        analysis: {
          totalAtomicFacts: uniqueFacts.length,
          highExtractabilityFacts: highExtractability.length,
          mediumExtractabilityFacts: mediumExtractability.length,
          atomizationScore: Math.round(score),
          grade,
          factDistribution: {
            numerical: uniqueFacts.filter(f => f.type === 'numerical').length,
            temporal: uniqueFacts.filter(f => f.type === 'temporal').length,
            definitional: uniqueFacts.filter(f => f.type === 'definitional').length,
            procedural: uniqueFacts.filter(f => f.type === 'procedural').length,
            causal: uniqueFacts.filter(f => f.type === 'causal').length
          }
        },
        atomicFacts: {
          high: highExtractability.slice(0, 15),
          medium: mediumExtractability.slice(0, 10)
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
    console.error('Content atomization error:', error);
    return res.status(500).json({ 
      error: 'Failed to atomize content',
      details: error.message 
    });
  }
}
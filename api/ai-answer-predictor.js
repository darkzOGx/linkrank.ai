export default async function handler(req, res) {
  const cheerio = await import('cheerio').then(m => m.default || m);
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url, question } = req.query;

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
          'User-Agent': 'GEO-Analysis-Protocol/1.0 (AI Answer Predictor)',
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

      // Generate test questions if none provided
      const testQuestions = question ? [question] : generateTestQuestions(title, h1, textContent);
      
      // Analyze answer potential for each question
      const answerPredictions = testQuestions.map(q => predictAnswer(q, textContent, $));
      
      // Calculate overall answerability score
      const avgAnswerability = answerPredictions.reduce((sum, pred) => sum + pred.answerabilityScore, 0) / answerPredictions.length;
      const grade = avgAnswerability >= 80 ? 'A' : avgAnswerability >= 60 ? 'B' : avgAnswerability >= 40 ? 'C' : avgAnswerability >= 20 ? 'D' : 'F';

      const recommendations = [];
      const practicalImplementations = [];

      if (avgAnswerability < 60) {
        recommendations.push('Add more direct answers and specific information to improve AI response generation.');
        practicalImplementations.push({
          title: 'Optimize Content for AI Answer Generation',
          code: `<!-- Structure content for better AI answers -->
<article class="ai-optimized-content">
  <section class="direct-answers">
    <h2>Key Questions and Answers</h2>
    
    <div class="qa-pair">
      <h3>What is ${h1 || 'your topic'}?</h3>
      <p class="direct-answer">${h1 || 'Your topic'} is [provide clear, concise definition].</p>
    </div>
    
    <div class="qa-pair">
      <h3>How does ${h1 || 'your topic'} work?</h3>
      <p class="direct-answer">It works by [explain the process step by step]:</p>
      <ol>
        <li>First step explanation</li>
        <li>Second step explanation</li>
        <li>Third step explanation</li>
      </ol>
    </div>
    
    <div class="qa-pair">
      <h3>What are the benefits of ${h1 || 'your topic'}?</h3>
      <ul class="benefits-list">
        <li><strong>Benefit 1:</strong> Specific advantage with measurable outcome</li>
        <li><strong>Benefit 2:</strong> Another concrete benefit</li>
        <li><strong>Benefit 3:</strong> Third measurable advantage</li>
      </ul>
    </div>
  </section>
</article>`,
          description: 'Structure your content with clear question-answer pairs that AI can easily extract and cite.'
        });
      }

      const result = {
        success: true,
        url: targetUrl,
        analysis: {
          overallAnswerability: Math.round(avgAnswerability),
          grade,
          totalQuestions: testQuestions.length,
          answerableQuestions: answerPredictions.filter(p => p.answerabilityScore >= 60).length
        },
        questionAnalysis: answerPredictions,
        testQuestions,
        contentInsights: analyzeContentForAnswers(textContent),
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
    console.error('AI answer prediction error:', error);
    return res.status(500).json({ 
      error: 'Failed to predict AI answers',
      details: error.message 
    });
  }
}

function generateTestQuestions(title, h1, text) {
  const questions = [];
  const topic = h1 || title || 'this topic';
  
  // Generate common question patterns
  questions.push(`What is ${topic}?`);
  questions.push(`How does ${topic} work?`);
  questions.push(`What are the benefits of ${topic}?`);
  questions.push(`Why is ${topic} important?`);
  questions.push(`How to use ${topic}?`);
  
  // Extract questions from content
  const contentQuestions = text.match(/[.!?]\s*([A-Z][^?]*\?)/g) || [];
  questions.push(...contentQuestions.slice(0, 3).map(q => q.trim()));

  return questions.slice(0, 8);
}

function predictAnswer(question, text, $) {
  const questionLower = question.toLowerCase();
  let answerabilityScore = 0;
  let predictedAnswer = '';
  let confidence = 0;
  let sources = [];

  // Extract relevant sentences based on question keywords
  const questionWords = questionLower.split(/\s+/).filter(w => w.length > 3);
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
  
  // Find sentences that contain question keywords
  const relevantSentences = sentences.filter(sentence => {
    const sentenceLower = sentence.toLowerCase();
    const matchCount = questionWords.filter(word => sentenceLower.includes(word)).length;
    return matchCount >= Math.max(1, questionWords.length * 0.3);
  });

  // Analyze question type and predict answer
  if (questionLower.startsWith('what is') || questionLower.startsWith('what are')) {
    const definitionSentences = relevantSentences.filter(s => 
      s.includes(' is ') || s.includes(' are ') || s.includes(' means ') || s.includes(' refers to ')
    );
    
    if (definitionSentences.length > 0) {
      predictedAnswer = definitionSentences[0].trim();
      answerabilityScore += 40;
      confidence += 0.7;
    }
  }
  
  if (questionLower.startsWith('how') || questionLower.includes('how to')) {
    const howSentences = relevantSentences.filter(s => 
      s.includes('step') || s.includes('first') || s.includes('process') || s.includes('method')
    );
    
    if (howSentences.length > 0) {
      predictedAnswer = howSentences.slice(0, 2).join(' ');
      answerabilityScore += 35;
      confidence += 0.6;
    }
  }
  
  if (questionLower.startsWith('why') || questionLower.includes('benefits')) {
    const whySentences = relevantSentences.filter(s => 
      s.includes('because') || s.includes('advantage') || s.includes('benefit') || s.includes('reason')
    );
    
    if (whySentences.length > 0) {
      predictedAnswer = whySentences[0].trim();
      answerabilityScore += 30;
      confidence += 0.6;
    }
  }

  // Check for supporting evidence
  const hasNumbers = /\d+/.test(relevantSentences.join(' '));
  if (hasNumbers) {
    answerabilityScore += 20;
    confidence += 0.2;
  }

  const hasExamples = relevantSentences.some(s => 
    s.includes('example') || s.includes('such as') || s.includes('instance')
  );
  if (hasExamples) {
    answerabilityScore += 15;
    confidence += 0.1;
  }

  // Extract sources/citations
  sources = relevantSentences.filter(s => 
    s.includes('according to') || s.includes('research') || s.includes('study')
  ).slice(0, 2);

  // Check for structured data that could enhance the answer
  const hasStructuredData = $('script[type="application/ld+json"]').length > 0;
  if (hasStructuredData) {
    answerabilityScore += 10;
  }

  return {
    question,
    predictedAnswer: predictedAnswer || 'No clear answer found in content',
    answerabilityScore: Math.min(100, answerabilityScore),
    confidence: Math.min(1, confidence),
    relevantSentences: relevantSentences.slice(0, 3),
    sources: sources,
    hasEvidence: hasNumbers || hasExamples,
    answerable: answerabilityScore >= 40
  };
}

function analyzeContentForAnswers(text) {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
  
  // Count different types of informative content
  const definitions = sentences.filter(s => 
    s.includes(' is ') || s.includes(' are ') || s.includes(' means ')
  ).length;
  
  const explanations = sentences.filter(s =>
    s.includes('because') || s.includes('due to') || s.includes('reason')
  ).length;
  
  const procedures = sentences.filter(s =>
    s.includes('step') || s.includes('first') || s.includes('then') || s.includes('next')
  ).length;
  
  const examples = sentences.filter(s =>
    s.includes('example') || s.includes('such as') || s.includes('instance')
  ).length;

  const statistics = (text.match(/\d+(?:\.\d+)?%|\d+(?:,\d{3})*|\$[\d,]+/g) || []).length;

  return {
    totalSentences: sentences.length,
    definitions,
    explanations,
    procedures,
    examples,
    statistics,
    answerabilityRatio: Math.round((definitions + explanations + procedures) / sentences.length * 100)
  };
}
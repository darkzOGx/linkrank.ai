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
          'User-Agent': 'GEO-Analysis-Protocol/1.0 (FAQ Schema Generator)',
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

      // Extract existing FAQs
      const existingFAQs = [];
      
      // Check for common FAQ patterns
      const faqSelectors = [
        '.faq',
        '#faq',
        '[class*="faq"]',
        '[id*="faq"]',
        '.question',
        '.accordion',
        'dl dt',
        'h3 + p',
        'h4 + p'
      ];

      faqSelectors.forEach(selector => {
        $(selector).each((i, elem) => {
          const question = $(elem).text().trim();
          let answer = '';
          
          // Try to find the answer
          const nextElem = $(elem).next();
          if (nextElem.length) {
            answer = nextElem.text().trim();
          } else {
            answer = $(elem).parent().find('p, div').first().text().trim();
          }
          
          if (question && answer && question.length > 10 && answer.length > 10) {
            existingFAQs.push({ question, answer });
          }
        });
      });

      // Look for question patterns in headings
      $('h2, h3, h4, h5').each((i, elem) => {
        const text = $(elem).text().trim();
        if (text.includes('?') || text.toLowerCase().includes('how') || text.toLowerCase().includes('what') || text.toLowerCase().includes('why')) {
          const answer = $(elem).next('p, div').text().trim();
          if (answer && answer.length > 20) {
            existingFAQs.push({ 
              question: text.replace(/^\d+\.\s*/, ''), 
              answer: answer 
            });
          }
        }
      });

      // Remove duplicates
      const uniqueFAQs = Array.from(new Map(existingFAQs.map(faq => 
        [`${faq.question}:${faq.answer}`, faq]
      )).values()).slice(0, 10);

      // Generate suggested FAQs based on content
      const suggestedFAQs = [];
      const pageTitle = $('title').text() || '';
      const h1 = $('h1').first().text() || pageTitle;
      const domain = new URL(targetUrl).hostname;
      const mainContent = $('main, article, .content, #content').first().text() || $('body').text();

      // Generate context-aware FAQ suggestions
      if (mainContent.toLowerCase().includes('price') || mainContent.toLowerCase().includes('cost')) {
        suggestedFAQs.push({
          question: `How much does ${h1 || 'this service'} cost?`,
          answer: 'Our pricing varies based on your specific needs. Contact us for a personalized quote.'
        });
      }

      if (mainContent.toLowerCase().includes('contact') || mainContent.toLowerCase().includes('support')) {
        suggestedFAQs.push({
          question: 'How can I contact customer support?',
          answer: `You can reach our support team via email at support@${domain} or through our contact form.`
        });
      }

      if (mainContent.toLowerCase().includes('deliver') || mainContent.toLowerCase().includes('ship')) {
        suggestedFAQs.push({
          question: 'What are your delivery options?',
          answer: 'We offer standard and express delivery options. Delivery times vary by location.'
        });
      }

      // Generate FAQ Schema
      const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": uniqueFAQs.length > 0 ? uniqueFAQs.map(faq => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
          }
        })) : suggestedFAQs.map(faq => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
          }
        }))
      };

      // Calculate score
      let score = 0;
      if (uniqueFAQs.length > 0) score += 40;
      if (uniqueFAQs.length >= 3) score += 20;
      if (uniqueFAQs.length >= 5) score += 20;
      if (uniqueFAQs.some(faq => faq.answer.length > 100)) score += 20;

      const grade = score >= 80 ? 'A' : score >= 60 ? 'B' : score >= 40 ? 'C' : score >= 20 ? 'D' : 'F';

      // Recommendations
      const recommendations = [];
      const practicalImplementations = [];

      if (uniqueFAQs.length === 0) {
        recommendations.push('No FAQ content detected. Add a FAQ section to improve AI understanding.');
        practicalImplementations.push({
          title: 'Create FAQ Section with Schema',
          code: `<!-- Add this to your page -->
<section id="faq">
  <h2>Frequently Asked Questions</h2>
  <div itemscope itemtype="https://schema.org/FAQPage">
    <div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
      <h3 itemprop="name">What is ${h1 || 'your service'}?</h3>
      <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
        <p itemprop="text">Provide a clear, comprehensive answer here.</p>
      </div>
    </div>
  </div>
</section>

<script type="application/ld+json">
${JSON.stringify(faqSchema, null, 2)}
</script>`,
          description: 'Add FAQ content with proper schema markup for AI extraction.'
        });
      }

      if (uniqueFAQs.length > 0 && uniqueFAQs.length < 5) {
        recommendations.push('Expand your FAQ section with more questions (aim for 5-10).');
      }

      const result = {
        success: true,
        url: targetUrl,
        analysis: {
          detectedFAQs: uniqueFAQs.length,
          suggestedFAQs: suggestedFAQs.length,
          score,
          grade,
          hasSchema: $('script[type="application/ld+json"]').text().includes('FAQPage')
        },
        faqs: {
          detected: uniqueFAQs,
          suggested: suggestedFAQs
        },
        generatedSchema: faqSchema,
        schemaCode: `<script type="application/ld+json">\n${JSON.stringify(faqSchema, null, 2)}\n</script>`,
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
    console.error('FAQ schema generation error:', error);
    return res.status(500).json({ 
      error: 'Failed to generate FAQ schema',
      details: error.message 
    });
  }
}
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
    // Validate URL
    let targetUrl;
    try {
      targetUrl = url.startsWith('http') ? url : `https://${url}`;
      new URL(targetUrl);
    } catch (e) {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    // Add timeout for the fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch(targetUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'GEO-Analysis-Protocol/1.0 (Authority Signal Detector)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate',
          'Cache-Control': 'no-cache',
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

      // Extract all text content
      const fullText = $('body').text();
      const metaDescription = $('meta[name="description"]').attr('content') || '';
      const title = $('title').text() || '';

      // Authority signal patterns
      const authorityPatterns = {
        academic_credentials: {
          pattern: /\b(PhD|Ph\.D|Dr\.|Doctor|Professor|Prof\.|M\.D\.|MD|MBA|MSc|MA|BS|BA|JD|LLM)\b/gi,
          description: 'Academic degrees and titles',
          weight: 10
        },
        professional_titles: {
          pattern: /\b(CEO|CTO|CFO|Director|Manager|Senior|Lead|Principal|Chief|President|Vice President|VP|Expert|Specialist|Consultant)\b/gi,
          description: 'Professional titles and positions',
          weight: 8
        },
        certifications: {
          pattern: /\b(Certified|Licensed|Accredited|Board Certified|Chartered|Fellow|Member of|CISSP|PMP|CPA|PE|RN|MD)\b/gi,
          description: 'Professional certifications',
          weight: 9
        },
        institutional_affiliations: {
          pattern: /\b(University|College|Institute|Academy|School of|Department of|Faculty|Research Center|Laboratory|Hospital|Medical Center)\b/gi,
          description: 'Educational and research institutions',
          weight: 8
        },
        professional_organizations: {
          pattern: /\b(Association|Society|Organization|Board|Council|Committee|Foundation|Academy|Institute)\s+(of|for)/gi,
          description: 'Professional organizations and societies',
          weight: 7
        },
        publications: {
          pattern: /\b(published|authored|co-authored|journal|peer-reviewed|research|study|paper|article|book|publication)\b/gi,
          description: 'Academic and professional publications',
          weight: 6
        },
        experience_years: {
          pattern: /\b(\d+)\s*years?\s*(of\s*)?(experience|expertise|practice|research|work|career)/gi,
          description: 'Years of experience statements',
          weight: 5
        },
        awards_recognition: {
          pattern: /\b(award|awarded|winner|recipient|recognized|honored|distinguished|acclaimed|nominated|fellowship)\b/gi,
          description: 'Awards and recognition',
          weight: 7
        },
        media_mentions: {
          pattern: /\b(featured in|quoted in|interviewed by|appeared on|mentioned in|covered by)\b/gi,
          description: 'Media coverage and mentions',
          weight: 6
        },
        speaking_engagements: {
          pattern: /\b(speaker|keynote|presenter|lecture|seminar|conference|workshop|webinar|panel)\b/gi,
          description: 'Speaking engagements and presentations',
          weight: 5
        }
      };

      // Contact and verification signals
      const contactSignals = {
        email: !!$('a[href^="mailto:"]').length || /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g.test(fullText),
        phone: /\b\d{3}-\d{3}-\d{4}\b|\b\(\d{3}\)\s*\d{3}-\d{4}\b/g.test(fullText),
        address: /\b\d+\s+[A-Za-z\s]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Lane|Ln|Drive|Dr|Court|Ct|Place|Pl)\b/gi.test(fullText),
        social_media: !!($('a[href*="linkedin.com"]').length || $('a[href*="twitter.com"]').length || $('a[href*="facebook.com"]').length)
      };

      // Technical authority signals
      const technicalSignals = {
        ssl_certificate: targetUrl.startsWith('https://'),
        privacy_policy: !!($('a[href*="privacy"]').length || fullText.toLowerCase().includes('privacy policy')),
        terms_of_service: !!($('a[href*="terms"]').length || fullText.toLowerCase().includes('terms of service')),
        about_page: !!($('a[href*="about"]').length),
        copyright: /©|\bcopyright\b/gi.test(fullText)
      };

      // Analyze each authority pattern
      const authorityAnalysis = {};
      let totalAuthorityScore = 0;

      Object.entries(authorityPatterns).forEach(([key, { pattern, description, weight }]) => {
        const matches = fullText.match(pattern) || [];
        const uniqueMatches = [...new Set(matches.map(m => m.toLowerCase()))];
        const score = Math.min(uniqueMatches.length * weight, weight * 3); // Cap at 3x weight
        
        authorityAnalysis[key] = {
          description,
          matches: uniqueMatches.slice(0, 10), // Limit examples
          count: uniqueMatches.length,
          score,
          weight
        };
        
        totalAuthorityScore += score;
      });

      // Calculate contact score
      const contactScore = Object.values(contactSignals).filter(Boolean).length * 5;
      
      // Calculate technical score
      const technicalScore = Object.values(technicalSignals).filter(Boolean).length * 3;

      // Final authority score
      const finalScore = Math.min(100, totalAuthorityScore + contactScore + technicalScore);
      const grade = finalScore >= 90 ? 'A' : finalScore >= 80 ? 'B' : finalScore >= 70 ? 'C' : finalScore >= 60 ? 'D' : 'F';

      // Generate recommendations
      const recommendations = [];
      
      if (authorityAnalysis.academic_credentials.count === 0 && authorityAnalysis.professional_titles.count === 0) {
        recommendations.push('Add author credentials, titles, or qualifications to establish expertise.');
      }
      
      if (authorityAnalysis.institutional_affiliations.count === 0) {
        recommendations.push('Include institutional affiliations or organizational memberships.');
      }
      
      if (authorityAnalysis.experience_years.count === 0) {
        recommendations.push('Mention years of experience or career length to build credibility.');
      }
      
      if (!contactSignals.email && !contactSignals.phone) {
        recommendations.push('Provide clear contact information to enhance trustworthiness.');
      }
      
      if (!technicalSignals.privacy_policy) {
        recommendations.push('Add a privacy policy to improve trust signals.');
      }
      
      if (!technicalSignals.about_page) {
        recommendations.push('Create an about page with detailed author/organization information.');
      }

      const result = {
        success: true,
        url: targetUrl,
        analysis: {
          total_authority_score: Math.round(finalScore),
          grade,
          breakdown: {
            authority_patterns: Math.round(totalAuthorityScore),
            contact_signals: contactScore,
            technical_signals: technicalScore
          }
        },
        authority_signals: authorityAnalysis,
        contact_signals: contactSignals,
        technical_signals: technicalSignals,
        recommendations,
        timestamp: new Date().toISOString()
      };

      res.status(200).json(result);

    } catch (fetchError) {
      if (fetchError.name === 'AbortError') {
        return res.status(408).json({ error: 'Request timeout - webpage took too long to load' });
      }
      throw fetchError;
    }

  } catch (error) {
    console.error('Authority signal detection error:', error);
    return res.status(500).json({ 
      error: 'Failed to detect authority signals',
      details: error.message 
    });
  }
}
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
          'User-Agent': 'GEO-Analysis-Protocol/1.0 (Trust Signal Analyzer)',
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
      const domain = new URL(targetUrl).hostname;

      // Security signals
      const securitySignals = {
        https: targetUrl.startsWith('https://'),
        sslCertificate: targetUrl.startsWith('https://'),
        securityHeaders: response.headers.get('strict-transport-security') ? true : false,
        contentSecurityPolicy: response.headers.get('content-security-policy') ? true : false
      };

      // Legal/Compliance signals
      const legalSignals = {
        privacyPolicy: false,
        termsOfService: false,
        cookiePolicy: false,
        gdprCompliance: false,
        copyrightNotice: false,
        disclaimer: false
      };

      // Check for legal pages
      $('a').each((i, elem) => {
        const href = $(elem).attr('href') || '';
        const text = $(elem).text().toLowerCase();
        
        if (text.includes('privacy') || href.includes('privacy')) {
          legalSignals.privacyPolicy = true;
        }
        if (text.includes('terms') || href.includes('terms')) {
          legalSignals.termsOfService = true;
        }
        if (text.includes('cookie') || href.includes('cookie')) {
          legalSignals.cookiePolicy = true;
        }
        if (text.includes('gdpr') || text.includes('data protection')) {
          legalSignals.gdprCompliance = true;
        }
        if (text.includes('disclaimer') || href.includes('disclaimer')) {
          legalSignals.disclaimer = true;
        }
      });

      // Check for copyright
      const bodyText = $('body').text().toLowerCase();
      if (bodyText.includes('copyright') || bodyText.includes('©')) {
        legalSignals.copyrightNotice = true;
      }

      // Contact signals
      const contactSignals = {
        email: false,
        phone: false,
        address: false,
        contactForm: false,
        socialMedia: false,
        liveChat: false
      };

      // Check for contact information
      if ($('a[href^="mailto:"]').length > 0) {
        contactSignals.email = true;
      }
      if ($('a[href^="tel:"]').length > 0 || /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/.test(bodyText)) {
        contactSignals.phone = true;
      }
      if ($('form').length > 0 || $('input[type="email"]').length > 0) {
        contactSignals.contactForm = true;
      }
      if ($('address').length > 0 || /\b\d+\s+[A-Za-z\s]+(?:Street|St|Avenue|Ave|Road|Rd)\b/gi.test(bodyText)) {
        contactSignals.address = true;
      }

      // Social media links
      const socialPlatforms = ['facebook', 'twitter', 'linkedin', 'instagram', 'youtube'];
      socialPlatforms.forEach(platform => {
        if ($(`a[href*="${platform}.com"]`).length > 0) {
          contactSignals.socialMedia = true;
        }
      });

      // Business legitimacy signals
      const businessSignals = {
        aboutPage: false,
        teamPage: false,
        testimonials: false,
        certifications: false,
        partnerships: false,
        pressMentions: false,
        caseStudies: false
      };

      // Check for business pages
      $('a').each((i, elem) => {
        const href = $(elem).attr('href') || '';
        const text = $(elem).text().toLowerCase();
        
        if (text.includes('about') || href.includes('about')) {
          businessSignals.aboutPage = true;
        }
        if (text.includes('team') || href.includes('team') || text.includes('staff')) {
          businessSignals.teamPage = true;
        }
        if (text.includes('testimonial') || text.includes('review')) {
          businessSignals.testimonials = true;
        }
        if (text.includes('case stud') || href.includes('case-stud')) {
          businessSignals.caseStudies = true;
        }
        if (text.includes('press') || text.includes('news') || text.includes('media')) {
          businessSignals.pressMentions = true;
        }
      });

      // Look for certifications and badges
      const certKeywords = ['certified', 'accredited', 'verified', 'trusted', 'secure', 'badge', 'award'];
      certKeywords.forEach(keyword => {
        if (bodyText.includes(keyword)) {
          businessSignals.certifications = true;
        }
      });

      // Calculate trust score
      let trustScore = 0;
      
      // Security (25 points max)
      Object.values(securitySignals).forEach(signal => {
        if (signal) trustScore += 6.25;
      });
      
      // Legal (30 points max)
      Object.values(legalSignals).forEach(signal => {
        if (signal) trustScore += 5;
      });
      
      // Contact (25 points max)
      Object.values(contactSignals).forEach(signal => {
        if (signal) trustScore += 4.17;
      });
      
      // Business (20 points max)
      Object.values(businessSignals).forEach(signal => {
        if (signal) trustScore += 2.86;
      });

      trustScore = Math.min(100, Math.round(trustScore));
      const grade = trustScore >= 90 ? 'A' : trustScore >= 75 ? 'B' : trustScore >= 60 ? 'C' : trustScore >= 45 ? 'D' : 'F';

      // Generate recommendations
      const recommendations = [];
      const practicalImplementations = [];

      if (!securitySignals.https) {
        recommendations.push('Enable HTTPS to secure your website and boost trust.');
      }

      if (!legalSignals.privacyPolicy) {
        recommendations.push('Add a comprehensive privacy policy.');
        practicalImplementations.push({
          title: 'Create Privacy Policy Page',
          code: `<footer>
  <div class="legal-links">
    <a href="/privacy-policy">Privacy Policy</a>
    <a href="/terms-of-service">Terms of Service</a>
    <a href="/cookie-policy">Cookie Policy</a>
  </div>
  <p>&copy; ${new Date().getFullYear()} ${domain}. All rights reserved.</p>
</footer>`,
          description: 'Add legal pages to establish trust and compliance.'
        });
      }

      if (!contactSignals.email && !contactSignals.phone) {
        recommendations.push('Provide clear contact information.');
        practicalImplementations.push({
          title: 'Add Contact Information',
          code: `<div class="contact-info" itemscope itemtype="https://schema.org/Organization">
  <h3>Contact Us</h3>
  <p itemprop="email">Email: <a href="mailto:contact@${domain}">contact@${domain}</a></p>
  <p itemprop="telephone">Phone: <a href="tel:+1234567890">(123) 456-7890</a></p>
  <address itemprop="address" itemscope itemtype="https://schema.org/PostalAddress">
    <span itemprop="streetAddress">123 Main Street</span><br>
    <span itemprop="addressLocality">City</span>, 
    <span itemprop="addressRegion">State</span> 
    <span itemprop="postalCode">12345</span>
  </address>
</div>`,
          description: 'Display contact information prominently to build trust.'
        });
      }

      if (!businessSignals.aboutPage) {
        recommendations.push('Create an About Us page to establish credibility.');
      }

      const result = {
        success: true,
        url: targetUrl,
        analysis: {
          trustScore,
          grade,
          securityScore: Object.values(securitySignals).filter(Boolean).length,
          legalScore: Object.values(legalSignals).filter(Boolean).length,
          contactScore: Object.values(contactSignals).filter(Boolean).length,
          businessScore: Object.values(businessSignals).filter(Boolean).length
        },
        trustSignals: {
          security: securitySignals,
          legal: legalSignals,
          contact: contactSignals,
          business: businessSignals
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
    console.error('Trust signal analysis error:', error);
    return res.status(500).json({ 
      error: 'Failed to analyze trust signals',
      details: error.message 
    });
  }
}
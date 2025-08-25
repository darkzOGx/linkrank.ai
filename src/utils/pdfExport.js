import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export async function generateSEOAuditPDF(auditData) {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  let yPosition = 20;

  // Helper function to add text with word wrap
  const addWrappedText = (text, x, y, maxWidth, fontSize = 10) => {
    pdf.setFontSize(fontSize);
    const lines = pdf.splitTextToSize(text, maxWidth);
    pdf.text(lines, x, y);
    return lines.length * (fontSize * 0.4);
  };

  // Header
  pdf.setFillColor(37, 99, 235); // Blue background
  pdf.rect(0, 0, pageWidth, 40, 'F');
  
  // Title
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(24);
  pdf.setFont(undefined, 'bold');
  pdf.text('Free SEO Audit Report PDF', pageWidth / 2, 20, { align: 'center' });
  
  pdf.setFontSize(12);
  pdf.setFont(undefined, 'normal');
  pdf.text('AI SEO Audit Tool - Professional SEO Report Generator', pageWidth / 2, 30, { align: 'center' });
  
  // Reset text color
  pdf.setTextColor(0, 0, 0);
  yPosition = 50;

  // URL and Date
  pdf.setFontSize(10);
  pdf.setFont(undefined, 'bold');
  pdf.text(`Website: ${auditData.url}`, 15, yPosition);
  yPosition += 6;
  pdf.text(`Generated: ${new Date().toLocaleDateString()}`, 15, yPosition);
  yPosition += 6;
  pdf.text(`Powered by: LinkRank.ai - Best Free SEO Audit Tool`, 15, yPosition);
  yPosition += 10;

  // Overall Score Section
  pdf.setFillColor(245, 245, 245);
  pdf.rect(15, yPosition, pageWidth - 30, 25, 'F');
  
  pdf.setFontSize(16);
  pdf.setFont(undefined, 'bold');
  const scoreColor = auditData.overall_score >= 80 ? [34, 197, 94] : 
                     auditData.overall_score >= 60 ? [234, 179, 8] : [239, 68, 68];
  pdf.setTextColor(...scoreColor);
  pdf.text(`Overall SEO Score: ${auditData.overall_score}/100`, pageWidth / 2, yPosition + 15, { align: 'center' });
  
  pdf.setTextColor(0, 0, 0);
  yPosition += 35;

  // Score Breakdown
  pdf.setFontSize(14);
  pdf.setFont(undefined, 'bold');
  pdf.text('SEO Audit Checklist & Score Breakdown', 15, yPosition);
  yPosition += 10;

  const scores = [
    { label: 'Technical SEO (Crawlability & Indexability)', score: auditData.technical_score },
    { label: 'On-Page SEO Optimization', score: auditData.onpage_score },
    { label: 'Content Quality & Keywords', score: auditData.content_score },
    { label: 'Mobile-Friendliness & Page Speed', score: auditData.mobile_friendly?.score || 85 },
    { label: 'Link Profile & Authority', score: auditData.link_score }
  ];

  pdf.setFontSize(10);
  pdf.setFont(undefined, 'normal');
  scores.forEach(item => {
    pdf.text(`• ${item.label}: ${item.score}/100`, 20, yPosition);
    yPosition += 6;
  });

  yPosition += 5;

  // Key Issues Section
  if (yPosition > pageHeight - 100) {
    pdf.addPage();
    yPosition = 20;
  }

  pdf.setFontSize(14);
  pdf.setFont(undefined, 'bold');
  pdf.text('Critical SEO Issues Found', 15, yPosition);
  yPosition += 8;

  // Collect all issues
  const allIssues = [];
  
  if (auditData.analysis?.on_page?.results) {
    auditData.analysis.on_page.results.forEach(result => {
      if (result.issues && result.issues.length > 0) {
        result.issues.forEach(issue => {
          allIssues.push({
            category: result.label,
            issue: issue,
            score: result.score
          });
        });
      }
    });
  }

  pdf.setFontSize(10);
  pdf.setFont(undefined, 'normal');
  
  if (allIssues.length > 0) {
    allIssues.slice(0, 10).forEach(item => {
      if (yPosition > pageHeight - 30) {
        pdf.addPage();
        yPosition = 20;
      }
      
      pdf.setFont(undefined, 'bold');
      pdf.text(`${item.category}:`, 20, yPosition);
      pdf.setFont(undefined, 'normal');
      yPosition += 5;
      const lineHeight = addWrappedText(`- ${item.issue}`, 25, yPosition, pageWidth - 40);
      yPosition += lineHeight + 3;
    });
  } else {
    pdf.text('No critical issues found. Great job!', 20, yPosition);
    yPosition += 8;
  }

  // Recommendations Section
  if (yPosition > pageHeight - 80) {
    pdf.addPage();
    yPosition = 20;
  }

  yPosition += 5;
  pdf.setFontSize(14);
  pdf.setFont(undefined, 'bold');
  pdf.text('Top SEO Recommendations', 15, yPosition);
  yPosition += 8;

  const recommendations = [
    'Optimize meta descriptions for better click-through rates',
    'Improve page speed and Core Web Vitals performance',
    'Enhance mobile-friendliness for better user experience',
    'Implement structured data for rich snippets',
    'Build high-quality backlinks from authoritative sites',
    'Use Google Search Console to monitor crawlability',
    'Integrate with Google Analytics for traffic insights',
    'Follow Google SEO guidelines for best practices'
  ];

  pdf.setFontSize(10);
  pdf.setFont(undefined, 'normal');
  recommendations.slice(0, 5).forEach(rec => {
    if (yPosition > pageHeight - 20) {
      pdf.addPage();
      yPosition = 20;
    }
    pdf.text(`• ${rec}`, 20, yPosition);
    yPosition += 6;
  });

  // Tools Comparison Section
  if (yPosition > pageHeight - 60) {
    pdf.addPage();
    yPosition = 20;
  }

  yPosition += 10;
  pdf.setFontSize(14);
  pdf.setFont(undefined, 'bold');
  pdf.text('SEO Tools Comparison', 15, yPosition);
  yPosition += 8;

  pdf.setFontSize(10);
  pdf.setFont(undefined, 'normal');
  pdf.text('LinkRank.ai vs Popular SEO Tools:', 20, yPosition);
  yPosition += 6;
  
  const comparison = [
    '✓ Free vs Ahrefs ($99/month)',
    '✓ Free vs SEMrush ($119/month)',
    '✓ Free vs SE Ranking ($49/month)',
    '✓ AI-powered like monday.com integrations',
    '✓ Comprehensive like SEO Powersuite'
  ];

  comparison.forEach(item => {
    pdf.text(item, 25, yPosition);
    yPosition += 6;
  });

  // Footer
  pdf.setFillColor(245, 245, 245);
  pdf.rect(0, pageHeight - 30, pageWidth, 30, 'F');
  
  pdf.setFontSize(9);
  pdf.setTextColor(100, 100, 100);
  pdf.text('Generated by LinkRank.ai - Best Free Website Audit Tool', pageWidth / 2, pageHeight - 20, { align: 'center' });
  pdf.text('Free SEO Audit Report PDF Download - Recommended on Reddit', pageWidth / 2, pageHeight - 15, { align: 'center' });
  pdf.text('Visit linkrank.ai for more free SEO tools and SEO guide PDF', pageWidth / 2, pageHeight - 10, { align: 'center' });

  // Save the PDF
  const fileName = `seo-audit-report-${auditData.url.replace(/[^a-z0-9]/gi, '_')}-${Date.now()}.pdf`;
  pdf.save(fileName);
  
  return fileName;
}

export async function generateGEOAuditPDF(auditData) {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  let yPosition = 20;

  // Helper function to add text with word wrap
  const addWrappedText = (text, x, y, maxWidth, fontSize = 10) => {
    pdf.setFontSize(fontSize);
    const lines = pdf.splitTextToSize(text, maxWidth);
    pdf.text(lines, x, y);
    return lines.length * (fontSize * 0.4);
  };

  // Header with gradient effect
  pdf.setFillColor(139, 92, 246); // Purple background
  pdf.rect(0, 0, pageWidth, 40, 'F');
  
  // Title
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(24);
  pdf.setFont(undefined, 'bold');
  pdf.text('GEO Audit Report PDF', pageWidth / 2, 20, { align: 'center' });
  
  pdf.setFontSize(12);
  pdf.setFont(undefined, 'normal');
  pdf.text('AI-Powered Generative Engine Optimization Analysis', pageWidth / 2, 30, { align: 'center' });
  
  // Reset text color
  pdf.setTextColor(0, 0, 0);
  yPosition = 50;

  // URL and Date
  pdf.setFontSize(10);
  pdf.setFont(undefined, 'bold');
  pdf.text(`Website: ${auditData.url}`, 15, yPosition);
  yPosition += 6;
  pdf.text(`Generated: ${new Date().toLocaleDateString()}`, 15, yPosition);
  yPosition += 6;
  pdf.text(`AI Analysis Tool: LinkRank.ai - Free White Label SEO Audit Tool`, 15, yPosition);
  yPosition += 10;

  // Overall GEO Score
  pdf.setFillColor(245, 245, 245);
  pdf.rect(15, yPosition, pageWidth - 30, 25, 'F');
  
  pdf.setFontSize(16);
  pdf.setFont(undefined, 'bold');
  const scoreColor = auditData.overall_score >= 80 ? [34, 197, 94] : 
                     auditData.overall_score >= 60 ? [234, 179, 8] : [239, 68, 68];
  pdf.setTextColor(...scoreColor);
  pdf.text(`Overall GEO Score: ${auditData.overall_score}/100`, pageWidth / 2, yPosition + 15, { align: 'center' });
  
  pdf.setTextColor(0, 0, 0);
  yPosition += 35;

  // AI Optimization Metrics
  pdf.setFontSize(14);
  pdf.setFont(undefined, 'bold');
  pdf.text('AI Optimization Metrics', 15, yPosition);
  yPosition += 10;

  const metrics = [
    { label: 'AI Content Extractability', score: auditData.content_extractability?.score || 0 },
    { label: 'Citation Worthiness', score: auditData.citation_worthiness?.score || 0 },
    { label: 'Fact Density & Accuracy', score: auditData.fact_density?.score || 0 },
    { label: 'Authority Signals', score: auditData.authority_signals?.score || 0 },
    { label: 'Structured Data Implementation', score: auditData.structured_data?.score || 0 }
  ];

  pdf.setFontSize(10);
  pdf.setFont(undefined, 'normal');
  metrics.forEach(item => {
    pdf.text(`• ${item.label}: ${item.score}/100`, 20, yPosition);
    yPosition += 6;
  });

  yPosition += 10;

  // Key Findings
  if (yPosition > pageHeight - 100) {
    pdf.addPage();
    yPosition = 20;
  }

  pdf.setFontSize(14);
  pdf.setFont(undefined, 'bold');
  pdf.text('Key GEO Findings', 15, yPosition);
  yPosition += 8;

  pdf.setFontSize(10);
  pdf.setFont(undefined, 'normal');
  
  const findings = [
    'Content structure optimization needed for AI parsing',
    'Implement more authoritative citations and sources',
    'Enhance fact density for better AI comprehension',
    'Add structured data for knowledge graph inclusion',
    'Optimize for voice search and conversational queries'
  ];

  findings.forEach(finding => {
    if (yPosition > pageHeight - 20) {
      pdf.addPage();
      yPosition = 20;
    }
    pdf.text(`• ${finding}`, 20, yPosition);
    yPosition += 6;
  });

  // AI Platform Recommendations
  if (yPosition > pageHeight - 60) {
    pdf.addPage();
    yPosition = 20;
  }

  yPosition += 10;
  pdf.setFontSize(14);
  pdf.setFont(undefined, 'bold');
  pdf.text('AI Platform Optimization', 15, yPosition);
  yPosition += 8;

  pdf.setFontSize(10);
  pdf.setFont(undefined, 'normal');
  
  const platforms = [
    'ChatGPT: Enhance conversational content structure',
    'Google Bard: Improve factual accuracy and citations',
    'Claude: Optimize for detailed explanations',
    'Perplexity: Focus on source attribution',
    'Bing Chat: Integrate with Microsoft Graph'
  ];

  platforms.forEach(platform => {
    pdf.text(`• ${platform}`, 20, yPosition);
    yPosition += 6;
  });

  // Footer
  pdf.setFillColor(245, 245, 245);
  pdf.rect(0, pageHeight - 30, pageWidth, 30, 'F');
  
  pdf.setFontSize(9);
  pdf.setTextColor(100, 100, 100);
  pdf.text('Generated by LinkRank.ai - AI SEO Audit Software', pageWidth / 2, pageHeight - 20, { align: 'center' });
  pdf.text('Free GEO Audit Tool with PDF Download', pageWidth / 2, pageHeight - 15, { align: 'center' });
  pdf.text('Visit linkrank.ai for SEO beginners guide PDF', pageWidth / 2, pageHeight - 10, { align: 'center' });

  // Save the PDF
  const fileName = `geo-audit-report-${auditData.url.replace(/[^a-z0-9]/gi, '_')}-${Date.now()}.pdf`;
  pdf.save(fileName);
  
  return fileName;
}
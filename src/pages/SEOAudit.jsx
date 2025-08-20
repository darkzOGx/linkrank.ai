import React, { useState } from 'react';
import { AuditResult } from '@/api/entities';
import { InvokeLLM } from '@/api/integrations';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import AuditResults from '../components/AuditResults';
import { AlertTriangle } from 'lucide-react';

export default function SEOAuditPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentResult, setCurrentResult] = useState(null);
  const [error, setError] = useState(null);

  const performSEOAudit = async (url) => {
    setIsLoading(true);
    setError(null);
    setCurrentResult(null);

    try {
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }

      const auditPrompt = `
        Perform a comprehensive SEO audit for the website: ${url}.
        Analyze: Title tag, Meta description, Heading structure (H1 count), Images (total, missing alt text), Page speed (load time in seconds), and Mobile friendliness (boolean).
        For each, provide a score (0-100), and specific issues found.
        Calculate an overall SEO score.
        Provide actionable recommendations with priority (high, medium, low), category, description, and how to fix.
        Be concise and technical.
      `;

      const result = await InvokeLLM({
        prompt: auditPrompt,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            url: { type: "string" },
            overall_score: { type: "number" },
            title_tag: { type: "object", properties: { value: { type: "string" }, score: { type: "number" }, issues: { type: "array", items: { type: "string" } } } },
            meta_description: { type: "object", properties: { value: { type: "string" }, score: { type: "number" }, issues: { type: "array", items: { type: "string" } } } },
            headings: { type: "object", properties: { h1_count: { type: "number" }, score: { type: "number" }, issues: { type: "array", items: { type: "string" } } } },
            images: { type: "object", properties: { total_images: { type: "number" }, missing_alt: { type: "number" }, score: { type: "number" }, issues: { type: "array", items: { type: "string" } } } },
            page_speed: { type: "object", properties: { load_time: { type: "number" }, score: { type: "number" }, issues: { type: "array", items: { type: "string" } } } },
            mobile_friendly: { type: "object", properties: { is_mobile_friendly: { type: "boolean" }, score: { type: "number" }, issues: { type: "array", items: { type: "string" } } } },
            recommendations: { type: "array", items: { type: "object", properties: { category: { type: "string" }, priority: { type: "string" }, description: { type: "string" }, how_to_fix: { type: "string" } } } }
          }
        }
      });

      const auditData = { ...result, url };
      const savedResult = await AuditResult.create(auditData);
      setCurrentResult(savedResult);

    } catch (err) {
      console.error('SEO audit error:', err);
      setError('Failed to analyze website. The analysis protocol could not be completed. Please check the URL and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewAudit = () => {
    setCurrentResult(null);
    setError(null);
  };
  
  if (currentResult) {
    return <AuditResults result={currentResult} onNewAudit={handleNewAudit} />;
  }

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center px-4">
        <div className="text-center font-mono">
          <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm">ANALYZING URL...</p>
          <p className="text-xs text-gray-500">Please wait while the protocol runs.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md border border-red-500 p-8">
          <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-4" />
          <h2 className="text-lg font-medium text-black mb-2">Analysis Failed</h2>
          <p className="text-gray-600 text-sm mb-6">{error}</p>
          <button
            onClick={handleNewAudit}
            className="px-6 py-2 bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            New Audit
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <HeroSection onStartAudit={performSEOAudit} isLoading={isLoading} />
      <FeaturesSection />
    </>
  );
}
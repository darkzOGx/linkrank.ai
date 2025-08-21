import React from 'react';
import { ArrowLeft, CheckCircle, AlertTriangle, AlertCircle, Info, Brain, Database, Quote, Award, Shield, Target, Cpu, BookOpen, Zap, Settings, TrendingUp, Users, Globe } from 'lucide-react';

// Score indicator component
const ScoreIndicator = ({ score, size = 'large' }) => {
  const getColor = (score) => {
    if (score >= 90) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    if (score >= 50) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const sizeClasses = size === 'large' 
    ? 'w-24 h-24 text-3xl font-bold' 
    : 'w-16 h-16 text-xl font-semibold';

  return (
    <div className={`${sizeClasses} ${getColor(score)} border-2 rounded-full flex items-center justify-center`}>
      {score}
    </div>
  );
};

// GEO audit item with detailed tracking and examples
const GEOAuditItem = ({ item, category }) => {
  const getStatusIcon = (score) => {
    if (score >= 90) return <CheckCircle className="w-5 h-5 text-green-600" />;
    if (score >= 70) return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
    return <AlertCircle className="w-5 h-5 text-red-600" />;
  };

  const getStatusBg = (score) => {
    if (score >= 90) return 'bg-green-50 border-green-200';
    if (score >= 70) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  return (
    <div className={`border rounded-lg p-6 ${getStatusBg(item.score)}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          {getStatusIcon(item.score)}
          <div>
            <h3 className="font-semibold text-gray-900">{item.label}</h3>
            <p className="text-sm text-gray-600 mt-1">{item.description}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">{item.score}</div>
          <div className="text-xs text-gray-500">GEO Score</div>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <span className="text-sm font-medium text-gray-700">Current Status:</span>
          <p className="text-sm text-gray-600 mt-1">{item.current}</p>
        </div>

        {item.issues && item.issues.length > 0 && (
          <div>
            <span className="text-sm font-medium text-red-700">Issues Found:</span>
            <ul className="text-sm text-red-600 mt-1 space-y-1">
              {item.issues.map((issue, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  {issue}
                </li>
              ))}
            </ul>
          </div>
        )}

        {item.recommendations && item.recommendations.length > 0 && (
          <div>
            <span className="text-sm font-medium text-blue-700">AI Optimization Recommendations:</span>
            <ul className="text-sm text-blue-600 mt-1 space-y-1">
              {item.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        )}

        {item.practicalExample && (
          <div className="bg-gray-50 border border-gray-200 rounded p-4 mt-4">
            <span className="text-sm font-medium text-gray-700 mb-2 block">Practical Implementation:</span>
            <pre className="text-xs text-gray-600 overflow-x-auto whitespace-pre-wrap">
              {item.practicalExample}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

// Category section with icon
const CategorySection = ({ title, description, results, icon: Icon, iconColor }) => {
  const categoryScore = results.score || Math.round(
    results.results.reduce((sum, item) => sum + item.score, 0) / results.results.length
  );

  return (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-3 rounded-lg ${iconColor}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <p className="text-gray-600">{description}</p>
        </div>
        <div className="ml-auto">
          <ScoreIndicator score={categoryScore} size="medium" />
        </div>
      </div>

      <div className="grid gap-6">
        {results.results.map((item, index) => (
          <GEOAuditItem key={index} item={item} category={title} />
        ))}
      </div>
    </div>
  );
};

export default function GEOAuditResults({ result, onNewAudit }) {
  if (!result || !result.analysis) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Invalid Analysis Result</h2>
          <button
            onClick={onNewAudit}
            className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
          >
            Start New GEO Audit
          </button>
        </div>
      </div>
    );
  }

  const { analysis, overall_geo_score, metadata } = result;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <button
              onClick={onNewAudit}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              New GEO Audit
            </button>
            
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">GEO Audit Results</h1>
              <p className="text-gray-600">{result.url}</p>
            </div>
            
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-1">Overall GEO Score</div>
              <ScoreIndicator score={overall_geo_score} />
            </div>
          </div>
        </div>
      </div>

      {/* Overall Summary */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">GEO Performance Overview</h2>
          <div className="grid md:grid-cols-6 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{analysis.structured_data?.score || 0}</div>
              <div className="text-sm text-gray-600">Structured Data</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{analysis.citation_potential?.score || 0}</div>
              <div className="text-sm text-gray-600">Citation Potential</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{analysis.authority_signals?.score || 0}</div>
              <div className="text-sm text-gray-600">Authority Signals</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{analysis.trust_signals?.score || 0}</div>
              <div className="text-sm text-gray-600">Trust Signals</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{analysis.content_optimization?.score || 0}</div>
              <div className="text-sm text-gray-600">Content Optimization</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-teal-600">{analysis.expertise_markup?.score || 0}</div>
              <div className="text-sm text-gray-600">Expertise Markup</div>
            </div>
          </div>
        </div>

        {/* What is GEO? Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex items-start gap-3">
            <Brain className="w-6 h-6 text-blue-600 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">What is GEO (Generative Engine Optimization)?</h3>
              <p className="text-blue-800 text-sm leading-relaxed">
                GEO focuses on optimizing content for inclusion within AI-generated answers from systems like ChatGPT, Claude, Gemini, and Perplexity. 
                Unlike traditional SEO which aims for clicks, GEO aims to be cited as a credible source within AI responses. 
                This audit analyzes your website's potential to be referenced by large language models and generative search engines.
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Analysis Sections */}
        <div className="space-y-8">
          {analysis.structured_data && (
            <CategorySection
              title="Structured Data & Schema"
              description="Structured data markup helps AI systems understand and extract your content accurately"
              results={analysis.structured_data}
              icon={Database}
              iconColor="bg-blue-600"
            />
          )}

          {analysis.citation_potential && (
            <CategorySection
              title="Citation Potential"
              description="Factual content density and data presentation for AI citation opportunities"
              results={analysis.citation_potential}
              icon={Quote}
              iconColor="bg-green-600"
            />
          )}

          {analysis.authority_signals && (
            <CategorySection
              title="Authority Signals"
              description="Credibility indicators that influence AI systems' trust in your content"
              results={analysis.authority_signals}
              icon={Award}
              iconColor="bg-purple-600"
            />
          )}

          {analysis.trust_signals && (
            <CategorySection
              title="Trust Signals"
              description="Security and transparency factors that build confidence with AI systems"
              results={analysis.trust_signals}
              icon={Shield}
              iconColor="bg-red-600"
            />
          )}

          {analysis.content_optimization && (
            <CategorySection
              title="Content Optimization"
              description="Content structure and format optimization for AI extraction and comprehension"
              results={analysis.content_optimization}
              icon={Target}
              iconColor="bg-orange-600"
            />
          )}

          {analysis.expertise_markup && (
            <CategorySection
              title="Expertise Markup"
              description="E-A-T (Expertise, Authoritativeness, Trustworthiness) signals for AI credibility assessment"
              results={analysis.expertise_markup}
              icon={BookOpen}
              iconColor="bg-teal-600"
            />
          )}
        </div>

        {/* Key GEO Insights */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Cpu className="w-5 h-5" />
            Key GEO Insights
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">AI Citation Strengths</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                {overall_geo_score >= 90 && <li>• Excellent overall GEO optimization</li>}
                {(analysis.structured_data?.score || 0) >= 80 && <li>• Strong structured data implementation</li>}
                {(analysis.citation_potential?.score || 0) >= 80 && <li>• High citation potential content</li>}
                {(analysis.authority_signals?.score || 0) >= 80 && <li>• Clear authority signals present</li>}
                {(analysis.trust_signals?.score || 0) >= 80 && <li>• Strong trust indicators</li>}
                {overall_geo_score < 70 && <li>• Basic GEO foundation in place</li>}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Priority Optimization Areas</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                {(analysis.structured_data?.score || 0) < 70 && <li>• Improve structured data markup</li>}
                {(analysis.citation_potential?.score || 0) < 70 && <li>• Increase factual content density</li>}
                {(analysis.authority_signals?.score || 0) < 70 && <li>• Add author credentials and expertise</li>}
                {(analysis.trust_signals?.score || 0) < 70 && <li>• Enhance trust and transparency signals</li>}
                {(analysis.content_optimization?.score || 0) < 70 && <li>• Optimize content structure for AI</li>}
                {(analysis.expertise_markup?.score || 0) < 70 && <li>• Implement E-A-T markup</li>}
              </ul>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-6 mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Next Steps for GEO Success
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white rounded p-4">
              <h3 className="font-semibold text-gray-900 mb-2">1. Immediate Actions</h3>
              <p className="text-sm text-gray-600">
                Focus on the lowest-scoring areas first. Add missing structured data and improve content factual density.
              </p>
            </div>
            <div className="bg-white rounded p-4">
              <h3 className="font-semibold text-gray-900 mb-2">2. Content Strategy</h3>
              <p className="text-sm text-gray-600">
                Create more fact-rich content with clear statistics, expert quotes, and authoritative sources.
              </p>
            </div>
            <div className="bg-white rounded p-4">
              <h3 className="font-semibold text-gray-900 mb-2">3. Monitor & Iterate</h3>
              <p className="text-sm text-gray-600">
                Regularly audit your GEO performance and track how AI systems cite your content.
              </p>
            </div>
          </div>
        </div>

        {/* Strategic GEO Recommendations */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <Target className="w-8 h-8 text-purple-600" />
            Strategic GEO Recommendations
          </h2>
          
          <div className="grid gap-8">
            {/* Content Authority Strategy */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Content Authority & Citation Strategy</h3>
              <p className="text-gray-600 mb-4">Build authoritative content that AI systems prefer to cite and reference.</p>
              
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-medium text-gray-900 mb-1">Create Expert-Authored Content</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Publish content authored by recognized experts with clear credentials and professional backgrounds.
                  </p>
                  <div className="bg-gray-50 p-3 rounded text-xs">
                    <strong>Implementation:</strong> Add author schemas, professional bios, and credential verification for all content creators
                  </div>
                </div>
                
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-medium text-gray-900 mb-1">Develop Data-Rich Resources</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Create comprehensive guides filled with statistics, research findings, and quantifiable insights.
                  </p>
                  <div className="bg-gray-50 p-3 rounded text-xs">
                    <strong>Implementation:</strong> Build industry reports, statistical studies, and data-driven analyses that serve as primary sources
                  </div>
                </div>
                
                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="font-medium text-gray-900 mb-1">Establish Source Attribution Standards</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Implement consistent citation practices and reference authoritative sources to build trust signals.
                  </p>
                  <div className="bg-gray-50 p-3 rounded text-xs">
                    <strong>Implementation:</strong> Add comprehensive bibliographies, inline citations, and source verification systems
                  </div>
                </div>
              </div>
            </div>

            {/* Technical Optimization Strategy */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Technical AI Optimization Strategy</h3>
              <p className="text-gray-600 mb-4">Optimize technical infrastructure for better AI system comprehension and extraction.</p>
              
              <div className="space-y-4">
                <div className="border-l-4 border-orange-500 pl-4">
                  <h4 className="font-medium text-gray-900 mb-1">Advanced Schema Implementation</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Deploy comprehensive structured data covering entities, relationships, and factual claims.
                  </p>
                  <div className="bg-gray-50 p-3 rounded text-xs">
                    <strong>Implementation:</strong> Implement Organization, Person, FAQ, Article, and HowTo schemas with nested entity relationships
                  </div>
                </div>
                
                <div className="border-l-4 border-red-500 pl-4">
                  <h4 className="font-medium text-gray-900 mb-1">AI-Friendly Content Structure</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Structure content for optimal extraction with clear headings, bullet points, and logical information hierarchy.
                  </p>
                  <div className="bg-gray-50 p-3 rounded text-xs">
                    <strong>Implementation:</strong> Use semantic HTML5, proper heading hierarchy (H1-H6), and structured lists for facts
                  </div>
                </div>
                
                <div className="border-l-4 border-teal-500 pl-4">
                  <h4 className="font-medium text-gray-900 mb-1">Entity Recognition Optimization</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Enhance entity markup for people, places, organizations, and concepts to improve AI understanding.
                  </p>
                  <div className="bg-gray-50 p-3 rounded text-xs">
                    <strong>Implementation:</strong> Add comprehensive entity schemas and knowledge graph connections
                  </div>
                </div>
              </div>
            </div>

            {/* Platform-Specific Strategy */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Multi-Platform AI Visibility Strategy</h3>
              <p className="text-gray-600 mb-4">Optimize for specific AI platforms and their unique citation preferences.</p>
              
              <div className="space-y-4">
                <div className="border-l-4 border-indigo-500 pl-4">
                  <h4 className="font-medium text-gray-900 mb-1">ChatGPT Optimization Focus</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Create conversational, Q&A-style content with clear, quotable definitions and explanations.
                  </p>
                  <div className="bg-gray-50 p-3 rounded text-xs">
                    <strong>Implementation:</strong> Develop FAQ sections, how-to guides, and step-by-step explanations
                  </div>
                </div>
                
                <div className="border-l-4 border-pink-500 pl-4">
                  <h4 className="font-medium text-gray-900 mb-1">Academic AI Platform Strategy</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Build research-grade content with proper citations, methodology, and peer-reviewed quality standards.
                  </p>
                  <div className="bg-gray-50 p-3 rounded text-xs">
                    <strong>Implementation:</strong> Create white papers, research studies, and academically-structured content
                  </div>
                </div>
                
                <div className="border-l-4 border-yellow-500 pl-4">
                  <h4 className="font-medium text-gray-900 mb-1">Voice Assistant Optimization</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Optimize for voice queries with natural language patterns and spoken question formats.
                  </p>
                  <div className="bg-gray-50 p-3 rounded text-xs">
                    <strong>Implementation:</strong> Create content answering "what is", "how to", "why does" questions naturally
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Monitoring Strategy */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">GEO Performance Monitoring Strategy</h3>
              <p className="text-gray-600 mb-4">Track and measure your visibility across AI platforms and generative search results.</p>
              
              <div className="space-y-4">
                <div className="border-l-4 border-cyan-500 pl-4">
                  <h4 className="font-medium text-gray-900 mb-1">Citation Tracking Implementation</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Monitor when and how AI systems reference your content across different platforms and queries.
                  </p>
                  <div className="bg-gray-50 p-3 rounded text-xs">
                    <strong>Implementation:</strong> Set up alerts for brand mentions in AI responses and track citation frequency
                  </div>
                </div>
                
                <div className="border-l-4 border-emerald-500 pl-4">
                  <h4 className="font-medium text-gray-900 mb-1">Competitive GEO Analysis</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Regular analysis of competitor citations and identification of content gaps in your industry.
                  </p>
                  <div className="bg-gray-50 p-3 rounded text-xs">
                    <strong>Implementation:</strong> Monthly competitive audits and content gap analysis for AI visibility opportunities
                  </div>
                </div>
                
                <div className="border-l-4 border-violet-500 pl-4">
                  <h4 className="font-medium text-gray-900 mb-1">ROI Measurement Framework</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Establish metrics to measure the business impact of improved AI visibility and citations.
                  </p>
                  <div className="bg-gray-50 p-3 rounded text-xs">
                    <strong>Implementation:</strong> Track AI-driven traffic, brand awareness, and lead generation from AI platform visibility
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm mt-8 pt-8 border-t border-gray-200">
          <p>GEO Audit completed on {new Date(result.timestamp).toLocaleString()}</p>
          <p className="mt-1">Analysis time: {result.response_time}ms • Domain: {metadata?.domain}</p>
        </div>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { Shield, ArrowRight, AlertCircle, CheckCircle, XCircle, Copy, Check } from 'lucide-react';

export default function TrustSignalAnalyzer() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copiedField, setCopiedField] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsLoading(true);
    setResult(null);

    try {
      let cleanUrl = url.trim();
      if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
        cleanUrl = 'https://' + cleanUrl;
      }

      const response = await fetch(`/api/trust-signal-analyzer?url=${encodeURIComponent(cleanUrl)}`);
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error: 'Network error occurred while analyzing trust signals'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const getGradeColor = (grade) => {
    switch (grade) {
      case 'A': return 'text-green-600 bg-green-100';
      case 'B': return 'text-blue-600 bg-blue-100';
      case 'C': return 'text-yellow-600 bg-yellow-100';
      case 'D': return 'text-orange-600 bg-orange-100';
      case 'F': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const TrustSignal = ({ label, value, description }) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          {value ? (
            <CheckCircle className="w-4 h-4 text-green-600" />
          ) : (
            <XCircle className="w-4 h-4 text-red-600" />
          )}
          <span className="font-medium text-black">{label}</span>
        </div>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </div>
      <span className={`text-xs px-2 py-1 rounded ${value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
        {value ? 'Present' : 'Missing'}
      </span>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-medium text-black mb-4">Trust Signal Analyzer</h1>
        <p className="text-gray-700">
          Analyze trust signals that influence AI citation decisions and build credibility.
        </p>
      </div>

      <div className="bg-white border border-black p-6 mb-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-black mb-2">
              Website URL
            </label>
            <input
              type="text"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter URL (e.g., example.com or https://example.com)"
              className="w-full p-3 border border-gray-300 text-black placeholder-gray-500 focus:outline-none focus:border-black"
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !url.trim()}
            className="w-full bg-black text-white p-3 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Analyzing Trust Signals...
              </>
            ) : (
              <>
                <Shield className="w-4 h-4" />
                Analyze Trust Signals
              </>
            )}
          </button>
        </form>
      </div>

      {result && (
        <div className="space-y-6">
          {result.success ? (
            <>
              {/* Trust Score Overview */}
              <div className="bg-white border border-black p-6">
                <h2 className="text-xl font-medium text-black mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Trust Signal Analysis
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <div className={`text-2xl font-bold px-3 py-2 rounded ${getGradeColor(result.analysis.grade)}`}>
                      {result.analysis.grade}
                    </div>
                    <p className="text-sm text-gray-600 mt-2">Trust Grade</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-black">
                      {result.analysis.trustScore}/100
                    </div>
                    <p className="text-sm text-gray-600 mt-2">Trust Score</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-black">
                      {result.analysis.securityScore}/4
                    </div>
                    <p className="text-sm text-gray-600 mt-2">Security</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-black">
                      {result.analysis.legalScore}/6
                    </div>
                    <p className="text-sm text-gray-600 mt-2">Legal</p>
                  </div>
                </div>
              </div>

              {/* Security Signals */}
              <div className="bg-white border border-black p-6">
                <h3 className="text-lg font-medium text-black mb-4">Security Signals</h3>
                <div className="space-y-1">
                  <TrustSignal 
                    label="HTTPS/SSL Certificate" 
                    value={result.trustSignals.security.https}
                    description="Secure connection with valid SSL certificate"
                  />
                  <TrustSignal 
                    label="Security Headers" 
                    value={result.trustSignals.security.securityHeaders}
                    description="HTTP security headers to prevent attacks"
                  />
                  <TrustSignal 
                    label="Content Security Policy" 
                    value={result.trustSignals.security.contentSecurityPolicy}
                    description="CSP header to prevent XSS attacks"
                  />
                </div>
              </div>

              {/* Legal & Compliance */}
              <div className="bg-white border border-black p-6">
                <h3 className="text-lg font-medium text-black mb-4">Legal & Compliance Signals</h3>
                <div className="space-y-1">
                  <TrustSignal 
                    label="Privacy Policy" 
                    value={result.trustSignals.legal.privacyPolicy}
                    description="Data protection and privacy information"
                  />
                  <TrustSignal 
                    label="Terms of Service" 
                    value={result.trustSignals.legal.termsOfService}
                    description="Legal terms and conditions"
                  />
                  <TrustSignal 
                    label="Cookie Policy" 
                    value={result.trustSignals.legal.cookiePolicy}
                    description="Cookie usage disclosure"
                  />
                  <TrustSignal 
                    label="GDPR Compliance" 
                    value={result.trustSignals.legal.gdprCompliance}
                    description="European data protection compliance"
                  />
                  <TrustSignal 
                    label="Copyright Notice" 
                    value={result.trustSignals.legal.copyrightNotice}
                    description="Copyright information displayed"
                  />
                </div>
              </div>

              {/* Contact & Business */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-black p-6">
                  <h3 className="text-lg font-medium text-black mb-4">Contact Signals</h3>
                  <div className="space-y-1">
                    <TrustSignal 
                      label="Email Contact" 
                      value={result.trustSignals.contact.email}
                      description="Email address provided"
                    />
                    <TrustSignal 
                      label="Phone Number" 
                      value={result.trustSignals.contact.phone}
                      description="Phone contact available"
                    />
                    <TrustSignal 
                      label="Physical Address" 
                      value={result.trustSignals.contact.address}
                      description="Business address listed"
                    />
                    <TrustSignal 
                      label="Contact Form" 
                      value={result.trustSignals.contact.contactForm}
                      description="Contact form available"
                    />
                    <TrustSignal 
                      label="Social Media" 
                      value={result.trustSignals.contact.socialMedia}
                      description="Social media profiles linked"
                    />
                  </div>
                </div>

                <div className="bg-white border border-black p-6">
                  <h3 className="text-lg font-medium text-black mb-4">Business Signals</h3>
                  <div className="space-y-1">
                    <TrustSignal 
                      label="About Page" 
                      value={result.trustSignals.business.aboutPage}
                      description="Company information page"
                    />
                    <TrustSignal 
                      label="Team Page" 
                      value={result.trustSignals.business.teamPage}
                      description="Team or staff information"
                    />
                    <TrustSignal 
                      label="Testimonials" 
                      value={result.trustSignals.business.testimonials}
                      description="Customer reviews/testimonials"
                    />
                    <TrustSignal 
                      label="Certifications" 
                      value={result.trustSignals.business.certifications}
                      description="Professional certifications"
                    />
                    <TrustSignal 
                      label="Case Studies" 
                      value={result.trustSignals.business.caseStudies}
                      description="Detailed case studies"
                    />
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              {result.recommendations && result.recommendations.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 p-6 rounded">
                  <h3 className="text-lg font-medium text-blue-900 mb-4">Recommendations</h3>
                  <ul className="space-y-2">
                    {result.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2 text-blue-800">
                        <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Practical Implementations */}
              {result.practicalImplementations && result.practicalImplementations.length > 0 && (
                <div className="bg-green-50 border border-green-200 p-6 rounded">
                  <h3 className="text-lg font-medium text-green-900 mb-4">Practical Implementations</h3>
                  <div className="space-y-4">
                    {result.practicalImplementations.map((impl, index) => (
                      <div key={index} className="bg-white border border-green-300 rounded p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-green-900">{impl.title}</h4>
                          {impl.code && (
                            <button
                              onClick={() => copyToClipboard(impl.code, `impl-${index}`)}
                              className="flex items-center gap-1 text-sm text-green-700 hover:text-green-900"
                            >
                              {copiedField === `impl-${index}` ? (
                                <Check className="w-3 h-3" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                              Copy Code
                            </button>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{impl.description}</p>
                        {impl.code && (
                          <pre className="bg-gray-50 border border-gray-200 rounded p-3 text-xs overflow-x-auto">
                            <code className="language-html">{impl.code}</code>
                          </pre>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="bg-red-50 border border-red-200 p-6 rounded">
              <div className="flex items-center gap-2 text-red-800 mb-2">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">Analysis Failed</span>
              </div>
              <p className="text-red-700">{result.error}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
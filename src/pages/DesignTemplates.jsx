import React, { useState } from 'react';
import { Monitor, Palette, Layout, Zap, Sparkles, Globe, Code, Layers, Eye, Settings, Brain, Shield, Server } from 'lucide-react';

const templates = [
  {
    id: 1,
    name: "Modern Gradient",
    description: "Bold gradients, glassmorphism effects, and vibrant colors for a cutting-edge tech feel",
    icon: Sparkles,
    preview: "bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-400",
    features: ["Gradient backgrounds", "Glass morphism", "Bright accent colors", "Modern typography"],
    colors: ["Purple", "Blue", "Cyan", "White"],
    style: "Tech/SaaS",
    url: "/templates/modern-gradient"
  },
  {
    id: 2,
    name: "Minimalist Clean",
    description: "Clean lines, lots of whitespace, and subtle shadows for professional elegance",
    icon: Layout,
    preview: "bg-gray-50 border border-gray-200",
    features: ["Lots of whitespace", "Subtle shadows", "Clean typography", "Minimal colors"],
    colors: ["White", "Gray", "Black", "Blue accent"],
    style: "Professional/Corporate",
    url: "/templates/minimalist-clean"
  },
  {
    id: 3,
    name: "Dark Mode Elite",
    description: "Premium dark theme with neon accents and sophisticated color palette",
    icon: Monitor,
    preview: "bg-gray-900 border border-gray-700",
    features: ["Dark backgrounds", "Neon accents", "High contrast", "Premium feel"],
    colors: ["Dark Gray", "Black", "Neon Green", "Purple"],
    style: "Gaming/Tech",
    url: "/templates/dark-mode-elite"
  },
  {
    id: 4,
    name: "Warm & Friendly",
    description: "Warm oranges and yellows with rounded corners for approachable design",
    icon: Palette,
    preview: "bg-gradient-to-r from-orange-400 to-yellow-400",
    features: ["Warm colors", "Rounded corners", "Friendly icons", "Soft shadows"],
    colors: ["Orange", "Yellow", "Cream", "Brown"],
    style: "Creative/Agency",
    url: "/templates/warm-friendly"
  },
  {
    id: 5,
    name: "Corporate Blue",
    description: "Traditional business colors with structured layout and professional appeal",
    icon: Globe,
    preview: "bg-blue-600 border-2 border-blue-800",
    features: ["Business colors", "Structured layout", "Conservative design", "Trust-building"],
    colors: ["Navy Blue", "Light Blue", "White", "Gray"],
    style: "Corporate/Financial",
    url: "/templates/corporate-blue"
  },
  {
    id: 6,
    name: "Neon Cyberpunk",
    description: "Futuristic design with bright neon colors and tech-inspired elements",
    icon: Zap,
    preview: "bg-black border-2 border-cyan-400",
    features: ["Neon colors", "Futuristic elements", "High contrast", "Tech aesthetic"],
    colors: ["Black", "Cyan", "Magenta", "Green"],
    style: "Gaming/Tech",
    url: "/templates/neon-cyberpunk"
  },
  {
    id: 7,
    name: "Nature Green",
    description: "Earth tones and green palette for eco-friendly and sustainable brands",
    icon: Layers,
    preview: "bg-gradient-to-r from-green-500 to-emerald-600",
    features: ["Earth tones", "Natural textures", "Organic shapes", "Eco-friendly"],
    colors: ["Forest Green", "Sage", "Brown", "Cream"],
    style: "Eco/Sustainable",
    url: "/templates/nature-green"
  },
  {
    id: 8,
    name: "Luxury Gold",
    description: "Premium gold and black color scheme for high-end luxury brands",
    icon: Settings,
    preview: "bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600",
    features: ["Gold accents", "Premium materials", "Elegant typography", "Luxury feel"],
    colors: ["Gold", "Black", "White", "Cream"],
    style: "Luxury/Premium",
    url: "/templates/luxury-gold"
  },
  {
    id: 9,
    name: "Retro 80s",
    description: "Nostalgic 80s-inspired design with bold colors and geometric patterns",
    icon: Eye,
    preview: "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500",
    features: ["Retro colors", "Geometric patterns", "Bold typography", "Nostalgic feel"],
    colors: ["Hot Pink", "Purple", "Cyan", "Yellow"],
    style: "Creative/Entertainment",
    url: "/templates/retro-80s"
  },
  {
    id: 10,
    name: "Monochrome Pro",
    description: "Sophisticated black and white design with strategic color accents",
    icon: Code,
    preview: "bg-white border-4 border-black",
    features: ["Black & white base", "Strategic color use", "High contrast", "Professional"],
    colors: ["Black", "White", "Red accent", "Gray"],
    style: "Professional/Portfolio",
    url: "/templates/monochrome-pro"
  },
  {
    id: 11,
    name: "Perplexity Clone",
    description: "AI-powered search interface with dark theme and modern gradients inspired by Perplexity",
    icon: Brain,
    preview: "bg-gradient-to-br from-gray-900 to-black border border-gray-700",
    features: ["Dark theme", "AI interface", "Modern gradients", "Search-focused"],
    colors: ["Dark Gray", "Black", "Blue accent", "Purple"],
    style: "AI/Search",
    url: "/templates/perplexity-clone"
  },
  {
    id: 12,
    name: "Clerk Clone",
    description: "Clean authentication platform design with modern layout and developer-focused aesthetic",
    icon: Shield,
    preview: "bg-gray-50 border border-gray-200",
    features: ["Clean layout", "Developer-focused", "Modern design", "Authentication UI"],
    colors: ["Light Gray", "White", "Dark Gray", "Black"],
    style: "Developer/SaaS",
    url: "/templates/clerk-clone"
  },
  {
    id: 13,
    name: "Bindplane Clone",
    description: "Modern enterprise SaaS platform with gradient backgrounds, animated carousels, and premium shadows",
    icon: Server,
    preview: "bg-gradient-to-br from-white via-gray-50 to-gray-100 border border-gray-200",
    features: ["Gradient backgrounds", "Animated carousels", "Enterprise header", "Premium shadows"],
    colors: ["White", "Gray", "Blue", "Purple"],
    style: "Enterprise/SaaS",
    url: "/templates/bindplane-clone"
  }
];

export default function DesignTemplates() {
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Design Template Gallery
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Explore 13 different design templates and visual styles we could implement for LinkRank.ai. 
            Each template offers a unique aesthetic and user experience approach.
          </p>
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-2xl mx-auto">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> This is a hidden page for internal design review. 
              It's not linked anywhere on the public website.
            </p>
          </div>
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {templates.map((template) => (
            <div 
              key={template.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
              onClick={() => setSelectedTemplate(template)}
            >
              {/* Preview */}
              <div className={`h-32 ${template.preview} flex items-center justify-center`}>
                <template.icon className="w-12 h-12 text-white drop-shadow-lg" />
              </div>
              
              {/* Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {template.name}
                  </h3>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    {template.style}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-4">
                  {template.description}
                </p>
                
                {/* Color Palette */}
                <div className="mb-4">
                  <p className="text-xs font-medium text-gray-500 mb-2">Color Palette:</p>
                  <div className="flex gap-1">
                    {template.colors.map((color, index) => (
                      <span key={index} className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded">
                        {color}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Features */}
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-2">Key Features:</p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {template.features.slice(0, 2).map((feature, index) => (
                      <li key={index}>• {feature}</li>
                    ))}
                  </ul>
                </div>
                
                {/* View Demo Button */}
                <div className="mt-4">
                  <a 
                    href={template.url}
                    className="inline-block w-full text-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    View Live Demo
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Template Detail */}
        {selectedTemplate && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedTemplate.name} - Detailed View
              </h2>
              <button 
                onClick={() => setSelectedTemplate(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Preview */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Visual Preview</h3>
                <div className={`h-64 ${selectedTemplate.preview} rounded-lg flex items-center justify-center`}>
                  <selectedTemplate.icon className="w-16 h-16 text-white drop-shadow-lg" />
                </div>
              </div>
              
              {/* Details */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Template Details</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900">Description</h4>
                    <p className="text-gray-600">{selectedTemplate.description}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900">Style Category</h4>
                    <p className="text-gray-600">{selectedTemplate.style}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900">Color Palette</h4>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedTemplate.colors.map((color, index) => (
                        <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                          {color}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900">Key Features</h4>
                    <ul className="mt-1 space-y-1">
                      {selectedTemplate.features.map((feature, index) => (
                        <li key={index} className="text-gray-600 text-sm">• {feature}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Implementation Notes */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-8">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">
            Implementation Notes
          </h2>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-blue-800">
            <div>
              <h3 className="font-medium mb-2">Quick Changes (1-2 hours):</h3>
              <ul className="space-y-1">
                <li>• Color scheme updates</li>
                <li>• Typography changes</li>
                <li>• Button styling</li>
                <li>• Basic layout adjustments</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">Major Redesign (1-2 days):</h3>
              <ul className="space-y-1">
                <li>• Complete layout restructure</li>
                <li>• New component designs</li>
                <li>• Animation implementations</li>
                <li>• Custom graphics/assets</li>
              </ul>
            </div>
          </div>
          <div className="mt-4 p-4 bg-blue-100 rounded-lg">
            <p className="text-blue-900 font-medium">
              Recommendation: Start with color scheme and typography changes for quick wins, 
              then consider layout restructuring if needed.
            </p>
          </div>
        </div>

        {/* Current vs New Comparison */}
        <div className="mt-8 bg-gray-50 rounded-xl p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Current LinkRank.ai Design Analysis
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Current Strengths:</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Clean, professional layout</li>
                <li>• Good contrast and readability</li>
                <li>• Effective use of yellow accent (#fcd63a)</li>
                <li>• Modern dark footer design</li>
                <li>• Mobile-responsive navigation</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Potential Improvements:</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• More visual interest in hero sections</li>
                <li>• Enhanced color variety</li>
                <li>• Modern gradient usage</li>
                <li>• Interactive elements</li>
                <li>• Unique brand personality</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
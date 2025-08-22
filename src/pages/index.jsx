import Layout from "./Layout.jsx";

import Home from "./Home";

import SEOAudit from "./SEOAudit";
import GEOAudit from "./GEOAudit";
import SEOTools from "./SEOTools";
import GEOTools from "./GEOTools";
import ToolPage from "./ToolPage";
import About from "./About";
import PrivacyPolicy from "./PrivacyPolicy";
import CookiePolicy from "./CookiePolicy";
import TermsOfService from "./TermsOfService";
import DesignTemplates from "./DesignTemplates";

// Template imports
import ModernGradient from "./templates/ModernGradient";
import MinimalistClean from "./templates/MinimalistClean";
import DarkModeElite from "./templates/DarkModeElite";
import WarmFriendly from "./templates/WarmFriendly";
import CorporateBlue from "./templates/CorporateBlue";
import NeonCyberpunk from "./templates/NeonCyberpunk";
import NatureGreen from "./templates/NatureGreen";
import LuxuryGold from "./templates/LuxuryGold";
import Retro80s from "./templates/Retro80s";
import MonochromePro from "./templates/MonochromePro";
import PerplexityClone from "./templates/PerplexityClone";
import ClerkClone from "./templates/ClerkClone";
import BindplaneClone from "./templates/BindplaneClone";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

const PAGES = {
    Home: Home,
    
    SEOAudit: SEOAudit,
    GEOAudit: GEOAudit,
    SEOTools: SEOTools,
    GEOTools: GEOTools,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();

    // Scroll to top on route change
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [location.pathname]);
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Home />} />
                
                
                <Route path="/SEOAudit" element={<SEOAudit />} />
                <Route path="/GEOAudit" element={<GEOAudit />} />
                <Route path="/tools" element={<SEOTools />} />
                <Route path="/tools/:toolId" element={<ToolPage />} />
                <Route path="/geo-tools" element={<GEOTools />} />
                <Route path="/geo-tools/:toolId" element={<ToolPage />} />
                <Route path="/about" element={<About />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/cookie-policy" element={<CookiePolicy />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/design-templates" element={<DesignTemplates />} />
                
                {/* Template Routes */}
                <Route path="/templates/modern-gradient" element={<ModernGradient />} />
                <Route path="/templates/minimalist-clean" element={<MinimalistClean />} />
                <Route path="/templates/dark-mode-elite" element={<DarkModeElite />} />
                <Route path="/templates/warm-friendly" element={<WarmFriendly />} />
                <Route path="/templates/corporate-blue" element={<CorporateBlue />} />
                <Route path="/templates/neon-cyberpunk" element={<NeonCyberpunk />} />
                <Route path="/templates/nature-green" element={<NatureGreen />} />
                <Route path="/templates/luxury-gold" element={<LuxuryGold />} />
                <Route path="/templates/retro-80s" element={<Retro80s />} />
                <Route path="/templates/monochrome-pro" element={<MonochromePro />} />
                <Route path="/templates/perplexity-clone" element={<PerplexityClone />} />
                <Route path="/templates/clerk-clone" element={<ClerkClone />} />
                <Route path="/templates/bindplane-clone" element={<BindplaneClone />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}
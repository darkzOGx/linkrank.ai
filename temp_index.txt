import Layout from "./Layout.jsx";

import SEOAudit from "./SEOAudit";
import GEOAudit from "./GEOAudit";
import SEOTools from "./SEOTools";
import GEOTools from "./GEOTools";
import ToolPage from "./ToolPage";
import PrivacyPolicy from "./PrivacyPolicy";
import TermsOfService from "./TermsOfService";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
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
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<SEOAudit />} />
                
                
                <Route path="/SEOAudit" element={<SEOAudit />} />
                <Route path="/GEOAudit" element={<GEOAudit />} />
                <Route path="/tools" element={<SEOTools />} />
                <Route path="/tools/:toolId" element={<ToolPage />} />
                <Route path="/geo-tools" element={<GEOTools />} />
                <Route path="/geo-tools/:toolId" element={<ToolPage />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                
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
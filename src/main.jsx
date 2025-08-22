import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/index.css'

// Initialize Google Analytics if not already loaded
if (typeof window !== 'undefined' && !window.gtag) {
  window.dataLayer = window.dataLayer || [];
  function gtag(){window.dataLayer.push(arguments);}
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', 'G-PK6TWS0XDD');
}

const rootElement = document.getElementById('root');

// Function to show React content and hide loading screen
function showReactContent() {
  // Add classes to show React content
  rootElement.classList.add('loaded');
  document.body.classList.add('react-loaded');
  
  // Remove loading screen after transition
  setTimeout(() => {
    const loadingScreen = document.querySelector('.initial-loading');
    if (loadingScreen) {
      loadingScreen.remove();
    }
  }, 350);
}

// Create React root and render
const root = ReactDOM.createRoot(rootElement);
root.render(<App />);

// Show content after React renders
setTimeout(showReactContent, 50);

// Fallback to ensure content shows
setTimeout(showReactContent, 200); 
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

// Remove fallback content and add loaded class when React is ready
const observer = new MutationObserver(() => {
  if (rootElement.children.length > 0) {
    rootElement.classList.add('loaded');
    observer.disconnect();
  }
});

observer.observe(rootElement, { childList: true });

ReactDOM.createRoot(rootElement).render(
    <App />
)

// Fallback in case MutationObserver doesn't work
setTimeout(() => {
  rootElement.classList.add('loaded');
}, 100); 
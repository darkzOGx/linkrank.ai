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

ReactDOM.createRoot(document.getElementById('root')).render(
    <App />
) 
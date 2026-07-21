import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Self-hosted (@fontsource) instead of the Google Fonts CDN — collapses what
// was a render-blocking cross-origin request chain (HTML -> googleapis CSS
// -> gstatic font files) down to same-origin requests, and only pulls in the
// exact weights tailwind.config.js's font-*/font-weight classes actually use
// (verified via a grep across src/ for font-{normal,medium,semibold,bold,
// extrabold} usage) instead of the CDN link's full weight list.
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import '@fontsource/inter/800.css'
import '@fontsource/manrope/500.css'
import '@fontsource/manrope/600.css'
import '@fontsource/manrope/700.css'
import '@fontsource/manrope/800.css'
import '@fontsource/jetbrains-mono/400.css'
import '@fontsource/jetbrains-mono/500.css'
import '@fontsource/jetbrains-mono/600.css'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

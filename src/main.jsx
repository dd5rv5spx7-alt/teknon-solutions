import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Self-hosted (@fontsource) instead of the Google Fonts CDN — collapses what
// was a render-blocking cross-origin request chain (HTML -> googleapis CSS
// -> gstatic font files) down to same-origin requests, and only pulls in the
// weights actually used: explicit font-{normal,medium,semibold,bold,extrabold}
// classes (verified via grep across src/), plus Manrope 400 for elements that
// apply font-display with no weight class and so render at the browser's
// default weight (e.g. Testimonials.jsx's quote text) — omitting that import
// wouldn't 404, it'd silently fall back to the nearest loaded weight (500),
// rendering the intended-regular text visibly bolder than designed.
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import '@fontsource/inter/800.css'
import '@fontsource/manrope/400.css'
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

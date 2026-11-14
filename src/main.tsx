import React from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import App from './App.tsx'
import { RouterProvider } from './router'
import '@fontsource-variable/roboto'
// The MD3 ripple and focus ring. Registered here rather than in the components
// that render them: this entry only runs in the browser, so the prerender pass
// never loads Lit, and the elements are defined before hydration starts.
import '@material/web/ripple/ripple.js'
import '@material/web/focus/md-focus-ring.js'
import './index.css'

const container = document.getElementById('root')!

const app = (
  <React.StrictMode>
    <RouterProvider initialPath={window.location.pathname}>
      <App />
    </RouterProvider>
  </React.StrictMode>
)

// `npm run build` prerenders every route into its own HTML file
// (scripts/prerender.mjs), so in production there is already markup to adopt:
// hydrating attaches to it, while `createRoot().render()` would throw it away
// and repaint the page from scratch. `npm run dev` serves the container empty,
// and hydrating nothing logs a mismatch for every node — so the branch is on
// what is actually there.
if (container.hasChildNodes()) {
  hydrateRoot(container, app)
} else {
  createRoot(container).render(app)
}

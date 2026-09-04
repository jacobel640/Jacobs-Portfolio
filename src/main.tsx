import React from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

const container = document.getElementById('root')!

const app = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

// `npm run build` prerenders the tree into #root (scripts/prerender.mjs), so in
// production there is already markup to adopt: hydrating attaches to it, while
// `createRoot().render()` would throw it away and repaint the page from
// scratch. `npm run dev` serves the container empty, and hydrating nothing logs
// a mismatch for every node — so the branch is on what is actually there.
if (container.hasChildNodes()) {
  hydrateRoot(container, app)
} else {
  createRoot(container).render(app)
}

import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const root = document.getElementById('root')!
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

// production: the HTML is prerendered, so attach to it; dev: render from scratch
if (root.hasChildNodes()) hydrateRoot(root, app)
else createRoot(root).render(app)

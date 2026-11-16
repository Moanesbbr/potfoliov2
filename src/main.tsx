import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { registerWebMcpTools } from './webmcp'

const root = document.getElementById('root')!
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

// production: the HTML is prerendered, so attach to it; dev: render from scratch
if (root.hasChildNodes()) hydrateRoot(root, app)
else createRoot(root).render(app)

// tools for AI agents in the browser (WebMCP), when the browser offers the API
registerWebMcpTools()

import { renderToString } from 'react-dom/server'
import App from './App'

// Used only at build time (scripts/prerender.mjs) to write the page content
// into dist/index.html, so crawlers that do not run JavaScript still read it.
export function render() {
  return renderToString(<App />)
}

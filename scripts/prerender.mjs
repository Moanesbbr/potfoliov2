// Build step: writes the rendered page into dist/index.html and generates
// robots.txt, sitemap.xml (with images) and llms.txt for the configured site URL.
// Run by `npm run build` after the client and server bundles are built.
import { readFileSync, writeFileSync, rmSync, readdirSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const env = Object.fromEntries(
  readFileSync(resolve(root, '.env'), 'utf8')
    .split(/\r?\n/)
    .filter((l) => l.includes('=') && !l.startsWith('#'))
    .map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()]),
)
const SITE = (process.env.VITE_SITE_URL || env.VITE_SITE_URL).replace(/\/$/, '')

// 1. prerender
const { render } = await import(pathToFileURL(resolve(root, 'dist-ssr/entry-server.js')).href)
const indexPath = resolve(root, 'dist/index.html')
const html = readFileSync(indexPath, 'utf8')
if (!html.includes('<div id="root"></div>')) throw new Error('root placeholder not found in dist/index.html')
writeFileSync(indexPath, html.replace('<div id="root"></div>', `<div id="root">${render()}</div>`))
rmSync(resolve(root, 'dist-ssr'), { recursive: true, force: true })

// 2. robots.txt: everyone welcome, AI crawlers named so the intent is explicit
const bots = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'PerplexityBot', 'Google-Extended', 'Applebot-Extended', 'CCBot']
writeFileSync(
  resolve(root, 'dist/robots.txt'),
  `User-agent: *\nAllow: /\n\n${bots.map((b) => `User-agent: ${b}\nAllow: /\n`).join('\n')}\nSitemap: ${SITE}/sitemap.xml\n`,
)

// 3. sitemap with the images that should appear in image search
const images = [
  ['moanes-ben-brahim-3d-avatar.webp', 'Moanes Ben Brahim, software engineer and founder of Tunispare (3D avatar)'],
  ['moanes-ben-brahim-avatar-hoodie.webp', 'Moanes Ben Brahim, 3D avatar in an orange hoodie with headphones'],
  ...readdirSync(resolve(root, 'dist/img'))
    .filter((f) => /^(tunispare|malltech|achabs)-.*\.webp$/.test(f))
    .map((f) => [f, f.replace('.webp', '').replace(/-/g, ' ')]),
]
const today = new Date().toISOString().slice(0, 10)
writeFileSync(
  resolve(root, 'dist/sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${SITE}/</loc>
    <lastmod>${today}</lastmod>
${images.map(([f, t]) => `    <image:image><image:loc>${SITE}/img/${f}</image:loc><image:title>${t}</image:title></image:image>`).join('\n')}
  </url>
</urlset>
`,
)

// 4. llms.txt: the same facts as the page, as plain markdown for AI assistants
const llms = readFileSync(resolve(root, 'scripts/llms.template.md'), 'utf8').replaceAll('{{SITE}}', SITE)
writeFileSync(resolve(root, 'dist/llms.txt'), llms)

console.log(`prerendered ${indexPath} for ${SITE} (+ robots.txt, sitemap.xml, llms.txt)`)

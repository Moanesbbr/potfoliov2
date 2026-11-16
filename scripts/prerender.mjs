// Build step: writes the rendered page into dist/index.html and generates
// robots.txt, sitemap.xml, llms.txt, index.md and the /.well-known/ agent files for the configured site URL.
// Run by `npm run build` after the client and server bundles are built.
import { readFileSync, writeFileSync, rmSync, readdirSync, mkdirSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { pathToFileURL } from 'node:url'
import { resolve, dirname } from 'node:path'

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

// 2. robots.txt: everyone welcome, AI crawlers named so the intent is explicit.
// Content signals (contentsignals.org): how the content may be used, in every
// group, since a crawler reads only the group that names it. The site exists
// to be found, so search, answers (ai-input) and training are all allowed.
const bots = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'PerplexityBot', 'Google-Extended', 'Applebot-Extended', 'CCBot']
const signals = 'Content-Signal: search=yes, ai-input=yes, ai-train=yes'
writeFileSync(
  resolve(root, 'dist/robots.txt'),
  `User-agent: *\n${signals}\nAllow: /\n\n${bots.map((b) => `User-agent: ${b}\n${signals}\nAllow: /\n`).join('\n')}\nSitemap: ${SITE}/sitemap.xml\n`,
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
// The page as markdown: nginx serves it for `/` when the request asks for
// `Accept: text/markdown` (markdown negotiation); browsers keep the HTML.
writeFileSync(resolve(root, 'dist/index.md'), llms)

// 5. Agent discovery under /.well-known/ (nginx adds CORS there)
const wellKnown = resolve(root, 'dist/.well-known')
const put = (path, text) => {
  mkdirSync(dirname(resolve(wellKnown, path)), { recursive: true })
  writeFileSync(resolve(wellKnown, path), text)
}
// Agent Skills discovery (RFC v0.2.0): one skill, with the SHA-256 of its file.
const skill = readFileSync(resolve(root, 'scripts/skill.template.md'), 'utf8').replaceAll('{{SITE}}', SITE)
const skillPath = 'agent-skills/moanes-ben-brahim/SKILL.md'
put(skillPath, skill)
const skillDigest = createHash('sha256').update(skill).digest('hex')
put(
  'agent-skills/index.json',
  JSON.stringify(
    {
      $schema: 'https://schemas.agentskills.io/discovery/0.2.0/schema.json',
      skills: [
        {
          name: 'moanes-ben-brahim',
          type: 'skill-md',
          description: 'Answer questions about Moanes Ben Brahim (software engineer in Tunis, founder of Tunispare) from his published facts, and how to contact or hire him.',
          url: `${SITE}/.well-known/${skillPath}`,
          digest: `sha256:${skillDigest}`,
        },
      ],
    },
    null,
    2,
  ) + '\n',
)
// Agentic Resource Discovery: what an agent can read here, and what it answers.
const host = new URL(SITE).host
put(
  'ai-catalog.json',
  JSON.stringify(
    {
      specVersion: '1.0',
      host: { displayName: 'Moanes Ben Brahim', identifier: `did:web:${host}` },
      entries: [
        {
          identifier: `urn:air:${host}:profile:facts`,
          displayName: 'Moanes Ben Brahim: facts',
          type: 'text/markdown',
          url: `${SITE}/llms.txt`,
          representativeQueries: [
            'Who is Moanes Ben Brahim?',
            'What has Moanes Ben Brahim built?',
            'Is Moanes Ben Brahim open to work?',
            'Founder of Tunispare',
          ],
        },
        {
          identifier: `urn:air:${host}:skill:moanes-ben-brahim`,
          displayName: 'Skill: answer questions about Moanes Ben Brahim',
          type: 'text/markdown',
          url: `${SITE}/.well-known/${skillPath}`,
          representativeQueries: [
            'How do I contact Moanes Ben Brahim?',
            'Hire a full-stack and DevOps engineer in Tunisia',
            'Moanes Ben Brahim skills and experience',
          ],
        },
      ],
    },
    null,
    2,
  ) + '\n',
)

console.log(`prerendered ${indexPath} for ${SITE} (+ robots.txt, sitemap.xml, llms.txt, index.md, .well-known/)`)

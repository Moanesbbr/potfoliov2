# Moanes Ben Brahim · portfolio

React + Vite + TypeScript + Tailwind CSS v4, one page. Layout and scroll animation
follow melek.bakchich.cc (stacked name, avatar that grows on scroll, word columns that
slide in, product cards, lab list, timeline), in orange, navy, mint and sky.
Fonts: Bowlby One + Bricolage Grotesque, self-hosted (`@fontsource`), so the page calls no third party.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # static site in dist/ (prerendered), deployable on any static host
npm run preview    # serve dist/ locally
```

## Where things are

| What | File |
|---|---|
| All text, products, lab, path, partners, links | `src/data.ts` |
| Hero and closing “Let’s build” (title, avatar, words, buttons, scroll animation) | `src/components/Stage.tsx`, used in `src/App.tsx` |
| Ticker, products (demo film, screenshots), lab, help, worked with, path, stack, links, footer | `src/components/Sections.tsx` |
| Navigation | `src/components/Nav.tsx` |
| Public address of the site | `.env` (`VITE_SITE_URL`) |
| Image and favicon scripts, prerender | `scripts/` |
| Sources of the images (avatar cutouts, logos, screenshots) | `assets-src/` |
| Container, nginx, k3s manifests | `Dockerfile`, `nginx/`, `deploy/` |

## SEO and GEO

- `npm run build` renders the page to HTML at build time (`src/entry-server.tsx`,
  `scripts/prerender.mjs`), so crawlers and AI assistants that do not run JavaScript
  read the full content.
- `index.html`: title, description, canonical, Open Graph, Twitter card and JSON-LD
  (`Person`, `ProfilePage`, `WebSite`, Tunispare as `Organization`, both avatars as `ImageObject`).
- Generated into `dist/` from `VITE_SITE_URL`: `robots.txt` (search and AI crawlers allowed),
  `sitemap.xml` (with the images), `llms.txt` (facts in plain markdown, from `scripts/llms.template.md`).
- For AI agents (checked with isitagentready.com, each one tested by the image's CI step):
  - `robots.txt` carries Content Signals in every group: `search=yes, ai-input=yes, ai-train=yes`
    (the site exists to be found; change the line in `scripts/prerender.mjs` to refuse training);
  - markdown negotiation: `/` asked with `Accept: text/markdown` returns `index.md` (the same
    text as `llms.txt`) as `text/markdown`; browsers still get the HTML (`Vary: Accept`);
  - a `Link` header on `/` (RFC 8288) pointing to the markdown, `llms.txt`, the skills index,
    the AI catalog and the sitemap;
  - `/.well-known/agent-skills/index.json`: one skill (`scripts/skill.template.md`), with the
    SHA-256 of the published file; `/.well-known/ai-catalog.json`: the facts and the skill, with
    sample questions. Both served as JSON to any origin (CORS `*`: public facts);
  - WebMCP (`src/webmcp.ts`): read-only tools for an agent in the browser — `get_profile`,
    `list_products`, `show_section`. Registered only when the browser offers the API.
  - Not done, on purpose: the API catalog, OAuth/OIDC metadata, `auth.md` and an MCP server
    card describe an API and a login, which this site doesn't have; DNS-AID is a draft that
    needs records and DNSSEC at the DNS host.
- **Change `VITE_SITE_URL` in `.env` when the domain is decided, then rebuild.**
- After going live: add the site to Google Search Console and Bing Webmaster Tools and
  submit `sitemap.xml`; put the site URL on the GitHub and LinkedIn profiles.

## Images and video

Run these from the repository root when the avatar changes:

```bash
python -I scripts/cutout.py "raw/avatar-renders/<render on flat colour>.webp" assets-src/avatar-shirt.png matte
python -I scripts/cutout.py "raw/avatar-renders/<render on checkerboard>.webp" assets-src/avatar-hoodie.png checker
python -I scripts/prepare_assets.py   # avatars, screenshots and logos into public/img (webp)
python -I scripts/favicons.py         # favicon set from the avatar head
```

`raw/` holds the working material and is ignored by git and Docker:

| Folder | What |
|---|---|
| `raw/avatar-renders/` | the AI avatar renders that `cutout.py` cuts out |
| `raw/photos/` | the reference photos the renders were made from |
| `raw/inspiration/` | screenshots of designs used as inspiration |
| `raw/prompts/` | the prompts used while designing |

- `public/og.jpg` is the 1200×630 share image (rendered from a small HTML page).
- `public/video/`: the Tunispare demo film re-encoded for the web from
  `presentation/demo/film/out` (720p full film, 25 s silent teaser, poster) with the
  ffmpeg that ships with Remotion.
- The moaneslife screens (`public/img/life-*.webp`) were captured from the live app;
  only screens without personal figures are used.

## Production

- `Dockerfile` + `nginx/`: the built site served by nginx as a non-root user, with a
  strict Content-Security-Policy, the other security headers, gzip and caching
  (hashed `/assets` one year, images and video one week, HTML always revalidated).
- `.github/workflows/ci.yml`: check → security → image → release, the same shape as the
  Tunispare apps.
- `deploy/README.md`: the one-time steps to put it on the VPS (k3s) and how it deploys after that.
  On the cluster the pod is fenced off by a NetworkPolicy (Traefik in, nothing out), and the
  release key is an environment secret that only `main` can use.

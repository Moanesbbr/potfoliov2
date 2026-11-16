// WebMCP (webmachinelearning.github.io/webmcp): tools an AI agent in the
// browser can call on this page. All read-only: they return the page's own
// facts or scroll to a section, never send anything anywhere.
import { channels, nav, products, profile, stack } from './data'

type Tool = {
  name: string
  description: string
  inputSchema: object
  execute: (input: Record<string, unknown>) => Promise<unknown>
}
type ModelContext = { registerTool: (tool: Tool, options?: { signal?: AbortSignal }) => Promise<void> | void }

const text = (value: unknown) => ({ content: [{ type: 'text', text: JSON.stringify(value, null, 2) }] })

const tools: Tool[] = [
  {
    name: 'get_profile',
    description: 'Who Moanes Ben Brahim is: role, location, availability for work, and how to contact him (email, call booking, GitHub, LinkedIn).',
    inputSchema: { type: 'object', properties: {} },
    execute: async () =>
      text({
        name: profile.name,
        role: profile.role,
        location: profile.location,
        bio: profile.bio,
        availability: profile.availability,
        email: profile.email,
        links: profile.links,
        channels,
        stack,
      }),
  },
  {
    name: 'list_products',
    description: 'The products Moanes Ben Brahim built or worked on, with his role, a one-line summary, the stack and the public address when there is one.',
    inputSchema: { type: 'object', properties: {} },
    execute: async () =>
      text(products.map((p) => ({ name: p.name, role: p.role, summary: p.tagline, stack: p.stack, url: p.url ?? null }))),
  },
  {
    name: 'show_section',
    description: 'Scroll the page to one of its sections so the user sees it.',
    inputSchema: {
      type: 'object',
      properties: { section: { type: 'string', enum: nav.map((n) => n.href.replace('#', '')), description: 'The section to show.' } },
      required: ['section'],
    },
    execute: async ({ section }) => {
      const el = typeof section === 'string' ? document.getElementById(section) : null
      if (!el) return text({ shown: false, reason: 'no such section' })
      el.scrollIntoView({ behavior: 'smooth' })
      return text({ shown: true, section })
    },
  },
]

export function registerWebMcpTools() {
  const ctx =
    (document as unknown as { modelContext?: ModelContext }).modelContext ??
    (navigator as unknown as { modelContext?: ModelContext }).modelContext
  if (!ctx?.registerTool) return
  for (const tool of tools) {
    try {
      void Promise.resolve(ctx.registerTool(tool)).catch(() => {})
    } catch {
      // a browser with an older draft of the API: the page works the same without it
    }
  }
}

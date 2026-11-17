import { useEffect, useRef, useState, type ReactNode } from 'react'
import { ArrowRight, ArrowUpRight, Play, Volume2, VolumeX, X } from 'lucide-react'
import { channels, help, lab, products, profile, stack, stats, tracks, workedWith, type LabStatus, type Product, type Theme } from '../data'

/* ---------- helpers ---------- */

export function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true)
          io.disconnect()
        }
      },
      { threshold: 0.1 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <div ref={ref} className={`reveal ${inView ? 'is-in' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

function H2({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <h2 className={`text-[clamp(2.4rem,5vw,4rem)] leading-[1.02] font-extrabold tracking-[-0.035em] ${className}`}>{children}</h2>
}

const wrap = 'mx-auto max-w-[1200px] px-5 md:px-10'

/* ---------- ticker ---------- */

export function Ticker() {
  const row = (
    <div className="flex shrink-0 items-center">
      {stats.map((s) => (
        <span key={s} className="flex items-center gap-8 pr-8 text-[19px] font-bold whitespace-nowrap text-navy">
          {s}
          <span aria-hidden className="text-[15px]">✦</span>
        </span>
      ))}
    </div>
  )
  return (
    <div className="overflow-hidden bg-mint py-3.5" aria-label={stats.join(', ')}>
      <div className="marquee-track" aria-hidden>
        {row}
        {row}
      </div>
    </div>
  )
}

/* ---------- products ---------- */

const THEMES: Record<Theme, { card: string; name: string; text: string; soft: string; line: string; chip: string; pill: string; frame: string }> = {
  navy: { card: 'bg-navy', name: 'text-mint', text: 'text-white', soft: 'text-white/70', line: 'border-white/20', chip: 'border-white/25 text-white/80', pill: 'bg-mint text-navy', frame: 'border-white/15 bg-navy-deep' },
  ink: { card: 'bg-ink', name: 'text-[#e8b84a]', text: 'text-white', soft: 'text-white/65', line: 'border-white/15', chip: 'border-white/20 text-white/75', pill: 'bg-[#e8b84a] text-ink', frame: 'border-white/10 bg-black' },
  orange: { card: 'bg-brand', name: 'text-navy', text: 'text-navy', soft: 'text-navy/80', line: 'border-navy/25', chip: 'border-navy/30 text-navy/85', pill: 'bg-navy text-white', frame: 'border-navy/20 bg-navy' },
  sky: { card: 'bg-sky', name: 'text-navy', text: 'text-navy', soft: 'text-navy/75', line: 'border-navy/20', chip: 'border-navy/25 text-navy/80', pill: 'bg-navy text-white', frame: 'border-navy/15 bg-white' },
}

function Screens({ p, t }: { p: Product; t: (typeof THEMES)[Theme] }) {
  // -1 = the demo film, 0..n = screenshots
  const [shot, setShot] = useState(p.video ? -1 : 0)
  const [open, setOpen] = useState(false)
  if (p.phone) {
    return (
      <div className="flex justify-center gap-3 sm:gap-4">
        {p.shots.slice(0, 3).map((s, i) => (
          <img
            key={s.src}
            src={s.src}
            alt={s.alt}
            loading="lazy"
            width={540}
            height={1169}
            className={`h-auto w-[31%] max-w-[190px] rounded-[22px] border-4 border-black shadow-2xl shadow-black/50 ${i === 1 ? '-translate-y-4' : 'translate-y-2'}`}
          />
        ))}
      </div>
    )
  }
  const showVideo = !!p.video && shot === -1
  const current = p.shots[Math.max(shot, 0)]
  return (
    <div>
      <div className={`relative overflow-hidden rounded-2xl border ${t.frame}`}>
        {showVideo && p.video ? (
          <>
            <Teaser src={p.video.teaser} poster={p.video.teaserPoster} label={`${p.name} in one minute: a narrated tour, with subtitles`} />
          </>
        ) : (
          <img src={current.src} alt={current.alt} width={1600} height={1000} loading="lazy" className="aspect-[16/10] w-full bg-white object-cover object-top" />
        )}
      </div>
      {/* Below the picture, not on it: the tour's subtitles run along its bottom edge. */}
      {showVideo && p.video && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-3 inline-flex items-center gap-2 rounded-full bg-mint px-4 py-2 text-[14px] font-bold text-navy shadow-lg transition-transform hover:scale-[1.04]"
        >
          <Play size={15} fill="currentColor" /> Watch the full demo · {p.video.length}
        </button>
      )}
      {open && p.video && <VideoDialog src={p.video.full} poster={p.video.poster} title={`${p.name} demo film`} onClose={() => setOpen(false)} />}
      {p.shots.length > 1 && (
        <div className={`mt-3 grid gap-2.5 ${p.video ? 'grid-cols-5' : 'grid-cols-4'}`}>
          {p.video && (
            <button
              type="button"
              onClick={() => setShot(-1)}
              aria-label="Show the demo film"
              className={`relative overflow-hidden rounded-lg border-2 bg-navy-deep transition ${shot === -1 ? 'border-current' : 'border-transparent opacity-60 hover:opacity-100'} ${t.text}`}
            >
              <img src={p.video.teaserPoster} alt={`${p.name} in one minute, opening frame`} loading="lazy" className="aspect-[16/10] w-full object-cover" />
              <span className="absolute inset-0 flex items-center justify-center bg-black/35 text-white">
                <Play size={18} fill="currentColor" />
              </span>
            </button>
          )}
          {p.shots.map((s, i) => (
            <button
              key={s.src}
              type="button"
              onClick={() => setShot(i)}
              aria-label={`Show screenshot: ${s.alt}`}
              className={`overflow-hidden rounded-lg border-2 bg-white transition ${i === shot ? 'border-current' : 'border-transparent opacity-60 grayscale hover:opacity-100 hover:grayscale-0'} ${t.text}`}
            >
              <img src={s.src} alt={`Thumbnail: ${s.alt}`} loading="lazy" className="aspect-[16/10] w-full bg-white object-cover object-top" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/** The one-minute tour: square, subtitled, playing muted like any autoplay; one tap turns the
 *  voice on and starts it again from the beginning. Shown whole, in a square frame, so the
 *  subtitles stay readable. */
function Teaser({ src, poster, label }: { src: string; poster: string; label: string }) {
  const video = useRef<HTMLVideoElement>(null)
  const [muted, setMuted] = useState(true)
  const toggle = () => {
    const v = video.current
    if (!v) return
    if (muted) {
      v.currentTime = 0
      v.muted = false
      void v.play()
    } else v.muted = true
    setMuted(!muted)
  }
  return (
    <>
      <video
        ref={video}
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={label}
        className="aspect-square w-full bg-[#eef1fb] object-contain"
      />
      <button
        type="button"
        onClick={toggle}
        aria-pressed={!muted}
        className="absolute top-3 right-3 inline-flex items-center gap-2 rounded-full bg-navy/85 px-3.5 py-2 text-[13px] font-bold text-white shadow-lg backdrop-blur transition-transform hover:scale-[1.04]"
      >
        {muted ? <VolumeX size={15} /> : <Volume2 size={15} />} {muted ? 'Sound on' : 'Mute'}
      </button>
    </>
  )
}

function VideoDialog({ src, poster, title, onClose }: { src: string; poster: string; title: string; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])
  return (
    <div role="dialog" aria-modal="true" aria-label={title} className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-deep/90 p-3 backdrop-blur-sm sm:p-8" onClick={onClose}>
      <div className="relative w-full max-w-6xl" onClick={(e) => e.stopPropagation()}>
        <button type="button" onClick={onClose} aria-label="Close the film" className="absolute -top-11 right-0 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[14px] font-bold text-navy">
          <X size={15} /> Close
        </button>
        <video src={src} poster={poster} controls autoPlay playsInline className="aspect-video w-full rounded-xl bg-black shadow-2xl" />
      </div>
    </div>
  )
}

function ProductCard({ p }: { p: Product }) {
  const t = THEMES[p.theme]
  return (
    <Reveal>
      <article id={p.id} className={`rounded-[28px] p-6 sm:p-10 md:p-12 ${t.card} ${t.text}`}>
        <div className="grid gap-8 md:grid-cols-2 md:gap-12">
          <div>
            <span className={`inline-block rounded-full px-3 py-1 text-[13px] font-bold ${t.pill}`}>{p.kind}</span>
            <h3 className={`heading mt-5 leading-[0.95] ${p.name.length > 9 && !p.name.includes(' ') ? 'text-[clamp(2.2rem,4.8vw,3.9rem)]' : 'text-[clamp(2.6rem,6vw,4.6rem)]'} ${t.name}`}>{p.name}</h3>
            <p className="mt-4 max-w-md text-[clamp(1.2rem,2vw,1.45rem)] leading-snug font-bold">{p.tagline}</p>
          </div>
          <div>
            <p className="text-[16px] font-bold">{p.role}</p>
            <p className={`mt-3 text-[16px] leading-relaxed ${t.soft}`}>{p.story}</p>
            {p.url ? (
              <a href={p.url} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-1.5 text-[16px] font-bold underline decoration-2 underline-offset-4 hover:opacity-75">
                {p.urlLabel} <ArrowUpRight size={16} />
              </a>
            ) : (
              p.note && <p className={`mt-5 text-[14px] font-bold ${t.soft}`}>{p.note}</p>
            )}
          </div>
        </div>

        <div className="mt-10 grid items-start gap-8 md:grid-cols-2 md:gap-12">
          <div className="order-2 md:order-1">
            <ul className="space-y-3">
              {p.points.map((pt) => (
                <li key={pt} className={`flex gap-3 text-[15px] leading-relaxed ${t.soft}`}>
                  <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-current" />
                  {pt}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-2">
              {p.stack.map((s) => (
                <span key={s} className={`rounded-full border px-3 py-1 text-[13px] font-semibold ${t.chip}`}>
                  {s}
                </span>
              ))}
            </div>
          </div>
          <div className="order-1 md:order-2">
            <Screens p={p} t={t} />
          </div>
        </div>

        <dl className={`mt-10 grid grid-cols-2 gap-6 border-t pt-8 sm:grid-cols-3 ${t.line}`}>
          {p.metrics.map((m) => (
            <div key={m.label}>
              <dt className="heading text-[clamp(2rem,4vw,3rem)] leading-none">{m.value}</dt>
              <dd className={`mt-2 text-[15px] font-semibold ${t.soft}`}>{m.label}</dd>
            </div>
          ))}
        </dl>
      </article>
    </Reveal>
  )
}

export function Products() {
  return (
    <section id="products" className="scroll-mt-16 bg-paper pt-24 pb-24 md:pt-32">
      <div className={wrap}>
        <Reveal>
          <H2 className="max-w-3xl">
            One company I founded, one app I live in, and the platforms I built for others
          </H2>
        </Reveal>
        <div className="mt-14 space-y-8">
          {products.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      </div>
    </section>
  )
}

export function LiveStrip() {
  return (
    <a href="https://tunispare.com" target="_blank" rel="noreferrer" className="group block bg-navy text-white">
      <div className={`${wrap} flex flex-col gap-3 py-6 sm:flex-row sm:items-center sm:justify-between`}>
        <span className="flex items-center gap-3 text-[18px] font-bold">
          <span className="live-dot h-2.5 w-2.5 shrink-0 rounded-full bg-mint" />
          Tunispare is live: AI search, its own cluster, monitored day and night
        </span>
        <span className="flex items-center gap-2 text-[18px] font-bold text-mint">
          Visit tunispare.com <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </a>
  )
}

/* ---------- lab ---------- */

const STATUS_DOT: Record<LabStatus, string> = {
  Live: 'bg-[#2bb24c]',
  'Open source': 'bg-[#2d6cdf]',
  Private: 'bg-brand',
  Academic: 'bg-navy/40',
}

export function Lab() {
  const filters = ['All', 'Live', 'Open source', 'Private', 'Academic'] as const
  const [filter, setFilter] = useState<(typeof filters)[number]>('All')
  const count = (f: (typeof filters)[number]) => (f === 'All' ? lab.length : lab.filter((l) => l.status === f).length)
  const items = lab.filter((l) => filter === 'All' || l.status === filter)
  return (
    <section id="lab" className="scroll-mt-16 bg-paper pb-28">
      <div className={wrap}>
        <Reveal className="grid gap-6 border-t border-navy/15 pt-24 md:grid-cols-2 md:items-end">
          <H2>The Lab</H2>
          <p className="max-w-md text-[16px] leading-relaxed text-navy/70">
            Smaller products, open-source tools and school projects. Some are live, some stay private. Each row says which.
          </p>
        </Reveal>
        <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label="Filter the lab">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              role="tab"
              aria-selected={filter === f}
              onClick={() => setFilter(f)}
              className={`rounded-full border-2 border-navy px-4 py-1.5 text-[14px] font-bold transition ${filter === f ? 'bg-navy text-white' : 'text-navy hover:bg-navy/5'}`}
            >
              {f} <span className="ml-1 opacity-60">{count(f)}</span>
            </button>
          ))}
        </div>
        <ul className="mt-6">
          {items.map((l) => (
            <li key={l.name} className="grid gap-1 border-t border-navy/12 py-4 sm:grid-cols-[15rem_1fr_auto] sm:items-baseline sm:gap-8">
              {l.url ? (
                <a href={l.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[17px] font-bold underline decoration-2 underline-offset-4 hover:text-brand">
                  {l.name} <ArrowUpRight size={15} />
                </a>
              ) : (
                <span className="text-[17px] font-bold">{l.name}</span>
              )}
              <span className="text-[15px] leading-relaxed text-navy/70">{l.text}</span>
              <span className="inline-flex items-center gap-2 text-[13px] font-bold whitespace-nowrap">
                <span className={`h-2 w-2 rounded-full ${STATUS_DOT[l.status]}`} />
                {l.status}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ---------- help ---------- */

export function Help() {
  return (
    <section id="help" className="scroll-mt-16 bg-brand text-navy">
      <div className={`${wrap} py-24 md:py-32`}>
        <Reveal>
          <H2 className="text-white">Three ways I can help</H2>
        </Reveal>
        <div className="mt-14 grid gap-10 md:grid-cols-3">
          {help.map((h, i) => (
            <Reveal key={h.title} delay={i * 90} className="border-t-2 border-white/50 pt-6">
              <h3 className="heading text-[clamp(2.4rem,4vw,3.2rem)] leading-none text-white">{h.title}</h3>
              <p className="mt-4 text-[16px] leading-relaxed font-medium">{h.text}</p>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-16 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl text-[clamp(1.15rem,2vw,1.4rem)] leading-snug font-bold">
            A full-time role or a freelance mission, in Tunisia, abroad or remotely. In English, French or Arabic.
          </p>
          <a href={profile.links.calendly} target="_blank" rel="noreferrer" className="inline-flex shrink-0 items-center gap-2 self-start rounded-full bg-navy px-6 py-3 text-[16px] font-bold text-white transition-transform hover:scale-[1.04] sm:self-auto">
            Book a call
          </a>
        </Reveal>
      </div>
    </section>
  )
}

/* ---------- worked with ---------- */

export function WorkedWith() {
  return (
    <section className="bg-paper">
      <div className={`${wrap} py-24 md:py-32`}>
        <Reveal>
          <H2>Who I have worked with</H2>
          <p className="mt-4 max-w-md text-[16px] text-navy/70">Employers, clients and the mobile apps I shipped for them.</p>
        </Reveal>
        <ul className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {workedWith.map((w, i) => (
            <li key={w.name}>
              <Reveal delay={i * 40} className="flex h-32 flex-col items-center justify-center rounded-2xl bg-white px-4 text-center text-navy shadow-sm">
                <img src={w.logo} alt={`${w.name} logo`} loading="lazy" className="max-h-[58px] w-auto max-w-[78%] object-contain" />
                <span className="mt-2 text-[12px] font-semibold opacity-60">
                  {w.name} · {w.note}
                </span>
              </Reveal>
            </li>
          ))}
          <li>
            <Reveal delay={workedWith.length * 40}>
              <a href="#contact" className="flex h-32 items-center justify-center rounded-2xl bg-mint px-3 text-center transition-transform hover:scale-[1.03]">
                <span className="heading text-[1.6rem] leading-[0.95] text-navy">
                  Yours
                  <br />
                  next?
                </span>
              </a>
            </Reveal>
          </li>
        </ul>
      </div>
    </section>
  )
}

/* ---------- path ---------- */

export function Path() {
  return (
    <section id="path" className="scroll-mt-16 bg-paper">
      <div className={`${wrap} pb-28`}>
        <Reveal>
          <H2>How I got here</H2>
          <p className="mt-4 max-w-xl text-[16px] text-navy/70">Three tracks that run side by side: my studies, my jobs, and the company I founded while working.</p>
        </Reveal>
        <div className="mt-12 space-y-10">
          {tracks.map((t) => (
            <Reveal key={t.id} className="grid gap-4 border-t-[3px] border-navy pt-5 lg:grid-cols-[11rem_1fr] lg:gap-8">
              <h3 className="heading text-[1.7rem] leading-none text-brand">{t.label}</h3>
              <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                {t.steps.map((s) => (
                  <li key={s.title}>
                    <p className="flex flex-wrap items-center gap-2 text-[14px] font-bold text-navy/60">
                      {s.period}
                      {s.current && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-navy px-2.5 py-0.5 text-[12px] text-white">
                          <span className="h-1.5 w-1.5 rounded-full bg-mint" /> Current
                        </span>
                      )}
                    </p>
                    <p className="mt-2 text-[20px] leading-tight font-extrabold">{s.title}</p>
                    <p className="text-[15px] font-semibold text-navy/70">{s.role}</p>
                    <p className="mt-2 text-[14px] leading-relaxed text-navy/75">{s.text}</p>
                  </li>
                ))}
              </ol>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------- stack ---------- */

export function Stack() {
  return (
    <section id="stack" className="scroll-mt-16 bg-navy text-white">
      <div className={`${wrap} py-24 md:py-32`}>
        <Reveal>
          <H2>The stack I work in</H2>
        </Reveal>
        <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {stack.map((c, i) => (
            <Reveal key={c.title} delay={i * 80} className="border-t border-white/30 pt-5">
              <h3 className="heading text-[1.7rem] text-mint">{c.title}</h3>
              <ul className="mt-4 space-y-1.5">
                {c.items.map((it) => (
                  <li key={it} className="text-[16px] font-medium text-white/90">
                    {it}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------- channels ---------- */

export function Channels() {
  return (
    <section className="bg-mint text-navy">
      <div className={`${wrap} py-24 md:py-32`}>
        <Reveal className="grid gap-6 md:grid-cols-2 md:items-end">
          <H2>
            Where to find
            <br />
            my work
          </H2>
          <p className="max-w-md text-[16px] leading-relaxed text-navy/80">Code on GitHub, the story on LinkedIn, and Tunispare’s guides for the workshops it serves.</p>
        </Reveal>
        <ul className="mt-12 border-b-2 border-navy">
          {channels.map((c) => (
            <li key={c.name}>
              <a
                href={c.href}
                {...(c.href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}
                className="group grid gap-1 border-t-2 border-navy py-4 sm:grid-cols-[16rem_1fr_auto] sm:items-center sm:gap-8"
              >
                <span className="text-[clamp(1.8rem,3.4vw,2.5rem)] leading-tight font-extrabold tracking-tight">{c.name}</span>
                <span className="text-[15px] text-navy/80">{c.text}</span>
                <span className="inline-flex items-center gap-1 text-[15px] font-bold group-hover:underline">
                  {c.handle} <ArrowUpRight size={15} />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ---------- footer ---------- */

export function Footer() {
  return (
    <footer className="bg-navy-deep text-white/80">
      <div className="flex flex-col gap-3 px-5 py-6 text-[14px] font-medium sm:flex-row sm:items-center sm:justify-between md:px-[4vw]">
        <span>© {new Date().getFullYear()} {profile.name}</span>
        <a href="#top" className="hover:text-white">
          Back to top ↑
        </a>
        <span>{profile.location}</span>
      </div>
    </footer>
  )
}

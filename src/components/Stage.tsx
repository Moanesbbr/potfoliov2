import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

type Layer = { color: string; x: number; y: number }

/**
 * Stacked retro title: a white face with coloured layers stepping down-right.
 * With `drop`, the layers start hidden behind the face and fall into place.
 */
export function StackedTitle({ text, size, colors, drop = false, as: Tag = 'h1', label }: { text: string; size: string; colors: [string, string, string]; drop?: boolean; as?: 'h1' | 'h2'; label?: string }) {
  const [settled, setSettled] = useState(!drop)
  useEffect(() => {
    if (!drop) return
    const t = window.setTimeout(() => setSettled(true), 500)
    return () => window.clearTimeout(t)
  }, [drop])

  // offsets in em so they scale with the title on every screen
  const layers: Layer[] = [
    { color: colors[0], x: 0.03, y: 0.075 },
    { color: colors[1], x: 0.02, y: 0.05 },
    { color: colors[2], x: 0.01, y: 0.025 },
    { color: '#f7f6f2', x: 0, y: 0 },
  ]
  return (
    <div className="relative" style={{ fontSize: size }}>
      {layers.map((l, i) => {
        const front = i === layers.length - 1
        const style = {
          color: l.color,
          transform: `translate(${settled ? l.x : 0}em, ${settled ? l.y : 0}em)`,
          transition: drop ? `transform 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) ${(layers.length - 1 - i) * 0.1}s` : undefined,
        }
        const cls = `${front ? 'relative' : 'absolute inset-0'} heading leading-[0.9] whitespace-nowrap uppercase select-none`
        return front ? (
          <Tag key={i} className={cls} style={style}>
            {/* search engines and screen readers get the full sentence, the eye gets the wordmark */}
            {label && <span className="sr-only">{label}</span>}
            <span aria-hidden={label ? true : undefined}>{text}</span>
          </Tag>
        ) : (
          <span key={i} aria-hidden className={cls} style={style}>
            {text}
          </span>
        )
      })}
    </div>
  )
}

// fine film grain as an SVG data URI
const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")"

// The render is cropped at the shoulders: fade the sides of the lower part only,
// so the head (and the ears) stay whole.
const FADE_LAYERS = 'linear-gradient(#000, #000), linear-gradient(to right, transparent, #000 15%, #000 85%, transparent)'
const SHOULDER_FADE: CSSProperties = {
  maskImage: FADE_LAYERS,
  maskSize: '100% 62%, 100% 38.5%',
  maskPosition: 'top, bottom',
  maskRepeat: 'no-repeat',
  WebkitMaskImage: FADE_LAYERS,
  WebkitMaskSize: '100% 62%, 100% 38.5%',
  WebkitMaskPosition: 'top, bottom',
  WebkitMaskRepeat: 'no-repeat',
}

type StageProps = {
  id?: string
  bg: string
  glow: string
  panel: string
  title: ReactNode
  avatar: string
  avatarAlt: string
  words?: { left: string[]; right: string[] }
  bottomLeft: ReactNode
  bottomRight: ReactNode
  animate?: boolean
}

/**
 * Full-width stage: big title at the top, avatar standing at the bottom centre,
 * optional word columns at face height, text bottom-left and buttons bottom-right.
 * On phones the words, text and buttons sit in a dark panel under the picture.
 *
 * While the stage scrolls away, the avatar grows from its feet and the word
 * columns slide toward the centre (driven by the --p custom property, 0 → 1).
 */
export function Stage({ id, bg, glow, panel, title, avatar, avatarAlt, words, bottomLeft, bottomRight, animate = false }: StageProps) {
  const ref = useRef<HTMLElement>(null)
  const rise = animate ? 'hero-rise' : ''

  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    const update = () => {
      raf = 0
      const rect = el.getBoundingClientRect()
      // 0 when the stage top touches the viewport top, 1 after ~55 % of a screen
      const p = Math.min(1, Math.max(0, -rect.top / (window.innerHeight * 0.55)))
      el.style.setProperty('--p', p.toFixed(4))
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section ref={ref} id={id} className="relative overflow-hidden" style={{ backgroundColor: bg, ['--p' as string]: 0 }}>
      <div className="relative h-[64svh] min-h-[460px] md:h-svh md:min-h-[680px]">
        <div className="pointer-events-none absolute inset-0" style={{ background: glow }} />

        <div className={`${rise} absolute inset-x-0 top-[74px] flex justify-center md:top-[84px]`}>{title}</div>

        {/* outer box: scroll zoom from the feet; inner image: entrance animation */}
        <div
          className="pointer-events-none absolute bottom-0 left-1/2 z-10 h-[74%] md:h-[76%]"
          style={{ transform: 'translateX(-50%) scale(calc(1 + var(--p) * 0.14))', transformOrigin: '50% 100%', willChange: 'transform' }}
        >
          <img
            src={avatar}
            alt={avatarAlt}
            width={1100}
            height={1204}
            className={`${animate ? 'avatar-rise' : ''} block h-full w-auto max-w-none`}
            style={SHOULDER_FADE}
            {...(animate ? { fetchPriority: 'high' as const } : { loading: 'lazy' as const })}
          />
        </div>

        <div className="pointer-events-none absolute inset-0 z-[15] opacity-[0.08] mix-blend-overlay" style={{ backgroundImage: GRAIN }} />

        {words && (
          <div className="pointer-events-none absolute inset-x-0 top-[47%] hidden justify-between px-[4vw] md:flex">
            <div style={{ transform: 'translateX(calc(var(--p) * 100px))' }}>
              <WordColumn items={words.left} side="left" animate={animate} />
            </div>
            <div style={{ transform: 'translateX(calc(var(--p) * -100px))' }}>
              <WordColumn items={words.right} side="right" animate={animate} />
            </div>
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 z-20 hidden items-end justify-between gap-8 px-[4vw] pb-10 md:flex">
          <div className={`${rise} max-w-[320px] text-[17px] leading-relaxed font-medium text-white`} style={{ animationDelay: '0.9s' }}>
            {bottomLeft}
          </div>
          <div className={`${rise} flex shrink-0 flex-wrap justify-end gap-3`} style={{ animationDelay: '1s' }}>
            {bottomRight}
          </div>
        </div>
      </div>

      {/* phones: everything under the picture */}
      <div className="space-y-7 px-5 py-9 md:hidden" style={{ backgroundColor: panel }}>
        {words && (
          <div className="flex justify-between" aria-hidden>
            <WordColumn items={words.left} side="left" animate={false} />
            <WordColumn items={words.right} side="right" animate={false} />
          </div>
        )}
        <div className="text-[17px] leading-relaxed font-medium text-white">{bottomLeft}</div>
        <div className="flex flex-col items-start gap-3">{bottomRight}</div>
      </div>
    </section>
  )
}

function WordColumn({ items, side, animate }: { items: string[]; side: 'left' | 'right'; animate: boolean }) {
  return (
    <ul className={`flex flex-col ${side === 'right' ? 'items-end text-right' : ''}`}>
      {items.map((w, i) => (
        <li
          key={w}
          className={`${animate ? 'word-in' : ''} text-[1.35rem] leading-[1.12] font-extrabold tracking-tight text-white/55 uppercase select-none md:text-[clamp(2rem,3.3vw,3.4rem)]`}
          style={animate ? ({ animationDelay: `${0.6 + i * 0.08}s`, ['--from' as string]: side === 'left' ? '-40px' : '40px' } as CSSProperties) : undefined}
        >
          {w}
        </li>
      ))}
    </ul>
  )
}

export function PillLink({ href, children, variant }: { href: string; children: ReactNode; variant: 'solid' | 'outline' }) {
  const external = href.startsWith('http')
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
      className={
        variant === 'solid'
          ? 'inline-flex items-center gap-2 rounded-full bg-mint px-6 py-3 text-[16px] font-bold text-navy transition-transform hover:scale-[1.04] active:scale-95'
          : 'inline-flex items-center gap-2 rounded-full border-2 border-white px-6 py-[10px] text-[16px] font-bold text-white transition-colors hover:bg-white/10'
      }
    >
      {children}
    </a>
  )
}

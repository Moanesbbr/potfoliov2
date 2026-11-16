import { useEffect, useState } from 'react'
import { nav, profile } from '../data'

export function Nav() {
  const [solid, setSolid] = useState(false)
  useEffect(() => {
    const f = () => setSolid(window.scrollY > 40)
    f()
    window.addEventListener('scroll', f, { passive: true })
    return () => window.removeEventListener('scroll', f)
  }, [])

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${solid ? 'bg-navy/90 backdrop-blur-md' : 'bg-transparent'}`}>
      <nav className="flex items-center justify-between px-5 py-3.5 md:px-[4vw]">
        <a href="#top" className="heading text-[22px] text-white uppercase">
          {profile.short}
        </a>
        <div className="hidden items-center gap-8 lg:flex">
          {nav.map((n) => (
            <a key={n.href} href={n.href} className="text-[17px] font-semibold text-white/95 transition-opacity hover:opacity-70">
              {n.label}
            </a>
          ))}
        </div>
        <a href={profile.links.calendly} target="_blank" rel="noreferrer" className="rounded-full bg-mint px-5 py-2.5 text-[16px] font-bold text-navy transition-transform hover:scale-[1.04]">
          Let’s talk
        </a>
      </nav>
    </header>
  )
}

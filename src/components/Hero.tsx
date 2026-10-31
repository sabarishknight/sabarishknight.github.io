import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { site } from '../data/content'
import { SkillIcon } from '../lib/icons'
import ScatterCanvas from './ScatterCanvas'

function Typewriter({ words }: { words: string[] }) {
  const [i, setI] = useState(0)
  const [n, setN] = useState(0)
  const [del, setDel] = useState(false)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const t = setInterval(() => setI((x) => (x + 1) % words.length), 2200)
      setN(99)
      return () => clearInterval(t)
    }
    const w = words[i]
    const t = setTimeout(
      () => {
        if (!del && n < w.length) setN(n + 1)
        else if (!del) setDel(true)
        else if (n > 0) setN(n - 1)
        else {
          setDel(false)
          setI((i + 1) % words.length)
        }
      },
      !del && n === w.length ? 1400 : del ? 35 : 75,
    )
    return () => clearTimeout(t)
  }, [n, del, i, words])
  return <span className="caret">{words[i].slice(0, n)}</span>
}

const rise = (d: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: d, type: 'spring' as const, stiffness: 140, damping: 18 },
})

export default function Hero() {
  const ref = useRef<HTMLElement>(null)
  return (
    <section id="top" ref={ref} className="relative overflow-hidden border-b-[3px] border-line">
      <ScatterCanvas host={ref} />
      <div className="wrap pointer-events-none relative pb-12 pt-10 md:pt-16">
        <motion.div {...rise(0)} className="pointer-events-auto inline-flex flex-wrap items-center gap-2">
          <span className="brut-sm bg-lime px-3 py-1 font-mono text-sm font-semibold text-[#0a0a0a]">
            <span className="mr-1.5 inline-block h-2.5 w-2.5 animate-pulse rounded-full bg-[#0a0a0a] align-middle" aria-hidden="true" />
            Open to work · {site.available}
          </span>
          <span className="brut-sm bg-surface px-3 py-1 font-mono text-sm">📍 {site.location}</span>
        </motion.div>
        <motion.h1 {...rise(0.06)} className="mt-5 text-[clamp(4.2rem,17vw,15rem)] leading-[0.8]">
          Sabarish&nbsp;G
        </motion.h1>
        <motion.p {...rise(0.1)} className="mt-6 max-w-[30ch] font-display text-[clamp(1.6rem,3vw,2.5rem)] font-bold leading-[1.05] tracking-tight">
          {site.tagline}
        </motion.p>
        <motion.p {...rise(0.14)} className="mt-4 font-mono text-[clamp(1rem,1.6vw,1.2rem)]" aria-live="off">
          <span className="text-pink">&gt;&gt;&gt;</span> focus = "<Typewriter words={site.rotating} />"
        </motion.p>
        <motion.div {...rise(0.18)} className="pointer-events-auto mt-7 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
          <HeroBtn href={site.github} label="GitHub" icon="github" bg="var(--surface)" />
          <HeroBtn href={site.linkedin} label="LinkedIn" icon="linkedin" bg="var(--cyan)" />
          <HeroBtn href={site.resume} label="Resume ↓" bg="var(--pink)" download />
          <HeroBtn href={`mailto:${site.email}`} label="Email" icon="gmail" bg="var(--lime)" />
        </motion.div>
        <AboutMe />
      </div>
    </section>
  )
}

/** The bio, set as a Python function you could actually read in a notebook. */
function AboutMe() {
  const k = (t: string) => <span className="text-pink">{t}</span>
  const str = (t: string) => <span className="text-[#0f7b3a] dark:text-lime">"{t}"</span>
  return (
    <motion.div {...rise(0.24)} className="pointer-events-auto brut mt-14 overflow-hidden" data-no-add>
      <div className="on-accent flex items-center justify-between border-b-[3px] border-line bg-sun px-5 py-2.5 font-mono text-sm font-bold">
        <span>In [1]: about_me()</span>
        <span className="hidden sm:inline">about_me.py</span>
      </div>
      <div className="grid gap-6 p-5 md:p-8 lg:grid-cols-[1.5fr_1fr]">
        <div>
          <p className="font-mono text-sm">
            {k('def')} <span className="font-bold">about_me</span>():
          </p>
          <p className="mt-3 border-l-4 border-pink pl-4 text-[clamp(1.15rem,1.7vw,1.4rem)] leading-relaxed">{site.bio}</p>
        </div>
        <div className="brut-sm self-start bg-paper p-4 font-mono text-[15px] leading-relaxed">
          <p>
            {k('return')} {'{'}
          </p>
          <div className="pl-5">
            <p>
              {str('based_in')}: {str(site.location)},
            </p>
            <p>{str('open_to')}: [</p>
            <ul className="pl-5">
              {site.roles.map((r) => (
                <li key={r}>{str(r)},</li>
              ))}
            </ul>
            <p>],</p>
            <p>
              {str('available')}: {str('Dec 2026')},
            </p>
          </div>
          <p>{'}'}</p>
          <p className="mt-3 text-xs opacity-80"># any of these roles: let’s talk</p>
        </div>
      </div>
    </motion.div>
  )
}

function HeroBtn({ href, label, icon, bg, download }: { href: string; label: string; icon?: string; bg: string; download?: boolean }) {
  const ext = href.startsWith('http')
  const accent = bg !== 'var(--surface)'
  return (
    <a
      href={href}
      {...(ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...(download ? { download: '' } : {})}
      className={`brut-sm press flex items-center justify-center gap-2 px-3 py-3 font-display text-lg font-bold ${accent ? 'on-accent' : ''}`}
      style={{ background: bg }}
    >
      {icon && <SkillIcon name={label} slug={icon} size={20} />}
      {label}
    </a>
  )
}

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { site } from '../data/content'
import { SkillIcon } from '../lib/icons'
import ScatterCanvas from './ScatterCanvas'
import Counters from './Counters'

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
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1.05fr] lg:items-start">
          <div>
            <motion.p {...rise(0.12)} className="max-w-[24ch] font-display text-[clamp(1.6rem,3vw,2.5rem)] font-bold leading-[1.05] tracking-tight">
              {site.tagline}
            </motion.p>
            <motion.p {...rise(0.18)} className="mt-5 font-mono text-[clamp(1rem,1.6vw,1.2rem)]" aria-live="off">
              <span className="text-pink">&gt;&gt;&gt;</span> focus = "<Typewriter words={site.rotating} />"
            </motion.p>
            <motion.div {...rise(0.22)} className="pointer-events-auto mt-7 grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              <HeroBtn href={site.github} label="GitHub" icon="github" bg="var(--surface)" />
              <HeroBtn href={site.linkedin} label="LinkedIn" icon="linkedin" bg="var(--cyan)" />
              <HeroBtn href={site.resume} label="Resume ↓" bg="var(--pink)" download />
              <HeroBtn href={`mailto:${site.email}`} label="Email" icon="gmail" bg="var(--lime)" />
            </motion.div>
          </div>
          <motion.div {...rise(0.26)} className="pointer-events-auto brut relative p-5 md:p-6">
            <p className="font-mono text-xs font-semibold opacity-70">In [1]: about_me()</p>
            <p className="mt-2 text-[17px] leading-relaxed">{site.bio}</p>
            <p className="mt-4 font-mono text-sm">
              <span className="bg-sun px-1.5 py-0.5 text-[#0a0a0a]">open_to</span> {site.openTo}
            </p>
          </motion.div>
        </div>
      </div>
      <div className="wrap pointer-events-none relative pb-12">
        <Counters />
        <p className="mt-6 hidden font-mono text-xs opacity-70 md:block" aria-hidden="true">
          ↖ tip: click anywhere in this hero to add a data point and watch the regression line refit · press / for commands
        </p>
      </div>
    </section>
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

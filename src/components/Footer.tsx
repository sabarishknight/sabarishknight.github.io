import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { site } from '../data/content'
import { SkillIcon } from '../lib/icons'
import { toast } from '../lib/util'

/** Scroll back to the top and count an epoch: the page loops like a training run. */
export function runEpoch() {
  window.dispatchEvent(new Event('epoch'))
  window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
  toast('Epoch complete. Restarting from the top, a little wiser.')
}

export default function Footer() {
  const [pull, setPull] = useState(0)
  // keep wheeling past the bottom and the page loops back to the top
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let acc = 0
    let reset = 0
    const onWheel = (e: WheelEvent) => {
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4
      if (!atBottom || e.deltaY <= 0) {
        acc = 0
        setPull(0)
        return
      }
      acc += e.deltaY
      setPull(Math.min(1, acc / 900))
      clearTimeout(reset)
      reset = window.setTimeout(() => {
        acc = 0
        setPull(0)
      }, 900)
      if (acc > 900) {
        acc = 0
        setPull(0)
        runEpoch()
      }
    }
    window.addEventListener('wheel', onWheel, { passive: true })
    return () => window.removeEventListener('wheel', onWheel)
  }, [])

  const others = site.otherLinks.filter((l) => l.url)
  return (
    <footer id="contact" className="invert-block border-t-[3px] border-line bg-paper pt-20 text-ink" aria-labelledby="contact-h">
      <div className="wrap">
        <h2 id="contact-h" className="text-[clamp(3.6rem,13vw,10rem)] leading-[0.85]">
          Let’s talk.
        </h2>
        <p className="mt-6 max-w-[48ch] text-xl">
          Hiring for data science, ML, analytics or product? Email is the fastest way to reach me. {site.available}.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href={`mailto:${site.email}`} className="brut-sm press flex items-center gap-2 bg-lime px-5 py-3 font-display text-xl font-bold text-[#0a0a0a]">
            <SkillIcon name="Email" slug="gmail" size={22} /> {site.email}
          </a>
          <a href={site.github} target="_blank" rel="noopener noreferrer" className="brut-sm press flex items-center gap-2 bg-surface px-5 py-3 font-display text-xl font-bold text-ink">
            <SkillIcon name="GitHub" slug="github" size={22} /> GitHub
          </a>
          <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className="brut-sm press flex items-center gap-2 bg-cyan px-5 py-3 font-display text-xl font-bold text-[#0a0a0a]">
            <SkillIcon name="LinkedIn" slug="linkedin" size={22} /> LinkedIn
          </a>
          {others.map((l) => (
            <a key={l.label} href={l.url} target="_blank" rel="noopener noreferrer" className="brut-sm press bg-surface px-5 py-3 font-display text-xl font-bold text-ink">
              {l.label}
            </a>
          ))}
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t-[3px] border-ink/30 pt-6">
          <button onClick={runEpoch} className="brut-sm press flex items-center gap-3 bg-pink px-5 py-3 font-display text-xl font-bold text-[#0a0a0a]">
            <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 3, ease: 'linear' }} aria-hidden="true">
              ↻
            </motion.span>
            Run another epoch
          </button>
          <div className="flex items-center gap-3 font-mono text-sm" aria-hidden="true">
            <span>keep scrolling to loop</span>
            <span className="h-3 w-32 border-2 border-ink">
              <span className="block h-full bg-lime" style={{ width: `${pull * 100}%` }} />
            </span>
          </div>
        </div>
      </div>
      <p className="mt-10 select-none overflow-hidden whitespace-nowrap text-center font-display text-[19vw] font-extrabold leading-[0.78] tracking-tighter text-ink/15" aria-hidden="true">
        SABARISH G
      </p>
      <div className="wrap flex flex-wrap justify-between gap-2 pb-6 pt-4 font-mono text-xs opacity-80">
        <span>© {new Date().getFullYear()} Sabarish G · Bengaluru · built with React, Framer Motion and matter-js</span>
        <span>Brand logos: Simple Icons (CC0) · press / for commands · try the Konami code</span>
      </div>
    </footer>
  )
}

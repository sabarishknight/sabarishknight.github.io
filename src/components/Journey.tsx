import { useRef, useState } from 'react'
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion'
import { journey, type JourneyType } from '../data/content'

const tone: Record<JourneyType, { bg: string; icon: string }> = {
  Research: { bg: 'var(--pink)', icon: '📄' },
  Project: { bg: 'var(--lime)', icon: '🛠' },
  Education: { bg: 'var(--cyan)', icon: '🎓' },
  Work: { bg: 'var(--sun)', icon: '💼' },
}

export default function Journey() {
  const ref = useRef<HTMLOListElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] })
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 28 })
  const [open, setOpen] = useState<number | null>(4)
  return (
    <section id="journey" className="section wrap" aria-labelledby="journey-h">
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <h2 id="journey-h" className="h-section">
            Journey
          </h2>
          <p className="mt-4 max-w-[36ch] text-lg">Finance roots, two years of reporting and dashboards, an analytics master’s, and a research paper. Most recent first; open any step for the detail.</p>
          <ul className="mt-6 flex flex-wrap gap-2 font-mono text-sm">
            {Object.entries(tone).map(([k, v]) => (
              <li key={k} className="brut-sm px-2 py-1 text-[#0a0a0a]" style={{ background: v.bg }}>
                {v.icon} {k}
              </li>
            ))}
          </ul>
        </div>
        <ol ref={ref} className="relative grid gap-5 pl-12">
          <div className="absolute bottom-2 left-[15px] top-2 w-[6px] border-2 border-line bg-surface" aria-hidden="true">
            <motion.div className="w-full origin-top bg-pink" style={{ scaleY: fill, height: '100%' }} />
          </div>
          {journey.map((j, i) => {
            const on = open === i
            return (
              <li key={j.title} className="relative">
                <span className="brut-sm absolute -left-12 top-3 grid h-9 w-9 place-items-center text-base" style={{ background: tone[j.type].bg }} aria-hidden="true">
                  {tone[j.type].icon}
                </span>
                <button
                  onClick={() => setOpen(on ? null : i)}
                  aria-expanded={on}
                  className={`brut press w-full p-4 text-left ${on ? 'on-accent' : ''}`}
                  style={on ? { background: tone[j.type].bg } : undefined}
                >
                  <span className="font-mono text-sm font-bold">
                    {j.when} · {j.type}
                  </span>
                  <span className="mt-1 block font-display text-[1.45rem] font-bold leading-tight tracking-tight">{j.title}</span>
                  {j.where && <span className="mt-1 block font-semibold">{j.where}</span>}
                  <AnimatePresence initial={false}>
                    {on && (
                      <motion.span initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="block overflow-hidden">
                        <span className="block pt-3 text-[16px]">{j.detail}</span>
                        {j.points && (
                          <span className="mt-3 grid gap-2">
                            {j.points.map((pt) => (
                              <span key={pt} className="flex gap-2.5 text-[16px]">
                                <span className="mt-[7px] h-2.5 w-2.5 flex-none border-2 border-current" aria-hidden="true" />
                                {pt}
                              </span>
                            ))}
                          </span>
                        )}
                        {j.tags && (
                          <span className="mt-3 flex flex-wrap gap-1.5">
                            {j.tags.map((t) => (
                              <span key={t} className="border-2 border-current px-2 py-0.5 font-mono text-xs">
                                {t}
                              </span>
                            ))}
                          </span>
                        )}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  <span className="mt-2 block font-mono text-xs opacity-70" aria-hidden="true">{on ? '− less' : '+ more'}</span>
                </button>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}

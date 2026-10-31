import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useSpring, useReducedMotion, type MotionValue } from 'framer-motion'
import { projects, type Project } from '../data/content'
import MiniChart from './MiniChart'
import { RepoCard, RunCell, StatusBadge } from './ProjectBits'
import { accentVar, toast } from '../lib/util'

const featured = projects.filter((p) => p.featured)

function useWide() {
  const [wide, setWide] = useState(() => window.matchMedia('(min-width: 900px)').matches)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 900px)')
    const on = () => setWide(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return wide
}

/** Featured case studies. On wide screens, vertical scroll drives a horizontal track (the "flow"). */
export default function Featured() {
  const reduce = useReducedMotion()
  const wide = useWide()
  const horizontal = wide && !reduce
  const seen = useRef(new Set<string>())
  const fired = useRef(false)
  const markSeen = (id: string) => {
    seen.current.add(id)
    if (!fired.current && seen.current.size === featured.length) {
      fired.current = true
      toast(`Achievement unlocked: you found all ${featured.length} top projects!`)
    }
  }

  return horizontal ? <Horizontal markSeen={markSeen} /> : <Vertical markSeen={markSeen} />
}

function Heading({ compact }: { compact?: boolean }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <h2 className={compact ? 'text-[clamp(2.4rem,4.6vw,4.2rem)]' : 'h-section'}>Top projects</h2>
      <p className="max-w-[42ch] text-lg">
        Five case studies: the problem and what I did. Press <span className="font-mono">▶</span> to run each one and see the results.
      </p>
    </div>
  )
}

function Horizontal({ markSeen }: { markSeen: (id: string) => void }) {
  const target = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const [dist, setDist] = useState(0)
  useEffect(() => {
    const el = track.current!
    const ro = new ResizeObserver(() => setDist(el.scrollWidth - window.innerWidth))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  const { scrollYProgress } = useScroll({ target, offset: ['start start', 'end end'] })
  const smooth = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 })
  const x = useTransform(smooth, [0.04, 0.96], [0, -dist])
  return (
    <section id="featured" ref={target} aria-labelledby="featured-h" style={{ height: `${featured.length * 85 + 40}vh` }} className="relative">
      <div className="sticky top-16 flex h-[calc(100vh-4rem)] flex-col justify-center overflow-hidden py-4">
        <div className="wrap" id="featured-h">
          <Heading compact />
          <Progress p={smooth} />
        </div>
        <motion.div ref={track} style={{ x }} className="mt-6 flex w-max gap-8 pl-[max(2rem,calc((100vw-1240px)/2))] pr-[10vw]">
          {featured.map((p, i) => (
            <Card key={p.id} p={p} i={i} markSeen={markSeen} compact className="w-[min(1080px,84vw)]" />
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function Progress({ p }: { p: MotionValue<number> }) {
  const w = useTransform(p, [0, 1], ['0%', '100%'])
  return (
    <div className="mt-5 flex items-center gap-3 font-mono text-xs" aria-hidden="true">
      <span>scroll ↓ to flow →</span>
      <div className="relative h-3 flex-1 border-2 border-line bg-surface">
        <motion.div className="absolute inset-y-0 left-0 bg-lime" style={{ width: w }} />
      </div>
      <span>{featured.length} projects</span>
    </div>
  )
}

function Vertical({ markSeen }: { markSeen: (id: string) => void }) {
  return (
    <section id="featured" className="section wrap" aria-labelledby="featured-h">
      <div id="featured-h">
        <Heading />
      </div>
      <div className="mt-10 grid gap-10">
        {featured.map((p, i) => (
          <Card key={p.id} p={p} i={i} markSeen={markSeen} />
        ))}
      </div>
    </section>
  )
}

function Card({ p, i, markSeen, compact, className = '' }: { p: Project; i: number; markSeen: (id: string) => void; compact?: boolean; className?: string }) {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && markSeen(p.id), { threshold: 0.55 })
    io.observe(ref.current!)
    return () => io.disconnect()
  }, [p.id, markSeen])
  return (
    <article ref={ref} className={`brut min-w-0 flex-none overflow-hidden ${className}`} aria-labelledby={`f-${p.id}`}>
      <div className="on-accent flex flex-wrap items-center justify-between gap-3 border-b-[3px] border-line px-5 py-3" style={{ background: accentVar[p.accent] }}>
        <StatusBadge p={p} />
        <span className="font-mono text-sm font-bold">{p.categories.join(' · ')}</span>
      </div>
      <div className={`grid gap-6 p-5 lg:grid-cols-[1.35fr_1fr] ${compact ? 'md:px-7 md:py-5' : 'md:p-7'}`}>
        <div className="min-w-0">
          <h3 id={`f-${p.id}`} className="text-[clamp(1.7rem,3vw,2.6rem)] leading-[0.98]">
            {p.short}
          </h3>
          <p className="mt-3 text-lg font-semibold leading-snug">{p.oneLiner}</p>
          <dl className={`grid gap-3 text-[16px] ${compact ? 'mt-3 leading-normal' : 'mt-5 leading-relaxed'}`}>
            <div>
              <dt className="font-mono text-sm font-bold text-pink">problem →</dt>
              <dd>{p.problem}</dd>
            </div>
            <div>
              <dt className="font-mono text-sm font-bold text-pink">what I did →</dt>
              <dd>{p.did}</dd>
            </div>
          </dl>
        </div>
        <div className="flex min-w-0 flex-col gap-4">
          <div className={`brut-sm bg-paper p-3 ${compact ? 'h-[clamp(120px,calc(100vh-720px),240px)] [@media(max-height:760px)]:hidden' : ''}`}>
            <MiniChart kind={p.chart} className={compact ? 'h-full' : ''} />
          </div>
          <RunCell p={p} n={i + 1} />
          {p.repo && <RepoCard name={p.repo} fallback={p.oneLiner} />}
          <div className="flex flex-wrap gap-2">
            {p.links.map((l) => (
              <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" className="brut-sm press bg-ink px-3 py-1.5 font-mono text-sm font-bold text-paper">
                {l.label} ↗
              </a>
            ))}
            {p.tools.slice(0, compact ? 3 : 5).map((t) => (
              <span key={t} className="border-2 border-line px-2 py-1 font-mono text-xs">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </article>
  )
}

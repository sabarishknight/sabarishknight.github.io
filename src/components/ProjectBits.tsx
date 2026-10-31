import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import type { Metric, Project } from '../data/content'
import github from '../data/github.json'
import { SkillIcon } from '../lib/icons'

type Repo = { name: string; description: string | null; url: string; stars: number; forks: number; language: string | null; topics: string[]; pushedAt: string; fork: boolean }
export const repos = github.repos as Repo[]
export const fetchedAt = github.fetchedAt as string | null

export function StatusBadge({ p }: { p: Project }) {
  const bg = p.status === 'In progress' ? 'var(--sun)' : p.status === 'Live' ? 'var(--lime)' : p.status === 'Preprint' ? 'var(--violet)' : 'var(--cyan)'
  return (
    <span className="brut-sm inline-flex items-center gap-1.5 px-2 py-0.5 font-mono text-xs font-bold text-[#0a0a0a]" style={{ background: bg }}>
      {p.status === 'Live' && <span className="h-2 w-2 animate-pulse rounded-full bg-[#0a0a0a]" aria-hidden="true" />}
      {p.status}
      {p.statusNote && <span className="font-medium opacity-80">· {p.statusNote}</span>}
    </span>
  )
}

/** Metric chip; when it has from→to numbers it draws a sparkline between them on hover/focus. */
export function MetricChip({ m }: { m: Metric }) {
  const [on, setOn] = useState(false)
  const has = m.from !== undefined && m.to !== undefined
  const up = has && m.to! > m.from!
  return (
    <li
      tabIndex={has ? 0 : undefined}
      onMouseEnter={() => setOn(true)}
      onMouseLeave={() => setOn(false)}
      onFocus={() => setOn(true)}
      onBlur={() => setOn(false)}
      className="brut-sm flex items-center gap-2 bg-surface px-2.5 py-1.5 font-mono text-[13px] font-medium leading-snug"
    >
      <span>{m.label}</span>
      {has && (
        <svg width="46" height="20" viewBox="0 0 46 20" aria-hidden="true" className="flex-none">
          <motion.path
            d={up ? 'M2 17 C 14 16, 20 12, 26 9 S 38 3, 44 3' : 'M2 3 C 14 4, 20 8, 26 11 S 38 17, 44 17'}
            fill="none"
            stroke={up ? 'var(--pink)' : 'var(--cyan)'}
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ pathLength: 0.15 }}
            animate={{ pathLength: on ? 1 : 0.15 }}
            transition={{ duration: 0.6 }}
          />
          <circle cx={44} cy={up ? 3 : 17} r="3" fill="currentColor" opacity={on ? 1 : 0} />
        </svg>
      )}
    </li>
  )
}

/** Jupyter-style cell: ▶ "executes" and types the real results with a fake progress bar. */
export function RunCell({ p, n }: { p: Project; n: number }) {
  const [state, setState] = useState<'idle' | 'run' | 'done'>('idle')
  const [lines, setLines] = useState<string[]>([])
  const [prog, setProg] = useState(0)
  const timer = useRef<number>()
  const run = () => {
    if (state === 'run') return
    clearTimeout(timer.current)
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setLines(p.runOutput)
      setProg(100)
      return setState('done')
    }
    setState('run')
    setLines([])
    setProg(0)
    let pct = 0
    const bar = () => {
      pct = Math.min(100, pct + 7 + Math.random() * 14)
      setProg(pct)
      if (pct < 100) timer.current = window.setTimeout(bar, 70)
      else typeOut(0, 0, [])
    }
    const typeOut = (li: number, ci: number, acc: string[]) => {
      if (li >= p.runOutput.length) return setState('done')
      const line = p.runOutput[li]
      const next = [...acc.slice(0, li), line.slice(0, ci)]
      setLines(next)
      if (ci < line.length) timer.current = window.setTimeout(() => typeOut(li, ci + 2, acc), 12)
      else timer.current = window.setTimeout(() => typeOut(li + 1, 0, next), 120)
    }
    bar()
  }
  return (
    <div className="brut-sm overflow-hidden bg-surface font-mono text-[13px]">
      <div className="flex items-center gap-2 border-b-[2.5px] border-line px-2 py-1.5">
        <button
          onClick={run}
          className="brut-sm press grid h-7 w-7 place-items-center bg-lime text-[#0a0a0a]"
          aria-label={`Run cell: show results for ${p.short}`}
        >
          {state === 'run' ? '■' : '▶'}
        </button>
        <span className="opacity-80">
          In [{state === 'done' ? n : state === 'run' ? '*' : ' '}]: results("{p.id}")
        </span>
      </div>
      {state !== 'idle' && (
        <div className="px-3 py-2" aria-live="polite">
          <div className="mb-2 h-2.5 w-full border-2 border-line" aria-hidden="true">
            <div className="h-full bg-pink transition-[width] duration-75" style={{ width: `${prog}%` }} />
          </div>
          {lines.map((l, i) => (
            <p key={i} className="whitespace-pre-wrap leading-relaxed">
              <span className="text-pink">›</span> {l}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}

const langColor: Record<string, string> = {
  Python: '#3572A5',
  'Jupyter Notebook': '#DA5B0B',
  HTML: '#e34c26',
  Swift: '#F05138',
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  R: '#198CE7',
}

export function RepoCard({ name, fallback }: { name: string; fallback?: string }) {
  const r = repos.find((x) => x.name.toLowerCase() === name.toLowerCase())
  const url = r?.url ?? `https://github.com/sabarishknight/${name}`
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="brut-sm press block min-w-0 bg-surface p-3">
      <span className="flex items-center gap-2 font-mono text-sm font-bold">
        <SkillIcon name="GitHub" slug="github" size={16} />
        <span className="truncate">sabarishknight/{name}</span>
      </span>
      <span className="mt-1 line-clamp-2 block text-sm opacity-80">{r?.description ?? fallback}</span>
      <span className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs">
        {(r?.language ?? 'Python') && (
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full border-2 border-line" style={{ background: langColor[r?.language ?? 'Python'] ?? '#999' }} />
            {r?.language ?? 'Python'}
          </span>
        )}
        {r && <span>★ {r.stars}</span>}
        {r && <span>⑂ {r.forks}</span>}
        {r && <span>updated {new Date(r.pushedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>}
      </span>
    </a>
  )
}

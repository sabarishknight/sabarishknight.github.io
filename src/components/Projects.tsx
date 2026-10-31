import { useState } from 'react'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { categories, projects, type Project } from '../data/content'
import MiniChart from './MiniChart'
import { RepoCard, RunCell, StatusBadge } from './ProjectBits'
import { accentVar } from '../lib/util'

type Filter = (typeof categories)[number] | 'Top 5'

export default function Projects() {
  // phones skip the Top projects section, so they open on the top 5 here instead
  const [cat, setCat] = useState<Filter>(() => (window.matchMedia('(max-width: 767px)').matches ? 'Top 5' : 'All'))
  const list = cat === 'All' ? projects : cat === 'Top 5' ? projects.filter((p) => p.featured) : projects.filter((p) => p.categories.includes(cat))
  return (
    <section id="projects" className="section wrap" aria-labelledby="projects-h">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 id="projects-h" className="h-section">
          All projects
        </h2>
        <p className="max-w-[40ch] text-lg">Everything I’ve built, with code on GitHub. Filter by area, then run a cell for the results.</p>
      </div>
      <LayoutGroup>
        <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Filter projects by category">
          {(['Top 5', ...categories] as Filter[]).map((c) => {
            const n = c === 'All' ? projects.length : c === 'Top 5' ? projects.filter((p) => p.featured).length : projects.filter((p) => p.categories.includes(c)).length
            const on = c === cat
            return (
              <button
                key={c}
                onClick={() => setCat(c)}
                aria-pressed={on}
                className={`brut-sm press relative px-3 py-2 font-mono text-sm font-semibold ${on ? 'text-[#0a0a0a]' : 'bg-surface'} ${c === 'Top 5' ? 'md:hidden' : ''}`}
              >
                {on && <motion.span layoutId="chip" className="absolute inset-0 bg-pink" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />}
                <span className="relative">
                  {c} <span className="opacity-70">{n}</span>
                </span>
              </button>
            )
          })}
        </div>
        <motion.ul layout className="mt-8 grid gap-6 md:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {list.map((p, i) => (
              <motion.li
                key={p.id}
                layout
                initial={{ opacity: 0, scale: 0.9, rotate: -1.5 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.85, rotate: 2 }}
                transition={{ type: 'spring', stiffness: 260, damping: 26 }}
                className="min-w-0"
              >
                <Card p={p} n={i + 1} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </LayoutGroup>
    </section>
  )
}

function Card({ p, n }: { p: Project; n: number }) {
  return (
    <article className="brut flex h-full flex-col" aria-labelledby={`p-${p.id}`}>
      <div className="relative aspect-[2/1] overflow-hidden border-b-[3px] border-line" style={{ background: accentVar[p.accent] }}>
        <div className="on-accent grid h-full place-items-center px-6 pb-3 pt-12">
          <MiniChart kind={p.chart} className="h-full max-h-[190px]" />
        </div>
        <div className="absolute left-3 top-3">
          <StatusBadge p={p} />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <p className="font-mono text-xs font-bold opacity-80">{p.categories.join(' · ')}</p>
        <h3 id={`p-${p.id}`} className="text-[1.75rem] leading-none">
          {p.short}
        </h3>
        <p className="font-semibold">{p.oneLiner}</p>
        <p className="text-[16px]">
          <span className="font-mono text-sm font-bold text-pink">problem → </span>
          {p.problem}
        </p>
        {p.data && (
          <p className="text-[16px]">
            <span className="font-mono text-sm font-bold text-pink">data → </span>
            {p.data}
          </p>
        )}
        <ul className="flex flex-wrap gap-1.5" aria-label="Tools">
          {p.tools.map((t) => (
            <li key={t} className="border-2 border-line px-2 py-0.5 font-mono text-xs">
              {t}
            </li>
          ))}
        </ul>
        <div className="mt-auto grid gap-3 pt-2">
          <RunCell p={p} n={n} />
          {p.repo && <RepoCard name={p.repo} fallback={p.oneLiner} />}
          {p.links.length > 1 && (
            <div className="flex flex-wrap gap-2">
              {p.links.map((l) => (
                <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" className="brut-sm press bg-ink px-3 py-1.5 font-mono text-sm font-bold text-paper">
                  {l.label} ↗
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  )
}

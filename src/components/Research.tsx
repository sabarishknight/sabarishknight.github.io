import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { bibtex, paper } from '../data/content'
import { SkillIcon } from '../lib/icons'
import { rng, toast } from '../lib/util'

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
}

export default function Research() {
  return (
    <section id="research" className="section invert-block border-y-[3px] border-line bg-paper text-ink" aria-labelledby="research-h">
      <div className="wrap">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="research-h" className="h-section">
            Research
          </h2>
          <p className="max-w-[44ch] text-lg">{paper.lead}</p>
        </div>

        {/* paper card */}
        <motion.article {...reveal} className="brut on-accent mt-10 bg-lime p-6 md:p-9" aria-labelledby="paper-title">
          <p className="font-mono text-sm font-bold">
            {paper.venue} · arXiv:{paper.arxivId} · {paper.subjects} · submitted {paper.submitted}
          </p>
          <h3 id="paper-title" className="mt-3 max-w-[30ch] text-[clamp(1.6rem,3.4vw,2.8rem)] leading-[1.02]">
            {paper.title}
          </h3>
          <ul className="mt-4 flex flex-wrap gap-2">
            {paper.authors.map((a) => (
              <li key={a.name} className={`brut-sm px-3 py-1 font-semibold ${a.me ? 'bg-pink' : 'bg-white'}`}>
                {a.name} <span className="font-mono text-xs font-medium">({a.note})</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            <A href={paper.arxivUrl} bg="#0a0a0a" fg="#fff" icon="arxiv">
              Read on arXiv
            </A>
            <A href={paper.pdfUrl} bg="#fff">
              PDF
            </A>
            <A href={paper.codeUrl} bg="#fff" icon="github">
              Code (MIT)
            </A>
            <A href={`https://doi.org/${paper.doi}`} bg="var(--cyan)">
              DOI {paper.doi}
            </A>
            <CopyBib />
          </div>
        </motion.article>

        {/* headline numbers */}
        <ul className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-5">
          {paper.headline.map((h, i) => (
            <motion.li key={h.label} {...reveal} transition={{ delay: i * 0.07 }} className="brut on-accent p-4" style={{ background: ['var(--pink)', 'var(--cyan)', 'var(--sun)', 'var(--violet)', 'var(--lime)'][i] }}>
              <p className="font-display text-[clamp(2rem,4vw,3rem)] font-extrabold leading-none tracking-tight">{h.value}</p>
              <p className="mt-2 font-mono text-xs font-bold leading-snug">{h.label}</p>
            </motion.li>
          ))}
        </ul>

        {/* the one interactive piece stays open; the rest expands on demand */}
        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          <div>
            <h3 className="text-[clamp(2rem,4.5vw,3.4rem)]">The idea in one slider</h3>
            <p className="mt-4 max-w-[46ch] text-lg">
              Weaken the parts of the image the model leans on most, and watch how much the predicted grade moves. A stable, strong response means the model can be trusted to sharpen its answer; a weak one means it should stay cautious. No retraining, no other patients’ images.
            </p>
            <p className="mt-4 font-mono text-sm opacity-80">Open the boxes below for the method, the full results and the data.</p>
          </div>
          <Playground />
        </div>

        <div className="mt-10 grid gap-4">
          <Box title="Why test-time adaptation breaks in the clinic">
            <div className="grid gap-4 md:grid-cols-3">
              {paper.problem.map((p) => (
                <div key={p.head} className="brut-sm bg-paper p-4">
                  <p className="font-display text-xl font-bold tracking-tight">{p.head}</p>
                  <p className="mt-2 text-[16px]">{p.body}</p>
                </div>
              ))}
            </div>
          </Box>
          <Box title="How CF-NODE works, step by step">
            <ol className="grid gap-3">
              {paper.steps.map((s, i) => (
                <li key={s.name} className="flex items-baseline gap-3">
                  <span className="brut-sm grid h-8 w-8 flex-none place-items-center bg-sun font-mono text-sm font-bold text-[#0a0a0a]" aria-hidden="true">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-display text-xl font-bold tracking-tight">{s.name}</p>
                    <p className="mt-1 text-[16px]">{s.body}</p>
                    <code className="mt-2 inline-block bg-paper px-2 py-1 font-mono text-sm">{s.math}</code>
                  </div>
                </li>
              ))}
            </ol>
          </Box>
          <Box title="Results on five unseen datasets">
            <Results />
            <div className="mt-6">
              <Ablation />
            </div>
          </Box>
          <Box title="Data, setup and limitations">
            <div className="grid gap-6 lg:grid-cols-2">
              <DataTable />
              <div className="grid gap-6">
                <List title="Setup" items={paper.setup} mark="■" />
                <List title="Where it falls short" items={paper.honest} mark="△" />
              </div>
            </div>
          </Box>
          <Box title="Cite this paper (BibTeX)">
            <pre className="overflow-x-auto whitespace-pre bg-paper p-4 font-mono text-[13px]">{bibtex}</pre>
          </Box>
        </div>
      </div>
    </section>
  )
}

function Box({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <details className="brut group bg-surface text-ink">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-display text-[clamp(1.25rem,2.2vw,1.7rem)] font-bold tracking-tight [&::-webkit-details-marker]:hidden">
        {title}
        <span className="brut-sm grid h-9 w-9 flex-none place-items-center bg-lime font-mono text-xl text-[#0a0a0a] transition-transform group-open:rotate-45" aria-hidden="true">
          +
        </span>
      </summary>
      <div className="border-t-[3px] border-line p-5">{children}</div>
    </details>
  )
}

function List({ title, items, mark }: { title: string; items: string[]; mark: string }) {
  return (
    <div>
      <h4 className="text-2xl">{title}</h4>
      <ul className="mt-3 grid gap-2 text-[16px]">
        {items.map((s) => (
          <li key={s} className="flex gap-2">
            <span className="text-pink" aria-hidden="true">
              {mark}
            </span>
            {s}
          </li>
        ))}
      </ul>
    </div>
  )
}

function DataTable() {
  return (
    <div>
      <h4 className="text-2xl">Data</h4>
      <table className="mt-3 w-full text-left text-[15px]">
        <thead className="font-mono text-xs">
          <tr className="border-b-2 border-line">
            <th className="py-1.5 pr-2">Dataset</th>
            <th className="py-1.5 pr-2">Role</th>
            <th className="py-1.5 pr-2 text-right">Images</th>
          </tr>
        </thead>
        <tbody>
          {paper.data.map((d) => (
            <tr key={d.name} className="border-b border-line/30 align-top">
              <td className="py-2 pr-2 font-semibold">
                {d.name}
                {d.note && <span className="block text-xs font-normal opacity-80">{d.note}</span>}
              </td>
              <td className="py-2 pr-2">
                <span className={`px-1.5 font-mono text-xs font-bold text-[#0a0a0a] ${d.role === 'source' ? 'bg-sun' : 'bg-cyan'}`}>{d.role}</span>
              </td>
              <td className="py-2 text-right font-mono tabular-nums">{d.n}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function A({ href, bg, fg = '#0a0a0a', icon, children }: { href: string; bg: string; fg?: string; icon?: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="brut-sm press flex items-center gap-2 px-4 py-2.5 font-display text-lg font-bold" style={{ background: bg, color: fg }}>
      {icon && <SkillIcon name="" slug={icon} size={18} />}
      {children}
    </a>
  )
}

function CopyBib() {
  const [done, setDone] = useState(false)
  return (
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(bibtex)
          setDone(true)
          toast('BibTeX copied')
          setTimeout(() => setDone(false), 2000)
        } catch {
          toast('Copy failed: open "Cite this paper" below')
        }
      }}
      className="brut-sm press bg-pink px-4 py-2.5 font-display text-lg font-bold text-[#0a0a0a]"
    >
      {done ? 'Copied ✓' : 'Copy BibTeX'}
    </button>
  )
}

function Playground() {
  const [lvl, setLvl] = useState(2)
  // simulated node scores (illustration only); 100 nodes like the paper's 10×10 map
  const ranks = useMemo(() => {
    const r = rng(11)
    const s = Array.from({ length: 100 }, (_, i) => {
      const x = i % 10
      const y = Math.floor(i / 10)
      const blob = Math.exp(-((x - 6.5) ** 2 + (y - 3.5) ** 2) / 6) + 0.7 * Math.exp(-((x - 2.5) ** 2 + (y - 7) ** 2) / 4)
      return blob + r() * 0.35
    })
    const order = [...s.keys()].sort((a, b) => s[b] - s[a])
    const rank = new Array(100)
    order.forEach((n, i) => (rank[n] = i))
    return { s, rank }
  }, [])
  const L = paper.levels[lvl]
  const k = L.r === 0 ? 0 : Math.max(Math.floor(L.r * 100), 1)
  return (
    <motion.div {...reveal} className="brut on-accent flex flex-col bg-cyan p-5">
      <h4 className="text-2xl">Intervention playground</h4>
      <p className="mt-1 text-[16px]">Slide through the four intervention levels. The highest-ranked nodes are weakened to the retained magnitude ρ.</p>
      <div className="mt-4 grid grid-cols-10 gap-1 self-center rounded-full border-[3px] border-[#0a0a0a] bg-[#0a0a0a] p-4" style={{ width: 'min(100%, 340px)', aspectRatio: '1' }} aria-hidden="true">
        {ranks.s.map((v, i) => {
          const hit = ranks.rank[i] < k
          return (
            <motion.span
              key={i}
              className="rounded-[3px]"
              animate={{
                opacity: hit ? Math.max(0.12, L.rho) : 0.35 + Math.min(0.65, v),
                scale: hit ? 0.7 : 1,
                backgroundColor: hit ? '#ff3e9a' : '#ffd60a',
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            />
          )
        })}
      </div>
      <label className="mt-5 block font-mono text-sm font-bold" htmlFor="lvl">
        {L.label}: {L.r === 0 ? 'all 100 nodes intact' : `top ${Math.round(L.r * 100)}% (${k} of 100 nodes) kept at ρ = ${L.rho}`}
      </label>
      <input id="lvl" type="range" min={0} max={4} step={1} value={lvl} onChange={(e) => setLvl(+e.target.value)} className="mt-2 w-full accent-[#0a0a0a]" />
      <p className="mt-3 font-mono text-xs">Illustration: node scores here are simulated. Node count and the four (r, ρ) levels match the paper.</p>
    </motion.div>
  )
}

function Results() {
  const [metric, setMetric] = useState<'auc' | 'f1'>('auc')
  const [ds, setDs] = useState(5) // 5 = average
  const data = paper[metric]
  const vals = data.map((row) => row[ds])
  const lo = Math.floor(Math.min(...vals) - 3)
  const hi = Math.ceil(Math.max(...vals) + 1)
  const best = Math.max(...vals)
  const cols = [...paper.datasets, 'Average']
  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <div role="group" aria-label="Metric" className="flex gap-2">
          {(['auc', 'f1'] as const).map((m) => (
            <button key={m} onClick={() => setMetric(m)} aria-pressed={metric === m} className="brut-sm press px-3 py-1.5 font-mono text-sm font-bold aria-pressed:bg-pink aria-pressed:text-[#0a0a0a]">
              {m === 'auc' ? 'AUC' : 'Macro-F1'}
            </button>
          ))}
        </div>
        <div role="group" aria-label="Dataset" className="flex flex-wrap gap-2">
          {cols.map((c, i) => (
            <button key={c} onClick={() => setDs(i)} aria-pressed={ds === i} className="border-2 border-line px-2.5 py-1 font-mono text-xs font-semibold aria-pressed:bg-lime aria-pressed:text-[#0a0a0a]">
              {c}
            </button>
          ))}
        </div>
      </div>
      <ul className="mt-6 grid gap-2.5" aria-label={`${metric === 'auc' ? 'AUC' : 'Macro-F1'} on ${cols[ds]}`}>
        {paper.methods.map((m, i) => {
          const v = vals[i]
          const me = i === paper.methods.length - 1
          return (
            <li key={m} className="grid grid-cols-[7.5rem_1fr] items-center gap-3 md:grid-cols-[11rem_1fr]">
              <span className={`text-right font-mono text-sm ${me ? 'font-extrabold' : ''}`}>{m}</span>
              <div className="relative h-9 border-2 border-line bg-paper">
                <motion.div
                  className="absolute inset-y-0 left-0 border-r-2 border-line"
                  style={{ background: me ? 'var(--pink)' : v === best ? 'var(--lime)' : 'var(--cyan)' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${((v - lo) / (hi - lo)) * 100}%` }}
                  transition={{ type: 'spring', stiffness: 110, damping: 18, delay: i * 0.04 }}
                />
                <span className="absolute inset-y-0 right-2 flex items-center font-mono text-sm font-bold tabular-nums">
                  {v.toFixed(1)}%{v === best ? ' ★' : ''}
                </span>
              </div>
            </li>
          )
        })}
      </ul>
      <p className="mt-4 font-mono text-xs">
        Axis starts at {lo}% to show the gaps. Mean over 5 seeds (Tables II–III). † = classifier-only updates, the stronger configuration in this setting. ★ = best.
      </p>
    </div>
  )
}

function Ablation() {
  const lo = 79
  const hi = 81
  return (
    <div>
      <h4 className="text-2xl">Ablation: does ranking matter?</h4>
      <p className="mt-1 text-[16px]">Same views, prior and checkpoints. Only the node choice changes. Random nodes do nothing; ranked nodes do the work.</p>
      <ul className="mt-4 grid gap-3">
        {paper.ablation.map((a, i) => (
          <li key={a.name}>
            <p className="text-sm font-semibold">{a.name}</p>
            <div className="mt-1 flex items-center gap-2">
              <div className="relative h-6 flex-1 border-2 border-line bg-paper">
                <motion.div
                  className="absolute inset-y-0 left-0"
                  style={{ background: i === 2 ? 'var(--pink)' : 'var(--violet)' }}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${((a.auc - lo) / (hi - lo)) * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ type: 'spring', stiffness: 100, damping: 18, delay: i * 0.1 }}
                />
              </div>
              <span className="w-32 font-mono text-sm tabular-nums">
                AUC {a.auc} · F1 {a.f1}
              </span>
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-3 font-mono text-xs">AUC axis 79–81%. Averages over 5 seeds and 5 domains (Tables IV–V).</p>
    </div>
  )
}

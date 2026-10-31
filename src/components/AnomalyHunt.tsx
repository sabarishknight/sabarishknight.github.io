import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from '../lib/util'

type Pt = { id: number; x: number; y: number; bad: boolean; hit?: 'tp' | 'fp' }

// phones get a narrower, taller chart so points stay tappable
const W = typeof window !== 'undefined' && window.matchMedia('(max-width: 640px)').matches ? 480 : 1000
const H = 360
const MID = H / 2
const SIGMA = 26
const ROUND = 30 // seconds
const SCAN = W * 0.76 // keyboard flags the point nearest this x

/** Arcade game: a live KPI streams by; click the anomalies before they leave the chart. */
export default function AnomalyHunt() {
  const [mode, setMode] = useState<'idle' | 'play' | 'over'>('idle')
  const [, setFrame] = useState(0)
  const pts = useRef<Pt[]>([])
  const score = useRef({ tp: 0, fp: 0, fn: 0 })
  const left = useRef(ROUND)
  const best = useRef<number>(readBest())

  useEffect(() => {
    if (mode !== 'play') return
    let raf = 0
    let last = performance.now()
    let spawn = 0
    let id = 0
    let t = 0
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      t += dt
      left.current = Math.max(0, ROUND - t)
      const speed = (170 + t * 6) * (W / 1000) // ramps up
      spawn -= dt
      if (spawn <= 0) {
        spawn = 0.16
        const bad = Math.random() < 0.09 + t * 0.002
        const base = MID + Math.sin(t * 1.3) * 40 + (Math.random() - 0.5) * SIGMA * 1.6
        // anomalies get subtler as the round goes on: 4.5σ → ~2.8σ
        const jump = (4.5 - Math.min(1.7, t * 0.06)) * SIGMA * (Math.random() < 0.5 ? -1 : 1)
        pts.current.push({ id: id++, x: W + 10, y: bad ? Math.min(H - 14, Math.max(14, base + jump)) : base, bad })
      }
      for (const p of pts.current) p.x -= speed * dt
      pts.current = pts.current.filter((p) => {
        if (p.x > -10) return true
        if (p.bad && !p.hit) score.current.fn++
        return false
      })
      setFrame((f) => f + 1)
      if (left.current <= 0) return end()
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [mode])

  const start = () => {
    pts.current = []
    score.current = { tp: 0, fp: 0, fn: 0 }
    left.current = ROUND
    setMode('play')
  }
  const end = () => {
    // anomalies still on screen and unflagged count as misses
    score.current.fn += pts.current.filter((p) => p.bad && !p.hit).length
    const f = f1(score.current)
    if (f > best.current) {
      best.current = f
      try {
        localStorage.setItem('anomaly-best', String(f))
      } catch {}
      if (f > 0) toast(`New best F1: ${f.toFixed(2)}`)
    }
    setMode('over')
  }
  const flag = (p: Pt) => {
    if (mode !== 'play' || p.hit) return
    p.hit = p.bad ? 'tp' : 'fp'
    score.current[p.hit]++
  }
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key !== ' ' && e.key !== 'Enter') return
    e.preventDefault()
    if (mode !== 'play') return start()
    const near = pts.current.filter((p) => !p.hit && Math.abs(p.x - SCAN) < 40).sort((a, b) => Math.abs(a.x - SCAN) - Math.abs(b.x - SCAN))[0]
    if (near) flag(near)
  }

  const s = score.current
  const precision = s.tp + s.fp ? s.tp / (s.tp + s.fp) : 0
  const recall = s.tp + s.fn ? s.tp / (s.tp + s.fn) : 0
  const bandOpacity = mode === 'play' ? Math.max(0, (left.current - 12) / 18) * 0.5 : 0.5
  const path = pts.current.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')

  return (
    <section id="game" className="section" aria-labelledby="game-h">
      <div className="wrap">
        <div className="brut on-accent grid gap-8 bg-sun p-6 md:p-10 lg:grid-cols-[0.8fr_1.6fr]">
          <div>
            <h2 id="game-h" className="text-[clamp(2.4rem,6vw,4.6rem)]">
              Anomaly Hunt
            </h2>
            <p className="mt-4 text-lg">
              A live KPI streams past. Click every spike or dip before it leaves the chart. Normal noise costs you precision; missed spikes cost you recall.
            </p>
            <p className="mt-3 font-mono text-sm">Keyboard: Space flags the point under the scanner line.</p>
            <div className="mt-6 grid grid-cols-3 gap-3 font-mono">
              <Stat label="time" value={`${Math.ceil(left.current)}s`} />
              <Stat label="caught" value={String(s.tp)} />
              <Stat label="best F1" value={best.current ? best.current.toFixed(2) : '–'} />
            </div>
          </div>

          <div
            className="brut relative overflow-hidden bg-white outline-none"
            tabIndex={0}
            onKeyDown={onKey}
            aria-label="Anomaly Hunt game. Press Space to start, then Space to flag the point under the scanner."
          >
            <div className="flex items-center justify-between border-b-[3px] border-[#0a0a0a] px-4 py-2 font-mono text-xs font-bold">
              <span>orders_per_minute · live</span>
              <span className="flex items-center gap-1.5">
                <span className={`h-2.5 w-2.5 rounded-full ${mode === 'play' ? 'animate-pulse bg-[#e11d48]' : 'bg-[#999]'}`} />
                {mode === 'play' ? 'streaming' : 'paused'}
              </span>
            </div>
            <svg viewBox={`0 0 ${W} ${H}`} className="block w-full touch-manipulation select-none" role="presentation">
              <rect x="0" y={MID - 2 * SIGMA - 40} width={W} height={4 * SIGMA + 80} fill="#22d3ee" opacity={bandOpacity} />
              <line x1="0" x2={W} y1={MID} y2={MID} stroke="#0a0a0a" strokeDasharray="6 8" opacity=".35" />
              <line x1={SCAN} x2={SCAN} y1="0" y2={H} stroke="#ff3e9a" strokeWidth="3" opacity=".55" />
              <path d={path} fill="none" stroke="#0a0a0a" strokeWidth="3" strokeLinejoin="round" />
              {pts.current.map((p) => (
                <g key={p.id} onPointerDown={() => flag(p)} style={{ cursor: mode === 'play' ? 'crosshair' : 'default' }}>
                  <circle cx={p.x} cy={p.y} r="22" fill="transparent" />
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={p.hit ? 13 : p.bad && mode === 'over' ? 11 : 6}
                    fill={p.hit === 'tp' ? '#b8ff3c' : p.hit === 'fp' ? '#ff3e9a' : mode === 'over' && p.bad ? '#ffd60a' : '#0a0a0a'}
                    stroke="#0a0a0a"
                    strokeWidth="3"
                  />
                </g>
              ))}
            </svg>

            {mode !== 'play' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-x-0 bottom-0 top-[38px] grid place-items-center bg-white/85 p-4">
                {mode === 'idle' ? (
                  <button onClick={start} className="brut-sm press bg-[#0a0a0a] px-6 py-4 font-display text-2xl font-extrabold text-lime">
                    ▶ Start a {ROUND}s round
                  </button>
                ) : (
                  <div className="w-full max-w-md text-center">
                    <p className="font-display text-3xl font-extrabold tracking-tight">F1 = {f1(s).toFixed(2)}</p>
                    <div className="mx-auto mt-3 grid max-w-xs grid-cols-2 gap-1.5 font-mono text-sm font-bold" aria-label="Confusion matrix">
                      <Cell bg="#b8ff3c" k="caught (TP)" v={s.tp} />
                      <Cell bg="#ff3e9a" k="false alarm (FP)" v={s.fp} />
                      <Cell bg="#ffd60a" k="missed (FN)" v={s.fn} />
                      <Cell bg="#e5e5e5" k="precision · recall" v={`${pct(precision)} · ${pct(recall)}`} />
                    </div>
                    <p className="mt-3 text-sm">{verdict(precision, recall)}</p>
                    <button onClick={start} className="brut-sm press mt-4 bg-[#0a0a0a] px-5 py-3 font-display text-xl font-extrabold text-lime">
                      ↻ Play again
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

const f1 = (s: { tp: number; fp: number; fn: number }) => (s.tp ? (2 * s.tp) / (2 * s.tp + s.fp + s.fn) : 0)
const pct = (x: number) => `${Math.round(x * 100)}%`

function verdict(p: number, r: number) {
  if (p > 0.8 && r > 0.8) return 'Production-ready detector. Ship it.'
  if (p < 0.5 && r > 0.6) return 'Trigger-happy: you’d page the on-call team all night.'
  if (r < 0.5 && p > 0.6) return 'Careful but slow: real incidents slipped through.'
  return 'Decent baseline. Tune your threshold and try again.'
}

function readBest() {
  try {
    return Number(localStorage.getItem('anomaly-best')) || 0
  } catch {
    return 0
  }
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="brut-sm bg-white px-3 py-2">
      <p className="text-xs font-bold">{label}</p>
      <p className="font-display text-2xl font-extrabold tabular-nums">{value}</p>
    </div>
  )
}

function Cell({ bg, k, v }: { bg: string; k: string; v: number | string }) {
  return (
    <div className="border-[3px] border-[#0a0a0a] px-2 py-1.5" style={{ background: bg }}>
      <p className="text-[11px]">{k}</p>
      <p className="text-lg">{v}</p>
    </div>
  )
}
